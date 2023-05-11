const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const { uuid } = require('uuidv4');
const format = require('pg-format');
require('dotenv').config()

class Project {
    orderedDataByCustomizedKey(jData, orderedData) {
        const newjData = [];
        jData.forEach((item, i) => {
            const temObj = {};
            orderedData.forEach((orderedDataItem, index) => {
                temObj[orderedDataItem] = item[orderedDataItem];
            })
            newjData.push(temObj);
        })
        return newjData;
    }

    getMTTRSqlString(prompts,colName){
        return `  ROUND(
                    (EXTRACT(
                        EPOCH from ("${prompts[1].value}"::timestamp - "${prompts[0].value}"::timestamp)
                    )/86400
                    )::Decimal,2)
                  AS "${colName}" 
            `
    }

    getDateSqlString(func,prompts,colName){
        return ` to_char("${prompts[0].value}",'${func}') AS "${colName}" `
    }

    formulateCalculatedColString(calculatedCols){
        let sqlString = [];
        calculatedCols.forEach(function(e){
            switch(e.key){
                case 'TimeDiffDays':
                    sqlString.push(this.getMTTRSqlString(e.prompts,e.colName))
                    break;
                case 'DayFromDate' :
                    sqlString.push(this.getDateSqlString('day',e.prompts,e.colName))
                    break;
                case 'MonthFromDate':
                    sqlString.push(this.getDateSqlString('month',e.prompts,e.colName))
                    break;
            }
        }.bind(this))
        return sqlString.join(',')+' , '
    }
    

    async createReferenceView(referenceView,referenceTable,calculatedCols){
        let calculatedColString = ''
        if(calculatedCols && calculatedCols.length){
            calculatedColString =  this.formulateCalculatedColString(calculatedCols)
        }
        let sql = ` CREATE VIEW "${process.env.DATA_SCHEMA}"."${referenceView}" 
                        AS SELECT ${calculatedColString} 
                           * FROM "${process.env.DATA_SCHEMA}"."${referenceTable}"
                  `;
        console.log(sql);
        await prisma.$executeRawUnsafe(`${sql}`);
    }

    async createReferenceTable(fastify, referenceTable, configData, data) {
        var rows;
        let columns = configData.filter(e => e.enabled)
        let createSqlString = columns.map(e => {
            if (e.dataType == 'Text') {
                return ` "${e.colName}" VARCHAR `
            } else if (e.dataType == 'Date-Time') {
                return ` "${e.colName}" TIMESTAMP `
            } else if (e.dataType == 'Number') {
                return ` "${e.colName}" FLOAT `
            }
        }).join(',');
        let sql = `create table "${process.env.DATA_SCHEMA}"."${referenceTable}" (
            ${createSqlString}
        )`;
        let columnNames = columns.map(e => e.colName);
        for (const column of columnNames) {
            rows = data.map(obj => {
                obj[column] = column in obj ? obj[column] : null
                return obj
            })
        }
        rows = this.orderedDataByCustomizedKey(data, columnNames);
        rows = rows.map(obj => Object.values(obj));
        columnNames = columnNames.map(e => ` "${e}" `).join(',');
        await prisma.$executeRawUnsafe(`${sql}`);
        let sqlFormat = format(`INSERT INTO "${process.env.DATA_SCHEMA}"."${referenceTable}" (${columnNames}) VALUES %L`, rows);
        await fastify.pg.query(sqlFormat)
    }

    async createDashboardEntry(payload,projectID){
        let data ={
            name:payload.name,
            description: payload.description,
            projectID:projectID,
            configData:{
                "layout" : [],
                "cards" : []
            },
            modifiedBy:payload.modifiedBy
        }
        await prisma.Dashboard.create({
            data: data
        })
    }

    async createProjectEntry(payload,referenceTable,referenceView){
        let data = {
            name: payload.name,
            description: payload.description,
            configData: payload.configData,
            modifiedBy: payload.modifiedBy,
            rowsAnalysed: payload.data.length,
            referenceTable:referenceTable ,
            referenceView: referenceView,
            calculatedColumns:payload.calculatedCols
        }
        let result = await prisma.Project.create({
            data: data
        })
        return result.id;
    }

    async createProject(fastify, req, res) {
        const referenceTable = `Reftable_${uuid()}`;
        const referenceView = `Refview_${uuid()}`;
        await this.createReferenceTable(fastify,referenceTable,req.body.configData,req.body.data);
        await this.createReferenceView(referenceView,referenceTable,req.body.calculatedCols)
        const projectID = await this.createProjectEntry(req.body,referenceTable,referenceView);
        await this.createDashboardEntry(req.body,projectID)
        return {message:"Project Created Successfully"}
    }

    async getProjects(fastify, req, res) {
        const projects = await prisma.Project.findMany({
            select: {
                id: true,
                name: true,
                description: true,
                rowsAnalysed: true,
                modifiedAt: true,
                modifiedBy: true,
            },
            orderBy: [
                {
                    modifiedAt: 'desc',
                }
            ]
        })
        return projects
    }

    async getProjectDetails(fastify, req, res) {
        const projectData = await prisma.Project.findFirst({
            select: {
                configData: true,
                name:true,
                description:true,
                rowsAnalysed:true,
                modifiedAt : true,
                calculatedColumns:true
            },
            where: {
                id: {
                    equals: req.params.id
                }
            }
        })
        return projectData
    }

    async deleteProject(fastify,req,res){
        await prisma.Dashboard.delete({
            where: {
                projectID:req.params.id
            }
        })
        const referenceTable = await  prisma.Project.findFirst({
            where : {
                id:req.params.id
            },
            select :{
                referenceTable:true,
                referenceView:true
            }
        });
        await prisma.$executeRawUnsafe(` DROP VIEW "${process.env.DATA_SCHEMA}"."${referenceTable.referenceView}" `);
        await prisma.$executeRawUnsafe(` DROP TABLE "${process.env.DATA_SCHEMA}"."${referenceTable.referenceTable}" `);
        const project = await prisma.Project.delete({
            where: {
                id: req.params.id
            }
        })
        return project
    }

    async getTableData(fastify,req,res){
        const referenceTable = await  prisma.Project.findFirst({
            where : {
                id:req.params.id
            },
            select :{
                referenceTable:true
            }
        });
        if(!referenceTable){
            throw new Error("Project Does not Exist")
        }
        const data  = await prisma.$queryRawUnsafe( ` SELECT * FROM "${process.env.DATA_SCHEMA}"."${referenceTable.referenceTable}"; `);
        return data;
    }
}
module.exports = Project;
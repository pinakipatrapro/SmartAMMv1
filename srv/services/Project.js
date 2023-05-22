const { PrismaClient } = require('@prisma/client');
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

    getMTTRSqlString(prompts,colName,option){
        if(!option){
            return `  ROUND(
                    (EXTRACT(
                        EPOCH from ("${prompts[1].value}"::timestamp - "${prompts[0].value}"::timestamp)
                    )/86400
                    )::Decimal,2)::FLOAT AS "${colName}" 
                `
        }
        return `  ROUND(
            (EXTRACT(
                EPOCH from ("${prompts[1].value}"::timestamp - "${prompts[0].value}"::timestamp)
            )/3600
            )::Decimal,2)::FLOAT AS "${colName}" 
        `;

    }

    getDateSqlString(func,prompts,colName){
        return ` replace(to_char("${prompts[0].value}",'${func}'),' ','') AS "${colName}" `
    }

    formulateCalculatedColString(calculatedCols){
        let sqlString = [];
        calculatedCols.forEach(function(e){
            switch(e.key){
                case 'TimeDiffDays':
                    sqlString.push(this.getMTTRSqlString(e.prompts,e.colName))
                    break;
                case 'DayFromDate' :
                    sqlString.push(this.getDateSqlString('Day',e.prompts,e.colName))
                    break;
                case 'MonthFromDate':
                    sqlString.push(this.getDateSqlString('Month',e.prompts,e.colName))
                    break;
                case 'dateFromTimestamp':
                    sqlString.push(this.getDateSqlString('YYYY-MM-DD',e.prompts,e.colName))
                    break;
                case 'hourFromTimestamp':
                    sqlString.push(this.getDateSqlString('HH24',e.prompts,e.colName))
                    break;
                case 'TimeDiffHours':
                    sqlString.push(this.getMTTRSqlString(e.prompts,e.colName,'hrs'))
                    break;
                case 'YearMonthFromTimestamp':
                    sqlString.push(this.getDateSqlString('Month-YYYY',e.prompts,e.colName))
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
        let rows = this.orderColumnsAndMapData(data,columnNames);
        await prisma.$executeRawUnsafe(`${sql}`);
        await this.insertBulkData(fastify,rows,columnNames,referenceTable)
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

    orderColumnsAndMapData(data,columnNames){
        let rows;
        for (const column of columnNames) {
            rows = data.map(obj => {
                obj[column] = column in obj ? obj[column] : null
                return obj
            })
        }
        rows = this.orderedDataByCustomizedKey(data, columnNames);
        return rows.map(obj => Object.values(obj));
    }

    async geTableAndViewName(projectID){
        const referenceData = await prisma.Project.findFirst({
            where : {
                id:projectID
            },
            select :{
                referenceTable:true,
                referenceView:true
            }
        });
        return referenceData;
    }

    getColumnNamesSql(tableName){
        return `select column_name
                from information_schema.columns
                where table_name = '${tableName}'
                and table_schema = '${process.env.DATA_SCHEMA}' 
                order by ordinal_position
              `;
    }

    async insertBulkData(fastify,rows,columnNames,referenceTable){
        columnNames = columnNames.map(e => ` "${e}" `).join(',');
        let sqlFormat = format(`INSERT INTO "${process.env.DATA_SCHEMA}"."${referenceTable}" (${columnNames}) VALUES %L`, rows);
        await fastify.pg.query(sqlFormat)
    }


    async editProject(fastify,projectID,data,calculatedCols){
        const {referenceTable,referenceView} = await this.geTableAndViewName(projectID);
        await prisma.$executeRawUnsafe(` DELETE  FROM "${process.env.DATA_SCHEMA}"."${referenceTable}" `);
        await prisma.$executeRawUnsafe(` DROP VIEW IF EXISTS  "${process.env.DATA_SCHEMA}"."${referenceView}" `);
        let sqlString =  this.getColumnNamesSql(referenceTable);
        let colNames = await prisma.$queryRawUnsafe(` ${sqlString} `);
        colNames = colNames.map(e=>e.column_name)
        let rows = this.orderColumnsAndMapData(data,colNames);
        await this.insertBulkData(fastify,rows,colNames,referenceTable)
        await this.createReferenceView(referenceView,referenceTable,calculatedCols)
        await this.updateCalculatedColumns(projectID,calculatedCols)
    }

    async createProject(fastify, req, res) {
        if(!req.body.projectID||req.body.projectID==''){
            const referenceTable = `Reftable_${uuid()}`;
            const referenceView = `Refview_${uuid()}`;
            await this.createReferenceTable(fastify,referenceTable,req.body.configData,req.body.data);
            await this.createReferenceView(referenceView,referenceTable,req.body.calculatedCols)
            const projectID = await this.createProjectEntry(req.body,referenceTable,referenceView);
            await this.createDashboardEntry(req.body,projectID)
            return {message:"Project Created Successfully"}
        }else{
            await this.editProject(fastify,req.body.projectID,req.body.data,req.body.calculatedCols);
            return {message :"Project Edited Successfully"}
        }

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
        const referenceObj = await  this.geTableAndViewName(req.params.id);
        await prisma.$executeRawUnsafe(` DROP VIEW  IF EXISTS "${process.env.DATA_SCHEMA}"."${referenceObj.referenceView}" `);
        await prisma.$executeRawUnsafe(` DROP TABLE IF EXISTS  "${process.env.DATA_SCHEMA}"."${referenceObj.referenceTable}" `);
        const project = await prisma.Project.delete({
            where: {
                id: req.params.id
            }
        })
        return project
    }

    async getTableData(fastify,req,res){
        const referenceView = await  prisma.Project.findFirst({
            where : {
                id:req.params.id
            },
            select :{
                referenceView:true
            }
        });
        if(!referenceView){
            throw new Error("Project Does not Exist")
        }
        const data  = await prisma.$queryRawUnsafe( ` SELECT * FROM "${process.env.DATA_SCHEMA}"."${referenceView.referenceView}"; `);
        return data;
    }

    async updateCalculatedColumns(projectID,calculatedCols){
        await prisma.Project.update({
            where: {
                id: projectID,
            },
            data: {
                calculatedColumns: calculatedCols
            },
        })
    }

    async editCalculatedColumns(fastify,req,res){
        const {referenceTable,referenceView} = await this.geTableAndViewName(req.params.id);
        await prisma.$executeRawUnsafe(` DROP VIEW  IF EXISTS  "${process.env.DATA_SCHEMA}"."${referenceView}" `);
        await this.createReferenceView(referenceView,referenceTable,req.body)
        await this.updateCalculatedColumns(req.params.id,req.body)
        return {message :"Calculated Columns Updated Successfully"}
    }
}
module.exports = Project;
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const { uuid } = require('uuidv4');
const format = require('pg-format');


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

    async createReferenceView(referenceView,referenceTable){
        let sql = ` CREATE VIEW "${referenceView}" AS SELECT * FROM "${referenceTable}" `;
        await prisma.$executeRawUnsafe(`${sql}`);
    }

    async createReferenceTable(fastify, referenceTable, configData, data) {
        var rows;
        let createSqlString = configData.filter(e => e.enabled).map(e => {
            if (e.dataType == 'Text') {
                return ` "${e.colName}" VARCHAR `
            } else if (e.dataType == 'Date-Time') {
                return ` "${e.colName}" TIMESTAMP `
            } else if (e.dataType == 'Number') {
                return ` "${e.colName}" FLOAT `
            }
        }).join(',');
        let sql = `create table "${referenceTable}" (
            ${createSqlString}
        )`;
        let columnNames = configData.map(e => e.colName);
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
        let sqlFormat = format(`INSERT INTO "${referenceTable}" (${columnNames}) VALUES %L`, rows);
        await fastify.pg.query(sqlFormat)
    }

    async createProject(fastify, req, res) {

        let payload = {
            name: req.body['name'],
            description: req.body['description'],
            configData: req.body['configData'],
            modifiedBy: req.body['modifiedBy'],
            rowsAnalysed: req.body.data.length,
            referenceTable: `Reftable_${uuid()}`,
            referenceView: `Refview_${uuid()}`
        }
        let result = await prisma.Project.create({
            data: payload
        })

        await this.createReferenceTable(fastify,payload.referenceTable,payload.configData,req.body.data);
        await this.createReferenceView(payload.referenceView,payload.referenceTable)
        payload ={
            name:req.body['name'],
            description: req.body['description'],
            projectID:result.id,
            configData:{
                "layout" : [],
                "cards" : []
            },
            modifiedBy:req.body['modifiedBy'],
        }
        await prisma.Dashboard.create({
            data: payload
        })
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
                configData: true
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
        try{
            await prisma.Dashboard.delete({
                where: {
                    projectID:req.params.id
                }
            })
        }catch(e){

        }
        const referenceTable = await  prisma.Project.findFirst({
            where : {
                id:req.params.id
            },
            select :{
                referenceTable:true
            }
        });
        await prisma.$executeRawUnsafe(` DROP TABLE "${referenceTable.referenceTable}" `);
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
        const data  = await prisma.$queryRawUnsafe( ` SELECT * FROM "${referenceTable.referenceTable}"; `);
        return data;
    }
}
module.exports = Project;

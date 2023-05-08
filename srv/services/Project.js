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
            referenceView: referenceView
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
        await this.createReferenceView(referenceView,referenceTable)
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
        await prisma.$executeRawUnsafe(` DROP VIEW "${referenceTable.referenceView}" `);
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

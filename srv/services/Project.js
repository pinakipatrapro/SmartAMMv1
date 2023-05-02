const { PrismaClient,Prisma  } = require('@prisma/client');
const prisma = new PrismaClient();
const { uuid } = require('uuidv4');
const format = require('pg-format');


class Project {
    async createReferenceTable(fastify,referenceTable,sampleValues,data){
        let createSqlString = sampleValues.map(e=> ` "${e.field}" ${e.dataType} `).join(',');
        let sql = `create table "${referenceTable}" (
            ${createSqlString}
        )`;
        let columnNames = sampleValues.map(e=> ` "${e.field}" `).join(',');
        let rows = data.map(obj => Object.values(obj));
        await prisma.$executeRawUnsafe(`${sql}`);
        let sqlFormat = format(`INSERT INTO "${referenceTable}" (${columnNames}) VALUES %L`, rows);
        await  fastify.pg.query(sqlFormat)
    }

    async createProject(fastify,req,res){

        let payload = {
            name:req.body['name'],
            description: req.body['description'],
            sampleValues:req.body['sampleValues'],
            modifiedBy:req.body['modifiedBy'],
            rowsAnalysed:req.body.data.length,
            referenceTable:`Reftable_${uuid()}`
        }
        let result = await prisma.Project.create({
            data: payload
        })

        await this.createReferenceTable(fastify,payload.referenceTable,payload.sampleValues,req.body.data)

        return {message:"Project Created Successfully"}
    }
}
module.exports = Project;

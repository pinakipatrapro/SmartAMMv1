const { PrismaClient,Prisma  } = require('@prisma/client');
const prisma = new PrismaClient();
const { uuid } = require('uuidv4');
const format = require('pg-format');


class Project {
    orderedDataByCustomizedKey(jData,orderedData) {
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

    async createReferenceTable(fastify,referenceTable,configData,data){
        var rows;
        let createSqlString = configData.filter(e=> e.enabled).map(e=> {
            if( e.dataType == 'Text'){
                return ` "${e.colName}" VARCHAR `
            }else if(e.dataType == 'Date-Time'){
                return ` "${e.colName}" TIMESTAMP `
            }else if(e.dataType == 'Number'){
                return ` "${e.colName}" FLOAT `
            }
        }).join(',');
        let sql = `create table "${referenceTable}" (
            ${createSqlString}
        )`;
        let columnNames = configData.map(e=> e.colName);
        for (const column of columnNames){
            rows = data.map(obj=>{
                obj[column] = column in obj ? obj[column]: null
                return obj
            }) 
        }
        rows = this.orderedDataByCustomizedKey(data,columnNames);
        rows = rows.map(obj => Object.values(obj));
        columnNames = columnNames.map(e=> ` "${e}" `).join(',');
        await prisma.$executeRawUnsafe(`${sql}`);
        let sqlFormat = format(`INSERT INTO "${referenceTable}" (${columnNames}) VALUES %L`, rows);
        await  fastify.pg.query(sqlFormat)
    }

    async createProject(fastify,req,res){

        let payload = {
            name:req.body['name'],
            description: req.body['description'],
            sampleValues:req.body['configData'],
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

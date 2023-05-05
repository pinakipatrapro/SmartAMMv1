const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const util = require('../utils/Util')
class Pie{
    toObject(data) {
        return JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ));
    }
    async getData(payload){
        const viewName = await util.getViewName(payload.projectID)
        let sqlString = 
            ` SELECT 
                "${payload.colorField}",
                ${payload.aggregationFunction}("${payload.colorField}")
              FROM
                (${util.getSqlString(viewName)}) AS V
                ${util.getFilterString()}
                ${util.getOrderByClauseString()}
              GROUP BY "${payload.colorField}"
            `;
        let  data = await prisma.$queryRawUnsafe( `${sqlString}`);
        data = this.toObject(data)
        return data;
    }
}
module.exports = Pie;
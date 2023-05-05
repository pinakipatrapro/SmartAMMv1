const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const util = require('../utils/Util')
class Bar{
    toObject(data) {
        return JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ));
    }
    getDimensionString(dimensions){
        if(!dimensions.length){
            return ''
        }
        return dimensions.map(e=> ` "${e}" `).join(',')
    }

    getMeasureString(measures,agg){
        if(!measures.length){
            return ''
        }
        return measures.map(e=> ` ${!(agg && agg[e]) ? 'COUNT' : agg[e]}("${e}")`).join(",")
    }

    async getData(payload){
        const viewName = await util.getViewName(payload.projectID)
        let dimensionString =this.getDimensionString([...payload.dimension,...payload.series])
        let measureString = this.getMeasureString(payload.measure,payload.agg)
        let sqlString = 
            ` SELECT 
                ${dimensionString}
                ${payload.measure.length && payload.dimension.length  ? ' , ':''}
                ${measureString}
              FROM
                (${util.getSqlString(viewName)}) AS V
                ${util.getFilterString()}
                ${util.getOrderByClauseString()}
              GROUP BY ${dimensionString}
            `;
        let  data = await prisma.$queryRawUnsafe( `${sqlString}`);
        data = this.toObject(data)
        return data;
    }
}
module.exports = Bar;
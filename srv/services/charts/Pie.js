const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common')

class Pie extends Common{

    async getData(payload){
        const {referenceView,referenceTable} = await this.getViewName(payload.projectID)
        if (!payload.series) {
          payload.series = []
        }
        let dimensionString =this.getDimensionString([...payload.dimension,...payload.series])
        let measureString = this.getMeasureString(payload.measure,payload.agg)
        let sqlString = 
            ` SELECT 
                ${dimensionString}
                ${payload.measure.length && payload.dimension.length  ? ' , ':''}
                ${measureString}
              FROM
                (${this.getSqlString(referenceView)}) AS V
                ${this.getFilterString()}
              GROUP BY ${dimensionString}
                ${await this.getOrderByClauseString(referenceTable,[...payload.dimension,...payload.series])}
            `;
        let  data = await prisma.$queryRawUnsafe( `${sqlString}`);
        return data;
    }
}
module.exports = Pie;
const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common')

class Column extends Common{

    async getData(payload){
        const viewName = await this.getViewName(payload.projectID)
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
                (${this.getSqlString(viewName)}) AS V
                ${this.getFilterString()}
                ${this.getOrderByClauseString()}
              GROUP BY ${dimensionString}
            `;
        let  data = await prisma.$queryRawUnsafe( `${sqlString}`);
        data = this.toObject(data)
        return data;
    }
}
module.exports = Column;
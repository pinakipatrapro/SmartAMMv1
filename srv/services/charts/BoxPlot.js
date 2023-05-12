const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common')

class BoxPlot extends Common {
    async getData(payload) {
        const viewName = await this.getViewName(payload.projectID);
        let sqlString = this.prepareSQLForBoxPlot(viewName,payload.dimension,payload.series,payload.measure);
        console.log(sqlString);
        let rawData = await prisma.$queryRawUnsafe(` ${sqlString} `);
        return rawData

    }

}

module.exports = BoxPlot;
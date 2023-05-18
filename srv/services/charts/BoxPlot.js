const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common')

class BoxPlot extends Common {
    async getData(payload) {
        const {referenceView} = await this.getViewName(payload.projectID);
        let sqlString = this.prepareSQLForBoxPlot(referenceView,payload.dimension,payload.series,payload.measure);
        let rawData = await prisma.$queryRawUnsafe(` ${sqlString} `);
        return rawData
    }

}

module.exports = BoxPlot;
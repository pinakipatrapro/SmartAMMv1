const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const { uuid } = require('uuidv4');
const format = require('pg-format');
require('dotenv').config()

class Home {
    async getSummary(jData, orderedData) {
        
        let projectCount = await prisma.Project.aggregate({
            _count: {
                id: true,
              },
              _sum:{
                rowsAnalysed: true,
              },
        })
        let dashboardCount = await prisma.Dashboard.aggregate({
            _count: {
                id: true,
              },
        })
        let result = {
            projectCount : projectCount["_count"]["id"],
            dashboardCount : dashboardCount["_count"]["id"],
            recordsCount : projectCount["_sum"]["rowsAnalysed"]
        }
        return result;
    }

    
}
module.exports = Home;
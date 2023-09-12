const { PrismaClient } = require('@prisma/client');

class Common{
async getMappingJSONfromDB(projectID) {
   
    const prisma = new PrismaClient();
    try {
        const mappingRecord = await prisma.mappedColumnJSON.findFirst({
            where: {
                projectID,
            },
        });

        if (mappingRecord) {
            const mappingJson = JSON.parse(mappingRecord.jsonMapping[0]);
            return mappingJson;
        } else {
            console.error(`Mapping JSON not found for projectID: ${projectID}`);
            return null; d
        }
    } catch (error) {
        console.error("Error fetching mapping JSON:", error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}
}

module.exports = Common;
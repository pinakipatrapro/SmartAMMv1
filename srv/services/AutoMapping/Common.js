const { PrismaClient } = require('@prisma/client');

class Common{
async getMappingJSONfromDB(projectID) {
    // console.log(`Fetching mapping JSON for projectID: ${projectID}`);
    const prisma = new PrismaClient();
    try {
        const mappingRecord = await prisma.mappedColumnJSON.findFirst({
            where: {
                projectID,
            },
        });

        if (mappingRecord) {
            const mappingJson = JSON.parse(mappingRecord.jsonMapping[0]);
            console.log("Mapping JSON found:", JSON.stringify(mappingJson, null, 2));
            return mappingJson;
        } else {
            console.error(`Mapping JSON not found for projectID: ${projectID}`);
            return null; // Return null or an appropriate value if no mapping is found
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
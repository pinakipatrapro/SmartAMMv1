const { PrismaClient } = require('@prisma/client');
const CalculatedColumns = require("../utils/CalculatedColumns.json");

class CalculatedColumnGenerator {
    // ... (constructor and other methods)

    async getMappingJSONfromDB(projectID) {
        console.log(`Fetching mapping JSON for projectID: ${projectID}`);
        const prisma = new PrismaClient();

        try {
            const mappingRecord = await prisma.mappedColumnJSON.findFirst({
                where: {
                    projectID,
                },
            });

            if (mappingRecord) {
                const mappingJson = JSON.parse(mappingRecord.jsonMapping[0]);
                //console.log("Mapping JSON found:", JSON.stringify(mappingJson, null, 2));
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
    
     createCalculatedcolumnjson(mappingJson, calculatedColumnsJson) {
        const updatedColumns = JSON.parse(JSON.stringify(calculatedColumnsJson)); // Deep copy to avoid modifying the original data
      
        updatedColumns.forEach((column) => {
          column.prompts.forEach((prompt) => {
            const promptId = prompt.id;
            if (mappingJson.hasOwnProperty(promptId)) {
              prompt.value = mappingJson[promptId].match;
            }
          });
        });
      
        return updatedColumns;
      }
    
    
    
    
    
    
    
    
    
    
    // ... (other methods)
}

const generator = new CalculatedColumnGenerator();

async function main() {
    const projectID = "testingProjectID"; // Replace with the actual project ID
    const mappingJson = await generator.getMappingJSONfromDB(projectID);
    console.log("Mapping JSON from DB:", JSON.stringify(mappingJson, null, 2));
    const calculatedColumnJson = generator.createCalculatedcolumnjson(mappingJson, CalculatedColumns);
    console.log(JSON.stringify(calculatedColumnJson, null, 2));
}

main().catch(error => {
    console.error("Main error:", error);
});

module.exports = CalculatedColumnGenerator;

const { PrismaClient } = require('@prisma/client');
const CalculatedColumns = require("../utils/CalculatedColumns.json");
const Common = require('./Common');

class CalculatedColumnGenerator extends Common {
       
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
    
}

const generator = new CalculatedColumnGenerator();

async function main() {
    const projectID = "testingProjectID"; // Replace with the actual project ID
    const mappingJson = await generator.getMappingJSONfromDB(projectID);
    // console.log("Mapping JSON from DB:", JSON.stringify(mappingJson, null, 2));
    const calculatedColumnJson = generator.createCalculatedcolumnjson(mappingJson, CalculatedColumns);
    // console.log(JSON.stringify(calculatedColumnJson, null, 2));
}

main().catch(error => {
    console.error("Main error:", error);
});

module.exports = CalculatedColumnGenerator;

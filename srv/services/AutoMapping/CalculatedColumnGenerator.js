const { uuid } = require('uuidv4');
const Common = require('./Common');

class CalculatedColumnGenerator extends Common {

  createCalculatedcolumnjson(mappingJson, calculatedColumnsJson) {
    const updatedColumns = JSON.parse(JSON.stringify(calculatedColumnsJson)); // Deep copy to avoid modifying the original data

    updatedColumns.forEach((column) => {
      column.id = uuid()
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

module.exports = CalculatedColumnGenerator;

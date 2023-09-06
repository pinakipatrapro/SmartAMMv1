const Common = require("./Common");
const AutoChartsJson = require("../utils/AutoCharts.json");
const { v4: uuidv4 } = require('uuid'); // Import UUID library

class AutoCharting extends Common {
  // Constructor and other methods here...

  // Helper function to update a field in the config object
  updateField(config, fieldName, fieldMapping) {
    if (config[fieldName] && Array.isArray(config[fieldName])) {
      config[fieldName] = config[fieldName].map((field) =>
        fieldMapping[field] ? fieldMapping[field] : field
      );
    }
  }

  modifyAutoChartsJson(projectID, mappingJson, autoChartsJson) {
    // Deep clone the autoChartsJson to avoid modifying the original
    const modifiedAutoChartsJson = JSON.parse(JSON.stringify(autoChartsJson));

    // Generate a UUID for the project
    const projectUUID = uuidv4();

    // Iterate through the 'cards' array in the modifiedAutoChartsJson
    modifiedAutoChartsJson.cards.forEach((card) => {
      // Generate a UUID for the chart if it's null
      if (!card.id) {
        card.id = uuidv4();
      }

      if (card.options && card.options.config) {
        // Check and update the 'dimension' field if present
        if (card.options.config.dimension && mappingJson[card.options.config.dimension]) {
          card.options.config.dimension = [mappingJson[card.options.config.dimension].match];
        }

        // Check and update the 'measure' field if present
        if (card.options.config.measure && mappingJson[card.options.config.measure]) {
          card.options.config.measure = [mappingJson[card.options.config.measure].match];
        }

        // Check and update the 'angleField' field if present
        if (card.options.config.angleField && mappingJson[card.options.config.angleField]) {
          card.options.config.angleField = mappingJson[card.options.config.angleField].match;
        }

        // Check and update the 'colorField' field if present
        if (card.options.config.colorField && mappingJson[card.options.config.colorField]) {
          card.options.config.colorField = mappingJson[card.options.config.colorField].match;
        }

        // Check and update the 'xField' field if present
        if (card.options.config.xField && mappingJson[card.options.config.xField]) {
          card.options.config.xField = mappingJson[card.options.config.xField].match;
        }

        // Check and update the 'yField' field if present
        if (card.options.config.yField && mappingJson[card.options.config.yField]) {
          card.options.config.yField = mappingJson[card.options.config.yField].match;
        }
      }
    });

    // Iterate through the 'layout' array in the modifiedAutoChartsJson
    modifiedAutoChartsJson.layout.forEach((layout, index) => {
      // Generate a UUID for the layout if it's null and match it with the chart's UUID at the same index
      if (!layout.id) {
        layout.id = modifiedAutoChartsJson.cards[index].id;
      }
    });

    // Replace $prjID with the projectID in the modifiedAutoChartsJson
    modifiedAutoChartsJson.cards.forEach((card) => {
      if (typeof card.options.config.projectID === 'string') {
        card.options.config.projectID = projectID;
      }
    });

    return modifiedAutoChartsJson;
  }

  // Other methods here...
}

const generator = new AutoCharting();

async function main() {
  const projectID = "testingProjectID"; // Replace with the actual project ID
  const mappingJson = await generator.getMappingJSONfromDB(projectID);
  const calculatedColumnJson = generator.modifyAutoChartsJson(projectID, mappingJson, AutoChartsJson);
  console.log(JSON.stringify(calculatedColumnJson, null, 2));
}

main().catch(error => {
  console.error("Main error:", error);
});

module.exports = AutoCharting;

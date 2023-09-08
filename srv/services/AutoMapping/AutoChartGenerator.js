const Common = require("./Common");
const AutoChartsJson = require("../utils/AutoCharts.json");
const { v4: uuidv4 } = require('uuid');

class AutoCharting extends Common {

  updateField(config, fieldName, fieldMapping) {
    if (config[fieldName] && Array.isArray(config[fieldName])) {
      config[fieldName] = config[fieldName].map((field) =>
        fieldMapping[field] ? fieldMapping[field] : field
      );
    }
  }

  modifyAutoChartsJson(projectID, mappingJson, autoChartsJson) {

    const modifiedAutoChartsJson = JSON.parse(JSON.stringify(autoChartsJson));

    modifiedAutoChartsJson.cards.forEach((card) => {

      if (!card.id) {
        card.id = uuidv4();
      }

      if (card.options && card.options.config) {
       
        if (card.options.config.dimension && mappingJson[card.options.config.dimension]) {
          card.options.config.dimension = [mappingJson[card.options.config.dimension].match];
        }

   
        if (card.options.config.measure && mappingJson[card.options.config.measure]) {
          card.options.config.measure = [mappingJson[card.options.config.measure].match];
        }

       
        if (card.options.config.angleField && mappingJson[card.options.config.angleField]) {
          card.options.config.angleField = mappingJson[card.options.config.angleField].match;
        }


        if (card.options.config.colorField && mappingJson[card.options.config.colorField]) {
          card.options.config.colorField = mappingJson[card.options.config.colorField].match;
        }


        if (card.options.config.xField && mappingJson[card.options.config.xField]) {
          card.options.config.xField = mappingJson[card.options.config.xField].match;
        }


        if (card.options.config.yField && mappingJson[card.options.config.yField]) {
          card.options.config.yField = mappingJson[card.options.config.yField].match;
        }
      }
    });


    modifiedAutoChartsJson.layout.forEach((layout, index) => {

      if (!layout.id) {
        layout.id = modifiedAutoChartsJson.cards[index].id;
      }
    });

    modifiedAutoChartsJson.cards.forEach((card) => {
      if (typeof card.options.config.projectID === 'string') {
        card.options.config.projectID = projectID;
      }
    });

    return modifiedAutoChartsJson;
  }


}

module.exports = AutoCharting;

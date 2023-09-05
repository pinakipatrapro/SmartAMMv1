const fuzzball = require('fuzzball');
const AutomappingColumnKeywords = require("../utils/AutomappingColumnKeywords.json");
const { PrismaClient } = require('@prisma/client');

class FuzzyMatcher {
    constructor() {
        this.jsonData = AutomappingColumnKeywords;
        this.configData = [
            {
                "colName": "Incident ID",
                "enabled": true,
                "dataType": "Text"
            },
            {
                "colName": "Status",
                "enabled": true,
                "dataType": "Text"
            },
            {
                "colName": "Contact Media",
                "enabled": true,
                "dataType": "Text"
            },
            {
                "colName": "Create date",
                "enabled": true,
                "dataType": "Date-Time"   
            },
            {
                "colName": "End date",
                "enabled": true,
                "dataType": "Date-Time"   
            }
            // Add more columns as needed
        ];
    }

    getFuzzyScores(configData, jsonData) {
        const scores = {};

        try {
            configData.forEach((configItem) => {
                const { colName, dataType } = configItem;
                const fuzzyColumnScores = {};

                jsonData.columns.forEach((column) => {
                    const { name, keywords, type, dataType: columnDataType } = column;
                    if (type === 'Standard') {
                        if (dataType === 'Date-Time' && columnDataType === 'Date-Time') {
                            const score = fuzzball.ratio(colName.toLowerCase(), name.toLowerCase());
                            fuzzyColumnScores[name] = [{ string: name, score }];
                        } else if (dataType === 'Text' && columnDataType === 'Text') {
                            fuzzyColumnScores[name] = fuzzyColumnScores[name] || [];

                            keywords.forEach((keyword) => {
                                const score = fuzzball.ratio(colName.toLowerCase(), keyword.toLowerCase());
                                fuzzyColumnScores[name].push({
                                    string: keyword,
                                    score,
                                });
                            });
                        }
                    }
                });

                if (Object.keys(fuzzyColumnScores).length > 0) {
                    scores[colName] = fuzzyColumnScores;
                }
            });
            
            return scores;
            
        } catch (error) {
            console.error("Error in getFuzzyScores:", error);
            throw error;
        }
    }

    mapGreens(fuzzyScores) {
    const mapping = {};

    this.jsonData.columns.forEach((column) => {
        if (column.type === 'Standard') {
            const { name } = column;
            let bestMatch = null;
            let highestScore = -1;

            for (const colName in fuzzyScores) {
                if (fuzzyScores.hasOwnProperty(colName)) {
                    const columnScores = fuzzyScores[colName];

                    if (columnScores.hasOwnProperty(name)) {
                        const scores = columnScores[name];
                        scores.forEach((scoreObj) => {
                            const score = scoreObj.score;
                            if (score > highestScore) {
                                bestMatch = colName;
                                highestScore = score;
                            }
                        });
                    }
                }
            }

            if (bestMatch !== null) {
                mapping[name] = { match: bestMatch, score: highestScore };
            } else {
                mapping[name] = { match: null, score: -1 }; // Set it to null if no suitable match is found
            }
        }
    });

    // console.log("Mapping JSON:");
    // console.log(mapping); // Log the mapping JSON

    return mapping;
}

    
    
    async storeJsonInDb(ProjectID,mappingJson) {
        const prisma = new PrismaClient();

        try {
            // Hardcode the projectID for now
            const projectID = ProjectID;

            // Convert the mappingJson object to a string before storing it
            const jsonMappingString = JSON.stringify(mappingJson);

            // Use Prisma to create a new record in the MappedColumnJSON table
            const result = await prisma.mappedColumnJSON.create({
                data: {
                    projectID,
                    jsonMapping: [jsonMappingString], // Store as an array of strings
                },
            });

            // console.log(`Mapping JSON stored successfully. ID: ${result.id}`);
        } catch (error) {
            console.error('Error storing mapping JSON:', error);
        } finally {
            await prisma.$disconnect();
        }
    }
}

const fuzzyMatcher = new FuzzyMatcher();

try {
    const scores = fuzzyMatcher.getFuzzyScores(fuzzyMatcher.configData, fuzzyMatcher.jsonData);
    console.log("line 139 ran")
    const mappedJson = fuzzyMatcher.mapGreens(scores);
    fuzzyMatcher.storeJsonInDb("testingProjectID", mappedJson);
    // console.log("Mapping JSON:", JSON.stringify(mappedJson, null, 2)); // Print the mapping JSON
} catch (error) {
    console.error("Main error:", error);
}

module.exports = FuzzyMatcher;

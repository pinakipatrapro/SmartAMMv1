const fuzzball = require('fuzzball');
const AutomappingColumnKeywords = require("../utils/AutomappingColumnKeywords.json");
const { PrismaClient } = require('@prisma/client');

class FuzzyMatcher {
    constructor() {
        this.jsonData = AutomappingColumnKeywords;
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
                            // const score = fuzzball.ratio(colName.toLowerCase(), name.toLowerCase());
                            fuzzyColumnScores[name] = fuzzyColumnScores[name] || [];

                            keywords.forEach((keyword) => {
                                const score = fuzzball.ratio(colName.toLowerCase(), keyword.toLowerCase());
                                fuzzyColumnScores[name].push({
                                    string: keyword,
                                    score,
                                });
                            });
                        } else if (dataType === columnDataType) { // Check data type
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



    mapWithUserCols(fuzzyScores) {

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
                    mapping[name] = { match: null, score: -1 };
                }
            }
        });


        return mapping;
    }

    async storeJsonInDb(ProjectID, mappingJson) {
        const prisma = new PrismaClient();

        try {

            const projectID = ProjectID;

            const jsonMappingString = JSON.stringify(mappingJson);

            const result = await prisma.mappedColumnJSON.create({
                data: {
                    projectID,
                    jsonMapping: [jsonMappingString],
                },
            });
            ;
        } catch (error) {
            console.error('Error storing mapping JSON:', error);
        } finally {
            await prisma.$disconnect();
        }
    }
}

module.exports = FuzzyMatcher;

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common');
const sw = require('stopword');
const pluralize = require('pluralize');

class Bigram extends Common {
    getStopWordsArr(customWords) {
        let arrLang = this.getStopWordsLanguages();
        arrLang = arrLang.map(e => sw[e]).flat();
        if (!customWords) {
            customWords = [];
        } else {
            customWords = customWords.split(',').map(e => e.toLowerCase());
        }

        return [...arrLang, ...customWords];
    }

    async getData(payload) {
        try {

            const { referenceView } = await this.getViewName(payload.projectID);
            const sqlString = this.getBigramWordCloudSql(payload.dimension, referenceView);
            const rawData = await prisma.$queryRawUnsafe(`${sqlString}`);
            if (!rawData || typeof rawData.length === 'undefined') {
                console.error('Raw data is undefined or does not have a length property.');
                return [];
            }
            
            const langArr = this.getStopWordsArr(payload.stopWords);
            const stopWordsSet = new Set(langArr);
            const bigramCounts = {};
            for (let i = 0; i < rawData.length; i++) {
                const row = rawData[i];
                const textFields = Object.values(row);
                for (let k = 0; k < textFields.length; k++) {
                    const text = textFields[k];
                    if (!text) {

                        continue;
                    }
                    const words = text.toLowerCase().split(/[ _#-\/\\]+/);
                    for (let j = 0; j < words.length - 1; j++) {
                        const word1 = words[j].toUpperCase();
                        const word2 = words[j + 1].toUpperCase();
                        if (!stopWordsSet.has(word1.toLowerCase()) && !stopWordsSet.has(word2.toLowerCase())) {
                            const bigram = `_${word1}_${word2}`;
                            if (bigramCounts[bigram]) {
                                bigramCounts[bigram]++;
                            } else {
                                bigramCounts[bigram] = 1;
                            }
                        }
                    }
                }
            }
            Object.keys(bigramCounts).forEach(key => {
                if (key.includes(' ') || key.trim() === '') {
                    delete bigramCounts[key];
                }
            });
            const result = Object.keys(bigramCounts).map(key => ({ word: key, count: bigramCounts[key] }));
            result.sort((a, b) => b.count - a.count);
            return result.slice(0, 100);
        } catch (error) {
            console.error(error);
            return [];
        }
    }

}

module.exports = Bigram;
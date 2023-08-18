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
        try{
            const { referenceView } = await this.getViewName(payload.projectID);
            let sqlString = this.getBigramWordCloudSql(payload.dimension, referenceView);
            let data = await prisma.$queryRawUnsafe(`${sqlString}`);
            if (!data.length) {
                return [];
            }

            let langArr = this.getStopWordsArr(payload.stopWords);
            let stopWordsSet = new Set(langArr);

            let bigramCounts = {};

            for (let i = 0; i < data.length; i++) {
                if (data[i].bigram) {
                    const adjacentWords = data[i].bigram.split(' ');
                    if (adjacentWords.length >= 2) {
                        for (let j = 0; j < adjacentWords.length - 1; j++) {
                            const word1 = adjacentWords[j];
                            const word2 = adjacentWords[j + 1];
                            const bigram = `${word1} ${word2}`;

                            if (word1 && word2 && !stopWordsSet.has(word1.toLowerCase()) && !stopWordsSet.has(word2.toLowerCase())) {
                                if (bigramCounts[bigram]) {
                                    bigramCounts[bigram] += data[i].count;
                                } else {
                                    bigramCounts[bigram] = data[i].count;
                                }
                            }
                        }
                    }
                }
            }

            let result = Object.keys(bigramCounts).map(bigram => ({ word: bigram.toUpperCase(), count: bigramCounts[bigram] }));
            result = this.toObject(result);
            result = result.sort((a, b) => {
                return b.count - a.count;
            });
            result = result.splice(0, 100);            
            return result;

        }catch(err){
            console.log(err)
        }

    }
}

module.exports = Bigram;
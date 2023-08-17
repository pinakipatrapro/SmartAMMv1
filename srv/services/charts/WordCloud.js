const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common');
const sw = require('stopword');
const pluralize = require('pluralize');

class WordCloud extends Common {
    getStopWordsArr(customWords) {
        let arrLang = this.getStopWordsLanguages()
        arrLang = arrLang.map(e => sw[e]).flat();
        if (!customWords) {
            customWords = [];
        } else {
            customWords = customWords.split(",").map(e => e.toLowerCase());
        }

        // Add empty string and "-" to the stop words array
        return [...arrLang, ...customWords, "", "-"];
    }

    async getData(payload) {
        const { referenceView } = await this.getViewName(payload.projectID);
        let sqlString = this.getWordCloudSql(payload.dimension, referenceView);
        let data = await prisma.$queryRawUnsafe(`${sqlString}`);
        if (!data.length) {
            return [];
        }
        let words = data.map(e => e.word.toLowerCase()); // Convert words to lowercase
        let langArr = this.getStopWordsArr(payload.stopWords);

        // Convert words to singular form
        words = words.map(word => pluralize.singular(word));

        let dataWithoutStopWords = sw.removeStopwords(words, langArr);

        // Remove empty strings and "-" from the processed data
        dataWithoutStopWords = dataWithoutStopWords.filter(word => word !== "" && word !== "-");

        // Convert words to lowercase
        dataWithoutStopWords = dataWithoutStopWords.map(word => word.toLowerCase());

        // Merge words with the same lowercase representation and sum their counts
        let mergedData = {};
        for (let i = 0; i < data.length; i++) {
            let word = data[i].word.toLowerCase();
            let count = data[i].count;
            if (mergedData[word]) {
                mergedData[word] += count;
            } else {
                mergedData[word] = count;
            }
        }

        // Convert merged data back to the array format
        data = Object.keys(mergedData).map(word => ({ word: word.toUpperCase(), count: mergedData[word] }));

        let result = data.filter(e => dataWithoutStopWords.indexOf(pluralize.singular(e.word.toLowerCase())) !== -1);

        result = this.toObject(result);
        result = result.sort((a, b) => {
            return b.count - a.count;
        });
        result = result.splice(0, 100);
        return result;
    }
}

module.exports = WordCloud;

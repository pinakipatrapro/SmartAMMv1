const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common');
const sw = require('stopword')

class WordCloud extends Common {
    getStopWordsLangArr(arrLang,customWords){
        if(!arrLang.length){
            arrLang.push('eng')
        }
        arrLang = arrLang.map(e=>sw[e]).flat();
        return [...arrLang,...customWords]
    }
    async getData(payload){
        const viewName = await this.getViewName(payload.projectID)
        let sqlString = this.getWordCloudSql(payload.dimension,viewName)
        let  data = await prisma.$queryRawUnsafe( `${sqlString}`);
        if(!data.length){
            return [];
        }
        let words = data.map(e=>e.word);
        let langArr = this.getStopWordsLangArr(payload.languages,payload.customWords);
        let dataWithoutStopWords = sw.removeStopwords(words,langArr)
        let result = data.filter(e=>dataWithoutStopWords.includes(e.word) )
        result = this.toObject(result)
        //result = result.filter(e=>{return e.count >10})
        return result;
    }

}

module.exports = WordCloud;

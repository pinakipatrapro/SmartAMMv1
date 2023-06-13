const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common');
const sw = require('stopword')

class WordCloud extends Common {
    getStopWordsArr(customWords){
        let arrLang = this.getStopWordsLanguages()
        arrLang = arrLang.map(e=>sw[e]).flat();
        if(!customWords){
            customWords = []  
        }else{
            customWords = customWords.split(",").map(e=>e.toLowerCase())
        }
        
        return [...arrLang,...customWords]
    }
    async getData(payload){
        const {referenceView} = await this.getViewName(payload.projectID)
        let sqlString = this.getWordCloudSql(payload.dimension,referenceView)
        let  data = await prisma.$queryRawUnsafe( `${sqlString}`);
        if(!data.length){
            return [];
        }
        let words = data.map(e=>e.word.toLowerCase());
        let langArr = this.getStopWordsArr(payload.stopWords);
        let dataWithoutStopWords = sw.removeStopwords(words,langArr)
        let result = data.filter(e=>dataWithoutStopWords.indexOf(e.word.toLowerCase()) !== -1 )
        result = this.toObject(result)
        result  =  result.sort((a,b)=>{
            return b.count - a.count
        })
        result = result.splice(0,100)
        return result;
    }

}

module.exports = WordCloud;

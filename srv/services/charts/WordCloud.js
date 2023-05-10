const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
const Common = require('./Common')

class WordCloud extends Common {
    async getData(payload){
        const viewName = await this.getViewName(payload.projectID)
        let sqlString = this.getWordCloudSql(payload.dimension,viewName)
        let  data = await prisma.$queryRawUnsafe( `${sqlString}`);
        let stopWords = this.getStopWords();
        let result = data.filter(e=>!stopWords.includes(e.word) )
        result = this.toObject(result)
        result = result.filter(e=>{return e.count >10})
        return result;
    }

}

module.exports = WordCloud;

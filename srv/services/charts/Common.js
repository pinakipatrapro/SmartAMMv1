const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config()

class Common{
    getSqlString(viewName){
        return ` SELECT * FROM "${process.env.DATA_SCHEMA}"."${viewName}" `
    }

    getStopWords(){
        return ["the", "a", "to", "if", "is", "it", "of", "and", "or", "an", "as", "i", "me", "my", 
        "we", "our", "ours", "you", "your", "yours", "he", "she", "him", "his", "her", "hers", "its", "they", "them", 
        "their", "what", "which", "who", "whom", "this", "that", "am", "are", "was", "were", "be", "been", "being",
        "have", "has", "had", "do", "does", "did", "but", "at", "by", "with", "from", "here", "when", "where", "how",
        "all", "any", "both", "each", "few", "more", "some", "such", "no", "nor", "too", "very", "can", "will", "just"]
    }

    getWordCloudSelectString(dimensions){
        let dimensionString = dimensions.map(e=> ` coalesce("${e}",'') `).join(`|| ' ' ||`)
        return dimensionString
    }

    getWordCloudSql(dimensions,viewName){
        let dimensionString = this.getWordCloudSelectString(dimensions);
        return `
            WITH words AS (
                SELECT unnest(string_to_array(${dimensionString}, ' ')) AS word
                FROM "${process.env.DATA_SCHEMA}"."${viewName}"
            )
            SELECT word, count(*) FROM words
            GROUP BY word
        `
    }
    
    async getViewName(projectID){
        const referenceView = await  prisma.Project.findFirst({
            where : {
                id:projectID
            },
            select :{
                referenceView:true
            }
        });
        return referenceView.referenceView;
    }
    
    getFilterString(){
        return ``;
    }
    
    getOrderByClauseString(){
        return ``;
    }
    
    toObject(data) {
        return JSON.parse(JSON.stringify(data, (key, value) =>
            typeof value === 'bigint'
                ? value.toString()
                : value // return everything else unchanged
        ));
    }
    getDimensionString(dimensions){
        if(!dimensions.length){
            return ''
        }
        return dimensions.map(e=> ` "${e}" `).join(',')
    }
    
    getMeasureString(measures,agg){
        if(!measures.length){
            return ''
        }
        return measures.map(e=> ` ${!(agg && agg[e]) ? 'COUNT' : agg[e]}("${e}") as "${e}" `).join(",")
    }
}
module.exports = Common;
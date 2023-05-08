const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
class Common{
    getSqlString(viewName){
        return ` SELECT * FROM "${viewName}" `
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
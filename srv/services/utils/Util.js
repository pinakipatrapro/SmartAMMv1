const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();

function getSqlString(viewName){
    return ` SELECT * FROM "${viewName}" `
}

async function getViewName(projectID){
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

function getFilterString(){
    return ``;
}

function getOrderByClauseString(){
    return ``;
}
module.exports={
    getSqlString,
    getViewName,
    getFilterString,
    getOrderByClauseString
}
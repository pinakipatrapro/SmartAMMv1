const { PrismaClient, Prisma } = require('@prisma/client');
const prisma = new PrismaClient();
require('dotenv').config()

class Common{
    getSqlString(viewName){
        return ` SELECT * FROM "${process.env.DATA_SCHEMA}"."${viewName}" `
    }

    getStopWordsLanguages(){
        return ['eng','nld','est','fin','fra','deu','ell','hin','ita','jpn','kor','lat','pol','por','porBr','rus','spa','swe','tur','ukr']
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
        return measures.map(e=> ` ROUND(${!(agg && agg[e]) ? 'COUNT' : agg[e]}("${e}")::Decimal,2)::FLOAT as "${e}" `).join(",")
    }

    getPartitionByString(seriesString){
        if(seriesString=='')return '';
        return ` PARTITION BY ${seriesString} `;
    }

    prepareSQLForBoxPlot(viewName,dimensions,series,measure){
        measure = measure[0]
        if(!(series && series.length)){
            series = [];
        }
        let dimensionString = this.getDimensionString([...dimensions,...series]);
        let partitionBySeriesString = this.getPartitionByString(dimensionString);
        let selectString = ` ${dimensions&&dimensions.length ? dimensionString + ' , ': ''} `;
        let groupByString = ` ${dimensionString} `;
        return `WITH raw_data AS (
                   SELECT 
                    ${selectString}
                   "${measure}" as value
                   FROM "${process.env.DATA_SCHEMA}"."${viewName}"
                ),
                details AS (
                    SELECT ${selectString} 
                           value,
                           ROW_NUMBER() OVER ( ${partitionBySeriesString} ORDER BY value) AS row_number,
                           SUM(1) OVER (${partitionBySeriesString}) AS total
                      FROM raw_data
                ),
                quartiles AS (
                    SELECT ${selectString} 
                           value,
                           AVG(CASE WHEN row_number >= (FLOOR(total/2.0)/2.0) 
                                     AND row_number <= (FLOOR(total/2.0)/2.0) + 1 
                                    THEN value/1.0 ELSE NULL END
                               ) OVER (${partitionBySeriesString}) AS q1,
                           AVG(CASE WHEN row_number >= (total/2.0) 
                                     AND row_number <= (total/2.0) + 1 
                                    THEN value/1.0 ELSE NULL END
                               ) OVER (${partitionBySeriesString}) AS median,
                           AVG(CASE WHEN row_number >= (CEIL(total/2.0) + (FLOOR(total/2.0)/2.0))
                                     AND row_number <= (CEIL(total/2.0) + (FLOOR(total/2.0)/2.0) + 1) 
                                    THEN value/1.0 ELSE NULL END
                               ) OVER (${partitionBySeriesString}) AS q3
                     FROM details
                )
                SELECT ${selectString} 
                array_remove(ARRAY_AGG(CASE WHEN value < q1 - ((q3-q1) * 1.5)
                    THEN value
                    WHEN value > q3 + ((q3-q1) * 1.5)
                    THEN value 
                    ELSE NULL END),NULL) AS outliers,
                MIN(CASE WHEN value >= q1 - ((q3-q1) * 1.5) THEN value ELSE NULL END) :: FLOAT AS minimum,
                AVG(q1)  :: FLOAT AS q1,
                AVG(median)  :: FLOAT AS median,
                AVG(q3) :: FLOAT AS q3 ,
                MAX(CASE WHEN value <= q3 + ((q3-q1) * 1.5) THEN value ELSE NULL END)  :: FLOAT AS maximum
                FROM quartiles
                GROUP BY ${groupByString} 
                `;
    }
}
module.exports = Common;
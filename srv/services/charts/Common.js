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
    
    getBigramWordCloudSelectString(dimensions) {
        let dimensionString = dimensions.map(e => ` coalesce("${e}",'') `).join(`|| ' ' ||`);
        return dimensionString;
    }

    getBigramWordCloudSql(dimensions, viewName) {
        let dimensionString = this.getBigramWordCloudSelectString(dimensions);
        return `
            WITH sentences AS (
                SELECT string_agg(${dimensionString}, ' ') AS text
                FROM "${process.env.DATA_SCHEMA}"."${viewName}"
            ),
            words AS (
                SELECT word
                FROM sentences,
                     regexp_split_to_table(text, E'\\s+') AS word
            ),
            bigrams AS (
                SELECT word AS word1, LEAD(word) OVER () AS word2
                FROM words
            )
            SELECT word1 || ' ' || word2 AS bigram, count(*)
            FROM bigrams
            WHERE word2 IS NOT NULL
            GROUP BY word1, word2
        `;
    }
    
    

    async getViewName(projectID){
        const referenceObj = await  prisma.Project.findFirst({
            where : {
                id:projectID
            },
            select :{
                referenceView:true,
                referenceTable:true
            }
        });
        return referenceObj;
    }
    
    getFilterString(){
        return ``;
    }

    getColumnNamesSql(tableName){
        return `select column_name
                from information_schema.columns
                where table_name = '${tableName}'
                and table_schema = '${process.env.DATA_SCHEMA}' 
                order by ordinal_position
              `;
    }

    async getTimestampColumns(tableName,columns){
        let columnString = columns.map(e=> ` '${e}' `).join(',')
        let sqlString = ` SELECT column_name,data_type FROM information_schema.columns WHERE 
                            table_name = '${tableName}' AND column_name in (${columnString})
                            AND data_type like '%timestamp%' `
        let colNames = await prisma.$queryRawUnsafe(` ${sqlString} `);
        colNames = colNames.map(e=> ` "${e.column_name}" `);
        return colNames
    }

    async getCalculatedColumns(tableName){
        let calculatedColumnsJSON = await  prisma.Project.findFirst({
            where : {
                referenceTable:tableName
            },
            select :{
                calculatedColumns:true
            }
        });
        if(!calculatedColumnsJSON){
            return [];
        }
        return calculatedColumnsJSON['calculatedColumns'];
    }

    getOrderByStringForCC(columnArray){
        let orderByArr = [];
        this.calculatedColumns.forEach(function(e){
            if(columnArray.indexOf(e.colName)>-1){
                switch(e.key){
                    case 'DayFromDate' :
                        orderByArr.push( ` CASE
                                            WHEN trim("${e.colName}") = 'Monday' THEN 1
                                            WHEN trim("${e.colName}") = 'Tuesday' THEN 2
                                            WHEN trim("${e.colName}") = 'Wednesday' THEN 3
                                            WHEN trim("${e.colName}") = 'Thursday' THEN 4
                                            WHEN trim("${e.colName}") = 'Friday' THEN 5
                                            WHEN trim("${e.colName}") = 'Saturday' THEN 6
                                            WHEN trim("${e.colName}") = 'Sunday' THEN 7
                                            END 
                                        `);
                        break;
                    case 'MonthFromDate':
                        orderByArr.push( ` to_date("${e.colName}",'Month') `);
                        break;
                    case 'dateFromTimestamp':
                        orderByArr.push( `  to_date("${e.colName}",'YYYY-MM-DD') `)  
                        break;
                    case 'YearMonthFromTimestamp':
                        orderByArr.push( ` to_date("${e.colName}",'Month-YYYY') `);
                        break;
                    default: orderByArr.push(` "${e.colName}" `);
                }
            }
        }.bind(this))
        return orderByArr;
    }

    async getOrderByStringForColumns(tableName,columnArray){
        let timestampColumns =  await this.getTimestampColumns(tableName,columnArray)
        this.calculatedColumns = await this.getCalculatedColumns(tableName)
        let orderByColumns = this.getOrderByStringForCC(columnArray)
        return [...orderByColumns,...timestampColumns]
    }
    
    async getOrderByClauseString(tableName,orderByColumns){
        let orderByStringArr  = await this.getOrderByStringForColumns(tableName,orderByColumns)
        if(orderByStringArr.length){
            orderByStringArr = orderByStringArr.join(',')
            return ` ORDER BY ${orderByStringArr} `;
        }
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
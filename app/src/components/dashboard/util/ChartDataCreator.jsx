import React, { useState, useEffect } from "react";

let data = [{
    "Country": "India",
    "Region": "South",
    "Sales": 7853,
    "Margin": 815,
    "UnitsSold": 97,
    "Date": "5/29/2022"
}, {
    "Country": "India",
    "Region": "South",
    "Sales": 9692,
    "Margin": 744,
    "UnitsSold": 91,
    "Date": "6/10/2022"
}, {
    "Country": "India",
    "Region": "East",
    "Sales": 1134,
    "Margin": 276,
    "UnitsSold": 8,
    "Date": "8/22/2022"
}, {
    "Country": "India",
    "Region": "East",
    "Sales": 4615,
    "Margin": 776,
    "UnitsSold": 34,
    "Date": "9/27/2022"
}, {
    "Country": "Germany",
    "Region": "West",
    "Sales": 4775,
    "Margin": 561,
    "UnitsSold": 75,
    "Date": "6/6/2022"
}, {
    "Country": "India",
    "Region": "West",
    "Sales": 5563,
    "Margin": 155,
    "UnitsSold": 96,
    "Date": "12/21/2022"
}, {
    "Country": "Germany",
    "Region": "West",
    "Sales": 5939,
    "Margin": 353,
    "UnitsSold": 15,
    "Date": "10/23/2022"
}, {
    "Country": "Germany",
    "Region": "West",
    "Sales": 1097,
    "Margin": 721,
    "UnitsSold": 53,
    "Date": "8/11/2022"
}, {
    "Country": "Germany",
    "Region": "South",
    "Sales": 4535,
    "Margin": 335,
    "UnitsSold": 3,
    "Date": "5/1/2023"
}, {
    "Country": "Germany",
    "Region": "North",
    "Sales": 5826,
    "Margin": 758,
    "UnitsSold": 54,
    "Date": "7/13/2022"
}, {
    "Country": "India",
    "Region": "North",
    "Sales": 3044,
    "Margin": 942,
    "UnitsSold": 95,
    "Date": "8/7/2022"
}, {
    "Country": "Germany",
    "Region": "East",
    "Sales": 1521,
    "Margin": 924,
    "UnitsSold": 96,
    "Date": "4/14/2023"
}, {
    "Country": "India",
    "Region": "North",
    "Sales": 3958,
    "Margin": 569,
    "UnitsSold": 43,
    "Date": "7/3/2022"
}, {
    "Country": "Germany",
    "Region": "North",
    "Sales": 3500,
    "Margin": 787,
    "UnitsSold": 5,
    "Date": "9/26/2022"
}, {
    "Country": "Germany",
    "Region": "North",
    "Sales": 4319,
    "Margin": 549,
    "UnitsSold": 21,
    "Date": "5/26/2022"
}, {
    "Country": "India",
    "Region": "South",
    "Sales": 9725,
    "Margin": 185,
    "UnitsSold": 2,
    "Date": "11/27/2022"
}, {
    "Country": "India",
    "Region": "East",
    "Sales": 3250,
    "Margin": 715,
    "UnitsSold": 51,
    "Date": "5/8/2022"
}, {
    "Country": "India",
    "Region": "South",
    "Sales": 1234,
    "Margin": 449,
    "UnitsSold": 50,
    "Date": "12/22/2022"
}, {
    "Country": "India",
    "Region": "West",
    "Sales": 7545,
    "Margin": 106,
    "UnitsSold": 54,
    "Date": "7/17/2022"
}, {
    "Country": "Germany",
    "Region": "West",
    "Sales": 6495,
    "Margin": 247,
    "UnitsSold": 100,
    "Date": "8/21/2022"
}]


let commonProps = {}
const ChartDataCreator = {

    validateChartData: (settings, setSettings) => {
        let commonProps = {
            isGroup: settings.isGroup,
            isStack: settings.isStacked,
            isPercent: settings.isPercent,
            measure:settings.measure,
            dimension:settings.dimension,
            series:settings.series,
            agg:settings.agg
        }
        let configData = chart[settings.chartType](settings, commonProps);
        setSettings(configData)
    }

}

const chart = {
    Bar: (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "Bar",
                config: {
                    data: data,
                    ...commonProps,
                    xField: settings.measure[0],
                    yField: settings.dimension[0],
                    seriesField: !!settings.series ? settings.series[0] : null
                }
            }


        };
        return configValue
    },
    Line: (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "Line",
                config: {
                    data: data,
                    xField: settings.dimension[0],
                    yField: settings.measure[0],
                    seriesField: !!settings.series ? settings.series[0] : null
                }
            }


        };
        return configValue
    },
    Column: (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "Column",
                config: {
                    data: data,
                    ...commonProps,
                    xField: settings.dimension[0],
                    yField: settings.measure[0],
                    seriesField: !!settings.series ? settings.series[0] : null
                }
            }


        };
        return configValue
    },
    Area: (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "Area",
                config: {
                    data: data,
                    ...commonProps,
                    xField: settings.dimension[0],
                    yField: settings.measure[0],
                    seriesField: !!settings.series ? settings.series[0] : null
                }
            }


        };
        return configValue
    }
    ,
    Pie: (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "Pie",
                config: {
                    appendPadding: 10,
                    ...commonProps,
                    data: data,
                    colorField: settings.dimension[0],
                    angleField: settings.measure[0],
                    seriesField: !!settings.series ? settings.series[0] : null,
                    radius: 1,
                    innerRadius: 0.6
                }
            }


        };
        return configValue
    },
    WordCloud: (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "WordCloud",
                config: {
                    ...commonProps,
                    data: data,
                    wordField: settings.dimension[0],
                    colorField: settings.dimension[0],
                    weightField: settings.measure[0],
                    seriesField: !!settings.series ? settings.series[0] : null,
                    radius: 1,
                    innerRadius: 0.6
                }
            }


        };
        return configValue
    }
}


const fetchData = async (settings) => {
    // Axisos Settings push and get data

}






export default ChartDataCreator





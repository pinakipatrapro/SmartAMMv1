import React, { useState, useEffect } from "react";
import axios from "axios"





let commonProps = {}
const ChartDataCreator = {

    validateChartData: async (settings, setSettings,prevSettings) => {
        let commonProps = {
            isGroup: settings.isGroup,
            isStack: settings.isStacked,
            isPercent: settings.isPercent,
            measure:settings.measure,
            dimension:settings.dimension,
            series:settings.series,
            agg:settings.agg,
            projectID : prevSettings.options.config.projectID
        }
        
        let configData = await chart[settings.chartType](settings, commonProps);
        setSettings(configData)
    }

}

const getData = async(settings)=>{
    let res = await axios.post("/api/getChartData",settings);
    return res.data
}

const chart = {
    Bar: async (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "Bar",
                config: {
                    ...commonProps,
                    xField: settings.measure[0],
                    yField: settings.dimension[0],
                    seriesField: !!settings.series ? settings.series[0] : null
                }
            }
        };
        configValue.options.config.data =await getData(configValue)
        return configValue
    },
    // Line: (settings, commonProps) => {
    //     let configValue = {
    //         title: settings.chartTitle,
    //         type: "chart",
    //         options: {
    //             metrics: [],
    //             chartType: "Line",
    //             config: {
    //                 data: data,
    //                 xField: settings.dimension[0],
    //                 yField: settings.measure[0],
    //                 seriesField: !!settings.series ? settings.series[0] : null
    //             }
    //         }


    //     };
    //     return configValue
    // },
    // Column: (settings, commonProps) => {
    //     let configValue = {
    //         title: settings.chartTitle,
    //         type: "chart",
    //         options: {
    //             metrics: [],
    //             chartType: "Column",
    //             config: {
    //                 data: data,
    //                 ...commonProps,
    //                 xField: settings.dimension[0],
    //                 yField: settings.measure[0],
    //                 seriesField: !!settings.series ? settings.series[0] : null
    //             }
    //         }


    //     };
    //     return configValue
    // },
    // Area: (settings, commonProps) => {
    //     let configValue = {
    //         title: settings.chartTitle,
    //         type: "chart",
    //         options: {
    //             metrics: [],
    //             chartType: "Area",
    //             config: {
    //                 data: data,
    //                 ...commonProps,
    //                 xField: settings.dimension[0],
    //                 yField: settings.measure[0],
    //                 seriesField: !!settings.series ? settings.series[0] : null
    //             }
    //         }


    //     };
    //     return configValue
    // }
    // ,
    // Pie: (settings, commonProps) => {
    //     let configValue = {
    //         title: settings.chartTitle,
    //         type: "chart",
    //         options: {
    //             metrics: [],
    //             chartType: "Pie",
    //             config: {
    //                 appendPadding: 10,
    //                 ...commonProps,
    //                 data: data,
    //                 colorField: settings.dimension[0],
    //                 angleField: settings.measure[0],
    //                 seriesField: !!settings.series ? settings.series[0] : null,
    //                 radius: 1,
    //                 innerRadius: 0.6
    //             }
    //         }


    //     };
    //     return configValue
    // },
    // WordCloud: (settings, commonProps) => {
    //     let configValue = {
    //         title: settings.chartTitle,
    //         type: "chart",
    //         options: {
    //             metrics: [],
    //             chartType: "WordCloud",
    //             config: {
    //                 ...commonProps,
    //                 data: data,
    //                 wordField: settings.dimension[0],
    //                 colorField: settings.dimension[0],
    //                 weightField: settings.measure[0],
    //                 seriesField: !!settings.series ? settings.series[0] : null,
    //                 radius: 1,
    //                 innerRadius: 0.6
    //             }
    //         }


    //     };
    //     return configValue
    // }
}


const fetchData = async (settings) => {
    // Axisos Settings push and get data

}






export default ChartDataCreator





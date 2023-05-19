import React, { useState, useEffect } from "react";
import axios from "axios"




let commonProps = {}
const ChartDataCreator = {

    validateChartData: async (settings, setSettings, prevSettings) => {
        let commonProps = {
            isGroup: settings.isGroup,
            isStack: settings.isStack,
            isPercent: settings.isPercent,
            measure: settings.measure,
            dimension: settings.dimension,
            series: settings.series,
            agg: settings.agg,
            projectID: prevSettings.options.config.projectID,
            xAxis: {
                label: {
                    autoRotate: true
                },
                title: {
                    text: settings.dimension[0]
                }
            },
            yAxis: {
                label: {
                    autoRotate: true
                },
                title: {
                    text: settings.measure[0]
                }
            }
        }


        let configData = await chart[settings.chartType](settings, commonProps);


        configData.id = prevSettings.id

        setSettings(configData)
    }

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
                    ...commonProps,
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
                    wordField: "word",
                    colorField: "word",
                    weightField: "count",
                    customWords: [],
                    seriesField: !!settings.series ? settings.series[0] : null,
                    wordStyle: {
                        rotation: 0
                    },
                }
            }


        };
        return configValue
    },
    Box: (settings, commonProps) => {
        let configValue = {
            title: settings.chartTitle,
            type: "chart",
            options: {
                metrics: [],
                chartType: "Box",
                config: {
                    ...commonProps,
                    xField: settings.dimension[0],
                    yField: ['minimum', 'q1', 'median', 'q3', 'maximum'],
                    // groupField: !!settings.series ? settings.series[0] : null,
                }
            }


        };
        return configValue
    },
}









export default ChartDataCreator





import React, { useState, useEffect } from "react";
import axios from "axios"
import pptxgen from "pptxgenjs";


const chartColors = [
    '#5B8FF9',
    '#5AD8A6',
    '#5D7092',
    '#F6BD16',
    '#6F5EF9',
    '#6DC8EC',
    '#945FB9',
    '#FF9845',
    '#1E9493',
    '#FF99C3'
]

const chartCommonProperties = {
    x: "5%", y: "7%", w: "80%", h: "75%",
    chartColorsOpacity: 80, showLegend: true,
    showValue: true,
    dataLabelFontSize: 8,
    dataLabelPosition: "bestFit",
    catGridLine: { color: "D8D8D8", style: "dash", size: 1, cap: "round" },
    valGridLine: { color: "D8D8D8", style: "dash", size: 1, cap: "square" }
}

let pptx = new pptxgen();

const PPTGen = {

    generatePDF: async (dashboardDetails) => {

        pptx = new pptxgen();
        pptx.author = 'SmartAMM';
        pptx.company = 'T-Systems';
        pptx.revision = '1';
        pptx.subject = 'SmartAMM Report';
        pptx.title = 'SmartAMM Report';
        pptx.layout = 'LAYOUT_16x9';

        let footerLogo = { x: "3%", y: "95%", w: "20%", h: "4%", path: "/assets/ppt/logo-foot.png" }


        // Header Slide
        let slide = pptx.addSlide();
        slide.addImage({ x: 0, y: 0, w: "100%", h: "100%", path: "/assets/ppt/bg.png" })
        slide.addImage(footerLogo)
        slide.addImage({ x: "3%", y: "0%", w: "75%", h: "80%", path: "/assets/ppt/banner.png" })
        slide.addText("SmarTAMM Report - " + dashboardDetails.project.name, { x: "5%", y: "40%", w: "35%", color: "#ffffff", fontSize: 32, fontFace: "TeleGrotesk Next Ultra (Headings)" });
        slide.addText(`Report Generated on ${new Date().toString().substring(0, 25)}`, { x: "5%", y: "60%", w: "35%", color: "#ffffff", fontSize: 14, fontFace: "TeleGrotesk Next" });

        //Filter for Chart Ordering in PPT Download
        dashboardDetails.configData.layout.forEach(e=>{
            dashboardDetails.configData.cards.find(f=>{
                return f.id == e.id;
            }).layoutPosition = e.x+(e.y*10)
        })

        let sortedCards =  dashboardDetails.configData.cards.sort((a, b) => {
            return a.layoutPosition - b.layoutPosition;
        });

        sortedCards.forEach(card => {
            //Slide #1
            let slide = pptx.addSlide();
            slide.addImage(footerLogo)

            slide.addText(card.title,
                { x: "3%", y: "5%", w: "95%", color: "#E20074", fontSize: 20, fontFace: "TeleGrotesk Next Ultra (Headings)" }
            );
            try {
                chartGenerator[card.options.chartType](slide, card)
            } catch (error) {
                console.log('Error Generating Chart')
            }


        })





        pptx.writeFile();

    }

}

const chartGenerator = {
    Bar: (slide, card) => {
        let data = dataFormatter(card);
        // let catAxisOrientation;
        // if( card?.options?.config?.sorter.length){
        //     catAxisOrientation = card.options.config.sortAscending ? "maxMin": "minMax"
        // }
        slide.addChart(pptx.ChartType.bar, data, {
            ...chartCommonProperties,
            barDir: "bar",
            barGrouping: card.options.config.isStack ? 'stacked' : 'clustered',
            chartColors: chartColors.slice(0, data.length),
            catAxisOrientation: "maxMin"//catAxisOrientation || "minMax",
        });
    },
    Pie: (slide, card) => {
        let data = dataFormatter(card)
        slide.addChart(pptx.ChartType.doughnut, data, {
            ...chartCommonProperties,
            chartColors: chartColors
        });
    },
    Line: (slide, card) => {
        let data = dataFormatter(card)
        slide.addChart(pptx.ChartType.line, data, {
            ...chartCommonProperties,
            chartColors: chartColors
        });
    },
    Area: (slide, card) => {
        let data = dataFormatter(card)
        slide.addChart(pptx.ChartType.area, data, {
            ...chartCommonProperties,
            chartColors: chartColors
        });
    },
    Column: (slide, card) => {
        let data = dataFormatter(card)
        slide.addChart(pptx.ChartType.bar, data, {
            ...chartCommonProperties,
            barDir: "col",
            barGrouping: card.options.config.isStack ? 'stacked' : 'clustered',
            chartColors: card.options.config.series.length ? chartColors :  [chartColors[0]]
        });
    },
    WordCloud: (slide, card) => {
        let canvasImage = document.getElementById(card.id + '--chart').children[1].children[0].children[0].children[0].children[0].toDataURL()
        slide.addImage({ ...chartCommonProperties, data: canvasImage })

    },
    Box: (slide, card) => {
        let canvasImage = document.getElementById(card.id + '--chart').children[1].children[0].children[0].children[0].children[0].toDataURL()
        slide.addImage({ ...chartCommonProperties, data: canvasImage })

    },
    Bigram: (slide, card) => {
        let canvasImage = document.getElementById(card.id + '--chart').children[1].children[0].children[0].children[0].children[0].toDataURL()
        slide.addImage({ ...chartCommonProperties, data: canvasImage })

    },
}

const dataFormatter = (card) => {
    let data = [];

    if (!!card.options.config.series.length) {
        let seriesValues = [...new Set(card.options.config.data.map(e => { return e[card.options.config.series[0]] }))];
        card.options.config.measure.forEach(mes => {
            seriesValues.forEach(seriesVal => {
                let chartSeries = {};
                chartSeries.name = String(seriesVal)
                chartSeries.labels = card.options.config.data.filter(dataPoint => {
                    return dataPoint[card.options.config.series[0]] == seriesVal
                }).map(dataPoint => {
                    return dataPoint[card.options.config.dimension[0]]
                })


                chartSeries.values = card.options.config.data.filter(dataPoint => {
                    return dataPoint[card.options.config.series[0]] == seriesVal
                }).map(dataPoint => {
                    return dataPoint[mes]
                })

                data.push(chartSeries)
            })


        })

    } else {

        card.options.config.measure.forEach(mes => {
            let chartSeries = {};
            chartSeries.name = `${mes} `
            chartSeries.labels = card.options.config.data.map(dataPoint => {
                return dataPoint[card.options.config.dimension[0]]
            })
            chartSeries.values = card.options.config.data.map(dataPoint => {
                return dataPoint[mes]
            })
            data.push(chartSeries)

        })
    }
    return data
}










export default PPTGen





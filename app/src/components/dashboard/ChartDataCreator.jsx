import React, { useState, useEffect } from "react";



const ChartDataCreator = {

    validateChartData: (settings) => {
        chart[settings.chartType](settings)
    },
    chart: {
        line: () => {

        }
    }

}

const chart = {
    Bar: (settings) => {
        let configValue = {
            // data: data.reverse(),
            isStack: true,
            xField: settings.measure[0],
            yField: settings.dimension[0],
            seriesField: settings.series.length?settings.series[0]:null
        };
        return configValue
    }
}


const  fetchData = async (settings)=>{
    // Axisos Settings push and get data

}



export default ChartDataCreator





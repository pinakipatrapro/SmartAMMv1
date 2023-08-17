
class Chart {
    async getChartData(fastify,req,res){
        if(req.body.type == 'chart'){
            switch(req.body.options.chartType){
                case "Bar":
                    const Bar = require('./charts/Bar');
                    const objBar = new Bar();
                    return objBar.getData(req.body.options.config)
                break;
                case "Pie":
                    const Pie = require('./charts/Pie');
                    const objPie = new Pie();
                    return objPie.getData(req.body.options.config)
                break;
                case "Line":
                    const Line = require('./charts/Line');
                    const objLine = new Line();
                    return objLine.getData(req.body.options.config)
                break;
                case "Column":
                    const Column = require('./charts/Column');
                    const objColumn = new Column();
                    return objColumn.getData(req.body.options.config)
                break;
                case "Area":
                    const Area = require('./charts/Area');
                    const objArea = new Area();
                    return objArea.getData(req.body.options.config)
                break;
                case "Scatter":
                    const Scatter = require('./charts/Scatter');
                    const objScatter = new Scatter();
                    return objScatter.getData(req.body.options.config)
                break;
                case "WordCloud":
                    const WordCloud = require('./charts/WordCloud');
                    const objWordCloud = new WordCloud();
                    return objWordCloud.getData(req.body.options.config)
                break;
                case "Box":
                    const BoxPlot = require('./charts/BoxPlot');
                    const objBoxPlot = new BoxPlot();
                    return objBoxPlot.getData(req.body.options.config)
                break;
                case "Bigram":
                    const Bigram = require('./charts/Bigram'); 
                    const objBigram = new Bigram(); 
                    return objBigram.getData(req.body.options.config);
                break;              
                default: throw new Error("Chart Type does not Exist!!!")
            }
        }

    }
}

module.exports = Chart;
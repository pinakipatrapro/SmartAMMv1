const Chart = require("../services/Chart");

async function routes(fastify, options){
    fastify.post('/getChartData', async function(req, res) {
        try{
            let objChart = new Chart();
            let result = await objChart.getChartData(fastify,req,res);
            return result
        }catch(error){
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })
}

module.exports = routes
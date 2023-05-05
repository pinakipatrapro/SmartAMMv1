const Dashboard = require("../services/Dashboard");

async function routes(fastify, options){
    fastify.post('/createDashboard', async function(req, res) {
        try{
            let objDashboard = new Dashboard();
            let result = await objDashboard.createDashboard(fastify,req,res);
            return result
        }catch(error){
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })
    fastify.get('/getDashboards', async function(req, res) {
        try{
            let objDashboard = new Dashboard();
            let result = await objDashboard.getDashboards(fastify,req,res);
            return result
        }catch(error){
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })
    fastify.get('/getDashboardDetails/:id', async function(req, res) {
        try{
            let objDashboard = new Dashboard();
            if(!req.params.id){
                throw Error("Please pass Dashboard ID as paramter")
            }
            let result = await objDashboard.getDashboardDetails(fastify,req,res);
            return result
        }catch(error){
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })

    fastify.get('/deleteDashboard/:id', async function(req, res) {
        try{
            let objDashboard = new Dashboard();
            if(!req.params.id){
                throw Error("Please pass Dashboard ID as paramter")
            }
            let result = await objDashboard.deleteDashboard(fastify,req,res);
            return result
        }catch(error){
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })


    fastify.post('/updateDashboardConfig/:id', async function(req, res) {
        try{
            let objDashboard = new Dashboard();
            if(!req.params.id || !req.body){
                throw Error("Missing Dashboard ID or Body Parameters")
            }
            let result = await objDashboard.updateDashboardConfig(fastify,req,res);
            return result
        }catch(error){
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })
}

module.exports = routes
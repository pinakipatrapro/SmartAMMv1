const Project = require("../services/Project");

async function routes(fastify, options){
    fastify.post('/createProject', async function(req, res) {
        try{
            let objProject = new Project();
            let result = await objProject.createProject(fastify,req,res);
            return result
        }catch(error){
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })

}

module.exports = routes
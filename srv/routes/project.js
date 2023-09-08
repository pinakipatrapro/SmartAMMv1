const Project = require("../services/Project");

async function routes(fastify, options) {
    fastify.post('/createProject', async function (req, res) {
        try {
            let objProject = new Project();
            let result = await objProject.createProject(fastify, req, res);
            return result
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })
    fastify.get('/getProjects', async function (req, res) {
        try {
            let objProject = new Project();
            let result = await objProject.getProjects(fastify, req, res);
            return result
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })
    fastify.get('/getProjectDetails/:id', async function (req, res) {
        try {
            let objProject = new Project();
            if (!req.params.id) {
                throw Error("Please pass Project ID as parameter")
            }
            let result = await objProject.getProjectDetails(fastify, req, res);
            return result
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })

    fastify.get('/deleteProject/:id', async function (req, res) {
        try {
            let objProject = new Project();
            if (!req.params.id) {
                throw Error("Please pass Project ID as parameter")
            }
            let result = await objProject.deleteProject(fastify, req, res);
            return result
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })

    fastify.get('/getTableData/:id', async function (req, res) {
        try {
            let objProject = new Project();
            if (!req.params.id) {
                throw Error("Please pass Project ID as parameter")
            }
            let result = await objProject.getTableData(fastify, req, res);
            return result
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })

    fastify.post('/editCalculatedColumns/:id', async function (req, res) {
        try {
            let objProject = new Project();
            let result = await objProject.editCalculatedColumns(fastify, req, res);
            return result
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })
}

module.exports = routes
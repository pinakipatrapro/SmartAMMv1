const Home = require("../services/Home");

async function routes(fastify, options) {
    fastify.get('/home', async function (req, res) {
        try {
            let objHome = new Home();
            let result = await objHome.getSummary(fastify, req, res);
            return result
        } catch (error) {
            console.log(error)
            res.status(error.status || 500).send(error);
        }
    })

}

module.exports = routes
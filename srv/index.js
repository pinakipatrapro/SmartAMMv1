const Fastify = require('fastify')
const path = require('path')
const autoload = require('@fastify/autoload')

require('dotenv').config()

const fastify = Fastify({
    logger: true,
    bodyLimit: 30 * 1024 * 1024 *1024
})


fastify.register(autoload, {
    dir: path.join(__dirname, 'routes')
})


fastify.register(require('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL
})

async function createSchema(){
    await fastify.pg.query(`CREATE SCHEMA IF NOT EXISTS "${process.env.DATA_SCHEMA}"`)
}

fastify.listen({ port: process.env.PORT }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    createSchema()
})
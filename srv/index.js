const Fastify = require('fastify')
const path = require('path')
const autoload = require('@fastify/autoload')



require('dotenv').config()

const fastify = Fastify({
    logger: true,
    bodyLimit: 30 * 1024 * 1024 * 1024
})


const authenticate = { realm: 'SmarTAMM' }

fastify.register(require('@fastify/basic-auth'), { validate, authenticate })
function validate(username, password, req, reply, done) {
    if (username === process.env.API_USER && password === process.env.API_PASS) {
        done()
    } else {
        done(new Error('Winter is coming'))
    }
}

fastify.register(autoload, {
    dir: path.join(__dirname, 'routes')
})


fastify.register(require('@fastify/postgres'), {
    connectionString: process.env.DATABASE_URL
})




async function createSchema() {
    await fastify.pg.query(`CREATE SCHEMA IF NOT EXISTS "${process.env.DATA_SCHEMA}"`)
}

fastify.listen({ port: process.env.PORT }, function (err, address) {
    if (err) {
        fastify.log.error(err)
        process.exit(1)
    }
    BigInt.prototype['toJSON'] = function () {
        return parseInt(this.toString());
    };
    createSchema()
})


fastify.after(() => {
    fastify.addHook('onRequest', fastify.basicAuth)
})
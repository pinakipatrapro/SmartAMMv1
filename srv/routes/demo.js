async function routes(fastify, options){
    fastify.get('/demo', async function(request, reply) {
         return {hello: 'world'} 
    }), 

    fastify.get('/bye', async function(request, reply) {
        let result  = await  fastify.pg.query(
            'SELECT * FROM "SubAccounts"')
            return result.rows
    }) 
}

module.exports = routes
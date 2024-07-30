const { app } = require('@azure/functions');
const { connectToDatabase } = require('../db/sqlserver/index');
const sqlQueries = require('../sql/sqlQueries');

app.http('get-developer-byId', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'get-developer-byId/{id}',

    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const id = request.params.id;

        try {
            const pool = await connectToDatabase();
                
            const result = await pool.request()
            .input('developer_id', id)
            .query(sqlQueries.getDeveoperById);
        
             context.log('Query result:', result.recordset);
        
            context.res = {
              status: 200,
              body: JSON.stringify({
                status: 200,
                data: result.recordset
              })
            };
        } catch (err) {
            context.res = {
              status: 500,
              body: 'Error executing query'
            };
            context.error('Query err:', err);
        }
        return context.res;
    }
});

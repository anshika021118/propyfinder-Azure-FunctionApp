const { app } = require('@azure/functions');
const { connectToDatabase } = require('../db/sqlserver/index');
const sqlQueries = require('../sql/sqlQueries');

app.http('get-property-by-developerId', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'get-property-by-developerId/{id}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // const name = request.query.get('name') || await request.text() || 'world';

        const id = request.params.id;

        try {
            const pool = await connectToDatabase();
        
            const result = await pool.request()
            .input('developer_id', id)
            .query(sqlQueries.getPropertyByDeveloperId);
        
            // context.log('Query result:', result.recordset);
        
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

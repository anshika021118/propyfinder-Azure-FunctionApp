const { app } = require('@azure/functions');
const { connectToDatabase } = require('../db/sqlserver/index');


app.http('get-image-byPropertyId', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'get-image-byPropertyId/{id}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const id = request.params.id;

        try {
            const pool = await connectToDatabase();
        
            const queryString = 'SELECT * FROM image where property_id = @property_id';
        
            const result = await pool.request()
            .input('property_id', id)
            .query(queryString);
        
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

const { app } = require('@azure/functions');
const { connectToDatabase } = require('../db/sqlserver/index');
const sqlQueries = require('../sql/sqlQueries');




app.http('get-property-byCity', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'get-property-byCity/{city}',

    handler: async (request, context) => {
        const city = `%${request.params.city}%`;


        try {

            const pool = await connectToDatabase();
                
            const result = await pool.request()
            .input('city', city)
            .query(sqlQueries.getPropertyByCity);
        
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

const { app } = require('@azure/functions');
const { connectToDatabase } = require('../db/sqlserver/index');
const sqlQueries = require('../sql/sqlQueries');


app.http('get-propertyDetail-byId', {
    methods: ['GET'],
    authLevel: 'anonymous',
    route: 'get-propertyDetail-byId/{id}',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        // const name = request.query.get('name') || await request.text() || 'world';

        // return { body: `Hello, ${name}!` };
        const id = request.params.id;

        try {
            const pool = await connectToDatabase();
        
            const queryString = 'select d.developer_name,p.* from property p left join developer d on p.developer_id = d.developer_id where p.property_id =@property_id';
        
            const result = await pool.request()
            .input('property_id', id)
            .query(sqlQueries.getPropertyById);
        
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

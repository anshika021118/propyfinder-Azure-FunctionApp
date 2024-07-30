const { app } = require('@azure/functions');
const { connectToDatabase } = require('../db/sqlserver/index');
const NodeCache = require('node-cache');


const cache = new NodeCache({ stdTTL: 18000 });

app.http('get-property-detail', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);
        const cacheKey = 'property-detail';

        try {

               // Check if the data is in the cache
               const cachedData = cache.get(cacheKey);
               if (cachedData) {
                   context.log('Cache hit');
                   context.res = {
                       status: 200,
                       body: JSON.stringify({
                           status: 200,
                           data: cachedData
                       })
                   };
                   return context.res;
               }
            const pool = await connectToDatabase();
        
            const queryString = 'select d.developer_name,p.* from property p left join developer d on p.developer_id = d.developer_id';
        
            const result = await pool.request().query(queryString);
        
            context.log('Query result:', result.recordset.length);
            
            const data = result.recordset;
            cache.set(cacheKey, data);

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
            context.error('Query error:', err);
        }
        return context.res;

    }
});

const { app } = require('@azure/functions');
const { connectToDatabase } = require('../db/sqlserver/index');
const sqlQueries = require('../sql/sqlQueries')
const NodeCache = require('node-cache');

// Initialize node-cache
const cache = new NodeCache({ stdTTL: 18000 }); // Cache TTL (Time to Live) is 1 hour


app.http('get-launch-property', {
    methods: ['GET'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log(`Http function processed request for url "${request.url}"`);

        const cacheKey = 'launch-property';

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
            // If not in cache, query the SQL database
            const pool = await connectToDatabase();
        
        
            const result = await pool.request().query(sqlQueries.getLaunchProperty);
        
            //context.log('Query result:', result.recordset);
            const data = result.recordset;

         // Store the data in cache
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
            context.error('Query err:', err);
        }
        return context.res;

    }
});

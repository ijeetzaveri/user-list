import app from "./app";

import envConfig from "./config/env.config";
import connectDB from "./config/db";

/**
 * Start Express server.
 */
app.listen(envConfig.port, () => {
  console.log(`
=================================================================
  
Server started on port ${envConfig.port} | ${envConfig.env}
  
=================================================================
  `);
  connectDB();
});

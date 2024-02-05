import express from "express";
import ViteExpress from "vite-express";
import app from "./server/app.js"

/* this is used to proxy the API request to avoid CORS issues */
/* however, this server is only used in development. */
/* it uses ViteExpress to serve the Vue app and API proxy for testing, by importing the middleware from server/app.js */
/* as a result, both servers are synced so no manual copy pasting is required */

const server = express();
server.use(app);

ViteExpress.config({ mode: "development" })

ViteExpress.listen(server, 3000, () => console.log("Server is listening at http://localhost:3000..."));
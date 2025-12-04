const app = require("./config/express");
const db = require("./database/sqlite");
const cors = require("cors");

app.use(cors({
    origin: 'http://localhost:3000',
    credentials: true
}));

db.init();

const routes = require("./routes");
const errorHandler = require("./middleware/errorHandler");

app.use("/api", routes);
app.use(errorHandler);

module.exports = app;

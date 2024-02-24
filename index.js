const app = require('./app.js');
const mySqlDatabaseInterface = require('./MySqlDatabaseInterface');
require('dotenv').config();

// Create DB-Connection
const mysqlConnectionParams = {
    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
};
const db = new mySqlDatabaseInterface(mysqlConnectionParams);

function startServer() {
    // Start application
    const port = process.env.PORT || 3000;
    app(db).listen(port, () => {
        db.connect().then(() => console.log('DB connected'));
        console.log(`Server is running on port ${port}`);
    });
}

startServer();

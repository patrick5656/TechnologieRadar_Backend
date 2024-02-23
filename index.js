const app = require('./app.js');
const mySqlDatabaseInterface = require('./MySqlDatabaseInterface');

// Create DB-Connection
const mysqlConnectionParams = {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'dbuser',
    password: process.env.PASSWORD || 'weblab24',
    database: process.env.DATABASE || 'technology_radar',
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

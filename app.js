const express = require('express');
const bodyParser = require('body-parser');
const server = express();
const cors = require("cors");

server.use(bodyParser.json());
server.use(cors());

const { validateTechnologyInsertInput, validateTechnologyUpdateInput, validateTechnologyUpdateRing} = require("./TechnologyValidator");
const mySqlDatabaseInterface = require('./MySqlDatabaseInterface');

// Create DB-Connection
const mysqlConnectionParams = {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'dbuser',
    password: process.env.PASSWORD || 'weblab24',
    database: process.env.DATABASE || 'technology_radar',
};
const db = new mySqlDatabaseInterface(mysqlConnectionParams);
db.connect().then(() => console.log('DB connected'));

// Start application
const port = process.env.PORT || 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});

// Close DB-Connection on close
process.on('exit', () => {
    db.disconnect().then(() => console.log('DB connection closed'));
});


// Endpoint definitions
server.get('/api/test', (req, res) => {
    res.json({ message: 'Everything works fine!' });
});

server.post('/api/technology', async (req, res) => {
    try {
        // validate and get input
        const { name, category, ring, description, ring_description } = req.body;
        const input = { name, category, ring, description, ring_description }
        if (!validateTechnologyInsertInput(input)) {
            res.status(400).json({ error: 'Invalid Input' });
            return;
        }
        const currentDate = new Date();
        const created_by_user_id = 1;
        const published = false;
        const technologyJson = { name, category, ring, description, ring_description, published, created_by_user_id, created_at: currentDate };
        db.insertTechnology(technologyJson).then(
            (insertedId) => {
                res.status(201).json({ message: 'Technology inserted successfully' });
                technologyJson.technology_id = insertedId
                db.insertTechnologyChangeEntryCreated(technologyJson);
            }

        );
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


server.put('/api/technology/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const { name, category, description } = req.body;
        const input = { name, category, description }
        if (!validateTechnologyUpdateInput(input)) {
            res.status(400).json({ error: 'Invalid Input' });
            return;
        }
        const last_updated_by_user_id = 1;
        const technologyJson = { id, name, category, description, last_updated_by_user_id };

        await db.updateTechnology(technologyJson);
        res.status(200).json({ message: 'Technology updated successfully' });
        await db.insertTechnologyChangeEntryUpdate(technologyJson);

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.put('/api/technology/:id/ring', async (req, res) => {
    try {
        const id = req.params.id;
        const { ring, ring_description } = req.body;
        const validateInput = {ring, ring_description};
        if (!validateTechnologyUpdateRing(validateInput)) {
            res.status(400).json({ error: 'Invalid Input' });
            return;
        }
        const last_updated_by_user_id = 1;
        const technologyJson = { id, ring, ring_description, last_updated_by_user_id };

        await db.updateTechnologyRing(technologyJson);
        res.status(200).json({ message: 'Technology ring updated successfully' });
        await db.insertTechnologyChangeEntryUpdateRing(technologyJson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.put('/api/technology/:id/publish', async (req, res) => {
    try {
        const id = req.params.id;
        const { ring, ring_description } = req.body;
        const validateInput = {ring, ring_description};
        if (!validateTechnologyUpdateRing(validateInput)) {
            res.status(400).json({ error: 'Invalid Input' });
            return;
        }

        const last_updated_by_user_id = 1;
        const technologyJson = { id, ring, ring_description, last_updated_by_user_id };

        await db.publishTechnology(technologyJson);
        res.status(200).json({ message: 'Technology published successfully' });
        await db.insertTechnologyChangeEntryPublish(technologyJson);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

server.get('/api/technology/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const technology = await db.readTechnologyById(id);
        res.status(200).json(technology);
    } catch (error) {
        if (error.message === 'No technology found with the given ID') {
            res.status(404).json({ error: error.message });
        } else {
            res.status(500).json({ error: error.message });
        }
    }
});


server.get('/api/technologies', async (req, res) => {
    try {
        const { name, published, ring, category } = req.query;
        const filter = { name, published, ring, category };
        const technologies = await db.readTechnologies(filter);

        res.status(200).json(JSON.parse(JSON.stringify(technologies)));
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});




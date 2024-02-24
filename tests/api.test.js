const sinon = require('sinon');
const request = require('supertest');
const createApp = require('../app');
const mySqlDatabaseInterface = require('../MySqlDatabaseInterface');

// Create DB-Connection
const mysqlConnectionParams = {
    host: process.env.HOST || 'localhost',
    user: process.env.USER || 'dbuser',
    password: process.env.PASSWORD || 'weblab24',
    database: process.env.DATABASE || 'technology_radar',
};
const db = new mySqlDatabaseInterface(mysqlConnectionParams);
const app = createApp(db);

describe('GET /api/test', () => {
    it('responds with 200', (done) => {
        request(app).get('/api/test').expect(200, done);
    });
});

describe('POST /api/technology', () => {
    let insertTechnologyStub;
    let insertTechnologyChangeEntryCreatedStub;

    beforeEach(() => {
        insertTechnologyStub = sinon.stub(db, 'insertTechnology');
        insertTechnologyChangeEntryCreatedStub = sinon.stub(db, 'insertTechnologyChangeEntryCreated');
    });

    afterEach(() => {
        insertTechnologyStub.restore();
        insertTechnologyChangeEntryCreatedStub.restore();
    });

    it('responds with 201', (done) => {
        const insertedId = 1;

        insertTechnologyStub.callsFake((technologyJson) => {
            expect(technologyJson.name).toBe('Angular');
            expect(technologyJson.category).toBe('Techniques');
            expect(technologyJson.ring).toBe('Adopt');
            expect(technologyJson.description).toBe('Neu');
            expect(technologyJson.ring_description).toBe('Test');
            return Promise.resolve(insertedId);
        });

        request(app)
            .post('/api/technology')
            .send({
                name: 'Angular',
                category: 'Techniques',
                ring: 'Adopt',
                description: 'Neu',
                ring_description: 'Test'
            })
            .expect(201)
            .end((err) => {
                if (err) return done(err);
                sinon.assert.calledOnce(insertTechnologyChangeEntryCreatedStub);
                done();
            });
    });

    it('responds with 400 when wrong category input', (done) => {
        request(app)
            .post('/api/technology')
            .send({
                name: 'Angular',
                category: 'Wrong_Category',
                ring: 'Adopt',
                description: 'Neu',
                ring_description: 'Test'
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('responds with 400 when wrong ring input', (done) => {
        request(app)
            .post('/api/technology')
            .send({
                name: 'Angular',
                category: 'Techniques',
                ring: 'Wrong ring',
                description: 'Neu',
                ring_description: 'Test'
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('responds with 400 when wrong name input', (done) => {
        request(app)
            .post('/api/technology')
            .send({
                name: '',
                category: 'Techniques',
                ring: 'Trial',
                description: 'Neu',
                ring_description: 'Test'
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('responds with 400 when wrong description input', (done) => {
        request(app)
            .post('/api/technology')
            .send({
                name: 'test technology',
                category: 'Techniques',
                ring: 'Trial',
                description: '',
                ring_description: 'Test'
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('PUT /api/technology', () => {
    let updateTechnology;
    let insertTechnologyChangeEntryUpdate;

    beforeEach(() => {
        updateTechnology = sinon.stub(db, 'updateTechnology');
        insertTechnologyChangeEntryUpdate = sinon.stub(db, 'insertTechnologyChangeEntryUpdate');
    });

    afterEach(() => {
        updateTechnology.restore();
        insertTechnologyChangeEntryUpdate.restore();
    });

    it('responds with 200 after successful update', (done) => {
        updateTechnology.callsFake((technologyJson) => {
            expect(technologyJson.id).toBe('1');
            expect(technologyJson.name).toBe('Angular');
            expect(technologyJson.category).toBe('Techniques');
            expect(technologyJson.description).toBe('Neu');
            expect(technologyJson.last_updated_by_user_id).toBe(1);
        });

        request(app)
            .put('/api/technology/1')
            .send({
                name: 'Angular',
                category: 'Techniques',
                description: 'Neu',
            })
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                sinon.assert.calledOnce(insertTechnologyChangeEntryUpdate);
                done();
            });
    });

    it('responds with 400 when wrong name input', (done) => {
        request(app)
            .put('/api/technology/1')
            .send({
                name: '',
                category: 'Techniques',
                description: 'Neu',
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });


    it('responds with 400 when wrong category input', (done) => {
        request(app)
            .put('/api/technology/1')
            .send({
                name: 'Angular',
                category: '',
                description: 'Neu',
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

    it('responds with 400 when wrong description input', (done) => {
        request(app)
            .put('/api/technology/1')
            .send({
                name: 'Angular',
                category: '',
                description: null,
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

});


describe('PUT /api/technology/1/ring', () => {
    let updateTechnologyRing;
    let insertTechnologyChangeEntryUpdateRing;

    beforeEach(() => {
        updateTechnologyRing = sinon.stub(db, 'updateTechnologyRing');
        insertTechnologyChangeEntryUpdateRing = sinon.stub(db, 'insertTechnologyChangeEntryUpdateRing');
    });

    afterEach(() => {
        updateTechnologyRing.restore();
        insertTechnologyChangeEntryUpdateRing.restore();
    });

    it('responds with 200 after successful ring update', (done) => {
        updateTechnologyRing.callsFake((technologyJson) => {
            expect(technologyJson.id).toBe('1');
            expect(technologyJson.ring).toBe('Trial');
            expect(technologyJson.ring_description).toBe('New description');
            expect(technologyJson.last_updated_by_user_id).toBe(1);
        });

        request(app)
            .put('/api/technology/1/ring')
            .send({
                ring: 'Trial',
                ring_description: 'New description',
            })
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                sinon.assert.calledOnce(insertTechnologyChangeEntryUpdateRing);
                done();
            });
    });

    it('responds with 400 when wrong ring input', (done) => {
        request(app)
            .put('/api/technology/1/ring')
            .send({
                ring: null,
                ring_description: 'New description',
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });


    it('responds with 400 when wrong ring description input', (done) => {
        request(app)
            .put('/api/technology/1/ring')
            .send({
                ring: 'Adopt',
                ring_description: '',
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });
});

describe('PUT /api/technology/1/publish', () => {
    let publishTechnology;
    let insertTechnologyChangeEntryPublish;

    beforeEach(() => {
        publishTechnology = sinon.stub(db, 'publishTechnology');
        insertTechnologyChangeEntryPublish = sinon.stub(db, 'insertTechnologyChangeEntryPublish');
    });

    afterEach(() => {
        publishTechnology.restore();
        insertTechnologyChangeEntryPublish.restore();
    });

    it('responds with 200 after successful ring update', (done) => {
        publishTechnology.callsFake((technologyJson) => {
            expect(technologyJson.id).toBe('1');
            expect(technologyJson.ring).toBe('Trial');
            expect(technologyJson.ring_description).toBe('New description');
            expect(technologyJson.last_updated_by_user_id).toBe(1);
        });

        request(app)
            .put('/api/technology/1/publish')
            .send({
                ring: 'Trial',
                ring_description: 'New description',
            })
            .expect(200)
            .end((err) => {
                if (err) return done(err);
                sinon.assert.calledOnce(insertTechnologyChangeEntryPublish);
                done();
            });
    });

    it('responds with 400 when wrong ring input', (done) => {
        request(app)
            .put('/api/technology/1/publish')
            .send({
                ring: null,
                ring_description: 'New description',
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });


    it('responds with 400 when wrong ring description input', (done) => {
        request(app)
            .put('/api/technology/1/publish')
            .send({
                ring: 'Adopt',
                ring_description: '',
            })
            .expect(400)
            .end((err) => {
                if (err) return done(err);
                done();
            });
    });

});

describe('GET /api/technology', () => {
    let readTechnologyById;

    beforeEach(() => {
        readTechnologyById = sinon.stub(db, 'readTechnologyById');
    });

    afterEach(() => {
        readTechnologyById.restore();
    });

    it('responds with 200 when technology was found', (done) => {
        const expectedResponse = {
            id: 1,
            name: 'Angular',
            category: 'Techniques',
            description: 'description',
            ring: null,
            ring_description: null,
            published: false,
            created_by_user_id: 1,
            created_at: new Date(),
            published_at: null,
            last_updated: null,
            last_updated_by_user_id: null
        };


        readTechnologyById.callsFake((id) => {
            if (id === '1') {
                return Promise.resolve(expectedResponse);
            }
            else {
                return Promise.reject(new Error('No technology found with the given ID'));
            }
        });

        request(app)
            .get('/api/technology/1')
            .expect(200)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.id).toEqual(expectedResponse.id);
                expect(res.body.name).toEqual(expectedResponse.name);
                expect(res.body.category).toEqual(expectedResponse.category);
                expect(res.body.description).toEqual(expectedResponse.description);
                expect(res.body.ring).toEqual(expectedResponse.ring);
                expect(res.body.ring_description).toEqual(expectedResponse.ring_description);
                expect(res.body.published).toEqual(expectedResponse.published);
                expect(res.body.created_by_user_id).toEqual(expectedResponse.created_by_user_id);
                expect(new Date(res.body.created_at)).toEqual(expectedResponse.created_at);
                expect(res.body.published_at).toEqual(expectedResponse.published_at);
                expect(res.body.last_updated).toEqual(expectedResponse.last_updated);
                expect(res.body.last_updated_by_user_id).toEqual(expectedResponse.last_updated_by_user_id);

                done();
            });
    });

    it('responds with 404 when technology was not found', (done) => {
        readTechnologyById.callsFake((id) => {
            if (id === '1') {
                return Promise.resolve({});
            } else {
                return Promise.reject(new Error('No technology found with the given ID'));
            }
        });

        request(app)
            .get('/api/technology/2')
            .expect(404)
            .end((err, res) => {
                if (err) return done(err);
                expect(res.body.error).toBe('No technology found with the given ID');
                done();
            });
    });
});

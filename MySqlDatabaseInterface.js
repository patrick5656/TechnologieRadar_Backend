const mysql = require('mysql');

class DatabaseInterface {
    constructor(connectionParams) {
        this.connectionParams = connectionParams;
    }

    async connect() {
        this.connection = mysql.createConnection(this.connectionParams);
        await new Promise((resolve) => {
            this.connection.connect(function(err) {
                if (err) throw err;
                else resolve();
            });
        })
    }

    async disconnect() {
        await new Promise((resolve, reject) => {
            this.connection.end((err) => {
                if (err) reject(err);
                else resolve();
            });
        });
    }

    async insertTechnology(technologyJson) {
        try {
            const { name, category, ring, description, ring_description, published, created_by_user_id, created_at } = technologyJson;
            const sql = 'INSERT INTO Technology (name, category, ring, description, ring_description, published, created_by_user_id, created_at, last_updated_by_user_id) ' +
                'VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)';
            await this.connection.query(sql, [name, category, ring, description, ring_description, published, created_by_user_id, created_at, created_by_user_id]);
        } catch (error) {
            throw new Error('Failed to insert technology');
        }
    }

    async updateTechnology(technologyJson) {
        try {
            const {id, name, category, description, last_updated_by_user_id } = technologyJson;
            const sql = 'UPDATE Technology SET name=?, category=?, description=?, last_updated_by_user_id=?, last_updated=NOW() WHERE id=?';
            await this.connection.query(sql, [name, category, description, last_updated_by_user_id, id]);
        } catch (error) {
            throw new Error('Failed to update technology.');
        }
    }

    async updateTechnologyRing(technologyJson) {
        try {
            const { id, ring, ring_description, last_updated_by_user_id } = technologyJson;
            const sql = 'UPDATE Technology SET ring=?, ring_description=?, last_updated_by_user_id=?, last_updated=NOW() WHERE id=?';
            await this.connection.query(sql, [ring, ring_description, last_updated_by_user_id, id]);
        } catch (error) {
            throw new Error('Failed to update technology ring.');
        }
    }

    async publishTechnology(technologyJson) {
        try {
            const { ring, ring_description, last_updated_by_user_id } = technologyJson;
            const sql = 'UPDATE Technology SET published=?, ring=?, ring_description=?, last_updated_by_user_id=?, published_at=NOW() ,last_updated=NOW() WHERE id=?';
            await this.connection.query(sql, [true, ring, ring_description, last_updated_by_user_id, technologyJson.id]);
        } catch (error) {
            throw new Error('Failed to update technology ring.');
        }
    }

    async readTechnologyById(id) {
        try {
            const sql = 'SELECT * FROM Technology WHERE id=?';
            return new Promise((resolve, reject) => {
                this.connection.query(sql, [id], function (err, result) {
                    if (err) reject(err);
                    else if (result[0] && typeof result[0] === 'object') resolve(result[0]);
                    else reject(new Error('No technology found with the given ID'));
                });
            });

        } catch (error) {
            throw new Error('Failed to read technology by id');
        }
    }
    async readTechnologies(filter = {}) {
        try {
            const { name, published, ring, category } = filter;
            const where = [];
            const values = [];

            if (name) {
                where.push('name LIKE ?');
                values.push(`%${name}%`);
            }

            if (published !== undefined) {
                where.push('published = ?');
                values.push(published);
            }

            if (ring) {
                where.push('ring = ?');
                values.push(ring);
            }

            if (category) {
                where.push('category = ?');
                values.push(category);
            }

            let sql = 'SELECT * FROM Technology';
            if (where.length !== 0) {
                sql = `${sql} WHERE ${where.join(' AND ')}`;
            }

            return new Promise((resolve, reject) => {
                this.connection.query(sql, values, (err, result) => {
                    if (err) {
                        reject(err);
                    } else {
                        resolve(result);
                    }
                });
            });
        } catch (error) {
            throw new Error('Failed to read technologies');
        }
    }

}

module.exports = DatabaseInterface;
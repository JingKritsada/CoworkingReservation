const sql = require('../config/db');

// constructor
const Space = function (space) {
    this.name = space.name;
    this.address = space.address;
    this.telephone = space.telephone;
    this.open_time = space.open_time;
    this.close_time = space.close_time;
}

Space.findAll = (options = {}) => {
    return new Promise((resolve, reject) => {
        const validColumns = ['space_id', 'name', 'address', 'telephone', 'open_time', 'close_time'];
        const values = [];
        let paramIndex = 1;

        let selectFields = '*';
        if (options.select) {
            const fields = options.select.split(',').filter(col => validColumns.includes(col));
            if (fields.length > 0) {
                selectFields = fields.join(', ');
            }
        }

        let queryText = `SELECT ${selectFields} FROM spaces`;
        let whereClauses = [];

        if (options.filters) {
            for (const key in options.filters) {
                let columnName = key;
                let conditions = options.filters[key];
                console.log(`columnName: ${columnName}, conditions: ${JSON.stringify(conditions)}`);
        
                if (!validColumns.includes(columnName)) continue;
        
                if (typeof conditions === 'object') {
                    for (const operator in conditions) {
                        let sqlOperator;
                        let value = conditions[operator];
        
                        switch (operator) {
                            case 'gt': sqlOperator = '>'; break;
                            case 'gte': sqlOperator = '>='; break;
                            case 'lt': sqlOperator = '<'; break;
                            case 'lte': sqlOperator = '<='; break;
                            case 'like': sqlOperator = 'ILIKE'; value = `%${value}%`; break;
                            default: sqlOperator = '='; break;
                        }
        
                        whereClauses.push(`${columnName} ${sqlOperator} $${paramIndex}`);
                        values.push(value);
                        paramIndex++;
                    }
                } else {
                    // Direct comparison (equal)
                    whereClauses.push(`${columnName} = $${paramIndex}`);
                    values.push(conditions);
                    paramIndex++;
                }
            }
        }

        // Add WHERE clause if there are conditions
        if (whereClauses.length > 0) {
            queryText += ' WHERE ' + whereClauses.join(' AND ');
        }

        if (options.sort) {
            if (validColumns.includes(options.sort)) {
                queryText += ` ORDER BY ${options.sort} ASC`;
            }
        }

        if (options.pagination) {
            queryText += ` LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
            values.push(options.pagination.limit, options.pagination.offset);
        }

        sql.query(queryText, values, (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }

            resolve(res.rows);
        });
    });
};


Space.findById = (id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'SELECT * FROM spaces WHERE space_id = $1';
        sql.query(queryText, [id], (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }
            if (res.rows.length === 0) {
                resolve(null);
                return;
            }
            resolve(res.rows[0]);
        });
    });
};

Space.create = (space) => {
    return new Promise((resolve, reject) => {
        const queryText = 'INSERT INTO spaces (name, address, telephone, open_time, close_time) VALUES ($1, $2, $3, $4, $5) RETURNING *';
        sql.query(queryText, [space.name, space.address, space.telephone, space.open_time, space.close_time], (err, res) => {
            if (err) {
                console.log('error: ', err);
                reject(err);
                return;
            }

            resolve(res.rows[0]);
        });
    });
};

Space.update = (id, space) => {
    return new Promise((resolve, reject) => {
        let queryText = 'UPDATE spaces SET';
        const fields = [];
        const values = [];
        values.push(id);

        Object.keys(space).forEach((key, index) => {
            if (space[key] !== null && space[key] !== undefined) {
                fields.push(`${key} = $${fields.length + 2}`);
                values.push(space[key]);
            }
        });

        if (fields.length === 0) {
            return reject(new Error("No valid fields provided for update"));
        }

        queryText += ` ${fields.join(', ')} WHERE space_id = $1 RETURNING *`;

        sql.query(queryText, values, (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }
            if (res.rows.length === 0) {
                reject(new Error("No space found with the provided ID"));
                return;
            }

            resolve(res.rows[0]);
        });
    });
};


Space.remove = (id) => {
    return new Promise((resolve, reject) => {
        const queryText = 'DELETE FROM spaces WHERE space_id = $1';
        sql.query(queryText, [id], (err, res) => {
            if (err) {
                console.log('SQL Error: ', err);
                reject(err);
                return;
            }

            resolve(res);
        });
    });
};

module.exports = Space;
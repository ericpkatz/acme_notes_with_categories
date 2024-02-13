const pg = require('pg');
const client = new pg.Client(process.env.DATABASE_URL || 'postgres://localhost/acme_notes_v2');

const init = async()=> {
    await client.connect();
    console.log('connected to database');
    let SQL = `
        DROP TABLE IF EXISTS notes;
        DROP TABLE IF EXISTS categories;
        CREATE TABLE categories(
            id SERIAL PRIMARY KEY,
            name VARCHAR(20)
        );
        CREATE TABLE notes(
            id SERIAL PRIMARY KEY,
            txt VARCHAR(200),
            ranking INTEGER DEFAULT 5,
            category_id INTEGER REFERENCES categories(id) NOT NULL
        );
    `;
    await client.query(SQL);
    console.log('tables created');
    SQL = `
        INSERT INTO categories(name) VALUES('shopping');
        INSERT INTO categories(name) VALUES('SQL');
        INSERT INTO categories(name) VALUES('express');
        INSERT INTO notes(txt, category_id) VALUES('write some queries', (
            SELECT id FROM categories WHERE name = 'SQL'
        ));
        INSERT INTO notes(txt, category_id) VALUES('create a foreign key', (
            SELECT id FROM categories WHERE name = 'SQL'
        ));
        INSERT INTO notes(txt, category_id) VALUES('understanding primary keys', (
            SELECT id FROM categories WHERE name = 'SQL'
        ));
    `;
    await client.query(SQL);
    console.log('data seeded');
    
};

init();
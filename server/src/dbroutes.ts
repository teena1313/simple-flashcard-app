import pg from 'pg';
// import mysql from 'mysql';

const {Client} = pg;

const con: pg.Client = new Client({
   host: "db",
   user: "postgres",
   password: "1234",
   database: "postgres",
   port: 5432,
});

con.connect();

export const createDecksTable = async () => {
   await con.query(`CREATE TABLE IF NOT EXISTS decks
      (deck_id serial PRIMARY KEY, deckname VARCHAR (255) UNIQUE NOT NULL);`)
};

export const createCardsTable = async () => {
   await con.query(`CREATE TABLE IF NOT EXISTS cards
      (card_id serial PRIMARY KEY, deck_id integer REFERENCES decks, 
      front VARCHAR (255) NOT NULL, back VARCHAR(255) NOT NULL);`)
};

export const createScoresTable = async () => {
   await con.query(`CREATE TABLE IF NOT EXISTS scores
      (user_id serial PRIMARY KEY, deck_id integer REFERENCES decks,
       username VARCHAR (255) NOT NULL, score integer NOT NULL);`)
};


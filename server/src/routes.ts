import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import pg from 'pg';
// import mysql from 'mysql';


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

type card = {front: string, back: string};
type scoreRecord = {player: string, deck: string, score: number}

let savedScores: scoreRecord[] = [];
const savedDecks: Map<string, card[]> = new Map<string, card[]>();
const {Client} = pg;

require('dotenv').config()
console.log(process.env)

const con: pg.Client = new Client({
   host: process.env.REACT_APP_HOST,
   user: process.env.REACT_APP_USER,
   password: process.env.REACT_APP_PWD,
   database: process.env.REACT_APP_DB,
   port: +(process.env.REACT_APP_PORT || 5432)
});

con.connect();

export const createDecksTable = async () => {
   await con.query(`CREATE TABLE IF NOT EXISTS decks
      (deckname VARCHAR (255) UNIQUE NOT NULL PRIMARY KEY);`)
};

export const createCardsTable = async () => {
   await con.query(`CREATE TABLE IF NOT EXISTS cards
      (card_id serial PRIMARY KEY, deckname VARCHAR (255) REFERENCES decks, 
      front VARCHAR (255) NOT NULL, back VARCHAR(255) NOT NULL);`)
};

export const createScoresTable = async () => {
   await con.query(`CREATE TABLE IF NOT EXISTS scores
      (score_id serial PRIMARY KEY, deckname VARCHAR (255) REFERENCES decks,
       username VARCHAR (255) NOT NULL, score integer NOT NULL);`)
};

/**
 * Adds the new score to the savedScores array.
 * @param req request
 * @param res response
 * @return true on success via response, sends error codes otherwise.
 */
export const addScore = async(req: SafeRequest, res: SafeResponse): Promise<void> => {
  const newPlayer = req.body.player;
  if (newPlayer === undefined || typeof newPlayer !== 'string') {
    res.status(400).send('missing "player" parameter / given param was not a string');
    return;
  }
  
  const newDeck = req.body.deck;
  if (newDeck === undefined || typeof newDeck !== 'string') {
    res.status(400).send('required argument "deck" was missing');
    return;
  }

  const newScore = req.body.score;
  if (newScore === undefined || typeof newScore !== 'number') {
    res.status(400).send('required argument "score" was missing');
    return;
  }
  // save data locally
  const newEntry: scoreRecord = {player: newPlayer, deck: newDeck, score: newScore};
  savedScores.push(newEntry);

  // save data to database
  try {
    const response = await con.query(`INSERT INTO scores(deckname, username, score) VALUES ('${newDeck}', '${newPlayer}', ${newScore});`);
    if (response){
       res.status(200).send({success: true});
    }
  } catch (error) {
    res.status(500).send('Error');
    console.log(error);
  }
};


/**
 * Adds the new deck to the savedDecks map.
 * @param req request
 * @param res response
 * @return 3 on success, 2 if there were formatting issues with the given card content,
 *         and 1 if the deck already exists via response
 */
export const addDeck = async (req: SafeRequest, res: SafeResponse): Promise<void> => {
  let success: number = 0;
  const name = req.body.name;
  if (name === undefined || typeof name !== 'string') {
    res.status(400).send('missing "name" parameter / given param was not a string');
    return;
  }
  if (savedDecks.has(name)) {
    res.send({saved: 1});
    return;
  }
  const content = req.body.content;
  if (content === undefined || typeof content !== 'string') {
    res.status(400).send('required argument "content" was missing');
    return;
  }

  const cards: card[] = parseNotecards(content);
  if (cards.length === 0) {
    res.send({saved: 2});
    return;
  }

  savedDecks.set(name, cards);

  // try saving to database
  try {
    const response = await con.query(`INSERT INTO decks(deckname) VALUES ('${name}');`);
    if (response) {
      success += 1;
    }
  } catch (error) {
    res.status(500).send('Error');
    console.log(error);
  }

  for (const card of cards) {
    try {
      const response = await con.query(`INSERT INTO cards(deckname, front, back) VALUES ('${name}', '${card.front}', ${card.back});`);
      if (response){
        success += 1;
      }
    } catch (error) {
      res.status(500).send('Error');
      console.log(error);
    }
  }

  if (success === cards.length + 1) {
    res.status(200).send({saved: 3});
  } else {
    res.status(500).send('Error');
    console.log(success);
  }
};

/**
 * Returns cards in a study notecard deck.
 * @param req request
 * @param res response
 * @return set of cards associated with given query via response
 */
export const loadDeck = (req: SafeRequest, res: SafeResponse): void => {
  const name = first(req.query.name);
  if (name === undefined) {
    res.status(400).send('missing "name" parameter');
    return;
  }
  
  const result = savedDecks.get(name);
  if (result === undefined) {
    res.status(404).send('did not find deck with "name"');
    return;
  }

  res.send({cardset: result});
}

/**
 * Returns all decks saved on server.
 * @param _req request, unused
 * @param res response
 * @return array of names of the saved decks of cards via response
 */
export const listDecks = (_req: SafeRequest, res: SafeResponse): void => {
  const vals: string[] = Array.from(savedDecks.keys());
  res.send({deckNames: vals});
}

/**
 * Returns all previous records of players and their scores
 * @param _req request, unused
 * @param res response
 * @return array of records of previous scores
 */
export const listScores = (_req: SafeRequest, res: SafeResponse): void => {
  const vals: scoreRecord[] = savedScores.slice();
  res.send({scores: vals});
};

/**
 * Parses a string into an array of cards
 * A valid string must be formatted as following:
 *    front1|back1 \n front2|back2 \n front3|back3 ....
 * With any number of spaces allowed in between the given entries.
 * Strings that do not follow this format are not valid.
 * @param content string of given card contents
 * @return Card[] when content is a well-formatted string that allows us to
 *         parse and create valid cards out of.
 *         Empty array if any of the given notecards was incorrectly formatted.
 */
const parseNotecards = (content: string): card[]=> {
  const result: card[] = [];
  const splitLines: string[] = content.split("\n");
  for (const word of splitLines) {
    const splitSides: string[] = word.split("|");
    if (splitSides.length !== 2) {
      return [];
    } else {
      const cFront: string = splitSides[0].trim();
      const cBack: string = splitSides[1].trim();
      if (cFront.length === 0 || cBack.length === 0) {
        return [];
      } else {
        result.push({front: cFront, back: cBack});
      }
    }
  }
  return result;
};

/** Used in tests to set the transcripts map back to empty. */
export const resetTranscriptsForTesting = (): void => {
  // Do not use this function except in tests!
  savedDecks.clear();
  savedScores = [];
};

// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param: unknown): string|undefined => {
  if (Array.isArray(param)) {
    return first(param[0]);
  } else if (typeof param === 'string') {
    return param;
  } else {
    return undefined;
  }
};

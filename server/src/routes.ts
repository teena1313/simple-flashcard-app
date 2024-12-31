import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";


// Require type checking of request body.
type SafeRequest = Request<ParamsDictionary, {}, Record<string, unknown>>;
type SafeResponse = Response;  // only writing, so no need to check

type card = {front: string, back: string};
type scoreRecord = {player: string, deck: string, score: number}

let savedScores: scoreRecord[] = [];
const savedDecks: Map<string, card[]> = new Map<string, card[]>();


/**
 * Adds the new score to the savedScores array.
 * @param req request
 * @param res response
 * @return true on success via response, sends error codes otherwise.
 */
export const addScore = (req: SafeRequest, res: SafeResponse): void => {
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
  const newEntry: scoreRecord = {player: newPlayer, deck: newDeck, score: newScore};
  savedScores.push(newEntry);
  res.send({success: true});
};


/**
 * Adds the new deck to the savedDecks map.
 * @param req request
 * @param res response
 * @return 3 on success, 2 if there were formatting issues with the given card content,
 *         and 1 if the deck already exists via response
 */
export const addDeck = (req: SafeRequest, res: SafeResponse): void => {
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
  res.send({saved: 3});
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

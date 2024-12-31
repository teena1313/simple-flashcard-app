"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.resetTranscriptsForTesting = exports.listScores = exports.listDecks = exports.loadDeck = exports.addDeck = exports.addScore = void 0;
let savedScores = [];
const savedDecks = new Map();
// Adds the new score to the savedScores array.
// Returns true on success, sends error codes otherwise.
const addScore = (req, res) => {
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
    const newEntry = { player: newPlayer, deck: newDeck, score: newScore };
    savedScores.push(newEntry);
    res.send({ success: true });
};
exports.addScore = addScore;
// Adds the new deck to the savedDecks map.
// Returns 3 on success, 2 if there were formatting issues with the given card content,
// and 1 if the deck already exists.
const addDeck = (req, res) => {
    const name = req.body.name;
    if (name === undefined || typeof name !== 'string') {
        res.status(400).send('missing "name" parameter / given param was not a string');
        return;
    }
    if (savedDecks.has(name)) {
        res.send({ saved: 1 });
        return;
    }
    const content = req.body.content;
    if (content === undefined || typeof content !== 'string') {
        res.status(400).send('required argument "content" was missing');
        return;
    }
    const cards = parseNotecards(content);
    if (cards.length === 0) {
        res.send({ saved: 2 });
        return;
    }
    savedDecks.set(name, cards);
    res.send({ saved: 3 });
};
exports.addDeck = addDeck;
// sends back set of cards with associated given query name.
const loadDeck = (req, res) => {
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
    res.send({ cardset: result });
};
exports.loadDeck = loadDeck;
// sends back an array of all the names of the saved decks of cards
const listDecks = (_req, res) => {
    const vals = Array.from(savedDecks.keys());
    res.send({ deckNames: vals });
};
exports.listDecks = listDecks;
// sends back an array of records of previous scores
const listScores = (_req, res) => {
    const vals = savedScores.slice();
    res.send({ scores: vals });
};
exports.listScores = listScores;
/**
* Parses a string into an array of cards
* A valid string must be formatted as following:
*    front1|back1 \n front2|back2 \n front3|back3 ....
* With any number of spaces in between the given entries.
* Strings that do not follow this format are not valid.
* @param content string of given card contents
* @return card[] when content is a well-formatted string that allows us to
*         parse and create valid cards out of.
*         return empty if any of the given notecards was incorrectly formatted
*/
const parseNotecards = (content) => {
    const result = [];
    const splitLines = content.split("\n");
    for (const word of splitLines) {
        const splitSides = word.split("|");
        if (splitSides.length !== 2) {
            return [];
        }
        else {
            const cFront = splitSides[0].trim();
            const cBack = splitSides[1].trim();
            if (cFront.length === 0 || cBack.length === 0) {
                return [];
            }
            else {
                result.push({ front: cFront, back: cBack });
            }
        }
    }
    return result;
};
/** Used in tests to set the transcripts map back to empty. */
const resetTranscriptsForTesting = () => {
    // Do not use this function except in tests!
    savedDecks.clear();
    savedScores = [];
};
exports.resetTranscriptsForTesting = resetTranscriptsForTesting;
// Helper to return the (first) value of the parameter if any was given.
// (This is mildly annoying because the client can also give mutiple values,
// in which case, express puts them into an array.)
const first = (param) => {
    if (Array.isArray(param)) {
        return first(param[0]);
    }
    else if (typeof param === 'string') {
        return param;
    }
    else {
        return undefined;
    }
};
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXMiOlsiLi4vc3JjL3JvdXRlcy50cyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiOzs7QUFXQSxJQUFJLFdBQVcsR0FBa0IsRUFBRSxDQUFDO0FBQ3BDLE1BQU0sVUFBVSxHQUF3QixJQUFJLEdBQUcsRUFBa0IsQ0FBQztBQUVsRSwrQ0FBK0M7QUFDL0Msd0RBQXdEO0FBQ2pELE1BQU0sUUFBUSxHQUFHLENBQUMsR0FBZ0IsRUFBRSxHQUFpQixFQUFRLEVBQUU7SUFDcEUsTUFBTSxTQUFTLEdBQUcsR0FBRyxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUM7SUFDbEMsSUFBSSxTQUFTLEtBQUssU0FBUyxJQUFJLE9BQU8sU0FBUyxLQUFLLFFBQVEsRUFBRTtRQUM1RCxHQUFHLENBQUMsTUFBTSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksQ0FBQywyREFBMkQsQ0FBQyxDQUFDO1FBQ2xGLE9BQU87S0FDUjtJQUVELE1BQU0sT0FBTyxHQUFHLEdBQUcsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDO0lBQzlCLElBQUksT0FBTyxLQUFLLFNBQVMsSUFBSSxPQUFPLE9BQU8sS0FBSyxRQUFRLEVBQUU7UUFDeEQsR0FBRyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLENBQUMsc0NBQXNDLENBQUMsQ0FBQztRQUM3RCxPQUFPO0tBQ1I7SUFFRCxNQUFNLFFBQVEsR0FBRyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQztJQUNoQyxJQUFJLFFBQVEsS0FBSyxTQUFTLElBQUksT0FBTyxRQUFRLEtBQUssUUFBUSxFQUFFO1FBQzFELEdBQUcsQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLHVDQUF1QyxDQUFDLENBQUM7UUFDOUQsT0FBTztLQUNSO0lBQ0QsTUFBTSxRQUFRLEdBQWdCLEVBQUMsTUFBTSxFQUFFLFNBQVMsRUFBRSxJQUFJLEVBQUUsT0FBTyxFQUFFLEtBQUss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
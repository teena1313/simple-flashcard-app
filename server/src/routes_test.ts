import * as assert from 'assert';
import * as httpMocks from 'node-mocks-http';
import { addScore, addDeck, loadDeck, listDecks, listScores, resetTranscriptsForTesting } from './routes';
type scoreRecord = {player: string, deck: string, score: number}


describe('routes', function() {

  // TODO: add tests for routes

  it('addScore', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/addScore', body: {deck: "some stuff", score: 1}});
    const res1 = httpMocks.createResponse();
    addScore(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'missing "player" parameter / given param was not a string');

    // Second branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/addScore', body: {player: "A", score: 2}});
    const res2 = httpMocks.createResponse();
    addScore(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "deck" was missing');

    // Third branch, straight line code, error case (only one possible input)
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/addScore', body: {player: "A", deck: "hi"}});
    const res3 = httpMocks.createResponse();
    addScore(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 400);
    assert.deepStrictEqual(res3._getData(),
        'required argument "score" was missing');

    // Fourth branch, straight line code
    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/addScore',
        body: {deck: "A", player: "some stuff", score: 3}});
    const res4 = httpMocks.createResponse();
    addScore(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {success: true});

    const req5 = httpMocks.createRequest({method: 'POST', url: '/api/addScore',
        body: {deck: "wow", player: "other stuff", score: 122}});
    const res5 = httpMocks.createResponse();
    addScore(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {success: true});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });

  it('addDeck', function() {
    // First branch, straight line code, error case (only one possible input)
    const req1 = httpMocks.createRequest(
        {method: 'POST', url: '/api/addDeck', body: {content: "some stuff"}});
    const res1 = httpMocks.createResponse();
    addDeck(req1, res1);

    assert.strictEqual(res1._getStatusCode(), 400);
    assert.deepStrictEqual(res1._getData(),
        'missing "name" parameter / given param was not a string');

    // Third branch, straight line code, error case (only one possible input)
    const req2 = httpMocks.createRequest(
        {method: 'POST', url: '/api/addDeck', body: {name: "other stuff"}});
    const res2 = httpMocks.createResponse();
    addDeck(req2, res2);

    assert.strictEqual(res2._getStatusCode(), 400);
    assert.deepStrictEqual(res2._getData(),
        'required argument "content" was missing');

    // Fourth branch, straight line code, error case (only one possible input)
    const req3 = httpMocks.createRequest(
        {method: 'POST', url: '/api/addDeck', body: {name: "A", content: "things|"}});
    const res3 = httpMocks.createResponse();
    addDeck(req3, res3);

    assert.strictEqual(res3._getStatusCode(), 200);
    assert.deepStrictEqual(res3._getData(), {saved: 2});

    // Fourth branch, straight line code
    const req4 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "A", content: "things|stuff"}});
    const res4 = httpMocks.createResponse();
    addDeck(req4, res4);

    assert.strictEqual(res4._getStatusCode(), 200);
    assert.deepStrictEqual(res4._getData(), {saved: 3});

    // Second branch, deck already exists
    const req5 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "A", content: "other|yea"}});
    const res5 = httpMocks.createResponse();
    addDeck(req5, res5);

    assert.strictEqual(res5._getStatusCode(), 200);
    assert.deepStrictEqual(res5._getData(), {saved: 1});

    // Called to clear all saved transcripts created in this test
    //    to not effect future tests
    resetTranscriptsForTesting();
  });

  it('loadDeck', function() {
    // branching heuristics: 2 tests for success (code 200)
    // Example test:
    // First need to add decks in order to load it
    const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "A", content: "things|stuff"}});
    const saveResp = httpMocks.createResponse();
    addDeck(saveReq, saveResp);
    // Now we can actually (mock a) request to load the transcript
    const loadReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadDeck', query: {name: "A"}});
    const loadRes = httpMocks.createResponse();
    loadDeck(loadReq, loadRes);
    // Validate that both the status code and the output is as expected
    assert.strictEqual(loadRes._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes._getData(), {cardset: [{front: "things", back: "stuff"}]});

    const saveReq1 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "B", content: "things|stuff \n second|card"}});
    const saveRes1 = httpMocks.createResponse();
    addDeck(saveReq1, saveRes1);
    const loadReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadDeck', query: {name: "B"}});
    const loadRes1 = httpMocks.createResponse();
    loadDeck(loadReq1, loadRes1);
    assert.strictEqual(loadRes1._getStatusCode(), 200);
    assert.deepStrictEqual(loadRes1._getData(), 
          {cardset: [{front: "things", back: "stuff"}, {front: "second", back: "card"}]});

    // branching heuristics: 2 tests for 404 error codes
    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "A", content: "things|stuff"}});
    const saveRes2 = httpMocks.createResponse();
    addDeck(saveReq2, saveRes2);
    const loadReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadDeck', query: {name: "dne"}});
    const loadRes2 = httpMocks.createResponse();
    loadDeck(loadReq2, loadRes2);
    assert.strictEqual(loadRes2._getStatusCode(), 404);

    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "A", content: "things|stuff"}});
    const saveRes3 = httpMocks.createResponse();
    addDeck(saveReq3, saveRes3);
    const loadReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadDeck', query: {name: "woww"}});
    const loadRes3 = httpMocks.createResponse();
    loadDeck(loadReq3, loadRes3);
    assert.strictEqual(loadRes3._getStatusCode(), 404);

    // branching heuristics: 1 test for 400 error code
    // only one possible- user did not input a name
    const saveReq4 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "hi", value: "can't find me"}});
    const saveRes4 = httpMocks.createResponse();
    addDeck(saveReq4, saveRes4);
    const loadReq4 = httpMocks.createRequest(
        {method: 'GET', url: '/api/loadDeck', query: {}});
    const loadRes4 = httpMocks.createResponse();
    loadDeck(loadReq4, loadRes4);
    assert.strictEqual(loadRes4._getStatusCode(), 400);

    resetTranscriptsForTesting();
  });

  // Testing straightline code, no need to test errors
  it('listDecks', function() {
    const compare: string[] = [];
    // httpMocks lets us create mock Request and Response params to pass into our route functions
    // query: is how we add query params. body: {} can be used to test a POST request
    const lnReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/listDecks'}); 
    const lnRes = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    listDecks(lnReq, lnRes);

    // check that the request was successful
    assert.strictEqual(lnRes._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(lnRes._getData(), {deckNames: compare});

    const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "A", content: "things|stuff"}});
    compare.push("A");
    const saveRes = httpMocks.createResponse();
    addDeck(saveReq, saveRes);

    const lnReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listDecks'}); 
    const lnRes1 = httpMocks.createResponse();
    listDecks(lnReq1, lnRes1);
    assert.strictEqual(lnRes1._getStatusCode(), 200);
    assert.deepEqual(lnRes1._getData(), {deckNames: compare});

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "B", content: "other|stuff \n hehe|stuff"}});
    compare.push("B");
    const saveRes2 = httpMocks.createResponse();
    addDeck(saveReq2, saveRes2);

    const lnReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listDecks'}); 
    const lnRes2 = httpMocks.createResponse();
    listDecks(lnReq2, lnRes2);
    assert.strictEqual(lnRes2._getStatusCode(), 200);
    assert.deepEqual(lnRes2._getData(), {deckNames: compare});

    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/addDeck',
        body: {name: "what", content: "is going on|lol"}});
    compare.push("what");
    const saveRes3 = httpMocks.createResponse();
    addDeck(saveReq3, saveRes3);

    const lnReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listDecks'}); 
    const lnRes3 = httpMocks.createResponse();
    listDecks(lnReq3, lnRes3);
    assert.strictEqual(lnRes3._getStatusCode(), 200);
    assert.deepEqual(lnRes3._getData(), {deckNames: compare});

    resetTranscriptsForTesting();
  });
  
  // Testing straightline code, no need to test errors
  it('listScores', function() {
    const compare: scoreRecord[] = [];
    // httpMocks lets us create mock Request and Response params to pass into our route functions
    // query: is how we add query params. body: {} can be used to test a POST request
    const lnReq = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScores'}); 
    const lnRes = httpMocks.createResponse();

    // call our function to execute the request and fill in the response
    listScores(lnReq, lnRes);

    // check that the request was successful
    assert.strictEqual(lnRes._getStatusCode(), 200);
    // and the response data is as expected
    assert.deepEqual(lnRes._getData(), {scores: compare});

    const saveReq = httpMocks.createRequest({method: 'POST', url: '/api/addScore',
        body: {deck: "wow", player: "other stuff", score: 122}});
    compare.push({deck: "wow", player: "other stuff", score: 122});
    const saveRes = httpMocks.createResponse();
    addScore(saveReq, saveRes);

    const lnReq1 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScores'}); 
    const lnRes1 = httpMocks.createResponse();
    listScores(lnReq1, lnRes1);
    assert.strictEqual(lnRes1._getStatusCode(), 200);
    assert.deepEqual(lnRes1._getData(), {scores: compare});

    const saveReq2 = httpMocks.createRequest({method: 'POST', url: '/api/addScore',
        body: {deck: "second", player: "me", score: 12}});
    compare.push({deck: "second", player: "me", score: 12});
    const saveRes2 = httpMocks.createResponse();
    addScore(saveReq2, saveRes2);

    const lnReq2 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScores'}); 
    const lnRes2 = httpMocks.createResponse();
    listScores(lnReq2, lnRes2);
    assert.strictEqual(lnRes2._getStatusCode(), 200);
    assert.deepEqual(lnRes2._getData(), {scores: compare});

    const saveReq3 = httpMocks.createRequest({method: 'POST', url: '/api/addScore',
        body: {deck: "third", player: "wow", score: 11}});
    compare.push({deck: "third", player: "wow", score: 11});
    const saveRes3 = httpMocks.createResponse();
    addScore(saveReq3, saveRes3);

    const lnReq3 = httpMocks.createRequest(
        {method: 'GET', url: '/api/listScores'}); 
    const lnRes3 = httpMocks.createResponse();
    listScores(lnReq3, lnRes3);
    assert.strictEqual(lnRes3._getStatusCode(), 200);
    assert.deepEqual(lnRes3._getData(), {scores: compare});

    resetTranscriptsForTesting();
  });
});

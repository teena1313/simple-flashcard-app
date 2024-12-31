"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const assert = __importStar(require("assert"));
const httpMocks = __importStar(require("node-mocks-http"));
const routes_1 = require("./routes");
describe('routes', function () {
    // TODO: add tests for your routes
    it('addScore', function () {
        // First branch, straight line code, error case (only one possible input)
        const req1 = httpMocks.createRequest({ method: 'POST', url: '/api/addScore', body: { deck: "some stuff", score: 1 } });
        const res1 = httpMocks.createResponse();
        (0, routes_1.addScore)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'missing "player" parameter / given param was not a string');
        // Second branch, straight line code, error case (only one possible input)
        const req2 = httpMocks.createRequest({ method: 'POST', url: '/api/addScore', body: { player: "A", score: 2 } });
        const res2 = httpMocks.createResponse();
        (0, routes_1.addScore)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), 'required argument "deck" was missing');
        // Third branch, straight line code, error case (only one possible input)
        const req3 = httpMocks.createRequest({ method: 'POST', url: '/api/addScore', body: { player: "A", deck: "hi" } });
        const res3 = httpMocks.createResponse();
        (0, routes_1.addScore)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 400);
        assert.deepStrictEqual(res3._getData(), 'required argument "score" was missing');
        // Fourth branch, straight line code
        const req4 = httpMocks.createRequest({ method: 'POST', url: '/api/addScore',
            body: { deck: "A", player: "some stuff", score: 3 } });
        const res4 = httpMocks.createResponse();
        (0, routes_1.addScore)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), { success: true });
        const req5 = httpMocks.createRequest({ method: 'POST', url: '/api/addScore',
            body: { deck: "wow", player: "other stuff", score: 122 } });
        const res5 = httpMocks.createResponse();
        (0, routes_1.addScore)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 200);
        assert.deepStrictEqual(res5._getData(), { success: true });
        // Called to clear all saved transcripts created in this test
        //    to not effect future tests
        (0, routes_1.resetTranscriptsForTesting)();
    });
    it('addDeck', function () {
        // First branch, straight line code, error case (only one possible input)
        const req1 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck', body: { content: "some stuff" } });
        const res1 = httpMocks.createResponse();
        (0, routes_1.addDeck)(req1, res1);
        assert.strictEqual(res1._getStatusCode(), 400);
        assert.deepStrictEqual(res1._getData(), 'missing "name" parameter / given param was not a string');
        // Third branch, straight line code, error case (only one possible input)
        const req2 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck', body: { name: "other stuff" } });
        const res2 = httpMocks.createResponse();
        (0, routes_1.addDeck)(req2, res2);
        assert.strictEqual(res2._getStatusCode(), 400);
        assert.deepStrictEqual(res2._getData(), 'required argument "content" was missing');
        // Fourth branch, straight line code, error case (only one possible input)
        const req3 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck', body: { name: "A", content: "things|" } });
        const res3 = httpMocks.createResponse();
        (0, routes_1.addDeck)(req3, res3);
        assert.strictEqual(res3._getStatusCode(), 200);
        assert.deepStrictEqual(res3._getData(), { saved: 2 });
        // Fourth branch, straight line code
        const req4 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "A", content: "things|stuff" } });
        const res4 = httpMocks.createResponse();
        (0, routes_1.addDeck)(req4, res4);
        assert.strictEqual(res4._getStatusCode(), 200);
        assert.deepStrictEqual(res4._getData(), { saved: 3 });
        // Second branch, deck already exists
        const req5 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "A", content: "other|yea" } });
        const res5 = httpMocks.createResponse();
        (0, routes_1.addDeck)(req5, res5);
        assert.strictEqual(res5._getStatusCode(), 200);
        assert.deepStrictEqual(res5._getData(), { saved: 1 });
        // Called to clear all saved transcripts created in this test
        //    to not effect future tests
        (0, routes_1.resetTranscriptsForTesting)();
    });
    it('loadDeck', function () {
        // branching heuristics: 2 tests for success (code 200)
        // Example test:
        // First need to add decks in order to load it
        const saveReq = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "A", content: "things|stuff" } });
        const saveResp = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq, saveResp);
        // Now we can actually (mock a) request to load the transcript
        const loadReq = httpMocks.createRequest({ method: 'GET', url: '/api/loadDeck', query: { name: "A" } });
        const loadRes = httpMocks.createResponse();
        (0, routes_1.loadDeck)(loadReq, loadRes);
        // Validate that both the status code and the output is as expected
        assert.strictEqual(loadRes._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes._getData(), { cardset: [{ front: "things", back: "stuff" }] });
        const saveReq1 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "B", content: "things|stuff \n second|card" } });
        const saveRes1 = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq1, saveRes1);
        const loadReq1 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDeck', query: { name: "B" } });
        const loadRes1 = httpMocks.createResponse();
        (0, routes_1.loadDeck)(loadReq1, loadRes1);
        assert.strictEqual(loadRes1._getStatusCode(), 200);
        assert.deepStrictEqual(loadRes1._getData(), { cardset: [{ front: "things", back: "stuff" }, { front: "second", back: "card" }] });
        // branching heuristics: 2 tests for 404 error codes
        const saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "A", content: "things|stuff" } });
        const saveRes2 = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq2, saveRes2);
        const loadReq2 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDeck', query: { name: "dne" } });
        const loadRes2 = httpMocks.createResponse();
        (0, routes_1.loadDeck)(loadReq2, loadRes2);
        assert.strictEqual(loadRes2._getStatusCode(), 404);
        const saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "A", content: "things|stuff" } });
        const saveRes3 = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq3, saveRes3);
        const loadReq3 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDeck', query: { name: "woww" } });
        const loadRes3 = httpMocks.createResponse();
        (0, routes_1.loadDeck)(loadReq3, loadRes3);
        assert.strictEqual(loadRes3._getStatusCode(), 404);
        // branching heuristics: 1 test for 400 error code
        // only one possible- user did not input a name
        const saveReq4 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "hi", value: "can't find me" } });
        const saveRes4 = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq4, saveRes4);
        const loadReq4 = httpMocks.createRequest({ method: 'GET', url: '/api/loadDeck', query: {} });
        const loadRes4 = httpMocks.createResponse();
        (0, routes_1.loadDeck)(loadReq4, loadRes4);
        assert.strictEqual(loadRes4._getStatusCode(), 400);
        (0, routes_1.resetTranscriptsForTesting)();
    });
    // Testing straightline code, no need to test errors
    it('listDecks', function () {
        const compare = [];
        // httpMocks lets us create mock Request and Response params to pass into our route functions
        // query: is how we add query params. body: {} can be used to test a POST request
        const lnReq = httpMocks.createRequest({ method: 'GET', url: '/api/listDecks' });
        const lnRes = httpMocks.createResponse();
        // call our function to execute the request and fill in the response
        (0, routes_1.listDecks)(lnReq, lnRes);
        // check that the request was successful
        assert.strictEqual(lnRes._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepEqual(lnRes._getData(), { deckNames: compare });
        const saveReq = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "A", content: "things|stuff" } });
        compare.push("A");
        const saveRes = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq, saveRes);
        const lnReq1 = httpMocks.createRequest({ method: 'GET', url: '/api/listDecks' });
        const lnRes1 = httpMocks.createResponse();
        (0, routes_1.listDecks)(lnReq1, lnRes1);
        assert.strictEqual(lnRes1._getStatusCode(), 200);
        assert.deepEqual(lnRes1._getData(), { deckNames: compare });
        const saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "B", content: "other|stuff \n hehe|stuff" } });
        compare.push("B");
        const saveRes2 = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq2, saveRes2);
        const lnReq2 = httpMocks.createRequest({ method: 'GET', url: '/api/listDecks' });
        const lnRes2 = httpMocks.createResponse();
        (0, routes_1.listDecks)(lnReq2, lnRes2);
        assert.strictEqual(lnRes2._getStatusCode(), 200);
        assert.deepEqual(lnRes2._getData(), { deckNames: compare });
        const saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/api/addDeck',
            body: { name: "what", content: "is going on|lol" } });
        compare.push("what");
        const saveRes3 = httpMocks.createResponse();
        (0, routes_1.addDeck)(saveReq3, saveRes3);
        const lnReq3 = httpMocks.createRequest({ method: 'GET', url: '/api/listDecks' });
        const lnRes3 = httpMocks.createResponse();
        (0, routes_1.listDecks)(lnReq3, lnRes3);
        assert.strictEqual(lnRes3._getStatusCode(), 200);
        assert.deepEqual(lnRes3._getData(), { deckNames: compare });
        (0, routes_1.resetTranscriptsForTesting)();
    });
    // Testing straightline code, no need to test errors
    it('listScores', function () {
        const compare = [];
        // httpMocks lets us create mock Request and Response params to pass into our route functions
        // query: is how we add query params. body: {} can be used to test a POST request
        const lnReq = httpMocks.createRequest({ method: 'GET', url: '/api/listScores' });
        const lnRes = httpMocks.createResponse();
        // call our function to execute the request and fill in the response
        (0, routes_1.listScores)(lnReq, lnRes);
        // check that the request was successful
        assert.strictEqual(lnRes._getStatusCode(), 200);
        // and the response data is as expected
        assert.deepEqual(lnRes._getData(), { scores: compare });
        const saveReq = httpMocks.createRequest({ method: 'POST', url: '/api/addScore',
            body: { deck: "wow", player: "other stuff", score: 122 } });
        compare.push({ deck: "wow", player: "other stuff", score: 122 });
        const saveRes = httpMocks.createResponse();
        (0, routes_1.addScore)(saveReq, saveRes);
        const lnReq1 = httpMocks.createRequest({ method: 'GET', url: '/api/listScores' });
        const lnRes1 = httpMocks.createResponse();
        (0, routes_1.listScores)(lnReq1, lnRes1);
        assert.strictEqual(lnRes1._getStatusCode(), 200);
        assert.deepEqual(lnRes1._getData(), { scores: compare });
        const saveReq2 = httpMocks.createRequest({ method: 'POST', url: '/api/addScore',
            body: { deck: "second", player: "me", score: 12 } });
        compare.push({ deck: "second", player: "me", score: 12 });
        const saveRes2 = httpMocks.createResponse();
        (0, routes_1.addScore)(saveReq2, saveRes2);
        const lnReq2 = httpMocks.createRequest({ method: 'GET', url: '/api/listScores' });
        const lnRes2 = httpMocks.createResponse();
        (0, routes_1.listScores)(lnReq2, lnRes2);
        assert.strictEqual(lnRes2._getStatusCode(), 200);
        assert.deepEqual(lnRes2._getData(), { scores: compare });
        const saveReq3 = httpMocks.createRequest({ method: 'POST', url: '/api/addScore',
            body: { deck: "third", player: "wow", score: 11 } });
        compare.push({ deck: "third", player: "wow", score: 11 });
        const saveRes3 = httpMocks.createResponse();
        (0, routes_1.addScore)(saveReq3, saveRes3);
        const lnReq3 = httpMocks.createRequest({ method: 'GET', url: '/api/listScores' });
        const lnRes3 = httpMocks.createResponse();
        (0, routes_1.listScores)(lnReq3, lnRes3);
        assert.strictEqual(lnRes3._getStatusCode(), 200);
        assert.deepEqual(lnRes3._getData(), { scores: compare });
        (0, routes_1.resetTranscriptsForTesting)();
    });
});
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicm91dGVzX3Rlc3QuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvcm91dGVzX3Rlc3QudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBLCtDQUFpQztBQUNqQywyREFBNkM7QUFDN0MscUNBQTBHO0FBSTFHLFFBQVEsQ0FBQyxRQUFRLEVBQUU7SUFFakIsa0NBQWtDO0lBRWxDLEVBQUUsQ0FBQyxVQUFVLEVBQUU7UUFDYix5RUFBeUU7UUFDekUsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGFBQWEsQ0FDaEMsRUFBQyxNQUFNLEVBQUUsTUFBTSxFQUFFLEdBQUcsRUFBRSxlQUFlLEVBQUUsSUFBSSxFQUFFLEVBQUMsSUFBSSxFQUFFLFlBQVksRUFBRSxLQUFLLEVBQUUsQ0FBQyxFQUFDLEVBQUMsQ0FBQyxDQUFDO1FBQ2xGLE1BQU0sSUFBSSxHQUFHLFNBQVMsQ0FBQyxjQUFjLEVBQUUsQ0FBQztRQUN4QyxJQUFBLGlCQUFRLEVBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRXJCLE1BQU0sQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxFQUFFLEdBQUcsQ0FBQyxDQUFDO1FBQy9DLE1BQU0sQ0FBQyxlQUFlLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRSxFQUNsQywyREFBMkQsQ0FBQyxDQUFDO1FBRWpFLDBFQUEwRTtRQUMxRSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUNoQyxFQUFDLE1BQU0sRUFBRSxNQUFNLEVBQUUsR0FBRyxFQUFFLGVBQWUsRUFBRSxJQUFJLEVBQUUsRUFBQyxNQUFNLEVBQUUsR0FBRyxFQUFFLEtBQUssRUFBRSxDQUFDLEVBQUMsRUFBQyxDQUFDLENBQUM7UUFDM0UsTUFBTSxJQUFJLEdBQUcsU0FBUyxDQUFDLGNBQWMsRUFBRSxDQUFDO1FBQ3hDLElBQUEsaUJBQVEsRUFBQyxJQUFJLEVBQUUsSUFBSSxDQUFDLENBQUM7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
import express, { Express } from "express";
import { addScore, addDeck, loadDeck, listDecks, listScores } from './routes';
import bodyParser from 'body-parser';


// Configure and start the HTTP server.
const port: number = 8088;
const app: Express = express();
app.use(bodyParser.json());
app.post("/api/addScore", addScore);
app.post("/api/addDeck", addDeck);
app.get("/api/loadDeck", loadDeck);
app.get("/api/listDecks", listDecks);
app.get("/api/listScores", listScores);


app.listen(port, () => console.log(`Server listening on ${port}`));

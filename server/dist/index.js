"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routes_1 = require("./routes");
const body_parser_1 = __importDefault(require("body-parser"));
// Configure and start the HTTP server.
const port = 8088;
const app = (0, express_1.default)();
app.use(body_parser_1.default.json());
app.post("/api/addScore", routes_1.addScore);
app.post("/api/addDeck", routes_1.addDeck);
app.get("/api/loadDeck", routes_1.loadDeck);
app.get("/api/listDecks", routes_1.listDecks);
app.get("/api/listScores", routes_1.listScores);
app.listen(port, () => console.log(`Server listening on ${port}`));
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiaW5kZXguanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi9zcmMvaW5kZXgudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFBQSxzREFBMkM7QUFDM0MscUNBQThFO0FBQzlFLDhEQUFxQztBQUdyQyx1Q0FBdUM7QUFDdkMsTUFBTSxJQUFJLEdBQVcsSUFBSSxDQUFDO0FBQzFCLE1BQU0sR0FBRyxHQUFZLElBQUEsaUJBQU8sR0FBRSxDQUFDO0FBQy9CLEdBQUcsQ0FBQyxHQUFHLENBQUMscUJBQVUsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDO0FBQzNCLEdBQUcsQ0FBQyxJQUFJLENBQUMsZUFBZSxFQUFFLGlCQUFRLENBQUMsQ0FBQztBQUNwQyxHQUFHLENBQUMsSUFBSSxDQUFDLGNBQWMsRUFBRSxnQkFBTyxDQUFDLENBQUM7QUFDbEMsR0FBRyxDQUFDLEdBQUcsQ0FBQyxlQUFlLEVBQUUsaUJBQVEsQ0FBQyxDQUFDO0FBQ25DLEdBQUcsQ0FBQyxHQUFHLENBQUMsZ0JBQWdCLEVBQUUsa0JBQVMsQ0FBQyxDQUFDO0FBQ3JDLEdBQUcsQ0FBQyxHQUFHLENBQUMsaUJBQWlCLEVBQUUsbUJBQVUsQ0FBQyxDQUFDO0FBR3ZDLEdBQUcsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLEdBQUcsRUFBRSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsdUJBQXVCLElBQUksRUFBRSxDQUFDLENBQUMsQ0FBQyJ9
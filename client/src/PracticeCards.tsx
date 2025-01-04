import React, { Component, MouseEvent, ChangeEvent } from "react";
import { card, parseCard } from './card';
import "./style.css";

type PracticeProps = {
  initDeck: string, // name of the deck currently being practiced
  onScore: () => void  // callback function to go to score page
}
  
type PracticeState = {
  correct: number,  // number of correct cards so far
  currCard: number,  // number of cards that were practiced
  totalCards: number,  // number of total cards in the deck
  isFront: boolean,  // is the player viewing the front or back of the card
  cards: card[] | undefined,  // array of all the cards in the deck
  deckName: string,  // name of the deck being practiced
  playerName: string  // name of the player
}

/** Displays the UI of the Practice Card page. */
export class PracticeCards extends Component<PracticeProps, PracticeState> {

  constructor(props: PracticeProps) {
    super(props);
    this.state = {correct: 0, currCard: 0, totalCards: -1, isFront: true, 
                  cards: undefined, deckName: this.props.initDeck, playerName: ""};
  }

  // load in the cards associated with the deck name
  componentDidMount = (): void => {
    this.doRefreshClick();  // initiate a fetch to load in our list of cards
  };

  // renders UI of the page
  render = (): JSX.Element => {
    if (this.state.cards === undefined) {
      return(<div>loading....</div>);
    } else if (this.state.currCard === this.state.totalCards) {
      // they finished practicing
      return (
        <div>
          <h1>Congrats! You've reached the end of deck.</h1>
          <h2>Deck Name: {this.state.deckName}</h2>
          <h3>Correct: {this.state.correct}</h3>
          <h3>Incorrect: {this.state.currCard - this.state.correct}</h3>
          <p>Your Name:
            <input type="text"
              value={this.state.playerName}
              onChange={this.doNameChange} />
            <button type="button" onClick={this.doFinishClick}>Finish</button>
          </p>
        </div>
      );
    } else if (this.state.isFront) {
      // they're looking at the front of the card
      return (
        <div>
          <h1>Let's Practice {this.state.deckName}!</h1>
          <h3>Correct: {this.state.correct}</h3>
          <h3>Incorrect: {this.state.currCard - this.state.correct}</h3>
          <p className="card">{this.state.cards[this.state.currCard].front}</p>
          <p>You've completed {this.state.currCard} cards out of {this.state.totalCards}.</p>
          <button type="button" onClick={this.doFlipClick}>See Back</button>
          <br></br>
          <p>WARNING: all progress will be lost if page is refreshed...</p>
        </div>
      );
    } else {
      // they're looking at the back of the card
      return (
        <div>
          <h1>Let's Practice {this.state.deckName}!</h1>
          <h3>Correct: {this.state.correct}</h3>
          <h3>Incorrect: {this.state.currCard - this.state.correct}</h3>
          <p className="card">{this.state.cards[this.state.currCard].back}</p>
          <p>You've completed {this.state.currCard} cards out of {this.state.totalCards}.</p>
          <button type="button" onClick={this.doFlipClick}>See Front</button>
          <button type="button" onClick={this.doCorrectClick}>Correct</button>
          <button type="button" onClick={this.doIncorrectClick}>Incorrect</button>
          <br></br>
          <p>WARNING: all progress will be lost if page is refreshed...</p>
        </div>
      );
    }
  };

  // Make fetch request to load in the deck
  doRefreshClick = (): void => {
    const url = "/api/loadDeck?name=" + encodeURIComponent(this.props.initDeck);
    fetch(url)
      .then(this.doLoadResp)
      .catch(() => this.doLoadError("failed to connect to server"));
  }

  // parses json response, load errors if unsuccessful
  doLoadResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((val) => {
        const cards = this.doParseCardArray(val.cardset);
        if (cards !== undefined) {
          this.setState({cards: cards, totalCards: cards.length});
        }
      })
        .catch(() => this.doLoadError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doLoadError)
        .catch(() => this.doLoadError("400 response is not text"));
    } else {
      this.doLoadError(`bad status code ${res.status}`);
    }
  }

  // error processor for /loadDeck fetch call
  doLoadError = (msg: string): void => {
    console.error(`Error fetching /loadDeck: ${msg}`);
  }
  
  // update user input after every keystroke
  doNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({playerName: evt.target.value});
  };

  // "flips" the card by setting the state of isFront
  doFlipClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    if (this.state.isFront) {
      this.setState({isFront: false});
    } else {
      this.setState({isFront: true});
    }
  };

  // update state of number of correct cards
  doCorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const curr: number = this.state.currCard + 1;
    const currCorrect: number = this.state.correct + 1;
    this.setState({currCard: curr, correct: currCorrect, isFront: true});
  };

  // update state of number of total cards seen
  doIncorrectClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const curr: number = this.state.currCard + 1;
    this.setState({currCard: curr, isFront: true});
  };

  // makes fetch call to record this player's performance (score)
  // which will be diplayed in SeeScore
  doFinishClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    const finalScore: number = Math.round(100*(this.state.correct / this.state.totalCards));
    const currName = this.state.playerName.trim();
    if (currName.length === 0) {
      alert("What is your name?");
      return;
    }
    const body = {player: this.state.playerName, deck: this.state.deckName, score: finalScore};
    fetch("/api/addScore", {
      method: "POST", body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"} })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect to server"));
  };

  // checks that we successfully saved the score record
  // outputs error if unsuccessful
  doAddResp = (res: Response): void => {
    if (res.status === 200) {
      // saved successfully!
      res.json().then((val) => {
        if (val.success) {
          // this was a new file that was not on server previously
          // add to list of files to be rendered!
          this.props.onScore();
        } else {
          // should never enter this branch
          this.doAddError(`this should not be possible`);
        }
      })
        .catch(() => this.doAddError("unable to update state"));
    } else if (res.status === 400) {
      res.text().then(this.doAddError)
         .catch(() => this.doAddError("400 response missing param / is not text"));
    } else {
      this.doAddError(`bad status code ${res.status}`);
    }
  };

  // error processor for /addScore fetch call
  doAddError = (msg: string): void => {
    console.error(`Error fetching /addScore: ${msg}`);
  }

   /**
   * Parses unknown data into an array of cards. Will log an error and return
   * undefined if it is not an array of Items.
   * @param val unknown data to parse into an array of Items
   * @return card[] if val is an array of card and undefined otherwise
   */
  doParseCardArray = (val: unknown): undefined | card[] => {
    if (!Array.isArray(val)) {
      console.error("not an array", val);
      return undefined;
    }
    const cards: card[] = [];
    for (const curr of val) {
      const card = parseCard(curr);
      if (card === undefined) {
        return;
      } else {
        console.log(card.front);
        cards.push(card);
      }
    }
    return cards;
  };
}

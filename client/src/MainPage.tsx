import React, { Component, MouseEvent } from "react";
// import { isRecord } from './record';

type MainProps = {
  onCreate: () => void,  // callback function to go to create page
  onScore: () => void, // callback function to view scores
  onLoadDeck:(deck: string) => void  // callback function to let the app know
                                     // which deck we're going to load to practice
}

type MainPageState = {
  deckList: string[];  // list of available decks saved on the server
}

/** Displays the UI of the Flashcard application. */
export class MainPage extends Component<MainProps, MainPageState> {

  constructor(props: MainProps) {
    super(props);
    this.state = {deckList: []};
  }
  
  componentDidMount = (): void => {
    this.doRefreshTimeout();  // initiate a fetch to update our list of deck names
  }; 

  // renders UI of the page
  render = (): JSX.Element => {
    return (
      <div>
        <h2>Practice a deck below!</h2>
        {this.renderDeckNames()}
        <br></br>
        <button type="button" 
                onClick={this.doCreateClick}>I want to make a new deck.</button>
        <button type="button"
                onClick={this.doScoreClick}>See past scores.</button>
      </div>
    );
  };
  
  // renders list of names of decks saved on the server
  renderDeckNames = (): JSX.Element => {
    if (this.state.deckList.length === 0) {
      return <p>--No previously saved decks---</p>
    } else {
      const decks: JSX.Element[] = [];
      for (const deck of this.state.deckList) {
        decks.push(
          <li key={deck}>
            <a href="#" onClick={() => this.props.onLoadDeck(deck)}>{deck}</a>
          </li>
        )
      }
      return <div>{decks}</div>;
    }
  };
  
  // makes listDeck fetch call
  doRefreshTimeout = (): void => {
    fetch("/api/listDecks")
        .then(this.doListResp)
        .catch(() => this.doListError("failed to connect to server"));
  }

  // process response from listDeck fetch call
  // set state of deckNames if successful
  doListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((val) => {
        const decks = this.doParseDecksArray(val.deckNames); // parse response
        if (decks !== undefined) {
          this.setState({deckList: decks});
        }
      })
        .catch(() => this.doListError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doListError)
        .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code ${res.status}`);
    }
  }

  // error processor for /listDecks fetch call
  doListError = (msg: string): void => {
    console.error(`Error fetching /listDecks: ${msg}`);
  }

  // Use callback function to go to create page
  doCreateClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onCreate();
  };

  // Use callback function to go to create page
  doScoreClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onScore();
  };

  /**
   * Parses unknown data into an array of strings. Will log an error and return
   * undefined if it is not an array of Items.
   * @param val unknown data to parse into an array of Items
   * @return string[] if val is an array of strings and undefined otherwise
   */
  doParseDecksArray = (val: unknown): undefined | string[] => {
    if (!Array.isArray(val)) {
      console.error("not an array", val);
      return undefined;
    }

    const decks: string[] = [];
    for (const deck of val) {
      if (typeof deck !== 'string') {
        console.error("item.name is missing or invalid", deck);
        return undefined;
      } else {
        decks.push(deck);
      }
    }
    return decks;
  };


}

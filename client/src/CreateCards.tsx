import React, { Component, ChangeEvent, MouseEvent } from "react";
import "./style.css";

type CreateProps = {
  onBack: () => void  // callback function to go back to main page
}

type CreateState = {
  deckName: string,  // keeps track of name of card deck inputted
  deckContent: string,  // keeps track of content of card inputted
}

/** Displays the UI of the card creation page. */
export class CreateCards extends Component<CreateProps, CreateState> {

  constructor(props: CreateProps) {
    super(props);
    this.state = { deckName: "", deckContent: "" };
  }
  
  // displays UI of create page
  render = (): JSX.Element => {
    return (
      <div>
        <h2>Let's Make a New Deck of Notecards</h2>
        <p>--------------------------------------------------------------</p>
        <p>Rules:</p> 
          <li>Format: front_of_card|back_of_card</li>
          <li>The contents for each card must be on a new line.</li>
          <li>Each deck must have a name and contain at least one card.</li>
          <li>Each new deck must have a unique name.</li>
        <p>-------------------------------------------------------------</p>
        <p>Deck Name:
            <input type="text"
                   value={this.state.deckName}
                   onChange={this.doDeckNameChange} />
        </p>
        <div>
            <label htmlFor="textbox">Input your cards in the textbox below:</label>
            <br/>
            <textarea id="textbox" rows={5} cols={40} value={this.state.deckContent}
                      onChange={this.doDeckContentChange}></textarea>
        </div>
        <button type="button" onClick={this.doAddClick}>Make new deck</button>
        <button type="button" onClick={this.doBackClick}>Go Back</button>
      </div>
    );
  };

  // update user input after every keystroke
  doDeckNameChange = (evt: ChangeEvent<HTMLInputElement>): void => {
    this.setState({deckName: evt.target.value});
  };

  // update user input after every keystroke
  doDeckContentChange = (evt: ChangeEvent<HTMLTextAreaElement>): void => {
    this.setState({deckContent: evt.target.value});
  };

  // uses callback function to go back to start page
  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBack();
  };

  // checks that user inputted valid inputs for deck name and content
  // will have alert pop-ups if not
  // if everything looks good- makes the addDeck fetch call
  doAddClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    // TODO: implement
    const currName = this.state.deckName.trim();
    const currContent = this.state.deckContent.trim();
    if (currName.length === 0 || currContent.length === 0) {
      // alert user if no deck name was given
      // doesn't update state
      alert("Deck must have a name AND contain at least one card.");
      return;
    }
    
    const body = {name: currName, content: currContent};
    fetch("/api/addDeck", {
      method: "POST", body: JSON.stringify(body),
      headers: {"Content-Type": "application/json"} })
      .then(this.doAddResp)
      .catch(() => this.doAddError("failed to connect to server"));
  };

  // process response from fetch call
  // will have alert pop-ups if content was incorrectly formatted
  // returns to main page if successfull using callback function
  doAddResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((val) => {
        if (val.saved === 1) {
          // tried to make deck with existing name
          alert("Deck with the same name already exists, please pick a different name!");
          return;
        } else if (val.saved === 2) {
          alert("One or more of the given cards were not formatted correctly :(");
          return;
        } else if (val.saved === 3) {
          // deck was actaully saved successfully!!
          this.props.onBack();
        }
      })
    }
  };

  // error processor for /addDeck fetch call
  doAddError = (msg: string): void => {
    console.error(`Error fetching /addDeck: ${msg}`);
  };

}

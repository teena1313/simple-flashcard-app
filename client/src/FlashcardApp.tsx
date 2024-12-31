import React, { Component } from "react";
import { MainPage } from './MainPage';
import { CreateCards } from './CreateCards';
import { PracticeCards } from './PracticeCards';
import { SeeScore } from './SeeScore';

// types of pages possible in the FlashcardApp
type Page = {kind: "main"} | {kind: "create"} | 
            {kind: "practice", deckName: string} | {kind: "score"};

type FlashcardAppState = {
  page: Page; // type of current page
}

/** Displays the UI of the Flashcard application. */
export class FlashcardApp extends Component<{}, FlashcardAppState> {

  constructor(props: {}) {
    super(props);
    this.state = {page: {kind: "main"}};
  }
  
  // displays the correct page based on the state
  render = (): JSX.Element => {
    if (this.state.page.kind === "main") {
      return <MainPage onCreate={this.doBackClick} onLoadDeck={this.doPracticeClick} onScore={this.doScoreClick}/>;
    } else if (this.state.page.kind === "create") {
      return <CreateCards onBack={this.doBackClick}/>;
    } else if (this.state.page.kind === "practice") {
      return <PracticeCards initDeck={this.state.page.deckName} 
                            onScore={this.doBackClick} />;
    } else { // kind = score
      return <SeeScore onBack={this.doBackClick}/>;
    }
  };

  // handles when user switches between pages
  doBackClick = (): void => {
    if (this.state.page.kind === "practice") {
      this.setState({page: {kind: "score"}});
    } else if (this.state.page.kind === "main") {
      this.setState({page: {kind: "create"}});
    } else {
      this.setState({page: {kind: "main"}});
    }
  };

  doScoreClick = (): void => {
    this.setState({page: {kind: "score"}});
  }

  // handles when user clicks on a deck name to practice
  doPracticeClick = (deck: string): void => {
    this.setState({page: {kind: "practice", deckName: deck}});
  };

}
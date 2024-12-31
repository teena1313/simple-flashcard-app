import React, { Component, MouseEvent } from "react";
import { scoreRecord, parseScoreRecord } from './scoreRecord'

type ScoreProps = {
  onBack: () => void  // callback function to go back to main page
}

type ScoreState = {
  scores: scoreRecord[] | undefined  // scores of previous players to be displayed
}

/** Displays the UI of the Scores page. */
export class SeeScore extends Component<ScoreProps, ScoreState> {

  constructor(props: ScoreProps) {
    super(props);

    this.state = {scores: undefined};
  }

  componentDidMount = (): void => {
    this.doRefreshTimeout();  // initiate a fetch to update our list of scores
  };
  
  // displays UI of page
  render = (): JSX.Element => {
    return (
      <div>
        <h2>Scores</h2>
        {this.renderScores()}
        <br></br>
        <button type="button" 
                onClick={this.doBackClick}>Go Back to Main.</button>
      </div>
    );
  };

  // displays list of scores
  renderScores= (): JSX.Element => {
    if (this.state.scores === undefined) {
      return <p>Loading Scores...</p>
    } else {
      const scoreRecs: JSX.Element[] = [];
      for (const s of this.state.scores) {
        scoreRecs.push(
          <li>
            Player [{s.player}] scored <b>{s.score}</b> on: {s.deck}
          </li>
        );
      }
      return <div>{scoreRecs}</div>;
    }  
  };

  // makes listScores fetch call
  doRefreshTimeout = (): void => {
    fetch("/api/listScores")
      .then(this.doListResp)
      .catch(() => this.doListError("failed to connect to server"));
  }

  // Called with the response from a request to /api/list
  doListResp = (res: Response): void => {
    if (res.status === 200) {
      res.json().then((val) => {
        const ret_scores = this.doParseScoreArray(val.scores); // get file names
        if (ret_scores !== undefined) {
          this.setState({scores: ret_scores}); // set state
        }
      })
          .catch(() => this.doListError("200 response is not valid JSON"));
    } else if (res.status === 400) {
      res.text().then(this.doListError)
          .catch(() => this.doListError("400 response is not text"));
    } else {
      this.doListError(`bad status code ${res.status}`);
    }
  };

  // error processor for /listScores fetch call
  doListError = (msg: string): void => {
    console.error(`Error fetching /listScores: ${msg}`);
  }

  // uses callback function to go back to main page
  doBackClick = (_evt: MouseEvent<HTMLButtonElement>): void => {
    this.props.onBack();
  };

  /**
 * Parses unknown data into an array of scoreRecords. Will log an error and return
 * undefined if it is not an array of Items.
 * @param val unknown data to parse into an array of Items
 * @return scoreRecord[] if val is an array of scoreRecord and undefined otherwise
 */
  doParseScoreArray = (val: unknown): undefined | scoreRecord[] => {
    if (!Array.isArray(val)) {
      console.error("not an array", val);
      return undefined;
    }

    const scores: scoreRecord[] = [];
    for (const curr of val) {
      const score = parseScoreRecord(curr);
      if (score === undefined) {
        return;
      } else {
        scores.push(score);
      }
    }
    return scores;
  };
}

import { isRecord } from "./record";


// Description of an individual score record
// RI: score >= 0
export type scoreRecord = {
  readonly username: string,
  readonly deckname: string,
  readonly score: number
};


/**
 * Parses unknown data into a scoreRecord. Will log an error and return undefined
 * if it is not a valid scoreRecord.
 * @param val unknown data to parse into an scoreRecord
 * @return scoreRecord if val is a valid scoreRecord and undefined otherwise
 */
export const parseScoreRecord = (val: unknown): undefined | scoreRecord => {
  if (!isRecord(val)) {
    console.error("not a scoreRecord", val)
    return undefined;
  }

  if (typeof val.username !== "string") {
    console.error("not a scoreRecord: missing 'player'", val)
    return undefined;
  }

  if (typeof val.deckname !== "string") {
    console.error("not a scoreRecord: missing 'deck'", val)
    return undefined;
  }

  if (typeof val.score !== "number") {
    console.error("not a scoreRecord: missing 'score'", val)
    return undefined;
  }

  return {username: val.username, deckname: val.deckname, score: val.score};
};

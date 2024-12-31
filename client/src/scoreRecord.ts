import { isRecord } from "./record";


// Description of an individual score record
// RI: score >= 0
export type scoreRecord = {
  readonly player: string,
  readonly deck: string,
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

  if (typeof val.player !== "string") {
    console.error("not a scoreRecord: missing 'player'", val)
    return undefined;
  }

  if (typeof val.deck !== "string") {
    console.error("not a scoreRecord: missing 'deck'", val)
    return undefined;
  }

  if (typeof val.score !== "number") {
    console.error("not a scoreRecord: missing 'score'", val)
    return undefined;
  }

  return {
    player: val.player, deck: val.deck, score: val.score
  };
};

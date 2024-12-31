import { isRecord } from "./record";


// Description of an individual card
export type card = {
  readonly front: string,
  readonly back: string,
};


/**
 * Parses unknown data into an card. Will log an error and return undefined
 * if it is not a valid card.
 * @param val unknown data to parse into an card
 * @return card if val is a valid card and undefined otherwise
 */
export const parseCard = (val: unknown): undefined | card => {
  if (!isRecord(val)) {
    console.error("not a card", val)
    return undefined;
  }

  if (typeof val.front !== "string") {
    console.error("not a card: missing 'front'", val)
    return undefined;
  }

  if (typeof val.back !== "string") {
    console.error("not a card: missing 'back'", val)
    return undefined;
  }

  return {front: val.front, back: val.back};
};

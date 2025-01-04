/**
 * Determines whether the given value is a record.
 * @param val the value in question
 * @return true if the value is a record and false otherwise
 */
export const isRecord = (val: unknown): val is Record<string, unknown> => {
  return val !== null && typeof val === "object";
};

/**
 * Parses unknown data into a string. Will log an error and return undefined
 * if it is not a valid record.
 * @param val unknown data to parse into an card
 * @return card if val is a valid card and undefined otherwise
 */
export const parseRecord = (val: unknown): undefined | string => {
  if (!isRecord(val)) {
    console.error("not a card", val)
    return undefined;
  }
  if (typeof val.col !== "string") {
    console.error("not a card: missing 'front'", val)
    return undefined;
  }

  return val.col;
};
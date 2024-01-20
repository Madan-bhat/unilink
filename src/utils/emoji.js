export const containsOnlyEmojis = text => {
  // This regular expression matches a variety of emojis
  const emojiRegex =
    /[\u{1F300}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}]/u;

  // Check if the text contains only emojis
  return [...text].every(char => emojiRegex.test(char));
};

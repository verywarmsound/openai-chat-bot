import { stemmer } from "stemmer";
// import { lemmatize } from "wink-lemmatizer";
import natural from "natural";
import fs from "fs";

// Read the contents of the original file
fs.readFile("result.txt", "utf8", (err, data) => {
  if (err) throw err;

  // Split the contents into an array of words
  // const words = data.split(/\s+/).join(" ");
  const lowerCaseText = data.toLowerCase();
  const noPunctText = lowerCaseText
    .replace(/[^\w\s]|_/g, "")
    .replace(/\s+/g, " ");
  const stopWords = [
    "the",
    "and",
    "a",
    "an",
    "in",
    "of",
    "to",
    "that",
    "for",
    "is",
    "with",
    "on",
    "by",
    "at",
    "as",
    "you",
    "your",
    "be",
    "are",
    "this",
    "or",
    "it",
    "not",
    "from",
    "but",
    "can",
    "has",
    "if",
    "we",
    "they",
    "all",
    "will",
    "which",
    "their",
    "more",
    "about",
    "our",
    "so",
    "when",
    "who",
    "out",
    "up",
    "than",
    "what",
    "do",
    "any",
    "just",
    "been",
    "my",
    "me",
    "had",
    "one",
    "has",
    "other",
    "his",
    "her",
    "he",
    "she",
    "it",
    "its",
    "their",
    "there",
    "these",
    "those",
    "was",
    "were",
    "would",
    "could",
    "should",
    "must",
    "may",
    "might",
    "shall",
    "can",
    "will",
    "ought",
    "need",
    "dare",
    "used",
    "get",
    "gets",
    "getting",
    "got",
    "been",
    "being",
  ]; // list of stop words
  const noStopWordsText = noPunctText
    .split(" ")
    .filter((word) => !stopWords.includes(word))
    .join(" ");

  // const stemmedText = noStopWordsText
  //   .split(" ")
  //   .map((word) => stemmer(word))
  //   .join(" ");
  // const lemmatizedText = lemmatize.adjective(stemmedText);
  const tokenizer = new natural.WordTokenizer();
  const tokens = tokenizer.tokenize(noStopWordsText);
  // // Remove the stop words
  // const filteredWords = words.filter(
  //   (word) => !stopWords.includes(word.toLowerCase())
  // );

  // // Join the remaining words back into a string
  const filteredData = tokens.join(" ");

  // Write the filtered data to the new file
  fs.writeFile("results2.txt", noStopWordsText, (err) => {
    if (err) throw err;
    console.log("The file has been saved!");
  });
});

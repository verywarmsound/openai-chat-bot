import readline from "readline";
import fs from "fs";

const rl = readline.createInterface({
  input: fs.createReadStream("result.txt"),
  crlfDelay: Infinity,
});

let prompt = "";
let examples = [];

rl.on("line", (line) => {
  // Skip empty lines
  if (line.trim() === "") {
    return;
  }

  // Split the line into the text and completion parts
  const [text, completion] = line.split("\t");

  // Use the first line as the prompt
  if (prompt === "") {
    prompt = text;
  } else {
    // Add the example to the examples array
    examples.push({
      text: text,
      completion: completion,
    });
  }
});

rl.on("close", () => {
  // Create the data object
  const data = {
    prompt: prompt,
    examples: examples,
  };

  // Write the data to a JSON file
  fs.writeFileSync("file2.json", JSON.stringify(data));
});

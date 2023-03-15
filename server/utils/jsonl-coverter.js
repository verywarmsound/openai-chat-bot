// const { exec } = require('child_process');
import { exec } from "child_process";

// Replace with your own API key
const API_KEY = "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";

// The path to your JSON file
const jsonFilePath = "file2.json";

// The path to the new JSONL file
const jsonlFilePath = "results.jsonl";

// The OpenAI CLI command to convert the JSON file to JSONL
const command = `jq -c . ${jsonFilePath} | openai tools fine_tunes.prepare_data -f ${jsonFilePath} --OPENAI_API_KEY=${API_KEY}`;
// const command = `jq -c . ${jsonFilePath} | openai api files upload - --purpose=export --jsonl --api_key=${API_KEY} > ${jsonlFilePath}`;

exec(command, (error, stdout, stderr) => {
  if (error) {
    console.error(`exec error: ${error}`);
    return;
  }
  console.log(`stdout: ${stdout}`);
  console.error(`stderr: ${stderr}`);
});

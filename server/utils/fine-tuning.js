import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  apiKey: "",
  // apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// const fileContents = fs.readFileSync(
//     path.join(__dirname, "json_lines.jl"),
//     "utf8"
// );
const fileContents = fs.readFileSync("json_lines.jl", "utf8");

const fileBuffer = Buffer.from(fileContents);

// Create a new File object from the Buffer
// const file = new File([fileBuffer], "json_lines.jl", { type: "jsonl" });

// Call the fineTune method to start the fine-tuning process
await openai
  .createFile("json_lines.jl", "fine-tune")
  .then((result) => {
    console.log(result);
  })
  .catch((err) => {
    console.error(err);
  });

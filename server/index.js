import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { Configuration, OpenAIApi } from "openai";
import dotenv from "dotenv";
import fs from "fs";
import path from "path";

const configuration = new Configuration({
  apiKey: "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",
  // apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

const app = express();
app.use(cors());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const PORT = process.env.PORT || 3001;
dotenv.config();
console.log(process.env.OPENAI_API_KEY);
// create a post route
app.post("/openai-api", async (req, res) => {
  const data = req.body;

  console.log(process.env);
  // Set up your fine-tuned language model ID
  const modelId = "YOUR_MODEL_ID";
  console.log(process.env.OPENAI_API_KEY);
  const prompt = `
  If the question is not related to yacht, say "Sorry, the question is not related to the yachting field."
  `;
  const hasYacht = data.query.toLowerCase().includes("yacht");
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt: `${hasYacht ? "" : prompt} ${data.query}`,
    temperature: 0.7,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
    max_tokens: 100,
    n: 1,
    stop: null,
  });

  console.log(response.data);
  const trimmedResponse = response.data.choices[0].text.trim();
  const cleanedResponse = trimmedResponse.replace(/\n\n/g, "");
  res.json(cleanedResponse);
});

app.post("/openai-api/train", async (req, res) => {
  const data = req.body;
  __dirname = path.resolve();
  const fileContents = fs.readFileSync(
    path.join(__dirname, "json_lines.jl"),
    "utf8"
  );
  // const fileContents = fs.readFileSync("json_lines.jl", "utf8");

  // Set up the fine-tuning parameters
  const fineTuneArgs = {
    model: "text-davinci-002",
    dataset: {
      data: fileContents,
      data_type: "jsonl",
    },
    epochs: 3,
    batch_size: 32,
    learning_rate: 1e-5,
    validation_split: 0.1,
    prompt_loss_weight: 0,
  };
  const fileBuffer = Buffer.from(fileContents);

  // Create a new File object from the Buffer
  const file = new File([fileBuffer], "json_lines.jl", { type: "jsonl" });

  // Call the fineTune method to start the fine-tuning process
  await openai
    .createFile(file, "fine-tune")
    .then((result) => {
      console.log(result);
    })
    .catch((err) => {
      console.error(err);
    });
});

app.listen(PORT, () => {
  console.log(`Node server listening at http://localhost:${PORT}`);
});

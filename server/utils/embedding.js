import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

// Set up your OpenAI API credentials
const apiKey = "";
const configuration = new Configuration({ apiKey: apiKey });
const openai = new OpenAIApi(configuration);

// Read file contents into a string
const filePath = "result.txt";
const content = fs.readFileSync(filePath, "utf8");

// Define the maximum number of tokens for each chunk
const maxTokensPerChunk = 2048;

// Split the input text into chunks
// const chunks = content.match(new RegExp(`.{1,${maxTokensPerChunk}}`, "g"));
const chunks = [];
let currentChunk = "";
let currentChunkLength = 0;
const sentences = content.split(".");
// Split the content into chunks based on the maximum number of tokens
for (let i = 0; i < sentences.length; i++) {
  const sentence = sentences[i].trim();
  if (sentence) {
    if (currentChunkLength + sentence.split(" ").length <= maxTokensPerChunk) {
      currentChunk += ` ${sentence}`;
      currentChunkLength += sentence.split(" ").length;
    } else {
      chunks.push(currentChunk.trim());
      currentChunk = sentence;
      currentChunkLength = sentence.split(" ").length;
    }
  }
}
if (currentChunk) {
  chunks.push(currentChunk.trim());
}

// Define the parameters for the embedding request
const parameters = {
  model: "text-davinci-002",
  max_tokens: maxTokensPerChunk,
  return_embedding: true,
};

// Use the OpenAI API to generate the embeddings for each chunk of the input text

const csvData = [];

for (let i = 0; i < chunks.length; i++) {
  const chunk = chunks[i];
  const embeddingResponse = await openai.createEmbedding({
    model: "text-embedding-ada-002",
    input: chunk,
  });
  const [{ embedding }] = embeddingResponse.data.data;
  csvData.push({
    content: chunk,
    embedding: embedding.join(","),
  });
}
fs.writeFileSync(
  "result.csv",
  "content,embedding\n" +
    csvData.map((row) => `"${row.content}","${row.embedding}"`).join("\n")
);

// owerrwrire

// Split the content into chunks based on the maximum number of tokens
// const chunks = [];
// let currentChunk = '';
// let currentChunkLength = 0;
// const sentences = content.split('.');
// for (let i = 0; i < sentences.length; i++) {
//   const sentence = sentences[i].trim();
//   if (sentence) {
//     if (currentChunkLength + sentence.split(' ').length <= maxTokensPerChunk) {
//       currentChunk += ` ${sentence}`;
//       currentChunkLength += sentence.split(' ').length;
//     } else {
//       chunks.push(currentChunk.trim());
//       currentChunk = sentence;
//       currentChunkLength = sentence.split(' ').length;
//     }
//   }
// }
// if (currentChunk) {
//   chunks.push(currentChunk.trim());
// }

// Process each chunk separately and store the results in a CSV file
// const csvData = [];
// for (let i = 0; i < chunks.length; i++) {
//   const chunk = chunks[i];
//   const embeddingResponse = await openai.createEmbedding({
//     model: "text-embedding-ada-002",
//     input: chunk
//   });
//   const [{ embedding }] = embeddingResponse.data.data;
//   csvData.push({
//     content: chunk,
//     embedding: embedding.join(',')
//   });
// }
// fs.writeFileSync('path/to/result.csv', 'content,embedding\n' + csvData.map(row => `"${row.content}","${row.embedding}"`).join('\n'));
// const embeddings = [];
// chunks.forEach(chunk => {
//     parameters.document = chunk;
//     openai.completions.create(parameters)
//         .then(response => {
//             const chunkEmbeddings = response.choices[0].text;
//             embeddings.push(chunkEmbeddings);
//         })
//         .catch(error => {
//             console.log(error);
//         });
// });

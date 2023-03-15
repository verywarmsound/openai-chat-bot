import { PGEssay, PGJSON } from "@/types";
import { loadEnvConfig } from "@next/env";
import { createClient } from "@supabase/supabase-js";
import fs from "fs";
import { Configuration, OpenAIApi } from "openai";

loadEnvConfig("");

const generateEmbeddings = async (text) => {
  const configuration = new Configuration({ apiKey: process.env.OPENAI_API_KEY });
  const openai = new OpenAIApi(configuration);


  for (let i = 0; i < text.length; i++) {
    const section = text[i];

    for (let j = 0; j < section.chunks.length; j++) {
      const chunk = section.chunks[j];

      const { content, content_length, content_tokens } = chunk;

      const embeddingResponse = await openai.createEmbedding({
        model: "text-embedding-ada-002",
        input: content
      });

      const [{ embedding }] = embeddingResponse.data.data;



      // Define the headers for the CSV file
      const csvWriter = createCsvWriter({
          path: 'output.csv',
          header: [
              {id: 'embedding', title: 'Embedding'},
              {id: 'content', title: 'Content'}
          ]
      });
      
      // Define the data to be written to the CSV file
      const data = [
          { embedding: embedding.join(','), content }
      ];
      
      // Write the data to the CSV file
      csvWriter.writeRecords(data)
          .then(() => console.log('Data written to CSV file successfully'));
      

      if (error) {
        console.log("error", error);
      } else {
        console.log("saved", i, j);
      }

      await new Promise((resolve) => setTimeout(resolve, 200));
    }
  }
};

(async () => {
  const book = "result.txt";

  await generateEmbeddings(book.text);
})();

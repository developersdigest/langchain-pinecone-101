// 1. Initialize a new project with: npm init -y, and create an 4 js files .env file 
// 2. npm i "@pinecone-database/pinecone@^0.0.10" dotenv@^16.0.3 langchain@^0.0.73
// 3. Obtain API key from OpenAI (https://platform.openai.com/account/api-keys)
// 4. Obtain API key from Pinecone (https://app.pinecone.io/)
// 5. Enter API keys in .env file
// Optional: if you want to use other file loaders (https://js.langchain.com/docs/modules/indexes/document_loaders/examples/file_loaders/)
import { PineconeClient } from "@pinecone-database/pinecone";
import { DirectoryLoader } from "langchain/document_loaders/fs/directory";
import { TextLoader } from "langchain/document_loaders/fs/text";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import * as dotenv from "dotenv";
import { createPineconeIndex } from "./1-createPineconeIndex.js";
import { updatePinecone } from "./2-updatePinecone.js";
import { queryPineconeVectorStoreAndQueryLLM } from "./3-queryPineconeAndQueryGPT.js";
// 6. Load environment variables
dotenv.config();
// 7. Set up variables for the filename, question, and index settings
const question = "Who is mr Gatsby?";
const indexName = "your-pinecone-index-name";
const vectorDimension = 1536;
// 8. Run the main async function
(async () => {
// 9. Initialize Pinecone client with API key and environment
  const client = new PineconeClient();
  await client.init({
    apiKey: process.env.PINECONE_API_KEY,
    environment: process.env.PINECONE_ENVIRONMENT,
  });
// 10. Check if Pinecone index exists and create if necessary
  await createPineconeIndex(client, indexName, vectorDimension);
// 11. Set up DirectoryLoader to load documents from the ./documents directory
  const loader = new DirectoryLoader("./documents", {
    ".txt": (path) => new TextLoader(path),
    ".pdf": (path) => new PDFLoader(path),
  });
  const docs = await loader.load();
// 12. Update Pinecone vector store with document embeddings
  await updatePinecone(client, indexName, docs);
// 13. Query Pinecone vector store and GPT model for an answer
  await queryPineconeVectorStoreAndQueryLLM(client, indexName, question);
})();

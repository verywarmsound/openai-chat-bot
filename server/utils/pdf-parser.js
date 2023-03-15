import fs from "fs";
import pdfjsLib from "pdfjs-dist";

const pdfUrl = '4529_Yacht_Brokerage_16_17_Module_1_.pdf';
const doc = await pdfjsLib.getDocument(pdfUrl).promise;
const totalPages = doc.numPages;
const pageTexts = [];

for (let i = 5; i <= totalPages; i++) {
  const page = await doc.getPage(i);
  const content = await page.getTextContent();
  const text = content.items.map(item => item.str).join('\n');
  pageTexts.push(text);
}

const fullText = pageTexts.join('\n');
fs.writeFileSync('result.txt', fullText);
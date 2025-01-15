import express from 'express';
import bodyParser from 'body-parser';
import { fetchEmails } from "./emailService.js";
import { summarizeAndExtractWithGemini } from "../api/geminiai.js";

const app = express();
app.use(bodyParser.json());
  
  app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
  });

  export const summarizeEmails = async (userId) => {

    try {
        const { emails } = await fetchEmails(userId);

        const summarizedEmails = await Promise.all(emails.map(async (email) => {
            const summary = await summarizeAndExtractWithGemini(email.body);
            return { ...email, summary };
          }));

          console.log('summarizedEmails with Gemini', summarizedEmails);
    } catch (error) {
        console.error('Error summarizing or extracting emails:', error);
    }
  }
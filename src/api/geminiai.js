import { gemini } from "../lib/geminiClient.js";

export async function summarizeAndExtractWithGemini(emailContent) {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });

    // Start a chat session with the model, without initial system message
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [
            {
              text: "You are an email summarizer. Summarize the email and identify any deadlines, tasks, and key points. Organize them into actionable items.",
            },
          ],
        },
      ],
    });

    // Send the email content as a message to the model
    let result = await chat.sendMessage(emailContent);

    // Retrieve and return the model's response
    const summary = result.response.text();
    console.log("Summarized email with Gemini:", summary);
    return summary.trim();
  } catch (error) {
    console.error("Error summarizing email with Gemini:", error);
    throw error;
  }
}

export async function generateTasks(text) {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Summarize the following text into 1-3 concise, actionable tasks. Each task should be in the format of "[TASK TITLE]: [ACTION] with [WHO]".
                    [TASK TITLE] Include main task name which should be the same for all tasks. Include a subtask name if applicable. Connect the two with a "->".
                    [ACTION] single verb or phrase.
                    [WHO] should be the person or people the action is being taken for. if not known, do not include.

                    Include 2 more tasks if you see fit, one of which is a email that need to be sent to the persons invloved. The other should be calendar events that need to be scheduled, subtask title for email should be "Email" and subtask title for calendar event should be "Event".
                    If you see a task that is not actionable, do not include it. Do not bold anytthing, use plain text. The text are as follows:
                    ${text}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    console.log(response.text());
    const tasks = response
      .text()
      .split("\n")
      .filter((task) => task.trim().length > 0)
      .map((task) => task.replace(/^\d+\.\s*/, ""));

    return tasks;
  } catch (error) {
    console.error("Error generating tasks:", error);
    return [];
  }
}

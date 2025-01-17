import { gemini } from "../lib/geminiClient.js";

export async function summarizeAndExtractWithGemini(emailContent) {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-flash" });
    const prompt = `Summarize this email content into a clear, actionable format. Focus on:
    1. Main topic or request
    2. Any action items or deadlines
    3. Key details that require attention

    Keep the summary concise (max 3 sentences) and highlight any urgent matters.
    Format it in a natural, easy-to-read way.

    Email content: ${emailContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text().trim();
  } catch (error) {
    console.error("Error summarizing email with Gemini:", error);
    throw error;
  }
}

export async function generateTasks(text) {
  try {
    const model = gemini.getGenerativeModel({ model: "gemini-1.5-pro" });

    const prompt = `Summarize the following text into concise, actionable tasks. Each task should be in the format of "[TASK TITLE]: [ACTION]".
                    [TASK TITLE] Include main task name which should be the same for all tasks, and do not have to have a lot of details. Include a subtask name if applicable. Connect the two with a "->".
                    [ACTION] single verb or phrase.

                    Task generated should be important and actionable, do not include small tasks.
                    If fitting of the description, include a task for contacting the person invloved, and schduling a calendar event (Please phrase the calendar task as "Do you want me to create a calendar event for you at this timing?")
                    If you see a task that is not actionable, do not include it. Do not bold anything, use plain text. The text are as follows:
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

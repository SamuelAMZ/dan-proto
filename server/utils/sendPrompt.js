const { Configuration, OpenAIApi } = require("openai-edge");

const sendPrompt = async (promptData) => {
  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const promptTosend = `
  ## instructions
choose and return as a json all the title that this user can have.
I mean user all of the text that I will send and you'll have to choose from this list
"frontend developer, backend developer, mobile app developer, product manager"

search to see if in the text to process there is element that macth element of my list, if so, just return in the json the item from my list that get matched. Only the json, no comment.
this is my list  "frontend developer, backend developer, mobile app developer, product manager"

## example
{
  "titles": [
    "Frontend Developer",
    "Backend Developer",
  ]
}

  ## text to process
  ${promptData}

  `;

  try {
    const completion = await openai.createChatCompletion({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "Follow the instructions step by step" },
        { role: "user", content: promptTosend },
      ],
      temperature: 0,
      stream: false,
    });

    let choices = await completion.json();
    return JSON.parse(choices.choices[0].message.content);
  } catch (error) {
    console.log(error);
    return "";
  }
};

module.exports = sendPrompt;

const fs = require('fs');
const { OpenAI } = require('openai');

// Read the steps from the JSON file
const steps = JSON.parse(fs.readFileSync('steps.json', 'utf8'));

// Retrieve the OpenAI API key from the GitHub secret
const apiKey = process.env.OPENAI_API_KEY;
if (!apiKey) {
  console.error('OpenAI API key not found in environment variables.');
  process.exit(1);
}
const openai = new OpenAI({ apiKey });

// Function to make an OpenAI API call
async function makeOpenAIApiCall(data) {
  try {
    const response = await openai.chat.completions.create(data);
    console.log(response.choices[0].message.content);
  } catch (error) {
    console.error('Error making API call:', error.message);
  }
}

// Loop through the steps and execute actions
steps.forEach(async (step, index) => {
  console.log(`Step ${index + 1}:`);
  if (step.action === 'openai-api-call') {
    const { data } = step.parameters;
    await makeOpenAIApiCall(data);
  } else {
    console.error(`Invalid action in step ${index + 1}`);
  }
});

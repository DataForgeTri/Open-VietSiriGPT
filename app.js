// Importing necessary modules
const express = require('express'); // Express framework for creating the server
const { Configuration, OpenAIApi } = require('openai'); // OpenAI modules for API interactions
const bodyParser = require('body-parser'); // Body-parser for parsing request bodies

// Initialize an Express application
const app = express();

// Middleware to parse JSON request bodies
app.use(bodyParser.json());

// Configure OpenAI with the API key from environment variables
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY, // API key for OpenAI, stored in an environment variable
});
const openai = new OpenAIApi(configuration); // Creating an instance of OpenAIApi with the configuration

// Define a POST route for '/api/chatgpt'
app.post('/api/chatgpt', async (req, res) => {
  try {
    // Extract user input from the request body
    const userInput = req.body.input;

    // Generate a response from OpenAI's GPT-3.5 model based on user input
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo', // Specifying the use of GPT-3.5 model
      messages: [{ role: 'user', content: userInput }], // Passing user input to the model
    });

    // Extract and send the ChatGPT response back to the client
    const chatGPTResponse = completion.data.choices[0].message;
    res.json({ output: chatGPTResponse });
  } catch (error) {
    // Log and respond with error if the API call fails
    console.error('Error getting ChatGPT response:', error);
    res.status(500).json({ error: 'Error getting ChatGPT response' });
  }
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// Start the server on a specified port or default to 3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`); // Log a message when the server starts
});
/*********************************************************************
* Project Name: Open-VietSiriGPT
* Description: A web app for real-time user interaction via voice and audio in Vietnamese.
* Author: Tri Duong
* Date: 03.31.2023
* Time: 14:46 Indochina Time
* Dependencies: npm, axios, node.js, project files
* Features:
* - Basic UI with a title.
* - Interpretation of English sentences via browser microphone.
* - Basic interface provision.
* Under development: 
* - Resolving request/response format errors.
* - Updating OpenAI API requests to use the latest ChatGPT model.
* Usage:
* - Launch server with 'node server.js' in the terminal.
* - Access http://localhost:3000 in a web browser.
*********************************************************************/

require('dotenv').config();

const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const bodyParser = require('body-parser');

// Initialize express app and body-parser middleware
const app = express();
app.use(bodyParser.json());

// Configuration for OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Endpoint for processing ChatGPT interactions
app.post('/api/chatgpt', async (req, res) => {
  try {
    const userInput = req.body.input.trim();
    if (!userInput) {
      res.status(400).json({ error: 'Empty input' });
      return;
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userInput }],
    });

    if (completion.data.choices && completion.data.choices.length > 0) {
      const chatGPTResponse = completion.data.choices[0].message.content;
      res.json({ output: chatGPTResponse });
    } else {
      console.error('Invalid ChatGPT response:', completion.data);
      res.status(500).json({ error: 'Invalid ChatGPT response: ' + JSON.stringify(completion.data) });
    }
  } catch (error) {
    console.error('Error in ChatGPT interaction:', error);
    res.status(500).json({ error: 'Error getting ChatGPT response: ' + error.message });
  }
});

// Serve static files from 'public' directory
app.use(express.static('public'));

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
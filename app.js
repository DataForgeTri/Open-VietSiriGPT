const express = require('express');
const { Configuration, OpenAIApi } = require('openai');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

app.post('/api/chatgpt', async (req, res) => {
  try {
    const userInput = req.body.input;

    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [{ role: 'user', content: userInput }],
    });

    const chatGPTResponse = completion.data.choices[0].message;
    res.json({ output: chatGPTResponse });
  } catch (error) {
    console.error('Error getting ChatGPT response:', error);
    res.status(500).json({ error: 'Error getting ChatGPT response' });
  }
});

app.use(express.static('public'));

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
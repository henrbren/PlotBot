const express = require('express')
const app = express()

require('dotenv').config({path: './.env'});
const { resolve } = require('path');
const bodyParser = require('body-parser');
const { Configuration, OpenAIApi } = require("openai");
const Authorization = require('./authorisation.js');
const cors = require('cors');
const Cors = require('./cors.js');
const PORT = process.env.PORT || 8080;

if (
 !process.env.OPENAI_API_KEY
){
  console.log('The .env file is not configured. Follow the instructions in the readme to configure the .env file.');
  process.env.OPENAI_API_KEY ?'' :console.log('Add OPENAI_API_KEY to your .env file. ');
  process.exit();
}


// Set up OpenAI API
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openai = new OpenAIApi(configuration);


app.use(express.static('client'));

// Set up CORS
app.use(cors({
  origin: [Cors.origins],
}));


// Use JSON parser for all non-webhook routes.
app.use((req, res, next) => {
  if (req.originalUrl === '/hooks') {
    next();
  } else {
    bodyParser.json()(req, res, next);
  }
});

app.get('/', (req, res) => {
  const path = resolve('client/index.html');
  res.sendFile(path);
});


app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  next();
});


// PROTECT ALL ROUTES THAT FOLLOW THIS MIDDLEWARE
app.use((req, res, next) => {
  const apiKey = req.get('Authorization')
  let userKey = apiKey?.replace('Bearer ',''); 
 
  console.log(userKey)
  if (!userKey || Authorization.keys.includes(userKey) === false) {
    res.status(401).json({error: 'unauthorised'})
  } else {
    next()
  }
})



app.post('/completion', async (req, res) => {

  const response = await openai.createChatCompletion(req.body).then((response) => {

      res.json(response?.data?.choices[0]?.message?.content)

    }).catch((err) => {

      res.status(400).json('An error occured in processing your request. Please try again later.'+err);

    });

});

app.post('/generation', async (req, res) => {

  const response = await openai.createImage(req.body).then((response) => {

     if(req.body.response_format == 'b64_json'){

      res.json(response.data.data[0].b64_json)

     }else{
      image_url = response.data.data[0].url
      res.json(image_url)
     }


    }).catch((err) => {

      res.status(400).json('An error occured in processing your request. Please try again later.');

    });

});

app.listen(PORT, () => {
  console.log(`PlotBot server listening on port ${PORT}`)
})
const express = require('express')
const bodyParser = require('body-parser');
const { check, validationResult } = require('express-validator')
const moment = require('moment')
const dbConnect = require('./db')
const { google } = require('googleapis')
const { WebhookClient } = require('dialogflow-fulfillment');
const { Card, Suggestion } = require('dialogflow-fulfillment');
const app = express();
const gcal = require('./gcalendar')
const Bike = require('./models/Bike')

dbConnect();

app.use(bodyParser.json());

app.post('/bike',
  [
    check('name', 'Bike name is required').not().isEmpty(),
    check('cc', 'Engine power is required').not().isEmpty()
  ],
  async (req, res) => {
    console.log(req.body)
    const errors = validationResult(req);
    if(!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    try {
      const {name, cc} = req.body;
      const newBike = Bike({
        name,
        cc
      });
      await newBike.save()
      res.json(newBike)
      
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  });

app.post('/dialogflow', express.json(), (req, res) => {
  const agent = new WebhookClient({ request: req, response: res });

  function welcomeIntent(agent) {
    agent.addResponse_(`Hey there, I am Vroomy. How may I assist you?`)
    agent.addResponse_(new Suggestion('Know shop timings'))
    agent.addResponse_(new Suggestion('Make an appointment'))
    agent.addResponse_(new Suggestion('Rent a bike'))
  }

  function fallbackIntent(agent) {
    agent.addResponse_('Sorry didnt get you. Did you mean to say any of these?')
    agent.addResponse_(new Suggestion('Know shop timings'))
    agent.addResponse_(new Suggestion('Make an appointment'))
    agent.addResponse_(new Suggestion('Rent a bike'))
  }

  function makeAppointment(agent) {
    const date = agent.parameters.date;
    const time = agent.parameters.time;
    let hr = parseInt(moment(time).format('hh'));
    let mnt = parseInt(moment(time).format('mm'));
    let date_f = moment(date).format('dddd, MMMM Do YYYY');
    let time_f = moment(time).format('LT');

    let start_date = moment(date);
    start_date.set({ h: hr, m: mnt })
    start_date = start_date.format();
    let end_date = moment(start_date).add(1, 'hours').format()
    let dtobj = { start_date, end_date };
    gcal(dtobj);
    // agent.add(`Thank you for contacting us! Appointment scheduled for ${date_f} at ${time_f}`);
    agent.addResponse_(new Card({
      title: 'Appointment Card',
      imageUrl: 'https://cmkt-image-prd.global.ssl.fastly.net/0.1.0/ps/186624/910/607/m1/fpnw/wm0/screen-shot-2557-09-17-at-8.44.39-pm-.png?1410961736&s=2f7139137c59c30a4228878868c39ec5',
      text: 'We look forward to help you solve all your bike issues',
      buttonText: 'Go to Bike site',
      buttonUrl: 'http://happyearth.in/store/the-bike-store/'
    }));
    agent.addResponse_(`Thank you for contacting us! Appointment scheduled for ${date_f} at ${time_f}`);
  }



  let intentMap = new Map();
  intentMap.set('Make Appointment', makeAppointment);
  intentMap.set('Default Welcome Intent', welcomeIntent);
  agent.handleRequest(intentMap);
});

app.listen(process.env.PORT || 8080);

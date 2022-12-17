const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');

const PORT = 3000;

const api = require('./routes/userRoute');
const transferRoute = require('./routes/transferRoute')

const app = express();

app.use(cors());

app.use(bodyParser.json());

// use the route api here
app.use('/api', api);
app.use('/api', transferRoute);

app.get('/', (req, res) =>{
    res.send('Hello from app server')
});


app.listen(PORT, () =>{
    console.log('Server is running on localhost '+PORT)
});
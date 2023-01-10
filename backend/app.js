const express = require('express');
const bodyParser = require('body-parser');

const cors = require('cors');
const multer = require('multer');

const PORT = 4000;

const api = require('./routes/userRoute');
const transferRoute = require('./routes/transferRoute');
const acctStatementRoute = require('./routes/acctStatmentRoute');

const app = express();

app.use(cors());

app.use(bodyParser.json());

// Function to serve all static files
// inside public directory.
app.use(express.static('public'));  

app.use('public/images', express.static('images')); 

// use the route api here
app.use('/api', api);
app.use('/api', transferRoute);
app.use('/api', acctStatementRoute);

app.get('/', (req, res) =>{
    res.send('Hello from app server')
});


app.listen(PORT, () =>{
    console.log('Server is running on localhost '+PORT)
});

// const storage = multer.diskStorage({
//     destination:(req, file, callBack) =>{
//         callBack(null, 'uploads')
//     },
//     filename:(req, file, callBack) =>{
//         callBack(null, `nameOfImage_${file.originalname}`)
//     }
// })
// var upload = multer({ storage: storage});

// app.post('/file', upload.single('file'), (req, res, next) =>{
//     const file = req.file;
//     console.log(file.filename);
//     if(!file){
//        const error = new Error('No file selected')
//        error.httpStatusCode = 400
//        return next(error)
        
//     }
//     res.send(file);
// })
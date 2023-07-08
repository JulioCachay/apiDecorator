

var express = require('express')
    , bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');

const mongoose = require('mongoose');

require('dotenv').config();
const mongoString = process.env.APP_DB_CONNECTION_STRING;

mongoose.connect(mongoString);
const database = mongoose.connection;

const Model = require('./usermodel');

database.on('error', (error) => {
    console.log(error)
})

database.once('connected', () => {
    console.log('Database Connected');
})

const app = express();

app.use(express.json());
app.use(bodyParser.json());

const secret = "jwtsecret";
// Add a controller end-point for root '/'.
// See how the end-point receives the request and response (the pipeline)
// resonse.send, writes to the response.
app.get('/',(request, 
             response)=>{
    response.send('<h1>Good bye World</h1>');
});

app.post('/login',(
    request, 
    response)=>{
    
    const data = Model
        .findOne({email:request.body.email})
        .then(r=>{
            if (!r)
            {
                console.error('email does not exist');
                response.status(400).json({ message: 'email not found' });
            }
            else if (r.password != request.body.password)
            {
                console.error('wrong password');
                response.status(400).json({message:'wrong password'});
            }
            else
            {
                const payload = {
                    "email":request.body.email
                };
                const token = jwt.sign(payload,"secretkey");
                
                response.status(200).json(token);
            }
        });
});



app.post('/dev-create-user',(req, res)=>{
    const data = new Model({
        email: 'julio.cachay@datably.io',
        password: 'password123'
    });
    try {
        const dataToSave = data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
})

// The app listens on http://localhost:5000
app.listen(5000);


var express = require('express')
    , bodyParser = require('body-parser');

const jwt = require('jsonwebtoken');
const app = express();

app.use(express.json());
app.use(bodyParser.json());


const secret = "secretpasword";
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
    const payload = request.body;
    const token = jwt.sign(payload,"secretkey");
    response.send(token);
});

// The app listens on http://localhost:5000
app.listen(5000);
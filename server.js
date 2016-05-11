var express = require('express');
var path = require('path');
var s3 = require('s3');
var bodyParser = require('body-parser');
var port = process.env.PORT || 5000;
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var passport = require('passport');
var multer = require('multer');
var app = express();
var keyId = "AKIAI2RVTP5DFNHRNEFQ";
var secretKey = "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";

app.use(multer({ dest: './uploads/'}).single('file'));
app.use(morgan('dev')); // log every request to the console
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, './client')));
app.use(cookieParser());
app.use(passport.initialize());


require('./server/config/mongoose.js');
require('./passport/passport.js');

var client = s3.createClient({
  maxAsyncS3: 20,     // this is the default
  s3RetryCount: 3,    // this is the default
  s3RetryDelay: 1000, // this is the default
  multipartUploadThreshold: 20971520, // this is the default (20 MB)
  multipartUploadSize: 15728640, // this is the default (15 MB)
  s3Options: {
    accessKeyId: keyId,
    secretAccessKey: secretKey,
  }
});

var routes_setter = require('./server/config/routes.js');
routes_setter(app, client);


app.listen(port, function(){
  console.log('listening on port 5000');
});

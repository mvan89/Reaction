var use = require('../controllers/posts.js');
var jwt = require('express-jwt');
var secret = 'sauce';
var auth = jwt({secret: secret, userProperty: 'payload'});
var request = require('request');
var path = require('path');
var fs = require('fs');

module.exports = function(app, client){
  app.get('/userInfo/:_id', function(req, res){
    use.userInfo(req, res)
  });

  app.post('/posts/new', function(req, res){
    use.newPost(req, res)
  });

  app.get('/posts/:_id', function(req, res){
    use.getPosts(req, res)
  });

  app.post('/posts/edit/', function(req, res){
    use.updatePost(req, res)
  });

  app.get('/posts/delete/:id', function(req, res){
    use.deletePost(req, res)
  });

  app.post('/register', function(req, res, next){
    use.newReg(req, res, next)
  });

  app.post('/login', function(req, res, next){
    use.logIn(req, res, next)
  });

  app.post('/newPic', function(req, res){
    // console.log("HERE", req.file);
    var uploads = path.join(__dirname, "../../uploads/"+req.file.filename);

    var params = {
      localFile: uploads,

      s3Params: {
        Bucket: "testingreact",
        Key: req.file.originalname,
      },
    };

    var uploader = client.uploadFile(params);

    uploader.on('error', function(err) {
      console.error("unable to upload:", err.stack);
    });
    uploader.on('progress', function() {
      console.log("progress", uploader.progressMd5Amount,
                uploader.progressAmount, uploader.progressTotal);
    });
    uploader.on('end', function() {
      console.log("done uploading");
      res.json({data: req.file.filename})
      fs.exists(uploads, function(exists){
        if(exists){
          console.log('File exists. Deleting now ...');
          fs.unlink(uploads);
        }else{
          console.log('Nope');
        }
      });
    });

  });
}

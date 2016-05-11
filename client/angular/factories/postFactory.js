myApp.factory('postFactory', function($http, $state, auth){
  factory = {};
  posts = [];
  list = {};

  factory.addPost = function(newPost, lists, callback){

      switch(newPost.status){
        case "Prospects":
          newPost.index = lists.Prospects.length
          break;
        case "Applied":
          newPost.index = lists.Applied.length
          break;
        case "Pending":
          newPost.index = lists.Pending.length
          break;
        case "Completed":
          newPost.index = lists.Completed.length
          break;
      }
    newPost._user = auth.currentUserID();
    $http.post('/posts/new', newPost).success(function(res){
      if(res.status == 'error'){
        console.log("error with adding post");
      }else{
        posts.push(res);
        callback(res);
      }
    })
  };

  factory.allPosts = function(callback){
    $http.get('/posts/' + auth.currentUserID()).success(function(res){
      if(res.status == 'error'){
      }else{
        posts = res;
        callback(posts);
      };
    });
  };

  factory.editPost = function(post, callback){
    $http.post('/posts/edit/', post).success(function(res){
      if(res.status == 'error'){
        console.log('error in editing post');
      }else{
        callback(res)
      };
    });
  };

  factory.delete = function(post, callback){
    $http.get('/posts/delete/'+post._id).success(function(res){
      if(res.status == 'error'){
        console.log("error with deleting name");
      }else{
        callback(res);
      }
    })
  };

  
  factory.getapi = function(callback){
    console.log("test");
    $http.post('/getapi.json').success(function(response){
        $http.get('https://api.tropo.com/1.0/sessions?action=create&token=5a766c5678575170536c66426a49754274786d6d414861497664485642724b624d545a796b6864497772506a').success(function(){
            console.log("GET");
        });
    })
  };

  return factory;
})

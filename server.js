const fs = require('fs');
const path = require('path');
const express = require('express');
const app = express();
var cors = require('cors');
const port = 8000;

let users; // this is an asynchronous call! 
fs.readFile(path.resolve(__dirname, './data/users.json'), function(err, data) { // this is done at start up of server!
  console.log('reading file ... ');
  if(err) throw err;
  users = JSON.parse(data);
})

const addMsgToRequest = function (req, res, next) { // this is a MIDDLEWARE function that WE defined!!
  if(users) {
    req.users = users;
    next();
  }
  else { // if this is undefined, we cut the middleware off and send an error message, user not defined!
    return res.json({
        error: {message: 'users not found', status: 404}
    });
  }
  
}

app.use( // here we use a pre-existing middleware function from the CORS library!!! only trusts request from one server! 
  cors({origin: 'http://localhost:3000'})
);
app.use('/read/usernames', addMsgToRequest); // this is a MIDDLEWARE function that WE defined!!
// define the Routes with URIs (see definition of app above)
app.get('/read/usernames', (req, res) => { // get(URI(map to handler and resource))
  let usernames = req.users.map(function(user) {
    return {id: user.id, username: user.username}; // if you inspect the browser, there is NO user.id property! We use the middleware to add the users to the request object!!!
  });
  res.send(usernames); // express sees usernames as javascript object, so automatically converts to JSON!!! This is WHY we use express
  // at this point, the communication between the request and response ENDS and the response is sent back to the server. 
});

// class activity: add route to get email by username
// AND change handleShowEmail function at usermgmt.js
// app.use
// app.get

app.use(`/read/username`, addMsgToRequest);
app.get(`/read/username/:name`, (req, res) => {
  let name = req.params.name;
  let users_with_name = req.users.filter(function(user) {
    return user.username === name;
  });
  console.log(users_with_name);
  if (users_with_name.length === 0) {
    res.send({
      error: {message: `${name} not found`, status: 404}
    });
  }
  else {
    res.send(users_with_name);
  }
});

app.use(express.json()); // this middleware is crucial to get req.body BELOW!!!
app.use(express.urlencoded({ extended: true }));
app.use('/write/adduser', addMsgToRequest);

app.post('/write/adduser', (req, res) => { // define URI along with the handler, 
  let newuser = req.body;
  req.users.push(newuser);
  fs.writeFile(path.resolve(__dirname, './data/users.json'), JSON.stringify(req.users), (err) => {
    if (err) console.log('Failed to write');
    else console.log('User Saved');
  });
  res.send('done');
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})

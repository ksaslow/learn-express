const express = require('express')
const fs = require('fs');
const path = require('path');
const router = express.Router()

// add all middleware here for functionality writeUser

router.post('/adduser', (req, res) => {
    let newuser = req.body;
    req.users.push(newuser);
    fs.writeFile(path.resolve(__dirname, '../data/users.json'), JSON.stringify(req.users), (err) => {
        if (err) console.log('Failed to write');
        else console.log('User Saved');
    });
    res.send('done');
});

modules.exports = router;
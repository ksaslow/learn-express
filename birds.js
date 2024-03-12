// define all code that belongs to the '/birds' route in a separate file!!!

const express = require('express')
const router = express.Router()

// middleware that is specific to this router
// add all our routes to router object, not the app object in router-ex-server
router.use((req, res, next) => {
  console.log('Time: ', Date.now())
  next()
})
// define the home page route
router.get('/', (req, res) => {
  res.send('Birds home page')
})
// define the about route
router.get('/about', (req, res) => {
  res.send('About birds')
})

module.exports = router
// const AuthenticationController = require('./controllers/AuthenticationController')

// const AuthenticationControllerPolicy = require('./policies/AuthenticationControllerPolicy')

/* module.exports = (app) => {
  app.post('/test/:recipeId',
    RecipesController.put)
} */

// const routes = require('express').Router()
const testJson = require('../tests/tests.json')
// 28.33
/* routes.get('/test/:id/:numQuestions', (req, res) => {
  console.log(req.params)
  // console.log(test[req.params.id]['questions'].length)
  let temp = {}
  let allQ = test[req.params.id]
  const reqQ = parseInt(req.params.numQuestions)
  if (reqQ >= allQ['questions'].length) {
    temp = allQ
  } else {
    let questions = []
    let j = 0
    let i = reqQ
    while (i--) {
      j = Math.floor(Math.random() * (i + 1))
      questions.push(allQ['questions'][j])
      allQ['questions'].splice(j, 1)
    }
    temp = allQ
    temp['questions'] = questions
  }
  // console.log(temp['questions'].length)
  res.header('Content-Type', 'application/json')
  res.status(200).json(temp)
})

module.exports = routes */
function jsonCopy (src) {
  return JSON.parse(JSON.stringify(src))
}
module.exports = function (app) {
  app.get('/test/:id', function (req, res) {
    console.log(req.params)
    console.log(req.query)
    let temp = {}
    let allQ = jsonCopy(testJson)[req.params.id]
    const reqQ = parseInt(req.query.q)
    console.log('allQ: ' + allQ['questions'].length + ' qQ: ' + reqQ)
    if (reqQ >= allQ['questions'].length) {
      console.log('if')
      temp = allQ
    } else {
      let questions = []
      let j = 0
      let i = reqQ
      while (i--) {
        j = Math.floor(Math.random() * (i + 1))
        questions.push(allQ['questions'][j])
        allQ['questions'].splice(j, 1)
      }
      temp = allQ
      temp['questions'] = questions
    }
    console.log('returning: ' + temp['questions'].length)
    res.header('Content-Type', 'application/json')
    res.status(200).json(temp)
  })

  // other routes..
}

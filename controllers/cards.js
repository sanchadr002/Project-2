require('dotenv').config()
const fetch = require('node-fetch')
const searchParameters = require('/models/searchparameters')

const apiUrl = process.env.scryfallApiUrl

router.get("/cards/search", (req, res) => {
    const searchResults = []
    const nameParam = req.body.name.toString()
    const mvParam = req.body.mv
    const typeParam = []
    const createTypeParam = (type) => {
        if (req.body.type === 'on'){
            typeParam.push(req.body.type)
            console.log('this is being pushed to typeParam', typeParam)
        }
    }

    const colorParam = searchParameters.color

    fetch(`${apiUrl}/q=`)
    .then(cards => {
        console.log(cards, "this shows the response from api")
        // const username = req.session.username
        // const loggedIn = req.session.loggedIn
        // res.render('weapons/index', { cards, username, loggedIn })
    })
    .catch(error => {
        res.redirect(`/error?error=${error}`)
    })
})
// Import Dependencies
require('dotenv').config()
const express = require('express')
const fetch = require('node-fetch')

// Create router
const router = express.Router()

// Router Middleware
// Authorization middleware
// If you have some resources that should be accessible to everyone regardless of loggedIn status, this middleware can be moved, commented out, or deleted. 
router.use((req, res, next) => {
	// checking the loggedIn boolean of our session
	if (req.session.loggedIn) {
		// if they're logged in, go to the next thing(thats the controller)
		next()
	} else {
		// if they're not logged in, send them to the login page
		res.redirect('/auth/login')
	}
})

const apiUrl = process.env.scryfallApiUrl

router.get("/search", (req, res) => {
    res.render("cards/search")
})

router.put("/search", (req, res) => {
    // const searchResults = []
    // const nameParam = req.body.name.toString()
    // const mvParam = req.body.mv
    const typeParam = []
    const createTypeParam = (type) => {
        if (req.body.type === 'on'){
            typeParam.push(`t:${type}`)
            console.log('this is being pushed to typeParam t:', type)
        }
    }

    createTypeParam('instant')
    createTypeParam('sorcery')
    createTypeParam('creature')
    createTypeParam('artifact')
    createTypeParam('enchantment')
    createTypeParam('planeswalker')
    createTypeParam('land')

    const colorParam = []
    const createColorParam = (color) => {
        if (req.body.color === 'on'){
            colorParam.push(`c:${color}`)
            console.log('this is being pushed to colorParam t:', color)
        }
    }

    createColorParam('white')
    createColorParam('blue')
    createColorParam('black')
    createColorParam('red')
    createColorParam('green')

    // fetch(`${apiUrl}/q=`)
    // .then(cards => {
    //     console.log(cards, "this shows the response from api")
    //     // const username = req.session.username
    //     // const loggedIn = req.session.loggedIn
    // })
    // .catch(error => {
    //     res.redirect(`/error?error=${error}`)
    // })
    res.redirect('/cards/search')
})

// Export the Router
module.exports = router
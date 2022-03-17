// Import Dependencies
const express = require('express')
// reference to decks
const Decks = require('../models/decks')

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

// Routes

// index ALL
router.get('/', (req, res) => {
	// reference to decks
	Decks.find({})
	// reference to decks
		.then(decks => {
			const username = req.session.username
			const loggedIn = req.session.loggedIn
			// reference to decks
			res.render('decks/index', { decks, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// index that shows only the user's decks
router.get('/mine', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	// reference to decks
	Decks.find({ owner: userId })
		// reference to decks
		.then(decks => {
			// reference to decks
			res.render('decks/index', { decks, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('decks/new', { username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	// req.body.ready = req.body.ready === 'on' ? true : false
	req.body.owner = req.session.userId
	// reference to decks
	Decks.create(req.body)
		// reference to decks
		.then(decks => {
			console.log('this was returned from create', decks)
			res.redirect('/decks')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	// we need to get the id
	const deckId = req.params.id
	// reference to decks
	Decks.findById(deckId)
		// reference to decks
		.then(decks => {
			// reference to decks
			res.render('decks/edit', { decks })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const deckId = req.params.id
	// req.body.ready = req.body.ready === 'on' ? true : false
	// reference to decks
	Decks.findByIdAndUpdate(deckId, req.body, { new: true })
		// reference to decks
		.then(decks => {
			// reference to decks
			res.redirect(`/decks/${decks.id}`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const deckId = req.params.id
	// reference to decks
	Decks.findById(deckId)
		// reference to decks
		.then(decks => {
            const {username, loggedIn, userId} = req.session
			// reference to decks
			res.render('decks/show', { decks, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route
router.delete('/:id', (req, res) => {
	const deckId = req.params.id
	Decks.findByIdAndRemove(deckId)
		.then(decks => {
			res.redirect('/decks')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router

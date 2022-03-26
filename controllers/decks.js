// Import Dependencies
require('dotenv').config()
const express = require('express')
const Decks = require('../models/decks')
const Cards = require('../models/cards')
const fetch = require('node-fetch')
const apiUrl = process.env.scryfallApiUrl
const tempDeck = []

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

// index that shows only the user's decks
router.get('/index', (req, res) => {
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

// card search route
router.get('/cards/search', (req, res) => {
	res.render('cards/search', { tempDeck })
})

// card results route
router.get('/cards/results', (req, res) => {
	res.render('cards/results')
})

// card results PUT route
router.put('/cards/results', (req, res) => {
	console.log(req.body)
	const searchParamaters = []
	if (req.body.name !== ''){
		req.body.name = req.body.name.replace(' ', '%20')
		req.body.name = req.body.name.replace('\'', '%27')
		searchParamaters.push(`${req.body.name}`)
	}
	if (req.body.mv !== ''){
		searchParamaters.push(`${req.body.mv}`)
	}
	if (req.body.instant === 'on'){
		searchParamaters.push('t%3Ainstant')
	}
	if (req.body.sorcery === 'on'){
		searchParamaters.push('t%3Asorcery')
	}
	if (req.body.creature === 'on'){
		searchParamaters.push('t%3acreature')
	}
	if (req.body.artifact === 'on'){
		searchParamaters.push('t%3Aartifact')
	}
	if (req.body.enchantment === 'on'){
		searchParamaters.push('t%3Aenchantment')
	}
	if (req.body.planeswalker === 'on'){
		searchParamaters.push('t%3Aplaneswalker')
	}
	if (req.body.land === 'on'){
		searchParamaters.push('t%3Aland')
	}
	if (req.body.white === 'on'){
		searchParamaters.push('c%3Awhite')
	}
	if (req.body.blue === 'on'){
		searchParamaters.push('c%3Ablue')
	}
	if (req.body.black === 'on'){
		searchParamaters.push('c%3Ablack')
	}
	if (req.body.red === 'on'){
		searchParamaters.push('c%3Ared')
	}
	if (req.body.green === 'on'){
		searchParamaters.push('c%3Agreen')
	}

	console.log(searchParamaters)
	const searchString = searchParamaters.join('%20and%20')
	console.log(searchString)
	const searchResults = []

	fetch(`${apiUrl}f%3Astandard+%28${searchString}%29`)
	.then(cardObjectsList=>{
		return cardObjectsList.json()
	})
	.then(async cardObjectsList => {
		
		await cardObjectsList.data.forEach( (card) => {
			searchResults.push(card)
		})
		// console.log(searchResults)
		res.render('cards/results', { searchResults })
	})
})

// card POST route
// create -> POST route that actually calls the db and makes a new document
router.post('/cards/search', (req, res) => {
	req.body.owner = req.session.userId
	Cards.create({
		scryfallApiId: req.body.scryfallApiId,
		name: req.body.name,
		imageUrl: req.body.imageUrl,
		mv: req.body.mv,
		colorIdentity: req.body.colorIdentity,
		cardType: req.body.cardType
	})
	.then(card => {
		console.log('this was returned from create', card)
		tempDeck.push(card._id)
		console.log('this is being pushed to tempDeck', card)
		console.log('this is tempDeck so far', tempDeck)
		res.redirect('/decks/cards/search')
	})
	.catch(error => {
		res.redirect(`/error?error=${error}`)
	})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('decks/new', { tempDeck, username, loggedIn })
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
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
		.then(deck => {
            const {username, loggedIn, userId} = req.session
			// reference to decks
			res.render('decks/show', { deck, username, loggedIn, userId })
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
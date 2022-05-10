// Import Dependencies
require('dotenv').config()
const express = require('express')
const Decks = require('../models/decks')
const Cards = require('../models/cards')
const fetch = require('node-fetch')
const apiUrl = process.env.scryfallApiUrl

// create array to hold cards while user is searching and adding cards to deck
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

// index that shows user's decks
router.get('/index', (req, res) => {
    // destructure user info from req.session
    const { username, userId, loggedIn } = req.session
	Decks.find({ owner: userId })
		.then(decks => {
			res.render('decks/index', { decks, username, loggedIn })
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// card search route
router.get('/cards/search', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('cards/search', { username, loggedIn })
})

// card results route
router.get('/cards/results', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('cards/results', { username, loggedIn})
})

// card results PUT route
router.put('/cards/results', (req, res) => {
	const { username, userId, loggedIn } = req.session

	// create array to push search paramaters into
	const searchParamaters = []

	// create and push paramaters based on user input
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

	// convert paramaters array into a string and join them with proper percent encoding
	const searchString = searchParamaters.join('%20and%20')

	// create array to contain search results
	const searchResults = []

	// search cards based on string created on user input
	fetch(`${apiUrl}f%3Astandard+%28${searchString}%29`)
	.then(cardObjectsList=>{
		return cardObjectsList.json()
	})
	.then(async cardObjectsList => {
		
		// access each card in the data array and push its information to the searchResults array
		await cardObjectsList.data.forEach( (card) => {
			searchResults.push(card)
		})
		res.render('cards/results', { searchResults, userId, loggedIn })
	})
})

// card POST route
// create -> POST route that actually calls the db and makes a new document
router.post('/cards/search', (req, res) => {
	req.body.owner = req.session.userId
	Cards.create({
		scryfallApiId: req.body.scryfallApiId,
		name: req.body.name,
		imageUrl: req.body.imgUrl,
		mv: req.body.mv,
		colorIdentity: req.body.colorIdentity,
		cardType: req.body.cardType
	})
	.then(card => {
		tempDeck.push(card)
		res.render('cards/search', { tempDeck })
	})
	.catch(error => {
		res.redirect(`/error?error=${error}`)
	})
})

// new route -> GET route that renders our page with the form
router.get('/new', (req, res) => {
	const { username, userId, loggedIn } = req.session
	res.render('/cards/search', { username, loggedIn })
})

// deck creation route
router.post('/', (req, res) => {
	const { username, userId, loggedIn } = req.session
	Decks.create({
		name: req.body.deckName,
		cards: tempDeck,
		owner: userId
	})
	.then(deck => {
		// Decks.findByIdAndUpdate(deck._id)
		// .then(deck => {
		// 	tempDeck.forEach(card => {
		// 		deck.cards.push(card)
		// 	})
		// })
		console.log('this was returned from deck create', deck)
		res.render('index', { username, userId, loggedIn } )
	})
})

// edit route -> GET that takes us to the edit form view
router.get('/:id/edit', (req, res) => {
	const deckId = req.params.id
	Decks.findById(deckId)
		.then(deck => {
			const cards = deck.cards
			res.render('decks/edit', { deck, cards })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// update route
router.put('/:id', (req, res) => {
	const deckId = req.params.id
	Decks.findByIdAndUpdate(deckId, { name: req.body.name }, { new: true })
		.then(decks => {
			res.redirect(`/decks/index`)
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// show route
router.get('/:id', (req, res) => {
	const deckId = req.params.id
	const {username, loggedIn, userId} = req.session
	Decks.findById(deckId)
		.then(deck => {
			let cards = []
			deck.cards.forEach(card => {
				Cards.findById(card._id)
				.then(card => {
					cards.push(card.name)
				})
				.catch(err => console.log(err))
			})
			console.log('this is deck', deck)
			res.render('decks/show', { cards, deck, username, loggedIn, userId })
		})
		.catch((error) => {
			res.redirect(`/error?error=${error}`)
		})
})

// delete route for removing cards in decks
// still non-functional
router.delete('/decks', (req, res) => {
	const cardId = req.body.cardId
	Cards.findByIdAndRemove(cardId)
		.then(card => {
			console.log('this is the card being deleted', card)
			res.redirect('/decks/index')
		})
})


// deck delete route

router.delete('/:id', (req, res) => {
	const deckId = req.params.id
	Decks.findByIdAndRemove(deckId)
		.then(deck => {
			res.redirect('/decks/index')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})

// Export the Router
module.exports = router
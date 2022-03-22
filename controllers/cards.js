// Import Dependencies
require('dotenv').config()
const { Router } = require('express')
const express = require('express')
const res = require('express/lib/response')
const Cards = require('../models/cards')
const apiUrl = process.env.scryfallApiUrl
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

// Routes

// index ALL
router.get('/', (req, res) => {
	
		// console.log(results)
		res.redirect('/cards/search')
})


router.get('/search', (req, res) => {
	// if (req.body.instant === 'on'){
	// 	console.log('instant is checked')
	// }
	// console.log(req.body.instant = req.body.instant === 'on' ? true : false)
	res.render('cards/search')

})

router.put('/results', (req, res) => {
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
			console.log(card.name)
			// console.log(card.image_uris)
			// console.log(card.cmc)
			console.log(card.color_identity)
			// console.log(card.type_line)
			// Cards.create({
			// 	scryfallApiId: cardObjectsList.data.id,
			// 	name: cardObjectsList.data.name,
			// 	// imageUrl: cardObjectsList.data.image_uris.small,
			// 	mv: cardObjectsList.data.cmc,
			// 	colorIdentity: cardObjectsList.data.color_identity,
			// 	cardType: cardObjectsList.data.type_line,
			// 	// owner: User
			// results.push(card.name)	
			
			// })
		})
		// console.log(searchResults)
		res.render('cards/results', { searchResults })
	})
})

// create -> POST route that actually calls the db and makes a new document
router.post('/', (req, res) => {
	req.body.owner = req.session.userId
	// reference to decks
	Cards.create(req.body)
		// reference to decks
		.then(cards => {
			console.log('this was returned from create', cards)
			res.redirect('/cards/results')
		})
		.catch(error => {
			res.redirect(`/error?error=${error}`)
		})
})


router.get('/results', (req, res) => {
	res.render('cards/results')
})


// // show route
// router.get('/:id', (req, res) => {
// 	const deckId = req.params.id
// 	// reference to decks
// 	Decks.findById(deckId)
// 		// reference to decks
// 		.then(decks => {
//             const {username, loggedIn, userId} = req.session
// 			// reference to decks
// 			res.render('decks/show', { decks, username, loggedIn, userId })
// 		})
// 		.catch((error) => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// delete route
// router.delete('/:id', (req, res) => {
// 	const deckId = req.params.id
// 	Decks.findByIdAndRemove(deckId)
// 		.then(decks => {
// 			res.redirect('/decks')
// 		})
// 		.catch(error => {
// 			res.redirect(`/error?error=${error}`)
// 		})
// })

// Export the Router
module.exports = router


// ----------CODE GRAVEYARD-------------
// for (let i = 0; i < 100; i++){
		// 	Cards.create({
		// 		scryfallApiId: cardObjectsList.data[i].id,
		// 		name: cardObjectsList.data[i].name,
		// 		mv: cardObjectsList.data[i].cmc,
		// 		colorIdentity: cardObjectsList.data[i].color_identity.join(''),
		// 		cardType: cardObjectsList.data[i].type_line,
		// 		// owner: User
		// 		imageUrl: cardObjectsList.data[i].image_uris.small,
		// 	})
		// 	console.log('card is being created')
		// }
		// forEach(cardObjectsList.data, Cards.create({
		// 		scryfallApiId: cardObjectsList.data.id.toString(),
		// 		name: cardObjectsList.data.name,
		// 		mv: cardObjectsList.data.cmc,
		// 		colorIdentity: cardObjectsList.data.color_identity.join(''),
		// 		cardType: cardObjectsList.data.type_line,
		// 		// owner: User
		// 		imageUrl: cardObjectsList.data.image_uris.small,
		// 	})
		// )
		// Cards.create({
		// 	scryfallApiId: cardObjectsList.data.id,
		// 	name: cardObjectsList.data.name,
		// 	mv: cardObjectsList.data.cmc,
		// 	colorIdentity: cardObjectsList.data.color_identity.join(''),
		// 	cardType: cardObjectsList.data.type_line,
		// // 		// owner: User
		// 	imageUrl: cardObjectsList.data.image_uris.small,
		// })
import { config } from 'dotenv'
import express from 'express'

// Express middleware
// Middleware are things that fulfill requests
// can chain them together to create loggers/error handlers/404 pages 
import bodyparser from 'body-parser'
import cors from 'cors'
import rateLimiter from 'express-rate-limit'

// Mongoose (MongoDB Object-Document-Model)
import mongoose from 'mongoose'

// Mongoose URL Model
import URL from './URLS'

// Load .env variables
config()

// Check if MONGO_URI is defined
if (!process.env.MONGO_URI) {
	throw new Error("No MONGO_URI found")
}

// Connect to Database
mongoose.connect(process.env.MONGO_URI,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	err => err && console.log(err)
)

// Start express app
const app = express()

// Middleware
app.use(rateLimiter({ max: 30, windowMs: 60 * 1000 })) // Limit to 30 requests in 60,000 ms
app.use(cors()) // Cross-Origin Requests
app.use(bodyparser.json()) // Parse JSON Bodies
app.use(bodyparser.urlencoded({ extended: true })) // Parse HTML Forms

// Logger
app.use((req, _res, next) => {
	console.log(`${req.method} - ${req.url}`)
	// Parameters are parsed on the middleware
	// console.log(`Parameters: ${JSON.stringify(req.params)}`)
	console.log(`Query: ${JSON.stringify(req.query)}`)
	console.log(`Body: ${JSON.stringify(req.body)}`)
	console.log(`~~~~`)
	next()
})

// Static folder
app.use(express.static('public'))

// Testing Express's query/params/body
// Ex. http://localhost:6969/test/param?q=5
app.use('/search', (req, res) => {
	const { body, params, query } = req;
	res.json({ body, params, query })
})

interface createBody {
	url?: string,
	shortened?: string,
}

app.post('/create', async (req, res) => {
	console.log(req.headers["content-type"])
	const { url, shortened }: createBody = req.body;

	if (!shortened || !url) {
		return res.status(400).send("Missing URL or Shortened Name")
	}

	const isTaken = !!await URL.findOne({ shortened })

	if (isTaken) {
		return res.status(400).send("Shortened Name is taken")
	}

	const createdURLShortened = await URL.create({ url, shortened })
	res.status(201).json(createdURLShortened)
})

app.get('/all', async (_req, res) => {
	const urls = await URL.find({})
	res.json(urls)
})

app.get('/:shortened', async (req, res) => {
	const shortened: string | undefined = req.params.shortened;

	if (!shortened) {
		return res.sendStatus(400)
	}

	const urlDocument = await URL.findOne({ shortened })

	if (urlDocument === null) {
		return res.sendStatus(400)
	}

	res.redirect(urlDocument.url)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server Started on port ${PORT}`))

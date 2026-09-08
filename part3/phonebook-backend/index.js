require('dotenv').config()
const express = require('express')
const morgan = require('morgan')
const Port = 3001
const app = express()
const Person = require('./mongo')


app.use(express.static("dist"))

const generatId = () => {
    return (String(Math.floor(1000000 * Math.random())))
}

app.use(express.json())
morgan.token("body", (req) => {
    return (JSON.stringify(req.body))
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons', (req, res) => {
    Person.find().then(returned => {
        res.status(200).json(returned)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findById(id).then(returned => {
        res.status(200).json(returned)
    }).catch(err => next(err))
})

app.delete('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    Person.findByIdAndDelete(id).then(() => {
        res.status(204).end()
    }).catch(err => next(err))
})

app.put('/api/persons/:id', (req, res, next) => {
    const id = req.params.id
    const {number} = req.body

    Person.findById(id).then(person => {
        person.number = number
        person.save().then(returned => {
            return (res.status(200).json(returned))
        })
    }).catch(err => next(err))
})

app.post('/api/persons/', (req, res) => {
    const body = req.body
    const person = new Person(body)
    person.save().then(result => {
        res.status(201).json(result)
    })
})

app.get('/info', (req, res) => {
    res.status(200).send(`
        <p>Phonebook has info for ${notes.length} people<p/>
        <p>${new Date()}<p/>
        `)
})

const errorHandler = (err, req, res, next) => {
    console.log(err.message)
    if (err.name === 'CastError')
        return (res.status(400).send({ error: 'malformatted id' }))
    next (err)
}

app.use(errorHandler)
    
    
app.listen(Port, () => {
    console.log(`server running on port ${Port}`)
})

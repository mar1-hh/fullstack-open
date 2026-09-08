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

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findById(id).then(returned => {
        res.status(200).json(returned)
    })
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    Person.findByIdAndDelete(id).then(() => {
        res.status(204).end()
    })
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
    
    
app.listen(Port, () => {
    console.log(`server running on port ${Port}`)
})

const express = require('express')
const morgan = require('morgan')
const Port = 3001
const app = express()


let notes = [
    { 
      "id": "1",
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": "2",
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": "3",
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": "4",
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const generatId = () => {
    return (String(Math.floor(1000000 * Math.random())))
}

app.use(express.json())
morgan.token("body", (req) => {
    return (JSON.stringify(req.body))
})
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))



app.get('/api/persons', (req, res) => {
    res.status(200).json(notes)
})

app.get('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(n => n.id === id)
    if (!note)
        return (res.status(404).send("entry not found"))
    return (res.status(200).json(note))
})

app.delete('/api/persons/:id', (req, res) => {
    const id = req.params.id
    const note = notes.find(n => n.id === id)
    if (!note)
        return (res.status(404).send("entry not found"))
    notes = notes.filter(n => n.id !== id)
    res.status(204).end()
})

app.post('/api/persons/', (req, res) => {
    const body = req.body
    const id = generatId()
    
    if (!body.name || !body.number)
        return (res.status(400).json({error: 'name or number is missing'}))
    if (notes.find(n => n.name === body.name))
        return (res.status(400).json({error: 'name must be unique'}))
    const note = {...body, id}
    notes = notes.concat(note)
    res.status(201).json(note)
})

app.get('/info', (req, res) => {
    res.status(200).send(`
        <p>Phonebook has info for ${notes.length} people<p/>
        <p>${new Date()}<p/>
        `)
    })
    
    app.get('/', (req, res) => {
        res.send('something')
    })
    
    
    app.listen(Port, () => {
        console.log(`server running on port ${Port}`)
})

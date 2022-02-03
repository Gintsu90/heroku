const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();

const PORT = process.env.PORT || 3001;
morgan.token("person", (req, res) => JSON.stringify(req.body));

app.use(express.json())
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"))

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

const randomId = Math.floor(Math.random() * 100000)

app.get("/", (req, res) => {
    res.send("Pöö");
});

app.get("/api/persons", (req, res) => {
    res.send(persons);
    console.log(persons.length)
});

app.get("/info", (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
});

app.get("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    const person = persons.find(person => person.id === id);

    if(person) {
        res.send(person);
    } else {
        res.status(404).end()
    }
});

app.post("/api/persons", (req, res) => {
    const body = req.body;
    const name = persons.find(person => person.name === body.name)
    if(!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        });
    } else if(name) {
        return res.status(400).json({
            error: "name already exist"
        })
    }
    
    const person = {
        id: randomId,
        name: body.name,
        number: body.number
    };

    persons = persons.concat(person);
    res.json(person)
})

app.delete("/api/persons/:id", (req, res) => {
    const id = Number(req.params.id);
    persons = persons.filter(person => person.id !== id);

    res.status(204).end()
})

app.listen(PORT);
console.log(`Server is running on ${PORT}`);
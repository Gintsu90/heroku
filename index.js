require("dotenv").config()
const express = require("express");
const morgan = require("morgan");
const cors = require("cors");
const app = express();
const Person = require("./models/person");

const PORT = process.env.PORT || 3001;
morgan.token("person", (req, res) => JSON.stringify(req.body));

const errorHandler = (error, request, response, next) => {
    console.error(error.message)
  
    if (error.name === 'CastError') {
      return response.status(400).json({ error: 'malformatted id' })
    } else if (error.name === "ValidationError") {
        return response.status(400).json({ error: error.message})
    }
  
    next(error)
  }

app.use(express.json())
app.use(express.static("build"))
app.use(cors())
app.use(morgan(":method :url :status :res[content-length] - :response-time ms :person"))


app.get("/", (req, res, next) => {
    res.send("Pöö")
    .catch(error => next(error));
});

app.get("/api/persons", (req, res, next) => {
    Person.find({}).then(person => {
        console.log(person.length)
        res.json(person)
    })
    .catch(error => next(error))
});

app.get("/info", (req, res, next) => {
    Person.find({}).then(persons => {
        res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`);
    })
    .catch(error => next(error))
});

app.get("/api/persons/:id", (req, res, next) => {
    Person.findById(req.params.id).then(person => {
        console.log(person)
        res.json(person)
    })
    .catch(error => next(error))
});

app.post("/api/persons", (req, res, next) => {
    const body = req.body;
    const name = Person.find({}).then(person => {
        person.name === body.name
    })
    if(!body.name || !body.number) {
        return res.status(400).json({
            error: "name or number missing"
        });
    } else if(body.name === name) {
        return res.status(400).json({
            error: "name already exist"
        })
    }
    
    const person = new Person( {
        name: body.name,
        number: body.number
    });

    person.save().then(savedPerson => {
        res.json(savedPerson);
    })
    .catch(error => next(error))
})

app.put("/api/persons/:id", (req, res, next) => {
    const body = req.body;
    const person = {
        name:body.name,
        number:body.number
    };

    Person.findByIdAndUpdate(req.params.id, person, { new: true })
        .then(updatedPerson => {
            res.json(updatedPerson);
        })
        .catch(error => next(error));
})

app.delete("/api/persons/:id", (req, res, next) => {
    Person.findByIdAndDelete(req.params.id)
        .then(result => {
            res.status(204).end()
        })

    
    .catch(error => next(error));
})

const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
};



app.use(unknownEndpoint);

// this has to be the last loaded middleware.
app.use(errorHandler);

app.listen(PORT);
console.log(`Server is running on ${PORT}`);
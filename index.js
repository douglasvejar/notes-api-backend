const express = require('express')

const cors = require('cors')

const app = express()
app.use(express.json())
app.use(cors())

const postConfirmation = (req, res, next) => {
  const { body, method, url } = req
  console.log(method, url, body)
  next()
}

const errorHandler = (err, req, res, next) => {
  console.error(err.message)
  if (!err.statusCode) err.statusCode = 500
  res.status(err.statusCode).send(err.message)
}

let notes = [
  {
    id: 1,
    content: 'Mad KOI',
    important: true,
    date: '27/03/2024'
  },
  {
    id: 2,
    content: 'G2',
    important: false,
    date: '27/03/2024'
  }
]

app.get('/', (request, response) => {
  response.send('<h1>HOLA MUNDO</h1>')
})

app.get('/api/notes', (request, response) => {
  response.send(notes)
})

app.get('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const findId = notes.find((note) => note.id === id)
  response.send(findId)
})

app.delete('/api/notes/:id', (request, response) => {
  const id = Number(request.params.id)
  const filterId = notes.filter((note) => (note.id !== id))
  response.send(filterId)
})

app.post('/api/notes', postConfirmation, (request, response) => {
  const note = request.body
  const ids = notes.map((note) => note.id)
  const maxIds = Math.max(...ids)
  const notesName = notes.map(note => (note.content))
  const valueName = notesName.includes(note.content)
  if (valueName) {
    console.error('name must be unique')
  } else {
    const newNote = {
      id: maxIds + 1,
      content: note.content,
      important: note.important
    }
    notes = [...notes, newNote]
    console.log(notes)
    response.json(newNote)
  }
})

app.use(errorHandler)

const PORT = process.env.PORT || 3000
app.listen(PORT)
console.log(`server running in port ${PORT}`)

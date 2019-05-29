const express = require('express')

const app = express()
app.use(express.json())

const {PORT: port = 3000} = process.env

app.post('/', (req, res) => {
    const {msg, id} = req.body

    switch (msg.toLowerCase()) {
        case 'ping': 
          res.json({msg: 'pong'})
          break;
    }
})

app.listen(port, () => console.log(`Example app listening on port ${port}!`))
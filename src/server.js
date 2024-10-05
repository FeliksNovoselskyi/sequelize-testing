const express = require('express')
const path = require("path")
const dataBase = require('./database')

const app = express()

const PORT = 3000
const HOST = 'localhost'

app.set("view engine", "ejs")
app.set("views", path.join(__dirname, 'templates'))
app.use('/static', express.static(path.join(__dirname, 'static')))

app.use(express.urlencoded({extended: true}))

let context

app.get('/', (req, res) => {
    context = {}

    context.error = null

    res.render('main', context)
})

app.post('/', (req, res) => {
    context = {}
    
    const {firstName, lastName, action} = req.body

    if (action === 'create') {
        if (!firstName || !lastName) {
            context.error = 'Fill inputs'
        } else {
            dataBase.User.create({firstName: firstName, lastName: lastName})
            context.error = null
        }
    } else if (action === 'delete') {
        dataBase.User.destroy({
            where: {}
        })
        context.error = null
    }

    res.render('main', context)
})

app.get('/user/', (req, res) => {
    context = {}

    context.error = null

    res.render('user', context)
})

app.post('/user/', (req, res) => {
    context = {}

    const {nameInput, action} = req.body

    if (action === 'deleteUser') {
        if (!nameInput) {
            context.error = 'Fill input'
        } else {
            try {
                dataBase.User.destroy({
                    where: {firstName: nameInput}
                })
            } catch {
                context.error = 'User not found'
            }

            context.error = null
        } 
    }

    res.render('user', context)
})

app.listen(PORT, HOST, () =>{
    console.log(`Started on http://${HOST}:${PORT}`)
})
require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require("jsonwebtoken")

app.use(express.json())

const posts = [
    {
        username: 'soorya',
        title: 'post1'
    },
    {
        username: 'mahesh',
        title: 'post2'
    }
]


app.get('/posts', authenticteToken, (req, res) => {
    
    res.json(posts.filter(post => post.username === req.user.name))
})





function authenticteToken(req, res, next) {
    
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]

    if (token == null) return res.sendStatus(401)
    
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        console.log(user,'myuser');
        if (err) return res.sendStatus(403)
        req.user = user
        next()
    })
}
console.log("running in port 3000");
app.listen(3000)
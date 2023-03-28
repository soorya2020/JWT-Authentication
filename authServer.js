require('dotenv').config()

const express = require('express')
const app = express()

const jwt = require("jsonwebtoken")

app.use(express.json())

let refreshTokenArray = []

app.post('/newtoken', (req, res) => {
    const refreshToken = req.body.refreshToken
    if (refreshToken == null) return res.sendStatus(401);
    if (!refreshTokenArray.includes(refreshToken)) return res.sendStatus(403)
    jwt.verify(refreshToken, process.env.REFRES_TOKEN_SCRET, (err, user) => {
        if (err) return res.sendStatus(403)
        const accessToken = generateAccessToken({ name: user.name })
        res.json({ accessToken: accessToken })
    })

})

app.post('/login', (req, res) => {
    // //authenticte
    const username = req.body.username
    const user = { name: username }

    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefressToken(user)
    refreshTokenArray.push(refreshToken)
    res.json({ token: accessToken, refreshToken: refreshToken })
})

app.delete('/logout', (req, res) => {
    console.log('logont');
    refreshTokenArray = refreshTokenArray.filter(token => token != req.body.token)
    res.sendStatus(204)
})



function generateAccessToken(user) {
    return jwt.sign(user, process.env.ACCESS_TOKEN_SECRET, { expiresIn: "20s" })
}
function generateRefressToken(user) {
    return jwt.sign(user, process.env.REFRES_TOKEN_SCRET)
}

console.log('running in port 4000');
app.listen(4000)
import express from "express"
import bodyParser from "body-parser"
import functions from "./apiCalls.js"
import multer from "multer"
import coinbase from "coinbase-commerce-node"
import dotenv from "dotenv"
dotenv.config()


const app = express()
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

// Coinbase setup
const Client = coinbase.Client
Client.init(process.env.API_KEY)
const Charge = coinbase.resources.Charge

var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, "public")
    },

    filename: function(req, file, cb){
        cb(null, Date.now() + "-" + file.originalname)
    }
})

app.post("/createUser", (req, res) => {
    const body = req.body

    functions.createUser(body.firstName, body.lastName, body.username)
    .then((data) => {
        res.json(data)
    })
})

app.get("/getProfile", (req, res) => {
    const user = req.query.user
    functions.getProfile(user).then((data) => res.json(data))
})

var upload = multer({storage: storage})

app.post("/createPost", upload.single("file"), (req, res) => {
    const body = req.body
    functions.createPost(body.user, body.caption, req.file)
    .then((data) => res.json(data))
})

app.get("/getPostsOfFollowing", (req, res) => {
    const user = req.query.user
    functions.getPostsOfFollowing(user).then((data) => {
        var posts = data[0].following
        posts = posts.map((post) => post.posts)
        posts = posts.flat(1)
        res.json(posts)
    }).catch((err) => {res.json([]); console.log(err)})
})

app.get("/getAllPosts", (req, res) => {
    functions.getAllPosts(user).then((data) => res.json(data))
})

app.get("/searchForUsername", (req, res) => {
    const text = req.query.text
    functions.searchForUsername(text)
    .then((data) => res.json(data))
})

app.get("/getPosts", (req, res) => {
    const user = req.query.user
    functions.getPosts(user).then((data) => res.json(data))
})

app.post("/updateProfile", upload.single("file"), (req, res) => {
    const body = req.body
    functions.updateProfile(body.user, body.first_name, body.last_name, body.bio, req.file)
    .then((data) => res.json(data))
})

app.post("/addFollower", (req, res) => {
    const body = req.body
    functions.addFollower(body.user, body.id).then((data) => res.json(data))
})

app.delete("/removeFollower", (req, res) => {
    const body = req.body
    functions.removeFollower(body.user, body.id).then((data) => res.json(data))
})

app.post('/charge', (req, res) => {
    let chargeData = {
        name: req.body.name,
        description: req.body.description,
        local_price: {
            amount: req.body.amount,
            currency: 'USD'
        },
        pricing_type: 'fixed_price'
    }

    Charge.create(chargeData, (err, response) => {
        if (err) res.status(400).send({message: err.message})
        else res.status(200).send(response)
        console.log(response)
    })
})

app.post('/status', (req, res) => {
    let id = req.body.id
    Charge.retrieve(id, (err, charge) => {
        if(charge['timeline'][0]['status'] == 'NEW') {
            try{
                if (charge['timeline'][1]['status'] == 'PEDNING' && charge['timeline'].length == 2) {
                    return res.status(200).send({message: 'Payment pending, awaiting confirmations.'})
                }
                else if(charge['timeline'][1]['status'] == 'EXPIRED') {
                    return res.status(400).send({message: 'Payment expired'})
                }
                else if(charge['timeline'][2]['status'] == 'COMPLETED'){
                    return res.status(200).send({message: 'Payment completed.'})
                }
            }
            catch(err){
                return res.status(200).send({message: 'No payment detected'})
            }
        }
        else{
            return res.status(400).send({message: 'Charge not found.'})
        }
    })
})

app.listen(3001, () => console.log("server running on 3001"))
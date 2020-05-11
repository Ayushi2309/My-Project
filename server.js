const express = require('express')
const mongodb = require('mongodb')
const path = require('path')
const parser = require('body-parser')

const app = express()
app.set('view engine', 'ejs')
const new_db = "mongodb://localhost:27017/formdata"
const MongoClient = mongodb.MongoClient

app.get('/', (req, res) =>{
res.set({
		'Access-Control-Allow-Origin' : '*'
	})
    return res.redirect('/public/index.html')
})
// app.get('/success', (req, res) =>{
// 		return res.render('success')
// 	}).listen(8080)
	
app.get('/hello',(req, res) => {
    MongoClient.connect(new_db, {useUnifiedTopology: true}, {useNewUrlParser: true}, (error, client) =>{
    if(error){
        return console.log('Unable to connect to database!')
    }
	const db = client.db('formdata')
	db.collection('users').find({}).toArray((err, result) => {
		if(err){
			res.send("Some error occured")
		}

	console.log('Connected correctly')
	return res.render('list',{
		result : result
	})
    })
    })
})
app.get('delete/:id', (req, res) => {
	res.send("Hello")
})
app.listen(3000)
console.log('Server is up on port 3000!')


app.use('/public', express.static(__dirname + '/public'))
app.use( parser.json() )
app.use(parser.urlencoded({ 
	extended: true
}))

app.post('/submit', (req, res) =>{
    const name = req.body.name;
	const email= req.body.email;
	const password = req.body.password;
    const phone = req.body.phone;
    
    const data = {
		"name":name,
		"email":email,
		"password": password, 
		"phone" : phone
    }
    
    mongodb.connect(new_db , (error , db) =>{
		if (error){
			throw error;
		}
		console.log("Connected to database successfully !!");
		
		db.collection("users").insertOne(data, (err , collection) => {
			if(err) throw err;
			console.log("Record inserted successfully");
			console.log(collection);
		})
    })

    console.log("DATA is " + JSON.stringify(data) )
	res.set({
		'Access-Control-Allow-Origin' : '*'
	})
	return res.render('success')
})





require('dotenv').config()
const express = require('express');
require('./db/conn');
const Library = require('./models/librarys');
const app = express();
const path = require('path');
const hbs = require('hbs');
const bcrypt = require('bcryptjs');
const cookiesParser = require('cookie-parser');
const auth = require('./middleware/auth');




const port = process.env.PORT || 8000
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookiesParser());

const static_path = path.join(__dirname, '../public');
const view_path = path.join(__dirname, '../templates/views');
const partials_path = path.join(__dirname, '../templates/partials');

app.use(express.static(static_path));
app.set('view engine', 'hbs');
app.set('views', view_path);
hbs.registerPartials(partials_path);



app.get('/', async (req, res) => {
    res.render('index');
})


app.get('/books',auth,async(req,res)=>{
    res.render('books')
})
app.get('/login', async (req, res) => {
    res.render('login');
})

app.get('/signup', async (req, res) => {
    res.render('signup');
})
app.get('/about',auth, async (req, res) => {
    res.render('about');
})
app.get('/education', async (req, res) => {
    res.render('education');
})
app.get('/romance', async (req, res) => {
    res.render('romance');
})
app.get('/science', async (req, res) => {
    res.render('science');
})
app.get('/anime', async (req, res) => {
    res.render('anime');
})

app.get("/logout", auth, async (req, res) => {
    try {
        console.log(req.user);
        // for cookies removel from database and single logout
        // req.user.tokens = req.user.tokens.filter((currElement) => {
        //     return currElement.token !== req.token;
        // })


        // logout from all devieces
        req.user.token = [];


        // omly cookies removable
        res.clearCookie('jwt');
        console.log("Logout Succesfully");
        await req.user.save();
        res.render('index');
    } catch (err) {
        res.status(500).send(err);
    }
})




app.post('/signup', async (req, res) => {
    try {
        const password = req.body.password;
        const cpassword = req.body.confirmpassword;
        if (password === cpassword) {
            const reader = new Library({
                name: req.body.name,
                email: req.body.email,
                password: req.body.password,
                confirmpassword: req.body.confirmpassword

            })
            // genrating token 
            const token = await reader.genrateAuthToken();
            console.log("the tone==" + token);
            res.cookie("jwt", token);
            // console.log(cookie)



            const user = await reader.save();
            console.log(user);
            res.status(201).render('books');
        } else {
            res.send("Correcct your Password")
        }

    } catch (err) {
        res.status(400).send(err);
    }
})

app.post('/login', async (req, res) => {
    try {
        const email = req.body.email;
        const password = req.body.password;
        const userDetail = await Library.findOne({ email: email });
        const isMct = await bcrypt.compare(password, userDetail.password);
        const token = await userDetail.genrateAuthToken();
        res.cookie("jwt", token);
        // console.log(cookie)
        if (isMct) {
            res.status(201).render('books');
        }
        else {
            res.send("Invalid Login Detail")
        }
    } catch (error) {
        res.status(400).send("Invalid credentails")
    }
})








app.listen(port, () => {
    console.log(`connecting the port ${port}`);
})

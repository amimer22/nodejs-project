const express = require('express');
const mysql = require('mysql');
const app = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());

//db parameters
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'app',
});

connection.connect((err)=>
{
    if (err) {
        console.log(err);
    }
    else {console.log('connection to db seccessful');}
});


app.set('view engine', 'ejs');

app.listen(5000);

app.get('/',(req,res) => 
{
    res.render('index.ejs');
});
app.get('/login',(req,res) => 
{
    res.render('login.ejs');
});
app.post("/login" ,(req,res) => {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordconfirm = req.body.passwordconfirm;
    connection.query("select * from infos where email = ? and password = ?" , [email,password],(err,results, fields) => {
        if (results.length > 0) {
            return res.render('profile.ejs');
        }
        else {
            //alert("something is wrong try again");
            //return res.render('login.hbs' ,{message : 'wrong try again'});
            return res.render('login.ejs',{errorMessage: 'wrong credentials!'});
        }
        
    })  
})
app.get('/register',(req,res) => 
{
    res.render('register.ejs');
});
app.post('/register', (req,res) => 
{
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const passwordconfirm = req.body.passwordconfirm;
    connection.query('select email from infos where email = ?', [email] , async (err,results)=>
    {
        if (err) {
            console.log(err);
        }
        else if (results.length > 0) {
            return res.render('register',{message : 'email is already in use'})
        }
        else if (password !== passwordconfirm) {
            return res.render('register', {message: 'password do not match '})
        }

        let hashedpwd = await bcrypt.hash(password,8);
        connection.query('insert into infos set ? ', {name : name , email : email , password} , (err,results) => 
        {
            if (err) {
                console.log(err);
            }
            else { return res.render ('register' , {message : 'registered'})}
        })

    });
} ) 
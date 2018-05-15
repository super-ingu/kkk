
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mysql = require('mysql');         //mysql 연동
var session = require('express-session');
var client = mysql.createConnection({   //host컴퓨터인 자신의 컴퓨터 연결
   hostname:"127.0.0.1:3306",
   user:"root",
   password:"dlsrn",
   database:"darack"
});

client.connect(function(err){
   console.log('MySQLConnect');
   if(err){
      console.error('MySQL Connection Error');
      console.error(err);
      throw err;
   }
});

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));
app.use(session({secret:'keyboard cat',   resave:false, savdUninitialized:true}));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
   res.render('index.html');
});

app.get('/sign_up', function(req,res){
	res.render('sign_up.html');
})


app.post('/logincheck',function(req, res){
    var uid = req.body.id;
    var upw = req.body.pw;
    var query = client.query('SELECT count(*) cnt FROM user WHERE u_email=? and u_pw=?',[uid,upw],function(err, rows){
       if(err)   console.error('err', err);
       var cnt = rows[0].cnt;
       if(cnt ===1 ){
          res.send('<h1>login success</h1>'); 
        }else{ 
          res.send('<script> alert("id or password is wrong");history.back();</script>');
       }
    });
 });

 
http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});





app.post('/users',function(req,res){ 			//이거 ㄱㄱ

	var uemail = req.body.email;
	var upw = req.body.pw;
	var uname = req.body.name;
	var uphone = req.body.phone;
	var uage = req.body.age;
    
    
    
    var query = client.query('insert into user (u_email, u_pw, u_name, u_phone, u_age) values (?, ?, ?, ?, ?)',[uemail,upw,uname,uphone,uage],function(err,result){
   
    
    	

        console.log(result);

    	
        if (err) {

            console.error(err);

            throw err;

        }

        console.log(query);

    });
    res.send('<h1>'+uname+'님 환영합니다.</h1>'); 
});
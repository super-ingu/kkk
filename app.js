
/**
 * Module dependencies.
 */

var express = require('express');
var app = express();
var routes = require('./routes');
var user = require('./routes/user');
var http = require('http');
var path = require('path');
var mysql = require('mysql');         //mysql 연동
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
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


var sessionStore = new MySQLStore({
   hostname:"localhost",
   port:"3306",
   user:"root",
   password:"dlsrn",
   database:"darack"
});

app.use(session({
	resave: false,
	saveUninitialized: true,
//  key: 'sid', // 세션키
  secret: 'secret', // 비밀키
  store: sessionStore

}));


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

//app.use(express.cookieParser());



// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', function(req, res){
   res.render('login.html');
});

app.get('/sign_up', function(req,res){
	res.render('sign_up.html');
})



////////////////////////////////////////////////
//delete req.session.sessionId
//////////////////////////////////////

app.post('/logincheck',function(req, res){
    var uid = req.body.id;
    var upw = req.body.pw;
    var query = client.query('SELECT count(*) cnt, u_email FROM user WHERE u_email=? and u_pw=?',[uid,upw],function(err, rows){
       if(err)   console.error('err', err);
       var cnt = rows[0].cnt;
       var email = rows[0].u_email;
       if(cnt ===1 ){
    	   
    	   
    	   req.session.sessionId = email;
//    	   res.cookie('auth', true);
//    	   req.session.cookie.id=email;
    	   res.redirect('/main');
        }
       else{ 
          res.send('<script> alert("id or password is wrong");history.back();</script>');
       }
    });
 });

app.get('/logout',function(req, res){
	delete req.session.sessionId;
	res.redirect('/');
})

 app.get('/main',function(req, res){
	 var n = 1;
	if(req.session.sessionId){
		var query = client.query('SELECT * FROM board ORDER BY b_id DESC LIMIT ?, 10',[0],function(err, rows){
			if(err) console.error('err', err);
			res.render('main',{
				aaa:req.session.sessionId,
				brows:rows,
				length:rows[0].b_id
				
			});
		});
	}
	else{
		res.redirect('/');
	}
 });



app.get('/main:number', function(req, res){

	   var n=req.params.number*1;
	   if(!req.session.sessionId){
	      res.redirect('/');
	   }
	   else{
	      var query = client.query('SELECT * FROM board ORDER BY b_id DESC', function(err, rows){
	         if(err)   console.error('err', err);
	         var rows1=rows;
	         var query = client.query('SELECT * FROM board ORDER BY b_id DESC LIMIT ?, 10',[(n-1)*10], function(err, rows){
	            if(err)   console.error('err', err);
	            res.render('main',{
	               aaa:req.session.sessionId,
	               brows:rows,
	               
	               length:rows1[0].b_id
	            });
	         });
	      });
	   }
	});

app.get('/inform',function(req, res){
	
	if(req.session.sessionId){
		var query = client.query('SELECT * FROM board where b_group=3',function(err,rows1){
			if(err)
				console.error('err', err);
		
		var query = client.query('SELECT * FROM board ORDER BY b_id DESC LIMIT ?, 10',[0],function(err, rows2){
			if(err)
				console.error('err', err);
			
			
			var rows = new Array();
			var len=0;
			for(var i=0;i<rows1.length;i++){
				for(var l=0;l<rows2.length;l++){
					if(rows1[i].b_id===rows2[l].b_id){
						rows[len]=rows1[i];
						len++;
					}
					
				}
			}
			console.log(rows+len);
			
			res.render('inform',{
				aaa:req.session.sessionId,
				brows:rows,
				length:len
				
			});
		});
			
	});
		
		
	}
	else{
		res.redirect('/');
	}
});

app.get('/inform',function(req, res){
	
	if(req.session.sessionId){
		var query = client.query('SELECT * FROM board where b_group=3',function(err,rows1){
			if(err)
				console.error('err', err);
		
		var query = client.query('SELECT * FROM board ORDER BY b_id DESC LIMIT ?, 10',[0],function(err, rows2){
			if(err)
				console.error('err', err);
			
			
			var rows = new Array();
			var len=0;
			for(var i=0;i<rows1.length;i++){
				for(var l=0;l<rows2.length;l++){
					if(rows1[i].b_id===rows2[l].b_id){
						rows[len]=rows1[i];
						len++;
					}
					
				}
			}
			console.log(rows+len);
			
			res.render('inform',{
				aaa:req.session.sessionId,
				brows:rows,
				length:len
				
			});
		});
			
	});
		
		
	}
	else{
		res.redirect('/');
	}
});


app.get('/hot', function(req,res){
 var n = 1;
	if(req.session.sessionId){
		var query = client.query('SELECT * FROM board ORDER BY b_cnt DESC LIMIT 0,10',function(err, rows){
			if(err) console.error('err', err);
			res.render('hot',{
				aaa:req.session.sessionId,
				brows:rows,
				length:rows[0].b_id
				
			});
		});
	}
	else{
		res.redirect('/');
	}
});



app.get('/writeform',function(req,res){
	if(req.session.sessionId)
		res.render('writeform.html');
	else
		res.redirect('/');
});

app.get('/contentview:number',function(req,res){
	
	var query = client.query('UPDATE board SET b_cnt = b_cnt+1 WHERE b_id=?',
			[req.params.number*1],function(err, rows){
		if(err) console.error('err',err);
	});
	var query = client.query('SELECT * from board WHERE b_id=?',[req.params.number],function(err, rows){
		if(err)
			console.error('err', err);
		var query = client.query('SELECT * from board WHERE b_id=?',[req.params.number],function(err2, rows2){
			if(err2)
				console.error('err2', err2);
			var query = client.query('SELECT * from comment where b_id=?',[req.params.number],function(err3,rows3){
				if(err3)
					console.error('err3',err3);
			
				res.render('contentview',{
					aaa:req.session.sessionId,
					content:rows[0],
					lenn:rows3.length,
					
					crow0:rows3[0],
					crow1:rows3[1],
					crow2:rows3[2],
					crow3:rows3[3],
					crow4:rows3[4],
					crow5:rows3[5],
					crow6:rows3[6],
					crow7:rows3[7]
					
				});
			});
		});
		
	});
});	

app.get('/update:number',function(req,res){
	
	var query = client.query('SELECT * FROM board where b_id=?',[req.params.number], function(err, rows){
        if(err)   console.error('err', err);
        
        res.render('update',{
           aaa:req.session.sessionId,
           brows:rows
        });
     });
	
});

app.post('/update:number',function(req,res){
	var btitle = req.body.title;
	var bcontent = req.body.content;
	var query = client.query('UPDATE board SET b_title=?, b_content=? where b_id=?',[btitle,bcontent,req.params.number],function(err,rows){
		if (err){
			throw err;

		}
		var query = client.query('SELECT * FROM board ORDER BY b_id DESC LIMIT ?, 10',[0],function(err, rows){
			if(err) console.error('err', err);
			res.render('main',{
				aaa:req.session.sessionId,
				brows:rows,
				length:rows[0].b_id
				
			});
		});
		
	});
});

app.post('/write',function(req,res){
	
	var btitle = req.body.title;
	var bwriter=req.session.sessionId;
	var bdate = req.body.date;
	var bcnt = 0;
	var bcontent = req.body.content;
	var bgroup = req.body.group;
	
	var query = client.query('insert into board (b_title, b_writer, b_date, b_cnt, b_content, b_group) values (?, ?, ?, ?, ?, ?)'
			,[btitle,bwriter,bdate,bcnt,bcontent,bgroup],function(err,result){
				
				if (err) {
					console.error(err);
					throw err;
				}
				else{
					
					res.send('<script>alert("sdlfksdjfisjflfkjsdi")</script>');
				}
				console.log(query);
				
			});

});

app.post('/comment:number',function(req,res){
 	
	var ccomment = req.body.comment;
	var cwriter=req.session.sessionId;
	req.params.number;
	var query = client.query('INSERT into comment (b_id, c_content, c_writer) values (?, ?, ?)',
			[req.params.number, ccomment, cwriter]);
	

	var query = client.query('SELECT * from board WHERE b_id=?',[req.params.number],function(err, rows){
		if(err)
			console.error('err', err);
		
		var query = client.query('SELECT * from comment where b_id=?',[req.params.number],function(err2,rows2){
			if(err2)
				console.error('err',err2);
		
			res.render('contentview',{
				aaa:req.session.sessionId,
				lenn:rows2.length,
				content:rows[0],
				crow0:rows3[0],
				crow1:rows3[1],
				crow2:rows3[2],
				crow3:rows3[3],
				crow4:rows3[4],
				crow5:rows3[5],
				crow6:rows3[6],
				crow7:rows3[7]

			});
		});
		
	});
	
})

app.post('/serch',function(req,res){
	var bserch = req.body.ser;
	var bserch_type = req.body.serch_type;
	if(bserch_type==="1")
	{
		client.query('SELECT * from board where b_title = ?',[bserch],function(err, rows){
			if(err) console.error('err',err);
			console.log(rows+bserch);
			if(!rows){
				res.send('<script>alert("원하는 책 데이터가 없습니다!");history.back();</script>');
				return;
			}
			else{
				res.render('main',{
					aaa:req.session.sessionId,
					brows:rows,
					length:rows.length
					
				})
			}
			
		
		});
	}
	else
	{
		client.query('SELECT * from board where b_writer = ?',[bserch],function(err, rows){
			if(err) console.error('err',err);
			console.log(rows+bserch);
			if(!rows){
				res.send('<script>alert("원하는 책 데이터가 없습니다!");history.back();</script>');
				return;
			}
			else{
				res.render('main',{
					aaa:req.session.sessionId,
					brows:rows,
					length:rows.length
					
				})
			}
			
		
		});
	}	
	
});



app.post('/users',function(req,res){ 			//이거 ㄱㄱ

	var uemail = req.body.email;
	var upw = req.body.pw;
	var uname = req.body.name;
	var uphone = req.body.phone;
	var uage = req.body.age;
    
    
    
    var query = client.query('insert into user (u_email, u_pw, u_name, u_phone, u_age) values (?, ?, ?, ?, ?)'
    		,[uemail,upw,uname,uphone,uage],function(err,result){
   
    
    	

        console.log(result);

    	
        if (err) {

            console.error(err);

            throw err;

        }

        console.log(query);

    });
    res.send('<script>alert("'+uname+'님 환영합니다."); location.href="/";</script>');
});



var server = app.listen(3000, function(){
	console.log("ingoo server");
});
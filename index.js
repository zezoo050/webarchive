var data = [];
var express = require("express");
var app = express();
var multer = require("multer");
var sessions = require("client-sessions")
var path = require('path');
var db = require("sqlite3");
var fs = require("fs")
var db = new db.Database("db/db1.db",function(err){
	if (err){
		console.log(err.message)
	}
	console.log("connecetd sucss")
})
app.set('view engine', 'ejs');
app.use(express.static(__dirname+"/"));
app.use(sessions({
	cookieName : "session",
	secret :"0504141120",
	duration : 30*60*1000,
	activeDuration : 5*60*1000,
	httpOnly : true,
	secure : true,
	ephemeral : true
}));
var fileFilterup = function (req, file, cb) {
  	var ext = ["pdf","jpg","png"]
    if (!ext.includes(file.originalname.split(".").pop())) {
        cb(null, false)
    }
    else{	
    cb(null, true)
    }
  }
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, __dirname+'\\files')
  },
  filename: function (req, file, cb) {
  	console.log()
    const uniqueSuffix=file.fieldname+'-'+Date.now()+'-'+Math.round(Math.random()*1E9)
    fname = uniqueSuffix +path.extname(file.originalname)
    cb(null,  fname)
  }
});
var up = multer({storage: storage,
				fileFilter : fileFilterup
}).array('file');
app.get("/login",function(req,res){
	if (req.session.userid == "1"){
		res.redirect("/search")
	}
	else{
	res.render("../login/login",{error : false});
}
});
app.post("/login",multer().none(),function(req,res){
	if (req.body.username == "admin" && req.body.password == "1") {
		req.session.userid = "1"
		res.redirect("/search")
	}
	else{
		res.render("../login/login",{error:true});
	}
});
app.get("/new",function(req,res){
	if (req.session.userid == "1"){
	res.render("../newarch/newarch");
	}
	else{
	res.redirect("/login/");
}

});

app.post("/new",function(req,res){
	if (req.session.userid == "1"){
    up(req,res,function(err){
    	if (err) {
    		res.send(err)
    	}
    	if ("flaws" in req.body){
    		var flaws = req.body.flaws
    	}
    	else{
    		var flaws = []
    	}
    	var f = []
    	if (req.files){
    		for (var i =0;i<req.files.length;i++){
    			f.push([req.files[i].filename.split('.').slice(0,-1).join('.'),req.files[i].filename,req.files[i].originalname])
    		}
    	}
    	var arch = [
    		req.body.archnum,
    		req.body.piecenum,
    		req.body.ownername,
    		req.body.ownerid,
    		req.body.location
    	]
    	db.run("insert into arch values((select ifnull((max(num) +1),1) from arch),?,?,?,?,?)",arch,function(err){
    		if (err){
    			console.log(err)
    		}
    		else {
    		for (i = 0 ; i < flaws.length ; i++){
    			db.run("insert into flaws values((select num from arch where rowid = ?),?)",this.lastID,flaws[i])

    		
    		}
    		for (i = 0 ; i < f.length ; i++){
    			f[i].unshift(this.lastID)
    			db.run("insert into files values((select num from arch where rowid = ?),?,?,?)",f[i])
    		}
    		}
    	})
    	data.push({num :(data.length+1),arch:arch});
    	res.redirect("/new")
    });
    }
	else{
	res.render("../login/login",{error : false});
}
  });
app.get("/search",function(req,res){
	if (req.session.userid == "1"){
	var r =[];
		res.render("../search/search",{error : false, arch :r})
	}
	else{
	res.redirect("/login");
}
    });
app.post("/search",function(req,res){
	if (req.session.userid == "1"){
		up(req,res,function(err){
		if (req.body.select=="1") {
			var col = "archnum"
		}
		else if (req.body.select=="2") {
			var col = "piecenum"
		}
		else if (req.body.select=="3") {
			var col = "ownername"
		}
		else if (req.body.select=="4") {
			var col = "ownerid"
		}
		var sql = "select num ,archnum , piecenum, ownername , ownerid , (select count(*) from files where num = arch.num) filesnum from arch where "+col+"= ?"
		db.all(sql,req.body.search,function(err,row){
			if (err){
				res.send(err)
			}
			else if (row.length>0){
				res.render("../search/search",{error : false,arch :row})
			}
			else{
				res.render("../search/search",{error : true,arch :row})
			}
		})
	});	
	}		
	else{
	res.redirect("/login");
}
	});
app.get("/arch/:id",function(req,res){
	if (req.session.userid == "1"){
	var row1;
	var x = function () {
		if (row1){
		res.render("../show/show",{arch :row1})
	}
		else{
		res.redirect("/search")
	}
	}
	db.get("select * from arch where num =?",req.params.id,function(err,row){
		row1 = row;
		db.all("select flaw from flaws where num = ?",req.params.id,function(err,row){
		var f = [];
		for (i=0;i<row.length;i++){
		f.push(row[i].flaw)
		}
		row1.flaws = f;
		db.all("select * from files where num = ?",req.params.id,function(err,row){ 
		row1.files = row;
		x()	
	})
	})
	})
	}
	else{
	res.redirect("/login");
	}
    });
app.get("/files/:id", function(req,res){
	if (req.session.userid == "1"){
	db.get("select name from files where iden =?",req.params.id,function(err,row){
	res.download(__dirname+'\\files\\'+row.name)		
	})

}
	else{
	res.redirect("/login");}
})
app.get("/delete/:id",function(req,res){
	if (req.session.userid == "1"){
	var row1;
	var x = function () {
		if (row1){
		res.render("../delete/delete",{arch :row1})
	}
		else{
		res.redirect("/search")
	}
	}
	db.get("select * from arch where num =?",req.params.id,function(err,row){
		row1 = row;
		db.all("select flaw from flaws where num = ?",req.params.id,function(err,row){
		var f = [];
		for (i=0;i<row.length;i++){
		f.push(row[i].flaw)
		}
		row1.flaws = f;
		db.all("select * from files where num = ?",req.params.id,function(err,row){ 
		row1.files = row;
		x()	
	})
	})
	})
	}
	else{
	res.redirect("/login");
	}
    });
app.post("/delete/:id",function(req,res){
	if (req.session.userid == "1"){
	db.run("delete from flaws where num = ?",req.params.id,function(){
		db.all("select name from files where num = ?",req.params.id,function(err,row){
			for (var i = 0; i < row.length; i++) {
				fs.unlinkSync( __dirname+'\\files\\'+row[i].name)
			}
			db.run("delete from files where num = ?",req.params.id,function(){
				db.run("delete from arch where num = ?",req.params.id,function(){
					res.redirect("/search")
				})
			})
		})
	})
	}
	else{
	res.redirect("/login");
	}
})

app.get("/update/:id",function(req,res){
	if (req.session.userid == "1"){
	var row1;
	var x = function () {
		if (row1){
		res.render("../update/update",{arch :row1})
	}
		else{
		res.redirect("/search")
	}
	}
	db.get("select * from arch where num =?",req.params.id,function(err,row){
		row1 = row;
		db.all("select flaw from flaws where num = ?",req.params.id,function(err,row){
		var f = [];
		for (i=0;i<row.length;i++){
		f.push(row[i].flaw)
		}
		row1.flaws = f;
		db.all("select * from files where num = ?",req.params.id,function(err,row){ 
		row1.files = row;
		x()	
	})
	})
	})
	}
	else{
	res.redirect("/login");
	}
    });
app.post("/update/:id",function(req,res){
if (req.session.userid == "1"){
    up(req,res,function(err){
    	if (err) {
    		res.send(err)
    	}
    	if ("flaws" in req.body){
    		var flaws = req.body.flaws
    	}
    	else{
    		var flaws = []
    	}
    	var f = []
    	if (req.files){
    		for (var i =0;i<req.files.length;i++){
    			f.push([req.files[i].filename.split('.').slice(0,-1).join('.'),req.files[i].filename,req.files[i].originalname])
    		}
    	}
    	db.run("update arch set ownername = ? ,ownerid = ?,location = ? where num = ?",req.body.ownername,req.body.ownerid,req.body.location,req.params.id,function(err){
    		if (err){
    			console.log(err)
    		}
    		else {
    		for (i = 0 ; i < flaws.length ; i++){
    			db.run("insert into flaws values((select num from arch where rowid = ?),?)",req.params.id,flaws[i])
    		}
    		for (i = 0 ; i < f.length ; i++){
    			f[i].unshift(req.params.id)
    			db.run("insert into files values((select num from arch where rowid = ?),?,?,?)",f[i])
    		}
    		if (req.body.delflaws){
    			for (var i = 0; i < req.body.delflaws.length; i++) {
    				db.run("delete from flaws where flaw = ?",req.body.delflaws[i])
    			}
    		}
    		if (req.body.delfiles){
    			for (var i = 0; i < req.body.delfiles.length; i++) {
    				db.get("select name from files where iden = ?",req.body.delfiles[i],function(err,row){
    					fs.unlinkSync( __dirname+'\\files\\'+row.name)
    				db.run("delete from files where name = ?",row.name,)
    
    			})
    		}
        }
    	}
    	res.redirect("/search")
    })
    })
}
	else{
	res.redirect("/login");
    }
  })
app.get("*",function (req,res) {
	res.redirect("/login")
});
app.listen(3000,function(){
	console.log("server is running away")
});
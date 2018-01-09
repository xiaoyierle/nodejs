const path = require('path');
const express = require('express');//创建服务器
const cookieParser = require('cookie-parser');//中间件：每次请求过来会被这个函数处理，会在req添加cookies
const session = require('express-session');//req.session
const bodyParser = require('body-parser');//req.body 方的用户post的数据

const server = express();

server.use(express.static('./public'));
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
server.use(cookieParser());

server.get('/',(req,res)=>{
    res.sendFile(path.resolve('./public/index.html'));
});
/*server.get('/a',(req,res)=>{
    res.setHeader('Content-Type','text/html');
    res.end(`
                <form id="form">
                <input type="text" name="user" id="user"/>
                <input type="text" name="abc" id="abc"/>
                <button type="submit">提交</button>
                </form>
                <script >
                    var form = document.querySelector("#form");
                    form.onsubmit = function(e) {
                      e.preventDefault();
                      let o ={
                          user:document.querySelector("$user").value,
                          abc:document.querySelector("$abc").value
                      };
                      fetch('/b',{
                        method:'post',
                        headers:{
                            'Content-Type':'application/json'
                        },
                        body:JSON.stringify(o);
                      })
                    }
                </script>
            `);
});*/
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());
/*server.post('/b',(req,res)=>{
    res.json(req.body)

})*/
/*server.get('/login',(req,res)=>{
    // res.cookie('test','张三',{express:new Date(Date.now() + 5*60*10000)})
    req.session.user='张三';
    res.end('abc');
});*/
/*server.get('/cc',(req,res)=>{
    res.cookie('test2','2',{express:new Date(Date.now() + 5*60*10000)})
    res.end('abc');
});*/
/*const queryString = require('queryString');
server.user(function (req,res,next) {
    let o = {};
    req.headers.cookie.split('; ').forEach(v=>{
        let t = v.split('=');
        o[t[0]]=t[i];
    });
    req.abc = o;
    next;
})*/
/*server.get('/home',(req,res)=>{
    // console.log(req.cookies);
    res.end(req.session.password);
    console.log(req.session.password);
});*/
server.get('/home',(req,res)=>{
    res.sendFile(path.resolve('./home.html'));
});

const mysql = require('mysql');
const con = mysql.createConnection({
    host:'localhost',
    port:3306,
    user:"root",
    password:"",
    database:"waimai"
})
/*con.query('select * from user',(err,data)=>{
    console.log(data);
});
con.query('insert into user (name,password) values (?,?)',['a','b'],(err,data)=>{
    console.log(data.insertId)
})*/
/*con.query('delete from user where id = ?',[2],(err,data)=>{
    console.log(data.affectedRows);//受影响的行数
})
con.query('update user set name = ? , password = ? where id = ?',['abc',123,1],(err,data)=>{
    console.log(data.affectedRows);
})
const queryString = require("querystring");*/
server.get('/login_check',(req,res)=>{
    // let{username,password}=queryString.parse(req.url.split("?")[1]);
    let {username,password}=req.query;
    console.log(username,password)
    con.query('select * from user where name = ?',[username],(err,data)=>{
        if(!data.length){
            res.json('用户名或密码不正确');
        }else{
            if(data[0].password === password){
                req.session.user=username;
                console.log(req.session)
                res.json("ok");
            }else{
                res.json('用户名或密码不正确');
            }
        }
    })
});
server.get('/get_user',(req,res)=>{
    res.json(req.session.user);
});
server.post('/register',(req,res)=>{
    let {name,password,gender} = req.body;
    let sql = 'insert into user (name,password)values(?,?)';
    con.query(sql,[name,password],(err,data)=>{
        if(!err && data.insertId){
            req.session.user = name;
            res.json('ok');
        }
    })
})
/*server.use(function (req,res,next) {
    if(req.session.username){
        next()
    }else{
        res.end('403');
    }
})*/
server.get('/news_list',(req,res)=>{
    res.json(['a','b','c'])
})
server.listen(8081,()=>{
    // open(8081);
});
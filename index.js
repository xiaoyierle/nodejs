const path = require('path');
const express = require('express');//创建服务器
const cookieParser = require('cookie-parser');//中间件：每次请求过来会被这个函数处理，会在req添加cookies
const session = require('express-session');//req.session
const bodyParser = require('body-parser');//req.body 方的用户post的数据
const multer = require('multer');
var request = require('request');
const server = express();//常量
const fs = require('fs');
const os = require('os');
//保持到数据库的连接
const con = require('./mysql');//常量
//1.处理.js .css 图片等静态的资源，可以以文件名作为资源名来访问
server.use(express.static('./public'));
//2.处理session的，在用户的浏览器里记录一个COOKIE,存的只是一个变量，客户端存储标识，在服务器的内存里保存下来
// var o = {
//     'conet.sid=zzzzzzzz':{user:'zahngsan'}
//     'conet.sid=zzzzz':{user:'san'}
// }
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
//3.处理cookie的，可设置过期时间，一些时间不涉及安全，又有过期时间就用cookie，这个是用来收cookie的
server.use(cookieParser());

//4.收集post请求中的数据的 content-type.一部分是头信息，一部分是内容，一个是XWWW的 一个是处理application/json
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());//处理application/json
// x-www-urlencoded 默认表单
// application/json fetch
//////////////////////////////////////////////////////////////////////////////
// 1.url代表一个资源
// 2./   index.html                      资源 页面 (用户键入url敲回车)
// 3./users [{id:1,name:'a'},......]     api接口通常是ajax发起的 applition interface
// 4./inex.js
//                 静态资源
////////////////////////////////////////////////////////////
server.get('/',(req,res)=>{
    res.sendFile(path.resolve('./public/index/index.html'));
})
server.get('/admin',(req,res)=>{
    res.sendFile(path.resolve('./public/admin/index.html'));
})
//////////////////////////////////////////////
////////////////////商家
//商家登录
server.get('/login_check',(req,res)=>{
    let {username,password}=req.query;
    con.query('select * from user where name = ?',[username],(err,data)=>{
        if(!data.length){
            res.json('用户名或密码不正确');
        }else{
            if(data[0].password === password){
                req.session.user=username;
                req.session.uid = data[0].id;
                res.json("ok");
            }else{
                res.json('用户名或密码不正确');
            }
        }
    })
});

//商家获取用户名
server.get('/get_user',(req,res)=>{
    if(req.session.user){
        res.json(req.session.user);
    }else{
        res.json({code:4})
    }
});
//获得店铺
server.get('/get_store',(req,res)=>{
    let id = req.session.uid;
    let sql = 'select * from store where uid = ?';
    con.query(sql,[id],(err,data)=>{
        if(!err&&data.length){
            res.json(data);
        }else{
            res.json({code:4,message:'目前还没有店铺，请先添加店铺'})
        }

    })
})
//获得分类
server.get('/get_cate',(req,res)=>{
    let id = req.session.uid;
    con.query('select * from store where uid = ? ',[id],(err,data)=>{
        if(!err){
            let sql = 'select * from cate where store_id = ?';
            con.query(sql,[data[0].id],(err,data)=>{
                if(!err){
                    res.json(data);
                }
            })
        }
    })
})
server.get('/get_cates',(req,res)=>{//第二版单店铺版
    let id = req.session.uid;
    con.query('select * from abd where uid = ? ',[id],(err,data)=>{
        if(!err&&data.length){
            res.json(data);
        }else{
            res.json({code:4,message:'目前还没有店铺或分类，请先添加分类'})
        }

    })
})
server.get('/get_goods',(req,res)=>{
    let id = req.session.uid;
    con.query('select * from store where uid = ? ',[id],(err,data)=>{
        if(!err){
            let sql = 'select * from goods where store_id = ?';
            con.query(sql,[data[0].id],(err,data)=>{
                if(!err){
                    res.json(data);
                }
            })
        }
    })
})
server.get('/get_goods2',(req,res)=>{
    const sql = 'select * from abc where uid = ?';
    con.query(sql,[req.session.uid],(err,data)=>{
        if(!err&&data.length){
            res.json(data)
        }else{
            res.json({code:4,message:'目前还没有店铺或分类或商品，请添加'})
        }
    })
})
server.get('/add_goods_getcate',(req,res)=>{
    let {id} = req.query;
        let sql = 'select * from cate where store_id = ?';

        con.query(sql,[id],(err,data)=>{
            if(!err){
                res.json(data);
            }
        })
})
//注册
server.post('/register',(req,res)=>{
    let {name,password,gender} = req.body;
    let sql = 'insert into user (name,password)values(?,?)';
    con.query(sql,[name,password],(err,data)=>{
        if(!err && data.insertId){
            req.session.user = name;
            req.session.uid = data.insertId;
            res.json('ok');
        }
    })
})
//修改密码
server.post('/change_password',(req,res)=>{
    let {oldpassword,password} = req.body;
    let sql = 'select * from user where id = ?';
    con.query(sql,[req.session.uid],(err,data)=>{
        if(oldpassword!==data[0].password){
            res.json('旧密码输入错误');
        }else{
            let sql = 'update user set password =? where name =?';
            con.query(sql,[password,req.session.user],(err,data)=>{
                if(!err){
                    delete req.session.user;
                    delete req.session.uid;
                    res.json('ok');
                }
            })
        }
    })
})
server.post('/add_store',(req,res)=>{
    let {name,desc,address,deliever,price}=req.body;
    let {store_file} = req.session;
    let o = store_file.path;
    let n = store_file.filename+path.extname(store_file.originalname);
    let d = path.resolve(
        './public/upload/'+n
    )
    // fs.renameSync(o,d);
    var readStream=fs.createReadStream(o);
    var writeStream=fs.createWriteStream(d);
    readStream.pipe(writeStream);
    readStream.on('end',function(){
        fs.unlinkSync(o);
    });
    const pic = '/upload/' + n;
    let sql = 'insert into store (`name`,`pic`,`desc`,`uid`,`address`,`deliver`,`price`) values (?,?,?,?,?,?,?)';
    con.query(sql,[name,pic,desc,req.session.uid,address,deliever,price],(err,data)=>{
        if(!err&&data.insertId){
            res.json('ok');
            req.session.store_id = data.insertId;
        }else{
            res.json(err.message);
        }
    })
})
server.post('/add_cat',(req,res)=>{
    let {name,desc,id} = req.body;
    let sql = 'insert into cate (`name`,`desc`,`store_id`) values (?,?,?)';
    con.query(sql,[name,desc,id],(err,data)=>{
        if(!err&&data.insertId){
            res.json('ok');
        }else{
            res.json(err.message);
        }
    })

})
server.post('/add_cate1',(req,res)=>{
    const {name,desc} = req.body;
    const s = 'select * from store where uid = ?';
    con.query(s,[req.session.uid],(err,data)=>{
        if(data.length){
            const sid = data[0].id;
            const sql = 'insert into cate (`name`,`desc`,`store_id`) values (?,?,?)';
            con.query(sql,[name,desc,sid],(err,data)=>{
                if(!err&&data.insertId){
                    res.json('ok');
                }else{
                    res.json({code:4,message:'目前还没有店铺，请添加店铺'});
                }
            })
        }else{
            res.json({code:4,message:'目前还没有店铺，请添加店铺'})
        }
    })
})
server.post('/add_goods',(req,res)=>{
    let {name,desc,store_id,cate_id,pic,price} = req.body;
    let sql = 'insert into goods (`name`,`desc`,`store_id`,`cate_id`,`pic`,`price`) values (?,?,?,?,?,?)';
    con.query(sql,[name,desc,store_id,cate_id,pic,price],(err,data)=>{
        if(!err&&data.insertId){
            res.json('ok');
        }else{
            res.json(err.message);
        }
    })

})
server.post('/add_goods1',(req,res)=>{
    let {name,desc,cate_id,price} = req.body;
    const file = req.session.goods_file;
    const fileName = file.filename + path.extname(file.originalname);
    const o = file.path;
    const d = path.resolve('./public/upload/'+fileName);
    var readeStream = fs.createReadStream(o);
    var writeStream = fs.createWriteStream(d);
    readeStream.pipe(writeStream);
    readeStream.on('end',function(){
        fs.unlinkSync(o)
    })
    const pic = '/upload/'+fileName;
    let sql = 'insert into goods (`name`,`desc`,`cate_id`,`pic`,`price`) values (?,?,?,?,?)';
    con.query(sql,[name,desc,cate_id,pic,price],(err,data)=>{
        if(!err&&data.insertId){
            res.json('ok');
        }else{
            res.json({code:4,message:err.message});
        }
    })

})
/*server.post('/update_cate1',(req,res)=>{
    console.log(req.body)
    let {id,name,desc}=req.body;
    let sql = 'update cate set `name`="'+name.value+'",`desc`="'+desc.value+'" where `id` ='+id.value;
    con.query(sql,(err,data)=>{
        if(!err){
            res.json('ok');
        }else{
            res.json(err.message);
        }
    })
})*/

server.get('/update_goods',(req,res)=>{
    let {title,value,id} = req.query;
    let sql = 'update goods set `'+title+'` = "'+value+'" where `id` = '+parseInt(id)+'';
    con.query(sql,(err,data)=>{
        if(!err){
            res.json('ok');
        }else{
            res.json(err.message);
        }
    })
})
server.post('/delete_cate',(req,res)=>{
    const {cid}= req.body;
    const sql = 'delete from cate where id = ?';
    con.query(sql,[cid],(err,data)=>{
        if(!err&&data.affectedRows){
            res.json('ok')
        }else{
            res.json({code:4,message:'删除错误'})
        }
    })
})
server.post('/delete_goods',(req,res)=>{
    const {cid}= req.body;
    const sql = 'delete from goods where id = ?';
    con.query(sql,[cid],(err,data)=>{
        if(!err&&data.affectedRows){
            res.json('ok')
        }else{
            res.json({code:4,message:'删除错误'})
        }
    })
})
server.post('/update_cate',(req,res)=>{
    const {cid,name,key}= req.body;
    const sql = 'update abd set '+key+' = ? where cid = ?';
    con.query(sql,[name,cid],(err,data)=>{
        if(!err&&data.affectedRows){
            res.json('ok')
        }else{
            res.json({code:4,message:'修改错误',err:err.message})
        }
    })
})
server.post('/update_store',(req,res)=>{
    const {id,name,key}= req.body;
    const sql = 'update store set '+key+' = ? where id = ?';
    con.query(sql,[name,id],(err,data)=>{
        if(!err&&data.affectedRows){
            res.json('ok')
        }else{
            res.json({code:4,message:'修改错误',err:err.message})
        }
    })
})
server.post('/update_goods',(req,res)=>{
    const {cid,name,key}= req.body;
    const sql = 'update abc set '+key+' = ? where cid = ?';
    con.query(sql,[name,cid],(err,data)=>{
        if(!err&&data.affectedRows){
            res.json('ok')
        }else{
            res.json({code:4,message:'修改错误',err:err.message})
        }
    })
});

//店铺图片
const upload = multer({dest:os.tmpdir()});
server.post('/file',upload.single('pic'),(req,res)=>{
        req.session.store_file = req.file;
        res.end('ok')
    })

server.get('/delete_goods',(req,res)=>{
    let {id}=req.query;
    let sql = 'delete from goods where id = ?';
    con.query(sql,[id],(err,data)=>{
        if(!err&&data.affectedRows){
            res.json('ok');
        }else{
            res.json(err.message);
        }
    })

})
server.post('/delete_store',(req,res)=>{
    let {id}=req.body;
    let sql = 'delete from store where id = ?';
    con.query(sql,[id],(err,data)=>{
        if(!err&&data.affectedRows){
            res.json('ok');
        }else{
            res.json(err.message);
        }
    })

})
server.get('/home',(req,res)=>{
    res.sendFile(path.resolve('./home.html'));
});
//获取商家是否登录
server.get('/get_auth',(req,res)=>{
    res.json(Boolean(req.session.uid));
});
server.post('/upload_goods', upload.single('file'), (req,res)=>{
        req.session.goods_file = req.file;
        res.end('ok')})
//更新商品图片
server.post('/update_pic', upload.single('abc'), (req,res)=>{
        let file = req.file;
        const o = file.path;
        const name = file.filename + path.extname(file.originalname);
        const d = path.resolve('./public/upload/'+name);
        var readeStream = fs.createReadStream(o);
        var writeStream = fs.createWriteStream(d);
        readeStream.pipe(writeStream);
        readeStream.on('end',function(){
            fs.unlinkSync(o)
        })
        const pic = '/upload/'+name;
        const {id} = req.body;
        const sql = 'update goods set pic = ? where id = ?';
        con.query(sql,[pic,id],(err,data)=>{
            if(!err&&data.affectedRows){
                res.end(name);
            }
        })
    })

server.post('/update_shoppic', upload.single('shop'), (req,res)=>{
        let file = req.file;
        const o = file.path;
        const name = file.filename + path.extname(file.originalname);
        const d = path.resolve('./public/upload/'+name);
        var readeStream = fs.createReadStream(o);
        var writeStream = fs.createWriteStream(d);
        readeStream.pipe(writeStream);
        readeStream.on('end',function(){
            fs.unlinkSync(o)
        })
        const pic = '/upload/'+name;
        const {id} = req.body;
        const sql = 'update store set pic = ? where id = ?';
        con.query(sql,[pic,id],(err,data)=>{
            if(!err&&data.affectedRows){
                res.end(name);
            }
        })
    }
)
//////////////////////////////////////顾客
//获取推荐商店
server.get('/api/get_store',(req,res)=>{
    const sql = 'select * from store limit 10';
    con.query(sql,(err,data)=>{
        if(data.length){
            res.json(data);
        }
    })
})
//获取商店信息
server.get('/api/get_store_by_id',(req,res)=>{
    const id = req.query.id;
    const sql = 'select * from store where id = ?';
    con.query(sql,[id],(err,data)=>{
        if(!err&&data){
            res.json(data)
        }
    })
})
//获取商店中的商品
server.get('/api/get_goods_by_sid',(req,res)=>{
    const sid = req.query.sid;
    const sql = 'select * from abc where sid = ?';
    con.query(sql,[sid],(err,data)=>{
        if(!err&&data){
            res.json(data)
        }
    })
})
//
server.get('/api/get_cates_by_sid',(req,res)=>{
    const store_id = req.query.sid;
    const sql = 'select * from cate where store_id = ?';
    con.query(sql,[store_id],(err,data)=>{
        if(!err&&data){
            res.json(data)
        }
    })
})
//验证顾客是否登录
server.get('/api/get_user_auth',(req,res)=>{
    if(req.session.custom_id){
        res.json(true);
    }else{
        res.json(false);
    }
})
//顾客的登录注册
server.post('/api/user_login',(req,res)=>{
    const {phone,code} = req.body;
    if(code !== '8888'){
        res.json('error');
        return;
    }
    const sql1 = 'select * from custom where phone = ?';
    con.query(sql1,[phone],(err,data)=>{
        if(!err&&data.length){
            req.session.custom_id = data[0].id;
            res.json('ok');
        }else{
            const sql2 = 'insert into custom (phone) values (?)';
            con.query(sql2,[phone],(err,data)=>{
                if(!err&&data.insertId){
                    req.session.custom_id = data.insertId;
                    res.json('ok')
                }
            })
        }
    })
})
//获取顾客的所有地址
server.get('/api/get_user_address',(req,res)=>{
    const cid = req.session.custom_id;
    const sql = 'select * from custom_address where uid = ?'
    con.query(sql,[cid],(err,result)=>{
        if(!err){
            res.json(result);

        }
    })
})
//添加地址
server.post('/api/add_user_address',(req,res)=>{
    const uid = req.session.custom_id;
    const {name,address,gender,phone} = req.body;
    const sql = 'insert into custom_address (uid,name,address,gender,phone) values (?,?,?,?,?)';
    con.query(sql,[uid,name,address,gender,phone],(err,data)=>{
        if(!err&&data.insertId){
            res.json('ok');
        }else{
            res.json(err.message)
        }
    })
})
//设置默认地址
server.get('/api/set_default_address',(req,res)=>{
    const uid = req.session.custom_id;
    const sql1 = 'update custom_address set is_default = 0 where uid = ?';
    con.query(sql1,[uid],(error,result)=>{
        if(!error) {
            const sql = 'update custom_address set is_default = 1 where id = ?';
            con.query(sql, [req.query.id], (err, r) => {
                if (!err) {
                    res.json('ok')
                }else{
                    console.log('错误第二层')
                }
            })
        }else{
            console.log('错误第一层')
        }
    })

})
//获取默认地址
server.get('/api/get_user_default_address',(req,res)=>{
    const uid = req.session.custom_id;
    const sql = 'select * from custom_address where uid = ? and is_default = 1';
    con.query(sql,[uid],(err,r)=>{
        res.json(r);
    })
})
//添加订单
server.post('/api/add_order',(req,res)=>{
    const {address_id,uid,goods_list,sid} = req.body;
    const custom_id = req.session.custom_id;
    const sql = 'insert into `order` (custom_id,uid,sid,goods_list,address_id) values (?,?,?,?,?)';
    con.query(sql,[custom_id,uid,sid,goods_list,address_id],(err,data)=>{
        if(!err&&data.insertId){
            res.json({message:'ok',oid:data.insertId})
        }else{
            console.log(err.message)
        }
    })
})
//获得订单信息
server.get('/api/get_custom_order',(req,res)=>{
    const custom_id = req.session.custom_id;
    const sql = 'select * from `order` where custom_id = ? order by id desc';
    con.query(sql,[custom_id],(err,r)=>{
        if(!err){
            res.json(r);
        }
    })
})
//通过订单id获取订单信息
server.get('/api/get_order_by_id',(req,res)=>{
    const custom_id = req.session.custom_id;
    const {id} = req.query;
    const sql = 'select * from `order` where custom_id = ? and id = ?';
    con.query(sql,[custom_id,id],(err,r)=>{
        if(!err){
            res.json(r);
        }
    })
})
//通过顾客id获取信息
server.get('/api/get_custom_account',(req,res)=>{
    const custom_id = req.session.custom_id;
    if(custom_id){
        const sql = 'select * from custom where id =?';
        con.query(sql,[custom_id],(err,r)=>{
            if(!err){
                r[0].phone=r[0].phone.substr(0,3)+"****"+r[0].phone.substr(7);
                r[0].pass=Boolean(r[0].pass);
                res.json(r);

            }
        })
    }
})
//通过顾客id退出登录
server.get('/api/custom_logout',(req,res)=>{
    req.session.custom_id=null;
    if(!req.session.custom_id){
        res.json('ok');
    }
})
//顾客设置用户名
server.get('/api/set_custom_username',(req,res)=>{
    const username = req.query.username;
    const id = req.session.custom_id;
    const sql = 'update custom set username = ? where id = ?';
    con.query(sql,[username,id],(err,r)=>{
        if(!err&&r.affectedRows){
            res.json('ok');
        }
    })
})
//获取订单对应的地址等信息
server.get('/api/get_address_info_by_id',(req,res)=>{
    const address_id = req.query.address_id;
    const id = req.session.custom_id;
    const sql = 'select * from custom_address where id = ? and uid = ?';
    con.query(sql,[address_id,id],(err,r)=>{
        if(!err){
            res.json(r);
        }else{
            res.json(err.message);
        }
    })
})
server.use('/yecaishui/*', function(req, res) {
    var url = 'http://47.96.239.36' + req.originalUrl;
    req.pipe(request(url)).pipe(res);
});
server.get('/account/*',(req,res)=>{
    res.sendFile(path.resolve('./public/account/index.html'));
})
server.get('/admin/*',(req,res)=>{
    res.sendFile(path.resolve('./public/admin/index.html'));
})
server.get('/*',(req,res)=>{
    res.sendFile(path.resolve('./public/index/index.html'));
})
server.listen(8080);
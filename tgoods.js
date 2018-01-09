const path = require('path');
const fs = require('fs');
const express = require('express');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const bodyParser = require('body-parser');
const multer = require('multer');

const server = express();
const con = require('./mysql.js');

// 1. 澶勭悊 .js .css 鍥剧墖绛夐潤鎬佽祫婧愮殑
server.use(express.static('./public'));
// 2. 澶勭悊session鐨�  瀹㈡埛绔瓨鍌ㄦ爣绀� 鏁版嵁鍦ㄦ湇鍔″櫒鍐呭瓨涓�
server.use(session({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: true,
}));
// 3. 澶勭悊cookie鐨�
server.use(cookieParser());

// 4. 鏀堕泦post璇锋眰涓殑鏁版嵁鐨� content-type
// bodyParser
// x-www-urlencoded   榛樿琛ㄥ崟
// application/json   fetch
server.use(bodyParser.urlencoded({extended: false}));
server.use(bodyParser.json());

////////////////////////////////////////////////////////
// url浠ｈ〃涓€涓祫婧�
// 1. /      index.html              璧勬簮 椤甸潰 (鐢ㄦ埛閿叆url鏁插洖杞�)
// 2. /users '[{id:1,name:'a'},...]' api鎺ュ彛 application interface
// 3. /index.js                      闈欐€佽祫婧�

server.get('/login_check', (req, res)=> {
    let {username, password} = req.query;
    con.query('select * from user where name = ?', [username], (err, data)=> {
        if (!data.length) {
            res.json('鐢ㄦ埛鍚嶆垨瀵嗙爜涓嶆纭�')
        } else {
            if (data[0].password === password) {
                req.session.username = username;
                req.session.uid = data[0].id;
                res.json('ok');
            } else {
                res.json('鐢ㄦ埛鍚嶆垨瀵嗙爜涓嶆纭�')
            }
        }
    });
});

server.get('/get_user', (req, res)=> {
    if (req.session.username) {
        res.json(req.session.username);
    } else {
        res.json({code: 4});
    }
});

server.post('/register', (req, res)=> {
    let {name, password} = req.body;
    let sql = 'insert into user (name,password) values (?,?)';
    con.query(sql, [name, password], (err, data)=> {
        if (!err && data.insertId) {
            req.session.username = name;
            req.session.uid = data.insertId;
            res.json('ok');
        }
    });
});

server.post('/add_store', (req, res)=> {
    let {name, desc} = req.body;
    let {file} = req.session;
    let o = file.path;
    let n = file.filename + path.extname(file.originalname);
    let d = path.resolve(
        './public/upload/' + n
    );
    fs.renameSync(o, d);
    const pic = '/upload/' + n;
    let sql = 'insert into store (name,pic,`desc`,uid) values (?,?,?,?)';
    con.query(sql, [name, pic, desc, req.session.uid], (err, data)=> {
        if (!err && data.insertId) {
            req.session.store_id = data.insertId;
            res.json('ok');
        }
    })
});

server.post('/password_update', (req, res)=> {
    let {password} = req.body;
    const sql = 'update user set password = ? where id = ?';
    con.query(sql, [password, req.session.uid], (err, data)=> {
        if (!err && data.affectedRows == 1) {
            res.json('ok');
        }
    })
});

server.get('/get_shops', (req, res)=> {
    const sql = 'select * from store where uid = ?';
    con.query(sql, [req.session.uid], (err, data)=> {
        console.log(req.session.uid);
        console.log(data);
        if (!err && data.length) {
            res.json(data);
        }
    })
});

server.get('/get_cates', (req, res)=> {
    const uid = req.session.uid;
    const sql = 'select * from abd where uid = ?';
    con.query(sql, [uid], (err, data)=> {
        if (!err && data.length) {
            res.json(data);
        } else {
            res.json({code: 4, message: '閿欒'})
        }
    })
});

server.get('/get_goods', (req, res)=> {
    const sql = 'select * from abc where uid = ?';
    con.query(sql, [req.session.uid], (err, data)=> {
        res.json(data);
    })
});

server.post('/add_cate', (req, res)=> {
    const {name} = req.body;
    const s = 'select * from store where uid = ?';
    con.query(s, [req.session.uid], (err, data)=> {
        if (data.length) {
            const sid = data[0].id;
            const sql = 'insert into cate (store_id,name) values (?,?)';
            con.query(sql, [sid, name], (err, data)=> {
                if (!err && data.insertId) {
                    res.json('ok')
                }
            })
        } else {
            res.json({code: 4, message: '鍏堝幓鍒涘缓搴楅摵'});
        }
    });
});

server.post('/add_goods', (req, res)=> {
    const {cid, name} = req.body;
    const {goods_file} = req.session;
    const fileName = goods_file.filename + path.extname(goods_file.originalname);
    const o = goods_file.path;
    const d = path.resolve('./public/upload/' + fileName);
    fs.renameSync(o, d);
    const pic = '/upload/' + fileName;
    const sql = 'insert into goods (cate_id,name,pic) values (?,?,?)';
    con.query(sql, [cid, name, pic], (err, result)=> {
        if (!err && result.insertId) {
            res.json('ok')
        }
    });
});

server.get('/get_auth', (req, res)=> {
    res.json(Boolean(req.session.uid));
});

server.post('/delete_cate', (req, res)=> {
    const {cid} = req.body;
    const sql = 'delete from cate where id = ?';
    con.query(sql, [cid], (err, data)=> {
        if (!err && data.affectedRows) {
            res.json('ok')
        } else {
            console.log(err.message);
        }
    })
});

server.post('/update_cate', (req, res)=> {
    let {cid, name} = req.body;
    const sql = 'update cate set name = ? where id = ?';
    con.query(sql, [name, cid], (err, data)=> {
        if (!err && data.affectedRows) {
            res.json('ok')
        } else {
            console.log(err.message);
        }
    })
});

const os = require('os');
const upload = multer({dest: os.tmpdir()});
server.post('/file',
    upload.single('pic'),
    (req, res)=> {
        req.session.file = req.file;
        res.end('ok');
    }
);

server.post('/upload_goods',
    upload.single('file'),
    (req, res)=> {
        req.session.goods_file = req.file;
        res.end('ok');
    }
);
server.post('/update_pic',
    upload.single('abc'),
    (req, res)=> {
        let file = req.file;
        const o = file.path;
        const name = file.filename + path.extname(file.originalname);
        const d = path.resolve('./public/upload/'+name);
        fs.renameSync(o,d);
        const pic = '/upload/'+name;
        const id = req.body.id;
        const sql = 'update goods set pic = ? where id = ?';
        con.query(sql,[pic,id],(err,data)=>{
            if(!err&&data.affectedRows){
                res.json(name);
            }
        })
    }
);

server.listen(8080);
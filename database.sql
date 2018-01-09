CREATE TABLE user(
id INT(12) PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(255),
password VARCHAR(255)
)DEFAULT CHARSET=utf8;
INSERT INTO user (name,password)
VALUES
('a','b');
CREATE TABLE store(
id INT(12) PRIMARY KEY AUTO_INCREMENT,
uid INT(12),
name VARCHAR(255),
pic VARCHAR(255),
`desc` VARCHAR(255)
)DEFAULT CHARSET=utf8;
INSERT INTO user (name,password)
VALUES
('a','b');

CREATE TABLE cate(
id INT(12) PRIMARY KEY AUTO_INCREMENT,
store_id INT(12),-- 谁的分类 --
name VARCHAR(255),
)DEFAULT CHARSET=utf8;

CREATE TABLE goods(
id INT(12) PRIMARY KEY AUTO_INCREMENT,
store_id INT(12),
name VARCHAR(255),
pic VARCHAR(255),
price FLOAT(255)
)DEFAULT CHARSET=utf8;

DROP VIEW IF EXISTS abc;
CREATE VIEW abc AS
  SELECT g.id as gid , g.name AS gname,g.pic,g.price,g.desc,
         c.id AS cid , c.name AS cname,c.desc as cdesc,
         s.id AS sid , s.name as sname,
         u.id as uid , u.name as uname
  FROM goods AS g,cate AS c,store AS s,`user` AS u
  WHERE
    g.cate_id = c.id
  AND
    c.store_id = s.id
  AND
    s.uid=u.id


DROP VIEW IF EXISTS abd;
CREATE VIEW abd AS
  SELECT
    c.id as cid,c.name as cname,c.desc as cdesc,
    s.id as sid,s.name as sname,
    u.id as uid,u.name as uname
  FROM cate as c ,store as s ,user as u
  WHERE
    c.store_id = s.id
    AND
    s.uid = u.id

1.后台页面访问权限
2.退出的功能
3.个人信息的修改
4.修改密码的优化
5.添加店铺上传图片
6.店铺信息的修改
7.添加分类
8.分类删除更新
9.添加商品
10.商品删除更新

DROP TABLE IF EXISTS TABLE
CREATE TABLE custom(
  id INT(12) PRIMARY KEY AUTO_INCREMENT,
  phone VARCHAR(255) UNIQUE,
  pass VARCHAR(255)
)DEFAULT CHARSET=utf8;

CREATE TABLE custom_address(
  id INT(12) PRIMARY KEY AUTO_INCREMENT,
  uid INT(12),
  phone VARCHAR(255) UNIQUE,
  address VARCHAR(255),
  gender VARCHAR(255),
  name VARCHAR(255)
)DEFAULT CHARSET=utf8;

DROP TABLE IF EXISTS `order`
CREATE TABLE `order`(
  id INT(12) PRIMARY KEY AUTO_INCREMENT,
  uid INT(12),
  custom_id INT(12),
  address_id INT(12),
  sid INT(12),
  goods_list VARCHAR(255),
  state INT(12) DEFAULT 0
)DEFAULT CHARSET=utf8;
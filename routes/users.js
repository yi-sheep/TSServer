var express = require('express');
var router = express.Router();
const formidable = require('formidable'); // 解析post上传的文件
const { error } = require('console');
const Path = require('path');
const config = require('../config/index.json');
const fs = require('fs');
const { LOADIPHLPAPI } = require('dns');
const db = require('../module');


/**
 * 修改用户基础信息
 */
router.post('/users/updateInfo', (req, res) => {
  // 获取到数据表模块
  let db = res.locals.db;
  let account = res.locals.payload.account; // 获取到从token中解析出来的账号
  let form = new formidable.IncomingForm(); // 开启一个表单域
  form.uploadDir = config.portraitPath; // 设置上传的文件保存位置
  form.keepExtensions = true; // 保存原本的扩展名
  form.parse(req, async (err, fields, files) => { // 读取表单中的内容
    if (err) {
      res.json({ result: false, error: err }).end();
    } else {
      // 获取到客户端上传的数据
      let { sex, age, contact } = { ...fields };
      let portrait = files.portrait;
      // 异常捕获
      try {
        // 找到要修改信息的用户
        let user = await db.User.findOne({
          where: {
            account
          }
        });
        if (user) {
          let user2 = await user.getUserInformation(); // 获取到这个用户在基础信息里的关联数据
          // 修改基础信息
          user2.age = age;
          user2.sex = sex;
          user2.contact = contact;
          // 判断是不是图片
          if (portrait.path.endsWith('jpg') || portrait.path.endsWith('png')) {
            let extname = Path.extname(portrait.path); // 获取上传文件的扩展名
            let path = Path.join(config.portraitPath, `${account}${extname}`); // 拼凑新的路径改名
            fs.renameSync(portrait.path, path); // 更路径和名称
            let url = Path.join(config.server.host, config.portraitUri, `${account}${extname}`); // 拼凑图片资源位置
            user2.portrait = url; // 修改资源位置
          } else {
            fs.unlinkSync(portrait.path); // 不是图片就删除文件
          }
          let userinfo = user2.save(); // 将修改后的基础信息保存
          res.json({ result: true, content: userinfo }).end(); // 发送成功信息
        } else {
          res.json({ result: false, error: '您的账户已不存在' }).end();
        }
      } catch (error) {
        fs.unlinkSync(portrait.path); // 出现错误就删除上传的图片
        res.json({ result: false, error: error.toString() }).end(); // 发送失败信息
      }
    }
  });
});
/**
 * 关注
 */
router.post('/users/follow', async (req, res) => {
  // 获取到客户端上传的数据
  let { touserid } = req.body;
  // 获取到数据表模块
  let db = res.locals.db;
  let account = res.locals.payload.account;

  // 异常捕获
  try {
    // 获取到关注用户的对象
    let user = await db.User.findOne({
      where: {
        account
      }
    });
    // 判断用户是否存在
    if (user) {
      let isExist = false;
      let user2 = await user.getUserRelationship(); // 获取到关注用户的关系对象
      // 获取到被关注人的对象
      let touser = await db.User.findOne({
        where: {
          account: touserid
        }
      });
      // 判断用户是否存在
      if (touser) {
        let touser2 = await touser.getUserRelationship(); // 获取到被关注用户的关系对象
        let thisfollowuser = user2.follow.users; // 获取到关注前的具体用户
        if (thisfollowuser.length > 0) {
          thisfollowuser.forEach(e => {
            if (e.userid == touserid) {
              isExist = true;
            }
          });
        } else {
          let thisfollownumber = ++user2.follow.number; // 将关注前的个数数据加一
          thisfollowuser.push({ userid: touserid }); // 添加一个用户
          user2.follow = { number: thisfollownumber, users: thisfollowuser }; // 修改数据
        }
        if (!isExist) {
          let thisfollownumber = ++user2.follow.number; // 将关注前的个数数据加一
          thisfollowuser.push({ userid: touserid }); // 添加一个用户
          user2.follow = { number: thisfollownumber, users: thisfollowuser }; // 修改数据
        }
        // 添加粉丝
        isExist = false;
        let tofansuser = touser2.fans.users; // 获取到被关注前的具体用户
        if (tofansuser.length > 0) {
          tofansuser.forEach(e => {
            if (e.userid == account) {
              isExist = true;
            }
          });
        } else {
          let tofansnumber = ++touser2.fans.number; // 被关注前的个数数据加一
          tofansuser.push({ userid: account });
          touser2.fans = { number: tofansnumber, users: tofansuser }; // 修改数据
        }
        if (!isExist) {
          let tofansnumber = ++touser2.fans.number; // 被关注前的个数数据加一
          tofansuser.push({ userid: account });
          touser2.fans = { number: tofansnumber, users: tofansuser }; // 修改数据
        }

        await user2.save(); // 保存修改的数据
        await touser2.save(); // 保存修改的数据
        res.json({ result: true, content: '关注成功' }).end(); // 成功
      } else {
        res.json({ result: false, error: '您要关注的用户不存在' }).end();
      }
    } else {
      res.json({ result: false, error: '您的账户已不存在' }).end();
    }
  } catch (error) {
    res.json({ result: false, error: `${error}` }).end(); // 发送失败信息
  }
});
/**
 * 取消关注
 */
router.post('/users/cancelfollow', async (req, res) => {
  // 获取到客户端上传的数据
  let { touserid } = { ...req.body };
  // 获取到数据表模块
  let db = res.locals.db;
  let account = res.locals.payload.account;

  // 异常捕获
  try {
    // 获取到取消关注用户的对象
    let user = await db.User.findOne({
      where: {
        account
      }
    });
    // 判断用户是否存在
    if (user) {
      let user2 = await user.getUserRelationship(); // 获取到取消关注用户的关系对象
      // 获取到被取消关注人的对象
      let touser = await db.User.findOne({
        where: {
          account: touserid
        }
      });
      // 判断用户是否存在
      if (touser) {
        let touser2 = await touser.getUserRelationship(); // 获取到被取消关注用户的关系对象
        let thisfollowusers = user2.follow.users;
        if (thisfollowusers.length > 0) {
          thisfollowusers.forEach(e => {
            if (e.userid == touserid) {
              let thisfollownumber = --user2.follow.number; // 将关注前的个数数据加一
              let thisfollowuser = user2.follow.users.filter(e => { // 遍历关注用户列表
                return e.userid != touserid; // 过滤掉要被取消关注的用户
              });
              user2.follow = { number: thisfollownumber, users: thisfollowuser }; // 修改数据
            }
          });
        }
        let tofansusers = touser2.fans.users;
        if (tofansusers.length > 0) {
          tofansusers.forEach(e => {
            if (e.userid == account) {
              let tofansnumber = --touser2.fans.number; // 被关注前的个数数据加一
              let tofansuser = touser2.fans.users.filter(e => { // 遍历粉丝用户列表
                return e.userid != account; // 过滤掉被取消关注的用户
              });
              touser2.fans = { number: tofansnumber, users: tofansuser }; // 修改数据
            }
          });
        }
        user2.save(); // 保存修改的数据
        touser2.save(); // 保存修改的数据
        res.json({ result: true, content: '取消关注成功' }).end();
      } else {
        res.json({ result: true, error: '您想要取消关注的对象已不存在' }).end();
      }
    } else {
      res.json({ result: false, error: '您的账号已不存在' }).end();
    }
  } catch (error) {
    res.json({ result: false, error: `${error}` }).end(); // 发送失败信息
  }
});

/**
 * 修改密码
 */
router.post('/users/password', async (req, res) => {
  let db = res.locals.db;
  let { password, topassword } = { ...req.body };
  let account = res.locals.payload.account;
  try {
    let user = await db.User.findOne({
      where: {
        account
      }
    });
    if (user) {
      if (user.password == password) {
        user.password = topassword; // 修改密码
        user.save(); // 保存修改
        res.json({ result: true, content: '修改成功' }).end();
      } else {
        res.json({ result: false, error: '您的旧密码不正确' }).end();
      }

    } else {
      res.json({ result: false, error: '您的账户已不存在' }).end();
    }
  } catch (error) {
    res.json({ result: false, error: error.toString() }).end();
  }
});

/**
 * 忘记密码1请求验证
 */
router.post('/users/forgetpassword', async (req, res) => {
  let db = res.locals.db;
  let { account } = { ...req.body };
  try {
    let user = await db.User.findOne({
      where: {
        account
      }
    });
    if (user) {
      let images = await user.getImages();
      let thisimage = images[images.length - 1];
      console.log(thisimage.dataValues);

      res.json().end();
    } else {
      res.json({ result: false, error: '账号不存在' }).end();
    }
  } catch (error) {
    res.json({ result: false, error: error.toString() }).end();
  }
});

/**
 * 查询用户
 */
router.get('/user', async (req, res) => {
  let id = req.query.userid;
  let db = res.locals.db;
  let user = await db.User.findOne({
    where:{
      id
    }
  });
  if(user){
    let userInfo = await user.getUserInformation();
    
    res.json({result:true,content:userInfo}).end();
  }else{
    res.json({result:false,error:'用户不存在'}).end();
  }
});

router.get('/myRelationship',async (req,res)=>{
  let db = res.locals.db;
  let account = res.locals.payload.account;
  let user = await db.User.findOne({
    where:{
      account
    }
  });
  if(user){
    let userInfo = await user.getUserRelationship();
    res.json({result:true,content:userInfo}).end();
  }else{
    res.json({result:false,error:'用户不存在'}).end();
  }
});
router.get('/myInfo',async (req,res)=>{
  let db = res.locals.db;
  let account = res.locals.payload.account;
  let user = await db.User.findOne({
    where:{
      account
    }
  });
  if(user){
    let userInfo = await user.getUserInformation();
    res.json({result:true,content:userInfo}).end();
  }else{
    res.json({result:false,error:'用户不存在'}).end();
  }
});
module.exports = router;

var express = require('express'); // 导入express库
var router = express.Router(); // 创建路由对象
const db = require('../module/index');
const jwt = require('jwt-simple');

let routes = []; // 创建一个数组用于保存路由
let path = require('fs').readdirSync(__dirname) // 读取出当前文件所在的目录下的文件名
  // 过滤文件
  .filter(e => {
    return e.endsWith('.js') && e != 'index.js'; // 把js文件和非当前文件名过滤出来
  })
  .forEach(e => {
    let path = require('path').join(__dirname, e); // 拼接完整路径
    let model = require(path); // 导入路由模块
    routes.push(model); // 插入数组
  });
/**
 * 登录
 */
router.post('/login', async (req, res) => {
  // 获取账号密码
  let { account, password } = { ...req.body };
  try {
    // 查找这个用户
    let user = await db.User.findOne({
      where: {
        account
      }
    });
    // 判断用户是否存在
    if (user) {
      // 判断密码是不是正确
      if (user.password != password) {
        res.json({ result: false, content: '密码错误' }).end(); // 密码不正确
      } else {
        let payload = { account: user.account }; // 放入账号
        let token = jwt.encode(payload, require('../config/index.json').tokenkey); // 生成token
        res.json({ result: true, user:{account,password,token} }).end(); // 验证成功将token发送给客户端
      }
    } else {
      res.json({ result: false, content: '仔细检查账号和密码' }).end(); // 用户不存在
    }
  } catch (error) {
    res.json({ result: false, error: error.toString() }).end(); // 出现错误
  }
});
/**
 * 注册用户
 */
router.post('/addUser', async (req, res) => {
  let { account, password } = { ...req.body };
  // 异常捕获
  try {
    let user1 = await db.User.findOne({
      where: {
        account
      }
    });
    // 判断用户是否已存在
    if (user1) {
      res.json({ result: false, error: '用户已存在' }).end();
    } else {
      // 创建一条用户账户数据
      let user = await db.User.create({
        account,
        password
      });
      // 创建一条空的用户信息数据
      let userinfo = await db.UserInformation.create({});
      // 创建一条空的用户关系数据
      let userrelat = await db.UserRelationship.create({});
      userinfo.setUser(user); // 设置外键的值为账户数据的id
      userrelat.setUser(user); // 设置外键的值为账户数据的id
      res.json({ result: true, content: user }).end(); // 发送成功数据
    }
  } catch (error) {
    res.json({ result: false, error: error.toString() }).end(); // 发送失败数据
  }
});
/**
 * 查询推图
 */
router.get('/images', async (req, res) => {
  let { page = 0, count = 2 } = { ...req.query }
  let offset = page * count
  let images = await db.PushImages.findAll({
    // order: [['createdAt', 'desc']],
    limit: parseInt(count),
    offset
  });
  let image = await db.PushImages.findAll();
  res.json({ result: true, number: image.length, content: images }).end();
});

/**
 * token验证和数据库模块传递
 */
router.use((req, res, next) => {
  // token验证
  let token = req.header('Token'); // 从数据包的头部取出token
  try {
    let payload = jwt.decode(token, require('../config/index.json').tokenkey);
    res.locals.payload = payload; // 将payload保存到res中
    res.locals.db = db // 将数据库对象保存在res中方便后面的每一个路由都能使用
    next();
  } catch (error) {
    res.json({ result: false, error: '你的身份信息已过期,请重新登录!' }).end();
  }
});
router.use('/', routes); // 设置中间键，传入路由模块数组

module.exports = router;

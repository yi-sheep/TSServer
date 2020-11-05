const Sequelize = require('sequelize'); // 导入sequelize库
const config = require('../config/index.json').mysqlConfig; // 导入配置文件
// 创建数据库连接
const sequelize = new Sequelize({
    // 读取配置文件中的配置
    host: config.host,
    username: config.username,
    password: config.password,
    database: config.database,
    dialect: config.dialect
});
// 导入数据库
let db = {} // 创建一个对象保存导入的数据库模块
const fs = require('fs'); // 导入文件库
fs.readdirSync(__dirname) // 读取出当前文件所在的目录下的文件名
    // 过滤文件
    .filter(e => {
        return e.endsWith('js') && e != 'index.js' // 把js文件和非当前文件名过滤出来
    })
    .forEach(e => {
        let path = require('path').join(__dirname, e) // 使用path库的join函数拼接出数据库模块的完整路径
        let model = require(path)(sequelize);
        db[model.name] = model;
    });
// 遍历出db对象中的键
Object.keys(db).forEach(e => {
    // 判断模块是否有外键约束
    if (db[e].associate) {
        db[e].associate(db); // 有的话就存入db对象，方便设置外键
    }
});
sequelize.sync();
(async () => {
    await sequelize.sync({force:true}); // 同步数据库

    // 创建一条用户账户数据
    let user1 = await db.User.create({
        account: "123456",
        password: "123456"
    });
    // 创建一条空的用户信息数据
    let userinfo1 = await db.UserInformation.create({
        name:user1.account,
        portrait:`http://${config.server.host}/图廊/data/user/001.png`
    });
    // 创建一条空的用户关系数据
    let userrelat1 = await db.UserRelationship.create({});
    userinfo1.setUser(user1); // 设置外键的值为账户数据的id
    userrelat1.setUser(user1); // 设置外键的值为账户数据的id

    // 创建一条用户账户数据
    let user2 = await db.User.create({
        account: "654789",
        password: "123456"
    });
    // 创建一条空的用户信息数据
    let userinfo2 = await db.UserInformation.create({
        name:user2.account,
        portrait:`http://${config.server.host}/图廊/data/user/001.png`
    });
    // 创建一条空的用户关系数据
    let userrelat2 = await db.UserRelationship.create({});
    userinfo2.setUser(user2); // 设置外键的值为账户数据的id
    userrelat2.setUser(user2); // 设置外键的值为账户数据的id

    // 创建一条用户账户数据
    let user3 = await db.User.create({
        account: "789123",
        password: "123456"
    });
    // 创建一条空的用户信息数据
    let userinfo3 = await db.UserInformation.create({
        name:user3.account,
        portrait:`http://${config.server.host}/图廊/data/user/001.png`
    });
    // 创建一条空的用户关系数据
    let userrelat3 = await db.UserRelationship.create({});
    userinfo3.setUser(user3); // 设置外键的值为账户数据的id
    userrelat3.setUser(user3); // 设置外键的值为账户数据的id
})();
module.exports = db; // 导出所有的数据库模块
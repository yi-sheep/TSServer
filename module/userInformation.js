const {Model,DataTypes} = {...require('sequelize')}; // 导入sequelize库中的Model，DataTypes
const config = require('../config/index.json').server;
// 导出模块
module.exports = (sequelize)=>{ // 接收一个数据库对象参数
    class UserInformation extends Model{} // 创建数据库类
    UserInformation.init({ // 初始化类，定义字段属性
        name:{
            type:DataTypes.STRING,
            allowNull:false,
            comment:'名称'
        },
        age:{
            type:DataTypes.TINYINT, //  (0,255) 小整数值
            defaultValue:18,
            allowNull:false, // 不能为空
            comment:'年龄'
        },
        sex:{
            type:DataTypes.ENUM('男','女','保密'), // 只能是这个三种
            defaultValue:'保密',
            allowNull:false,
            comment:'性别'
        },
        portrait:{
            type:DataTypes.STRING,
            defaultValue:`http://${config.host}/图廊/data/user/001.png`,
            allowNull:false,
            comment:'头像'
        },
        contact:{
            type:DataTypes.STRING,
            defaultValue:'',
            comment:'联系方式'
        }
    },{sequelize});
    // 设置外键
    UserInformation.associate = function(db){
        db.User.hasOne(UserInformation);
        UserInformation.belongsTo(db.User);
    }
    return UserInformation; // 将数据库类返回导出
}
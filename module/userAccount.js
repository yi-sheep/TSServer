const {Model,DataTypes} = {...require('sequelize')}; // 导入sequelize库中的Model，DataTypes
// 导出模块
module.exports = (sequelize)=>{ // 接收一个数据库对象参数
    class User extends Model{} // 创建数据库类
    User.init({ // 初始化类，定义字段属性
        id:{
            type:DataTypes.INTEGER,
            primaryKey:true,
            autoIncrement:true,
            unique:true
        },
        account:{
            type:DataTypes.STRING, // 字符串类型
            allowNull:false, // 不能为空
            unique:true, // 唯一
            comment:'账号'
        },
        password:{
            type:DataTypes.STRING,
            allowNull:false,
            comment:'密码'
        }
    },{sequelize});
    return User; // 将数据库类返回导出
}
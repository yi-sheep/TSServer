const {Model,DataTypes} = {...require('sequelize')}; // 导入sequelize库中的Model，DataTypes
// 导出模块
module.exports = (sequelize)=>{ // 接收一个数据库对象参数
    class UserRelationship extends Model{} // 创建数据库类
    UserRelationship.init({ // 初始化类，定义字段属性
        follow:{
            type:DataTypes.JSON, //  JSON
            defaultValue:{number:0,users:[]},
            comment:'关注的用户'
        },
        fans:{
            type:DataTypes.JSON,
            defaultValue:{number:0,users:[]},
            comment:'粉丝'
        },
        likes_images:{
            type:DataTypes.JSON,
            defaultValue:{number:0,images:[]},
            comment:'喜欢的图片'
        },
        collections_images:{
            type:DataTypes.JSON,
            defaultValue:{number:0,images:[]},
            comment:'收藏的图片'
        }
    },{sequelize});
    // 设置外键
    UserRelationship.associate = function(db){
        db.User.hasOne(UserRelationship);
        UserRelationship.belongsTo(db.User);
    }
    return UserRelationship; // 将数据库类返回导出
}
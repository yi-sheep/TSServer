const {Model,DataTypes} = {...require('sequelize')}; // 导入sequelize库中的Model，DataTypes
// 导出模块
module.exports = (sequelize)=>{ // 接收一个数据库对象参数
    class Images extends Model{} // 创建数据库类
    Images.init({ // 初始化类，定义字段属性
        id:{
            type:DataTypes.STRING,
            primaryKey:true,
            allowNull:false,
            comment:'图片id'
        },
        url: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '地址'
        },
        thumbnailUrl:{
            type:DataTypes.STRING,
            allowNull:false,
            comment:'缩略图'
        },
        thumbnailHeight:{
            type:DataTypes.INTEGER,
            allowNull:false,
            comment:'缩略图高度'
        },
        thumbnailWidth:{
            type:DataTypes.INTEGER,
            allowNull:false,
            comment:'缩略图宽带'
        },
        category: {
            type: DataTypes.STRING,
            allowNull: false,
            comment: '分类'
        },
        supporting: {
            type: DataTypes.STRING,
            defaultValue:'作者像是忘了些什么',
            comment: '图片配文'
        },
        likes:{
            type:DataTypes.JSON,
            defaultValue:{number:0,users:[]},
            comment:'点赞的人'
        },
        collections:{
            type:DataTypes.JSON,
            defaultValue:{number:0,users:[]},
            comment:'收藏的人'
        }
    },{sequelize});
    Images.associate = function(db){
        Images.belongsTo(db.User);
        db.User.hasMany(Images);
    }
    return Images; // 将数据库类返回导出
}
const {Model,DataTypes} = {...require('sequelize')}; // 导入sequelize库中的Model，DataTypes
// 导出模块
module.exports = (sequelize)=>{ // 接收一个数据库对象参数
    class PushImages extends Model{} // 创建数据库类
    PushImages.init({ // 初始化类，定义字段属性
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
        likes:{
            type:DataTypes.JSON,
            defaultValue:{number:0,users:[]},
            comment:'点赞的人'
        }
    },{sequelize});
    return PushImages; // 将数据库类返回导出
}
var express = require('express');
var router = express.Router();
const formidable = require('formidable'); // 解析post上传的文件
const { type } = require('os');
const { LOADIPHLPAPI } = require('dns');
const config = require('../config/index.json');
const Path = require('path');
const fs = require('fs');
const e = require('express');
const { Sequelize } = require('sequelize');
/**
 * 添加作品
 */
router.post('/works/add', (req, res) => {
    let db = res.locals.db;
    let account = res.locals.payload.account;
    let form = new formidable.IncomingForm(); // 创建表单
    form.keepExtensions = true; // 扩展名不变
    form.uploadDir = config.imagesPath; // 上传地址
    form.parse(req, async (err, fields, files) => { // 解析表单
        if (err) {
            res.json({ result: false }).end(); // 出现错误
        } else {
            try {
                // 获取表单中的属性和文件
                let { category, supporting } = { ...fields }
                let file = files.image;
                // 判断文件是不是想要的图片类型
                if (file.path.endsWith('jpg') || file.path.endsWith('png')) {
                    let extname = Path.extname(file.path) // 获取文件扩展名
                    let filename = Date.now() // 定义文件名 时间戳
                    let path = Path.join(config.imagesPath, `${filename}${extname}`); // 定义文件新路径和名称
                    fs.renameSync(file.path, path); // 将文件重命名
                    let url = `http://${config.server.host}/${config.imagesUri}/${filename}${extname}`; // 定义图片的资源定位
                    let thumbnail = await require('../tools/thumbnail')(path); // 制作缩略图
                    let thumbnailUrl = `http://${config.server.host}/${config.thumbnailUri}/${Path.basename(thumbnail.Path)}`; // 缩略图的url
                    // 创建一个图片数据
                    let image = await db.Images.create({
                        id: filename,
                        category,
                        supporting,
                        url,
                        thumbnailUrl,
                        thumbnailWidth: thumbnail.Width,
                        thumbnailHeight: thumbnail.Height,
                    });
                    // 查询出作者
                    let user = await db.User.findOne({
                        where: {
                            account
                        }
                    });
                    image.setUser(user); // 将这个图片的外键(作者)设置为这个用户
                    res.json({ result: true, content: image }).end(); // 成功
                } else {
                    fs.unlinkSync(file.path); // 不是图片，删除
                    res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                }
            } catch (error) {
                // fs.unlinkSync(file.path);
                res.json({ result: false, error: error.toString() }).end(); // 出现错误
            }
        }
    });
});
/**
 * 搬砖图片
 */
router.post('/images/add', (req, res) => {
    let db = res.locals.db;
    let account = res.locals.payload.account;
    let form = new formidable.IncomingForm(); // 创建表单
    form.keepExtensions = true; // 扩展名不变
    form.uploadDir = config.imagesPath; // 上传地址
    form.parse(req, async (err, fields, files) => { // 解析表单
        if (err) {
            res.json({ result: false }).end(); // 出现错误
        } else {
            try {
                let images = [] // 保存上传成功的图片对象
                // 获取表单中的属性和文件
                let { number } = { ...fields }
                // 判断上传的图片个数
                if (number == 1) {
                    let file = files.image;
                    if (!updateImages(db, file, images)) {
                        fs.unlinkSync(file.path); // 不是图片，删除
                        res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                    }
                    res.json({ result: true, content: images }).end(); // 成功
                } else if (number == 2) {
                    let fileArr = [files.image1, files.image2]
                    for (let i = 0; i < number; i++) {
                        let file = fileArr[i];
                        if (!await updateImages(db, file, images)) {
                            fs.unlinkSync(file.path); // 不是图片，删除
                            res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                        }
                    }
                    res.json({ result: true, content: images }).end(); // 成功
                } else if (number == 3) {
                    let fileArr = [files.image1, files.image2, files.image3];
                    for (let i = 0; i < number; i++) {
                        let file = fileArr[i];
                        if (!await updateImages(db, file, images)) {
                            fs.unlinkSync(file.path); // 不是图片，删除
                            res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                        }
                    }
                    res.json({ result: true, content: images }).end(); // 成功
                } else if (number == 4) {
                    let fileArr = [files.image1, files.image2, files.image3, files.image4];
                    for (let i = 0; i < number; i++) {
                        let file = fileArr[i];
                        if (!await updateImages(db, file, images)) {
                            fs.unlinkSync(file.path); // 不是图片，删除
                            res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                        }
                    }
                    res.json({ result: true, content: images }).end(); // 成功
                } else if (number == 5) {
                    let fileArr = [files.image1, files.image2, files.image3, files.image4, files.image5];
                    for (let i = 0; i < number; i++) {
                        let file = fileArr[i];
                        if (!await updateImages(db, file, images)) {
                            fs.unlinkSync(file.path); // 不是图片，删除
                            res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                        }
                    }
                    res.json({ result: true, content: images }).end(); // 成功
                } else if (number == 6) {
                    let fileArr = [files.image1, files.image2, files.image3, files.image4, files.image5, files.image6];
                    for (let i = 0; i < number; i++) {
                        let file = fileArr[i];
                        if (!await updateImages(db, file, images)) {
                            fs.unlinkSync(file.path); // 不是图片，删除
                            res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                        }
                    }
                    res.json({ result: true, content: images }).end(); // 成功
                } else if (number == 9) {
                    let fileArr = [files.image1, files.image2, files.image3, files.image4, files.image5, files.image6, files.image7, files.image8, files.image9];
                    for (let i = 0; i < number; i++) {
                        let file = fileArr[i];
                        if (!await updateImages(db, file, images)) {
                            fs.unlinkSync(file.path); // 不是图片，删除
                            res.json({ result: false, error: '请上传jpg或者png格式的图片' }).end();
                        }
                    }
                    res.json({ result: true, content: images }).end(); // 成功
                }

            } catch (error) {
                console.log(error);
                res.json({ result: false, error: error.toString() }).end(); // 出现错误
            }
        }
    });
});
/**
 * 删除图片
 */
router.post('/images/delete', async (req, res) => {
    let db = res.locals.db;
    let id = req.body.id;
    let account = res.locals.payload.account;
    try {
        let user = await db.User.findOne({
            where: {
                account
            }
        });
        images = await user.getImages(); // 获取用户的所有作品
        let isExist = false;
        images.forEach(async image => {
            if (image.id == id) {
                isExist = true
                let extname = Path.extname(image.url); // 获取文件扩展名
                let path = Path.join(config.imagesPath, `${image.id}${extname}`); // 获取文件在服务器的地址
                fs.unlinkSync(path); // 删除服务器的文件
                await image.destroy(); // 删除图片数据
                res.json({ result: true, error: '删除成功' }).end();
            }
        });
        if (!isExist) {
            res.json({ result: false, error: '该图片不是您的作品或者已删除' }).end();
        } else {
            res.json({ result: true, error: '删除成功' }).end();
        }
    } catch (error) {
        res.json({ result: false, error: error.toString() }).end(); // 出现错误
    }
});
/**
 * 点赞图片
 */
router.post('/images/like', async (req, res) => {
    let db = res.locals.db;
    let { id } = { ...req.body };
    let account = res.locals.payload.account;
    console.log(account);
    try {
        // 找到这个图片
        let image = await db.PushImages.findOne({
            where: {
                id
            }
        });
        // 找到这个用户
        let user = await db.User.findOne({
            where: {
                account
            }
        });

        // 判断图片和用户是否存在
        if (image) {
            if (user) {
                let isExist = false;
                // 对图片数据操作
                let likes_users = image.likes.users; // 获取已有的点赞用户列表
                likes_users.forEach(e => {
                    // 判断图片点赞列表里有没有这个用户账号，如果没有就添加，如果有就啥也不做
                    if (e.userid == account) {
                        isExist = true;
                    }
                });

                if (!isExist) {
                    let likes_number = ++image.likes.number; // 对已有的点赞数加1
                    likes_users.push({ userid: account }); // 插入一个新的点赞用户
                    image.likes = { number: likes_number, users: likes_users }; // 修改现有的数据
                }
                isExist = false;
                // 对用户数据操作
                let userRelation = await user.getUserRelationship(); // 找到这个用户对应的关系数据
                let likes_images_images = userRelation.likes_images.images; // 获取到喜欢图片列表
                // 判断用户点赞列表是否为空
                likes_images_images.forEach(async e => {
                    // 判断用户点赞列表里有没有这个图片id，如果没有就添加，有就啥也不做
                    if (e.imageid == id) {
                        isExist = true;
                    }
                });
                if (!isExist) {
                    let likes_images_number = ++userRelation.likes_images.number; // 喜欢的图片数加一
                    likes_images_images.push({ imageid: id }); // 插入图片id
                    userRelation.likes_images = { number: likes_images_number, images: likes_images_images }; // 修改数据
                    await image.save(); // 保存修改
                    await userRelation.save(); // 保存修改
                    res.json({ result: true, content: '点赞成功' }).end(); // 点赞成功
                } else {
                    res.json({ result: false, error: '您已点赞' }).end(); // 点赞成功
                }
            } else {
                res.json({ result: false, error: '您的账户已不存在' }).end(); // 用户身份不正确
            }
        } else {
            res.json({ result: false, error: '图片已不存在' }).end(); // 图片不存在
        }
    } catch (error) {
        res.json({ result: false, error: error.toString() }).end(); // 出现错误
    }
});
/**
 * 取消点赞
 */
router.post('/images/cancellike', async (req, res) => {
    let db = res.locals.db;
    let { id } = { ...req.body };
    let account = res.locals.payload.account;
    try {
        // 找到这个图片
        let image = await db.PushImages.findOne({
            where: {
                id
            }
        });
        // 找到这个用户
        let user = await db.User.findOne({
            where: {
                account
            }
        });
        // 判断图片和用户是否存在
        if (image) {
            if (user) {
                let islike = false
                let likes_users = image.likes.users; // 获取到点赞用户列表
                // 判断这个图片有没有点赞的记录
                if (likes_users.length > 0) {
                    // 遍历点赞用户列表
                    likes_users.forEach(async e => {
                        // 判断用户列表里有没这个用户，也就是这个用户有没有点赞这个图片
                        if (e.userid == account) {
                            // 对图片数据操作
                            let likes_number = --image.likes.number; // 点赞数减一
                            // 将这个用户移除点赞用户列表
                            let users = likes_users.filter(e => {
                                return e.userid != account;
                            });
                            image.likes = { number: likes_number, users }; // 修改数据
                            islike = true
                        }
                    });
                }
                // 对用户数据操作
                let userRelation = await user.getUserRelationship(); // 获取到用户的关系数据
                let likes_images_images = userRelation.likes_images.images; // 获取到图片列表
                if (likes_images_images.length > 0) {
                    likes_images_images.forEach(e => {
                        if (e.imageid == id) {
                            let likes_images_number = --userRelation.likes_images.number; // 对喜欢数据减一
                            // 将图片移除列表
                            let images = likes_images_images.filter(e => {
                                return e.imageid != id;
                            });
                            userRelation.likes_images = { number: likes_images_number, images }; // 修改数据
                            islike = true
                        }
                    });
                }
                if (islike) {
                    await image.save(); // 保存数据
                    await userRelation.save(); // 保存数据
                    res.json({ result: true, content: '取消点赞成功' }).end(); // 成功
                } else {
                    res.json({ result: false, content: '这个作品还没有点赞' })
                }

            } else {
                res.json({ result: false, error: '您的账号已不存在' }).end(); // 身份过期
            }
        } else {
            res.json({ result: false, error: '图片已不存在' }).end(); // 图片不存在
        }
    } catch (error) {
        res.json({ result: false, error: error.toString() }).end(); // 出现错误
    }
});
/**
 * 收藏图片
 */
router.post('/images/collection', async (req, res) => {
    let db = res.locals.db;
    let { id } = { ...req.body };
    let account = res.locals.payload.account;
    try {
        // 找到这个图片
        let image = await db.Images.findOne({
            where: {
                id
            }
        });
        // 找到这个用户
        let user = await db.User.findOne({
            where: {
                account
            }
        });
        // 判断图片和用户是否存在
        if (image) {
            if (user) {
                let isExist = false;
                // 对图片数据操作
                let collection_users = image.collections.users; // 获取到收藏用户列表
                // 判断用户列表有无数据
                if (collection_users.length > 0) {
                    collection_users.forEach(e => {
                        if (e.userid == account) {
                            isExist = true;
                        }
                    });
                } else {
                    let collection_number = ++image.collections.number; // 对收藏数加一
                    collection_users.push({ userid: account }); // 插入一个收藏用户
                    image.collections = { number: collection_number, users: collection_users }; // 修改数据
                    isExist = true;
                }
                if (!isExist) {
                    let collection_number = ++image.collections.number; // 对收藏数加一
                    collection_users.push({ userid: account }); // 插入一个收藏用户
                    image.collections = { number: collection_number, users: collection_users }; // 修改数据
                }
                isExist = false;
                // 对用户数据操作
                let userRelation = await user.getUserRelationship(); // 查询到用户的关系数据
                let collections_images_images = userRelation.collections_images.images; // 获取到图片列表
                if (collections_images_images.length > 0) {
                    collections_images_images.forEach(e => {
                        if (e.imageid == id) {
                            isExist = true
                            res.json({ result: false, error: '您已收藏' }).end(); // 点赞成功
                        }
                    });
                } else {
                    let collections_images_number = ++userRelation.collections_images.number; // 对收藏数加一
                    collections_images_images.push({ imageid: id }); // 插入图片id
                    userRelation.collections_images = { number: collections_images_number, images: collections_images_images }; // 修改数据
                    isExist = true;
                }
                if (!isExist) {
                    let collections_images_number = ++userRelation.collections_images.number; // 对收藏数加一
                    collections_images_images.push({ imageid: id }); // 插入图片id
                    userRelation.collections_images = { number: collections_images_number, images: collections_images_images }; // 修改数据
                }
                await image.save(); // 保存数据
                await userRelation.save(); // 保存数据
                res.json({ result: true, content: '收藏成功' }).end(); // 成功
            } else {
                res.json({ result: false, error: '您的身份信息已过期' }).end();
            }
        } else {
            res.json({ result: false, error: '图片已不存在' }).end();
        }
    } catch (error) {
        res.json({ result: false, error: error.toString() }).end();
    }
});
/**
 * 取消收藏
 */
router.post('/images/cancelcollection', async (req, res) => {
    let db = res.locals.db;
    let { id } = { ...req.body };
    let account = res.locals.payload.account;
    try {
        let image = await db.Images.findOne({
            where: {
                id
            }
        });
        let user = await db.User.findOne({
            where: {
                account
            }
        });
        // 判断图片和用户是否存在
        if (image) {
            if (user) {
                let collection_users = image.collections.users; // 获取收藏用户列表
                // 判断收藏列表有没有数据
                if (collection_users.length > 0) {
                    collection_users.forEach(async e => {
                        if (e.userid == account) {
                            // 对图片数据操作
                            let collection_number = --image.collections.number; // 将收藏数减一
                            // 将这个用户移除列表
                            let users = collection_users.filter(e => {
                                return e.userid != account;
                            });
                            image.collections = { number: collection_number, users }; // 修改数据
                        }
                    });
                }
                // 对用户数据操作
                let userRelation = await user.getUserRelationship(); // 查询到用户的关系数据
                let collections_images_images = userRelation.collections_images.images; // 获取到图片列表
                if (collections_images_images.length > 0) {
                    let collections_images_number = --userRelation.collections_images.number; // 将收藏数减一
                    // 将图片id移除列表
                    let images = collections_images_images.filter(e => {
                        return e.imageid != id;
                    });
                    userRelation.collections_images = { number: collections_images_number, images } // 修改数据
                }
                await image.save(); // 保存数据
                await userRelation.save(); // 保存数据
                res.json({ result: true, content: '取消收藏成功' }).end(); // 成功
            } else {
                res.json({ result: false, error: '您的身份信息已过期' }).end(); // 身份过期
            }
        } else {
            res.json({ result: false, error: '图片已不存在' }).end(); // 没有图片
        }
    } catch (error) {
        res.json({ result: false, error: error.toString() }).end(); // 出现错误
    }
});
/**
 * 查询图片
 */
router.get('/images', async (req, res) => {
    let { id, category, account } = { ...req.query };
    let db = res.locals.db;
    let isAll = true;
    // 使用id查询，一张
    if (id) {
        // 查询图片
        let image = await db.Images.findOne({
            where: {
                id
            }
        });
        isAll = false; // 改变为不是查询全部
        // 返回查询的图片
        res.json({ result: true, content: image }).end();
    }
    // 使用分类查询，多张
    if (category) {
        // 查询图片
        let images = await db.Images.findAll({
            where: {
                category
            }
        });
        isAll = false; // 改变为不是查询全部
        // 返回查询的图片
        res.json({ result: true, number: images.length, content: images }).end();
    }
    // 使用用户id查询,多张
    if (account) {
        // 查询用户
        let user1 = await db.User.findOne({
            where: {
                account
            }
        });
        let images = await user1.getImages();
        isAll = false; // 改变为不是查询全部
        res.json({ result: true, number: images.length, content: images }).end();
    }
    if (isAll) {
        let Sequelize = require('sequelize')
        let images = await db.Images.findAll({
            order: [Sequelize.literal('RAND()'), ['createdAt', 'desc']],
            // Sequelize.literal('RAND()')
        })
        for (let i = 0; i < images.length; i++) {
            let image = images[i];
            let user = await images[i].getUser();
            image.dataValues["user"] = await user.getUserInformation();
        }
        res.json({ result: true, number: images.length, content: images }).end();
    }
});

/**
 * 查询最新图片
 */
router.get('/newImages', async (req, res) => {
    let db = res.locals.db;
    let images = await db.Images.findAll({
        order: [['createdAt', 'desc']],
    });
    for (let i = 0; i < images.length; i++) {
        let image = images[i];
        let user = await images[i].getUser();
        image.dataValues["user"] = await user.getUserInformation();
    }
    res.json({ result: true, number: images.length, content: images }).end();
});


/**
 * 查询用户收藏的图片
 */
router.get('/images/collection', async (req, res) => {
    let db = res.locals.db;
    let { account } = { ...req.query };
    // 找到用户
    let user = await db.User.findOne({
        where: {
            account
        }
    });
    // 判断用户是否存在
    if (user) {
        let userRelation = await user.getUserRelationship(); // 查询用户的关系数据
        let images = []; // 查询到的图片存储到这里
        let image_list = userRelation.collections_images.images; // 图片列表
        // 遍历图片列表
        for (let i = 0; i < image_list.length; i++) {
            // 找到对应的图片
            let image = await db.Images.findOne({
                where: {
                    id: image_list[i].imageid
                }
            });
            images.push(image); // 将图片插入数组
        }
        res.json({ result: true, number: images.length, content: images }).end(); // 查询完毕
    } else {
        res.json({ result: false, error: '您的身份信息已过期' }).end();
    }
});

let updateImages = async (db, file, images) => {
    // 判断文件是不是想要的图片类型
    if (file.path.endsWith('jpg') || file.path.endsWith('png')) {
        let imgPath = await require('../tools/rotateImg')(file.path)
        let filename = Path.basename(imgPath.Path)
        let url = `http://${config.server.host}${config.imagesUri}/${filename}`; // 定义图片的资源定位
        let thumbnail = await require('../tools/thumbnail')(imgPath.Path); // 制作缩略图
        let thumbnailUrl = `http://${config.server.host}${config.thumbnailUri}/${Path.basename(thumbnail.Path)}`; // 缩略图的url
        // 创建一个图片数据
        let image = await db.PushImages.create({
            url,
            thumbnailUrl,
            thumbnailWidth: thumbnail.Width,
            thumbnailHeight: thumbnail.Height,
        });
        images.push(image)
        return true
    } else {
        return false
    }
}

module.exports = router;
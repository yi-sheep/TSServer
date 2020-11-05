const sharp = require('sharp');
const size = require('image-size');
const path = require('path');
const fs = require('fs');
const config = require('../config/index.json');

module.exports = (imagePath) => {
    return new Promise((resolve, reject) => {
        let { height, width } = { ...size(imagePath) }
        let fileName = `${Date.now()}${path.extname(imagePath)}` // 定义文件名 时间戳 获取文件扩展名
        let Path = path.join(config.imagesPath, fileName);
        console.log(Path);
        if (height < width) {
            sharp(imagePath)
                .rotate(90)
                .toFile(Path, (err) => {
                    if (err) {
                        reject(err);
                    }
                    fs.unlinkSync(imagePath);
                    resolve({ Path });
                });
        }else{
            fs.renameSync(imagePath,Path)
            resolve({Path});
        }
    });
}
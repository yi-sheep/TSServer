const sharp = require('sharp');
const size = require('image-size');
const path = require('path');
const config = require('../config/index.json');

module.exports = (imagePath) => {
    return new Promise((resolve, reject) => {
        let {height,width} = {...size(imagePath)}
        let fileName = path.basename(imagePath);
        let Path = path.join(config.thumbnailPath, fileName);
        let Width = 600;
        let Height =Math.round(height * Width / width);
        sharp(imagePath)
            .resize(Width, Height)
            .toFile(Path, (err) => {
                if (err) {
                    reject(err);
                }
            });
        resolve({Path,Width,Height});
    });
}
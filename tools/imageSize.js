const Size = require('image-size');
module.exports = (path)=>{
    let { height, width } = { ...Size(path) }
    
    return {height,width};
}
const path = require('path');

module.exports = {
    //...
    devServer: {
        contentBase: path.join(__dirname, 'dist'),
        compress: true,
        port: 3000,
        host: '192.168.100.156'
    }
};
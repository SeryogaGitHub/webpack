/**
 * Application assets config (used in the App and Webpack builder)
 */
var glob = require("glob");


module.exports = {
    build_directory : "build",
    assets_map : {
        app: [
            './src/js/app/style-app.js',
            './src/js/app/indexPage.js',
        ],
        // media: [
        //     './src/js/media/style-app.js',
        //     './src/js/media/indexPage.js',
        // ],
        html: glob.sync("./src/*.html"),
        images: glob.sync("./src/img/*.*"),
    }
};

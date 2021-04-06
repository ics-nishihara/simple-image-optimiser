const fs = require("fs-extra");
const { exec } = require("child_process");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(exec);

// console.log(process.argv[2])

const imagesData = { jpg: [], png: [] };

const regex = new RegExp("([^s]+(\\.(jpe?g|png))$)", "i");
const imagePath = path.resolve(__dirname, "images");
const allDirents = fs.readdirSync(imagePath, { withFileTypes: true });
allDirents
  .filter((dirent) => dirent.isFile() && regex.test(dirent.name))
  .forEach((dirent) => {
    const ext = path.extname(dirent.name);
    if (ext.match(/.jpe?g/i)) {
      imagesData.jpg.push(`images/${dirent.name}`);
    }
    if (ext.match(/.png/i)) {
      imagesData.png.push(`images/${dirent.name}`);
    }
  });

const allFilePathList = [...imagesData.jpg,...imagesData.png].join(" ")
const jpgFilePathList = imagesData.jpg.join(" ")
const pngFilePathList = imagesData.png.join(" ")
console.log(pngFilePathList);
// console.log(`yarn run squoosh-cli --webp '{quality: 75}' ${filePathList} -d dist`)
execPromise(
  `yarn run squoosh-cli --webp '{quality: 75}' ${allFilePathList} -d dist`
);
process.exit();

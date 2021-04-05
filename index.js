const fs = require("fs-extra");
const { exec } = require("child_process");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(exec);

const regex = new RegExp(".+\.(jpe?g|png)","g")
const imagePath = path.resolve(__dirname, "images");
const allDirents = fs.readdirSync(imagePath, { withFileTypes: true });
const filePathList = allDirents
  .filter((dirent) => dirent.isFile())
  .filter(dirent=> regex.test(dirent.name))
  .map((dirent) => `images/${dirent.name}`).join(" ");
// console.log(filePathList);
console.log(`yarn run squoosh-cli --webp '{quality: 75}' ${filePathList} -d dist`)
execPromise(`yarn run squoosh-cli --webp '{quality: 75}' ${filePathList} -d dist`)
// exec("yarn run convert-jpg-to-webp");
process.exit();

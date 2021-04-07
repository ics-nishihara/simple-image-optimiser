const fs = require("fs-extra");
const { exec } = require("child_process");
const path = require("path");
const util = require("util");
const execPromise = util.promisify(exec);

// エラーフラグ
let isError = false;

// 画像データの格納
const imagesData = { jpg: [], png: [] };

// 対応拡張子を抽出する正規表現（jpgおよびpng）
const regex = new RegExp("([^s]+(\\.(jpe?g|png))$)", "i");

const imagePath = path.resolve(__dirname, "images");

// imagesフォルダ内のファイルを探索
const allDirents = fs.readdirSync(imagePath, { withFileTypes: true });

// imagesフォルダ内のファイルの中で対応拡張子のみ選別する
allDirents
  .filter((dirent) => dirent.isFile() && regex.test(dirent.name))
  .forEach((dirent) => {
    // 名前に半角スペースがあるとsquoosh処理できないので検査
    if (dirent.name.indexOf(" ") > 0) {
      console.warn(
        `ファイル名に空白が含まれています。空白がないようリネームしてください。=> ${dirent.name}`
      );
      isError = true;
    }
    const ext = path.extname(dirent.name);
    // 拡張子に応じて振り分け
    if (ext.match(/.jpe?g/i)) {
      imagesData.jpg.push(`images/${dirent.name}`);
    }
    if (ext.match(/.png/i)) {
      imagesData.png.push(`images/${dirent.name}`);
    }
  });

// 半角スペース文字などがあった場合にはエラーを投げる
if (isError) {
  throw Error;
}

// squoosh処理用に画像パスを加工
const allFilePathList = [...imagesData.jpg, ...imagesData.png].join(" ");
const jpgFilePathList = imagesData.jpg.join(" ");
const pngFilePathList = imagesData.png.join(" ");

// 変換モード
const mode = process.argv[2];

// クオリティ設定
const qualitySetting = process.argv[3];

const qualityOption = {
  quality: 75,
  level: 2,
};

// クオリティ設定の詳細な値
switch (qualitySetting) {
  case "high":
    qualityOption.quality = 90;
    qualityOption.level = 3;
    break;
  case "moderate":
    qualityOption.quality = 75;
    qualityOption.level = 2;
    break;
  case "low":
    qualityOption.quality = 50;
    qualityOption.level = 1;
    break;
  case "very-low":
    qualityOption.quality = 30;
    qualityOption.level = 1;
    break;
  default:
    qualityOption.quality = 75;
    qualityOption.level = 2;
}

/**
 * squoosh処理を実行します
 */
const start = async () => {
  switch (mode) {
    case "convert-all-to-webp":
      console.log("すべての画像をWebPに変換します");
      if (allFilePathList.length === 0) {
        console.warn("画像がないようです");
        process.exit();
      }
      await execPromise(
        `yarn run squoosh-cli --webp '{quality:${qualityOption.quality}}' ${allFilePathList} -d dist`
      );
      break;
    case "optimise-all":
      console.log("すべての画像を圧縮します");
      if (jpgFilePathList.length > 0 && pngFilePathList.length > 0) {
        await Promise.all([
          execPromise(
            `yarn run squoosh-cli --mozjpeg '{quality:${qualityOption.quality}}' ${jpgFilePathList} -d dist`
          ),
          execPromise(
            `yarn run squoosh-cli --oxipng '{level:${qualityOption.level}}' ${pngFilePathList} -d dist`
          ),
        ]);
      } else if (jpgFilePathList.length === 0 && pngFilePathList.length > 0) {
        await execPromise(
          `yarn run squoosh-cli --oxipng '{level:${qualityOption.level}}' ${pngFilePathList} -d dist`
        );
      } else if (jpgFilePathList.length > 0 && pngFilePathList.length === 0) {
        await execPromise(
          `yarn run squoosh-cli --mozjpeg '{quality:${qualityOption.quality}}' ${jpgFilePathList} -d dist`
        );
      } else {
        console.warn("画像がないようです");
        process.exit();
      }

      break;
    case "convert-jpg-to-webp":
      console.log("jpg画像をWebPに変換します");
      if (jpgFilePathList.length === 0) {
        console.warn("画像がないようです");
        process.exit();
      }
      await execPromise(
        `yarn run squoosh-cli --webp '{quality:${qualityOption.quality}}' ${jpgFilePathList} -d dist`
      );

      break;
    case "convert-png-to-webp":
      console.log("png画像をWebPに変換します");
      if (pngFilePathList.length === 0) {
        console.warn("画像がないようです");
        process.exit();
      }
      await execPromise(
        `yarn run squoosh-cli --webp '{quality:${qualityOption.quality}}' ${pngFilePathList} -d dist`
      );

      break;
    case "optimise-jpg":
      console.log("jpg画像を圧縮します");
      if (jpgFilePathList.length === 0) {
        console.warn("画像がないようです");
        process.exit();
      }
      await execPromise(
        `yarn run squoosh-cli --mozjpeg '{quality:${qualityOption.quality}}' ${jpgFilePathList} -d dist`
      );
      break;
    case "optimise-png":
      console.log("png画像を圧縮します");
      if (pngFilePathList.length === 0) {
        console.warn("画像がないようです");
        process.exit();
      }
      await execPromise(
        `yarn run squoosh-cli --oxipng '{level:${qualityOption.level}}' ${pngFilePathList} -d dist`
      );
      break;
    default:
      console.log(
        "適切なモードが設定されていないようです。もう一度コマンドを確かめてください。"
      );
      process.exit();
  }
  console.log("完了しました✨");
  process.exit();
};

start();

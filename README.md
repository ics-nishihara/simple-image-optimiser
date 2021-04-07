# simple-image-optimiser
簡易なSquooshを使った画像最適化ツールです。`images`フォルダに画像を格納し各種`npm scripts`を実行するとdistフォルダに最適化された画像が出力されます。

# scripts
- `convert-all`：jpg・pngをWebPに変換します。
- `optimise-all`：jpg・pngを最適化します。
- `convert-jpg-to-webp`：jpgをWebPに変換します。
- `convert-png-to-webp`：pngをWebPに変換します。
- `optimise-jpg`：jpgを最適化します。
- `optimise-png`：pngを最適化します。

# その他
jpg,WebPのクオリティ設定は`75`、pngは`level:2`に設定してあります。変更したい場合は`npm scripts`のコマンドの`node index.js convert-all-to-webp`の後ろに`high`,`moderate`,`low`,`very-low`のキーワードをつけてください。より細かい設定をしたい場合は…index.jsの64行目付近のクオリティ設定の値を編集してください。

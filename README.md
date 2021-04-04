# simple-image-optimiser
簡易なSquooshを使った画像最適化ツールです。`images`フォルダに画像を格納し各種`npm scripts`を実行するとdistフォルダに最適化された画像が出力されます。

# scripts
- `convert-all`：jpg・pngをwebpに変換します。
- `convert-jpg-to-webp`：jpgをwebpに変換します。
- `convert-png-to-webp`：pngをwebpに変換します。
- `optimise-jpg`：jpgを最適化します。
- `optimise-png`：pngを最適化します。

# その他
jpg,webpのクオリティ設定は`75`、pngは`level:2`に設定してあります。変更したい場合は`npm scripts`のコマンドの`{}`内の引数の値を変更してください。

`images`フォルダ内に当該拡張子のなくスクリプトを実行した場合はエラーが出ます。`convert-all`した場合、エラー自体は出ますが、処理自体は止まりません。
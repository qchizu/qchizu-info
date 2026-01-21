---
title: "地図タイルの指定範囲のみを削除するツール"
description: "gdal2tilesで複数の画像を結合して地図タイルを作成する場合に、一部のみうまくタイルが生成できなかったときに利用するpythonのコードです。 このツールを使って、再作成したい部分のみタイルを削除して、gdal2t"
date: 2020-08-16
---

gdal2tilesで複数の画像を結合して地図タイルを作成する場合に、一部のみうまくタイルが生成できなかったときに利用するpythonのコードです。

このツールを使って、再作成したい部分のみタイルを削除して、gdal2tilesを-e又は–resumeを付けて実行すれば、タイルの欠落部分のみタイル生成を行うので、短時間で処理が完了します。

```
#地図タイルの指定した範囲を削除するツールです。
#初めに、削除するフォルダと範囲を指定して実行してください。
#実行後、削除したファイルの一覧が表示されます。
import os
import glob

#削除するフォルダを指定してください（ズームレベルまで）。
folder = r"C:\Users\abcde\Documents\n\15"

#削除するタイルの範囲を指定してください（フォルダ構成は{z}/{x}/{y}.png）。
#北西端↓
xmin = 28284
ymin = 13090
#南東端↓
xmax = 28290
ymax = 13100

lx = glob.glob(os.path.join(folder,'*'))
for i in lx:
    if xmin <= int(os.path.basename(i)) <= xmax:
        ly = glob.glob(os.path.join(i,'*'))
        for j in ly:
            if ymin <= int((os.path.splitext(os.path.basename(j))[0])) <= ymax:
                print(j)
                os.remove(j)
```
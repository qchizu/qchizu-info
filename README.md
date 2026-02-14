# 全国Q地図 紹介ページ（info.qchizu.jp）

全国Q地図の紹介サイトです。Astro + Markdown で構成しています。

## ディレクトリ構成

```
qchizu-info/
├── src/
│   ├── content/articles/   # 記事（Markdown）
│   ├── layouts/            # レイアウト
│   ├── components/         # コンポーネント
│   └── pages/              # ページ
├── public/images/          # 画像ファイル
├── scripts/                # スクリプト
└── .github/workflows/      # デプロイワークフロー
```

## コマンド

プロジェクトルートで以下のコマンドを実行します。

| コマンド                    | 内容                                              |
| :------------------------- | :------------------------------------------------ |
| `npm install`              | 依存パッケージのインストール                        |
| `npm run dev`              | 開発サーバーを起動（`localhost:4321`）              |
| `npm run build`            | 本番用ビルド（`./dist/` に出力）                    |
| `npm run preview`          | ビルド結果のプレビュー                              |

## デプロイ

1. 記事を編集・追加し、master ブランチに push
2. タグを作成: `git tag v20260131 && git push origin v20260131`
3. GitHub Actions が自動でビルド・Xserver へデプロイ（https://info.qchizu.jp）

## 記事の追加・編集

`src/content/articles/` にMarkdownファイルを配置します。詳細は `SPEC.md` を参照してください。

## ライセンス

このリポジトリのすべてのコンテンツ（記事、コード、画像等）は、[Creative Commons Attribution 4.0 International License (CC BY 4.0)](https://creativecommons.org/licenses/by/4.0/) の下でライセンスされています。

出典を明記すれば、自由に利用・改変・再配布できます。詳細は [LICENSE](./LICENSE) を参照してください。

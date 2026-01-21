# 全国Q地図 紹介ページ（info.qchizu.jp）仕様書

## 概要

全国Q地図の紹介サイト。Astro + Markdown で構成し、GitHub経由でXserverへ自動デプロイする。

## 技術スタック

- **SSG**: Astro
- **記事形式**: Markdown（フロントマター付き）
- **ホスティング**: Xserver
- **デプロイ**: GitHub Actions（タグ push でトリガー）

## ディレクトリ構成

```
qchizu-info/
├── src/
│   ├── content/
│   │   └── articles/       # 記事（*.md）
│   ├── layouts/
│   │   └── Article.astro   # 記事レイアウト
│   └── pages/
│       ├── index.astro     # トップページ
│       └── [slug].astro    # 記事ページ
├── public/
│   └── images/             # 画像ファイル
├── docs/
│   └── map-spec.md         # 地図ページ仕様書（参照用）
└── astro.config.mjs
```

## 記事の書き方

ファイル: `src/content/articles/{slug}.md`

```markdown
---
title: "記事タイトル"
description: "記事の概要（OGP用）"
date: 2024-01-15
order: 10
---

本文をここに書く。

## 見出しはh2から

![画像の説明](/images/example.png)
```

### フロントマター項目

| 項目 | 必須 | 説明 |
|------|------|------|
| title | ○ | ページタイトル |
| description | ○ | 概要（100文字程度） |
| date | ○ | 作成日または更新日 |
| order | - | メニュー表示順（小さい順） |

## デプロイ手順

1. 記事を編集・追加
2. main ブランチに push
3. タグを作成: `git tag 2024-01-15 && git push origin 2024-01-15`
4. GitHub Actions が自動でビルド・デプロイ

### タグの命名規則

- 形式: `YYYY-MM-DD`（例: `2024-01-15`）
- 同日に複数回デプロイする場合: `2024-01-15-2`

## 運用ルール

- 画像は `/public/images/` に配置し、記事からは `/images/xxx.png` で参照
- 記事のslug（ファイル名）は英数字とハイフンのみ使用

---

## WordPress移行

### 移行元

- URL: https://info.qchizu.jp
- 対象: 投稿（post）および固定ページ（page）
- 記事数: 約30件

### 移行スクリプトの要件

1. **記事取得**: WordPress REST API から投稿・固定ページを取得
2. **Markdown変換**: HTML本文をMarkdownに変換
3. **フロントマター生成**: title, description, date を付与
4. **画像ダウンロード**: 記事内の画像を `/public/images/` に保存し、パスを書き換え
5. **出力先**: `src/content/articles/{slug}.md`

### 実行方法

```bash
# 移行スクリプト実行
node scripts/migrate-wp.js

# または
python scripts/migrate_wp.py
```

### 注意事項

- WordPress REST APIが有効であること（通常はデフォルトで有効）
- 移行後、手動で内容を確認・調整する

# 全国Q地図 紹介ページ（info.qchizu.jp）

## 概要

全国Q地図の紹介サイト。Astro + Markdown で構成し、GitHub経由でXserverへ自動デプロイする。

- **SSG**: Astro 5.x
- **記事形式**: Markdown（Content Collections）
- **ホスティング**: Xserver
- **デプロイ**: GitHub Actions（`v*` タグ push でトリガー）
- **本番環境**: https://info.qchizu.jp
- **テスト環境**: https://test-info.qchizu.jp
- **リポジトリ**: https://github.com/qchizu/qchizu-info （プライベート）

## ディレクトリ構成

```
qchizu-info/
├── src/
│   ├── content/
│   │   └── articles/       # 記事（*.md）
│   ├── content.config.ts   # Content Collections設定
│   ├── layouts/
│   │   ├── Base.astro      # 共通HTMLレイアウト
│   │   └── Article.astro   # 記事レイアウト
│   ├── components/
│   │   ├── Header.astro    # ヘッダー（ハンバーガーメニュー対応）
│   │   ├── Footer.astro    # フッター
│   │   └── Sidebar.astro   # サイドバーナビゲーション
│   └── pages/
│       ├── index.astro     # トップページ（home.mdの内容）
│       ├── [slug].astro    # 記事ページ
│       ├── posts.astro     # ブログ一覧
│       └── guides.astro    # 使い方ガイド一覧
├── public/
│   ├── .htaccess            # リダイレクトルール（Apache）
│   ├── robots.txt           # クローラー設定
│   └── images/              # 画像ファイル
├── docs/
│   └── migration.md         # WordPress移行作業記録
├── .github/
│   └── workflows/
│       └── deploy.yml      # デプロイワークフロー
└── astro.config.mjs
```

## 記事の書き方

ファイル: `src/content/articles/{slug}.md`

```markdown
---
title: "記事タイトル"
description: "記事の概要（OGP用）"
date: 2024-01-15
type: guide
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
| date | ○ | 作成日又は更新日 |
| type | ○ | 記事種別: `page`（固定ページ）、`guide`（使い方ガイド）、`post`（ブログ） |
| order | - | メニュー表示順（小さい順） |

### 記事種別（type）

| type | 呼称 | 用途 | 日付表示 |
|------|------|------|---------|
| `page` | ページ | サイト運営情報（about, 連絡先等） | 非表示 |
| `guide` | 使い方ガイド | 地図機能・コンテンツの説明 | 控えめ（更新日） |
| `post` | ブログ | 技術記事、ニュース | 目立たせる（投稿日） |

### 表記ルール（公用文の書き方）

| 項目 | 表記例 |
|------|--------|
| 接続詞 | 及び、並びに、又は、若しくは |
| 敬語 | 漢語は「御」（御利用、御覧、御確認）、和語は「お」（お名前、お知らせ） |
| 送り仮名 | 行う、行なう→行う |

## デプロイ手順

1. 記事を編集・追加
2. master ブランチに push
3. タグを作成: `git tag v20260211 && git push origin v20260211`
4. GitHub Actions が自動でビルド・デプロイ

### タグの命名規則

- 形式: `vYYYYMMDD`（例: `v20260211`）
- 同日に複数回デプロイする場合: `v20260211-2`

## 運用ルール

- 画像は `/public/images/` に配置し、記事からは `/images/xxx.png` で参照

### URL（slug）命名規則

記事のファイル名がそのままURLになる（`{slug}.md` → `/{slug}/`）。

#### 基本ルール

| 項目 | ルール |
|------|--------|
| 使用文字 | 半角英小文字 `a-z`、数字 `0-9`、ハイフン `-` のみ |
| 単語区切り | ハイフン（ケバブケース） |
| 単語数 | 1〜4語（ハイフン区切りで最大4パーツ） |
| 文字数 | 3〜30文字 |
| 先頭・末尾 | ハイフン不可 |
| 連続ハイフン | `--` 不可 |
| 公開後の変更 | 原則禁止 |

#### 命名方針

| 優先度 | 方針 | 例 |
|--------|------|-----|
| 1 | 英語の一般名詞・形容詞で内容を表す | `road-structures`, `elevation-tile` |
| 2 | 固有名詞はそのまま使用可 | `maplibre-viewer`, `foss4g2024` |
| 3 | ローマ字は固有名詞に限り使用可 | `minna`, `rrim-cs-viewer` |
| 4 | 年号はイベント・時事記事にのみ付与 | `foss4g2024` |

#### 避けるべきパターン

- 1〜2文字の略語（例: `cs` → `cs-parameter`）
- URLだけで内容が推測できない名前
- 一般的でないローマ字
- 5語以上の長いslug

## 残作業

- **WordPress後片付け**（2026年2月下旬目安）: 詳細は `docs/migration.md` 手順7を参照
  - Xserver上の退避ディレクトリ `info.qchizu.jp.wp-backup/` の削除
  - WordPressバックアップファイルの削除（`~/wp-backup-info-20260211.tar.gz`, `~/wp-db-backup-20260211.sql`）
  - WordPressデータベース `qchizu_qtvxi` の削除（任意）
  - WordPress簡単インストールの解除

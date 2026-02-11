# 全国Q地図 紹介ページ（info.qchizu.jp）仕様書

## 概要

全国Q地図の紹介サイト。Astro + Markdown で構成し、GitHub経由でXserverへ自動デプロイする。
シンプルでメンテナンスしやすく、かつ、拡張性の高い手法を採用する。

## 技術スタック

- **SSG**: Astro 5.x
- **記事形式**: Markdown（Content Collections）
- **ホスティング**: Xserver
- **デプロイ**: GitHub Actions（`v*` タグ push でトリガー）
- **テスト環境**: https://test-info.qchizu.jp （構築済み）
- **本番環境**: https://info.qchizu.jp （現在はWordPressで運用中）

---

## 進捗状況

### 完了した事項

- [x] Astroプロジェクト初期化
- [x] ディレクトリ構造作成
- [x] Content Collections設定（`src/content.config.ts`）
- [x] レイアウト実装（`Base.astro`, `Article.astro`）
- [x] コンポーネント実装（`Header.astro`, `Footer.astro`, `Sidebar.astro`）
- [x] ページ実装（`index.astro`, `[slug].astro`, `posts.astro`, `guides.astro`）
- [x] WordPress移行スクリプト作成（`scripts/migrate-wp.js`）
- [x] WordPress記事移行実行（34記事: 投稿8件、固定ページ26件）
- [x] 画像ファイル移行（日本語ファイル名対応済み）
- [x] GitHub Actionsデプロイワークフロー作成（`.github/workflows/deploy.yml`）
- [x] GitHubリポジトリ作成・push（https://github.com/qchizu/qchizu-info プライベート）
- [x] トップページをpost-21の内容に変更
- [x] CSSの調整（シンプル化、テーマカラー維持、見出しスタイル整備）
- [x] **記事の構成整理・ナビゲーション改善**
  - 記事を3種類に分類（page: 5件、guide: 12件、post: 8件）
  - フラットヘッダー＋サイドバーナビゲーション実装（ハンバーガーメニュー対応）
  - 一覧ページ作成（`/posts`, `/guides`）
  - type別の日付表示（post: 目立たせる、guide: 控えめ、page: 非表示）
  - 不要記事削除・統合（`improve.md`→`minna.md`、`tile.md`→`about.md`等）
  - ファビコン設定
- [x] **記事品質改善**
  - 画像パス修正、べき乗表記復元、テキスト修正
  - テーブル・見出し・リンクの一括整備
- [x] **GitHub Secretsの登録**
  - `SSH_PRIVATE_KEY`, `SSH_HOST`, `SSH_USER`
- [x] **テスト環境構築**
  - `test-info.qchizu.jp` にデプロイする構成に変更
  - トリガーを `v*` タグに統一（qchizu-mapsと同じ）
  - リリースノート自動生成を追加

### 未完了の事項

#### 1. 記事内容の整理

- [x] **WordPress移行元との内容差分確認**
  - `temp_*.html`（6件）と対応するMarkdown記事を比較し、未移行の内容を補完
  - 対象: `shinrinkihonzu.md`, `cs.md`, `bus-stop.md`, `elevation-tile.md`, `road-structures.md`, `stereo.md`
  - 確認完了後、`temp_*.html` ファイルを削除

- [x] **各記事の内容確認・更新**
  - 内部リンクが正しいことを確認済み（全25記事）
  - iframe未復元1件（road-structures.md）を復元済み

#### 2. 表記ルールの統一

- [x] **公用文の書き方に倣った表記統一**
  - 敬語表記の統一: 漢語は「御」（御利用、御覧、御活用、御支援、御所属等）、和語は「お」のまま（お名前、お知らせ等）
  - 接続詞の統一: 「及び」「又は」「並びに」を適切に使用
  - 送り仮名の統一: 「行う」（「行なう」は不可）

#### 3. 本番環境への移行

- [ ] **リダイレクト設定**
  - 現行サイト（WordPress）のURLから変更になるページのリダイレクトを設定
  - `.htaccess` 又は Xserver側で対応

- [ ] **本番デプロイ設定**
  - `astro.config.mjs` の `site` を `https://info.qchizu.jp` に変更
  - デプロイワークフローのデプロイ先を本番ディレクトリに変更
  - DNS・サーバー設定の切り替え

---

## ディレクトリ構成

```
qchizu-info/
├── src/
│   ├── content/
│   │   └── articles/       # 記事（*.md）25件
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
│   └── images/             # 画像ファイル
├── scripts/
│   └── migrate-wp.js       # WordPress移行スクリプト
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
3. タグを作成: `git tag v20260131 && git push origin v20260131`
4. GitHub Actions が自動でビルド・デプロイ

### タグの命名規則

- 形式: `vYYYYMMDD`（例: `v20260131`）
- 同日に複数回デプロイする場合: `v20260131-2`

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

---

## WordPress移行（完了）

### 移行元

- URL: https://info.qchizu.jp
- 対象: 投稿（post）及び固定ページ（page）
- 記事数: 34件（投稿8件、固定ページ26件）

### 移行スクリプト

```bash
# 移行スクリプト実行
npm run migrate
# または
node scripts/migrate-wp.js
```

### 注意事項

- 移行済みの記事は手動で内容を確認・調整すること
- 日本語ファイル名の画像はURLデコード済み

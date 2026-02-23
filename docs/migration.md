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
- [x] GitHubリポジトリ作成・push（https://github.com/qchizu-project/qchizu-info プライベート）
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

#### 3. 本番環境への移行（詳細は「本番環境移行手順」セクションを参照）

- [x] **手順1: WordPressのバックアップ**
  - Xserver サーバーパネルからファイル及びデータベースのバックアップを取得
  - ファイル: `~/wp-backup-info-20260211.tar.gz`（2.2GB）
  - DB: `~/wp-db-backup-20260211.sql`（24MB）
- [x] **手順2: プロジェクト設定の変更** ← 完了済み
  - `astro.config.mjs` の `site` を `https://info.qchizu.jp` に変更
  - `deploy.yml` のデプロイ先を本番ディレクトリに変更
  - `@astrojs/sitemap` インテグレーション導入
  - `public/robots.txt` 作成（サイトマップURL記載）
  - `public/.htaccess` 作成（WordPress旧URL→新URLの301リダイレクト）
  - Google Search Console 所有権確認（GA4による自動確認で完了）
- [x] **手順3: WordPressファイルの退避**（Xserver SSH操作）
  - `/home/qchizu/qchizu.jp/public_html/info.qchizu.jp/` 内のファイルを `info.qchizu.jp.wp-backup/` に退避済み
- [x] **手順4: Astroサイトのデプロイ**
  - タグ `v20260211-2` で GitHub Actions 自動デプロイ完了
- [x] **手順5: リダイレクト設定**（`.htaccess`）← 完了済み
  - WordPress旧URL（投稿8件・固定ページ22件）から新URLへの301リダイレクト
  - `wp-content/uploads/` 画像パスの `/images/` へのリダイレクト
  - WordPress管理画面・API URL の 410 Gone 設定
  - クエリパラメーター形式（`?p=123`）のトップへのリダイレクト
- [x] **手順6: 動作確認**
- [ ] **手順7: 後片付け**（WordPress バックアップ・データベースの削除）← 1〜2週間後に実施
- [x] **手順8: Search Console でサイトマップ送信**
  - `https://info.qchizu.jp/sitemap-index.xml` を送信済み

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
│   ├── .htaccess            # リダイレクトルール（Apache）
│   ├── robots.txt           # クローラー設定
│   └── images/              # 画像ファイル
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

---

## 本番環境移行手順（WordPress → Astro）

Xserver上でWordPressが稼働している `info.qchizu.jp` を、Astro で生成した静的サイトに切り替える手順。

### 前提条件

- テスト環境（`test-info.qchizu.jp`）で動作確認が完了していること
- Xserver のサーバーパネルにログインできること
- SSH接続が可能であること（ポート10022）

### ディレクトリ構成（Xserver側）

```
/home/qchizu/qchizu.jp/public_html/
├── info.qchizu.jp/          # 本番（現在はWordPress）
│   ├── wp-admin/
│   ├── wp-content/
│   ├── wp-includes/
│   ├── wp-config.php
│   ├── .htaccess
│   └── ...
└── test-info.qchizu.jp/     # テスト環境（Astro デプロイ済み）
```

---

### 手順1: WordPressのバックアップ

移行前に、WordPressのファイル及びデータベースの両方をバックアップする。

#### 方法A: Xserver サーバーパネルから操作（推奨）

1. サーバーパネルにログイン
2. **「バックアップ」** → 「手動バックアップ」→ 対象ディレクトリ（`info.qchizu.jp`）のデータをダウンロード
3. **「MySQL設定」** → WordPressが使用しているデータベース名を確認・メモ
   - `wp-config.php` 内の `DB_NAME`, `DB_USER` の値と一致する
4. **「phpMyAdmin」** → 対象データベースを選択 → 「エクスポート」でSQLダンプをダウンロード

#### 方法B: SSH で操作

```bash
# Xserver に SSH 接続
ssh -p 10022 qchizu@<SSH_HOST>

# WordPress ディレクトリの確認
ls -la /home/qchizu/qchizu.jp/public_html/info.qchizu.jp/

# ファイルのバックアップ（tarで圧縮）
cd /home/qchizu/qchizu.jp/public_html/
tar czf ~/wp-backup-info-$(date +%Y%m%d).tar.gz info.qchizu.jp/

# データベースのバックアップ（wp-config.phpからDB情報を確認）
grep -E "DB_NAME|DB_USER|DB_PASSWORD" info.qchizu.jp/wp-config.php
mysqldump -u <DB_USER> -p <DB_NAME> > ~/wp-db-backup-$(date +%Y%m%d).sql
```

---

### 手順2: プロジェクト設定の変更（ローカルで実施）

#### 2-1. `astro.config.mjs` の `site` を本番URLに変更

```javascript
// 変更前
site: 'https://test-info.qchizu.jp',

// 変更後
site: 'https://info.qchizu.jp',
```

#### 2-2. `.github/workflows/deploy.yml` のデプロイ先を変更

```yaml
# 変更前
./dist/ \
${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:/home/qchizu/qchizu.jp/public_html/test-info.qchizu.jp/

# 変更後
./dist/ \
${{ secrets.SSH_USER }}@${{ secrets.SSH_HOST }}:/home/qchizu/qchizu.jp/public_html/info.qchizu.jp/
```

#### 2-3. リダイレクト用 `.htaccess` を作成

`public/.htaccess` を作成する（詳細は手順5を参照）。`public/` 配下に置くことで、Astro のビルド時に `dist/` へコピーされる。

#### 2-4. 変更をコミット・push

```bash
git add astro.config.mjs .github/workflows/deploy.yml public/.htaccess
git commit -m "本番環境への切り替え"
git push origin master
```

> **注意**: この時点ではまだタグを作成しない。手順3（WordPress退避）の直後にデプロイする。

---

### 手順3: WordPressファイルの退避（Xserver SSH操作）

```bash
# Xserver に SSH 接続
ssh -p 10022 qchizu@<SSH_HOST>

# 本番ディレクトリに移動
cd /home/qchizu/qchizu.jp/public_html/

# WordPress ファイルを退避ディレクトリに移動
mkdir info.qchizu.jp.wp-backup
mv info.qchizu.jp/.htaccess info.qchizu.jp.wp-backup/
mv info.qchizu.jp/* info.qchizu.jp.wp-backup/

# ディレクトリが空になったことを確認
ls -la info.qchizu.jp/
```

> **注意**: `mv` で移動するため、この時点でサイトは表示されなくなる。ダウンタイムを最小限にするため、この操作の直後に手順4を実行すること。

---

### 手順4: Astroサイトのデプロイ

手順3の直後にローカルで実行する。

```bash
# タグを作成してデプロイをトリガー
git tag v<YYYYMMDD> && git push origin v<YYYYMMDD>
```

GitHub Actions が自動でビルド・デプロイを実行する。完了まで1〜2分程度。

**デプロイ状況の確認方法:**

- GitHub リポジトリ → 「Actions」タブ → 実行中のワークフローを確認
- 緑色のチェックマークが表示されればデプロイ完了

---

### 手順5: リダイレクト設定（`.htaccess`）

WordPress時代のURLから新URLへの301リダイレクトを設定する。`public/.htaccess` として管理し、ビルド時に自動で `dist/` にコピーされるようにする。

#### `public/.htaccess`（実装済み）

WordPress旧URLからAstro新URLへの全リダイレクトルールを `public/.htaccess` に記述済み。

- 投稿（posts）: `/YYYY/MM/DD/{slug}/` → `/{new-slug}/`（8件）
- 固定ページ（pages）: `/qchizu/...` 等の階層構造 → フラットURL（22件）
- 画像: `/wp-content/uploads/**/{ファイル名}` → `/images/{ファイル名}`
- クエリパラメーター: `?p={id}` → `/`
- WordPress管理URL: `wp-admin`, `wp-login.php`, `xmlrpc.php`, `wp-json`, `feed` → 410 Gone

---

### 手順6: 動作確認

以下の項目をすべて確認する。

- [ ] トップページ（`https://info.qchizu.jp`）が正しく表示されること
- [ ] 各記事ページ（`/about/`, `/elevation-tile/` 等）が表示されること
- [ ] 画像が正しく表示されること
- [ ] リダイレクトが機能すること（`/cs/` → `/cs-parameter/` 等）
- [ ] SSL証明書が有効であること（ブラウザの鍵アイコンを確認）
- [ ] GA4トラッキングが動作していること（GA4リアルタイムレポートで確認）
- [ ] モバイル表示が正常であること
- [ ] 外部リンク（地図ビューア等）が正しいこと
- [ ] WordPress管理画面URL（`/wp-admin/`）が404になること
- [ ] Google検索からの流入が正しいページに到達すること

---

### 手順7: 後片付け

動作確認が完了し、1〜2週間程度問題なく運用できた後に実施する。

#### 7-1. テスト環境の扱い

`test-info.qchizu.jp` はそのまま残してよい。本番デプロイ前の事前確認用として継続運用する。本番用とテスト用でデプロイ先を切り替えたい場合は、`deploy.yml` をブランチ又は環境変数で制御する方法を検討する。

#### 7-2. WordPressバックアップの削除

```bash
# Xserver に SSH 接続
ssh -p 10022 qchizu@<SSH_HOST>

# 退避ディレクトリの削除（十分な確認期間を経てから）
rm -rf /home/qchizu/qchizu.jp/public_html/info.qchizu.jp.wp-backup/

# tar バックアップの削除
rm ~/wp-backup-info-*.tar.gz
rm ~/wp-db-backup-*.sql
```

#### 7-3. WordPressデータベースの削除（任意）

1. Xserver サーバーパネル → **「MySQL設定」**
2. WordPressが使用していたデータベースを選択 → 削除
3. 対応するMySQLユーザーも不要であれば削除

> **注意**: データベースの削除は取り消せない。SQLダンプのバックアップがローカルに保存されていることを確認してから実施すること。

#### 7-4. WordPress簡単インストールの解除

Xserver の「WordPress簡単インストール」機能で導入した場合:

1. サーバーパネル → **「WordPress簡単インストール」**
2. 対象ドメイン（`info.qchizu.jp`）を選択
3. 該当のインストール情報が残っている場合は「削除」

> **補足**: 手順3でファイルを手動退避しているため、簡単インストールの管理画面上では「インストール済み」の表示が残る場合がある。この表示を整理するために削除する。

---

### 移行作業のタイムライン（参考）

| 順序 | 作業 | ダウンタイム |
|------|------|-------------|
| 事前 | 手順1（バックアップ）・手順2（設定変更・コミット） | なし |
| 当日 | 手順3（WordPress退避）→ 手順4（デプロイ） | 数分 |
| 当日 | 手順5（リダイレクト確認）・手順6（動作確認） | なし |
| 後日 | 手順7（後片付け） | なし |

> 手順3と手順4を連続して実行すれば、ダウンタイムはGitHub Actionsのビルド・デプロイ時間（1〜2分程度）のみ。

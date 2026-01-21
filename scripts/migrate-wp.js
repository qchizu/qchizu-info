/**
 * WordPress移行スクリプト
 *
 * WordPress REST APIから投稿と固定ページを取得し、
 * Markdown形式に変換してAstro Content Collectionsに出力する。
 *
 * 使い方:
 *   WP_SITE_URL=https://info.qchizu.jp npm run migrate
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import TurndownService from 'turndown';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const WP_SITE_URL = process.env.WP_SITE_URL || 'https://info.qchizu.jp';
const OUTPUT_DIR = path.resolve(__dirname, '../src/content/articles');
const IMAGES_DIR = path.resolve(__dirname, '../public/images');

const turndown = new TurndownService({
  headingStyle: 'atx',
  codeBlockStyle: 'fenced',
});

/**
 * WordPress REST APIからデータを取得
 */
async function fetchFromWP(endpoint) {
  const url = `${WP_SITE_URL}/wp-json/wp/v2/${endpoint}`;
  console.log(`Fetching: ${url}`);

  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch ${endpoint}: ${response.status}`);
  }
  return response.json();
}

/**
 * すべての投稿を取得（ページネーション対応）
 */
async function fetchAllPosts() {
  const posts = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const batch = await fetchFromWP(`posts?per_page=${perPage}&page=${page}&_embed`);
    if (batch.length === 0) break;
    posts.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }

  return posts;
}

/**
 * すべての固定ページを取得
 */
async function fetchAllPages() {
  const pages = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const batch = await fetchFromWP(`pages?per_page=${perPage}&page=${page}&_embed`);
    if (batch.length === 0) break;
    pages.push(...batch);
    if (batch.length < perPage) break;
    page++;
  }

  return pages;
}

/**
 * 画像をダウンロードしてローカルに保存
 */
async function downloadImage(imageUrl, filename) {
  // ファイル名をデコード（日本語ファイル名に対応）
  const decodedFilename = decodeURIComponent(filename);
  const imagePath = path.join(IMAGES_DIR, decodedFilename);

  if (fs.existsSync(imagePath)) {
    console.log(`  Image already exists: ${decodedFilename}`);
    return `/images/${encodeURIComponent(decodedFilename)}`;
  }

  try {
    console.log(`  Downloading image: ${imageUrl}`);
    const response = await fetch(imageUrl);
    if (!response.ok) {
      console.warn(`  Failed to download image: ${imageUrl}`);
      return imageUrl;
    }

    const buffer = await response.arrayBuffer();
    fs.writeFileSync(imagePath, Buffer.from(buffer));
    console.log(`  Saved: ${decodedFilename}`);
    return `/images/${encodeURIComponent(decodedFilename)}`;
  } catch (error) {
    console.warn(`  Error downloading image: ${error.message}`);
    return imageUrl;
  }
}

/**
 * HTML内の画像URLを書き換え
 */
async function processImages(html) {
  const imgRegex = /<img[^>]+src="([^"]+)"[^>]*>/gi;
  const matches = [...html.matchAll(imgRegex)];

  let processedHtml = html;

  for (const match of matches) {
    const originalUrl = match[1];

    // WordPress内部の画像のみ処理
    if (!originalUrl.includes(WP_SITE_URL) && !originalUrl.startsWith('/')) {
      continue;
    }

    const urlObj = new URL(originalUrl, WP_SITE_URL);
    const filename = path.basename(urlObj.pathname);

    const localPath = await downloadImage(originalUrl, filename);
    processedHtml = processedHtml.replace(originalUrl, localPath);
  }

  return processedHtml;
}

/**
 * スラッグを生成（日本語URLをサニタイズ）
 */
function generateSlug(post) {
  // スラッグが英数字の場合はそのまま使用
  if (/^[a-z0-9-]+$/.test(post.slug)) {
    return post.slug;
  }

  // 日本語スラッグの場合はIDベースに変換
  return `post-${post.id}`;
}

/**
 * フロントマター用に文字列をサニタイズ
 */
function sanitizeForYaml(str) {
  return str
    .replace(/\\/g, '')           // バックスラッシュを削除
    .replace(/\[…\]/g, '')        // [...] 省略記号を削除
    .replace(/\[&#8230;\]/g, '')  // HTMLエンティティ版省略記号
    .replace(/&#\d+;/g, '')       // HTMLエンティティを削除
    .replace(/"/g, "'")           // ダブルクォートをシングルクォートに
    .replace(/\n/g, ' ')          // 改行をスペースに
    .replace(/\s+/g, ' ')         // 連続空白を1つに
    .trim();
}

/**
 * 投稿/ページをMarkdownに変換して保存
 */
async function convertToMarkdown(item, type) {
  const slug = generateSlug(item);
  const title = sanitizeForYaml(item.title.rendered);
  const date = item.date.split('T')[0];

  // 抜粋からdescriptionを生成
  const excerptText = item.excerpt?.rendered
    ? turndown.turndown(item.excerpt.rendered)
    : '';
  const description = sanitizeForYaml(excerptText).slice(0, 120) || title;

  // HTML内の画像を処理
  const processedContent = await processImages(item.content.rendered);

  // HTMLをMarkdownに変換
  const markdown = turndown.turndown(processedContent);

  // フロントマター付きMarkdownを生成
  const frontmatter = `---
title: "${title}"
description: "${description}"
date: ${date}
---

`;

  const content = frontmatter + markdown;

  // ファイル保存
  const filename = `${slug}.md`;
  const filepath = path.join(OUTPUT_DIR, filename);
  fs.writeFileSync(filepath, content, 'utf-8');
  console.log(`Created: ${filename}`);

  return { slug, title, type };
}

/**
 * メイン処理
 */
async function main() {
  console.log('WordPress Migration Script');
  console.log('==========================\n');
  console.log(`Source: ${WP_SITE_URL}`);
  console.log(`Output: ${OUTPUT_DIR}\n`);

  // 出力ディレクトリを準備
  if (!fs.existsSync(OUTPUT_DIR)) {
    fs.mkdirSync(OUTPUT_DIR, { recursive: true });
  }
  if (!fs.existsSync(IMAGES_DIR)) {
    fs.mkdirSync(IMAGES_DIR, { recursive: true });
  }

  const results = [];

  try {
    // 投稿を取得・変換
    console.log('Fetching posts...');
    const posts = await fetchAllPosts();
    console.log(`Found ${posts.length} posts\n`);

    for (const post of posts) {
      try {
        const result = await convertToMarkdown(post, 'post');
        results.push(result);
      } catch (error) {
        console.error(`Error processing post ${post.id}: ${error.message}`);
      }
    }

    // 固定ページを取得・変換
    console.log('\nFetching pages...');
    const pages = await fetchAllPages();
    console.log(`Found ${pages.length} pages\n`);

    for (const page of pages) {
      try {
        const result = await convertToMarkdown(page, 'page');
        results.push(result);
      } catch (error) {
        console.error(`Error processing page ${page.id}: ${error.message}`);
      }
    }

    // 結果サマリー
    console.log('\n==========================');
    console.log('Migration Complete!');
    console.log(`Total articles created: ${results.length}`);
    console.log(`  Posts: ${results.filter(r => r.type === 'post').length}`);
    console.log(`  Pages: ${results.filter(r => r.type === 'page').length}`);
  } catch (error) {
    console.error(`Migration failed: ${error.message}`);
    process.exit(1);
  }
}

main();

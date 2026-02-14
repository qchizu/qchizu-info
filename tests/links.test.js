import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const articlesDir = path.resolve("src/content/articles");
const imagesDir = path.resolve("public/images");

// 全記事のslug一覧
const slugs = new Set(
  fs
    .readdirSync(articlesDir)
    .filter((f) => f.endsWith(".md"))
    .map((f) => f.replace(/\.md$/, ""))
);

// 既知の静的ページ（[slug].astro 以外のページ）
const knownPages = new Set(["", "pages", "guides", "posts"]);

// public/images 配下のファイル一覧
const imageFiles = new Set(fs.readdirSync(imagesDir));

const mdFiles = fs
  .readdirSync(articlesDir)
  .filter((f) => f.endsWith(".md"));

describe("リンク検証", () => {
  for (const file of mdFiles) {
    describe(file, () => {
      const content = fs.readFileSync(path.join(articlesDir, file), "utf-8");

      // フロントマター部分を除外して本文のみ取得
      const body = content.replace(/^---[\s\S]*?---/, "");

      // 内部リンクの検証: Markdown リンク [text](/path) 形式（画像構文 ![]() を除外）
      const internalLinks = [...body.matchAll(/(?<!!)\[([^\]]*)\]\(\/([^)]*)\)/g)];

      for (const match of internalLinks) {
        const linkPath = match[2];

        // アンカーリンク (#section) を除去
        const pathWithoutAnchor = linkPath.split("#")[0];
        // 末尾スラッシュを除去
        const cleanPath = pathWithoutAnchor.replace(/\/$/, "");

        // /images/ で始まるリンクは画像チェック側で処理
        if (cleanPath.startsWith("images/")) continue;

        it(`内部リンク /${linkPath} が有効`, () => {
          const isSlug = slugs.has(cleanPath);
          const isKnownPage = knownPages.has(cleanPath);
          assert.ok(
            isSlug || isKnownPage,
            `/${linkPath} に対応する記事またはページが見つかりません`
          );
        });
      }

      // 画像参照の検証: ![alt](/images/xxx) 形式
      const imageRefs = [...body.matchAll(/!\[[^\]]*\]\(\/images\/([^)]*)\)/g)];

      for (const match of imageRefs) {
        const rawImagePath = match[1];
        // URLエンコードされたファイル名をデコード
        const imageName = decodeURIComponent(rawImagePath);

        it(`画像 /images/${imageName} が存在する`, () => {
          assert.ok(
            imageFiles.has(imageName),
            `画像ファイル public/images/${imageName} が見つかりません`
          );
        });
      }
    });
  }
});

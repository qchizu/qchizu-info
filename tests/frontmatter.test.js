import { describe, it } from "node:test";
import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";

const articlesDir = path.resolve("src/content/articles");
const mdFiles = fs
  .readdirSync(articlesDir)
  .filter((f) => f.endsWith(".md"));

// home.md はトップページ用で title を空にしている（意図的な例外）
const titleExempt = new Set(["home"]);
// 既存記事で略語セグメントを含むもの（公開済みのためslug変更不可）
const abbreviationExempt = new Set(["cs-parameter", "rrim-cs-viewer"]);

describe("フロントマター検証", () => {
  for (const file of mdFiles) {
    const slug = file.replace(/\.md$/, "");

    describe(file, () => {
      const content = fs.readFileSync(path.join(articlesDir, file), "utf-8");
      const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

      it("フロントマターが存在する", () => {
        assert.ok(fmMatch, "フロントマターブロック (---) が見つかりません");
      });

      // フロントマターが無い場合は以降のテストをスキップ
      if (!fmMatch) return;

      const fmText = fmMatch[1];
      const fields = {};
      for (const line of fmText.split(/\r?\n/)) {
        const m = line.match(/^(\w+):\s*(.*)/);
        if (m) fields[m[1]] = m[2].replace(/^["']|["']$/g, "").trim();
      }

      it("必須フィールド title が存在し空でない", { skip: titleExempt.has(slug) }, () => {
        assert.ok(fields.title !== undefined && fields.title !== "", "title が未設定です");
      });

      it("必須フィールド description が存在し空でない", () => {
        assert.ok(
          fields.description !== undefined && fields.description !== "",
          "description が未設定です"
        );
      });

      it("必須フィールド date が存在し空でない", () => {
        assert.ok(fields.date !== undefined && fields.date !== "", "date が未設定です");
      });

      it("必須フィールド type が存在し空でない", () => {
        assert.ok(fields.type !== undefined && fields.type !== "", "type が未設定です");
      });

      it("type は page, guide, post のいずれか", () => {
        if (!fields.type) return; // 上のテストで検出済み
        assert.ok(
          ["page", "guide", "post"].includes(fields.type),
          `type "${fields.type}" は不正です (page, guide, post のいずれかにしてください)`
        );
      });

      it("slug命名規則: 使用文字は a-z, 0-9, - のみ", () => {
        assert.match(slug, /^[a-z0-9-]+$/, `slug "${slug}" に不正な文字が含まれています`);
      });

      it("slug命名規則: 3〜30文字", () => {
        assert.ok(
          slug.length >= 3 && slug.length <= 30,
          `slug "${slug}" は ${slug.length} 文字です (3〜30文字)`
        );
      });

      it("slug命名規則: 先頭・末尾がハイフンでない", () => {
        assert.ok(!slug.startsWith("-"), `slug "${slug}" がハイフンで始まっています`);
        assert.ok(!slug.endsWith("-"), `slug "${slug}" がハイフンで終わっています`);
      });

      it("slug命名規則: 連続ハイフン (--) を含まない", () => {
        assert.ok(!slug.includes("--"), `slug "${slug}" に連続ハイフンが含まれています`);
      });

      it("slug命名規則: 1〜2文字の略語を含まない", { skip: abbreviationExempt.has(slug) }, () => {
        const parts = slug.split("-");
        const short = parts.filter((p) => p.length <= 2 && !/^\d+$/.test(p));
        assert.ok(
          short.length === 0,
          `slug "${slug}" に短い略語 [${short.join(", ")}] が含まれています`
        );
      });

      it("slug命名規則: 1〜4パーツ (ハイフン区切り)", () => {
        const parts = slug.split("-").length;
        assert.ok(
          parts >= 1 && parts <= 4,
          `slug "${slug}" は ${parts} パーツです (1〜4パーツ)`
        );
      });
    });
  }
});

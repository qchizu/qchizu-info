/**
 * Markdownの内部リンク・画像パスにベースURLプレフィックスを付与するremarkプラグイン。
 * astro.config.mjsの `base` 設定と連動して、Markdown内の絶対パスリンクを
 * サブディレクトリ配置に対応させる。
 *
 * 対象:
 * - 内部リンク: [テキスト](/slug/) → [テキスト](/info/slug/)
 * - 画像: ![alt](/images/foo.png) → ![alt](/info/images/foo.png)
 *
 * 対象外:
 * - 外部リンク（https://...）
 * - プロトコル相対URL（//example.com）
 * - アンカーリンク（#section）
 * - 相対パス（./foo, ../bar）
 */
import { visit } from 'unist-util-visit';

/**
 * @param {{ base?: string }} options
 */
export function remarkBaseUrl(options = {}) {
  const base = options.base || '';
  if (!base) return () => {};

  return (tree) => {
    visit(tree, ['link', 'image'], (node) => {
      if (node.url.startsWith('/') && !node.url.startsWith('//')) {
        node.url = base + node.url;
      }
    });
  };
}

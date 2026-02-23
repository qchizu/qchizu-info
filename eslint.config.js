// @ts-check
import eslintPluginAstro from 'eslint-plugin-astro';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  // Astroの推奨ルール（TypeScript用パーサーを含む）
  ...eslintPluginAstro.configs['flat/recommended'],
  // TypeScript固有ファイル（.ts）向けの設定
  {
    files: ['**/*.ts'],
    extends: [...tseslint.configs.recommended],
    rules: {
      // 未使用変数を警告（_プレフィックスは除外）
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    // ビルド成果物・テストは対象外
    ignores: ['dist/', '.astro/', 'tests/'],
  },
);

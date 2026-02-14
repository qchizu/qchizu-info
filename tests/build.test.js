import { describe, it } from "node:test";
import assert from "node:assert/strict";
import { execSync } from "node:child_process";

describe("ビルドテスト", () => {
  it("npm run build が正常終了する", () => {
    try {
      execSync("npm run build", {
        cwd: process.cwd(),
        stdio: "pipe",
        timeout: 120_000,
      });
    } catch (err) {
      const stderr = err.stderr ? err.stderr.toString() : "";
      const stdout = err.stdout ? err.stdout.toString() : "";
      assert.fail(
        `ビルドが失敗しました (exit code: ${err.status})\n` +
          `stderr: ${stderr.slice(-500)}\n` +
          `stdout: ${stdout.slice(-500)}`
      );
    }
  });
});

import assert from "node:assert/strict";
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import test from "node:test";
import { createDraft, normalizePost } from "../src/lib/post-shared.ts";
import { readPostFile, savePostFile } from "../src/lib/server/post-files.ts";
import { pushContent, readGitStatus } from "../src/lib/server/git.ts";
import { postHref, writingHref } from "../src/lib/post-navigation.ts";

function workspace(t) {
  const directory = fs.mkdtempSync(path.join(os.tmpdir(), "blog-posts-"));
  t.after(() => fs.rmSync(directory, { recursive: true, force: true }));
  return directory;
}

function post(overrides = {}) {
  return { ...createDraft(), title: "테스트 글", slug: "first", content: "## 본문\n\n테스트 내용", ...overrides };
}

function stored(directory, slug) {
  return readPostFile(path.join(directory, `${slug}.mdx`));
}

test("새 글의 일반 저장은 요청 값과 관계없이 초안으로 남는다", t => {
  const directory = workspace(t);
  const result = savePostFile(directory, post({ draft: false }));
  assert.equal(result.draft, true);
  assert.equal(stored(directory, "first").draft, true);
  assert.ok(result.id.startsWith("p_"));
});

test("명시적인 출간에서만 초안을 공개하고, 이후 자동 저장은 공개 상태를 유지한다", t => {
  const directory = workspace(t);
  savePostFile(directory, post());
  savePostFile(directory, { ...stored(directory, "first"), draft: false }, "first", "publish");
  assert.equal(stored(directory, "first").draft, false);
  savePostFile(directory, { ...stored(directory, "first"), draft: true, content: "수정 내용" }, "first");
  assert.equal(stored(directory, "first").draft, false);
  assert.equal(stored(directory, "first").content.trim(), "수정 내용");
});

test("출간된 글을 명시적으로 초안으로 되돌릴 수 있다", t => {
  const directory = workspace(t);
  savePostFile(directory, post({ draft: false }), undefined, "publish");
  savePostFile(directory, { ...stored(directory, "first"), draft: true }, "first", "publish");
  assert.equal(stored(directory, "first").draft, true);
});

test("슬러그 충돌은 두 글의 내용과 파일을 그대로 보존한다", t => {
  const directory = workspace(t);
  savePostFile(directory, post());
  savePostFile(directory, post({ slug: "second", content: "두 번째 글" }));
  const before = ["first", "second"].map(slug => fs.readFileSync(path.join(directory, `${slug}.mdx`), "utf8"));
  assert.throws(() => savePostFile(directory, { ...stored(directory, "first"), slug: "second" }, "first"), error => error.status === 409);
  assert.deepEqual(["first", "second"].map(slug => fs.readFileSync(path.join(directory, `${slug}.mdx`), "utf8")), before);
});

test("같은 제목의 새 글도 기존 글을 덮어쓰지 않는다", t => {
  const directory = workspace(t);
  savePostFile(directory, post());
  const before = fs.readFileSync(path.join(directory, "first.mdx"), "utf8");
  assert.throws(() => savePostFile(directory, post({ content: "덮어쓰기 시도" })), error => error.status === 409);
  assert.equal(fs.readFileSync(path.join(directory, "first.mdx"), "utf8"), before);
});

test("슬러그 변경은 고유 ID와 본문을 유지하며 기존 경로를 정리한다", t => {
  const directory = workspace(t);
  savePostFile(directory, post());
  const original = stored(directory, "first");
  savePostFile(directory, { ...original, slug: "renamed" }, "first");
  assert.equal(fs.existsSync(path.join(directory, "first.mdx")), false);
  assert.equal(stored(directory, "renamed").id, original.id);
  assert.equal(stored(directory, "renamed").content, original.content);
});

test("새 파일 저장 실패 시 기존 글을 지우지 않고 임시 파일을 정리한다", t => {
  const directory = workspace(t);
  savePostFile(directory, post());
  const original = stored(directory, "first");
  const before = fs.readFileSync(path.join(directory, "first.mdx"), "utf8");
  const mocked = t.mock.method(fs, "linkSync", () => { throw new Error("disk write failed"); });
  assert.throws(() => savePostFile(directory, { ...original, slug: "renamed" }, "first"), /disk write failed/);
  mocked.mock.restore();
  assert.equal(fs.readFileSync(path.join(directory, "first.mdx"), "utf8"), before);
  assert.deepEqual(fs.readdirSync(directory), ["first.mdx"]);
});

test("동시 생성 충돌은 409 오류로 처리하고 기존 글을 보존한다", t => {
  const directory = workspace(t);
  const mocked = t.mock.method(fs, "linkSync", () => {
    fs.writeFileSync(path.join(directory, "first.mdx"), "another writer");
    throw Object.assign(new Error("exists"), { code: "EEXIST" });
  });
  assert.throws(() => savePostFile(directory, post()), error => error.status === 409);
  mocked.mock.restore();
  assert.equal(fs.readFileSync(path.join(directory, "first.mdx"), "utf8"), "another writer");
  assert.deepEqual(fs.readdirSync(directory), ["first.mdx"]);
});

test("잘못된 날짜와 슬러그 입력은 파일을 생성하지 않는다", t => {
  const directory = workspace(t);
  assert.throws(() => savePostFile(directory, post({ publishedAt: "2026-02-31" })), error => error.status === 400);
  assert.throws(() => savePostFile(directory, post({ slug: {} })), error => error.status === 400);
  assert.deepEqual(fs.readdirSync(directory), []);
  assert.equal(normalizePost({ publishedAt: new Date("2026-10-07") }, "old", "body").publishedAt, "2026-10-07");
});

test("커밋 메시지는 셸 코드가 아닌 한 개의 Git 인자로 전달한다", async () => {
  const commands = [];
  const message = 'content: $(touch should-not-exist) `echo injected` "quote"';
  let diffs = 0;
  const run = async args => {
    commands.push(args);
    if (args[0] === "branch") return "feature/blog";
    if (args[0] === "diff") return diffs++ === 0 ? "" : "content/posts/한글 글.mdx\0";
    return "done";
  };
  assert.equal((await pushContent(message, run)).success, true);
  assert.deepEqual(commands.find(args => args[0] === "commit"), ["commit", "-m", message]);
  assert.deepEqual(commands.at(-1), ["push", "origin", "feature/blog"]);
});

test("콘텐츠 이외의 스테이징 파일이 있으면 커밋이나 푸시를 하지 않는다", async () => {
  const commands = [];
  const result = await pushContent("update", async args => {
    commands.push(args);
    return args[0] === "branch" ? "main" : "content/posts/first.mdx\0README.md\0";
  });
  assert.equal(result.success, false);
  assert.match(result.output, /스테이징/);
  assert.equal(commands.some(args => ["add", "commit", "push"].includes(args[0])), false);
});

test("Git 상태 조회 실패를 깨끗한 작업 폴더로 표시하지 않는다", async () => {
  const status = await readGitStatus(async () => { throw new Error("not a repository"); });
  assert.equal(status.isClean, false);
  assert.equal(status.branch, "unknown");
});

test("검색·태그와 아카이브 경로를 글 이동 및 복귀에 유지한다", () => {
  for (const pathname of ["/", "/blog/"]) {
    const index = new URL(`${pathname}?q=Rust+한글&tag=macOS`, "https://example.com");
    const article = new URL(postHref("first", index), index);
    assert.equal(article.searchParams.get("q"), "Rust 한글");
    assert.equal(article.searchParams.get("tag"), "macOS");
    assert.equal(writingHref(article), `${pathname}?q=Rust+%ED%95%9C%EA%B8%80&tag=macOS`);
  }
  assert.equal(writingHref(new URL("https://example.com/blog/first/?index=https://evil.example")), "/");
});

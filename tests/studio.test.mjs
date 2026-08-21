import assert from "node:assert/strict";
import fs from "node:fs";
import path from "node:path";
import test from "node:test";
import matter from "gray-matter";

test("배포된 정적 빌드(out/)에 Studio 및 API 경로가 전혀 노출되지 않는다 (보안 검증)", () => {
  const outDir = path.join(process.cwd(), "out");
  assert.ok(fs.existsSync(outDir), "out 디렉터리가 빌드되어 있어야 합니다");

  // 1. Studio 라우트가 out 디렉터리에 없어야 함
  const studioOutPath = path.join(outDir, "studio");
  assert.equal(
    fs.existsSync(studioOutPath),
    false,
    "배포 디렉터리에 /studio 경로가 생성되면 안 됩니다",
  );

  // 2. API 엔드포인트가 out 디렉터리에 없어야 함
  const apiOutPath = path.join(outDir, "api");
  assert.equal(
    fs.existsSync(apiOutPath),
    false,
    "배포 디렉터리에 /api 경로가 생성되면 안 됩니다",
  );

  // 3. Sveltia /admin 잔재가 없어야 함
  const adminOutPath = path.join(outDir, "admin");
  assert.equal(
    fs.existsSync(adminOutPath),
    false,
    "배포 디렉터리에 /admin 경로가 생성되면 안 됩니다",
  );
});

test("배포된 HTML 헤더에 Studio 링크가 포함되지 않는다 (방문자 격리 검증)", () => {
  const indexPath = path.join(process.cwd(), "out", "index.html");
  assert.ok(fs.existsSync(indexPath), "index.html이 생성되어 있어야 합니다");

  const html = fs.readFileSync(indexPath, "utf8");
  assert.equal(
    html.includes('href="/studio"'),
    false,
    "배포된 메인 페이지 헤더에 /studio 링크가 노출되면 안 됩니다",
  );
});

test("content/posts 내 모든 포스트가 유효한 Frontmatter 및 구조를 가진다", () => {
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  assert.ok(files.length > 0, "포스트가 1개 이상 존재해야 합니다");

  for (const filename of files) {
    const filePath = path.join(postsDir, filename);
    const content = fs.readFileSync(filePath, "utf8");
    const { data, content: body } = matter(content);

    assert.ok(data.title, `${filename}: title이 존재해야 합니다`);
    assert.ok(data.publishedAt, `${filename}: publishedAt이 존재해야 합니다`);
    assert.ok(typeof body === "string", `${filename}: 본문 내용이 존재해야 합니다`);

    if (data.cover) {
      assert.ok(
        data.cover.startsWith("/") || data.cover.startsWith("http"),
        `${filename}: 커버 이미지 경로가 올바른 URL 형식이어야 합니다`,
      );
    }
  }
});

test("임시저장(draft: true) 포스트는 out/blog/에 정적 페이지로 배포되지 않는다", () => {
  const postsDir = path.join(process.cwd(), "content", "posts");
  const files = fs.readdirSync(postsDir).filter((f) => f.endsWith(".mdx") || f.endsWith(".md"));

  for (const filename of files) {
    const filePath = path.join(postsDir, filename);
    const { data } = matter(fs.readFileSync(filePath, "utf8"));
    const slug = filename.replace(/\.(mdx|md)$/, "");

    if (data.draft === true) {
      const generatedPage = path.join(process.cwd(), "out", "blog", slug, "index.html");
      assert.equal(
        fs.existsSync(generatedPage),
        false,
        `Draft 포스트(${slug})는 정적 페이지로 빌드되면 안 됩니다`,
      );
    }
  }
});

test("YouTube URL 및 !embed() 링크 카드 자동 변환이 정상 동작한다", async () => {
  // Built chunk import for markdown compiler
  const markdownModule = await import("../.svelte-kit/output/server/chunks/markdown.js");
  const compileMarkdown = markdownModule.compileMarkdown || markdownModule.t;

  const sampleMarkdown = `
# URL 변환 테스트

1. 일반 인라인 링크는 그대로 텍스트 링크로 유지:
[Google 홈페이지](https://google.com)

2. 독립된 줄의 YouTube URL은 자동으로 영상 플레이어로 임베드:
https://www.youtube.com/watch?v=dQw4w9WgXcQ

3. !embed() 문법은 리치 링크 카드로 임베드:
!embed(https://docs.temporal.io) "Temporal Docs" "오케스트레이션 엔진 문서"

4. 코드 블록 내부의 URL은 절대 변환되지 않아야 함:
\`\`\`bash
curl https://www.youtube.com/watch?v=dQw4w9WgXcQ
\`\`\`
`;

  const { html } = await compileMarkdown(sampleMarkdown);

  // 1. 일반 인라인 링크 검증
  assert.match(html, /<a href="https:\/\/google\.com">Google 홈페이지<\/a>/);

  // 2. YouTube 자동 임베드 검증
  assert.match(html, /youtube-nocookie\.com\/embed\/dQw4w9WgXcQ/);
  assert.match(html, /class="youtube-embed"/);

  // 3. !embed 카드 검증
  assert.match(html, /class="link-preview"[^>]*href="https:\/\/docs\.temporal\.io"/);
  assert.match(html, /Temporal Docs/);

  // 4. 코드 블록 보존 검증 (URL이 iframe으로 바뀌지 않고 코드로 유지됨)
  assert.ok(html.includes("https://www.youtube.com/watch?v=dQw4w9WgXcQ"));
  assert.ok(html.includes("<pre class=\"shiki"));
});

test("실시간 마크다운 컴파일 시 목차(TOC) 헤딩 계층 구조를 정확히 추출한다", async () => {
  const markdownModule = await import("../.svelte-kit/output/server/chunks/markdown.js");
  const compileMarkdown = markdownModule.compileMarkdown || markdownModule.t;

  const sampleMarkdown = `
# 메인 타이틀

## 첫 번째 주요 섹션 (H2)
내용 요약...

### 세부 서브 섹션 1 (H3)
세부 내용...

### 세부 서브 섹션 2 (H3)
세부 내용 2...

## 두 번째 주요 섹션 (H2)
마무리 내용...
`;

  const { headings } = await compileMarkdown(sampleMarkdown);

  assert.equal(headings.length, 4, "H2 및 H3 헤딩이 4개 추출되어야 합니다");
  assert.equal(headings[0].depth, 2);
  assert.equal(headings[0].text, "첫 번째 주요 섹션 (H2)");
  assert.equal(headings[1].depth, 3);
  assert.equal(headings[1].text, "세부 서브 섹션 1 (H3)");
  assert.equal(headings[2].depth, 3);
  assert.equal(headings[3].depth, 2);
});

test("글자 수 및 예상 읽기 시간(Reading Time) 계산 알고리즘이 올바르게 동작한다", () => {
  function calculateReadingMetrics(text) {
    const totalChars = text.length;
    const charsNoSpaces = text.replace(/\s/g, "").length;
    const koreanChars = (text.match(/[\uac00-\ud7a3]/g) || []).length;
    const latinWords = (text.match(/[a-zA-Z0-9_-]+/g) || []).length;
    const readMins = Math.max(1, Math.ceil(koreanChars / 450 + latinWords / 220));

    return { totalChars, charsNoSpaces, readMins };
  }

  const shortText = "간단한 글입니다.";
  const shortResult = calculateReadingMetrics(shortText);
  assert.equal(shortResult.readMins, 1, "짧은 글은 최소 1분이어야 합니다");
  assert.equal(shortResult.totalChars, 9);
  assert.equal(shortResult.charsNoSpaces, 8);

  const longText = "안녕하세요 ".repeat(300); // 1500 chars (600 korean chars)
  const longResult = calculateReadingMetrics(longText);
  assert.ok(longResult.readMins >= 2, "1500자 이상의 글은 2분 이상이어야 합니다");
});

test("포스트 고유 ID(UUID) 생성 및 한글/영문 슬러그 정규화가 정확히 동작한다", () => {
  function generatePostId() {
    const timestamp = Date.now().toString(36);
    const random = Math.random().toString(36).substring(2, 7);
    return `p_${timestamp}_${random}`;
  }

  function sanitizeSlug(slug) {
    return slug
      .toLowerCase()
      .trim()
      .replace(/[^\w\s가-힣-]/gu, "")
      .replace(/[\s_-]+/g, "-")
      .replace(/^-+|-+$/g, "");
  }

  // 1. UUID 포맷 및 고유성 검증
  const id1 = generatePostId();
  const id2 = generatePostId();
  assert.ok(id1.startsWith("p_"), "ID는 p_ 접두사로 시작해야 합니다");
  assert.notEqual(id1, id2, "연속 생성된 ID는 고유해야 합니다");

  // 2. 한글 슬러그 정규화 검증
  assert.equal(sanitizeSlug("좋은글이란.."), "좋은글이란");
  assert.equal(sanitizeSlug("  이사오기  테스트 !? "), "이사오기-테스트");
  assert.equal(sanitizeSlug("Go Mutex vs Atomic!"), "go-mutex-vs-atomic");
});




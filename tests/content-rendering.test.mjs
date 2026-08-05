import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

const outputPath = new URL(
  "../out/blog/temporal-openai-agents-durable-workflow/index.html",
  import.meta.url,
);

test("Temporal Agents 글의 대표 YouTube 영상과 MDX 요소를 정적으로 렌더링한다", async () => {
  const html = await readFile(outputPath, "utf8");
  const coverStart = html.indexOf(
    'class="article-cover article-video-cover"',
  );
  const articleBodyStart = html.indexOf('class="article-grid"');

  assert.notEqual(coverStart, -1, "대표 영상 커버가 없습니다");
  assert.ok(
    coverStart < articleBodyStart,
    "대표 영상은 본문보다 먼저 렌더링되어야 합니다",
  );
  assert.match(
    html,
    /youtube-nocookie\.com\/embed\/k8cnVCMYmNc/,
    "대표 YouTube iframe 주소가 올바르지 않습니다",
  );
  assert.match(html, /class="mermaid-diagram"/, "Mermaid가 렌더링되지 않았습니다");
  assert.match(
    html,
    /class="link-preview"[^>]*href="https:\/\/docs\.temporal\.io\/ai-cookbook\/openai-agents-sdk-python"/,
    "Temporal 공식 문서 링크 미리보기가 없습니다",
  );
  assert.match(
    html,
    /class="link-preview"[^>]*href="https:\/\/github\.com\/jaeyoung0509\/temporal-examples\/tree\/main\/react-agents"/,
    "예제 코드 링크 미리보기가 없습니다",
  );
});

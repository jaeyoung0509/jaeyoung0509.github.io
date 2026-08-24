import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

test("Temporal Agents 글의 대표 YouTube 영상과 MDX 요소를 정적으로 렌더링한다", async () => {
  const html = await readFile(
    new URL(
      "../out/blog/temporal-openai-agents-durable-workflow/index.html",
      import.meta.url,
    ),
    "utf8",
  );
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
  assert.match(html, /class="article-toc"/, "TOC가 렌더링되지 않았습니다");
});

test("Temporal 대출 신청 글의 다이어그램과 목차를 정적으로 렌더링한다", async () => {
  const html = await readFile(
    new URL(
      "../out/blog/temporal-loan-application-workflow/index.html",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    html,
    /서버가 재시작돼도 업무는 계속됩니다/,
    "포스트 제목이 올바르지 않습니다",
  );
  assert.match(html, /class="mermaid-diagram"/, "Mermaid 다이어그램이 없습니다");
  assert.match(html, /class="article-toc"/, "TOC가 렌더링되지 않았습니다");
  assert.match(html, /class="shiki/, "Shiki 코드 하이라이팅이 적용되지 않았습니다");
});

test("Go Mutex vs Atomic 벤치마크 글의 코드 및 벤치마크 결과를 정적으로 렌더링한다", async () => {
  const html = await readFile(
    new URL(
      "../out/blog/go-mutex-atomic-cache-coherence-benchmark/index.html",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    html,
    /Mutex는 왜 atomic보다 느릴까/,
    "포스트 제목이 올바르지 않습니다",
  );
  assert.match(
    html,
    /youtube-nocookie\.com\/embed\/tND-wBBZ8RY/,
    "인라인 YouTube 영상이 올바르게 렌더링되지 않았습니다",
  );
  assert.match(
    html,
    /BenchmarkAtomicPerWorkerPadded-8/,
    "실제 벤치마크 실행 결과가 렌더링되지 않았습니다",
  );
  assert.match(html, /class="article-toc"/, "TOC가 렌더링되지 않았습니다");
});

test("Makefile에서 Just로 이사오기 글의 다이어그램, 이미지, 코드 및 TOC를 정적으로 렌더링한다", async () => {
  const html = await readFile(
    new URL(
      "../out/blog/migrate-makefile-to-just/index.html",
      import.meta.url,
    ),
    "utf8",
  );

  assert.match(
    html,
    /Makefile에서 Just로 이사오기/,
    "포스트 제목이 올바르지 않습니다",
  );
  assert.match(html, /class="mermaid-diagram"/, "Mermaid 다이어그램이 없습니다");
  assert.match(html, /class="article-toc"/, "TOC가 렌더링되지 않았습니다");
  assert.match(html, /class="shiki/, "Shiki 코드 하이라이팅이 적용되지 않았습니다");
  assert.match(
    html,
    /src="\/images\/make-wikipedia\.png"/,
    "Make 위키피디아 이미지가 렌더링되지 않았습니다",
  );
  assert.match(
    html,
    /src="\/images\/just-casey-rodarmor-blog\.png"/,
    "Casey Rodarmor 블로그 이미지가 렌더링되지 않았습니다",
  );
});

test("About 페이지에 Hero, About Me, Selected Work(ZENITH 포함), Open Source, 언어 전환이 렌더링된다", async () => {
  const aboutHtml = await readFile(
    new URL("../out/about/index.html", import.meta.url),
    "utf8",
  );

  assert.match(aboutHtml, /이재영/, "작성자 이름이 없습니다");
  assert.match(
    aboutHtml,
    /복잡한 상태와 실패를 이해하고/,
    "Hero 핵심 태그라인이 없습니다",
  );
  assert.match(aboutHtml, /대한민국 서울/, "위치 정보가 없습니다");
  assert.match(aboutHtml, /class="lang-toggle-box"/, "언어 전환 버튼이 없습니다");
  assert.match(aboutHtml, /FinovusLab/, "경력 회사명이 없습니다");
  assert.match(aboutHtml, /2022\.04 – 2025\.11/, "경력 기간이 올바르지 않습니다");
  assert.match(
    aboutHtml,
    /문서에서 멈추지 않고 구현까지 따라갑니다/,
    "About Me 제목이 없습니다",
  );
  assert.match(
    aboutHtml,
    /class="work-showcase"/,
    "Selected Work 목록이 없습니다",
  );
  assert.match(aboutHtml, /PAYMONTHS/, "PAYMONTHS 케이스 스터디가 없습니다");
  assert.match(aboutHtml, /MOONBERG/, "MOONBERG 케이스 스터디가 없습니다");
  assert.match(aboutHtml, /ALEMBIC-DUMP/, "ALEMBIC-DUMP 케이스 스터디가 없습니다");
  assert.match(aboutHtml, /ZENITH/, "ZENITH 케이스 스터디가 없습니다");
  assert.match(
    aboutHtml,
    /Temporal Python SDK/,
    "Temporal 오픈소스 항목이 없습니다",
  );
  assert.match(aboutHtml, /PR #1741/, "Open Source PR #1741 링크가 없습니다");
  assert.match(aboutHtml, /Google Genkit/, "Genkit 오픈소스 항목이 없습니다");
  assert.match(
    aboutHtml,
    /genkit-ai\/genkit\/issues\/3748/,
    "Genkit 이슈 링크가 없습니다",
  );
  assert.match(
    aboutHtml,
    /genkit-ai\/genkit\/pull\/3813/,
    "Genkit PR 링크가 없습니다",
  );
  assert.match(
    aboutHtml,
    /class="oss-pr-links"[\s\S]*genkit-ai\/genkit\/issues\/3748[\s\S]*genkit-ai\/genkit\/pull\/3813/,
    "Genkit 이슈와 PR이 하나의 항목 아래 묶여 있지 않습니다",
  );
  assert.match(aboutHtml, /AWS Chalice/, "AWS Chalice 항목이 없습니다");
  assert.match(
    aboutHtml,
    /aws\/chalice\/issues\/2147/,
    "AWS Chalice 이슈 링크가 없습니다",
  );
  const ossNames = [...aboutHtml.matchAll(/class="oss-card-name">([^<]+)</g)].map(
    ([, name]) => name,
  );
  assert.deepEqual(
    ossNames.slice(0, 3),
    ["Temporal Python SDK", "Google Genkit", "AWS Chalice"],
    "Open Source 항목 순서가 contribution 무게에 맞지 않습니다",
  );
  assert.doesNotMatch(
    aboutHtml,
    /id="writing"/,
    "About 페이지에 Writing 섹션이 없어야 합니다",
  );
});

test("홈(기본 블로그) 및 블로그 아카이브 정적 페이지를 올바르게 렌더링한다", async () => {
  const homeHtml = await readFile(
    new URL("../out/index.html", import.meta.url),
    "utf8",
  );
  const blogHtml = await readFile(
    new URL("../out/blog/index.html", import.meta.url),
    "utf8",
  );

  for (const html of [homeHtml, blogHtml]) {
    assert.match(html, /jaeyoung lee/, "헤더 브랜드가 없습니다");
    assert.match(html, /class="post-row"/, "블로그 글 목록이 없습니다");
    assert.match(html, /class="search-field"/, "검색 필드가 없습니다");
    assert.match(html, /class="tag-filters"/, "태그 필터가 없습니다");
  }
});

test("RSS 피드, 사이트맵, robots.txt, 404 페이지가 올바르게 생성된다", async () => {
  const feedXml = await readFile(
    new URL("../out/feed.xml", import.meta.url),
    "utf8",
  );
  const sitemapXml = await readFile(
    new URL("../out/sitemap.xml", import.meta.url),
    "utf8",
  );
  const robotsTxt = await readFile(
    new URL("../out/robots.txt", import.meta.url),
    "utf8",
  );
  const notFoundHtml = await readFile(
    new URL("../out/404.html", import.meta.url),
    "utf8",
  );

  assert.match(feedXml, /<rss version="2.0">/, "RSS 피드 XML 형식이 올바르지 않습니다");
  assert.match(feedXml, /<title>jaeyoung0509<\/title>/, "RSS 피드 제목이 올바르지 않습니다");

  assert.match(sitemapXml, /<urlset xmlns="http:\/\/www.sitemaps.org\/schemas\/sitemap\/0.9">/, "Sitemap XML 형식이 올바르지 않습니다");
  assert.match(sitemapXml, /https:\/\/jaeyoung0509.github.io\/blog\/go-mutex-atomic-cache-coherence-benchmark\//, "Sitemap에 포스트 URL이 없습니다");
  assert.match(sitemapXml, /https:\/\/jaeyoung0509.github.io\/about\//, "Sitemap에 about URL이 없습니다");

  assert.match(robotsTxt, /User-agent: \*/, "robots.txt 내용이 올바르지 않습니다");
  assert.match(robotsTxt, /Sitemap: https:\/\/jaeyoung0509.github.io\/sitemap.xml/, "robots.txt sitemap 설정이 없습니다");

  assert.match(
    notFoundHtml,
    /__sveltekit/,
    "404 SPA fallback 페이지가 올바르지 않습니다",
  );
  assert.match(
    notFoundHtml,
    /\/_app\/immutable\/entry\/start\./,
    "404 페이지에 SvelteKit 번들이 로드되지 않았습니다",
  );
});

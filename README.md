# jaeyoung0509

한국어를 기본으로 운영하는 Next.js App Router 기반 MDX 기술 블로그입니다.

## Commands

```sh
npm install
npm run dev
npm run lint
npm run build
```

정적 배포 결과는 `out/`에 생성됩니다.

## Writing

글은 `content/posts/*.mdx`에 추가합니다.

```yaml
---
title: "글 제목"
description: "검색 결과와 공유 카드에 사용할 설명"
publishedAt: "2026-07-30"
updatedAt: "2026-07-31"
tags: ["Backend", "AWS"]
locale: "ko"
featured: false
draft: false
cover: "/images/cover.jpg"
coverAlt: "이미지 설명"
---
```

`draft: true`인 글은 목록, sitemap, RSS와 정적 경로에서 제외됩니다.

## Giscus comments

1. GitHub 저장소의 `Settings > Features > Discussions`를 활성화합니다.
2. 댓글 전용 Discussion category를 생성합니다.
3. [Giscus GitHub App](https://github.com/apps/giscus)을 저장소에 설치합니다.
4. [giscus.app](https://giscus.app/ko)에서 생성한 값을 `.env.local`에 넣습니다.

```sh
NEXT_PUBLIC_GISCUS_REPO=owner/repository
NEXT_PUBLIC_GISCUS_REPO_ID=...
NEXT_PUBLIC_GISCUS_CATEGORY=Comments
NEXT_PUBLIC_GISCUS_CATEGORY_ID=...
```

설정값이 없으면 댓글 영역은 렌더링하지 않습니다. GitHub Pages 배포에서는
같은 이름의 Repository Variables를 등록하면 workflow가 값을 전달합니다.

## Deployment

`.github/workflows/deploy.yml`이 `main` push 시 정적 export를 GitHub Pages에
배포합니다. Pages의 Source는 `GitHub Actions`로 설정합니다.

<script lang="ts">
  import { ArrowLeft, CalendarDays, Clock3 } from "lucide-svelte";
  import ArticleToc from "$components/ArticleToc.svelte";
  import CodeCopyEnhancer from "$components/CodeCopyEnhancer.svelte";
  import MermaidHandler from "$components/MermaidHandler.svelte";
  import GiscusComments from "$components/GiscusComments.svelte";
  import { formatDate } from "$lib/post-shared";
  import { siteConfig } from "$lib/site";
  import type { PageData } from "./$types";

  let { data }: { data: PageData } = $props();
  const post = $derived(data.post);

  const image = $derived(
    post.coverYoutubeId
      ? `https://i.ytimg.com/vi/${post.coverYoutubeId}/hqdefault.jpg`
      : post.cover ?? "/images/editorial-backend-desk.jpg",
  );

  const jsonLd = $derived(
    JSON.stringify({
      "@context": "https://schema.org",
      "@type": "BlogPosting",
      headline: post.title,
      description: post.description,
      datePublished: new Date(post.publishedAt).toISOString(),
      dateModified: new Date(
        post.updatedAt ?? post.publishedAt,
      ).toISOString(),
      inLanguage: "ko-KR",
      author: {
        "@type": "Person",
        name: siteConfig.author.name,
        url: siteConfig.author.github,
      },
      image: new URL(image, siteConfig.url).toString(),
      mainEntityOfPage: `${siteConfig.url}/blog/${post.slug}/`,
    }),
  );
</script>

<svelte:head>
  <title>{post.title} | {siteConfig.name}</title>
  <meta name="description" content={post.description} />
  <link rel="canonical" href={`${siteConfig.url}/blog/${post.slug}/`} />
  <meta property="og:type" content="article" />
  <meta property="og:locale" content="ko_KR" />
  <meta property="og:url" content={`${siteConfig.url}/blog/${post.slug}/`} />
  <meta property="og:title" content={post.title} />
  <meta property="og:description" content={post.description} />
  <meta
    property="article:published_time"
    content={new Date(post.publishedAt).toISOString()}
  />
  {#if post.updatedAt}
    <meta
      property="article:modified_time"
      content={new Date(post.updatedAt).toISOString()}
    />
  {/if}
  {#each post.tags as tag (tag)}
    <meta property="article:tag" content={tag} />
  {/each}
  <meta property="og:image" content={image} />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={post.title} />
  <meta name="twitter:description" content={post.description} />
  <meta name="twitter:image" content={image} />
  {#if jsonLd}
    <script type="application/ld+json">
      {@html jsonLd}
    </script>
  {/if}
</svelte:head>

<article>
  <header class="article-header">
    <div class="article-header-inner">
      <a class="back-link" href="/blog/">
        <ArrowLeft size={15} /> 전체 글
      </a>
      <h1>{post.title}</h1>
      <p class="description">{post.description}</p>
      <div class="article-meta">
        <span>
          <CalendarDays size={15} />
          {formatDate(post.publishedAt)}
        </span>
        <span>
          <Clock3 size={15} />
          {post.readingMinutes}분 읽기
        </span>
        {#if post.updatedAt}
          <span>수정 {formatDate(post.updatedAt)}</span>
        {/if}
      </div>
      <ul class="tag-list">
        {#each post.tags as tag (tag)}
          <li class="tag">{tag}</li>
        {/each}
      </ul>
    </div>
  </header>

  {#if post.coverYoutubeId}
    <div class="article-cover article-video-cover">
      <figure class="youtube-embed">
        <div class="youtube-embed-frame">
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${post.coverYoutubeId}`}
            title={post.coverYoutubeTitle ?? post.title}
            loading="lazy"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            referrerpolicy="strict-origin-when-cross-origin"
            allowfullscreen
          ></iframe>
        </div>
      </figure>
    </div>
  {:else if post.cover}
    <figure class="article-cover">
      <img
        src={post.cover}
        alt={post.coverAlt ?? post.title}
        width="1800"
        height="1029"
        loading="eager"
        decoding="async"
      />
      {#if post.coverAlt}
        <figcaption>{post.coverAlt}</figcaption>
      {/if}
    </figure>
  {/if}

  <div class="article-grid">
    {#if post.headings.length > 0}
      <ArticleToc headings={post.headings} />
    {/if}
    <div class="prose">
      {@html post.html}
    </div>
  </div>
</article>

<CodeCopyEnhancer />
<MermaidHandler />
<GiscusComments />

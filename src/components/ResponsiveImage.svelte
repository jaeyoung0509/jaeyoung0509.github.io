<script lang="ts">
  import type { HTMLImgAttributes } from "svelte/elements";
  import images from "$lib/generated/post-images.json";

  let { src, alt, sizes = "100vw", ...attributes }: HTMLImgAttributes & { src: string; alt: string } = $props();
  const image = $derived((images as Record<string, { width: number; height: number; srcset: string }>)[src]);
</script>

<picture>
  {#if image}
    <source type="image/webp" srcset={image.srcset} {sizes} />
  {/if}
  <img {src} {alt} {...attributes} />
</picture>

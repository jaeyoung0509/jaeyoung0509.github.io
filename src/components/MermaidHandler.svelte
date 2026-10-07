<script lang="ts">
  import { tick } from "svelte";
  import { observeMermaid } from "$lib/mermaid";
  let { root }: { root?: HTMLElement | null } = $props();

  $effect(() => {
    const scope = root;
    let disposed = false;
    let cleanup: (() => void) | undefined;
    tick().then(() => {
      if (!disposed) cleanup = observeMermaid(scope ?? document.querySelector<HTMLElement>(".portfolio-container") ?? document.body);
    });
    return () => { disposed = true; cleanup?.(); };
  });
</script>

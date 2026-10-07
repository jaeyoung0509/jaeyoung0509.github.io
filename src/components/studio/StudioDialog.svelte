<script lang="ts">
  import type { Snippet } from "svelte";
  let { open = $bindable(false), label, children, onDismiss }: {
    open: boolean; label: string; children: Snippet; onDismiss?: () => void;
  } = $props();
  let dialog = $state<HTMLDialogElement | null>(null);
  function dismiss() { open = false; onDismiss?.(); }
  $effect(() => {
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  });
</script>

<dialog bind:this={dialog} aria-label={label}
  oncancel={(event) => { event.preventDefault(); dismiss(); }}
  onclose={() => { if (open) dismiss(); }}
  onclick={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
  {#if open}{@render children()}{/if}
</dialog>

<style>
  dialog {
    padding: 0; border: 0; overflow: visible;
    width: fit-content; max-width: calc(100% - 32px); max-height: calc(100dvh - 32px);
    background: transparent; color: var(--ink);
  }
  dialog::backdrop { background: color-mix(in srgb, var(--ink) 45%, transparent); }
</style>

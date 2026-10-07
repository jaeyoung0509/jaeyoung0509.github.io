<script lang="ts">
  import { tick } from "svelte";
  let { root, contentKey }: { root: HTMLElement | null; contentKey: string } = $props();

  $effect(() => {
    const scope = root;
    void contentKey;
    let disposed = false;
    const buttons: HTMLButtonElement[] = [];
    // Timer handles do not participate in rendering.
    // eslint-disable-next-line svelte/prefer-svelte-reactivity
    const timers = new Set<ReturnType<typeof setTimeout>>();
    tick().then(() => {
      if (!scope || disposed) return;
      for (const block of scope.querySelectorAll<HTMLElement>("pre")) {
        if (block.querySelector(".copy-code")) continue;
        const button = document.createElement("button");
        button.className = "copy-code";
        button.type = "button";
        button.textContent = "복사";
        button.setAttribute("aria-label", "코드 복사");
        button.setAttribute("aria-live", "polite");
        button.onclick = async () => {
          button.disabled = true;
          try {
            await navigator.clipboard.writeText(block.querySelector("code")?.textContent ?? "");
            if (!disposed) button.textContent = "복사됨";
          } catch {
            if (!disposed) button.textContent = "다시 시도";
          } finally {
            if (!disposed) {
              button.disabled = false;
              const timer = setTimeout(() => { button.textContent = "복사"; timers.delete(timer); }, 1800);
              timers.add(timer);
            }
          }
        };
        block.append(button);
        buttons.push(button);
      }
    });
    return () => {
      disposed = true;
      timers.forEach(clearTimeout);
      buttons.forEach(button => button.remove());
    };
  });
</script>

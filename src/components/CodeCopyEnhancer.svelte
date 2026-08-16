<script lang="ts">
  $effect(() => {
    if (typeof window === "undefined") return;

    const blocks = document.querySelectorAll<HTMLElement>(".prose pre");

    blocks.forEach((block) => {
      if (block.querySelector(".copy-code")) return;

      const button = document.createElement("button");
      button.className = "copy-code";
      button.type = "button";
      button.textContent = "Copy";
      button.setAttribute("aria-label", "Copy code");

      button.addEventListener("click", async () => {
        const code = block.querySelector("code")?.textContent ?? "";
        await navigator.clipboard.writeText(code);
        button.textContent = "Copied";
        window.setTimeout(() => {
          button.textContent = "Copy";
        }, 1600);
      });

      block.append(button);
    });
  });
</script>

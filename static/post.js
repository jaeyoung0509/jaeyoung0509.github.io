document.addEventListener("DOMContentLoaded", () => {
    // --- 1. Table of Contents (ToC) ---
    const tocContainer = document.getElementById("toc");
    const prose = document.querySelector(".prose");

    if (tocContainer && prose) {
        const headings = prose.querySelectorAll("h2, h3");
        if (headings.length > 0) {
            const tocList = document.createElement("ul");
            tocList.className = "flex flex-col gap-2";

            headings.forEach(heading => {
                // Ensure heading has an id
                if (!heading.id) {
                    heading.id = heading.textContent.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-');
                }

                const link = document.createElement("a");
                link.href = "#" + heading.id;
                link.textContent = heading.textContent;
                link.className = "hover:text-brand-text transition-colors duration-200 block";
                
                // Indent h3
                if (heading.tagName.toLowerCase() === "h3") {
                    link.className += " ml-4 text-xs";
                }

                const li = document.createElement("li");
                li.appendChild(link);
                tocList.appendChild(li);
            });

            tocContainer.appendChild(tocList);

            // Intersection Observer for highlighting active ToC item
            const observerOptions = {
                root: null,
                rootMargin: "0px 0px -80% 0px", // Trigger when heading is near top
                threshold: 1.0
            };

            let activeId = "";
            const observer = new IntersectionObserver(entries => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        activeId = entry.target.id;
                        updateTocActiveState(activeId);
                    }
                });
            }, observerOptions);

            headings.forEach(h => observer.observe(h));

            function updateTocActiveState(id) {
                const links = tocContainer.querySelectorAll("a");
                links.forEach(link => {
                    if (link.getAttribute("href") === "#" + id) {
                        link.classList.add("text-brand-accent", "font-medium");
                        link.classList.remove("text-brand-sub");
                    } else {
                        link.classList.remove("text-brand-accent", "font-medium");
                        link.classList.add("text-brand-sub");
                    }
                });
            }
        } else {
            // Hide the aside if no headings
            const aside = tocContainer.closest("aside");
            if (aside) aside.style.display = "none";
        }
    }

    // --- 2. Code Block Mac-style Header & Copy Button ---
    const codeBlocks = document.querySelectorAll(".prose pre");
    codeBlocks.forEach(block => {
        // Ensure relative positioning on the pre block for absolute button
        if (getComputedStyle(block).position === "static") {
            block.style.position = "relative";
        }
        
        // Remove padding from pre to use header, add to code instead
        block.style.padding = "0";
        block.style.overflow = "hidden"; // Clip rounded corners if needed

        const codeEl = block.querySelector("code");
        let lang = "";
        
        if (codeEl) {
            codeEl.style.display = "block";
            codeEl.style.padding = "1rem";
            codeEl.style.overflowX = "auto";
            
            // Extract language
            codeEl.classList.forEach(cls => {
                if (cls.startsWith("language-")) {
                    lang = cls.replace("language-", "");
                }
            });
        }

        // Create Mac-style header
        const header = document.createElement("div");
        header.className = "flex items-center justify-between px-4 py-2 border-b border-white/10 bg-black/20";
        
        const dots = document.createElement("div");
        dots.className = "flex gap-1.5";
        dots.innerHTML = `
            <div class="w-3 h-3 rounded-full bg-[#FF5F56]"></div>
            <div class="w-3 h-3 rounded-full bg-[#FFBD2E]"></div>
            <div class="w-3 h-3 rounded-full bg-[#27C93F]"></div>
        `;
        
        const rightContainer = document.createElement("div");
        rightContainer.className = "flex items-center gap-3";

        if (lang) {
            const langLabel = document.createElement("span");
            langLabel.textContent = lang.toUpperCase();
            langLabel.className = "text-[11px] font-semibold text-white/40 tracking-wider";
            rightContainer.appendChild(langLabel);
        }

        const copyBtn = document.createElement("button");
        copyBtn.textContent = "Copy";
        copyBtn.className = "bg-white/10 text-white/70 text-xs px-2 py-0.5 rounded opacity-0 transition-all duration-200 hover:bg-white/20 hover:text-white focus:outline-none backdrop-blur-sm border border-white/10";
        
        // Show on hover
        block.addEventListener("mouseenter", () => copyBtn.classList.remove("opacity-0"));
        block.addEventListener("mouseleave", () => copyBtn.classList.add("opacity-0"));

        copyBtn.addEventListener("click", () => {
            if (!codeEl) return;
            const textToCopy = codeEl.innerText;
            navigator.clipboard.writeText(textToCopy).then(() => {
                const originalText = copyBtn.textContent;
                copyBtn.textContent = "Copied!";
                copyBtn.classList.add("!bg-green-500/20", "!text-green-400", "!border-green-500/30");
                
                setTimeout(() => {
                    copyBtn.textContent = originalText;
                    copyBtn.classList.remove("!bg-green-500/20", "!text-green-400", "!border-green-500/30");
                }, 2000);
            });
        });

        rightContainer.appendChild(copyBtn);
        header.appendChild(dots);
        header.appendChild(rightContainer);
        block.insertBefore(header, block.firstChild);
    });

    // --- 3. Medium Zoom for Images ---
    if (typeof mediumZoom !== 'undefined') {
        mediumZoom('.prose img', {
            margin: 24,
            background: '#FAF9F6',
        });
    }
});

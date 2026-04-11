---
title: "5 Lessons Learned After Burning $1,000 on LLM Coding Agents"
date: 2025-12-09T21:00:00Z
description: "The five rules I ended up with after spending too much money on AI coding agents."
tags: [coding-agent, llm, dev-productivity]
draft: false
---

Cursor, Claude Code, Codex, Ollama Cloud...
I get pulled into new tools embarrassingly easily, what we call being "thin-eared" in Korean, so I have tried just about every coding agent that got popular.
If I add up the receipts, I have probably spent around **$1,000** on this ecosystem.

And yes, I got real value out of it.

- When I had to build an internal backoffice as a backend and cloud engineer, LLMs helped me get through the frontend work without getting stuck.
- When I worked on Excel generation features where exact cell placement mattered, they helped me finish much faster than I expected.

But once I started relaxing my own rules, I also started collecting more nights where I was still in the chair until dawn.
Code I skimmed with, *"It probably did this right,"* in mind quietly piled up, then blew up all at once. And when that happens, the responsibility is still mine.

This post is mostly a memo to myself. If you are walking a similar path, maybe it will save you a few painful nights too.

---

## 1. Break Issues Down. Then Break Them Down Further.

Models like Gemini 3 Pro now come with **context windows up to 1M tokens**.
That naturally makes you think:

> "Let's just dump the whole codebase and the requirements in once and finish this in one shot."

In practice, that turned out to be a very reliable way to make a mess.

- If you mix requirements, design, implementation, refactoring, and bug fixes in one chat, it gets very hard to trace **why a decision was made** later.
- When you come back wondering, "Why is the code like this?", all you get is an endless scroll.
- When the review surface gets too large, you start telling yourself, "I'll test and review it all at once later," and that usually means you never do.

So now I split work much more aggressively:

- **Chat 1:** Design only.
- **Chat 2:** Implement **one core endpoint** based on that design.
- **Chat 3:** Write **tests** for that endpoint only.

**Why this works:**
1. I can actually follow the context of the conversation.
2. I can make review and testing a required step for each stage.
3. If something goes wrong later, it is much easier to see which layer went wrong.

Just because the context window gets bigger, **does not mean human working memory gets bigger too.**

Chasing the "wow, it worked in one shot" moment was a bad trade. Working in **units I can fully understand and own** has been much safer.

---

## 2. The Moment I Pretend to Know When I Don't, It Gets Dangerous

Honestly, models now feel **smarter than me in a lot of areas**.

They bring in library combinations or patterns I have never used before, and sometimes they produce code that makes me think, *"Wait, you can do that?"*
The problem starts right after that.

- "Maybe it really does know better than me."
- "With output like this, maybe I can just trust it."
- "Maybe I do not need to understand every line."

That is the exact moment I slip into **"I do not really get this, but I will act like I do"** mode.

**And if there is an outage?**
- Customers, the company, and coworkers only see the person who merged it.
- "The LLM wrote it, so I do not know" is not an excuse.
- The responsibility **comes back to me every time**.

So I keep repeating the same rule to myself:
- **Balance convenience with responsibility.**
- If I do not understand something, admit that and ask:
  - "Why did you choose this pattern?"
  - "Walk me through this step by step as if we were debugging it."
  - "Refactor this into a simpler version I can understand at a glance."

AI code generation absolutely helps with productivity, but vague requirements and shallow understanding still turn into **bugs and security problems**.

> "Just because the model looks smarter than me does not mean it takes responsibility for me."

The moment I forget that, the LLM stops being a tool and starts becoming a liability.

---

## 3. Sometimes I Don't Even Know What I'm Doing, So I Organize My Thoughts First

In the middle of a project, I often hit moments like:
- "Why am I designing this backoffice this way?"
- "Does the user actually need this feature?"
- "I do not even know where this task really ends."

If I throw a coding agent at the problem in that state, it usually **amplifies the confusion**.

So now I separate **thinking models** from **coding agents**.

**My workflow:**
- **Gemini 3 Pro + Antigravity (thinking)**
  - Good for messy ideas, overall structure, design, turning notes into PRDs, and code review.
  - I throw in scattered notes and requirements, then ask it to organize them into something I can actually work from.
- **Coding agents (execution)**
  - Only after the design or PRD is clear do I hand off the implementation of a specific endpoint or feature.

**Sequence:**
1. Confused thoughts and rough requirements, let an LLM organize them first.
2. Once a PRD or design exists, ask the coding agent for actual code.

As models get stronger, the time spent deciding **what to ask for** matters more, not less.

---

## 4. Humans and LLMs Both Make Mistakes, So Prompting and Verification Still Matter

No matter how capable the models get, they still **make mistakes, just like people do**.

- They still bring up outdated syntax from time to time.
  - Example: using `from typing import List` instead of `list`, or reaching for deprecated APIs.
- They also pull in legacy code and old examples, including the **anti-patterns** buried inside them.

The risk gets higher once **agents and tools** enter the picture.
- In setups like MCP or Antigravity, the AI is no longer just suggesting code, it can **run commands directly**.
- One bad command can do real damage. There are already cases where automated execution modes wiped out a developer's drive.

**My principles:**

1. **Prompting still matters.**
   - "Write this against the latest Python version."
   - "Use `list[int]` style instead of the older generic syntax when possible."
   - "Follow the existing code style in this project."
2. **I execute critical commands myself.**
   - I do not let agents auto-run `rm`, `DROP TABLE`, or expensive batch jobs.
   - Agents can suggest commands, but I keep the rule that **I press Enter myself**.
3. **Use tools, but do not trust them blindly.**
   - Even when I load the full codebase into context or use MCP for live data, I still double-check whether the tool actually did what I meant.

As models improve, the temptation to skip verification gets stronger. Resisting that temptation is still the human part of the job.

---

## 5. LLMs Are Better at Fresh Generation Than Massive Refactoring

Once you get used to LLMs, it is very tempting to say:

> "Refactor this whole repo into a new pattern."

Modern models can sometimes pull that off.
The real question is different: **can the human reviewing it keep up?**

- When many files change at once:
  - Context gets dropped.
  - Some files keep old assumptions.
  - Things look clean on the surface, but the internal logic often stops lining up.
- Huge changes are miserable to review. You end up merging with a vague "looks fine" feeling, then pay for it later.

**My approach:**
- LLMs are better at **small, new tasks** than at **sweeping repo-wide rewrites**.
- So I break work into smaller units:
  - One service
  - One endpoint
  - One test file
- Reviewing and testing those small units thoroughly is much better for my sanity.

At this point, I think the real strength of LLMs is this:
> Not "a perfect result in one shot,"
> But "several fast drafts that a human can choose from and reshape."

---

## Bonus: My Current LLM Setup (Late 2025)

I move between tools pretty often, so this setup will probably change. Still, this is what I was actually paying for and using in late 2025.

### Paid Subscriptions
- **ChatGPT Plus (~$20/mo):**
  - **Role:** Knowledge partner, language tutor.
  - I use it for reading docs, preparing interview questions, and cleaning up English phrasing.
- **Google AI One / Pro (~$20/mo range):**
  - Includes the Gemini app, NotebookLM, and media generation.
  - This is my main way into **Gemini 3 Pro**, usually alongside tools like Antigravity.

### IDE / Agent Environment
- **Antigravity (IDE):**
  - Google subscriptions like Pro or Ultra open up higher rate limits.
  - **Feel:** I rarely feel quota anxiety there. It is good for batching search, edit, and refactor requests against a local codebase.
  - **Caution:** It is powerful, so I am careful with auto-command execution.
- **Codex Family (ChatGPT / GPT Agents):**
  - Strong at **deterministic and detail-heavy tasks**.
  - Especially helpful for Excel generation or spreadsheet formatting jobs where details have to land in exact cells.
- **Gemini 3 Pro (via Antigravity):**
  - Best for **emergent work**, design, structural understanding, and code review.
  - It is usually my first pick when I need to turn scattered ideas into a PRD.
- **Claude 4.5 Family (via Antigravity):**
  - A good speed, cost, and performance balance for standard work like refactoring, docs, and straightforward code generation.
  - It feels like the helper I can reach for without overthinking it.

### ChatGPT Plus Position
- It is more of a **thinking partner** than just a coding tool for me.
- I use it when learning new tech, refining blog drafts, or talking through architecture tradeoffs.
- It often helps me clarify my own thinking more than it writes production code.

---

## Conclusion

It took burning $1,000 for these to really sink in:

1. **Split the work into smaller chunks.** Design, implement, test.
2. **Pretending to understand what you do not understand will come back to bite you.**
3. **Organize your thoughts first.** PRD first, code second.
4. **Everyone makes mistakes.** Prompt carefully, verify carefully.
5. **Small, fresh work beats giant refactors.**

LLM agents absolutely let me build **more, faster**.
But that only works if I hold myself to **stricter standards**.

> Even if there is an outage or a PR gets reverted,
> **the responsibility still sits with the human.**

That part is not changing, so I will probably keep burning money on coding agents while updating my rules as I go.

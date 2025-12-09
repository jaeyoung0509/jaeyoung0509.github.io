---
title: "5 Lessons Learned After Burning $1,000 on LLM Coding Agents"
date: 2025-12-09T21:00:00Z
description: "Five principles I established to maintain code quality and sanity while using AI coding assistants."
tags: [coding-agent, llm, dev-productivity]
draft: false
---

# 5 Principles Learned After Burning $1,000 on LLM Coding Agents

Cursor, Claude Code, Codex, Ollama Cloud…
I'm confusingly easily tempted by new tech trends ("thin ears," as we say in Korea), so I've tried almost every popular coding agent out there.
If I gather all my payment receipts, I've probably burned through about **$1,000** in this ecosystem.

The result? **It's true that I benefited significantly.**

- When I had to build an in-house backoffice as a backend/cloud engineer, I was able to push through the frontend work with the help of LLMs.
- For complex Excel generation features where cell positioning is critical, the code generation accuracy of LLMs helped me finish much faster than expected.

However, as I started breaking my own rules one by one, the number of days I spent **"stuck to my chair until dawn"** noticeably increased.
Codes that I skimmed over, thinking *"Eh, it probably wrote it well,"* started rolling like a snowball, eventually exploding all at once. And the responsibility was 100% mine.

This post is a memo to remind myself of the **five principles** I organized during that process, and a small warning to others walking a similar path.

---

## 1. Break Issues Down. Then Break Them Down Further.

Nowadays, models like Gemini 3 Pro are long-distance runners with **context windows up to 1M tokens**.
Naturally, you might think:

> "Let's just dump the entire codebase and requirements and finish this in one shot."

But this turned out to be the **perfect recipe for disaster** (or as we say, "the ship goes to the mountain").

- If you cram requirements, design, implementation, refactoring, and bug fixes into a single chat, you can't trace **why a decision was made** later.
- When you look back at the conversation thinking, "Why is the code like this?", you only face a scrolling hell.
- When there's too much to review, you naturally start thinking, "I'll test/review it all at once later..." and eventually, you don't.

So now, I deliberately split tasks like this:

- **Chat 1:** Design only.
- **Chat 2:** Implement **one core endpoint** based on that design.
- **Chat 3:** Write **test codes** for that endpoint only.

**Why this works:**
1. I can fully follow the context of the conversation.
2. I can enforce "Review & Test" as a mandatory step for each stage.
3. If a problem occurs later, it's much easier to pinpoint which layer went wrong.

Just because the context window gets bigger, **doesn't mean the human working memory gets bigger.**

Instead of aiming for a "Wow, it worked in one shot!" moment by throwing in complex tasks, it was much safer to work in **units that I could fully take responsibility for**.

---

## 2. The Moment I Pretend to Know When I Don't, It Gets Dangerous

Honestly, models these days feel **much smarter than me in many areas**.

They bring in library combinations or patterns I've never used, sometimes generating code that makes me think, *"Wait, this is possible?"*
The problem starts right after that.

- "Wow... doesn't it know better than me?"
- "With this quality, I can probably just trust it, right?"
- "Maybe I don't need to understand every single line..."

The moment I think this, I enter the **"I don't really know, but I'll pretend I do"** mode.

**But what if an outage happens?**
- Customers, the company, and colleagues only see "the person who merged this."
- "The LLM wrote it, so I don't know" is not an excuse.
- The responsibility **always returns to me**.

So I constantly tell myself:
- **Balance convenience with responsibility.**
- If I don't understand, admit "I don't know" and ask:
  - "Explain why you chose this pattern."
  - "Explain this step-by-step as if I'm debugging it."
  - "Refactor this into a simpler version that I can understand at a glance."

Studies show that while AI code generation boosts productivity, vague requirements or lack of understanding can lead to increased **bugs and security issues**.

> "Just because the model looks smarter than me doesn't mean it takes responsibility for me."

The moment I forget this, the LLM stops being a tool and becomes a risk.

---

## 3. Sometimes I Don't Even Know What I'm Doing (Organize Thoughts First)

Working on projects, I often hit moments like:
- "Why am I designing the backoffice this way?"
- "Is this actually a feature the user needs?"
- "I don't even know where this current task ends..."

If I run a coding agent in this state, it usually **amplifies the confusion**.

So these days, I separate **"Thinking LLMs"** from **"Coding Agents"**.

**My workflow:**
- **Gemini 3 Pro + Antigravity (Thinking)**
  - Great for emergent ideas, overall structure, design, extracting PRDs, and code reviews.
  - I throw in scattered memos and requirements and ask, *"Organize this into a PRD format."*
- **Coding Agents (Execution)**
  - Only after the Design/PRD is set, I entrust the implementation of specific endpoints or features.

**Sequence:**
1. Confused thoughts & requirements → Let LLM "Organize Thoughts" first.
2. Only after a PRD/Design exists → Ask the Coding Agent for actual code.

As LLMs become more powerful, the **"time spent organizing what to order"** feels increasingly important.

---

## 4. Humans & LLMs Both Make Mistakes (Why Prompting & Verification Matter)

No matter how good the models get, they eventually **make mistakes, just like humans**.

- They still occasionally bring up outdated syntax.
  - Example: Using `from typing import List` (old style) instead of `list`, or using deprecated APIs.
- They sometimes reference legacy code or old examples, bringing along **anti-patterns** embedded in them.

Risks increase when **Agents/Tools** are involved.
- In environments like MCP or Antigravity, the AI becomes an entity that **directly executes commands**.
- A wrong command can cause significant damage. (There are cases where automated execution modes wiped out a developer's drive).

**My Principles:**

1. **Prompting Still Matters.**
   - "Write based on the latest Python version."
   - "Use `list[int]` style instead of old generic syntax where possible."
   - "Follow the existing code style of this project."
2. **Execute Critical Commands Myself.**
   - I never let agents automatically execute `rm`, `DROP TABLE`, or expensive batch jobs.
   - I allow agents to **propose** commands, but I stick to the rule that **I press the Enter key**.
3. **rust Tools, But Don't Blindly Faith.**
   - Even if I put the whole codebase in context or read real-time info via MCP, I always double-check: *"Did this tool work exactly as I intended?"*

As models improve, the **temptation to skip verification** grows. Overcoming that temptation is ultimately the human's job.

---

## 5. LLMs Are Better at "New Generation" Than "Massive Refactoring"

Using LLMs, there's a strong temptation to say:

> "Refactor this entire repo structure into a new pattern."

Modern models can actually do this to some extent.
The problem is: **Can the human keep up with that change?**

- When multiple files change at once:
  - Some context is missed.
  - Some files remain with old premises.
  - It looks clean on the surface but often loses internal consistency.
- Massive changes are nightmares to review. You end up merging with a "Looks okay..." attitude and get hit by the aftermath later.

**My Approach:**
- LLMs are stronger at **creating small, fresh tasks** than **massive file/folder updates**.
- So I assign tasks in **small, broken-down units**:
  - One Service
  - One Endpoint
  - One Test File
- Thoroughly reviewing and testing these small units is much better for mental health.

I've come to feel that the true strength of LLMs is:
> Not "Perfect result in one shot,"
> But "Quickly creating multiple drafts for the human to choose and modify."

---

## Bonus: My Current LLM Setup (Late 2025)

I tend to move around tools like a nomad, so this might not be permanent. But here is my setup as of late 2025—what I actually pay for and how I use it.

### Paid Subscriptions
- **ChatGPT Plus (~$20/mo):**
  - **Role:** Knowledge Partner, Language Tutor.
  - Used for reading/understanding dev docs, creating interview questions, and correcting English phrasing.
- **Google AI One / Pro (~$20/mo range):**
  - Includes Gemini App, NotebookLM, media generation.
  - Main access to **Gemini 3 Pro**, used in combination with tools like Antigravity.

### IDE / Agent Environment
- **Antigravity (IDE):**
  - Google subscriptions (Pro/Ultra) open up higher rate limits.
  - **Feel:** I rarely feel "quota anxiety" while coding. Great for batching Search + Edit + Refactor requests with local codebase context.
  - **Caution:** Powerful, so I am careful with the **auto-command execution mode**.
- **Codex Family (ChatGPT / GPT Agents):**
  - Strong at **deterministic and complex tasks**.
  - Huge help in Excel generation or strict spreadsheet formatting jobs ("Equation X in exact Cell Y").
- **Gemini 3 Pro (via Antigravity):**
  - Best for **emergent tasks**, design, structural understanding, and code review.
  - My go-to for structuring scattered ideas into PRDs.
- **Claude 4.5 Family (via Antigravity):**
  - Good balance of speed/cost/performance for standard tasks (refactoring, docs, simple code gen).
  - The "helper I can use without overthinking" vibe.

### ChatGPT Plus Position
- It's my **"Thinking Partner"** rather than just a coder.
- Learning new tech, refining blog drafts, discussing architecture tradeoffs.
- It clarifies *me* more than it writes code.

---

## Conclusion

It took burning $1,000 to see these clearly:

1. **Split issues into smaller chunks.** (Design/Implement/Test).
2. **Pretending to know what you don't will haunt you.** (Convenience vs. Responsibility).
3. **Organize thoughts first.** (PRD first, Code second).
4. **Everyone mistakes.** (Prompt carefully, verify execution).
5. **generate Fresh > Massive Update.** (Small tasks + Thorough Review).

Thanks to LLM agents, I can definitely build **more things, faster**.
But that requires me to uphold **stronger principles and attitudes**.

> Even if an outage happens or a PR is reverted,
> **The responsibility always lies with the human.**

Keeping that in mind, I plan to happily keep burning money on coding agents while updating my principles.

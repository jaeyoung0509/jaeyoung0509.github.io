---
title: "How Coding-Agent Sessions Actually Work"
date: 2026-04-11T10:30:00Z
description: "Why I built work-bridge for cost-conscious multi-agent workflows, and what it takes to move resume state safely across Claude, Gemini, Codex, and OpenCode."
tags: [coding-agent, ai-agent, developer-tools, session-migration, mcp]
draft: false
---

# How Coding-Agent Sessions Actually Work

I did not build [`work-bridge`](https://github.com/jaeyoung0509/work-bridge) because vendor-neutral tooling sounded elegant on paper.

I built it because I kept doing something very practical: rotating between coding agents to manage cost.

That is how I actually use these tools.

- I might want one model for broad architecture or review.
- I might want a cheaper one for long editing passes.
- I might switch again because a quota, context limit, or pricing tradeoff changed.

For people who work this way, the annoying part is not choosing a model. The annoying part is paying the context-switch tax every time you move.

You lose the task state.
You lose the operational context.
You lose the exact instructions, skills, and MCP setup that made the previous session useful.

So the real motivation behind `work-bridge` was straightforward:

> I wanted a way for people like me, who actively mix multiple LLM tools because of cost and capability tradeoffs, to switch without restarting the task from scratch.

When people first hear about `work-bridge`, they usually imagine a simpler problem:

> "If I can copy a chat transcript from one coding agent to another, shouldn't resume just work?"

That assumption breaks almost immediately in practice.

If you have spent real time with tools like Claude Code, Gemini CLI, Codex CLI, or OpenCode, you already know the pattern:

- One tool is cheaper this week.
- Another has the model you want for architecture work.
- A third is better at deterministic editing or review.
- You want to switch without paying the full cost of rebuilding context every time.

The problem is that a session is not just a chat log.

It is local runtime state tied to a machine, a project path, a storage format, and often a tool-specific resume/index mechanism.

That is the problem space that pushed me to build [`work-bridge`](https://github.com/jaeyoung0509/work-bridge): a local-first handoff tool for moving useful coding-agent context across Claude Code, Gemini CLI, Codex CLI, and OpenCode.

This post is a technical write-up of what I learned while reverse-engineering those session models and designing a safer handoff pipeline.

## A session is not a transcript

The easiest mistake is to think of a session as:

```text
user messages + assistant replies
```

In reality, the useful state usually looks more like this:

```text
source tool state
  |- conversation history
  |- tool calls and tool results
  |- project identity binding
  |- absolute paths embedded in text/output
  |- instruction context
  |- project-scoped skills
  |- MCP configuration
  |- resume indexes / registries / caches
  `- tool-specific metadata
```

Once you see the state this way, a lot of weird behavior suddenly makes sense.

Why does a copied session file sometimes not show up in `resume`?
Why does a migrated session still mention the old machine path?
Why does the target tool "resume" but lose instructions, skills, or MCP servers?

Because the handoff failed at one of those layers.

## What I mean by "Verified" vs "Inference"

This post mixes public behavior, local inspection, and architectural interpretation, so I want to separate those cleanly.

**Verified**

- Confirmed from the current public `work-bridge` README and command surface.
- Confirmed by inspecting local session artifacts or migration notes.
- Confirmed by actual managed output patterns such as `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `.work-bridge/<target>/skills/`, and `.work-bridge/<target>/mcp.json`.

**Inference**

- My explanation of why a tool likely chose a certain storage model.
- Design principles that are implied by the behavior, but not always stated by the tool itself.
- Generalized architecture conclusions from building cross-tool migration around those formats.

I am intentionally keeping that line visible because session internals are the kind of topic where people tend to overstate certainty.

## The real handoff pipeline

The practical pipeline is not "copy file A into tool B."

It is closer to this:

```text
inspect source session
  -> extract useful working state
  -> normalize it into a portable handoff
  -> patch machine-specific paths
  -> redact sensitive values
  -> materialize target-ready state
       |- project mode: write project-local handoff files
       `- native mode: write or delegate target-native resume state
```

That middle part matters most.

Without normalization, you end up building an `N x N` converter matrix between every source tool and every target tool. That gets brittle fast. A better model is:

```text
read source -> normalize -> patch -> write target
```

That idea shaped `work-bridge` much more than any single vendor-specific adapter.

It also explains why the tool exists at all.

If I were only using one agent full-time, I probably would not have built this.
The need comes from a cost-aware, multi-tool workflow where switching is rational, frequent, and deeply inconvenient.

## Why this needed more than a converter script

Once I accepted that the real user was "someone actively hopping across agents because cost and capability keep changing," the architecture had to become more than a one-off file converter.

From my architecture notes, `work-bridge` is roughly organized like this:

```text
CLI
  |- inspect
  |- switch
  `- export

orchestrator
  |- config / fs / paths / redaction
  |- source importer
  |- skills + MCP catalog
  |- normalizer
  `- target adapter
       |- project mode apply/export
       `- native mode apply/export
```

That middle layer is the whole point.

The source side has to read whatever the tool actually stores.
The target side has to write whatever the next tool expects.
And the bridge in the middle has to carry enough meaning that the handoff still feels like the same task.

In my notes, that central payload is essentially a normalized session bundle:

- source tool and source session ID
- project root
- task title and current goal
- summary
- instruction artifacts
- settings snapshot
- tool events and touched files
- decisions, failures, warnings, and redactions

That structure matters because the user problem is not "preserve bytes."

It is:

> "I used Tool A because it was cheaper or more available right now. How do I move into Tool B without losing the working state I already paid to create?"

## How each tool actually anchors a session

The hardest part is not the transcript format itself.

The hardest part is how each tool decides:

1. what project this session belongs to
2. where the session is stored
3. what must exist for resume to work

### Claude Code

**Verified**

- Claude Code stores state under `~/.claude/`.
- Project sessions live under a project-derived folder below `~/.claude/projects/`.
- Session history is stored as JSONL.
- `work-bridge` native mode writes Claude JSONL, patches absolute paths, updates Claude history state, and can migrate user-scope skills into `~/.claude/skills/`.

From my local inspection notes, Claude's project folder is derived from the absolute project path, encoded into a deterministic folder name. In other words, the path itself is part of the session identity.

That means a naive cross-machine copy can fail even if the session payload itself is intact. If the target machine has a different absolute project path, Claude may not associate that copied session with the current working directory.

**Inference**

Claude's storage model appears optimized for strong project isolation and cheap lookup from the current directory. It is elegant locally, but it makes portability path-sensitive by default.

### Gemini CLI

**Verified**

- Gemini CLI stores its state under `~/.gemini/`.
- It maintains a project registry in `~/.gemini/projects.json`.
- Project-local session state lives under `~/.gemini/tmp/<project-id-or-slug>/`.
- Ownership is reinforced with a `.project_root` marker file.
- Chats are stored as JSON objects rather than JSONL rollouts.

My local notes also show an important transition: older Gemini layouts leaned on hashed identifiers, while newer layouts use a more readable slug-based project identity. Either way, there is still a registry layer between "this folder on disk" and "this project in the tool."

That is why copying just `chats/*.json` is not enough. If the registry mapping or `.project_root` marker still points at the old machine path, the target environment may treat the data as orphaned.

**Inference**

Gemini's model is less "one session file tells the whole story" and more "a project registry owns a session subtree." That makes handoff cleaner when the registry is updated correctly, but much easier to break if it is not.

### Codex CLI

**Verified**

- Codex stores sessions under `~/.codex/sessions/`.
- The layout is date-based: `YYYY/MM/DD/rollout-<timestamp>-<uuid>.jsonl`.
- Each rollout is append-only JSONL.
- The first line is a `session_meta` record.
- `session_meta.cwd` is critical because resume is filtered by current working directory.
- `work-bridge` native mode updates Codex session files, patches `session_meta.cwd`, patches path-bearing text content, updates session index state, and can install user-scope skills into `~/.codex/skills/`.

Codex is the clearest example of why one wrong field can make a migrated session disappear.

If `payload.cwd` still points to the source machine path, the copied session can exist on disk and still be invisible when you run `codex resume` from the target project.

That is not a corruption problem. It is an identity mismatch problem.

**Inference**

Codex's append-only rollout model is a very migration-friendly storage primitive. The portability problem is not the file format itself. It is the fact that the format still contains machine-local identity.

### OpenCode

**Verified**

- OpenCode is the outlier in this group because it is database-centric rather than file-centric.
- My local inspection notes describe a central SQLite-backed session model rather than flat JSONL rollouts.
- The current `work-bridge` public behavior intentionally does **not** promise raw SQLite mutation in native mode.
- Instead, native OpenCode handoff uses the official CLI delegate path and writes an import-compatible payload rather than mutating the database directly.

That last point is one of the most important design choices in the project.

When a tool has a stronger application-layer import boundary, the safest migration path is often to use that boundary rather than "being clever" with direct storage writes.

**Inference**

OpenCode forces a more disciplined migration strategy. Instead of treating storage as the API, it pushes the handoff toward delegate/import semantics. In practice, that is safer and easier to reason about than pretending every target should accept raw record injection.

## Why naive file copy fails

After looking across these tools, the common failure modes become pretty consistent.

### 1. The project path is part of identity

This shows up in different ways:

- Claude ties project storage to a path-derived project folder.
- Gemini ties project data to a registry entry and `.project_root`.
- Codex filters sessions through `session_meta.cwd`.
- OpenCode keeps project directory identity at the application/database layer.

If the source machine path is `/Users/alice/work/project` and the target machine path is `/Users/bob/src/project`, raw copying is not enough.

### 2. Useful context leaks into tool output

Tool calls and shell output often embed absolute paths directly in text:

```text
/Users/alice/work/project/internal/service/user.go
```

Even if the session resumes, that stale path can poison the next turn:

- the agent suggests edits against the wrong path
- file references in prior tool output become misleading
- future reasoning is anchored to a machine that no longer exists

That is why path patching is not cosmetic. It is part of context integrity.

### 3. Resume depends on more than the session payload

A tool may also need:

- a registry update
- an index refresh
- a project-scoped instruction file
- skills materialized in the expected location
- MCP config merged into the right project or user-scope file

This is exactly where many "session export/import" stories fall apart. The transcript arrives, but the operational context does not.

## What `work-bridge` actually moves

The public `work-bridge` README describes the handoff more broadly than just chat history, and I think that is the correct abstraction.

The current tool preserves or materializes:

- task title and current goal
- session summary and decisions
- project instruction context
- project-scoped skills
- effective MCP configuration
- portable settings context, with secrets redacted

That scope is important.

If your goal is not "archive this transcript" but "continue working in another tool," then `skills`, instruction files, and MCP state are not optional extras. They are part of the working environment.

This is also where the original motivation matters.

If the whole point is to let a cost-sensitive user move between tools without redoing expensive context-building work, then dropping instructions, skills, or MCP state defeats the purpose. The handoff has to preserve not only what the agent said, but the setup that made those answers useful.

## Project mode vs native mode

This is the core product split in `work-bridge`.

### Project mode

Project mode writes a target-ready handoff into the project itself.

Examples:

- Claude: `CLAUDE.md` plus `.work-bridge/claude/*`
- Gemini: `GEMINI.md` plus `.work-bridge/gemini/*`
- Codex: `AGENTS.md` plus `.work-bridge/codex/*`
- OpenCode: `AGENTS.md` plus `.work-bridge/opencode/*`

This mode is intentionally conservative. It does not try to mutate the target tool's external storage.

That makes it safer for:

- team repos
- reviewable handoffs
- cases where you want portability without touching home-directory state

It also uses a managed block strategy:

```md
<!-- work-bridge:start -->
...
<!-- work-bridge:end -->
```

That detail looks small, but it matters. Re-running the handoff replaces the managed block instead of duplicating instructions forever.

### Native mode

Native mode goes further. It tries to make the target tool resume the handoff as if it were native state.

That means:

- writing or patching target-native session storage
- updating indexes or registries where required
- migrating user-scope skills to the target location
- additively merging global MCP configuration where supported
- using delegate import instead of raw storage mutation when the target tool warrants it

In the current public behavior:

- Claude native writes JSONL and related history state
- Gemini native writes JSON plus project registry state
- Codex native writes JSONL plus session index state
- OpenCode native uses CLI delegate import

This distinction is not just implementation detail. It reflects two different promises:

```text
project mode = make the project understandable to the target tool
native mode  = make the target tool resume the session as native state
```

## Path patching is the unglamorous core

If I had to point at one unsexy but essential idea in this whole project, it would be path patching.

The public README is explicit that native migration patches absolute paths in tool results, shell output, and text content, with target-specific handling:

- Codex: patch `session_meta.cwd` and JSONL content
- Gemini: patch paths inside session JSON
- Claude: patch paths inside JSONL session files
- OpenCode: carry target directory information through the delegate payload

That sounds almost trivial until you realize how much agent context lives inside those path-bearing strings.

A previous shell command output is part of future reasoning.
A tool result with an old path is part of future reasoning.
A failure trace with the wrong root directory is part of future reasoning.

If you skip that patching step, you do not just lose polish. You risk loading a structurally inconsistent context.

## Why the handoff includes instructions, skills, and MCP

One thing I learned while building this is that there is no clean separation between "session" and "environment."

For coding agents, the environment is often part of the session's meaning.

If the source run depended on:

- a specific `AGENTS.md` or `CLAUDE.md`
- project-scoped reusable skills
- MCP servers available through project config

then moving only the transcript is a half-migration.

That is why `work-bridge` materializes:

- instruction files
- `.work-bridge/<target>/skills/`
- `.work-bridge/<target>/mcp.json`
- project config patches where supported

It also explains why native mode handles user-scope skills and global MCP as separate migration concerns.

This is not just about message history. It is about recreating the conditions under which the history made sense.

## Safety matters more than completeness

Another lesson from this project: "more direct" is not always "more correct."

For example, OpenCode could tempt you into raw database-level migration. That feels powerful, but it also means taking responsibility for:

- schema drift
- integrity constraints
- WAL/locking behavior
- version-specific assumptions

Using an official import/delegate boundary is less flashy, but usually the safer contract.

The same philosophy shows up in smaller places too:

- additive MCP merge instead of blind overwrite
- redaction warnings instead of silently carrying secrets through
- `--dry-run` as the default first step for an unfamiliar source/target pair

Interoperability is not just a conversion problem. It is a trust-boundary problem.

## Limits that are worth stating clearly

I think tools in this space should be honest about what they do **not** guarantee.

The current public behavior of `work-bridge` is intentionally modest in a few ways:

- it does not promise that every source-specific tool event becomes equally meaningful in every target
- it does not promise aggressive overwrite of conflicting global MCP entries
- it does not promise raw SQLite mutation for OpenCode native resume

That is a good thing.

Cross-agent portability gets dangerous when a tool pretends every bit of state is fungible. It is not.

Some state can be normalized cleanly.
Some state can only be approximated.
Some state should be delegated back to the target tool's own import surface.

## The command surface is simpler than the architecture underneath

One reason I like the current `work-bridge` shape is that the user-facing commands are simpler than the internals they hide:

```bash
work-bridge inspect gemini --limit 5

work-bridge switch \
  --from gemini \
  --session latest \
  --to codex \
  --project /path/to/repo \
  --dry-run

work-bridge export \
  --from gemini \
  --session latest \
  --to claude \
  --project /path/to/repo \
  --out /tmp/claude-handoff
```

At the surface, the workflow is:

- inspect what exists
- preview the handoff
- apply it to the project or export it elsewhere

Underneath, there is still a lot going on:

- format conversion
- path mutation
- redaction
- target-specific materialization
- index/registry updates
- native delegate import where needed

That is exactly the kind of complexity I want a portability layer to absorb.

## The biggest lesson

The biggest lesson from building `work-bridge` is simple:

> Session continuity is a state-reconstruction problem, not a transcript-copy problem.

And the reason I cared enough to build around that problem was not academic interoperability.

It was the everyday friction of using multiple LLM tools pragmatically:

- choosing one because it is cheaper
- choosing another because it is stronger for a certain class of task
- switching again when quotas or context windows become the constraint

For that kind of user, portability is not a nice-to-have. It is what makes a multi-tool workflow economically tolerable.

Once you start switching between coding agents seriously, you realize that "resume" is built on top of many hidden assumptions:

- where the project lives on disk
- how the tool maps projects to storage
- what extra files make the session usable
- how indexes, registries, and delegates are refreshed
- which secrets must never cross the bridge

That is why I now think of coding-agent sessions less like chat logs and more like small local runtimes.

And once you accept that model, the architecture of a tool like `work-bridge` becomes much clearer:

```text
portable handoff = normalized session state
                 + environment context
                 + path correction
                 + safe target rehydration
```

That is the real problem.

Not "how do I copy one conversation to another tool?"

But:

> "How do I make another tool inherit enough of the previous runtime state that continuing the task still makes sense?"

That question turned out to be much deeper than I expected, and much more interesting too.

If you are building in this area, my strong recommendation is to start with three assumptions:

1. The path matters.
2. The environment matters.
3. Safety boundaries matter.

Everything else follows from there.

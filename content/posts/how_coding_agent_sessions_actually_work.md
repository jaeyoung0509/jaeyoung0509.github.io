---
title: "How Coding-Agent Sessions Actually Work (and How to Bridge Them)"
date: 2026-04-11T10:30:00Z
description: "A practical look at how Claude, Gemini, Codex, and OpenCode store sessions, and what it takes to move that state between them."
tags: [coding-agent, ai-agent, developer-tools, session-migration, mcp]
draft: false
---

# How Coding-Agent Sessions Actually Work (and How to Bridge Them)

Many developers, me included, move between AI coding agents like Claude Code, Gemini CLI, Codex CLI, and OpenCode depending on cost and the kind of work in front of them. I might use a stronger model for architecture work, then switch to a cheaper, faster one for long editing passes.

The annoying part is the "context-switch tax." Every time I change agents, I lose task state, tool context, project-specific instructions, and MCP setup, which are the exact things that made the previous session useful.

I built [`work-bridge`](https://github.com/jaeyoung0509/work-bridge) because I wanted a practical way to carry that state across tools. In this post, I will walk through how each agent stores session data and what actually has to be patched to move that state safely.

## A Session is Not Just a Transcript

The easiest mistake is to think a session is just a transcript of prompts and replies. In practice, a session is closer to localized runtime state. It usually includes:

- Conversation history and tool execution results.
- Project identity bindings, how the agent knows the session belongs to a specific folder.
- Absolute paths embedded in text or tool output.
- Project-scoped skills and instruction artifacts.
- MCP (Model Context Protocol) configuration.

If you copy a session file from one tool to another, or even from one machine to another, the handoff usually fails because of identity mismatches or stale absolute paths, not because the text format is different.

## Agent Session Architectures Analyzed

Each agent persists state differently, and each one has its own idea of how a session stays tied to a local directory.

### 1. Claude Code
- **Path encoding:** Claude replaces non-alphanumeric characters in the absolute path with hyphens to build a deterministic directory name, for example `-Users-jaeyoung-work-bridge`.
- **Storage format:** It uses append-only JSON Lines (JSONL), which helps avoid losing data if the process crashes.
- **Characteristics:** Project isolation is strong, but even a small path change across machines, like a different username, is enough for Claude to stop recognizing the copied session.

### 2. Gemini CLI
- **Hashes and slugs:** Gemini maps the project's absolute path to a slug or SHA-256 hash and keeps a global registry in `projects.json`.
- **Ownership marker:** Inside the session folder, a `.project_root` file stores the absolute path as plain text. If that path does not match the current environment, the storage becomes invalid.
- **Storage format:** Rather than a turn-by-turn stream, Gemini stores the whole conversation and tool results as a structured JSON tree.

### 3. Codex CLI
- **Date-based hierarchy:** Sessions live in a central `YYYY/MM/DD` directory tree and use JSONL format.
- **Identification:** The first line contains a `session_meta` object. Codex finds relevant sessions by matching the `cwd` field against the current terminal path.
- **Characteristics:** This works well for auditing across projects, but the CLI has to inspect metadata from every file to find the sessions that matter.

### 4. OpenCode
- **Relational database:** OpenCode drops the plain file approach and stores session state in a centralized SQLite database through Bun and Drizzle ORM.
- **Root commit hashing:** It identifies projects through the repository's first commit hash rather than the absolute path. If Git is unavailable, it falls back to a global identifier.
- **Characteristics:** Data integrity is better here, but migration becomes a database patching problem. You have to inject rows carefully and rewrite fields like `worktree` and `directory`.

## The work-bridge Normalization Strategy

To connect these different storage models, `work-bridge` uses a normalization pipeline instead of trying to shuffle raw files around.

### The Two-Stage Pipeline
1. **ImportRaw:** Read the source agent's native format.
2. **Normalize:** Convert that raw state into a canonical `SessionBundle`. That bundle carries not only messages, but also tool events, execution failures, and context instructions like `AGENTS.md`, so the *working environment* moves along with the conversation.

### Dynamic Path Patching
This is the part that matters most for cross-machine or cross-agent handoffs. Absolute paths from the source machine need to be rewritten against the target machine's layout at import time.
- For **Claude**, `work-bridge` recalculates the hyphenated directory name.
- For **Gemini**, it rewrites the `.project_root` file immediately.
- For **Codex**, it updates the `cwd` metadata inside the JSONL session.
- It also scans shell output and model text for leaked absolute paths so that old paths do not quietly poison the next session.

## Conclusion

Local AI agents are evolving quickly, but local storage formats are still all over the place. Session continuity is not a transcript-copy problem, it is a state-reconstruction problem.

That is the gap `work-bridge` tries to close. By preserving paths, instructions, and tool context, it lets me move between agents without losing the pieces that actually make a session usable.

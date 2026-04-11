---
title: "How Coding-Agent Sessions Actually Work (and How to Bridge Them)"
date: 2026-04-11T10:30:00Z
description: "An analysis of session management architectures in Claude, Gemini, Codex, and OpenCode, and how the work-bridge open-source project enables interoperability between them."
tags: [coding-agent, ai-agent, developer-tools, session-migration, mcp]
draft: false
---

# How Coding-Agent Sessions Actually Work (and How to Bridge Them)

Many developers, including myself, actively rotate between different AI coding agents—such as Claude Code, Gemini CLI, Codex CLI, and OpenCode—to optimize for cost and specific capabilities. You might use a more capable model for broad architecture design, and a faster, cheaper one for long editing passes.

However, the biggest friction in this workflow is the "context-switch tax." Every time you change agents, you lose the task state, the operational context, project-specific instructions (Skills), and the MCP server setups that made the previous session useful.

To solve this, I built [`work-bridge`](https://github.com/jaeyoung0509/work-bridge), a local-first handoff tool that normalizes sessions across these different agents. In this post, I will break down how each of these agents stores session data and explain the technical strategies required to migrate state seamlessly between them.

## A Session is Not Just a Transcript

The easiest mistake is assuming a session is merely a log of user messages and assistant replies. In reality, a session represents a localized runtime state. It includes:

- Conversation history and tool execution results.
- Project identity bindings (how the agent knows the session belongs to a specific folder).
- Absolute paths embedded in text or tool outputs.
- Project-scoped skills and instruction artifacts.
- MCP (Model Context Protocol) configurations.

When you try to naively copy a session file from one tool to another (or even to a different machine), the handoff usually fails because of identity mismatches or stale absolute paths, not just formatting differences.

## Agent Session Architectures Analyzed

Each agent has a distinct approach to persisting state and determining "Path Determinism" (how it binds a session to a local directory).

### 1. Claude Code
- **Path Encoding**: Claude replaces all non-alphanumeric characters in the absolute path with hyphens to create a deterministic directory name (e.g., `-Users-jaeyoung-work-bridge`).
- **Storage Format**: It uses an append-only JSON Lines (JSONL) format to prevent data loss during crashes.
- **Characteristics**: This provides strong project isolation. However, if the absolute path changes slightly across machines (e.g., a different username), Claude will fail to recognize the copied session.

### 2. Gemini CLI
- **Hashes and Slugs**: Gemini maps the project's absolute path to a slug or a SHA-256 hash, keeping a global registry in `projects.json`.
- **Ownership Marker**: Inside the session folder, a `.project_root` file stores the absolute path as plain text. If this path does not match the runtime environment, the storage is invalidated.
- **Storage Format**: Instead of a turn-by-turn stream, Gemini stores the entire conversation and tool results as a structured JSON tree.

### 3. Codex CLI
- **Date-based Hierarchy**: Sessions are stored centrally in a `YYYY/MM/DD` directory structure using JSONL format.
- **Identification**: The first line of the JSONL file contains a `session_meta` object. Codex filters sessions by matching the `cwd` (Current Working Directory) property within this object against your terminal's current path.
- **Characteristics**: Excellent for cross-project auditing, but the CLI must parse the metadata of every file to find relevant sessions.

### 4. OpenCode
- **Relational Database**: OpenCode abandons the file system approach, using a centralized SQLite database (via Bun/Drizzle ORM).
- **Root Commit Hashing**: It identifies projects using the repository's first commit hash (Root Commit) rather than the absolute path. If Git is not present, it falls back to a global identifier.
- **Characteristics**: This offers superior data integrity. However, migration requires database-level injection and precise patching of the `worktree` and `directory` fields.

## The work-bridge Normalization Strategy

To seamlessly connect these disparate storage structures, `work-bridge` utilizes a robust pipeline rather than simple file converters.

### The Two-Stage Pipeline
1. **ImportRaw**: Reads the source agent's specific format.
2. **Normalize**: Converts the raw data into a canonical `SessionBundle`. This central data structure contains not just messages, but also tool events, execution failures, and context instructions (like `AGENTS.md`), ensuring that the *operational environment* is migrated alongside the text.

### Dynamic Path Patching
This is the most critical technology for cross-machine or cross-agent switching. Absolute paths embedded in the source machine's session must be dynamically replaced with the target machine's layout at runtime.
- For **Claude**, `work-bridge` recalculates the hyphenated directory name.
- For **Gemini**, it immediately rewrites the contents of the `.project_root` file.
- For **Codex**, it precisely mutates the `cwd` metadata inside the JSONL file.
- It also scans and patches absolute paths that leaked into shell execution outputs or model reasoning blocks to prevent future context poisoning.

## Conclusion

The ecosystem of local AI agents is evolving rapidly, but the standardization of local data storage remains non-existent. Session continuity is a state-reconstruction problem, not a transcript-copy problem. 

By preserving paths, environments, and safety boundaries, `work-bridge` overcomes this fragmentation, allowing developers to flexibly choose the most cost-effective or capable tool for the task at hand. If you regularly switch between coding agents, I hope this project helps maintain your velocity.
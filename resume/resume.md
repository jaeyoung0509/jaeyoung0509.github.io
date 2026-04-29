---
pdf_options:
  format: A4
  margin: 15mm 15mm 15mm 15mm
  printBackground: true
stylesheet: resume.css
---

# Jaeyoung Lee

**Software Engineer, Python / Go / TypeScript | FinTech Payments & BNPL**

London, UK &nbsp;·&nbsp; UK Youth Mobility Visa, expires Oct 2027 &nbsp;·&nbsp; No sponsorship required

LinkedIn: [linkedin.com/in/jaeyoung-lee-72908227a](https://www.linkedin.com/in/jaeyoung-lee-72908227a/)  
GitHub: [github.com/jaeyoung0509](https://github.com/jaeyoung0509)  
Email: [ejaebbang@gmail.com](mailto:ejaebbang@gmail.com)

---

## About

Software engineer with 3+ years of experience in FinTech, mainly around BNPL and payments. Working in an early-stage startup environment taught me how to move quickly while still respecting the reliability and compliance standards that financial products require.

My primary toolchain is **Python** and **Go**. I mainly build event-driven AWS serverless services and async workflows around EventBridge, SQS, and DynamoDB Streams. I tend to use Domain-Driven Design (DDD) and Hexagonal Architecture to keep core domain logic clean as infrastructure changes. I also work closely with product, operations, and business stakeholders, contributing through code review and sprint-based delivery.

---

## Skills

**Languages:** Python, Go, TypeScript, SQL
**Backend:** AWS Chalice, FastAPI, Flask, gRPC, Chi, Fiber
**Infrastructure & AWS:** Lambda, EventBridge, SQS/SNS, DynamoDB, API Gateway, AWS CDK
**Architecture:** DDD, Hexagonal Architecture, Event-Driven, CI/CD

---

## Experience

### Software Engineer, Finovuslab (FinTech BNPL)

*Apr 2022 – Nov 2025 · Seoul, South Korea*

- Operated 13 AWS serverless microservices, leveraging EventBridge → SQS and DynamoDB Streams to decouple domains and orchestrate async workflows.
- Standardised Chalice-based services (API + event handlers) as the primary runtime across engineering teams, helping keep sprint delivery and code review conventions consistent.
- Maintained robust operational hygiene for PostgreSQL and DynamoDB, optimizing single-table designs strictly against access patterns.
- Re-architected legacy services into Hexagonal Architecture, significantly reducing blast radius and improving unit testability.
- Worked closely with product, operations, and business stakeholders to translate shifting requirements into production-ready payment workflows.
- Integrated external APIs across diverse partner industries, incorporating third-party services for identity verification and credit scoring into the core workflow.
- Mitigated Lambda cold-start impact on critical payment paths by implementing shared Lambda Layers and intelligent traffic-warming schedules.

## Projects

### Moonberg, FinTech Ops Automation

*Go, Python, PostgreSQL, Vue.js* · https://moonberg.co.kr/

An automation pipeline used by a real accounting firm to capture, parse, and normalise complex Bloomberg Terminal data.

- **Business Impact:** Reduced manual data entry and reconciliation workloads by 60–80%, while cutting down reporting mistakes.
- **Architecture:** Python micro-workers handle async data capture, the Go backend manages concurrent core integrations, and Vue with TypeScript powers the UI.

### alembic-dump, Open Source Ops Tool

*Python, Alembic, PostgreSQL, AWS* · https://github.com/jaeyoung0509/alembic-dump

A data consistency and migration operations tool built to resolve conflicting schema updates in parallel delivery environments.

- Engineered a secure workflow to pull staging DB states into local environments via AWS Secrets Manager and bastion tunneling.
- Implemented CI/CD guardrails validating downgrade paths to prevent migration hygiene degradation.

### work-bridge, Multi-Agent Workflow Router

*Go, AI/LLM Tooling, MCP* · https://github.com/jaeyoung0509/work-bridge

A workflow tool for developers who move between coding agents like Codex, Claude Code, Gemini CLI, and OpenCode to manage cost and capability tradeoffs.

- Supports import and export for MCP, skills, and project-specific sessions across agents.
- Makes it easier to carry context between agent CLIs without rebuilding the same setup every time.

### ThinLog, Field-First Logging App

*Vue 3, FastAPI, Cloudflare Pages, Cloudflare AI OCR* · https://app.thinlog.uk/

A lightweight mobile-first logging app for UK sole traders, built around MTD-era record capture and rough, on-the-go usage.

- Designed a copy-first OCR flow after real receipt scans proved less reliable than direct auto-fill.
- Added client-side idempotency keys in `localStorage` to avoid duplicate submissions on unstable mobile connections.

---

## Education

**BEng, Computer Engineering**, Dongyang Mirae University, South Korea (2015 – 2021)
*(Excl. mandatory national military service 2016–2018)*

**Engineer Information Processing**, National Professional Certification (South Korea)

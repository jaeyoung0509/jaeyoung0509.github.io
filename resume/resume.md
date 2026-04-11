---
pdf_options:
  format: A4
  margin: 20mm 20mm 20mm 20mm
  printBackground: true
stylesheet: resume.css
---

# Jaeyoung Lee

**Software Engineer — Python / Go / TypeScript | FinTech Payments & BNPL**

London, UK &nbsp;·&nbsp; UK Youth Mobility Visa, expires Oct 2027 &nbsp;·&nbsp; No sponsorship required

[linkedin.com/in/jaeyoung-lee-72908227a](https://www.linkedin.com/in/jaeyoung-lee-72908227a/) &nbsp;·&nbsp; [github.com/jaeyoung0509](https://github.com/jaeyoung0509)

---

## About

Software Engineer with 3+ years of experience in FinTech (BNPL/Payments). Working in an early-stage startup environment, I have developed a self-driven, agile approach to engineering — balancing the need to rapidly adapt to shifting business requirements with the strict reliability and compliance standards required in the financial domain.

My primary toolchain includes **Python** and **Go**. I specialize in building scalable, event-driven AWS serverless microservices and designing resilient async workflows via EventBridge, SQS, and DynamoDB Streams. I strongly advocate for Domain-Driven Design (DDD) and Hexagonal Architecture to isolate core domain logic from infrastructural constraints. I am also comfortable working cross-functionally with product, operations, and business stakeholders, contributing through code review and sprint-based delivery in fast-moving teams.

---

## Skills

**Languages:** Python, Go, TypeScript, SQL
**Backend:** AWS Chalice, FastAPI, Flask, gRPC, Chi, Fiber
**Infrastructure & AWS:** Lambda, EventBridge, SQS/SNS, DynamoDB, API Gateway, AWS CDK
**Architecture:** DDD, Hexagonal Architecture, Event-Driven, CI/CD

---

## Experience

### Software Engineer — Finovuslab (FinTech BNPL)

*Apr 2022 – Nov 2025 · Seoul, South Korea*

- Operated 13 AWS serverless microservices, leveraging EventBridge → SQS and DynamoDB Streams to decouple domains and orchestrate async workflows.
- Standardised Chalice-based services (API + event handlers) as the primary runtime across engineering teams, helping keep sprint delivery and code review conventions consistent.
- Maintained robust operational hygiene for PostgreSQL and DynamoDB, optimizing single-table designs strictly against access patterns.
- Re-architected legacy services into Hexagonal Architecture, significantly reducing blast radius and improving unit testability.
- Worked closely with product, operations, and business stakeholders to translate shifting requirements into production-ready payment workflows.
- Integrated external APIs across diverse partner industries, incorporating third-party services for identity verification and credit scoring into the core workflow.
- Mitigated Lambda cold-start impact on critical payment paths by implementing shared Lambda Layers and intelligent traffic-warming schedules.

---

<div style="page-break-before: always;"></div>

## Projects

### Moonberg — FinTech Ops Automation

*Go, Python, PostgreSQL, Vue.js* · https://moonberg.co.kr/

An automation pipeline actively deployed and utilized in a real accounting firm to capture, parse, and normalise complex Bloomberg Terminal data.

- **Business Impact:** Reduced manual data entry and reconciliation workloads by 60–80%, minimizing human error in financial reporting.
- **Architecture:** Python micro-workers for async data capture; Go backend for concurrent core integrations; Vue (TypeScript) for the front-end UI.

### alembic-dump — Open Source Ops Tool

*Python, Alembic, PostgreSQL, AWS* · https://github.com/jaeyoung0509/alembic-dump

A data consistency and migration operations tool for resolving conflicting schema updates in parallel delivery environments.

- Engineered a secure workflow to pull staging DB states into local environments via AWS Secrets Manager and bastion tunneling.
- Implemented CI/CD guardrails validating downgrade paths to prevent migration hygiene degradation.

### work-bridge — Multi-Agent Workflow Router

*Go, AI/LLM Tooling, MCP* · https://github.com/jaeyoung0509/work-bridge

A workflow tool for developers using multiple coding agents (Codex, Claude Code, Gemini CLI, OpenCode) to manage costs.

- Enables seamless import/export for MCP, skills, and project-specific sessions across agents.
- Streamlines context sharing across discrete agent CLI tools to maintain velocity when switching engines.

---

## Education

**BEng, Computer Engineering** — Dongyang Mirae University, South Korea (2015 – 2021)
*(Excl. mandatory national military service 2016–2018)*

**Engineer Information Processing** — National Professional Certification (South Korea)

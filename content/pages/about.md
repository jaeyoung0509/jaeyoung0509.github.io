---
title: "Jaeyoung Lee"
description: "Software Engineer with 3+ years in FinTech (BNPL/Payments)"
---

<div class="profile-header">
  <div class="profile-details">
    <h1>Jaeyoung Lee</h1>
    <p class="tagline">Software Engineer (Python / Go / TypeScript) | FinTech Payments & BNPL</p>
    <div class="contact-links">
      <a href="https://www.linkedin.com/in/jaeyoung-lee-72908227a/" target="_blank" rel="noopener">LinkedIn</a>
      <span>&bull;</span>
      <a href="https://github.com/jaeyoung0509" target="_blank" rel="noopener">GitHub</a>
      <span>&bull;</span>
      <a href="/static/cv_jaeyoung_lee.pdf" target="_blank" class="download-link" aria-label="Download PDF Resume">Download PDF</a>
      <span>&bull;</span>
      <span class="location">London, UK &mdash; UK Youth Mobility Visa (expires Oct 2027, no sponsorship required)</span>
    </div>
  </div>
</div>

## About

I am a Software Engineer with 3+ years of experience in FinTech (BNPL/Payments). Working in an early-stage startup environment, I have developed a self-driven, agile approach to engineering&mdash;balancing the need to rapidly adapt to shifting business requirements with the strict reliability and compliance standards required in the financial domain.

My primary toolchain includes **Python** and **Go**. I specialize in building scalable, event-driven AWS serverless microservices and designing resilient async workflows via EventBridge, SQS, and DynamoDB Streams. I strongly advocate for Domain-Driven Design (DDD) and Hexagonal (Ports & Adapters) Architecture to isolate core domain logic from infrastructural constraints, ensuring systems remain adaptable yet robust. I am also comfortable working cross-functionally with product, operations, and business stakeholders, contributing through code review and sprint-based delivery in fast-moving teams.

---

## Skills

<div class="skills-grid">
  <div class="skill-category">
    <h3>Languages</h3>
    <p>Python, Go, TypeScript, SQL</p>
  </div>
  <div class="skill-category">
    <h3>Backend Frameworks</h3>
    <p>AWS Chalice, FastAPI, Flask, gRPC, Chi, Fiber</p>
  </div>
  <div class="skill-category">
    <h3>Infrastructure & AWS</h3>
    <p>Lambda, EventBridge, SQS/SNS, DynamoDB, API Gateway, AWS CDK</p>
  </div>
  <div class="skill-category">
    <h3>Architecture</h3>
    <p>DDD, Hexagonal Architecture, Event-Driven, CI/CD</p>
  </div>
</div>

---

## Experience

<div class="experience-card">
  <div class="exp-header">
    <h3>Software Engineer</h3>
    <span class="company">Finovuslab (FinTech BNPL)</span>
    <span class="date">Apr 2022 &ndash; Nov 2025 | Seoul, South Korea</span>
  </div>
  <ul>
    <li>Operated 13 AWS serverless microservices, leveraging EventBridge &rarr; SQS and DynamoDB Streams to decouple domains and orchestrate async workflows.</li>
    <li>Standardised Chalice-based services (API + event handlers) as the primary runtime across engineering teams, helping keep sprint delivery and code review conventions consistent.</li>
    <li>Maintained robust operational hygiene for PostgreSQL and DynamoDB, optimizing single-table designs strictly against access patterns.</li>
    <li>Re-architected legacy services into Hexagonal Architecture, significantly reducing blast radius and improving unit testability.</li>
    <li>Worked closely with product, operations, and business stakeholders to translate shifting requirements into production-ready payment workflows.</li>
    <li>Integrated external APIs across diverse partner industries, seamlessly incorporating third-party services for identity verification and credit scoring into the core workflow.</li>
    <li>Mitigated Lambda cold-start impact on critical payment paths by implementing shared Lambda Layers and intelligent traffic-warming schedules.</li>
  </ul>
</div>

---

## Portfolio Showcase

<div class="portfolio-grid">
  <div class="project-card highlight">
    <div class="project-content">
      <h3><a href="https://moonberg.co.kr/" target="_blank" rel="noopener">Moonberg ↗</a> <span>&mdash; FinTech Ops Automation</span></h3>
      <p class="project-stack">Go, Python, PostgreSQL, Vue.js</p>
      <p>An automation pipeline actively deployed and <strong>utilized in a real accounting firm</strong> to capture, parse, and normalise complex Bloomberg Terminal data.</p>
      <ul>
        <li><strong>Business Impact:</strong> Reduced manual data entry and reconciliation workloads for accountants by 60&ndash;80%, drastically minimizing human error in financial reporting.</li>
        <li><strong>Architecture:</strong> Python micro-workers for asynchronous data capture; Go backend mapping complex concurrent core integrations; Vue(TypeScript) for a responsive front-end UI.</li>
      </ul>
    </div>
  </div>

  <div class="project-card">
    <div class="project-content">
      <h3><a href="https://github.com/jaeyoung0509/alembic-dump" target="_blank" rel="noopener">alembic-dump ↗</a> <span>&mdash; Open Source Ops Tool</span></h3>
      <p class="project-stack">Python, Alembic, PostgreSQL, AWS</p>
      <p>A data consistency and migration operations tool designed to resolve conflicting schema updates in parallel delivery environments.</p>
      <ul>
        <li>Engineered a workflow to securely pull staging DB states into local environments via AWS Secrets Manager and bastion tunneling.</li>
        <li>Implemented strict CI/CD guardrails validating downgrade paths to prevent migration hygiene degradation over time.</li>
      </ul>
    </div>
  </div>

  <div class="project-card">
    <div class="project-content">
      <h3><a href="https://github.com/jaeyoung0509/work-bridge" target="_blank" rel="noopener">work-bridge ↗</a> <span>&mdash; Multi-Agent Workflow Router</span></h3>
      <p class="project-stack">Go, AI/LLM Tooling, MCP</p>
      <p>A workflow tool built for developers traversing multiple coding agents (Codex, Claude Code, Gemini CLI, OpenCode) to manage unpredictable LLM costs.</p>
      <ul>
        <li>Enables seamless <strong>import/export functionality</strong> for MCP (Model Context Protocol), skills, and project-specific sessions escaping vendor/tool lock-in.</li>
        <li>Streamlines context sharing across discrete agent CLI tools to maintain rapid velocity even when switching intelligence engines.</li>
      </ul>
    </div>
  </div>
</div>

---

## Education

**BEng, Computer Engineering**  
*Dongyang Mirae University, South Korea (2015 &ndash; 2021)*  
*(Note: Excl. mandatory national military service from 2016-2018)*

**Engineer Information Processing**  
*National Professional Certification (South Korea)*

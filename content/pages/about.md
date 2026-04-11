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
      <a href="mailto:ejaebbang@gmail.com">ejaebbang@gmail.com</a>
      <span>&bull;</span>
      <a href="/static/cv_jaeyoung_lee.pdf" target="_blank" class="download-link" aria-label="Download PDF Resume">Download PDF</a>
      <span>&bull;</span>
      <span class="location">London, UK, UK Youth Mobility Visa (expires Oct 2027, no sponsorship required)</span>
    </div>
  </div>
</div>

## About

I am a software engineer with 3+ years of experience in FinTech, mainly around BNPL and payments. Working at an early-stage startup taught me how to move quickly without losing sight of the reliability and compliance work that financial products demand.

My primary toolchain is **Python** and **Go**. I spend most of my time building event-driven AWS serverless services and async workflows around EventBridge, SQS, and DynamoDB Streams. I tend to lean on Domain-Driven Design (DDD) and Hexagonal Architecture because they help keep domain logic clean even as the surrounding infrastructure changes. I also work closely with product, operations, and business stakeholders, and I am comfortable owning work through code review and sprint delivery in fast-moving teams.

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
      <h3><a href="https://moonberg.co.kr/" target="_blank" rel="noopener">Moonberg ↗</a><span>, FinTech Ops Automation</span></h3>
      <p class="project-stack">Go, Python, PostgreSQL, Vue.js</p>
      <p>An automation pipeline used by a real accounting firm to capture, parse, and normalise complex Bloomberg Terminal data.</p>
      <ul>
        <li><strong>Business Impact:</strong> Reduced manual data entry and reconciliation workloads for accountants by 60&ndash;80%, while cutting down reporting mistakes.</li>
        <li><strong>Architecture:</strong> Python micro-workers handle asynchronous data capture, a Go backend manages the concurrent core integrations, and Vue with TypeScript powers the UI.</li>
      </ul>
    </div>
  </div>

  <div class="project-card">
    <div class="project-content">
      <h3><a href="https://github.com/jaeyoung0509/alembic-dump" target="_blank" rel="noopener">alembic-dump ↗</a><span>, Open Source Ops Tool</span></h3>
      <p class="project-stack">Python, Alembic, PostgreSQL, AWS</p>
      <p>A data consistency and migration operations tool built to deal with conflicting schema updates in parallel delivery environments.</p>
      <ul>
        <li>Engineered a workflow to securely pull staging DB states into local environments via AWS Secrets Manager and bastion tunneling.</li>
        <li>Implemented strict CI/CD guardrails validating downgrade paths to prevent migration hygiene degradation over time.</li>
      </ul>
    </div>
  </div>

  <div class="project-card">
    <div class="project-content">
      <h3><a href="https://github.com/jaeyoung0509/work-bridge" target="_blank" rel="noopener">work-bridge ↗</a><span>, Multi-Agent Workflow Router</span></h3>
      <p class="project-stack">Go, AI/LLM Tooling, MCP</p>
      <p>A workflow tool for developers who move between coding agents like Codex, Claude Code, Gemini CLI, and OpenCode to manage shifting LLM costs and capabilities.</p>
      <ul>
        <li>Supports <strong>import and export</strong> for MCP (Model Context Protocol), skills, and project-specific sessions, which helps avoid vendor and tool lock-in.</li>
        <li>Makes it easier to carry context between agent CLIs without rebuilding the same setup every time.</li>
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

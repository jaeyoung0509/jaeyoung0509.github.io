---
title: "Jaeyoung Lee"
description: "Software Engineer with 3+ years in FinTech (BNPL/Payments)"
---

<div class="mb-14">
  <div class="mb-4">
    <h1 class="text-4xl font-semibold mb-2 mt-0 border-b-0 pb-0">Jaeyoung Lee</h1>
    <p class="text-lg text-brand-sub mb-4 mt-0">Software Engineer (Python / Go / TypeScript) | FinTech Payments & BNPL</p>
    <div class="flex flex-wrap gap-3 text-sm text-brand-sub items-center">
      <a href="https://www.linkedin.com/in/jaeyoung-lee-72908227a/" target="_blank" rel="noopener" class="font-medium no-underline hover:underline hover:text-brand-accent transition-colors">LinkedIn</a>
      <span>&bull;</span>
      <a href="https://github.com/jaeyoung0509" target="_blank" rel="noopener" class="font-medium no-underline hover:underline hover:text-brand-accent transition-colors">GitHub</a>
      <span>&bull;</span>
      <a href="mailto:ejaebbang@gmail.com" class="font-medium no-underline hover:underline hover:text-brand-accent transition-colors">ejaebbang@gmail.com</a>
      <span>&bull;</span>
      <a href="/static/cv_jaeyoung_lee.pdf" target="_blank" class="download-link font-medium no-underline hover:underline hover:text-brand-accent transition-colors" aria-label="Download PDF Resume">Download PDF</a>
      <span>&bull;</span>
      <span>London, UK, UK Youth Mobility Visa (expires Oct 2027, no sponsorship required)</span>
    </div>
  </div>
</div>

## About

I am a software engineer with 3+ years of experience in FinTech, mainly around BNPL and payments. Working at an early-stage startup taught me how to move quickly without losing sight of the reliability and compliance work that financial products demand.

My primary toolchain is **Python** and **Go**. I spend most of my time building event-driven AWS serverless services and async workflows around EventBridge, SQS, and DynamoDB Streams. I tend to lean on Domain-Driven Design (DDD) and Hexagonal Architecture because they help keep domain logic clean even as the surrounding infrastructure changes. I also work closely with product, operations, and business stakeholders, and I am comfortable owning work through code review and sprint delivery in fast-moving teams.

---

## Skills

<div class="grid grid-cols-1 md:grid-cols-2 gap-y-8 gap-x-6 not-prose mt-6">
  <div>
    <h3 class="text-sm uppercase tracking-wide font-semibold text-brand-text mb-2">Languages</h3>
    <p class="text-[0.95rem] text-brand-sub leading-relaxed m-0">Python, Go, TypeScript, SQL</p>
  </div>
  <div>
    <h3 class="text-sm uppercase tracking-wide font-semibold text-brand-text mb-2">Backend Frameworks</h3>
    <p class="text-[0.95rem] text-brand-sub leading-relaxed m-0">AWS Chalice, FastAPI, Flask, gRPC, Chi, Fiber</p>
  </div>
  <div>
    <h3 class="text-sm uppercase tracking-wide font-semibold text-brand-text mb-2">Infrastructure & AWS</h3>
    <p class="text-[0.95rem] text-brand-sub leading-relaxed m-0">Lambda, EventBridge, SQS/SNS, DynamoDB, API Gateway, AWS CDK</p>
  </div>
  <div>
    <h3 class="text-sm uppercase tracking-wide font-semibold text-brand-text mb-2">Architecture</h3>
    <p class="text-[0.95rem] text-brand-sub leading-relaxed m-0">DDD, Hexagonal Architecture, Event-Driven, CI/CD</p>
  </div>
</div>

---

## Experience

<div class="border-b border-brand-border pb-8 mb-8 last:border-0 last:pb-0 last:mb-0 not-prose mt-6">
  <div class="flex flex-col mb-4">
    <h3 class="text-lg font-semibold m-0 mb-1 text-brand-text">Software Engineer</h3>
    <span class="font-medium text-brand-text text-base">Finovuslab (FinTech BNPL)</span>
    <span class="text-sm text-brand-sub mt-1">Apr 2022 &ndash; Nov 2025 | Seoul, South Korea</span>
  </div>
  <ul class="list-disc pl-5 text-[0.95rem] text-brand-sub space-y-2.5">
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

<div class="flex flex-col gap-12 not-prose mt-6">
  <div>
    <h3 class="text-xl font-semibold m-0 mb-2 flex items-center gap-1.5"><a href="https://moonberg.co.kr/" target="_blank" rel="noopener" class="text-brand-text hover:text-brand-accent transition-colors no-underline">Moonberg ↗</a><span class="font-normal text-brand-sub text-[1.05rem]">, FinTech Ops Automation</span></h3>
    <p class="text-sm font-medium text-brand-sub uppercase tracking-wide mb-4 mt-0">Go, Python, PostgreSQL, Vue.js</p>
    <p class="text-[0.95rem] text-brand-sub mb-4 leading-relaxed">An automation pipeline used by a real accounting firm to capture, parse, and normalise complex Bloomberg Terminal data.</p>
    <ul class="list-disc pl-5 text-[0.95rem] text-brand-sub space-y-2.5">
      <li><strong class="text-brand-text font-semibold">Business Impact:</strong> Reduced manual data entry and reconciliation workloads for accountants by 60&ndash;80%, while cutting down reporting mistakes.</li>
      <li><strong class="text-brand-text font-semibold">Architecture:</strong> Python micro-workers handle asynchronous data capture, a Go backend manages the concurrent core integrations, and Vue with TypeScript powers the UI.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-xl font-semibold m-0 mb-2 flex items-center gap-1.5"><a href="https://github.com/jaeyoung0509/alembic-dump" target="_blank" rel="noopener" class="text-brand-text hover:text-brand-accent transition-colors no-underline">alembic-dump ↗</a><span class="font-normal text-brand-sub text-[1.05rem]">, Open Source Ops Tool</span></h3>
    <p class="text-sm font-medium text-brand-sub uppercase tracking-wide mb-4 mt-0">Python, Alembic, PostgreSQL, AWS</p>
    <p class="text-[0.95rem] text-brand-sub mb-4 leading-relaxed">A data consistency and migration operations tool built to deal with conflicting schema updates in parallel delivery environments.</p>
    <ul class="list-disc pl-5 text-[0.95rem] text-brand-sub space-y-2.5">
      <li>Engineered a workflow to securely pull staging DB states into local environments via AWS Secrets Manager and bastion tunneling.</li>
      <li>Implemented strict CI/CD guardrails validating downgrade paths to prevent migration hygiene degradation over time.</li>
    </ul>
  </div>

  <div>
    <h3 class="text-xl font-semibold m-0 mb-2 flex items-center gap-1.5"><a href="https://github.com/jaeyoung0509/work-bridge" target="_blank" rel="noopener" class="text-brand-text hover:text-brand-accent transition-colors no-underline">work-bridge ↗</a><span class="font-normal text-brand-sub text-[1.05rem]">, Multi-Agent Workflow Router</span></h3>
    <p class="text-sm font-medium text-brand-sub uppercase tracking-wide mb-4 mt-0">Go, AI/LLM Tooling, MCP</p>
    <p class="text-[0.95rem] text-brand-sub mb-4 leading-relaxed">A workflow tool for developers who move between coding agents like Codex, Claude Code, Gemini CLI, and OpenCode to manage shifting LLM costs and capabilities.</p>
    <ul class="list-disc pl-5 text-[0.95rem] text-brand-sub space-y-2.5">
      <li>Supports <strong class="text-brand-text font-semibold">import and export</strong> for MCP (Model Context Protocol), skills, and project-specific sessions, which helps avoid vendor and tool lock-in.</li>
      <li>Makes it easier to carry context between agent CLIs without rebuilding the same setup every time.</li>
    </ul>
  </div>
</div>

---

## Education

**BEng, Computer Engineering**  
*Dongyang Mirae University, South Korea (2015 &ndash; 2021)*  
*(Note: Excl. mandatory national military service from 2016-2018)*

**Engineer Information Processing**  
*National Professional Certification (South Korea)*

---
title: "From Paper Ledgers to Digital Logs: Building ThinLog for UK Sole Traders"
date: 2026-04-28T21:00:00Z
description: "How I built ThinLog as a small field-first logging app with Vue, FastAPI Cloud, Cloudflare AI OCR, and client-side idempotency for mobile users."
tags: [project, vue3, fastapi, cloudflare, ocr, ux]
---

ThinLog is live at [app.thinlog.uk](https://app.thinlog.uk/).

<video autoplay loop muted playsinline preload="metadata" title="ThinLog homepage clip">
  <source src="/static/thinlog.mp4" type="video/mp4" />
  <source src="/static/thinlog.mov" type="video/quicktime" />
  Your browser does not support the video tag.
</video>

I built ThinLog for a pretty ordinary reason: I heard about the UK MTD change in the news, I had access to the `FastAPI Cloud` beta, and I wanted to see whether I could ship something useful without making the infrastructure heavy or expensive.

That is the whole story, more or less. The people I kept thinking about were still using paper ledgers and loose receipts, and the obvious software options felt heavier than the job itself.

## 1. Why I Started

On April 6, 2026, the UK started pushing sole traders and landlords with self-employment or property income over GBP 50,000 toward digital record-keeping under Making Tax Digital for Income Tax. That was the first reason I paid attention. It was not an abstract product idea. It was a real change with a real deadline.

The second reason was what I kept seeing around me: plumbers, carpenters, electricians, and other blue-collar workers still writing things down by hand. They had paper notebooks, crumpled receipts, and a workflow that made sense in the field but broke down once the records had to be moved somewhere else.

I did not want to build a big accounting suite. I wanted to build the smallest thing that could make that first step less painful.

## 2. Field Workers First

The main constraint was behavioral, not technical.

The users I had in mind were not sitting at desks with good lighting and a stable connection. They might be in a van, between jobs, on a short break, or trying to close out the day with tired hands and a bad signal. That changed the interface more than any API choice did.

I tried to avoid building a form that looked correct but felt tiring. The app needed to be forgiving. A rough record should be easy to save first, then clean up later if needed. For that reason, I cared more about the first 30 seconds of the experience than about adding more features.

That also shaped the product boundary. ThinLog is not trying to be a full accounting suite. It is closer to a capture layer: get the work log, receipt, or expense into a digital format before it disappears into a notebook, a glove box, or a camera roll.

## 3. Small Stack, Clear Boundaries

I kept the stack intentionally plain.

- Frontend: `Vue 3` and `Tailwind CSS` on `Cloudflare Pages`
- Backend: `FastAPI` on the `FastAPI Cloud` beta
- Database: `Neon`
- Bot protection: `Cloudflare Turnstile`

That split mattered. `Cloudflare Pages` handled the frontend well, while `FastAPI Cloud` only had to deal with API calls, validation, persistence, and a few OCR experiments. The boundary stayed easy to reason about, and I did not need to spend the first month thinking about servers.

A small stack also kept the cost side realistic, which mattered because I was trying to prove the idea without turning it into an infrastructure project.

## 4. FastAPI Cloud: Fast Enough to Keep Momentum

FastAPI Cloud was one of the reasons I could move quickly.

I did not need to spend much time on reverse proxies, TLS, or deployment plumbing. For a small backend, that was exactly what I wanted: write the FastAPI app, connect the database, deploy it, and keep moving.

It still felt early in a few places. At the time I used it, custom domains were not available in my setup, so I could not serve the API under my own domain. I also could not quite make it fit the continuous deployment flow I normally want for side projects, where pushing to `main` updates the live service without extra steps.

Those were not blockers for ThinLog, but they were useful signals. The platform felt good for fast validation, and I would like to see it keep moving toward smoother deployment and deeper integration options. If it keeps getting simpler while opening the door to model-backed APIs, it could become a very comfortable place for small AI-heavy projects.

## 5. The OCR Detour

My first pass used `Cloudflare AI OCR`.

The plan was straightforward: upload a receipt, extract the text, and fill the draft automatically. It looked neat on paper, and it worked well enough on clean examples. The problem showed up as soon as I started testing with real receipts.

Blurry photos, folded corners, and handwritten notes made the output less reliable than I wanted. At that point I realized the real problem was not just accuracy. It was trust.

Once the app guessed wrong, the user had to check every field anyway. That made the automation feel like extra work rather than help. So I changed the flow.

Instead of forcing OCR to do all the work, I moved the product toward a copy-first, user-driven path. The extracted text became something the user could bring into the form or review quickly, not something the app silently treated as final truth. That version is less flashy, but it is more honest and easier to live with.

## 6. Data Model and Record Capture Flow

I kept the data model boring on purpose.

The first schema needed to reflect how a sole trader actually thinks: a job happened, some time was spent, money came in or went out, and there may be a receipt, note, or attachment. I did not want to bake in a lot of accounting assumptions before I knew the capture flow felt right.

I also wanted the saved record to stay separate from any extracted draft. OCR can be useful, but the parsed text should stay a suggestion until the user confirms it.

The core write flow looked like this:

- the user starts a draft on the frontend
- the frontend generates an idempotency key
- that key is stored in `localStorage`
- the key is sent with the request metadata to the backend
- the backend uses the key to dedupe retries instead of creating a second post

I used `localStorage` because mobile browsers on the move are messy. Refreshes happen. Apps get backgrounded. Connections drop. If the user taps submit twice or comes back after a timeout, I did not want a duplicate record to appear just because the browser resent the request.

This is not a security mechanism. It is a dedupe mechanism. That tradeoff is fine here because the backend still owns the write, and the key only exists to make retries safe. It is one of those small details that does not look exciting in a demo, but matters a lot once real people start using the app on a phone.

## 7. One Frontend Bug That Took Too Long

The ugliest bug I hit was a blank screen during Vue 3 page transitions.

There was no useful console error, which made it extra annoying. The root cause ended up being a `Fragment` and `<transition>` problem. A global `<Toast />` component that I had left at the top level was enough to break the render flow in that setup.

Fixing it forced me to clean up the component structure and understand Vue's transition behavior properly. It was a frustrating bug, but it was also one of the few parts of the project that taught me something concrete I can reuse.

## 8. What I Would Improve Next

If I keep building ThinLog, I do not want to start by adding a pile of features.

The first area I would improve is UX. The current version is usable, but I would like the record capture flow to ask for even less typing. Small things matter on a phone: better defaults, fewer required fields, clearer save states, and a smoother way to come back to unfinished records. The goal is not to make the interface more impressive. It is to make it easier to trust when someone is tired, offline, or in a hurry.

The second area is OCR and AI-assisted extraction. I still think there is value there, but I would treat it as a review workflow rather than a magic upload button. The app should extract what it can, highlight fields that look uncertain, and let the user confirm the final record quickly. That feels more honest than pretending the model is always right, and it keeps the user in control of the source of truth.

The third direction is connecting capture to the next step. Once a job log or expense is recorded, the user may want to move straight into invoicing or collecting payment. I would be interested in a lightweight invoice-to-payment flow, or simple payment links, not because ThinLog should become a full accounting product, but because the workflow feels more complete when "I did the job" can flow naturally into "I got paid."

I would also keep tuning the deployment workflow. The current setup was enough to ship, but smoother custom domains and a cleaner automatic deploy path would make the project feel more production-ready.

## 9. What I Took Away

ThinLog was not a big architecture project. It was a small product experiment built from a news headline, a beta invite, and a real annoyance I kept seeing in the UK.

The main lesson for me was simple: the first interaction matters more than the clever part. If the app feels easy to start with, people will try it. If it feels smart but unreliable, they will stop trusting it.

ThinLog is at [app.thinlog.uk](https://app.thinlog.uk/) if you want to see where it ended up.

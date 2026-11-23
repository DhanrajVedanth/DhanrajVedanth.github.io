/*
 * Public portfolio content. All employer case studies are intentionally sanitized.
 * Keep internal identifiers, customer data, private URLs, account IDs and exact
 * production topology out of public revisions. See docs/EDITORIAL_GUIDE.md.
 */
export const PROFILE = {
  name: 'Dhanraj Vedanth Raghunathan',
  short: 'Dhanraj Raghunathan',
  headline: 'Architecting the systems behind reliable AI.',
  title: 'Principal Engineer · Distributed Systems & Agent Platforms',
  location: 'Bay Area, California',
  github: 'https://github.com/DhanrajVedanth',
  linkedin: 'https://www.linkedin.com/in/dhanrajraghunathan/',
  resume: './resume.pdf'
};

export const CATEGORIES = ['All systems', 'Agent platforms', 'Cloud infrastructure', 'Reliability & safety'];

export const CASES = [
  {
    id:'ignis', order:'01', name:'Ignis', category:'Agent platforms', group:'PLATFORM ARCHITECTURE',
    subtitle:'A framework-independent foundation for production agents', status:'Implemented platform', stage:'Production-facing',
    tags:['Python','MCP','Claude Agent SDK','Google ADK','Tool contracts'],
    overview:'A shared, versioned library that keeps domain tools, knowledge, request context, and agent definitions independent from the particular agent runtime. The ambition: change orchestration frameworks without rebuilding business integrations.',
    problem:'As agent products multiplied, each consumer carried copies of API clients, billing logic, prompts, and tool wrappers. Divergent copies created drift and made framework changes expensive.',
    role:'Originated the architecture and built substantial portions of the shared tool plane, dispatch plumbing, knowledge integration, and reusable library surface, collaborating with other engineers on backends and testing.',
    outcome:'Established a shared dependency used by Troubleshooting, FinOps, and internal incident-response workflows; made reuse and versioned prompt distribution first-class design constraints.',
    question:'How do you change the agent runtime without rewriting every integration?',
    decisions:[
      {title:'Definitions are portable',body:'Keep agent roles, operating instructions, and tool expectations in versioned Markdown definitions; adapt how each runtime loads and executes them.'},
      {title:'One governed tool plane',body:'Share typed read-oriented tools and backend clients through a stable interface rather than duplicating wrappers inside each agent.'},
      {title:'Deterministic logic stays deterministic',body:'Billing arithmetic, scope checks, and result limits belong in code—not in prompts or probabilistic model output.'},
      {title:'Version and check drift',body:'Ship a package with explicit dependency versions; sync and validate generated agent definitions across consumers. Not every consumer-side check was enforced in CI.'}
    ],
    tradeoffs:[
      ['Portability vs perfect abstraction','A narrow shared interface prevents framework lock-in without hiding every useful runtime capability.'],
      ['Centralization vs coupling','Reuse reduces copy/paste drift, but version upgrades and contracts require discipline.'],
      ['Model flexibility vs predictable behavior','Give the model reasoning freedom but keep access boundaries and computation in code.']
    ],
    lessons:'A portable agent system is less about inventing another framework and more about deciding which behavior must never depend on one.',
    confidentiality:'Conceptual public diagram. Internal tool schemas, account layout, private code, and endpoint names are deliberately omitted.'
  },
  {
    id:'troubleshooting', order:'02', name:'Troubleshooting Agent', category:'Agent platforms', group:'PRODUCTION AI',
    subtitle:'Evidence-driven multi-agent investigations for support engineers', status:'Production system', stage:'Production',
    tags:['Claude Agent SDK','GKE','Multi-agent','Guardrails','Evals'],
    overview:'A support-case investigator that coordinates specialized read-only agents, collects verifiable cloud evidence, and produces a grounded conclusion under an externally imposed deadline.',
    problem:'Cloud incidents span control-plane state, logs, configuration, and product knowledge. Engineers needed reliable synthesis without permitting an AI investigator to mutate customer infrastructure.',
    role:'Architected and built the coordinator runtime, routing, profile isolation, evidence harvesting, safeguards, and several reliability improvements; regional deployment ownership and some integrations were delivered by teammates.',
    outcome:'An integrated support agent with explicit evidence quality, bounded execution, and code-backed read-only policies; ongoing model and orchestration evaluations target report usefulness and deadline completion.',
    question:'How do you get a useful answer when some specialists may time out?',
    decisions:[
      {title:'Read-only by construction',body:'Specialist tools only inspect or describe systems; suggested remediations are recommendations, not automatically executed changes.'},
      {title:'Evidence before prose',body:'The coordinator collects structured observations; a separate synthesis boundary turns them into a report that distinguishes confirmed findings and uncertainty.'},
      {title:'Time is an architecture constraint',body:'Dispatch and harvest stages have to fit an upstream deadline. Partial evidence and explicit limitations are preferable to a late answer that is discarded.'},
      {title:'Regional execution boundaries',body:'Deployment uses region-scoped projects and isolated agent pods. Tenant/environment routing and context are enforced in application code.'}
    ],
    tradeoffs:[
      ['Agent autonomy vs on-time results','More model reasoning can deepen investigations but steal time from the most useful evidence-gathering specialists.'],
      ['Parallel workers vs report coherence','Concurrent specialists improve coverage but require aggregation and a clear evidence contract.'],
      ['Strict output gates vs rollout risk','Some stronger enforcement modes exist or were designed, but not all were enabled in production.']
    ],
    lessons:'A production agent is a deadline-aware distributed workflow with an LLM inside it—not a long chat transcript.',
    confidentiality:'Deployment is intentionally simplified. Project IDs, region counts, exact log/catalog names, internal cases, and tenant identifiers are excluded.'
  },
  {
    id:'billing', order:'03', name:'Billing Rearchitecture', category:'Cloud infrastructure', group:'DISTRIBUTED SYSTEMS',
    subtitle:'Tenant-ordered metering, deterministic credits, safe migration', status:'Implemented platform', stage:'Production-facing',
    tags:['Go','AWS','EKS','SQS FIFO','Event-driven'],
    overview:'A Go-based metering architecture that migrates hourly usage processing from a fragmented legacy workflow into recoverable, tenant-ordered aggregation and credit computation.',
    problem:'Usage billing cannot be treated as an ordinary background task. Duplicate work, partial failures, cross-tenant interference, and incompatible listing contracts create correctness risks.',
    role:'Architected and co-developed the Go billing redesign while building on earlier experience owning tiered billing, marketplace compatibility, and AWS cloud workflows.',
    outcome:'Introduced per-tenant ordering, replay-aware processing, audit artifacts, and a feature-flagged coexistence path with the legacy pipeline.',
    question:'How do you evolve financial infrastructure while preserving correctness?',
    decisions:[
      {title:'Tenant is the ordering unit',body:'Use tenant-grouped queue semantics to prevent overlapping compute for one tenant while retaining concurrency across tenants.'},
      {title:'Compute before publishing',body:'Aggregate usage and apply credits in deterministic code before emitting auditable records for downstream publishing.'},
      {title:'Design for retry, not luck',body:'Persist intermediate artifacts and guard deletion/advancement to make partial failures recoverable.'},
      {title:'Migrate per tenant',body:'Run old and new paths behind controlled routing so compatibility can be validated incrementally rather than through a single global cutover.'}
    ],
    tradeoffs:[
      ['FIFO ordering vs throughput','Tenant-level serialization simplifies correctness, while different tenants can still process in parallel.'],
      ['Auditability vs pipeline complexity','Durable intermediate data costs storage and coordination but makes failures easier to reconcile.'],
      ['Dual-run migration vs maintenance','Coexistence increases temporary operational cost but reduces cutover risk.']
    ],
    lessons:'In billing, observability and replayability are part of correctness—not afterthoughts.',
    confidentiality:'A public abstraction of the data path; actual contracts, schemas, credit formulas, and accounts are omitted.'
  },
  {
    id:'gatekeeper', order:'04', name:'Gatekeeper', category:'Reliability & safety', group:'CODE MODE / RESEARCH',
    subtitle:'Let AI propose a test; let deterministic software judge it', status:'Design & proof of concept', stage:'Prototype',
    tags:['Code mode','Sandboxing','Diff analysis','Deterministic tests','Release safety'],
    overview:'An AI-assisted regression-checking design that compares a deployed baseline with a candidate release, identifies high-risk changes, and proposes executable probes against sanitized, production-shaped fixtures.',
    problem:'Some release regressions only appear with messy historical data or cross-service state. Human reviewers cannot manually reproduce the consequences of every diff.',
    role:'Originated the design and proof-of-concept experiments, defining the trust boundaries between an LLM planner, an isolated probe runner, deterministic comparison, and the human release owner.',
    outcome:'A proposed workflow and local experiments demonstrating the architecture; it is not a deployed or production-approved release gate.',
    question:'How can an agent write tests without gaining authority over production?',
    decisions:[
      {title:'Untrusted code has no cloud authority',body:'Model-generated probes execute in an isolated runner without production credentials or network access.'},
      {title:'Data is sanitized before testing',body:'Replay representative data shapes, not raw customer records, to expose regressions without disclosing sensitive inputs.'},
      {title:'Verdicts are deterministic',body:'The agent suggests investigations; explicit assertions compare baseline versus candidate outcomes.'},
      {title:'A human remains the release gate',body:'Gatekeeper reports evidence and replay instructions; it does not authorize deployment.'}
    ],
    tradeoffs:[
      ['Realism vs privacy','Fixtures must resemble failure-causing input shapes while containing no sensitive customer material.'],
      ['Exploration vs containment','Open-ended probe generation can discover edge cases but requires strict runtime limits.'],
      ['Model verdict vs test verdict','The deterministic harness owns pass/fail to avoid persuasive but unsupported AI judgments.']
    ],
    lessons:'The safety breakthrough is not asking a model to be careful. It is designing a system in which the model cannot overstep.',
    confidentiality:'Conceptual design only. Gatekeeper remains a design/PoC effort; this page does not claim production deployment.'
  },
  {
    id:'command-center', order:'05', name:'Command Center', category:'Agent platforms', group:'INTERNAL ENGINEERING PRODUCT',
    subtitle:'A single-region cockpit for incident triage and reliability evidence', status:'Implemented internal tool', stage:'Internal',
    tags:['Google ADK','FastAPI','React','Reliability','Human feedback'],
    overview:'An internal engineering console bringing incident investigation, reliability signals, billing diagnostics, and feedback into a single evidence-backed workspace.',
    problem:'On-call teams otherwise stitch together logs, tickets, control-plane state, runbooks, and deployment changes across many tools.',
    role:'Architected and built core Command Center subsystems including investigation flows, reliability evidence collection, and learning workflows; some individual supporting features were teammate-owned.',
    outcome:'A single-region internal tool optimized for engineer workflows, with read-only production access and a feedback path that improves reusable incident knowledge.',
    question:'How do you make AI incident analysis credible to the engineer on call?',
    decisions:[
      {title:'Proof contract over chatbot answers',body:'Claims must point to evidence actually collected by a successful tool call; unsupported causal certainty is not a valid outcome.'},
      {title:'Unify incidents and health',body:'Put reactive incident triage beside proactive fleet, service, change, and billing reliability checks.'},
      {title:'Keep internal deployment simple',body:'A single-region web/API deployment avoids the operational overhead of a regional fan-out when the product is intended for a small internal audience.'},
      {title:'Close the human feedback loop',body:'Engineer reviews and incident outcomes can inform curated knowledge instead of being silently recycled into prompts.'}
    ],
    tradeoffs:[
      ['Simple deployment vs horizontal scale','The tool accepts a simpler single-region deployment model for an internal audience.'],
      ['Fresh evidence vs response time','Live retrieval is more trustworthy than stale memory but raises latency and tool failure risk.'],
      ['Automated synthesis vs accountability','Every conclusion needs provenance; engineers retain ownership of operational decisions.']
    ],
    lessons:'The useful interface is not chat. It is an inspectable investigation where a human can see why a conclusion was reached.',
    confidentiality:'The screenshot-free diagram abstracts away internal systems, identity mechanisms, and storage details.'
  },
  {
    id:'finops', order:'06', name:'FinOps Agent', category:'Agent platforms', group:'CUSTOMER-FACING AI',
    subtitle:'Grounded cloud-cost reasoning with deterministic calculations', status:'Production-facing agent', stage:'Production-facing',
    tags:['Multi-agent','GKE','FinOps','Deterministic math','Evaluation'],
    overview:'A read-only financial analysis agent that turns a natural-language credit question into scoped data collection, deterministic computations, and explainable tables, charts, and recommendations.',
    problem:'Customers need to understand usage, credit runway, unused capacity, and potential overage—but an LLM should never invent billing math or see data outside its tenant scope.',
    role:'Architected and built the agent orchestration and deterministic reporting path; designed evaluation strategy and acceptance criteria, with QA suite implementation performed by another engineer.',
    outcome:'Introduced a separation between language understanding and numerical truth, regional isolation, and validation criteria for customer-facing responses.',
    question:'When a model explains money, where does truth live?',
    decisions:[
      {title:'Plan, gather, calculate, narrate',body:'A lightweight planner and parallel workers acquire scoped observations; a deterministic calculation stage owns all monetary values.'},
      {title:'Read-only tenant boundaries',body:'Backend access is scoped through protected interfaces instead of granting an LLM raw cloud account access.'},
      {title:'A report is a typed product',body:'Compose charts, tables, conclusions, and follow-up suggestions from validated computed results.'},
      {title:'Evaluate the whole answer',body:'Test not just language quality but business rules, safety, missing-data handling, and consistency between narrative and numbers.'}
    ],
    tradeoffs:[
      ['LLM fluency vs numerical correctness','The model can explain findings, but code owns calculations and business-rule enforcement.'],
      ['Parallel gathering vs consistent snapshots','Independent retrieval can improve latency but requires explicit handling for missing or incompatible data.'],
      ['Natural language vs scope','User phrasing never overrides authorization boundaries.']
    ],
    lessons:'Financial agents should never make the model the source of financial truth.',
    confidentiality:'The public diagram omits product event names, customer dimensions, contract formulas, and internal routing identifiers.'
  },
  {
    id:'qrator', order:'07', name:'Qrator & Cloud Control Plane', category:'Cloud infrastructure', group:'AGENT-READY INFRASTRUCTURE',
    subtitle:'Governed operational data access across distributed cloud systems', status:'Implemented platform', stage:'Production-facing',
    tags:['Go','GraphQL','AWS','IAM','APIs'],
    overview:'A Go service that provides typed, governed access to cloud control-plane state and operational workflows, allowing people and agents to investigate distributed resources without directly traversing every backend store.',
    problem:'Operational state spans data stores, lifecycle engines, accounts, and deployment resources. Agents need contextual answers, not unconstrained direct credentials.',
    role:'Architected and built major portions of the API/data-access service and integrated its operations into wider reliability and AI workflows.',
    outcome:'Created a reusable boundary between investigators and cloud internals, with constrained queries, scoped identities, and auditable operations.',
    question:'What should sit between a reasoning agent and production infrastructure?',
    decisions:[
      {title:'Backend state behind typed contracts',body:'Expose purpose-built queries so consumers reason about product concepts instead of raw storage layouts.'},
      {title:'Access scope at the server',body:'Constrain identities and resource access in authenticated backend logic, not only in agent prompts.'},
      {title:'Read versus action separation',body:'Investigation uses read-oriented interfaces; any operational actions follow separate, constrained authorization paths.'},
      {title:'Cloud context is explicit',body:'Route against the requested environment and resource ownership to avoid cross-tenant or cross-region confusion.'}
    ],
    tradeoffs:[
      ['Flexible query surface vs least privilege','Typed queries restrict arbitrary access while allowing common investigative workflows.'],
      ['Aggregation vs service coupling','A gateway centralizes context but must be kept reliable and bounded.'],
      ['AI interoperability vs security','A shared tool plane improves reuse but cannot be a backdoor to operational authority.']
    ],
    lessons:'The best agent tool is often a conventional, well-designed backend API.',
    confidentiality:'Sanitized service boundaries only; no endpoint paths, internal identifiers, schemas, credentials, or tenancy metadata.'
  },
  {
    id:'lifecycle', order:'08', name:'Cloud Lifecycle Engineering', category:'Cloud infrastructure', group:'FOUNDATIONAL CLOUD SYSTEMS',
    subtitle:'Orchestration, safe upgrades, dual-stack networking, recovery', status:'Implemented cloud features', stage:'Production-facing',
    tags:['AWS','Step Functions','Kubernetes','Infrastructure','Reliability'],
    overview:'Design and delivery across firewall onboarding, infrastructure lifecycle, rolling upgrades, IPv6 dual-stack, Egress NAT, and failure recovery in a distributed cloud platform.',
    problem:'Changing a distributed firewall service means coordinating several independent cloud resources while preserving customer traffic and recovering safely when one step fails.',
    role:'Designed and implemented key orchestration and networking features over successive PANW roles; led other engineers on major feature integrations and upgrade capabilities.',
    outcome:'Enabled safer lifecycle operations and new product features through explicit state machines, staged rollout, observability, and recovery paths.',
    question:'How do you update critical infrastructure without losing state?',
    decisions:[
      {title:'Workflows are state machines',body:'Model multi-service operations with clear transitions, completion criteria, and compensating paths rather than one long opaque script.'},
      {title:'Optimistic ownership of state',body:'Version/update tokens protect against conflicting lifecycle writers.'},
      {title:'Safe capacity transitions',body:'Upgrade plans must preserve the operational configuration and validate healthy replacement capacity before retiring prior resources.'},
      {title:'Feature compatibility',body:'New networking behavior and integrations require fallbacks, rollout control, and compatibility with existing deployments.'}
    ],
    tradeoffs:[
      ['Availability vs rollout speed','Staged changes are slower than disruptive replacements but materially safer.'],
      ['More workflow states vs recoverability','Explicit state increases implementation complexity while making failure handling auditable.'],
      ['Feature breadth vs safe defaults','Networking and partner integrations need compatible paths during gradual rollout.']
    ],
    lessons:'Distributed cloud engineering is mostly about what happens between the happy-path steps.',
    confidentiality:'Features are described at conceptual level; product-specific partner contracts and state schemas are omitted.'
  }
];

export const ARCHIVE = [
  {name:'Multi-tenant Virtual Cloud & CDN',type:'Cloud & networking',description:'Built virtualized tenant environments with KVM/QEMU, isolated network namespaces and an edge-content layer.',link:'https://github.com/dhanraj-vedanth/IaaS_VPC_CDN'},
  {name:'Xinu OS Extensions',type:'Operating systems',description:'Implemented scheduler, demand paging, synchronization, and priority-inheritance features.',link:'https://github.com/dhanraj-vedanth/Xinu'},
  {name:'Reliable UDP & P2P Index',type:'Systems programming',description:'Explored reliability over UDP and a multi-threaded TCP peer discovery protocol.',link:'https://github.com/dhanraj-vedanth/point_to_multipoint_with_ARQ'},
  {name:'Network Automation & Looking Glass',type:'Automation',description:'Earlier Python, SSH, and Ansible systems for operational visibility and infrastructure automation.',link:'https://github.com/dhanraj-vedanth/Subnet_Calculator'},
  {name:'Spotify & YouTube Automation',type:'Personal project',description:'A small CLI integration between public music-platform APIs.',link:'https://github.com/dhanraj-vedanth/spotify_python_automation'}
];

export const TIMELINE = [
  {year:'2025–Present',title:'Principal Engineer',company:'Palo Alto Networks',desc:'Cloud billing rearchitecture, shared agent infrastructure, production agents, code-mode release-safety research, technical leadership.'},
  {year:'2023–2025',title:'Senior Staff Software Engineer',company:'Palo Alto Networks',desc:'Cloud lifecycle, distributed billing, networking features, and reliability engineering.'},
  {year:'2022–2023',title:'Staff Software Engineer',company:'Palo Alto Networks',desc:'Foundational cloud service operations, automation and platform resilience.'},
  {year:'2021–2022',title:'Tools and Automation Engineer II',company:'Apple',desc:'Bluetooth automation and device performance testing.'},
  {year:'2020',title:'Network Automation Engineering Intern',company:'Meta',desc:'Automated network break-fix workflows and asynchronous backend services.'},
  {year:'2018–2019',title:'Network Automation Engineer',company:'Tata Communications',desc:'Python/Ansible tooling and infrastructure automation.'}
];

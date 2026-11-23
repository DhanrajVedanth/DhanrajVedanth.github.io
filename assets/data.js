/*
 * Public portfolio content. All employer case studies are intentionally sanitized.
 * Keep internal identifiers, customer data, private URLs, account IDs and exact
 * production topology out of public revisions. See docs/EDITORIAL_GUIDE.md.
 */
export const PROFILE = {
  name: 'Dhanraj Vedanth Raghunathan',
  short: 'Dhanraj Raghunathan',
  headline: 'Distributed systems and AI agents',
  title: 'Principal Engineer · Distributed Systems & Agent Platforms',
  location: 'Bay Area, California',
  github: 'https://github.com/DhanrajVedanth',
  linkedin: 'https://www.linkedin.com/in/dhanrajraghunathan/',
  resume: './resume.pdf'
};

export const CATEGORIES = ['All systems', 'Agent platforms', 'Cloud infrastructure', 'Reliability & safety'];

export const CASES = [
  {
    id:'agent-platform', name:'Portable agent platform', category:'Agent platforms',
    subtitle:'Moving agent definitions between runtimes',
    problem:'Maintaining the same integrations in several agents made it expensive to fix bugs or change runtimes.',
    role:'I originated and led work on a shared platform for agent definitions and tools.',
    outcome:'The engineering goal was to make integrations reusable across agents without tying them to one runtime.',
    decisions:[{title:'Runtime portability',body:'Keep the agent\'s instructions and tool interfaces independent of the runtime that reads them.'}],

  },
  {
    id:'troubleshooting', name:'Troubleshooting Agent', category:'Agent platforms',
    subtitle:'Helping support engineers investigate cloud incidents',
    problem:'A support engineer often has to assemble a timeline from several sources before deciding where to look next.',
    role:'I led architecture and implementation for a support investigation agent, focusing on safeguards, evidence collection and evaluation.',
    outcome:'The agent gives engineers evidence to inspect before they decide what to do next.',
    decisions:[{title:'Partial results',body:'When an evidence source is slow or unavailable, show the gap and report what the other sources established.'}],

  },
  {
    id:'billing', name:'Cloud billing migration', category:'Cloud infrastructure',
    subtitle:'Changing usage metering without interrupting billing',
    problem:'A migration has to keep customers\' billing consistent even if usage arrives late or a processing job is repeated.',
    role:'I architected and co-developed a redesign of cloud usage metering and led work on the migration design.',
    outcome:'The design supported incremental rollout and recovery from failed processing.',
    decisions:[{title:'Replay and comparison',body:'Test how the old and new systems handle the same example usage before using the new path for billing.'}],

  },
  {
    id:'release-testing', name:'AI-assisted release testing', category:'Reliability & safety',
    subtitle:'A prototype for selecting useful regression tests',
    problem:'A release diff can be too large to test exhaustively, and a generated test needs meaningful assertions.',
    role:'I designed and prototyped a workflow for AI-assisted regression checks.',
    outcome:'The prototype explored where a generated test can help a human reviewer.',
    decisions:[{title:'Test evidence',body:'Run a candidate and baseline on the same synthetic inputs, then make differences visible to a reviewer.'}],

  },
  {
    id:'incident-response', name:'Incident response console', category:'Agent platforms',
    subtitle:'Bringing evidence into the on-call workflow',
    problem:'On-call engineers often switch between several tools to collect the evidence needed to investigate one incident.',
    role:'I designed and built parts of an investigation and reliability console.',
    outcome:'The console brought investigation and service health into one workflow for engineers.',
    decisions:[{title:'Incident handoff',body:'Keep observations with the investigation so the next engineer can retrace how a conclusion was reached.'}],

  },
  {
    id:'finops', name:'FinOps Agent', category:'Agent platforms',
    subtitle:'Explaining cloud spend with reproducible calculations',
    problem:'A cost assistant needs to explain its figures clearly enough for someone to check the result.',
    role:'I led architecture for a cloud cost assistant and designed its evaluation approach.',
    outcome:'The assistant explains cloud usage and spending in plain language.',
    decisions:[{title:'Explain the calculation',body:'Record the inputs and calculation used so a reader can check a figure without asking the model to reproduce it.'}],

  },
  {
    id:'operational-access', name:'Operational data access', category:'Cloud infrastructure',
    subtitle:'Making cloud operational data easier to query safely',
    problem:'Engineers and automated tools need a consistent way to ask questions about distributed resources.',
    role:'I designed and built an operational API for engineers and automation.',
    outcome:'The service gave consumers a shared way to query operational data with access controls.',
    decisions:[{title:'Narrow interfaces',body:'Define a small set of supported queries and authorize them at the service boundary.'}],

  },
  {
    id:'lifecycle', name:'Cloud lifecycle engineering', category:'Cloud infrastructure',
    subtitle:'Making infrastructure changes recoverable',
    problem:'Cloud provisioning and upgrades can fail between steps, leaving the workflow and infrastructure in different states.',
    role:'I led engineering work on provisioning, networking and infrastructure upgrades.',
    outcome:'The work improved support for lifecycle changes and recovery paths.',
    decisions:[{title:'Recoverable changes',body:'Store enough progress to retry a step safely and verify capacity before advancing a rolling update.'}]
  }
];

export const ARCHIVE = [
  {name:'Multi-tenant Virtual Cloud & CDN',type:'Cloud & networking',description:'Built virtualized tenant environments with KVM/QEMU, isolated network namespaces and an edge-content layer.',link:'https://github.com/dhanraj-vedanth/IaaS_VPC_CDN'},
  {name:'Xinu OS Extensions',type:'Operating systems',description:'Implemented scheduler, demand paging, synchronization, and priority-inheritance features.',link:'https://github.com/DhanrajVedanth/Xinu'},
  {name:'Reliable UDP & P2P Index',type:'Systems programming',description:'Explored reliability over UDP and a multi-threaded TCP peer discovery protocol.',link:'https://github.com/dhanraj-vedanth/point_to_multipoint_with_ARQ'},
  {name:'Network Automation & Looking Glass',type:'Automation',description:'Earlier Python, SSH, and Ansible systems for operational visibility and infrastructure automation.',link:'https://github.com/dhanraj-vedanth/Subnet_Calculator'},
  {name:'Spotify & YouTube Automation',type:'Personal project',description:'A small CLI integration between public music-platform APIs.',link:'https://github.com/DhanrajVedanth/spotify_python_automation'}
];

export const TIMELINE = [
  {year:'2025–Present',title:'Principal Engineer',company:'Palo Alto Networks',desc:'Cloud billing rearchitecture, shared agent infrastructure, production agents, code-mode release-safety research, technical leadership.'},
  {year:'2023–2025',title:'Senior Staff Software Engineer',company:'Palo Alto Networks',desc:'Cloud lifecycle, distributed billing, networking features, and reliability engineering.'},
  {year:'2022–2023',title:'Staff Software Engineer',company:'Palo Alto Networks',desc:'Foundational cloud service operations, automation and platform resilience.'},
  {year:'2021–2022',title:'Tools and Automation Engineer II',company:'Apple',desc:'Bluetooth automation and device performance testing.'},
  {year:'2020',title:'Network Automation Engineering Intern',company:'Meta',desc:'Automated network break-fix workflows and asynchronous backend services.'},
  {year:'2018–2019',title:'Network Automation Engineer',company:'Tata Communications',desc:'Python/Ansible tooling and infrastructure automation.'}
];

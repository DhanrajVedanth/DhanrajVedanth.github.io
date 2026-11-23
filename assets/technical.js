// Public reference designs. Scenarios, interfaces, and identifiers are illustrative.
const examples = {
  'agent-platform': {
    title: 'Definition loading and tool dispatch',
    path: [
      ['Definition', 'Version the instructions and required tool contracts together.'],
      ['Validator', 'Check that every required tool is registered and that its input schema is compatible.'],
      ['Runtime adapter', 'Translate the validated definition into runtime-specific registration and lifecycle calls.'],
      ['Invocation gateway', 'Bind request identity outside the model, validate arguments, and apply a result limit.'],
      ['Domain handler', 'Execute the operation against the authorized resource and return a typed result.'],
    ],
    links: ['Versioned definition', 'Validated definition', 'Tool request + context', 'Scoped arguments'],
    fault: ['Schema mismatch', 'Reject activation of the incompatible pair and retain the last validated version.'],
    at: 1,
    tradeoff: 'A common contract makes portability testable, but cancellation and streaming still need adapter-specific tests. Replay the same fixtures against both adapters and compare the normalized results.',
  },
  troubleshooting: {
    title: 'Deadline and evidence coverage',
    path: [
      ['Request context', 'Resolve scope and establish an end-to-end deadline before admitting work.'],
      ['Dependency planner', 'Start independent checks together. A time-windowed query that needs an event timestamp waits for the check that supplies it.'],
      ['Admission check', 'Admit a specialist only when remaining time covers its minimum execution budget plus the reporting reserve.'],
      ['Read-only checks', 'Return a terminal status and bounded observations with evidence references. Dispatch acknowledgement alone does not complete a check.'],
      ['Report synthesis', 'Assemble a bounded report outside the investigation loop. State which checks completed and cite the observations supporting each conclusion.'],
    ],
    links: ['Scope + deadline', 'Eligible checks', 'Budgeted dispatch', 'Evidence + status'],
    fault: ['Coverage gap', 'If a check was skipped or timed out, show the gap in the report. Absence of evidence from that check cannot rule out a cause.'],
    at: 2,
    tradeoff: 'Waiting for a whole batch simplifies result collection, but one slow check can delay unrelated decisions. Selective background dispatch is a design option that needs explicit task tracking and a cutoff before synthesis.',
  },
  billing: {
    title: 'Replay-safe usage processing',
    path: [
      ['Usage event', 'A synthetic usage event carries a stable event ID, account scope, and metering window.'],
      ['Window aggregation', 'Group work by account and window, preserving order where one calculation depends on another.'],
      ['Calculation', 'Apply versioned rules to the normalized inputs and retain the inputs needed to explain the result.'],
      ['Durable record', 'Persist the result and its publication identity before attempting external submission.'],
      ['Publisher', 'Publish with a stable identity and record the acknowledgement so retries can distinguish completed work from an uncertain outcome.'],
    ],
    links: ['Event + identity', 'Normalized window', 'Result + rule version', 'Publication record'],
    fault: ['Uncertain submission', 'Resolve a timeout with acknowledgement lookup or reconciliation before sending a second charge.'],
    at: 4,
    tradeoff: 'Ordering simplifies accounting within one account, but can create a hot partition. During migration, compare both paths on the same fixture and authorize publication from only one path.',
  },
  'release-testing': {
    title: 'Comparing releases on synthetic fixtures',
    path: [
      ['Release comparison', 'Identify changed behavior and select representative, benign input fixtures.'],
      ['Test plan', 'Specify the expected property, inputs, and observations for a regression check.'],
      ['Fixture validator', 'Reject unsupported test types and require matching inputs for both runs.'],
      ['Isolated runner', 'Run the same approved checks against the baseline and candidate with bounded execution.'],
      ['Result comparison', 'Compare normalized observations against explicit assertions and present results for human review.'],
    ],
    links: ['Behavior changes', 'Check + assertion', 'Approved fixture', 'Paired observations'],
    fault: ['Inconclusive check', 'A timeout, missing baseline, or unstable fixture requires review before it can affect a release decision.'],
    at: 3,
    tradeoff: 'This prototype explores how to broaden regression coverage. Explicit assertions make verdicts reproducible, but reviewer judgment is still needed when the expected behavior changes.',
  },
  'incident-response': {
    title: 'From incident evidence to reusable guidance',
    path: [
      ['Investigation', 'Record observations and references alongside the initial hypothesis.'],
      ['Resolution record', 'Collect the final outcome and distinguish an engineer correction from an unverified suggestion.'],
      ['Review queue', 'Check that a candidate lesson is supported, reusable, and free of incident-specific data.'],
      ['Knowledge index', 'Index approved guidance with applicability and provenance metadata.'],
      ['Later investigation', 'Retrieve by symptom and context. Compare the retrieved pattern with evidence from the current incident.'],
    ],
    links: ['Evidence references', 'Outcome + provenance', 'Approved guidance', 'Scoped search result'],
    fault: ['Unverified lesson', 'Reject unsupported or contradictory guidance and keep it out of retrieval.'],
    at: 2,
    tradeoff: 'Exact-term search is useful for distinctive symptoms. Semantic search can find differently worded matches, but review and scope metadata are needed to keep near matches from becoming unsupported conclusions.',
  },
  finops: {
    title: 'From cost question to reconciled report',
    path: [
      ['Question and scope', 'Resolve the billing period, authorized account, and units before any data retrieval.'],
      ['Analysis plan', 'Translate the question into supported operations and show the requested scope for approval.'],
      ['Data workers', 'Retrieve independent usage and pricing inputs in parallel where possible, preserving timestamps and units.'],
      ['Calculation', 'Apply explicit units, decimal arithmetic, and rule versions to produce the authoritative result.'],
      ['Report validation', 'Build the table and narrative from the same calculated values. Verify that totals reconcile and projections are identified.'],
    ],
    links: ['Period + scope', 'Approved operations', 'Typed usage inputs', 'Amounts + assumptions'],
    fault: ['Missing billing input', 'Report the affected figures as unavailable and identify which parts were successfully calculated.'],
    at: 3,
    tradeoff: 'Parallel data retrieval reduces latency, while a single calculation and validation boundary keeps the narrative and table consistent. A projection needs a time horizon and assumptions distinct from observed usage.',
  },
  'operational-access': {
    title: 'Scoped access to operational records',
    path: [
      ['Consumer', 'An engineer or agent chooses a supported operation with typed parameters.'],
      ['Identity context', 'Derive identity and scope from authenticated context independently of request text.'],
      ['Authorization', 'Check the operation and resource scope before resolving the backing data.'],
      ['Query adapter', 'Translate the allowed operation into a bounded query and enforce pagination and result limits.'],
      ['Response and audit', 'Return only the fields needed for the operation and record the policy decision for review.'],
    ],
    links: ['Typed operation', 'Trusted identity + scope', 'Authorized query', 'Bounded records'],
    fault: ['Scope rejected', 'Deny the request before the backing query and emit a decision record with no sensitive payload.'],
    at: 2,
    tradeoff: 'A typed query surface costs more to extend than unrestricted access. In return, callers share pagination and scope rules, and authorization tests can cover each operation explicitly.',
  },
  lifecycle: {
    title: 'Rolling replacement with checkpoints',
    path: [
      ['Desired state', 'Record the target configuration and an operation generation so concurrent requests can be distinguished.'],
      ['Reconcile', 'Compare observed resources with the desired generation and pick the next incomplete action.'],
      ['Create replacement', 'Provision replacement capacity with a stable operation identity so a retry can find the same resource.'],
      ['Health gate', 'Check that the replacement is ready and preserves the required configuration before retiring capacity.'],
      ['Commit progress', 'Retire superseded capacity after verification, then persist the checkpoint for the next replacement.'],
    ],
    links: ['Desired generation', 'Next action', 'Candidate capacity', 'Verified readiness'],
    fault: ['Health check failed', 'Keep existing capacity serving, classify the failed candidate, and retry or roll back from the last durable checkpoint.'],
    at: 3,
    tradeoff: 'Replacing one unit at a time lowers the risk of losing healthy capacity. It extends rollout time and temporarily requires additional capacity during each replacement.',
  },
};

const walkthroughTypes = {
  'agent-platform': ['storage', 'control', 'service', 'tool', 'cloud'],
  troubleshooting: ['cloud', 'agent', 'control', 'tool', 'agent'],
  billing: ['cloud', 'queue', 'service', 'database', 'service'],
  'release-testing': ['storage', 'agent', 'control', 'cloud', 'service'],
  'incident-response': ['user', 'database', 'queue', 'index', 'agent'],
  finops: ['user', 'agent', 'tool', 'service', 'control'],
  'operational-access': ['user', 'cloud', 'control', 'tool', 'telemetry'],
  lifecycle: ['database', 'service', 'cloud', 'control', 'database'],
};

export function technicalDiagram(caseId) {
  const example = examples[caseId];
  const nodes = example.path.map(([label, detail], i) => ({
    id: `stage-${i}`, label, detail, x: 48 + i * 248, y: 160,
    kind: walkthroughTypes[caseId][i],
    sub: `Step ${i + 1}`,
  }));
  const [label, detail] = example.fault;
  nodes.push({id: 'exception', label, detail, x: nodes[example.at].x, y: 400, kind: 'control', sub: 'Exception'});
  const edges = example.links.map((label, i) => ({
    from: nodes[i].id, to: nodes[i + 1].id, label,
  }));
  edges.push({from: nodes[example.at].id, to: 'exception', label: 'Exception path'});
  return {
    title: example.title,
    description: 'Public reference design with an illustrative request and exception path.',
    nodes,
    edges,
    steps: nodes.map(node => ({name: node.label, focus: node.id, text: node.detail})),
    tradeoff: example.tradeoff,
  };
}

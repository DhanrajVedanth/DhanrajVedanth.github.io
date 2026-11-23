// Provider-neutral reference architectures. Numbers are diagram coordinates.
const designs = {
  troubleshooting: [
    ['client',0,1,'user','Support console','Submits a question in an existing session and displays the report and check coverage.'],
    ['api',1,1,'cloud','Request gateway','Authenticates the caller, resolves resource scope and establishes the request deadline.'],
    ['context',2,1,'service','Context builder','Builds the current model context from eligible conversation turns, working state and retrieved references. Each source has its own token budget.'],
    ['runtime',3,1,'agent','Agent coordinator','Chooses independent read-only checks and defers dependent checks until prerequisites arrive. Preserves a reporting reserve.'],
    ['tools',4,1,'tool','Read-only tools','Collect bounded observations from authorized sources. Each completed check returns evidence references and an outcome.'],
    ['history',1,0,'database','Conversation history','Illustrative transcript store keyed by session. Holds user and assistant turns in order.'],
    ['memory',2,0,'database','Session memory','Illustrative working state keyed by session. Holds resolved scope, pending checks and evidence pointers. The context builder can load just the relevant state.'],
    ['index',2,2,'index','Runbook index','Returns applicable diagnostic guidance. The report still needs evidence from this request.'],
    ['evidence',4,0,'storage','Evidence artifacts','Retains full check outputs separately from the bounded handoff. Evidence references point to specific observations.'],
    ['report',3,2,'agent','Report synthesizer','Runs outside the coordinator loop. Uses terminal check statuses and bounded evidence handoffs to compile a report, explicitly marking missing coverage.'],
    ['trace',4,2,'telemetry','Trace collector','Records admission, completion and timeout events for diagnosing slow or incomplete investigations.'],
  ],
  finops: [
    ['client',0,1,'user','Cost workspace','Submits a cost question and reviews the scope before execution.'],
    ['context',1,1,'service','Context builder','Resolves period, account and units with the authenticated scope and the latest user turn.'],
    ['planner',2,1,'agent','Planning agent','Selects supported analyses. Replans when the user changes the period or target.'],
    ['gate',3,1,'control','Approval gate','Binds approval to the specific scope and operations. A scope change requires a fresh decision.'],
    ['workers',4,1,'tool','Data workers','Fan out independent usage and pricing reads. Carry period, units, and data freshness into each result.'],
    ['history',0,0,'database','Conversation history','Illustrative ordered record of prior questions, clarifications and responses.'],
    ['memory',1,0,'database','Session memory','Illustrative follow-up state for the chosen period, scope and last report ID. Authorization is rechecked on every request.'],
    ['usage',4,0,'database','Usage and rate data','Versioned inputs for usage, pricing and period boundaries.'],
    ['calc',4,2,'service','Cost calculation','Applies explicit units and versioned decimal arithmetic and reports missing inputs.'],
    ['report',3,2,'service','Report validator','Builds displayed values from the same result and checks totals before response.'],
  ],
  'agent-platform': [
    ['repo',0,1,'storage','Definition registry','Stores versioned instructions, tool requirements and compatibility metadata.'],
    ['validate',1,1,'control','Contract validator','Checks required tool names and schemas before activation.'],
    ['adapter',2,1,'service','Runtime adapter','Maps the portable definition to a runtime-specific registration and execution API.'],
    ['agent',3,1,'agent','Agent runtime','Receives the selected definition and bounded request context.'],
    ['gateway',4,1,'tool','Tool gateway','Validates arguments, binds trusted caller scope and routes the allowed operation.'],
    ['sessions',3,0,'database','Session store','Illustrative external store for ordered turns and cross-turn state. Supports runtime swaps without tying all state to the SDK.'],
    ['contracts',1,0,'storage','Schema registry','Supplies versioned tool input and output contracts for compatibility checks.'],
    ['handler',4,2,'cloud','Domain API','Executes an authorized operation and returns a typed result.'],
  ],
  billing: [
    ['meter',0,1,'cloud','Usage producers','Emit usage with stable event identity and metering window.'],
    ['queue',1,1,'queue','Partitioned queue','Groups by account so independent accounts can advance concurrently.'],
    ['agg',2,1,'service','Aggregation worker','Normalizes inputs and deduplicates replays before calculation.'],
    ['ledger',3,1,'database','Usage ledger','Persists the calculated result and publication identity for recovery.'],
    ['send',4,1,'service','Billing publisher','Sends one publication identity and records the downstream acknowledgement.'],
    ['rules',2,0,'storage','Rule catalog','Supplies the version used to calculate and explain each result.'],
    ['audit',3,2,'storage','Audit records','Retains normalized inputs and calculation provenance for comparison.'],
    ['sink',4,2,'cloud','Billing endpoint','Receives the charge record. An uncertain acknowledgement requires reconciliation.'],
  ],
  'release-testing': [
    ['change',0,1,'storage','Release artifacts','Provides versioned baseline and candidate builds.'],
    ['plan',1,1,'agent','Test planner','Selects benign regression checks and explicit expected properties.'],
    ['review',2,1,'control','Fixture policy','Accepts supported tests with comparable inputs.'],
    ['base',3,0,'cloud','Baseline runner','Runs the approved test on the baseline in an isolated environment.'],
    ['candidate',3,2,'cloud','Candidate runner','Runs the same fixture and assertions against the candidate.'],
    ['compare',4,1,'service','Result comparator','Compares normalized observations and marks missing or unstable evidence inconclusive.'],
    ['fixtures',2,0,'storage','Fixture store','Holds synthetic, versioned inputs selected for the comparison.'],
    ['human',4,2,'user','Release reviewer','Reviews differences before making a release decision.'],
  ],
  'incident-response': [
    ['console',0,1,'user','Incident console','Collects observations, hypotheses and engineer corrections.'],
    ['cases',1,1,'database','Case records','Preserves resolution evidence alongside initial findings.'],
    ['curate',2,1,'queue','Review queue','Carries candidate lessons with provenance for human review.'],
    ['publish',3,1,'control','Review and publish','Approves reusable guidance after evidence and disclosure checks.'],
    ['index',4,1,'index','Knowledge index','Indexes approved guidance for keyword and semantic retrieval.'],
    ['later',4,2,'agent','Later investigation','Retrieves applicable guidance and validates it against current observations.'],
    ['audit',3,0,'storage','Review history','Records corrections and publication decisions for traceability.'],
  ],
  'operational-access': [
    ['consumer',0,1,'user','Operator or agent','Invokes a typed operation with resource parameters.'],
    ['api',1,1,'cloud','API gateway','Validates identity and resolves authenticated scope.'],
    ['policy',2,1,'control','Policy evaluator','Authorizes the operation and scope before querying backing services.'],
    ['query',3,1,'tool','Query adapter','Translates the allowed operation to a bounded, paginated lookup.'],
    ['records',4,1,'database','Operational store','Returns projected fields within the authorized scope.'],
    ['audit',2,2,'telemetry','Decision audit','Records the policy outcome and request correlation without the data payload.'],
    ['resource',4,2,'cloud','Cloud resource API','Supplies live resource state where a supported query requires it.'],
  ],
  lifecycle: [
    ['request',0,1,'cloud','Lifecycle API','Accepts a requested target configuration and allocates an operation generation.'],
    ['desired',1,1,'database','Desired state store','Persists target generation and completed checkpoints.'],
    ['control',2,1,'service','Reconciler','Compares desired and observed state and resumes from durable progress.'],
    ['cloud',3,1,'cloud','Cloud resource API','Creates or finds replacement capacity using stable operation identity.'],
    ['check',4,1,'control','Readiness gate','Verifies capacity and configuration before the previous resource is retired.'],
    ['signals',4,0,'telemetry','Health signals','Supplies checks used to confirm readiness.'],
    ['worker',3,2,'queue','Retry queue','Reschedules incomplete operations while existing healthy capacity keeps serving.'],
  ],
};

const edges = {
  troubleshooting: [['client','api','Question and session'],['api','context','Trusted scope and deadline'],['history','context','Relevant turns'],['memory','context','Working state'],['index','context','Applicable guidance'],['context','runtime','Bounded model input'],['runtime','memory','Check state and references'],['runtime','tools','Scoped check plan'],['tools','evidence','Full artifacts'],['tools','report','Bounded handoff'],['evidence','report','Evidence lookup by reference'],['runtime','report','Coverage and cutoff'],['tools','trace','Check outcomes']],
  finops: [['client','context','Question and session'],['history','context','Relevant turns'],['memory','context','Prior report reference'],['context','planner','Scoped input'],['planner','gate','Plan'],['gate','workers','Approved reads'],['usage','workers','Typed records'],['workers','calc','Usage and rates'],['calc','report','Calculated results']],
  'agent-platform': [['repo','validate','Versioned definition'],['contracts','validate','Required interfaces'],['validate','adapter','Validated definition'],['adapter','agent','Runtime registration'],['sessions','agent','Turns and working state'],['agent','gateway','Tool invocation'],['gateway','handler','Authorized arguments']],
  billing: [['meter','queue','Usage event'],['queue','agg','Account and window'],['rules','agg','Rule version'],['agg','ledger','Calculated usage'],['ledger','audit','Calculation record'],['ledger','send','Publication record'],['send','sink','Charge record']],
  'release-testing': [['change','plan','Build comparison'],['plan','review','Check and assertion'],['fixtures','review','Fixture version'],['review','base','Approved fixture'],['review','candidate','Same fixture'],['base','compare','Baseline observation'],['candidate','compare','Candidate observation'],['compare','human','Differences and coverage']],
  'incident-response': [['console','cases','Observations and outcomes'],['cases','curate','Candidate lesson'],['curate','publish','Evidence and provenance'],['publish','audit','Review decision'],['publish','index','Approved guidance'],['index','later','Scoped retrieval']],
  'operational-access': [['consumer','api','Typed request'],['api','policy','Trusted identity and scope'],['policy','query','Authorized operation'],['policy','audit','Allow or deny outcome'],['query','records','Scoped lookup'],['query','resource','Bounded live query']],
  lifecycle: [['request','desired','Target generation'],['desired','control','Current checkpoint'],['control','cloud','Next incomplete action'],['cloud','check','Candidate capacity'],['signals','check','Health observations'],['check','worker','Incomplete operation'],['worker','control','Retry']],
};

const typeNames = {
  user:'User interface', cloud:'Cloud endpoint', service:'Service', agent:'Agent runtime',
  tool:'Tool interface', control:'Policy or gate', database:'Database', storage:'Artifact store',
  index:'Search index', queue:'Queue', telemetry:'Telemetry',
};

export function componentDiagram(caseId) {
  const nodes = designs[caseId].map(([id, column, row, kind, label, detail]) => ({
    id, x: 34 + column * 248, y: 62 + row * 188, kind, label, detail, sub: typeNames[kind],
  }));
  return {
    title: 'Components and data flow',
    description: 'Provider-neutral reference architecture. Component names, interfaces, and storage boundaries illustrate the design.',
    nodes,
    edges: edges[caseId].map(([from,to,label]) => ({from,to,label})),
    steps: nodes.map(({id,label,detail}) => ({focus:id,name:label,text:detail})),
    topology: true,
  };
}

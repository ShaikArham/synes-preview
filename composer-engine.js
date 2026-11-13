
// SYNES Composer v0: safe, deterministic graph compiler and executor.
// No eval, dynamic code, outbound HTTP requests, credentials or production actions.
const TYPES=new Set(['trigger','transform','condition','approval','output']);
function validate(graph){
 const errors=[];
 if(!graph||!Array.isArray(graph.nodes)||!Array.isArray(graph.edges))return {valid:false,errors:['Expected nodes and edges arrays']};
 const ids=new Set();
 for(const n of graph.nodes){
  if(!n||typeof n.id!=='string'||!n.id.trim()||ids.has(n.id))errors.push('Invalid or duplicate node ID');
  else ids.add(n.id);
  if(!TYPES.has(n?.type))errors.push('Unsupported node type: '+n?.type);
 }
 const indegree=new Map(graph.nodes.map(n=>[n.id,0])),out=new Map(graph.nodes.map(n=>[n.id,[]]));
 const nodeById=new Map(graph.nodes.map(n=>[n.id,n]));const seenEdges=new Set();
 for(const e of graph.edges){
  if(!ids.has(e?.from)||!ids.has(e?.to)){errors.push('Edge references missing node');continue;}
  if(e.from===e.to)errors.push('Self-connection is not allowed');
  if(e.branch!==undefined&&e.branch!=='true'&&e.branch!=='false')errors.push('Invalid edge branch');
  if(e.branch!==undefined&&nodeById.get(e.from)?.type!=='condition')errors.push('Only conditions may have branch labels');
  if(nodeById.get(e.from)?.type==='condition'&&e.branch===undefined)errors.push('Condition edges require a branch label');
  const edgeKey=e.from+'|'+e.to+'|'+(e.branch||'');if(seenEdges.has(edgeKey))errors.push('Duplicate connection');seenEdges.add(edgeKey);
  if(nodeById.get(e.to)?.type==='trigger')errors.push('Trigger cannot have incoming connections');
  if(nodeById.get(e.from)?.type==='output')errors.push('Output cannot have outgoing connections');
  indegree.set(e.to,indegree.get(e.to)+1);out.get(e.from).push(e.to);
 }
 for(const n of graph.nodes){
  const incoming=graph.edges.filter(e=>e.to===n.id).length;
  const outgoing=graph.edges.filter(e=>e.from===n.id).length;
  if(incoming>1)errors.push('Multiple incoming paths require an explicit merge node');
  if(n.type!=='condition'&&outgoing>1)errors.push('Only conditions may branch');
  if(n.type==='condition'){
   const branches=graph.edges.filter(e=>e.from===n.id).map(e=>e.branch);
   if(branches.filter(b=>b==='true').length!==1||branches.filter(b=>b==='false').length!==1)errors.push('Condition requires exactly one true and one false path');
  }
 }
 const roots=graph.nodes.filter(n=>n.type==='trigger');
 if(roots.length!==1)errors.push('Exactly one trigger required');
 if(graph.nodes.length>50)errors.push('Node limit exceeded');
 const queue=[...indegree].filter(([,v])=>v===0).map(([id])=>id),order=[];
 while(queue.length){const id=queue.shift();order.push(id);for(const to of out.get(id)){indegree.set(to,indegree.get(to)-1);if(indegree.get(to)===0)queue.push(to);}}
 if(order.length!==graph.nodes.length)errors.push('Cycle detected');
 if(roots.length===1&&order.length===graph.nodes.length){
  const visited=new Set(),todo=[roots[0].id];
  while(todo.length){const id=todo.pop();if(visited.has(id))continue;visited.add(id);todo.push(...out.get(id));}
  if(visited.size!==graph.nodes.length)errors.push('Disconnected nodes');
 }
 return {valid:errors.length===0,errors,order};
}
function compose(message){
 if(typeof message!=='string'||message.trim().length<8)throw Error('Describe a workflow in at least eight characters');
 const lower=message.toLowerCase();
 const nodes=[{id:'start',type:'trigger',label:'Receive sample input'}],edges=[];
 function node(type,label,config={}){const n={id:'step'+nodes.length,type,label,config};nodes.push(n);return n.id;}
 function link(from,to,branch){edges.push(branch?{from,to,branch}:{from,to});}
 const normalized=node('transform','Normalize input',{operation:'copy'});link('start',normalized);
 const conditional=/\b(if|when|exceeds?|greater|above|below|missing|invalid)\b/.test(lower);
 const approval=/approv|permission|review/.test(lower);
 const amount=lower.match(/(?:€|eur\s*)?([\d,]+(?:\.\d+)?)\b/);
 const threshold=amount?Number(amount[1].replace(/,/g,'')):5000;
 if(conditional){
  const condition=node('condition','Check condition',{field:'amount',operator:'gt',value:threshold});
  link(normalized,condition);
  if(approval){
   const gate=node('approval','Human review required');const accepted=node('output','Approved path');const alternative=node('output','No approval needed');
   link(condition,gate,'true');link(gate,accepted);link(condition,alternative,'false');
  }else{
   const yes=node('output','Condition matched');const no=node('output','Condition not matched');
   link(condition,yes,'true');link(condition,no,'false');
  }
 }else{
  let prev=normalized;
  if(approval){const gate=node('approval','Human review required');link(prev,gate);prev=gate;}
  const output=node('output','Record result');link(prev,output);
 }
 return {version:1,title:message.trim().slice(0,80),nodes,edges,mode:'synthetic',limitations:['Template-based parser; unsupported requests require manual configuration']};
}
function execute(graph,input={},options={}){
 const check=validate(graph);if(!check.valid)throw Error(check.errors.join('; '));
 if(!input||typeof input!=='object'||Array.isArray(input))throw Error('Input must be an object');
 const byId=new Map(graph.nodes.map(n=>[n.id,n])),states=new Map(),steps=[];
 for(const id of check.order){
  const node=byId.get(id),edges=graph.edges.filter(e=>e.to===id);
  const active=edges.filter(e=>{const parent=states.get(e.from);return parent?.status==='success'&&(!e.branch||e.branch===String(parent.matched));});
  const pending=edges.some(e=>states.get(e.from)?.status==='waiting_approval'||states.get(e.from)?.status==='blocked');
  if(edges.length&&!active.length){
   const step={id,type:node.type,status:pending?'blocked':'skipped',reason:pending?'Upstream approval pending':'Inactive branch'};
   steps.push(step);states.set(id,step);continue;
  }
  if(active.length>1)throw Error('Multiple active inputs require an explicit merge node');
  const value=active.length?states.get(active[0].from).output:input;
  let status='success',output=value,reason='',matched;
  if(node.type==='condition'){
   const {field,operator,value:target}=node.config||{};
   if(typeof field!=='string'||!['gt','eq','exists'].includes(operator))throw Error('Invalid condition configuration');
   const actual=value?.[field];
   matched=operator==='gt'?typeof actual==='number'&&Number.isFinite(actual)&&typeof target==='number'&&Number.isFinite(target)&&actual>target:operator==='eq'?actual===target:actual!==undefined;
   output={...value,conditionMatched:matched};
  }
  if(node.type==='approval'&&!options.approvedIds?.includes(id)){status='waiting_approval';reason='Explicit approval required';}
  const step={id,type:node.type,status,output:status==='success'?output:undefined,reason,...(matched===undefined?{}:{matched})};
  steps.push(step);states.set(id,step);
 }
 return {status:steps.some(s=>s.status==='waiting_approval')?'waiting_approval':'completed',steps};
}
window.SynesComposer={compose,validate,execute};

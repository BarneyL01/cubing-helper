// Checker for the Roux LSE content in data/roux.js (see log/2026-10-06-home-f2l-roux-lse.md).
// Run it under Node: copy js/ and data/ plus this file into an empty folder that
// has a package.json containing {"type":"module"}, then `node 2026-10-06-roux-lse-check.mjs`.
// Prints "ALL OK" if every 4a/4b/4c card, the DFDB lookup and the whole chain
// (align centres -> 4a -> 4b -> align centres -> 4c) solve all 46,080 legal LSE positions.
import { applyAlg, solvedCube, caseState } from './js/cube-sim.js';
import { eoCases, ulUrSteps, mSliceCases, rouxLseCases, yourNote } from './data/roux.js';
// Roux LSE helpers on top of js/cube-sim.js: the six LSE edges + M-slice centres. Corners are ignored.
export const FACE = { '0,1,0': 'U', '0,-1,0': 'D', '0,0,1': 'F', '0,0,-1': 'B', '1,0,0': 'R', '-1,0,0': 'L' };
export const nm = (p) => { const f = []; if (p[1] === 1) f.push('U'); if (p[1] === -1) f.push('D'); if (p[2] === 1) f.push('F'); if (p[2] === -1) f.push('B'); if (p[0] === 1) f.push('R'); if (p[0] === -1) f.push('L'); return f.join(''); };
export const isEdge = (s) => s.p.filter((v) => v !== 0).length === 2;
export const isCentre = (s) => s.p.filter((v) => v !== 0).length === 1;
const LSE = new Set(['UF', 'UB', 'UL', 'UR', 'DF', 'DB']);
export const MSLICE = new Set(['UF', 'UB', 'DF', 'DB']);
// compact key of the six edges and four M-slice centres (corners, blocks ignored)
export const key = (st) => st.filter((s) => (isEdge(s) && LSE.has(nm(s.p))) || (isCentre(s) && s.p[0] === 0)).map((s) => `${s.p.join()}|${s.n.join()}|${s.colour}`).sort().join(';');
const at = (st, pos) => st.filter((s) => isEdge(s) && nm(s.p) === pos);
const centreColour = (st, face) => st.find((s) => isCentre(s) && FACE[s.n.join()] === face && s.p[0] === 0).colour;
const UD = (c) => c === 'U' || c === 'D';
// Roux's rule: an edge is oriented if its U/D-colour sticker faces up or down *when the U/D centre is placed up or down*.
// M-slice edges: the U/D-colour sticker must sit on a face whose centre is a U/D colour (judged against the centres,
// so a turned M slice doesn't matter). UL/UR: the U/D-colour sticker must be on the top face.
export function oriented(st, pos) {
  const ss = at(st, pos);
  const ud = ss.find((s) => UD(s.colour));
  if (!ud) return null; // not an LSE edge
  const face = FACE[ud.n.join()];
  if (MSLICE.has(pos)) return UD(centreColour(st, face));
  return face === 'U';
}
export const badEdges = (st) => [...LSE].filter((p) => oriented(st, p) === false);
export const eoDone = (st) => badEdges(st).length === 0;
// centre offset k: how far the M slice is turned (number of M quarter turns, 0..3) — read off which colour is on top
export const mOffset = (st) => ({ U: 0, F: 1, D: 2, B: 3 })[centreColour(st, 'U')];
export const solvedLse = (st) => key(st) === key(solvedCube());
export function allStates() {
  const start = solvedCube(); const seen = new Map([[key(start), start]]); let frontier = [start];
  while (frontier.length) { const next = []; for (const st of frontier) for (const m of ['M', "M'", 'M2', 'U', "U'", 'U2']) { const t = applyAlg(st, m); const k = key(t); if (!seen.has(k)) { seen.set(k, t); next.push(t); } } frontier = next; }
  return seen;
}

const POS=['UF','UB','UL','UR','DF','DB'];
const fullKey=(st)=>st.map(s=>`${s.p}|${s.n}|${s.colour}`).sort().join(';');
const pat=(st)=>POS.map(p=>oriented(st,p)?'.':'x').join('');
const pieceAt=(st,pos)=>st.filter(s=>isEdge(s)&&nm(s.p)===pos).map(s=>s.colour).sort().join('');
const solved=solvedCube(); const SK=fullKey(solved); const home={}; for(const p of POS) home[pieceAt(solved,p)]=p;
const homeAt=(st,p)=>home[pieceAt(st,p)];
const ufr=(st)=>{const cols=new Map();for(const s of st.filter(s=>s.p.filter(v=>v!==0).length===3)){const k=s.p.join();cols.set(k,[...(cols.get(k)||[]),s.colour]);}for(const [k,c] of cols) if(['U','F','R'].every(x=>c.includes(x))) return k;};
const cornersHome=(st)=>ufr(st)==='1,1,1';
let bad=0; const fail=(...a)=>{ if(bad++<15) console.log('FAIL',...a); };
// all legal LSE states with the corners lined up (u=0)
const moves=['M',"M'",'M2','U',"U'",'U2'];
const seen=new Map([[fullKey(solved),solved]]); let fr=[solved];
while(fr.length){const nx=[];for(const st of fr)for(const m of moves){const t=applyAlg(st,m);const k=fullKey(t);if(!seen.has(k)){seen.set(k,t);nx.push(t);}}fr=nx;}
const legal=[...seen.values()].filter(cornersHome);
console.log('orbit',seen.size,'legal (corners lined up):',legal.length);
const inv=(a)=>a.trim().split(/\s+/).filter(Boolean).reverse().map(m=>m.endsWith("'")?m.slice(0,-1):m.endsWith('2')?m:m+"'").join(' ');
const U=(r)=>['','U','U2',"U'"][r], Ui=(r)=>['','U',"U2","U'"][(4-r)%4];
// 4a
for(const c of eoCases){ const st=caseState(c.alg); if(pat(st)!==c.pattern) fail('4a picture',c.alg,pat(st),c.pattern); if(mOffset(st)!==0||!cornersHome(st)) fail('4a picture state',c.alg); }
const cardPat=new Map(eoCases.map(c=>[c.pattern,c.alg]));
let n4a=0; const pats=new Set();
for(const st of legal){ if(mOffset(st)!==0) continue; n4a++; pats.add(pat(st));
  let matched=0;
  for(let r=0;r<4;r++){ const s2=r?applyAlg(st,U(r)):st; const p=pat(s2); if(cardPat.has(p)&&p!=='......'){ matched++; let out=applyAlg(s2,cardPat.get(p)); if(r) out=applyAlg(out,Ui(r)); if(!eoDone(out)||mOffset(out)!==0||!cornersHome(out)) fail('4a solve',pat(st),r); } }
  if(!eoDone(st)&&!matched) fail('4a nomatch',pat(st));
}
console.log('4a legal start states (centres lined up):',n4a,'patterns:',pats.size);
// 4b
const rows=new Map(); for(const g of ulUrSteps.groups) for(const [l,r,a] of g.rows) rows.set(l+'|'+r,a==='(nothing)'?'':a);
let n4b=0, seenRows=new Set();
for(const st of legal){ if(!eoDone(st)||mOffset(st)!==0) continue; n4b++;
  const L=POS.find(p=>homeAt(st,p)==='UL'), R=POS.find(p=>homeAt(st,p)==='UR'); const a=rows.get(L+'|'+R); seenRows.add(L+'|'+R);
  if(a===undefined){fail('4b missing',L,R);continue;}
  const out=a?applyAlg(st,a):st; if(homeAt(out,'UL')!=='UL'||homeAt(out,'UR')!=='UR'||!eoDone(out)||!cornersHome(out)) fail('4b',L,R,a);
}
console.log('4b rows',rows.size,'legal start states (oriented, centres lined up):',n4b,'rows exercised:',seenRows.size);
// 4c
const byPair=new Map(mSliceCases.map(c=>[c.df+'|'+c.db,c]));
const slotsAt={0:['DF','DB'],1:['UF','DF'],2:['UB','UF'],3:['DB','UB']};
let n4c=0; const used=new Set();
for(const c of mSliceCases){ if(!c.alg) continue; const st=caseState(c.alg); if(mOffset(st)!==0||homeAt(st,'DF')!==c.df||homeAt(st,'DB')!==c.db||homeAt(st,'UL')!=='UL'||homeAt(st,'UR')!=='UR'||!eoDone(st)||!cornersHome(st)) fail('4c picture',c.alg);
  const t=[...c.moves.matchAll(/(UF|UB|DF|DB) edge (→|↔) (UF|UB|DF|DB)/g)]; if(!t.length) fail('moves parse',c.name);
  for(const [,x,,y] of t) if(homeAt(st,x)!==y) fail('4c moves text',c.name,x,y,homeAt(st,x)); }
for(const st of legal){ if(!eoDone(st)||homeAt(st,'UL')!=='UL'||homeAt(st,'UR')!=='UR') continue; n4c++;
  const k=mOffset(st); const [a,b]=slotsAt[k].map(p=>homeAt(st,p));
  const turn=['','M','M2',"M'"][k]; const st2=turn?applyAlg(st,turn):st;
  if(mOffset(st2)!==0) fail('align',k);
  if(homeAt(st2,'DF')!==a||homeAt(st2,'DB')!==b) fail('beforeTurn',k);
  const c=byPair.get(a+'|'+b); if(!c){fail('no case',a,b);continue;} used.add(c.name);
  const out=c.alg?applyAlg(st2,c.alg):st2; if(fullKey(out)!==SK) fail('4c solve',k,a,b,c.alg);
}
console.log('4c positions',n4c,'cases used',used.size);
// end to end: every legal start (any centre offset, any EO) -> solved
let e2e=0;
for(const st of legal){ let s=st;
  const k0=mOffset(s); if(k0){ s=applyAlg(s,['','M','M2',"M'"][k0]); }
  // 4a
  let did=false; for(let r=0;r<4&&!eoDone(s);r++){ const s2=r?applyAlg(s,U(r)):s; const p=pat(s2); if(cardPat.has(p)){ s=applyAlg(s2,cardPat.get(p)); if(r) s=applyAlg(s,Ui(r)); did=true; break; } }
  if(!eoDone(s)) {fail('e2e 4a');continue;}
  const L=POS.find(p=>homeAt(s,p)==='UL'), R=POS.find(p=>homeAt(s,p)==='UR'); const a=rows.get(L+'|'+R); if(a) s=applyAlg(s,a);
  const k=mOffset(s); const [x,y]=slotsAt[k].map(p=>homeAt(s,p)); if(k) s=applyAlg(s,['','M','M2',"M'"][k]);
  const c=byPair.get(x+'|'+y); if(c.alg) s=applyAlg(s,c.alg);
  if(fullKey(s)!==SK) fail('e2e final'); else e2e++;
}
console.log('end-to-end solved:',e2e,'of',legal.length);
for(const c of [...rouxLseCases,...yourNote.extra]) for(const a of [c.alg,c.altAlg]){ const st=caseState(a); console.log(a,'pattern',pat(st),'k',mOffset(st),'UL/UR home',homeAt(st,'UL')==='UL','corners home',cornersHome(st)); }
console.log(bad?`${bad} FAILURES`:'ALL OK');

import{B as wt,b as Vt,c as pt,d as Bt,e as Ut,f as qt,g as gt,h as fn,i as ft,j as q,k as v,l as oe,m as w,n as le,o as vt,p as b,q as D,r as C,s as ge,t as Wt,u as Qt,w as Ht,x as W,y as Yt,z as _t}from"./chunks/chunk-BVRH6WDS.js";import{a as Nt,b as Pt,d as dt,e as ht,f as Rt,g as Ot,h as mt,i as U,j as ae,l as L,m as pe,n as Ft,o as jt,p as Fe,q as P,r as A,s as S}from"./chunks/chunk-434C6BA3.js";import{a as s,b as o,c as h,d as f,e as T}from"./chunks/chunk-2WGYLO4P.js";var vn=class extends P{traverseAlg(t){let e=0;for(let r of t.childAlgNodes())e+=this.traverseAlgNode(r);return e}traverseGrouping(t){return this.traverseAlg(t.alg)*Math.abs(t.amount)}traverseMove(t){return 1}traverseCommutator(t){return 2*(this.traverseAlg(t.A)+this.traverseAlg(t.B))}traverseConjugate(t){return 2*this.traverseAlg(t.A)+this.traverseAlg(t.B)}traversePause(t){return 1}traverseNewline(t){return 0}traverseLineComment(t){return 0}},Gt=A(vn);function wn(t){return t.endsWith("v")||["x","y","z"].includes(t)?"Rotation":t.startsWith("2")||["M","E","S"].includes(t)?"Inner":"Outer"}var fe;function Mn(){if(fe)return fe;fe={};let t=[...Object.keys(pt.moves),...Object.keys(pt.derivedMoves)];for(let e of t)fe[e]=wn(e);return fe}var Zt={OBTM:{Rotation:{constantFactor:0,amountFactor:0,zeroAmount:0},Outer:{constantFactor:1,amountFactor:0,zeroAmount:0},Inner:{constantFactor:2,amountFactor:0,zeroAmount:0}},RBTM:{Rotation:{constantFactor:0,amountFactor:0,zeroAmount:0},Outer:{constantFactor:1,amountFactor:0,zeroAmount:0},Inner:{constantFactor:1,amountFactor:0,zeroAmount:0}},OBQTM:{Rotation:{constantFactor:0,amountFactor:0,zeroAmount:0},Outer:{constantFactor:0,amountFactor:1,zeroAmount:0},Inner:{constantFactor:0,amountFactor:2,zeroAmount:0}},RBQTM:{Rotation:{constantFactor:0,amountFactor:0,zeroAmount:0},Outer:{constantFactor:0,amountFactor:1,zeroAmount:0},Inner:{constantFactor:0,amountFactor:1,zeroAmount:0}},ETM:{Rotation:{constantFactor:1,amountFactor:0,zeroAmount:1},Outer:{constantFactor:1,amountFactor:0,zeroAmount:1},Inner:{constantFactor:1,amountFactor:0,zeroAmount:1}}};function yn(t,e){let r=Zt[t];if(!r)throw new Error(`Invalid metric for 3x3x3: ${t}`);let n=Mn(),i=e.quantum.toString();if(!(i in n))throw new Error(`Invalid move for 3x3x3 ${t}: ${i}`);let a=n[i],{constantFactor:l,amountFactor:c,zeroAmount:d}=r[a];return e.amount===0?d:l+c*Math.abs(e.amount)}var ve=class extends P{constructor(e){super();s(this,"metric");this.metric=e}traverseAlg(e){let r=0;for(let n of e.childAlgNodes())r+=this.traverseAlgNode(n);return r}traverseGrouping(e){let r=e.alg;return this.traverseAlg(r)*Math.abs(e.amount)}traverseMove(e){return this.metric(e)}traverseCommutator(e){return 2*(this.traverseAlg(e.A)+this.traverseAlg(e.B))}traverseConjugate(e){return 2*this.traverseAlg(e.A)+this.traverseAlg(e.B)}traversePause(e){return 0}traverseNewline(e){return 0}traverseLineComment(e){return 0}},xn=class extends P{traverseAlg(t){let e=0;for(let r of t.childAlgNodes())e+=this.traverseAlgNode(r);return e}traverseGrouping(t){let e=t.alg;return this.traverseAlg(e)*Math.abs(t.amount)}traverseMove(t){return 1}traverseCommutator(t){return 2*(this.traverseAlg(t.A)+this.traverseAlg(t.B))}traverseConjugate(t){return 2*this.traverseAlg(t.A)+this.traverseAlg(t.B)}traversePause(t){return 1}traverseNewline(t){return 1}traverseLineComment(t){return 1}};function $t(t){return"A"<=t&&t<="Z"}function zn(t){let e=t.family;return $t(e[0])&&e[e.length-1]==="v"||e==="x"||e==="y"||e==="z"||e==="T"?0:1}function Tn(t){return 1}function Xt(t){let e=t.family;return $t(e[0])&&e[e.length-1]==="v"||e==="x"||e==="y"||e==="z"||e==="T"?0:1}function An(t){return Math.abs(t.amount)*Xt(t)}var Bs=A(ve,[zn]),Sn=A(ve,[Tn]),bn=A(ve,[An]),kn=A(ve,[Xt]),Jt=A(xn,[]);function Kt(t,e,r){if(t.id==="3x3x3"){if(e in Zt)return A(ve,[n=>yn(e,n)])(r)}else switch(e){case"ETM":return Sn(r);case"RBTM":{if(t.pg)return kn(r);break}case"RBQTM":{if(t.pg)return bn(r);break}}throw new Error("Unsupported puzzle or metric.")}function J(t){switch(Math.abs(t)){case 0:return 0;case 1:return 1e3;case 2:return 1500;default:return 2e3}}var jr=class extends P{constructor(e=J){super();s(this,"durationForAmount");this.durationForAmount=e}traverseAlg(e){let r=0;for(let n of e.childAlgNodes())r+=this.traverseAlgNode(n);return r}traverseGrouping(e){return e.amount*this.traverseAlg(e.alg)}traverseMove(e){return this.durationForAmount(e.amount)}traverseCommutator(e){return 2*(this.traverseAlg(e.A)+this.traverseAlg(e.B))}traverseConjugate(e){return 2*this.traverseAlg(e.A)+this.traverseAlg(e.B)}traversePause(e){return this.durationForAmount(1)}traverseNewline(e){return this.durationForAmount(1)}traverseLineComment(e){return this.durationForAmount(0)}},In=class{constructor(t,e){s(this,"kpuzzle");s(this,"moves");s(this,"durationFn",new jr(J));this.kpuzzle=t,this.moves=new S(e.experimentalExpand())}getAnimLeaf(t){return Array.from(this.moves.childAlgNodes())[t]}indexToMoveStartTimestamp(t){let e=new S(Array.from(this.moves.childAlgNodes()).slice(0,t));return this.durationFn.traverseAlg(e)}timestampToIndex(t){let e=0,r;for(r=0;r<this.numAnimatedLeaves();r++)if(e+=this.durationFn.traverseMove(this.getAnimLeaf(r)),e>=t)return r;return r}patternAtIndex(t){return this.kpuzzle.defaultPattern().applyTransformation(this.transformationAtIndex(t))}transformationAtIndex(t){let e=this.kpuzzle.identityTransformation();for(let r of Array.from(this.moves.childAlgNodes()).slice(0,t))e=e.applyMove(r);return e}algDuration(){return this.durationFn.traverseAlg(this.moves)}numAnimatedLeaves(){return Gt(this.moves)}moveDuration(t){return this.durationFn.traverseMove(this.getAnimLeaf(t))}},X=class{constructor(t,e,r,n,i=[]){s(this,"moveCount");s(this,"duration");s(this,"forward");s(this,"backward");s(this,"children");this.moveCount=t,this.duration=e,this.forward=r,this.backward=n,this.children=i}},Ln=class extends P{constructor(e){super();s(this,"kpuzzle");s(this,"identity");s(this,"dummyLeaf");s(this,"durationFn",new jr(J));s(this,"cache",{});this.kpuzzle=e,this.identity=e.identityTransformation(),this.dummyLeaf=new X(0,0,this.identity,this.identity,[])}traverseAlg(e){let r=0,n=0,i=this.identity,a=[];for(let l of e.childAlgNodes()){let c=this.traverseAlgNode(l);r+=c.moveCount,n+=c.duration,i===this.identity?i=c.forward:i=i.applyTransformation(c.forward),a.push(c)}return new X(r,n,i,i.invert(),a)}traverseGrouping(e){let r=this.traverseAlg(e.alg);return this.mult(r,e.amount,[r])}traverseMove(e){let r=e.toString(),n=this.cache[r];if(n)return n;let i=this.kpuzzle.moveToTransformation(e);return n=new X(1,this.durationFn.traverseAlgNode(e),i,i.invert()),this.cache[r]=n,n}traverseCommutator(e){let r=this.traverseAlg(e.A),n=this.traverseAlg(e.B),i=r.forward.applyTransformation(n.forward),a=r.backward.applyTransformation(n.backward),l=i.applyTransformation(a),c=new X(2*(r.moveCount+n.moveCount),2*(r.duration+n.duration),l,l.invert(),[r,n]);return this.mult(c,1,[c,r,n])}traverseConjugate(e){let r=this.traverseAlg(e.A),n=this.traverseAlg(e.B),a=r.forward.applyTransformation(n.forward).applyTransformation(r.backward),l=new X(2*r.moveCount+n.moveCount,2*r.duration+n.duration,a,a.invert(),[r,n]);return this.mult(l,1,[l,r,n])}traversePause(e){return e.experimentalNISSGrouping?this.dummyLeaf:new X(1,this.durationFn.traverseAlgNode(e),this.identity,this.identity)}traverseNewline(e){return this.dummyLeaf}traverseLineComment(e){return this.dummyLeaf}mult(e,r,n){let i=Math.abs(r),a=e.forward.selfMultiply(r);return new X(e.moveCount*i,e.duration*i,a,a.invert(),n)}},x=class{constructor(t,e){s(this,"apd");s(this,"back");this.apd=t,this.back=e}},Dn=class extends Fe{constructor(e,r,n){super();s(this,"kpuzzle");s(this,"algOrAlgNode");s(this,"apd");s(this,"move");s(this,"moveDuration");s(this,"back");s(this,"st");s(this,"root");s(this,"i");s(this,"dur");s(this,"goalIndex");s(this,"goalDuration");this.kpuzzle=e,this.algOrAlgNode=r,this.apd=n,this.i=-1,this.dur=-1,this.goalIndex=-1,this.goalDuration=-1,this.move=void 0,this.back=!1,this.moveDuration=0,this.st=this.kpuzzle.identityTransformation(),this.root=new x(this.apd,!1)}moveByIndex(e){return this.i>=0&&this.i===e?this.move!==void 0:this.dosearch(e,1/0)}moveByDuration(e){return this.dur>=0&&this.dur<e&&this.dur+this.moveDuration>=e?this.move!==void 0:this.dosearch(1/0,e)}dosearch(e,r){return this.goalIndex=e,this.goalDuration=r,this.i=0,this.dur=0,this.move=void 0,this.moveDuration=0,this.back=!1,this.st=this.kpuzzle.identityTransformation(),this.algOrAlgNode.is(S)?this.traverseAlg(this.algOrAlgNode,this.root):this.traverseAlgNode(this.algOrAlgNode,this.root)}traverseAlg(e,r){if(!this.firstcheck(r))return!1;let n=r.back?e.experimentalNumChildAlgNodes()-1:0;for(let i of Pt(e.childAlgNodes(),r.back?-1:1)){if(this.traverseAlgNode(i,new x(r.apd.children[n],r.back)))return!0;n+=r.back?-1:1}return!1}traverseGrouping(e,r){if(!this.firstcheck(r))return!1;let n=this.domult(r,e.amount);return this.traverseAlg(e.alg,new x(r.apd.children[0],n))}traverseMove(e,r){return this.firstcheck(r)?(this.move=e,this.moveDuration=r.apd.duration,this.back=r.back,!0):!1}traverseCommutator(e,r){if(!this.firstcheck(r))return!1;let n=this.domult(r,1);return n?this.traverseAlg(e.B,new x(r.apd.children[2],!n))||this.traverseAlg(e.A,new x(r.apd.children[1],!n))||this.traverseAlg(e.B,new x(r.apd.children[2],n))||this.traverseAlg(e.A,new x(r.apd.children[1],n)):this.traverseAlg(e.A,new x(r.apd.children[1],n))||this.traverseAlg(e.B,new x(r.apd.children[2],n))||this.traverseAlg(e.A,new x(r.apd.children[1],!n))||this.traverseAlg(e.B,new x(r.apd.children[2],!n))}traverseConjugate(e,r){if(!this.firstcheck(r))return!1;let n=this.domult(r,1);return n?this.traverseAlg(e.A,new x(r.apd.children[1],!n))||this.traverseAlg(e.B,new x(r.apd.children[2],n))||this.traverseAlg(e.A,new x(r.apd.children[1],n)):this.traverseAlg(e.A,new x(r.apd.children[1],n))||this.traverseAlg(e.B,new x(r.apd.children[2],n))||this.traverseAlg(e.A,new x(r.apd.children[1],!n))}traversePause(e,r){return this.firstcheck(r)?(this.move=e,this.moveDuration=r.apd.duration,this.back=r.back,!0):!1}traverseNewline(e,r){return!1}traverseLineComment(e,r){return!1}firstcheck(e){return e.apd.moveCount+this.i<=this.goalIndex&&e.apd.duration+this.dur<this.goalDuration?this.keepgoing(e):!0}domult(e,r){let n=e.back;if(r===0)return n;r<0&&(n=!n,r=-r);let i=e.apd.children[0],a=Math.min(Math.floor((this.goalIndex-this.i)/i.moveCount),Math.ceil((this.goalDuration-this.dur)/i.duration-1));return a>0&&this.keepgoing(new x(i,n),a),n}keepgoing(e,r=1){return this.i+=r*e.apd.moveCount,this.dur+=r*e.apd.duration,r!==1?e.back?this.st=this.st.applyTransformation(e.apd.backward.selfMultiply(r)):this.st=this.st.applyTransformation(e.apd.forward.selfMultiply(r)):e.back?this.st=this.st.applyTransformation(e.apd.backward):this.st=this.st.applyTransformation(e.apd.forward),!1}},Cn=16;function En(t,e){let r=new ht,n=new ht;for(let i of t.childAlgNodes())n.push(i),n.experimentalNumAlgNodes()>=e&&(r.push(new pe(n.toAlg())),n.reset());return r.push(new pe(n.toAlg())),r.toAlg()}var Nn=class extends P{traverseAlg(t){let e=t.experimentalNumChildAlgNodes();return e<Cn?t:En(t,Math.ceil(Math.sqrt(e)))}traverseGrouping(t){return new pe(this.traverseAlg(t.alg),t.amount)}traverseMove(t){return t}traverseCommutator(t){return new dt(this.traverseAlg(t.A),this.traverseAlg(t.B))}traverseConjugate(t){return new dt(this.traverseAlg(t.A),this.traverseAlg(t.B))}traversePause(t){return t}traverseNewline(t){return t}traverseLineComment(t){return t}},Pn=A(Nn),er=class{constructor(t,e){s(this,"kpuzzle");s(this,"decoration");s(this,"walker");this.kpuzzle=t;let r=new Ln(this.kpuzzle),n=Pn(e);this.decoration=r.traverseAlg(n),this.walker=new Dn(this.kpuzzle,n,this.decoration)}getAnimLeaf(t){if(this.walker.moveByIndex(t)){if(!this.walker.move)throw new Error("`this.walker.mv` missing");let e=this.walker.move;return this.walker.back?e.invert():e}return null}indexToMoveStartTimestamp(t){if(this.walker.moveByIndex(t)||this.walker.i===t)return this.walker.dur;throw new Error(`Out of algorithm: index ${t}`)}indexToMovesInProgress(t){if(this.walker.moveByIndex(t)||this.walker.i===t)return this.walker.dur;throw new Error(`Out of algorithm: index ${t}`)}patternAtIndex(t,e){return this.walker.moveByIndex(t),(e??this.kpuzzle.defaultPattern()).applyTransformation(this.walker.st)}transformationAtIndex(t){return this.walker.moveByIndex(t),this.walker.st}numAnimatedLeaves(){return this.decoration.moveCount}timestampToIndex(t){return this.walker.moveByDuration(t),this.walker.i}algDuration(){return this.decoration.duration}moveDuration(t){return this.walker.moveByIndex(t),this.walker.moveDuration}},Js={none:!0,"side-by-side":!0,"top-right":!0},Rn=class extends v{getDefaultValue(){return"auto"}},je="http://www.w3.org/2000/svg",tr="data-copy-id",rr=0;function On(){return rr+=1,`svg${rr.toString()}`}var Fn={dim:{white:"#dddddd",orange:"#884400",limegreen:"#008800",red:"#660000","rgb(34, 102, 255)":"#000088",yellow:"#888800","rgb(102, 0, 153)":"rgb(50, 0, 76)",purple:"#3f003f"},oriented:"#44ddcc",ignored:"#555555",invisible:"#00000000"},jn=class{constructor(t,e,r,n=!1){s(this,"kpuzzle");s(this,"showUnknownOrientations");s(this,"wrapperElement");s(this,"svgElement");s(this,"gradientDefs");s(this,"originalColors",{});s(this,"gradients",{});s(this,"svgID");if(this.kpuzzle=t,this.showUnknownOrientations=n,!e)throw new Error(`No SVG definition for puzzle type: ${t.name()}`);this.svgID=On(),this.wrapperElement=document.createElement("div"),this.wrapperElement.classList.add("svg-wrapper"),this.wrapperElement.innerHTML=e;let i=this.wrapperElement.querySelector("svg");if(!i)throw new Error("Could not get SVG element");if(this.svgElement=i,je!==i.namespaceURI)throw new Error("Unexpected XML namespace");i.style.maxWidth="100%",i.style.maxHeight="100%",this.gradientDefs=document.createElementNS(je,"defs"),i.insertBefore(this.gradientDefs,i.firstChild);for(let a of t.definition.orbits)for(let l=0;l<a.numPieces;l++)for(let c=0;c<a.numOrientations;c++){let d=this.elementID(a.orbitName,l,c),u=this.elementByID(d),g=u?.style.fill;r?(()=>{let m=r.orbits;if(!m)return;let z=m[a.orbitName];if(!z)return;let y=z.pieces[l];if(!y)return;let I=y.facelets[c];if(!I)return;let Re=typeof I=="string"?I:I?.mask,N=Fn[Re];typeof N=="string"?g=N:N&&(g=N[g])})():g=u?.style.fill,this.originalColors[d]=g,this.gradients[d]=this.newGradient(d,g),this.gradientDefs.appendChild(this.gradients[d]),u?.setAttribute("style",`fill: url(#grad-${this.svgID}-${d})`)}for(let a of Array.from(i.querySelectorAll(`[${tr}]`))){let l=a.getAttribute(tr);a.setAttribute("style",`fill: url(#grad-${this.svgID}-${l})`)}this.showUnknownOrientations&&this.drawPattern(this.kpuzzle.defaultPattern())}drawPattern(t,e,r){this.draw(t,e,r)}draw(t,e,r){let n=e?.experimentalToTransformation();if(!t)throw new Error("Distinguishable pieces are not handled for SVG yet!");for(let i of t.kpuzzle.definition.orbits){let a=t.patternData[i.orbitName],l=n?n.transformationData[i.orbitName]:null;for(let c=0;c<i.numPieces;c++)for(let d=0;d<i.numOrientations;d++){let u=this.elementID(i.orbitName,c,d),g=this.elementID(i.orbitName,a.pieces[c],(i.numOrientations-a.orientation[c]+d)%i.numOrientations),m=!1;if(l){let z=this.elementID(i.orbitName,l.permutation[c],(i.numOrientations-l.orientationDelta[c]+d)%i.numOrientations);g===z&&(m=!0),r=r||0;let y=100*(1-r*r*(2-r*r));this.gradients[u].children[0].setAttribute("stop-color",this.originalColors[g]),this.gradients[u].children[0].setAttribute("offset",`${Math.max(y-5,0)}%`),this.gradients[u].children[1].setAttribute("offset",`${Math.max(y-5,0)}%`),this.gradients[u].children[2].setAttribute("offset",`${y}%`),this.gradients[u].children[3].setAttribute("offset",`${y}%`),this.gradients[u].children[3].setAttribute("stop-color",this.originalColors[z])}else m=!0;m&&(this.showUnknownOrientations&&a.orientationMod?.[c]===1?(this.gradients[u].children[0].setAttribute("stop-color","#000"),this.gradients[u].children[0].setAttribute("offset","5%"),this.gradients[u].children[1].setAttribute("offset","5%"),this.gradients[u].children[2].setAttribute("offset","20%"),this.gradients[u].children[3].setAttribute("offset","20%"),this.gradients[u].children[3].setAttribute("stop-color",this.originalColors[g])):(this.gradients[u].children[0].setAttribute("stop-color",this.originalColors[g]),this.gradients[u].children[0].setAttribute("offset","100%"),this.gradients[u].children[1].setAttribute("offset","100%"),this.gradients[u].children[2].setAttribute("offset","100%"),this.gradients[u].children[3].setAttribute("offset","100%")))}}}newGradient(t,e){let r=document.createElementNS(je,"radialGradient");r.setAttribute("id",`grad-${this.svgID}-${t}`),r.setAttribute("r","70.7107%");let n=[{offset:0,color:e},{offset:0,color:"black"},{offset:0,color:"black"},{offset:0,color:e}];for(let i of n){let a=document.createElementNS(je,"stop");a.setAttribute("offset",`${i.offset}%`),a.setAttribute("stop-color",i.color),a.setAttribute("stop-opacity","1"),r.appendChild(a)}return r}elementID(t,e,r){return`${t}-l${e}-o${r}`}elementByID(t){return this.wrapperElement.querySelector(`#${t}`)}},Q,zr,Pe=(zr=class{constructor(t,e,r){s(this,"elem");s(this,"prefix");s(this,"validSuffixes");h(this,Q,null);this.elem=t,this.prefix=e,this.validSuffixes=r}clearValue(){o(this,Q)&&this.elem.contentWrapper.classList.remove(o(this,Q)),f(this,Q,null)}setValue(t){if(!this.validSuffixes.includes(t))throw new Error(`Invalid suffix: ${t}`);let e=`${this.prefix}${t}`,r=o(this,Q)!==e;return r&&(this.clearValue(),this.elem.contentWrapper.classList.add(e),f(this,Q,e)),r}},Q=new WeakMap,zr);function At(t,e){if(t===e)return!0;if(t.length!==e.length)return!1;for(let r=0;r<t.length;r++)if(t[r]!==e[r])return!1;return!0}function nr(t,e,r){if(t===e)return!0;if(t.length!==e.length)return!1;for(let n=0;n<t.length;n++)if(!r(t[n],e[n]))return!1;return!0}function St(t,e,r){return Ft(t,r-e,e)}var Vn=class{constructor(t){s(this,"model");s(this,"catchingUp",!1);s(this,"pendingFrame",!1);s(this,"tempoScale",1);s(this,"scheduler",new ge(this.animFrame.bind(this)));s(this,"catchUpMs",500);s(this,"lastTimestamp",0);this.model=t,t.tempoScale.addFreshListener(e=>{this.tempoScale=e})}start(){this.catchingUp||(this.lastTimestamp=performance.now()),this.catchingUp=!0,this.pendingFrame=!0,this.scheduler.requestAnimFrame()}stop(){this.catchingUp=!1,this.scheduler.cancelAnimFrame()}animFrame(t){this.scheduler.requestAnimFrame();let e=this.tempoScale*(t-this.lastTimestamp)/this.catchUpMs;this.lastTimestamp=t,this.model.catchUpMove.set((async()=>{let r=await this.model.catchUpMove.get();if(r.move===null)return r;let n=r.amount+e;return n>=1?(this.pendingFrame=!0,this.stop(),this.model.timestampRequest.set("end"),{move:null,amount:0}):(this.pendingFrame=!1,{move:r.move,amount:n})})())}},Me,bt,Ge,Tr,Bn=(Tr=class{constructor(t,e){h(this,Me);s(this,"delegate");s(this,"playing",!1);s(this,"direction",1);s(this,"catchUpHelper");s(this,"model");s(this,"lastDatestamp",0);s(this,"lastTimestampPromise");s(this,"scheduler",new ge(this.animFrame.bind(this)));h(this,Ge,new ft);this.delegate=e,this.model=t,this.lastTimestampPromise=T(this,Me,bt).call(this),this.model.playingInfo.addFreshListener(this.onPlayingProp.bind(this)),this.catchUpHelper=new Vn(this.model),this.model.catchUpMove.addFreshListener(this.onCatchUpMoveProp.bind(this))}async onPlayingProp(t){t.playing!==this.playing&&(t.playing?this.play(t):this.pause())}async onCatchUpMoveProp(t){let e=t.move!==null;e!==this.catchUpHelper.catchingUp&&(e?this.catchUpHelper.start():this.catchUpHelper.stop()),this.scheduler.requestAnimFrame()}jumpToStart(t){this.model.timestampRequest.set("start"),this.pause(),t?.flash&&this.delegate.flash()}jumpToEnd(t){this.model.timestampRequest.set("end"),this.pause(),t?.flash&&this.delegate.flash()}playPause(){this.playing?this.pause():this.play()}play(t){(async()=>{let e=t?.direction??1,r=await this.model.coarseTimelineInfo.get();(t?.autoSkipToOtherEndIfStartingAtBoundary??!0)&&(e===1&&r.atEnd&&(this.model.timestampRequest.set("start"),this.delegate.flash()),e===-1&&r.atStart&&(this.model.timestampRequest.set("end"),this.delegate.flash())),this.model.playingInfo.set({playing:!0,direction:e,untilBoundary:t?.untilBoundary??"entire-timeline",loop:t?.loop??!1}),this.playing=!0,this.lastDatestamp=performance.now(),this.lastTimestampPromise=T(this,Me,bt).call(this),this.scheduler.requestAnimFrame()})()}pause(){this.playing=!1,this.scheduler.cancelAnimFrame(),this.model.playingInfo.set({playing:!1,untilBoundary:"entire-timeline"})}async animFrame(t){this.playing&&this.scheduler.requestAnimFrame();let e=this.lastDatestamp,r=await o(this,Ge).queue(Promise.all([this.model.playingInfo.get(),this.lastTimestampPromise,this.model.timeRange.get(),this.model.tempoScale.get(),this.model.currentMoveInfo.get()])),[n,i,a,l,c]=r;if(!n.playing){this.playing=!1;return}let d=c.earliestEnd;(c.currentMoves.length===0||n.untilBoundary==="entire-timeline")&&(d=a.end);let u=c.latestStart;(c.currentMoves.length===0||n.untilBoundary==="entire-timeline")&&(u=a.start);let g=(t-e)*this.direction*l;g=Math.max(g,1),g*=n.direction;let m=i+g,z=null;m>=d?n.loop?m=St(m,a.start,a.end):(m===a.end?z="end":m=d,this.playing=!1,this.model.playingInfo.set({playing:!1})):m<=u&&(n.loop?m=St(m,a.start,a.end):(m===a.start?z="start":m=u,this.playing=!1,this.model.playingInfo.set({playing:!1}))),this.lastDatestamp=t,this.lastTimestampPromise=Promise.resolve(m),this.model.timestampRequest.set(z??m)}},Me=new WeakSet,bt=async function(){return(await this.model.detailedTimelineInfo.get()).timestamp},Ge=new WeakMap,Tr),Un=class{constructor(t,e){s(this,"model");s(this,"animationController");this.model=t,this.animationController=new Bn(t,e)}jumpToStart(t){this.animationController.jumpToStart(t)}jumpToEnd(t){this.animationController.jumpToEnd(t)}togglePlay(t){typeof t>"u"&&this.animationController.playPause(),t?this.animationController.play():this.animationController.pause()}async visitTwizzleLink(){let t=document.createElement("a");t.href=await this.model.twizzleLink(),t.target="_blank",t.click()}},qn={"bottom-row":!0,none:!0},Wn=class extends v{getDefaultValue(){return"auto"}},Et=new D;Et.replaceSync(`
:host {
  width: 384px;
  height: 256px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
}

.wrapper > * {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.wrapper.back-view-side-by-side {
  grid-template-columns: 1fr 1fr;
}

.wrapper.back-view-top-right {
  grid-template-columns: 3fr 1fr;
  grid-template-rows: 1fr 3fr;
}

.wrapper.back-view-top-right > :nth-child(1) {
  grid-row: 1 / 3;
  grid-column: 1 / 3;
}

.wrapper.back-view-top-right > :nth-child(2) {
  grid-row: 1 / 2;
  grid-column: 2 / 3;
}
`);var Vr=new D;Vr.replaceSync(`
:host {
  width: 384px;
  height: 256px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
}

.svg-wrapper,
twisty-2d-svg,
svg {
  width: 100%;
  height: 100%;
  display: grid;
  min-height: 0;
}

svg {
  animation: fade-in 0.25s ease-in;
}

@keyframes fade-in {
  from { opacity: 0; }
  to { opacity: 1; }
}

.hint-facelets-none .hint-facelet {
  display: none;
}
`);var de,K,Ar,Br=(Ar=class extends C{constructor(e,r,n,i,a){super();s(this,"model");s(this,"kpuzzle");s(this,"svgSource");s(this,"options");s(this,"puzzleLoader");s(this,"svgWrapper");s(this,"scheduler",new ge(this.render.bind(this)));h(this,de,null);h(this,K,new le);s(this,"hintFaceletsClassListManager",new Pe(this,"hint-facelets-",Object.keys(Wt)));this.model=e,this.kpuzzle=r,this.svgSource=n,this.options=i,this.puzzleLoader=a,this.addCSS(Vr),this.resetSVG(),o(this,K).addListener(this.model.puzzleID,l=>{a?.id!==l&&this.disconnect()}),o(this,K).addListener(this.model.twistySceneModel.hintFacelet,l=>{this.setHintFacelet(l)}),o(this,K).addListener(this.model.legacyPosition,this.onPositionChange.bind(this)),this.options?.experimentalStickeringMask&&this.experimentalSetStickeringMask(this.options.experimentalStickeringMask)}disconnect(){o(this,K).disconnect()}onPositionChange(e){try{if(e.movesInProgress.length>0){let r=e.movesInProgress[0].move,n=r;e.movesInProgress[0].direction===-1&&(n=r.invert());let i=e.pattern.applyMove(n);this.svgWrapper?.draw(e.pattern,i,e.movesInProgress[0].fraction)}else this.svgWrapper?.draw(e.pattern),f(this,de,e)}catch(r){console.warn("Bad position (this doesn't necessarily mean something is wrong). Pre-emptively disconnecting:",this.puzzleLoader?.id,r),this.disconnect()}}scheduleRender(){this.scheduler.requestAnimFrame()}experimentalSetStickeringMask(e){this.resetSVG(e)}resetSVG(e){this.svgWrapper&&this.removeElement(this.svgWrapper.wrapperElement),this.kpuzzle&&(this.svgWrapper=new jn(this.kpuzzle,this.svgSource,e),this.addElement(this.svgWrapper.wrapperElement),o(this,de)&&this.onPositionChange(o(this,de)))}setHintFacelet(e){this.hintFaceletsClassListManager.setValue(e==="auto"?"floating":e)}render(){}},de=new WeakMap,K=new WeakMap,Ar);b.define("twisty-2d-puzzle",Br);var ye,Ze,Sr,Qn=(Sr=class{constructor(t,e,r,n){s(this,"model");s(this,"schedulable");s(this,"puzzleLoader");s(this,"effectiveVisualization");h(this,ye,new le);h(this,Ze,null);this.model=t,this.schedulable=e,this.puzzleLoader=r,this.effectiveVisualization=n,this.twisty2DPuzzle(),o(this,ye).addListener(this.model.twistySceneModel.stickeringMask,async i=>{(await this.twisty2DPuzzle()).experimentalSetStickeringMask(i)})}disconnect(){o(this,ye).disconnect()}scheduleRender(){}async twisty2DPuzzle(){return o(this,Ze)??f(this,Ze,(async()=>{let t=this.effectiveVisualization==="experimental-2D-LL-face"?this.puzzleLoader.llFaceSVG():this.effectiveVisualization==="experimental-2D-LL"?this.puzzleLoader.llSVG():this.puzzleLoader.svg();return new Br(this.model,await this.puzzleLoader.kpuzzle(),await t,{},this.puzzleLoader)})())}},ye=new WeakMap,Ze=new WeakMap,Sr),xe,$e,H,br,Ur=(br=class extends C{constructor(e,r){super();s(this,"model");s(this,"effectiveVisualization");h(this,xe,new le);h(this,$e);h(this,H);this.model=e,this.effectiveVisualization=r}disconnect(){o(this,xe).disconnect()}async connectedCallback(){this.addCSS(Et),this.model&&o(this,xe).addListener(this.model.twistyPlayerModel.puzzleLoader,this.onPuzzleLoader.bind(this))}async scene(){return o(this,$e)??f(this,$e,(async()=>new(await W).ThreeScene)())}scheduleRender(){o(this,H)?.scheduleRender()}currentTwisty2DPuzzleWrapper(){return o(this,H)}async setCurrentTwisty2DPuzzleWrapper(e){let r=o(this,H);f(this,H,e),r?.disconnect();let n=e.twisty2DPuzzle();this.contentWrapper.textContent="",this.addElement(await n)}async onPuzzleLoader(e){o(this,H)?.disconnect();let r=new Qn(this.model.twistyPlayerModel,this,e,this.effectiveVisualization);this.setCurrentTwisty2DPuzzleWrapper(r)}},xe=new WeakMap,$e=new WeakMap,H=new WeakMap,br);b.define("twisty-2d-scene-wrapper",Ur);var ze,kr,qr=(kr=class{constructor(){h(this,ze);s(this,"reject");s(this,"promise");this.promise=new Promise((t,e)=>{f(this,ze,t),this.reject=e})}handleNewValue(t){o(this,ze).call(this,t)}},ze=new WeakMap,kr),k,Xe,Ir,Wr=(Ir=class extends EventTarget{constructor(e,r,n,i){super();s(this,"model");s(this,"schedulable");s(this,"puzzleLoader");s(this,"visualizationStrategy");h(this,k,new le);h(this,Xe,null);this.model=e,this.schedulable=r,this.puzzleLoader=n,this.visualizationStrategy=i,this.twisty3DPuzzle(),o(this,k).addListener(this.model.puzzleLoader,a=>{this.puzzleLoader.id!==a.id&&this.disconnect()}),o(this,k).addListener(this.model.legacyPosition,async a=>{try{(await this.twisty3DPuzzle()).onPositionChange(a),this.scheduleRender()}catch{this.disconnect()}}),o(this,k).addListener(this.model.twistySceneModel.hintFacelet,async a=>{(await this.twisty3DPuzzle()).experimentalUpdateOptions({hintFacelets:a==="auto"?"floating":a}),this.scheduleRender()}),o(this,k).addListener(this.model.twistySceneModel.foundationDisplay,async a=>{(await this.twisty3DPuzzle()).experimentalUpdateOptions({showFoundation:a!=="none"}),this.scheduleRender()}),o(this,k).addListener(this.model.twistySceneModel.stickeringMask,async a=>{(await this.twisty3DPuzzle()).setStickeringMask(a),this.scheduleRender()}),o(this,k).addListener(this.model.twistySceneModel.faceletScale,async a=>{(await this.twisty3DPuzzle()).experimentalUpdateOptions({faceletScale:a}),this.scheduleRender()}),o(this,k).addListener(this.model.twistySceneModel.hintFaceletsElevation,async a=>{(await this.twisty3DPuzzle()).experimentalUpdateOptions({hintFaceletsElevation:a}),this.scheduleRender()}),o(this,k).addMultiListener3([this.model.twistySceneModel.stickeringMask,this.model.twistySceneModel.foundationStickerSprite,this.model.twistySceneModel.hintStickerSprite],async a=>{"experimentalUpdateTexture"in await this.twisty3DPuzzle()&&((await this.twisty3DPuzzle()).experimentalUpdateTexture(a[0].specialBehaviour==="picture",a[1],a[2]),this.scheduleRender())})}disconnect(){o(this,k).disconnect()}scheduleRender(){this.schedulable.scheduleRender(),this.dispatchEvent(new CustomEvent("render-scheduled"))}async twisty3DPuzzle(){return o(this,Xe)??f(this,Xe,(async()=>{if(this.puzzleLoader.id==="3x3x3"&&this.visualizationStrategy==="Cube3D"){let[e,r,n,i,a,l]=await Promise.all([this.model.twistySceneModel.foundationStickerSprite.get(),this.model.twistySceneModel.hintStickerSprite.get(),this.model.twistySceneModel.stickeringMask.get(),this.model.twistySceneModel.initialHintFaceletsAnimation.get(),this.model.twistySceneModel.faceletScale.get(),this.model.twistySceneModel.hintFaceletsElevation.get()]);return(await W).cube3DShim(()=>this.schedulable.scheduleRender(),{foundationSprite:e,hintSprite:r,experimentalStickeringMask:n,initialHintFaceletsAnimation:i,faceletScale:a,hintFaceletsElevation:l})}else{let[e,r,n,i]=await Promise.all([this.model.twistySceneModel.hintFacelet.get(),this.model.twistySceneModel.foundationStickerSprite.get(),this.model.twistySceneModel.hintStickerSprite.get(),this.model.twistySceneModel.faceletScale.get()]),a=(await W).pg3dShim(()=>this.schedulable.scheduleRender(),this.puzzleLoader,e==="auto"?"floating":e,i,this.puzzleLoader.id==="kilominx");return a.then(l=>l.experimentalUpdateTexture(!0,r??void 0,n??void 0)),a}})())}async raycastMove(e,r){let n=await this.twisty3DPuzzle();if(!("experimentalGetControlTargets"in n)){console.info("not PG3D! skipping raycast");return}let i=n.experimentalGetControlTargets(),[a,l]=await Promise.all([e,this.model.twistySceneModel.movePressCancelOptions.get()]),c=a.intersectObjects(i);if(c.length>0){let d=n.getClosestMoveToAxis(c[0].point,r);d?this.model.experimentalAddMove(d.move,{cancel:l}):console.info("Skipping move!")}}},k=new WeakMap,Xe=new WeakMap,Ir),Je,he,R,Ke,ee,O,Te,et,Lr,kt=(Lr=class extends C{constructor(e){super();s(this,"model");h(this,Je,new Pe(this,"back-view-",["auto","none","side-by-side","top-right"]));h(this,he,new le);h(this,R,null);h(this,Ke);h(this,ee,new Set);h(this,O,null);h(this,Te,new qr);h(this,et,new ft);this.model=e}disconnect(){o(this,he).disconnect()}async connectedCallback(){this.addCSS(Et);let e=new wt(this.model,this);this.addVantage(e),this.model&&(o(this,he).addMultiListener([this.model.puzzleLoader,this.model.visualizationStrategy],this.onPuzzle.bind(this)),o(this,he).addListener(this.model.backView,this.setBackView.bind(this))),this.scheduleRender()}setBackView(e){let r=["side-by-side","top-right"].includes(e),n=o(this,R)!==null;o(this,Je).setValue(e),r?n||(f(this,R,new wt(this.model,this,{backView:!0})),this.addVantage(o(this,R)),this.scheduleRender()):o(this,R)&&(this.removeVantage(o(this,R)),f(this,R,null))}async onPress(e){let r=o(this,O);if(!r){console.info("no wrapper; skipping scene wrapper press!");return}let n=(async()=>{let[i,{ThreeRaycaster:a,ThreeVector2:l}]=await Promise.all([e.detail.cameraPromise,(async()=>{let{ThreeRaycaster:u,ThreeVector2:g}=await W;return{ThreeRaycaster:u,ThreeVector2:g}})()]),c=new a,d=new l(e.detail.pressInfo.normalizedX,e.detail.pressInfo.normalizedY);return c.setFromCamera(d,i),c})();await r.raycastMove(n,{invert:!e.detail.pressInfo.rightClick,depth:e.detail.pressInfo.keys.ctrlOrMetaKey?"rotation":e.detail.pressInfo.keys.shiftKey?"secondSlice":"none"})}async scene(){return o(this,Ke)??f(this,Ke,(async()=>new(await W).ThreeScene)())}addVantage(e){e.addEventListener("press",this.onPress.bind(this)),o(this,ee).add(e),this.contentWrapper.appendChild(e)}removeVantage(e){o(this,ee).delete(e),e.remove(),e.disconnect(),o(this,O)?.disconnect()}experimentalVantages(){return o(this,ee).values()}scheduleRender(){for(let e of o(this,ee))e.scheduleRender()}async setCurrentTwisty3DPuzzleWrapper(e,r){let n=o(this,O);try{f(this,O,r),n?.disconnect(),e.add(await r.twisty3DPuzzle())}finally{n&&e.remove(await n.twisty3DPuzzle())}o(this,Te).handleNewValue(r)}async experimentalTwisty3DPuzzleWrapper(){return o(this,O)||o(this,Te).promise}async onPuzzle(e){if(e[1]==="2D")return;o(this,O)?.disconnect();let[r,n]=await o(this,et).queue(Promise.all([this.scene(),new Wr(this.model,this,e[0],e[1])]));this.setCurrentTwisty3DPuzzleWrapper(r,n)}},Je=new WeakMap,he=new WeakMap,R=new WeakMap,Ke=new WeakMap,ee=new WeakMap,O=new WeakMap,Te=new WeakMap,et=new WeakMap,Lr);b.define("twisty-3d-scene-wrapper",kt);var $=typeof document>"u"?null:document,Hn=$?.fullscreenEnabled||!!$?.webkitFullscreenEnabled;function Yn(){return document.exitFullscreen?document.exitFullscreen():document.webkitExitFullscreen()}function ir(){return document.fullscreenElement?document.fullscreenElement:document.webkitFullscreenElement??null}function _n(t){return t.requestFullscreen?t.requestFullscreen():t.webkitRequestFullscreen()}var Gn=["skip-to-start","skip-to-end","step-forward","step-backward","pause","play","enter-fullscreen","exit-fullscreen","twizzle-tw"],Zn=class extends w{derive(t){return{fullscreen:{enabled:Hn,icon:document.fullscreenElement===null?"enter-fullscreen":"exit-fullscreen",title:"Enter fullscreen"},"jump-to-start":{enabled:!t.coarseTimelineInfo.atStart,icon:"skip-to-start",title:"Restart"},"play-step-backwards":{enabled:!t.coarseTimelineInfo.atStart,icon:"step-backward",title:"Step backward"},"play-pause":{enabled:!(t.coarseTimelineInfo.atStart&&t.coarseTimelineInfo.atEnd),icon:t.coarseTimelineInfo.playing?"pause":"play",title:t.coarseTimelineInfo.playing?"Pause":"Play"},"play-step":{enabled:!t.coarseTimelineInfo.atEnd,icon:"step-forward",title:"Step forward"},"jump-to-end":{enabled:!t.coarseTimelineInfo.atEnd,icon:"skip-to-end",title:"Skip to End"},"twizzle-link":{enabled:!0,icon:"twizzle-tw",title:"View at Twizzle",hidden:t.viewerLink==="none"}}}},Qr=new D;Qr.replaceSync(`
:host {
  width: 384px;
  height: 24px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
}

.wrapper {
  grid-auto-flow: column;
}

.viewer-link-none .twizzle-link-button {
  display: none;
}

.wrapper twisty-button,
.wrapper twisty-control-button {
  width: inherit;
  height: inherit;
}
`);var Hr=new D;Hr.replaceSync(`
:host:not([hidden]) {
  display: grid;
}

:host {
  width: 48px;
  height: 24px;
}

.wrapper {
  width: 100%;
  height: 100%;
}

button {
  width: 100%;
  height: 100%;
  border: none;
  
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;

  background-color: rgba(196, 196, 196, 0.75);
}

button:enabled {
  background-color: rgba(196, 196, 196, 0.75)
}

.dark-mode button:enabled {
  background-color: #88888888;
}

button:disabled {
  background-color: rgba(0, 0, 0, 0.4);
  opacity: 0.25;
  pointer-events: none;
}

.dark-mode button:disabled {
  background-color: #ffffff44;
}

button:enabled:hover {
  background-color: rgba(255, 255, 255, 0.75);
  box-shadow: 0 0 1em rgba(0, 0, 0, 0.25);
  cursor: pointer;
}

/* TODO: fullscreen icons have too much padding?? */
.svg-skip-to-start button,
button.svg-skip-to-start {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjQzIDEwMzdxMTktMTkgMzItMTN0MTMgMzJ2MTQ3MnEwIDI2LTEzIDMydC0zMi0xM2wtNzEwLTcxMHEtOS05LTEzLTE5djcxMHEwIDI2LTEzIDMydC0zMi0xM2wtNzEwLTcxMHEtOS05LTEzLTE5djY3OHEwIDI2LTE5IDQ1dC00NSAxOUg5NjBxLTI2IDAtNDUtMTl0LTE5LTQ1VjEwODhxMC0yNiAxOS00NXQ0NS0xOWgxMjhxMjYgMCA0NSAxOXQxOSA0NXY2NzhxNC0xMSAxMy0xOWw3MTAtNzEwcTE5LTE5IDMyLTEzdDEzIDMydjcxMHE0LTExIDEzLTE5eiIvPjwvc3ZnPg==");
}

.svg-skip-to-end button,
button.svg-skip-to-end {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik05NDEgMjU0N3EtMTkgMTktMzIgMTN0LTEzLTMyVjEwNTZxMC0yNiAxMy0zMnQzMiAxM2w3MTAgNzEwcTggOCAxMyAxOXYtNzEwcTAtMjYgMTMtMzJ0MzIgMTNsNzEwIDcxMHE4IDggMTMgMTl2LTY3OHEwLTI2IDE5LTQ1dDQ1LTE5aDEyOHEyNiAwIDQ1IDE5dDE5IDQ1djE0MDhxMCAyNi0xOSA0NXQtNDUgMTloLTEyOHEtMjYgMC00NS0xOXQtMTktNDV2LTY3OHEtNSAxMC0xMyAxOWwtNzEwIDcxMHEtMTkgMTktMzIgMTN0LTEzLTMydi03MTBxLTUgMTAtMTMgMTl6Ii8+PC9zdmc+");
}

.svg-step-forward button,
button.svg-step-forward {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjg4IDE1NjhxMCAyNi0xOSA0NWwtNTEyIDUxMnEtMTkgMTktNDUgMTl0LTQ1LTE5cS0xOS0xOS0xOS00NXYtMjU2aC0yMjRxLTk4IDAtMTc1LjUgNnQtMTU0IDIxLjVxLTc2LjUgMTUuNS0xMzMgNDIuNXQtMTA1LjUgNjkuNXEtNDkgNDIuNS04MCAxMDF0LTQ4LjUgMTM4LjVxLTE3LjUgODAtMTcuNSAxODEgMCA1NSA1IDEyMyAwIDYgMi41IDIzLjV0Mi41IDI2LjVxMCAxNS04LjUgMjV0LTIzLjUgMTBxLTE2IDAtMjgtMTctNy05LTEzLTIydC0xMy41LTMwcS03LjUtMTctMTAuNS0yNC0xMjctMjg1LTEyNy00NTEgMC0xOTkgNTMtMzMzIDE2Mi00MDMgODc1LTQwM2gyMjR2LTI1NnEwLTI2IDE5LTQ1dDQ1LTE5cTI2IDAgNDUgMTlsNTEyIDUxMnExOSAxOSAxOSA0NXoiLz48L3N2Zz4=");
}

.svg-step-backward button,
button.svg-step-backward {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNjg4IDIwNDhxMCAxNjYtMTI3IDQ1MS0zIDctMTAuNSAyNHQtMTMuNSAzMHEtNiAxMy0xMyAyMi0xMiAxNy0yOCAxNy0xNSAwLTIzLjUtMTB0LTguNS0yNXEwLTkgMi41LTI2LjV0Mi41LTIzLjVxNS02OCA1LTEyMyAwLTEwMS0xNy41LTE4MXQtNDguNS0xMzguNXEtMzEtNTguNS04MC0xMDF0LTEwNS41LTY5LjVxLTU2LjUtMjctMTMzLTQyLjV0LTE1NC0yMS41cS03Ny41LTYtMTc1LjUtNmgtMjI0djI1NnEwIDI2LTE5IDQ1dC00NSAxOXEtMjYgMC00NS0xOWwtNTEyLTUxMnEtMTktMTktMTktNDV0MTktNDVsNTEyLTUxMnExOS0xOSA0NS0xOXQ0NSAxOXExOSAxOSAxOSA0NXYyNTZoMjI0cTcxMyAwIDg3NSA0MDMgNTMgMTM0IDUzIDMzM3oiLz48L3N2Zz4=");
}

.svg-pause button,
button.svg-pause {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNTYwIDEwODh2MTQwOHEwIDI2LTE5IDQ1dC00NSAxOWgtNTEycS0yNiAwLTQ1LTE5dC0xOS00NVYxMDg4cTAtMjYgMTktNDV0NDUtMTloNTEycTI2IDAgNDUgMTl0MTkgNDV6bS04OTYgMHYxNDA4cTAgMjYtMTkgNDV0LTQ1IDE5aC01MTJxLTI2IDAtNDUtMTl0LTE5LTQ1VjEwODhxMC0yNiAxOS00NXQ0NS0xOWg1MTJxMjYgMCA0NSAxOXQxOSA0NXoiLz48L3N2Zz4=");
}

.svg-play button,
button.svg-play {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIzNTg0IiBoZWlnaHQ9IjM1ODQiIHZpZXdCb3g9IjAgMCAzNTg0IDM1ODQiPjxwYXRoIGQ9Ik0yNDcyLjUgMTgyM2wtMTMyOCA3MzhxLTIzIDEzLTM5LjUgM3QtMTYuNS0zNlYxMDU2cTAtMjYgMTYuNS0zNnQzOS41IDNsMTMyOCA3MzhxMjMgMTMgMjMgMzF0LTIzIDMxeiIvPjwvc3ZnPg==");
}

.svg-enter-fullscreen button,
button.svg-enter-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgd2lkdGg9IjI4Ij48cGF0aCBkPSJNMiAyaDI0djI0SDJ6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTkgMTZIN3Y1aDV2LTJIOXYtM3ptLTItNGgyVjloM1Y3SDd2NXptMTIgN2gtM3YyaDV2LTVoLTJ2M3pNMTYgN3YyaDN2M2gyVjdoLTV6Ii8+PC9zdmc+");
}

.svg-exit-fullscreen button,
button.svg-exit-fullscreen {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIGhlaWdodD0iMjgiIHZpZXdCb3g9IjAgMCAyOCAyOCIgd2lkdGg9IjI4Ij48cGF0aCBkPSJNMiAyaDI0djI0SDJ6IiBmaWxsPSJub25lIi8+PHBhdGggZD0iTTcgMThoM3YzaDJ2LTVIN3Yyem0zLThIN3YyaDVWN2gtMnYzem02IDExaDJ2LTNoM3YtMmgtNXY1em0yLTExVjdoLTJ2NWg1di0yaC0zeiIvPjwvc3ZnPg==");
}

.svg-twizzle-tw button,
button.svg-twizzle-tw {
  background-image: url("data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODY0IiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cGF0aCBkPSJNMzk3LjU4MSAxNTEuMTh2NTcuMDg0aC04OS43MDN2MjQwLjM1MmgtNjYuOTU1VjIwOC4yNjRIMTUxLjIydi01Ny4wODNoMjQ2LjM2MXptNTQuMzEgNzEuNjc3bDcuNTEyIDMzLjY5MmMyLjcxOCAxMi4xNiA1LjU4IDI0LjY4IDguNTg0IDM3LjU1NWEyMTgwLjc3NSAyMTgwLjc3NSAwIDAwOS40NDIgMzguODQzIDEyNjYuMyAxMjY2LjMgMCAwMDEwLjA4NiAzNy41NTVjMy43Mi0xMi41OSA3LjM2OC0yNS40NjYgMTAuOTQ1LTM4LjYyOCAzLjU3Ni0xMy4xNjIgNy4wMS0yNi4xMSAxMC4zLTM4Ljg0M2w1Ljc2OS0yMi40NTZjMS4yNDgtNC44ODcgMi40NzItOS43MDUgMy42NzQtMTQuNDU1IDMuMDA0LTExLjg3NSA1LjY1MS0yMi45NjIgNy45NC0zMy4yNjNoNDYuMzU0bDIuMzg0IDEwLjU2M2EyMDAwLjc3IDIwMDAuNzcgMCAwMDMuOTM1IDE2LjgyOGw2LjcxMSAyNy43MWMxLjIxMyA0Ljk1NiAyLjQ1IDkuOTggMy43MDkgMTUuMDczYTMxMTkuNzc3IDMxMTkuNzc3IDAgMDA5Ljg3MSAzOC44NDMgMTI0OS4yMjcgMTI0OS4yMjcgMCAwMDEwLjczIDM4LjYyOCAxOTA3LjYwNSAxOTA3LjYwNSAwIDAwMTAuMzAxLTM3LjU1NSAxMzk3Ljk0IDEzOTcuOTQgMCAwMDkuNjU3LTM4Ljg0M2w0LjQtMTkuMDQ2Yy43MTUtMy4xMyAxLjQyMS02LjIzNiAyLjExOC05LjMyMWw5LjU3Ny00Mi44OGg2Ni41MjZhMjk4OC43MTggMjk4OC43MTggMCAwMS0xOS41MjkgNjYuMzExbC01LjcyOCAxOC40ODJhMzIzNy40NiAzMjM3LjQ2IDAgMDEtMTQuMDE1IDQzLjc1MmMtNi40MzggMTkuNi0xMi43MzMgMzcuNjk4LTE4Ljg4NSA1NC4yOTRsLTMuMzA2IDguODI1Yy00Ljg4NCAxMi44OTgtOS40MzMgMjQuMjYzLTEzLjY0NyAzNC4wOTVoLTQ5Ljc4N2E4NDE3LjI4OSA4NDE3LjI4OSAwIDAxLTIxLjAzMS02NC44MDkgMTI4OC42ODYgMTI4OC42ODYgMCAwMS0xOC44ODUtNjQuODEgMTk3Mi40NDQgMTk3Mi40NDQgMCAwMS0xOC4yNCA2NC44MSAyNTc5LjQxMiAyNTc5LjQxMiAwIDAxLTIwLjM4OCA2NC44MWgtNDkuNzg3Yy00LjY4Mi0xMC45MjYtOS43Mi0yMy43NDMtMTUuMTEtMzguNDUxbC0xLjYyOS00LjQ3Yy01LjI1OC0xNC41MjEtMTAuNjgtMzAuMTkyLTE2LjI2Ni00Ny4wMTRsLTIuNDA0LTcuMjhjLTYuNDM4LTE5LjYtMTMuMDItNDAuMzQ0LTE5Ljc0My02Mi4yMzRhMjk4OC43MDcgMjk4OC43MDcgMCAwMS0xOS41MjktNjYuMzExaDY3LjM4NXoiIGZpbGw9IiM0Mjg1RjQiIGZpbGwtcnVsZT0ibm9uemVybyIvPjwvc3ZnPg==");
}
`);var sr={fullscreen:!0,"jump-to-start":!0,"play-step-backwards":!0,"play-pause":!0,"play-step":!0,"jump-to-end":!0,"twizzle-link":!0},tt,_r,Dr,Yr=(Dr=class extends C{constructor(e,r,n){super();h(this,tt);s(this,"model");s(this,"controller");s(this,"defaultFullscreenElement");s(this,"buttons",null);this.model=e,this.controller=r,this.defaultFullscreenElement=n}connectedCallback(){this.addCSS(Qr);let e={};for(let r in sr){let n=new Gr;e[r]=n,n.htmlButton.addEventListener("click",()=>T(this,tt,_r).call(this,r)),this.addElement(n)}this.buttons=e,this.model?.buttonAppearance.addFreshListener(this.update.bind(this)),this.model?.twistySceneModel.colorScheme.addFreshListener(this.updateColorScheme.bind(this))}async onFullscreenButton(){if(!this.defaultFullscreenElement)throw new Error("Attempted to go fullscreen without an element.");if(ir()===this.defaultFullscreenElement)Yn();else{this.buttons?.fullscreen.setIcon("exit-fullscreen"),_n(await this.model?.twistySceneModel.fullscreenElement.get()??this.defaultFullscreenElement);let e=()=>{ir()!==this.defaultFullscreenElement&&(this.buttons?.fullscreen.setIcon("enter-fullscreen"),globalThis.removeEventListener("fullscreenchange",e))};globalThis.addEventListener("fullscreenchange",e)}}async update(e){for(let r in sr){let n=this.buttons[r],i=e[r];n.htmlButton.disabled=!i.enabled,n.htmlButton.title=i.title,n.setIcon(i.icon),n.hidden=!!i.hidden}}updateColorScheme(e){for(let r of Object.values(this.buttons??{}))r.updateColorScheme(e)}},tt=new WeakSet,_r=function(e){switch(e){case"fullscreen":{this.onFullscreenButton();break}case"jump-to-start":{this.controller?.jumpToStart({flash:!0});break}case"play-step-backwards":{this.controller?.animationController.play({direction:-1,untilBoundary:"move"});break}case"play-pause":{this.controller?.togglePlay();break}case"play-step":{this.controller?.animationController.play({direction:1,untilBoundary:"move"});break}case"jump-to-end":{this.controller?.jumpToEnd({flash:!0});break}case"twizzle-link":{this.controller?.visitTwizzleLink();break}default:throw new Error("Missing command")}},Dr);b.define("twisty-buttons",Yr);var rt,Cr,Gr=(Cr=class extends C{constructor(){super(...arguments);s(this,"htmlButton",document.createElement("button"));h(this,rt,new Pe(this,"svg-",Gn))}updateColorScheme(e){this.contentWrapper.classList.toggle("dark-mode",e==="dark")}connectedCallback(){this.addCSS(Hr),this.addElement(this.htmlButton)}setIcon(e){o(this,rt).setValue(e)}},rt=new WeakMap,Cr);b.define("twisty-button",Gr);var Zr=new D;Zr.replaceSync(`
:host {
  width: 384px;
  height: 16px;
  display: grid;
}

.wrapper {
  width: 100%;
  height: 100%;
  display: grid;
  overflow: hidden;
  backdrop-filter: blur(4px);
  -webkit-backdrop-filter: blur(4px);
  background: rgba(196, 196, 196, 0.75);
}

input:not(:disabled) {
  cursor: ew-resize;
}

.wrapper.dark-mode {
  background: #666666;
}
`);var $n=!1,Ye=!1;$?.addEventListener("mousedown",t=>{t.which&&(Ye=!0)},!0);$?.addEventListener("mouseup",t=>{t.which&&(Ye=!1)},!0);var It=0,qe=0;$?.addEventListener("mousedown",()=>{qe++},!1);$?.addEventListener("mousemove",$r,!1);$?.addEventListener("mouseenter",$r,!1);function $r(t){It=t.pageY}var ar=0,or=0,Mt=!1,yt=0,nt,Er,Xr=(Er=class extends C{constructor(e,r){super();s(this,"model");s(this,"controller");h(this,nt,null);this.model=e,this.controller=r}async onDetailedTimelineInfo(e){let r=await this.inputElem();r.min=e.timeRange.start.toString(),r.max=e.timeRange.end.toString(),r.disabled=r.min===r.max,r.value=e.timestamp.toString()}async connectedCallback(){this.addCSS(Zr),this.addElement(await this.inputElem()),this.model?.twistySceneModel.colorScheme.addFreshListener(this.updateColorScheme.bind(this))}updateColorScheme(e){this.contentWrapper.classList.toggle("dark-mode",e==="dark")}async inputElem(){return o(this,nt)??f(this,nt,(async()=>{let e=document.createElement("input");return e.type="range",e.disabled=!0,this.model?.detailedTimelineInfo.addFreshListener(this.onDetailedTimelineInfo.bind(this)),e.addEventListener("input",this.onInput.bind(this)),e.addEventListener("keydown",this.onKeypress.bind(this)),e})())}async onInput(e){if(Mt)return;let r=await this.inputElem();await this.slowDown(e,r);let n=parseInt(r.value,10);this.model?.playingInfo.set({playing:!1}),this.model?.timestampRequest.set(n)}onKeypress(e){switch(e.key){case"ArrowLeft":case"ArrowRight":{this.controller?.animationController.play({direction:e.key==="ArrowLeft"?-1:1,untilBoundary:"move"}),e.preventDefault();break}case" ":{this.controller?.togglePlay(),e.preventDefault();break}}}async slowDown(e,r){if($n&&Ye){let n=r.getBoundingClientRect(),i=n.top+n.height/2;console.log(i,e,It,Ye);let a=Math.abs(i-It),l=1;a>64&&(l=Math.max(2**(-(a-64)/64),1/32));let c=parseInt(r.value,10);if(console.log("cl",yt,qe,c),yt===qe){let d=(c-or)*l;console.log("delta",d,a),Mt=!0;let u=c;u=ar+d*l+(c-ar)*Math.min(1,(1/2)**(a*a/64)),r.value=u.toString(),console.log(l),Mt=!1,this.contentWrapper.style.opacity=l.toString()}else yt=qe;or=c}}},nt=new WeakMap,Er);b.define("twisty-scrubber",Xr);var lr=null;async function cr(t,e){let[{ThreePerspectiveCamera:r,ThreeScene:n},i,a,l,c,d,u]=await Promise.all([(async()=>{let{ThreePerspectiveCamera:se,ThreeScene:gn}=await W;return{ThreePerspectiveCamera:se,ThreeScene:gn}})(),await t.puzzleLoader.get(),await t.visualizationStrategy.get(),await t.twistySceneModel.stickeringRequest.get(),await t.twistySceneModel.stickeringMaskRequest.get(),await t.legacyPosition.get(),await t.twistySceneModel.orbitCoordinates.get()]),g=e?.width??2048,m=e?.height??2048,z=g/m,y=lr??(lr=await(async()=>new r(20,z,.1,20))()),I=new n,Re=new Wr(t,{scheduleRender:()=>{}},i,a);I.add(await Re.twisty3DPuzzle()),await _t(y,u);let ie=(await Yt(g,m,I,y)).toDataURL(),Oe=await Jr(t);return{dataURL:ie,download:async se=>{Kr(ie,se??Oe)}}}async function Jr(t){let[e,r]=await Promise.all([t.puzzleID.get(),t.alg.get()]);return`[${e}]${r.alg.experimentalNumChildAlgNodes()===0?"":` ${r.alg.toString()}`}`}function Kr(t,e,r="png"){let n=document.createElement("a");n.href=t,n.download=`${e}.${r}`,n.click()}var en=new D;en.replaceSync(`
:host {
  width: 384px;
  height: 256px;
  display: grid;

  -webkit-user-select: none;
  user-select: none;
}

.wrapper {
  display: grid;
  overflow: hidden;
  contain: size;
  grid-template-rows: 7fr minmax(1.5em, 0.5fr) minmax(2em, 1fr);
}

.wrapper > * {
  width: inherit;
  height: inherit;
  overflow: hidden;
}

.wrapper.controls-none {
  grid-template-rows: 7fr;
}

.wrapper.controls-none twisty-scrubber,
.wrapper.controls-none twisty-control-button-panel ,
.wrapper.controls-none twisty-scrubber,
.wrapper.controls-none twisty-buttons {
  display: none;
}

twisty-scrubber {
  background: rgba(196, 196, 196, 0.5);
}

.wrapper.checkered,
.wrapper.checkered-transparent {
  background-color: #EAEAEA;
  background-image: linear-gradient(45deg, #DDD 25%, transparent 25%, transparent 75%, #DDD 75%, #DDD),
    linear-gradient(45deg, #DDD 25%, transparent 25%, transparent 75%, #DDD 75%, #DDD);
  background-size: 32px 32px;
  background-position: 0 0, 16px 16px;
}

.wrapper.checkered-transparent {
  background-color: #F4F4F4;
  background-image: linear-gradient(45deg, #DDDDDD88 25%, transparent 25%, transparent 75%, #DDDDDD88 75%, #DDDDDD88),
    linear-gradient(45deg, #DDDDDD88 25%, transparent 25%, transparent 75%, #DDDDDD88 75%, #DDDDDD88);
}

.wrapper.dark-mode {
  background-color: #444;
  background-image: linear-gradient(45deg, #DDDDDD0b 25%, transparent 25%, transparent 75%, #DDDDDD0b 75%, #DDDDDD0b),
    linear-gradient(45deg, #DDDDDD0b 25%, transparent 25%, transparent 75%, #DDDDDD0b 75%, #DDDDDD0b);
}

.visualization-wrapper > * {
  width: 100%;
  height: 100%;
}

.error-elem {
  width: 100%;
  height: 100%;
  display: none;
  place-content: center;
  font-family: sans-serif;
  box-shadow: inset 0 0 2em rgb(255, 0, 0);
  color: red;
  text-shadow: 0 0 0.2em white;
  background: rgba(255, 255, 255, 0.25);
}

.wrapper.error .visualization-wrapper {
  display: none;
}

.wrapper.error .error-elem {
  display: grid;
}
`);var ur=class extends v{getDefaultValue(){return null}},Lt=class extends q{getDefaultValue(){return null}derive(t){return typeof t=="string"?new URL(t,location.href):t}},we=class tn{constructor(e){s(this,"warnings");s(this,"errors");this.warnings=Object.freeze(e?.warnings??[]),this.errors=Object.freeze(e?.errors??[]),Object.freeze(this)}add(e){return new tn({warnings:this.warnings.concat(e?.warnings??[]),errors:this.errors.concat(e?.errors??[])})}log(){this.errors.length>0?console.error(`\u{1F6A8} ${this.errors[0]}`):this.warnings.length>0?console.warn(`\u26A0\uFE0F ${this.warnings[0]}`):console.info("\u{1F60E} No issues!")}};function rn(t){try{let e=S.fromString(t),r=[];return e.toString()!==t&&r.push("Alg is non-canonical!"),{alg:e,issues:new we({warnings:r})}}catch(e){return{alg:new S,issues:new we({errors:[`Malformed alg: ${e.toString()}`]})}}}function Xn(t,e){return t.alg.isIdentical(e.alg)&&At(t.issues.warnings,e.issues.warnings)&&At(t.issues.errors,e.issues.errors)}var dr=class extends q{getDefaultValue(){return{alg:new S,issues:new we}}canReuseValue(t,e){return Xn(t,e)}async derive(t){return typeof t=="string"?rn(t):{alg:t,issues:new we}}},Jn=class extends w{derive(t){return t.kpuzzle.algToTransformation(t.setupAlg.alg)}},Kn=class extends w{derive(t){if(t.setupTransformation)return t.setupTransformation;switch(t.setupAnchor){case"start":return t.setupAlgTransformation;case"end":{let r=t.indexer.transformationAtIndex(t.indexer.numAnimatedLeaves()).invert();return t.setupAlgTransformation.applyTransformation(r)}default:throw new Error("Unimplemented!")}}},ei=class extends v{getDefaultValue(){return null}},ti=class extends v{getDefaultValue(){return{move:null,amount:0}}canReuseValue(t,e){return t.move===e.move&&t.amount===e.amount}},ri=class extends w{derive(t){return{patternIndex:t.currentMoveInfo.patternIndex,movesFinishing:t.currentMoveInfo.movesFinishing.map(e=>e.move),movesFinished:t.currentMoveInfo.movesFinished.map(e=>e.move)}}canReuseValue(t,e){return t.patternIndex===e.patternIndex&&nr(t.movesFinishing,e.movesFinishing,(r,n)=>r.isIdentical(n))&&nr(t.movesFinished,e.movesFinished,(r,n)=>r.isIdentical(n))}},ni=class extends w{derive(t){function e(r){return t.detailedTimelineInfo.atEnd&&t.catchUpMove.move!==null&&r.currentMoves.push({move:t.catchUpMove.move,direction:-1,fraction:1-t.catchUpMove.amount,startTimestamp:-1,endTimestamp:-1}),r}if(t.indexer.currentMoveInfo)return e(t.indexer.currentMoveInfo(t.detailedTimelineInfo.timestamp));{let r=t.indexer.timestampToIndex(t.detailedTimelineInfo.timestamp),n={patternIndex:r,currentMoves:[],movesFinishing:[],movesFinished:[],movesStarting:[],latestStart:-1/0,earliestEnd:1/0};if(t.indexer.numAnimatedLeaves()>0){let i=t.indexer.getAnimLeaf(r)?.as(L);if(!i)return e(n);let a=t.indexer.indexToMoveStartTimestamp(r),l=t.indexer.moveDuration(r),c=l?(t.detailedTimelineInfo.timestamp-a)/l:0,d=a+l,u={move:i,direction:1,fraction:c,startTimestamp:a,endTimestamp:d};c===0?n.movesStarting.push(u):c===1?n.movesFinishing.push(u):(n.currentMoves.push(u),n.latestStart=Math.max(n.latestStart,a),n.earliestEnd=Math.min(n.earliestEnd,d))}return e(n)}}},ii=class extends w{derive(t){let e=t.indexer.transformationAtIndex(t.currentLeavesSimplified.patternIndex);e=t.anchoredStart.applyTransformation(e);for(let r of t.currentLeavesSimplified.movesFinishing)e=e.applyMove(r);for(let r of t.currentLeavesSimplified.movesFinished)e=e.applyMove(r);return e.toKPattern()}},hr={u:"y",l:"x",f:"z",r:"x",b:"z",d:"y",m:"x",e:"y",s:"z",x:"x",y:"y",z:"z"};function si(t,e){return hr[t.family[0].toLowerCase()]===hr[e.family[0].toLowerCase()]}var ai=class extends P{traverseAlg(t){let e=[];for(let r of t.childAlgNodes())e.push(this.traverseAlgNode(r));return Array.prototype.concat(...e)}traverseGroupingOnce(t){if(t.experimentalIsEmpty())return[];let e=[];for(let i of t.childAlgNodes()){if(!(i.is(L)||i.is(Rt)||i.is(Ot)))return this.traverseAlg(t);let a=i.as(L);a&&e.push(a)}let r=J(e[0].amount);for(let i=0;i<e.length-1;i++){for(let a=1;a<e.length;a++)if(!si(e[i],e[a]))return this.traverseAlg(t);r=Math.max(r,J(e[i].amount))}let n=e.map(i=>({animLeafAlgNode:i,msUntilNext:0,duration:r}));return n[n.length-1].msUntilNext=r,n}traverseGrouping(t){let e=[],r=t.amount>0?t.alg:t.alg.invert();for(let n=0;n<Math.abs(t.amount);n++)e.push(this.traverseGroupingOnce(r));return Array.prototype.concat(...e)}traverseMove(t){let e=J(t.amount);return[{animLeafAlgNode:t,msUntilNext:e,duration:e}]}traverseCommutator(t){let e=[],r=[t.A,t.B,t.A.invert(),t.B.invert()];for(let n of r)e.push(this.traverseGroupingOnce(n));return Array.prototype.concat(...e)}traverseConjugate(t){let e=[],r=[t.A,t.B,t.A.invert()];for(let n of r)e.push(this.traverseGroupingOnce(n));return Array.prototype.concat(...e)}traversePause(t){if(t.experimentalNISSGrouping)return[];let e=J(1);return[{animLeafAlgNode:t,msUntilNext:e,duration:e}]}traverseNewline(t){return[]}traverseLineComment(t){return[]}},oi=A(ai);function li(t){let e=0;return oi(t).map(n=>{let i={animLeaf:n.animLeafAlgNode,start:e,end:e+n.duration};return e+=n.msUntilNext,i})}var xt=class{constructor(t,e,r){s(this,"kpuzzle");s(this,"animLeaves");this.kpuzzle=t,this.animLeaves=r?.animationTimelineLeaves??li(e)}getAnimLeaf(t){return this.animLeaves[Math.min(t,this.animLeaves.length-1)]?.animLeaf??null}getAnimationTimelineLeaf(t){return this.animLeaves[Math.min(t,this.animLeaves.length-1)]}indexToMoveStartTimestamp(t){let e=0;return this.animLeaves.length>0&&(e=this.animLeaves[Math.min(t,this.animLeaves.length-1)].start),e}timestampToIndex(t){let e=0;for(e=0;e<this.animLeaves.length;e++)if(this.animLeaves[e].start>=t)return Math.max(0,e-1);return Math.max(0,e-1)}timestampToPosition(t,e){let r=this.currentMoveInfo(t),n=e??this.kpuzzle.identityTransformation().toKPattern();for(let i of this.animLeaves.slice(0,r.patternIndex)){let a=i.animLeaf.as(L);a!==null&&(n=n.applyMove(a))}return{pattern:n,movesInProgress:r.currentMoves}}currentMoveInfo(t){let e=1/0;for(let u of this.animLeaves)if(u.start<=t&&u.end>=t)e=Math.min(e,u.start);else if(u.start>t)break;let r=[],n=[],i=[],a=[],l=-1/0,c=1/0,d=0;for(let u of this.animLeaves)if(u.end<=e){if(!isFinite(e)&&u.start>t)break;d++}else{if(u.start>t)break;{let g=u.animLeaf.as(L);if(g!==null){let m=(t-u.start)/(u.end-u.start),z=!1;m>1&&(m=1,z=!0);let y={move:g,direction:1,fraction:m,startTimestamp:u.start,endTimestamp:u.end};switch(m){case 0:{n.push(y);break}case 1:{z?a.push(y):i.push(y);break}default:r.push(y),l=Math.max(l,u.start),c=Math.min(c,u.end)}}}}return{patternIndex:d,currentMoves:r,latestStart:l,earliestEnd:c,movesStarting:n,movesFinishing:i,movesFinished:a}}patternAtIndex(t,e){let r=e??this.kpuzzle.defaultPattern();for(let n=0;n<this.animLeaves.length&&n<t;n++){let a=this.animLeaves[n].animLeaf.as(L);a!==null&&(r=r.applyMove(a))}return r}transformationAtIndex(t){let e=this.kpuzzle.identityTransformation();for(let r of this.animLeaves.slice(0,t)){let n=r.animLeaf.as(L);n!==null&&(e=e.applyMove(n))}return e}algDuration(){let t=0;for(let e of this.animLeaves)t=Math.max(t,e.end);return t}numAnimatedLeaves(){return this.animLeaves.length}moveDuration(t){let e=this.getAnimationTimelineLeaf(t);return e.end-e.start}},ci=1024,ui=class extends w{derive(t){switch(t.indexerConstructorRequest){case"auto":return t.animationTimelineLeaves!==null||Jt(t.alg.alg)<=ci&&t.puzzle==="3x3x3"&&t.visualizationStrategy==="Cube3D"?xt:er;case"tree":return er;case"simple":return In;case"simultaneous":return xt;default:throw new Error("Invalid indexer request!")}}},di=class extends v{getDefaultValue(){return"auto"}},hi=class extends w{derive(t){return new t.indexerConstructor(t.kpuzzle,t.algWithIssues.alg,{animationTimelineLeaves:t.animationTimelineLeaves})}},mi=class extends w{derive(t){return{pattern:t.currentPattern,movesInProgress:t.currentMoveInfo.currentMoves}}},pi=!0,mr=class extends w{async derive(t){try{return pi&&t.kpuzzle.algToTransformation(t.algWithIssues.alg),t.algWithIssues}catch(e){return{alg:new S,issues:new we({errors:[`Invalid alg for puzzle: ${e.toString()}`]})}}}},gi=class extends v{getDefaultValue(){return"start"}},fi=class extends v{getDefaultValue(){return null}},vi=class extends w{async derive(t){return t.puzzleLoader.kpuzzle()}},wi=class extends v{getDefaultValue(){return oe}},Mi=class extends w{async derive(t){return t.puzzleLoader.id}},yi=class extends v{getDefaultValue(){return oe}},xi=class extends w{derive(t){if(t.puzzleIDRequest&&t.puzzleIDRequest!==oe){let e=gt[t.puzzleIDRequest];return e||this.userVisibleErrorTracker.set({errors:[`Invalid puzzle ID: ${t.puzzleIDRequest}`]}),e}return t.puzzleDescriptionRequest&&t.puzzleDescriptionRequest!==oe?Ut(t.puzzleDescriptionRequest):qt}},zi=class extends w{derive(t){return{playing:t.playingInfo.playing,atStart:t.detailedTimelineInfo.atStart,atEnd:t.detailedTimelineInfo.atEnd}}canReuseValue(t,e){return t.playing===e.playing&&t.atStart===e.atStart&&t.atEnd===e.atEnd}},it,nn,Nr,Ti=(Nr=class extends w{constructor(){super(...arguments);h(this,it)}derive(e){let r=T(this,it,nn).call(this,e),n=!1,i=!1;return r>=e.timeRange.end&&(i=!0,r=Math.min(e.timeRange.end,r)),r<=e.timeRange.start&&(n=!0,r=Math.max(e.timeRange.start,r)),{timestamp:r,timeRange:e.timeRange,atStart:n,atEnd:i}}canReuseValue(e,r){return e.timestamp===r.timestamp&&e.timeRange.start===r.timeRange.start&&e.timeRange.end===r.timeRange.end&&e.atStart===r.atStart&&e.atEnd===r.atEnd}},it=new WeakSet,nn=function(e){switch(e.timestampRequest){case"auto":return e.setupAnchor==="start"&&e.setupAlg.alg.experimentalIsEmpty()?e.timeRange.end:e.timeRange.start;case"start":return e.timeRange.start;case"end":return e.timeRange.end;case"anchor":return e.setupAnchor==="start"?e.timeRange.start:e.timeRange.end;case"opposite-anchor":return e.setupAnchor==="start"?e.timeRange.end:e.timeRange.start;default:return e.timestampRequest}},Nr),Ai=class extends q{async getDefaultValue(){return{direction:1,playing:!1,untilBoundary:"entire-timeline",loop:!1}}async derive(t,e){let r=await e,n=Object.assign({},r);return Object.assign(n,t),n}canReuseValue(t,e){return t.direction===e.direction&&t.playing===e.playing&&t.untilBoundary===e.untilBoundary&&t.loop===e.loop}},Si=class extends q{getDefaultValue(){return 1}derive(t){return t<0?1:t}},bi={auto:!0,start:!0,end:!0,anchor:!0,"opposite-anchor":!0},ki=class extends v{getDefaultValue(){return"auto"}set(t){let e=this.get();super.set((async()=>this.validInput(await t)?t:e)())}validInput(t){return!!(typeof t=="number"||bi[t])}},Ii=class extends w{derive(t){return{start:0,end:t.indexer.algDuration()}}},Li=class extends v{getDefaultValue(){return"auto"}},Di=class extends v{getDefaultValue(){return"auto"}},Ci=class extends w{derive(t){switch(t.puzzleID){case"clock":case"square1":case"redi_cube":case"melindas2x2x2x2":case"tri_quad":case"loopover":return"2D";case"3x3x3":switch(t.visualizationRequest){case"auto":case"3D":return"Cube3D";default:return t.visualizationRequest}default:switch(t.visualizationRequest){case"auto":case"3D":return"PG3D";case"experimental-2D-LL":case"experimental-2D-LL-face":return["2x2x2","4x4x4","megaminx"].includes(t.puzzleID)?"experimental-2D-LL":"2D";default:return t.visualizationRequest}}}},Ei=class extends v{getDefaultValue(){return"auto"}},Ni=class extends v{getDefaultValue(){return"auto"}},Pi=class extends v{getDefaultValue(){return"auto"}},Ri=class extends v{getDefaultValue(){return"auto"}},pr=null;async function Oi(){return pr??(pr=new(await W).ThreeTextureLoader)}var gr=class extends w{async derive(t){let{spriteURL:e}=t;return e===null?null:new Promise(async(r,n)=>{let i=()=>{console.warn("Could not load sprite:",e.toString()),r(null)};try{(await Oi()).load(e.toString(),r,i,i)}catch{i()}})}},Fi={facelets:["regular","regular","regular","regular","regular"]};async function ji(t){let{definition:e}=await t.kpuzzle(),r={orbits:{}};for(let n of e.orbits)r.orbits[n.orbitName]={pieces:new Array(n.numPieces).fill(Fi)};return r}var Vi=class extends w{getDefaultValue(){return{orbits:{}}}async derive(t){return t.stickeringMaskRequest?t.stickeringMaskRequest:t.stickeringRequest==="picture"?{specialBehaviour:"picture",orbits:{}}:t.puzzleLoader.stickeringMask?.(t.stickeringRequest??"full")??ji(t.puzzleLoader)}},Bi={"-":"Regular",D:"Dim",I:"Ignored",X:"Invisible",O:"IgnoreNonPrimary",P:"PermuteNonPrimary",o:"Ignoriented","?":"OrientationWithoutPermutation",M:"Mystery","@":"Regular"};function Ui(t){let e={orbits:{}},r=t.split(",");for(let n of r){let[i,a,...l]=n.split(":");if(l.length>0)throw new Error(`Invalid serialized orbit stickering mask (too many colons): \`${n}\``);let c=[];e.orbits[i]={pieces:c};for(let d of a){let u=Bi[d];c.push(Vt(u))}}return e}var qi=class extends q{getDefaultValue(){return null}derive(t){return t===null?null:typeof t=="string"?Ui(t):t}},Wi=class extends v{getDefaultValue(){return null}},Qi=class extends v{getDefaultValue(){return"auto"}},Hi=class extends v{getDefaultValue(){return{}}},Yi=class extends v{getDefaultValue(){return"auto"}},_i=class extends v{getDefaultValue(){return"auto"}},Gi=class extends w{derive(t){return t.colorSchemeRequest==="dark"?"dark":"light"}},Zi=class extends v{getDefaultValue(){return"auto"}},$i=class extends v{getDefaultValue(){return null}},Xi=35,Ji=class extends v{getDefaultValue(){return Xi}};function sn(t,e){return t.latitude===e.latitude&&t.longitude===e.longitude&&t.distance===e.distance}var Ki=class extends q{getDefaultValue(){return"auto"}canReuseValue(t,e){return t===e||sn(t,e)}async derive(t,e){if(t==="auto")return"auto";let r=await e;r==="auto"&&(r={});let n=Object.assign({},r);return Object.assign(n,t),typeof n.latitude<"u"&&(n.latitude=Math.min(Math.max(n.latitude,-90),90)),typeof n.longitude<"u"&&(n.longitude=St(n.longitude,180,-180)),n}},es=class extends w{canReuseValue(t,e){return sn(t,e)}async derive(t){if(t.orbitCoordinatesRequest==="auto")return vr(t.puzzleID,t.strategy);let e=Object.assign(Object.assign({},vr(t.puzzleID,t.strategy),t.orbitCoordinatesRequest));if(Math.abs(e.latitude)<=t.latitudeLimit)return e;{let{latitude:r,longitude:n,distance:i}=e;return{latitude:t.latitudeLimit*Math.sign(r),longitude:n,distance:i}}}},ts={latitude:31.717474411461005,longitude:0,distance:5.877852522924731},rs={latitude:35,longitude:30,distance:6},fr={latitude:35,longitude:30,distance:6.25},ns={latitude:Math.atan(1/2)*Ht,longitude:0,distance:6.7},is={latitude:26.56505117707799,longitude:0,distance:6};function vr(t,e){if(t[1]==="x")return e==="Cube3D"?rs:fr;switch(t){case"megaminx":case"gigaminx":return ns;case"pyraminx":case"master_tetraminx":return is;case"skewb":return fr;default:return ts}}var ss=class{constructor(t){s(this,"twistyPlayerModel");s(this,"background",new _i);s(this,"colorSchemeRequest",new Zi);s(this,"dragInput",new Qi);s(this,"foundationDisplay",new Ni);s(this,"foundationStickerSpriteURL",new Lt);s(this,"fullscreenElement",new $i);s(this,"hintFacelet",new Qt);s(this,"hintStickerSpriteURL",new Lt);s(this,"initialHintFaceletsAnimation",new Ri);s(this,"hintFaceletsElevation",new Pi);s(this,"latitudeLimit",new Ji);s(this,"movePressInput",new Yi);s(this,"movePressCancelOptions",new Hi);s(this,"orbitCoordinatesRequest",new Ki);s(this,"stickeringMaskRequest",new qi);s(this,"stickeringRequest",new Wi);s(this,"faceletScale",new Ei);s(this,"colorScheme",new Gi({colorSchemeRequest:this.colorSchemeRequest}));s(this,"foundationStickerSprite",new gr({spriteURL:this.foundationStickerSpriteURL}));s(this,"hintStickerSprite",new gr({spriteURL:this.hintStickerSpriteURL}));s(this,"orbitCoordinates");s(this,"stickeringMask");this.twistyPlayerModel=t,this.orbitCoordinates=new es({orbitCoordinatesRequest:this.orbitCoordinatesRequest,latitudeLimit:this.latitudeLimit,puzzleID:t.puzzleID,strategy:t.visualizationStrategy}),this.stickeringMask=new Vi({stickeringMaskRequest:this.stickeringMaskRequest,stickeringRequest:this.stickeringRequest,puzzleLoader:t.puzzleLoader})}},as={errors:[]},os=class extends v{getDefaultValue(){return as}reset(){this.set(this.getDefaultValue())}canReuseValue(t,e){return At(t.errors,e.errors)}},ls=class{constructor(){s(this,"userVisibleErrorTracker",new os);s(this,"alg",new dr);s(this,"backView",new Rn);s(this,"controlPanel",new Wn);s(this,"catchUpMove",new ti);s(this,"indexerConstructorRequest",new di);s(this,"playingInfo",new Ai);s(this,"puzzleDescriptionRequest",new wi);s(this,"puzzleIDRequest",new yi);s(this,"setupAnchor",new gi);s(this,"setupAlg",new dr);s(this,"setupTransformation",new fi);s(this,"tempoScale",new Si);s(this,"timestampRequest",new ki);s(this,"viewerLink",new Li);s(this,"visualizationFormat",new Di);s(this,"title",new ur);s(this,"videoURL",new Lt);s(this,"competitionID",new ur);s(this,"animationTimelineLeavesRequest",new ei);s(this,"puzzleLoader",new xi({puzzleIDRequest:this.puzzleIDRequest,puzzleDescriptionRequest:this.puzzleDescriptionRequest},this.userVisibleErrorTracker));s(this,"kpuzzle",new vi({puzzleLoader:this.puzzleLoader}));s(this,"puzzleID",new Mi({puzzleLoader:this.puzzleLoader}));s(this,"puzzleAlg",new mr({algWithIssues:this.alg,kpuzzle:this.kpuzzle}));s(this,"puzzleSetupAlg",new mr({algWithIssues:this.setupAlg,kpuzzle:this.kpuzzle}));s(this,"visualizationStrategy",new Ci({visualizationRequest:this.visualizationFormat,puzzleID:this.puzzleID}));s(this,"indexerConstructor",new ui({alg:this.alg,puzzle:this.puzzleID,visualizationStrategy:this.visualizationStrategy,indexerConstructorRequest:this.indexerConstructorRequest,animationTimelineLeaves:this.animationTimelineLeavesRequest}));s(this,"setupAlgTransformation",new Jn({setupAlg:this.puzzleSetupAlg,kpuzzle:this.kpuzzle}));s(this,"indexer",new hi({indexerConstructor:this.indexerConstructor,algWithIssues:this.puzzleAlg,kpuzzle:this.kpuzzle,animationTimelineLeaves:this.animationTimelineLeavesRequest}));s(this,"anchorTransformation",new Kn({setupTransformation:this.setupTransformation,setupAnchor:this.setupAnchor,setupAlgTransformation:this.setupAlgTransformation,indexer:this.indexer}));s(this,"timeRange",new Ii({indexer:this.indexer}));s(this,"detailedTimelineInfo",new Ti({timestampRequest:this.timestampRequest,timeRange:this.timeRange,setupAnchor:this.setupAnchor,setupAlg:this.setupAlg}));s(this,"coarseTimelineInfo",new zi({detailedTimelineInfo:this.detailedTimelineInfo,playingInfo:this.playingInfo}));s(this,"currentMoveInfo",new ni({indexer:this.indexer,detailedTimelineInfo:this.detailedTimelineInfo,catchUpMove:this.catchUpMove}));s(this,"buttonAppearance",new Zn({coarseTimelineInfo:this.coarseTimelineInfo,viewerLink:this.viewerLink}));s(this,"currentLeavesSimplified",new ri({currentMoveInfo:this.currentMoveInfo}));s(this,"currentPattern",new ii({anchoredStart:this.anchorTransformation,currentLeavesSimplified:this.currentLeavesSimplified,indexer:this.indexer}));s(this,"legacyPosition",new mi({currentMoveInfo:this.currentMoveInfo,currentPattern:this.currentPattern}));s(this,"twistySceneModel",new ss(this))}async twizzleLink(){let[t,e,r,n,i,a,l,c]=await Promise.all([this.viewerLink.get(),this.puzzleID.get(),this.puzzleDescriptionRequest.get(),this.alg.get(),this.setupAlg.get(),this.setupAnchor.get(),this.twistySceneModel.stickeringRequest.get(),this.twistySceneModel.twistyPlayerModel.title.get()]),d=t==="experimental-twizzle-explorer",u=new URL(`https://alpha.twizzle.net/${d?"explore":"edit"}/`);return n.alg.experimentalIsEmpty()||u.searchParams.set("alg",n.alg.toString()),i.alg.experimentalIsEmpty()||u.searchParams.set("setup-alg",i.alg.toString()),a!=="start"&&u.searchParams.set("setup-anchor",a),l!=="full"&&l!==null&&u.searchParams.set("experimental-stickering",l),d&&r!==oe?u.searchParams.set("puzzle-description",r):e!=="3x3x3"&&u.searchParams.set("puzzle",e),c&&u.searchParams.set("title",c),u.toString()}experimentalAddAlgLeaf(t,e){let r=t.as(L);r?this.experimentalAddMove(r,e):this.alg.set((async()=>{let i=(await this.alg.get()).alg.concat(new S([t]));return this.timestampRequest.set("end"),i})())}experimentalAddMove(t,e){let r=typeof t=="string"?new L(t):t;this.alg.set((async()=>{let[{alg:n},i]=await Promise.all([this.alg.get(),this.puzzleLoader.get()]),a=jt(n,r,{...e,...await Bt(i)});return this.timestampRequest.set("end"),this.catchUpMove.set({move:r,amount:0}),a})())}experimentalRemoveFinalChild(){this.alg.set((async()=>{let t=(await this.alg.get()).alg,e=Array.from(t.childAlgNodes()),[r]=e.splice(-1);if(!r)return t;this.timestampRequest.set("end");let n=r.as(L);return n&&this.catchUpMove.set({move:n.invert(),amount:0}),new S(e)})())}};function p(t){return new Error(`Cannot get \`.${t}\` directly from a \`TwistyPlayer\`.`)}var cs=class extends C{constructor(){super(...arguments);s(this,"experimentalModel",new ls);s(this,"experimentalGet",new us(this.experimentalModel))}set alg(e){this.experimentalModel.alg.set(e)}get alg(){throw p("alg")}set experimentalSetupAlg(e){this.experimentalModel.setupAlg.set(e)}get experimentalSetupAlg(){throw p("setup")}set experimentalSetupAnchor(e){this.experimentalModel.setupAnchor.set(e)}get experimentalSetupAnchor(){throw p("anchor")}set puzzle(e){this.experimentalModel.puzzleIDRequest.set(e)}get puzzle(){throw p("puzzle")}set experimentalPuzzleDescription(e){this.experimentalModel.puzzleDescriptionRequest.set(e)}get experimentalPuzzleDescription(){throw p("experimentalPuzzleDescription")}set timestamp(e){this.experimentalModel.timestampRequest.set(e)}get timestamp(){throw p("timestamp")}set hintFacelets(e){this.experimentalModel.twistySceneModel.hintFacelet.set(e)}get hintFacelets(){throw p("hintFacelets")}set experimentalStickering(e){this.experimentalModel.twistySceneModel.stickeringRequest.set(e)}get experimentalStickering(){throw p("experimentalStickering")}set experimentalStickeringMaskOrbits(e){this.experimentalModel.twistySceneModel.stickeringMaskRequest.set(e)}get experimentalStickeringMaskOrbits(){throw p("experimentalStickeringMaskOrbits")}set experimentalFaceletScale(e){this.experimentalModel.twistySceneModel.faceletScale.set(e)}get experimentalFaceletScale(){throw p("experimentalFaceletScale")}set backView(e){this.experimentalModel.backView.set(e)}get backView(){throw p("backView")}set background(e){this.experimentalModel.twistySceneModel.background.set(e)}get background(){throw p("background")}set colorScheme(e){this.experimentalModel.twistySceneModel.colorSchemeRequest.set(e)}get colorScheme(){throw p("colorScheme")}set controlPanel(e){this.experimentalModel.controlPanel.set(e)}get controlPanel(){throw p("controlPanel")}set visualization(e){this.experimentalModel.visualizationFormat.set(e)}get visualization(){throw p("visualization")}set experimentalTitle(e){this.experimentalModel.title.set(e)}get experimentalTitle(){throw p("experimentalTitle")}set experimentalVideoURL(e){this.experimentalModel.videoURL.set(e)}get experimentalVideoURL(){throw p("experimentalVideoURL")}set experimentalCompetitionID(e){this.experimentalModel.competitionID.set(e)}get experimentalCompetitionID(){throw p("experimentalCompetitionID")}set viewerLink(e){this.experimentalModel.viewerLink.set(e)}get viewerLink(){throw p("viewerLink")}set experimentalMovePressInput(e){this.experimentalModel.twistySceneModel.movePressInput.set(e)}get experimentalMovePressInput(){throw p("experimentalMovePressInput")}set experimentalMovePressCancelOptions(e){this.experimentalModel.twistySceneModel.movePressCancelOptions.set(e)}get experimentalMovePressCancelOptions(){throw p("experimentalMovePressCancelOptions")}set cameraLatitude(e){this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({latitude:e})}get cameraLatitude(){throw p("cameraLatitude")}set cameraLongitude(e){this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({longitude:e})}get cameraLongitude(){throw p("cameraLongitude")}set cameraDistance(e){this.experimentalModel.twistySceneModel.orbitCoordinatesRequest.set({distance:e})}get cameraDistance(){throw p("cameraDistance")}set cameraLatitudeLimit(e){this.experimentalModel.twistySceneModel.latitudeLimit.set(e)}get cameraLatitudeLimit(){throw p("cameraLatitudeLimit")}set indexer(e){this.experimentalModel.indexerConstructorRequest.set(e)}get indexer(){throw p("indexer")}set tempoScale(e){this.experimentalModel.tempoScale.set(e)}get tempoScale(){throw p("tempoScale")}set experimentalSprite(e){this.experimentalModel.twistySceneModel.foundationStickerSpriteURL.set(e)}get experimentalSprite(){throw p("experimentalSprite")}set experimentalHintSprite(e){this.experimentalModel.twistySceneModel.hintStickerSpriteURL.set(e)}get experimentalHintSprite(){throw p("experimentalHintSprite")}set fullscreenElement(e){this.experimentalModel.twistySceneModel.fullscreenElement.set(e)}get fullscreenElement(){throw p("fullscreenElement")}set experimentalInitialHintFaceletsAnimation(e){this.experimentalModel.twistySceneModel.initialHintFaceletsAnimation.set(e)}get experimentalInitialHintFaceletsAnimation(){throw p("experimentalInitialHintFaceletsAnimation")}set experimentalHintFaceletsElevation(e){this.experimentalModel.twistySceneModel.hintFaceletsElevation.set(e)}get experimentalHintFaceletsElevation(){throw p("experimentalHintFaceletsElevation")}set experimentalDragInput(e){this.experimentalModel.twistySceneModel.dragInput.set(e)}get experimentalDragInput(){throw p("experimentalDragInput")}},us=class{constructor(t){s(this,"model");this.model=t}async alg(){return(await this.model.alg.get()).alg}async setupAlg(){return(await this.model.setupAlg.get()).alg}puzzleID(){return this.model.puzzleID.get()}async timestamp(){return(await this.model.detailedTimelineInfo.get()).timestamp}},zt="data-",_e={alg:"alg","experimental-setup-alg":"experimentalSetupAlg","experimental-setup-anchor":"experimentalSetupAnchor",puzzle:"puzzle","experimental-puzzle-description":"experimentalPuzzleDescription",visualization:"visualization","hint-facelets":"hintFacelets","experimental-stickering":"experimentalStickering","experimental-stickering-mask-orbits":"experimentalStickeringMaskOrbits",background:"background","color-scheme":"colorScheme","control-panel":"controlPanel","back-view":"backView","experimental-facelet-scale":"experimentalFaceletScale","experimental-initial-hint-facelets-animation":"experimentalInitialHintFaceletsAnimation","experimental-hint-facelets-elevation":"experimentalHintFaceletsElevation","viewer-link":"viewerLink","experimental-move-press-input":"experimentalMovePressInput","experimental-drag-input":"experimentalDragInput","experimental-title":"experimentalTitle","experimental-video-url":"experimentalVideoURL","experimental-competition-id":"experimentalCompetitionID","camera-latitude":"cameraLatitude","camera-longitude":"cameraLongitude","camera-distance":"cameraDistance","camera-latitude-limit":"cameraLatitudeLimit","tempo-scale":"tempoScale","experimental-sprite":"experimentalSprite","experimental-hint-sprite":"experimentalHintSprite"},ds=Object.fromEntries(Object.values(_e).map(t=>[t,!0])),hs={experimentalMovePressCancelOptions:!0},Tt,an=Symbol("intersectedCallback");function ms(t){Tt??(Tt=new IntersectionObserver((e,r)=>{for(let n of e)n.isIntersecting&&n.intersectionRect.height>0&&(n.target[an](),r.unobserve(n.target))})),Tt.observe(t)}var st,Ae,me,Se,be,F,ke,Ie,at,on,Pr,ut=(Pr=class extends cs{constructor(e={}){super();h(this,at);s(this,"controller",new Un(this.experimentalModel,this));s(this,"buttons");s(this,"experimentalCanvasClickCallback",()=>{});h(this,st,new Pe(this,"controls-",["auto"].concat(Object.keys(qn))));h(this,Ae,document.createElement("div"));h(this,me,document.createElement("div"));h(this,Se,!1);h(this,be,"auto");h(this,F,null);h(this,ke,new qr);h(this,Ie,null);for(let[r,n]of Object.entries(e)){if(!(ds[r]||hs[r])){console.warn(`Invalid config passed to TwistyPlayer: ${r}`);break}this[r]=n}}connectedCallback(){this.addCSS(en),ms(this)}async[an](){if(o(this,Se))return;f(this,Se,!0),this.addElement(o(this,Ae)).classList.add("visualization-wrapper"),this.addElement(o(this,me)).classList.add("error-elem"),o(this,me).textContent="Error",this.experimentalModel.userVisibleErrorTracker.addFreshListener(r=>{let n=r.errors[0]??null;this.contentWrapper.classList.toggle("error",!!n),n&&(o(this,me).textContent=n)});let e=new Xr(this.experimentalModel,this.controller);this.contentWrapper.appendChild(e),this.buttons=new Yr(this.experimentalModel,this.controller,this),this.contentWrapper.appendChild(this.buttons),this.experimentalModel.twistySceneModel.background.addFreshListener(r=>{this.contentWrapper.classList.toggle("checkered",["auto","checkered"].includes(r)),this.contentWrapper.classList.toggle("checkered-transparent",r==="checkered-transparent")}),this.experimentalModel.twistySceneModel.colorScheme.addFreshListener(r=>{this.contentWrapper.classList.toggle("dark-mode",["dark"].includes(r))}),this.experimentalModel.controlPanel.addFreshListener(r=>{o(this,st).setValue(r)}),this.experimentalModel.visualizationStrategy.addFreshListener(T(this,at,on).bind(this)),this.experimentalModel.puzzleID.addFreshListener(this.flash.bind(this))}experimentalSetFlashLevel(e){f(this,be,e)}flash(){o(this,be)==="auto"&&o(this,F)?.animate([{opacity:.25},{opacity:1}],{duration:250,easing:"ease-out"})}async experimentalCurrentVantages(){this.connectedCallback();let e=o(this,F);return e instanceof kt?e.experimentalVantages():[]}async experimentalCurrentCanvases(){let e=await this.experimentalCurrentVantages(),r=[];for(let n of e)r.push((await n.canvasInfo()).canvas);return r}async experimentalCurrentThreeJSPuzzleObject(e){this.connectedCallback();let n=await(await o(this,ke).promise).experimentalTwisty3DPuzzleWrapper(),i=n.twisty3DPuzzle(),a=(async()=>{await i,await new Promise(l=>setTimeout(l,0))})();if(e){let l=new ge(async()=>{});n.addEventListener("render-scheduled",async()=>{l.requestIsPending()||(l.requestAnimFrame(),await a,e())})}return i}jumpToStart(e){this.controller.jumpToStart(e)}jumpToEnd(e){this.controller.jumpToEnd(e)}play(){this.controller.togglePlay(!0)}pause(){this.controller.togglePlay(!1)}togglePlay(e){this.controller.togglePlay(e)}experimentalAddMove(e,r){this.experimentalModel.experimentalAddMove(e,r)}experimentalAddAlgLeaf(e,r){this.experimentalModel.experimentalAddAlgLeaf(e,r)}static get observedAttributes(){let e=[];for(let r of Object.keys(_e))e.push(r,zt+r);return e}experimentalRemoveFinalChild(){this.experimentalModel.experimentalRemoveFinalChild()}attributeChangedCallback(e,r,n){e.startsWith(zt)&&(e=e.slice(zt.length));let i=_e[e];i&&(this[i]=n)}async experimentalScreenshot(e){return(await cr(this.experimentalModel,e)).dataURL}async experimentalDownloadScreenshot(e){if(["2D","experimental-2D-LL","experimental-2D-LL-face"].includes(await this.experimentalModel.visualizationStrategy.get())){let n=await o(this,F).currentTwisty2DPuzzleWrapper().twisty2DPuzzle(),i=new XMLSerializer().serializeToString(n.svgWrapper.svgElement),a=URL.createObjectURL(new Blob([i]));Kr(a,e??await Jr(this.experimentalModel),"svg")}else await(await cr(this.experimentalModel)).download(e)}},st=new WeakMap,Ae=new WeakMap,me=new WeakMap,Se=new WeakMap,be=new WeakMap,F=new WeakMap,ke=new WeakMap,Ie=new WeakMap,at=new WeakSet,on=function(e){if(e!==o(this,Ie)){o(this,F)?.remove(),o(this,F)?.disconnect();let r;switch(e){case"2D":case"experimental-2D-LL":case"experimental-2D-LL-face":{r=new Ur(this.experimentalModel.twistySceneModel,e);break}case"Cube3D":case"PG3D":{r=new kt(this.experimentalModel),o(this,ke).handleNewValue(r);break}default:throw new Error("Invalid visualization")}o(this,Ae).appendChild(r),f(this,F,r),f(this,Ie,e)}},Pr);b.define("twisty-player",ut);var ps=class extends Fe{traverseAlg(t,e){let r=[],n=0;for(let i of t.childAlgNodes()){let a=this.traverseAlgNode(i,{numMovesSoFar:e.numMovesSoFar+n});r.push(a.tokens),n+=a.numLeavesInside}return{tokens:Array.prototype.concat(...r),numLeavesInside:n}}traverseGrouping(t,e){let r=this.traverseAlg(t.alg,e);return{tokens:r.tokens,numLeavesInside:r.numLeavesInside*t.amount}}traverseMove(t,e){return{tokens:[{leaf:t,idx:e.numMovesSoFar}],numLeavesInside:1}}traverseCommutator(t,e){let r=this.traverseAlg(t.A,e),n=this.traverseAlg(t.B,{numMovesSoFar:e.numMovesSoFar+r.numLeavesInside});return{tokens:r.tokens.concat(n.tokens),numLeavesInside:r.numLeavesInside*2+n.numLeavesInside}}traverseConjugate(t,e){let r=this.traverseAlg(t.A,e),n=this.traverseAlg(t.B,{numMovesSoFar:e.numMovesSoFar+r.numLeavesInside});return{tokens:r.tokens.concat(n.tokens),numLeavesInside:r.numLeavesInside*2+n.numLeavesInside*2}}traversePause(t,e){return{tokens:[{leaf:t,idx:e.numMovesSoFar}],numLeavesInside:1}}traverseNewline(t,e){return{tokens:[],numLeavesInside:0}}traverseLineComment(t,e){return{tokens:[],numLeavesInside:0}}},gs=A(ps),fs=class extends v{getDefaultValue(){return""}},vs=class extends w{derive(t){return rn(t.value)}},ws=class extends q{getDefaultValue(){return{selectionStart:0,selectionEnd:0,endChangedMostRecently:!1}}async derive(t,e){let{selectionStart:r,selectionEnd:n}=t,i=await e,a=t.selectionStart===i.selectionStart&&t.selectionEnd!==(await e).selectionEnd;return{selectionStart:r,selectionEnd:n,endChangedMostRecently:a}}},Ms=class extends w{derive(t){return t.selectionInfo.endChangedMostRecently?t.selectionInfo.selectionEnd:t.selectionInfo.selectionStart}},ys=class extends w{derive(t){return gs(t.algWithIssues.alg,{numMovesSoFar:0}).tokens}},xs=class extends w{derive(t){function e(n){if(n===null)return null;let i;return t.targetChar<n.leaf[U]?i="before":t.targetChar===n.leaf[U]?i="start":t.targetChar<n.leaf[ae]?i="inside":t.targetChar===n.leaf[ae]?i="end":i="after",{leafInfo:n,where:i}}let r=null;for(let n of t.leafTokens){if(t.targetChar<n.leaf[U]&&r!==null)return e(r);if(t.targetChar<=n.leaf[ae])return e(n);r=n}return e(r)}},zs=class{constructor(){s(this,"valueProp",new fs);s(this,"selectionProp",new ws);s(this,"targetCharProp",new Ms({selectionInfo:this.selectionProp}));s(this,"algEditorAlgWithIssues",new vs({value:this.valueProp}));s(this,"leafTokensProp",new ys({algWithIssues:this.algEditorAlgWithIssues}));s(this,"leafToHighlight",new xs({leafTokens:this.leafTokensProp,targetChar:this.targetCharProp}))}},Ts="//";function As(t){try{return S.fromString(t)}catch{return null}}function ln(t,e){let r=t.indexOf(e);return r===-1?[t,""]:[t.slice(0,r),t.slice(r)]}function wr(t){let e=[];for(let r of t.split(`
`)){let[n,i]=ln(r,Ts);n=n.replaceAll("\u2019","'"),e.push(n+i)}return e.join(`
`)}function Ss(t,e){let{value:r}=t,{selectionStart:n,selectionEnd:i}=t,a=r.slice(0,n),l=r.slice(i);e=e.replaceAll(`\r
`,`
`);let c=a.match(/\/\/[^\n]*$/),d=r[n-1]==="/"&&e[0]==="/",u=c||d,g=e.match(/\/\/[^\n]*$/),m=e;if(u){let[N,ie]=ln(e,`
`);m=N+wr(ie)}else m=wr(e);let z=!u&&n!==0&&![`
`," "].includes(m[0])&&![`
`," "].includes(r[n-1]),y=!g&&i!==r.length&&![`
`," "].includes(m.at(-1))&&![`
`," "].includes(r[i]);function I(N,ie){let Oe=N+m+ie,se=!!As(a+Oe+l);return se&&(m=Oe),se}z&&y&&I(" "," ")||z&&I(" ","")||y&&I(""," "),$?.execCommand("insertText",!1,m)||t.setRangeText(m,n,i,"end")}var cn=new D;cn.replaceSync(`
:host {
  width: 384px;
  display: grid;
}

.wrapper {
  /*overflow: hidden;
  resize: horizontal;*/

  background: var(--background, none);
  display: grid;
}

textarea, .carbon-copy {
  grid-area: 1 / 1 / 2 / 2;

  width: 100%;
  font-family: sans-serif;
  line-height: 1.2em;

  font-size: var(--font-size, inherit);
  font-family: var(--font-family, sans-serif);

  box-sizing: border-box;

  padding: var(--padding, 0.5em);
  /* Prevent horizontal growth. */
  overflow-x: hidden;
}

textarea {
  resize: none;
  background: none;
  z-index: 2;
  border: 1px solid var(--border-color, rgba(0, 0, 0, 0.25));
  overflow: hidden;
}

.carbon-copy {
  white-space: pre-wrap;
  word-wrap: break-word;
  color: transparent;
  user-select: none;
  pointer-events: none;

  z-index: 1;
}

.carbon-copy .highlight {
  background: var(--highlight-color, rgba(255, 128, 0, 0.5));
  padding: 0.1em 0.2em;
  margin: -0.1em -0.2em;
  border-radius: 0.2em;
}

.wrapper.issue-warning textarea,
.wrapper.valid-for-puzzle-warning textarea {
  outline: none;
  border: 1px solid rgba(200, 200, 0, 0.5);
  background: rgba(255, 255, 0, 0.1);
}

.wrapper.issue-error textarea,
.wrapper.valid-for-puzzle-error textarea {
  outline: none;
  border: 1px solid red;
  background: rgba(255, 0, 0, 0.1);
}
`);var Ve="for-twisty-player",Mr="placeholder",yr="twisty-player-prop",M,Y,te,j,re,ot,E,_,V,We,Le,Dt,De,Rr,bs=(Rr=class extends C{constructor(e){super();h(this,V);s(this,"model",new zs);h(this,M,document.createElement("textarea"));h(this,Y,document.createElement("div"));h(this,te,document.createElement("span"));h(this,j,document.createElement("span"));h(this,re,document.createElement("span"));h(this,ot,new Pe(this,"valid-for-puzzle-",["none","warning","error"]));h(this,E,null);h(this,_);s(this,"debugNeverRequestTimestamp",!1);h(this,Le,!1);h(this,De,null);o(this,Y).classList.add("carbon-copy"),this.addElement(o(this,Y)),o(this,M).rows=1,this.addElement(o(this,M)),o(this,te).classList.add("prefix"),o(this,Y).appendChild(o(this,te)),o(this,j).classList.add("highlight"),o(this,Y).appendChild(o(this,j)),o(this,re).classList.add("suffix"),o(this,Y).appendChild(o(this,re)),o(this,M).placeholder="Alg",o(this,M).setAttribute("spellcheck","false"),this.addCSS(cn),o(this,M).addEventListener("input",()=>{f(this,Le,!0),this.onInput()}),o(this,M).addEventListener("blur",()=>this.onBlur()),document.addEventListener("selectionchange",()=>this.onSelectionChange()),e?.twistyPlayer&&(this.twistyPlayer=e.twistyPlayer),f(this,_,e?.twistyPlayerProp??"alg"),e?.twistyPlayerProp==="alg"&&this.model.leafToHighlight.addFreshListener(r=>{r&&this.highlightLeaf(r.leafInfo.leaf)})}connectedCallback(){o(this,M).addEventListener("paste",e=>{let r=e.clipboardData?.getData("text");r&&(Ss(o(this,M),r),e.preventDefault(),this.onInput())})}set algString(e){o(this,M).value=e,this.onInput()}get algString(){return o(this,M).value}set placeholder(e){o(this,M).placeholder=e}onInput(){o(this,j).hidden=!0,this.highlightLeaf(null);let e=o(this,M).value.trimEnd();this.model.valueProp.set(e),o(this,V,We)?.set(e)}async onSelectionChange(){if(document.activeElement!==this||this.shadow.activeElement!==o(this,M)||o(this,_)!=="alg")return;let{selectionStart:e,selectionEnd:r}=o(this,M);this.model.selectionProp.set({selectionStart:e,selectionEnd:r})}async onBlur(){}setAlgIssueClassForPuzzle(e){o(this,ot).setValue(e)}highlightLeaf(e){if(e===null){o(this,te).textContent="",o(this,j).textContent="",o(this,re).textContent=T(this,V,Dt).call(this,o(this,M).value);return}e!==o(this,De)&&(f(this,De,e),o(this,te).textContent=o(this,M).value.slice(0,e[U]),o(this,j).textContent=o(this,M).value.slice(e[U],e[ae]),o(this,re).textContent=T(this,V,Dt).call(this,o(this,M).value.slice(e[ae])),o(this,j).hidden=!1)}get twistyPlayer(){return o(this,E)}set twistyPlayer(e){if(o(this,E)){console.warn("twisty-player reassignment/clearing is not supported");return}f(this,E,e),e&&((async()=>this.algString=o(this,V,We)?(await o(this,V,We).get()).alg.toString():"")(),o(this,_)==="alg"&&(o(this,E)?.experimentalModel.puzzleAlg.addFreshListener(r=>{if(r.issues.errors.length===0){this.setAlgIssueClassForPuzzle(r.issues.warnings.length===0?"none":"warning");let n=r.alg,i=S.fromString(this.algString);n.isIdentical(i)||(this.algString=n.toString(),this.onInput())}else this.setAlgIssueClassForPuzzle("error")}),this.model.leafToHighlight.addFreshListener(async r=>{if(r===null)return;let[n,i]=await Promise.all([await e.experimentalModel.indexer.get(),await e.experimentalModel.timestampRequest.get()]);if(i==="auto"&&!o(this,Le))return;let a=n.indexToMoveStartTimestamp(r.leafInfo.idx),l=n.moveDuration(r.leafInfo.idx),c;switch(r.where){case"before":{c=a;break}case"start":case"inside":{c=a+l/4;break}case"end":case"after":{c=a+l;break}default:throw console.log("invalid where"),new Error("Invalid where!")}this.debugNeverRequestTimestamp||e.experimentalModel.timestampRequest.set(c)}),e.experimentalModel.currentLeavesSimplified.addFreshListener(async r=>{let i=(await e.experimentalModel.indexer.get()).getAnimLeaf(r.patternIndex);this.highlightLeaf(i)})))}attributeChangedCallback(e,r,n){switch(e){case Ve:{let i=document.getElementById(n);if(!i){console.warn(`${Ve}= elem does not exist`);return}if(!(i instanceof ut)){console.warn(`${Ve}=is not a twisty-player`);return}this.twistyPlayer=i;return}case Mr:{this.placeholder=n;return}case yr:{if(o(this,E))throw console.log("cannot set prop"),new Error("cannot set prop after twisty player");f(this,_,n);return}}}static get observedAttributes(){return[Ve,Mr,yr]}},M=new WeakMap,Y=new WeakMap,te=new WeakMap,j=new WeakMap,re=new WeakMap,ot=new WeakMap,E=new WeakMap,_=new WeakMap,V=new WeakSet,We=function(){return o(this,E)===null?null:o(this,E).experimentalModel[o(this,_)]},Le=new WeakMap,Dt=function(e){return e.endsWith(`
`)?`${e} `:e},De=new WeakMap,Rr);b.define("twisty-alg-editor",bs);async function ks(t){return new Promise((e,r)=>{try{let n=document.getElementById(t);n&&e(n);let i=new MutationObserver(a=>{for(let l of a)l.attributeName==="id"&&l.target instanceof Element&&l.target.getAttribute("id")===t&&(e(l.target),i.disconnect())});i.observe(document.body,{attributeFilter:["id"],subtree:!0})}catch(n){r(n)}})}var un=new D;un.replaceSync(`
:host {
  display: inline;
  --comment-shade: oklab(0.69 -0.19 0.14);
  --comment-opacity: 0.6;
  --active-background-shade: rgba(66, 133, 244);
}

.wrapper {
  display: inline;
  --current-color: currentColor
}

a {
  color: currentColor;

  &:not(:hover) {
    text-decoration: none;
  }

  &:hover {
    background: color-mix(in oklab, currentColor 20%, transparent);
  }

  &:active {
    color: currentColor;
    animation: 1s linear flash;
  }
}

@keyframes flash {
  from { opacity: 0.5; }
  to { opacity: 1; }
}

twisty-alg-leaf-elem.twisty-alg-line-comment {
  color: color-mix(in oklab, var(--comment-shade) 75%, currentColor);
  opacity: var(--comment-opacity);
}

.current-move {
  background: color-mix(in oklab, var(--active-background-shade) 30%, transparent);
  margin-left: -0.1em;
  margin-right: -0.1em;
  padding-left: 0.1em;
  padding-right: 0.1em;
  border-radius: 0.1em;
}
`);var Is=.25,ce=class extends vt{constructor(e,r,n,i,a,l){super();s(this,"algOrAlgNode");if(this.algOrAlgNode=i,this.classList.add(e),l){let c=this.appendChild(document.createElement("a"));c.href="#",c.textContent=r,c.addEventListener("click",d=>{d.preventDefault(),n.twistyAlgViewer.jumpToIndex(n.earliestMoveIndex,a)})}else this.appendChild(document.createElement("span")).textContent=r}pathToIndex(e){return[]}setCurrentMove(e){this.classList.toggle("current-move",e)}};b.define("twisty-alg-leaf-elem",ce);var ue=class extends vt{constructor(e,r){super();s(this,"algOrAlgNode");s(this,"queue",[]);this.algOrAlgNode=r,this.classList.add(e)}addString(e){let r=document.createElement("span");r.textContent=e,this.queue.push(r)}addElem(e){return this.queue.push(e.element),e.moveCount}flushQueue(e=1){for(let r of dn(this.queue,e))this.append(r);this.queue=[]}pathToIndex(e){return[]}};b.define("twisty-alg-wrapper-elem",ue);function Ls(t){return t===1?-1:1}function Ds(t,e){return e<0?Ls(t):t}function dn(t,e){if(e===1)return t;let r=Array.from(t);return r.reverse(),r}var Cs=class extends Fe{traverseAlg(t,e){let r=0,n=new ue("twisty-alg-alg",t),i=!0;for(let a of Nt(t.childAlgNodes(),e.direction))i||n.addString(" "),i=!1,a.as(mt)?.experimentalNISSGrouping&&n.addString("^("),a.as(pe)?.experimentalNISSPlaceholder||(r+=n.addElem(this.traverseAlgNode(a,{earliestMoveIndex:e.earliestMoveIndex+r,twistyAlgViewer:e.twistyAlgViewer,direction:e.direction}))),a.as(mt)?.experimentalNISSGrouping&&n.addString(")");return n.flushQueue(e.direction),{moveCount:r,element:n}}traverseGrouping(t,e){let r=t.experimentalAsSquare1Tuple(),n=Ds(e.direction,t.amount),i=0,a=new ue("twisty-alg-grouping",t);return a.addString("("),r?(i+=a.addElem({moveCount:1,element:new ce("twisty-alg-move",r[0].amount.toString(),e,r[0],!0,!0)}),a.addString(", "),i+=a.addElem({moveCount:1,element:new ce("twisty-alg-move",r[1].amount.toString(),e,r[1],!0,!0)})):i+=a.addElem(this.traverseAlg(t.alg,{earliestMoveIndex:e.earliestMoveIndex+i,twistyAlgViewer:e.twistyAlgViewer,direction:n})),a.addString(`)${t.experimentalRepetitionSuffix}`),a.flushQueue(),{moveCount:i*Math.abs(t.amount),element:a}}traverseMove(t,e){let r=new ce("twisty-alg-move",t.toString(),e,t,!0,!0);return e.twistyAlgViewer.highlighter.addMove(t[U],r),{moveCount:1,element:r}}traverseCommutator(t,e){let r=0,n=new ue("twisty-alg-commutator",t);n.addString("["),n.flushQueue();let[i,a]=dn([t.A,t.B],e.direction);return r+=n.addElem(this.traverseAlg(i,{earliestMoveIndex:e.earliestMoveIndex+r,twistyAlgViewer:e.twistyAlgViewer,direction:e.direction})),n.addString(", "),r+=n.addElem(this.traverseAlg(a,{earliestMoveIndex:e.earliestMoveIndex+r,twistyAlgViewer:e.twistyAlgViewer,direction:e.direction})),n.flushQueue(e.direction),n.addString("]"),n.flushQueue(),{moveCount:r*2,element:n}}traverseConjugate(t,e){let r=0,n=new ue("twisty-alg-conjugate",t);n.addString("[");let i=n.addElem(this.traverseAlg(t.A,{earliestMoveIndex:e.earliestMoveIndex+r,twistyAlgViewer:e.twistyAlgViewer,direction:e.direction}));return r+=i,n.addString(": "),r+=n.addElem(this.traverseAlg(t.B,{earliestMoveIndex:e.earliestMoveIndex+r,twistyAlgViewer:e.twistyAlgViewer,direction:e.direction})),n.addString("]"),n.flushQueue(),{moveCount:r+i,element:n}}traversePause(t,e){return t.experimentalNISSGrouping?this.traverseAlg(t.experimentalNISSGrouping.alg,e):{moveCount:1,element:new ce("twisty-alg-pause",".",e,t,!0,!0)}}traverseNewline(t,e){let r=new ue("twisty-alg-newline",t);return r.append(document.createElement("br")),{moveCount:0,element:r}}traverseLineComment(t,e){return{moveCount:0,element:new ce("twisty-alg-line-comment",`//${t.text}`,e,t,!1,!1)}}},Es=A(Cs),Ns=class{constructor(){s(this,"moveCharIndexMap",new Map);s(this,"currentElem",null)}addMove(t,e){this.moveCharIndexMap.set(t,e)}set(t){let e=t?this.moveCharIndexMap.get(t[U])??null:null;this.currentElem!==e&&(this.currentElem?.setCurrentMove(!1),e?.setCurrentMove(!0),this.currentElem=e)}},Ce,Ee,G,lt,mn,Or,hn=(Or=class extends C{constructor(e){super({mode:"open"});h(this,lt);s(this,"highlighter",new Ns);h(this,Ce);h(this,Ee);h(this,G,null);s(this,"lastClickTimestamp",null);this.addCSS(un),e?.twistyPlayer&&(this.twistyPlayer=e?.twistyPlayer)}connectedCallback(){}setAlg(e){o(this,Ee)?.isIdentical(e)||(f(this,Ce,Es(e,{earliestMoveIndex:0,twistyAlgViewer:this,direction:1}).element),f(this,Ee,e),this.contentWrapper.textContent="",this.contentWrapper.appendChild(o(this,Ce)))}get twistyPlayer(){return o(this,G)}set twistyPlayer(e){T(this,lt,mn).call(this,e)}async jumpToIndex(e,r){let n=o(this,G);if(n){n.pause();let i=(async()=>{let a=await n.experimentalModel.indexer.get(),l=r?a.moveDuration(e)*Is:0;return a.indexToMoveStartTimestamp(e)+a.moveDuration(e)-l})();n.experimentalModel.timestampRequest.set(await i),this.lastClickTimestamp===await i?(n.play(),this.lastClickTimestamp=null):this.lastClickTimestamp=await i}}async attributeChangedCallback(e,r,n){if(e==="for"){let i=document.getElementById(n);if(i||console.info("for= elem does not exist, waiting for one"),await customElements.whenDefined("twisty-player"),i=await ks(n),!(i instanceof ut)){console.warn("for= elem is not a twisty-player");return}this.twistyPlayer=i}}static get observedAttributes(){return["for"]}},Ce=new WeakMap,Ee=new WeakMap,G=new WeakMap,lt=new WeakSet,mn=async function(e){if(o(this,G)){console.warn("twisty-player reassignment is not supported");return}if(e===null)throw new Error("clearing twistyPlayer is not supported");f(this,G,e),o(this,G).experimentalModel.alg.addFreshListener(r=>{this.setAlg(r.alg)}),e.experimentalModel.currentMoveInfo.addFreshListener(r=>{let n=r.currentMoves[0];if(n??(n=r.movesStarting[0]),n??(n=r.movesFinishing[0]),!n)this.highlighter.set(null);else{let i=n.move;this.highlighter.set(i)}}),e.experimentalModel.detailedTimelineInfo.addFreshListener(r=>{r.timestamp!==this.lastClickTimestamp&&(this.lastClickTimestamp=null)})},Or);b.define("twisty-alg-viewer",hn);var Qe=new D;Qe.replaceSync(`
.wrapper {
  background: rgb(255, 245, 235);
  border: 1px solid rgba(0, 0, 0, 0.25);

  /* Workaround from https://stackoverflow.com/questions/40010597/how-do-i-apply-opacity-to-a-css-color-variable */
  --text-color: 0, 0, 0;
  --heading-background: 255, 230, 210;

  color: rgb(var(--text-color));
}

.setup-alg, twisty-alg-viewer {
  padding: 0.5em 1em;
}

.heading {
  background: rgba(var(--heading-background), 1);
  color: rgba(var(--text-color), 1);
  font-weight: bold;
  padding: 0.25em 0.5em;
  display: grid;
  grid-template-columns: auto 1fr;

  /* For the move count hover elems. */
  position: sticky;
}

.heading.title {
  background: rgb(255, 245, 235);
  font-size: 150%;
  white-space: pre-wrap;
}

.heading .move-count {
  font-weight: initial;
  text-align: right;
  color: rgba(var(--text-color), 0.4);
}

.wrapper.dark-mode .heading .move-count {
  color: rgba(var(--text-color), 0.7);
}

.heading a {
  text-decoration: none;
  color: inherit;
}

twisty-player {
  width: 100%;
  min-height: 128px;
  height: 288px;
  resize: vertical;
  overflow-y: hidden;
}

twisty-player + .heading {
  padding-top: 0.5em;
}

twisty-alg-viewer {
  display: inline-block;
}

.wrapper {
  container-type: inline-size;
}

.scrollable-region {
  border-top: 1px solid rgba(0, 0, 0, 0.25);
}

.scrollable-region {
  max-height: 18em;
  overflow-y: auto;
}

@container (min-width: 512px) {
  .responsive-wrapper {
    display: grid;
    grid-template-columns: 1fr 1fr;
  }
  twisty-player {
    height: 320px
  }
  .scrollable-region {
    border-top: none;
    border-left: 1px solid rgba(0, 0, 0, 0.25);
    contain: strict;
    max-height: 100cqh;
  }
}

.wrapper:fullscreen,
.wrapper:fullscreen .responsive-wrapper {
  width: 100%;
  height: 100%;
}

.wrapper:fullscreen twisty-player,
.wrapper:fullscreen .scrollable-region {
  height: 50%;
}

@container (min-width: 512px) {
  .wrapper:fullscreen twisty-player,
  .wrapper:fullscreen .scrollable-region {
    height: 100%;
  }
}

/* TODO: dedup with Twizzle Editor */
.move-count > span:hover:before {
  background-color: rgba(var(--heading-background), 1);
  color: rgba(var(--text-color), 1);
  backdrop-filter: blur(4px);
  z-index: 100;
  position: absolute;
  padding: 0.5em;
  top: 1.5em;
  right: 0;
  content: attr(data-before);
  white-space: pre-wrap;
  text-align: left;
}

.move-count > span:hover {
  color: rgba(var(--text-color), 1);
  cursor: help;
}
`);var pn=new D;pn.replaceSync(`
.wrapper {
  background: white;
  --heading-background: 232, 239, 253
}

.wrapper.dark-mode {
  --text-color: 236, 236, 236;
  --heading-background: 29, 29, 29;
}

.scrollable-region {
  overflow-y: auto;
}

.wrapper.dark-mode {
  background: #262626;
  --text-color: 142, 142, 142;
  border-color: #FFFFFF44;
}

.wrapper.dark-mode .heading:not(.title) {
  background: #1d1d1d;
}

.heading.title {
  background: none;
}
`);function Ps(t="",e=location.href){let r={alg:"alg","setup-alg":"experimental-setup-alg","setup-anchor":"experimental-setup-anchor",puzzle:"puzzle",stickering:"experimental-stickering","puzzle-description":"experimental-puzzle-description",title:"experimental-title","video-url":"experimental-video-url",competition:"experimental-competition-id"},n=new URL(e).searchParams,i={};for(let[a,l]of Object.entries(r)){let c=n.get(t+a);if(c!==null){let d=_e[l];i[d]=c}}return i}var Be="outer block moves (e.g. R, Rw, or 4r)",Ue="inner block moves (e.g. M or 2-5r)",xr={OBTM:`HTM = OBTM ("Outer Block Turn Metric"):
\u2022 ${Ue} count as 2 turns
\u2022 ${Be} count as 1 turn
\u2022 rotations (e.g. x) count as 0 turns`,OBQTM:`QTM = OBQTM ("Outer Block Quantum Turn Metric"):
\u2022 ${Ue} count as 2 turns per quantum (e.g. M2 counts as 4)
\u2022 ${Be} count as 1 turn per quantum (e.g. R2 counts as 2)
\u2022 rotations (e.g. x) count as 0 turns`,RBTM:`STM = RBTM ("Range Block Turn Metric"):
\u2022 ${Ue} count as 1 turn
\u2022 ${Be} count as 1 turn
\u2022 rotations (e.g. x) count as 0 turns`,RBQTM:`SQTM = RBQTM ("Range Block Quantum Turn Metric"):
\u2022 ${Ue} count as 1 turn per quantum (e.g. M2 counts as 2)
\u2022 ${Be} count as 1 turn per quantum (e.g. R2 counts as 2)
\u2022 rotations (e.g. x) count as 0 turns`,ETM:`ETM ("Execution Turn Metric"):
\u2022 all moves (including rotations) count as 1 turn`},Rs={OBTM:"OB",OBQTM:"OBQ",RBTM:"RB",RBQTM:"RBQ",ETM:"E"},B,Ct,ct,Z,ne,Ne,He,Fr,Os=(Fr=class extends C{constructor(e){super({mode:"open"});h(this,B);s(this,"options");s(this,"twistyPlayer",null);s(this,"a",null);h(this,ct);h(this,Z);h(this,ne);h(this,Ne);this.options=e}async connectedCallback(){if(f(this,ne,this.addElement(document.createElement("div"))),o(this,ne).classList.add("responsive-wrapper"),this.options?.colorScheme==="dark"&&this.contentWrapper.classList.add("dark-mode"),this.addCSS(Qe),this.options?.cdnForumTweaks&&this.addCSS(pn),this.a=this.querySelector("a"),!this.a)return;let e=Ps("",this.a.href),r=this.a?.href,{hostname:n,pathname:i}=new URL(r);if(n!=="alpha.twizzle.net"){T(this,B,Ct).call(this);return}if(["/edit/","/explore/"].includes(i)){let a=i==="/explore/";if(e.puzzle&&!(e.puzzle in gt)){let d=(await import("./chunks/puzzle-geometry-MXXTXC5H.js")).getPuzzleDescriptionString(e.puzzle);delete e.puzzle,e.experimentalPuzzleDescription=d}if(this.twistyPlayer=o(this,ne).appendChild(new ut({background:this.options?.cdnForumTweaks?"checkered-transparent":"checkered",colorScheme:this.options?.colorScheme==="dark"?"dark":"light",...e,viewerLink:a?"experimental-twizzle-explorer":"auto"})),this.twistyPlayer.fullscreenElement=this.contentWrapper,e.experimentalTitle&&(this.twistyPlayer.experimentalTitle=e.experimentalTitle),f(this,Z,o(this,ne).appendChild(document.createElement("div"))),o(this,Z).classList.add("scrollable-region"),e.experimentalTitle&&T(this,B,He).call(this,e.experimentalTitle).classList.add("title"),e.experimentalSetupAlg){T(this,B,He).call(this,"Setup",async()=>(await this.twistyPlayer?.experimentalModel.setupAlg.get())?.alg.toString()??null);let d=o(this,Z).appendChild(document.createElement("div"));d.classList.add("setup-alg"),d.textContent=new S(e.experimentalSetupAlg).toString()}let l=T(this,B,He).call(this,"Moves",async()=>(await this.twistyPlayer?.experimentalModel.alg.get())?.alg.toString()??null);f(this,Ne,l.appendChild(Fs(this.twistyPlayer.experimentalModel))),o(this,Ne).classList.add("move-count"),o(this,Z).appendChild(new hn({twistyPlayer:this.twistyPlayer})).part.add("twisty-alg-viewer")}else T(this,B,Ct).call(this)}},B=new WeakSet,Ct=function(){if(this.contentWrapper.textContent="",this.a){let r=this.contentWrapper.appendChild(document.createElement("span"));r.textContent="\u2757\uFE0F",r.title="Could not show a player for link",this.addElement(this.a)}this.removeCSS(Qe);let e=this.shadow.adoptedStyleSheets.indexOf(Qe);typeof e<"u"&&this.shadow.adoptedStyleSheets.splice(e,e+1),o(this,ct)?.remove()},ct=new WeakMap,Z=new WeakMap,ne=new WeakMap,Ne=new WeakMap,He=function(e,r){let n=o(this,Z).appendChild(document.createElement("div"));n.classList.add("heading");let i=n.appendChild(document.createElement("span"));if(i.textContent=e,r){i.textContent+=" ";let a=i.appendChild(document.createElement("a"));a.textContent="\u{1F4CB}",a.href="#",a.title="Copy to clipboard";async function l(c){a.textContent=c,await new Promise(d=>setTimeout(d,2e3)),a.textContent===c&&(a.textContent="\u{1F4CB}")}a.addEventListener("click",async c=>{c.preventDefault(),a.textContent="\u{1F4CB}\u2026";let d=await r();if(d)try{await navigator.clipboard.writeText(d),l("\u{1F4CB}\u2705")}catch(u){throw l("\u{1F4CB}\u274C"),u}else l("\u{1F4CB}\u274C")})}return n},Fr);b.define("twizzle-link",Os);function Fs(t,e=document.createElement("span")){async function r(){let[n,i]=await Promise.all([t.puzzleAlg.get(),t.puzzleLoader.get()]);if(n.issues.errors.length!==0){e.textContent="";return}let a=!0;function l(c){a?a=!1:e.append(")(");let d=e.appendChild(document.createElement("span")),u=Kt(i,c,n.alg);d.append(`${Rs[c]}: `);let g=d.appendChild(document.createElement("span"));g.textContent=u.toString(),g.classList.add("move-number"),d.setAttribute("data-before",xr[c]??""),d.setAttribute("title",xr[c]??"")}e.textContent="(",i.id==="3x3x3"?(l("OBTM"),l("OBQTM"),l("RBTM")):i.pg&&(l("RBTM"),l("RBQTM")),l("ETM"),e.append(")")}return t.puzzleAlg.addFreshListener(r),t.puzzleID.addFreshListener(r),e}export{oe as EXPERIMENTAL_PROP_NO_VALUE,jn as ExperimentalSVGAnimator,In as SimpleAlgIndexer,er as TreeAlgIndexer,bs as TwistyAlgEditor,hn as TwistyAlgViewer,ut as TwistyPlayer,Os as TwizzleLink,Js as backViewLayouts,fn as setTwistyDebug};

;!function(){try { var e="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:{},n=(new e.Error).stack;n&&((e._debugIds|| (e._debugIds={}))[n]="0f09e528-f253-9fcd-b279-553a5b09ab37")}catch(e){}}();
(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,285344,952125,92613,74659,179655,566545,192823,e=>{"use strict";let t,n,r,a;e.i(704411);var s,i,o,l,u,h,p,d,c,f,m,g,x=e.i(592061),y=e.i(494096),b=e.i(449404),v=e.i(311709);let w={kernelName:x.Abs,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)(e,(0,v.step)((0,y.cast)(n,"float32"),-1))}}};var I=e.i(680837),C=e.i(408604),k=e.i(919862),S=e.i(119509),T=e.i(240774),N=e.i(33457);let $={kernelName:x.Acos,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>{let t=(0,T.square)((0,y.cast)(n,"float32")),r=(0,S.sqrt)((0,N.sub)((0,k.scalar)(1),t));return(0,C.neg)((0,I.div)(e,r))}}}},R={kernelName:x.Acosh,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>{let t=(0,S.sqrt)((0,N.sub)((0,T.square)((0,y.cast)(n,"float32")),1));return(0,I.div)(e,t)}}}};var A=e.i(568503),E=e.i(940570),F=e.i(101669);let D={kernelName:x.Add,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=A.assertAndGetBroadcastShape(n.shape,r.shape);return{a:()=>{let t=e,r=A.getReductionAxes(n.shape,a);return r.length>0&&(t=(0,F.sum)(t,r)),(0,E.reshape)(t,n.shape)},b:()=>{let t=e,n=A.getReductionAxes(r.shape,a);return n.length>0&&(t=(0,F.sum)(t,n)),(0,E.reshape)(t,r.shape)}}}},O={kernelName:x.AddN,saveAllInputs:!0,gradFunc:(e,t)=>{let n={};return t.forEach((t,r)=>{n[r]=()=>e.clone()}),n}};var L=e.i(990256);let z={kernelName:x.ArgMax,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,L.zerosLike)(n)}}},_={kernelName:x.ArgMin,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,L.zerosLike)(n)}}},M={kernelName:x.Asin,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,S.sqrt)((0,N.sub)((0,k.scalar)(1),(0,T.square)((0,y.cast)(n,"float32")))))}}};var P=e.i(536331);let B={kernelName:x.Asinh,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>{let t=(0,S.sqrt)((0,P.add)((0,k.scalar)(1),(0,T.square)((0,y.cast)(n,"float32"))));return(0,I.div)(e,t)}}}},W={kernelName:x.Atan2,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=(0,A.assertAndGetBroadcastShape)(n.shape,r.shape);return{a:()=>{let t=(0,P.add)((0,T.square)(n),(0,T.square)(r)),s=(0,b.mul)(e,(0,I.div)(r,t)),i=(0,A.getReductionAxes)(n.shape,a);return i.length>0&&(s=(0,F.sum)(s,i)),(0,E.reshape)(s,n.shape)},b:()=>{let t=(0,P.add)((0,T.square)(n),(0,T.square)(r)),s=(0,C.neg)((0,b.mul)(e,(0,I.div)(n,t))),i=(0,A.getReductionAxes)(r.shape,a);return i.length>0&&(s=(0,F.sum)(s,i)),(0,E.reshape)(s,r.shape)}}}},G={kernelName:x.Atan,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,P.add)((0,T.square)((0,y.cast)(n,"float32")),1))}}},U={kernelName:x.Atanh,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,N.sub)((0,k.scalar)(1),(0,T.square)((0,y.cast)(n,"float32"))))}}};var V=e.i(27923),H=e.i(240210),q=e.i(496378),j=e.i(870360),X=e.i(566389);let K=(0,X.op)({avgPool3dGrad_:function(e,t,n,r,a,s){let i=(0,H.convertToTensor)(e,"dy","avgPool3dGrad"),o=(0,H.convertToTensor)(t,"input","avgPool3dGrad"),l=i,u=o,h=!1;4===o.rank&&(h=!0,l=(0,E.reshape)(i,[1,i.shape[0],i.shape[1],i.shape[2],i.shape[3]]),u=(0,E.reshape)(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]])),q.assert(5===l.rank,()=>`Error in avgPool3dGrad: dy must be rank 5 but got rank ${l.rank}.`),q.assert(5===u.rank,()=>`Error in avgPool3dGrad: input must be rank 5 but got rank ${u.rank}.`),(0,j.checkPadOnDimRoundingMode)("avgPool3dGrad",a,s);let p={dy:l,input:u},d=V.ENGINE.runKernel(x.AvgPool3DGrad,p,{filterSize:n,strides:r,pad:a,dimRoundingMode:s});return h?(0,E.reshape)(d,[d.shape[1],d.shape[2],d.shape[3],d.shape[4]]):d}}),Y={kernelName:x.AvgPool3D,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{filterSize:a,strides:s,pad:i,dimRoundingMode:o}=n;return{x:()=>K(e,r,a,s,i,o)}}},Z=(0,X.op)({avgPoolGrad_:function(e,t,n,r,a){let s=(0,H.convertToTensor)(e,"dy","avgPoolGrad"),i=(0,H.convertToTensor)(t,"input","avgPoolGrad");q.assert(i.rank===s.rank,()=>`Rank of input (${i.rank}) does not match rank of dy (${s.rank})`);let o=i,l=s,u=!1;3===i.rank&&(u=!0,o=(0,E.reshape)(i,[1,i.shape[0],i.shape[1],i.shape[2]]),l=(0,E.reshape)(s,[1,s.shape[0],s.shape[1],s.shape[2]])),q.assert(4===l.rank,()=>`Error in avgPoolGrad: dy must be rank 4 but got rank ${l.rank}.`),q.assert(4===o.rank,()=>`Error in avgPoolGrad: input must be rank 4 but got rank ${o.rank}.`);let h={dy:l,input:o},p=V.ENGINE.runKernel(x.AvgPoolGrad,h,{filterSize:n,strides:r,pad:a});return u?(0,E.reshape)(p,[p.shape[1],p.shape[2],p.shape[3]]):p}}),J={kernelName:x.AvgPool,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{filterSize:a,strides:s,pad:i}=n;return{x:()=>Z(e,r,a,s,i)}}};var Q=e.i(656040);let ee={kernelName:x.BatchMatMul,inputsToSave:["a","b"],gradFunc:(e,t,n)=>{let[r,a]=t,{transposeA:s,transposeB:i}=n;return s||i?!s&&i?{a:()=>(0,Q.matMul)(e,a,!1,!1),b:()=>(0,Q.matMul)(e,r,!0,!1)}:s&&!i?{a:()=>(0,Q.matMul)(a,e,!1,!0),b:()=>(0,Q.matMul)(r,e,!1,!1)}:{a:()=>(0,Q.matMul)(a,e,!0,!0),b:()=>(0,Q.matMul)(e,r,!0,!0)}:{a:()=>(0,Q.matMul)(e,a,!1,!0),b:()=>(0,Q.matMul)(r,e,!0,!1)}}};var et=e.i(707019);let en={kernelName:x.BatchToSpaceND,gradFunc:(e,t,n)=>{let{blockShape:r,crops:a}=n;return{x:()=>(0,et.spaceToBatchND)(e,r,a)}}},er={kernelName:x.BroadcastTo,gradFunc:(e,t,n)=>{let r=n.inputShape,a=n.shape,s=Array.from(a);for(let e=r.length-1;e>=0;e--)if(r[e]===a[e])s[e]=1;else if(1!==r[e])throw Error(`broadcastTo(): [${r}] cannot be broadcast to [${a}].`);let i=[];for(let e=0;e<s.length;e++)s[e]>1&&i.push(e);return{x:()=>(0,F.sum)(e,i,!0)}}},ea={kernelName:x.Cast,gradFunc:e=>({x:()=>e.clone()})},es={kernelName:x.Ceil,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})};var ei=e.i(318814),eo=e.i(612700),el=e.i(783171),eu=e.i(379250);let eh={kernelName:x.ClipByValue,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{clipValueMin:a,clipValueMax:s}=n;return{x:()=>(0,eu.where)((0,el.logicalAnd)((0,ei.greaterEqual)(r,a),(0,eo.lessEqual)(r,s)),e,(0,L.zerosLike)(e))}}},ep={kernelName:x.ComplexAbs,inputsToSave:["x"],gradFunc:w.gradFunc};var ed=e.i(798670);let ec={kernelName:x.Concat,saveAllInputs:!0,gradFunc:(e,t,n)=>{let r=t.map(e=>e.shape),{axis:a}=n,s=(0,q.parseAxisParam)(a,t[0].shape)[0],i=r.map(e=>e[s]);return(0,ed.split)(e,i,s).map(e=>()=>e)}};var ef=e.i(110369),em=e.i(345161);let eg={kernelName:x.Conv2D,inputsToSave:["x","filter"],gradFunc:(e,t,n)=>{let[r,a]=t,{dilations:s,strides:i,pad:o,dataFormat:l}=n;return q.assert(j.tupleValuesAreOne(s),()=>`Error in gradient of conv2D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${s}'`),{x:()=>(0,em.conv2DBackpropInput)(r.shape,e,a,i,o,l),filter:()=>(0,ef.conv2DBackpropFilter)(r,e,a.shape,i,o,l)}}};var ex=e.i(673749);let ey={kernelName:x.Conv2DBackpropInput,inputsToSave:["dy","filter"],gradFunc:(e,t,n)=>{let[r,a]=t,{strides:s,pad:i,dataFormat:o,dimRoundingMode:l}=n;return{dy:()=>(0,ex.conv2d)(e,a,s,i,o,1,l),filter:()=>(0,ef.conv2DBackpropFilter)(e,r,a.shape,s,i,o,l)}}},eb=(0,X.op)({conv3DBackpropFilter_:function(e,t,n,r,a){let s=e;4===e.rank&&(s=(0,E.reshape)(e,[1,e.shape[0],e.shape[1],e.shape[2],e.shape[3]]));let i=t;4===i.rank&&(i=(0,E.reshape)(t,[1,t.shape[0],t.shape[1],t.shape[2],t.shape[3]])),q.assert(5===s.rank,()=>`Error in conv3dDerFilter: input must be rank 5, but got shape ${s.shape}.`),q.assert(5===i.rank,()=>`Error in conv3dDerFilter: dy must be rank 5, but got shape ${i.shape}.`),q.assert(5===n.length,()=>`Error in conv3dDerFilter: filterShape must be length 5, but got ${n}.`),q.assert(s.shape[4]===n[3],()=>`Error in conv3dDerFilter: depth of input ${s.shape[4]}) must match input depth in filter (${n[3]}.`),q.assert(i.shape[4]===n[4],()=>`Error in conv3dDerFilter: depth of dy (${i.shape[4]}) must match output depth for filter (${n[4]}).`);let o={x:s,dy:i};return V.ENGINE.runKernel(x.Conv3DBackpropFilterV2,o,{strides:r,pad:a,filterShape:n})}});var ev=e.i(107235);let ew={kernelName:x.Conv3D,inputsToSave:["x","filter"],gradFunc:(e,t,n)=>{let{dilations:r,strides:a,pad:s}=n;q.assert((0,j.tupleValuesAreOne)(r),()=>`Error in gradient of conv3D: dilation rates greater than 1 are not yet supported in gradients. Got dilations '${r}'`);let[i,o]=t;return{x:()=>(0,ev.conv3DBackpropInput)(i.shape,e,o,a,s),filter:()=>eb(i,e,o.shape,a,s)}}};var eI=e.i(85565);let eC={kernelName:x.Cos,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)((0,C.neg)((0,eI.sin)((0,y.cast)(n,"float32"))),e)}}};var ek=e.i(367743);let eS={kernelName:x.Cosh,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)((0,ek.sinh)((0,y.cast)(n,"float32")),e)}}};var eT=e.i(769664),eN=e.i(657311),e$=e.i(604907);let eR={kernelName:x.Cumsum,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{axis:a,exclusive:s,reverse:i}=n;return{x:()=>{let t=(0,eT.getAxesPermutation)([a],r.rank),n=(0,eN.cumsum)(e,a,s,!i);return null!=t&&(n=(0,e$.transpose)(n,t)),n}}}};var eA=e.i(240053),eE=e.i(156329);let eF={kernelName:x.DepthwiseConv2dNative,inputsToSave:["x","filter"],gradFunc:(e,t,n)=>{let{dilations:r,strides:a,pad:s,dimRoundingMode:i}=n,o=null==r?[1,1]:r;q.assert(j.tupleValuesAreOne(o),()=>`Error in gradient of depthwiseConv2dNative: dilation rates greater than 1 are not yet supported. Got dilations '${o}'`);let[l,u]=t;return q.assert(4===l.rank,()=>`Error in gradient of depthwiseConv2dNative: input must be rank 4, but got rank ${l.rank}.`),q.assert(4===u.rank,()=>`Error in gradient of depthwiseConv2dNative: filter must be rank 4, but got rank ${u.rank}.`),q.assert(l.shape[3]===u.shape[2],()=>`Error in gradient of depthwiseConv2d: number of input channels (${l.shape[3]}) must match the inChannels dimension in filter ${u.shape[2]}.`),q.assert(j.eitherStridesOrDilationsAreOne(a,o),()=>`Error in gradient of depthwiseConv2d: Either strides or dilations must be  1. Got strides ${a} and dilations '${o}'.`),j.checkPadOnDimRoundingMode("depthwiseConv2d",s,i),{x:()=>(0,eE.depthwiseConv2dNativeBackpropInput)(l.shape,e,u,a,s,o,i),filter:()=>(0,eA.depthwiseConv2dNativeBackpropFilter)(l,e,u.shape,a,s,o,i)}}},eD={kernelName:x.Dilation2D,inputsToSave:["x","filter"],gradFunc:(e,t,n)=>{let[r,a]=t,s={x:r,filter:a,dy:e},i={x:r,filter:a,dy:e};return{x:()=>V.ENGINE.runKernel(x.Dilation2DBackpropInput,s,n),filter:()=>V.ENGINE.runKernel(x.Dilation2DBackpropFilter,i,n)}}},eO={kernelName:x.Elu,outputsToSave:[!0],gradFunc:(e,t)=>{let[n]=t,r={dy:e,y:n};return{x:()=>V.ENGINE.runKernel(x.EluGrad,r)}}};var eL=e.i(345175);let ez={kernelName:x.Erf,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t,r=(0,b.mul)((0,eL.exp)((0,C.neg)((0,T.square)(n))),2/Math.sqrt(Math.PI));return{x:()=>(0,b.mul)(e,r)}}},e_={kernelName:x.Exp,outputsToSave:[!0],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)(e,n)}}},eM={kernelName:x.ExpandDims,inputsToSave:["input"],gradFunc:(e,t)=>{let[n]=t;return{input:()=>(0,E.reshape)(e,n.shape)}}},eP={kernelName:x.Expm1,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)(e,(0,eL.exp)(n))}}},eB={kernelName:x.Floor,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})},eW={kernelName:x.FloorDiv,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=(0,A.assertAndGetBroadcastShape)(n.shape,r.shape);return{a:()=>{let t=(0,I.div)(e,(0,y.cast)(r,"float32")),s=(0,A.getReductionAxes)(n.shape,a);return s.length>0?(0,E.reshape)((0,F.sum)(t,s),n.shape):t},b:()=>{let t=(0,b.mul)(e,(0,y.cast)(n,"float32")),s=(0,A.getReductionAxes)(r.shape,a);s.length>0&&(t=(0,E.reshape)((0,F.sum)(t,s),r.shape));let i=(0,T.square)(r);return(0,C.neg)((0,I.div)(t,(0,y.cast)(i,"float32")))}}}};var eG=e.i(90119),eU=e.i(551200);let eV={kernelName:x.FusedBatchNorm,inputsToSave:["x","mean","variance","scale"],gradFunc:(e,t,n)=>{let{varianceEpsilon:r}=n,[a,s,i,o]=t,l=null==o?(0,k.scalar)(1):o,u=(0,A.getReductionAxes)(s.shape,a.shape),h=[];if(1===s.rank){for(let e=0;e<a.shape.length-1;++e)h.push(a.shape[e]);h.push(1)}let p=(0,N.sub)(a,s),d=(0,b.mul)(e,l),c=(0,eG.rsqrt)((0,P.add)(i,(0,k.scalar)(r))),f=(0,b.mul)((0,b.mul)((0,b.mul)(c,c),c),(0,k.scalar)(-.5));return{x:()=>1===s.rank?(0,E.reshape)((0,b.mul)((0,b.mul)(e,(0,eU.tile)((0,E.reshape)(c,[1,1,1,s.shape[0]]),h)),l),a.shape):(0,E.reshape)((0,b.mul)((0,b.mul)(e,c),l),a.shape),mean:()=>{let e=(0,b.mul)((0,b.mul)(c,(0,k.scalar)(-1)),d);return 1===s.rank&&(e=(0,F.sum)(e,u)),(0,E.reshape)(e,s.shape)},variance:()=>{let e=(0,b.mul)((0,b.mul)(f,p),d);return 1===s.rank&&(e=(0,F.sum)(e,u)),(0,E.reshape)(e,s.shape)},scale:()=>{let t=(0,b.mul)(p,c),n=(0,b.mul)(e,t);return 1===s.rank&&(n=(0,F.sum)(n,u)),(0,E.reshape)(n,s.shape)},offset:()=>{let t=e;return 1===s.rank&&(t=(0,F.sum)(t,u)),(0,E.reshape)(t,s.shape)}}}};var eH=e.i(691832),eq=e.i(419426);let ej={kernelName:x.GatherV2,inputsToSave:["x","indices"],gradFunc:(e,t,n)=>{let[r,a]=t,{axis:s,batchDims:i}=n,o=(0,q.parseAxisParam)(s,r.shape)[0],l=(e,t,n)=>()=>{let r=e.shape,a=t.size,i=r.slice(0,o),l=i.length,u=r.slice(s,r.length).slice(1),h=u.length,p=eX(0,l),d=eX(l+1,l+1+h),c=eK([i,[a],u]),f=(0,E.reshape)(n,c),m=(0,E.reshape)(t,[a]),g=eK([[l],p,d]),x=(0,e$.transpose)(f,g),y=(0,eq.unsortedSegmentSum)(x,m,e.shape[o]),b=(0,eT.getUndoAxesPermutation)(g);return(0,e$.transpose)(y,b)};if(1!==i)return{x:l(r,a,e),indices:()=>a};{let t=r.shape[0],n=r.split(t,0);return{x:()=>(0,eH.stack)(n.map((t,n)=>l(t,a.slice(n,1),e.slice(n,1))())).reshape(r.shape),indices:()=>a}}}};function eX(e,t){let n=[];for(let r=e;r<t;++r)n.push(r);return n}function eK(e){let t=[];for(let n=0;n<e.length;++n)for(let r=0;r<e[n].length;++r)t.push(e[n][r]);return t}let eY={kernelName:x.GreaterEqual,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t;return{a:()=>(0,L.zerosLike)(n),b:()=>(0,L.zerosLike)(r)}}},eZ={kernelName:x.Identity,gradFunc:e=>({x:()=>(0,y.cast)(e,"float32")})},eJ={kernelName:x.IsFinite,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})},eQ={kernelName:x.IsInf,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})},e0={kernelName:x.IsNan,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})};var e1=e.i(101123);let e2={kernelName:x.LeakyRelu,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{alpha:a}=n,s=(0,e1.greater)(r,0);return{x:()=>(0,eu.where)(s,e,(0,b.mul)(e,a))}}},e3={kernelName:x.Log1p,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,P.add)(n,1))}}},e4={kernelName:x.Log,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,y.cast)(n,"float32"))}}},e5={kernelName:x.LogSoftmax,inputsToSave:[],outputsToSave:[!0],gradFunc:(e,t,n)=>{let[r]=t,{axis:a}=n;return{logits:()=>{let t=(0,eL.exp)(r);return(0,N.sub)(e,(0,b.mul)((0,F.sum)(e,a,!0),t))}}}},e6=(0,X.op)({localResponseNormalizationBackprop_:function(e,t,n,r=5,a=1,s=1,i=.5){return V.ENGINE.runKernel(x.LRNGrad,{x:e,y:t,dy:n},{depthRadius:r,bias:a,alpha:s,beta:i})}}),e8={kernelName:x.LRN,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(e,t,n)=>{let[r,a]=t,{depthRadius:s,bias:i,alpha:o,beta:l}=n;return{x:()=>e6(r,a,e,s,i,o,l)}}};var e9=e.i(87432);function e7(e,t,n,r){return t.rank<n.rank&&(t=(0,E.reshape)(t,eT.expandShapeToKeepDim(t.shape,r))),e.rank<n.rank&&(e=(0,E.reshape)(e,eT.expandShapeToKeepDim(e.shape,r))),{x:()=>(0,b.mul)(e,(0,y.cast)((0,e9.equal)(n,t),e.dtype))}}let te={kernelName:x.Max,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(e,t,n)=>{let{reductionIndices:r}=n,a=t[0],s=t[1],i=q.parseAxisParam(r,a.shape),o=e7(e,s,a,i);return{x:()=>o.x()}}};var tt=e.i(388566);let tn={kernelName:x.Maximum,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t;return{a:()=>(0,b.mul)(e,(0,y.cast)((0,ei.greaterEqual)(n,r),"float32")),b:()=>(0,b.mul)(e,(0,y.cast)((0,tt.less)(n,r),"float32"))}}},tr=(0,X.op)({maxPool3dGrad_:function(e,t,n,r,a,s,i){let o=(0,H.convertToTensor)(e,"dy","maxPool3dGrad"),l=(0,H.convertToTensor)(t,"input","maxPool3dGrad"),u=(0,H.convertToTensor)(n,"output","maxPool3dGrad"),h=o,p=l,d=u,c=!1;4===l.rank&&(c=!0,h=(0,E.reshape)(o,[1,o.shape[0],o.shape[1],o.shape[2],o.shape[3]]),p=(0,E.reshape)(l,[1,l.shape[0],l.shape[1],l.shape[2],l.shape[3]]),d=(0,E.reshape)(u,[1,u.shape[0],u.shape[1],u.shape[2],u.shape[3]])),q.assert(5===h.rank,()=>`Error in maxPool3dGrad: dy must be rank 5 but got rank ${h.rank}.`),q.assert(5===p.rank,()=>`Error in maxPool3dGrad: input must be rank 5 but got rank ${p.rank}.`),q.assert(5===d.rank,()=>`Error in maxPool3dGrad: output must be rank 5 but got rank ${d.rank}.`),(0,j.checkPadOnDimRoundingMode)("maxPool3dGrad",s,i);let f={dy:h,input:p,output:d},m=V.ENGINE.runKernel(x.MaxPool3DGrad,f,{filterSize:r,strides:a,pad:s,dimRoundingMode:i});return c?(0,E.reshape)(m,[m.shape[1],m.shape[2],m.shape[3],m.shape[4]]):m}}),ta={kernelName:x.MaxPool3D,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(e,t,n)=>{let[r,a]=t,{filterSize:s,strides:i,pad:o,dimRoundingMode:l}=n;return{x:()=>tr(e,r,a,s,i,o,l)}}},ts=(0,X.op)({maxPoolGrad_:function(e,t,n,r,a,s,i){let o=(0,H.convertToTensor)(e,"dy","maxPoolGrad"),l=(0,H.convertToTensor)(t,"input","maxPoolGrad"),u=(0,H.convertToTensor)(n,"output","maxPoolGrad");return q.assert(l.rank===o.rank,()=>`Rank of input (${l.rank}) does not match rank of dy (${o.rank})`),q.assert(4===o.rank,()=>`Error in maxPoolGrad: dy must be rank 4 but got rank ${o.rank}.`),q.assert(4===l.rank,()=>`Error in maxPoolGrad: input must be rank 4 but got rank ${l.rank}.`),j.checkPadOnDimRoundingMode("maxPoolGrad",s,i),V.ENGINE.runKernel(x.MaxPoolGrad,{dy:o,input:l,output:u},{filterSize:r,strides:a,pad:s,dimRoundingMode:i})}}),ti={kernelName:x.MaxPool,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(e,t,n)=>{let[r,a]=t,{filterSize:s,strides:i,pad:o}=n;return{x:()=>ts(e,r,a,s,i,o)}}};var to=e.i(434425);let tl={kernelName:x.Mean,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{axis:a}=n,s=q.parseAxisParam(a,r.shape),i=(0,eT.computeOutAndReduceShapes)(r.shape,s)[1],o=q.sizeFromShape(i);return{x:()=>{let t=r.shape.slice();s.forEach(e=>{t[e]=1});let n=(0,E.reshape)(e,t);return(0,I.div)((0,b.mul)(n,(0,to.ones)(r.shape,"float32")),o)}}}},tu={kernelName:x.Min,inputsToSave:["x"],outputsToSave:[!0],gradFunc:(e,t,n)=>{let{axis:r}=n,[a,s]=t,i=q.parseAxisParam(r,a.shape),o=e7(e,s,a,i);return{x:()=>o.x()}}},th={kernelName:x.Minimum,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t;return{a:()=>(0,b.mul)(e,(0,y.cast)((0,eo.lessEqual)(n,r),"float32")),b:()=>(0,b.mul)(e,(0,y.cast)((0,e1.greater)(n,r),"float32"))}}};var tp=e.i(606764);let td={kernelName:x.MirrorPad,inputsToSave:["x"],gradFunc:(e,t,n)=>{let r=t[0],{paddings:a}=n,s=a.map(e=>e[0]);return{x:()=>(0,tp.slice)(e,s,r.shape)}}};var tc=e.i(21637);let tf={kernelName:x.Mod,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=(0,A.assertAndGetBroadcastShape)(n.shape,r.shape);return{a:()=>{let t=(0,A.getReductionAxes)(n.shape,a);return t.length>0?(0,E.reshape)((0,F.sum)(e,t),n.shape):e},b:()=>{let t=(0,b.mul)(e,(0,C.neg)((0,tc.floor)((0,I.div)(n,r)))),s=(0,A.getReductionAxes)(r.shape,a);return s.length>0?(0,E.reshape)((0,F.sum)(t,s),r.shape):t}}}},tm={kernelName:x.Multiply,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=(0,A.assertAndGetBroadcastShape)(n.shape,r.shape);return{a:()=>{let t=(0,b.mul)(e,(0,y.cast)(r,"float32")),s=(0,A.getReductionAxes)(n.shape,a);return s.length>0?(0,E.reshape)((0,F.sum)(t,s),n.shape):t},b:()=>{let t=(0,b.mul)(e,(0,y.cast)(n,"float32")),s=(0,A.getReductionAxes)(r.shape,a);return s.length>0?(0,E.reshape)((0,F.sum)(t,s),r.shape):t}}}},tg={kernelName:x.Neg,gradFunc:e=>({x:()=>(0,C.neg)(e)})};var tx=e.i(394596);let ty={kernelName:x.OneHot,inputsToSave:["indices"],gradFunc:(e,t)=>{let n=t[0];return{indices:()=>(0,tx.zeros)(n.shape,"float32")}}},tb={kernelName:x.OnesLike,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})};var tv=e.i(295175);let tw={kernelName:x.Pack,saveAllInputs:!0,gradFunc:(e,t,n)=>{let{axis:r}=n;return(0,tv.unstack)(e,r).map(e=>()=>e)}},tI={kernelName:x.PadV2,inputsToSave:["x"],gradFunc:(e,t,n)=>{let r=t[0],{paddings:a}=n,s=a.map(e=>e[0]);return{x:()=>(0,tp.slice)(e,s,r.shape)}}};var tC=e.i(322459),tk=e.i(26194);let tS={kernelName:x.Pow,inputsToSave:["a","b"],outputsToSave:[!0],gradFunc:(e,t)=>{let[n,r,a]=t,s=A.assertAndGetBroadcastShape(n.shape,r.shape);return{a:()=>{let t=(0,y.cast)(r,"float32"),a=(0,b.mul)(e,(0,b.mul)(t,(0,tk.pow)(n,(0,N.sub)(t,(0,k.scalar)(1))))),i=A.getReductionAxes(n.shape,s);return i.length>0&&(a=(0,F.sum)(a,i)),(0,E.reshape)(a,n.shape)},b:()=>{let t=(0,e1.greater)(n,0),i=(0,eu.where)(t,(0,tC.log)(n),(0,L.zerosLike)(n)),o=(0,b.mul)(e,(0,b.mul)(a,i)),l=A.getReductionAxes(r.shape,s);return l.length>0&&(o=(0,F.sum)(o,l)),(0,E.reshape)(o,r.shape)}}}},tT={kernelName:x.Prelu,inputsToSave:["x","alpha"],gradFunc:(e,t)=>{let[n,r]=t,a=(0,e1.greater)(n,0);return{x:()=>(0,eu.where)(a,e,(0,b.mul)(e,r)),alpha:()=>{let t=(0,eu.where)(a,(0,L.zerosLike)(e),(0,b.mul)(e,n)),s=(0,A.getReductionAxes)(r.shape,e.shape);return s.length>0&&(t=(0,F.sum)(t,s)),(0,E.reshape)(t,r.shape)}}}};var tN=e.i(829918),tN=tN,t$=e.i(504785);let tR={kernelName:x.Prod,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{axis:a}=n,s=[];return s=null==a?r.shape.map((e,t)=>t):"number"==typeof a?[a]:a,{x:()=>(function(e,t,n){var r;let a,s,i,o,l,u=e.shape.length,h=u-n.length,p=tN.getAxesPermutation(n,u),d=e;null!=p&&(d=(0,e$.transpose)(e,p));let c=d.shape.slice(),f=c.splice(u-n.length,n.length).reduce((e,t)=>e*t,1);c.push(f);let m=(r=d.reshape(c),(a=r.shape.slice())[h]=1,s=(0,E.reshape)(t,a),i=(0,t$.cumprod)(r,h,!0,!1),o=(0,t$.cumprod)(r,h,!0,!0),l=(0,b.mul)(i,o),(0,b.mul)(s,l));if(m=m.reshape(d.shape),null!=p){let e=tN.getUndoAxesPermutation(p);m=(0,e$.transpose)(m,e)}return m})(r,e,s)}}},tA={kernelName:x.RealDiv,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=A.assertAndGetBroadcastShape(n.shape,r.shape);return{a:()=>{let t=(0,I.div)(e,(0,y.cast)(r,"float32")),s=A.getReductionAxes(n.shape,a);return s.length>0?(0,E.reshape)((0,F.sum)(t,s),n.shape):t},b:()=>{let t=(0,b.mul)(e,(0,y.cast)(n,"float32")),s=A.getReductionAxes(r.shape,a);s.length>0&&(t=(0,E.reshape)((0,F.sum)(t,s),r.shape));let i=(0,T.square)(r);return(0,C.neg)((0,I.div)(t,(0,y.cast)(i,"float32")))}}}},tE={kernelName:x.Reciprocal,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,C.neg)((0,T.square)(n)))}}},tF={kernelName:x.Relu6,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t,r=(0,b.mul)((0,eo.lessEqual)(n,6),(0,v.step)(n));return{x:()=>(0,b.mul)(e,(0,y.cast)(r,"float32"))}}},tD={kernelName:x.Relu,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)(e,(0,y.cast)((0,v.step)(n),"float32"))}}},tO={kernelName:x.Reshape,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,E.reshape)(e,n.shape)}}},tL={kernelName:x.ResizeBilinear,inputsToSave:["images"],gradFunc:(e,t,n)=>{let[r]=t,a={dy:e,images:r};return{images:()=>V.ENGINE.runKernel(x.ResizeBilinearGrad,a,n)}}},tz={kernelName:x.ResizeNearestNeighbor,inputsToSave:["images"],gradFunc:(e,t,n)=>{let[r]=t,a={dy:e,images:r};return{images:()=>V.ENGINE.runKernel(x.ResizeNearestNeighborGrad,a,n)}}};var t_=e.i(185876);let tM={kernelName:x.Reverse,gradFunc:(e,t,n)=>{let{dims:r}=n,a=(0,q.parseAxisParam)(r,e.shape);return{x:()=>(0,t_.reverse)(e,a)}}},tP={kernelName:x.Round,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})},tB={kernelName:x.Rsqrt,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,C.neg)((0,I.div)(e,(0,b.mul)((0,tk.pow)(n,1.5),2)))}}};var tW=e.i(705680);let tG={kernelName:x.Select,inputsToSave:["condition"],gradFunc:(e,t)=>{let[n]=t;return{condition:()=>(0,y.cast)((0,L.zerosLike)(n),"float32"),t:()=>(0,b.mul)(e,(0,y.cast)(n,e.dtype)),e:()=>(0,b.mul)(e,(0,y.cast)((0,tW.logicalNot)(n),e.dtype))}}};var tU=e.i(612499);let tV={kernelName:x.Selu,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>{let t=(0,e1.greater)(n,(0,k.scalar)(0)),r=(0,k.scalar)(tU.SELU_SCALEALPHA),a=(0,k.scalar)(tU.SELU_SCALE),s=(0,b.mul)(e,a),i=(0,b.mul)((0,b.mul)(e,r),(0,eL.exp)((0,y.cast)(n,"float32")));return(0,eu.where)(t,s,i)}}}},tH={kernelName:x.Sigmoid,outputsToSave:[!0],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)(e,(0,b.mul)(n,(0,N.sub)((0,k.scalar)(1),n)))}}},tq={kernelName:x.Sign,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})};var tj=e.i(795894);let tX={kernelName:x.Sin,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)((0,tj.cos)((0,y.cast)(n,"float32")),e)}}};var tK=e.i(777815);let tY={kernelName:x.Sinh,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)((0,tK.cosh)((0,y.cast)(n,"float32")),e)}}};var tZ=e.i(661193),tJ=e.i(764128);let tQ={kernelName:x.Slice,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{begin:a,size:s}=n,i=r.shape,[o,l]=(0,tJ.parseSliceParams)(r,a,s),u=[];for(let t=0;t<e.rank;t++)u.push([o[t],i[t]-o[t]-l[t]]);return{x:()=>(0,tZ.pad)(e,u)}}},t0={kernelName:x.Softmax,outputsToSave:[!0],gradFunc:(e,t,n)=>{let[r]=t,{dim:a}=n,s=(0,b.mul)(e,r);return{logits:()=>(0,N.sub)(s,(0,b.mul)((0,F.sum)(s,[a],!0),r))}}};var t1=e.i(846141);let t2={kernelName:x.Softplus,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)(e,(0,t1.sigmoid)(n))}}};var t3=e.i(657626);let t4={kernelName:x.SpaceToBatchND,gradFunc:(e,t,n)=>{let{blockShape:r,paddings:a}=n;return{x:()=>(0,t3.batchToSpaceND)(e,r,a)}}};var t5=e.i(655015);let t6={kernelName:x.SplitV,gradFunc:(e,t,n)=>{let{axis:r}=n;return{x:()=>(0,t5.concat)(e,r)}}},t8={kernelName:x.Sqrt,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,b.mul)((0,S.sqrt)((0,y.cast)(n,"float32")),2))}}},t9={kernelName:x.Square,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)(e,(0,b.mul)((0,y.cast)(n,"float32"),2))}}},t7={kernelName:x.SquaredDifference,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=(0,k.scalar)(2);return{a:()=>(0,b.mul)(e,(0,b.mul)(a,(0,N.sub)(n,r))),b:()=>(0,b.mul)(e,(0,b.mul)(a,(0,N.sub)(r,n)))}}},ne={kernelName:x.Step,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})},nt={kernelName:x.Sub,inputsToSave:["a","b"],gradFunc:(e,t)=>{let[n,r]=t,a=A.assertAndGetBroadcastShape(n.shape,r.shape);return{a:()=>{let t=e,r=A.getReductionAxes(n.shape,a);return r.length>0&&(t=(0,F.sum)(t,r)),(0,E.reshape)(t,n.shape)},b:()=>{let t=e,n=A.getReductionAxes(r.shape,a);return n.length>0&&(t=(0,F.sum)(t,n)),(0,E.reshape)((0,C.neg)(t),r.shape)}}}},nn={kernelName:x.Sum,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,a=r.shape.slice(),{axis:s}=n;(0,q.parseAxisParam)(s,r.shape).forEach(e=>{a[e]=1});let i=(0,E.reshape)(e,a),o=(0,b.mul)(i,(0,to.ones)(r.shape,"float32"));return{x:()=>o}}},nr={kernelName:x.Tan,inputsToSave:["x"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,I.div)(e,(0,T.square)((0,tj.cos)(n)))}}},na={kernelName:x.Tanh,outputsToSave:[!0],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(0,b.mul)((0,N.sub)((0,k.scalar)(1),(0,T.square)(n)),e)}}},ns={kernelName:x.Tile,inputsToSave:["x"],gradFunc:(e,t,n)=>{let[r]=t,{reps:a}=n;return{x:()=>{let t=(0,L.zerosLike)(r);if(1===r.rank)for(let n=0;n<a[0];++n)t=(0,P.add)(t,(0,tp.slice)(e,[n*r.shape[0]],[r.shape[0]]));else if(2===r.rank)for(let n=0;n<a[0];++n)for(let s=0;s<a[1];++s)t=(0,P.add)(t,(0,tp.slice)(e,[n*r.shape[0],s*r.shape[1]],[r.shape[0],r.shape[1]]));else if(3===r.rank)for(let n=0;n<a[0];++n)for(let s=0;s<a[1];++s)for(let i=0;i<a[2];++i)t=(0,P.add)(t,(0,tp.slice)(e,[n*r.shape[0],s*r.shape[1],i*r.shape[2]],[r.shape[0],r.shape[1],r.shape[2]]));else if(4===r.rank)for(let n=0;n<a[0];++n)for(let s=0;s<a[1];++s)for(let i=0;i<a[2];++i)for(let o=0;o<a[3];++o)t=(0,P.add)(t,(0,tp.slice)(e,[n*r.shape[0],s*r.shape[1],i*r.shape[2],o*r.shape[3]],[r.shape[0],r.shape[1],r.shape[2],r.shape[3]]));else throw Error(`Gradient for tile operation is not implemented for rank-${r.rank} tensors yet.`);return t}}}},ni={kernelName:x.Transpose,gradFunc:(e,t,n)=>{let{perm:r}=n,a=eT.getUndoAxesPermutation(r);return{x:()=>(0,e$.transpose)(e,a)}}},no={kernelName:x.Unpack,gradFunc:(e,t,n)=>{let{axis:r}=n;return{value:()=>(0,eH.stack)(e,r)}}};var nl=e.i(40827),nu=e.i(81936),nh=e.i(638688);let np={kernelName:x.UnsortedSegmentSum,inputsToSave:["segmentIds"],gradFunc:(e,t)=>{let[n]=t;return{x:()=>(function(e,t){let n=(0,nh.maximum)(t,(0,L.zerosLike)(t)),r=(0,nu.gather)(e,n),a=(0,ei.greaterEqual)(t,(0,k.scalar)(0,"int32")),s=r.rank-a.rank;for(let e=0;e<s;++e)a=(0,nl.expandDims)(a,e+1);a=(0,el.logicalAnd)(a,(0,to.ones)(r.shape,"bool"));let i=(0,L.zerosLike)(r);return(0,eu.where)(a,r,i)})(e,n)}}},nd={kernelName:x.ZerosLike,gradFunc:e=>({x:()=>(0,L.zerosLike)(e)})};var nc=e.i(248534);for(let e of[w,$,R,D,O,z,_,M,B,W,G,U,Y,J,ee,en,er,ea,es,eh,ep,ec,ey,eg,ew,eC,eS,eR,eF,eD,tA,eO,ez,e_,eM,eP,eW,eB,eV,ej,eY,eZ,eJ,eQ,e0,e2,e3,e4,e5,e8,te,te,tn,ta,ti,tl,tu,th,td,tf,tm,tg,ty,tb,tw,tI,tI,tS,tT,tR,tE,tF,tD,tO,tL,tz,tM,tP,tB,tG,tV,tH,tq,tX,tY,tQ,t0,t2,t4,t4,t6,t6,t8,t7,t9,ne,nt,nn,nr,na,ns,ni,no,np,nd])(0,nc.registerGradient)(e);var nf=e.i(410616),nm=e.i(527081);(0,nm.getGlobalTensorClass)().prototype.abs=function(){return this.throwIfDisposed(),(0,nf.abs)(this)};var ng=e.i(873663);(0,nm.getGlobalTensorClass)().prototype.acos=function(){return this.throwIfDisposed(),(0,ng.acos)(this)};var nx=e.i(176885);(0,nm.getGlobalTensorClass)().prototype.acosh=function(){return this.throwIfDisposed(),(0,nx.acosh)(this)},(0,nm.getGlobalTensorClass)().prototype.add=function(e){return this.throwIfDisposed(),(0,P.add)(this,e)};var ny=e.i(941826);(0,nm.getGlobalTensorClass)().prototype.all=function(e,t){return this.throwIfDisposed(),(0,ny.all)(this,e,t)};var nb=e.i(644551);(0,nm.getGlobalTensorClass)().prototype.any=function(e,t){return this.throwIfDisposed(),(0,nb.any)(this,e,t)};var nv=e.i(394472);(0,nm.getGlobalTensorClass)().prototype.argMax=function(e){return this.throwIfDisposed(),(0,nv.argMax)(this,e)};var nw=e.i(51106);(0,nm.getGlobalTensorClass)().prototype.argMin=function(e){return this.throwIfDisposed(),(0,nw.argMin)(this,e)},(0,nm.getGlobalTensorClass)().prototype.asScalar=function(){return this.throwIfDisposed(),(0,q.assert)(1===this.size,()=>"The array must have only 1 element."),(0,E.reshape)(this,[])},(0,nm.getGlobalTensorClass)().prototype.asType=function(e){return this.throwIfDisposed(),(0,y.cast)(this,e)},(0,nm.getGlobalTensorClass)().prototype.as1D=function(){return this.throwIfDisposed(),(0,E.reshape)(this,[this.size])},(0,nm.getGlobalTensorClass)().prototype.as2D=function(e,t){return this.throwIfDisposed(),(0,E.reshape)(this,[e,t])},(0,nm.getGlobalTensorClass)().prototype.as3D=function(e,t,n){return this.throwIfDisposed(),(0,E.reshape)(this,[e,t,n])},(0,nm.getGlobalTensorClass)().prototype.as4D=function(e,t,n,r){return this.throwIfDisposed(),(0,E.reshape)(this,[e,t,n,r])},(0,nm.getGlobalTensorClass)().prototype.as5D=function(e,t,n,r,a){return this.throwIfDisposed(),(0,E.reshape)(this,[e,t,n,r,a])};var nI=e.i(764563);(0,nm.getGlobalTensorClass)().prototype.asin=function(){return this.throwIfDisposed(),(0,nI.asin)(this)};var nC=e.i(791124);(0,nm.getGlobalTensorClass)().prototype.asinh=function(){return this.throwIfDisposed(),(0,nC.asinh)(this)};var nk=e.i(846199);(0,nm.getGlobalTensorClass)().prototype.atan=function(){return this.throwIfDisposed(),(0,nk.atan)(this)};var nS=e.i(119947);(0,nm.getGlobalTensorClass)().prototype.atan2=function(e){return this.throwIfDisposed(),(0,nS.atan2)(this,e)};var nT=e.i(300320);(0,nm.getGlobalTensorClass)().prototype.atanh=function(){return this.throwIfDisposed(),(0,nT.atanh)(this)};var nN=e.i(281991);(0,nm.getGlobalTensorClass)().prototype.avgPool=function(e,t,n,r){return this.throwIfDisposed(),(0,nN.avgPool)(this,e,t,n,r)},(0,nm.getGlobalTensorClass)().prototype.batchToSpaceND=function(e,t){return this.throwIfDisposed(),(0,t3.batchToSpaceND)(this,e,t)};var n$=e.i(394503);(0,nm.getGlobalTensorClass)().prototype.batchNorm=function(e,t,n,r,a){return this.throwIfDisposed(),(0,n$.batchNorm)(this,e,t,n,r,a)};var nR=e.i(566006);(0,nm.getGlobalTensorClass)().prototype.broadcastTo=function(e){return this.throwIfDisposed(),(0,nR.broadcastTo)(this,e)},(0,nm.getGlobalTensorClass)().prototype.cast=function(e){return this.throwIfDisposed(),(0,y.cast)(this,e)};var nA=e.i(556422);(0,nm.getGlobalTensorClass)().prototype.ceil=function(){return this.throwIfDisposed(),(0,nA.ceil)(this)};var nE=e.i(582343);(0,nm.getGlobalTensorClass)().prototype.clipByValue=function(e,t){return this.throwIfDisposed(),(0,nE.clipByValue)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.concat=function(e,t){return this.throwIfDisposed(),e instanceof nm.Tensor&&(e=[e]),(0,t5.concat)([this,...e],t)};var nF=e.i(894983);(0,nm.getGlobalTensorClass)().prototype.conv1d=function(e,t,n,r,a,s){return this.throwIfDisposed(),(0,nF.conv1d)(this,e,t,n,r,a,s)};var nD=e.i(599829);(0,nm.getGlobalTensorClass)().prototype.conv2dTranspose=function(e,t,n,r,a){return this.throwIfDisposed(),(0,nD.conv2dTranspose)(this,e,t,n,r,a)},(0,nm.getGlobalTensorClass)().prototype.conv2d=function(e,t,n,r,a,s){return this.throwIfDisposed(),(0,ex.conv2d)(this,e,t,n,r,a,s)},(0,nm.getGlobalTensorClass)().prototype.cos=function(){return this.throwIfDisposed(),(0,tj.cos)(this)},(0,nm.getGlobalTensorClass)().prototype.cosh=function(){return this.throwIfDisposed(),(0,tK.cosh)(this)},(0,nm.getGlobalTensorClass)().prototype.cumprod=function(e,t,n){return this.throwIfDisposed(),(0,t$.cumprod)(this,e,t,n)},(0,nm.getGlobalTensorClass)().prototype.cumsum=function(e,t,n){return this.throwIfDisposed(),(0,eN.cumsum)(this,e,t,n)};var nO=e.i(274619);(0,nm.getGlobalTensorClass)().prototype.depthToSpace=function(e,t){return this.throwIfDisposed(),(0,nO.depthToSpace)(this,e,t)};var nL=e.i(985730);(0,nm.getGlobalTensorClass)().prototype.depthwiseConv2d=function(e,t,n,r,a,s){return this.throwIfDisposed(),(0,nL.depthwiseConv2d)(this,e,t,n,r,a,s)};var nz=e.i(805129);(0,nm.getGlobalTensorClass)().prototype.dilation2d=function(e,t,n,r,a){return this.throwIfDisposed(),(0,nz.dilation2d)(this,e,t,n,r,a)};var n_=e.i(928612);(0,nm.getGlobalTensorClass)().prototype.divNoNan=function(e){return this.throwIfDisposed(),(0,n_.divNoNan)(this,e)},(0,nm.getGlobalTensorClass)().prototype.div=function(e){return this.throwIfDisposed(),(0,I.div)(this,e)};var nM=e.i(607381);(0,nm.getGlobalTensorClass)().prototype.dot=function(e){return this.throwIfDisposed(),(0,nM.dot)(this,e)};var nP=e.i(746814);(0,nm.getGlobalTensorClass)().prototype.elu=function(){return this.throwIfDisposed(),(0,nP.elu)(this)},(0,nm.getGlobalTensorClass)().prototype.equal=function(e){return this.throwIfDisposed(),(0,e9.equal)(this,e)};var nB=e.i(923153);(0,nm.getGlobalTensorClass)().prototype.erf=function(){return this.throwIfDisposed(),(0,nB.erf)(this)};var nW=e.i(729932);(0,nm.getGlobalTensorClass)().prototype.euclideanNorm=function(e,t){return this.throwIfDisposed(),(0,nW.euclideanNorm)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.exp=function(){return this.throwIfDisposed(),(0,eL.exp)(this)},(0,nm.getGlobalTensorClass)().prototype.expandDims=function(e){return this.throwIfDisposed(),(0,nl.expandDims)(this,e)};var nG=e.i(81705);(0,nm.getGlobalTensorClass)().prototype.expm1=function(){return this.throwIfDisposed(),(0,nG.expm1)(this)};var nU=e.i(900846);(0,nm.getGlobalTensorClass)().prototype.fft=function(){return this.throwIfDisposed(),(0,nU.fft)(this)},(0,nm.getGlobalTensorClass)().prototype.flatten=function(){return this.throwIfDisposed(),(0,E.reshape)(this,[this.size])},(0,nm.getGlobalTensorClass)().prototype.floor=function(){return this.throwIfDisposed(),(0,tc.floor)(this)};var nV=e.i(167131);(0,nm.getGlobalTensorClass)().prototype.floorDiv=function(e){return this.throwIfDisposed(),(0,nV.floorDiv)(this,e)},(0,nm.getGlobalTensorClass)().prototype.gather=function(e,t,n){return this.throwIfDisposed(),(0,nu.gather)(this,e,t,n)},(0,nm.getGlobalTensorClass)().prototype.greaterEqual=function(e){return this.throwIfDisposed(),(0,ei.greaterEqual)(this,e)},(0,nm.getGlobalTensorClass)().prototype.greater=function(e){return this.throwIfDisposed(),(0,e1.greater)(this,e)};var nH=e.i(965960);(0,nm.getGlobalTensorClass)().prototype.ifft=function(){return this.throwIfDisposed(),(0,nH.ifft)(this)};var nq=e.i(129476);(0,nm.getGlobalTensorClass)().prototype.irfft=function(){return this.throwIfDisposed(),(0,nq.irfft)(this)};var nj=e.i(379973);(0,nm.getGlobalTensorClass)().prototype.isFinite=function(){return this.throwIfDisposed(),(0,nj.isFinite)(this)};var nX=e.i(971805);(0,nm.getGlobalTensorClass)().prototype.isInf=function(){return this.throwIfDisposed(),(0,nX.isInf)(this)};var nK=e.i(514149);(0,nm.getGlobalTensorClass)().prototype.isNaN=function(){return this.throwIfDisposed(),(0,nK.isNaN)(this)};var nY=e.i(872606);(0,nm.getGlobalTensorClass)().prototype.leakyRelu=function(e){return this.throwIfDisposed(),(0,nY.leakyRelu)(this,e)},(0,nm.getGlobalTensorClass)().prototype.lessEqual=function(e){return this.throwIfDisposed(),(0,eo.lessEqual)(this,e)},(0,nm.getGlobalTensorClass)().prototype.less=function(e){return this.throwIfDisposed(),(0,tt.less)(this,e)};var nZ=e.i(35109);(0,nm.getGlobalTensorClass)().prototype.localResponseNormalization=function(e,t,n,r){return this.throwIfDisposed(),(0,nZ.localResponseNormalization)(this,e,t,n,r)};var nJ=e.i(105258);(0,nm.getGlobalTensorClass)().prototype.logSigmoid=function(){return this.throwIfDisposed(),(0,nJ.logSigmoid)(this)};var nQ=e.i(940181);(0,nm.getGlobalTensorClass)().prototype.logSoftmax=function(e){return this.throwIfDisposed(),(0,nQ.logSoftmax)(this,e)};var n0=e.i(334401);(0,nm.getGlobalTensorClass)().prototype.logSumExp=function(e,t){return this.throwIfDisposed(),(0,n0.logSumExp)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.log=function(){return this.throwIfDisposed(),(0,tC.log)(this)};var n1=e.i(297198);(0,nm.getGlobalTensorClass)().prototype.log1p=function(){return this.throwIfDisposed(),(0,n1.log1p)(this)},(0,nm.getGlobalTensorClass)().prototype.logicalAnd=function(e){return this.throwIfDisposed(),(0,el.logicalAnd)(this,e)},(0,nm.getGlobalTensorClass)().prototype.logicalNot=function(){return this.throwIfDisposed(),(0,tW.logicalNot)(this)};var n2=e.i(725759);(0,nm.getGlobalTensorClass)().prototype.logicalOr=function(e){return this.throwIfDisposed(),(0,n2.logicalOr)(this,e)};var n3=e.i(392326);(0,nm.getGlobalTensorClass)().prototype.logicalXor=function(e){return this.throwIfDisposed(),(0,n3.logicalXor)(this,e)},(0,nm.getGlobalTensorClass)().prototype.matMul=function(e,t,n){return this.throwIfDisposed(),(0,Q.matMul)(this,e,t,n)};var n4=e.i(168091);(0,nm.getGlobalTensorClass)().prototype.maxPool=function(e,t,n,r){return this.throwIfDisposed(),(0,n4.maxPool)(this,e,t,n,r)};var n5=e.i(37051);(0,nm.getGlobalTensorClass)().prototype.max=function(e,t){return this.throwIfDisposed(),(0,n5.max)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.maximum=function(e){return this.throwIfDisposed(),(0,nh.maximum)(this,e)};var n6=e.i(155217);(0,nm.getGlobalTensorClass)().prototype.mean=function(e,t){return this.throwIfDisposed(),(0,n6.mean)(this,e,t)};var n8=e.i(551573);(0,nm.getGlobalTensorClass)().prototype.min=function(e,t){return this.throwIfDisposed(),(0,n8.min)(this,e,t)};var n9=e.i(600936);(0,nm.getGlobalTensorClass)().prototype.minimum=function(e){return this.throwIfDisposed(),(0,n9.minimum)(this,e)};var n7=e.i(564418);(0,nm.getGlobalTensorClass)().prototype.mirrorPad=function(e,t){return this.throwIfDisposed(),(0,n7.mirrorPad)(this,e,t)};var re=e.i(152522);(0,nm.getGlobalTensorClass)().prototype.mod=function(e){return this.throwIfDisposed(),(0,re.mod)(this,e)},(0,nm.getGlobalTensorClass)().prototype.mul=function(e){return this.throwIfDisposed(),(0,b.mul)(this,e)},(0,nm.getGlobalTensorClass)().prototype.neg=function(){return this.throwIfDisposed(),(0,C.neg)(this)};var rt=e.i(683784);(0,nm.getGlobalTensorClass)().prototype.norm=function(e,t,n){return this.throwIfDisposed(),(0,rt.norm)(this,e,t,n)};var rn=e.i(344658);(0,nm.getGlobalTensorClass)().prototype.notEqual=function(e){return this.throwIfDisposed(),(0,rn.notEqual)(this,e)};var rr=e.i(379778);(0,nm.getGlobalTensorClass)().prototype.oneHot=function(e,t=1,n=0){return this.throwIfDisposed(),(0,rr.oneHot)(this,e,t,n)};var ra=e.i(584525);(0,nm.getGlobalTensorClass)().prototype.onesLike=function(){return this.throwIfDisposed(),(0,ra.onesLike)(this)},(0,nm.getGlobalTensorClass)().prototype.pad=function(e,t){return this.throwIfDisposed(),(0,tZ.pad)(this,e,t)};var rs=e.i(871242);(0,nm.getGlobalTensorClass)().prototype.pool=function(e,t,n,r,a,s){return this.throwIfDisposed(),(0,rs.pool)(this,e,t,n,r,a,s)},(0,nm.getGlobalTensorClass)().prototype.pow=function(e){return this.throwIfDisposed(),(0,tk.pow)(this,e)};var ri=e.i(145018);(0,nm.getGlobalTensorClass)().prototype.prelu=function(e){return this.throwIfDisposed(),(0,ri.prelu)(this,e)};var ro=e.i(345813);(0,nm.getGlobalTensorClass)().prototype.prod=function(e,t){return this.throwIfDisposed(),(0,ro.prod)(this,e,t)};var rl=e.i(283532);(0,nm.getGlobalTensorClass)().prototype.reciprocal=function(){return this.throwIfDisposed(),(0,rl.reciprocal)(this)};var ru=e.i(539333);(0,nm.getGlobalTensorClass)().prototype.relu=function(){return this.throwIfDisposed(),(0,ru.relu)(this)};var rh=e.i(98856);(0,nm.getGlobalTensorClass)().prototype.relu6=function(){return this.throwIfDisposed(),(0,rh.relu6)(this)},(0,nm.getGlobalTensorClass)().prototype.reshapeAs=function(e){return this.throwIfDisposed(),(0,E.reshape)(this,e.shape)},(0,nm.getGlobalTensorClass)().prototype.reshape=function(e){return this.throwIfDisposed(),(0,E.reshape)(this,e)};var rp=e.i(213482);(0,nm.getGlobalTensorClass)().prototype.resizeBilinear=function(e,t,n){return this.throwIfDisposed(),(0,rp.resizeBilinear)(this,e,t,n)};var rd=e.i(365506);(0,nm.getGlobalTensorClass)().prototype.resizeNearestNeighbor=function(e,t,n){return this.throwIfDisposed(),(0,rd.resizeNearestNeighbor)(this,e,t,n)},(0,nm.getGlobalTensorClass)().prototype.reverse=function(e){return this.throwIfDisposed(),(0,t_.reverse)(this,e)};var rc=e.i(470353);(0,nm.getGlobalTensorClass)().prototype.rfft=function(){return this.throwIfDisposed(),(0,rc.rfft)(this)};var rf=e.i(751057);(0,nm.getGlobalTensorClass)().prototype.round=function(){return this.throwIfDisposed(),(0,rf.round)(this)},(0,nm.getGlobalTensorClass)().prototype.rsqrt=function(){return this.throwIfDisposed(),(0,eG.rsqrt)(this)};var rm=e.i(671859);(0,nm.getGlobalTensorClass)().prototype.selu=function(){return this.throwIfDisposed(),(0,rm.selu)(this)};var rg=e.i(25498);(0,nm.getGlobalTensorClass)().prototype.separableConv2d=function(e,t,n,r,a,s){return this.throwIfDisposed(),(0,rg.separableConv2d)(this,e,t,n,r,a,s)},(0,nm.getGlobalTensorClass)().prototype.sigmoid=function(){return this.throwIfDisposed(),(0,t1.sigmoid)(this)};var rx=e.i(153910);(0,nm.getGlobalTensorClass)().prototype.sign=function(){return this.throwIfDisposed(),(0,rx.sign)(this)},(0,nm.getGlobalTensorClass)().prototype.sin=function(){return this.throwIfDisposed(),(0,eI.sin)(this)},(0,nm.getGlobalTensorClass)().prototype.sinh=function(){return this.throwIfDisposed(),(0,ek.sinh)(this)},(0,nm.getGlobalTensorClass)().prototype.slice=function(e,t){return this.throwIfDisposed(),(0,tp.slice)(this,e,t)};var ry=e.i(197631);(0,nm.getGlobalTensorClass)().prototype.softmax=function(e){return this.throwIfDisposed(),(0,ry.softmax)(this,e)};var rb=e.i(922398);(0,nm.getGlobalTensorClass)().prototype.softplus=function(){return this.throwIfDisposed(),(0,rb.softplus)(this)},(0,nm.getGlobalTensorClass)().prototype.spaceToBatchND=function(e,t){return this.throwIfDisposed(),(0,et.spaceToBatchND)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.split=function(e,t){return this.throwIfDisposed(),(0,ed.split)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.sqrt=function(){return this.throwIfDisposed(),(0,S.sqrt)(this)},(0,nm.getGlobalTensorClass)().prototype.square=function(){return this.throwIfDisposed(),(0,T.square)(this)};var rv=e.i(907467);(0,nm.getGlobalTensorClass)().prototype.squaredDifference=function(e){return this.throwIfDisposed(),(0,rv.squaredDifference)(this,e)};var rw=e.i(836111);(0,nm.getGlobalTensorClass)().prototype.squeeze=function(e){return this.throwIfDisposed(),(0,rw.squeeze)(this,e)},(0,nm.getGlobalTensorClass)().prototype.stack=function(e,t){this.throwIfDisposed();let n=e instanceof nm.Tensor?[this,e]:[this,...e];return(0,eH.stack)(n,t)},(0,nm.getGlobalTensorClass)().prototype.step=function(e){return this.throwIfDisposed(),(0,v.step)(this,e)};var rI=e.i(241468);(0,nm.getGlobalTensorClass)().prototype.stridedSlice=function(e,t,n,r,a,s,i,o){return this.throwIfDisposed(),(0,rI.stridedSlice)(this,e,t,n,r,a,s,i,o)},(0,nm.getGlobalTensorClass)().prototype.sub=function(e){return this.throwIfDisposed(),(0,N.sub)(this,e)},(0,nm.getGlobalTensorClass)().prototype.sum=function(e,t){return this.throwIfDisposed(),(0,F.sum)(this,e,t)};var rC=e.i(59143);(0,nm.getGlobalTensorClass)().prototype.tan=function(){return this.throwIfDisposed(),(0,rC.tan)(this)};var rk=e.i(199009);(0,nm.getGlobalTensorClass)().prototype.tanh=function(){return this.throwIfDisposed(),(0,rk.tanh)(this)},(0,nm.getGlobalTensorClass)().prototype.tile=function(e){return this.throwIfDisposed(),(0,eU.tile)(this,e)},(0,nm.getGlobalTensorClass)().prototype.toBool=function(){return this.throwIfDisposed(),(0,y.cast)(this,"bool")},(0,nm.getGlobalTensorClass)().prototype.toFloat=function(){return this.throwIfDisposed(),(0,y.cast)(this,"float32")},(0,nm.getGlobalTensorClass)().prototype.toInt=function(){return this.throwIfDisposed(),(0,y.cast)(this,"int32")};var rS=e.i(210487);(0,nm.getGlobalTensorClass)().prototype.topk=function(e,t){return this.throwIfDisposed(),(0,rS.topk)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.transpose=function(e){return this.throwIfDisposed(),(0,e$.transpose)(this,e)};var rT=e.i(41735);(0,nm.getGlobalTensorClass)().prototype.unique=function(e){return this.throwIfDisposed(),(0,rT.unique)(this,e)},(0,nm.getGlobalTensorClass)().prototype.unsortedSegmentSum=function(e,t){return this.throwIfDisposed(),(0,eq.unsortedSegmentSum)(this,e,t)},(0,nm.getGlobalTensorClass)().prototype.unstack=function(e){return this.throwIfDisposed(),(0,tv.unstack)(this,e)},(0,nm.getGlobalTensorClass)().prototype.where=function(e,t){return this.throwIfDisposed(),(0,eu.where)(e,this,t)},(0,nm.getGlobalTensorClass)().prototype.zerosLike=function(){return this.throwIfDisposed(),(0,L.zerosLike)(this)};var rN=e.i(177990),r$=e.i(720606),rR=e.i(449672);class rA extends Error{constructor(e){super(e),Object.setPrototypeOf(this,rA.prototype)}}class rE extends Error{constructor(e){super(e),Object.setPrototypeOf(this,rE.prototype)}}class rF extends Error{constructor(e){super(e),Object.setPrototypeOf(this,rF.prototype)}}class rD extends Error{constructor(e){super(e),Object.setPrototypeOf(this,rD.prototype)}}class rO extends Error{constructor(e){super(e),Object.setPrototypeOf(this,rO.prototype)}}class rL{constructor(e){this.maxEntries=e||100,this.cache=new Map}get(e){let t;return this.cache.has(e)&&(t=this.cache.get(e),this.cache.delete(e),this.cache.set(e,t)),t}put(e,t){if(this.cache.has(e))this.cache.delete(e);else if(this.cache.size>=this.maxEntries){let e=this.cache.keys().next().value;this.cache.delete(e)}this.cache.set(e,t)}getMaxEntries(){return this.maxEntries}setMaxEntries(e){if(e<0)throw Error(`The maxEntries of LRU caches must be at least 0, but got ${e}.`);if(this.maxEntries>e)for(let t=0;t<this.maxEntries-e;t++){let e=this.cache.keys().next().value;this.cache.delete(e)}this.maxEntries=e}}function rz(e,t){if(Array.isArray(e)){let n=[];for(let r=0;r<t;r++)n=n.concat(e);return n}{let n=Array(t);return n.fill(e),n}}function r_(e,t){if(!e)throw new rO(t)}function rM(e,t){let n=0;for(let r of e)r===t&&n++;return n}function rP(e){return 1===e.length?e[0]:e}function rB(e){return Array.isArray(e)?e:[e]}function rW(e){let t=e.replace(/(.)([A-Z][a-z0-9]+)/g,"$1_$2").replace(/([a-z])([A-Z])/g,"$1_$2").toLowerCase();return"_"!==t[0]?t:"private"+t}function rG(e){return e.length<=1||-1===e.indexOf("_")?e:e.replace(/[_]+(\w|$)/g,(e,t)=>t.toUpperCase())}let rU={};function rV(e){if(null==e)return null;let t={};return t.className=e.getClassName(),t.config=e.getConfig(),t}function rH(e,t={},n={},r="object",a=!1){if("string"==typeof e){let a;if(e in n)a=n[e];else if(e in rU)a=rU[e];else if(null==(a=t[e]))throw new rF(`Unknown ${r}: ${e}. This may be due to one of the following reasons:
1. The ${r} is defined in Python, in which case it needs to be ported to TensorFlow.js or your JavaScript code.
2. The custom ${r} is defined in JavaScript, but is not registered properly with tf.serialization.registerClass().`);return a}{let s,i;if(null==e.className||null==e.config)throw new rF(`${r}: Improper config format: ${JSON.stringify(e)}.
'className' and 'config' must set.`);let o=e.className;if(o in n?[s,i]=n[o]:o in rU?[s,i]=rU.className:o in t&&([s,i]=t[o]),null==s)throw new rF(`Unknown ${r}: ${o}. This may be due to one of the following reasons:
1. The ${r} is defined in Python, in which case it needs to be ported to TensorFlow.js or your JavaScript code.
2. The custom ${r} is defined in JavaScript, but is not registered properly with tf.serialization.registerClass().`);if(null!=i){let t={};for(let e of Object.keys(rU))t[e]=rU[e];for(let e of Object.keys(n))t[e]=n[e];e.config.customObjects=t;let r=Object.assign({},rU);for(let e of Object.keys(n))rU[e]=n[e];!function e(t){if(null!=t&&"object"==typeof t)if(Array.isArray(t))t.forEach(t=>e(t));else for(let n of Object.keys(t)){let r=t[n];null!=r&&"object"==typeof r&&(Array.isArray(r)||"ndarray"!==r.type||"number"!=typeof r.value?e(r):t[n]=r.value)}}(e.config);let o=i(s,e.config,n,a);return rU=Object.assign({},r),o}{let t=Object.assign({},rU);for(let e of Object.keys(n))rU[e]=n[e];let r=new s(e.config);return rU=Object.assign({},t),r}}}function rq(e,t){return -1*(e<t?-1:+(e>t))}function rj(e){if(null==e)return e;let t=[];for(let n of e)-1===t.indexOf(n)&&t.push(n);return t}function rX(e,t,n){if(null!=n&&0>e.indexOf(n))throw new rF(`${n} is not a valid ${t}.  Valid values are ${e} or null/undefined.`)}function rK(e,t,n=0,r=1/0){return r_(n>=0),r_(r>=n),Array.isArray(e)&&e.length>=n&&e.length<=r&&e.every(e=>typeof e===t)}function rY(e,t){Array.isArray(e)?(rR.util.assert(e.length>0,()=>`${t} is unexpectedly an empty array.`),e.forEach((e,n)=>rY(e,`element ${n+1} of ${t}`))):rR.util.assert(Number.isInteger(e)&&e>0,()=>`Expected ${t} to be a positive integer, but got ${function e(t){return null===t?"null":Array.isArray(t)?"["+t.map(t=>e(t)).join(",")+"]":"string"==typeof t?`"${t}"`:`${t}`}(e)}.`)}function rZ(e){return"relu"===e?"relu":"linear"===e?"linear":"elu"===e?"elu":null}var rJ=e.i(760811),rJ=rJ;let rQ=0,r0={};function r1(e=""){return e in r0||(r0[e]=0),r0[e]+=1,e+r0[e].toString()}var rJ=rJ;let r2=["channelsFirst","channelsLast"],r3=["nearest","bilinear"],r4=["valid","same","causal"],r5=["max","avg"],r6=["sum","mul","concat","ave"],r8=new Map;function r9(e){rX(r2,"DataFormat",e)}function r7(e){rX(r4,"PaddingMode",e)}function ae(e){rX(r5,"PoolMode",e)}let at=[];function an(e,t){at.push(e);try{let e=t();return at.pop(),e}catch(e){throw at.pop(),e}}function ar(e){if(!ai(e))throw Error("Not a valid tensor name: '"+e+"'");return(0===at.length?"":at.join("/")+"/")+e}function aa(e){if(!ai(e))throw Error("Not a valid tensor name: '"+e+"'");r8.has(e)||r8.set(e,0);let t=r8.get(e);if(r8.set(e,r8.get(e)+1),!(t>0))return e;{let n=`${e}_${t}`;return r8.set(n,1),n}}let as=new RegExp(/^[A-Za-z0-9][-A-Za-z0-9\._\/]*$/);function ai(e){return!!e.match(as)}var ao=e.i(516954),al=e.i(976654),au=e.i(844220),rJ=rJ,ah=e.i(944867),ap=e.i(629999),ad=e.i(261413),ac=e.i(678041),af=e.i(40017),am=e.i(542670),ag=e.i(813546),ax=e.i(86361),ay=e.i(843008),ab=e.i(431100),av=e.i(809827),av=av,aw=e.i(963496),aI=e.i(260188);function aC(e,t,n){null==t&&(t=0),null==n&&(n=e.length);let r=1;for(let a=t;a<n;++a)r*=e[a];return r}function ak(e){if(0===e.length)return NaN;let t=1/0;for(let n=0;n<e.length;n++){let r=e[n];r<t&&(t=r)}return t}function aS(e){if(0===e.length)return NaN;let t=-1/0;for(let n=0;n<e.length;n++){let r=e[n];r>t&&(t=r)}return t}function aT(e,t){if(t<e)throw new rF(`end (${t}) < begin (${e}) is forbidden.`);let n=[];for(let r=e;r<t;++r)n.push(r);return n}function aN(){return null==t&&(t=(0,r$.backend)().epsilon()),t}function a$(){return"channelsLast"}function aR(e,t){return y.cast(e,t)}function aA(e,t=-1){let n=e.shape.slice();return t<0&&(t=n.length+t+1),n.splice(t,0,1),E.reshape(e,n)}function aE(e,t,n){return(0,r$.tidy)(()=>{switch(e.rank){case 1:return ap.slice1d(e,t,n);case 2:return ad.slice2d(e,[t,0],[n,e.shape[1]]);case 3:return ac.slice3d(e,[t,0,0],[n,e.shape[1],e.shape[2]]);case 4:return af.slice4d(e,[t,0,0,0],[n,e.shape[1],e.shape[2],e.shape[3]]);case 5:return tp.slice(e,[t,0,0,0,0],[n,e.shape[1],e.shape[2],e.shape[3],e.shape[4]]);case 6:return tp.slice(e,[t,0,0,0,0,0],[n,e.shape[1],e.shape[2],e.shape[3],e.shape[4],e.shape[5]]);default:throw new rF(`sliceAlongFirstAxis() received an unsupported tensor rank: ${e.rank}`)}})}function aF(e,t,n){return(0,r$.tidy)(()=>{switch(e.rank){case 1:return ap.slice1d(e,t,n);case 2:return ad.slice2d(e,[0,t],[e.shape[0],n]);case 3:return ac.slice3d(e,[0,0,t],[e.shape[0],e.shape[1],n]);case 4:return af.slice4d(e,[0,0,0,t],[e.shape[0],e.shape[1],e.shape[2],n]);default:throw new rF(`sliceAlongLastAxis() received an unsupported tensor rank: ${e.rank}`)}})}function aD(e,t,n,r){return(0,r$.tidy)(()=>{switch(e.rank){case 1:return ap.slice1d(e,t,n);case 2:switch(r){case 1:return aE(e,t,n);case 2:return aF(e,t,n);default:throw new rF(`The axis is not within the rank of the tensor ${r}`)}case 3:switch(r){case 1:return aE(e,t,n);case 2:return ac.slice3d(e,[0,t,0],[e.shape[0],n,e.shape[2]]);case 3:return aF(e,t,n);default:throw new rF(`The axis is not within the rank of the tensor ${r}`)}case 4:switch(r){case 1:return aE(e,t,n);case 2:return af.slice4d(e,[0,t,0,0],[e.shape[0],n,e.shape[2],e.shape[3]]);case 3:return af.slice4d(e,[0,0,t,0],[e.shape[0],e.shape[1],n,e.shape[3]]);case 4:return aF(e,t,n);default:throw new rF(`The axis is not within the rank of the tensor ${r}`)}default:throw new rF(`sliceAlongLastAxis() received an unsupported tensor rank: ${e.rank}`)}})}function aO(e,t=-1){let n;return t<0&&(t=0!==(n=e[0].rank)?n:0),t===e[0].rank&&(t=-1),t5.concat(e,t)}function aL(e,t){switch(e.rank){case 1:return am.concat1d([e,t]);case 2:return ag.concat2d([e,t],0);case 3:return ax.concat3d([e,t],0);case 4:return ay.concat4d([e,t],0);default:throw new rF(`concatAlongFirstAxis() received an unsupported tensor rank: ${e.rank}`)}}function az(e,t){if(Array.isArray(t)||(t=[t]),e.rank!==t.length)throw new rF(`The length of input n (${t.length}) does not match the number of dimensions in input x (${e.rank})`);return eU.tile(e,t)}function a_(e,t=0,n=1,r,a){return ab.randomNormal(e,t,n,r,a)}function aM(e,t,n,r){if(e.rank<2||t.rank<2)throw new rD(`dot requires both inputs to be rank >= 2 but got x shape = ${e.shape} and y shape = ${t.shape}`);if(t.rank>=3&&e.shape.slice(-1)[0]!==t.shape.slice(-2)[0])throw new rD(`If rank y >= 3, then the second last dim of y must equal the last dim of x but got x shape = ${e.shape} and  y shape = ${t.shape}`);if(2===e.rank&&2===t.rank)return av.matMul({a:e,b:t,transposeA:!1,transposeB:!1,bias:r?aW(e.rank,r,a$()):null,activation:n});{let a=e.shape.slice(),s=a.pop();e=E.reshape(e,[-1,s]);let i=t.shape.slice(),o=i.pop(),l=i.pop(),u=[...i,o],h=Array.from({length:t.rank},(e,n)=>0===n?t.rank-2:n<=t.rank-2?n-1:n);t=E.reshape(e$.transpose(t,h),[l,-1]);let p=[...a,...u];return E.reshape(av.matMul({a:e,b:t,transposeA:!1,transposeB:!1,bias:r?aW(e.rank,r,a$()):null,activation:n}),p)}}function aP(e,t,n){return(0,r$.tidy)(()=>(t=Array.isArray(t)?(0,aI.tensor1d)(t,"int32"):y.cast(t,"int32"),nu.gather(e,t,n)))}function aB(e){return b.mul(e,e)}function aW(e,t,n){let r=t.shape;if(1!==t.rank&&t.rank!==e)throw new rF(`Unexpected bias dimensions: ${t.rank}; expected it to be 1 or ${e}`);if(5===e){if("channelsFirst"===n)if(1===r.length)return E.reshape(t,[1,r[0],1,1,1]);else return E.reshape(t,[1,r[3],r[0],r[1],r[2]]);else if("channelsLast"===n)if(1===r.length)return E.reshape(t,[1,1,1,1,r[0]]);else return E.reshape(t,[1].concat(r))}else if(4===e){if("channelsFirst"===n)if(1===r.length)return E.reshape(t,[1,r[0],1,1]);else return E.reshape(t,[1,r[2],r[0],r[1]]);else if("channelsLast"===n)if(1===r.length)return E.reshape(t,[1,1,1,r[0]]);else return E.reshape(t,[1].concat(r))}else if(3===e){if("channelsFirst"===n)if(1===r.length)return E.reshape(t,[1,r[0],1]);else return E.reshape(t,[1,r[1],r[0]]);else if("channelsLast"===n)if(1===r.length)return E.reshape(t,[1,1,r[0]]);else return E.reshape(t,[1].concat(r))}else if(e<3)return t;throw new rF(`Unsupported input rank by biasAdd: ${t.rank}`)}function aG(e,t,n){return(0,r$.tidy)(()=>(null==n&&(n=a$()),r9(n),P.add(e,aW(e.rank,t,n))))}function aU(e,t,n,r){return(0,r$.tidy)(()=>aw.dropout(e,t,n,r))}function aV(e,t,n=!1){return n?e():t()}let aH=["fanIn","fanOut","fanAvg"],aq=["normal","uniform","truncatedNormal"];class aj extends rJ.Serializable{fromConfigUsesCustomObjects(){return!1}getConfig(){return{}}}class aX extends aj{apply(e,t){return(0,tx.zeros)(e,t)}}aX.className="Zeros",rJ.registerClass(aX);class aK extends aj{apply(e,t){return(0,to.ones)(e,t)}}aK.className="Ones",rJ.registerClass(aK);class aY extends aj{constructor(e){if(super(),"object"!=typeof e)throw new rF(`Expected argument of type ConstantConfig but got ${e}`);if(void 0===e.value)throw new rF(`config must have value set but got ${e}`);this.value=e.value}apply(e,t){return(0,r$.tidy)(()=>(0,b.mul)((0,k.scalar)(this.value),(0,to.ones)(e,t)))}getConfig(){return{value:this.value}}}aY.className="Constant",rJ.registerClass(aY);class aZ extends aj{constructor(e){super(),this.DEFAULT_MINVAL=-.05,this.DEFAULT_MAXVAL=.05,this.minval=e.minval||this.DEFAULT_MINVAL,this.maxval=e.maxval||this.DEFAULT_MAXVAL,this.seed=e.seed}apply(e,t){return(0,au.randomUniform)(e,this.minval,this.maxval,t,this.seed)}getConfig(){return{minval:this.minval,maxval:this.maxval,seed:this.seed}}}aZ.className="RandomUniform",rJ.registerClass(aZ);class aJ extends aj{constructor(e){super(),this.DEFAULT_MEAN=0,this.DEFAULT_STDDEV=.05,this.mean=e.mean||this.DEFAULT_MEAN,this.stddev=e.stddev||this.DEFAULT_STDDEV,this.seed=e.seed}apply(e,t){if("float32"!==(t=t||"float32")&&"int32"!==t)throw new rD(`randomNormal does not support dType ${t}.`);return a_(e,this.mean,this.stddev,t,this.seed)}getConfig(){return{mean:this.mean,stddev:this.stddev,seed:this.seed}}}aJ.className="RandomNormal",rJ.registerClass(aJ);class aQ extends aj{constructor(e){super(),this.DEFAULT_MEAN=0,this.DEFAULT_STDDEV=.05,this.mean=e.mean||this.DEFAULT_MEAN,this.stddev=e.stddev||this.DEFAULT_STDDEV,this.seed=e.seed}apply(e,t){if("float32"!==(t=t||"float32")&&"int32"!==t)throw new rD(`truncatedNormal does not support dType ${t}.`);return(0,ah.truncatedNormal)(e,this.mean,this.stddev,t,this.seed)}getConfig(){return{mean:this.mean,stddev:this.stddev,seed:this.seed}}}aQ.className="TruncatedNormal",rJ.registerClass(aQ);class a0 extends aj{constructor(e){super(),this.gain=null!=e.gain?e.gain:1}apply(e,t){return(0,r$.tidy)(()=>{if(2===e.length&&e[0]===e[1])return(0,b.mul)(this.gain,(0,ao.eye)(e[0]));throw new rF("Identity matrix initializer can only be used for 2D square matrices.")})}getConfig(){return{gain:this.gain}}}a0.className="Identity",rJ.registerClass(a0);class a1 extends aj{constructor(e){if(super(),e.scale<0)throw new rF(`scale must be a positive float. Got: ${e.scale}`);this.scale=null==e.scale?1:e.scale,this.mode=null==e.mode?"fanIn":e.mode,rX(aH,"FanMode",this.mode),this.distribution=null==e.distribution?"normal":e.distribution,rX(aq,"Distribution",this.distribution),this.seed=e.seed}apply(e,t){let n=function(e,t="channelsLast"){let n,r;if(r9(t),2===e.length)n=e[0],r=e[1];else if(-1!==[3,4,5].indexOf(e.length)){if("channelsFirst"===t){let t=aC(e,2);n=e[1]*t,r=e[0]*t}else if("channelsLast"===t){let t=aC(e,0,e.length-2);n=e[e.length-2]*t,r=e[e.length-1]*t}}else{let t=aC(e);n=Math.sqrt(t),r=Math.sqrt(t)}return[n,r]}(e),r=n[0],a=n[1],s=this.scale;if("fanIn"===this.mode?s/=Math.max(1,r):"fanOut"===this.mode?s/=Math.max(1,a):s/=Math.max(1,(r+a)/2),"normal"===this.distribution){let n=Math.sqrt(s);if("float32"!==(t=t||"float32")&&"int32"!==t)throw new rD(`${this.getClassName()} does not support dType ${t}.`);return(0,ah.truncatedNormal)(e,0,n,t,this.seed)}{let n=Math.sqrt(3*s);return(0,au.randomUniform)(e,-n,n,t,this.seed)}}getConfig(){return{scale:this.scale,mode:this.mode,distribution:this.distribution,seed:this.seed}}}a1.className="VarianceScaling",rJ.registerClass(a1);class a2 extends a1{constructor(e){super({scale:1,mode:"fanAvg",distribution:"uniform",seed:null==e?null:e.seed})}getClassName(){return a1.className}}a2.className="GlorotUniform",rJ.registerClass(a2);class a3 extends a1{constructor(e){super({scale:1,mode:"fanAvg",distribution:"normal",seed:null==e?null:e.seed})}getClassName(){return a1.className}}a3.className="GlorotNormal",rJ.registerClass(a3);class a4 extends a1{constructor(e){super({scale:2,mode:"fanIn",distribution:"normal",seed:null==e?null:e.seed})}getClassName(){return a1.className}}a4.className="HeNormal",rJ.registerClass(a4);class a5 extends a1{constructor(e){super({scale:2,mode:"fanIn",distribution:"uniform",seed:null==e?null:e.seed})}getClassName(){return a1.className}}a5.className="HeUniform",rJ.registerClass(a5);class a6 extends a1{constructor(e){super({scale:1,mode:"fanIn",distribution:"normal",seed:null==e?null:e.seed})}getClassName(){return a1.className}}a6.className="LeCunNormal",rJ.registerClass(a6);class a8 extends a1{constructor(e){super({scale:1,mode:"fanIn",distribution:"uniform",seed:null==e?null:e.seed})}getClassName(){return a1.className}}a8.className="LeCunUniform",rJ.registerClass(a8);class a9 extends aj{constructor(e){super(),this.DEFAULT_GAIN=1,this.ELEMENTS_WARN_SLOW=2e3,this.gain=null==e.gain?this.DEFAULT_GAIN:e.gain,this.seed=e.seed}apply(e,t){return(0,r$.tidy)(()=>{if(e.length<2)throw new rD("Shape must be at least 2D.");if("int32"!==t&&"float32"!==t&&void 0!==t)throw TypeError(`Unsupported data type ${t}.`);let n=rR.util.sizeFromShape(e.slice(0,-1)),r=e[e.length-1],a=n*r;a>this.ELEMENTS_WARN_SLOW&&console.warn(`Orthogonal initializer is being called on a matrix with more than ${this.ELEMENTS_WARN_SLOW} (${a}) elements: Slowness may result.`);let s=a_([Math.max(r,n),Math.min(r,n)],0,1,t,this.seed),i=al.linalg.qr(s,!1),o=i[0],l=i[1].flatten().stridedSlice([0],[Math.min(r,n)*Math.min(r,n)],[Math.min(r,n)+1]);return o=(0,b.mul)(o,l.sign()),n<r&&(o=o.transpose()),(0,b.mul)((0,k.scalar)(this.gain),o.reshape(e))})}getConfig(){return{gain:this.gain,seed:this.seed}}}a9.className="Orthogonal",rJ.registerClass(a9);let a7={constant:"Constant",glorotNormal:"GlorotNormal",glorotUniform:"GlorotUniform",heNormal:"HeNormal",heUniform:"HeUniform",identity:"Identity",leCunNormal:"LeCunNormal",leCunUniform:"LeCunUniform",ones:"Ones",orthogonal:"Orthogonal",randomNormal:"RandomNormal",randomUniform:"RandomUniform",truncatedNormal:"TruncatedNormal",varianceScaling:"VarianceScaling",zeros:"Zeros"};function se(e,t={}){return rH(e,rJ.SerializationMap.getMap().classNameMap,t,"initializer")}function st(e){if("string"==typeof e){let t=e in a7?a7[e]:e;if("GlorotNormal"===t)return new a3;{if("GlorotUniform"===t)return new a2;if("HeNormal"===t)return new a4;if("HeUniform"===t)return new a5;if("LeCunNormal"===t)return new a6;if("LeCunUniform"===t)return new a8;let e={};return e.className=t,e.config={},se(e)}}return e instanceof aj?e:se(e)}function sn(e){return Array.isArray(e)&&Array.isArray(e[0])}function sr(e){return 0===e.length?[]:Array.isArray(e[0])?e:[e]}function sa(e){let t;if(Array.isArray(e)){if(1!==e.length)throw new rF(`Expected Tensor length to be 1; got ${e.length}`);t=e[0]}else t=e;return t}function ss(e){if(!(Array.isArray(e)&&Array.isArray(e[0])))return e;if(1===e.length)return e[0];throw new rF(`Expected exactly 1 Shape; got ${e.length}`)}function si(e){let t=0;for(let n of e)0===n.shape.length?t+=1:t+=n.shape.reduce((e,t)=>e*t);return t}var so=e.i(200649);e.i(860623);let sl="Variable";class su{constructor(e,t="float32",n=sl,r=!0,a=null){this.dtype=null==t?"float32":t,this.shape=e.shape,this.id=rQ++,n=null==n?sl:n,this.originalName=ar(n),this.name=aa(this.originalName),this.trainable_=r,this.constraint=a,this.val=so.variable(e,this.trainable_,this.name,this.dtype)}read(){return this.assertNotDisposed(),this.val}write(e){return this.assertNotDisposed(),function(e,t){if(e.shape.toString()!==t.shape.toString())throw Error("Shape mismatch: "+JSON.stringify(e.shape)+" vs. "+JSON.stringify(t.shape))}(this.val,e),this.val.id!==e.id&&(this.val.assign(e),null!=this.constraint&&this.val.assign(this.constraint.apply(this.val))),this}dispose(){this.assertNotDisposed(),this.val.dispose()}assertNotDisposed(){if(this.val.isDisposed)throw Error(`LayersVariable ${this.name} is already disposed.`)}get trainable(){return this.trainable_}set trainable(e){this.trainable_=e,this.val.trainable=e}}function sh(e){return e.map(e=>e.read())}function sp(e){e.forEach(e=>{e[0].write(e[1])})}class sd{constructor(e){this.dtype=e.dtype,this.shape=e.shape,null!=e.shape?this.ndim=e.shape.length:this.ndim=e.ndim,this.maxNDim=e.maxNDim,this.minNDim=e.minNDim,this.axes=e.axes||{}}}class sc{constructor(e,t,n,r,a,s,i){this.dtype=e,this.shape=t,this.sourceLayer=n,this.inputs=r,this.callArgs=a,this.outputTensorIndex=i,this.id=rQ++,null!=s&&(this.originalName=ar(s),this.name=aa(this.originalName)),this.rank=t.length}}let sf=0;class sm{constructor(e,t){for(const n of(this.callArgs=t,this.id=sf++,this.outboundLayer=e.outboundLayer,this.inboundLayers=e.inboundLayers,this.nodeIndices=e.nodeIndices,this.tensorIndices=e.tensorIndices,this.inputTensors=e.inputTensors,this.outputTensors=e.outputTensors,this.inputMasks=e.inputMasks,this.outputMasks=e.outputMasks,this.inputShapes=e.inputShapes,this.outputShapes=e.outputShapes,e.inboundLayers))null!=n&&n.outboundNodes.push(this);e.outboundLayer.inboundNodes.push(this)}getConfig(){let e=[];for(let t of this.inboundLayers)null!=t?e.push(t.name):e.push(null);return{outboundLayer:this.outboundLayer?this.outboundLayer.name:null,inboundLayers:e,nodeIndices:this.nodeIndices,tensorIndices:this.tensorIndices}}}let sg=0;class sx extends rJ.Serializable{constructor(e={}){super(),this._callHook=null,this._addedWeightNames=[],this._stateful=!1,this.id=sg++,this.activityRegularizer=null,this.inputSpec=null,this.supportsMasking=!1,this._trainableWeights=[],this._nonTrainableWeights=[],this._losses=[],this._updates=[],this._built=!1,this.inboundNodes=[],this.outboundNodes=[];let t=e.name;if(!t){const e=this.getClassName();t=rW(e)+"_"+r1(e)}if(this.name=t,this.trainable_=null==e.trainable||e.trainable,null!=e.inputShape||null!=e.batchInputShape){let t;if(null!=e.batchInputShape)t=e.batchInputShape;else if(null!=e.inputShape){let n=null;null!=e.batchSize&&(n=e.batchSize),t=[n].concat(e.inputShape)}this.batchInputShape=t;let n=e.dtype;null==n&&(n=e.inputDType),null==n&&(n="float32"),this.dtype=n}null!=e.weights?this.initialWeights=e.weights:this.initialWeights=null,this._refCount=null,this.fastWeightInitDuringBuild=!1}static nodeKey(e,t){return e.name+"_ib-"+t.toString()}getNodeAtIndex(e,t){if(0===this.inboundNodes.length)throw new rE(`The layer has never been called and thus has no defined ${t}.`);if(this.inboundNodes.length<=e)throw new rF(`Asked to get ${t} at node ${e}, but the layer has only ${this.inboundNodes.length} inbound nodes.`);return this.inboundNodes[e]}getInputAt(e){return rP(this.getNodeAtIndex(e,"input").inputTensors)}getOutputAt(e){return rP(this.getNodeAtIndex(e,"output").outputTensors)}get input(){if(this.inboundNodes.length>1)throw new rA(`Layer ${this.name} has multiple inbound nodes, hence the notion of "layer input" is ill-defined. Use \`getInputAt(nodeIndex)\` instead.`);if(0===this.inboundNodes.length)throw new rA(`Layer ${this.name} is not connected, no input to return.`);return rP(this.getNodeAtIndex(0,"input").inputTensors)}get output(){if(0===this.inboundNodes.length)throw new rA(`Layer ${this.name} has no inbound nodes.`);if(this.inboundNodes.length>1)throw new rA(`Layer ${this.name} has multiple inbound nodes, hence the notion of "layer output" is ill-defined. Use \`getOutputAt(nodeIndex)\` instead.`);return rP(this.getNodeAtIndex(0,"output").outputTensors)}get losses(){return this._losses}calculateLosses(){return this.losses.map(e=>e())}get updates(){return this._updates}get built(){return this._built}set built(e){this._built=e}get trainable(){return this.trainable_}set trainable(e){this._trainableWeights.forEach(t=>t.trainable=e),this.trainable_=e}get trainableWeights(){return this.trainable_?this._trainableWeights.filter(e=>e.trainable):[]}set trainableWeights(e){this._trainableWeights=e}get nonTrainableWeights(){return this.trainable?this._trainableWeights.filter(e=>!e.trainable).concat(this._nonTrainableWeights):this._trainableWeights.concat(this._nonTrainableWeights)}set nonTrainableWeights(e){this._nonTrainableWeights=e}get weights(){return this.trainableWeights.concat(this.nonTrainableWeights)}get stateful(){return this._stateful}resetStates(){if(!this.stateful)throw Error("Cannot call the resetStates() method of a non-stateful Layer object.")}assertInputCompatibility(e){let t=rB(e);if(null==this.inputSpec||0===this.inputSpec.length)return;let n=rB(this.inputSpec);if(t.length!==n.length)throw new rF(`Layer ${this.name} expects ${n.length} inputs, but it received ${t.length} input tensors. Input received: ${e}`);for(let e=0;e<t.length;e++){let r=t[e],a=n[e];if(null==a)continue;let s=r.rank;if(null!=a.ndim&&s!==a.ndim)throw new rF(`Input ${e} is incompatible with layer ${this.name}: expected ndim=${a.ndim}, found ndim=${s}`);if(null!=a.maxNDim&&s>a.maxNDim)throw new rF(`Input ${e} is incompatible with layer ${this.name}: expected max_ndim=${a.maxNDim}, found ndim=${s}`);if(null!=a.minNDim&&s<a.minNDim)throw new rF(`Input ${e} is incompatible with layer ${this.name}: expected min_ndim=${a.minNDim}, found ndim=${s}.`);if(null!=a.dtype&&r.dtype!==a.dtype)throw new rF(`Input ${e} is incompatible with layer ${this.name} : expected dtype=${a.dtype}, found dtype=${r.dtype}.`);if(a.axes){let t=r.shape;for(let n in a.axes){let r=Number(n),s=a.axes[n],i=r>=0?t[r]:t[t.length+r];if(null!=s&&-1===[s,null].indexOf(i))throw new rF(`Input ${e} is incompatible with layer ${this.name}: expected axis ${r} of input shape to have value ${s} but got shape ${t}.`)}}if(null!=a.shape)for(let t=0;t<a.shape.length;++t){let n=a.shape[t],s=r.shape[t];if(null!=n&&null!=s&&n!==s)throw new rF(`Input ${e} is incompatible with layer ${this.name}: expected shape=${a.shape}, found shape=${r.shape}.`)}}}call(e,t){return e}invokeCallHook(e,t){null!=this._callHook&&this._callHook(e,t)}setCallHook(e){this._callHook=e}clearCallHook(){this._callHook=null}apply(e,t){t=t||{},this.assertNotDisposed();let n=rB(e),r=function(e){let t=!0;for(let n of rB(e))if(!(n instanceof sc)){t=!1;break}return t}(e),a=function(e){let t=!0;for(let n of rB(e))if(n instanceof sc){t=!1;break}return t}(e);if(r===a)throw new rF("Arguments to apply() must be all SymbolicTensors or all Tensors");return an(this.name,()=>{if(!this.built){this.assertInputCompatibility(e);let t=[];for(let n of rB(e))t.push(n.shape);this.build(rP(t)),this.built=!0,this.initialWeights&&this.setWeights(this.initialWeights),null===this._refCount&&a&&(this._refCount=1)}if(this.assertInputCompatibility(e),a){let r=this.call(e,t);this.supportsMasking&&this.setMaskMetadata(e,r);let a=rB(r),s=[];for(let e of a)-1!==n.indexOf(e)&&(e=e.clone()),s.push(e);if(r=rP(s),null!=this.activityRegularizer)throw new rD("Layer invocation in the presence of activity regularizer(s) is not supported yet.");return r}{let n,r=function(e){e=rB(e);let t=[];for(let n of e)t.push(n.shape);return rP(t)}(e),a=this.computeOutputShape(r),s="float32";if(this.warnOnIncompatibleInputShape(Array.isArray(e)?r[0]:r),n=null!=a&&a.length>0&&Array.isArray(a[0])?a.map((n,r)=>new sc(s,n,this,rB(e),t,this.name,r)):new sc(s,a,this,rB(e),t,this.name),this.addInboundNode(e,n,null,null,r,a,t),this._refCount++,null!=this.activityRegularizer)throw new rD("Layer invocation in the presence of activity regularizer(s) is not supported yet.");return n}})}warnOnIncompatibleInputShape(e){if(null!=this.batchInputShape)if(e.length!==this.batchInputShape.length)console.warn(`The rank of the input tensor provided (shape: ${JSON.stringify(e)}) does not match that of the batchInputShape (${JSON.stringify(this.batchInputShape)}) of the layer ${this.name}`);else{let t=!1;this.batchInputShape.forEach((n,r)=>{null!=n&&null!=e[r]&&e[r]!==n&&(t=!0)}),t&&console.warn(`The shape of the input tensor (${JSON.stringify(e)}) does not match the expectation of layer ${this.name}: ${JSON.stringify(this.batchInputShape)}`)}}get outputShape(){if(null==this.inboundNodes||0===this.inboundNodes.length)throw new rA(`The layer ${this.name} has never been called and thus has no defined output shape.`);let e=[];for(let t of this.inboundNodes){let n=JSON.stringify(t.outputShapes);-1===e.indexOf(n)&&e.push(n)}if(1===e.length){let e=this.inboundNodes[0].outputShapes;return Array.isArray(e)&&Array.isArray(e[0])&&1===e.length?e[0]:e}throw new rA(`The layer ${this.name} has multiple inbound nodes with different output shapes. Hence the notion of "output shape" is ill-defined for the layer.`)}countParams(){if(!this.built)throw new rE(`You tried to call countParams() on ${this.name}, but the layer is not built yet. Build it first by calling build(batchInputShape).`);return si(this.weights)}build(e){this.built=!0}getWeights(e=!1){return sh(e?this.trainableWeights:this.weights)}setWeights(e){(0,r$.tidy)(()=>{let t=this.weights;if(t.length!==e.length)throw new rF(`You called setWeights(weights) on layer "${this.name}" with a weight list of length ${e.length}, but the layer was expecting ${t.length} weights. Provided weights: ${e}...`);if(0===t.length)return;let n=[],r=sh(t);for(let a=0;a<r.length;++a){let s=r[a],i=t[a],o=e[a];if(!rR.util.arraysEqual(s.shape,o.shape))throw new rF(`Layer weight shape ${s.shape} not compatible with provided weight shape ${o.shape}`);n.push([i,o])}sp(n)})}addWeight(e,t,n,r,a,s,i,o){if(-1!==this._addedWeightNames.indexOf(e))throw new rF(`Duplicate weight name ${e} for layer ${this.name}`);this._addedWeightNames.push(e),null==n&&(n="float32"),this.fastWeightInitDuringBuild&&(r=null!=o?o():st("zeros"));let l=r.apply(t,n),u=new su(l,n,e,s,i);return l.dispose(),null!=a&&this.addLoss(()=>a.apply(u.read())),null==s&&(s=!0),s?this._trainableWeights.push(u):this._nonTrainableWeights.push(u),u}setFastWeightInitDuringBuild(e){this.fastWeightInitDuringBuild=e}addLoss(e){null==e||Array.isArray(e)&&0===e.length||(e=rB(e),void 0!==this._losses&&null!==this._losses&&this.losses.push(...e))}computeOutputShape(e){return e}computeMask(e,t){if(!this.supportsMasking){if(null!=t)if(Array.isArray(t))t.forEach(e=>{if(null!=e)throw TypeError(`Layer ${this.name} does not support masking, but was passed an inputMask.`)});else throw TypeError(`Layer ${this.name} does not support masking, but was passed an inputMask.`);return null}return t}setMaskMetadata(e,t,n){if(!this.supportsMasking)return;let r=this.computeMask(e,n),a=rB(t),s=rB(r);if(a.length!==s.length)throw Error(`${this.name} outputs ${a.length} tensors but ${a.length} masks for those tensors`);for(let e=0;e<a.length;e++)a[e].kerasMask=s[e]}addInboundNode(e,t,n,r,a,s,i=null){let o=rB(e);t=rB(t),n=rB(n),r=rB(r),a=sr(a),s=sr(s);let l=[],u=[],h=[];for(let e of o)l.push(e.sourceLayer),u.push(e.nodeIndex),h.push(e.tensorIndex);new sm({outboundLayer:this,inboundLayers:l,nodeIndices:u,tensorIndices:h,inputTensors:o,outputTensors:t,inputMasks:n,outputMasks:r,inputShapes:a,outputShapes:s},i);for(let e=0;e<t.length;e++)t[e].sourceLayer=this,t[e].nodeIndex=this.inboundNodes.length-1,t[e].tensorIndex=e}getConfig(){let e={name:this.name,trainable:this.trainable};return null!=this.batchInputShape&&(e.batchInputShape=this.batchInputShape),null!=this.dtype&&(e.dtype=this.dtype),e}disposeWeights(){return this.weights.forEach(e=>e.dispose()),this.weights.length}assertNotDisposed(){if(0===this._refCount)throw Error(`Layer '${this.name}' is already disposed.`)}dispose(){if(!this.built)throw Error(`Cannot dispose Layer ${this.name} because it has not been built yet.`);if(null===this._refCount)throw Error(`Cannot dispose Layer ${this.name} because it has not been used yet.`);this.assertNotDisposed();let e=0;return 0==--this._refCount&&(e=this.disposeWeights()),{refCountAfterDispose:this._refCount,numDisposedVariables:e}}}class sy extends sx{constructor(e){if(super({dtype:e.dtype,name:null!=e.name?e.name:r1("input").toString()}),null==e.batchSize&&(e.batchSize=null),null==e.sparse&&(e.sparse=!1),this.trainable=!1,this.built=!0,this.sparse=e.sparse,null!=e.inputShape&&null!=e.batchInputShape)throw new rF("Only provide the inputShape OR batchInputShape argument to inputLayer, not both at the same time.");let t=e.batchInputShape;if(null==t)if(null==e.inputShape)throw new rF("An InputLayer should be passed either a `batchInputShape` or an `inputShape`.");else t=[e.batchSize].concat(e.inputShape);else if(null!=e.batchSize)throw new rF("Cannot specify batchSize if batchInputShape is specified when creating an InputLayer.");const n=e.dtype||"float32";this.batchInputShape=t,this.dtype=n,this.inputSpec=[{shape:t}];const r=new sc(this.dtype,this.batchInputShape,this,[],{},this.name);r.nodeIndex=0,r.tensorIndex=0,new sm({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:[r],outputTensors:[r],inputMasks:[null],outputMasks:[null],inputShapes:[t],outputShapes:[t]})}apply(e,t){throw new rF(`Cannot pass any input to an InputLayer's apply() method. InputLayer name: ${this.name}`)}dispose(){return{refCountAfterDispose:this._refCount,numDisposedVariables:0}}getConfig(){return{batchInputShape:this.batchInputShape,dtype:this.dtype,sparse:this.sparse,name:this.name}}}function sb(e){if(null==e.batchShape&&null==e.shape)throw Error("Please provide to Input either a `shape` or a `batchShape` argument. Note that `shape` does not include the batch dimension.");if(null!=e.batchShape&&null!=e.shape)throw new rF("Please provide either a `shape` or `batchShape` argument to Input, but not both.");let t=e.batchShape;null!=e.shape&&null==t&&(t=[null].concat(e.shape));let n=e.dtype;return null==n&&(n="float32"),new sy({batchInputShape:t,name:e.name,dtype:n,sparse:e.sparse}).inboundNodes[0].outputTensors[0]}sy.className="InputLayer",rJ.registerClass(sy);class sv{constructor(e){if(this.id2Value={},this.id2Mask={},this.name2Id={},e instanceof sv)for(const t in e.id2Value)this.id2Value[t]=e.id2Value[t],t in e.id2Mask&&(this.id2Mask[t]=e.id2Mask[t]);else{if(null==e)return;for(const t of e)this.add(t.key,t.value)}}add(e,t,n){if(null==this.id2Value[e.id])this.id2Value[e.id]=function(e,t){if(null==e.dtype||e.dtype===t.dtype)return t;try{return(0,y.cast)(t,e.dtype)}catch(n){throw new rF(`The dtype of the feed (${t.dtype}) can not be cast to the dtype of the key '${e.name}' (${e.dtype}).`)}}(e,t),this.name2Id[e.name]=e.id,null!=n&&(this.id2Mask[e.id]=n);else throw new rF(`Duplicate key: name=${e.name}, id=${e.id}`);return this}addFeed(e){this.add(e.key,e.value)}hasKey(e){return null!=this.id2Value[e.id]}names(){return Object.keys(this.name2Id)}getValue(e){if(e instanceof sc)if(null!=this.id2Value[e.id])return this.id2Value[e.id];else throw new rF(`Nonexistent key: ${e.name}`);{let t=this.name2Id[e];if(null==t)throw new rF(`Feed dict has no SymbolicTensor name: ${e}`);return this.id2Value[t]}}getMask(e){if(e instanceof sc)if(null!=this.id2Value[e.id])return this.id2Mask[e.id];else throw new rF(`Nonexistent key: ${e.name}`);{let t=this.name2Id[e];if(null==t)throw new rF(`Feed dict has no SymbolicTensor name: ${e}`);return this.id2Mask[t]}}disposeMasks(){null!=this.id2Mask&&(0,r$.dispose)(this.id2Mask)}}let sw=new rL,sI=new rL;function sC(e,t,n,r){let a,s=null!=n&&n.training,i=Array.isArray(e),o=i?e:[e],l=o.map(e=>e.name),u=[],h=t.names();for(let e of l)-1!==h.indexOf(e)?u.push(t.getValue(e)):u.push(null);null!=r&&(r.maxNumTensors=-1/0,r.minNumTensors=1/0);let p=l.join(",")+"|"+t.names().sort().join(","),d=sw.get(p);if(null==d){let e=function(e,t){rR.util.assert(null!=e&&e.length>0,()=>"Expected at least one fetch, got none");let n=[],r={};if(1===e.length){let a=sk(e[0],t);n=a.sorted,r=a.recipientMap}else{let a=new Set;for(let s of e){let{sorted:e,recipientMap:i}=sk(s,t);for(let t of e)a.has(t.name)||(n.push(t),a.add(t.name));for(let e in i)null==r[e]&&(r[e]=new Set),i[e].forEach(t=>r[e].add(t))}}return{sorted:n,recipientCounts:function(e){let t={};for(let n in e)t[n]=e[n].size;return t}(r)}}(o,t);d=e.sorted,a=e.recipientCounts,sw.put(p,d),sI.put(p,a)}a={},s||Object.assign(a,sI.get(p));let c=new sv(t);for(let e=0;e<d.length;++e){if(null!=r){let e=(0,r$.memory)().numTensors;e>r.maxNumTensors&&(r.maxNumTensors=e),e<r.minNumTensors&&(r.minNumTensors=e)}let i=d[e],o=i.sourceLayer;if(o instanceof sy)continue;let h=[],p=[],f=[],m=!1;for(let e of i.inputs){let n=c.getValue(e),r=c.getMask(e);h.push(n),p.push(r),null!=r&&(m=!0),!s&&(a[e.name]--,0!==a[e.name]||t.hasKey(e)||-1!==l.indexOf(e.name)||n.isDisposed||!0===e.sourceLayer.stateful||f.push(n))}m&&((n=n||{}).mask=p[0]);let g=rB(o.apply(h,n)),x=null;o.supportsMasking&&(x=o.computeMask(h,p));let y=function(e){let t;if(1===e.sourceLayer.inboundNodes.length)t=e.sourceLayer.output;else{let n=null;for(let t=0;t<e.sourceLayer.inboundNodes.length;++t)for(let r of e.sourceLayer.inboundNodes[t].outputTensors)if(r.id===e.id){n=t;break}t=e.sourceLayer.getOutputAt(n)}return t}(i),b=Array.isArray(y)?y:[y];for(let e=0;e<b.length;++e){c.hasKey(b[e])||c.add(b[e],g[e],Array.isArray(x)?x[0]:x);let t=l.indexOf(b[e].name);-1!==t&&(u[t]=g[e])}s||(0,r$.dispose)(f)}return c.disposeMasks(),i?u:u[0]}function sk(e,t){let n=new Set,r=[],a={};for(let e of t.names())n.add(e);let s=[],i=[];for(s.push(e);s.length>0;){let e=s[s.length-1];if(n.has(e.name)){s.pop();continue}let t=i[i.length-1]===s.length-1;if(0===e.inputs.length||t)s.pop(),r.push(e),n.add(e.name),t&&i.pop();else for(let t of(i.push(s.length-1),e.inputs))null==a[t.name]&&(a[t.name]=new Set),a[t.name].add(e.name),n.has(t.name)||s.push(t)}return{sorted:r,recipientMap:a}}(0,rN.env)().registerFlag("TOPOLOGICAL_SORT_CACHE_MAX_ENTRIES",()=>100,function(e){null!=sw&&sw.setMaxEntries(e),null!=sI&&sI.setMaxEntries(e)});var rJ=rJ;function sS(e,t){return(0,r$.tidy)(()=>S.sqrt(F.sum(b.mul(e,e),t,!0)))}class sT extends rJ.Serializable{getConfig(){return{}}}class sN extends sT{constructor(e){super(),this.defaultMaxValue=2,this.defaultAxis=0,this.maxValue=null!=e.maxValue?e.maxValue:this.defaultMaxValue,this.axis=null!=e.axis?e.axis:this.defaultAxis}apply(e){return(0,r$.tidy)(()=>{let t=sS(e,this.axis),n=nE.clipByValue(t,0,this.maxValue);return b.mul(e,I.div(n,P.add(aN(),t)))})}getConfig(){return{maxValue:this.maxValue,axis:this.axis}}}sN.className="MaxNorm",rJ.registerClass(sN);class s$ extends sT{constructor(e){super(),this.defaultAxis=0,this.axis=null!=e.axis?e.axis:this.defaultAxis}apply(e){return(0,r$.tidy)(()=>I.div(e,P.add(aN(),sS(e,this.axis))))}getConfig(){return{axis:this.axis}}}s$.className="UnitNorm",rJ.registerClass(s$);class sR extends sT{apply(e){return ru.relu(e)}}sR.className="NonNeg",rJ.registerClass(sR);class sA extends sT{constructor(e){super(),this.defaultMinValue=0,this.defaultMaxValue=1,this.defaultRate=1,this.defaultAxis=0,this.minValue=null!=e.minValue?e.minValue:this.defaultMinValue,this.maxValue=null!=e.maxValue?e.maxValue:this.defaultMaxValue,this.rate=null!=e.rate?e.rate:this.defaultRate,this.axis=null!=e.axis?e.axis:this.defaultAxis}apply(e){return(0,r$.tidy)(()=>{let t=sS(e,this.axis),n=P.add(b.mul(this.rate,nE.clipByValue(t,this.minValue,this.maxValue)),b.mul(1-this.rate,t));return b.mul(e,I.div(n,P.add(aN(),t)))})}getConfig(){return{minValue:this.minValue,maxValue:this.maxValue,rate:this.rate,axis:this.axis}}}sA.className="MinMaxNorm",rJ.registerClass(sA);let sE={maxNorm:"MaxNorm",minMaxNorm:"MinMaxNorm",nonNeg:"NonNeg",unitNorm:"UnitNorm"};function sF(e,t={}){return rH(e,rJ.SerializationMap.getMap().classNameMap,t,"constraint")}function sD(e){return null==e?null:"string"==typeof e?sF({className:e in sE?sE[e]:e,config:{}}):e instanceof sT?e:sF(e)}function sO(e){return new sN(e)}function sL(e){return new s$(e)}function sz(){return new sR}function s_(e){return new sA(e)}e.s(["maxNorm",()=>sO,"minMaxNorm",()=>s_,"nonNeg",()=>sz,"unitNorm",()=>sL],421568);var sM=e.i(421568);function sP(){return new aX}function sB(){return new aK}function sW(e){return new aY(e)}function sG(e){return new aZ(e)}function sU(e){return new aJ(e)}function sV(e){return new aQ(e)}function sH(e){return new a0(e)}function sq(e){return new a1(e)}function sj(e){return new a2(e)}function sX(e){return new a3(e)}function sK(e){return new a4(e)}function sY(e){return new a5(e)}function sZ(e){return new a6(e)}function sJ(e){return new a8(e)}function sQ(e){return new a9(e)}e.s(["constant",()=>sW,"glorotNormal",()=>sX,"glorotUniform",()=>sj,"heNormal",()=>sK,"heUniform",()=>sY,"identity",()=>sH,"leCunNormal",()=>sZ,"leCunUniform",()=>sJ,"ones",()=>sB,"orthogonal",()=>sQ,"randomNormal",()=>sU,"randomUniform",()=>sG,"truncatedNormal",()=>sV,"varianceScaling",()=>sq,"zeros",()=>sP],860345);var s0=e.i(860345),s1=e.i(42330);async function s2(e){if(null==e)return;let t=[],n=[],r=[];for(let a in e){let s=e[a];"number"!=typeof s&&(t.push(s.data()),n.push(a),r.push(s))}if(t.length>0){let a=await Promise.all(t);for(let t=0;t<a.length;++t)e[n[t]]=a[t][0];(0,r$.dispose)(r)}}function s3(e){if(null!=e)for(let t in e){let n=e[t];"number"!=typeof n&&n.dispose()}}(s=p||(p={}))[s.SILENT=0]="SILENT",s[s.VERBOSE=1]="VERBOSE";class s4{constructor(){this.validationData=null}setParams(e){this.params=e}async onEpochBegin(e,t){}async onEpochEnd(e,t){}async onBatchBegin(e,t){}async onBatchEnd(e,t){}async onTrainBegin(e){}async onTrainEnd(e){}setModel(e){}}class s5{constructor(e,t=10){null==e&&(e=[]),this.callbacks=e,this.queueLength=t}append(e){this.callbacks.push(e)}setParams(e){for(let t of this.callbacks)t.setParams(e)}setModel(e){for(let t of this.callbacks)t.setModel(e)}async onEpochBegin(e,t){for(let n of(null==t&&(t={}),this.callbacks))await n.onEpochBegin(e,t)}async onEpochEnd(e,t){for(let n of(null==t&&(t={}),this.callbacks))await n.onEpochEnd(e,t)}async onBatchBegin(e,t){for(let n of(null==t&&(t={}),this.callbacks))await n.onBatchBegin(e,t)}async onBatchEnd(e,t){for(let n of(null==t&&(t={}),this.callbacks))await n.onBatchEnd(e,t)}async onTrainBegin(e){for(let t of(null==e&&(e={}),this.callbacks))await t.onTrainBegin(e)}async onTrainEnd(e){for(let t of(null==e&&(e={}),this.callbacks))await t.onTrainEnd(e)}}class s6 extends s4{constructor(){super()}async onEpochBegin(e){this.seen=0,this.totals={}}async onBatchEnd(e,t){null==t&&(t={});let n=null==t.size?0:t.size;for(let e in this.seen+=n,t){let r=t[e];if("number"==typeof r)this.totals.hasOwnProperty(e)||(this.totals[e]=0),this.totals[e]=this.totals[e]+r*n;else{let t;e in this.totals?t=this.totals[e]:this.totals[e]=0;let a=(0,r$.tidy)(()=>(0,P.add)(this.totals[e],(0,b.mul)(r,n)));this.totals[e]=a,null!=t&&t.dispose()}}}async onEpochEnd(e,t){if(null!=t)for(let e of this.params.metrics)null!=this.totals[e]&&("number"==typeof this.totals[e]?t[e]=this.totals[e]/this.seen:(0,r$.tidy)(()=>{let n=(0,b.mul)((0,I.div)(1,this.seen),this.totals[e]);t[e]=n,this.totals[e].dispose(),(0,r$.keep)(t[e])}))}}class s8 extends s4{async onTrainBegin(e){this.epoch=[],this.history={}}async onEpochEnd(e,t){for(let n in null==t&&(t={}),this.epoch.push(e),t)null==this.history[n]&&(this.history[n]=[]),this.history[n].push(t[n])}async syncData(){let e=[],t=[],n=[];for(let r in this.history){let a=this.history[r];for(let s=0;s<a.length;++s)if("number"!=typeof a[s]){let i=a[s];e.push(i.data()),t.push(r),n.push(s)}}let r=await Promise.all(e);for(let e=0;e<r.length;++e)this.history[t[e]][n[e]].dispose(),this.history[t[e]][n[e]]=r[e][0]}}class s9 extends s4{constructor(e,t){if(super(),this.currentEpoch=0,this.nowFunc=e.nowFunc,this.nextFrameFunc=e.nextFrameFunc||s1.nextFrame,this.yieldEvery=t||"auto","auto"===this.yieldEvery&&(this.yieldEvery=125),"never"===this.yieldEvery&&null!=e.onYield)throw Error("yieldEvery is `never` but you provided an `onYield` callback. Either change `yieldEvery` or remove the callback");rR.util.isNumber(this.yieldEvery)&&(this.maybeWait=function(e,t,n){let r,a=null!=n?n():rR.util.now();return(...s)=>{let i=null!=n?n():rR.util.now();return i-a<t?r:(a=i,r=e(...s))}}(this.maybeWait.bind(this),this.yieldEvery,this.nowFunc)),this.trainBegin=e.onTrainBegin,this.trainEnd=e.onTrainEnd,this.epochBegin=e.onEpochBegin,this.epochEnd=e.onEpochEnd,this.batchBegin=e.onBatchBegin,this.batchEnd=e.onBatchEnd,this.yield=e.onYield}async maybeWait(e,t,n){let r=[];null!=this.yield&&(await s2(n),r.push(this.yield(e,t,n))),r.push(this.nextFrameFunc()),await Promise.all(r)}async onEpochBegin(e,t){this.currentEpoch=e,null!=this.epochBegin&&(await s2(t),await this.epochBegin(e,t))}async onEpochEnd(e,t){let n=[];null!=this.epochEnd&&(await s2(t),n.push(this.epochEnd(e,t))),"epoch"===this.yieldEvery&&n.push(this.nextFrameFunc()),await Promise.all(n)}async onBatchBegin(e,t){null!=this.batchBegin&&(await s2(t),await this.batchBegin(e,t))}async onBatchEnd(e,t){let n=[];null!=this.batchEnd&&(await s2(t),n.push(this.batchEnd(e,t))),"batch"===this.yieldEvery?n.push(this.nextFrameFunc()):rR.util.isNumber(this.yieldEvery)&&n.push(this.maybeWait(this.currentEpoch,e,t)),await Promise.all(n)}async onTrainBegin(e){null!=this.trainBegin&&(await s2(e),await this.trainBegin(e))}async onTrainEnd(e){null!=this.trainEnd&&(await s2(e),await this.trainEnd(e))}}function s7(e,t){return(null==e&&(e={}),e instanceof s4)?[e]:Array.isArray(e)&&e[0]instanceof s4?e:rB(e).map(e=>new s9(e,t))}class ie{constructor(){}static registerCallbackConstructor(e,t){rR.util.assert(e>=0&&Number.isInteger(e),()=>`Verbosity level is expected to be an integer >= 0, but got ${e}`),ie.checkForDuplicate(t),null==ie.constructors[e]&&(ie.constructors[e]=[]),ie.constructors[e].push(t)}static checkForDuplicate(e){for(let t in ie.constructors)ie.constructors[+t].forEach(t=>{if(t===e)throw new rF("Duplicate callback constructor.")})}static clear(){ie.constructors={}}static createCallbacks(e){let t=[];for(let n in ie.constructors){let r=+n;e>=r&&t.push(...ie.constructors[r])}return t.map(e=>new e)}}function it(e,t,n,r,a,s,i,o,l){let u=new s8,h=[new s6,...ie.createCallbacks(t)];null!=e&&h.push(...e),h.push(u);let p=new s5(h);return p.setParams({epochs:n,initialEpoch:r,samples:a,steps:s,batchSize:i,verbose:t,doValidation:o,metrics:l}),{callbackList:p,history:u}}ie.constructors={};var ir=e.i(889135),ia=e.i(246559),rJ=rJ,rJ=rJ;function is(e,t={},n=!1){return rH(e,rJ.SerializationMap.getMap().classNameMap,t,"layer",n)}var ii=e.i(419886);function io(e,t){return(0,r$.tidy)(()=>{"float32"!==e.dtype&&(e=y.cast(e,"float32"));let n=F.sum(aB(e),t,!0),r=ii.fill(n.shape,aN()),a=S.sqrt(nh.maximum(n,r));return I.div(e,a)})}function il(e,t){return(0,r$.tidy)(()=>n6.mean(aB(N.sub(t,e)),-1))}function iu(e,t){return(0,r$.tidy)(()=>n6.mean(nf.abs(N.sub(t,e)),-1))}function ih(e,t){return(0,r$.tidy)(()=>{let n=N.sub(e,t),r=nE.clipByValue(nf.abs(e),aN(),Number.MAX_VALUE),a=nf.abs(I.div(n,r));return b.mul(100,n6.mean(a,-1))})}function ip(e,t,n=!1){return(0,r$.tidy)(()=>{if(n)t=ry.softmax(t);else{let e=F.sum(t,t.shape.length-1,!0);t=I.div(t,e)}return t=nE.clipByValue(t,aN(),1-aN()),C.neg(F.sum(b.mul(y.cast(e,"float32"),tC.log(t)),t.shape.length-1))})}function id(e,t,n=!1){return(0,r$.tidy)(()=>{let r,a=y.cast(tc.floor((r=[aC(e.shape)],E.reshape(e,r))),"int32"),s=(t=nE.clipByValue(t,aN(),1-aN())).shape;return ip(E.reshape(rr.oneHot(a,s[s.length-1]),s),t,n)})}function ic(e,t){return(0,r$.tidy)(()=>{let n;return n=nE.clipByValue(t,aN(),1-aN()),n=tC.log(I.div(n,N.sub(1,n))),n6.mean(function(e,t){if(!rR.util.arraysEqual(e.shape,t.shape))throw new rF(`logits and labels must have the same shape, but got shapes ${JSON.stringify(e.shape)} and ${JSON.stringify(t.shape)}`);return(0,r$.tidy)(()=>{let n=ru.relu(t),r=C.neg(nf.abs(t));return P.add(N.sub(n,b.mul(t,e)),n1.log1p(eL.exp(r)))})}(e,n),-1)})}function im(e,t){return(0,r$.tidy)(()=>{let n=io(e,-1),r=io(t,-1),a=b.mul(n,r);return C.neg(F.sum(a,-1))})}let ig={meanSquaredError:il,meanAbsoluteError:iu,meanAbsolutePercentageError:ih,meanSquaredLogarithmicError:function(e,t){return(0,r$.tidy)(()=>{let n=nE.clipByValue(t,aN(),Number.MAX_VALUE),r=tC.log(P.add(1,n)),a=nE.clipByValue(e,aN(),Number.MAX_VALUE),s=tC.log(P.add(1,a));return n6.mean(aB(N.sub(r,s)),-1)})},squaredHinge:function(e,t){return(0,r$.tidy)(()=>{let n=nh.maximum(0,N.sub(1,b.mul(e,t)));return n6.mean(aB(n),-1)})},hinge:function(e,t){return(0,r$.tidy)(()=>{let n=nh.maximum(0,N.sub(1,b.mul(e,t)));return n6.mean(n,-1)})},categoricalHinge:function(e,t){return(0,r$.tidy)(()=>{let n=F.sum(b.mul(e,t),-1),r=n5.max(b.mul(N.sub(1,e),t),-1);return nh.maximum(0,P.add(1,N.sub(r,n)))})},logcosh:function(e,t){return(0,r$.tidy)(()=>{let n=Math.log(2),r=N.sub(t,e),a=N.sub(P.add(r,rb.softplus(b.mul(-2,r))),n);return n6.mean(a,-1)})},categoricalCrossentropy:ip,sparseCategoricalCrossentropy:id,binaryCrossentropy:ic,kullbackLeiblerDivergence:function(e,t){return(0,r$.tidy)(()=>{let n=nE.clipByValue(e,aN(),1),r=nE.clipByValue(t,aN(),1);return F.sum(b.mul(e,tC.log(I.div(n,r))),-1)})},poisson:function(e,t){return(0,r$.tidy)(()=>{let n=tC.log(P.add(aN(),t));return n6.mean(N.sub(t,b.mul(e,n)),-1)})},cosineProximity:im};function ix(e){if("string"!=typeof e)return e;{if(e in ig)return ig[e];let t=`Unknown loss ${e}`;throw e.toLowerCase().includes("softmaxcrossentropy")&&(t=`Unknown loss ${e}. Use "categoricalCrossentropy" as the string name for tf.losses.softmaxCrossEntropy`),new rF(t)}}function iy(e,t){return(0,r$.tidy)(()=>{let n=b.mul(.5,ra.onesLike(t)),r=aR(e1.greater(t,n),e.dtype);return n6.mean(e9.equal(e,r),-1)})}function ib(e,t){return(0,r$.tidy)(()=>aR(e9.equal(nv.argMax(e,-1),nv.argMax(t,-1)),"float32"))}function iv(e,t){return(0,r$.tidy)(()=>y.cast(F.sum(el.logicalAnd(e9.equal(e,1),e9.equal(t,1))),"float32"))}function iw(e,t){return(0,r$.tidy)(()=>{let n=iv(e,t),r=(0,r$.tidy)(()=>y.cast(F.sum(el.logicalAnd(e9.equal(e,0),e9.equal(t,1))),"float32")),a=P.add(n,r);return y.cast(eu.where(e1.greater(a,0),I.div(n,a),0),"float32")})}function iI(e,t){return ic(e,t)}function iC(e,t){return e.rank===t.rank&&(e=rw.squeeze(e,[e.rank-1])),(t=nv.argMax(t,-1)).dtype!==e.dtype&&(t=y.cast(t,e.dtype)),y.cast(e9.equal(e,t),"float32")}let ik={binaryAccuracy:iy,categoricalAccuracy:ib,precision:iw,categoricalCrossentropy:ip,sparseCategoricalCrossentropy:id,mse:il,MSE:il,mae:iu,MAE:iu,mape:ih,MAPE:ih,cosine:im};function iS(e){if(r_(null!==e,`Unknown LossOrMetricFn ${e}`),"string"==typeof e)return e;{let t;for(let n of Object.keys(ig))if(ig[n]===e){t=n;break}if(void 0!==t)return t;for(let n of Object.keys(ik))if(ik[n]===e){t=n;break}return void 0!==t?t:e.name}}var iT=e.i(674519);function iN(e,t,n=!1){if(null==e||"object"!=typeof e||Object.getPrototypeOf(e)!==Object.prototype||!function e(t){if(null===t)return!0;if("object"==typeof t)if(Object.getPrototypeOf(t)===Object.prototype){for(let n of Object.keys(t))if("string"!=typeof n||!e(t[n]))return!1;return!0}else{if(!Array.isArray(t))return!1;for(let n of t)if(!e(n))return!1;return!0}{let e=typeof t;return"string"===e||"number"===e||"boolean"===e}}(e))throw Error("User-defined metadata is expected to be a JSON object, but is not.");if(n){let n=JSON.stringify(e);n.length>1048576&&console.warn(`User-defined metadata of model "${t}" is too large in size (length=${n.length} when serialized). It is not recommended to store such large objects in user-defined metadata. Please make sure its serialized length is <= 1048576.`)}}function i$(e,t,n=console.log){let r="";for(let n=0;n<e.length;++n)n>0&&(r=r.slice(0,r.length-1)+" "),r+=e[n],r=r.slice(0,t[n]),r+=" ".repeat(t[n]-r.length);n(r)}function iR(e,t,n){return("inboundNodes"===e||"outputLayers"===e||"inputLayers"===e)&&0===t&&"string"==typeof n}function iA(e,t){if(null===e)return null;if("string"==typeof e)return rG(e);if("number"==typeof e||"boolean"==typeof e)return e;if(e instanceof Array){let n=[],r=e.length;for(let a=0;a<r;++a){let r=e[a];iR(t,a,r)?n.push(r):n.push(iA(r,t))}return n}{let t={};for(let n of Object.keys(e)){let r=e[n];if("name"===n&&"string"==typeof r)t[n]=r;else{let e=rG(n);t[e]=iA(r,e)}}return t}}let iE="4.22.0";class iF extends sx{constructor(e){if(super({}),this.containerNodes=new Set,this.name=e.name,null==this.name){const e=this.getClassName().toLowerCase();this.name=r1(e)}if(this.supportsMasking=!1,this.trainable_=!0,Array.isArray(e.inputs)?this.inputs=e.inputs.slice():this.inputs=[e.inputs],Array.isArray(e.outputs)?this.outputs=e.outputs.slice():this.outputs=[e.outputs],rj(this.inputs).length!==this.inputs.length)throw new rF(`The list of inputs passed to the model is redundant. All inputs should only appear once. Found: ${this.inputs.map(e=>e.name)}`);for(const e of(rj(this.outputs).length!==this.outputs.length&&console.warn(`The list of outputs passed to the model is redundant. All outputs should only appear once. Found: ${this.outputs.map(e=>e.name)}`),this.inputLayers=[],this.inputLayersNodeIndices=[],this.inputLayersTensorIndices=[],this.outputLayers=[],this.outputLayersNodeIndices=[],this.outputLayersTensorIndices=[],this.layers=[],this.internalContainerRefs=[],this.outputs)){const t=e.sourceLayer,n=e.nodeIndex,r=e.tensorIndex;this.outputLayers.push(t),this.outputLayersNodeIndices.push(n),this.outputLayersTensorIndices.push(r)}for(const e of this.inputs){const t=e.sourceLayer,n=e.nodeIndex,r=e.tensorIndex;r_(0===n,"input layer has >1 nodes"),r_(0===r,"input layer has >1 tensors"),this.inputLayers.push(t),this.inputLayersNodeIndices.push(n),this.inputLayersTensorIndices.push(r)}this.inputNames=[],this.outputNames=[],this.feedInputShapes=[],this.feedInputNames=[],this.feedOutputNames=[];for(let t=0;t<this.inputLayers.length;t++){const n=this.inputLayers[t];if(!(n instanceof sy))throw TypeError(`Input layers to a LayersModel must be InputLayer objects. Received inputs: ${e.inputs}. Input ${t} (0-based) originates from layer type ${n.getClassName()}.`);this.inputNames.push(n.name),this.feedInputShapes.push(n.batchInputShape),this.feedInputNames.push(n.name)}for(const e of this.outputLayers)this.outputNames.push(e.name);this.internalInputShapes=this.inputs.map(e=>e.shape),this.internalOutputShapes=this.outputs.map(e=>e.shape);const t={},n={},r={},a={},s={},i=[],o=(e,t,n,r,a,l)=>{(null==r||null==a||null==l)&&(r=e.sourceLayer,a=e.nodeIndex,l=e.tensorIndex);let u=r.inboundNodes[a];if(-1!==n.indexOf(u))throw new rE(`The tensor ${e.name} at layer "${r.name}" is part of a cycle.`);if(-1!==t.indexOf(u))return;this.containerNodes.add(iF.nodeKey(r,a)),r.id in s||(s[r.id]=Object.keys(s).length),-1===n.indexOf(u)&&n.push(u);let h=u.inboundLayers.length;for(let e=0;e<h;e++)o(u.inputTensors[e],t,n,u.inboundLayers[e],u.nodeIndices[e],u.tensorIndices[e]);for(t.push(u);n.indexOf(u)>=0;)n.splice(n.indexOf(u),1);i.push(u)},l=[],u=[];for(const e of this.outputs)o(e,l,u);for(const e of i.slice().reverse()){n[e.id]=e,e.id in t||(t[e.id]=0);let s=t[e.id];s=Math.max(s,null==r[e.outboundLayer.id]?0:r[e.outboundLayer.id]),r[e.outboundLayer.id]=s,a[e.outboundLayer.id]=e.outboundLayer,t[e.id]=s;for(let r=0;r<e.inboundLayers.length;r++){const a=e.inboundLayers[r],i=e.nodeIndices[r],o=a.inboundNodes[i],l=null==t[o.id]?0:t[o.id];t[o.id]=Math.max(s+1,l),n[o.id]=o}}const h={};for(const e in t){const r=t[e];r in h||(h[r]=[]),h[r].push(n[e])}const p={};for(const e in r){const t=r[e];t in p||(p[t]=[]),p[t].push(a[e])}let d=Object.keys(p).map(e=>parseInt(e,10)).sort(rq);for(const e of(this.layers=[],d)){const t=p[e];for(const e of(t.sort((e,t)=>{let n=s[e.id],r=s[t.id];return n<r?-1:+(n>r)}),t))e instanceof iF&&this.internalContainerRefs.push(e),this.layers.push(e)}this.layersByDepth=p,d=Object.keys(h).map(e=>parseInt(e,10)).sort(rq);const c=this.inputs.slice(),f=[];for(const e of d)for(const t of h[e]){const e=t.outboundLayer;if(null!=e){for(const n of t.inputTensors)if(-1===c.indexOf(n))throw new rE(`Graph disconnected: cannot obtain value for tensor ${n} at layer "${e.name}". The following previous layers were accessed without issue: ${f}`);for(const e of t.outputTensors)c.push(e);f.push(e.name)}}this.nodesByDepth=h;const m=this.layers.map(e=>e.name);for(const e of m){const t=m.filter(t=>t===e).length;if(1!==t)throw new rE(`The name "${e}" is used ${t} times in the model. All layer names should be unique. Layer names: `+JSON.stringify(m))}this.outboundNodes=[],this.inboundNodes=[],new sm({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:this.inputs,outputTensors:this.outputs,inputMasks:this.inputs.map(e=>null),outputMasks:this.outputs.map(e=>null),inputShapes:this.inputs.map(e=>e.shape),outputShapes:this.outputs.map(e=>e.shape)}),this.built=!0,this._refCount=1}assertNotDisposed(){if(0===this._refCount)throw Error(`Container '${this.name}' is already disposed.`)}dispose(){this.assertNotDisposed();let e={refCountAfterDispose:null,numDisposedVariables:0};if(0==--this._refCount){for(let t of this.layers)e.numDisposedVariables+=t.dispose().numDisposedVariables;for(let t of this.internalContainerRefs)e.numDisposedVariables+=t.dispose().numDisposedVariables}return e.refCountAfterDispose=this._refCount,e}get trainable(){return this.trainable_}set trainable(e){this.layers.forEach(t=>{t._trainableWeights.forEach(t=>t.trainable=e)}),this.trainable_=e}get trainableWeights(){if(this._trainableWeights.length>0)throw new rF("Container instance unexpectedly contains _trainableWeights.The trainable weights of a Container are a union of the trainable weights of its consituent Layers. Its own _trainableWeights must remain an empty Array.");if(!this.trainable)return[];let e=[];for(let t of this.layers)e=e.concat(t.trainableWeights);return e}get nonTrainableWeights(){let e=[];for(let t of this.layers)e.push(...t.nonTrainableWeights);if(!this.trainable){let t=[];for(let e of this.layers)t.push(...e.trainableWeights);return t.concat(e)}return e}get weights(){return this.trainableWeights.concat(this.nonTrainableWeights)}loadWeights(e,t=!0){let n={},r=0,a=(e=>{let t=Object.keys(e);if(0===t.length)return!1;let n=t[0].split("/");return!isNaN(parseInt(n[n.length-1],10))})(e);for(let t of(a&&this.parseWeights(e),this.layers))for(let[e,s]of t.weights.entries()){let t=a?`${s.name.split("/").slice(0,-1).join("/")+"/"}${e}`:s.originalName;if(null!=n[t])throw new rF(`Duplicate weight name: ${t}`);n[t]=s,r++}let s=[];for(let r in e){let a=r;if(null==n[r]){let e=r.split("/");a=e.slice(0,-2).concat([e[e.length-1]]).join("/")}if(null!=n[a])s.push([n[a],e[r]]);else if(t)throw new rF(`Provided weight data has no target variable: ${r}`);delete n[a]}if(t){let e=[];for(let t in n)e.push(t);if(e.length>0)throw new rF(`${e.length} of ${r} weights are not set: ${e}`)}sp(s)}parseWeights(e){for(let t in Object.keys(e)){let n=t.split("/"),r=["vars","layer_checkpoint_dependencies"],a=n.map(e=>e.startsWith("_")?e.slice(1):e).filter(e=>!r.includes(e)).join("/");a!==t&&(e[a]=e[t],delete e[t])}}updatedConfig(){let e=this.getConfig(),t={};return t.className=this.getClassName(),t.config=e,t.kerasVersion=`tfjs-layers ${iE}`,t.backend="TensorFlow.js",t}toJSON(e,t=!0){let n=function e(t,n){if(null==t)return null;if("string"==typeof t)return rW(t);if("number"==typeof t||"boolean"==typeof t)return t;if(t instanceof Array){let r=[],a=t.length;for(let s=0;s<a;++s){let a=t[s];iR(n,s,a)?r.push(a):r.push(e(a,n))}return r}{let n={};for(let r of Object.keys(t)){let a=t[r],s=rW(r);("name"===r||"className"===r)&&"string"==typeof a?n[s]=a:n[s]=e(a,r)}return n}}(this.updatedConfig());return t?JSON.stringify(n):n}call(e,t){return(0,r$.tidy)(()=>{e=rB(e);let n=new sv;for(let t=0;t<this.inputs.length;++t)n.add(this.inputs[t],e[t]);return sC(this.outputs,n,t)})}computeMask(e,t){return(0,r$.tidy)(()=>{let n;return e=rB(e),n=null==t?rz(null,e.length):rB(t),this.runInternalGraph(e,n)[1]})}computeOutputShape(e){let t=sr(e);if(t.length!==this.inputLayers.length)throw new rF(`Invalid inputShape argument ${e}: model has ${this.inputLayers.length} tensor inputs.`);let n={};for(let e=0;e<t.length;e++){let r=this.inputLayers[e],a=t[e];n[r.name+"_0_0"]=a}let r=Object.keys(this.nodesByDepth).map(e=>parseInt(e,10)).sort(rq);if(r.length>1)for(let e of r)for(let t of this.nodesByDepth[e]){let e=t.outboundLayer;if(-1!==this.inputLayers.map(e=>e.id).indexOf(e.id))continue;let r=[];for(let e=0;e<t.inboundLayers.length;e++){let a=t.inboundLayers[e],s=t.nodeIndices[e],i=t.tensorIndices[e],o=n[`${a.name}_${s}_${i}`];r.push(o)}let a=sr(e.computeOutputShape(rP(r))),s=e.inboundNodes.indexOf(t);for(let t=0;t<a.length;t++)n[`${e.name}_${s}_${t}`]=a[t]}let a=[],s=[];for(let e=0;e<this.outputLayers.length;e++){let t=this.outputLayers[e],n=this.outputLayersNodeIndices[e],r=this.outputLayersTensorIndices[e],a=`${t.name}_${n}_${r}`;s.push(a)}for(let e=0;e<s.length;e++){let t=s[e];r_(t in n),a.push(n[t])}return rP(a)}runInternalGraph(e,t){null==t&&(t=rz(null,e.length));let n={};for(let r=0;r<this.inputs.length;++r){let a=this.inputs[r],s=e[r],i=t[r];n[a.id]=[s,i]}for(let e of Object.keys(this.nodesByDepth).map(e=>parseInt(e,10)).sort(rq))for(let t of this.nodesByDepth[e]){let e=t.outboundLayer,r=t.inputTensors,a=t.outputTensors,s=[];for(let e of r)e.id in n&&s.push(n[e.id]);if(s.length===r.length){let r,i,o,l,u={};if(null!=t.callArgs&&(u=t.callArgs),1===s.length){let[t,n]=s[0];null==u.mask&&(u.mask=n),o=rB(e.call(t,u)),l=rB(e.computeMask(t,n)),r=[t],i=[n]}else r=s.map(e=>e[0]),i=s.map(e=>e[1]),null==u.mask&&(u.mask=i),o=rB(e.call(r,u)),l=rB(e.computeMask(r,i));if(e.activityRegularizer)throw new rD("LayersModel invocation with concrete Tensor value(s) in the presence of activity regularizer(s) is not supported yet.");for(let e=0;e<a.length;++e){let t=a[e],r=o[e],s=l[e];n[t.id]=[r,s]}}}let r=[],a=[],s=[];for(let e of this.outputs){r_(e.id in n,`Could not compute output ${e.name} : ${e.id}`);let[t,i]=n[e.id];s.push(t.shape),r.push(t),a.push(i)}return[r,a,s]}buildNodeConversionMap(e){let t,n={};for(let e of this.layers){t=+(e instanceof iF);for(let r=0;r<e.inboundNodes.length;r++){let a=iF.nodeKey(e,r);this.containerNodes.has(a)&&(n[a]=t,t+=1)}}return n}getLayer(e,t){if(null!=t)return this.findLayer(t);if(null==e)throw new rF("Provide either a layer name or layer index");if("number"==typeof e)return this.findLayer(e);for(let t of this.layers)if(t.name===e)return t;throw new rF(`No such layer: ${e}`)}findLayer(e){if(!(this.layers.length<=e))return this.layers[e];throw new rF(`Was asked to retrieve layer at index ${e}, but model only has ${this.layers.length} layer(s).`)}calculateLosses(){return(0,r$.tidy)(()=>{let e=[];for(let t of this.layers)for(let n=0;n<t.inboundNodes.length;++n){let r=iF.nodeKey(t,n);this.containerNodes.has(r)&&e.push(...t.calculateLosses())}return e})}getConfig(){let e={name:this.name},t=this.buildNodeConversionMap(this.layers),n=[];for(let e of this.layers){let r=e.getClassName(),a=e.getConfig(),s=[];for(let n=0;n<e.inboundNodes.length;n++){let r=e.inboundNodes[n],a=iF.nodeKey(e,n),i={};if(this.containerNodes.has(a)){if(r.callArgs)try{JSON.stringify(r.callArgs),i=r.callArgs}catch(t){console.warn(`Layer ${e.name} was passed non-serializable keyword arguments: ${r.callArgs}. They will not be included in the serialized model (and thus will be missing at deserialization time).`),i={}}if(r.inboundLayers.length>0){let e=[];for(let n=0;n<r.inboundLayers.length;n++){let a=r.inboundLayers[n],s=r.nodeIndices[n],o=r.tensorIndices[n],l=t[iF.nodeKey(a,s)];null==l&&(l=0),e.push([a.name,l,o,i])}s.push(e)}}}let i={};i.name=e.name,i.className=r,i.config=a,i.inboundNodes=s,n.push(i)}e.layers=n;let r=[];for(let e=0;e<this.inputLayers.length;e++){let n=this.inputLayers[e],a=this.inputLayersNodeIndices[e],s=iF.nodeKey(n,a);if(!this.containerNodes.has(s))continue;let i=t[s];null==i&&(i=0);let o=this.inputLayersTensorIndices[e];r.push([n.name,i,o])}e.inputLayers=r;let a=[];for(let e=0;e<this.outputLayers.length;e++){let n=this.outputLayers[e],r=this.outputLayersNodeIndices[e],s=iF.nodeKey(n,r);if(!this.containerNodes.has(s))continue;let i=t[s];null==i&&(i=0);let o=this.outputLayersTensorIndices[e];a.push([n.name,i,o])}return e.outputLayers=a,e}static fromConfig(e,t,n={},r=!1){let a={},s={};function i(e,t){e.name in s?s[e.name].push(t):s[e.name]=[t]}let o=t.name,l=t.layers;for(let e of l)!function(e){let n=e.name,s=is(e,null!=t.customObjects?t.customObjects:{});s.setFastWeightInitDuringBuild(r),a[n]=s,e.inboundNodes.forEach(e=>{if(!(e instanceof Array))throw new rF(`Corrupted configuration, expected array for nodeData: ${e}`);i(s,e)})}(e);for(;!function(e){if(null==e)throw new rF(`Invalid value in obj: ${JSON.stringify(e)}`);for(let t in e)if(e.hasOwnProperty(t))return!1;return!0}(s);)for(let e of l){let t=a[e.name];if(t.name in s){let e=s[t.name];for(let n of(delete s[t.name],e))!function(e,t){let n,r=[];for(let s of t){let o=s[0],l=s[1],u=s[2];if(n=null==s[3]?{}:s[3],!(o in a))return void i(e,t);let h=a[o];if(h.inboundNodes.length<=l)return void i(e,t);let p=h.inboundNodes[l];r.push(p.outputTensors[u])}r.length>0&&e.apply(rP(r),n)}(t,n)}}let u=[],h=[];for(let e of t.inputLayers){let t=e[0],n=e[1],r=e[2];r_(t in a);let s=a[t].inboundNodes[n].outputTensors;u.push(s[r])}for(let e of t.outputLayers){let t=e[0],n=e[1],r=e[2];r_(t in a);let s=a[t].inboundNodes[n].outputTensors;h.push(s[r])}return new e({inputs:u,outputs:h,name:o})}get stateful(){if(this._stateful)throw new rF("Container instance unexpectedly has _stateful = true. The statefulness of a Container is determined by the Layers it contains. Its _stateful property must remain the default false.");for(let e of this.layers)if(e.stateful)return!0;return!1}resetStates(){(0,r$.tidy)(()=>{this.layers.forEach(e=>{e.stateful&&e.resetStates()})})}}var iD=e.i(612930);function iO(e,t){var n="classWeight";let r=t.length;if(null==e||Array.isArray(e)&&0===e.length)return t.map(e=>null);if(1===r)if(Array.isArray(e)&&1===e.length)return e;else if("object"==typeof e&&t[0]in e)return[e[t[0]]];else return[e];if(Array.isArray(e)){if(e.length!==r)throw Error(`Provided ${n} is an array of ${e.length} element(s), but the model has ${r} outputs. Make sure a set of weights is provided for each model output.`);return e}if("object"==typeof e&&Object.keys(e).length>0&&"object"==typeof e[Object.keys(e)[0]]){let n=[];return t.forEach(t=>{t in e?n.push(e[t]):n.push(null)}),n}throw Error(`The model has multiple (${r}) outputs, so ${n} must be either an array with ${r} elements or an object with ${t} keys. Provided ${n} not understood: ${JSON.stringify(e)}`)}async function iL(e,t,n,r){if(null!=t||null!=r)throw Error("Support sampleWeight is not implemented yet");if(null==n)return null;{let t=(0,r$.tidy)(()=>{if(1===e.shape.length)return(0,iD.clone)(e);if(2===e.shape.length)if(e.shape[1]>1)return(0,nv.argMax)(e,1);else if(1===e.shape[1])return(0,E.reshape)(e,[e.shape[0]]);else throw Error(`Encountered unexpected last-dimension size (${e.shape[1]}) during handling of class weights. The size is expected to be >= 1.`);throw Error(`Unexpected rank of target (y) tensor (${e.rank}) during handling of class weights. The rank is expected to be 1 or 2.`)}),r=Array.from(await t.data());(0,r$.dispose)(t);let a=[];return r.forEach(e=>{if(null==n[e])throw Error(`classWeight must contain all classes in the training data. The class ${e} exists in the data but not in classWeight`);a.push(n[e])}),(0,aI.tensor1d)(a,"float32")}}function iz(e,t){let n,r;n=t.xs,r=t.ys,rR.util.assert(null!=n&&null!=r,()=>`A Dataset iterator for fitDataset() is expected to generate objects of the form \`{xs: xVal, ys: yVal}\`, where the two values may be \`tf.Tensor\`, an array of Tensors, or a map of string to Tensor.  The provided Dataset instead generates ${t}`);let a=i_("input",e.inputNames,n),s=i_("output",e.outputNames,r),i=a[0].shape[0];rR.util.assert(a.length===e.inputs.length,()=>`LayersModel has ${e.inputs.length} inputs, but the dataset provides ${a.length} inputs.  (Expected input keys: ${JSON.stringify(e.inputNames)})`),rR.util.assert(s.length===e.outputs.length,()=>`LayersModel has ${e.outputs.length} outputs, but the dataset provides ${s.length} outputs.  (Expected output keys: ${JSON.stringify(e.outputNames)})`);for(let t=0;t<a.length;t++)rR.util.assert(a[t].shape[0]===i,()=>`Batch size mismatch: input ${e.inputNames[t]} has ${a[t].shape[0]}; expected  ${i} based on input ${e.inputNames[0]}.`);for(let t=0;t<s.length;t++)rR.util.assert(s[t].shape[0]===i,()=>`Batch size mismatch: output ${e.outputNames[t]} has ${s[t].shape[0]}; expected  ${i} based on input ${e.inputNames[0]}.`);return{xs:a,ys:s}}function i_(e,t,n){if(n instanceof nm.Tensor)return[n];if(Array.isArray(n))return rR.util.assert(n.length===t.length,()=>`Received an array of ${n.length} Tensors, but expected ${t.length} to match the ${e} keys ${t}.`),n;{let r=[];for(let a of t){if(null==n[a])throw new rF(`The feature data generated by the dataset lacks the required ${e} key '${a}'.`);r.push(n[a])}return r}}async function iM(e,t,n){let r=null!=n.batchesPerEpoch;if(rR.util.assert(null!=e.optimizer,()=>"You must compile a model before training/testing. Use LayersModel.compile(modelCompileConfig)."),rR.util.assert(null!=n,()=>"For fitDataset(), the 2nd argument (config) is required, but it is not provided in this call."),rR.util.assert(null!=n.epochs&&n.epochs>0&&Number.isInteger(n.epochs),()=>`For fitDataset(), config.epochs is expected to be a positive integer, but got ${n.epochs}`),rR.util.assert(!r||n.batchesPerEpoch>0&&Number.isInteger(n.batchesPerEpoch),()=>`For fitDataset(), config.batchesPerEpoch is expected to be a positive integer if specified, but got ${n.batchesPerEpoch}`),rR.util.assert(null==n.validationSplit,()=>"`validationSplit` is not supported by `fitDataset()`. Use validationData instead."),e.isTraining)throw Error("Cannot start training because another fit() call is ongoing.");e.isTraining=!0;try{var a,s;let i,o,l,u,h=null!=n.validationData;if(h)if(iP(n.validationData))rR.util.assert(null==n.validationBatches||n.validationBatches>0&&Number.isInteger(n.validationBatches),()=>`For fitDataset() with dataset-based validation, config.validationBatches is expected not to be provided, or to be a positive integer, but got ${n.validationBatches}`);else{let e=function(e){if(3===e.length)throw new rD("Validation with sample weights is not implemented yet.");return{xs:e[0],ys:e[1]}}(n.validationData);o=e.xs,l=e.ys}let p=e.makeTrainFunction(),d=e.getDedupedMetricsNames();u=h?d.slice().concat(d.map(e=>"val_"+e)):d.slice();let c=s7(n.callbacks,n.yieldEvery),f=null==n.verbose?1:n.verbose,{callbackList:m,history:g}=it(c,f,n.epochs,null,null,(a=t,s=n,i=null,null!=s.batchesPerEpoch?i=s.batchesPerEpoch:Number.isFinite(a.size)&&(i=a.size),i),null,h,u);m.setModel(e),e.history=g,await m.onTrainBegin(),e.stopTraining_=!1;let x=null==n.initialEpoch?0:n.initialEpoch,y=await t.iterator();for(;x<n.epochs;){let a={};await m.onEpochBegin(x);let s=0,i=0;for(r||(y=await t.iterator());!r||s<n.batchesPerEpoch;){let t=await y.next();if(r&&t.done){console.warn(`You provided \`batchesPerEpoch\` as ${n.batchesPerEpoch}, but your dataset iterator ran out of data after ${s} batches; interrupting training. Make sure that your dataset can generate at least \`batchesPerEpoch * epochs\` batches (in this case, ${n.batchesPerEpoch*n.epochs} batches). You may need to use the repeat() function when building your dataset.`);break}if(null!=t.value){let{xs:r,ys:a}=iz(e,t.value),o={};o.batch=i,o.size=r[0].shape[0],await m.onBatchBegin(i,o);let l=[];if(null!=n.classWeight){let t=iO(n.classWeight,e.outputNames);for(let e=0;e<t.length;++e)l.push(await iL(a[e],null,t[e]))}let u=r.concat(a).concat(l),h=p(u);r$.dispose(u);for(let e=0;e<d.length;++e){let t=d[e],n=h[e];o[t]=n,r$.keep(n)}await m.onBatchEnd(i,o),s3(o),i++,s++}if(r?s>=n.batchesPerEpoch:t.done){if(h){let t;t=iP(n.validationData)?rB(await e.evaluateDataset(n.validationData,{batches:n.validationBatches})):rB(e.evaluate(o,l,{batchSize:null==n.validationBatchSize?32:n.validationBatchSize,verbose:0}));for(let n=0;n<e.metricsNames.length;++n)a[`val_${e.metricsNames[n]}`]=t[n]}break}if(e.stopTraining_)break}if(await m.onEpochEnd(x,a),x++,e.stopTraining_)break}return await m.onTrainEnd(),await e.history.syncData(),e.history}finally{e.isTraining=!1}}function iP(e){return"function"==typeof e.iterator}async function iB(e,t,n){let r=null!=(n=n||{}).batches,a=e.testFunction,s=[];if(n.verbose>0)throw new rD("Verbose mode is not implemented yet.");rR.util.assert(!r||n.batches>0&&Number.isInteger(n.batches),()=>`Test loop expects \`batches\` to be a positive integer, but received ${JSON.stringify(n.batches)}`);let i="function"==typeof t.next?t:await t.iterator(),o=0,l=0;for(;!r||l<n.batches;){let t=await i.next();if(s=r$.tidy(()=>{if(t.value){let{xs:n,ys:r}=iz(e,t.value),i=n.concat(r),u=r$.tidy(()=>a(i));if(r$.dispose(i),0===l)for(let e=0;e<u.length;++e)s.push((0,k.scalar)(0));let h=i[0].shape[0];for(let e=0;e<u.length;++e){let t=u[e],n=s[e];s[e]=r$.tidy(()=>P.add(s[e],b.mul(h,t))),l>0&&r$.dispose(n)}r$.dispose(u),o+=h,++l}return s}),t.done){r&&console.warn(`Your dataset iterator ran out of data during evaluateDataset(). Interrupting evalution. Make sure that your dataset can generate at least \`batches\` batches (in this case, ${n.batches} batches). You may need to use the repeat() function when building your dataset.`);break}}for(let e=0;e<s.length;++e){let t=s[e];s[e]=I.div(s[e],o),r$.dispose(t)}return rP(s)}function iW(e){rR.util.assert(e>0&&Number.isInteger(e),()=>`batchSize is required to be a positive integer, but got ${e}`)}function iG(e,t,n){return null==e?[null]:Array.isArray(e)?e.map(e=>aE(e,t,n-t)):aE(e,t,n-t)}function iU(e,t){return r$.tidy(()=>null==e?null:Array.isArray(e)?e.map(e=>iU(e,t)):aP(e,"int32"===t.dtype?t:y.cast(t,"int32")))}function iV(e,t){let n=[],r=0,a=null;for(;r<e;)(a=r+t)>=e&&(a=e),n.push([r,a]),r=a;return n}function iH(e){let t=[];e instanceof nm.Tensor&&(e=[e]);for(let n=0;n<e.length;++n){let r=e[n];if(1===r.rank)t.push(aA(r,1));else if(0===r.rank)throw Error("Expected tensor to be at least 1D, but received a 0D tensor (scalar).");else t.push(r)}return t}function iq(e,t){if(null==e)return;let n=[];if(t instanceof nm.Tensor)n.push(t.id);else if(Array.isArray(t))t.forEach(e=>n.push(e.id));else if(null!=t)for(let e in t){let r=t[e];n.push(r.id)}let r=[];if(e instanceof nm.Tensor)-1===n.indexOf(e.id)&&r.push(e);else if(Array.isArray(e))e.forEach(e=>{-1===n.indexOf(e.id)&&r.push(e)});else if(null!=e)for(let t in e){let a=e[t];-1===n.indexOf(a.id)&&r.push(a)}r.forEach(e=>{e.isDisposed||e.dispose()})}function ij(e){return Array.isArray(e)}function iX(e){return!(e instanceof nm.Tensor)&&!ij(e)}function iK(e,t,n,r=!0,a=""){let s;if(null==t||0===t.length){if(null!=e){let t=!1;if(ij(e)&&e.length>0)t=!0;else if(iX(e)){for(let n in e)if(e.hasOwnProperty(n)){t=!0;break}}else t=!0;if(t)throw new rF(`Error when checking model ${a} expected no data, but got ${e}`)}return[]}if(null==e)return t.map(e=>null);if(iX(e))for(let n of(s=[],t)){if(null==e[n])throw new rF(`No data provided for "${n}". Need data for each key in: ${t}`);s.push(e[n])}else if(ij(e)){if(e.length!==t.length)throw new rF(`Error when checking model ${a}: the Array of Tensors that you are passing to your model is not the size the model expected. Expected to see ${t.length} Tensor(s), but instead got the following list of Tensor(s): ${e}`);s=e}else{if(t.length>1)throw new rF(`The model ${a} expects ${t.length} Tensor(s), but only received one Tensor. Found: Tensor with shape ${e.shape}`);s=[e]}if(s=iH(s),null!=n)for(let e=0;e<t.length;++e){if(null==n[e])continue;let i=s[e];if(i.shape.length!==n[e].length)throw new rF(`Error when checking ${a}: expected ${t[e]} to have ${n[e].length} dimension(s). but got array with shape ${i.shape}`);for(let t=0;t<n[e].length;++t){if(0===t&&!r)continue;let s=i.shape[t],o=n[e][t];if(null!=o&&o>=0&&s!==o)throw new rF(`${a} expected a batch of elements where each example has shape [${n[e].slice(1,n[e].length)}] (i.e.,tensor shape [*,${n[e].slice(1,n[e].length)}]) but the ${a} received an input with ${i.shape[0]} examples, each with shape [${i.shape.slice(1,i.shape.length)}] (tensor shape [${i.shape}])`)}}return s}function iY(e,t,n,r=!0,a=""){let s;if(Array.isArray(e)){if(e.length!==t.length)throw new rF(`Error when checking model ${a}: the Array of Tensors that you are passing to your model is not the size the the model expected. Expected to see ${t.length} Tensor(s), but instead got ${e.length} Tensors(s).`);s=e}else{if(t.length>1)throw new rF(`The model expects ${t.length} ${a} Tensors, but only received one Tensor. Found: array with shape ${JSON.stringify(e.shape)}.`);s=[e]}if(null!=n)for(let e=0;e<t.length;++e){if(null==n[e])continue;let i=s[e];if(i.shape.length!==n[e].length)throw new rF(`Error when checking ${a}: expected ${t[e]} to have ${n[e].length} dimension(s), but got array with shape ${JSON.stringify(i.shape)}`);for(let s=0;s<n[e].length;++s){if(0===s&&!r)continue;let o=i.shape[s],l=n[e][s];if(null!=l&&l!==o)throw new rF(`Error when checking ${a}: expected ${t[e]} to have shape ${JSON.stringify(n[e])} but got array with shape ${JSON.stringify(i.shape)}.`)}}}class iZ extends iF{constructor(e){super(e),this.isTraining=!1}summary(e,t,n=console.log){if(!this.built)throw new rF("This model has never been called, thus its weights have not been created yet. So no summary can be displayed. Build the model first (e.g., by calling it on some test data).");!function(e,t,n,r=console.log){var a;let s,i=function(e){let t=!0,n=[],r=[];for(let t in e.nodesByDepth)n.push(e.nodesByDepth[t]);for(let e of n){if(e.length>1||1===e.length&&e[0].inboundLayers.length>1){t=!1;break}r.push(...e)}if(t)for(let n of e.layers){let e=!1;for(let a of n.inboundNodes)if(-1!==r.indexOf(a))if(e){t=!1;break}else e=!0;if(!t)break}return t}(e),o=["Layer (type)","Input Shape","Output shape","Param #"];if(i?(t=t||90,n=n||[.32,.61,.89,1]):(t=t||115,n=n||[.24,.48,.7,.8,1]),n[n.length-1]<=1&&(n=n.map(e=>Math.floor(t*e))),!i)for(let t in o.push("Receives inputs"),s=[],e.nodesByDepth)s.push(...e.nodesByDepth[t]);r("_".repeat(t)),i$(o,n,r),r("=".repeat(t));let l=e.layers;for(let e=0;e<l.length;++e)i?function(e,t,n){let r,a;try{a=e.inboundNodes.map(e=>JSON.stringify(e.inputShapes)).join(",")}catch(e){a="multiple"}try{r=JSON.stringify(e.outputShape)}catch(e){r="multiple"}let s=e.name,i=e.getClassName();i$([`${s} (${i})`,a,r,e.countParams().toString()],t,n)}(l[e],n,r):function(e,t,n,r){let a,s;try{s=e.inboundNodes.map(e=>JSON.stringify(e.inputShapes)).join(",")}catch(e){s="multiple"}try{a=JSON.stringify(e.outputShape)}catch(e){a="multiple"}let i=[];for(let t of e.inboundNodes)if(null==n||!(n.length>0)||-1!==n.indexOf(t))for(let e=0;e<t.inboundLayers.length;++e){let n=t.inboundLayers[e].name,r=t.nodeIndices[e],a=t.tensorIndices[e];i.push(`${n}[${r}][${a}]`)}let o=e.name,l=e.getClassName(),u=0===i.length?"":i[0];i$([`${o} (${l})`,s,a,e.countParams().toString(),u],t,r);for(let e=1;e<i.length;++e)i$(["","","","",i[e]],t,r)}(l[e],n,s,r),r((e===l.length-1?"=":"_").repeat(t));e.checkTrainableWeightsConsistency();let u=null!=(a=e).collectedTrainableWeights?si(a.collectedTrainableWeights):si(a.trainableWeights),h=si(e.nonTrainableWeights);r(`Total params: ${u+h}`),r(`Trainable params: ${u}`),r(`Non-trainable params: ${h}`),r("_".repeat(t))}(this,e,t,n)}compile(e){if(null==e.loss&&(e.loss=[]),this.loss=e.loss,"string"==typeof e.optimizer)this.optimizer_=function(e){let t={Adagrad:()=>iT.train.adagrad(.01),Adadelta:()=>iT.train.adadelta(1,.95,aN()),Adam:()=>iT.train.adam(.001,.9,.999,aN()),Adamax:()=>iT.train.adamax(.002,.9,.999,aN(),0),RMSProp:()=>iT.train.rmsprop(.001,.9,0,aN()),SGD:()=>iT.train.sgd(.01)};if(t.adagrad=t.Adagrad,t.adadelta=t.Adadelta,t.adam=t.Adam,t.adamax=t.Adamax,t.rmsprop=t.RMSProp,t.sgd=t.SGD,e in t)return t[e]();throw new rF(`Unknown Optimizer ${e}`)}(e.optimizer),this.isOptimizerOwned=!0;else{if(!(e.optimizer instanceof ia.Optimizer))throw new rF("User-defined optimizer must be an instance of tf.Optimizer.");this.optimizer_=e.optimizer,this.isOptimizerOwned=!1}let t=[];if(Array.isArray(e.loss)||"string"==typeof e.loss||"function"==typeof e.loss)if(Array.isArray(e.loss)){if(e.loss.length!==this.outputs.length)throw new rF(`When passing an Array as loss, it should have one entry per model output. The model has ${this.outputs.length} output(s), but you passed loss=${e.loss}.`);t=e.loss.map(e=>ix(e))}else{let n=ix(e.loss);this.outputs.forEach(e=>{t.push(n)})}else{for(let t in e.loss=e.loss,e.loss)if(-1===this.outputNames.indexOf(t))throw new rF(`Unknown entry in loss dictionary: "${t}". Only expected the following keys: ${this.outputNames}`);for(let n of this.outputNames)null==e.loss[n]&&console.warn(`Output "${n}" is missing from loss dictionary. We assume this was done on purpose, and we will not be expecting data to be passed to ${n} during training`),t.push(ix(e.loss[n]))}this.lossFunctions=t,this.feedOutputNames=[],this.feedOutputShapes=[],this.feedLossFns=[];for(let e=0;e<this.outputs.length;++e){let t=this.internalOutputShapes[e],n=this.outputNames[e];this.feedOutputNames.push(n),this.feedOutputShapes.push(t),this.feedLossFns.push(this.lossFunctions[e])}let n=[];this.metrics=e.metrics,this.metricsNames=["loss"],this.metricsTensors=[],an("loss",()=>{for(let e=0;e<this.outputs.length;++e){if(-1!==n.indexOf(e))continue;let t=this.lossFunctions[e];this.outputs.length>1&&(this.metricsTensors.push([t,e]),this.metricsNames.push(this.outputNames[e]+"_loss"))}});let r=function(e,t){let n;if(null==e||Array.isArray(e)&&0===e.length)return t.map(e=>[]);if("string"==typeof e||"function"==typeof e)n=[e];else if(Array.isArray(e)||"object"==typeof e)n=e;else throw TypeError(`Type of metrics argument not understood. Expected an string,function, Array, or Object, found: ${e}`);if(Array.isArray(n))return t.map(e=>n);{let e=[];for(let r of t){let t=n.hasOwnProperty(r)?n[r]:[];Array.isArray(t)||(t=[t]),e.push(t)}return e}}(e.metrics,this.outputNames),a=(e,t,n)=>{this.outputNames.length>1&&(t=this.outputNames[e]+"_"+t),this.metricsNames.push(t),this.metricsTensors.push([n,e])};an("metric",()=>{for(let e=0;e<this.outputs.length;++e){if(-1===n.indexOf(e))(t=>{let n,r,s;for(let i of t){let t;if("string"==typeof i&&-1!==["accuracy","acc","crossentropy","ce"].indexOf(i)){let t,a=this.internalOutputShapes[e];1===a[a.length-1]||this.lossFunctions[e]===ic?-1!==["accuracy","acc"].indexOf(i)?r=iy:-1!==["crossentropy","ce"].indexOf(i)&&(r=iI):this.lossFunctions[e]===id?-1!==["accuracy","acc"].indexOf(i)?r=iC:-1!==["crossentropy","ce"].indexOf(i)&&(r=id):-1!==["accuracy","acc"].indexOf(i)?r=ib:-1!==["crossentropy","ce"].indexOf(i)&&(r=ip),-1!==["accuracy","acc"].indexOf(i)?t="acc":-1!==["crossentropy","ce"].indexOf(i)&&(t="ce"),s=r,n=""+t}else s=function(e){if("string"==typeof e&&e in ik)return ik[e];if("string"!=typeof e&&null!=e)return e;throw new rF(`Unknown metric ${e}`)}(i),n=""+iS(i);an(n,()=>{t=s}),a(e,n,t)}})(r[e])}}),this.collectedTrainableWeights=this.trainableWeights}checkTrainableWeightsConsistency(){null!=this.collectedTrainableWeights&&this.trainableWeights.length!==this.collectedTrainableWeights.length&&console.warn("Discrepancy between trainableweights and collected trainable weights. Did you set `model.trainable` without calling `model.compile()` afterwards?")}evaluate(e,t,n={}){let r=null==n.batchSize?32:n.batchSize;iW(r);let a=this.standardizeUserDataXY(e,t,!0,r);try{let e=a[0].concat(a[1]);this.makeTestFunction();let t=this.testFunction,s=this.testLoop(t,e,r,n.verbose,n.steps);return rP(s)}finally{iq(a[0],e),iq(a[1],t)}}async evaluateDataset(e,t){return this.makeTestFunction(),iB(this,e,t)}checkNumSamples(e,t,n,r="steps"){let a;if(null!=n){if(a=null,null!=t)throw new rF(`If ${r} is set, batchSize must be null or undefined.Got batchSize = ${t}`)}else if(null!=e)a=Array.isArray(e)?e[0].shape[0]:e.shape[0];else throw new rF(`Either the input data should have a defined shape, or ${r} shoud be specified.`);return a}execute(e,t){if(Array.isArray(t)&&0===t.length)throw new rF("`outputs` is an empty Array, which is not allowed.");let n=Array.isArray(t),r=n?t:[t],a=this.retrieveSymbolicTensors(r),s=new sv;if(e instanceof nm.Tensor&&(e=[e]),Array.isArray(e)){if(e.length!==this.inputs.length)throw new rF(`The number of inputs provided (${e.length}) does not match the number of inputs of this model (${this.inputs.length}).`);for(let t=0;t<this.inputs.length;++t)s.add(this.inputs[t],e[t])}else for(let t of this.inputs){let n=e[t.name];if(null==n)throw new rF(`No value is provided for the model's input ${t.name}`);s.add(t,n)}let i=sC(a,s);return n?i:i[0]}retrieveSymbolicTensors(e){let t=rz(null,e.length),n=e.length;for(let r of this.layers){let a=Array.isArray(r.output)?r.output:[r.output],s=a.map(e=>e.name);for(let r=0;r<e.length;++r){let i=s.indexOf(e[r]);if(-1!==i&&(t[r]=a[i],n--),0===n)break}if(0===n)break}if(n>0){let n=[];throw t.forEach((t,r)=>{null==t&&n.push(e[r])}),new rF(`Cannot find SymbolicTensors for output name(s): ${JSON.stringify(n)}`)}return t}predictLoop(e,t=32,n=!1){return r$.tidy(()=>{let r=this.checkNumSamples(e);if(n)throw new rD("Verbose predictLoop() is not implemented yet.");let a=iV(r,t),s=this.outputs.map(e=>[]);for(let t=0;t<a.length;++t)r$.tidy(()=>{let n=iG(e,a[t][0],a[t][1]),r=[];if(Array.isArray(n))for(let e=0;e<n.length;++e)r.push({key:this.inputs[e],value:n[e]});else r.push({key:this.inputs[0],value:n});let s=new sv(r);return sC(this.outputs,s)}).forEach((e,t)=>s[t].push(e));return rP(s.map(e=>t5.concat(e,0)))})}predict(e,t={}){let n=iH(e);iY(n,this.inputNames,this.feedInputShapes,!1);try{let e=null==t.batchSize?32:t.batchSize;return iW(e),this.predictLoop(n,e)}finally{iq(n,e)}}predictOnBatch(e){iY(e,this.inputNames,this.feedInputShapes,!0);let t=(Array.isArray(e)?e[0]:e).shape[0];return this.predictLoop(e,t)}standardizeUserDataXY(e,t,n=!0,r){if(null==this.optimizer_)throw new rE("You must compile a model before training/testing. Use LayersModel.compile(modelCompileArgs).");let a=[];for(let e=0;e<this.feedOutputShapes.length;++e){let t=this.feedOutputShapes[e];this.feedLossFns[e]===id?a.push(t.slice(0,t.length-1).concat([1])):a.push(t)}e=iK(e,this.feedInputNames,this.feedInputShapes,!1,"input"),t=iK(t,this.feedOutputNames,a,!1,"target");var s=e,i=t;let o=rj(s.map(e=>e.shape[0]));o.sort();let l=rj(i.map(e=>e.shape[0]));if(l.sort(),o.length>1)throw new rF(`All input Tensors (x) should have the same number of samples. Got array shapes: ${JSON.stringify(s.map(e=>e.shape))}`);if(l.length>1)throw new rF(`All target Tensors (y) should have the same number of samples. Got array shapes: ${JSON.stringify(i.map(e=>e.shape))}`);if(o.length>0&&l.length>0&&!rR.util.arraysEqual(o,l))throw new rF(`Input Tensors should have the same number of samples as target Tensors. Found ${o[0]} input sample(s) and ${l[0]} target sample(s).`);if(!function(e,t,n){let r=[il,ic,ip];for(let a=0;a<e.length;++a){let s=e[a],i=t[a],o=n[a];if(null!=i){if(i===ip&&1===s.shape[s.shape.length-1])throw new rF(`You are passing a target array of shape ${s.shape} while using a loss 'categorical_crossentropy'. 'categorical_crossentropy'expects targets to be binary matrices (1s and 0s) of shape [samples, classes].`);if(-1!==r.indexOf(i)){let e=s.shape.slice(1),t=o.slice(1);for(let n=0;n<e.length;++n){let r=e[n],a=t[n];if(null!=a&&r!==a)throw new rF(`A target Tensor with shape ${s.shape} was passed for an output of shape ${o}, while using a loss function that expects targets to have the same shape as the output.`)}}}}}(t,this.feedLossFns,this.feedOutputShapes),this.stateful&&null!=r&&r>0&&e[0].shape[0]%r!=0)throw new rF(`In a stateful network, you should only pass inputs with a number of samples that is divisible by the batch size ${r}. Found: ${e[0].shape[0]} sample(s).`);return[e,t]}async standardizeUserData(e,t,n,r,a=!0,s){let[i,o]=this.standardizeUserDataXY(e,t,a,s);if(null!=n)throw Error("sample weight is not supported yet.");let l=null;if(null!=r){let e=iO(r,this.outputNames);l=[];for(let t=0;t<e.length;++t)l.push(await iL(o[t],null,e[t]))}return[i,o,l]}testLoop(e,t,n,r=0,a){return r$.tidy(()=>{let s=this.checkNumSamples(t,n,a,"steps"),i=[];if(r>0)throw new rD("Verbose mode is not implemented yet.");if(null!=a)throw new rD("steps mode in testLoop() is not implemented yet");{let r=iV(s,n),a=(0,aI.tensor1d)(aT(0,s));for(let n=0;n<r.length;++n){let s=r[n][0],o=r[n][1],l=e(iU(t,aE(a,s,o-s)));if(0===n)for(let e=0;e<l.length;++e)i.push((0,k.scalar)(0));for(let e=0;e<l.length;++e){let t=l[e];i[e]=P.add(i[e],b.mul(o-s,t))}}for(let e=0;e<i.length;++e)i[e]=I.div(i[e],s)}return i})}getDedupedMetricsNames(){let e=this.metricsNames,t=[];for(let n=0;n<e.length;++n){let r=e[n],a=r;if(rM(e,r)>1){let t=rM(e.slice(0,n),r);a+=`_${t}`}t.push(a)}return t}makeTrainFunction(){return e=>{let t=[],n=e.slice(0,this.inputs.length),r=e.slice(this.inputs.length,this.inputs.length+this.outputs.length),a=e.slice(this.inputs.length+this.outputs.length,this.inputs.length+2*this.outputs.length),s=[],i=()=>{let e,i=[];for(let e=0;e<this.inputs.length;++e)i.push({key:this.inputs[e],value:n[e]});let o=new sv(i),l=sC(this.outputs,o,{training:!0});for(let n=0;n<this.lossFunctions.length;++n){var u,h;let s=(0,this.lossFunctions[n])(r[n],l[n]);null!=a[n]&&(u=s,h=a[n],s=(0,b.mul)(u,h));let i=n6.mean(s);t.push(i),e=0===n?s:P.add(e,s)}for(let e=0;e<this.metricsTensors.length;++e){let n;if(this.outputs.length>1&&e<this.outputs.length)n=t[e];else{let t=this.metricsTensors[e][0],a=this.metricsTensors[e][1];n=n6.mean(t(r[a],l[a]))}r$.keep(n),s.push(n)}return e=n6.mean(e),this.calculateLosses().forEach(t=>{e=P.add(e,t)}),e},o=this.collectedTrainableWeights.map(e=>e.read());return[this.optimizer_.minimize(i,!0,o)].concat(s)}}makeTestFunction(){this.testFunction=e=>r$.tidy(()=>{let t,n=[],r=e.slice(0,this.inputs.length),a=e.slice(this.inputs.length,this.inputs.length+this.outputs.length),s=[];for(let e=0;e<this.inputs.length;++e)s.push({key:this.inputs[e],value:r[e]});let i=new sv(s),o=sC(this.outputs,i);for(let e=0;e<this.lossFunctions.length;++e){let r=this.lossFunctions[e],s=n6.mean(r(a[e],o[e]));t=0===e?s:P.add(t,s),n.push(t)}for(let e=0;e<this.metricsTensors.length;++e){let t=this.metricsTensors[e][0],r=this.metricsTensors[e][1],s=n6.mean(t(a[r],o[r]));n.push(s)}return n})}async fit(e,t,n={}){let r,a,s,i,o,l,u,h,p;if(this.isTraining)throw Error("Cannot start training because another fit() call is ongoing.");this.isTraining=!0;try{let d,c,f,m=null==n.batchSize?32:n.batchSize;iW(m);let g=await this.standardizeUserData(e,t,n.sampleWeight,n.classWeight,!1,m);r=g[0],a=g[1],p=g[2];let x=!1;if(null!=n.validationData&&n.validationData.length>0){if(x=!0,2===n.validationData.length)o=n.validationData[0],l=n.validationData[1];else if(3===n.validationData.length)throw new rD("validationData including sample weights is not supported yet.");else throw new rF(`When passing validation data, it must contain 2 (valX, valY) or 3 (valX, valY, valSampleWeight) items; ${n.validationData} is invalid.`);let e=await this.standardizeUserData(o,l,null,null,!0,m);u=e[0],h=e[1],d=u.concat(h)}else if(null!=n.validationSplit&&n.validationSplit>0&&n.validationSplit<1){x=!0;let e=Math.floor(r[0].shape[0]*(1-n.validationSplit)),t=r[0].shape[0];u=iG(r,e,t),s=r,r=iG(r,0,e),h=iG(a,e,t),i=a,a=iG(a,0,e),d=u.concat(h)}else null!=n.validationSteps&&(x=!0);let y=r.concat(a).concat(p);this.checkTrainableWeightsConsistency();let b=this.makeTrainFunction(),v=this.getDedupedMetricsNames();x?(this.makeTestFunction(),c=this.testFunction,f=v.slice().concat(v.map(e=>"val_"+e))):(c=null,d=[],f=v.slice());let w=s7(n.callbacks,n.yieldEvery);return await this.fitLoop(b,y,v,m,n.epochs,n.verbose,w,c,d,n.shuffle,f,n.initialEpoch,null,null)}finally{this.isTraining=!1,iq(r,e),iq(a,t),iq(s,e),iq(i,t),iq(u,o),iq(h,l),null!=p&&r$.dispose(p)}}async fitLoop(e,t,n,r,a,s,i,o,l,u,h,p,d,c){let f;null==r&&(r=32),null==a&&(a=1),null==u&&(u=!0),null==p&&(p=0);let m=!1;if(null!=o&&null!=l&&(m=!0),null!=c&&(m=!0,null==d))throw new rF("Can only use `validationSteps` when doing step-wise training, i.e., `stepsPerEpoch` must be set.");let g=this.checkNumSamples(t,r,d,"steps_per_epoch");null!=g&&(f=aT(0,g)),null==s&&(s=1);let{callbackList:x,history:y}=it(i,s,a,p,g,d,r,m,h);x.setModel(this),this.history=y,await x.onTrainBegin(),this.stopTraining_=!1;for(let s=p;s<a;++s){await x.onEpochBegin(s);let a={};if(null!=d)throw new rD("stepsPerEpoch mode is not implemented yet.");{if("batch"===u)throw new rD("batch shuffling is not implemneted yet");u&&rR.util.shuffle(f);let s=(0,aI.tensor1d)(f),i=iV(g,r);for(let u=0;u<i.length;++u){let h={};if(await x.onBatchBegin(u,h),r$.tidy(()=>{let p=i[u][0],d=i[u][1],c=aE(s,p,d-p);h.batch=u,h.size=d-p;let f=e(iU(t,c));for(let e=0;e<n.length;++e){let t=n[e],r=f[e];h[t]=r,r$.keep(r)}if(u===i.length-1&&m){let e=this.testLoop(o,l,r);for(let t=0;t<n.length;++t){let r=n[t],s=e[t];r$.keep(s),a["val_"+r]=s}}}),await x.onBatchEnd(u,h),s3(h),this.stopTraining_)break}s.dispose()}if(await x.onEpochEnd(s,a),this.stopTraining_)break}return await x.onTrainEnd(),await this.history.syncData(),this.history}async fitDataset(e,t){return iM(this,e,t)}async trainOnBatch(e,t){let n=await this.standardizeUserData(e,t),r=n[0],a=n[1],s=this.makeTrainFunction()(r.concat(a)),i=[];for(let e of s){let t=await e.data();i.push(t[0])}return r$.dispose(s),iq(n[0],e),iq(n[1],t),rP(i)}getNamedWeights(e){let t=[],n=null!=e&&e.trainableOnly,r=n?this.trainableWeights:this.weights,a=this.getWeights(n);for(let e=0;e<r.length;++e)(!n||r[e].trainable)&&t.push({name:r[e].originalName,tensor:a[e]});return t}set stopTraining(e){this.stopTraining_=e}get stopTraining(){return this.stopTraining_}get optimizer(){return this.optimizer_}set optimizer(e){this.optimizer_!==e&&(this.optimizer_=e,this.isOptimizerOwned=!1)}dispose(){let e=super.dispose();if(0===e.refCountAfterDispose&&null!=this.optimizer&&this.isOptimizerOwned){let t=r$.memory().numTensors;this.optimizer_.dispose(),e.numDisposedVariables+=t-r$.memory().numTensors}return e}getLossIdentifiers(){let e;if("string"==typeof this.loss)e=rW(this.loss);else if(Array.isArray(this.loss)){for(let e of this.loss)if("string"!=typeof e)throw Error("Serialization of non-string loss is not supported.");e=this.loss.map(e=>rW(e))}else{let t=Object.keys(this.loss);e={};let n=this.loss;for(let r of t)if("string"==typeof n[r])e[r]=rW(n[r]);else throw Error("Serialization of non-string loss is not supported.")}return e}getMetricIdentifiers(){if("string"==typeof this.metrics||"function"==typeof this.metrics)return[rW(iS(this.metrics))];{if(Array.isArray(this.metrics))return this.metrics.map(e=>rW(iS(e)));let e={};for(let t in this.metrics)e[t]=rW(iS(this.metrics[t]));return e}}getTrainingConfig(){return{loss:this.getLossIdentifiers(),metrics:this.getMetricIdentifiers(),optimizer_config:{class_name:this.optimizer.getClassName(),config:this.optimizer.getConfig()}}}loadTrainingConfig(e){let t,n;if(null!=e.weighted_metrics)throw Error("Loading weight_metrics is not supported yet.");if(null!=e.loss_weights)throw Error("Loading loss_weights is not supported yet.");if(null!=e.sample_weight_mode)throw Error("Loading sample_weight_mode is not supported yet.");let r=is(iA(e.optimizer_config));if("string"==typeof e.loss)t=rG(e.loss);else if(Array.isArray(e.loss))t=e.loss.map(e=>rG(e));else if(null!=e.loss)for(let n in t={},e.loss)t[n]=rG(e.loss[n]);if(Array.isArray(e.metrics))n=e.metrics.map(e=>rG(e));else if(null!=e.metrics)for(let t in n={},e.metrics)n[t]=rG(e.metrics[t]);this.compile({loss:t,metrics:n,optimizer:r})}async save(e,t){if("string"==typeof e){let t=ir.io.getSaveHandlers(e);if(0===t.length)throw new rF(`Cannot find any save handlers for URL '${e}'`);if(t.length>1)throw new rF(`Found more than one (${t.length}) save handlers for URL '${e}'`);e=t[0]}if(null==e.save)throw new rF("LayersModel.save() cannot proceed because the IOHandler provided does not have the `save` attribute defined.");let n=await ir.io.encodeWeights(this.getNamedWeights(t)),r={modelTopology:this.toJSON(null,!1),format:"layers-model",generatedBy:`TensorFlow.js tfjs-layers v${iE}`,convertedBy:null};if(null!=t&&t.includeOptimizer&&null!=this.optimizer){r.trainingConfig=this.getTrainingConfig();let{data:e,specs:t}=await ir.io.encodeWeights(await this.optimizer.getWeights(),"optimizer");n.specs.push(...t),n.data=ir.io.concatenateArrayBuffers([n.data,e])}return null!=this.userDefinedMetadata&&(iN(this.userDefinedMetadata,this.name,!0),r.userDefinedMetadata=this.userDefinedMetadata),r.weightData=n.data,r.weightSpecs=n.specs,e.save(r)}setUserDefinedMetadata(e){iN(e,this.name),this.userDefinedMetadata=e}getUserDefinedMetadata(){return this.userDefinedMetadata}}iZ.className="Model",rJ.registerClass(iZ);class iJ extends iZ{}iJ.className="Functional",rJ.registerClass(iJ);var rJ=rJ;async function iQ(e,t){"modelTopology"in e||(e={modelTopology:e});let n=e.modelTopology;null!=n.model_config&&(n=n.model_config);let r=is(iA(n),t);if(null!=e.weightsManifest){let t=await ir.io.loadWeights(e.weightsManifest,e.pathPrefix,r.weights.map(e=>e.originalName)),n={};for(let e of r.weights)n[e.originalName]=t[e.originalName];r.loadWeights(n),(0,r$.dispose)(t)}return r}async function i0(e,t){if(null==t&&(t={}),"string"==typeof e){let n=ir.io.getLoadHandlers(e,t);if(0===n.length)n.push(ir.io.browserHTTPRequest(e,t));else if(n.length>1)throw new rF(`Found more than one (${n.length}) load handlers for URL '${e}'`);e=n[0]}return i1(e,void 0,t)}async function i1(e,t,n){if(null==n&&(n={}),null==e.load)throw new rF("Cannot proceed with model loading because the IOHandler provided does not have the `load` method implemented.");let r=await e.load(),a=r.modelTopology;null!=a.model_config&&(a=a.model_config);let s=null==n.strict||n.strict,i=null!=r.weightData&&null!=r.weightSpecs&&s,o=is(iA(a),t,i),l=r.trainingConfig;if(null!=l&&o.loadTrainingConfig(l),null!=r.userDefinedMetadata&&o.setUserDefinedMetadata(r.userDefinedMetadata),null!=r.weightData){var u,h;let e,t,n;if(null==r.weightSpecs)throw new rF("LayersModel artifacts contains weight data, but not weight specs. Therefore loading of weights cannot proceed.");let{modelWeights:a,optimizerWeights:i}=(u=r.weightData,h=r.weightSpecs,e=ir.io.decodeWeights(u,h),t={},n=[],h.forEach(r=>{"optimizer"===r.group?n.push({name:r.name,tensor:e[r.name]}):t[r.name]=e[r.name]}),{modelWeights:t,optimizerWeights:n});o.loadWeights(a,s),null!=o.optimizer&&i.length>0&&await o.optimizer.setWeights(i),(0,r$.dispose)(a),(0,r$.dispose)(i.map(e=>e.tensor))}return o}class i2 extends iZ{constructor(e){if(super({inputs:[],outputs:[]}),e=e||{},this.trainable=!0,this.built=!1,this.name=null!=e.name?e.name:r1("sequential_"),null!=e.layers)for(const t of e.layers)this.add(t)}checkShape(e){if(e.inboundNodes[0].outputTensors[0].shape.some(e=>e<0))throw new rF(`Negative dimension size caused by adding layer ${e.name} with input shape [${e.inboundNodes[0].inputTensors[0].shape}]`)}add(e){let t,n=e instanceof i2||e instanceof iZ;if(n){if(1!==(t=e).outputs.length)throw new rF("All layers in a Sequential model should have a single output tensor. For multi-output layers, use the functional API.");if(1!==t.inputs.length)throw new rF("All layers in a Sequential model should have a single input tensor. For multi-input layers, use the functional API.")}if(0===this.outputs.length){if(0===e.inboundNodes.length){if(null==e.batchInputShape)throw new rF("The first layer in a Sequential model must get an `inputShape` or `batchInputShape` argument.");let t=sb({batchShape:e.batchInputShape,dtype:e.dtype,name:e.name+"_input"});e.apply(t)}if(n)this.outputs=t.outputs,this.inputs=t.inputs;else{if(1!==e.inboundNodes.length)throw new rF(`A layer added to a Sequential model must not already be connected somewhere else. LayersModel received layer ${e.name} which has ${e.inboundNodes.length} pre-existing inbound connections.`);if(1!==e.inboundNodes[0].outputTensors.length)throw new rF("All layers in a Sequential model should have a single output tensor. For multi-output layers, use the functional API.");this.checkShape(e),this.outputs=[e.inboundNodes[0].outputTensors[0]],this.inputs=function e(t,n,r){if((null==n||null!=r&&r>0)&&(n=t.sourceLayer,r=t.nodeIndex),0===n.inboundNodes.length)return[t];{let t=n.inboundNodes[r];if(0===t.inboundLayers.length)return t.inputTensors;{let n=[];for(let r=0;r<t.inboundLayers.length;r++)for(let a of e(t.inputTensors[r],t.inboundLayers[r],t.nodeIndices[r]))-1===n.indexOf(a)&&n.push(a);return n}}}(this.outputs[0])}this.inboundNodes=[],new sm({outboundLayer:this,inboundLayers:[],nodeIndices:[],tensorIndices:[],inputTensors:this.inputs,outputTensors:this.outputs,inputMasks:rz(null,this.inputs.length),outputMasks:[null],inputShapes:this.inputs.map(e=>e.shape),outputShapes:this.outputs[0].shape})}else{let t=e.apply(this.outputs[0]);if(Array.isArray(t))throw TypeError("All layers in a Sequential model should have a single output tensor. For multi-output layers, use the functional API.");this.checkShape(e),this.outputs=[t],this.inboundNodes[0].outputTensors=this.outputs,this.inboundNodes[0].outputShapes=[this.outputs[0].shape]}this.layers.push(e),this.built=!1}pop(){if(0===this.layers.length)throw TypeError("There are no layers in the model.");if(this.layers.pop(),0===this.layers.length)this.outputs=[],this.inboundNodes=[],this.outboundNodes=[];else{let e=this.layers.length-1;this.layers[e].outboundNodes=[],this.outputs=[this.layers[e].output],this.inboundNodes[0].outputTensors=this.outputs,this.inboundNodes[0].outputShapes=[this.outputs[0].shape]}}call(e,t){return null==this.model&&this.build(),this.model.call(e,t)}build(e){if(ss(e),0===this.inputs.length||0===this.outputs.length)throw TypeError("Sequential model cannot be built: model is empty. Add some layers first.");this.model=new iZ({inputs:this.inputs,outputs:this.outputs[0],name:this.name+"_model"}),this.model.trainable=this.trainable,this.supportsMasking=this.model.supportsMasking,this.inputLayers=this.model.inputLayers,this.inputLayersNodeIndices=this.model.inputLayersNodeIndices,this.inputLayersTensorIndices=this.model.inputLayersTensorIndices,this.outputLayers=this.model.outputLayers,this.outputLayersNodeIndices=this.model.outputLayersNodeIndices,this.outputLayersTensorIndices=this.model.outputLayersTensorIndices,this.nodesByDepth=this.model.nodesByDepth,this.containerNodes=this.model.containerNodes,this.outputNames=this.model.outputNames,this.inputNames=this.model.inputNames,this.built=!0}countParams(){return this.built||this.build(),super.countParams()}summary(e,t,n=console.log){this.built||this.build(),super.summary(e,t,n)}setWeights(e){null==this.model&&this.build(),this.model.setWeights(e)}evaluate(e,t,n={}){if(!this.built)throw new rE("The model needs to be compiled before being used.");return this.model.evaluate(e,t,n)}async evaluateDataset(e,t){if(!this.built)throw new rE("The model needs to be compiled before being used.");return this.model.evaluateDataset(e,t)}predict(e,t={}){return null==this.model&&this.build(),this.model.predict(e,t)}predictOnBatch(e){return null==this.model&&this.build(),this.model.predictOnBatch(e)}compile(e){this.build(),this.model.compile(e),this.optimizer_=this.model.optimizer,this.isOptimizerOwned=this.model.isOptimizerOwned,this.loss=this.model.loss,this.metrics=this.model.metrics,this.metricsTensors=this.model.metricsTensors,this.metricsNames=this.model.metricsNames}get optimizer(){return null==this.model?void 0:this.model.optimizer}set optimizer(e){this.model.optimizer=e}async fit(e,t,n={}){if(!this.built)throw new rE("The model needs to be compiled before being used.");return this.model.fit(e,t,n)}async fitDataset(e,t){if(!this.built)throw new rE("The model needs to be compiled before being used.");return this.model.fitDataset(e,t)}async trainOnBatch(e,t){return this.model.trainOnBatch(e,t)}static fromConfig(e,t,n={},r=!1){let a,s={};if(t instanceof Array){if(null==t[0].className||"Merge"===t[0].className)throw new rF("Legacy serialization format not supported yet.");a=t}else rR.util.assert(null!=t.layers,()=>"When the config data for a Sequential model is not an Array, it must be an Object that contains the 'layers' field."),a=t.layers,delete t.layers,s=t;let i=new e(s);if(!(i instanceof i2))throw new rD(`Sequential.fromConfig called on non-Sequential input: ${i}`);for(let e of a){let t=is(e,void 0,r);r&&t.setFastWeightInitDuringBuild(!0),i.add(t)}return i}set stopTraining(e){if(null==this.model)throw new rF("Cannot set the stopTraining property of a sequential model before it is compiled.");this.model.stopTraining=e}get stopTraining(){if(null==this.model)throw new rF("Cannot get the stopTraining property of a sequential model before it is compiled.");return this.model.stopTraining}getConfig(){let e=[];for(let t of this.layers){let n={};n.className=t.getClassName(),n.config=t.getConfig(),e.push(n)}return{name:this.name,layers:e}}}function i3(e){return new iZ(e)}function i4(e){return new i2(e)}function i5(e){return sb(e)}function i6(e,t){ie.registerCallbackConstructor(e,t)}i2.className="Sequential",rJ.registerClass(i2);var rJ=rJ,rJ=rJ;class i8 extends rJ.Serializable{getConfig(){return{}}}class i9 extends i8{apply(e,t=1){return function(e,t=1){if(1!==t)throw new rD(`Support for alpha values other than 1 (${t}) is not implemented yet.`);return nP.elu(e)}(e,t)}}i9.className="elu",rJ.registerClass(i9);class i7 extends i8{apply(e){return rm.selu(e)}}i7.className="selu",rJ.registerClass(i7);class oe extends i8{apply(e){return ru.relu(e)}}oe.className="relu",rJ.registerClass(oe);class ot extends i8{apply(e){return(0,r$.tidy)(()=>n9.minimum(6,ru.relu(e)))}}ot.className="relu6",rJ.registerClass(ot);class on extends i8{apply(e){return e}}on.className="linear",rJ.registerClass(on);class or extends i8{apply(e){return t1.sigmoid(e)}}or.className="sigmoid",rJ.registerClass(or);class oa extends i8{apply(e){return(0,r$.tidy)(()=>{let t=P.add(.5,b.mul(.2,e));return nE.clipByValue(t,0,1)})}}oa.className="hardSigmoid",rJ.registerClass(oa);class os extends i8{apply(e){return rb.softplus(e)}}os.className="softplus",rJ.registerClass(os);class oi extends i8{apply(e){return(0,r$.tidy)(()=>I.div(e,P.add(nf.abs(e),1)))}}oi.className="softsign",rJ.registerClass(oi);class oo extends i8{apply(e){return rk.tanh(e)}}oo.className="tanh",rJ.registerClass(oo);class ol extends i8{apply(e,t=-1){return ry.softmax(e,t)}}ol.className="softmax",rJ.registerClass(ol);class ou extends i8{apply(e,t=-1){return nQ.logSoftmax(e,t)}}ou.className="logSoftmax",rJ.registerClass(ou);class oh extends i8{apply(e){return(0,r$.tidy)(()=>r$.tidy(()=>{let t=Math.sqrt(2),n=b.mul(.5,P.add(1,nB.erf(I.div(e,t))));return b.mul(e,n)}))}}oh.className="gelu",rJ.registerClass(oh);class op extends i8{apply(e){return(0,r$.tidy)(()=>b.mul(.5,b.mul(e,P.add(1,rk.tanh(b.mul(S.sqrt(I.div(2,Math.PI)),P.add(e,b.mul(.044715,tk.pow(e,3)))))))))}}op.className="gelu_new",rJ.registerClass(op);class od extends i8{apply(e){return(0,r$.tidy)(()=>b.mul(e,rk.tanh(rb.softplus(e))))}}od.className="mish",rJ.registerClass(od);class oc extends i8{apply(e,t=1){return(0,r$.tidy)(()=>b.mul(t1.sigmoid(b.mul(e,t)),e))}}function of(e){return e.getClassName()}function om(e,t={}){return rH(e,rJ.SerializationMap.getMap().classNameMap,t,"activation")}function og(e){if(null==e){let e={};return e.className="linear",e.config={},om(e)}if("string"==typeof e){let t={};return t.className=e,t.config={},om(t)}return e instanceof i8?e:om(e)}oc.className="swish",rJ.registerClass(oc);var rJ=rJ;function ox(e){if(null!=e&&"object"!=typeof e)throw Error(`Argument to L1L2 regularizer's constructor is expected to be an object, but received: ${e}`)}class oy extends rJ.Serializable{}class ob extends oy{constructor(e){super(),ox(e),this.l1=null==e||null==e.l1?.01:e.l1,this.l2=null==e||null==e.l2?.01:e.l2,this.hasL1=0!==this.l1,this.hasL2=0!==this.l2}apply(e){return(0,r$.tidy)(()=>{let t=(0,tx.zeros)([1]);return this.hasL1&&(t=(0,P.add)(t,(0,F.sum)(b.mul(this.l1,(0,nf.abs)(e))))),this.hasL2&&(t=(0,P.add)(t,(0,F.sum)(b.mul(this.l2,aB(e))))),E.reshape(t,[])})}getConfig(){return{l1:this.l1,l2:this.l2}}static fromConfig(e,t){return new e({l1:t.l1,l2:t.l2})}}ob.className="L1L2",rJ.registerClass(ob);let ov={l1l2:"L1L2"};function ow(e,t={}){return rH(e,rJ.SerializationMap.getMap().classNameMap,t,"regularizer")}function oI(e){return null==e?null:"string"==typeof e?ow({className:e in ov?ov[e]:e,config:{}}):e instanceof oy?e:ow(e)}class oC extends sx{constructor(e){super(null==e?{}:e),this.supportsMasking=!0,null!=e&&(this.maxValue=e.maxValue)}call(e,t){e=sa(e);let n=(0,ru.relu)(e);return null!=this.maxValue&&(n=(0,nE.clipByValue)(n,0,this.maxValue)),n}computeOutputShape(e){return e}getConfig(){let e={maxValue:this.maxValue};return Object.assign(e,super.getConfig()),e}}oC.className="ReLU",rJ.registerClass(oC);class ok extends sx{constructor(e){super(null==e?{}:e),this.DEFAULT_ALPHA=.3,null==e&&(e={}),this.alpha=null==e.alpha?this.DEFAULT_ALPHA:e.alpha}call(e,t){let n=sa(e);return(0,nY.leakyRelu)(n,this.alpha)}computeOutputShape(e){return e}getConfig(){let e={alpha:this.alpha};return Object.assign(e,super.getConfig()),e}}ok.className="LeakyReLU",rJ.registerClass(ok);class oS extends sx{constructor(e){if(super(null==e?{}:e),this.DEFAULT_ALPHA_INITIALIZER="zeros",null==e&&(e={}),this.supportsMasking=!0,this.alphaInitializer=st(e.alphaInitializer||this.DEFAULT_ALPHA_INITIALIZER),this.alphaRegularizer=oI(e.alphaRegularizer),this.alphaConstraint=sD(e.alphaConstraint),null==e.sharedAxes)this.sharedAxes=null;else if(Array.isArray(e.sharedAxes))this.sharedAxes=e.sharedAxes;else if("number"==typeof e.sharedAxes)this.sharedAxes=[e.sharedAxes];else throw new rF(`Expected sharedAxes to be a number or an array of numbers, but got ${e.sharedAxes}`)}build(e){let t=(e=ss(e)).slice(1);if(null!=this.sharedAxes)for(let e of this.sharedAxes)t[e-1]=1;this.alpha=this.addWeight("alpha",t,"float32",this.alphaInitializer,this.alphaRegularizer,!0,this.alphaConstraint);let n={};if(null!=this.sharedAxes)for(let t=1;t<e.length;++t)n[t]=e[t];this.inputSpec=[new sd({ndim:e.length,axes:n})],this.built=!0}call(e,t){return e=sa(e),(0,ri.prelu)(e,this.alpha.read())}getConfig(){let e={alphaInitializer:rV(this.alphaInitializer),alphaRegularizer:rV(this.alphaRegularizer),alphaConstraint:rV(this.alphaConstraint),sharedAxes:this.sharedAxes};return Object.assign(e,super.getConfig()),e}}oS.className="PReLU",rJ.registerClass(oS);class oT extends sx{constructor(e){if(super(null==e?{}:e),this.DEFAULT_ALPHA=1,null==e&&(e={}),null!=e.alpha&&e.alpha!==this.DEFAULT_ALPHA)throw new rD(`Non-default alpha value (${e.alpha}) is not supported by the ELU layer yet.`);this.alpha=null==e.alpha?this.DEFAULT_ALPHA:e.alpha}call(e,t){let n=sa(e);return(0,nP.elu)(n)}computeOutputShape(e){return e}getConfig(){let e={alpha:this.alpha};return Object.assign(e,super.getConfig()),e}}oT.className="ELU",rJ.registerClass(oT);class oN extends sx{constructor(e){super(null==e?{}:e),this.DEFAULT_THETA=1,null==e&&(e={}),this.theta=null==e.theta?this.DEFAULT_THETA:e.theta}call(e,t){let n=sa(e);return(0,b.mul)(n,(0,y.cast)((0,e1.greater)(n,this.theta),"float32"))}computeOutputShape(e){return e}getConfig(){let e={theta:this.theta};return Object.assign(e,super.getConfig()),e}}oN.className="ThresholdedReLU",rJ.registerClass(oN);class o$ extends sx{constructor(e){super(null==e?{}:e),this.DEFAULT_AXIS=1,null==e&&(e={}),this.softmax=new ol().apply,this.axis=null==e.axis?this.DEFAULT_AXIS:e.axis}call(e,t){return(0,r$.tidy)(()=>{let n=sa(e),r=t.mask;if(null!=r){let e=(0,b.mul)((0,N.sub)((0,to.ones)(n.shape),(0,y.cast)(r,n.dtype)),(0,k.scalar)(-1e9));n=(0,P.add)(n,e)}if(this.axis instanceof Array)if(this.axis.length>1)return(0,eL.exp)((0,N.sub)(n,(0,n0.logSumExp)(n,this.axis,!0)));else return this.softmax(n,this.axis[0]);return this.softmax(n,this.axis)})}computeOutputShape(e){return e}getConfig(){let e={axis:this.axis};return Object.assign(e,super.getConfig()),e}}o$.className="Softmax",rJ.registerClass(o$);var oR=e.i(385846),av=av,oA=e.i(127063),rJ=rJ;function oE(e,t,n){if("number"==typeof e)return rz(e,t);if(e.length!==t)throw new rF(`The ${n} argument must be an integer or tuple of ${t} integers. Received: ${e.length} elements.`);for(let r=0;r<t;++r){let a=e[r];if(a!==parseInt(a.toString(),10))throw new rF(`The ${n} argument must be an integer or tuple of ${t} integers. Received: ${JSON.stringify(e)} including a non-integer number ${a}`)}return e}function oF(e,t,n,r,a=1){return null==e?e:Math.floor((("same"===n?e:e-(t+(t-1)*(a-1))+1)+r-1)/r)}function oD(e,t,n,r){if(null==e)return null;if("valid"===r)e=e*t+aS([n-t,0]);else if("same"===r)e*=t;else throw new rF(`Unsupport padding mode: ${r}.`);return e}function oO(e,t){return(0,r$.tidy)(()=>(r9(t),"channelsFirst"===t)?e$.transpose(e,[0,2,3,1]):e)}function oL(e,t){return(0,r$.tidy)(()=>(r9(t),"channelsFirst"===t)?e$.transpose(e,[0,2,3,4,1]):e)}function oz(e,t,n,r=[1,1],a="valid",s,i,o=null){return(0,r$.tidy)(()=>{if(null==s&&(s=a$()),r9(s),3!==e.rank&&4!==e.rank)throw new rF(`conv2dWithBiasActivation expects input to be of rank 3 or 4, but received ${e.rank}.`);if(3!==t.rank&&4!==t.rank)throw new rF(`conv2dWithBiasActivation expects kernel to be of rank 3 or 4, but received ${e.rank}.`);let l=oO(e,s);if("causal"===a)throw new rD("The support for CAUSAL padding mode in conv1dWithBias is not implemented yet.");return l=av.conv2d({x:l,filter:t,strides:r,pad:"same"===a?"same":"valid",dilations:i,dataFormat:"NHWC",bias:n,activation:o}),"channelsFirst"===s&&(l=e$.transpose(l,[0,3,1,2])),l})}class o_ extends sx{constructor(e,t){if(super(t),this.bias=null,this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_BIAS_INITIALIZER="zeros",o_.verifyArgs(t),this.rank=e,rY(this.rank,"rank"),1!==this.rank&&2!==this.rank&&3!==this.rank)throw new rD(`Convolution layer for rank other than 1, 2, or 3 (${this.rank}) is not implemented yet.`);if(this.kernelSize=oE(t.kernelSize,e,"kernelSize"),this.strides=oE(null==t.strides?1:t.strides,e,"strides"),this.padding=null==t.padding?"valid":t.padding,r7(this.padding),this.dataFormat=null==t.dataFormat?"channelsLast":t.dataFormat,r9(this.dataFormat),this.activation=og(t.activation),this.useBias=null==t.useBias||t.useBias,this.biasInitializer=st(t.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.biasConstraint=sD(t.biasConstraint),this.biasRegularizer=oI(t.biasRegularizer),this.activityRegularizer=oI(t.activityRegularizer),this.dilationRate=oE(null==t.dilationRate?1:t.dilationRate,e,"dilationRate"),1===this.rank&&Array.isArray(this.dilationRate)&&1!==this.dilationRate.length)throw new rF(`dilationRate must be a number or an array of a single number for 1D convolution, but received ${JSON.stringify(this.dilationRate)}`);if(2===this.rank){if("number"==typeof this.dilationRate)this.dilationRate=[this.dilationRate,this.dilationRate];else if(2!==this.dilationRate.length)throw new rF(`dilationRate must be a number or array of two numbers for 2D convolution, but received ${JSON.stringify(this.dilationRate)}`)}else if(3===this.rank){if("number"==typeof this.dilationRate)this.dilationRate=[this.dilationRate,this.dilationRate,this.dilationRate];else if(3!==this.dilationRate.length)throw new rF(`dilationRate must be a number or array of three numbers for 3D convolution, but received ${JSON.stringify(this.dilationRate)}`)}}static verifyArgs(e){if(r_("kernelSize"in e,"required key 'kernelSize' not in config"),"number"!=typeof e.kernelSize&&!rK(e.kernelSize,"number",1,3))throw new rF(`BaseConv expects config.kernelSize to be number or number[] with length 1, 2, or 3, but received ${JSON.stringify(e.kernelSize)}.`)}getConfig(){let e={kernelSize:this.kernelSize,strides:this.strides,padding:this.padding,dataFormat:this.dataFormat,dilationRate:this.dilationRate,activation:of(this.activation),useBias:this.useBias,biasInitializer:rV(this.biasInitializer),biasRegularizer:rV(this.biasRegularizer),activityRegularizer:rV(this.activityRegularizer),biasConstraint:rV(this.biasConstraint)};return Object.assign(e,super.getConfig()),e}}class oM extends o_{constructor(e,t){super(e,t),this.kernel=null,oM.verifyArgs(t),this.filters=t.filters,rY(this.filters,"filters"),this.kernelInitializer=st(t.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.kernelConstraint=sD(t.kernelConstraint),this.kernelRegularizer=oI(t.kernelRegularizer)}build(e){e=ss(e);let t="channelsFirst"===this.dataFormat?1:e.length-1;if(null==e[t])throw new rF(`The channel dimension of the input should be defined. Found ${e[t]}`);let n=e[t],r=this.kernelSize.concat([n,this.filters]);this.kernel=this.addWeight("kernel",r,null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[{ndim:this.rank+2,axes:{[t]:n}}],this.built=!0}call(e,t){return(0,r$.tidy)(()=>{let t;e=sa(e);let n=null==this.bias?null:this.bias.read(),r=rZ(this.activation.getClassName());if(null!=r&&2===this.rank)t=oz(e,this.kernel.read(),n,this.strides,this.padding,this.dataFormat,this.dilationRate,r);else{if(1===this.rank)t=function(e,t,n,r=1,a="valid",s,i=1){return(0,r$.tidy)(()=>{if(null==s&&(s=a$()),r9(s),3!==e.shape.length)throw new rF(`The input of a conv1dWithBias operation should be 3, but is ${e.shape.length} instead.`);if(3!==t.shape.length)throw new rF(`The kernel for a conv1dWithBias operation should be 3, but is ${t.shape.length} instead`);if(null!=n&&1!==n.shape.length)throw new rF(`The bias for a conv1dWithBias operation should be 1, but is ${n.shape.length} instead`);if("channelsFirst"===s&&(e=e$.transpose(e,[0,2,1])),"causal"===a)throw new rD("The support for CAUSAL padding mode in conv1dWithBias is not implemented yet.");let o=nF.conv1d(e,t,r,"same"===a?"same":"valid","NWC",i);return null!=n&&(o=aG(o,n)),o})}(e,this.kernel.read(),n,this.strides[0],this.padding,this.dataFormat,this.dilationRate[0]);else if(2===this.rank)t=oz(e,this.kernel.read(),n,this.strides,this.padding,this.dataFormat,this.dilationRate);else if(3===this.rank)t=function(e,t,n,r=[1,1,1],a="valid",s,i){return(0,r$.tidy)(()=>{if(null==s&&(s=a$()),r9(s),4!==e.rank&&5!==e.rank)throw new rF(`conv3dWithBias expects input to be of rank 4 or 5, but received ${e.rank}.`);if(4!==t.rank&&5!==t.rank)throw new rF(`conv3dWithBias expects kernel to be of rank 4 or 5, but received ${e.rank}.`);let o=oL(e,s);if("causal"===a)throw new rD("The support for CAUSAL padding mode in conv3dWithBias is not implemented yet.");return o=oA.conv3d(o,t,r,"same"===a?"same":"valid","NDHWC",i),null!=n&&(o=aG(o,n)),"channelsFirst"===s&&(o=e$.transpose(o,[0,4,1,2,3])),o})}(e,this.kernel.read(),n,this.strides,this.padding,this.dataFormat,this.dilationRate);else throw new rD("convolutions greater than 3D are not implemented yet.");null!=this.activation&&(t=this.activation.apply(t))}return t})}computeOutputShape(e){e=ss(e);let t=[],n="channelsLast"===this.dataFormat?e.slice(1,e.length-1):e.slice(2);for(let e=0;e<n.length;++e){let r=oF(n[e],this.kernelSize[e],this.padding,this.strides[e],"number"==typeof this.dilationRate?this.dilationRate:this.dilationRate[e]);t.push(r)}let r=[e[0]];return"channelsLast"===this.dataFormat?(r=r.concat(t)).push(this.filters):(r.push(this.filters),r=r.concat(t)),r}getConfig(){let e={filters:this.filters,kernelInitializer:rV(this.kernelInitializer),kernelRegularizer:rV(this.kernelRegularizer),kernelConstraint:rV(this.kernelConstraint)};return Object.assign(e,super.getConfig()),e}static verifyArgs(e){if(!("filters"in e)||"number"!=typeof e.filters||e.filters<1)throw new rF(`Convolution layer expected config.filters to be a 'number' > 0 but got ${JSON.stringify(e.filters)}`)}}class oP extends oM{constructor(e){super(2,e),oP.verifyArgs(e)}getConfig(){let e=super.getConfig();return delete e.rank,e}static verifyArgs(e){if("number"!=typeof e.kernelSize&&!rK(e.kernelSize,"number",1,2))throw new rF(`Conv2D expects config.kernelSize to be number or number[] with length 1 or 2, but received ${JSON.stringify(e.kernelSize)}.`)}}oP.className="Conv2D",rJ.registerClass(oP);class oB extends oM{constructor(e){super(3,e),oB.verifyArgs(e)}getConfig(){let e=super.getConfig();return delete e.rank,e}static verifyArgs(e){if("number"!=typeof e.kernelSize&&!(Array.isArray(e.kernelSize)&&(1===e.kernelSize.length||3===e.kernelSize.length)))throw new rF(`Conv3D expects config.kernelSize to be number or [number, number, number], but received ${JSON.stringify(e.kernelSize)}.`)}}oB.className="Conv3D",rJ.registerClass(oB);class oW extends oP{constructor(e){if(super(e),this.inputSpec=[new sd({ndim:4})],"same"!==this.padding&&"valid"!==this.padding)throw new rF(`Conv2DTranspose currently supports only padding modes 'same' and 'valid', but received padding mode ${this.padding}`)}build(e){if(4!==(e=ss(e)).length)throw new rF("Input should have rank 4; Received input shape: "+JSON.stringify(e));let t="channelsFirst"===this.dataFormat?1:e.length-1;if(null==e[t])throw new rF("The channel dimension of the inputs should be defined. Found `None`.");let n=e[t],r=this.kernelSize.concat([this.filters,n]);this.kernel=this.addWeight("kernel",r,"float32",this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[new sd({ndim:4,axes:{[t]:n}})],this.built=!0}call(e,t){return r$.tidy(()=>{let t,n,r=sa(e);if(4!==r.shape.length)throw new rF(`Conv2DTranspose.call() expects input tensor to be rank-4, but received a tensor of rank-${r.shape.length}`);let a=r.shape,s=a[0];"channelsFirst"===this.dataFormat?(t=2,n=3):(t=1,n=2);let i=a[t],o=a[n],l=this.kernelSize[0],u=this.kernelSize[1],h=this.strides[0],p=this.strides[1],d=[s,oD(i,h,l,this.padding),oD(o,p,u,this.padding),this.filters];"channelsLast"!==this.dataFormat&&(r=e$.transpose(r,[0,2,3,1]));let c=nD.conv2dTranspose(r,this.kernel.read(),d,this.strides,this.padding);return"channelsLast"!==this.dataFormat&&(c=e$.transpose(c,[0,3,1,2])),null!=this.bias&&(c=aG(c,this.bias.read(),this.dataFormat)),null!=this.activation&&(c=this.activation.apply(c)),c})}computeOutputShape(e){let t,n,r,a=(e=ss(e)).slice();"channelsFirst"===this.dataFormat?(t=1,n=2,r=3):(t=3,n=1,r=2);let s=this.kernelSize[0],i=this.kernelSize[1],o=this.strides[0],l=this.strides[1];return a[t]=this.filters,a[n]=oD(a[n],o,s,this.padding),a[r]=oD(a[r],l,i,this.padding),a}getConfig(){let e=super.getConfig();return delete e.dilationRate,e}}oW.className="Conv2DTranspose",rJ.registerClass(oW);class oG extends oB{constructor(e){if(super(e),this.inputSpec=[new sd({ndim:5})],"same"!==this.padding&&"valid"!==this.padding)throw new rF(`Conv3DTranspose currently supports only padding modes 'same' and 'valid', but received padding mode ${this.padding}`)}build(e){if(5!==(e=ss(e)).length)throw new rF("Input should have rank 5; Received input shape: "+JSON.stringify(e));let t="channelsFirst"===this.dataFormat?1:e.length-1;if(null==e[t])throw new rF("The channel dimension of the inputs should be defined. Found `None`.");let n=e[t],r=this.kernelSize.concat([this.filters,n]);this.kernel=this.addWeight("kernel",r,"float32",this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint)),this.inputSpec=[new sd({ndim:5,axes:{[t]:n}})],this.built=!0}call(e,t){return r$.tidy(()=>{let t,n,r,a=sa(e);if(5!==a.shape.length)throw new rF(`Conv3DTranspose.call() expects input tensor to be rank-4, but received a tensor of rank-${a.shape.length}`);let s=a.shape,i=s[0];"channelsFirst"===this.dataFormat?(r=2,t=3,n=4):(r=1,t=2,n=3);let o=s[r],l=s[t],u=s[n],h=this.kernelSize[0],p=this.kernelSize[1],d=this.kernelSize[2],c=this.strides[0],f=this.strides[1],m=this.strides[2],g=[i,oD(o,c,h,this.padding),oD(l,f,p,this.padding),oD(u,m,d,this.padding),this.filters];"channelsLast"!==this.dataFormat&&(a=e$.transpose(a,[0,2,3,4,1]));let x=oR.conv3dTranspose(a,this.kernel.read(),g,this.strides,this.padding);return"channelsLast"!==this.dataFormat&&(x=e$.transpose(x,[0,4,1,2,3])),null!==this.bias&&(x=aG(x,this.bias.read(),this.dataFormat)),null!==this.activation&&(x=this.activation.apply(x)),x})}computeOutputShape(e){let t,n,r,a,s=(e=ss(e)).slice();"channelsFirst"===this.dataFormat?(t=1,n=2,r=3,a=4):(t=4,n=1,r=2,a=3);let i=this.kernelSize[0],o=this.kernelSize[1],l=this.kernelSize[2],u=this.strides[0],h=this.strides[1],p=this.strides[2];return s[t]=this.filters,s[n]=oD(s[n],u,i,this.padding),s[r]=oD(s[r],h,o,this.padding),s[a]=oD(s[a],p,l,this.padding),s}getConfig(){let e=super.getConfig();return delete e.dilationRate,e}}oG.className="Conv3DTranspose",rJ.registerClass(oG);class oU extends oM{constructor(e,t){if(super(e,t),this.DEFAULT_DEPTHWISE_INITIALIZER="glorotUniform",this.DEFAULT_POINTWISE_INITIALIZER="glorotUniform",this.depthwiseKernel=null,this.pointwiseKernel=null,null==t.filters)throw new rF("The `filters` configuration field is required by SeparableConv, but is unspecified.");if(null!=t.kernelInitializer||null!=t.kernelRegularizer||null!=t.kernelConstraint)throw new rF("Fields kernelInitializer, kernelRegularizer and kernelConstraint are invalid for SeparableConv2D. Use depthwiseInitializer, depthwiseRegularizer, depthwiseConstraint, pointwiseInitializer, pointwiseRegularizer and pointwiseConstraint instead.");if(null!=t.padding&&"same"!==t.padding&&"valid"!==t.padding)throw new rF(`SeparableConv${this.rank}D supports only padding modes: 'same' and 'valid', but received ${JSON.stringify(t.padding)}`);this.depthMultiplier=null==t.depthMultiplier?1:t.depthMultiplier,this.depthwiseInitializer=st(t.depthwiseInitializer||this.DEFAULT_DEPTHWISE_INITIALIZER),this.depthwiseRegularizer=oI(t.depthwiseRegularizer),this.depthwiseConstraint=sD(t.depthwiseConstraint),this.pointwiseInitializer=st(t.depthwiseInitializer||this.DEFAULT_POINTWISE_INITIALIZER),this.pointwiseRegularizer=oI(t.pointwiseRegularizer),this.pointwiseConstraint=sD(t.pointwiseConstraint)}build(e){if((e=ss(e)).length<this.rank+2)throw new rF(`Inputs to SeparableConv${this.rank}D should have rank ${this.rank+2}, but received input shape: ${JSON.stringify(e)}`);let t="channelsFirst"===this.dataFormat?1:e.length-1;if(null==e[t]||e[t]<0)throw new rF(`The channel dimension of the inputs should be defined, but found ${JSON.stringify(e[t])}`);let n=e[t],r=this.kernelSize.concat([n,this.depthMultiplier]),a=[];for(let e=0;e<this.rank;++e)a.push(1);a.push(n*this.depthMultiplier,this.filters),this.depthwiseKernel=this.addWeight("depthwise_kernel",r,"float32",this.depthwiseInitializer,this.depthwiseRegularizer,!0,this.depthwiseConstraint),this.pointwiseKernel=this.addWeight("pointwise_kernel",a,"float32",this.pointwiseInitializer,this.pointwiseRegularizer,!0,this.pointwiseConstraint),this.useBias?this.bias=this.addWeight("bias",[this.filters],"float32",this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint):this.bias=null,this.inputSpec=[new sd({ndim:this.rank+2,axes:{[t]:n}})],this.built=!0}call(e,t){return(0,r$.tidy)(()=>{let t;if(e=sa(e),1===this.rank)throw new rD("1D separable convolution is not implemented yet.");return 2===this.rank&&("channelsFirst"===this.dataFormat&&(e=e$.transpose(e,[0,2,3,1])),t=rg.separableConv2d(e,this.depthwiseKernel.read(),this.pointwiseKernel.read(),this.strides,this.padding,this.dilationRate,"NHWC")),this.useBias&&(t=aG(t,this.bias.read(),this.dataFormat)),null!=this.activation&&(t=this.activation.apply(t)),"channelsFirst"===this.dataFormat&&(t=e$.transpose(t,[0,3,1,2])),t})}getConfig(){let e=super.getConfig();return delete e.rank,delete e.kernelInitializer,delete e.kernelRegularizer,delete e.kernelConstraint,e.depthwiseInitializer=rV(this.depthwiseInitializer),e.pointwiseInitializer=rV(this.pointwiseInitializer),e.depthwiseRegularizer=rV(this.depthwiseRegularizer),e.pointwiseRegularizer=rV(this.pointwiseRegularizer),e.depthwiseConstraint=rV(this.depthwiseConstraint),e.pointwiseConstraint=rV(this.pointwiseConstraint),e}}oU.className="SeparableConv";class oV extends oU{constructor(e){super(2,e)}}oV.className="SeparableConv2D",rJ.registerClass(oV);class oH extends oM{constructor(e){super(1,e),oH.verifyArgs(e),this.inputSpec=[{ndim:3}]}getConfig(){let e=super.getConfig();return delete e.rank,delete e.dataFormat,e}static verifyArgs(e){if("number"!=typeof e.kernelSize&&!rK(e.kernelSize,"number",1,1))throw new rF(`Conv1D expects config.kernelSize to be number or number[] with length 1, but received ${JSON.stringify(e.kernelSize)}.`)}}oH.className="Conv1D",rJ.registerClass(oH);class oq extends sx{constructor(e){super(e),"number"==typeof e.cropping?this.cropping=[[e.cropping,e.cropping],[e.cropping,e.cropping]]:"number"==typeof e.cropping[0]?this.cropping=[[e.cropping[0],e.cropping[0]],[e.cropping[1],e.cropping[1]]]:this.cropping=e.cropping,this.dataFormat=void 0===e.dataFormat?"channelsLast":e.dataFormat,this.inputSpec=[{ndim:4}]}computeOutputShape(e){return"channelsFirst"===this.dataFormat?[e[0],e[1],e[2]-this.cropping[0][0]-this.cropping[0][1],e[3]-this.cropping[1][0]-this.cropping[1][1]]:[e[0],e[1]-this.cropping[0][0]-this.cropping[0][1],e[2]-this.cropping[1][0]-this.cropping[1][1],e[3]]}call(e,t){return(0,r$.tidy)(()=>{if(e=sa(e),"channelsLast"===this.dataFormat){let t=aD(e,this.cropping[0][0],e.shape[1]-this.cropping[0][0]-this.cropping[0][1],2);return aD(t,this.cropping[1][0],e.shape[2]-this.cropping[1][1]-this.cropping[1][0],3)}{let t=aD(e,this.cropping[0][0],e.shape[2]-this.cropping[0][0]-this.cropping[0][1],3);return aD(t,this.cropping[1][0],e.shape[3]-this.cropping[1][1]-this.cropping[1][0],4)}})}getConfig(){let e={cropping:this.cropping,dataFormat:this.dataFormat};return Object.assign(e,super.getConfig()),e}}oq.className="Cropping2D",rJ.registerClass(oq);class oj extends sx{constructor(e){super(e),this.DEFAULT_SIZE=[2,2],this.inputSpec=[{ndim:4}],this.size=null==e.size?this.DEFAULT_SIZE:e.size,this.dataFormat=null==e.dataFormat?"channelsLast":e.dataFormat,r9(this.dataFormat),this.interpolation=null==e.interpolation?"nearest":e.interpolation,rX(r3,"InterpolationFormat",this.interpolation)}computeOutputShape(e){if("channelsFirst"===this.dataFormat){let t=null==e[2]?null:this.size[0]*e[2],n=null==e[3]?null:this.size[1]*e[3];return[e[0],e[1],t,n]}{let t=null==e[1]?null:this.size[0]*e[1],n=null==e[2]?null:this.size[1]*e[2];return[e[0],t,n,e[3]]}}call(e,t){return r$.tidy(()=>{let t=sa(e),n=t.shape;if("channelsFirst"===this.dataFormat){t=e$.transpose(t,[0,2,3,1]);let e=this.size[0]*n[2],r=this.size[1]*n[3],a="nearest"===this.interpolation?al.image.resizeNearestNeighbor(t,[e,r]):al.image.resizeBilinear(t,[e,r]);return e$.transpose(a,[0,3,1,2])}{let e=this.size[0]*n[1],r=this.size[1]*n[2];return"nearest"===this.interpolation?al.image.resizeNearestNeighbor(t,[e,r]):al.image.resizeBilinear(t,[e,r])}})}getConfig(){let e={size:this.size,dataFormat:this.dataFormat,interpolation:this.interpolation};return Object.assign(e,super.getConfig()),e}}oj.className="UpSampling2D",rJ.registerClass(oj);var rJ=rJ;class oX extends o_{constructor(e){super(2,e),this.depthwiseKernel=null,this.depthMultiplier=null==e.depthMultiplier?1:e.depthMultiplier,this.depthwiseInitializer=st(e.depthwiseInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.depthwiseConstraint=sD(e.depthwiseConstraint),this.depthwiseRegularizer=oI(e.depthwiseRegularizer)}build(e){if((e=ss(e)).length<4)throw new rF(`Inputs to DepthwiseConv2D should have rank 4. Received input shape: ${JSON.stringify(e)}.`);let t="channelsFirst"===this.dataFormat?1:3;if(null==e[t]||e[t]<0)throw new rF(`The channel dimension of the inputs to DepthwiseConv2D should be defined, but is not (${e[t]}).`);let n=e[t],r=[this.kernelSize[0],this.kernelSize[1],n,this.depthMultiplier];this.depthwiseKernel=this.addWeight("depthwise_kernel",r,null,this.depthwiseInitializer,this.depthwiseRegularizer,!0,this.depthwiseConstraint),this.useBias?this.bias=this.addWeight("bias",[n*this.depthMultiplier],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint):this.bias=null,this.built=!0}call(e,t){return(0,r$.tidy)(()=>{let t=function(e,t,n=[1,1],r="valid",a,s){return(0,r$.tidy)(()=>{null==a&&(a=a$()),r9(a);let s=oO(e,a);if(4!==e.rank)throw new rF(`Input for depthwiseConv2d is required to be 4-D, but is instead ${e.rank}-D`);if(4!==t.rank)throw new rF(`depthwiseKernel is required to be 4-D, but is instead ${t.rank}-D`);return s=nL.depthwiseConv2d(s,t,n,"same"===r?"same":"valid","NHWC",null),"channelsFirst"===a&&(s=e$.transpose(s,[0,3,1,2])),s})}(e=sa(e),this.depthwiseKernel.read(),this.strides,this.padding,this.dataFormat,0);return this.useBias&&(t=aG(t,this.bias.read(),this.dataFormat)),null!=this.activation&&(t=this.activation.apply(t)),t})}computeOutputShape(e){e=ss(e);let t="channelsFirst"===this.dataFormat?e[2]:e[1],n="channelsFirst"===this.dataFormat?e[3]:e[2],r="channelsFirst"===this.dataFormat?e[1]*this.depthMultiplier:e[3]*this.depthMultiplier,a=oF(t,this.kernelSize[0],this.padding,this.strides[0]),s=oF(n,this.kernelSize[1],this.padding,this.strides[1]);return"channelsFirst"===this.dataFormat?[e[0],r,a,s]:[e[0],a,s,r]}getConfig(){let e=super.getConfig();return e.depthMultiplier=this.depthMultiplier,e.depthwiseInitializer=rV(this.depthwiseInitializer),e.depthwiseRegularizer=rV(this.depthwiseRegularizer),e.depthwiseConstraint=rV(this.depthwiseRegularizer),e}}oX.className="DepthwiseConv2D",rJ.registerClass(oX);var rJ=rJ,rJ=rJ;function oK(e,t,n,r){if(Array.isArray(e)){if(null!=t||null!=n)throw new rF("When inputs is an array, neither initialState or constants should be provided");null!=r&&(n=e.slice(e.length-r,e.length),e=e.slice(0,e.length-r)),e.length>1&&(t=e.slice(1,e.length)),e=e[0]}function a(e){return null==e||Array.isArray(e)?e:[e]}return{inputs:e,initialState:t=a(t),constants:n=a(n)}}function oY(e,t,n,r=!1,a,s,i=!1,o=!1){return r$.tidy(()=>{let l,u,h,p=t.shape.length;if(p<3)throw new rF(`Input should be at least 3D, but is ${p}D.`);let d=[1,0].concat(aT(2,p));if(t=e$.transpose(t,d),null!=s)throw new rD("The rnn() functoin of the deeplearn.js backend does not support constants yet.");i&&console.warn("Backend rnn(): the unroll = true option is not applicable to the imperative deeplearn.js backend."),null!=a&&((a=y.cast(y.cast(a,"bool"),"float32")).rank===p-1&&(a=nl.expandDims(a,-1)),a=e$.transpose(a,d)),r&&(t=t_.reverse(t,0),null!=a&&(a=t_.reverse(a,0)));let c=[],f=n,m=t.shape[0],g=tv.unstack(t);null!=a&&(u=tv.unstack(a));for(let t=0;t<m;++t){let n=g[t],r=r$.tidy(()=>e(n,f));if(null==a)l=r[0],f=r[1];else{let e=r$.tidy(()=>{let e=u[t],n=N.sub(ra.onesLike(e),e);return{output:P.add(b.mul(r[0],e),b.mul(f[0],n)),newStates:f.map((t,a)=>P.add(b.mul(r[1][a],e),b.mul(t,n)))}});l=e.output,f=e.newStates}o&&c.push(l)}return o&&(h=eH.stack(c,1)),[l,h,f]})}class oZ extends sx{constructor(e){let t;if(super(e),null==e.cell)throw new rF("cell property is missing for the constructor of RNN.");if(null==(t=Array.isArray(e.cell)?new o5({cells:e.cell}):e.cell).stateSize)throw new rF("The RNN cell should have an attribute `stateSize` (tuple of integers, one integer per RNN state).");this.cell=t,this.returnSequences=null!=e.returnSequences&&e.returnSequences,this.returnState=null!=e.returnState&&e.returnState,this.goBackwards=null!=e.goBackwards&&e.goBackwards,this._stateful=null!=e.stateful&&e.stateful,this.unroll=null!=e.unroll&&e.unroll,this.supportsMasking=!0,this.inputSpec=[new sd({ndim:3})],this.stateSpec=null,this.states_=null,this.numConstants=null,this.keptStates=[]}getStates(){return null==this.states_?aT(0,Array.isArray(this.cell.stateSize)?this.cell.stateSize.length:1).map(e=>null):this.states_}setStates(e){this.states_=e}computeOutputShape(e){let t;sn(e)&&(e=e[0]);let n=this.cell.stateSize;Array.isArray(n)||(n=[n]);let r=n[0];if(t=this.returnSequences?[e[0],e[1],r]:[e[0],r],!this.returnState)return t;{let r=[];for(let t of n)r.push([e[0],t]);return[t].concat(r)}}computeMask(e,t){return r$.tidy(()=>{Array.isArray(t)&&(t=t[0]);let e=this.returnSequences?t:null;return this.returnState?[e].concat(this.states.map(e=>null)):e})}get states(){if(null!=this.states_)return this.states_;{let e=Array.isArray(this.cell.stateSize)?this.cell.stateSize.length:1,t=[];for(let n=0;n<e;++n)t.push(null);return t}}set states(e){this.states_=e}build(e){let t;if(null!=this.numConstants)throw new rD("Constants support is not implemented in RNN yet.");sn(e)&&(e=e[0]);let n=this.stateful?e[0]:null,r=e.slice(2);this.inputSpec[0]=new sd({shape:[n,null,...r]});let a=[e[0]].concat(e.slice(2));if(this.cell.build(a),t=Array.isArray(this.cell.stateSize)?this.cell.stateSize:[this.cell.stateSize],null!=this.stateSpec){if(!rR.util.arraysEqual(this.stateSpec.map(e=>e.shape[e.shape.length-1]),t))throw new rF(`An initialState was passed that is not compatible with cell.stateSize. Received stateSpec=${this.stateSpec}; However cell.stateSize is ${this.cell.stateSize}`)}else this.stateSpec=t.map(e=>new sd({shape:[null,e]}));this.stateful&&this.resetStates()}resetStates(e,t=!1){(0,r$.tidy)(()=>{if(!this.stateful)throw new rA("Cannot call resetStates() on an RNN Layer that is not stateful.");let n=this.inputSpec[0].shape[0];if(null==n)throw new rF("If an RNN is stateful, it needs to know its batch size. Specify the batch size of your input tensors: \n- If using a Sequential model, specify the batch size by passing a `batchInputShape` option to your first layer.\n- If using the functional API, specify the batch size by passing a `batchShape` option to your Input layer.");if(null==this.states_)Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(e=>tx.zeros([n,e])):this.states_=[tx.zeros([n,this.cell.stateSize])];else if(null==e)r$.dispose(this.states_),null!=this.keptStates&&(r$.dispose(this.keptStates),this.keptStates=[]),Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(e=>tx.zeros([n,e])):this.states_[0]=tx.zeros([n,this.cell.stateSize]);else{if(Array.isArray(e)||(e=[e]),e.length!==this.states_.length)throw new rF(`Layer ${this.name} expects ${this.states_.length} state(s), but it received ${e.length} state value(s). Input received: ${e}`);!0===t?this.keptStates.push(this.states_.slice()):r$.dispose(this.states_);for(let t=0;t<this.states_.length;++t){let r=e[t],a=[n,Array.isArray(this.cell.stateSize)?this.cell.stateSize[t]:this.cell.stateSize];if(!rR.util.arraysEqual(r.shape,a))throw new rF(`State ${t} is incompatible with layer ${this.name}: expected shape=${a}, received shape=${r.shape}`);this.states_[t]=r}}this.states_=this.states_.map(e=>r$.keep(e.clone()))})}apply(e,t){let n=null==t?null:t.initialState,r=null==t?null:t.constants;null==t&&(t={});let a=oK(e,n,r,this.numConstants);e=a.inputs,n=a.initialState,r=a.constants;let s=[],i=[];if(null!=n){for(let e of(t.initialState=n,s=s.concat(n),this.stateSpec=[],n))this.stateSpec.push(new sd({shape:e.shape}));i=i.concat(this.stateSpec)}if(null!=r&&(t.constants=r,s=s.concat(r),this.numConstants=r.length),!(s[0]instanceof sc))return super.apply(e,t);{let n=[e].concat(s),r=this.inputSpec.concat(i),a=this.inputSpec;this.inputSpec=r;let o=super.apply(n,t);return this.inputSpec=a,o}}call(e,t){return(0,r$.tidy)(()=>{let n=null==t?null:t.mask,r=null==t?null:t.training,a=null==t?null:t.initialState;e=sa(e),null==a&&(a=this.stateful?this.states_:this.getInitialState(e));let s=Array.isArray(this.cell.stateSize)?this.cell.stateSize.length:1;if(a.length!==s)throw new rF(`RNN Layer has ${s} state(s) but was passed ${a.length} initial state(s).`);this.unroll&&console.warn("Ignoring unroll = true for RNN layer, due to imperative backend.");let i={training:r},o=oY((e,t)=>{let n=this.cell.call([e].concat(t),i);return[n[0],n.slice(1)]},e,a,this.goBackwards,n,null,this.unroll,this.returnSequences),l=o[0],u=o[1],h=o[2];this.stateful&&this.resetStates(h,r);let p=this.returnSequences?u:l;return this.returnState?[p].concat(h):p})}getInitialState(e){return(0,r$.tidy)(()=>{let t=tx.zeros(e.shape);return(t=aA(t=F.sum(t,[1,2])),Array.isArray(this.cell.stateSize))?this.cell.stateSize.map(e=>e>1?az(t,[1,e]):t):this.cell.stateSize>1?[az(t,[1,this.cell.stateSize])]:[t]})}get trainableWeights(){return this.trainable?this.cell.trainableWeights:[]}get nonTrainableWeights(){return this.trainable?this.cell.nonTrainableWeights:this.cell.weights}setFastWeightInitDuringBuild(e){super.setFastWeightInitDuringBuild(e),null!=this.cell&&this.cell.setFastWeightInitDuringBuild(e)}getConfig(){let e=super.getConfig(),t={returnSequences:this.returnSequences,returnState:this.returnState,goBackwards:this.goBackwards,stateful:this.stateful,unroll:this.unroll};null!=this.numConstants&&(t.numConstants=this.numConstants);let n=this.cell.getConfig();return this.getClassName()===oZ.className&&(t.cell={className:this.cell.getClassName(),config:n}),Object.assign(Object.assign(Object.assign({},n),e),t)}static fromConfig(e,t,n={}){let r=is(t.cell,n);return new e(Object.assign(t,{cell:r}))}}oZ.className="RNN",rJ.registerClass(oZ);class oJ extends sx{}class oQ extends oJ{constructor(e){super(e),this.DEFAULT_ACTIVATION="tanh",this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_RECURRENT_INITIALIZER="orthogonal",this.DEFAULT_BIAS_INITIALIZER="zeros",this.units=e.units,rY(this.units,"units"),this.activation=og(null==e.activation?this.DEFAULT_ACTIVATION:e.activation),this.useBias=null==e.useBias||e.useBias,this.kernelInitializer=st(e.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.recurrentInitializer=st(e.recurrentInitializer||this.DEFAULT_RECURRENT_INITIALIZER),this.biasInitializer=st(e.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.kernelRegularizer=oI(e.kernelRegularizer),this.recurrentRegularizer=oI(e.recurrentRegularizer),this.biasRegularizer=oI(e.biasRegularizer),this.kernelConstraint=sD(e.kernelConstraint),this.recurrentConstraint=sD(e.recurrentConstraint),this.biasConstraint=sD(e.biasConstraint),this.dropout=ak([1,aS([0,null==e.dropout?0:e.dropout])]),this.recurrentDropout=ak([1,aS([0,null==e.recurrentDropout?0:e.recurrentDropout])]),this.dropoutFunc=e.dropoutFunc,this.stateSize=this.units,this.dropoutMask=null,this.recurrentDropoutMask=null}build(e){e=ss(e),this.kernel=this.addWeight("kernel",[e[e.length-1],this.units],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.recurrentKernel=this.addWeight("recurrent_kernel",[this.units,this.units],null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint),this.useBias?this.bias=this.addWeight("bias",[this.units],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint):this.bias=null,this.built=!0}call(e,t){return(0,r$.tidy)(()=>{let n;if(2!==e.length)throw new rF(`SimpleRNNCell expects 2 input Tensors, got ${e.length}.`);let r=e[1];e=e[0];let a=null!=t.training&&t.training;0<this.dropout&&this.dropout<1&&null==this.dropoutMask&&(this.dropoutMask=o6({ones:()=>ra.onesLike(e),rate:this.dropout,training:a,dropoutFunc:this.dropoutFunc})),0<this.recurrentDropout&&this.recurrentDropout<1&&null==this.recurrentDropoutMask&&(this.recurrentDropoutMask=o6({ones:()=>ra.onesLike(r),rate:this.recurrentDropout,training:a,dropoutFunc:this.dropoutFunc}));let s=this.dropoutMask,i=this.recurrentDropoutMask;n=null!=s?aM(b.mul(e,s),this.kernel.read()):aM(e,this.kernel.read()),null!=this.bias&&(n=aG(n,this.bias.read())),null!=i&&(r=b.mul(r,i));let o=P.add(n,aM(r,this.recurrentKernel.read()));return null!=this.activation&&(o=this.activation.apply(o)),[o,o]})}getConfig(){let e=super.getConfig(),t={units:this.units,activation:of(this.activation),useBias:this.useBias,kernelInitializer:rV(this.kernelInitializer),recurrentInitializer:rV(this.recurrentInitializer),biasInitializer:rV(this.biasInitializer),kernelRegularizer:rV(this.kernelRegularizer),recurrentRegularizer:rV(this.recurrentRegularizer),biasRegularizer:rV(this.biasRegularizer),activityRegularizer:rV(this.activityRegularizer),kernelConstraint:rV(this.kernelConstraint),recurrentConstraint:rV(this.recurrentConstraint),biasConstraint:rV(this.biasConstraint),dropout:this.dropout,recurrentDropout:this.recurrentDropout};return Object.assign(Object.assign({},e),t)}}oQ.className="SimpleRNNCell",rJ.registerClass(oQ);class o0 extends oZ{constructor(e){e.cell=new oQ(e),super(e)}call(e,t){return(0,r$.tidy)(()=>{null!=this.cell.dropoutMask&&(r$.dispose(this.cell.dropoutMask),this.cell.dropoutMask=null),null!=this.cell.recurrentDropoutMask&&(r$.dispose(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null);let n=null==t?null:t.mask,r=null==t?null:t.training,a=null==t?null:t.initialState;return super.call(e,{mask:n,training:r,initialState:a})})}static fromConfig(e,t){return new e(t)}}o0.className="SimpleRNN",rJ.registerClass(o0);class o1 extends oJ{constructor(e){if(super(e),this.DEFAULT_ACTIVATION="tanh",this.DEFAULT_RECURRENT_ACTIVATION="hardSigmoid",this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_RECURRENT_INITIALIZER="orthogonal",this.DEFAULT_BIAS_INITIALIZER="zeros",e.resetAfter)throw new rF("GRUCell does not support reset_after parameter set to true.");this.units=e.units,rY(this.units,"units"),this.activation=og(void 0===e.activation?this.DEFAULT_ACTIVATION:e.activation),this.recurrentActivation=og(void 0===e.recurrentActivation?this.DEFAULT_RECURRENT_ACTIVATION:e.recurrentActivation),this.useBias=null==e.useBias||e.useBias,this.kernelInitializer=st(e.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.recurrentInitializer=st(e.recurrentInitializer||this.DEFAULT_RECURRENT_INITIALIZER),this.biasInitializer=st(e.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.kernelRegularizer=oI(e.kernelRegularizer),this.recurrentRegularizer=oI(e.recurrentRegularizer),this.biasRegularizer=oI(e.biasRegularizer),this.kernelConstraint=sD(e.kernelConstraint),this.recurrentConstraint=sD(e.recurrentConstraint),this.biasConstraint=sD(e.biasConstraint),this.dropout=ak([1,aS([0,null==e.dropout?0:e.dropout])]),this.recurrentDropout=ak([1,aS([0,null==e.recurrentDropout?0:e.recurrentDropout])]),this.dropoutFunc=e.dropoutFunc,this.implementation=e.implementation,this.stateSize=this.units,this.dropoutMask=null,this.recurrentDropoutMask=null}build(e){let t=(e=ss(e))[e.length-1];this.kernel=this.addWeight("kernel",[t,3*this.units],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.recurrentKernel=this.addWeight("recurrent_kernel",[this.units,3*this.units],null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint),this.useBias?this.bias=this.addWeight("bias",[3*this.units],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint):this.bias=null,this.built=!0}call(e,t){return(0,r$.tidy)(()=>{let n,r,a;if(2!==e.length)throw new rF(`GRUCell expects 2 input Tensors (inputs, h, c), got ${e.length}.`);let s=null!=t.training&&t.training,i=e[1];e=e[0],0<this.dropout&&this.dropout<1&&null==this.dropoutMask&&(this.dropoutMask=o6({ones:()=>ra.onesLike(e),rate:this.dropout,training:s,count:3,dropoutFunc:this.dropoutFunc})),0<this.recurrentDropout&&this.recurrentDropout<1&&null==this.recurrentDropoutMask&&(this.recurrentDropoutMask=o6({ones:()=>ra.onesLike(i),rate:this.recurrentDropout,training:s,count:3,dropoutFunc:this.dropoutFunc}));let o=this.dropoutMask,l=this.recurrentDropoutMask;0<this.dropout&&this.dropout<1&&(e=b.mul(e,o[0]));let u=aM(e,this.kernel.read());this.useBias&&(u=aG(u,this.bias.read())),0<this.recurrentDropout&&this.recurrentDropout<1&&(i=b.mul(i,l[0]));let h=this.recurrentKernel.read(),[p,d]=ed.split(h,[2*this.units,this.units],h.rank-1),c=aM(i,p),[f,m,g]=ed.split(u,3,u.rank-1),[x,y]=ed.split(c,2,c.rank-1);n=this.recurrentActivation.apply(P.add(f,x)),r=this.recurrentActivation.apply(P.add(m,y));let v=aM(b.mul(r,i),d);a=this.activation.apply(P.add(g,v));let w=P.add(b.mul(n,i),b.mul(P.add(1,C.neg(n)),a));return[w,w]})}getConfig(){let e=super.getConfig(),t={units:this.units,activation:of(this.activation),recurrentActivation:of(this.recurrentActivation),useBias:this.useBias,kernelInitializer:rV(this.kernelInitializer),recurrentInitializer:rV(this.recurrentInitializer),biasInitializer:rV(this.biasInitializer),kernelRegularizer:rV(this.kernelRegularizer),recurrentRegularizer:rV(this.recurrentRegularizer),biasRegularizer:rV(this.biasRegularizer),activityRegularizer:rV(this.activityRegularizer),kernelConstraint:rV(this.kernelConstraint),recurrentConstraint:rV(this.recurrentConstraint),biasConstraint:rV(this.biasConstraint),dropout:this.dropout,recurrentDropout:this.recurrentDropout,implementation:this.implementation,resetAfter:!1};return Object.assign(Object.assign({},e),t)}}o1.className="GRUCell",rJ.registerClass(o1);class o2 extends oZ{constructor(e){0===e.implementation&&console.warn("`implementation=0` has been deprecated, and now defaults to `implementation=1`. Please update your layer call."),e.cell=new o1(e),super(e)}call(e,t){return(0,r$.tidy)(()=>{null!=this.cell.dropoutMask&&(r$.dispose(this.cell.dropoutMask),this.cell.dropoutMask=null),null!=this.cell.recurrentDropoutMask&&(r$.dispose(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null);let n=null==t?null:t.mask,r=null==t?null:t.training,a=null==t?null:t.initialState;return super.call(e,{mask:n,training:r,initialState:a})})}static fromConfig(e,t){return 0===t.implmentation&&(t.implementation=1),new e(t)}}o2.className="GRU",rJ.registerClass(o2);class o3 extends oJ{constructor(e){super(e),this.DEFAULT_ACTIVATION="tanh",this.DEFAULT_RECURRENT_ACTIVATION="hardSigmoid",this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_RECURRENT_INITIALIZER="orthogonal",this.DEFAULT_BIAS_INITIALIZER="zeros",this.units=e.units,rY(this.units,"units"),this.activation=og(void 0===e.activation?this.DEFAULT_ACTIVATION:e.activation),this.recurrentActivation=og(void 0===e.recurrentActivation?this.DEFAULT_RECURRENT_ACTIVATION:e.recurrentActivation),this.useBias=null==e.useBias||e.useBias,this.kernelInitializer=st(e.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.recurrentInitializer=st(e.recurrentInitializer||this.DEFAULT_RECURRENT_INITIALIZER),this.biasInitializer=st(e.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.unitForgetBias=e.unitForgetBias,this.kernelRegularizer=oI(e.kernelRegularizer),this.recurrentRegularizer=oI(e.recurrentRegularizer),this.biasRegularizer=oI(e.biasRegularizer),this.kernelConstraint=sD(e.kernelConstraint),this.recurrentConstraint=sD(e.recurrentConstraint),this.biasConstraint=sD(e.biasConstraint),this.dropout=ak([1,aS([0,null==e.dropout?0:e.dropout])]),this.recurrentDropout=ak([1,aS([0,null==e.recurrentDropout?0:e.recurrentDropout])]),this.dropoutFunc=e.dropoutFunc,this.implementation=e.implementation,this.stateSize=[this.units,this.units],this.dropoutMask=null,this.recurrentDropoutMask=null}build(e){var t;let n,r=(e=ss(e))[e.length-1];if(this.kernel=this.addWeight("kernel",[r,4*this.units],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.recurrentKernel=this.addWeight("recurrent_kernel",[this.units,4*this.units],null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint),this.useBias){if(this.unitForgetBias){let e=this.biasInitializer,r=this.units;n=new((t=class extends aj{apply(t,n){let a=e.apply([r]),s=new aK().apply([r]),i=e.apply([2*r]);return aL(aL(a,s),i)}}).className="CustomInit",t)}else n=this.biasInitializer;this.bias=this.addWeight("bias",[4*this.units],null,n,this.biasRegularizer,!0,this.biasConstraint)}else this.bias=null;this.built=!0}call(e,t){return(0,r$.tidy)(()=>{let n,r,a,s,i=null!=t.training&&t.training;if(3!==e.length)throw new rF(`LSTMCell expects 3 input Tensors (inputs, h, c), got ${e.length}.`);let o=e[1],l=e[2];e=e[0],0<this.dropout&&this.dropout<1&&null==this.dropoutMask&&(this.dropoutMask=o6({ones:()=>ra.onesLike(e),rate:this.dropout,training:i,count:4,dropoutFunc:this.dropoutFunc})),0<this.recurrentDropout&&this.recurrentDropout<1&&null==this.recurrentDropoutMask&&(this.recurrentDropoutMask=o6({ones:()=>ra.onesLike(o),rate:this.recurrentDropout,training:i,count:4,dropoutFunc:this.dropoutFunc}));let u=this.dropoutMask,h=this.recurrentDropoutMask;0<this.dropout&&this.dropout<1&&(e=b.mul(e,u[0]));let p=aM(e,this.kernel.read());0<this.recurrentDropout&&this.recurrentDropout<1&&(o=b.mul(o,h[0])),p=P.add(p,aM(o,this.recurrentKernel.read())),this.useBias&&(p=aG(p,this.bias.read()));let[d,c,f,m]=ed.split(p,4,p.rank-1);n=this.recurrentActivation.apply(d),r=this.recurrentActivation.apply(c),a=P.add(b.mul(r,l),b.mul(n,this.activation.apply(f))),s=this.recurrentActivation.apply(m);let g=b.mul(s,this.activation.apply(a));return[g,g,a]})}getConfig(){let e=super.getConfig(),t={units:this.units,activation:of(this.activation),recurrentActivation:of(this.recurrentActivation),useBias:this.useBias,kernelInitializer:rV(this.kernelInitializer),recurrentInitializer:rV(this.recurrentInitializer),biasInitializer:rV(this.biasInitializer),unitForgetBias:this.unitForgetBias,kernelRegularizer:rV(this.kernelRegularizer),recurrentRegularizer:rV(this.recurrentRegularizer),biasRegularizer:rV(this.biasRegularizer),activityRegularizer:rV(this.activityRegularizer),kernelConstraint:rV(this.kernelConstraint),recurrentConstraint:rV(this.recurrentConstraint),biasConstraint:rV(this.biasConstraint),dropout:this.dropout,recurrentDropout:this.recurrentDropout,implementation:this.implementation};return Object.assign(Object.assign({},e),t)}}o3.className="LSTMCell",rJ.registerClass(o3);class o4 extends oZ{constructor(e){0===e.implementation&&console.warn("`implementation=0` has been deprecated, and now defaults to `implementation=1`. Please update your layer call."),e.cell=new o3(e),super(e)}call(e,t){return(0,r$.tidy)(()=>{null!=this.cell.dropoutMask&&(r$.dispose(this.cell.dropoutMask),this.cell.dropoutMask=null),null!=this.cell.recurrentDropoutMask&&(r$.dispose(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null);let n=null==t?null:t.mask,r=null==t?null:t.training,a=null==t?null:t.initialState;return super.call(e,{mask:n,training:r,initialState:a})})}static fromConfig(e,t){return 0===t.implmentation&&(t.implementation=1),new e(t)}}o4.className="LSTM",rJ.registerClass(o4);class o5 extends oJ{constructor(e){super(e),this.cells=e.cells}get stateSize(){let e=[];for(let t of this.cells.slice().reverse())Array.isArray(t.stateSize)?e.push(...t.stateSize):e.push(t.stateSize);return e}call(e,t){return(0,r$.tidy)(()=>{let n,r=e.slice(1),a=[];for(let e of this.cells.slice().reverse())Array.isArray(e.stateSize)?a.push(r.splice(0,e.stateSize.length)):a.push(r.splice(0,1));a.reverse();let s=[];for(let i=0;i<this.cells.length;++i){let o=this.cells[i];r=a[i],n=0===i?[e[0]].concat(r):[n[0]].concat(r),n=o.call(n,t),s.push(n.slice(1))}for(let e of(r=[],s.slice().reverse()))r.push(...e);return[n[0]].concat(r)})}build(e){let t;sn(e)&&(e=e[0]),this.cells.forEach((n,r)=>{an(`RNNCell_${r}`,()=>{n.build(e),t=Array.isArray(n.stateSize)?n.stateSize[0]:n.stateSize,e=[e[0],t]})}),this.built=!0}getConfig(){let e=super.getConfig(),t=this.cells.map(e=>({className:e.getClassName(),config:e.getConfig()}));return Object.assign(Object.assign({},e),{cells:t})}static fromConfig(e,t,n={}){let r=[];for(let e of t.cells)r.push(is(e,n));return new e({cells:r})}get trainableWeights(){if(!this.trainable)return[];let e=[];for(let t of this.cells)e.push(...t.trainableWeights);return e}get nonTrainableWeights(){let e=[];for(let t of this.cells)e.push(...t.nonTrainableWeights);if(!this.trainable){let t=[];for(let e of this.cells)t.push(...e.trainableWeights);return t.concat(e)}return e}getWeights(){let e=[];for(let t of this.cells)e.push(...t.weights);return sh(e)}setWeights(e){let t=[];for(let n of this.cells){let r=n.weights.length,a=e.splice(r);for(let e=0;e<n.weights.length;++e)t.push([n.weights[e],a[e]])}sp(t)}}function o6(e){let{ones:t,rate:n,training:r=!1,count:a=1,dropoutFunc:s}=e,i=()=>null!=s?s(t(),n):aU(t(),n),o=()=>aV(i,t,r);return!a||a<=1?r$.keep(o().clone()):Array(a).fill(void 0).map(o).map(e=>r$.keep(e.clone()))}o5.className="StackedRNNCells",rJ.registerClass(o5);var o8=function(e,t){var n={};for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&0>t.indexOf(r)&&(n[r]=e[r]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols)for(var a=0,r=Object.getOwnPropertySymbols(e);a<r.length;a++)0>t.indexOf(r[a])&&Object.prototype.propertyIsEnumerable.call(e,r[a])&&(n[r[a]]=e[r[a]]);return n};class o9 extends oZ{constructor(e){if(e.unroll)throw new rD("Unrolling is not possible with convolutional RNNs.");if(Array.isArray(e.cell))throw new rD("It is not possible at the moment to stack convolutional cells.");super(e),this.inputSpec=[new sd({ndim:5})]}call(e,t){return r$.tidy(()=>{if(null!=this.cell.dropoutMask&&(r$.dispose(this.cell.dropoutMask),this.cell.dropoutMask=null),null!=this.cell.recurrentDropoutMask&&(r$.dispose(this.cell.recurrentDropoutMask),this.cell.recurrentDropoutMask=null),t&&t.constants)throw new rF("ConvRNN2D cell does not support constants");let n=null==t?null:t.mask,r=null==t?null:t.training,a=null==t?null:t.initialState;return super.call(e,{mask:n,training:r,initialState:a})})}computeOutputShape(e){let t=this.computeSingleOutputShape(e);return this.returnSequences||(t=[t[0],...t.slice(2)]),this.returnState&&(t=[t,...[,,].fill([e[0],...t.slice(-3)])]),t}getInitialState(e){return r$.tidy(()=>{let{stateSize:t}=this.cell,n=e.shape,r=this.computeSingleOutputShape(n),a=[r[0],...r.slice(2)],s=tx.zeros(a);return Array.isArray(t)?Array(t.length).fill(s):[s]})}resetStates(e,t=!1){r$.tidy(()=>{if(!this.stateful)throw new rA("Cannot call resetStates() on an RNN Layer that is not stateful.");let n=this.inputSpec[0].shape,r=this.computeSingleOutputShape(n),a=[r[0],...r.slice(2)];if(null==n[0])throw new rF("If an RNN is stateful, it needs to know its batch size. Specify the batch size of your input tensors: \n- If using a Sequential model, specify the batch size by passing a `batchInputShape` option to your first layer.\n- If using the functional API, specify the batch size by passing a `batchShape` option to your Input layer.");if(null==this.getStates())Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(()=>tx.zeros(a)):this.states_=[tx.zeros(a)];else if(null==e)r$.dispose(this.states_),null!=this.keptStates&&(r$.dispose(this.keptStates),this.keptStates=[]),Array.isArray(this.cell.stateSize)?this.states_=this.cell.stateSize.map(()=>tx.zeros(a)):this.states_[0]=tx.zeros(a);else{if(Array.isArray(e)||(e=[e]),e.length!==this.states_.length)throw new rF(`Layer ${this.name} expects ${this.states_.length} state(s), but it received ${e.length} state value(s). Input received: ${e}`);t?this.keptStates.push(this.states_.slice()):r$.dispose(this.states_);for(let t=0;t<this.states_.length;++t){let n=e[t];if(!rR.util.arraysEqual(n.shape,a))throw new rF(`State ${t} is incompatible with layer ${this.name}: expected shape=${a}, received shape=${n.shape}`);this.states_[t]=n}}this.states_=this.states_.map(e=>r$.keep(e.clone()))})}computeSingleOutputShape(e){let{dataFormat:t,filters:n,kernelSize:r,padding:a,strides:s,dilationRate:i}=this.cell,o="channelsFirst"===t,l=e[o?3:2],u=e[o?4:3],h=oF(l,r[0],a,s[0],i[0]),p=oF(u,r[1],a,s[1],i[1]);return[...e.slice(0,2),...o?[n,h,p]:[h,p,n]]}}o9.className="ConvRNN2D";class o7 extends o3{constructor(e){const{filters:t,kernelSize:n,strides:r,padding:a,dataFormat:s,dilationRate:i}=e;super(Object.assign(Object.assign({},e),{units:t})),this.filters=t,rY(this.filters,"filters"),this.kernelSize=oE(n,2,"kernelSize"),this.kernelSize.forEach(e=>rY(e,"kernelSize")),this.strides=oE(r||1,2,"strides"),this.strides.forEach(e=>rY(e,"strides")),this.padding=a||"valid",r7(this.padding),this.dataFormat=s||"channelsLast",r9(this.dataFormat),this.dilationRate=oE(i||1,2,"dilationRate"),this.dilationRate.forEach(e=>rY(e,"dilationRate"))}build(e){var t;e=ss(e);let n="channelsFirst"===this.dataFormat?1:e.length-1;if(null==e[n])throw new rF(`The channel dimension of the input should be defined. Found ${e[n]}`);let r=e[n],a=this.kernelSize.concat([r,4*this.filters]);this.kernel=this.addWeight("kernel",a,null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint);let s=this.kernelSize.concat([this.filters,4*this.filters]);if(this.recurrentKernel=this.addWeight("recurrent_kernel",s,null,this.recurrentInitializer,this.recurrentRegularizer,!0,this.recurrentConstraint),this.useBias){let e;if(this.unitForgetBias){let n=this.biasInitializer,r=this.filters;e=new((t=class extends aj{apply(e,t){return aO([n.apply([r]),to.ones([r]),n.apply([2*r])])}}).className="CustomInit",t)}else e=this.biasInitializer;this.bias=this.addWeight("bias",[4*this.filters],null,e,this.biasRegularizer,!0,this.biasConstraint)}this.built=!0}call(e,t){return r$.tidy(()=>{if(3!==e.length)throw new rF(`ConvLSTM2DCell expects 3 input Tensors (inputs, h, c), got ${e.length}.`);let n=t.training||!1,r=e[0],a=e[1],s=e[2];0<this.dropout&&this.dropout<1&&null==this.dropoutMask&&(this.dropoutMask=o6({ones:()=>ra.onesLike(r),rate:this.dropout,training:n,count:4,dropoutFunc:this.dropoutFunc}));let i=this.dropoutMask,o=(e,t,n)=>t&&t[n]?b.mul(t[n],e):e,l=o(r,i,0),u=o(r,i,1),h=o(r,i,2),p=o(r,i,3);0<this.recurrentDropout&&this.recurrentDropout<1&&null==this.recurrentDropoutMask&&(this.recurrentDropoutMask=o6({ones:()=>ra.onesLike(a),rate:this.recurrentDropout,training:n,count:4,dropoutFunc:this.dropoutFunc}));let d=this.recurrentDropoutMask,c=o(a,d,0),f=o(a,d,1),m=o(a,d,2),g=o(a,d,3),[x,y,v,w]=ed.split(this.kernel.read(),4,3),[I,C,k,S]=this.useBias?ed.split(this.bias.read(),4):[null,null,null,null];l=this.inputConv(l,x,I,this.padding),u=this.inputConv(u,y,C,this.padding),h=this.inputConv(h,v,k,this.padding),p=this.inputConv(p,w,S,this.padding);let[T,N,$,R]=ed.split(this.recurrentKernel.read(),4,3);c=this.recurrentConv(c,T),f=this.recurrentConv(f,N),m=this.recurrentConv(m,$),g=this.recurrentConv(g,R);let A=this.recurrentActivation.apply(P.add(l,c)),E=this.recurrentActivation.apply(P.add(u,f)),F=P.add(b.mul(E,s),b.mul(A,this.activation.apply(P.add(h,m)))),D=b.mul(this.recurrentActivation.apply(P.add(p,g)),this.activation.apply(F));return[D,D,F]})}getConfig(){let e=super.getConfig(),{units:t}=e,n=o8(e,["units"]),r={filters:this.filters,kernelSize:this.kernelSize,padding:this.padding,dataFormat:this.dataFormat,dilationRate:this.dilationRate,strides:this.strides};return Object.assign(Object.assign({},n),r)}inputConv(e,t,n,r){let a=ex.conv2d(e,t,this.strides,r||"valid","channelsFirst"===this.dataFormat?"NCHW":"NHWC",this.dilationRate);return n?aG(a,n,this.dataFormat):a}recurrentConv(e,t){return ex.conv2d(e,t,1,"same","channelsFirst"===this.dataFormat?"NCHW":"NHWC")}}o7.className="ConvLSTM2DCell",rJ.registerClass(o7);class le extends o9{constructor(e){super(Object.assign(Object.assign({},e),{cell:new o7(e)}))}static fromConfig(e,t){return new e(t)}}le.className="ConvLSTM2D",rJ.registerClass(le);var rJ=rJ;class lt extends sx{constructor(e){super(e),this.rate=Math.max(Math.min(e.rate,1),0),this.noiseShape=e.noiseShape,this.seed=e.seed,this.supportsMasking=!0}getNoiseShape(e){if(null==this.noiseShape)return this.noiseShape;let t=e.shape,n=[];for(let e=0;e<this.noiseShape.length;++e)n.push(null==this.noiseShape[e]?t[e]:this.noiseShape[e]);return n}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e);if(0<this.rate&&this.rate<1){let e=null!=t.training&&t.training,r=this.getNoiseShape(n);return aV(()=>aU(n,this.rate,r,this.seed),()=>n,e)}return e})}getConfig(){let e={rate:this.rate,noiseShape:this.noiseShape,seed:this.seed};return Object.assign(e,super.getConfig()),e}dispose(){return super.dispose()}}lt.className="Dropout",rJ.registerClass(lt);class ln extends lt{constructor(e){super(e),this.inputSpec=[{ndim:3}]}getNoiseShape(e){let t=e.shape;return[t[0],1,t[2]]}}ln.className="SpatialDropout1D",rJ.registerClass(ln);class lr extends sx{constructor(e){if(super(e),this.activation=null,this.useBias=!0,this.kernel=null,this.bias=null,this.DEFAULT_KERNEL_INITIALIZER="glorotNormal",this.DEFAULT_BIAS_INITIALIZER="zeros",null==e.batchInputShape&&null==e.inputShape&&null!=e.inputDim){let t=null;null!=e.batchSize&&(t=e.batchSize),this.batchInputShape=[t,e.inputDim]}this.units=e.units,rY(this.units,"units"),this.activation=og(e.activation),null!=e.useBias&&(this.useBias=e.useBias),this.kernelInitializer=st(e.kernelInitializer||this.DEFAULT_KERNEL_INITIALIZER),this.biasInitializer=st(e.biasInitializer||this.DEFAULT_BIAS_INITIALIZER),this.kernelConstraint=sD(e.kernelConstraint),this.biasConstraint=sD(e.biasConstraint),this.kernelRegularizer=oI(e.kernelRegularizer),this.biasRegularizer=oI(e.biasRegularizer),this.activityRegularizer=oI(e.activityRegularizer),this.supportsMasking=!0,this.inputSpec=[{minNDim:2}]}build(e){let t=(e=ss(e))[e.length-1];null==this.kernel&&(this.kernel=this.addWeight("kernel",[t,this.units],null,this.kernelInitializer,this.kernelRegularizer,!0,this.kernelConstraint),this.useBias&&(this.bias=this.addWeight("bias",[this.units],null,this.biasInitializer,this.biasRegularizer,!0,this.biasConstraint))),this.inputSpec=[{minNDim:2,axes:{[-1]:t}}],this.built=!0}computeOutputShape(e){let t=(e=ss(e)).slice();return t[t.length-1]=this.units,t}call(e,t){return(0,r$.tidy)(()=>{let n;this.invokeCallHook(e,t);let r=sa(e),a=rZ(this.activation.getClassName());return null!=a?n=aM(r,this.kernel.read(),a,this.bias?this.bias.read():null):(n=aM(r,this.kernel.read()),null!=this.bias&&(n=aG(n,this.bias.read())),null!=this.activation&&(n=this.activation.apply(n))),n})}getConfig(){let e={units:this.units,activation:of(this.activation),useBias:this.useBias,kernelInitializer:rV(this.kernelInitializer),biasInitializer:rV(this.biasInitializer),kernelRegularizer:rV(this.kernelRegularizer),biasRegularizer:rV(this.biasRegularizer),activityRegularizer:rV(this.activityRegularizer),kernelConstraint:rV(this.kernelConstraint),biasConstraint:rV(this.biasConstraint)};return Object.assign(e,super.getConfig()),e}}lr.className="Dense",rJ.registerClass(lr);class la extends sx{constructor(e){super(e=e||{}),this.inputSpec=[{minNDim:3}],this.dataFormat=e.dataFormat}computeOutputShape(e){for(let t of(e=ss(e)).slice(1))if(null==t)throw new rF(`The shape of the input to "Flatten" is not fully defined (got ${e.slice(1)}). Make sure to pass a complete "input_shape" or "batch_input_shape" argument to the first layer in your model.`);return[e[0],aC(e,1)]}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e);if("channelsFirst"===this.dataFormat&&n.rank>1){let e=[0];for(let t=2;t<n.rank;++t)e.push(t);e.push(1),n=(0,e$.transpose)(n,e)}var r=n;if(r.rank<=1)throw new rF(`batchFlatten requires a minimum rank of 2. Got rank: ${r.rank}.`);let a=[r.shape[0],aC(r.shape,1)];return E.reshape(r,a)})}getConfig(){let e={};return null!=this.dataFormat&&(e.dataFormat=this.dataFormat),Object.assign(e,super.getConfig()),e}}la.className="Flatten",rJ.registerClass(la);class ls extends sx{constructor(e){super(e),this.supportsMasking=!0,this.activation=og(e.activation)}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e);return this.activation.apply(n)})}getConfig(){let e={activation:of(this.activation)};return Object.assign(e,super.getConfig()),e}}ls.className="Activation",rJ.registerClass(ls);class li extends sx{constructor(e){super(e),this.n=e.n,this.inputSpec=[{ndim:2}]}computeOutputShape(e){return[e[0],this.n,e[1]]}call(e,t){return(0,r$.tidy)(()=>{var t,n;return t=e=sa(e),n=this.n,(0,r$.tidy)(()=>{if(2!==t.shape.length)throw new rF(`repeat() expects a rank-2 tensor, but received a rank-${t.shape.length} tensor.`);return az(aA(t,1),[1,n,1])})})}getConfig(){let e={n:this.n};return Object.assign(e,super.getConfig()),e}}li.className="RepeatVector",rJ.registerClass(li);class lo extends sx{constructor(e){super(e),this.targetShape=e.targetShape;for(let e=0;e<this.targetShape.length;++e)this.isUnknown(this.targetShape[e])&&(this.targetShape[e]=null)}isUnknown(e){return e<0||null==e}fixUnknownDimension(e,t){let n="Total size of new array must be unchanged.",r=t.slice(),a=1,s=null;for(let e=0;e<r.length;++e){let t=r[e];if(this.isUnknown(t))if(null===s)s=e;else throw new rF("Can only specifiy one unknown dimension.");else a*=t}let i=aC(e);if(null!==s){if(0===a||i%a!=0)throw new rF(n);r[s]=i/a}else if(i!==a)throw new rF(n);return r}computeOutputShape(e){let t=!1;for(let n=0;n<e.length;++n)if(this.isUnknown(e[n])){t=!0;break}return t?e.slice(0,1).concat(this.targetShape):e.slice(0,1).concat(this.fixUnknownDimension(e.slice(1),this.targetShape))}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e),r=n.shape,a=r.slice(0,1).concat(this.fixUnknownDimension(r.slice(1),this.targetShape));return(0,E.reshape)(n,a)})}getConfig(){let e={targetShape:this.targetShape};return Object.assign(e,super.getConfig()),e}}lo.className="Reshape",rJ.registerClass(lo);class ll extends sx{constructor(e){if(super(e),null==e.dims)throw Error("Required configuration field `dims` is missing during Permute constructor call.");if(!Array.isArray(e.dims))throw Error(`Permute constructor requires \`dims\` to be an Array, but received ${e.dims} instead.`);const t=aT(1,e.dims.length+1);if(!rR.util.arraysEqual(e.dims.slice().sort(),t))throw Error("Invalid permutation `dims`: "+JSON.stringify(e.dims)+" `dims` must contain consecutive integers starting from 1.");this.dims=e.dims,this.dimsIncludingBatch=[0].concat(this.dims),this.inputSpec=[new sd({ndim:this.dims.length+1})]}computeOutputShape(e){let t=(e=ss(e)).slice();return this.dims.forEach((n,r)=>{t[r+1]=e[n]}),t}call(e,t){return(0,e$.transpose)(sa(e),this.dimsIncludingBatch)}getConfig(){let e={dims:this.dims};return Object.assign(e,super.getConfig()),e}}ll.className="Permute",rJ.registerClass(ll);class lu extends sx{constructor(e){super(null==e?{}:e),this.supportsMasking=!0,null!=e?this.maskValue=null==e.maskValue?0:e.maskValue:this.maskValue=0}computeOutputShape(e){return e}getConfig(){let e=super.getConfig(),t={maskValue:this.maskValue};return Object.assign(t,e),t}computeMask(e,t){let n=sa(e);return(0,nb.any)((0,rn.notEqual)(n,this.maskValue),-1)}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e),r=(0,nb.any)((0,rn.notEqual)(n,this.maskValue),-1,!0);return(0,b.mul)(n,(0,y.cast)(r,n.dtype))})}}lu.className="Masking",rJ.registerClass(lu);var rJ=rJ;class lh extends sx{constructor(e){if(super(e),this.embeddings=null,this.DEFAULT_EMBEDDINGS_INITIALIZER="randomUniform",null==e.batchInputShape&&null==e.inputShape){let t=null;null!=e.batchSize&&(t=e.batchSize),null==e.inputLength?this.batchInputShape=[t,null]:this.batchInputShape=[t].concat(rB(e.inputLength))}this.inputDim=e.inputDim,rY(this.inputDim,"inputDim"),this.outputDim=e.outputDim,rY(this.outputDim,"outputDim"),this.embeddingsInitializer=st(e.embeddingsInitializer||this.DEFAULT_EMBEDDINGS_INITIALIZER),this.embeddingsRegularizer=oI(e.embeddingsRegularizer),this.activityRegularizer=oI(e.activityRegularizer),this.embeddingsConstraint=sD(e.embeddingsConstraint),this.maskZero=e.maskZero,this.supportsMasking=e.maskZero,this.inputLength=e.inputLength}build(e){this.embeddings=this.addWeight("embeddings",[this.inputDim,this.outputDim],this.dtype,this.embeddingsInitializer,this.embeddingsRegularizer,!0,this.embeddingsConstraint),this.built=!0}warnOnIncompatibleInputShape(e){}computeMask(e,t){return(0,r$.tidy)(()=>this.maskZero?(e=sa(e),(0,rn.notEqual)(e,(0,L.zerosLike)(e))):null)}computeOutputShape(e){if(e=ss(e),null==this.inputLength)return[...e,this.outputDim];let t=rB(this.inputLength);if(t.length!==e.length-1)throw new rF(`"inputLength" is ${this.inputLength}, but received input shape has shape ${e}`);{let n=0;for(let r=0;r<t.length;++r){let a=t[r],s=e[r+1];if(null!=a&&null!=s&&a!==s)throw new rF(`"inputLength" is ${this.inputLength}, but received input shape has shape ${e}`);null==a&&(t[n]=s),n++}}return[e[0],...t,this.outputDim]}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e);"int32"!==n.dtype&&(n=aR(n,"int32"));let r=aP(this.embeddings.read(),(0,E.reshape)(n,[n.size]));return(0,E.reshape)(r,ss(this.computeOutputShape(n.shape)))})}getConfig(){let e={inputDim:this.inputDim,outputDim:this.outputDim,embeddingsInitializer:rV(this.embeddingsInitializer),embeddingsRegularizer:rV(this.embeddingsRegularizer),activityRegularizer:rV(this.activityRegularizer),embeddingsConstraint:rV(this.embeddingsConstraint),maskZero:this.maskZero,inputLength:this.inputLength};return Object.assign(e,super.getConfig()),e}}lh.className="Embedding",rJ.registerClass(lh);var rJ=rJ;class lp extends sx{constructor(e){super(e||{}),this.supportsMasking=!0}mergeFunction(e){throw new rD}computeElementwiseOpOutputShape(e,t){if(null==e||null==t)return null;if(e.length<t.length)return this.computeElementwiseOpOutputShape(t,e);if(0===t.length)return e;let n=e.slice(0,e.length-t.length);for(let r=0;r<t.length;++r){let a=e[e.length-t.length+r],s=t[r];if(null==a||null==s||a<0||s<0)n.push(null);else if(1===a)n.push(s);else if(1===s)n.push(a);else{if(a!==s)throw new rF("Operands could not be broadcast together with shapes "+JSON.stringify(e)+" "+JSON.stringify(t));n.push(a)}}return n}build(e){if(Array.isArray(e)&&!Array.isArray(e[0])&&(e=[ss(e)]),e.length<2)throw new rF(`A merge layer should be called on an Array of at least 2 inputs. Got ${e.length} input(s).`);let t=[];for(let n of e)null!=n&&null!==n[0]&&t.push(n[0]);if((t=rj(t)).length>1)throw new rF(`Can not merge tensors with different batch sizes. Got tensors with shapes: ${JSON.stringify(e)}.`);let n=null==e[0]?null:e[0].slice(1);for(let t=1;t<e.length;++t){let r=null==e[t]?null:e[t].slice(1);n=this.computeElementwiseOpOutputShape(n,r)}let r=e.map(e=>e.length);-1===e.indexOf(null)&&1===rj(r).length?this.reshapeRequired=!1:this.reshapeRequired=!0}call(e,t){return(0,r$.tidy)(()=>{if(!this.reshapeRequired)return this.mergeFunction(e);{let t=[],n=e.map(e=>e.rank);if(-1===n.indexOf(null)){let r=aS(n);for(let n of e){let e=n.rank;for(let t=0;t<r-e;++t)n=aA(n,1);t.push(n)}return this.mergeFunction(t)}{let n=!1;for(let r of e){let e=r.rank;if(null==e){let e=r.shape,a=e[0],s=e.slice(1).concat([a]),i=E.reshape(r,[a].concat(aC(e.slice(1))));i=e$.transpose(i,[1,0]),i=E.reshape(i,s),t.push(i),n=!0}else if(e>1){let a=aT(1,e).concat([0]);t.push(e$.transpose(r,a)),n=!0}else t.push(r)}let r=this.mergeFunction(t),a=r.rank;if(n){if(null==a){let e=r.shape,t=e.length,n=e[t-1],a=[n].concat(e.slice(0,e.length-1));r=E.reshape(e$.transpose(E.reshape(r,[-1,n]),[1,0]),a)}else if(a>1){let e=[a-1].concat(aT(0,a-1));r=e$.transpose(r,e)}}return r}}})}computeOutputShape(e){let t;t=null==e[0]?null:e[0].slice(1);for(let n=1;n<e.length;++n){let r=null==e[n]?null:e[n].slice(1);t=this.computeElementwiseOpOutputShape(t,r)}let n=[];for(let t of e)null!=t&&null!==t[0]&&n.push(t[0]);return 1===(n=rj(n)).length?n.concat(t):[null].concat(t)}computeMask(e,t){return r$.tidy(()=>{if(null==t)return null;if(!Array.isArray(t))throw new rF("`mask` should be an Array");if(!Array.isArray(e))throw new rF("`inputs` should be an Array");if(t.length!==e.length)throw new rF(`The Array 'inputs' and 'mask' are expected to have the same length, but have different lengths (${e.length} vs ${t.length})`);if(t.every(e=>null==e))return null;let n=(t=t.map(e=>null==e?e:nl.expandDims(e,0)))[0];for(let e=1;e<t.length-1;++e)n=el.logicalAnd(n,t[e]);return n})}}class ld extends lp{constructor(e){super(e)}mergeFunction(e){return(0,r$.tidy)(()=>{let t=e[0].clone();for(let n=1;n<e.length;++n)t=P.add(t,e[n]);return t})}}ld.className="Add",rJ.registerClass(ld);class lc extends lp{constructor(e){super(e)}mergeFunction(e){return(0,r$.tidy)(()=>{let t=e[0].clone();for(let n=1;n<e.length;++n)t=b.mul(t,e[n]);return t})}}lc.className="Multiply",rJ.registerClass(lc);class lf extends lp{constructor(e){super(e)}mergeFunction(e){return(0,r$.tidy)(()=>{let t=e[0].clone();for(let n=1;n<e.length;++n)t=P.add(t,e[n]);return b.mul(1/e.length,t)})}}lf.className="Average",rJ.registerClass(lf);class lm extends lp{constructor(e){super(e)}mergeFunction(e){return(0,r$.tidy)(()=>{let t=e[0];for(let n=1;n<e.length;++n)t=nh.maximum(t,e[n]);return t})}}lm.className="Maximum",rJ.registerClass(lm);class lg extends lp{constructor(e){super(e)}mergeFunction(e){return(0,r$.tidy)(()=>{let t=e[0];for(let n=1;n<e.length;++n)t=n9.minimum(t,e[n]);return t})}}lg.className="Minimum",rJ.registerClass(lg);class lx extends lp{constructor(e){super(e),this.DEFAULT_AXIS=-1,null==e&&(e={}),this.axis=null==e.axis?this.DEFAULT_AXIS:e.axis,this.supportsMasking=!0,this.reshapeRequired=!1}build(e){if(!(Array.isArray(e)&&Array.isArray(e[0]))||1===e.length)throw new rF("A `Concatenate` layer should be called on a list of at least 2 inputs");let t=!0;for(let n of e)if(null!=n){t=!1;break}if(t)return;let n=[];for(let t=0;t<e.length;++t){let r=e[t].slice();r.splice(this.axis,1);let a=!1;for(let e of n)if(rR.util.arraysEqual(e,r)){a=!0;break}a||n.push(r)}if(n.length>1)throw new rF("A `Concatenate` layer requires inputs with matching shapes except for the concat axis. Got input shapes: "+JSON.stringify(e))}mergeFunction(e){return(0,r$.tidy)(()=>aO(e,this.axis))}computeOutputShape(e){if(!(Array.isArray(e)&&Array.isArray(e[0])))throw new rF("A `Concatenate` layer should be called on a list of inputs.");let t=e[0].slice(),n=this.axis<0?t.length+this.axis:this.axis;for(let r of e.slice(1)){if(null==t[n]||null==r[n]){t[n]=null;break}t[n]+=r[n]}return t}computeMask(e,t){if(null==t)return null;if(!Array.isArray(t))throw new rF("`mask` should be an array for Concatenate");if(!Array.isArray(e))throw new rF("`inputs` should be an array for Concatenate");if(t.length!==e.length)throw new rF(`Mismatch in the length of mask (${t.length}) and the legnth of inputs (${e.length})`);return r$.tidy(()=>{let n=!0;if(t.forEach(e=>{if(null!=e){n=!1;return}}),n)return null;let r=[];for(let n=0;n<e.length;++n)null==t[n]?r.push(y.cast(ra.onesLike(e[n]),"bool")):t[n].rank<e[n].rank?r.push(nl.expandDims(t[n],-1)):r.push(t[n]);let a=t5.concat(r,this.axis);return ny.all(a,-1,!1)})}getConfig(){let e={axis:this.axis};return Object.assign(e,super.getConfig()),e}}function ly(e,t){for(;e<0;)e+=t;return e}lx.className="Concatenate",rJ.registerClass(lx);class lb extends lp{constructor(e){super(e),this.axes=e.axes,this.normalize=null!=e.normalize&&e.normalize,this.supportsMasking=!0,this.reshapeRequired=!1}build(e){rR.util.assert(Array.isArray(e)&&2===e.length&&Array.isArray(e[0])&&Array.isArray(e[1]),()=>"A `Dot` layer should be called on a list of exactly 2 inputs.");let t=e[0],n=e[1];if(t.length>3||n.length>3)throw new rD("Dot layer does not support tensors of 4D or higher rank yet.");let r=this.interpretAxes(t,n);if(t[r[0]]!==n[r[1]])throw new rF(`Dimension incompatibility: ${t[r[0]]} !== ${n[r[1]]}`)}mergeFunction(e){let t;if(2!==e.length)throw new rF(`A \`Dot\` layer must be called on exactly 2 inputs, but received ${e.length} input(s).`);let n=e[0],r=e[1];t=Array.isArray(this.axes)?this.axes.map((t,n)=>ly(t,e[n].shape.length)):[ly(this.axes,n.shape.length),ly(this.axes,r.shape.length)],this.normalize&&(n=io(n,t[0]),r=io(r,t[1]));var a=n,s=r,i=t;if(a.shape.length>3||s.shape.length>3)throw new rD("batchDot is not implemented for tensors of 4D or higher rank yet");if(rR.util.assert(a.shape.length>=2,()=>`batchDot requires the rank of x to be >= 2, but got ${a.shape.length}`),rR.util.assert(a.shape.length>=2,()=>`batchDot requires the rank of y to be >= 2, but got ${s.shape.length}`),"number"==typeof i&&(i=[i,i]),"complex64"===a.dtype||"complex64"===s.dtype)throw new rD("batchDot is not implemented for complex64-type Tensors yet.");let o=a.shape.length,l=s.shape.length;null==i&&(i=[o-1,l-2]);let u=i;return r$.tidy(()=>{let e,t;if(o>l){e=o-l;let t=[];for(let n=0;n<e;++n)t.push(1);s=E.reshape(s,s.shape.concat(t))}else if(l>o){e=l-o;let t=[];for(let n=0;n<e;++n)t.push(1);a=E.reshape(a,a.shape.concat(t))}else e=0;if(2===a.shape.length&&2===s.shape.length)t=u[0]===u[1]?F.sum(b.mul(a,s),u[0]):F.sum(b.mul(e$.transpose(a,[1,0]),s),u[1]);else{let e=u[0]!==a.shape.length-1,n=u[1]===s.shape.length-1;t=Q.matMul(a,s,e,n)}if(e>0){let n;n=o>l?o+l-3:o-1;let r=[];for(let t=n;t<n+e;++t)r.push(t);t=rw.squeeze(t,r)}return 1===t.shape.length&&(t=nl.expandDims(t,1)),t})}interpretAxes(e,t){return Array.isArray(this.axes)?this.axes:[ly(this.axes,e.length),ly(this.axes,t.length)]}computeOutputShape(e){rR.util.assert(Array.isArray(e)&&2===e.length&&Array.isArray(e[0])&&Array.isArray(e[1]),()=>"A `Dot` layer should be called on a list of exactly 2 inputs.");let t=e[0].slice(),n=e[1].slice();if(t.length>3||n.length>3)throw new rD("Dot layer does not support tensors of 4D or higher rank yet.");let r=this.interpretAxes(t,n);t.splice(r[0],1),n.splice(r[1],1),n.splice(0,1);let a=t.concat(n);return 1===a.length&&a.push(1),a}computeMask(e,t){return null}getConfig(){let e={axes:this.axes,normalize:this.normalize};return Object.assign(e,super.getConfig()),e}}lb.className="Dot",rJ.registerClass(lb);var rJ=rJ;class lv extends sx{constructor(e){super(e),this.supportsMasking=!0,this.stddev=e.stddev}computeOutputShape(e){return e}getConfig(){let e=super.getConfig(),t={stddev:this.stddev};return Object.assign(t,e),t}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e);return aV(()=>(0,P.add)(a_(n.shape,0,this.stddev),n),()=>n,t.training||!1)})}}lv.className="GaussianNoise",rJ.registerClass(lv);class lw extends sx{constructor(e){super(e),this.supportsMasking=!0,this.rate=e.rate}computeOutputShape(e){return e}getConfig(){let e=super.getConfig(),t={rate:this.rate};return Object.assign(t,e),t}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t);let n=sa(e);return this.rate>0&&this.rate<1?aV(()=>{let e=Math.sqrt(this.rate/(1-this.rate));return(0,b.mul)(n,a_(n.shape,1,e))},()=>n,t.training||!1):n})}}lw.className="GaussianDropout",rJ.registerClass(lw);class lI extends sx{constructor(e){super(e),this.supportsMasking=!0,this.rate=e.rate,this.noiseShape=e.noiseShape}_getNoiseShape(e){return this.noiseShape||sa(e).shape}computeOutputShape(e){return e}getConfig(){let e=super.getConfig(),t={rate:this.rate};return Object.assign(t,e),t}call(e,t){return(0,r$.tidy)(()=>{if(this.rate<1&&this.rate>0){let n=this._getNoiseShape(e);return aV(()=>{let t=sa(e),r=(0,ei.greaterEqual)((0,au.randomUniform)(n),this.rate);r=aR(r,"float32");let a=((1-this.rate)*(1+3.09091329228798*this.rate))**-.5,s=-(-1.7580993408473766*a)*this.rate,i=(0,P.add)((0,b.mul)(t,r),(0,b.mul)((0,P.add)(r,-1),-1.7580993408473766));return(0,P.add)((0,b.mul)(i,a),s)},()=>sa(e),t.training||!1)}return e})}}lI.className="AlphaDropout",rJ.registerClass(lI);var lC=e.i(762452),lk=e.i(239197),lS=e.i(147311),lT=e.i(876852),rJ=rJ;function lN(e,t,n,r,a,s=.001){let i;if(2===e.rank)i=lS.batchNorm2d(e,t,n,r,a,s);else if(3===e.rank)i=lk.batchNorm3d(e,t,n,r,a,s);else if(4===e.rank)i=lC.batchNorm4d(e,t,n,r,a,s);else throw new rD(`batchNormalization is not implemented for array of rank ${e.rank} yet`);return i}class l$ extends sx{constructor(e){null==e&&(e={}),super(e),this.supportsMasking=!0,this.axis=null==e.axis?-1:e.axis,this.momentum=null==e.momentum?.99:e.momentum,this.epsilon=null==e.epsilon?.001:e.epsilon,this.center=null==e.center||e.center,this.scale=null==e.scale||e.scale,this.betaInitializer=st(e.betaInitializer||"zeros"),this.gammaInitializer=st(e.gammaInitializer||"ones"),this.movingMeanInitializer=st(e.movingMeanInitializer||"zeros"),this.movingVarianceInitializer=st(e.movingVarianceInitializer||"ones"),this.betaConstraint=sD(e.betaConstraint),this.gammaConstraint=sD(e.gammaConstraint),this.betaRegularizer=oI(e.betaRegularizer),this.gammaRegularizer=oI(e.gammaRegularizer)}build(e){e=ss(e);let t=this.axis>=0?this.axis:this.axis+e.length,n=e[t];if(null==n)throw new rF(`Axis ${t} of input tensor should have a defined dimension but the layer received an input with shape ${JSON.stringify(e)}.`);this.inputSpec=[new sd({ndim:e.length,axes:{[t]:n}})];let r=[n];this.scale&&(this.gamma=this.addWeight("gamma",r,null,this.gammaInitializer,this.gammaRegularizer,!0,this.gammaConstraint)),this.center&&(this.beta=this.addWeight("beta",r,null,this.betaInitializer,this.betaRegularizer,!0,this.betaConstraint)),this.movingMean=this.addWeight("moving_mean",r,null,this.movingMeanInitializer,null,!1),this.movingVariance=this.addWeight("moving_variance",r,null,this.movingVarianceInitializer,null,!1),this.built=!0}call(e,t){return(0,r$.tidy)(()=>{let n=null!=t.training&&t.training,r=sa(e),a=r.shape,s=a.length,i=aT(0,s),o=this.axis>=0?this.axis:this.axis+s;i.splice(o,1);let l=rz(1,s);l[o]=a[o];let u=i.slice();u.sort();let h=!rR.util.arraysEqual(u,aT(0,s).slice(0,s-1)),p=()=>h?lN(r,(0,E.reshape)(this.movingMean.read(),l),(0,E.reshape)(this.movingVariance.read(),l),this.center?(0,E.reshape)(this.beta.read(),l):null,this.scale?(0,E.reshape)(this.gamma.read(),l):null,this.epsilon):lN(r,this.movingMean.read(),this.movingVariance.read(),null==this.beta?null:this.beta.read(),null==this.gamma?null:this.gamma.read(),this.epsilon);if(!n)return p();let[d,c,f]=function(e,t,n,r,a=.001){return rR.util.arraysEqual(r.slice().sort(),aT(0,e.rank-1))?function(e,t,n,r,a=.001){return(0,r$.tidy)(()=>{let s=lT.moments(e,r),i=s.mean,o=s.variance;return[lN(e,i,o,n,t,a),i,o]})}(e,t,n,r,a):function(e,t,n,r,a=.001){return(0,r$.tidy)(()=>{let s=lT.moments(e,r),i=s.mean,o=s.variance,l=[];for(let t of aT(0,e.rank))-1!==r.indexOf(t)?l.push(1):l.push(e.shape[t]);let u=(0,E.reshape)(i,l),h=(0,E.reshape)(o,l),p=null==t?null:(0,E.reshape)(t,l);return[lN(e,u,h,null==n?null:(0,E.reshape)(n,l),p,a),i,o]})}(e,t,n,r,a)}(r,this.gamma.read(),this.beta.read(),i,this.epsilon),m=(e,t,n)=>{r$.tidy(()=>{let r=e.read(),a=b.mul(N.sub(r,t),1-n);e.write(N.sub(r,a))})};return m(this.movingMean,c,this.momentum),m(this.movingVariance,f,this.momentum),d})}getConfig(){let e={axis:this.axis,momentum:this.momentum,epsilon:this.epsilon,center:this.center,scale:this.scale,betaInitializer:rV(this.betaInitializer),gammaInitializer:rV(this.gammaInitializer),movingMeanInitializer:rV(this.movingMeanInitializer),movingVarianceInitializer:rV(this.movingVarianceInitializer),betaRegularizer:rV(this.betaRegularizer),gammaRegularizer:rV(this.gammaRegularizer),betaConstraint:rV(this.betaConstraint),gammaConstraint:rV(this.gammaConstraint)};return Object.assign(e,super.getConfig()),e}}l$.className="BatchNormalization",rJ.registerClass(l$);class lR extends sx{constructor(e){if(null==e&&(e={}),super(e),this.axis=null==e.axis?-1:e.axis,"number"==typeof this.axis){if(!Number.isInteger(this.axis))throw Error(`Expected axis to be an integer, but received ${this.axis}`)}else if(Array.isArray(this.axis)){for(const e of this.axis)if(!Number.isInteger(e))throw Error(`Expected axis to be an array of integers, but received ${JSON.stringify(this.axis)}`)}else throw Error(`Expected axis to be an integer or an array of integers, but received ${JSON.stringify(this.axis)}`);this.epsilon=null==e.epsilon?.001:e.epsilon,this.center=null==e.center||e.center,this.scale=null==e.scale||e.scale,this.betaInitializer=st(e.betaInitializer||"zeros"),this.gammaInitializer=st(e.gammaInitializer||"ones"),this.betaRegularizer=oI(e.betaRegularizer),this.gammaRegularizer=oI(e.gammaRegularizer),this.supportsMasking=!0}build(e){let t=(e=ss(e)).length;"number"==typeof this.axis&&(this.axis=[this.axis]);for(let e=0;e<this.axis.length;++e)this.axis[e]<0&&(this.axis[e]+=t);for(let e of this.axis)if(e<0||e>=t)throw Error(`Invalid axis: ${e}`);if(this.axis.length!==rj(this.axis).length)throw Error(`Found duplicate axes in: ${this.axis}`);let n=this.axis.map(t=>e[t]);this.scale?this.gamma=this.addWeight("gamma",n,"float32",this.gammaInitializer,this.gammaRegularizer,!0):this.gamma=null,this.center?this.beta=this.addWeight("beta",n,"float32",this.betaInitializer,this.betaRegularizer,!0):this.beta=null,this.built=!0}call(e,t){let n=sa(e),r=n.shape,a=r.length;return(0,r$.tidy)(()=>{let{mean:e,variance:t}=(0,lT.moments)(n,this.axis,!0),s=rz(1,a);for(let e of this.axis)s[e]=r[e];let i=e=>null!=e&&e.shape.length!==a?E.reshape(e,s):e,o=this.scale?i(this.gamma.read()):null,l=this.center?i(this.beta.read()):null,u=[],h=[];for(let e=0;e<a;++e)-1!==this.axis.indexOf(e)?(u.push(r[e]),h.push(1)):(u.push(1),h.push(r[e]));return e=eU.tile(e,u),t=eU.tile(t,u),null!=o&&(o=eU.tile(o,h)),null!=l&&(l=eU.tile(l,h)),lN(n,e,t,l,o,this.epsilon)})}getConfig(){let e={axis:this.axis,epsilon:this.epsilon,center:this.center,scale:this.scale,betaInitializer:rV(this.betaInitializer),gammaInitializer:rV(this.gammaInitializer),betaRegularizer:rV(this.betaRegularizer),gammaRegularizer:rV(this.gammaRegularizer)};return Object.assign(e,super.getConfig()),e}}lR.className="LayerNormalization",rJ.registerClass(lR);var rJ=rJ;class lA extends sx{constructor(e){if(null==e&&(e={}),super(e),this.dataFormat=null==e.dataFormat?a$():e.dataFormat,null==e.padding)this.padding=[[1,1],[1,1]];else if("number"==typeof e.padding)this.padding=[[e.padding,e.padding],[e.padding,e.padding]];else{let t,n;if(e.padding=e.padding,2!==e.padding.length)throw new rF(`ZeroPadding2D expects padding to be a length-2 array, but received a length-${e.padding.length} array.`);if("number"==typeof e.padding[0])t=[e.padding[0],e.padding[0]],n=[e.padding[1],e.padding[1]];else{if(e.padding=e.padding,2!==e.padding[0].length)throw new rF(`ZeroPadding2D expects height padding to be a length-2 array, but received a length-${e.padding[0].length} array.`);if(t=e.padding[0],2!==e.padding[1].length)throw new rF(`ZeroPadding2D expects width padding to be a length-2 array, but received a length-${e.padding[1].length} array.`);n=e.padding[1]}this.padding=[t,n]}this.inputSpec=[new sd({ndim:4})]}computeOutputShape(e){let t,n;return(e=ss(e),"channelsFirst"===this.dataFormat)?(t=null!=e[2]&&e[2]>=0?e[2]+this.padding[0][0]+this.padding[0][1]:null,n=null!=e[3]&&e[3]>=0?e[3]+this.padding[1][0]+this.padding[1][1]:null,[e[0],e[1],t,n]):(t=null!=e[1]&&e[1]>=0?e[1]+this.padding[0][0]+this.padding[0][1]:null,n=null!=e[2]&&e[2]>=0?e[2]+this.padding[1][0]+this.padding[1][1]:null,[e[0],t,n,e[3]])}call(e,t){return(0,r$.tidy)(()=>{var t,n,r;return t=sa(e),n=this.padding,r=this.dataFormat,(0,r$.tidy)(()=>{let e;if(4!==t.rank)throw new rF(`temporalPadding expects input tensor to be 4-D, but received a ${t.rank}-D tensor.`);if(null==n&&(n=[[1,1],[1,1]]),2!==n.length||2!==n[0].length||2!==n[1].length)throw new rF("spatial2dPadding expects `padding` to be an Array of two Arrays, each of which is an Array of two integers.");if(null==r&&(r=a$()),"channelsLast"!==r&&"channelsFirst"!==r)throw new rF(`Unknown data format: ${r}. Supported data formats are 'channelsLast' and 'channelsFirst.`);return e="channelsFirst"===r?[[0,0],[0,0],n[0],n[1]]:[[0,0],n[0],n[1],[0,0]],tZ.pad(t,e)})})}getConfig(){let e={padding:this.padding,dataFormat:this.dataFormat};return Object.assign(e,super.getConfig()),e}}lA.className="ZeroPadding2D",rJ.registerClass(lA);var lE=e.i(217896),lF=e.i(264564),rJ=rJ;function lD(e,t,n,r,a,s){return(0,r$.tidy)(()=>{let i;r9(a),ae(s),r7(r),null==n&&(n=[1,1]),null==r&&(r="valid"),null==a&&(a=a$()),null==s&&(s="max"),e=oO(e,a);let o="same"===r?"same":"valid";return i="max"===s?n4.maxPool(e,t,n,o):nN.avgPool(e,t,n,o),"channelsFirst"===a&&(i=e$.transpose(i,[0,3,1,2])),i})}function lO(e,t,n,r,a,s){return(0,r$.tidy)(()=>{let i;r9(a),ae(s),r7(r),null==n&&(n=[1,1,1]),null==r&&(r="valid"),null==a&&(a=a$()),null==s&&(s="max"),e=oL(e,a);let o="same"===r?"same":"valid";return i="max"===s?lF.maxPool3d(e,t,n,o):lE.avgPool3d(e,t,n,o),"channelsFirst"===a&&(i=e$.transpose(i,[0,4,1,2,3])),i})}class lL extends sx{constructor(e){if(null==e.poolSize&&(e.poolSize=2),super(e),"number"==typeof e.poolSize)this.poolSize=[e.poolSize];else if(Array.isArray(e.poolSize)&&1===e.poolSize.length&&"number"==typeof e.poolSize[0])this.poolSize=e.poolSize;else throw new rF(`poolSize for 1D convolutional layer must be a number or an Array of a single number, but received ${JSON.stringify(e.poolSize)}`);if(rY(this.poolSize,"poolSize"),null==e.strides)this.strides=this.poolSize;else if("number"==typeof e.strides)this.strides=[e.strides];else if(Array.isArray(e.strides)&&1===e.strides.length&&"number"==typeof e.strides[0])this.strides=e.strides;else throw new rF(`strides for 1D convolutional layer must be a number or an Array of a single number, but received ${JSON.stringify(e.strides)}`);rY(this.strides,"strides"),this.padding=null==e.padding?"valid":e.padding,r7(this.padding),this.inputSpec=[new sd({ndim:3})]}computeOutputShape(e){let t=oF((e=ss(e))[1],this.poolSize[0],this.padding,this.strides[0]);return[e[0],t,e[2]]}call(e,t){return(0,r$.tidy)(()=>{this.invokeCallHook(e,t),e=aA(sa(e),2);let n=this.poolingFunction(sa(e),[this.poolSize[0],1],[this.strides[0],1],this.padding,"channelsLast");return rw.squeeze(n,[2])})}getConfig(){let e={poolSize:this.poolSize,padding:this.padding,strides:this.strides};return Object.assign(e,super.getConfig()),e}}class lz extends lL{constructor(e){super(e)}poolingFunction(e,t,n,r,a){return r9(a),r7(r),lD(e,t,n,r,a,"max")}}lz.className="MaxPooling1D",rJ.registerClass(lz);class l_ extends lL{constructor(e){super(e)}poolingFunction(e,t,n,r,a){return r9(a),r7(r),lD(e,t,n,r,a,"avg")}}l_.className="AveragePooling1D",rJ.registerClass(l_);class lM extends sx{constructor(e){if(null==e.poolSize&&(e.poolSize=[2,2]),super(e),this.poolSize=Array.isArray(e.poolSize)?e.poolSize:[e.poolSize,e.poolSize],null==e.strides)this.strides=this.poolSize;else if(Array.isArray(e.strides)){if(2!==e.strides.length)throw new rF(`If the strides property of a 2D pooling layer is an Array, it is expected to have a length of 2, but received length ${e.strides.length}.`);this.strides=e.strides}else this.strides=[e.strides,e.strides];rY(this.poolSize,"poolSize"),rY(this.strides,"strides"),this.padding=null==e.padding?"valid":e.padding,this.dataFormat=null==e.dataFormat?"channelsLast":e.dataFormat,r9(this.dataFormat),r7(this.padding),this.inputSpec=[new sd({ndim:4})]}computeOutputShape(e){e=ss(e);let t="channelsFirst"===this.dataFormat?e[2]:e[1],n="channelsFirst"===this.dataFormat?e[3]:e[2];return(t=oF(t,this.poolSize[0],this.padding,this.strides[0]),n=oF(n,this.poolSize[1],this.padding,this.strides[1]),"channelsFirst"===this.dataFormat)?[e[0],e[1],t,n]:[e[0],t,n,e[3]]}call(e,t){return(0,r$.tidy)(()=>(this.invokeCallHook(e,t),this.poolingFunction(sa(e),this.poolSize,this.strides,this.padding,this.dataFormat)))}getConfig(){let e={poolSize:this.poolSize,padding:this.padding,strides:this.strides,dataFormat:this.dataFormat};return Object.assign(e,super.getConfig()),e}}class lP extends lM{constructor(e){super(e)}poolingFunction(e,t,n,r,a){return r9(a),r7(r),lD(e,t,n,r,a,"max")}}lP.className="MaxPooling2D",rJ.registerClass(lP);class lB extends lM{constructor(e){super(e)}poolingFunction(e,t,n,r,a){return r9(a),r7(r),lD(e,t,n,r,a,"avg")}}lB.className="AveragePooling2D",rJ.registerClass(lB);class lW extends sx{constructor(e){if(null==e.poolSize&&(e.poolSize=[2,2,2]),super(e),this.poolSize=Array.isArray(e.poolSize)?e.poolSize:[e.poolSize,e.poolSize,e.poolSize],null==e.strides)this.strides=this.poolSize;else if(Array.isArray(e.strides)){if(3!==e.strides.length)throw new rF(`If the strides property of a 3D pooling layer is an Array, it is expected to have a length of 3, but received length ${e.strides.length}.`);this.strides=e.strides}else this.strides=[e.strides,e.strides,e.strides];rY(this.poolSize,"poolSize"),rY(this.strides,"strides"),this.padding=null==e.padding?"valid":e.padding,this.dataFormat=null==e.dataFormat?"channelsLast":e.dataFormat,r9(this.dataFormat),r7(this.padding),this.inputSpec=[new sd({ndim:5})]}computeOutputShape(e){e=ss(e);let t="channelsFirst"===this.dataFormat?e[2]:e[1],n="channelsFirst"===this.dataFormat?e[3]:e[2],r="channelsFirst"===this.dataFormat?e[4]:e[3];return(t=oF(t,this.poolSize[0],this.padding,this.strides[0]),n=oF(n,this.poolSize[1],this.padding,this.strides[1]),r=oF(r,this.poolSize[2],this.padding,this.strides[2]),"channelsFirst"===this.dataFormat)?[e[0],e[1],t,n,r]:[e[0],t,n,r,e[4]]}call(e,t){return(0,r$.tidy)(()=>(this.invokeCallHook(e,t),this.poolingFunction(sa(e),this.poolSize,this.strides,this.padding,this.dataFormat)))}getConfig(){let e={poolSize:this.poolSize,padding:this.padding,strides:this.strides,dataFormat:this.dataFormat};return Object.assign(e,super.getConfig()),e}}class lG extends lW{constructor(e){super(e)}poolingFunction(e,t,n,r,a){return r9(a),r7(r),lO(e,t,n,r,a,"max")}}lG.className="MaxPooling3D",rJ.registerClass(lG);class lU extends lW{constructor(e){super(e)}poolingFunction(e,t,n,r,a){return r9(a),r7(r),lO(e,t,n,r,a,"avg")}}lU.className="AveragePooling3D",rJ.registerClass(lU);class lV extends sx{constructor(e){super(e),this.inputSpec=[new sd({ndim:3})]}computeOutputShape(e){return[e[0],e[2]]}call(e,t){throw new rD}}class lH extends lV{constructor(e){super(e||{})}call(e,t){return(0,r$.tidy)(()=>{let t=sa(e);return n6.mean(t,1)})}}lH.className="GlobalAveragePooling1D",rJ.registerClass(lH);class lq extends lV{constructor(e){super(e||{})}call(e,t){return(0,r$.tidy)(()=>{let t=sa(e);return n5.max(t,1)})}}lq.className="GlobalMaxPooling1D",rJ.registerClass(lq);class lj extends sx{constructor(e){super(e),this.dataFormat=null==e.dataFormat?"channelsLast":e.dataFormat,r9(this.dataFormat),this.inputSpec=[new sd({ndim:4})]}computeOutputShape(e){return"channelsLast"===this.dataFormat?[e[0],e[3]]:[e[0],e[1]]}call(e,t){throw new rD}getConfig(){let e={dataFormat:this.dataFormat};return Object.assign(e,super.getConfig()),e}}class lX extends lj{call(e,t){return(0,r$.tidy)(()=>{let t=sa(e);return"channelsLast"===this.dataFormat?n6.mean(t,[1,2]):n6.mean(t,[2,3])})}}lX.className="GlobalAveragePooling2D",rJ.registerClass(lX);class lK extends lj{call(e,t){return(0,r$.tidy)(()=>{let t=sa(e);return"channelsLast"===this.dataFormat?n5.max(t,[1,2]):n5.max(t,[2,3])})}}lK.className="GlobalMaxPooling2D",rJ.registerClass(lK);var rJ=rJ;class lY extends sx{constructor(e){super(e),this.layer=e.layer}build(e){this.built=!0}get trainable(){return null!=this.layer&&this.layer.trainable}set trainable(e){null!=this.layer&&(this.layer.trainable=e)}get trainableWeights(){return this.layer.trainableWeights}get nonTrainableWeights(){return this.layer.nonTrainableWeights}get updates(){return this.layer._updates}get losses(){return this.layer.losses}getWeights(){return this.layer.getWeights()}setWeights(e){this.layer.setWeights(e)}getConfig(){let e={layer:{className:this.layer.getClassName(),config:this.layer.getConfig()}};return Object.assign(e,super.getConfig()),e}setFastWeightInitDuringBuild(e){super.setFastWeightInitDuringBuild(e),null!=this.layer&&this.layer.setFastWeightInitDuringBuild(e)}static fromConfig(e,t,n={}){let r=is(t.layer,n);delete t.layer;let a={layer:r};return Object.assign(a,t),new e(a)}}class lZ extends lY{constructor(e){super(e),this.supportsMasking=!0}build(e){if((e=ss(e)).length<3)throw new rF(`TimeDistributed layer expects an input shape >= 3D, but received input shape ${JSON.stringify(e)}`);this.inputSpec=[{shape:e}];let t=[e[0]].concat(e.slice(2));this.layer.built||(this.layer.build(t),this.layer.built=!0),super.build(e)}computeOutputShape(e){let t=[(e=ss(e))[0]].concat(e.slice(2)),n=this.layer.computeOutputShape(t),r=e[1];return[n[0],r].concat(n.slice(1))}call(e,t){return(0,r$.tidy)(()=>oY((e,n)=>[sa(this.layer.call(e,t)),[]],e=sa(e),[],!1,null,null,!1,!0)[1])}}lZ.className="TimeDistributed",rJ.registerClass(lZ);class lJ extends lY{constructor(e){super(e);const t=e.layer.getConfig(),n={};n.className=e.layer.getClassName(),n.config=t,this.forwardLayer=is(n),t.goBackwards=!0!==t.goBackwards;const r={};if(r.className=e.layer.getClassName(),r.config=t,this.backwardLayer=is(r),this.forwardLayer.name="forward_"+this.forwardLayer.name,this.backwardLayer.name="backward_"+this.backwardLayer.name,this.mergeMode=void 0===e.mergeMode?"concat":e.mergeMode,rX(r6,"BidirectionalMergeMode",this.mergeMode),e.weights)throw new rD("weights support is not implemented for Bidirectional layer yet.");this._stateful=e.layer.stateful,this.returnSequences=e.layer.returnSequences,this.returnState=e.layer.returnState,this.supportsMasking=!0,this._trainable=!0,this.inputSpec=e.layer.inputSpec,this.numConstants=null}get trainable(){return this._trainable}set trainable(e){this._trainable=e,null!=this.forwardLayer&&(this.forwardLayer.trainable=e),null!=this.backwardLayer&&(this.backwardLayer.trainable=e)}getWeights(){return this.forwardLayer.getWeights().concat(this.backwardLayer.getWeights())}setWeights(e){let t=Math.floor(e.length/2);this.forwardLayer.setWeights(e.slice(0,t)),this.backwardLayer.setWeights(e.slice(t))}computeOutputShape(e){let t,n,r,a=this.forwardLayer.computeOutputShape(e);return(Array.isArray(a)&&Array.isArray(a[0])||(a=[a]),this.returnState&&(r=a.slice(1)),t=a[0],"concat"===this.mergeMode?(t[t.length-1]*=2,n=[t]):n=null==this.mergeMode?[t,t.slice()]:[t],this.returnState)?null==this.mergeMode?n.concat(r).concat(r.slice()):[t].concat(r).concat(r.slice()):rP(n)}apply(e,t){let n=null==t?null:t.initialState,r=null==t?null:t.constants;null==t&&(t={});let a=oK(e,n,r,this.numConstants);if(e=a.inputs,n=a.initialState,r=a.constants,Array.isArray(e)&&(n=e.slice(1),e=e[0]),(null==n||0===n.length)&&null==r)return super.apply(e,t);let s=[],i=[];if(null!=n){let e=n.length;if(e%2>0)throw new rF("When passing `initialState` to a Bidrectional RNN, the state should be an Array containing the states of the underlying RNNs.");t.initialState=n,s.push(...n);let r=n.map(e=>new sd({shape:e.shape}));this.forwardLayer.stateSpec=r.slice(0,e/2),this.backwardLayer.stateSpec=r.slice(e/2),i.push(...r)}if(null!=r)throw new rD("Support for constants in Bidirectional layers is not implemented yet.");let o=s[0]instanceof sc;for(let e of s)if(e instanceof sc!==o)throw new rF("The initial state of a Bidirectional layer cannot be specified as a mix of symbolic and non-symbolic tensors");if(!o)return super.apply(e,t);{let n=[e].concat(s),r=this.inputSpec.concat(i),a=this.inputSpec;this.inputSpec=r;let o=super.apply(n,t);return this.inputSpec=a,o}}call(e,t){return(0,r$.tidy)(()=>{let n,r,a,s,i=t.initialState;if(null==i)n=this.forwardLayer.call(e,t),r=this.backwardLayer.call(e,t);else{let a=i.slice(0,i.length/2),s=i.slice(i.length/2);n=this.forwardLayer.call(e,Object.assign(t,{initialState:a})),r=this.backwardLayer.call(e,Object.assign(t,{initialState:s}))}return(this.returnState&&(Array.isArray(n)&&(a=n.slice(1).concat(r.slice(1))),n=n[0],r=r[0]),this.returnSequences&&(r=t_.reverse(r,1)),"concat"===this.mergeMode?s=aO([n,r]):"sum"===this.mergeMode?s=P.add(n,r):"ave"===this.mergeMode?s=b.mul(.5,P.add(n,r)):"mul"===this.mergeMode?s=b.mul(n,r):null==this.mergeMode&&(s=[n,r]),this.returnState)?null==this.mergeMode?s.concat(a):[s].concat(a):s})}resetStates(e){this.forwardLayer.resetStates(),this.backwardLayer.resetStates()}build(e){an(this.forwardLayer.name,()=>{this.forwardLayer.build(e)}),an(this.backwardLayer.name,()=>{this.backwardLayer.build(e)}),this.built=!0}computeMask(e,t){let n;if(Array.isArray(t)&&(t=t[0]),n=this.returnSequences?null==this.mergeMode?[t,t]:t:null==this.mergeMode?[null,null]:null,!this.returnState)return n;{let e=this.forwardLayer.states.map(e=>null);return Array.isArray(n)?n.concat(e).concat(e):[n].concat(e).concat(e)}}get trainableWeights(){return this.forwardLayer.trainableWeights.concat(this.backwardLayer.trainableWeights)}get nonTrainableWeights(){return this.forwardLayer.nonTrainableWeights.concat(this.backwardLayer.nonTrainableWeights)}setFastWeightInitDuringBuild(e){super.setFastWeightInitDuringBuild(e),null!=this.forwardLayer&&this.forwardLayer.setFastWeightInitDuringBuild(e),null!=this.backwardLayer&&this.backwardLayer.setFastWeightInitDuringBuild(e)}getConfig(){let e={mergeMode:this.mergeMode};return Object.assign(e,super.getConfig()),e}static fromConfig(e,t){let n=is(t.layer);if(delete t.layer,null!=t.numConstants)throw new rD("Deserialization of a Bidirectional layer with numConstants present is not supported yet.");return t.layer=n,new e(t)}}lJ.className="Bidirectional",rJ.registerClass(lJ);var rJ=rJ;class lQ extends sx{constructor(e){super(e),this.scale=e.scale,e.offset?this.offset=e.offset:this.offset=0}getConfig(){let e={scale:this.scale,offset:this.offset};return Object.assign(e,super.getConfig()),e}call(e,t){return(0,r$.tidy)(()=>("float32"!==(e=sa(e)).dtype&&(e=aR(e,"float32")),(0,P.add)((0,b.mul)(e,this.scale),this.offset)))}}lQ.className="Rescaling",rJ.registerClass(lQ);var rJ=rJ,l0=e.i(861392),l1=e.i(528280);let{resizeBilinear:l2,cropAndResize:l3}=al.image;class l4 extends sx{constructor(e){super(e),this.height=e.height,this.width=e.width}centerCrop(e,t,n,r,a,s,i,o){return(0,r$.tidy)(()=>{let l,u=!1,h=[t/s,n/i,(r+t)/s,(a+n)/i],p=[];3===e.rank?(u=!0,l=(0,eH.stack)([e])):l=e;for(let e=0;e<l.shape[0];e++)p.push(h);let d=l3(l,(0,l0.tensor)(p,[p.length,4]),(0,l1.range)(0,p.length,1,"int32"),[r,a],"nearest");return u?aR(sa((0,tv.unstack)(d)),o):aR(d,o)})}upsize(e,t,n,r){return(0,r$.tidy)(()=>aR(l2(e,[t,n]),r))}call(e,t){return(0,r$.tidy)(()=>{let t=sa(e),n=t.dtype,r=t.shape,a=r[r.length-3],s=r[r.length-2],i=0;a!==this.height&&(i=Math.floor((a-this.height)/2));let o=0;return(s!==this.width&&0===(o=Math.floor((s-this.width)/2))&&(o=1),i>=0&&o>=0)?this.centerCrop(t,i,o,this.height,this.width,a,s,n):this.upsize(e,this.height,this.width,n)})}getConfig(){let e={height:this.height,width:this.width};return Object.assign(e,super.getConfig()),e}computeOutputShape(e){let t=(e=ss(e)).length-3,n=e.length-2;return e[t]=this.height,e[n]=this.width,e}}l4.className="CenterCrop",rJ.registerClass(l4);var rJ=rJ,l5=e.i(570097);class l6 extends sx{constructor(e){super(e),this.numTokens=e.numTokens,e.outputMode?this.outputMode=e.outputMode:this.outputMode="multiHot"}getConfig(){let e={numTokens:this.numTokens,outputMode:this.outputMode};return Object.assign(e,super.getConfig()),e}computeOutputShape(e){return null==(e=ss(e))?[this.numTokens]:("oneHot"===this.outputMode&&1!==e[e.length-1]?e.push(this.numTokens):e[e.length-1]=this.numTokens,e)}call(e,t){return(0,r$.tidy)(()=>{let n;if("int32"!==(e=sa(e)).dtype&&(e=aR(e,"int32")),void 0!==t.countWeights){if("count"!==this.outputMode)throw new rF(`countWeights is not used when outputMode !== count.
              Received countWeights=${t.countWeights}`);n=sa(t.countWeights)}let r=(0,n5.max)(e),a=(0,n8.min)(e),s=(0,e1.greater)(this.numTokens,r).bufferSync().get(0),i=(0,ei.greaterEqual)(a,0).bufferSync().get(0);if(!(s&&i))throw new rF(`Input values must be between 0 < values <= numTokens with numTokens=${this.numTokens}`);return function(e,t,n,r){let a,s=sa(e);if("int32"!==s.dtype&&(s=aR(s,"int32")),"int"===t)return s;let i=s.shape;if(0===s.rank&&(s=(0,nl.expandDims)(s,-1)),"oneHot"===t&&1!==s.shape[s.shape.length-1]&&(s=(0,nl.expandDims)(s,-1)),s.rank>2)throw new rF(`When outputMode is not int, maximum output rank is 2 Received outputMode ${t} and input shape ${i} which would result in output rank ${s.rank}.`);let o=["multiHot","oneHot"].includes(t),l=s;if(a=void 0!==r&&"count"===t?(0,l5.denseBincount)(l,r,n,o):(0,l5.denseBincount)(l,[],n,o),"tfIdf"!==t)return a;if(r)return(0,b.mul)(a,r);throw new rF("When outputMode is 'tfIdf', weights must be provided.")}(e,this.outputMode,this.numTokens,n)})}}l6.className="CategoryEncoding",rJ.registerClass(l6);var rJ=rJ;let l8=new Set(["bilinear","nearest"]);class l9 extends sx{constructor(e){if(super(e),this.height=e.height,this.width=e.width,e.interpolation)if(l8.has(e.interpolation))this.interpolation=e.interpolation;else throw new rF(`Invalid interpolation parameter: ${e.interpolation} is not implemented`);else this.interpolation="bilinear";this.cropToAspectRatio=!!e.cropToAspectRatio}computeOutputShape(e){let t=(e=ss(e))[2];return[this.height,this.width,t]}getConfig(){let e={height:this.height,width:this.width,interpolation:this.interpolation,cropToAspectRatio:this.cropToAspectRatio};return Object.assign(e,super.getConfig()),e}call(e,t){return(0,r$.tidy)(()=>{let t=[this.height,this.width];if("bilinear"===this.interpolation)return al.image.resizeBilinear(e,t,!this.cropToAspectRatio);if("nearest"===this.interpolation)return al.image.resizeNearestNeighbor(e,t,!this.cropToAspectRatio);throw Error(`Interpolation is ${this.interpolation} but only ${[...l8]} are supported`)})}}l9.className="Resizing",rJ.registerClass(l9);var rJ=rJ;class l7{constructor(e){this.seed=e}next(){if(void 0!==this.seed)return this.seed++}}l7.className="RandomSeed";class ue extends sx{constructor(e){super(e),this.randomGenerator=new l7(e.seed)}getConfig(){let e={seed:this.randomGenerator.seed};return Object.assign(e,super.getConfig()),e}}ue.className="BaseRandomLayer";let ut=new Set(["bilinear","nearest"]);class un extends ue{constructor(e){super(e);const{factor:t,interpolation:n="bilinear"}=e;if(this.factor=t,Array.isArray(this.factor)&&2===this.factor.length)this.widthLower=this.factor[0],this.widthUpper=this.factor[1];else if(!Array.isArray(this.factor)&&this.factor>0)this.widthLower=-this.factor,this.widthUpper=this.factor;else throw new rF(`Invalid factor: ${this.factor}. Must be positive number or tuple of 2 numbers`);if(this.widthLower<-1||this.widthUpper<-1)throw new rF(`factor must have values larger than -1. Got: ${this.factor}`);if(this.widthUpper<this.widthLower)throw new rF(`factor cannot have upper bound less than lower bound.
        Got upper bound: ${this.widthUpper}.
        Got lower bound: ${this.widthLower}
      `);if(n)if(ut.has(n))this.interpolation=n;else throw new rF(`Invalid interpolation parameter: ${n} is not implemented`)}getConfig(){let e={factor:this.factor,interpolation:this.interpolation};return Object.assign(e,super.getConfig()),e}computeOutputShape(e){let t=(e=ss(e))[2];return[this.imgHeight,-1,t]}call(e,t){return(0,r$.tidy)(()=>{let t=sa(e);this.imgHeight=t.shape[t.shape.length-3];let n=t.shape[t.shape.length-2];this.widthFactor=(0,au.randomUniform)([1],1+this.widthLower,1+this.widthUpper,"float32",this.randomGenerator.next());let r=this.widthFactor.dataSync()[0]*n;r=Math.round(r);let a=[this.imgHeight,r];switch(this.interpolation){case"bilinear":return al.image.resizeBilinear(e,a);case"nearest":return al.image.resizeNearestNeighbor(e,a);default:throw Error(`Interpolation is ${this.interpolation}
          but only ${[...ut]} are supported`)}})}}function ur(e){return new sy(e)}function ua(e){return new oT(e)}function us(e){return new oC(e)}function ui(e){return new ok(e)}function uo(e){return new oS(e)}function ul(e){return new o$(e)}function uu(e){return new oN(e)}function uh(e){return new oH(e)}function up(e){return new oP(e)}function ud(e){return new oW(e)}function uc(e){return new oB(e)}function uf(e){return new oG(e)}function um(e){return new oV(e)}function ug(e){return new oq(e)}function ux(e){return new oj(e)}function uy(e){return new oX(e)}function ub(e){return new ls(e)}function uv(e){return new lr(e)}function uw(e){return new lt(e)}function uI(e){return new ln(e)}function uC(e){return new la(e)}function uk(e){return new li(e)}function uS(e){return new lo(e)}function uT(e){return new ll(e)}function uN(e){return new lh(e)}function u$(e){return new ld(e)}function uR(e){return new lf(e)}function uA(e){return new lx(e)}function uE(e){return new lm(e)}function uF(e){return new lg(e)}function uD(e){return new lc(e)}function uO(e){return new lb(e)}function uL(e){return new l$(e)}function uz(e){return new lR(e)}function u_(e){return new lA(e)}function uM(e){return new l_(e)}function uP(e){return uM(e)}function uB(e){return uM(e)}function uW(e){return new lB(e)}function uG(e){return uW(e)}function uU(e){return uW(e)}function uV(e){return new lU(e)}function uH(e){return uV(e)}function uq(e){return uV(e)}function uj(e){return new lH(e)}function uX(e){return new lX(e)}function uK(e){return new lq(e)}function uY(e){return new lK(e)}function uZ(e){return new lz(e)}function uJ(e){return new lP(e)}function uQ(e){return new lG(e)}function u0(e){return new o2(e)}function u1(e){return new o1(e)}function u2(e){return new o4(e)}function u3(e){return new o3(e)}function u4(e){return new o0(e)}function u5(e){return new oQ(e)}function u6(e){return new le(e)}function u8(e){return new o7(e)}function u9(e){return new oZ(e)}function u7(e){return new o5(e)}function he(e){return new lJ(e)}function ht(e){return new lZ(e)}function hn(e){return new lv(e)}function hr(e){return new lw(e)}function ha(e){return new lI(e)}function hs(e){return new lu(e)}function hi(e){return new lQ(e)}function ho(e){return new l4(e)}function hl(e){return new l9(e)}function hu(e){return new l6(e)}function hh(e){return new un(e)}un.className="RandomWidth",rJ.registerClass(un),e.s(["activation",()=>ub,"add",()=>u$,"alphaDropout",()=>ha,"average",()=>uR,"averagePooling1d",()=>uM,"averagePooling2d",()=>uW,"averagePooling3d",()=>uV,"avgPool1d",()=>uP,"avgPool2d",()=>uG,"avgPool3d",()=>uH,"avgPooling1d",()=>uB,"avgPooling2d",()=>uU,"avgPooling3d",()=>uq,"batchNormalization",()=>uL,"bidirectional",()=>he,"categoryEncoding",()=>hu,"centerCrop",()=>ho,"concatenate",()=>uA,"conv1d",()=>uh,"conv2d",()=>up,"conv2dTranspose",()=>ud,"conv3d",()=>uc,"conv3dTranspose",()=>uf,"convLstm2d",()=>u6,"convLstm2dCell",()=>u8,"cropping2D",()=>ug,"dense",()=>uv,"depthwiseConv2d",()=>uy,"dot",()=>uO,"dropout",()=>uw,"elu",()=>ua,"embedding",()=>uN,"flatten",()=>uC,"gaussianDropout",()=>hr,"gaussianNoise",()=>hn,"globalAveragePooling1d",()=>uj,"globalAveragePooling2d",()=>uX,"globalMaxPool1d",0,uK,"globalMaxPool2d",0,uY,"globalMaxPooling1d",()=>uK,"globalMaxPooling2d",()=>uY,"gru",()=>u0,"gruCell",()=>u1,"inputLayer",()=>ur,"layerNormalization",()=>uz,"leakyReLU",()=>ui,"lstm",()=>u2,"lstmCell",()=>u3,"masking",()=>hs,"maxPool1d",0,uZ,"maxPool2d",0,uJ,"maxPooling1d",()=>uZ,"maxPooling2d",()=>uJ,"maxPooling3d",()=>uQ,"maximum",()=>uE,"minimum",()=>uF,"multiply",()=>uD,"permute",()=>uT,"prelu",()=>uo,"randomWidth",()=>hh,"reLU",()=>us,"repeatVector",()=>uk,"rescaling",()=>hi,"reshape",()=>uS,"resizing",()=>hl,"rnn",()=>u9,"separableConv2d",()=>um,"simpleRNN",()=>u4,"simpleRNNCell",()=>u5,"softmax",()=>ul,"spatialDropout1d",()=>uI,"stackedRNNCells",()=>u7,"thresholdedReLU",()=>uu,"timeDistributed",()=>ht,"upSampling2d",()=>ux,"zeroPadding2d",()=>u_],70517),e.i(70517),e.s(["Layer",()=>sx,"RNN",()=>oZ,"RNNCell",()=>oJ,"activation",()=>ub,"add",()=>u$,"alphaDropout",()=>ha,"average",()=>uR,"averagePooling1d",()=>uM,"averagePooling2d",()=>uW,"averagePooling3d",()=>uV,"avgPool1d",()=>uP,"avgPool2d",()=>uG,"avgPool3d",()=>uH,"avgPooling1d",()=>uB,"avgPooling2d",()=>uU,"avgPooling3d",()=>uq,"batchNormalization",()=>uL,"bidirectional",()=>he,"categoryEncoding",()=>hu,"centerCrop",()=>ho,"concatenate",()=>uA,"conv1d",()=>uh,"conv2d",()=>up,"conv2dTranspose",()=>ud,"conv3d",()=>uc,"conv3dTranspose",()=>uf,"convLstm2d",()=>u6,"convLstm2dCell",()=>u8,"cropping2D",()=>ug,"dense",()=>uv,"depthwiseConv2d",()=>uy,"dot",()=>uO,"dropout",()=>uw,"elu",()=>ua,"embedding",()=>uN,"flatten",()=>uC,"gaussianDropout",()=>hr,"gaussianNoise",()=>hn,"globalAveragePooling1d",()=>uj,"globalAveragePooling2d",()=>uX,"globalMaxPool1d",0,uK,"globalMaxPool2d",0,uY,"globalMaxPooling1d",()=>uK,"globalMaxPooling2d",()=>uY,"gru",()=>u0,"gruCell",()=>u1,"input",()=>i5,"inputLayer",()=>ur,"layerNormalization",()=>uz,"leakyReLU",()=>ui,"lstm",()=>u2,"lstmCell",()=>u3,"masking",()=>hs,"maxPool1d",0,uZ,"maxPool2d",0,uJ,"maxPooling1d",()=>uZ,"maxPooling2d",()=>uJ,"maxPooling3d",()=>uQ,"maximum",()=>uE,"minimum",()=>uF,"multiply",()=>uD,"permute",()=>uT,"prelu",()=>uo,"randomWidth",()=>hh,"reLU",()=>us,"repeatVector",()=>uk,"rescaling",()=>hi,"reshape",()=>uS,"resizing",()=>hl,"rnn",()=>u9,"separableConv2d",()=>um,"simpleRNN",()=>u4,"simpleRNNCell",()=>u5,"softmax",()=>ul,"spatialDropout1d",()=>uI,"stackedRNNCells",()=>u7,"thresholdedReLU",()=>uu,"timeDistributed",()=>ht,"upSampling2d",()=>ux,"zeroPadding2d",()=>u_],238477);var hp=e.i(238477);function hd(e,t){return iy(e,t)}function hc(e,t){return ic(e,t)}function hf(e,t){return iC(e,t)}function hm(e,t){return ib(e,t)}function hg(e,t){return ip(e,t)}function hx(e,t){return iw(e,t)}function hy(e,t){return(0,r$.tidy)(()=>{let n=iv(e,t),r=(0,r$.tidy)(()=>y.cast(F.sum(el.logicalAnd(e9.equal(e,1),e9.equal(t,0))),"float32")),a=P.add(n,r);return y.cast(eu.where(e1.greater(a,0),I.div(n,a),0),"float32")})}function hb(e,t){return im(e,t)}function hv(e,t){return iu(e,t)}function hw(e,t){return ih(e,t)}function hI(e,t){return ih(e,t)}function hC(e,t){return ih(e,t)}function hk(e,t){return il(e,t)}function hS(e,t){return il(e,t)}function hT(e,t){return il(e,t)}function hN(e,t){return(0,r$.tidy)(()=>{let n=e.sub(t).square().sum(),r=e.sub(e.mean()).square().sum();return k.scalar(1).sub(n.div(r))})}e.s(["MAPE",()=>hI,"MSE",()=>hS,"binaryAccuracy",()=>hd,"binaryCrossentropy",()=>hc,"categoricalAccuracy",()=>hm,"categoricalCrossentropy",()=>hg,"cosineProximity",()=>hb,"mape",()=>hC,"meanAbsoluteError",()=>hv,"meanAbsolutePercentageError",()=>hw,"meanSquaredError",()=>hk,"mse",()=>hT,"precision",()=>hx,"r2Score",()=>hN,"recall",()=>hy,"sparseCategoricalAccuracy",()=>hf],521017);var h$=e.i(521017);e.s([],162301),e.i(162301),e.s(["modelFromJSON",()=>iQ],184652);var hR=e.i(184652);function hA(e){return new ob(e)}function hE(e){return ox(e),new ob({l1:null!=e?e.l1:null,l2:0})}function hF(e){return ox(e),new ob({l2:null!=e?e.l2:null,l1:0})}e.s(["l1",()=>hE,"l1l2",()=>hA,"l2",()=>hF],902061);var hD=e.i(902061);class hO extends s4{constructor(){super(...arguments),this.model=null}setModel(e){if(!(e instanceof iZ))throw Error("model must be a LayersModel, not some other Container");this.model=e}}function hL(e,t){return e<t}function hz(e,t){return e>t}class h_ extends hO{constructor(e){if(super(),null==e&&(e={}),e.restoreBestWeights)throw new rD("restoreBestWeights = True is not implemented in EarlyStopping yet.");this.monitor=e.monitor||"val_loss",this.minDelta=Math.abs(e.minDelta||0),this.patience=e.patience||0,this.verbose=e.verbose||0,this.mode=e.mode||"auto",this.baseline=e.baseline,-1===["auto","min","max"].indexOf(this.mode)&&(console.warn(`EarlyStopping mode '${this.mode}' is invalid. Falling back to mode 'auto'.`),this.mode="auto"),"min"===this.mode?this.monitorFunc=hL:"max"===this.mode||-1!==this.monitor.indexOf("acc")?this.monitorFunc=hz:this.monitorFunc=hL,this.monitorFunc===hL&&(this.minDelta*=-1)}async onTrainBegin(e){this.wait=0,this.stoppedEpoch=0,null!=this.baseline?this.best=this.baseline:this.best=this.monitorFunc===hL?1/0:-1/0}async onEpochEnd(e,t){await s2(t);let n=this.getMonitorValue(t);null!=n&&(this.monitorFunc(n-this.minDelta,this.best)?(this.best=n,this.wait=0):(this.wait++,this.wait>=this.patience&&(this.stoppedEpoch=e,this.model.stopTraining=!0)))}async onTrainEnd(e){this.stoppedEpoch>0&&this.verbose&&console.log(`Epoch ${this.stoppedEpoch}: early stopping.`)}getMonitorValue(e){null==e&&(e={});let t=e[this.monitor];return null==t&&console.warn(`Metric for EarlyStopping ${this.monitor} is not available. Available metrics are: ${Object.keys(e)}`),t}}e.s([],180338),e.i(139515);var hM=e.i(347713),hP=e.i(744877),hP=hP;function hB(e,t,n=new Map,r=new Set){if(null==e)return null;if("function"==typeof Blob&&e instanceof Blob)return e.slice();if(r.has(e))throw Error("Circular references are not supported.");if(n.has(e))return n.get(e);let a=t(e);if(a.recurse&&null!==a.value)throw Error("A deep map function may not return both a value and recurse=true.");if(!a.recurse)return n.set(e,a.value),a.value;if(hU(e)){let a=Array.isArray(e)?[]:{};for(let s in r.add(e),e){let i=hB(e[s],t,n,r);a[s]=i}return r.delete(e),e.__proto__&&(a.__proto__=e.__proto__),a}throw Error(`Can't recurse into non-iterable type: ${e}`)}function hW(e){return null===e?null:hU(e[0])?{value:null,recurse:!0}:{value:e,recurse:!1}}async function hG(e,t){let n=new Map;for(let r of(hB(e,t,n),Array.from(n.keys()))){let e=n.get(r);if(rR.util.isPromise(e)){let t=await e;n.set(r,t)}}return hB(e,t,n)}function hU(e){let t=!1;if(rN.env().get("IS_BROWSER"))t=e instanceof TextDecoder;else{let{StringDecoder:n}={};t=e instanceof n}return null!=e&&!ArrayBuffer.isView(e)&&(Array.isArray(e)||"object"==typeof e&&!(e instanceof nm.Tensor)&&!(e instanceof Promise)&&!t)}function hV(e){return e instanceof nm.Tensor?{value:e.clone(),recurse:!1}:hU(e)?{value:null,recurse:!0}:{value:e,recurse:!1}}class hH{constructor(e){if(this.capacity=e,this.begin=0,this.end=0,null==e)throw RangeError("Can't create a ring buffer of unknown capacity.");if(e<1)throw RangeError("Can't create ring buffer of capacity < 1.");this.data=Array(e),this.doubledCapacity=2*e}wrap(e){for(;e<0;)e+=this.doubledCapacity;return e%this.doubledCapacity}get(e){if(e<0)throw RangeError("Can't get item at a negative index.");return this.data[e%this.capacity]}set(e,t){if(e<0)throw RangeError("Can't set item at a negative index.");this.data[e%this.capacity]=t}length(){let e=this.end-this.begin;return e<0&&(e=this.doubledCapacity+e),e}isFull(){return this.length()===this.capacity}isEmpty(){return 0===this.length()}push(e){if(this.isFull())throw RangeError("Ring buffer is full.");this.set(this.end,e),this.end=this.wrap(this.end+1)}pushAll(e){for(let t of e)this.push(t)}pop(){if(this.isEmpty())throw RangeError("Ring buffer is empty.");this.end=this.wrap(this.end-1);let e=this.get(this.end);return this.set(this.end,void 0),e}unshift(e){if(this.isFull())throw RangeError("Ring buffer is full.");this.begin=this.wrap(this.begin-1),this.set(this.begin,e)}shift(){if(this.isEmpty())throw RangeError("Ring buffer is empty.");let e=this.get(this.begin);return this.set(this.begin,void 0),this.begin=this.wrap(this.begin+1),e}shuffleExcise(e){if(this.isEmpty())throw RangeError("Ring buffer is empty.");let t=this.wrap(this.begin+e),n=this.get(t);return this.set(t,this.pop()),n}}class hq extends hH{constructor(){super(hq.INITIAL_CAPACITY)}isFull(){return!1}push(e){super.isFull()&&this.expand(),super.push(e)}unshift(e){super.isFull()&&this.expand(),super.unshift(e)}expand(){let e=2*this.capacity,t=Array(e),n=this.length();for(let e=0;e<n;e++)t[e]=this.get(this.wrap(this.begin+e));this.data=t,this.capacity=e,this.doubledCapacity=2*this.capacity,this.begin=0,this.end=n}}hq.INITIAL_CAPACITY=32;class hj{async toArray(){let e=[],t=await this.next();for(;!t.done;)e.push(t.value),t=await this.next();return e}async toArrayForTest(){let e=this.prefetch(100),t=[],n=await e.next();for(;!n.done;)t.push(n.value),n=await e.next();return t}async resolveFully(){let e=await this.next();for(;!e.done;)e=await this.next()}async resolveWhile(e){let t=await this.next(),n=e(t.value);for(;!t.done&&n;)n=e((t=await this.next()).value)}handleErrors(e){return new h2(this,e)}filter(e){return new h0(this,e)}map(e){return new h1(this,e)}mapAsync(e){return new h3(this,e)}serialMapAsync(e){return new h3(this,e).serial()}flatmap(e){return new h5(this,e)}async forEachAsync(e){return this.map(e).resolveFully()}async serialForEach(e){return this.serialMapAsync(e).resolveWhile(e=>!0===e)}rowMajorBatch(e,t=!0){return new hQ(this,e,t)}columnMajorBatch(e,t=!0,n=hW){return this.rowMajorBatch(e,t).map(e=>(function(e,t=hW){return function e(t,n,r=new Set){let a=t[0];if(r.has(a))throw Error("Circular references are not supported.");let s=n(t);if(s.recurse&&null!==s.value)throw Error("A deep zip function may not return both a value and recurse=true.");if(!s.recurse)return s.value;if(hU(a)){let s=Array.isArray(a)?[]:{};for(let i in r.add(a),a){let a=e(t.map(e=>e[i]),n,r);s[i]=a}return r.delete(a),s}throw Error(`Can't recurse into non-iterable type: ${a}`)}(e,t)})(e,n))}concatenate(e,t){return new h6(new hX([this,e]),t)}take(e){return e<0||null==e?this:new hJ(this,e)}skip(e){return e<0||null==e?this:new hZ(this,e)}prefetch(e){return new h9(this,e)}shuffle(e,t){return new h7(this,e,t)}serial(){return new hY(this)}}class hX extends hj{constructor(e){super(),this.items=e,this.trav=0}summary(){return`Array of ${this.items.length} items`}async next(){if(this.trav>=this.items.length)return{value:null,done:!0};let e=this.items[this.trav];return this.trav++,{value:hB(e,hV),done:!1}}}class hK extends hj{constructor(e){super(),this.nextFn=e}summary(){return"Function call"}async next(){try{return this.nextFn()}catch(e){throw e.message=`Error thrown while iterating through a dataset: ${e.message}`,e}}}class hY extends hj{constructor(e){super(),this.upstream=e,this.lastRead=Promise.resolve({value:null,done:!1})}summary(){return`${this.upstream.summary()} -> Serial`}async next(){return this.lastRead=this.lastRead.then(()=>this.serialNext()),this.lastRead}async serialNext(){return this.upstream.next()}}class hZ extends hj{constructor(e,t){super(),this.upstream=e,this.maxCount=t,this.count=0,this.lastRead=Promise.resolve({value:null,done:!1})}summary(){return`${this.upstream.summary()} -> Skip`}async next(){return this.lastRead=this.lastRead.then(()=>this.serialNext()),this.lastRead}async serialNext(){for(;this.count++<this.maxCount;){let e=await this.upstream.next();if(e.done)return e;r$.dispose(e.value)}return this.upstream.next()}}class hJ extends hj{constructor(e,t){super(),this.upstream=e,this.maxCount=t,this.count=0}summary(){return`${this.upstream.summary()} -> Take`}async next(){return this.count++>=this.maxCount?{value:null,done:!0}:this.upstream.next()}}class hQ extends hj{constructor(e,t,n=!0){super(),this.upstream=e,this.batchSize=t,this.enableSmallLastBatch=n,this.lastRead=Promise.resolve({value:null,done:!1})}summary(){return`${this.upstream.summary()} -> RowMajorBatch`}async next(){return this.lastRead=this.lastRead.then(()=>this.serialNext()),this.lastRead}async serialNext(){let e=[];for(;e.length<this.batchSize;){let t=await this.upstream.next();if(t.done){if(this.enableSmallLastBatch&&e.length>0)return{value:e,done:!1};return{value:null,done:!0}}e.push(t.value)}return{value:e,done:!1}}}class h0 extends hj{constructor(e,t){super(),this.upstream=e,this.predicate=t,this.lastRead=Promise.resolve({value:null,done:!1})}summary(){return`${this.upstream.summary()} -> Filter`}async next(){return this.lastRead=this.lastRead.then(()=>this.serialNext()),this.lastRead}async serialNext(){for(;;){let e=await this.upstream.next();if(e.done||this.predicate(e.value))return e;r$.dispose(e.value)}}}class h1 extends hj{constructor(e,t){super(),this.upstream=e,this.transform=t}summary(){return`${this.upstream.summary()} -> Map`}async next(){let e=await this.upstream.next();if(e.done)return{value:null,done:!0};let t=hP.getTensorsInContainer(e.value),n=this.transform(e.value),r=hP.getTensorsInContainer(n);for(let e of t)hP.isTensorInList(e,r)||e.dispose();return{value:n,done:!1}}}class h2 extends hj{constructor(e,t){super(),this.upstream=e,this.handler=t,this.count=0,this.lastRead=Promise.resolve({value:null,done:!1})}summary(){return`${this.upstream.summary()} -> handleErrors`}async next(){return this.lastRead=this.lastRead.then(()=>this.serialNext()),this.lastRead}async serialNext(){for(;;)try{return await this.upstream.next()}catch(e){if(!this.handler(e))return{value:null,done:!0}}}}class h3 extends hj{constructor(e,t){super(),this.upstream=e,this.transform=t}summary(){return`${this.upstream.summary()} -> AsyncMap`}async next(){let e=await this.upstream.next();if(e.done)return{value:null,done:!0};let t=hP.getTensorsInContainer(e.value),n=await this.transform(e.value),r=hP.getTensorsInContainer(n);for(let e of t)hP.isTensorInList(e,r)||e.dispose();return{value:n,done:!1}}}class h4 extends hj{constructor(){super(),this.outputQueue=new hq,this.lastRead=Promise.resolve({value:null,done:!1})}async next(){return this.lastRead=this.lastRead.then(()=>this.serialNext()),this.lastRead}async serialNext(){for(;0===this.outputQueue.length();)if(!await this.pump())return{value:null,done:!0};return{value:this.outputQueue.shift(),done:!1}}}class h5 extends h4{constructor(e,t){super(),this.upstream=e,this.transform=t}summary(){return`${this.upstream.summary()} -> Flatmap`}async pump(){let e=await this.upstream.next();if(e.done)return!1;let t=hP.getTensorsInContainer(e.value),n=this.transform(e.value),r=hP.getTensorsInContainer(n);for(let e of(this.outputQueue.pushAll(n),t))hP.isTensorInList(e,r)||e.dispose();return!0}}class h6 extends hj{constructor(e,t){super(),this.baseErrorHandler=t,this.lastRead=null,this.iterator=null,this.moreIterators=e}summary(){return"TODO: fill in upstream of chained summaries -> Chained"}async next(){return this.lastRead=this.readFromChain(this.lastRead),this.lastRead}async readFromChain(e){if(await e,null==this.iterator){let e=await this.moreIterators.next();if(e.done)return{value:null,done:!0};this.iterator=e.value,null!=this.baseErrorHandler&&(this.iterator=this.iterator.handleErrors(this.baseErrorHandler))}let t=await this.iterator.next();return t.done?(this.iterator=null,this.readFromChain(e)):t}}(i=d||(d={}))[i.FAIL=0]="FAIL",i[i.SHORTEST=1]="SHORTEST",i[i.LONGEST=2]="LONGEST";class h8 extends hj{constructor(e,t=d.FAIL){super(),this.iterators=e,this.mismatchMode=t,this.count=0,this.currentPromise=null}summary(){return"{TODO: fill in upstream of zip summaries} -> Zip"}async nextState(e){await e;let t=0,n=0,r=await hG(this.iterators,function(e){return e instanceof hj?{value:e.next().then(e=>(t++,e.done&&n++,e.value)),recurse:!1}:{value:null,recurse:!0}});if(t===n)return{value:null,done:!0};if(n>0)switch(this.mismatchMode){case d.FAIL:throw Error(`Zipped streams should have the same length. Mismatched at element ${this.count}.`);case d.SHORTEST:return{value:null,done:!0};case d.LONGEST:}return this.count++,{value:r,done:!1}}async next(){return this.currentPromise=this.nextState(this.currentPromise),this.currentPromise}}class h9 extends hj{constructor(e,t){super(),this.upstream=e,this.bufferSize=t,this.buffer=new hH(t)}summary(){return`${this.upstream.summary()} -> Prefetch`}refill(){for(;!this.buffer.isFull();){let e=this.upstream.next();this.buffer.push(e)}}next(){return this.refill(),this.buffer.shift()}}class h7 extends h9{constructor(e,t,n){super(e,t),this.upstream=e,this.windowSize=t,this.upstreamExhausted=!1,this.random=hM.alea(n||rR.util.now().toString()),this.lastRead=Promise.resolve({value:null,done:!1})}async next(){return this.lastRead=this.lastRead.then(()=>this.serialNext()),this.lastRead}randomInt(e){return Math.floor(this.random()*e)}chooseIndex(){return this.randomInt(this.buffer.length())}async serialNext(){for(this.upstreamExhausted||this.refill();!this.buffer.isEmpty();){let e=this.chooseIndex(),t=await this.buffer.shuffleExcise(e);if(!t.done)return this.refill(),t;this.upstreamExhausted=!0}return{value:null,done:!0}}}class pe{constructor(){this.size=null}batch(e,t=!0){let n=this;return rR.util.assert(e>0,()=>`batchSize needs to be positive, but it is
      ${e}`),pt(async()=>(await n.iterator()).columnMajorBatch(e,t,pa),this.size===1/0||null==this.size?this.size:t?Math.ceil(this.size/e):Math.floor(this.size/e))}concatenate(e){let t=this;return pt(async()=>(await t.iterator()).concatenate(await e.iterator()),this.size===1/0||e.size===1/0?1/0:null!=this.size&&null!=e.size?this.size+e.size:null)}filter(e){let t=this;return pt(async()=>(await t.iterator()).filter(t=>r$.tidy(()=>e(t))),this.size===1/0?1/0:null)}async forEachAsync(e){return(await this.iterator()).forEachAsync(e)}map(e){let t=this;return pt(async()=>(await t.iterator()).map(t=>r$.tidy(()=>e(t))),this.size)}mapAsync(e){let t=this;return pt(async()=>(await t.iterator()).mapAsync(e),this.size)}prefetch(e){if(null==e)throw RangeError("`Dataset.prefetch()` requires bufferSize to be specified.");let t=this;return pt(async()=>(await t.iterator()).prefetch(e),this.size)}repeat(e){let t=this;return pt(async()=>new h6(new hK(async()=>({value:await t.iterator(),done:!1})).take(e),void 0),null!=this.size&&e>0?this.size*e:0===e?0:null!=this.size&&(void 0===e||e<0)?1/0:null)}skip(e){let t=this;return pt(async()=>(await t.iterator()).skip(e),null!=this.size&&e>=0&&this.size>=e?this.size-e:null!=this.size&&(this.size<e||void 0===e||e<0)?0:null)}shuffle(e,t,n=!0){if(null==e||e<0)if(null==this.size)throw RangeError("`Dataset.shuffle()` requires bufferSize to be specified.");else throw RangeError(`\`Dataset.shuffle()\` requires bufferSize to be specified.  If your data fits in main memory (for regular JS objects), and/or GPU memory (for \`tf.Tensor\`s), consider setting bufferSize to the dataset size (${this.size} elements)`);let r=this,a=hM.alea(t||rR.util.now().toString());return pt(async()=>{let t=a.int32();return n&&(t+=a.int32()),(await r.iterator()).shuffle(e,t.toString())},this.size)}take(e){let t=this;return pt(async()=>(await t.iterator()).take(e),null!=this.size&&this.size>e?e:null!=this.size&&this.size<=e?this.size:null)}async toArray(){if(this.size===1/0)throw Error("Can not convert infinite data stream to array.");return(await this.iterator()).toArray()}async toArrayForTest(){if(this.size===1/0)throw Error("Can not convert infinite data stream to array.");return(await this.iterator()).toArrayForTest()}}function pt(e,t=null){return new class extends pe{constructor(){super(...arguments),this.size=t}async iterator(){return e()}}}function pn(e){return pt(async()=>new hX(e),e.length)}function pr(e){let t;if(!hU(e))throw Error("The argument to zip() must be an object or array.");if(Array.isArray(e))for(let n=0;n<e.length;n++)t=null==t?e[n].size:Math.min(t,e[n].size);else if(e instanceof Object)for(let n in e)t=null==t?e[n].size:Math.min(t,e[n].size);return pt(async()=>(function(e,t=d.FAIL){return new h8(e,t)})(await hG(e,e=>{if(e instanceof pe)return{value:e.iterator(),recurse:!1};if(hU(e))return{value:null,recurse:!0};throw Error("Leaves of the structure passed to zip() must be Datasets, not primitives.")}),d.SHORTEST),t)}function pa(e){var t,n;if(null===e)return null;return null==(t=e[0])||null===(n=t)||"object"!=typeof n&&"function"!=typeof n||Array.isArray(t)||"object"==typeof t&&t instanceof nm.Tensor||rR.util.isTypedArray(t)?{value:function(e){if(0===e.length)throw Error("Can't make a batch of zero elements.");return e[0]instanceof nm.Tensor?eH.stack(e):l0.tensor(e)}(e),recurse:!1}:{value:null,recurse:!0}}pe.MAX_BUFFER_SIZE=1e4;class ps extends pe{constructor(e){super(),this.input=e}async iterator(){return(await this.input.iterator()).decodeUTF8().split("\n").map(e=>(e.endsWith("\r")&&(e=e.slice(0,-1)),e))}}let pi=Symbol("out"),po=Symbol("field"),pl=Symbol("quote"),pu=Symbol("quoteafterquote"),ph=Symbol("quoteinquote");class pp extends pe{async columnNames(){return this.columnNamesValidated||await this.setColumnNames(),this.configuredColumnsOnly?Object.keys(this.columnConfigs):this.fullColumnNames}async setColumnNames(){let e=await this.maybeReadHeaderLine();if(this.fullColumnNames||e)this.fullColumnNames&&e&&rR.util.assert(e.length===this.fullColumnNames.length,()=>"The length of provided columnNames ("+this.fullColumnNames.length.toString()+") does not match the length of the header line read from file ("+e.length.toString()+").");else throw Error("Column names must be provided if there is no header line.");this.fullColumnNames||(this.fullColumnNames=e);let t=this.fullColumnNames.reduce((e,t)=>(e[t]=e[t]+1||1,e),{}),n=Object.keys(t).filter(e=>t[e]>1);if(rR.util.assert(0===n.length,()=>"Duplicate column names found: "+n.toString()),this.columnConfigs){for(let e of Object.keys(this.columnConfigs))if(-1===this.fullColumnNames.indexOf(e))throw Error('The key "'+e+'" provided in columnConfigs does not match any of the column names ('+this.fullColumnNames.toString()+").")}this.columnNamesValidated=!0}async maybeReadHeaderLine(){if(!this.hasHeader)return null;{let e=await this.base.iterator(),t=await e.next();if(t.done)throw Error("No data was found for CSV parsing.");let n=t.value;return this.parseRow(n,!1)}}constructor(e,t){super(),this.input=e,this.hasHeader=!0,this.fullColumnNames=null,this.columnNamesValidated=!1,this.columnConfigs=null,this.configuredColumnsOnly=!1,this.delimiter=",",this.delimWhitespace=!1,this.base=new ps(e),t||(t={}),this.hasHeader=!1!==t.hasHeader,this.fullColumnNames=t.columnNames,this.columnConfigs=t.columnConfigs,this.configuredColumnsOnly=t.configuredColumnsOnly,t.delimWhitespace?(rR.util.assert(null==t.delimiter,()=>"Delimiter should not be provided when delimWhitespace is true."),this.delimWhitespace=!0,this.delimiter=" "):this.delimiter=t.delimiter?t.delimiter:","}async iterator(){this.columnNamesValidated||await this.setColumnNames();let e=await this.base.iterator();return this.hasHeader&&(e=e.skip(1)),e.map(e=>this.makeDataElement(e))}makeDataElement(e){let t=this.parseRow(e),n={},r={};for(let a=0;a<this.fullColumnNames.length;a++){let s=this.fullColumnNames[a],i=this.columnConfigs?this.columnConfigs[s]:null;if(!this.configuredColumnsOnly||i){let o=t[a],l=null;if(""===o)if(i&&void 0!==i.default)l=i.default;else if(i&&(i.required||i.isLabel))throw Error(`Required column ${s} is empty in this line: ${e}`);else l=void 0;else{let e=Number(o);if(isNaN(e))l=i&&"bool"===i.dtype?this.getBoolean(o):o;else if(i&&i.dtype)switch(i.dtype){case"float32":default:l=e;break;case"int32":l=Math.floor(e);break;case"bool":l=this.getBoolean(o)}else l=e}i&&i.isLabel?r[s]=l:n[s]=l}}return 0===Object.keys(r).length?n:{xs:n,ys:r}}getBoolean(e){return+("1"===e||"true"===e.toLowerCase())}parseRow(e,t=!0){let n=[],r=0,a=e.length,s=pi;for(let t=0;t<a;t++)switch(s){case pi:switch(e.charAt(t)){case'"':r=t+1,s=pl;break;case this.delimiter:if(r=t+1," "===this.delimiter&&this.delimWhitespace)break;n.push(""),s=pi;break;default:s=po,r=t}break;case po:e.charAt(t)===this.delimiter&&(n.push(e.substring(r,t)),s=pi,r=t+1);break;case pl:'"'===e.charAt(t)&&(s=pu);break;case pu:switch(e.charAt(t)){case this.delimiter:n.push(e.substring(r,t-1)),s=pi,r=t+1;break;case'"':s=pl;break;default:s=ph}break;case ph:'"'===e.charAt(t)&&(s=pl)}if(s===pu?n.push(e.substring(r,a-1)):n.push(e.substring(r)),t&&n.length!==this.fullColumnNames.length)throw Error(`Invalid row in csv file. Should have ${this.fullColumnNames.length} elements in a row, but got ${n}`);return n}}class pd extends hj{constructor(e){super(),this.microphoneConfig=e,this.isClosed=!1,this.fftSize=e.fftSize||1024;const t=Math.log2(this.fftSize);if(this.fftSize<0||t<4||t>14||!Number.isInteger(t))throw Error(`Invalid fftSize: it must be a power of 2 between 2 to 4 and 2 to 14, but got ${this.fftSize}`);if(this.numFrames=e.numFramesPerSpectrogram||43,this.sampleRateHz=e.sampleRateHz,this.columnTruncateLength=e.columnTruncateLength||this.fftSize,this.audioTrackConstraints=e.audioTrackConstraints,this.smoothingTimeConstant=e.smoothingTimeConstant||0,this.includeSpectrogram=!1!==e.includeSpectrogram,this.includeWaveform=!0===e.includeWaveform,!this.includeSpectrogram&&!this.includeWaveform)throw Error("Both includeSpectrogram and includeWaveform are false. At least one type of data should be returned.")}summary(){return"microphone"}static async create(e={}){if(!(0,rN.env)().get("IS_BROWSER"))throw Error("microphone API is only supported in browser environment.");let t=new pd(e);return await t.start(),t}async start(){try{this.stream=await navigator.mediaDevices.getUserMedia({audio:null==this.audioTrackConstraints||this.audioTrackConstraints,video:!1})}catch(e){throw Error(`Error thrown while initializing video stream: ${e.message}`)}if(!this.stream)throw Error("Could not obtain audio from microphone.");let e=window.AudioContext||window.webkitAudioContext;if(this.audioContext=new e,this.sampleRateHz){if(this.audioContext.sampleRate!==this.sampleRateHz)throw Error(`Mismatch in sampling rate: Expected: ${this.sampleRateHz}; Actual: ${this.audioContext.sampleRate}`)}else this.sampleRateHz=this.audioContext.sampleRate;let t=this.audioContext.createMediaStreamSource(this.stream);this.analyser=this.audioContext.createAnalyser(),this.analyser.fftSize=2*this.fftSize,this.analyser.smoothingTimeConstant=this.smoothingTimeConstant,t.connect(this.analyser),this.freqData=new Float32Array(this.fftSize),this.timeData=new Float32Array(this.fftSize)}async next(){let e,t;if(this.isClosed)return{value:null,done:!0};let n=await this.getAudioData();if(this.includeSpectrogram){let t=this.flattenQueue(n.freqDataQueue);e=this.getTensorFromAudioDataArray(t,[this.numFrames,this.columnTruncateLength,1])}if(this.includeWaveform){let e=this.flattenQueue(n.timeDataQueue);t=this.getTensorFromAudioDataArray(e,[this.numFrames*this.fftSize,1])}return{value:{spectrogram:e,waveform:t},done:!1}}async capture(){return(await this.next()).value}async getAudioData(){let e=[],t=[],n=0;return new Promise(r=>{let a=setInterval(()=>{this.includeSpectrogram&&(this.analyser.getFloatFrequencyData(this.freqData),this.freqData[0]===-1/0&&r({freqDataQueue:e,timeDataQueue:t}),e.push(this.freqData.slice(0,this.columnTruncateLength))),this.includeWaveform&&(this.analyser.getFloatTimeDomainData(this.timeData),t.push(this.timeData.slice())),++n===this.numFrames&&(clearInterval(a),r({freqDataQueue:e,timeDataQueue:t}))},this.fftSize/this.sampleRateHz*1e3)})}stop(){!this.isClosed&&(this.isClosed=!0,this.analyser.disconnect(),this.audioContext.close(),null!=this.stream&&this.stream.getTracks().length>0&&this.stream.getTracks()[0].stop())}toArray(){throw Error("Can not convert infinite audio stream to array.")}getSampleRate(){return this.sampleRateHz}flattenQueue(e){let t=e[0].length,n=new Float32Array(e.length*t);return e.forEach((e,r)=>n.set(e,r*t)),n}getTensorFromAudioDataArray(e,t){let n=new Float32Array(rR.util.sizeFromShape(t));return n.set(e,n.length-e.length),(0,l0.tensor)(n,t)}}var pc=e.i(609068),pf=e.i(973946);class pm extends hj{constructor(e,t){if(super(),this.webcamVideoElement=e,this.webcamConfig=t,this.isClosed=!0,this.resize=!1,this.needToResize())if(this.resize=!0,this.cropSize=[this.webcamConfig.resizeHeight,this.webcamConfig.resizeWidth],this.cropBoxInd=(0,aI.tensor1d)([0],"int32"),this.webcamConfig.centerCrop){const e=this.webcamConfig.resizeWidth/this.webcamVideoElement.width,t=this.webcamConfig.resizeHeight/this.webcamVideoElement.height,n=(1-e)/2,r=(1-t)/2;this.cropBox=(0,pf.tensor2d)([r,n,t+r,n+e],[1,4])}else this.cropBox=(0,pf.tensor2d)([0,0,1,1],[1,4])}summary(){return"webcam"}static async create(e,t={}){if(!(0,rN.env)().get("IS_BROWSER"))throw Error("tf.data.webcam is only supported in browser environment.");if(!e){if(e=document.createElement("video"),!t.resizeWidth||!t.resizeHeight)throw Error("Please provide webcam video element, or resizeWidth and resizeHeight to create a hidden video element.");e.width=t.resizeWidth,e.height=t.resizeHeight}let n=new pm(e,t);return await n.start(),n}async start(){this.webcamConfig.facingMode&&rR.util.assert("user"===this.webcamConfig.facingMode||"environment"===this.webcamConfig.facingMode,()=>`Invalid webcam facing mode: ${this.webcamConfig.facingMode}. Please provide 'user' or 'environment'`);try{this.stream=await navigator.mediaDevices.getUserMedia({video:{deviceId:this.webcamConfig.deviceId,facingMode:this.webcamConfig.facingMode?this.webcamConfig.facingMode:"user",width:this.webcamVideoElement.width,height:this.webcamVideoElement.height}})}catch(e){throw e.message=`Error thrown while initializing video stream: ${e.message}`,e}if(!this.stream)throw Error("Could not obtain video from webcam.");try{this.webcamVideoElement.srcObject=this.stream}catch(e){console.log(e),this.webcamVideoElement.src=window.URL.createObjectURL(this.stream)}return this.webcamVideoElement.play(),this.isClosed=!1,new Promise(e=>{this.webcamVideoElement.onloadedmetadata=()=>{e()}})}async next(){let e;if(this.isClosed)return{value:null,done:!0};try{e=pc.browser.fromPixels(this.webcamVideoElement)}catch(e){throw Error(`Error thrown converting video to pixels: ${JSON.stringify(e)}`)}if(!this.resize)return{value:e,done:!1};try{return{value:this.cropAndResizeFrame(e),done:!1}}catch(e){throw Error(`Error thrown cropping the video: ${e.message}`)}finally{e.dispose()}}needToResize(){return!!this.webcamConfig.resizeWidth&&!!this.webcamConfig.resizeHeight&&(this.webcamVideoElement.width!==this.webcamConfig.resizeWidth||this.webcamVideoElement.height!==this.webcamConfig.resizeHeight)}cropAndResizeFrame(e){return(0,r$.tidy)(()=>{let t,n=(0,nl.expandDims)((0,y.cast)(e,"float32"),0),r=(t=al.image.cropAndResize(n,this.cropBox,this.cropBoxInd,this.cropSize,"bilinear")).shape;return(0,E.reshape)(t,r.slice(1))})}async capture(){return(await this.next()).value}stop(){this.stream.getTracks().forEach(e=>e.stop());try{this.webcamVideoElement.srcObject=null}catch(e){console.log(e),this.webcamVideoElement.src=null}this.isClosed=!0}toArray(){throw Error("Can not convert infinite video stream to array.")}}class pg{}var px=e.i(221168);class py extends hj{split(e){return new pb(this,e)}}class pb extends py{constructor(e,t){super(),this.upstream=e,this.impl=new pv(e,t)}summary(){return this.impl.summary()}async next(){return this.impl.next()}}class pv extends h4{constructor(e,t){super(),this.upstream=e,this.separator=t,this.carryover=""}summary(){return`${this.upstream.summary()} -> Split('${this.separator}')`}async pump(){let e=await this.upstream.next();if(e.done)return""!==this.carryover&&(this.outputQueue.push(this.carryover),this.carryover="",!0);let t=e.value.split(this.separator);for(let e of(t[0]=this.carryover+t[0],t.slice(0,-1)))this.outputQueue.push(e);return this.carryover=t[t.length-1],!0}}class pw extends hj{decodeUTF8(){return new pI(this)}}class pI extends py{constructor(e){super(),this.upstream=e,this.impl=new pC(e)}summary(){return this.impl.summary()}async next(){return this.impl.next()}}class pC extends h4{constructor(e){if(super(),this.upstream=e,(0,rN.env)().get("IS_BROWSER"))this.decoder=new TextDecoder("utf-8");else{const{StringDecoder:e}={};this.decoder=new e("utf8")}}summary(){return`${this.upstream.summary()} -> Utf8`}async pump(){let e,t,n=await this.upstream.next();return!n.done&&(e=n.value,t=(0,rN.env)().get("IS_BROWSER")?this.decoder.decode(e,{stream:!0}):this.decoder.write(px.Buffer.from(e.buffer)),this.outputQueue.push(t),!0)}}class pk extends pw{constructor(e,t={}){super(),this.file=e,this.options=t,rR.util.assert(e instanceof Uint8Array||!!(0,rN.env)().get("IS_BROWSER")&&(e instanceof File||e instanceof Blob),()=>"FileChunkIterator only supports File, Blob and Uint8Array right now."),this.offset=t.offset||0,this.chunkSize=t.chunkSize||1048576}summary(){return`FileChunks ${this.file}`}async next(){if(this.offset>=(this.file instanceof Uint8Array?this.file.byteLength:this.file.size))return{value:null,done:!0};let e=new Promise((e,t)=>{let n=this.offset+this.chunkSize;if(this.file instanceof Uint8Array)e(new Uint8Array(this.file.slice(this.offset,n)));else{let r=new FileReader;r.onload=n=>{let a=r.result;if(a instanceof ArrayBuffer&&(a=new Uint8Array(a)),!(a instanceof Uint8Array))return t(TypeError("FileReader returned unknown type."));e(a)},r.onabort=e=>t(Error("Aborted")),r.onerror=e=>t(Error(e.type));let a=this.file.slice(this.offset,n);r.readAsArrayBuffer(a)}this.offset=n});return{value:await e,done:!1}}}async function pS(e,t={},n){let r,a;"string"==typeof e?r=e:(r=e.url,a=pT(e));let s=await (n||rR.util.fetch)(r,a);if(s.ok)return new pk(new Uint8Array(await s.arrayBuffer()),t);throw Error(s.statusText)}let pT=e=>({method:e.method,headers:e.headers,body:e.body,mode:e.mode,credentials:e.credentials,cache:e.cache,redirect:e.redirect,referrer:e.referrer,integrity:e.integrity});function pN(e){return"string"==typeof e&&"file://"===e.slice(0,7)}class p$ extends pg{constructor(e,t={}){super(),this.input=e,this.options=t}async iterator(){return pN(this.input)&&(0,rN.env)().get("IS_NODE")&&(this.input=({}).readFileSync(this.input.slice(7))),new pk(this.input,this.options)}}class pR extends pg{constructor(e,t={}){super(),this.url=e,this.fileOptions=t}async iterator(){return pN(this.url)?new p$(this.url,this.fileOptions).iterator():pS(this.url,this.fileOptions)}}function pA(e,t={}){return new pp(new pR(e),t)}function pE(e){let t=new hK(e);return pt(async()=>t)}function pF(e){return pt(async()=>{let t=await e();return new hK(()=>t.next())})}async function pD(e,t){return pm.create(e,t)}async function pO(e){return pd.create(e)}let pL="4.22.0";e.s([],550086),e.i(550086),e.s(["CSVDataset",()=>pp,"Dataset",()=>pe,"FileDataSource",()=>p$,"TextLineDataset",()=>ps,"URLDataSource",()=>pR,"array",()=>pn,"csv",()=>pA,"func",()=>pE,"generator",()=>pF,"microphone",()=>pO,"version_data",()=>pL,"webcam",()=>pD,"zip",()=>pr],952125),e.i(952125);var tN=tN,pz=e.i(792452),p_=e.i(237005),pM=e.i(960573),pM=pM;function pP(e,t){Array.isArray(e)||(e=[e]),e.forEach(e=>{null!=e&&rR.util.assert("complex64"!==e.dtype,()=>`${t} does not support complex64 tensors in the CPU backend.`)})}let pB=pM.whereImpl;class pW extends p_.KernelBackend{nextDataId(){return pW.nextDataId++}constructor(){super(),this.blockSize=48,this.firstUse=!0,this.data=new p_.DataStorage(this,(0,r$.engine)())}write(e,t,n){this.firstUse&&(this.firstUse=!1,(0,rN.env)().get("IS_NODE")&&tN.warn("\n============================\nHi, looks like you are running TensorFlow.js in Node.js. To speed things up dramatically, install our node backend, visit https://github.com/tensorflow/tfjs-node for more details. \n============================"));let r={id:this.nextDataId()};return this.data.set(r,{values:e,dtype:n,refCount:1}),r}makeTensorInfo(e,t,n){let r;if("string"===t&&null!=n&&n.length>0&&rR.util.isString(n[0])){let a=n.map(e=>rR.util.encodeString(e));r=this.write(a,e,t)}else r=this.write(n,e,t);return{dataId:r,shape:e,dtype:t}}refCount(e){return this.data.has(e)?this.data.get(e).refCount:0}incRef(e){let t=this.data.get(e);t.refCount++}decRef(e){if(this.data.has(e)){let t=this.data.get(e);t.refCount--}}move(e,t,n,r,a){this.data.set(e,{values:t,dtype:r,refCount:a})}numDataIds(){return this.data.numDataIds()}async read(e){return this.readSync(e)}readSync(e){let{dtype:t,complexTensorInfos:n}=this.data.get(e);if("complex64"===t){let e=this.readSync(n.real.dataId),t=this.readSync(n.imag.dataId);return tN.mergeRealAndImagArrays(e,t)}return rR.util.convertBackendValuesAndArrayBuffer(this.data.get(e).values,t)}bufferSync(e){let t=this.readSync(e.dataId);if("string"===e.dtype)try{let n=t.map(e=>rR.util.decodeString(e));return(0,pz.buffer)(e.shape,e.dtype,n)}catch(e){throw Error("Failed to decode encoded string bytes into utf-8")}return(0,pz.buffer)(e.shape,e.dtype,t)}makeOutput(e,t,n){return(0,r$.engine)().makeTensorFromTensorInfo(this.makeTensorInfo(t,n,e),this)}disposeData(e,t=!1){if(this.data.has(e)){if(this.data.get(e).refCount--,!t&&this.data.get(e).refCount>0)return!1;let{complexTensorInfos:n}=this.data.get(e);null!=n&&(this.disposeData(n.real.dataId,!0),this.disposeData(n.imag.dataId,!0)),this.data.delete(e)}return!0}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId)}async time(e){let t=rR.util.now();return e(),{kernelMs:rR.util.now()-t}}memory(){return{unreliable:!0,reasons:["The reported memory is an upper bound. Due to automatic garbage collection, the true allocated memory may be less."]}}where(e){pP([e],"where");let t=this.readSync(e.dataId);return pB(e.shape,t)}dispose(){}floatPrecision(){return 32}epsilon(){return super.epsilon()}}function pG(e){let t=new Float32Array(e.length);for(let n=0;n<e.length;++n)t[n]=Math.abs(e[n]);return t}pW.nextDataId=0,e.s([],507142),e.i(507142);let pU={kernelName:x.Abs,backendName:"cpu",kernelFunc:e=>{let{x:t}=e.inputs,n=e.backend;pP(t,"abs");let r=new Float32Array(rR.util.sizeFromShape(t.shape));return r=pG(n.data.get(t.dataId).values),n.makeOutput(r,t.shape,t.dtype)}};var tN=tN;function pV(e){return(t,n,r,a,s)=>{let i=tN.assertAndGetBroadcastShape(t,n),o=i.length,l=rR.util.computeStrides(i),u=rR.util.sizeFromShape(i),h=rR.util.getTypedArrayFromDType(s,u),p=t.length,d=n.length,c=rR.util.computeStrides(t),f=rR.util.computeStrides(n),m=tN.getBroadcastDims(t,i),g=tN.getBroadcastDims(n,i);if(m.length+g.length===0)for(let t=0;t<h.length;++t)h[t]=e(r[t%r.length],a[t%a.length]);else for(let t=0;t<h.length;++t){let n=rR.util.indexToLoc(t,o,l),s=n.slice(-p);m.forEach(e=>s[e]=0);let i=rR.util.locToIndex(s,p,c),u=n.slice(-d);g.forEach(e=>u[e]=0);let x=rR.util.locToIndex(u,d,f);h[t]=e(r[i],a[x])}return[h,i]}}var tN=tN;function pH(e){let{inputs:t,backend:n}=e,{real:r,imag:a}=t,s=n.data.get(r.dataId).values,i=n.data.get(a.dataId).values,o=n.makeTensorInfo(r.shape,"complex64");return n.data.get(o.dataId).complexTensorInfos={real:n.makeTensorInfo(r.shape,"float32",s),imag:n.makeTensorInfo(a.shape,"float32",i)},o}let pq={kernelName:x.Complex,backendName:"cpu",kernelFunc:pH};function pj(e,t,n="float32"){if("complex64"===n)return pH({inputs:{real:pj(e,t,"float32"),imag:pj(e,t,"float32")},backend:e});let r=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(t),n);return e.makeTensorInfo(t,n,r)}function pX(e){let{inputs:t,backend:n}=e,{x:r}=t;return n.incRef(r.dataId),{dataId:r.dataId,shape:r.shape,dtype:r.dtype}}let pK={kernelName:x.Identity,backendName:"cpu",kernelFunc:pX};function pY(e){let{inputs:t,backend:n}=e,{input:r}=t,a=n.data.get(r.dataId).complexTensorInfos.real,s=n.data.get(a.dataId).values;return n.makeTensorInfo(a.shape,a.dtype,s)}let pZ={kernelName:x.Real,backendName:"cpu",kernelFunc:pY};function pJ(e,t,n,r){if("int32"===r)return[t,"int32",Int32Array.from(e)];if("bool"===r){let r=rR.util.toTypedArray([0],n),[a,s]=pV((e,t)=>+(e!==t))(t,[],e,r,"bool");return[s,"bool",a]}throw Error(`Error in Cast: failed to cast ${n} to ${r}`)}function pQ(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{dtype:s}=r;if("complex64"===s){if("complex64"===a.dtype)return pX({inputs:{x:a},backend:n});let e=pj(n,a.shape,a.dtype),t=pQ({inputs:{x:a},backend:n,attrs:{dtype:"float32"}}),r=pH({inputs:{real:t,imag:e},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),r}if("complex64"===a.dtype){let e=pY({inputs:{input:a},backend:n}),t=pQ({inputs:{x:e},backend:n,attrs:{dtype:s}});return n.disposeIntermediateTensorInfo(e),t}if(!rR.util.hasEncodingLoss(a.dtype,s)){let e=pX({inputs:{x:a},backend:n});return{dataId:e.dataId,shape:e.shape,dtype:s}}let[i,o,l]=pJ(n.data.get(a.dataId).values,a.shape,a.dtype,s);return n.makeTensorInfo(i,o,l)}let p0={kernelName:x.Cast,backendName:"cpu",kernelFunc:pQ};function p1(e,t,n,r){return null==n?({inputs:n,backend:a})=>{let{a:s,b:i}=n;pP([s,i],e);let o=a.data.get(s.dataId).values,l=a.data.get(i.dataId).values,u="string"===s.dtype?tN.fromUint8ToStringArray(o):o,h="string"===s.dtype?tN.fromUint8ToStringArray(l):l,p=r||s.dtype,[d,c]=t(s.shape,i.shape,u,h,p);return a.makeTensorInfo(c,p,d)}:({inputs:e,backend:a})=>{let{a:s,b:i}=e;if("complex64"===s.dtype||"complex64"===i.dtype){let e=pQ({inputs:{x:s},backend:a,attrs:{dtype:"complex64"}}),t=a.data.get(e.dataId),r=t.complexTensorInfos.real,o=t.complexTensorInfos.imag,l=a.data.get(r.dataId).values,u=a.data.get(o.dataId).values,h=pQ({inputs:{x:i},backend:a,attrs:{dtype:"complex64"}}),p=a.data.get(h.dataId),d=p.complexTensorInfos.real,c=p.complexTensorInfos.imag,f=a.data.get(d.dataId).values,m=a.data.get(c.dataId).values,[g,x,y]=n(s.shape,i.shape,l,u,f,m),b=a.makeTensorInfo(y,"float32",g),v=a.makeTensorInfo(y,"float32",x),w=pH({inputs:{real:b,imag:v},backend:a});return a.disposeIntermediateTensorInfo(e),a.disposeIntermediateTensorInfo(h),a.disposeIntermediateTensorInfo(b),a.disposeIntermediateTensorInfo(v),w}{let e=a.data.get(s.dataId).values,n=a.data.get(i.dataId).values,o=r||s.dtype,[l,u]=t(s.shape,i.shape,e,n,o);return a.makeTensorInfo(u,o,l)}}}function p2(e){return(t,n,r,a,s,i)=>{let o=tN.assertAndGetBroadcastShape(t,n),l=rR.util.sizeFromShape(o),u=o.length,h=rR.util.computeStrides(o),p=rR.util.getTypedArrayFromDType("float32",l),d=rR.util.getTypedArrayFromDType("float32",l),c=tN.getBroadcastDims(t,o),f=tN.getBroadcastDims(n,o),m=tN.mergeRealAndImagArrays(r,a),g=tN.mergeRealAndImagArrays(s,i),x=t.length,y=rR.util.computeStrides(t),b=n.length,v=rR.util.computeStrides(n);if(c.length+f.length===0)for(let t=0;t<p.length;t++){let n=t%m.length,r=t%g.length,a=e(m[2*n],m[2*n+1],g[2*r],g[2*r+1]);p[t]=a.real,d[t]=a.imag}else for(let t=0;t<p.length;t++){let n=rR.util.indexToLoc(t,u,h),r=n.slice(-x);c.forEach(e=>r[e]=0);let a=rR.util.locToIndex(r,x,y),s=n.slice(-b);f.forEach(e=>s[e]=0);let i=rR.util.locToIndex(s,b,v),o=e(m[2*a],m[2*a+1],g[2*i],g[2*i+1]);p[t]=o.real,d[t]=o.imag}return[p,d,o]}}let p3=pV((e,t)=>e+t),p4=p2((e,t,n,r)=>({real:e+n,imag:t+r})),p5=p1(x.Add,p3,p4),p6={kernelName:x.Add,backendName:"cpu",kernelFunc:p5};function p8(e,t,n,r,a){let s=rR.util.sizeFromShape(r),i=rR.util.makeZerosTypedArray(a,n);for(let n=0;n<e.length;n++){let r=e[n];if(r<0)throw Error("Input x must be non-negative!");r>=a||(s>0?i[r]+=t[n]:i[r]+=1)}return i}function p9(e,t,n,r=!1){let a=e.shape[0],s=e.shape[1],i=(0,pz.buffer)([a,n],t.dtype);for(let o=0;o<a;o++)for(let a=0;a<s;a++){let s=e.get(o,a);if(s<0)throw Error("Input x must be non-negative!");s>=n||(r?i.set(1,o,s):t.size>0?i.set(i.get(o,s)+t.get(o,a),o,s):i.set(i.get(o,s)+1,o,s))}return i}let p7=pV((e,t)=>e&t),de=p1(x.BitwiseAnd,p7),dt={kernelName:x.BitwiseAnd,backendName:"cpu",kernelFunc:de};function dn(e){return(t,n,r)=>{let a=rR.util.getArrayFromDType(n,t.length);for(let n=0;n<t.length;++n)a[n]=e(t[n],r);return a}}var tN=tN;function dr(e,t,n){return da(e,dn(t),n)}function da(e,t,n){return({inputs:r,attrs:a,backend:s})=>{let i,{x:o}=r;pP(o,e);let l=s.data.get(o.dataId).values;if("string"===o.dtype){if(!Array.isArray(l))throw Error("String tensor's value was not an instance of Array");i=tN.fromUint8ToStringArray(l)}else i=l;let u=n||o.dtype,h=t(i,u,a);return s.makeTensorInfo(o.shape,u,h)}}let ds=dn(e=>Math.ceil(e)),di=da(x.Ceil,ds),dl={kernelName:x.Ceil,backendName:"cpu",kernelFunc:di};var tN=tN;function du(e,t,n,r){let a=rR.util.getArrayFromDType(n,rR.util.sizeFromShape(t));if(r&&"string"!==n){let t=0;e.forEach(e=>{let n=rR.util.sizeFromShape(e.shape);a.set(e.vals,t),t+=n})}else{let r=0;e.forEach(e=>{let s="string"===n?tN.fromUint8ToStringArray(e.vals):e.vals,i=0;for(let n=0;n<e.shape[0];++n){let o=n*t[1]+r;for(let t=0;t<e.shape[1];++t)a[o+t]=s[i++]}r+=e.shape[1]})}return a}let dh=pV((e,t)=>+(e===t)),dp=p1(x.Equal,dh,null,"bool"),dd={kernelName:x.Equal,backendName:"cpu",kernelFunc:dp},dc=dn(e=>Math.exp(e)),df=da(x.Exp,dc,"float32"),dm={kernelName:x.Exp,backendName:"cpu",kernelFunc:df},dg=dn(e=>Math.expm1(e)),dx=da(x.Expm1,dg),dy={kernelName:x.Expm1,backendName:"cpu",kernelFunc:dx},db=dn(e=>Math.floor(e)),dv=da(x.Floor,db),dw={kernelName:x.Floor,backendName:"cpu",kernelFunc:dv},dI=pV((e,t)=>Math.floor(e/t)),dC=p1(x.FloorDiv,dI,null,"int32"),dk={kernelName:x.FloorDiv,backendName:"cpu",kernelFunc:dC};function dS(e,t,n,r,a,s,i,o,l){let u=(0,pz.buffer)([r,s],n);for(let n=0;n<r;n++){let r=[],h=0;for(let t=0;t<a;t++){let s=e[n*a+t];h+=s*i[t],r.push(s)}if(h<0||h>=l/s)throw Error(`Invalid indices: ${r} does not index into ${o}`);for(let e=0;e<s;e++)u.values[n*s+e]=t.get(...t.indexToLoc(h*s+e))}return u}function dT(e,t,n){let r=(0,pz.buffer)(n,e.dtype);for(let n=0;n<r.size;++n){let a=r.indexToLoc(n).slice(),s=a[0],i=a[2],o=t.locToIndex([s,i]);a[2]=t.values[o];let l=e.locToIndex(a);0<=l&&l<e.values.length&&(r.values[n]=e.values[l])}return r}let dN=pV((e,t)=>+(e>t)),d$=p1(x.Greater,dN,null,"bool"),dR={kernelName:x.Greater,backendName:"cpu",kernelFunc:d$},dA=pV((e,t)=>+(e>=t)),dE=p1(x.GreaterEqual,dA,null,"bool"),dF={kernelName:x.GreaterEqual,backendName:"cpu",kernelFunc:dE},dD=pV((e,t)=>+(e<t)),dO=p1(x.Less,dD,null,"bool"),dL={kernelName:x.Less,backendName:"cpu",kernelFunc:dO},dz=pV((e,t)=>+(e<=t)),d_=p1(x.LessEqual,dz,null,"bool"),dM={kernelName:x.LessEqual,backendName:"cpu",kernelFunc:d_};function dP(e,t,n){let r=(t-e)/(n-1),a=rR.util.makeZerosTypedArray(n,"float32");a[0]=e;for(let e=1;e<a.length;e++)a[e]=a[e-1]+r;return a}let dB=dn(e=>Math.log(e)),dW=da(x.Log,dB),dG={kernelName:x.Log,backendName:"cpu",kernelFunc:dW};function dU(e,t,n,r){let a=rR.util.getTypedArrayFromDType(r,rR.util.sizeFromShape(n));for(let n=0;n<a.length;++n){let r=n*t,s=e[r];for(let n=0;n<t;++n){let t=e[r+n];(Number.isNaN(t)||t>s)&&(s=t)}a[n]=s}return a}let dV=pV((e,t)=>Math.max(e,t)),dH=p1(x.Maximum,dV),dq={kernelName:x.Maximum,backendName:"cpu",kernelFunc:dH},dj=pV((e,t)=>Math.min(e,t)),dX=p1(x.Minimum,dj),dK={kernelName:x.Minimum,backendName:"cpu",kernelFunc:dX},dY=pV((e,t)=>e*t),dZ=p2((e,t,n,r)=>({real:e*n-t*r,imag:e*r+t*n})),dJ=p1(x.Multiply,dY,dZ),dQ={kernelName:x.Multiply,backendName:"cpu",kernelFunc:dJ};function d0(e,t,n){return dY([],t,rR.util.createScalarValue(-1,n),e,n)}let d1={kernelName:x.Neg,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{x:r}=t;pP(r,"neg");let[a,s]=d0(n.data.get(r.dataId).values,r.shape,r.dtype);return n.makeTensorInfo(s,r.dtype,a)}},d2=pV((e,t)=>+(e!==t)),d3=p1(x.NotEqual,d2,null,"bool"),d4={kernelName:x.NotEqual,backendName:"cpu",kernelFunc:d3};var tN=tN,d5=e.i(320281);function d6(e,t,n,r,a){let s=t.length,i=rR.util.sizeFromShape(t),o=rR.util.computeStrides(t),l=rR.util.computeStrides(a),u=rR.util.getTypedArrayFromDType(n,rR.util.sizeFromShape(a));for(let t=0;t<i;++t){let n=rR.util.indexToLoc(t,s,o),a=Array(n.length);for(let e=0;e<a.length;e++)a[e]=n[r[e]];u[rR.util.locToIndex(a,s,l)]=e[t]}return u}function d8(e){let{inputs:t,attrs:n,backend:r}=e,{x:a}=t,{perm:s}=n;pP(a,"transpose");let i=Array(a.shape.length);for(let e=0;e<i.length;e++)i[e]=a.shape[s[e]];let o=d6(r.data.get(a.dataId).values,a.shape,a.dtype,s,i);return{dataId:r.write(o,i,a.dtype),shape:i,dtype:a.dtype}}let d9={kernelName:x.Transpose,backendName:"cpu",kernelFunc:d8};function d7(e,t,n,r){let[a,s]=tN.computeOutAndReduceShapes(e,r),i=(0,d5.upcastType)(t,"int32"),o=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(a),i),l=rR.util.sizeFromShape(s);for(let e=0;e<o.length;++e){let t=e*l,r=1;for(let e=0;e<l;++e)r*=n[t+e];o[e]=r}return{outVals:o,outShape:a,outDtype:i}}let ce={kernelName:x.Prod,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,keepDims:i}=r;pP(a,"prod");let o=a.shape.length,l=rR.util.parseAxisParam(s,a.shape),u=tN.getAxesPermutation(l,o),h=l,p=a,d=[];null!=u&&(d.push(p=d8({inputs:{x:a},backend:n,attrs:{perm:u}})),h=tN.getInnerMostAxes(h.length,o));let c=n.data.get(p.dataId).values,{outVals:f,outShape:m,outDtype:g}=d7(p.shape,p.dtype,c,h),x=m;return i&&(x=tN.expandShapeToKeepDim(m,l)),d.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.makeTensorInfo(x,g,f)}};function ct(e,t){let n=e.slice(0,t);for(;n.length<t;)n.push(1);for(let r=t;r<e.length;r++)n[t-1]*=e[r];return n}function cn(e,t,n,r,a,s,i,o){let l,u,h,p;if(0===e.length)throw Error("paramsNestedSplits must be non empty");if(0===t[0].length)throw Error("Split tensors must not be scalars");let d=t[0][0]-1;if(s.forEach((e,t)=>{if(e<0||e>=d){let n=rR.util.indexToLoc(t,i.length,rR.util.computeStrides(i)).join(",");throw Error(`indices[${n}] = ${e} is not in [0, ${d})`)}}),0===r.length)throw Error("params.rank must be nonzero");let{outSplits:c,valueSlices:f,numValues:m}=function(e,t,n,r){let a=[],s=0,i=Array(t.length-1+n.length).fill(null).map(()=>[0]);for(let e=0;e<n.length;++e){let t=n[e],a=e===n.length-1?r:n[e+1].length;if(0===t.length)throw Error("Ragged splits may not be empty");if(t[0]<0)throw Error("Ragged splits must be non-negative");if(t[t.length-1]>a)throw Error("Ragged splits must not point past values");for(let e=1;e<t.length;++e)if(t[e-1]>t[e])throw Error("Ragged splits must be sorted in ascending order")}let o=1;for(let e=0;e<t.length-1;++e){o*=t[e];let n=t[e+1];for(let t=1;t<o+1;++t)i[e].push(t*n)}for(let r=0;r<e.length;++r){let o=e[r],l=e[r]+1;for(let e=0;e<n.length;++e){let r=n[e],a=e+t.length-1;if(a>=0){let e=i[a],t=e[e.length-1]-r[o];for(let e=o;e<l;++e)i[a].push(r[e+1]+t)}o=r[o],l=r[l]}l!==o&&(a.push([o,l]),s+=l-o)}return{outSplits:i,valueSlices:a,numValues:s}}(s,i,e,r[0]),g=function(e){let t=[];for(let n=0;n<e.length;++n){let r=e[n].length,a=rR.util.getArrayFromDType("int32",r);t.push(a),e[n].forEach((e,t)=>a[t]=e)}return t}(c),x=((l=r.slice())[0]=m,u=rR.util.getArrayFromDType(a,rR.util.sizeFromShape(l)),p=0===(h=n.length)?0:h/r[0],!function(e,t,n,r,a,s){let i=ct(t,2)[1],o=ct(s,2)[1],l=0;for(let t of n)for(let n=t[0];n<t[1];++n){for(let t=0;t<r;++t)a[l*o+t]=e[n*i+t];++l}}(n,r,f,p,u,l),[u,l]);return[g,x[0],x[1]]}function cr(e,t,n,r,a,s,i){if(t.length>1)throw Error("starts must be a scalar or vector");if(a.length>1)throw Error("limits must be a scalar or vector");if(i.length>1)throw Error("deltas must be a scalar or vector");let o=0===t.length,l=0===a.length,u=0===i.length,h=[];o||h.push(t[0]),l||h.push(a[0]),u||h.push(i[0]);for(let e=1;e<h.length;++e)if(h[e]!==h[e-1])throw Error("starts, limits, and deltas must have the same shape");let p=0===h.length?1:h[0],d=rR.util.getArrayFromDType("int32",p+1);d[0]=0;for(let t=0;t<p;++t){let n,a=o?e[0]:e[t],i=l?r[0]:r[t],h=u?s[0]:s[t];if(0===h)throw Error("Requires delta != 0");if(h>0&&i<a||h<0&&i>a)n=0;else if((n=Math.ceil(Math.abs((i-a)/h)))>0x7fffffff)throw Error("Requires ((limit - start) / delta) <= 2147483647");d[t+1]=d[t]+n}let c=d[p],f=rR.util.getArrayFromDType(n,c),m=0;for(let t=0;t<p;++t){let n=d[t+1]-d[t],r=o?e[0]:e[t],a=u?s[0]:s[t];for(let e=0;e<n;++e)f[m++]=r,r+=a}return[d,f]}var tN=tN,ca=tN.RowPartitionType;class cs{constructor(e,t,n,r,a,s,i,o,l,u){this.shape=e,this.shapeShape=t,this.values=n,this.valuesShape=r,this.valuesDType=a,this.defaultValue=s,this.defaultValueShape=i,this.rowPartitionValues=o,this.rowPartitionValuesShapes=l,this.rowPartitionTypes=tN.getRowPartitionTypesHelper(u),this.raggedRank=tN.getRaggedRank(this.rowPartitionTypes)}getRowPartitionTypeByDimension(e){return this.rowPartitionTypes[0]===ca.FIRST_DIM_SIZE?this.rowPartitionTypes[e+1]:this.rowPartitionTypes[e]}getRowPartitionTensor(e){return this.rowPartitionTypes[0]===ca.FIRST_DIM_SIZE?this.rowPartitionValues[e+1]:this.rowPartitionValues[e]}getMaxWidth(e){let t=this.getRowPartitionTensor(e-1);switch(this.getRowPartitionTypeByDimension(e-1)){case ca.VALUE_ROWIDS:return cs.getMaxWidthValueRowID(t);case ca.ROW_SPLITS:return cs.getMaxWidthRowSplit(t);default:throw Error(`Cannot handle partition type ${ca[this.getRowPartitionTypeByDimension(e-1)]}`)}}static getMaxWidthRowSplit(e){let t=e.length;if(0===t||1===t)return 0;let n=0;for(let r=0;r<t-1;++r){let t=e[r+1]-e[r];t>n&&(n=t)}return n}static getMaxWidthValueRowID(e){let t=e.length;if(0===t)return 0;let n=0,r=e[0],a=0;for(let s=1;s<t;++s){let t=e[s];t!==r&&(r=t,a=Math.max(s-n,a),n=s)}return Math.max(t-n,a)}tensorShapeFromTensor(e,t,n=!0){if(0===t.length){if(-1===e[0])return[];throw Error("The only valid scalar shape tensor is the fully unknown shape specified as -1.")}return co(e,n)}calculateOutputSize(e){let t=this.valuesShape,n=this.defaultValueShape;tN.validateDefaultValueShape(n,t);let r=this.tensorShapeFromTensor(this.shape,this.shapeShape),a=tN.combineRaggedTensorToTensorShapes(this.raggedRank,r,t);a[0]<0&&(a[0]=e);for(let e=1;e<=this.raggedRank;++e)a[e]<0&&(a[e]=this.getMaxWidth(e));return a}calculateFirstParentOutputIndex(e,t,n){let r=Math.min(e,n),a=[],s=0;for(let e=0;e<r;++e,s+=t)a.push(s);for(let t=r;t<e;++t)a.push(-1);return rR.util.assert(a.length===e,()=>"Final length of result must be equal to firstDimension."),a}calculateOutputIndexRowSplit(e,t,n,r){let a=e.length,s=[];for(let i=0;i<a-1;++i){let a=e[i+1]-e[i],o=Math.min(r,a),l=t[i];-1===l&&(o=0);for(let e=0;e<o;++e)s.push(l),l+=n;for(let e=0;e<a-o;++e)s.push(-1)}if(a>0&&s.length!==e[a-1])throw Error("Invalid row split size.");return s}calculateOutputIndexValueRowID(e,t,n,r){let a=e.length,s=[];if(0===a)return[];let i=0,o=e[0];if(o>=t.length)throw Error(`Got currentValueRowId=${o}, which is not less than ${t.length}`);let l=t[o];s.push(l);for(let u=1;u<a;++u){let a=e[u];if(a===o)l>=0&&(++i<r?l+=n:l=-1);else{if(i=0,o=a,a>=t.length)throw Error(`Got nextValueRowId=${a} which is not less than ${t.length}`);l=t[a]}s.push(l)}if(s.length!==e.length)throw Error("Invalid row ids.");return s}calculateOutputIndex(e,t,n,r){let a=this.getRowPartitionTensor(e),s=this.getRowPartitionTypeByDimension(e);switch(s){case ca.VALUE_ROWIDS:return this.calculateOutputIndexValueRowID(a,t,n,r);case ca.ROW_SPLITS:if(a.length-1>t.length)throw Error(`Row partition size is greater than output size: ${a.length-1} > ${t.length}`);return this.calculateOutputIndexRowSplit(a,t,n,r);default:throw Error(`Unsupported partition type: ${ca[s]}`)}}getFirstDimensionSize(){let e=this.rowPartitionValues[0];if(0===this.rowPartitionTypes.length)throw Error("No row_partition_types given.");let t=this.rowPartitionTypes[0];switch(t){case ca.FIRST_DIM_SIZE:return e[0];case ca.VALUE_ROWIDS:throw Error("Cannot handle VALUE_ROWIDS in first dimension.");case ca.ROW_SPLITS:return this.rowPartitionValuesShapes[0][0]-1;default:throw Error(`Cannot handle type ${ca[t]}`)}}compute(){if(this.rowPartitionValues[0].length<=0)throw Error("Invalid first partition input. Tensor requires at least one element.");let e=this.getFirstDimensionSize(),t=this.calculateOutputSize(e),n=Array(this.raggedRank+1);n[n.length-1]=1;for(let e=n.length-2;e>=0;--e)n[e]=n[e+1]*t[e+1];let r=co(t,!1),a=rR.util.getArrayFromDType(this.valuesDType,rR.util.sizeFromShape(r));if(n[0]*t[0]>0){let s=this.calculateFirstParentOutputIndex(e,n[0],t[0]);for(let e=1;e<=this.raggedRank;++e)s=this.calculateOutputIndex(e-1,s,n[e],t[e]);this.setOutput(this.raggedRank,s,a,r)}return[r,a]}setOutput(e,t,n,r){if(0===n.length)return;let a=this.values,s=r.slice();s=s.slice(e+1);let i=rR.util.sizeFromShape(s),o=t.length,l=this.defaultValue;if(l.length!==i&&1!==l.length){let e=this.defaultValueShape;(0,r$.tidy)(()=>{let t=(0,E.reshape)(l,e);l=(0,nR.broadcastTo)(t,s).dataSync()})}let u=0,h=0,p=0;for(let e=0;e<=o;++e){let r=e<o?t[e]:-1;if(r===p){++p;continue}if(h<p){let e=a.subarray(u*i);ci(n.subarray(h*i),e,(p-h)*i)}if(e>=o&&(r=Math.floor(n.length/i)),r>p)if(1===this.defaultValue.length)n.subarray(p*i,r*i).fill(this.defaultValue[0]),p=r;else for(;r>p;)ci(n.slice(p*i),l,i),++p;r<0?(u=e+1,h=p):(u=e,p=(h=p)+1)}}}function ci(e,t,n){for(let r=0;r<n;r++)e[r]=t[r]}function co(e,t){let n=[];for(let r of e){if(r<0){if(!t)throw Error(`Dimension ${r} must be >= 0`);if(r<-1)throw Error(`Dimension ${r} must be >= -1`);r=-1}n.push(r)}return n}function cl(e,t,n,r,a,s,i,o,l,u){return new cs(e,t,n,r,a,s,i,o,l,u).compute()}function cu(e,t,n,r){let a=e===t,s=e<t&&n<0,i=t<e&&n>1;if(a||s||i)return rR.util.makeZerosTypedArray(0,r);let o=Math.abs(Math.ceil((t-e)/n)),l=rR.util.makeZerosTypedArray(o,r);t<e&&1===n&&(n=-1),l[0]=e;for(let e=1;e<l.length;e++)l[e]=l[e-1]+n;return l}let ch=dn(e=>1/Math.sqrt(e)),cp=da(x.Rsqrt,ch),cd={kernelName:x.Rsqrt,backendName:"cpu",kernelFunc:cp};function cc(e,t,n,r,a,s,i,o,l,u){let h=e.values,p=t.values;if(0===r)return(0,pz.buffer)(n,t.dtype);let d=l instanceof nm.TensorBuffer?l:(0,pz.buffer)([r/a,a],t.dtype);"string"==typeof l||"number"==typeof l?d.values.fill(l):"boolean"==typeof l&&d.values.fill(+l);for(let e=0;e<s;e++){let s=[],l=0;for(let t=0;t<i;t++){let n=h[e*i+t];s.push(n),l+=n*o[t]}if(l<0||l>=r/a)throw Error(`Invalid indices: ${s} does not index into ${n}`);for(let n=0;n<a;n++)u?d.values[l*a+n]+=p[e*a+n]:d.values[l*a+n]=0===t.rank?p[0]:p[e*a+n]}return d}let cf=dn(e=>1/(1+Math.exp(-e))),cm=dr(x.Sigmoid,e=>1/(1+Math.exp(-e))),cg={kernelName:x.Sigmoid,backendName:"cpu",kernelFunc:cm};var tN=tN,cx=tJ;function cy(e,t,n,r,a){let s=cx.isSliceContinous(r,t,n),i=rR.util.sizeFromShape(n),o=rR.util.computeStrides(r);if(s){let n=cx.computeFlatOffset(t,o);return"string"===a?e.slice(n,n+i):e.subarray(n,n+i)}let l="string"===a?tN.fromUint8ToStringArray(e):e,u=(0,pz.buffer)(r,a,l),h=(0,pz.buffer)(n,a);for(let e=0;e<h.size;++e){let n=h.indexToLoc(e),r=n.map((e,n)=>e+t[n]);h.set(u.get(...r),...n)}return"string"===a?tN.fromStringArrayToUint8(h.values):h.values}function cb(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{begin:s,size:i}=r;pP(a,"slice");let[o,l]=cx.parseSliceParams(a,s,i);cx.assertParamsValid(a,o,l);let u=cy(n.data.get(a.dataId).values,o,l,a.shape,a.dtype);return n.makeTensorInfo(l,a.dtype,u)}let cv={kernelName:x.Slice,backendName:"cpu",kernelFunc:cb};var tN=tN;function cw(e,t,n,r,a,s,i){let o=t[0],l=s[0],u=Array(l),h=Array(o),p=t[1];if(0===l){if(0!==o)throw Error(tN.getSparseFillEmptyRowsIndicesDenseShapeMismatch(o));return[rR.util.getArrayFromDType(n,0),[0,p],rR.util.getArrayFromDType(a,0),u,h]}let d=!0,c=0,f=Array(l).fill(0);for(let t=0;t<o;++t){let n=e[t*p];if(n<0)throw Error(tN.getSparseFillEmptyRowsNegativeIndexErrorMessage(t,n));if(n>=l)throw Error(tN.getSparseFillEmptyRowsOutOfRangeIndexErrorMessage(t,n,l));++f[n],d=d&&n>=c,c=n}let m=!0;for(let e=0;e<l;++e){let t=0===f[e];u[e]=t,m=m&&!t,f[e]=Math.max(f[e],1),e>0&&(f[e]+=f[e-1])}if(m&&d){for(let e=0;e<o;++e)h[e]=e;return[e,[o,p],r,u,h]}{let t=f[l-1],s=rR.util.getArrayFromDType(n,t*p),d=rR.util.getArrayFromDType(a,t),c=Array(l).fill(0);for(let t=0;t<o;++t){let n=e[t*p],a=c[n],i=(0===n?0:f[n-1])+a;c[n]++;for(let n=0;n<p;++n)s[i*p+n]=e[t*p+n];d[i]=r[t],h[t]=i}for(let e=0;e<l;++e)if(0===c[e]){let t=0===e?0:f[e-1];s[t*p+0]=e;for(let e=1;e<p;++e)s[t*p+e]=0;d[t]=i}return[s,[t,p],d,u,h]}}var tN=tN;function cI(e,t,n,r,a){let s=rR.util.sizeFromShape(r),i=t[0],o=a.length,l=[],u=1,h=-1;for(let e=0;e<o;++e){let t=a[e];if(-1===t){if(-1!==h)throw Error(tN.getSparseReshapeMultipleNegativeOneOutputDimErrorMessage(h,e));h=e,l.push(1)}else{if(t<0)throw Error(tN.getSparseReshapeNegativeOutputDimErrorMessage(e,t));u*=t,l.push(t)}}if(-1!==h){if(u<=0)throw Error(tN.getSparseReshapeEmptyTensorZeroOutputDimErrorMessage());let e=Math.trunc(s/u);if(u*e!==s)throw Error(tN.getSparseReshapeInputOutputMultipleErrorMessage(r,l));l[h]=e}if(rR.util.sizeFromShape(l)!==s)throw Error(tN.getSparseReshapeInputOutputMismatchErrorMessage(r,l));let p=r.length,d=[];if(p>0){d[p-1]=1;for(let e=p-2;e>=0;--e)d[e]=d[e+1]*r[e+1]}let c=[];if(o>0){c[o-1]=1;for(let e=o-2;e>=0;--e)c[e]=c[e+1]*l[e+1]}let f=rR.util.getArrayFromDType(n,i*o);for(let t=0;t<i;++t){let n=0;for(let r=0;r<p;++r)n+=e[t*p+r]*d[r];for(let e=0;e<o;++e)f[t*o+e]=Math.trunc(n/c[e]),n%=c[e]}return[f,[i,o],l]}var tN=tN;function cC(e,t,n,r,a,s=!1,i=0){let o=r.length,l=[t[0],e.length/t[0]],u=l[1],h=o>0?a[o-1]+1:0;if(h<0)throw Error(tN.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());let p=t.slice();p[0]=h;let d=p.reduce((e,t)=>e*t,1),c=rR.util.getArrayFromDType(n,d);if(0===o)return h>0&&c.fill(i),[c,p];if(h<=0)throw Error(tN.getSparseSegmentReductionNegativeSegmentIdsErrorMessage());let f=0,m=1,g=0,x=a[0];for(;;){let t=0;if(m<o){if(x===(t=a[m])){++m;continue}if(x>=t)throw Error(tN.getSparseSegmentReductionNonIncreasingSegmentIdsErrorMessage())}if(x<0||x>=h)throw Error(tN.getSparseSegmentReductionSegmentIdOutOfRangeErrorMessage(x,h));x>g&&c.fill(i,g*u,x*u);for(let t=f;t<m;++t){let n=r[t];if(n<0||n>=l[0])throw Error(tN.getSparseSegmentReductionIndicesOutOfRangeErrorMessage(t,r[t],l[0]));for(let t=0;t<u;t++)c[x*u+t]+=e[n*u+t]}if(s)for(let e=0;e<u;e++)c[x*u+e]/=m-f;if(f=m,++m,g=x+1,x=t,m>o)break}return g<h&&c.fill(i,g*u,h*u),[c,p]}let ck=dn(e=>Math.sqrt(e)),cS=dr(x.Sqrt,e=>Math.sqrt(e)),cT={kernelName:x.Sqrt,backendName:"cpu",kernelFunc:cS},cN=pV((e,t)=>{let n=e-t;return n*n}),c$=p1(x.SquaredDifference,cN),cR={kernelName:x.SquaredDifference,backendName:"cpu",kernelFunc:c$},cA=dn((e,t)=>{let{pattern:n,replaceGlobal:r,rewrite:a}=t;return e.replace(new RegExp(n,r?"g":""),a)}),cE=da(x.StaticRegexReplace,cA),cF={kernelName:x.StaticRegexReplace,backendName:"cpu",kernelFunc:cE};function cD(e,t,n,r){let a=(0,pz.buffer)(e,t.dtype);for(let e=0;e<a.size;e++){let s=a.indexToLoc(e),i=Array(s.length);for(let e=0;e<i.length;e++)i[e]=s[e]*n[e]+r[e];a.set(t.get(...i),...s)}return a}class cO{constructor(e,t,n,r,a,s){this.separator=rR.util.encodeString(e),this.nGramWidths=t,this.leftPad=rR.util.encodeString(n),this.rightPad=rR.util.encodeString(r),this.padWidth=a,this.preserveShort=s}getPadWidth(e){return Math.min(this.padWidth<0?e-1:this.padWidth,e-1)}getNumNGrams(e,t){return Math.max(0,e+2*this.getPadWidth(t)-t+1)}createNGrams(e,t,n,r,a,s){for(let i=0;i<a;++i){let o,l=this.getPadWidth(s),u=Math.max(0,l-i),h=Math.max(0,l-(a-(i+1))),p=s-(u+h),d=t+(u>0?0:i-l);o=0+u*this.leftPad.length;for(let t=0;t<p;++t)o+=e[d+t].length;o+=h*this.rightPad.length,o+=(u+h+p-1)*this.separator.length,n[r+i]=new Uint8Array(o);let c=n[r+i],f=0,m=e=>e.forEach(e=>c[f++]=e);for(let e=0;e<u;++e)m(this.leftPad),m(this.separator);for(let t=0;t<p-1;++t)m(e[d+t]),m(this.separator);if(p>0){m(e[d+p-1]);for(let e=0;e<h;++e)m(this.separator),m(this.rightPad)}else{for(let e=0;e<h-1;++e)m(this.rightPad),m(this.separator);m(this.rightPad)}}}compute(e,t){let n=e.length,r=t.length;if(r>0){let e=t[0];if(0!==e)throw Error(`First split value must be 0, got ${e}`);for(let a=1;a<r;++a){let r=t[a]>=e;if(!(r=r&&t[a]<=n))throw Error(`Invalid split value ${t[a]}, must be in [${e}, ${n}]`);e=t[a]}if(e!==n)throw Error(`Last split value must be data size. Expected ${n}, got ${e}`)}let a=r-1,s=rR.util.getArrayFromDType("int32",r);if(0===n||0===r){let e=Array(n);for(let e=0;e<=a;++e)s[e]=0;return[e,s]}s[0]=0;for(let e=1;e<=a;++e){let n=t[e]-t[e-1],r=0;this.nGramWidths.forEach(e=>{r+=this.getNumNGrams(n,e)}),this.preserveShort&&n>0&&0===r&&(r=1),s[e]=s[e-1]+r}let i=Array(s[a]);for(let n=0;n<a;++n){let r=t[n],a=s[n];if(this.nGramWidths.forEach(s=>{let o=t[n+1]-t[n],l=this.getNumNGrams(o,s);this.createNGrams(e,r,i,a,l,s),a+=l}),this.preserveShort&&a===s[n]){let s=t[n+1]-t[n];if(0===s)continue;let o=s+2*this.padWidth;this.createNGrams(e,r,i,a,1,o)}}return[i,s]}}function cL(e,t,n,r,a,s,i,o){return new cO(n,r,a,s,i,o).compute(e,t)}function cz(e,t,n){let r=e.length,a=[],s=0,i=0,o=Array(r);for(let l=0;l<r;++l){let r=a.length;!function(e,t,n,r){if(!e.length)return;if(0===t.length){for(let t=0;t<e.length;++t)r.push(e.subarray(t,t+1));return}if(1===t.length){let a=t[0],s=e.indexOf(a);for(;-1!==s;){let t=e.subarray(0,s);n&&0===t.length||r.push(t),s=(e=e.subarray(s+1)).indexOf(a)}n&&0===e.length||r.push(e);return}let a=0;for(let s=0;s<e.length+1;s++)if(s===e.length||-1!==t.indexOf(e[s])){let t=e.subarray(a,s);n&&0===t.length||r.push(t),a=s+1}}(e[l],t,n,a);let u=a.length-r;o[l]=u,s+=u,i=Math.max(i,u)}let l=rR.util.getArrayFromDType("int32",2*s),u=Array(s),h=[r,i],p=0;for(let e=0;e<r;++e)for(let t=0;t<o[e];++t)l[2*p]=e,l[2*p+1]=t,u[p]=a[p],++p;return[l,u,h]}function c_(e,t){let n=rR.util.getArrayFromDType("int32",e.length);for(let r=0;r<e.length;++r)n[r]=rR.util.fingerPrint64(e[r]).modulo(t).getLowBitsUnsigned();return n}let cM=pV((e,t)=>e-t),cP=p2((e,t,n,r)=>({real:e-n,imag:t-r})),cB=p1(x.Sub,cM,cP),cW={kernelName:x.Sub,backendName:"cpu",kernelFunc:cB};function cG(e,t){let n=Array(e.rank);for(let r=0;r<n.length;r++)n[r]=e.shape[r]*t[r];let r=(0,pz.buffer)(n,e.dtype);for(let t=0;t<r.values.length;++t){let n=r.indexToLoc(t),a=Array(e.rank);for(let t=0;t<a.length;t++)a[t]=n[t]%e.shape[t];let s=e.locToIndex(a);r.values[t]=e.values[s]}return r}let cU=(e,t)=>{let n=t.value-e.value;return 0===n?e.index-t.index:n};function cV(e,t,n,r,a){let s=t[t.length-1],[i,o]=[e.length/s,s],l=rR.util.getTypedArrayFromDType(n,i*r),u=rR.util.getTypedArrayFromDType("int32",i*r);for(let t=0;t<i;t++){let n=t*o,s=e.subarray(n,n+o),i=Array(s.length);s.forEach((e,t)=>i[t]={value:e,index:t}),r<i.length&&(!function e(t,n,r=0,a=t.length-1){for(;a>r;){if(a-r>600){let s=a-r+1,i=n-r+1,o=Math.log(s),l=.5*Math.exp(2*o/3),u=.5*Math.sqrt(o*l*(s-l)/s)*Math.sign(i-s/2),h=Math.max(r,Math.floor(n-i*l/s+u)),p=Math.min(a,Math.floor(n+(s-i)*l/s+u));e(t,n,h,p)}let s=t[n],i=r,o=a;for(rR.util.swap(t,r,n),cU(t[a],s)>0&&rR.util.swap(t,r,a);i<o;){for(rR.util.swap(t,i,o),i++,o--;0>cU(t[i],s);)i+=1;for(;cU(t[o],s)>0;)o-=1}0===cU(t[r],s)?rR.util.swap(t,r,o):(o+=1,rR.util.swap(t,o,a)),o<=n&&(r=o+1),n<=o&&(a=o-1)}}(i,r),i=i.slice(0,r)),a&&i.sort(cU);let h=t*r,p=l.subarray(h,h+r),d=u.subarray(h,h+r);for(let e=0;e<r;e++)p[e]=i[e].value,d[e]=i[e].index}let h=t.slice();return h[h.length-1]=r,[(0,pz.buffer)(h,n,l),(0,pz.buffer)(h,"int32",u)]}function cH(e,t,n,r){let a=rR.util.parseAxisParam(t,n)[0],s=[1,n[0],1];for(let e=0;e<a;e++)s[0]*=n[e];s[1]=n[a];for(let e=a+1;e<n.length;e++)s[2]*=n[e];let i=new Map,o=new Int32Array(n[a]),l=new nm.TensorBuffer(s,r,e),u=[],h=1===s[0]&&1===s[2];for(let t=0;t<n[a];t++){let n;if(h)n=e[t].toString();else{let e=[];for(let n=0;n<s[0];n++)for(let r=0;r<s[2];r++)e.push(l.get(n,t,r));n=e.join(",")}let r=i.get(n);if(null!=r)o[t]=r;else{let e=i.size;i.set(n,e),o[t]=e,u.push(t)}}let p=s.slice();p[1]=i.size;let d=new nm.TensorBuffer(p,r);u.forEach((e,t)=>{for(let n=0;n<s[0];n++)for(let r=0;r<s[2];r++)d.set(l.get(n,e,r),n,t,r)});let c=n.slice();return c[a]=p[1],{outputValues:d.values,outputShape:c,indices:o}}e.s(["addImpl",0,p3,"bincountImpl",()=>p8,"bincountReduceImpl",()=>p9,"bitwiseAndImpl",0,p7,"castImpl",()=>pJ,"ceilImpl",0,ds,"concatImpl",()=>du,"equalImpl",0,dh,"expImpl",0,dc,"expm1Impl",0,dg,"floorDivImpl",0,dI,"floorImpl",0,db,"gatherNdImpl",()=>dS,"gatherV2Impl",()=>dT,"greaterEqualImpl",0,dA,"greaterImpl",0,dN,"lessEqualImpl",0,dz,"lessImpl",0,dD,"linSpaceImpl",()=>dP,"logImpl",0,dB,"maxImpl",()=>dU,"maximumImpl",0,dV,"minimumImpl",0,dj,"multiplyImpl",0,dY,"negImpl",()=>d0,"notEqualImpl",0,d2,"prodImpl",()=>d7,"raggedGatherImpl",()=>cn,"raggedRangeImpl",()=>cr,"raggedTensorToTensorImpl",()=>cl,"rangeImpl",()=>cu,"rsqrtImpl",0,ch,"scatterImpl",()=>cc,"sigmoidImpl",0,cf,"simpleAbsImpl",()=>pG,"sliceImpl",()=>cy,"sparseFillEmptyRowsImpl",()=>cw,"sparseReshapeImpl",()=>cI,"sparseSegmentReductionImpl",()=>cC,"sqrtImpl",0,ck,"squaredDifferenceImpl",0,cN,"staticRegexReplaceImpl",0,cA,"stridedSliceImpl",()=>cD,"stringNGramsImpl",()=>cL,"stringSplitImpl",()=>cz,"stringToHashBucketFastImpl",()=>c_,"subImpl",0,cM,"tileImpl",()=>cG,"topKImpl",()=>cV,"transposeImpl",()=>d6,"uniqueImpl",()=>cH],247816);var cq=e.i(247816);(0,r$.registerBackend)("cpu",()=>new pW,1),e.s([],178983);let cj=dr(x.Elu,e=>e>=0?e:Math.exp(e)-1),cX={kernelName:x.Elu,backendName:"cpu",kernelFunc:cj};function cK(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{alpha:s}=r;pP([a],"leakyRelu");let i=rR.util.sizeFromShape(a.shape),o=n.data.get(a.dataId).values,l=rR.util.getTypedArrayFromDType("float32",i);for(let e=0;e<o.length;e++)l[e]=o[e]<0?s*o[e]:o[e];return n.makeTensorInfo(a.shape,"float32",l)}let cY={kernelName:x.LeakyRelu,backendName:"cpu",kernelFunc:cK},cZ=pV((e,t)=>e<0?t*e:e);function cJ(e){let{inputs:t,backend:n}=e,{x:r,alpha:a}=t;pP([r,a],"prelu");let s=n.data.get(r.dataId).values,i=n.data.get(a.dataId).values,[o,l]=cZ(r.shape,a.shape,s,i,"float32");return n.makeTensorInfo(l,"float32",o)}let cQ={kernelName:x.Prelu,backendName:"cpu",kernelFunc:cJ},c0=dr(x.Relu,e=>Math.max(0,e)),c1={kernelName:x.Relu,backendName:"cpu",kernelFunc:c0},c2=dr(x.Relu6,e=>Math.min(Math.max(0,e),6)),c3={kernelName:x.Relu6,backendName:"cpu",kernelFunc:c2};function c4(e,t,n,r,a){if("linear"===n)return pX({inputs:{x:t},backend:e});if("relu"===n)return c0({inputs:{x:t},backend:e});if("elu"===n)return cj({inputs:{x:t},backend:e});if("relu6"===n)return c2({inputs:{x:t},backend:e});if("prelu"===n)return cJ({inputs:{x:t,alpha:r},backend:e});else if("leakyrelu"===n)return cK({inputs:{x:t},backend:e,attrs:{alpha:a}});else if("sigmoid"===n)return cm({inputs:{x:t},backend:e});throw Error(`Activation ${n} has not been implemented for the CPU backend.`)}var c5=A;function c6(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{shape:s}=r,i=rR.util.sizeFromShape(a.shape),o=rR.util.inferFromImplicitShape(s,i),l=rR.util.sizeFromShape(o);rR.util.assert(i===l,()=>`The new shape (${o}) has ${l} elements and the old shape (${a.shape}) has ${i} elements. The new shape and old shape must have the same number of elements.`),n.incRef(a.dataId);let u=n.data.get(a.dataId);if(null!=u.complexTensorInfos){let e=u.complexTensorInfos.real,t=u.complexTensorInfos.imag;e.shape=o,t.shape=o}return{dataId:a.dataId,shape:o,dtype:a.dtype}}let c8={kernelName:x.Reshape,backendName:"cpu",kernelFunc:c6};function c9(e){let{inputs:t,backend:n,attrs:r}=e,{a,b:s}=t,{transposeA:i,transposeB:o}=r;pP([a,s],"matMul");let l=a.shape.length,u=s.shape.length,h=i?a.shape[l-2]:a.shape[l-1],p=o?s.shape[u-1]:s.shape[u-2],d=i?a.shape[l-1]:a.shape[l-2],c=o?s.shape[u-2]:s.shape[u-1],f=a.shape.slice(0,-2),m=s.shape.slice(0,-2),g=rR.util.sizeFromShape(f),x=rR.util.sizeFromShape(m),y=c5.assertAndGetBroadcastShape(a.shape.slice(0,-2),s.shape.slice(0,-2)).concat([d,c]);rR.util.assert(h===p,()=>`Error in matMul: inner shapes (${h}) and (${p}) of Tensors with shapes ${a.shape} and ${s.shape} and transposeA=${i} and transposeB=${o} must match.`);let b=c6({inputs:{x:a},backend:n,attrs:{shape:i?[g,h,d]:[g,d,h]}}),v=c6({inputs:{x:s},backend:n,attrs:{shape:o?[x,c,p]:[x,p,c]}}),w=i?b.shape[1]:b.shape[2],I=i?b.shape[2]:b.shape[1],C=o?v.shape[1]:v.shape[2],k=Math.max(g,x),S=n.data.get(b.dataId).values,T=n.data.get(v.dataId).values,N=rR.util.computeStrides(b.shape),$=rR.util.computeStrides(v.shape),[R,A,E]=i?[N[0],1,N[1]]:[N[0],N[1],1],[F,D,O]=o?[1,$[1],$[0]]:[$[1],1,$[0]],L=I*C,z=(0,pz.buffer)([k,I,C],b.dtype),_=z.values,M=n.blockSize;for(let e=0;e<k;e++){let t=e%g,n=e%x;for(let r=0;r<I;r+=M){let a=Math.min(r+M,I);for(let s=0;s<C;s+=M){let i=Math.min(s+M,C);for(let o=0;o<w;o+=M){let l=Math.min(o+M,w);for(let u=r;u<a;u++)for(let r=s;r<i;r++){let a=0;for(let e=o;e<l;e++)a+=S[t*R+u*A+e*E]*T[e*F+r*D+n*O];_[e*L+(u*C+r)]+=a}}}}}return n.disposeIntermediateTensorInfo(b),n.disposeIntermediateTensorInfo(v),n.makeTensorInfo(y,z.dtype,z.values)}let c7={kernelName:x.BatchMatMul,backendName:"cpu",kernelFunc:c9},fe={kernelName:x._FusedMatMul,backendName:"cpu",kernelFunc:function(e){let t,n,r,{inputs:a,backend:s,attrs:i}=e,{a:o,b:l,bias:u,preluActivationWeights:h}=a,{transposeA:p,transposeB:d,activation:c,leakyreluAlpha:f}=i,m=[];for(let e of(t=c9({inputs:{a:o,b:l},attrs:{transposeA:p,transposeB:d},backend:s}),u&&(n=p5({inputs:{a:t,b:u},backend:s}),m.push(t),t=n),c&&(r=c4(s,t,c,h,f),m.push(t),t=r),m))s.disposeIntermediateTensorInfo(e);return t}},ft=dr(x.Acos,e=>Math.acos(e)),fn={kernelName:x.Acos,backendName:"cpu",kernelFunc:ft},fr=dr(x.Acosh,e=>Math.acosh(e)),fa={kernelName:x.Acosh,backendName:"cpu",kernelFunc:fr},fs={kernelName:x.AddN,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e;pP(t,"addN");let r=t.map(e=>n.data.get(e.dataId).values),a=(0,pz.buffer)(t[0].shape,t[0].dtype),s=a.values;for(let e=0;e<t.length;e++){let t=r[e];for(let e=0;e<s.length;e++)s[e]+=t[e]}return n.makeTensorInfo(a.shape,a.dtype,a.values)}};var tN=tN;let fi={kernelName:x.All,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,keepDims:i}=r;pP(a,"all");let o=rR.util.parseAxisParam(s,a.shape),l=o,u=tN.getAxesPermutation(l,a.shape.length),h=a;null!=u&&(h=d8({inputs:{x:a},backend:n,attrs:{perm:u}}),l=tN.getInnerMostAxes(l.length,a.shape.length)),tN.assertAxesAreInnerMostDims("all",l,h.shape.length);let[p,d]=tN.computeOutAndReduceShapes(h.shape,l),c=rR.util.sizeFromShape(d),f=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(p),h.dtype),m=n.data.get(h.dataId).values;for(let e=0;e<f.length;++e){let t=e*c,n=m[t];for(let e=0;e<c;++e){let r=m[t+e];n=n&&r}f[e]=n}null!=u&&n.disposeIntermediateTensorInfo(h);let g=n.makeTensorInfo(p,h.dtype,f);if(i){let e=c6({inputs:{x:g},backend:n,attrs:{shape:tN.expandShapeToKeepDim(p,o)}});return n.disposeIntermediateTensorInfo(g),e}return g}};var tN=tN;let fo={kernelName:x.Any,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,keepDims:i}=r;pP(a,"any");let o=rR.util.parseAxisParam(s,a.shape),l=o,u=tN.getAxesPermutation(l,a.shape.length),h=a;null!=u&&(h=d8({inputs:{x:a},backend:n,attrs:{perm:u}}),l=tN.getInnerMostAxes(l.length,a.shape.length)),tN.assertAxesAreInnerMostDims("any",l,h.shape.length);let[p,d]=tN.computeOutAndReduceShapes(h.shape,l),c=rR.util.sizeFromShape(d),f=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(p),h.dtype),m=n.data.get(h.dataId).values;for(let e=0;e<f.length;++e){let t=e*c,n=m[t];for(let e=0;e<c;++e){let r=m[t+e];n=n||r}f[e]=n}null!=u&&n.disposeIntermediateTensorInfo(h);let g=n.makeTensorInfo(p,h.dtype,f);if(i){let e=c6({inputs:{x:g},backend:n,attrs:{shape:tN.expandShapeToKeepDim(p,o)}});return n.disposeIntermediateTensorInfo(g),e}return g}};var tN=tN;let fl={kernelName:x.ArgMax,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s}=r;pP(a,"argMax");let i=rR.util.parseAxisParam(s,a.shape),o=tN.getAxesPermutation(i,a.shape.length),l=a,u=[];null!=o&&(u.push(l=d8({inputs:{x:a},backend:n,attrs:{perm:o}})),i=tN.getInnerMostAxes(i.length,l.shape.length)),i=[i[0]],tN.assertAxesAreInnerMostDims("argMax",i,l.shape.length);let[h,p]=tN.computeOutAndReduceShapes(l.shape,i),d=rR.util.sizeFromShape(h),c=rR.util.makeZerosTypedArray(d,"int32"),f=rR.util.sizeFromShape(p),m=n.data.get(l.dataId).values;for(let e=0;e<c.length;++e){let t=e*f,n=m[t],r=0;for(let e=0;e<f;++e){let a=m[t+e];a>n&&(n=a,r=e)}c[e]=r}return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.makeTensorInfo(h,"int32",c)}};var tN=tN;let fu={kernelName:x.ArgMin,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s}=r;pP(a,"argMin");let i=rR.util.parseAxisParam(s,a.shape),o=tN.getAxesPermutation(i,a.shape.length),l=a,u=[];null!=o&&(u.push(l=d8({inputs:{x:a},backend:n,attrs:{perm:o}})),i=tN.getInnerMostAxes(i.length,l.shape.length)),i=[i[0]],tN.assertAxesAreInnerMostDims("argMin",i,l.shape.length);let[h,p]=tN.computeOutAndReduceShapes(l.shape,i),d=rR.util.sizeFromShape(h),c=rR.util.makeZerosTypedArray(d,"int32"),f=rR.util.sizeFromShape(p),m=n.data.get(l.dataId).values;for(let e=0;e<c.length;++e){let t=e*f,n=m[t],r=0;for(let e=0;e<f;++e){let a=m[t+e];a<n&&(n=a,r=e)}c[e]=r}return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.makeTensorInfo(h,"int32",c)}},fh=dr(x.Asin,e=>Math.asin(e)),fp={kernelName:x.Asin,backendName:"cpu",kernelFunc:fh},fd=dr(x.Asinh,e=>Math.asinh(e)),fc={kernelName:x.Asinh,backendName:"cpu",kernelFunc:fd},ff=dr(x.Atan,e=>Math.atan(e)),fm={kernelName:x.Atan,backendName:"cpu",kernelFunc:ff},fg=pV((e,t)=>Math.atan2(e,t)),fx=p1(x.Atan2,fg),fy={kernelName:x.Atan2,backendName:"cpu",kernelFunc:fx},fb=dr(x.Atanh,e=>Math.atanh(e)),fv={kernelName:x.Atanh,backendName:"cpu",kernelFunc:fb};var tN=tN;function fw(e,t,n,r,a,s){let i=a.strideHeight,o=a.strideWidth,l=a.dilationHeight,u=a.dilationWidth,h=a.effectiveFilterHeight,p=a.effectiveFilterWidth,d=a.padInfo.top,c=a.padInfo.left,f="max"===s?-1/0:1/0,m=(0,pz.buffer)(a.outShape,n),g=m.values,x=a.outShape[1]*a.outShape[2]*a.outShape[3],y=a.outShape[2]*a.outShape[3],b=a.outShape[3];for(let t=0;t<a.batchSize;++t){let n=t*x,m=t*r[0];for(let t=0;t<a.inChannels;++t)for(let x=0;x<a.outHeight;++x){let v=x*i-d,w=Math.max(0,v),I=Math.min(a.inHeight,h+v),C=n+x*y;for(let n=0;n<a.outWidth;++n){let i=n*o-c,h=Math.max(0,i),d=Math.min(a.inWidth,p+i),x=f,y=0,v=0;for(let n=w;n<I;n+=l){let a=m+n*r[1];for(let n=h;n<d;n+=u){let i=e[a+n*r[2]+t];"max"===s&&i>x?x=i:"avg"===s&&(y+=i,v++)}if(isNaN(x))break}g[C+n*b+t]="avg"===s?y/v:x}}}return m}function fI(e,t,n,r,a=!1,s=!1){let i=(0,pz.buffer)(r.outShape,"int32"),o=r.strideHeight,l=r.strideWidth,u=r.dilationHeight,h=r.dilationWidth,p=r.effectiveFilterHeight,d=r.effectiveFilterWidth,c=r.padInfo.top,f=r.padInfo.left,m=(0,pz.buffer)(t,n,e);for(let e=0;e<r.batchSize;++e)for(let t=0;t<r.inChannels;++t)for(let n=0;n<r.outHeight;++n){let g=n*o-c,x=g;for(;x<0;)x+=u;let y=Math.min(r.inHeight,p+g);for(let o=0;o<r.outWidth;++o){let p=o*l-f,c=p;for(;c<0;)c+=h;let b=Math.min(r.inWidth,d+p),v=-1/0,w=-1;for(let n=x;n<y;n+=u){let i=n-g;for(let o=c;o<b;o+=h){let l=o-p,u=m.get(e,n,o,t);u>v&&(v=u,w=a?s?((e*r.inHeight+n)*r.inWidth+o)*r.inChannels+t:(n*r.inWidth+o)*r.inChannels+t:i*d+l)}}i.set(w,e,n,o,t)}}return i}function fC(e,t,n,r,a,s){let i=a.strideDepth,o=a.strideHeight,l=a.strideWidth,u=a.dilationDepth,h=a.dilationHeight,p=a.dilationWidth,d=a.effectiveFilterDepth,c=a.effectiveFilterHeight,f=a.effectiveFilterWidth,m=a.padInfo.front,g=a.padInfo.top,x=a.padInfo.left,y="max"===s?-1/0:1/0,b=(0,pz.buffer)(a.outShape,n),v=b.values,w=a.outShape[1]*a.outShape[2]*a.outShape[3]*a.outShape[4],I=a.outShape[2]*a.outShape[3]*a.outShape[4],C=a.outShape[3]*a.outShape[4],k=a.outShape[4];for(let t=0;t<a.batchSize;++t){let n=t*w,b=t*r[0];for(let t=0;t<a.inChannels;++t)for(let w=0;w<a.outDepth;++w){let S=w*i-m,T=S;for(;T<0;)T+=u;let N=Math.min(a.inDepth,d+S),$=n+w*I;for(let n=0;n<a.outHeight;++n){let i=n*o-g,d=i;for(;d<0;)d+=h;let m=Math.min(a.inHeight,c+i),w=$+n*C;for(let n=0;n<a.outWidth;++n){let i=n*l-x,o=i;for(;o<0;)o+=p;let c=Math.min(a.inWidth,f+i),g=w+n*k,I=y,C=0,S=0;for(let n=T;n<N;n+=u){let a=b+n*r[1];for(let n=d;n<m;n+=h){let i=a+n*r[2];for(let n=o;n<c;n+=p){let a=e[i+n*r[3]+t];if("max"===s&&a>I?I=a:"avg"===s&&(C+=a,S++),isNaN(I))break}if(isNaN(I))break}if(isNaN(I))break}v[g+t]="avg"===s?C/Math.max(S,1):I}}}}return b}let fk={kernelName:x.AvgPool,backendName:"cpu",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n;pP(s,"avgPool");let{filterSize:i,strides:o,pad:l,dimRoundingMode:u}=a;rR.util.assert(tN.eitherStridesOrDilationsAreOne(o,1),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`);let h=tN.computePool2DInfo(s.shape,i,o,1,l,u);if(1===h.filterWidth&&1===h.filterHeight&&rR.util.arraysEqual(h.inShape,h.outShape))t=pX({inputs:{x:s},backend:r});else{let e=r.data.get(s.dataId).values,n=rR.util.computeStrides(s.shape),a=fw(e,s.shape,s.dtype,n,h,"avg");t=r.makeTensorInfo(h.outShape,s.dtype,a.values)}return t}};var tN=tN;let fS={kernelName:x.AvgPool3D,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{filterSize:s,strides:i,pad:o,dimRoundingMode:l,dataFormat:u}=r;pP(a,"avgPool3d");let h=tN.computePool3DInfo(a.shape,s,i,1,o,l,u),p=fC(n.data.get(a.dataId).values,a.shape,a.dtype,rR.util.computeStrides(a.shape),h,"avg");return n.makeTensorInfo(p.shape,"float32",p.values)}};var tN=tN;let fT={kernelName:x.AvgPool3DGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s}=t,{filterSize:i,strides:o,pad:l,dimRoundingMode:u}=r;pP([a,s],"avgPool3DGrad");let h=tN.computePool3DInfo(s.shape,i,o,1,l,u),p=h.strideDepth,d=h.strideHeight,c=h.strideWidth,f=h.filterDepth,m=h.filterHeight,g=h.filterWidth,x=h.dilationDepth,y=h.dilationHeight,b=h.dilationWidth,v=h.effectiveFilterDepth,w=h.effectiveFilterHeight,I=h.effectiveFilterWidth,C=v-1-h.padInfo.front,k=I-1-h.padInfo.left,S=w-1-h.padInfo.top,T=(0,pz.buffer)(s.shape,"float32"),N=1/(f*m*g),$=n.bufferSync(a);for(let e=0;e<h.batchSize;++e)for(let t=0;t<h.inChannels;++t)for(let n=0;n<h.inDepth;++n)for(let r=0;r<h.inHeight;++r)for(let a=0;a<h.inWidth;++a){let s=n-C,i=r-S,o=a-k,l=0;for(let n=0;n<v;n+=x){let r=(s+n)/p;if(!(r<0)&&!(r>=h.outDepth)&&Math.floor(r)===r)for(let n=0;n<w;n+=y){let a=(i+n)/d;if(!(a<0)&&!(a>=h.outHeight)&&Math.floor(a)===a)for(let n=0;n<I;n+=b){let s=(o+n)/c;s<0||s>=h.outWidth||Math.floor(s)!==s||(l+=$.get(e,r,a,s,t))}}}T.set(l*N,e,n,r,a,t)}return n.makeTensorInfo(T.shape,T.dtype,T.values)}};var tN=tN;let fN={kernelName:x.AvgPoolGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s}=t;pP([a,s],"avgPoolGrad");let{filterSize:i,strides:o,pad:l}=r,u=tN.computePool2DInfo(s.shape,i,o,1,l),h=u.strideHeight,p=u.strideWidth,d=u.filterHeight,c=u.filterWidth,f=u.dilationHeight,m=u.dilationWidth,g=u.effectiveFilterHeight,x=u.effectiveFilterWidth,y=x-1-u.padInfo.left,b=g-1-u.padInfo.top,v=(0,pz.buffer)(s.shape,"float32"),w=1/(d*c),I=n.data.get(a.dataId).values,C=(0,pz.buffer)(a.shape,"float32",I);for(let e=0;e<u.batchSize;++e)for(let t=0;t<u.inChannels;++t)for(let n=0;n<u.inHeight;++n)for(let r=0;r<u.inWidth;++r){let a=n-b,s=r-y,i=0;for(let n=0;n<g;n+=f){let r=(a+n)/h;if(!(r<0)&&!(r>=u.outHeight)&&Math.floor(r)===r)for(let n=0;n<x;n+=m){let a=(s+n)/p;a<0||a>=u.outWidth||Math.floor(a)!==a||(i+=C.get(e,r,a,t))}}v.set(i*w,e,n,r,t)}return n.makeTensorInfo(v.shape,v.dtype,v.values)}},f$={kernelName:x.FusedBatchNorm,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,scale:s,offset:i,mean:o,variance:l}=t;rR.util.assert(o.shape.length===l.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),rR.util.assert(null==i||o.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),rR.util.assert(null==s||o.shape.length===s.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks."),pP([a,o,l,s,i],"batchNorm");let{varianceEpsilon:u}=r;null==u&&(u=.001);let h=n.data.get(a.dataId).values,p=n.data.get(o.dataId).values,d=n.data.get(l.dataId).values,c=s?n.data.get(s.dataId).values:new Float32Array([1]),f=i?n.data.get(i.dataId).values:new Float32Array([0]),m=new Float32Array(h.length),g=f.length,x=c.length,y=d.length,b=p.length,v=0,w=0,I=0,C=0;for(let e=0;e<h.length;++e)m[e]=f[v++]+(h[e]-p[w++])*c[I++]/Math.sqrt(d[C++]+u),v>=g&&(v=0),w>=b&&(w=0),I>=x&&(I=0),C>=y&&(C=0);return n.makeTensorInfo(a.shape,a.dtype,m)}};var tN=tN;let fR={kernelName:x.BatchToSpaceND,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{blockShape:s,crops:i}=r;pP([a],"batchToSpaceND");let o=s.reduce((e,t)=>e*t),l=tN.getReshaped(a.shape,s,o),u=tN.getPermuted(l.length,s.length),h=tN.getReshapedPermuted(a.shape,s,o),p=tN.getSliceBeginCoords(i,s.length),d=tN.getSliceSize(h,i,s.length),c=c6({inputs:{x:a},backend:n,attrs:{shape:l}}),f=d8({inputs:{x:c},backend:n,attrs:{perm:u}}),m=c6({inputs:{x:f},backend:n,attrs:{shape:h}}),g=cb({inputs:{x:m},backend:n,attrs:{begin:p,size:d}});return n.disposeIntermediateTensorInfo(c),n.disposeIntermediateTensorInfo(f),n.disposeIntermediateTensorInfo(m),g}},fA={kernelName:x.Bincount,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,weights:s}=t,{size:i}=r,o=p8(n.data.get(a.dataId).values,n.data.get(s.dataId).values,s.dtype,s.shape,i);return n.makeTensorInfo([i],s.dtype,o)}};var tN=tN;let fE={kernelName:x.BroadcastArgs,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{s0:r,s1:a}=t,s=n.data.get(r.dataId).values,i=n.data.get(a.dataId).values,o=tN.assertAndGetBroadcastShape(Array.from(s),Array.from(i));return n.makeTensorInfo([o.length],"int32",Int32Array.from(o))}},fF=dr(x.ClipByValue,(e,t)=>e>t.clipValueMax?t.clipValueMax:e<t.clipValueMin?t.clipValueMin:e),fD={kernelName:x.ClipByValue,backendName:"cpu",kernelFunc:fF},fO={kernelName:x.ComplexAbs,backendName:"cpu",kernelFunc:e=>{let{x:t}=e.inputs,n=e.backend,r=new Float32Array(rR.util.sizeFromShape(t.shape)),a=n.data.get(t.dataId),s=a.complexTensorInfos.real,i=a.complexTensorInfos.imag,o=n.data.get(s.dataId).values,l=n.data.get(i.dataId).values;for(let e=0;e<o.length;e++){let t=o[e],n=l[e];r[e]=Math.hypot(t,n)}return n.makeOutput(r,t.shape,"float32")}};var tN=tN;function fL(e){let{inputs:t,backend:n}=e,{input:r}=t,a=n.data.get(r.dataId).complexTensorInfos.imag,s=n.data.get(a.dataId).values;return n.makeTensorInfo(a.shape,a.dtype,s)}let fz={kernelName:x.Imag,backendName:"cpu",kernelFunc:fL};function f_(e){let{inputs:t,backend:n,attrs:r}=e,{axis:a}=r,s=rR.util.parseAxisParam(a,t[0].shape)[0],i=t.map(e=>e.shape);tN.assertParamsConsistent(i,s);let o=tN.computeOutShape(t.map(e=>e.shape),s);if(0===rR.util.sizeFromShape(o))return n.makeTensorInfo(o,t[0].dtype,[]);let l=t.filter(e=>rR.util.sizeFromShape(e.shape)>0);if(1===l.length)return pX({inputs:{x:l[0]},backend:n});if("complex64"===l[0].dtype){let e=l.map(e=>pY({inputs:{input:e},backend:n})),t=l.map(e=>fL({inputs:{input:e},backend:n})),r=f_({inputs:e,backend:n,attrs:{axis:s}}),a=f_({inputs:t,backend:n,attrs:{axis:s}}),i=pH({inputs:{real:r,imag:a},backend:n});return e.forEach(e=>n.disposeIntermediateTensorInfo(e)),t.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.disposeIntermediateTensorInfo(r),n.disposeIntermediateTensorInfo(a),i}let u=l.map(e=>{let t=rR.util.sizeFromShape(e.shape.slice(s));return c6({inputs:{x:e},backend:n,attrs:{shape:[-1,t]}})}),h=u.map(e=>({vals:n.data.get(e.dataId).values,shape:e.shape}));o=tN.computeOutShape(u.map(e=>e.shape),1);let p=1===u[0].shape[0],d=du(h,o,t[0].dtype,p),c=tN.computeOutShape(l.map(e=>e.shape),s),f=n.makeTensorInfo(c,t[0].dtype,d);return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),f}let fM={kernelName:x.Concat,backendName:"cpu",kernelFunc:f_};var tN=tN;function fP(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,filter:s}=t,{strides:i,pad:o,dataFormat:l,dilations:u,dimRoundingMode:h}=r;pP([a,s],"conv2d");let p=tN.convertConv2DDataFormat(l),d=tN.computeConv2DInfo(a.shape,s.shape,i,u,o,h,!1,p),c=d.filterHeight,f=d.filterWidth,m=d.dilationHeight,g=d.dilationWidth,x=d.padInfo.left,y=d.padInfo.top,b="channelsLast"===d.dataFormat,v=new nm.TensorBuffer(d.outShape,a.dtype),w=rR.util.computeStrides(a.shape),I=rR.util.computeStrides(s.shape),C=w[0],k=b?w[1]:w[2],S=b?w[2]:1,T=b?1:w[1],N=v.strides[0],$=b?v.strides[1]:v.strides[2],R=b?v.strides[2]:1,A=b?1:v.strides[1],E=n.data.get(a.dataId).values,F=n.data.get(s.dataId).values,D=v.values;for(let e=0;e<d.batchSize;++e){let t=e*C,n=e*N;for(let e=0;e<d.outHeight;++e){let r=n+e*$,a=e*d.strideHeight-y;for(let e=0;e<c;++e){let n=a+e*m;if(n<0||n>=d.inHeight)continue;let s=e*I[0],i=t+n*k;for(let e=0;e<d.outWidth;++e){let t=r+e*R,n=e*d.strideWidth-x;for(let e=0;e<f;++e){let r=n+e*g;if(r<0||r>=d.inWidth)continue;let a=s+e*I[1],o=i+r*S,l=a;for(let e=0;e<d.inChannels;++e){let n=E[o+e*T];for(let e=0;e<d.outChannels;++e)D[t+e*A]+=n*F[l+e];l+=d.outChannels}}}}}}return n.makeTensorInfo(v.shape,v.dtype,D)}let fB={kernelName:x.Conv2D,backendName:"cpu",kernelFunc:fP};var tN=tN;let fW={kernelName:x.Conv2DBackpropFilter,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,dy:s}=t,{strides:i,pad:o,dataFormat:l,dimRoundingMode:u,filterShape:h}=r;pP([a,s],"conv2dBackpropFilter");let p=tN.convertConv2DDataFormat(l),d=tN.computeConv2DInfo(a.shape,h,i,1,o,u,!1,p),{strideHeight:c,strideWidth:f,filterHeight:m,filterWidth:g}=d,x="channelsLast"===d.dataFormat,y=new nm.TensorBuffer(d.filterShape,"float32"),b=d.padInfo.left,v=d.padInfo.top,w=n.data.get(a.dataId).values,I=n.data.get(s.dataId).values,C=new nm.TensorBuffer(a.shape,a.dtype,w),k=new nm.TensorBuffer(s.shape,s.dtype,I);for(let e=0;e<m;++e){let t=Math.max(0,Math.ceil((v-e)/c)),n=Math.min(d.outHeight,(d.inHeight+v-e)/c);for(let r=0;r<g;++r){let a=Math.max(0,Math.ceil((b-r)/f)),s=Math.min(d.outWidth,(d.inWidth+b-r)/f);for(let i=0;i<d.inChannels;++i)for(let o=0;o<d.outChannels;++o){let l=0;for(let u=0;u<d.batchSize;++u)for(let h=t;h<n;++h){let t=e+h*c-v;for(let e=a;e<s;++e){let n=r+e*f-b;x?l+=C.get(u,t,n,i)*k.get(u,h,e,o):l+=C.get(u,i,t,n)*k.get(u,o,h,e)}}y.set(l,e,r,i,o)}}}return n.makeTensorInfo(y.shape,y.dtype,y.values)}};var tN=tN;let fG={kernelName:x.Conv2DBackpropInput,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,filter:s}=t,{inputShape:i,strides:o,pad:l,dataFormat:u,dimRoundingMode:h}=r;pP([a,s],"conv2dBackpropInput");let p=rR.util.computeStrides(s.shape),d=rR.util.computeStrides(a.shape),c=tN.convertConv2DDataFormat(u),f=tN.computeConv2DInfo(i,s.shape,o,1,l,h,!1,c),m=new nm.TensorBuffer(f.inShape,"float32"),g=m.values,x=n.data.get(a.dataId).values,y=n.data.get(s.dataId).values,[b,v,w]=p,{batchSize:I,filterHeight:C,filterWidth:k,inChannels:S,inHeight:T,inWidth:N,outChannels:$,outHeight:R,outWidth:A,strideHeight:E,strideWidth:F}=f;c=f.dataFormat;let D=C-1-f.padInfo.top,O=k-1-f.padInfo.left,L="channelsLast"===c,z=m.strides[0],_=L?m.strides[1]:m.strides[2],M=L?m.strides[2]:1,P=L?1:m.strides[1],B=d[0],W=L?d[1]:d[2],G=L?d[2]:1,U=L?1:d[1];for(let e=0;e<I;++e)for(let t=0;t<S;++t)for(let n=0;n<T;++n){let r=n-D,a=Math.max(0,Math.ceil(r/E)),s=Math.min(R,(C+r)/E);for(let i=0;i<N;++i){let o=i-O,l=Math.max(0,Math.ceil(o/F)),u=Math.min(A,(k+o)/F),h=0;for(let n=a;n<s;++n){let a=n*E-r;for(let r=l;r<u;++r){let s=r*F-o,i=B*e+W*n+G*r,l=b*(C-1-a)+v*(k-1-s)+w*t;for(let e=0;e<$;++e)h+=x[i+U*e]*y[l+e]}}g[z*e+_*n+M*i+P*t]=h}}return n.makeTensorInfo(m.shape,m.dtype,m.values)}};var tN=tN;let fU={kernelName:x.Conv3D,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,filter:s}=t,{strides:i,pad:o,dilations:l}=r;pP([a,s],"conv3d");let u=tN.computeConv3DInfo(a.shape,s.shape,i,l,o),{filterDepth:h,filterHeight:p,filterWidth:d,dilationDepth:c,dilationHeight:f,dilationWidth:m,padInfo:g}=u,x=g.front,y=g.left,b=g.top,v=new nm.TensorBuffer(u.outShape,a.dtype),w=n.data.get(a.dataId).values,I=n.data.get(s.dataId).values,C=v.values,k=rR.util.computeStrides(a.shape),S=rR.util.computeStrides(s.shape);for(let e=0;e<u.batchSize;++e){let t=e*k[0],n=e*v.strides[0];for(let e=0;e<u.outDepth;++e){let r=n+e*v.strides[1],a=e*u.strideDepth-x;for(let e=0;e<h;++e){let n=a+e*c;if(n<0||n>=u.inDepth)continue;let s=e*S[0],i=t+n*k[1];for(let e=0;e<u.outHeight;++e){let t=r+e*v.strides[2],n=e*u.strideHeight-b;for(let e=0;e<p;++e){let r=n+e*f;if(r<0||r>=u.inHeight)continue;let a=s+e*S[1],o=i+r*k[2];for(let e=0;e<u.outWidth;++e){let n=t+e*u.outChannels,r=e*u.strideWidth-y;for(let e=0;e<d;++e){let t=r+e*m;if(t<0||t>=u.inWidth)continue;let s=a+e*S[2],i=o+t*u.inChannels,l=s;for(let e=0;e<u.inChannels;++e){let t=w[i+e];for(let e=0;e<u.outChannels;++e)C[n+e]+=t*I[l+e];l+=u.outChannels}}}}}}}}return n.makeTensorInfo(v.shape,v.dtype,v.values)}};var tN=tN;let fV={kernelName:x.Conv3DBackpropFilterV2,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,dy:s}=t,{strides:i,pad:o,filterShape:l}=r;pP([a,s],"conv3dBackpropFilterV2");let u=rR.util.computeStrides(a.shape),h=rR.util.computeStrides(s.shape),p=tN.computeConv3DInfo(a.shape,l,i,1,o),d=p.strideDepth,c=p.strideHeight,f=p.strideWidth,m=p.filterDepth,g=p.filterHeight,x=p.filterWidth,y=new nm.TensorBuffer(p.filterShape,"float32"),b=y.values,[v,w,I,C]=y.strides,k=n.data.get(s.dataId).values,[S,T,N,$]=h,R=n.data.get(a.dataId).values,[A,E,F,D]=u,O=p.padInfo.front,L=p.padInfo.left,z=p.padInfo.top;for(let e=0;e<m;++e){let t=Math.max(0,Math.ceil((O-e)/d)),n=Math.min(p.outDepth,(p.inDepth+O-e)/d),r=e*v;for(let a=0;a<g;++a){let s=Math.max(0,Math.ceil((z-a)/c)),i=Math.min(p.outHeight,(p.inHeight+z-a)/c),o=a*w+r;for(let r=0;r<x;++r){let l=Math.max(0,Math.ceil((L-r)/f)),u=Math.min(p.outWidth,(p.inWidth+L-r)/f),h=r*I+o;for(let o=0;o<p.inChannels;++o){let m=o*C+h;for(let h=0;h<p.outChannels;++h){let g=0;for(let m=0;m<p.batchSize;++m){let p=m*A,x=m*S;for(let m=t;m<n;++m){let t=(e+m*d-O)*E+p,n=m*T+x;for(let e=s;e<i;++e){let s=(a+e*c-z)*F+t,i=e*N+n;for(let e=l;e<u;++e){let t=(r+e*f-L)*D+s,n=e*$+i;g+=R[t+o]*k[n+h]}}}}b[m+h]=g}}}}}return n.makeTensorInfo(y.shape,y.dtype,y.values)}};var tN=tN;let fH={kernelName:x.Conv3DBackpropInputV2,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,filter:s}=t,{pad:i,strides:o,inputShape:l}=r;pP([a],"conv3dBackpropInputV2");let u=rR.util.computeStrides(a.shape),h=rR.util.computeStrides(s.shape),p=tN.computeConv3DInfo(l,s.shape,o,1,i),d=new nm.TensorBuffer(p.inShape,"float32"),c=d.values,[f,m,g,x]=d.strides,y=n.data.get(a.dataId).values,[b,v,w,I]=u,C=n.data.get(s.dataId).values,[k,S,T,N]=h,{batchSize:$,filterDepth:R,filterHeight:A,filterWidth:E,inChannels:F,inDepth:D,inHeight:O,inWidth:L,outChannels:z,outDepth:_,outHeight:M,outWidth:P,strideDepth:B,strideHeight:W,strideWidth:G}=p,U=R-1-p.padInfo.front,V=A-1-p.padInfo.top,H=E-1-p.padInfo.left;for(let e=0;e<$;++e)for(let t=0;t<F;++t)for(let n=0;n<D;++n){let r=n-U,a=Math.max(0,Math.ceil(r/B)),s=Math.min(_,(R+r)/B);for(let i=0;i<O;++i){let o=i-V,l=Math.max(0,Math.ceil(o/W)),u=Math.min(M,(A+o)/W);for(let h=0;h<L;++h){let p=h-H,d=Math.max(0,Math.ceil(p/G)),$=Math.min(P,(E+p)/G),F=0;for(let n=a;n<s;++n){let a=n*B-r;for(let r=l;r<u;++r){let s=r*W-o;for(let i=d;i<$;++i){let o=i*G-p,l=b*e+v*n+w*r+I*i,u=k*(R-1-a)+S*(A-1-s)+T*(E-1-o)+N*t;for(let e=0;e<z;++e)F+=y[l+e]*C[u+e]}}}c[f*e+m*n+g*i+x*h+t]=F}}}return n.makeTensorInfo(d.shape,d.dtype,d.values)}},fq=dr(x.Cos,e=>Math.cos(e)),fj={kernelName:x.Cos,backendName:"cpu",kernelFunc:fq},fX=dr(x.Cosh,e=>Math.cosh(e)),fK={kernelName:x.Cosh,backendName:"cpu",kernelFunc:fX},fY={kernelName:x.CropAndResize,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{image:a,boxes:s,boxInd:i}=t,{cropSize:o,method:l,extrapolationValue:u}=r,[h,p,d,c]=a.shape,f=s.shape[0],[m,g]=o,x=(0,pz.buffer)([f,m,g,c],"float32"),y=n.data.get(s.dataId).values,b=n.data.get(i.dataId).values,v=n.data.get(a.dataId).values,w=rR.util.computeStrides(a.shape),I=rR.util.computeStrides(x.shape);for(let e=0;e<f;e++){let t=4*e,n=y[t],r=y[t+1],a=y[t+2],s=y[t+3],i=b[e];if(i>=h)continue;let o=m>1?(a-n)*(p-1)/(m-1):0,f=g>1?(s-r)*(d-1)/(g-1):0;for(let t=0;t<m;t++){let h=m>1?n*(p-1)+t*o:.5*(n+a)*(p-1);if(h<0||h>p-1){for(let n=0;n<g;n++)for(let r=0;r<c;r++){let a=r+n*I[2]+t*I[1]+e*I[0];x.values[a]=u}continue}if("bilinear"===l){let n=Math.floor(h),a=Math.ceil(h),o=h-n;for(let l=0;l<g;l++){let h=g>1?r*(d-1)+l*f:.5*(r+s)*(d-1);if(h<0||h>d-1){for(let n=0;n<c;n++){let r=n+l*I[2]+t*I[1]+e*I[0];x.values[r]=u}continue}let p=Math.floor(h),m=Math.ceil(h),y=h-p;for(let r=0;r<c;r++){let s=r+p*w[2]+n*w[1]+i*w[0],u=v[s],h=v[s=r+m*w[2]+n*w[1]+i*w[0]],d=v[s=r+p*w[2]+a*w[1]+i*w[0]],c=v[s=r+m*w[2]+a*w[1]+i*w[0]],f=u+(h-u)*y,g=d+(c-d)*y;s=r+l*I[2]+t*I[1]+e*I[0],x.values[s]=f+(g-f)*o}}}else for(let n=0;n<g;++n){let a=g>1?r*(d-1)+n*f:.5*(r+s)*(d-1);if(a<0||a>d-1){for(let r=0;r<c;r++){let a=r+n*I[2]+t*I[1]+e*I[0];x.values[a]=u}continue}let o=Math.round(a),l=Math.round(h);for(let r=0;r<c;r++){let a=r+o*w[2]+l*w[1]+i*w[0],s=r+n*I[2]+t*I[1]+e*I[0];x.values[s]=v[a]}}}}return n.makeTensorInfo(x.shape,x.dtype,x.values)}};var tN=tN;let fZ={kernelName:x.Cumprod,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,exclusive:i,reverse:o}=r;pP(a,"cumprod");let l=tN.getAxesPermutation([s],a.shape.length),u=a;null!=l&&(u=d8({inputs:{x:a},backend:n,attrs:{perm:l}}));let h=tN.getInnerMostAxes(1,a.shape.length)[0];if(h!==u.shape.length-1)throw Error(`backend.cumprod in CPU expects an inner-most axis=${u.shape.length-1} but got axis=${h}`);let p=(0,d5.upcastType)(u.dtype,"int32"),d=rR.util.makeOnesTypedArray(rR.util.sizeFromShape(u.shape),p),c=n.data.get(u.dataId).values,f=u.shape[u.shape.length-1],m=o?(e,t)=>e+f-t-1:(e,t)=>e+t;for(let e=0;e<c.length;e+=f)for(let t=0;t<f;t++){let n=m(e,t);if(0===t)d[n]=i?1:c[n];else{let r=m(e,t-1);d[n]=i?c[r]*d[r]:c[n]*d[r]}}let g=n.makeTensorInfo(u.shape,p,d);if(null!=l){let e=d8({inputs:{x:g},backend:n,attrs:{perm:tN.getUndoAxesPermutation(l)}});return n.disposeIntermediateTensorInfo(g),n.disposeIntermediateTensorInfo(u),e}return g}};var tN=tN;let fJ={kernelName:x.Cumsum,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,exclusive:i,reverse:o}=r;pP(a,"cumsum");let l=tN.getAxesPermutation([s],a.shape.length),u=a;null!=l&&(u=d8({inputs:{x:a},backend:n,attrs:{perm:l}}));let h=tN.getInnerMostAxes(1,a.shape.length)[0];if(h!==u.shape.length-1)throw Error(`backend.cumsum in CPU expects an inner-most axis=${u.shape.length-1} but got axis=${h}`);let p=(0,d5.upcastType)(u.dtype,"int32"),d=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(u.shape),p),c=n.data.get(u.dataId).values,f=u.shape[u.shape.length-1],m=o?(e,t)=>e+f-t-1:(e,t)=>e+t;for(let e=0;e<c.length;e+=f)for(let t=0;t<f;t++){let n=m(e,t);if(0===t)d[n]=i?0:c[n];else{let r=m(e,t-1);d[n]=i?c[r]+d[r]:c[n]+d[r]}}let g=n.makeTensorInfo(u.shape,p,d);if(null!=l){let e=d8({inputs:{x:g},backend:n,attrs:{perm:tN.getUndoAxesPermutation(l)}});return n.disposeIntermediateTensorInfo(g),n.disposeIntermediateTensorInfo(u),e}return g}},fQ={kernelName:x.DenseBincount,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,weights:s}=t,{size:i,binaryOutput:o}=r;if(1===a.shape.length){let e=p8(n.data.get(a.dataId).values,n.data.get(s.dataId).values,s.dtype,s.shape,i);return n.makeTensorInfo([i],s.dtype,e)}if(2===a.shape.length){let e=p9(n.bufferSync(a),n.bufferSync(s),i,o);return n.makeTensorInfo(e.shape,s.dtype,e.values)}throw Error(`Error in denseBincount: input must be at most rank 2, but got rank${a.shape.length}.`)}},f0={kernelName:x.DepthToSpace,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{blockSize:s,dataFormat:i}=r;rR.util.assert("NHWC"===i,()=>`Only NHWC dataFormat supported on CPU for depthToSpace. Got ${i}`);let o=a.shape[0],l=a.shape[1],u=a.shape[2],h=a.shape[3],p=l*s,d=u*s,c=h/(s*s),f=n.data.get(a.dataId).values,m=new Float32Array(o*p*d*c),g=0;for(let e=0;e<o;++e)for(let t=0;t<p;++t){let n=Math.floor(t/s),r=t%s;for(let t=0;t<d;++t){let a=Math.floor(t/s),i=t%s,o=(r*s+i)*c;for(let t=0;t<c;++t){let r=t+o+h*(a+u*(n+l*e));m[g++]=f[r]}}}return n.makeTensorInfo([o,p,d,c],a.dtype,m)}};var tN=tN;function f1(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,filter:s}=t,{strides:i,pad:o,dilations:l,dimRoundingMode:u}=r;pP([a,s],"depthwiseConv2DNative");let h=rR.util.computeStrides(a.shape),p=rR.util.computeStrides(s.shape),d=l;null==d&&(d=[1,1]),rR.util.assert(tN.eitherStridesOrDilationsAreOne(i,d),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${i} and dilations '${d}'`);let c=tN.computeConv2DInfo(a.shape,s.shape,i,d,o,u,!0),{filterHeight:f,filterWidth:m,dilationHeight:g,dilationWidth:x,padInfo:y}=c,b=y.left,v=y.top,w=c.outChannels/c.inChannels,I=new nm.TensorBuffer(c.outShape,a.dtype),C=n.data.get(a.dataId).values,k=n.data.get(s.dataId).values,S=I.values;for(let e=0;e<c.batchSize;++e){let t=e*h[0],n=e*I.strides[0];for(let e=0;e<c.outHeight;++e){let r=n+e*I.strides[1],a=e*c.strideHeight-v;for(let e=0;e<f;++e){let n=a+e*g;if(n<0||n>=c.inHeight)continue;let s=e*p[0],i=t+n*h[1];for(let e=0;e<c.outWidth;++e){let t=r+e*I.strides[2],n=e*c.strideWidth-b;for(let e=0;e<m;++e){let r=n+e*x;if(r<0||r>=c.inWidth)continue;let a=s+e*p[1],o=i+r*c.inChannels,l=t,u=a;for(let e=0;e<c.inChannels;++e){let t=C[o+e];for(let e=0;e<w;++e)S[l+e]+=t*k[u+e];l+=w,u+=w}}}}}}return n.makeTensorInfo(I.shape,I.dtype,I.values)}let f2={kernelName:x.DepthwiseConv2dNative,backendName:"cpu",kernelFunc:f1};var tN=tN;let f3={kernelName:x.DepthwiseConv2dNativeBackpropFilter,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,dy:s}=t,{strides:i,dilations:o,pad:l,dimRoundingMode:u,filterShape:h}=r;pP([a,s],"depthwiseConv2dNativeBackpropFilter");let p=tN.computeConv2DInfo(a.shape,h,i,o,l,u,!0),{strideHeight:d,strideWidth:c,filterHeight:f,filterWidth:m}=p,g=new nm.TensorBuffer(p.filterShape,"float32"),x=p.padInfo.left,y=p.padInfo.top,b=p.outChannels/p.inChannels,v=n.data.get(a.dataId).values,w=new nm.TensorBuffer(a.shape,a.dtype,v),I=n.data.get(s.dataId).values,C=new nm.TensorBuffer(s.shape,s.dtype,I);for(let e=0;e<f;++e){let t=Math.max(0,Math.ceil((y-e)/d)),n=Math.min(p.outHeight,(p.inHeight+y-e)/d);for(let r=0;r<m;++r){let a=Math.max(0,Math.ceil((x-r)/c)),s=Math.min(p.outWidth,(p.inWidth+x-r)/c);for(let i=0;i<p.outChannels;++i){let o=Math.trunc(i/b),l=i%b,u=0;for(let l=0;l<p.batchSize;++l)for(let h=t;h<n;++h){let t=e+h*d-y;for(let e=a;e<s;++e){let n=r+e*c-x;u+=w.get(l,t,n,o)*C.get(l,h,e,i)}}g.set(u,e,r,o,l)}}}return n.makeTensorInfo(g.shape,g.dtype,g.values)}};var tN=tN;let f4={kernelName:x.DepthwiseConv2dNativeBackpropInput,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,filter:s}=t,{strides:i,dilations:o,pad:l,dimRoundingMode:u,inputShape:h}=r;pP([a,s],"depthwiseConv2DNativeBackpropInput");let p=rR.util.computeStrides(a.shape),d=rR.util.computeStrides(s.shape),c=tN.computeConv2DInfo(h,s.shape,i,o,l,u,!0),f=new nm.TensorBuffer(c.inShape,"float32"),m=f.values,[g,x,y]=f.strides,b=n.data.get(a.dataId).values,[v,w,I]=p,C=n.data.get(s.dataId).values,[k,S,T]=d,{batchSize:N,filterHeight:$,filterWidth:R,inChannels:A,inHeight:E,inWidth:F,outChannels:D,outHeight:O,outWidth:L,strideHeight:z,strideWidth:_}=c,M=$-1-c.padInfo.top,P=R-1-c.padInfo.left,B=D/A;for(let e=0;e<N;++e)for(let t=0;t<A;++t)for(let n=0;n<E;++n){let r=n-M,a=Math.max(0,Math.ceil(r/z)),s=Math.min(O,($+r)/z);for(let i=0;i<F;++i){let o=i-P,l=Math.max(0,Math.ceil(o/_)),u=Math.min(L,(R+o)/_),h=0;for(let n=a;n<s;++n){let a=n*z-r;for(let r=l;r<u;++r){let s=r*_-o,i=v*e+w*n+I*r,l=k*($-1-a)+S*(R-1-s)+T*t;for(let e=0;e<B;++e)h+=b[i+(t*B+e)]*C[l+e]}}m[g*e+x*n+y*i+t]=h}}return n.makeTensorInfo(f.shape,f.dtype,f.values)}},f5={kernelName:x.Diag,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{x:r}=t,a=rR.util.sizeFromShape(r.shape),s=n.data.get(r.dataId).values,i=(0,pz.buffer)([a,a],r.dtype),o=i.values;for(let e=0;e<s.length;e++)o[e*a+e]=s[e];let l=[...r.shape,...r.shape];return n.makeTensorInfo(l,i.dtype,i.values)}};var tN=tN;let f6={kernelName:x.Dilation2D,backendName:"cpu",kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r,filter:a}=e,{strides:s,pad:i,dilations:o}=n,l=t.data.get(r.dataId).values,u=r.shape.length,h=t.data.get(a.dataId).values,p=a.shape.length,{batchSize:d,inHeight:c,inWidth:f,inChannels:m,outHeight:g,outWidth:x,padInfo:y,strideHeight:b,strideWidth:v,filterHeight:w,filterWidth:I,dilationHeight:C,dilationWidth:k,outShape:S}=tN.computeDilation2DInfo(r.shape,a.shape,s,i,"NHWC",o),T=rR.util.sizeFromShape(S),N=S.length,$=rR.util.getArrayFromDType(r.dtype,T);for(let e=0;e<d;++e)for(let t=0;t<g;++t){let n=t*b-y.top;for(let s=0;s<x;++s){let i=s*v-y.left;for(let o=0;o<m;++o){let d=Number.MIN_SAFE_INTEGER;for(let t=0;t<w;++t){let s=n+t*C;if(s>=0&&s<c)for(let n=0;n<I;++n){let c=i+n*k;if(c>=0&&c<f){let i=rR.util.locToIndex([e,s,c,o],u,rR.util.computeStrides(r.shape)),f=rR.util.locToIndex([t,n,o],p,rR.util.computeStrides(a.shape)),m=l[i]+h[f];m>d&&(d=m)}}}$[rR.util.locToIndex([e,t,s,o],N,rR.util.computeStrides(S))]=d}}}return{dataId:t.write(rR.util.toTypedArray($,r.dtype),S,r.dtype),shape:S,dtype:r.dtype}}};var tN=tN;let f8={kernelName:x.Dilation2DBackpropFilter,backendName:"cpu",kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r,filter:a,dy:s}=e,{strides:i,pad:o,dilations:l}=n,u=rR.util.toNestedArray(r.shape,t.data.get(r.dataId).values),h=rR.util.toNestedArray(a.shape,t.data.get(a.dataId).values),{batchSize:p,inHeight:d,inWidth:c,inChannels:f,outHeight:m,outWidth:g,padInfo:y,strideHeight:b,strideWidth:v,filterHeight:w,filterWidth:I,dilationHeight:C,dilationWidth:k,outShape:S}=tN.computeDilation2DInfo(r.shape,a.shape,i,o,"NHWC",l);rR.util.assert(s.rank===S.length,()=>`Error in ${x.Dilation2DBackpropFilter}, dy must have the same rank as output ${S.length}, but got ${s.rank}`);let T=rR.util.toNestedArray(S,t.data.get(s.dataId).values),N=rR.util.makeZerosNestedTypedArray(a.shape,a.dtype);for(let e=0;e<p;++e)for(let t=0;t<m;++t){let n=t*b-y.top;for(let r=0;r<g;++r){let a=r*v-y.left;for(let s=0;s<f;++s){let i=Number.MIN_SAFE_INTEGER,o=0,l=0;for(let t=0;t<w;++t){let r=n+t*C;if(r>=0&&r<d)for(let n=0;n<I;++n){let p=a+n*k;if(p>=0&&p<c){let a=u[e][r][p][s]+h[t][n][s];a>i&&(i=a,o=t,l=n)}}}N[o][l][s]+=T[e][t][r][s]}}}return{dataId:t.write(rR.util.toTypedArray(N,r.dtype),a.shape,a.dtype),shape:a.shape,dtype:a.dtype}}};var tN=tN;let f9={kernelName:x.Dilation2DBackpropInput,backendName:"cpu",kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r,filter:a,dy:s}=e,{strides:i,pad:o,dilations:l}=n,u=rR.util.toNestedArray(r.shape,t.data.get(r.dataId).values),h=rR.util.toNestedArray(a.shape,t.data.get(a.dataId).values),{batchSize:p,inHeight:d,inWidth:c,inChannels:f,outHeight:m,outWidth:g,padInfo:y,strideHeight:b,strideWidth:v,filterHeight:w,filterWidth:I,dilationHeight:C,dilationWidth:k,outShape:S}=tN.computeDilation2DInfo(r.shape,a.shape,i,o,"NHWC",l);rR.util.assert(s.rank===S.length,()=>`Error in ${x.Dilation2DBackpropInput}, dy must have the same rank as output ${S.length}, but got ${s.rank}`);let T=rR.util.toNestedArray(S,t.data.get(s.dataId).values),N=rR.util.makeZerosNestedTypedArray(r.shape,r.dtype);for(let e=0;e<p;++e)for(let t=0;t<m;++t){let n=t*b-y.top;for(let r=0;r<g;++r){let a=r*v-y.left;for(let s=0;s<f;++s){let i=Number.MIN_SAFE_INTEGER,o=n<0?0:n,l=a<0?0:a;for(let t=0;t<w;++t){let r=n+t*C;if(r>=0&&r<d)for(let n=0;n<I;++n){let p=a+n*k;if(p>=0&&p<c){let a=u[e][r][p][s]+h[t][n][s];a>i&&(i=a,o=r,l=p)}}}N[e][o][l][s]+=T[e][t][r][s]}}}return{dataId:t.write(rR.util.toTypedArray(N,r.dtype),r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}},f7={kernelName:x.Draw,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{image:a}=t,{canvas:s,options:i}=r,{contextOptions:o,imageOptions:l}=i||{},u=(null==l?void 0:l.alpha)||1,h=(null==o?void 0:o.contextType)||"2d";if("2d"!==h)throw Error(`Context type ${o.contextType} is not supported by the CPU backend.`);let p=s.getContext(h,(null==o?void 0:o.contextAttributes)||{});if(null==p)throw Error(`Could not get the context with ${h} type.`);let[d,c]=a.shape.slice(0,2),f=2===a.shape.length?1:a.shape[2],m=n.data.get(a.dataId).values,g="float32"===a.dtype?255:1,x=new Uint8ClampedArray(c*d*4);for(let e=0;e<d*c;++e){let t=[0,0,0,255*u];for(let n=0;n<f;n++){let r=m[e*f+n];if("float32"===a.dtype){if(r<0||r>1)throw Error(`Tensor values for a float32 Tensor must be in the range [0 - 1] but encountered ${r}.`)}else if("int32"===a.dtype&&(r<0||r>255))throw Error(`Tensor values for a int32 Tensor must be in the range [0 - 255] but encountered ${r}.`);1===f?(t[0]=r*g,t[1]=r*g,t[2]=r*g):t[n]=r*g}let n=4*e;x[n+0]=Math.round(t[0]),x[n+1]=Math.round(t[1]),x[n+2]=Math.round(t[2]),x[n+3]=Math.round(t[3])}s.width=c,s.height=d;let y=new ImageData(x,c,d);return p.putImageData(y,0,0),a}};var tN=tN,tN=tN;function me(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{axis:i,keepDims:o}=a;pP(s,"sum");let l=(t="bool"===s.dtype?pQ({inputs:{x:s},backend:r,attrs:{dtype:"int32"}}):pX({inputs:{x:s},backend:r})).shape.length,u=rR.util.parseAxisParam(i,t.shape),h=tN.getAxesPermutation(u,l),p=u,d=t;null!=h&&(d=d8({inputs:{x:t},backend:r,attrs:{perm:h}}),p=tN.getInnerMostAxes(p.length,l)),tN.assertAxesAreInnerMostDims("sum",p,d.shape.length);let[c,f]=tN.computeOutAndReduceShapes(d.shape,p),m=pj(r,c,tN.upcastType(d.dtype,"int32")),g=rR.util.sizeFromShape(f),x=r.data.get(m.dataId).values,y=r.data.get(d.dataId).values;for(let e=0;e<x.length;++e){let t=e*g,n=0;for(let e=0;e<g;++e)n+=y[t+e];x[e]=n}if(o){let e=tN.expandShapeToKeepDim(m.shape,u),t=m;m=c6({inputs:{x:m},backend:r,attrs:{shape:e}}),r.disposeIntermediateTensorInfo(t)}return r.disposeIntermediateTensorInfo(t),null!=h&&r.disposeIntermediateTensorInfo(d),m}let mt={kernelName:x.Sum,backendName:"cpu",kernelFunc:me},mn={kernelName:x.Einsum,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{equation:a}=r,{allDims:s,summedDims:i,idDims:o}=tN.decodeEinsumEquation(a,t.length);tN.checkEinsumDimSizes(s.length,o,t);let{path:l,steps:u}=tN.getEinsumComputePath(i,o),h=u.length,p=null,d=s.length,c=[];for(let e=0;e<h;++e){for(let r of u[e]){let e,{permutationIndices:a,expandDims:s}=tN.getEinsumPermutation(d,o[r]);tN.isIdentityPermutation(a)?e=t[r]:(e=d8({inputs:{x:t[r]},backend:n,attrs:{perm:a}}),c.push(e));let i=e.shape.slice();for(let e=0;e<s.length;++e)i.splice(s[e],0,1);rR.util.arraysEqual(e.shape,i)||(e=c6({inputs:{x:e},backend:n,attrs:{shape:i}}),c.push(e)),null===p?p=e:(p=dJ({inputs:{a:e,b:p},backend:n}),c.push(p))}e<h-1&&(l[e]>=0&&(p=me({inputs:{x:p},backend:n,attrs:{axis:l[e]-(s.length-d),keepDims:!1}}),c.push(p)),d--)}for(let e of c)e!==p&&n.disposeIntermediateTensorInfo(e);return p}},mr={kernelName:x.EluGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{dy:r,y:a}=t;pP([r,a],"eluGrad");let s=new Float32Array(rR.util.sizeFromShape(a.shape)),i=n.data.get(a.dataId).values,o=n.data.get(r.dataId).values;for(let e=0;e<i.length;++e){let t=i[e];t>=0?s[e]=o[e]:s[e]=o[e]*(t+1)}return n.makeTensorInfo(a.shape,"float32",s)}};var tN=tN;let ma=tN.ERF_P,ms=tN.ERF_A1,mi=tN.ERF_A2,mo=tN.ERF_A3,ml=tN.ERF_A4,mu=tN.ERF_A5,mh=dr(x.Erf,e=>{let t=Math.sign(e),n=Math.abs(e),r=1/(1+ma*n);return t*(1-((((mu*r+ml)*r+mo)*r+mi)*r+ms)*r*Math.exp(-n*n))}),mp={kernelName:x.Erf,backendName:"cpu",kernelFunc:mh};function md(e){let{inputs:t,backend:n,attrs:r}=e,{input:a}=t,{dim:s}=r,i=a.shape.length,o=a.shape.slice(),l=s;return s<0&&(rR.util.assert(-(i+1)<=s,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),l=i+s+1),o.splice(l,0,1),c6({inputs:{x:a},backend:n,attrs:{shape:o}})}let mc={kernelName:x.ExpandDims,backendName:"cpu",kernelFunc:md};var tN=tN;let mf=pV((e,t)=>e/t),mm=p1(x.RealDiv,mf),mg={kernelName:x.RealDiv,backendName:"cpu",kernelFunc:mm};function mx(e,t,n){let r=e.shape,a=r[0],s=r[1],i=n.data.get(e.dataId),o=i.complexTensorInfos.real,l=i.complexTensorInfos.imag,u=[a,s],h=rR.util.sizeFromShape(u),p=rR.util.getTypedArrayFromDType("float32",h),d=rR.util.getTypedArrayFromDType("float32",h);for(let e=0;e<a;e++){let r=cb({inputs:{x:o},backend:n,attrs:{begin:[e,0],size:[1,s]}}),a=cb({inputs:{x:l},backend:n,attrs:{begin:[e,0],size:[1,s]}}),i=pH({inputs:{real:r,imag:a},backend:n}),{real:u,imag:h}=function(e,t,n){var r;let a=rR.util.sizeFromShape(e.shape),s=n.data.get(e.dataId),i=n.data.get(s.complexTensorInfos.real.dataId).values,o=n.data.get(s.complexTensorInfos.imag.dataId).values;if(((r=a)&r-1)==0){let r=function e(t,n,r,a,s){if(1===r)return{real:t,imag:n};let i=tN.mergeRealAndImagArrays(t,n),o=r/2,l=tN.complexWithEvenIndex(i),u=l.real,h=l.imag,p=[u.length],d=s.makeTensorInfo(p,"float32",u),c=s.makeTensorInfo(p,"float32",h),f=pH({inputs:{real:d,imag:c},backend:s}),m=tN.complexWithOddIndex(i),g=m.real,x=m.imag,y=[g.length],b=s.makeTensorInfo(y,"float32",g),v=s.makeTensorInfo(y,"float32",x),w=pH({inputs:{real:b,imag:v},backend:s}),I=e(u,h,o,a,s),C=I.real,k=I.imag,S=[C.length],T=s.makeTensorInfo(S,"float32",C),N=s.makeTensorInfo(S,"float32",k),$=pH({inputs:{real:T,imag:N},backend:s}),R=e(g,x,o,a,s),A=R.real,E=R.imag,F=[A.length],D=s.makeTensorInfo(F,"float32",A),O=s.makeTensorInfo(F,"float32",E),L=pH({inputs:{real:D,imag:O},backend:s}),z=tN.exponents(r,a),_=[z.real.length],M=s.makeTensorInfo(_,"float32",z.real),P=s.makeTensorInfo(_,"float32",z.imag),B=pH({inputs:{real:M,imag:P},backend:s}),W=dJ({inputs:{a:B,b:L},backend:s}),G=p5({inputs:{a:$,b:W},backend:s}),U=cB({inputs:{a:$,b:W},backend:s}),V=pY({inputs:{input:G},backend:s}),H=pY({inputs:{input:U},backend:s}),q=fL({inputs:{input:G},backend:s}),j=fL({inputs:{input:U},backend:s}),X=f_({inputs:[V,H],backend:s,attrs:{axis:0}}),K=f_({inputs:[q,j],backend:s,attrs:{axis:0}}),Y=s.data.get(X.dataId).values,Z=s.data.get(K.dataId).values;return s.disposeIntermediateTensorInfo(d),s.disposeIntermediateTensorInfo(c),s.disposeIntermediateTensorInfo(f),s.disposeIntermediateTensorInfo(b),s.disposeIntermediateTensorInfo(v),s.disposeIntermediateTensorInfo(w),s.disposeIntermediateTensorInfo(T),s.disposeIntermediateTensorInfo(N),s.disposeIntermediateTensorInfo($),s.disposeIntermediateTensorInfo(D),s.disposeIntermediateTensorInfo(O),s.disposeIntermediateTensorInfo(L),s.disposeIntermediateTensorInfo(M),s.disposeIntermediateTensorInfo(P),s.disposeIntermediateTensorInfo(B),s.disposeIntermediateTensorInfo(W),s.disposeIntermediateTensorInfo(G),s.disposeIntermediateTensorInfo(U),s.disposeIntermediateTensorInfo(V),s.disposeIntermediateTensorInfo(q),s.disposeIntermediateTensorInfo(H),s.disposeIntermediateTensorInfo(j),s.disposeIntermediateTensorInfo(X),s.disposeIntermediateTensorInfo(K),{real:Y,imag:Z}}(i,o,a,t,n),s=[e.shape[0],e.shape[1]];if(t){let e=n.makeTensorInfo(s,"float32",r.real),t=n.makeTensorInfo(s,"float32",r.imag),i=n.makeTensorInfo([],"float32",rR.util.createScalarValue(a,"float32")),o=pX({inputs:{x:i},backend:n}),l=mg.kernelFunc({inputs:{a:e,b:i},backend:n}),u=mg.kernelFunc({inputs:{a:t,b:o},backend:n}),h=n.data.get(l.dataId).values,p=n.data.get(u.dataId).values;return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(l),n.disposeIntermediateTensorInfo(u),{real:h,imag:p}}return r}{let e=function(e,t,n){let r=new Float32Array(2*t);for(let a=0;a<t;a++){let s=0,i=0;for(let r=0;r<t;r++){let o=tN.exponent(a*r,t,n),l=tN.getComplexWithIndex(e,r);s+=l.real*o.real-l.imag*o.imag,i+=l.real*o.imag+l.imag*o.real}n&&(s/=t,i/=t),tN.assignToTypedArray(r,s,i,a)}return r}(tN.mergeRealAndImagArrays(i,o),a,t);return tN.splitRealAndImagArrays(e)}}(i,t,n),c=tN.mergeRealAndImagArrays(u,h);for(let t=0;t<s;t++){let n=tN.getComplexWithIndex(c,t);p[e*s+t]=n.real,d[e*s+t]=n.imag}n.disposeIntermediateTensorInfo(r),n.disposeIntermediateTensorInfo(a),n.disposeIntermediateTensorInfo(i)}let c=n.makeTensorInfo(u,"float32",p),f=n.makeTensorInfo(u,"float32",d),m=pH({inputs:{real:c,imag:f},backend:n});return n.disposeIntermediateTensorInfo(c),n.disposeIntermediateTensorInfo(f),m}let my={kernelName:x.FFT,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{input:r}=t,a=rR.util.sizeFromShape(r.shape),s=r.shape[r.shape.length-1],i=c6({inputs:{x:r},backend:n,attrs:{shape:[a/s,s]}}),o=mx(i,!1,n),l=c6({inputs:{x:o},backend:n,attrs:{shape:r.shape}});return n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(o),l}};function mb(e){var t,n;let{backend:r,attrs:a}=e,{shape:s,value:i,dtype:o}=a,l=o||rR.util.inferDtype(i),u=rR.util.getArrayFromDType(l,rR.util.sizeFromShape(s));return t=u,n=i,t.fill(n),r.makeTensorInfo(s,l,u)}let mv={kernelName:x.Fill,backendName:"cpu",kernelFunc:mb},mw={kernelName:x.FlipLeftRight,backendName:"cpu",kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{image:r}=e,a=rR.util.getTypedArrayFromDType(r.dtype,rR.util.sizeFromShape(r.shape)),[s,i,o,l]=r.shape,u=n.data.get(r.dataId).values;for(let e=0;e<s;e++){let t=e*o*i*l;for(let e=0;e<i;e++){let n=o*l*e;for(let e=0;e<o;e++){let r=e*l;for(let s=0;s<l;s++){let i=Math.round(o-e-1),h=t+n+r+s,p=u[h];i>=0&&i<o&&(p=u[t+n+i*l+s]),a[h]=p}}}}return{dataId:n.write(a,r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}},mI={kernelName:x.FusedConv2D,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,filter:s,bias:i,preluActivationWeights:o}=t,{strides:l,pad:u,dataFormat:h,dilations:p,dimRoundingMode:d,activation:c,leakyreluAlpha:f}=r,m=fP({inputs:{x:a,filter:s},backend:n,attrs:{strides:l,pad:u,dataFormat:h,dilations:p,dimRoundingMode:d}});if(i){let e=m;if("NCHW"===h&&1===i.shape.length&&1!==i.shape[0]){let e=c6({inputs:{x:i},backend:n,attrs:{shape:[i.shape[0],1,1]}});m=p5({inputs:{a:m,b:e},backend:n}),n.disposeIntermediateTensorInfo(e)}else m=p5({inputs:{a:m,b:i},backend:n});n.disposeIntermediateTensorInfo(e)}if(c){let e=m;if("NCHW"===h&&"prelu"===c&&1===o.shape.length&&1!==o.shape[0]){let e=c6({inputs:{x:o},backend:n,attrs:{shape:[o.shape[0],1,1]}});m=c4(n,m,c,e,f),n.disposeIntermediateTensorInfo(e)}else m=c4(n,m,c,o,f);n.disposeIntermediateTensorInfo(e)}return m}},mC={kernelName:x.FusedDepthwiseConv2D,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,filter:s,bias:i,preluActivationWeights:o}=t,{strides:l,pad:u,dataFormat:h,dilations:p,dimRoundingMode:d,activation:c,leakyreluAlpha:f}=r,m=f1({inputs:{x:a,filter:s},backend:n,attrs:{strides:l,pad:u,dataFormat:h,dilations:p,dimRoundingMode:d}});if(i){let e=m;m=p5({inputs:{a:m,b:i},backend:n}),n.disposeIntermediateTensorInfo(e)}if(c){let e=m;m=c4(n,m,c,o,f),n.disposeIntermediateTensorInfo(e)}return m}};var tN=tN;let mk={kernelName:x.GatherNd,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{params:r,indices:a}=t,s=rR.util.sizeFromShape(r.shape),i=a.shape,o=i[i.length-1],[l,u,h,p]=tN.prepareAndValidate(r,a);if(0===u)return n.makeTensorInfo(l,r.dtype,[]);let d=dS(n.data.get(a.dataId).values,n.bufferSync(r),r.dtype,u,o,h,p,r.shape,s);return n.makeTensorInfo(l,r.dtype,d.values)}};var tN=tN;let mS={kernelName:x.GatherV2,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,indices:s}=t,{axis:i,batchDims:o}=r;pP([a,s],"gatherV2");let l=rR.util.parseAxisParam(i,a.shape)[0],u=n.data.get(s.dataId).values,h=a.shape[l];for(let e=0;e<u.length;++e){let t=u[e];rR.util.assert(t<=h-1&&t>=0,()=>`GatherV2: the index value ${t} is not in [0, ${h-1}]`)}let p=o;null==o&&(p=0);let d=rR.util.sizeFromShape(s.shape),c=tN.segment_util.collectGatherOpShapeInfo(a,s,l,p),f=c6({inputs:{x:a},backend:n,attrs:{shape:[c.batchSize,c.outerSize,c.dimSize,c.sliceSize]}}),m=c6({inputs:{x:s},backend:n,attrs:{shape:[c.batchSize,d/c.batchSize]}}),g=[c.batchSize,c.outerSize,d/c.batchSize,c.sliceSize],x=n.bufferSync(m),y=dT(n.bufferSync(f),x,g);return n.disposeIntermediateTensorInfo(f),n.disposeIntermediateTensorInfo(m),n.makeTensorInfo(c.outputShape,y.dtype,y.values)}},mT={kernelName:x.IFFT,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{input:r}=t,a=rR.util.sizeFromShape(r.shape),s=r.shape[r.shape.length-1],i=c6({inputs:{x:r},backend:n,attrs:{shape:[a/s,s]}}),o=mx(i,!0,n),l=c6({inputs:{x:o},backend:n,attrs:{shape:r.shape}});return n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(o),l}},mN=dr(x.IsFinite,e=>+!!Number.isFinite(e),"bool"),m$={kernelName:x.IsFinite,backendName:"cpu",kernelFunc:mN},mR=dr(x.IsInf,e=>+(Math.abs(e)===1/0),"bool"),mA={kernelName:x.IsInf,backendName:"cpu",kernelFunc:mR},mE=dr(x.IsNan,e=>+!!Number.isNaN(e),"bool"),mF={kernelName:x.IsNan,backendName:"cpu",kernelFunc:mE},mD={kernelName:x.LinSpace,backendName:"cpu",kernelFunc:function(e){let{backend:t,attrs:n}=e,{start:r,stop:a,num:s}=n,i=dP(r,a,s);return t.makeTensorInfo([i.length],"float32",i)}},mO=dr(x.Log1p,e=>Math.log1p(e)),mL={kernelName:x.Log1p,backendName:"cpu",kernelFunc:mO},mz=pV((e,t)=>e&&t),m_=p1(x.LogicalAnd,mz,null,"bool"),mM={kernelName:x.LogicalAnd,backendName:"cpu",kernelFunc:m_},mP=dr(x.LogicalNot,e=>+!e,"bool"),mB={kernelName:x.LogicalNot,backendName:"cpu",kernelFunc:mP},mW=pV((e,t)=>e||t),mG=p1(x.LogicalOr,mW,null,"bool"),mU={kernelName:x.LogicalOr,backendName:"cpu",kernelFunc:mG},mV={kernelName:x.LRN,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{depthRadius:s,bias:i,alpha:o,beta:l}=r;pP(a,"LRN");let u=a.shape[3],h=u-1,p=n.data.get(a.dataId).values,d=rR.util.sizeFromShape(a.shape),c=new Float32Array(d);for(let e=0;e<d;e++){let t=function(e){let t=e%u,n=e-t+Math.max(0,t-s),r=e-t+Math.min(t+s,h),a=0;for(;n<=r;n++){let e=p[n];a+=e*e}return a}(e),n=p[e]*Math.pow(i+o*t,-l);c[e]=n}return n.makeTensorInfo(a.shape,a.dtype,c)}},mH={kernelName:x.LRNGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,y:s,dy:i}=t,{depthRadius:o,bias:l,alpha:u,beta:h}=r;pP(i,"LRNGrad");let p=rR.util.sizeFromShape(i.shape),d=i.shape[3],c=n.data.get(i.dataId).values,f=n.data.get(a.dataId).values,m=n.data.get(s.dataId).values,g=new Float32Array(p);for(let e=0;e<p;e++){let t=e%d,n=e-t+Math.max(0,t-o),r=e-t+Math.min(d,t+o+1),a=0;for(let e=n;e<r;e++)a+=Math.pow(f[e],2);a=u*a+l;for(let t=n;t<r;t++){let n=-2*u*h*f[t]*m[e]/a;e===t&&(n+=Math.pow(a,-h)),n*=c[e],g[t]+=n}}return n.makeTensorInfo(i.shape,a.dtype,g)}};var tN=tN;function mq(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{reductionIndices:s,keepDims:i}=r,o=a.shape,l=o.length,u=rR.util.parseAxisParam(s,o),h=u,p=tN.getAxesPermutation(h,l),d=n.data.get(a.dataId).values;if(null!=p){let e=Array(l);for(let t=0;t<e.length;t++)e[t]=o[p[t]];d=d6(d,o,a.dtype,p,e),h=tN.getInnerMostAxes(h.length,l),o=e}pP(a,"max"),tN.assertAxesAreInnerMostDims("max",h,l);let[c,f]=tN.computeOutAndReduceShapes(o,h),m=dU(d,rR.util.sizeFromShape(f),c,a.dtype),g=n.write(m,c,a.dtype),x=c;return i&&(x=tN.expandShapeToKeepDim(c,u)),{dataId:g,shape:x,dtype:a.dtype}}let mj={kernelName:x.Max,backendName:"cpu",kernelFunc:mq};var tN=tN;let mX={kernelName:x.MaxPool,backendName:"cpu",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n;pP(s,"maxPool");let{filterSize:i,strides:o,pad:l,dimRoundingMode:u}=a;rR.util.assert(tN.eitherStridesOrDilationsAreOne(o,1),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '1'`);let h=tN.computePool2DInfo(s.shape,i,o,1,l,u);if(1===h.filterWidth&&1===h.filterHeight&&rR.util.arraysEqual(h.inShape,h.outShape))t=pX({inputs:{x:s},backend:r});else{let e=r.data.get(s.dataId).values,n=rR.util.computeStrides(s.shape),a=fw(e,s.shape,s.dtype,n,h,"max");t=r.makeTensorInfo(h.outShape,s.dtype,a.values)}return t}};var tN=tN;let mK={kernelName:x.MaxPool3D,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{filterSize:s,strides:i,pad:o,dimRoundingMode:l,dataFormat:u}=r;pP(a,"maxPool3d");let h=tN.computePool3DInfo(a.shape,s,i,1,o,l,u),p=fC(n.data.get(a.dataId).values,a.shape,a.dtype,rR.util.computeStrides(a.shape),h,"max");return n.makeTensorInfo(p.shape,"float32",p.values)}};var tN=tN;let mY={kernelName:x.MaxPool3DGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s}=t,{filterSize:i,strides:o,pad:l,dimRoundingMode:u}=r;pP([a,s],"maxPool3DGrad");let h=tN.computePool3DInfo(s.shape,i,o,1,l,u),p=function(e,t){let n=(0,pz.buffer)(t.outShape,"int32"),r=t.strideDepth,a=t.strideHeight,s=t.strideWidth,i=t.dilationDepth,o=t.dilationHeight,l=t.dilationWidth,u=t.effectiveFilterDepth,h=t.effectiveFilterHeight,p=t.effectiveFilterWidth,d=t.padInfo.front,c=t.padInfo.top,f=t.padInfo.left;for(let m=0;m<t.batchSize;++m)for(let g=0;g<t.inChannels;++g)for(let x=0;x<t.outDepth;++x){let y=x*r-d,b=y;for(;b<0;)b+=i;let v=Math.min(t.inDepth,u+y);for(let r=0;r<t.outHeight;++r){let u=r*a-c,d=u;for(;d<0;)d+=o;let w=Math.min(t.inHeight,h+u);for(let a=0;a<t.outWidth;++a){let c=a*s-f,I=c;for(;I<0;)I+=l;let C=Math.min(t.inWidth,p+c),k=-1/0,S=-1;for(let t=b;t<v;t+=i){let n=t-y;for(let r=d;r<w;r+=o){let a=r-u;for(let s=I;s<C;s+=l){let i=s-c,o=e.get(m,t,r,s,g);o>=k&&(k=o,S=n*h*p+a*h+i)}}}n.set(S,m,x,r,a,g)}}}return n}(n.bufferSync(s),h),d=h.strideDepth,c=h.strideHeight,f=h.strideWidth,m=h.dilationDepth,g=h.dilationHeight,x=h.dilationWidth,y=h.effectiveFilterDepth,b=h.effectiveFilterHeight,v=h.effectiveFilterWidth,w=y-1-h.padInfo.front,I=v-1-h.padInfo.left,C=b-1-h.padInfo.top,k=(0,pz.buffer)(s.shape,"float32"),S=n.bufferSync(a);for(let e=0;e<h.batchSize;++e)for(let t=0;t<h.inChannels;++t)for(let n=0;n<h.inDepth;++n)for(let r=0;r<h.inHeight;++r)for(let a=0;a<h.inWidth;++a){let s=n-w,i=r-C,o=a-I,l=0;for(let n=0;n<y;n+=m){let r=(s+n)/d;if(!(r<0)&&!(r>=h.outDepth)&&Math.floor(r)===r)for(let a=0;a<b;a+=g){let s=(i+a)/c;if(!(s<0)&&!(s>=h.outHeight)&&Math.floor(s)===s)for(let i=0;i<v;i+=x){let u=(o+i)/f;if(u<0||u>=h.outWidth||Math.floor(u)!==u)continue;let d=+(y*b*v-1-p.get(e,r,s,u,t)===n*b*v+a*v+i);0!==d&&(l+=S.get(e,r,s,u,t)*d)}}}k.set(l,e,n,r,a,t)}return n.makeTensorInfo(k.shape,k.dtype,k.values)}};var tN=tN;let mZ={kernelName:x.MaxPoolGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s,output:i}=t;pP([s,i],"maxPoolGrad");let{filterSize:o,strides:l,pad:u,dimRoundingMode:h}=r,p=tN.computePool2DInfo(s.shape,o,l,1,u,h),d=n.data.get(s.dataId).values,c=(0,pz.buffer)(p.outShape,s.dtype,fI(d,s.shape,s.dtype,p).values),f=p.strideHeight,m=p.strideWidth,g=p.dilationHeight,x=p.dilationWidth,y=p.effectiveFilterHeight,b=p.effectiveFilterWidth,v=b-1-p.padInfo.left,w=y-1-p.padInfo.top,I=(0,pz.buffer)(s.shape,"float32"),C=n.data.get(a.dataId).values,k=(0,pz.buffer)(a.shape,"float32",C);for(let e=0;e<p.batchSize;++e)for(let t=0;t<p.inChannels;++t)for(let n=0;n<p.inHeight;++n)for(let r=0;r<p.inWidth;++r){let a=n-w,s=r-v,i=0;for(let n=0;n<y;n+=g){let r=(a+n)/f;if(!(r<0)&&!(r>=p.outHeight)&&Math.floor(r)===r)for(let a=0;a<b;a+=x){let o=(s+a)/m;if(o<0||o>=p.outWidth||Math.floor(o)!==o)continue;let l=+(y*b-1-c.get(e,r,o,t)===n*b+a);0!==l&&(i+=k.get(e,r,o,t)*l)}}I.set(i,e,n,r,t)}return n.makeTensorInfo(I.shape,I.dtype,I.values)}};var tN=tN;let mJ={kernelName:x.MaxPoolWithArgmax,backendName:"cpu",kernelFunc:({inputs:e,attrs:t,backend:n})=>{var r,a;let s,i,o,{x:l}=e,{filterSize:u,strides:h,pad:p,includeBatchInIndex:d}=t;pP(l,"MaxPoolWithArgmax");let c=n.data.get(l.dataId).values,f=tN.computePool2DInfo(l.shape,u,h,[1,1],p),[m,g]=(r=l.shape,a=l.dtype,s=rR.util.computeStrides(r),i=fw(c,r,a,s,f,"max"),o=fI(c,r,a,f,!0,d),[i.values,o.values]),x=n.write(m,f.outShape,l.dtype),y=n.write(g,f.outShape,l.dtype);return[{dataId:x,shape:f.outShape,dtype:l.dtype},{dataId:y,shape:f.outShape,dtype:"int32"}]}};var tN=tN;let mQ={kernelName:x.Mean,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,keepDims:i}=r,o=rR.util.parseAxisParam(s,a.shape),l=tN.computeOutAndReduceShapes(a.shape,o)[1],u=rR.util.sizeFromShape(l),h=[],p=n.makeTensorInfo([],"float32",new Float32Array([u]));h.push(p);let d=pQ({inputs:{x:a},backend:n,attrs:{dtype:"float32"}});h.push(d);let c=mm({inputs:{a:d,b:p},backend:n});h.push(c);let f=me({inputs:{x:c},backend:n,attrs:{axis:s,keepDims:i}});return h.forEach(e=>n.disposeIntermediateTensorInfo(e)),f}};var tN=tN;let m0={kernelName:x.Min,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,keepDims:i}=r;pP(a,"min");let o=rR.util.parseAxisParam(s,a.shape),l=o,u=tN.getAxesPermutation(l,a.shape.length),h=a;null!=u&&(h=d8({inputs:{x:a},backend:n,attrs:{perm:u}}),l=tN.getInnerMostAxes(l.length,a.shape.length)),tN.assertAxesAreInnerMostDims("min",l,h.shape.length);let[p,d]=tN.computeOutAndReduceShapes(h.shape,l),c=rR.util.sizeFromShape(d),f=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(p),h.dtype),m=n.data.get(h.dataId).values;for(let e=0;e<f.length;++e){let t=e*c,n=m[t];for(let e=0;e<c;++e){let r=m[t+e];(Number.isNaN(r)||r<n)&&(n=r)}f[e]=n}null!=u&&n.disposeIntermediateTensorInfo(h);let g=n.makeTensorInfo(p,h.dtype,f);if(i){let e=c6({inputs:{x:g},backend:n,attrs:{shape:tN.expandShapeToKeepDim(p,o)}});return n.disposeIntermediateTensorInfo(g),e}return g}},m1={kernelName:x.MirrorPad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{paddings:s,mode:i}=r;pP(a,"mirrorPad");let o=s.map((e,t)=>e[0]+a.shape[t]+e[1]),l=s.map(e=>e[0]),u=s.map((e,t)=>e[0]+a.shape[t]),h=+("reflect"!==i),p=n.data.get(a.dataId).values,d=a.shape.length,c=rR.util.computeStrides(a.shape),f=rR.util.sizeFromShape(o),m=o.length,g=rR.util.computeStrides(o),x=rR.util.getTypedArrayFromDType(a.dtype,f);for(let e=0;e<f;e++){let t=rR.util.indexToLoc(e,m,g);for(let e=0;e<m;e++)t[e]<l[e]?t[e]=2*l[e]-t[e]-h:t[e]>=u[e]&&(t[e]=(u[e]-1)*2-t[e]+h);t=t.map((e,t)=>e-l[t]);let n=rR.util.locToIndex(t,d,c);x[e]=p[n]}return{dataId:n.write(x,o,a.dtype),shape:o,dtype:a.dtype}}},m2=pV((e,t)=>{let n=e%t;return e<0&&t<0||e>=0&&t>=0?n:(n+t)%t}),m3=p1(x.Mod,m2),m4={kernelName:x.Mod,backendName:"cpu",kernelFunc:m3};var tN=tN;function m5(e){let{inputs:t,backend:n,attrs:r}=e,{logits:a}=t,{dim:s}=r,i=a.shape.length,o=s;if(-1===o&&(o=i-1),o!==i-1)throw Error(`Softmax along a non-last dimension is not yet supported. Logits was rank ${i} and dim was ${o}`);let l=rR.util.parseAxisParam([o],a.shape),u=mq({inputs:{x:a},backend:n,attrs:{reductionIndices:l,keepDims:!1}}),h=tN.expandShapeToKeepDim(u.shape,l),p=c6({inputs:{x:u},backend:n,attrs:{shape:h}}),d=cB({inputs:{a:a,b:p},backend:n}),c=df({inputs:{x:d},backend:n}),f=me({inputs:{x:c},backend:n,attrs:{axis:l,keepDims:!1}}),m=c6({inputs:{x:f},backend:n,attrs:{shape:h}}),g=mm({inputs:{a:c,b:m},backend:n});return n.disposeIntermediateTensorInfo(u),n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(d),n.disposeIntermediateTensorInfo(c),n.disposeIntermediateTensorInfo(f),n.disposeIntermediateTensorInfo(m),g}let m6={kernelName:x.Softmax,backendName:"cpu",kernelFunc:m5},m8={kernelName:x.Multinomial,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{logits:a}=t,{numSamples:s,seed:i,normalized:o}=r;pP(a,"multinomial");let l=o?a:m5({inputs:{logits:a},backend:n,attrs:{dim:-1}}),u=l.shape[0],h=l.shape[1],p=n.data.get(l.dataId).values,d=[u,s],c=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(d),"int32");for(let e=0;e<u;++e){let t=e*h,n=new Float32Array(h-1);n[0]=p[t];for(let e=1;e<n.length;++e)n[e]=n[e-1]+p[t+e];let r=hM.alea(i.toString()),a=e*s;for(let e=0;e<s;++e){let t=r();c[a+e]=n.length;for(let r=0;r<n.length;r++)if(t<n[r]){c[a+e]=r;break}}}return o||n.disposeIntermediateTensorInfo(l),n.makeTensorInfo(d,"int32",c)}};var pM=pM;let m9=pM.nonMaxSuppressionV3Impl,m7={kernelName:x.NonMaxSuppressionV3,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{boxes:a,scores:s}=t,{maxOutputSize:i,iouThreshold:o,scoreThreshold:l}=r;pP(a,"NonMaxSuppression");let{selectedIndices:u}=m9(n.data.get(a.dataId).values,n.data.get(s.dataId).values,i,o,l);return n.makeTensorInfo([u.length],"int32",new Int32Array(u))}};var pM=pM;let ge=pM.nonMaxSuppressionV4Impl,gt={kernelName:x.NonMaxSuppressionV4,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{boxes:a,scores:s}=t,{maxOutputSize:i,iouThreshold:o,scoreThreshold:l,padToMaxOutputSize:u}=r;pP(a,"NonMaxSuppressionPadded");let{selectedIndices:h,validOutputs:p}=ge(n.data.get(a.dataId).values,n.data.get(s.dataId).values,i,o,l,u);return[n.makeTensorInfo([h.length],"int32",new Int32Array(h)),n.makeTensorInfo([],"int32",new Int32Array([p]))]}};var pM=pM;let gn=pM.nonMaxSuppressionV5Impl,gr={kernelName:x.NonMaxSuppressionV5,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{boxes:a,scores:s}=t,{maxOutputSize:i,iouThreshold:o,scoreThreshold:l,softNmsSigma:u}=r;pP(a,"NonMaxSuppressionWithScore");let{selectedIndices:h,selectedScores:p}=gn(n.data.get(a.dataId).values,n.data.get(s.dataId).values,i,o,l,u);return[n.makeTensorInfo([h.length],"int32",new Int32Array(h)),n.makeTensorInfo([p.length],"float32",new Float32Array(p))]}},ga={kernelName:x.OneHot,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{indices:a}=t,{dtype:s,depth:i,onValue:o,offValue:l}=r;pP(a,"oneHot");let u=rR.util.sizeFromShape(a.shape),h=new Float32Array(u*i);h.fill(l);let p=n.data.get(a.dataId).values;for(let e=0;e<u;++e)p[e]>=0&&p[e]<i&&(h[e*i+p[e]]=o);return n.makeTensorInfo([...a.shape,i],s,h)}};function gs(e){let{inputs:t,backend:n}=e,{x:r}=t;if("string"===r.dtype)throw Error("zerosLike is not supported for string tensors");if("complex64"!==r.dtype)return mb({backend:n,attrs:{shape:r.shape,value:0,dtype:r.dtype}});{let e=pY({inputs:{input:r},backend:n}),t=gs({inputs:{x:e},backend:n}),a=fL({inputs:{input:r},backend:n}),s=gs({inputs:{x:a},backend:n}),i=pH({inputs:{real:t,imag:s},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(a),n.disposeIntermediateTensorInfo(s),i}}let gi={kernelName:x.ZerosLike,backendName:"cpu",kernelFunc:gs},go={kernelName:x.OnesLike,backendName:"cpu",kernelFunc:function e(t){let{inputs:n,backend:r}=t,{x:a}=n;if("string"===a.dtype)throw Error("onesLike is not supported for string tensors");if("complex64"!==a.dtype)return mb({backend:r,attrs:{shape:a.shape,value:1,dtype:a.dtype}});{let t=pY({inputs:{input:a},backend:r}),n=e({inputs:{x:t},backend:r}),s=fL({inputs:{input:a},backend:r}),i=gs({inputs:{x:s},backend:r}),o=pH({inputs:{real:n,imag:i},backend:r});return r.disposeIntermediateTensorInfo(t),r.disposeIntermediateTensorInfo(n),r.disposeIntermediateTensorInfo(s),r.disposeIntermediateTensorInfo(i),o}}};function gl(e){let{inputs:t,backend:n,attrs:r}=e,{axis:a}=r;if(1===t.length)return md({inputs:{input:t[0]},backend:n,attrs:{dim:a}});let s=t[0].shape,i=t[0].dtype;t.forEach(e=>{rR.util.assertShapesMatch(s,e.shape,"All tensors passed to stack must have matching shapes"),rR.util.assert(i===e.dtype,()=>"All tensors passed to stack must have matching dtypes")});let o=[],l=f_({inputs:t.map(e=>{let t=md({inputs:{input:e},backend:n,attrs:{dim:a}});return o.push(t),t}),backend:n,attrs:{axis:a}});return o.forEach(e=>n.disposeIntermediateTensorInfo(e)),l}let gu={kernelName:x.Pack,backendName:"cpu",kernelFunc:gl},gh={kernelName:x.PadV2,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{paddings:s,constantValue:i}=r;pP(a,"pad");let o=s.map((e,t)=>e[0]+a.shape[t]+e[1]),l=s.map(e=>e[0]),u=n.data.get(a.dataId).values,h=rR.util.sizeFromShape(a.shape),p=a.shape.length,d=rR.util.computeStrides(a.shape),c=rR.util.sizeFromShape(o),f=o.length,m=rR.util.computeStrides(o),g=rR.util.getTypedArrayFromDType(a.dtype,c);0!==i&&g.fill(i);for(let e=0;e<h;e++){let t=rR.util.indexToLoc(e,p,d).map((e,t)=>e+l[t]);g[rR.util.locToIndex(t,f,m)]=u[e]}return{dataId:n.write(g,o,a.dtype),shape:o,dtype:a.dtype}}},gp=pV((e,t)=>Math.pow(e,t)),gd=p1(x.Pow,gp),gc={kernelName:x.Pow,backendName:"cpu",kernelFunc:gd},gf={kernelName:x.RaggedGather,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{paramsNestedSplits:a,paramsDenseValues:s,indices:i}=t,{outputRaggedRank:o}=r,l=a.map(e=>n.data.get(e.dataId).values),u=a.map(e=>e.shape),h=n.data.get(s.dataId).values,p=n.data.get(i.dataId).values,[d,c,f]=cn(l,u,h,s.shape,s.dtype,p,i.shape,o),m=d.map(e=>n.makeTensorInfo([e.length],"int32",e)),g=n.makeTensorInfo(f,s.dtype,c);return m.concat([g])}},gm={kernelName:x.RaggedRange,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{starts:r,limits:a,deltas:s}=t,i=n.data.get(r.dataId).values,o=n.data.get(a.dataId).values,l=n.data.get(s.dataId).values,[u,h]=cr(i,r.shape,r.dtype,o,a.shape,l,s.shape);return[n.makeTensorInfo([u.length],"int32",u),n.makeTensorInfo([h.length],r.dtype,h)]}},gg={kernelName:x.RaggedTensorToTensor,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{shape:a,values:s,defaultValue:i,rowPartitionTensors:o}=t,{rowPartitionTypes:l}=r,u=n.data.get(a.dataId).values,h=n.data.get(s.dataId).values,p=n.data.get(i.dataId).values,d=o.map(e=>n.data.get(e.dataId).values),c=o.map(e=>e.shape),[f,m]=cl(u,a.shape,h,s.shape,s.dtype,p,i.shape,d,c,l);return n.makeTensorInfo(f,s.dtype,m)}},gx={kernelName:x.Range,backendName:"cpu",kernelFunc:function(e){let{backend:t,attrs:n}=e,{start:r,stop:a,dtype:s,step:i}=n,o=cu(r,a,i,s);return t.makeTensorInfo([o.length],s,o)}},gy=dr(x.Reciprocal,e=>1/e),gb={kernelName:x.Reciprocal,backendName:"cpu",kernelFunc:gy},gv={kernelName:x.ResizeBilinear,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a}=t,{alignCorners:s,halfPixelCenters:i,size:o}=r;pP(a,"resizeBilinear");let l=rR.util.computeStrides(a.shape),[u,h]=o,[p,d,c,f]=a.shape,m=n.data.get(a.dataId).values,g=new Float32Array(rR.util.sizeFromShape([p,u,h,f])),x=[s&&u>1?d-1:d,s&&h>1?c-1:c],y=[s&&u>1?u-1:u,s&&h>1?h-1:h],b=0,v=x[0]/y[0],w=x[1]/y[1];for(let e=0;e<p;e++)for(let t=0;t<u;t++){let n,r=Math.max(0,Math.floor(n=i?v*(t+.5)-.5:v*t)),a=n-r,s=Math.min(d-1,Math.ceil(n)),o=e*l[0]+r*l[1],u=e*l[0]+s*l[1];for(let e=0;e<h;e++){let t,n=Math.max(0,Math.floor(t=i?w*(e+.5)-.5:w*e)),r=t-n,s=Math.min(c-1,Math.ceil(t)),h=o+n*l[2],p=u+n*l[2],d=o+s*l[2],x=u+s*l[2];for(let e=0;e<f;e++){let t=m[h+e],n=m[p+e],s=m[d+e],i=m[x+e],o=t+(s-t)*r,l=o+(n+(i-n)*r-o)*a;g[b++]=l}}}return n.makeTensorInfo([p,u,h,f],"float32",g)}},gw={kernelName:x.ResizeBilinearGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a,dy:s}=t,{alignCorners:i}=r;pP([s,a],"resizeBilinearGrad");let o=rR.util.computeStrides(a.shape),[l,u,h,p]=a.shape,[,d,c]=s.shape,f=new Float32Array(l*u*h*p),m=[i&&d>1?u-1:u,i&&c>1?h-1:h],g=[i&&d>1?d-1:d,i&&c>1?c-1:c],x=m[0]/g[0],y=m[1]/g[1],b=n.data.get(s.dataId).values,v=0;for(let e=0;e<l;e++){let t=e*o[0];for(let e=0;e<d;e++){let n=e*x,r=Math.floor(n),a=Math.min(Math.ceil(n),u-1),s=t+r*o[1],i=t+a*o[1],l=n-r,d=1-l;for(let e=0;e<c;e++){let t=e*y,n=Math.floor(t),r=Math.min(Math.ceil(t),h-1),a=t-n,u=1-a,c=s+n*o[2],m=s+r*o[2],g=i+n*o[2],x=i+r*o[2],w=d*u,I=d*a,C=l*u,k=l*a;for(let e=0;e<p;e++){let t=b[v++];f[c+e]+=t*w,f[m+e]+=t*I,f[g+e]+=t*C,f[x+e]+=t*k}}}}return n.makeTensorInfo([l,h,u,p],"float32",f)}},gI={kernelName:x.ResizeNearestNeighbor,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a}=t,{alignCorners:s,halfPixelCenters:i,size:o}=r;pP(a,"resizeNearestNeighbor");let l=rR.util.computeStrides(a.shape),[u,h]=o,[p,d,c,f]=a.shape,m=n.data.get(a.dataId).values,g=new Float32Array(p*u*h*f),x=[s&&u>1?d-1:d,s&&h>1?c-1:c],y=[s&&u>1?u-1:u,s&&h>1?h-1:h],b=x[0]/y[0],v=x[1]/y[1],w=0;for(let e=0;e<p;e++){let t=e*l[0];for(let e=0;e<u;e++){let n=i?b*(e+.5):b*e,r=Math.min(d-1,s?Math.round(n):Math.floor(n));i&&(r=Math.max(0,r));let a=t+r*l[1];for(let e=0;e<h;e++){let t=i?v*(e+.5):v*e,n=Math.min(c-1,s?Math.round(t):Math.floor(t));i&&(n=Math.max(0,n));let r=a+n*l[2];for(let e=0;e<f;e++){let t=m[r+e];g[w++]=t}}}}return n.makeTensorInfo([p,u,h,f],a.dtype,g)}},gC={kernelName:x.ResizeNearestNeighborGrad,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a,dy:s}=t,{alignCorners:i}=r;pP([s,a],"resizeNearestNeighborGrad");let o=rR.util.computeStrides(a.shape),l=rR.util.computeStrides(s.shape),[u,h,p,d]=a.shape,[,c,f]=s.shape,m=new Float32Array(u*h*p*d),g=n.data.get(s.dataId).values,x=[i&&c>1?h-1:h,i&&f>1?p-1:p],y=[i&&c>1?c-1:c,i&&f>1?f-1:f],b=x[0]/y[0],v=x[1]/y[1],w=1/b,I=1/v,C=2*Math.ceil(w)+2,k=2*Math.ceil(I)+2;for(let e=0;e<u;e++){let t=e*o[0];for(let e=0;e<h;e++){let n=t+e*o[1],r=Math.floor(Math.floor(e*w)-C/2);for(let a=0;a<p;a++){let s=n+a*o[2],u=Math.floor(Math.floor(a*I)-k/2);for(let n=0;n<d;n++){let o=0;for(let s=0;s<C;s++){let d=s+r;if(d<0||d>=c)continue;let m=t+d*l[1],x=d*b;if(e===Math.min(h-1,i?Math.round(x):Math.floor(x)))for(let e=0;e<k;e++){let t=e+u;if(t<0||t>=f)continue;let r=m+t*l[2],s=t*v;a===Math.min(p-1,i?Math.round(s):Math.floor(s))&&(o+=g[r+n])}}m[s+n]=o}}}}return n.makeTensorInfo(a.shape,a.dtype,m)}},gk={kernelName:x.Reverse,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{dims:s}=r;pP(a,"reverse");let i=a.shape.length,o=rR.util.parseAxisParam(s,a.shape);if(0===i)return pX({inputs:{x:a},backend:n});let l=new nm.TensorBuffer(a.shape,a.dtype),u=n.bufferSync(a);for(let e=0;e<l.size;e++){let t=l.indexToLoc(e),n=t.slice();o.forEach(e=>n[e]=a.shape[e]-1-n[e]),l.set(u.get(...n),...t)}return n.makeTensorInfo(l.shape,l.dtype,l.values)}};var tN=tN;let gS={kernelName:x.RotateWithOffset,backendName:"cpu",kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{image:r}=e,{radians:a,fillValue:s,center:i}=t,o=rR.util.getTypedArrayFromDType(r.dtype,rR.util.sizeFromShape(r.shape)),[l,u,h,p]=r.shape,[d,c]=tN.getImageCenter(i,u,h),f=Math.sin(a),m=Math.cos(a),g=n.data.get(r.dataId).values;for(let e=0;e<l;e++){let t=e*h*u*p;for(let e=0;e<u;e++){let n=h*p*e;for(let r=0;r<h;r++){let a=r*p;for(let i=0;i<p;i++){let x=[l,e,r,i],y=x[2],b=x[1],v=(y-d)*m-(b-c)*f,w=(y-d)*f+(b-c)*m;v=Math.round(v+d),w=Math.round(w+c);let I=s;"number"!=typeof s&&(I=3===i?255:s[i]),v>=0&&v<h&&w>=0&&w<u&&(I=g[t+h*p*w+v*p+i]),o[t+n+a+i]=I}}}}return{dataId:n.write(o,r.shape,r.dtype),shape:r.shape,dtype:r.dtype}}},gT=dr(x.Round,e=>{let t=Math.floor(e);return e-t<.5?Math.floor(e):e-t>.5?Math.ceil(e):t%2==0?t:t+1}),gN={kernelName:x.Round,backendName:"cpu",kernelFunc:gT};var tN=tN;let g$={kernelName:x.ScatterNd,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{indices:a,updates:s}=t,{shape:i}=r,{sliceRank:o,numUpdates:l,sliceSize:u,strides:h,outputSize:p}=tN.calculateShapes(s,a,i),d=cc(n.bufferSync(a),n.bufferSync(s),i,p,u,l,o,h,0,!0);return n.makeTensorInfo(i,d.dtype,d.values)}},gR={kernelName:x.SearchSorted,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{sortedSequence:a,values:s}=t,{side:i}=r,o=function(e,t,n,r,a,s){let i=rR.util.getArrayFromDType("int32",n*a);for(let o=0;o<n;++o){let n=e.slice(o*r,(o+1)*r),l=o*a;for(let e=0;e<a;++e)i[l+e]="left"===s?function(e,t){let n=0,r=e.length,a=0;for(;n<r;)e[a=Math.floor((n+r)/2)]<t?n=a+1:r=a;return r}(n,t[e+l]):function(e,t){let n=0,r=e.length,a=0;for(;n<r;)e[a=Math.floor((n+r)/2)]<=t?n=a+1:r=a;return r}(n,t[e+l])}return i}(n.data.get(a.dataId).values,n.data.get(s.dataId).values,a.shape[0],a.shape[1],s.shape[1],i);return n.makeTensorInfo(s.shape,"int32",o)}},gA={kernelName:x.Select,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{condition:r,t:a,e:s}=t;pP([r,a,s],"select");let i=r.shape.length,o=n.data.get(r.dataId).values,l=n.data.get(a.dataId).values,u=n.data.get(s.dataId).values,h=(0,d5.upcastType)(a.dtype,s.dtype),p=rR.util.makeZerosTypedArray(rR.util.sizeFromShape(a.shape),h),d=0,c=0===i||i>1||1===a.shape.length?1:rR.util.sizeFromShape(a.shape.slice(1));for(let e=0;e<o.length;e++)for(let t=0;t<c;t++)1===o[e]?p[d++]=l[e]:p[d++]=u[e];return n.makeTensorInfo(a.shape,h,p)}};var tN=tN;let gE=tN.SELU_SCALEALPHA,gF=tN.SELU_SCALE,gD=dr(x.Selu,e=>e>=0?gF*e:gE*(Math.exp(e)-1)),gO={kernelName:x.Selu,backendName:"cpu",kernelFunc:gD},gL=dr(x.Sign,e=>e<0?-1:+(e>0)),gz={kernelName:x.Sign,backendName:"cpu",kernelFunc:gL},g_=dr(x.Sin,e=>Math.sin(e)),gM={kernelName:x.Sin,backendName:"cpu",kernelFunc:g_},gP=dr(x.Sinh,e=>Math.sinh(e)),gB={kernelName:x.Sinh,backendName:"cpu",kernelFunc:gP},gW=Math.log(11920928955078125e-23)+2,gG=dr(x.Softplus,e=>{let t=Math.exp(e);return e<gW?t:e>-gW?e:Math.log(1+t)}),gU={kernelName:x.Softplus,backendName:"cpu",kernelFunc:gG};var tN=tN;let gV={kernelName:x.SpaceToBatchND,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{blockShape:s,paddings:i}=r;pP([a],"spaceToBatchND");let o=rR.util.sizeFromShape(s),l=[[0,0]];l.push(...i);for(let e=1+s.length;e<a.shape.length;++e)l.push([0,0]);let u=gh.kernelFunc({inputs:{x:a},backend:n,attrs:{paddings:l,constantValue:0}}),h=tN.getReshaped(u.shape,s,o,!1),p=tN.getPermuted(h.length,s.length,!1),d=tN.getReshapedPermuted(u.shape,s,o,!1),c=c6({inputs:{x:u},backend:n,attrs:{shape:h}}),f=d8({inputs:{x:c},backend:n,attrs:{perm:p}}),m=c6({inputs:{x:f},backend:n,attrs:{shape:d}});return n.disposeIntermediateTensorInfo(u),n.disposeIntermediateTensorInfo(c),n.disposeIntermediateTensorInfo(f),m}},gH={kernelName:x.SparseFillEmptyRows,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{indices:r,values:a,denseShape:s,defaultValue:i}=t;if(1!==s.shape.length)throw Error(`Dense shape must be a vector, saw:
        ${s.shape}`);if(2!==r.shape.length)throw Error(`Indices must be a matrix, saw:
        ${r.shape}`);if(1!==a.shape.length)throw Error(`Values must be a vector, saw:
        ${a.shape}`);if(0!==i.shape.length)throw Error(`Default value must be a scalar, saw:
        ${i.shape}`);let o=n.data.get(r.dataId).values,l=n.data.get(a.dataId).values,u=n.data.get(s.dataId).values,h=n.data.get(i.dataId).values[0],[p,d,c,f,m]=cw(o,r.shape,r.dtype,l,a.dtype,u,h);return[n.makeTensorInfo(d,r.dtype,p),n.makeTensorInfo([d[0]],a.dtype,c),n.makeTensorInfo([f.length],"bool",new Uint8Array(f.map(e=>Number(e)))),n.makeTensorInfo([m.length],r.dtype,new Int32Array(m))]}},gq={kernelName:x.SparseReshape,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{inputIndices:r,inputShape:a,newShape:s}=t;if(2!==r.shape.length)throw Error(`Input indices should be a matrix but received shape
        ${r.shape}`);if(1!==a.shape.length)throw Error(`Input shape should be a vector but received shape
        ${a.shape}`);if(1!==s.shape.length)throw Error(`Target shape should be a vector but received shape ${s.shape}`);let i=Array.from(n.data.get(a.dataId).values),o=n.data.get(r.dataId).values,l=Array.from(n.data.get(s.dataId).values),[u,h,p]=cI(o,r.shape,r.dtype,i,l);return[n.makeTensorInfo(h,r.dtype,u),n.makeTensorInfo([p.length],s.dtype,new Int32Array(p))]}},gj={kernelName:x.SparseSegmentMean,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{data:r,indices:a,segmentIds:s}=t;if(r.shape.length<1)throw Error("Data should be at least 1 dimensional but received scalar");if(1!==a.shape.length)throw Error(`Indices should be a vector but received shape
          ${a.shape}`);if(1!==s.shape.length)throw Error(`Segment ids should be a vector but received shape
          ${s.shape}`);if(a.shape[0]!==s.shape[0])throw Error("segmentIds and indices should have same size.");let i=n.data.get(r.dataId).values,o=n.data.get(a.dataId).values,l=n.data.get(s.dataId).values,[u,h]=cC(i,r.shape,r.dtype,o,l,!0);return n.makeTensorInfo(h,r.dtype,u)}},gX={kernelName:x.SparseSegmentSum,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{data:r,indices:a,segmentIds:s}=t;if(r.shape.length<1)throw Error("Data should be at least 1 dimensional but received scalar");if(1!==a.shape.length)throw Error(`Indices should be a vector but received shape
         ${a.shape}`);if(1!==s.shape.length)throw Error(`Segment ids should be a vector but received shape
         ${s.shape}`);if(a.shape[0]!==s.shape[0])throw Error("segmentIds and indices should have same size.");let i=n.data.get(r.dataId).values,o=n.data.get(a.dataId).values,l=n.data.get(s.dataId).values,[u,h]=cC(i,r.shape,r.dtype,o,l);return n.makeTensorInfo(h,r.dtype,u)}};var tN=tN;let gK={kernelName:x.SparseToDense,backendName:"cpu",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{sparseIndices:s,sparseValues:i,defaultValue:o}=n,{outputShape:l}=a,{sliceRank:u,numUpdates:h,sliceSize:p,strides:d,outputSize:c}=tN.calculateShapes(i,s,l),f=r.bufferSync(s);switch(i.dtype){case"bool":t=cc(f,r.bufferSync(i),l,c,p,h,u,d,!!r.data.get(o.dataId).values[0],!1);break;case"float32":case"int32":t=cc(f,r.bufferSync(i),l,c,p,h,u,d,r.data.get(o.dataId).values[0],!1);break;case"string":t=cc(f,r.bufferSync(i),l,c,p,h,u,d,rR.util.decodeString(r.data.get(o.dataId).values[0]),!1);break;default:throw Error(`Unsupported type ${i.dtype}`)}return r.makeTensorInfo(l,t.dtype,t.values)}};var tN=tN;let gY={kernelName:x.SplitV,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{numOrSizeSplits:s,axis:i}=r,o=rR.util.parseAxisParam(i,a.shape)[0],l=tN.prepareSplitSize(a,s,o),u=Array(a.shape.length).fill(0),h=a.shape.slice();return l.map(e=>{let t=[...h];t[o]=e;let r=cb({inputs:{x:a},backend:n,attrs:{begin:u,size:t}});return u[o]+=e,r})}},gZ={kernelName:x.Square,backendName:"cpu",kernelFunc:({inputs:e,backend:t})=>{let{x:n}=e;pP(n,"square");let r=t.data.get(n.dataId).values,a=new Float32Array(r.length);for(let e=0;e<r.length;++e){let t=r[e];a[e]=t*t}return{dataId:t.write(a,n.shape,n.dtype),shape:n.shape,dtype:n.dtype}}},gJ=dr(x.Step,(e,t)=>isNaN(e)?NaN:e>0?1:t.alpha),gQ={kernelName:x.Step,backendName:"cpu",kernelFunc:gJ};var cx=tJ;let g0={kernelName:x.StridedSlice,backendName:"cpu",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{begin:i,end:o,strides:l,beginMask:u,endMask:h,ellipsisMask:p,newAxisMask:d,shrinkAxisMask:c}=a;pP(s,"stridedSlice");let{finalShapeSparse:f,finalShape:m,isIdentity:g,sliceDim0:x,isSimpleSlice:y,begin:b,end:v,strides:w}=cx.sliceInfo(s.shape,i,o,l,u,h,p,d,c);if(g)t=c6({inputs:{x:s},backend:r,attrs:{shape:m}});else if(x||y){rR.util.assert(s.shape.length>=1,()=>`Input must have rank at least 1, got: ${s.shape.length}`);let e=cx.computeOutShape(b,v,w),n=cb({inputs:{x:s},backend:r,attrs:{begin:b,size:e}});t=c6({inputs:{x:n},backend:r,attrs:{shape:m}}),r.disposeIntermediateTensorInfo(n)}else{let e=cD(f,r.bufferSync(s),w,b);t=r.makeTensorInfo(m,e.dtype,e.values)}return t}},g1={kernelName:x.StringNGrams,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{separator:a,nGramWidths:s,leftPad:i,rightPad:o,padWidth:l,preserveShortSequences:u}=r,{data:h,dataSplits:p}=t,[d,c]=cL(n.data.get(h.dataId).values,n.data.get(p.dataId).values,a,s,i,o,l,u);return[n.makeTensorInfo([d.length],"string",d),n.makeTensorInfo(p.shape,"int32",c)]}},g2={kernelName:x.StringSplit,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{skipEmpty:a}=r,{input:s,delimiter:i}=t;if("string"!==s.dtype)throw Error("Input must be of datatype string");if(1!==s.shape.length)throw Error(`Input must be a vector, got shape: ${s.shape}`);if(0!==i.shape.length)throw Error(`Delimiter must be a scalar, got shape: ${i.shape}`);let[o,l,u]=cz(n.data.get(s.dataId).values,n.data.get(i.dataId).values[0],a),h=l.length;return[n.makeTensorInfo([h,2],"int32",o),n.makeTensorInfo([h],"string",l),n.makeTensorInfo([2],"int32",new Int32Array(u))]}},g3={kernelName:x.StringToHashBucketFast,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{numBuckets:a}=r,{input:s}=t;if("string"!==s.dtype)throw Error("Input must be of datatype string");if(a<=0)throw Error("Number of buckets must be at least 1");let i=c_(n.data.get(s.dataId).values,a);return n.makeTensorInfo(s.shape,"int32",i)}},g4=dr(x.Tan,e=>Math.tan(e)),g5={kernelName:x.Tan,backendName:"cpu",kernelFunc:g4},g6=dr(x.Tanh,e=>Math.tanh(e)),g8={kernelName:x.Tanh,backendName:"cpu",kernelFunc:g6};var tN=tN;function g9(e,t,n){switch(n){case"reflect":var r,a,s,i,o=e,l=t;let u=o;if(u<0)if(l<=1)u=0;else{let e=2*l;u<e&&(u=e*Math.trunc(-u/e)+u),u=u<-l?u+e:-u-1}else if(u>l-1)if(l<=1)u=0;else{let e=2*l;(u-=e*Math.trunc(u/e))>=l&&(u=e-u-1)}return rR.util.clamp(0,u,l-1);case"wrap":let h;return r=e,a=t,(h=r)<0?a<=1?h=0:h+=a*(Math.trunc(-h/(a-1))+1):h>a-1&&(a<=1?h=0:h-=a*Math.trunc(h/(a-1))),rR.util.clamp(0,h,a-1);case"nearest":return s=e,i=t,rR.util.clamp(0,s,i-1);default:return e}}function g7(e,t,n,r,a,s,i,o,l,u,h){return 0<=o&&o<t&&0<=l&&l<n?e[i*r+o*a+l*s+u]:h}for(let e of[fe,pU,fn,fa,p6,fs,fi,fo,fl,fu,fp,fc,fm,fy,fv,fk,fS,fT,fN,c7,f$,fR,fA,dt,fE,p0,dl,fD,pq,fO,fM,fB,fW,fG,fU,fV,fH,fj,fK,fY,fZ,fJ,fQ,f0,f2,f3,f4,f5,f6,f8,f9,f7,mn,cX,mr,dd,mp,dm,mc,dy,my,mv,mw,dw,dk,mI,mC,mk,mS,dR,dF,pK,mT,fz,m$,mA,mF,cY,dL,dM,mD,dG,mL,mM,mB,mU,mV,mH,mj,dq,mX,mK,mY,mZ,mJ,mQ,m0,dK,m1,m4,m8,dQ,d1,m7,gt,gr,d4,ga,go,gu,gh,gc,cQ,ce,gf,gm,gg,gx,pZ,mg,gb,c1,c3,c8,gv,gw,gI,gC,gk,gS,gN,cd,g$,gR,gA,gO,cg,gz,gM,gB,cv,m6,gU,gV,gH,gq,gj,gX,gK,gY,cT,gZ,cR,cF,gQ,g0,g1,g2,g3,cW,mt,g5,g8,{kernelName:x.TensorScatterUpdate,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n}=e,{tensor:r,indices:a,updates:s}=t,{sliceRank:i,numUpdates:o,sliceSize:l,strides:u,outputSize:h}=tN.calculateShapes(s,a,r.shape),p=n.bufferSync(a),d=n.bufferSync(s),c=n.bufferSync(r),f=cc(p,d,r.shape,h,l,o,i,u,c,!1);return n.makeTensorInfo(r.shape,f.dtype,f.values)}},{kernelName:x.Tile,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{reps:s}=r;pP(a,"tile");let i=cG(n.bufferSync(a),s);return n.makeTensorInfo(i.shape,i.dtype,i.values)}},{kernelName:x.TopK,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{k:s,sorted:i}=r;pP(a,"topk");let[o,l]=cV(n.data.get(a.dataId).values,a.shape,a.dtype,s,i);return[n.makeTensorInfo(o.shape,o.dtype,o.values),n.makeTensorInfo(l.shape,l.dtype,l.values)]}},{kernelName:x.Transform,backendName:"cpu",kernelFunc:function(e){let{inputs:t,attrs:n,backend:r}=e,{image:a,transforms:s}=t,{interpolation:i,fillMode:o,fillValue:l,outputShape:u}=n,[h,p,d,c]=a.shape,[f,m]=null!=u?u:[p,d],g=[h,f,m,c],x=rR.util.computeStrides(a.shape),y=x[0],b=x[1],v=x[2],w=rR.util.computeStrides(g),I=w[0],C=w[1],k=w[2],S=rR.util.getTypedArrayFromDType(a.dtype,rR.util.sizeFromShape(g));S.fill(l);let T=r.data.get(a.dataId).values,N=r.data.get(s.dataId).values;for(let e=0;e<h;++e){let t=1===s.shape[0]?N:N.subarray(8*e,8*e+8);for(let n=0;n<f;++n)for(let r=0;r<m;++r)for(let a=0;a<c;++a){let s,u=t[6]*r+t[7]*n+1;if(0===u)continue;let h=(t[0]*r+t[1]*n+t[2])/u,c=(t[3]*r+t[4]*n+t[5])/u,f=g9(h,d,o),m=g9(c,p,o);switch(i){case"nearest":s=g7(T,p,d,y,b,v,e,Math.round(m),Math.round(f),a,l);break;case"bilinear":s=function(e,t,n,r,a,s,i,o,l,u,h){let p=Math.floor(o),d=Math.floor(l),c=p+1,f=d+1,m=(f-l)*g7(e,t,n,r,a,s,i,p,d,u,h)+(l-d)*g7(e,t,n,r,a,s,i,p,f,u,h),g=(f-l)*g7(e,t,n,r,a,s,i,c,d,u,h)+(l-d)*g7(e,t,n,r,a,s,i,c,f,u,h);return(c-o)*m+(o-p)*g}(T,p,d,y,b,v,e,m,f,a,l);break;default:throw Error(`Error in Transform: Expect 'nearest' or 'bilinear', but got ${i}`)}S[e*I+n*C+r*k+a]=s}return r.makeTensorInfo(g,a.dtype,S)}return{dataId:r.write(S,g,a.dtype),shape:a.shape,dtype:a.dtype}}},d9,{kernelName:x.Unique,backendName:"cpu",kernelFunc:function(e){let{inputs:t,attrs:n,backend:r}=e,{axis:a}=n,{x:s}=t;pP(s,"unique");let{outputValues:i,outputShape:o,indices:l}=cH(r.data.get(s.dataId).values,a,s.shape,s.dtype);return[r.makeTensorInfo(o,s.dtype,i),r.makeTensorInfo([l.length],"int32",l)]}},{kernelName:x.Unpack,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{value:a}=t,{axis:s}=r;s<0&&(s+=a.shape.length);let i=a.shape.length,o=a.shape[s],l=Array(i-1),u=0;for(let e=0;e<i;e++)e!==s&&(l[u++]=a.shape[e]);let h=Array(i).fill(0),p=a.shape.slice();p[s]=1;let d=Array(o);for(let e=0;e<d.length;e++){h[s]=e;let t=cb({inputs:{x:a},backend:n,attrs:{begin:h,size:p}});d[e]=c6({inputs:{x:t},backend:n,attrs:{shape:l}}),n.disposeIntermediateTensorInfo(t)}return d}},{kernelName:x.UnsortedSegmentSum,backendName:"cpu",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,segmentIds:s}=t,{numSegments:i}=r;pP(a,"unsortedSegmentSum");let o=a.shape.length,l=s.shape.length,u=[],h=[],p=o-l,d=s;for(let e=0;e<p;++e){let t=md({inputs:{input:d},backend:n,attrs:{dim:e+1}});d=t,h.push(t)}for(let e=0;e<i;++e){let t=rR.util.createScalarValue(e,"int32"),r=n.makeTensorInfo([],"int32",t),s=dp({inputs:{a:r,b:d},backend:n}),i=pQ({inputs:{x:s},backend:n,attrs:{dtype:"float32"}}),o=dJ({inputs:{a:i,b:a},backend:n}),l=me({inputs:{x:o},backend:n,attrs:{axis:0,keepDims:!1}});u.push(l),h.push(r),h.push(s),h.push(i),h.push(o),h.push(l)}let c=gl({inputs:u,backend:n,attrs:{axis:0}});return h.forEach(e=>n.disposeIntermediateTensorInfo(e)),c}},gi])(0,nc.registerKernel)(e);e.s([],92613);var xe=e.i(546340),xe=xe,xe=xe;let xt={},xn={alpha:!1,antialias:!1,premultipliedAlpha:!1,preserveDrawingBuffer:!1,depth:!1,stencil:!1,failIfMajorPerformanceCaveat:!0};function xr(e,t){xt[e]=t}function xa(e,t){if(!(e in xt)||null!=t){let n=function(e,t){if(1!==e&&2!==e)throw Error("Cannot get WebGL rendering context, WebGL is disabled.");let n=null==t?function(e){if(!(0,rN.env)().getBool("IS_SAFARI")&&"undefined"!=typeof OffscreenCanvas&&2===e)return new OffscreenCanvas(300,150);if("undefined"!=typeof document)return document.createElement("canvas");throw Error("Cannot create a canvas in this context")}(e):t;return(n.addEventListener("webglcontextlost",t=>{t.preventDefault(),delete xt[e]},!1),(0,rN.env)().getBool("SOFTWARE_WEBGL_ENABLED")&&(xn.failIfMajorPerformanceCaveat=!1),1===e)?n.getContext("webgl",xn)||n.getContext("experimental-webgl",xn):n.getContext("webgl2",xn)}(e,t);if(null===n)return console.log("Could not get context for WebGL version",e),null;xt[e]=n}let n=xt[e];return null==n||n.isContextLost()?(delete xt[e],xa(e)):(n.disable(n.DEPTH_TEST),n.disable(n.STENCIL_TEST),n.disable(n.BLEND),n.disable(n.DITHER),n.disable(n.POLYGON_OFFSET_FILL),n.disable(n.SAMPLE_COVERAGE),n.enable(n.SCISSOR_TEST),n.enable(n.CULL_FACE),n.cullFace(n.BACK),xt[e])}function xs(e){let t=Math.ceil(rR.util.sizeFromShape(e)/4);return rR.util.sizeToSquarishShape(t)}function xi(e,t){return[Math.max(1,Math.ceil(t/2)),Math.max(1,Math.ceil(e/2))]}function xo(e,t){let n,r,a,s,i,o,l,u,h,p;return 2===(0,rN.env)().getNumber("WEBGL_VERSION")?(n=e.R32F,r=e.R16F,a=e.RGBA16F,s=e.RGBA32F,i=e.RED,l=4,u=1,h=e.HALF_FLOAT,p=e.FLOAT,o=e.RGBA8):(n=e.RGBA,r=e.RGBA,a=e.RGBA,s=e.RGBA,i=e.RGBA,l=4,u=4,h=null!=t?t.HALF_FLOAT_OES:null,p=e.FLOAT,o=e.RGBA),{internalFormatFloat:n,internalFormatHalfFloat:r,internalFormatPackedHalfFloat:a,internalFormatPackedFloat:s,textureFormatFloat:i,downloadTextureFormat:o,downloadUnpackNumChannels:l,defaultNumChannels:u,textureTypeHalfFloat:h,textureTypeFloat:p}}function xl(e,t){let n=t();return(0,rN.env)().getBool("DEBUG")&&function(e){let t=e.getError();if(t!==e.NO_ERROR)throw Error("WebGL Error: "+xh(e,t))}(e),n}function xu(e){return!!((0,rN.env)().getBool("WEBGL_RENDER_FLOAT32_ENABLED")||0===e||596e-10<Math.abs(e)&&65504>Math.abs(e))}function xh(e,t){switch(t){case e.NO_ERROR:return"NO_ERROR";case e.INVALID_ENUM:return"INVALID_ENUM";case e.INVALID_VALUE:return"INVALID_VALUE";case e.INVALID_OPERATION:return"INVALID_OPERATION";case e.INVALID_FRAMEBUFFER_OPERATION:return"INVALID_FRAMEBUFFER_OPERATION";case e.OUT_OF_MEMORY:return"OUT_OF_MEMORY";case e.CONTEXT_LOST_WEBGL:return"CONTEXT_LOST_WEBGL";default:return`Unknown error code ${t}`}}function xp(e,t){return xz(e,()=>e.getExtension(t),'Extension "'+t+'" not supported on this browser.')}function xd(e,t){let n=xz(e,()=>e.createShader(e.VERTEX_SHADER),"Unable to create vertex WebGLShader.");if(xl(e,()=>e.shaderSource(n,t)),xl(e,()=>e.compileShader(n)),!1===e.getShaderParameter(n,e.COMPILE_STATUS))throw console.log(e.getShaderInfoLog(n)),Error("Failed to compile vertex shader.");return n}function xc(e,t){let n=xz(e,()=>e.createShader(e.FRAGMENT_SHADER),"Unable to create fragment WebGLShader.");if(xl(e,()=>e.shaderSource(n,t)),xl(e,()=>e.compileShader(n)),(0,rN.env)().get("ENGINE_COMPILE_ONLY"))return n;if(!1===e.getShaderParameter(n,e.COMPILE_STATUS))throw xm(t,e.getShaderInfoLog(n)),Error("Failed to compile fragment shader.");return n}(o=c||(c={}))[o.DENSE=0]="DENSE",o[o.SHARED_BATCH=1]="SHARED_BATCH",(l=f||(f={}))[l.RENDER=0]="RENDER",l[l.UPLOAD=1]="UPLOAD",l[l.PIXELS=2]="PIXELS",l[l.DOWNLOAD=3]="DOWNLOAD",(u=m||(m={}))[u.UNPACKED_FLOAT16=0]="UNPACKED_FLOAT16",u[u.UNPACKED_FLOAT32=1]="UNPACKED_FLOAT32",u[u.PACKED_4X1_UNSIGNED_BYTE=2]="PACKED_4X1_UNSIGNED_BYTE",u[u.PACKED_2X2_FLOAT32=3]="PACKED_2X2_FLOAT32",u[u.PACKED_2X2_FLOAT16=4]="PACKED_2X2_FLOAT16";let xf=/ERROR: [0-9]+:([0-9]+):/g;function xm(e,t){let n=xf.exec(t);if(null==n){console.log(`Couldn't parse line number in error: ${t}`),console.log(e);return}let r=+n[1],a=e.split("\n"),s=a.length.toString().length+2,i=a.map((e,t)=>rR.util.rightPad((t+1).toString(),s)+e),o=0;for(let e=0;e<i.length;e++)o=Math.max(i[e].length,o);let l=i.slice(0,r-1),u=i.slice(r-1,r),h=i.slice(r);console.log(l.join("\n")),console.log(t.split("\n")[0]),console.log(`%c ${rR.util.rightPad(u[0],o)}`,"border:1px solid red; background-color:#e3d2d2; color:#a61717"),console.log(h.join("\n"))}function xg(e){return xz(e,()=>e.createProgram(),"Unable to create WebGLProgram.")}function xx(e,t){if(xl(e,()=>e.linkProgram(t)),!(0,rN.env)().get("ENGINE_COMPILE_ONLY")&&!1===e.getProgramParameter(t,e.LINK_STATUS))throw console.log(e.getProgramInfoLog(t)),Error("Failed to link vertex and fragment shaders.")}function xy(e,t){if(xl(e,()=>e.validateProgram(t)),!1===e.getProgramParameter(t,e.VALIDATE_STATUS))throw console.log(e.getProgramInfoLog(t)),Error("Shader program validation failed.")}function xb(e,t){let n=xz(e,()=>e.createBuffer(),"Unable to create WebGLBuffer");return xl(e,()=>e.bindBuffer(e.ARRAY_BUFFER,n)),xl(e,()=>e.bufferData(e.ARRAY_BUFFER,t,e.STATIC_DRAW)),n}function xv(e,t){let n=xz(e,()=>e.createBuffer(),"Unable to create WebGLBuffer");return xl(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,n)),xl(e,()=>e.bufferData(e.ELEMENT_ARRAY_BUFFER,t,e.STATIC_DRAW)),n}function xw(){return 2===(0,rN.env)().getNumber("WEBGL_VERSION")?1:4}function xI(e){return xz(e,()=>e.createTexture(),"Unable to create WebGLTexture.")}function xC(e,t){let n=(0,rN.env)().getNumber("WEBGL_MAX_TEXTURE_SIZE");if(e<=0||t<=0)throw Error(`Requested texture size [${e}x${t}] is invalid.`);if(e>n||t>n)throw Error(`Requested texture size [${e}x${t}] greater than WebGL maximum on this browser / GPU [${n}x${n}].`)}function xk(e){return xz(e,()=>e.createFramebuffer(),"Unable to create WebGLFramebuffer.")}function xS(e,t,n,r,a,s,i){let o=e.getAttribLocation(t,n);return -1!==o&&(xl(e,()=>e.bindBuffer(e.ARRAY_BUFFER,r)),xl(e,()=>e.vertexAttribPointer(o,a,e.FLOAT,!1,s,i)),xl(e,()=>e.enableVertexAttribArray(o)),!0)}function xT(e,t,n){x_(e,n),xl(e,()=>e.activeTexture(e.TEXTURE0+n)),xl(e,()=>e.bindTexture(e.TEXTURE_2D,t))}function xN(e,t){x_(e,t),xl(e,()=>e.activeTexture(e.TEXTURE0+t)),xl(e,()=>e.bindTexture(e.TEXTURE_2D,null))}function x$(e,t,n){return xz(e,()=>e.getUniformLocation(t,n),'uniform "'+n+'" not present in program.')}function xR(e,t,n){return e.getUniformLocation(t,n)}function xA(e,t,n,r){xl(e,()=>xT(e,t,r)),xl(e,()=>e.uniform1i(n,r))}function xE(e){xl(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,null)),xl(e,()=>e.viewport(0,0,e.canvas.width,e.canvas.height)),xl(e,()=>e.scissor(0,0,e.canvas.width,e.canvas.height))}function xF(e,t,n){xl(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,n)),xl(e,()=>e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,t,0))}function xD(e,t){xl(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,t)),xl(e,()=>e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,null,0))}function xO(e){let t=e.checkFramebufferStatus(e.FRAMEBUFFER);if(t!==e.FRAMEBUFFER_COMPLETE)throw Error("Error binding framebuffer: "+xL(e,t))}function xL(e,t){switch(t){case e.FRAMEBUFFER_INCOMPLETE_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_ATTACHMENT";case e.FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT:return"FRAMEBUFFER_INCOMPLETE_MISSING_ATTACHMENT";case e.FRAMEBUFFER_INCOMPLETE_DIMENSIONS:return"FRAMEBUFFER_INCOMPLETE_DIMENSIONS";case e.FRAMEBUFFER_UNSUPPORTED:return"FRAMEBUFFER_UNSUPPORTED";default:return`unknown error ${t}`}}function xz(e,t,n){let r=xl(e,()=>t());if(null==r)throw Error(n);return r}function x_(e,t){let n=e.MAX_COMBINED_TEXTURE_IMAGE_UNITS-1,r=t+e.TEXTURE0;if(r<e.TEXTURE0||r>n){let e=`[gl.TEXTURE0, gl.TEXTURE${n}]`;throw Error(`textureUnit must be in ${e}.`)}}function xM(e,t=2){return rR.util.sizeFromShape(e.slice(0,e.length-t))}function xP(e){if(0===e.length)throw Error("Cannot get rows and columns of an empty shape array.");return[e.length>1?e[e.length-2]:1,e[e.length-1]]}function xB(e){let t=[1,1,1];return 0!==e.length&&(1!==e.length||1!==e[0])&&(t=[xM(e),...xP(e)]),t}function xW(e,t=!1){let n=(0,rN.env)().getNumber("WEBGL_MAX_TEXTURE_SIZE"),r=(0,rN.env)().getNumber("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE");r===1/0&&(0,rN.env)().getBool("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE")&&(r=n/2),t&&(n*=2,r*=2,1===(e=e.map((t,n)=>n>=e.length-2?rR.util.nearestLargerEven(e[n]):e[n])).length&&(e=[2,e[0]])),2!==e.length&&(e=rR.util.squeezeShape(e).newShape);let a=rR.util.sizeFromShape(e),s=null;e.length<=1&&a<=n?s=[1,a]:2===e.length&&e[0]<=n&&e[1]<=n?s=e:3===e.length&&e[0]*e[1]<=n&&e[2]<=n?s=[e[0]*e[1],e[2]]:3===e.length&&e[0]<=n&&e[1]*e[2]<=n?s=[e[0],e[1]*e[2]]:4===e.length&&e[0]*e[1]*e[2]<=n&&e[3]<=n?s=[e[0]*e[1]*e[2],e[3]]:4===e.length&&e[0]<=n&&e[1]*e[2]*e[3]<=n&&(s=[e[0],e[1]*e[2]*e[3]]);let i=null!=s&&Math.max(...s)>r&&Math.min(...s)<=(t?2:1)&&Math.min(...s)>0;if(null==s||i)if(t){let t=xM(e),n=2,r=2;e.length&&([n,r]=xP(e)),a=n/2*t*(r/2),s=rR.util.sizeToSquarishShape(a).map(e=>2*e)}else s=rR.util.sizeToSquarishShape(a);return s}function xG(e,t){if(e=e.slice(-2),t=t.slice(-2),rR.util.arraysEqual(e,t)||!e.length||!t.length||0===e[0]||0===e[1]||0===t[0]||0===t[1])return!0;if(e.length!==t.length){let n=e[e.length-1],r=t[t.length-1];if(n===r||n%2==0&&r%2==0&&(1===e[0]||1===t[0]))return!0}return e[1]===t[1]&&e[0]%2==0&&t[0]%2==0}function xU(e){if(null==n){let t=xa(e);n=t.getParameter(t.MAX_TEXTURE_SIZE)}return n}function xV(){n=null}function xH(){r=null}function xq(e){if(null==r){let t=xa(e);r=t.getParameter(t.MAX_TEXTURE_IMAGE_UNITS)}return Math.min(16,r)}function xj(e){if(0===e)return 0;let t=xa(e);return xX(t,"EXT_disjoint_timer_query_webgl2")&&2===e?2:+!!xX(t,"EXT_disjoint_timer_query")}function xX(e,t){return null!=e.getExtension(t)}function xK(e){try{let t=xa(e);if(null!=t)return!0}catch(e){console.log("Error when getting WebGL context: ",e)}return!1}function xY(e){if(0===e)return!1;let t=xa(e);if(1===e){if(!xX(t,"OES_texture_float"))return!1}else if(!xX(t,"EXT_color_buffer_float"))return!1;return xJ(t)}function xZ(e){if(0===e)return!1;let t=xa(e);if(1===e){if(!xX(t,"OES_texture_float")||!xX(t,"WEBGL_color_buffer_float"))return!1}else{if(xX(t,"EXT_color_buffer_float"))return xJ(t);let e="EXT_color_buffer_half_float";if(xX(t,e)){var n;let r,a,s,i,o=t.getExtension(e);return r=xo(n=t,o),a=n.createTexture(),n.bindTexture(n.TEXTURE_2D,a),n.texImage2D(n.TEXTURE_2D,0,r.internalFormatHalfFloat,1,1,0,r.textureFormatFloat,r.textureTypeHalfFloat,null),s=n.createFramebuffer(),n.bindFramebuffer(n.FRAMEBUFFER,s),n.framebufferTexture2D(n.FRAMEBUFFER,n.COLOR_ATTACHMENT0,n.TEXTURE_2D,a,0),i=n.checkFramebufferStatus(n.FRAMEBUFFER)===n.FRAMEBUFFER_COMPLETE,n.bindTexture(n.TEXTURE_2D,null),n.bindFramebuffer(n.FRAMEBUFFER,null),n.deleteTexture(a),n.deleteFramebuffer(s),i}return!1}return xJ(t)}function xJ(e){let t=xo(e),n=e.createTexture();e.bindTexture(e.TEXTURE_2D,n),e.texImage2D(e.TEXTURE_2D,0,t.internalFormatFloat,1,1,0,t.textureFormatFloat,t.textureTypeFloat,null);let r=e.createFramebuffer();e.bindFramebuffer(e.FRAMEBUFFER,r),e.framebufferTexture2D(e.FRAMEBUFFER,e.COLOR_ATTACHMENT0,e.TEXTURE_2D,n,0);let a=e.checkFramebufferStatus(e.FRAMEBUFFER)===e.FRAMEBUFFER_COMPLETE;return e.bindTexture(e.TEXTURE_2D,null),e.bindFramebuffer(e.FRAMEBUFFER,null),e.deleteTexture(n),e.deleteFramebuffer(r),a}function xQ(e){return 2===e&&null!=xa(e).fenceSync}function x0(e,t){Array.isArray(e)||(e=[e]),e.forEach(e=>{null!=e&&rR.util.assert("complex64"!==e.dtype,()=>`${t} does not support complex64 tensors in the WebGL backend.`)})}e.s(["assertNotComplex",()=>x0,"bindCanvasToFramebuffer",()=>xE,"bindColorTextureToFramebuffer",()=>xF,"bindTextureToProgramUniformSampler",()=>xA,"bindTextureUnit",()=>xT,"bindVertexBufferToProgramAttribute",()=>xS,"callAndCheck",()=>xl,"canBeRepresented",()=>xu,"createFragmentShader",()=>xc,"createFramebuffer",()=>xk,"createProgram",()=>xg,"createStaticIndexBuffer",()=>xv,"createStaticVertexBuffer",()=>xb,"createTexture",()=>xI,"createVertexShader",()=>xd,"getBatchDim",()=>xM,"getExtensionOrThrow",()=>xp,"getFramebufferErrorMessage",()=>xL,"getMaxTexturesInShader",()=>xq,"getNumChannels",()=>xw,"getProgramUniformLocation",()=>xR,"getProgramUniformLocationOrThrow",()=>x$,"getRowsCols",()=>xP,"getShapeAs3D",()=>xB,"getTextureShapeFromLogicalShape",()=>xW,"getWebGLDisjointQueryTimerVersion",()=>xj,"getWebGLErrorMessage",()=>xh,"getWebGLMaxTextureSize",()=>xU,"hasExtension",()=>xX,"isCapableOfRenderingToFloatTexture",()=>xY,"isDownloadFloatTextureEnabled",()=>xZ,"isReshapeFree",()=>xG,"isWebGLFenceEnabled",()=>xQ,"isWebGLVersionEnabled",()=>xK,"linkProgram",()=>xx,"logShaderSourceAndInfoLog",()=>xm,"resetMaxTextureSize",()=>xV,"resetMaxTexturesInShader",()=>xH,"unbindColorTextureFromFramebuffer",()=>xD,"unbindTextureUnit",()=>xN,"validateFramebuffer",()=>xO,"validateProgram",()=>xy,"validateTextureSize",()=>xC],856479);let x1=(0,rN.env)();x1.registerFlag("HAS_WEBGL",()=>x1.getNumber("WEBGL_VERSION")>0),x1.registerFlag("WEBGL_VERSION",()=>xK(2)?2:+!!xK(1)),x1.registerFlag("WEBGL_CHECK_NUMERICAL_PROBLEMS",()=>!1),x1.registerFlag("WEBGL_BUFFER_SUPPORTED",()=>2===x1.get("WEBGL_VERSION")),x1.registerFlag("WEBGL_CPU_FORWARD",()=>!0),x1.registerFlag("WEBGL_FORCE_F16_TEXTURES",()=>!1),x1.registerFlag("WEBGL_PACK",()=>x1.getBool("HAS_WEBGL")),x1.registerFlag("WEBGL_PACK_NORMALIZATION",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_CLIP",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_DEPTHWISECONV",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_BINARY_OPERATIONS",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_UNARY_OPERATIONS",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_ARRAY_OPERATIONS",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_IMAGE_OPERATIONS",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_REDUCE",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_LAZILY_UNPACK",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_CONV_IM2COL",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_PACK_CONV2DTRANSPOSE",()=>x1.getBool("WEBGL_PACK")),x1.registerFlag("WEBGL_MAX_TEXTURE_SIZE",()=>xU(x1.getNumber("WEBGL_VERSION"))),x1.registerFlag("WEBGL_MAX_TEXTURES_IN_SHADER",()=>xq(x1.getNumber("WEBGL_VERSION"))),x1.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION",()=>{let e=x1.getNumber("WEBGL_VERSION");return 0===e?0:xj(e)}),x1.registerFlag("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE",()=>x1.getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0&&!xe.isMobile()),x1.registerFlag("WEBGL_RENDER_FLOAT32_CAPABLE",()=>xY(x1.getNumber("WEBGL_VERSION"))),x1.registerFlag("WEBGL_RENDER_FLOAT32_ENABLED",()=>!x1.getBool("WEBGL_FORCE_F16_TEXTURES")&&x1.getBool("WEBGL_RENDER_FLOAT32_CAPABLE")),x1.registerFlag("WEBGL_DOWNLOAD_FLOAT_ENABLED",()=>xZ(x1.getNumber("WEBGL_VERSION"))),x1.registerFlag("WEBGL_FENCE_API_ENABLED",()=>xQ(x1.getNumber("WEBGL_VERSION"))),x1.registerFlag("WEBGL_SIZE_UPLOAD_UNIFORM",()=>4*!!x1.getBool("WEBGL_RENDER_FLOAT32_ENABLED")),x1.registerFlag("WEBGL_DELETE_TEXTURE_THRESHOLD",()=>-1,e=>{if("number"!=typeof e)throw Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be a number but got ${e}.`);if(e<0&&-1!==e)throw Error(`WEBGL_DELETE_TEXTURE_THRESHOLD must be -1 (indicating never delete) or at least 0, but got ${e}.`)}),x1.registerFlag("WEBGL_FLUSH_THRESHOLD",()=>xe.isMobile()?1:-1,e=>{if("number"!=typeof e)throw Error(`WEBGL_FLUSH_THRESHOLD must be a number but got ${e}.`);if(e<0&&-1!==e)throw Error(`WEBGL_FLUSH_THRESHOLD must be -1 (indicating never manual flush) or at least 0, but got ${e}.`)}),x1.registerFlag("CPU_HANDOFF_SIZE_THRESHOLD",()=>128),x1.registerFlag("WEBGL_USE_SHAPES_UNIFORMS",()=>!1),x1.registerFlag("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD",()=>1e5),x1.registerFlag("TOPK_K_CPU_HANDOFF_THRESHOLD",()=>128),x1.registerFlag("WEBGL_EXP_CONV",()=>!1),x1.registerFlag("SOFTWARE_WEBGL_ENABLED",()=>x1.getBool("IS_TEST")),x1.registerFlag("WEBGL_MAX_SIZE_FOR_NARROW_TEXTURE",()=>1/0),x1.registerFlag("WEBGL_AUTO_SQUARIFY_NARROW_TEXTURE_SHAPE",()=>!1),x1.registerFlag("WEBGL2_ISNAN_CUSTOM",()=>!1),x1.registerFlag("ENGINE_COMPILE_ONLY",()=>!1);var tN=tN,x2=p_,pM=pM;function x3(){let e,t,n,r,a,s,i,o,l,u;return 2===(0,rN.env)().getNumber("WEBGL_VERSION")?(e="#version 300 es",t="in",n="out",r="in",a="texture",s="outputColor",i="out vec4 outputColor;",o=(0,rN.env)().getBool("WEBGL2_ISNAN_CUSTOM")?`
      bool isnan_custom(float val) {
        uint floatToUint = floatBitsToUint(val);
        return (floatToUint & 0x7fffffffu) > 0x7f800000u;
      }

      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan_custom(val.x),
          isnan_custom(val.y), isnan_custom(val.z), isnan_custom(val.w));
      }

      #define isnan(value) isnan_custom(value)
    `:"",l="",u=`
      #define round(value) newRound(value)
      int newRound(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 newRound(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `):(e="",t="attribute",n="varying",r="varying",a="texture2D",s="gl_FragColor",i="",o=`
      #define isnan(value) isnan_custom(value)
      bool isnan_custom(float val) {
        return (val > 0. || val < 1. || val == 0.) ? false : true;
      }
      bvec4 isnan_custom(vec4 val) {
        return bvec4(isnan(val.x), isnan(val.y), isnan(val.z), isnan(val.w));
      }
    `,l=`
      uniform float INFINITY;

      bool isinf(float val) {
        return abs(val) == INFINITY;
      }
      bvec4 isinf(vec4 val) {
        return equal(abs(val), vec4(INFINITY));
      }
    `,u=`
      int round(float value) {
        return int(floor(value + 0.5));
      }

      ivec4 round(vec4 value) {
        return ivec4(floor(value + vec4(0.5)));
      }
    `),{version:e,attribute:t,varyingVs:n,varyingFs:r,texture2D:a,output:s,defineOutput:i,defineSpecialNaN:o,defineSpecialInf:l,defineRound:u}}var tN=tN,tN=tN;function x4(e,t,n="index"){let r=rR.util.computeStrides(t);return r.map((t,a)=>{let s=`int ${e[a]} = ${n} / ${t}`,i=a===r.length-1?`int ${e[a+1]} = ${n} - ${e[a]} * ${t}`:`index -= ${e[a]} * ${t}`;return`${s}; ${i};`}).join("")}function x5(e,t,n="index"){let r=rR.util.computeStrides(t);return r.map((t,a)=>{let s=`int ${e[a]} = ${n} / outShapeStrides[${a}]`,i=a===r.length-1?`int ${e[a+1]} = ${n} - ${e[a]} * outShapeStrides[${a}]`:`index -= ${e[a]} * outShapeStrides[${a}]`;return`${s}; ${i};`}).join("")}function x6(e){let t=rR.util.computeStrides(e).map(e=>e.toString());return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * ${t[0]} + coords.y * ${t[1]} + coords.z;
  }
`}function x8(){return`
  int getFlatIndex(ivec3 coords) {
    return coords.x * outShapeStrides[0] + coords.y * outShapeStrides[1] + coords.z;
  }
`}let x9=`
  const float FLOAT_MAX = 1.70141184e38;
  const float FLOAT_MIN = 1.17549435e-38;

  lowp vec4 encode_float(highp float v) {
    if (isnan(v)) {
      return vec4(255, 255, 255, 255);
    }

    highp float av = abs(v);

    if(av < FLOAT_MIN) {
      return vec4(0.0, 0.0, 0.0, 0.0);
    } else if(v > FLOAT_MAX) {
      return vec4(0.0, 0.0, 128.0, 127.0) / 255.0;
    } else if(v < -FLOAT_MAX) {
      return vec4(0.0, 0.0,  128.0, 255.0) / 255.0;
    }

    highp vec4 c = vec4(0,0,0,0);

    highp float e = floor(log2(av));
    highp float m = exp2(fract(log2(av))) - 1.0;

    c[2] = floor(128.0 * m);
    m -= c[2] / 128.0;
    c[1] = floor(32768.0 * m);
    m -= c[1] / 32768.0;
    c[0] = floor(8388608.0 * m);

    highp float ebias = e + 127.0;
    c[3] = floor(ebias / 2.0);
    ebias -= c[3] * 2.0;
    c[2] += floor(ebias) * 128.0;

    c[3] += 128.0 * step(0.0, -v);

    return c / 255.0;
  }
`,{getBroadcastDims:x7}=tN,ye=`
vec2 uvFromFlat(int texNumR, int texNumC, int index) {
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
vec2 packedUVfrom1D(int texNumR, int texNumC, int index) {
  int texelIndex = index / 2;
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,yt=`
vec2 packedUVfrom2D(int texelsInLogicalRow, int texNumR,
  int texNumC, int row, int col) {
  int texelIndex = (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = texelIndex / texNumC;
  int texC = texelIndex - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,yn=`
vec2 packedUVfrom3D(int texNumR, int texNumC,
    int texelsInBatch, int texelsInLogicalRow, int b,
    int row, int col) {
  int index = b * texelsInBatch + (row / 2) * texelsInLogicalRow + (col / 2);
  int texR = index / texNumC;
  int texC = index - texR * texNumC;
  return (vec2(texC, texR) + halfCR) / vec2(texNumC, texNumR);
}
`,yr=`
  float getChannel(vec4 frag, vec2 innerDims) {
    vec2 modCoord = mod(innerDims, 2.);
    return modCoord.x == 0. ?
      (modCoord.y == 0. ? frag.r : frag.g) :
      (modCoord.y == 0. ? frag.b : frag.a);
  }
  float getChannel(vec4 frag, int dim) {
    float modCoord = mod(float(dim), 2.);
    return modCoord == 0. ? frag.r : frag.g;
  }
`;function ya(){return`
    int getOutputCoords() {
      return 0;
    }
  `}function ys(e){return`offset${e}`}function yi(e){let t=e.name,n=rR.util.sizeFromShape(e.shapeInfo.logicalShape);return n<2?`return ${t};`:`
    for (int i = 0; i < ${n}; i++) {
      if (i == index) {
        return ${t}[i];
      }
    }
  `}function yo(e){if(e<=1)return"int";if(2===e)return"ivec2";if(3===e)return"ivec3";if(4===e)return"ivec4";if(5===e)return"ivec5";else if(6===e)return"ivec6";else throw Error(`GPU for rank ${e} is not yet supported`)}function yl(e,t,n){let{newShape:r,keptDims:a}=rR.util.squeezeShape(t),s=t.length,i=e&&3===s&&1===t[0],o=i?t.slice(1):r,l=!e&&s>1&&!rR.util.arraysEqual(t,n)&&r.length<s||i,u=l?o:t;return{useSqueezeShape:l,uniformShape:u,keptDims:a}}function yu(e,t){let n=JSON.parse(JSON.stringify(e));return n.shapeInfo.logicalShape=t,n}function yh(e,t){return t.map(t=>e[t]).join(", ")}function yp(e,t,n){let r,a,s,i=[],o=[],l=null,u=null;for(let r of(u=e.getUniformLocation(n,"NAN",!1),1===(0,rN.env)().getNumber("WEBGL_VERSION")&&(l=e.getUniformLocation(n,"INFINITY",!1)),t.variableNames)){let a={name:r,uniform:e.getUniformLocation(n,r,!1),offset:e.getUniformLocation(n,`offset${r}`,!1)};t.enableShapeUniforms&&(a.shape=e.getUniformLocation(n,`${r}Shape`,!1),a.texShape=e.getUniformLocation(n,`${r}TexShape`,!1)),i.push(a)}if(t.enableShapeUniforms&&(r=e.getUniformLocation(n,"outShape",!1),s=e.getUniformLocation(n,"outShapeStrides",!1),a=e.getUniformLocation(n,"outTexShape",!1)),t.customUniforms)for(let r of t.customUniforms)o.push(e.getUniformLocation(n,r.name,!1));return{variablesLocations:i,customUniformLocations:o,infLoc:l,nanLoc:u,outShapeLocation:r,outShapeStridesLocation:s,outTexShapeLocation:a}}function yd(e,t){if(e.length!==t.length)throw Error(`Binary was compiled with ${e.length} inputs, but was executed with ${t.length} inputs`);e.forEach((e,n)=>{let r=e.logicalShape,a=t[n],s=a.shape;if(!rR.util.arraysEqual(r,s))throw Error(`Binary was compiled with different shapes than the current args. Shapes ${r} and ${s} must match`);if(e.isUniform&&a.isUniform)return;let i=e.texShape,o=a.isUniform?null:a.texData.texShape;if(!rR.util.arraysEqual(i,o))throw Error(`Binary was compiled with different texture shapes than the current args. Shape ${i} and ${o} must match`)})}function yc(e){return(0,rN.env)().getBool("WEBGL_USE_SHAPES_UNIFORMS")&&e<=4}class yf{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outPackingScheme=c.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const t=x3();this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?x5(["r","c","d"],e):x4(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getA(rc.x, rc.y, rc.z);
        }

        ${t.output} = result;
      }
    `}}class ym{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outPackingScheme=c.DENSE,this.customUniforms=[{name:"texShape",type:"ivec2"}];const t=x3();this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length),this.userCode=`
      ivec3 outCoordsFromFlatIndex(int index) {
        ${this.enableShapeUniforms?x5(["r","c","d"],e):x4(["r","c","d"],e)}
        return ivec3(r, c, d);
      }

      void main() {
        ivec2 resTexRC = ivec2(resultUV.yx * vec2(texShape[0], texShape[1]));
        int index = 4 * (resTexRC.x * texShape[1] + resTexRC.y);

        vec4 result = vec4(0.);

        for (int i=0; i<4; i++) {
          int flatIndex = index + i;
          ivec3 rc = outCoordsFromFlatIndex(flatIndex);
          result[i] = getChannel(getA(rc.x, rc.y, rc.z), vec2(rc.y, rc.z));
        }

        ${t.output} = result;
      }
    `}}class yg{constructor(e){this.variableNames=["A"],this.outTexUsage=f.DOWNLOAD;const t=x3();this.outputShape=e,this.userCode=`
      ${x9}

      void main() {
        float x = getAAtOutCoords();
        ${t.output} = encode_float(x);
      }
    `}}class yx{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outTexUsage=f.DOWNLOAD;const t=x3();this.outputShape=e,this.userCode=`
      ${x9}

      void main() {
        ivec3 coords = getOutputCoords();
        float x = getChannel(getAAtOutCoords(), vec2(coords.y, coords.z));
        ${t.output} = encode_float(x);
      }
    `}}let yy={R:0,G:1,B:2,A:3};class yb{constructor(e,t=!1,n="RGBA"){this.variableNames=["A"],this.customUniforms=[{name:"texShape",type:"ivec2"}];const r=x3();this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length);let a="result";t&&(a="floor(result * 255. + 0.5)");let s="";for(let e=0;e<n.length;e++){const t=n[e];s+=`
          if(offset == ${e}) {
            result = values[${yy[t]}];
          }`}this.userCode=`
      ${this.enableShapeUniforms?x8():x6(e)}

      void main() {
        ivec3 coords = getOutputCoords();
        int flatIndex = getFlatIndex(coords);
        float result = 0.;
        int offset = imod(flatIndex, ${n.length});

        flatIndex = idiv(flatIndex, ${n.length}, 1.);

        int r = flatIndex / texShape[1];
        if (r < texShape[0]) {
          int c = imod(flatIndex, texShape[1]);
          vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
          vec4 values = ${r.texture2D}(A, uv);
          ${s}
        }
        ${r.output} = vec4(${a}, 0., 0., 0.);
      }
    `}}class yv{constructor(e,t=!1){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.customUniforms=[{name:"texShape",type:"ivec2"}];const n=x3();this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length);let r="",a="result";t&&(a="floor(result * 255. + 0.5)");for(let t=0;t<=1;t++)for(let a=0;a<=1;a++){const s=2*t+a;r+=`
          localCoords = coords;
          if(localCoords[2] + ${a} < ${this.enableShapeUniforms?"outShape[2]":`${e[2]}`}) {
          localCoords[2] += ${a};
          if (localCoords[1] + ${t} < ${this.enableShapeUniforms?"outShape[1]":`${e[1]}`}) {
            localCoords[1] += ${t};

            flatIndex = getFlatIndex(localCoords);
            offset = imod(flatIndex, 4);

            flatIndex = idiv(flatIndex, 4, 1.);

            int r = flatIndex / texShape[1];
            int c = imod(flatIndex, texShape[1]);
            vec2 uv = (vec2(c, r) + halfCR) / vec2(texShape[1], texShape[0]);
            values = ${n.texture2D}(A, uv);

            if (offset == 0) {
              result[${s}] = values[0];
            } else if (offset == 1) {
              result[${s}] = values[1];
            } else if (offset == 2) {
              result[${s}] = values[2];
            } else {
              result[${s}] = values[3];
            }
          }
        }
        `}this.userCode=`
        ${this.enableShapeUniforms?x8():x6(e)}

        void main() {
          ivec3 coords = getOutputCoords();

          vec4 result = vec4(0.);
          int flatIndex, r, c, offset;
          ivec3 localCoords;
          vec2 uv;
          vec4 values;

          ${r}

          ${n.output} = ${a};
        }
    `}}function yw(e){let t=x3();return xd(e,`${t.version}
    precision highp float;
    ${t.attribute} vec3 clipSpacePos;
    ${t.attribute} vec2 uv;
    ${t.varyingVs} vec2 resultUV;

    void main() {
      gl_Position = vec4(clipSpacePos, 1);
      resultUV = uv;
    }`)}function yI(e){return xb(e,new Float32Array([-1,1,0,0,1,-1,-1,0,0,0,1,1,0,1,1,1,-1,0,1,0]))}function yC(e){return xv(e,new Uint16Array([0,1,2,2,1,3]))}function yk(e,t,n,r,a,s){xC(t,n);let i=xI(e),o=e.TEXTURE_2D;return xl(e,()=>e.bindTexture(o,i)),xl(e,()=>e.texParameteri(o,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE)),xl(e,()=>e.texParameteri(o,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE)),xl(e,()=>e.texParameteri(o,e.TEXTURE_MIN_FILTER,e.NEAREST)),xl(e,()=>e.texParameteri(o,e.TEXTURE_MAG_FILTER,e.NEAREST)),1===(0,rN.env)().getNumber("WEBGL_VERSION")?xl(e,()=>e.texImage2D(o,0,r,t,n,0,a,s,null)):xl(e,()=>e.texStorage2D(o,1,r,t,n)),xl(e,()=>e.bindTexture(e.TEXTURE_2D,null)),{texture:i,texShape:[n,t]}}function yS(e){return e.internalFormatFloat}function yT(e,t,n,r){let[a,s]=[n,t];return yk(e,a,s,yS(r),r.textureFormatFloat,e.FLOAT)}function yN(e){return e.internalFormatHalfFloat}function y$(e,t,n,r){let[a,s]=[n,t];return yk(e,a,s,yN(r),r.textureFormatFloat,r.textureTypeHalfFloat)}function yR(e){return e.downloadTextureFormat}function yA(e,t,n,r){let[a,s]=[n,t];return yk(e,a,s,yR(r),e.RGBA,e.UNSIGNED_BYTE)}function yE(e){return e.internalFormatPackedFloat}function yF(e,t,n,r){let[a,s]=xi(t,n);return yk(e,a,s,yE(r),e.RGBA,e.FLOAT)}function yD(e){return e.internalFormatPackedHalfFloat}function yO(e,t,n,r){let[a,s]=xi(t,n);return yk(e,a,s,yD(r),e.RGBA,r.textureTypeHalfFloat)}function yL(e,t,n){return xl(e,()=>e.bindBuffer(e.ARRAY_BUFFER,n)),xS(e,t,"clipSpacePos",n,3,20,0)&&xS(e,t,"uv",n,2,20,12)}function yz(e,t,n,r,a,s){let i,o,l;xl(e,()=>e.bindTexture(e.TEXTURE_2D,t)),a instanceof Uint8Array?(i=new Uint8Array(n*r*4),o=e.UNSIGNED_BYTE,l=e.RGBA):(i=new Float32Array(n*r*4),o=e.FLOAT,l=s.internalFormatPackedFloat),i.set(a),2===(0,rN.env)().getNumber("WEBGL_VERSION")?xl(e,()=>e.texSubImage2D(e.TEXTURE_2D,0,0,0,n,r,e.RGBA,o,i)):xl(e,()=>e.texImage2D(e.TEXTURE_2D,0,l,n,r,0,e.RGBA,o,i)),xl(e,()=>e.bindTexture(e.TEXTURE_2D,null))}function y_(e,t,n){xl(e,()=>e.bindTexture(e.TEXTURE_2D,t)),n.data instanceof Uint8Array?2===(0,rN.env)().getNumber("WEBGL_VERSION")?xl(e,()=>e.texSubImage2D(e.TEXTURE_2D,0,0,0,n.width,n.height,e.RGBA,e.UNSIGNED_BYTE,n.data)):xl(e,()=>e.texImage2D(e.TEXTURE_2D,0,e.RGBA,n.width,n.height,0,e.RGBA,e.UNSIGNED_BYTE,n.data)):2===(0,rN.env)().getNumber("WEBGL_VERSION")?xl(e,()=>e.texSubImage2D(e.TEXTURE_2D,0,0,0,e.RGBA,e.UNSIGNED_BYTE,n)):xl(e,()=>e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,n)),xl(e,()=>e.bindTexture(e.TEXTURE_2D,null))}function yM(e,t,n,r){let a=e.createBuffer();xl(e,()=>e.bindBuffer(e.PIXEL_PACK_BUFFER,a));let s=16*t*n;return xl(e,()=>e.bufferData(e.PIXEL_PACK_BUFFER,s,e.STREAM_READ)),xl(e,()=>e.readPixels(0,0,n,t,e.RGBA,e.FLOAT,0)),xl(e,()=>e.bindBuffer(e.PIXEL_PACK_BUFFER,null)),a}function yP(e,t,n){let r=new Float32Array(n);return e.bindBuffer(e.PIXEL_PACK_BUFFER,t),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,r),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),r}function yB(e,t,n,r){let[a,s]=[n,t],i=new Uint8Array(t*n*4);return xl(e,()=>e.readPixels(0,0,a,s,r.downloadTextureFormat,e.UNSIGNED_BYTE,i)),new Float32Array(i.buffer)}function yW(e,t,n,r,a,s,i,o){let l=new Float32Array(function(e,t){let[n,r]=xi(e,t);return n*r*4}(s,i));return e.bindBuffer(e.PIXEL_PACK_BUFFER,t),e.getBufferSubData(e.PIXEL_PACK_BUFFER,0,l),e.bindBuffer(e.PIXEL_PACK_BUFFER,null),l}function yG(e,t,n){let r=new Float32Array(t*n*4);return xl(e,()=>e.readPixels(0,0,n,t,e.RGBA,e.FLOAT,r)),r}e.s(["bindVertexProgramAttributeStreams",()=>yL,"createBufferFromOutputTexture",()=>yM,"createFloat16MatrixTexture",()=>y$,"createFloat16PackedMatrixTexture",()=>yO,"createFloat32MatrixTexture",()=>yT,"createIndexBuffer",()=>yC,"createPackedMatrixTexture",()=>yF,"createUnsignedBytesMatrixTexture",()=>yA,"createVertexBuffer",()=>yI,"createVertexShader",()=>yw,"downloadByteEncodedFloatMatrixFromOutputTexture",()=>yB,"downloadFloat32MatrixFromBuffer",()=>yP,"downloadMatrixFromPackedOutputTexture",()=>yG,"downloadPackedMatrixFromBuffer",()=>yW,"getInternalFormatForFloat16MatrixTexture",()=>yN,"getInternalFormatForFloat16PackedMatrixTexture",()=>yD,"getInternalFormatForFloat32MatrixTexture",()=>yS,"getInternalFormatForPackedMatrixTexture",()=>yE,"getInternalFormatForUnsignedBytesMatrixTexture",()=>yR,"uploadDenseMatrixToTexture",()=>yz,"uploadPixelDataToTexture",()=>y_],198600);class yU{constructor(e){this.outputTexture=null,this.program=null,this.disposed=!1,this.itemsToPoll=[];const t=(0,rN.env)().getNumber("WEBGL_VERSION");if(null!=e){var n;this.gl=e,n=e,xt[t]=n}else this.gl=xa(t);if(e=this.gl,2===(0,rN.env)().getNumber("WEBGL_VERSION")){const t=e;this.createVertexArray=()=>xl(t,()=>t.createVertexArray()),this.bindVertexArray=e=>xl(t,()=>t.bindVertexArray(e)),this.deleteVertexArray=e=>xl(t,()=>t.deleteVertexArray(e)),this.getVertexArray=()=>xl(t,()=>t.getParameter(t.VERTEX_ARRAY_BINDING))}else if(null!=e){const t=e.getExtension("OES_vertex_array_object");if(null==t)throw Error("All WebGL1 implementations are expected to offer OES_vertex_array_object.");this.createVertexArray=()=>xl(e,()=>t.createVertexArrayOES()),this.bindVertexArray=n=>xl(e,()=>t.bindVertexArrayOES(n)),this.deleteVertexArray=n=>xl(e,()=>t.deleteVertexArrayOES(n)),this.getVertexArray=()=>xl(e,()=>e.getParameter(t.VERTEX_ARRAY_BINDING_OES))}let r="WEBGL_color_buffer_float";const a="EXT_color_buffer_half_float";if(this.parallelCompilationExtension=this.gl.getExtension("KHR_parallel_shader_compile"),1===(0,rN.env)().getNumber("WEBGL_VERSION")){const e="OES_texture_half_float";if(this.textureFloatExtension=xp(this.gl,"OES_texture_float"),xX(this.gl,e))this.textureHalfFloatExtension=xp(this.gl,e);else if((0,rN.env)().get("WEBGL_FORCE_F16_TEXTURES"))throw Error("GL context does not support half float textures, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.");if(this.colorBufferFloatExtension=this.gl.getExtension(r),xX(this.gl,a))this.colorBufferHalfFloatExtension=xp(this.gl,a);else if((0,rN.env)().get("WEBGL_FORCE_F16_TEXTURES"))throw Error("GL context does not support color renderable half floats, yet the environment flag WEBGL_FORCE_F16_TEXTURES is set to true.")}else if(r="EXT_color_buffer_float",xX(this.gl,r))this.colorBufferFloatExtension=this.gl.getExtension(r);else if(xX(this.gl,a))this.colorBufferHalfFloatExtension=this.gl.getExtension(a);else throw Error("GL context does not support color renderable floats");this.vertexBuffer=yI(this.gl),this.indexBuffer=yC(this.gl),this.framebuffer=xk(this.gl),this.textureConfig=xo(this.gl,this.textureHalfFloatExtension)}get debug(){return(0,rN.env)().getBool("DEBUG")}dispose(){if(this.disposed)return;null!=this.program&&console.warn("Disposing a GPGPUContext that still has a bound WebGLProgram. This is probably a resource leak, delete the program with GPGPUContext.deleteProgram before disposing."),null!=this.outputTexture&&console.warn("Disposing a GPGPUContext that still has a bound output matrix texture.  This is probably a resource leak, delete the output matrix texture with GPGPUContext.deleteMatrixTexture before disposing.");let e=this.gl;xl(e,()=>e.finish()),xl(e,()=>e.bindFramebuffer(e.FRAMEBUFFER,null)),xl(e,()=>e.deleteFramebuffer(this.framebuffer)),xl(e,()=>e.bindBuffer(e.ARRAY_BUFFER,null)),xl(e,()=>e.bindBuffer(e.ELEMENT_ARRAY_BUFFER,null)),xl(e,()=>e.deleteBuffer(this.indexBuffer)),this.disposed=!0}createFloat32MatrixTexture(e,t){return this.throwIfDisposed(),yT(this.gl,e,t,this.textureConfig)}createFloat16MatrixTexture(e,t){return this.throwIfDisposed(),y$(this.gl,e,t,this.textureConfig)}createUnsignedBytesMatrixTexture(e,t){return this.throwIfDisposed(),yA(this.gl,e,t,this.textureConfig)}uploadPixelDataToTexture(e,t){this.throwIfDisposed(),y_(this.gl,e,t)}uploadDenseMatrixToTexture(e,t,n,r){this.throwIfDisposed(),yz(this.gl,e,t,n,r,this.textureConfig)}createFloat16PackedMatrixTexture(e,t){return this.throwIfDisposed(),yO(this.gl,e,t,this.textureConfig)}createPackedMatrixTexture(e,t){return this.throwIfDisposed(),yF(this.gl,e,t,this.textureConfig)}deleteMatrixTexture(e){this.throwIfDisposed(),this.outputTexture===e&&(xD(this.gl,this.framebuffer),this.outputTexture=null),xl(this.gl,()=>this.gl.deleteTexture(e))}downloadByteEncodedFloatMatrixFromOutputTexture(e,t,n){return this.downloadMatrixDriver(e,()=>yB(this.gl,t,n,this.textureConfig))}downloadPackedMatrixFromBuffer(e,t,n,r,a,s){return yW(this.gl,e,t,n,r,a,s,this.textureConfig)}downloadFloat32MatrixFromBuffer(e,t){return yP(this.gl,e,t)}createBufferFromTexture(e,t,n){this.bindTextureToFrameBuffer(e);let r=yM(this.gl,t,n,this.textureConfig);return this.unbindTextureToFrameBuffer(),r}createAndWaitForFence(){let e=this.createFence(this.gl);return this.pollFence(e)}createFence(e){let t,n;if((0,rN.env)().getBool("WEBGL_FENCE_API_ENABLED")){let r=e.fenceSync(e.SYNC_GPU_COMMANDS_COMPLETE,0);e.flush(),n=()=>{let t=e.clientWaitSync(r,0,0);return t===e.ALREADY_SIGNALED||t===e.CONDITION_SATISFIED},t=r}else(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")>0?(t=this.beginQuery(),this.endQuery(),n=()=>this.isQueryAvailable(t,(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))):n=()=>!0;return{query:t,isFencePassed:n}}downloadMatrixFromPackedTexture(e,t,n){return this.downloadMatrixDriver(e,()=>yG(this.gl,t,n))}createProgram(e){this.throwIfDisposed();let t=this.gl;null==this.vertexShader&&(this.vertexShader=yw(t));let n=xg(t);xl(t,()=>t.attachShader(n,this.vertexShader)),xl(t,()=>t.attachShader(n,e)),xx(t,n);let r=Object.assign(n,{vao:this.createVertexArray()});return this.debug&&xy(t,r),r}buildVao(e){this.setProgram(e),this.bindVertexArray(e.vao);let t=this.gl;xl(t,()=>t.bindBuffer(t.ELEMENT_ARRAY_BUFFER,this.indexBuffer)),yL(t,e,this.vertexBuffer)}deleteProgram(e){this.throwIfDisposed(),e===this.program&&(this.program=null),null!=e&&(xl(this.gl,()=>this.gl.deleteProgram(e)),this.deleteVertexArray(e.vao))}setProgram(e){this.throwIfDisposed(),this.program=e,null!=this.program&&this.debug&&xy(this.gl,this.program),xl(this.gl,()=>this.gl.useProgram(e))}getUniformLocation(e,t,n=!0){return(this.throwIfDisposed(),n)?x$(this.gl,e,t):xR(this.gl,e,t)}getAttributeLocation(e,t){return this.throwIfDisposed(),xl(this.gl,()=>this.gl.getAttribLocation(e,t))}getUniformLocationNoThrow(e,t){return this.throwIfDisposed(),this.gl.getUniformLocation(e,t)}setInputMatrixTexture(e,t,n){this.throwIfDisposed(),this.throwIfNoProgram(),xA(this.gl,e,t,n)}setOutputMatrixTexture(e,t,n){this.setOutputMatrixTextureDriver(e,n,t)}setOutputPackedMatrixTexture(e,t,n){this.throwIfDisposed();let[r,a]=xi(t,n);this.setOutputMatrixTextureDriver(e,r,a)}setOutputMatrixWriteRegion(e,t,n,r){this.setOutputMatrixWriteRegionDriver(n,e,r,t)}setOutputPackedMatrixWriteRegion(e,t,n,r){throw Error("setOutputPackedMatrixWriteRegion not implemented.")}debugValidate(){null!=this.program&&xy(this.gl,this.program),xO(this.gl)}executeProgram(){this.throwIfDisposed(),this.throwIfNoProgram();let e=this.gl;this.debug&&(console.assert(this.getVertexArray()===this.program.vao,"VAO changed between setProgram and executeProgram!"),this.debugValidate()),xl(e,()=>e.drawElements(e.TRIANGLES,6,e.UNSIGNED_SHORT,0))}blockUntilAllProgramsCompleted(){this.throwIfDisposed(),xl(this.gl,()=>this.gl.finish())}getQueryTimerExtension(){return null==this.disjointQueryTimerExtension&&(this.disjointQueryTimerExtension=xp(this.gl,2===(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")?"EXT_disjoint_timer_query_webgl2":"EXT_disjoint_timer_query")),this.disjointQueryTimerExtension}getQueryTimerExtensionWebGL2(){return this.getQueryTimerExtension()}getQueryTimerExtensionWebGL1(){return this.getQueryTimerExtension()}beginQuery(){if(2===(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")){let e=this.gl,t=this.getQueryTimerExtensionWebGL2(),n=e.createQuery();return e.beginQuery(t.TIME_ELAPSED_EXT,n),n}let e=this.getQueryTimerExtensionWebGL1(),t=e.createQueryEXT();return e.beginQueryEXT(e.TIME_ELAPSED_EXT,t),t}endQuery(){if(2===(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION")){let e=this.gl,t=this.getQueryTimerExtensionWebGL2();e.endQuery(t.TIME_ELAPSED_EXT);return}let e=this.getQueryTimerExtensionWebGL1();e.endQueryEXT(e.TIME_ELAPSED_EXT)}async waitForQueryAndGetTime(e){return await rR.util.repeatedTry(()=>this.disposed||this.isQueryAvailable(e,(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))),this.getQueryTime(e,(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_VERSION"))}getQueryTime(e,t){if(0===t)return null;if(2===t){let t=this.gl;return t.getQueryParameter(e,t.QUERY_RESULT)/1e6}{let t=this.getQueryTimerExtensionWebGL1();return t.getQueryObjectEXT(e,t.QUERY_RESULT_EXT)/1e6}}isQueryAvailable(e,t){if(0===t)return!0;if(2===t){let t=this.gl,n=this.getQueryTimerExtensionWebGL2(),r=t.getQueryParameter(e,t.QUERY_RESULT_AVAILABLE);return null==this.disjoint&&(this.disjoint=this.gl.getParameter(n.GPU_DISJOINT_EXT)),r&&!this.disjoint}{let t=this.getQueryTimerExtensionWebGL1(),n=t.getQueryObjectEXT(e,t.QUERY_RESULT_AVAILABLE_EXT);return null==this.disjoint&&(this.disjoint=this.gl.getParameter(t.GPU_DISJOINT_EXT)),n&&!this.disjoint}}pollFence(e){return new Promise(t=>{this.addItemToPoll(()=>e.isFencePassed(),()=>t())})}pollItems(){let e=function(e){let t=0;for(;t<e.length&&e[t]();++t);return t-1}(this.itemsToPoll.map(e=>e.isDoneFn));for(let t=0;t<=e;++t){let{resolveFn:e}=this.itemsToPoll[t];e()}this.itemsToPoll=this.itemsToPoll.slice(e+1)}addItemToPoll(e,t){let n;this.itemsToPoll.push({isDoneFn:e,resolveFn:t}),this.itemsToPoll.length>1||("setTimeoutCustom"in(0,rN.env)().platform&&(n=(0,rN.env)().platform.setTimeoutCustom.bind((0,rN.env)().platform)),rR.util.repeatedTry(()=>(this.pollItems(),0===this.itemsToPoll.length),()=>0,null,n))}bindTextureToFrameBuffer(e){this.throwIfDisposed(),xF(this.gl,e,this.framebuffer),this.debug&&xO(this.gl)}unbindTextureToFrameBuffer(){null!=this.outputTexture?(xF(this.gl,this.outputTexture,this.framebuffer),this.debug&&xO(this.gl)):xD(this.gl,this.framebuffer)}downloadMatrixDriver(e,t){this.bindTextureToFrameBuffer(e);let n=t();return this.unbindTextureToFrameBuffer(),n}setOutputMatrixTextureDriver(e,t,n){this.throwIfDisposed();let r=this.gl;xF(r,e,this.framebuffer),this.debug&&xO(r),this.outputTexture=e,xl(r,()=>r.viewport(0,0,t,n)),xl(r,()=>r.scissor(0,0,t,n))}setOutputMatrixWriteRegionDriver(e,t,n,r){this.throwIfDisposed(),xl(this.gl,()=>this.gl.scissor(e,t,n,r))}throwIfDisposed(){if(this.disposed)throw Error("Attempted to use disposed GPGPUContext.")}throwIfNoProgram(){if(null==this.program)throw Error("No GPU program is currently set.")}}let{addImpl:yV,bincountImpl:yH,bincountReduceImpl:yq,bitwiseAndImpl:yj,castImpl:yX,ceilImpl:yK,concatImpl:yY,equalImpl:yZ,expImpl:yJ,expm1Impl:yQ,floorImpl:y0,gatherNdImpl:y1,gatherV2Impl:y2,greaterImpl:y3,greaterEqualImpl:y4,lessImpl:y5,lessEqualImpl:y6,linSpaceImpl:y8,logImpl:y9,maxImpl:y7,maximumImpl:be,minimumImpl:bt,multiplyImpl:bn,negImpl:br,notEqualImpl:ba,prodImpl:bs,raggedGatherImpl:bi,raggedRangeImpl:bo,raggedTensorToTensorImpl:bl,rangeImpl:bu,rsqrtImpl:bh,scatterImpl:bp,sigmoidImpl:bd,simpleAbsImpl:bc,sliceImpl:bf,sparseFillEmptyRowsImpl:bm,sparseReshapeImpl:bg,sparseSegmentReductionImpl:bx,sqrtImpl:by,staticRegexReplaceImpl:bb,stridedSliceImpl:bv,stringNGramsImpl:bw,stringSplitImpl:bI,stringToHashBucketFastImpl:bC,subImpl:bk,tileImpl:bS,topKImpl:bT,transposeImpl:bN,uniqueImpl:b$}=cq;function bR(e,t){return["x","y","z","w","u","v"].slice(0,t).map(t=>`${e}.${t}`)}function bA(e,t){return 1===t?[e]:bR(e,t)}class bE{constructor(e){if(this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.enableShapeUniforms=yc(this.outputShape.length),0===this.rank)this.userCode=`
        void main() {
          setOutput(vec4(getA(), 0., 0., 0.));
        }
      `;else{const e=bA("rc",this.rank),t=yo(this.rank),n=this.getOutOfBoundsCondition(e),r=this.getSetup(e),a=this.getOutput(e);this.userCode=`
        void main() {
          ${t} rc = getOutputCoords();

          if(${n}) {
            setOutput(vec4(0));
          } else {
            ${r}

            setOutput(vec4(${a}));
          }
        }
      `}}getSourceCoordsArr(e){let t=[];for(let n=0;n<=1;n++)for(let r=0;r<=1;r++){let a=`${0===n?"r":"rp1"}, ${0===r?"c":"cp1"}`;for(let t=2;t<this.rank;t++)a=`${e[e.length-1-t]},`+a;t.push(a)}return t}getOutOfBoundsCondition(e){if(1===this.rank)return`rc > ${this.enableShapeUniforms?"outShape":this.outputShape[0]}`;let t="";for(let n=this.rank-2;n<this.rank;n++)t+=`${e[n]} >= ${this.enableShapeUniforms?`outShape[${n}]`:this.outputShape[n]}`,n<this.rank-1&&(t+="||");return t}getSetup(e){if(1===this.rank)return"";let t=e.slice(-2),n=this.enableShapeUniforms?`outShape[${this.rank} - 1]`:this.outputShape[this.rank-1],r=this.enableShapeUniforms?`outShape[${this.rank} - 2]`:this.outputShape[this.rank-2];return`
      int r = ${t[0]};
      int c = ${t[1]};
      int rp1 = r + 1;
      int cp1 = c + 1;

      bool cEdge = cp1 >= ${n};
      bool rEdge = rp1 >= ${r};
    `}getOutput(e){let t=this.getSourceCoordsArr(e);if(1===this.rank){let e=this.enableShapeUniforms?"outShape":this.outputShape[0];return`getA(rc), (rc + 1 >= ${e} ? 0. : getA(rc + 1)), 0, 0`}return`getA(${t[0]}),
            cEdge ? 0. : getA(${t[1]}),
            rEdge ? 0. : getA(${t[2]}),
            rEdge || cEdge ? 0. : getA(${t[3]})`}}class bF{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec3"}],this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length);let n="";for(let e=0;e<4;e++){let t="thisRC = rc;";e%2==1&&(t+="thisRC.z += 1;"),e>1&&(t+="thisRC.y += 1;"),n+=`
        ${t}
        ${e>0?"if(thisRC.y < rows && thisRC.z < cols){":""}
          int flatIndex = getFlatIndex(thisRC);

          ivec3 inputRC = inputCoordsFromReshapedOutCoords(flatIndex);
          vec2 inputRCInnerDims = vec2(float(inputRC.y),float(inputRC.z));

          result[${e}] =
            getChannel(getA(inputRC.x, inputRC.y, inputRC.z), inputRCInnerDims);
        ${e>0?"}":""}
      `}this.userCode=`
      ${function(e,t){let n=t?function(e,t,n="index"){let r=function(e,t){let n=e.length,r=e.map(e=>`${t}[${e}]`),a=Array(n-1);a[n-2]=r[n-1];for(let e=n-3;e>=0;--e)a[e]=`(${a[e+1]} * ${r[e+1]})`;return a}(e.map((e,t)=>t),t);return r.map((t,a)=>{let s=`int ${e[a]} = ${n} / ${r[a]}`,i=a===r.length-1?`int ${e[a+1]} = ${n} - ${e[a]} * ${r[a]}`:`index -= ${e[a]} * ${r[a]}`;return`${s}; ${i};`}).join("")}(["r","c","d"],"inputShape"):x4(["r","c","d"],e);return`
    ivec3 inputCoordsFromReshapedOutCoords(int index) {
      ${n}
      return ivec3(r, c, d);
    }
  `}(t,this.enableShapeUniforms)}
      ${this.enableShapeUniforms?x8():x6(e)}

      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0.);

        ivec3 thisRC;
        int rows = ${this.enableShapeUniforms?"outShape[1]":e[1]};
        int cols = ${this.enableShapeUniforms?"outShape[2]":e[2]};

        ${n}

        setOutput(result);
      }
    `}}class bD{constructor(e){this.gpgpu=e,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0,this.freeTextures={},this.usedTextures={},this.logEnabled=!1}acquireTexture(e,t,n){let r,a=bL(t,n),s=bz(e,a,n);s in this.freeTextures||(this.freeTextures[s]=[]),s in this.usedTextures||(this.usedTextures[s]=[]);let i=bO(e,a,this.gpgpu.gl,this.gpgpu.textureConfig,n);if(this.freeTextures[s].length>0){this.numFreeTextures--,this.numUsedTextures++,this._numBytesFree-=i,this.log();let e=this.freeTextures[s].pop();return this.usedTextures[s].push(e),e}return a===m.PACKED_2X2_FLOAT32?r=this.gpgpu.createPackedMatrixTexture(e[0],e[1]):a===m.PACKED_2X2_FLOAT16?r=this.gpgpu.createFloat16PackedMatrixTexture(e[0],e[1]):a===m.UNPACKED_FLOAT32?r=this.gpgpu.createFloat32MatrixTexture(e[0],e[1]):a===m.UNPACKED_FLOAT16?r=this.gpgpu.createFloat16MatrixTexture(e[0],e[1]):a===m.PACKED_4X1_UNSIGNED_BYTE&&(r=this.gpgpu.createUnsignedBytesMatrixTexture(e[0],e[1])),this.usedTextures[s].push(r),this.numUsedTextures++,this._numBytesAllocated+=i,this.log(),r}releaseTexture(e,t,n,r){if(null==this.freeTextures)return;let a=bL(n,r),s=bz(t,a,r);s in this.freeTextures||(this.freeTextures[s]=[]);let i=bO(t,a,this.gpgpu.gl,this.gpgpu.textureConfig,r),o=(0,rN.env)().getNumber("WEBGL_DELETE_TEXTURE_THRESHOLD");-1!==o&&this._numBytesAllocated>o?(this.gpgpu.deleteMatrixTexture(e.texture),this._numBytesAllocated-=i):(this.freeTextures[s].push(e),this.numFreeTextures++,this._numBytesFree+=i),this.numUsedTextures--;let l=this.usedTextures[s],u=l&&l.indexOf(e);if(null==u||u<0)throw Error("Cannot release a texture that was never provided by this texture manager");l[u]=l[l.length-1],l.pop(),this.log()}log(){if(!this.logEnabled)return;let e=this.numFreeTextures+this.numUsedTextures;console.log("Free/Used",`${this.numFreeTextures} / ${this.numUsedTextures}`,`(${e})`);let t=this._numBytesFree/this._numBytesAllocated;console.log(`Bytes allocated: ${this._numBytesAllocated}`),console.log(`Bytes unused: ${this._numBytesFree} (${Math.round(100*t)}%)`)}get numBytesAllocated(){return this._numBytesAllocated}get numBytesFree(){return this._numBytesFree}getNumUsedTextures(){return this.numUsedTextures}getNumFreeTextures(){return this.numFreeTextures}dispose(){if(null!=this.freeTextures){for(let e in this.freeTextures)this.freeTextures[e].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture)});for(let e in this.usedTextures)this.usedTextures[e].forEach(e=>{this.gpgpu.deleteMatrixTexture(e.texture)});this.freeTextures=null,this.usedTextures=null,this.numUsedTextures=0,this.numFreeTextures=0,this._numBytesAllocated=0,this._numBytesFree=0}}}function bO(e,t,n,r,a){let s,i=function(e,t){switch(e){case m.PACKED_2X2_FLOAT32:return yE(t);case m.PACKED_2X2_FLOAT16:return yD(t);case m.UNPACKED_FLOAT32:return yS(t);case m.UNPACKED_FLOAT16:return yN(t);case m.PACKED_4X1_UNSIGNED_BYTE:return yR(t);default:throw Error(`Unknown physical texture type ${e}`)}}(t,r);if(a){let[t,n]=xi(e[0],e[1]);s=t*n}else{var o;let[t,n]=(o=e[0],[e[1],o]);s=t*n}return s*function(e,t){if(t===e.R32F)return 4;if(t===e.R16F)return 2;if(t===e.RGBA32F)return 16;if(t===e.RGBA)return 16;if(t===e.RGBA16F)return 8;else if(t===e.RGBA8)return 4;throw Error(`Unknown internal format ${t}`)}(n,i)}function bL(e,t){if(e===f.UPLOAD)return m.PACKED_2X2_FLOAT32;if(e===f.RENDER||null==e)return(0,rN.env)().getBool("WEBGL_RENDER_FLOAT32_ENABLED")?t?m.PACKED_2X2_FLOAT32:m.UNPACKED_FLOAT32:t?m.PACKED_2X2_FLOAT16:m.UNPACKED_FLOAT16;if(e===f.DOWNLOAD||e===f.PIXELS)return m.PACKED_4X1_UNSIGNED_BYTE;throw Error(`Unknown logical texture type ${e}`)}function bz(e,t,n){return`${e[0]}_${e[1]}_${t}_${n}`}class b_{constructor(e,t){this.variableNames=["A"],this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length),this.userCode=`
      float unaryOperation(float x) {
        ${t}
      }

      void main() {
        float x = getAAtOutCoords();
        float y = unaryOperation(x);

        setOutput(y);
      }
    `}}let bM="if (isnan(x)) return x;",bP="return abs(x);",bB=bM+`
  return (x < 0.0) ? 0.0 : x;
`,bW=bM+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,bG="return x;",bU=`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`,bV=`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,bH=`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`;class bq{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length),this.userCode=`
      vec4 unaryOperation(vec4 x) {
        ${t}
      }

      void main() {
        vec4 x = getAAtOutCoords();
        vec4 y = unaryOperation(x);

        setOutput(y);
      }
    `}}class bj{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!1,this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length);const t=e.length,n=bA("rc",t),r=yo(t),a=function(e,t){if(1===e)return"rc";let n="";for(let r=0;r<e;r++)n+=t[r],r<e-1&&(n+=",");return n}(t,n),s=n.slice(-2),i=t<=1?"rc":`vec2(${s.join(",")})`;this.userCode=`
      void main() {
        ${r} rc = getOutputCoords();
        vec4 packedInput = getA(${a});

        setOutput(getChannel(packedInput, ${i}));
      }
    `}}let bX=pM.whereImpl,bK={},bY=(0,rN.env)().getNumber("CPU_HANDOFF_SIZE_THRESHOLD");class bZ extends x2.KernelBackend{nextDataId(){return bZ.nextDataId++}constructor(e){let t;if(super(),this.pendingRead=new WeakMap,this.pendingDisposal=new WeakSet,this.dataRefCount=new WeakMap,this.numBytesInGPU=0,this.uploadWaitMs=0,this.downloadWaitMs=0,this.lastGlFlushTime=0,this.warnedAboutMemory=!1,this.pendingDeletes=0,this.disposed=!1,!(0,rN.env)().getBool("HAS_WEBGL"))throw Error("WebGL is not supported on this device");null!=e?(t=e instanceof yU?e:new yU(xa((0,rN.env)().getNumber("WEBGL_VERSION"),e)),this.binaryCache={},this.gpgpuCreatedLocally=!1):(t=new yU(xa((0,rN.env)().getNumber("WEBGL_VERSION"))),this.binaryCache=function(e){return e in bK||(bK[e]={}),bK[e]}((0,rN.env)().getNumber("WEBGL_VERSION")),this.gpgpuCreatedLocally=!0),this.gpgpu=t,this.canvas=this.gpgpu.gl.canvas,this.textureManager=new bD(this.gpgpu),this.numMBBeforeWarning=null==(0,rN.env)().global.screen?1024:(0,rN.env)().global.screen.height*(0,rN.env)().global.screen.width*window.devicePixelRatio*600/1024/1024,this.texData=new x2.DataStorage(this,(0,r$.engine)())}numDataIds(){return this.texData.numDataIds()-this.pendingDeletes}writeTexture(e,t,n,r,a,s){let i=this.makeTensorInfo(t,n),o=this.texData.get(i.dataId);o.isPacked=!1,o.texture={texture:e,texShape:[r,a]},o.texShape=[r,a];let l=new yb(xB(t),!1,s),u=this.runWebGLProgram(l,[i],n,[[r,a]]);return u.shape=t,o.texture=null,this.disposeIntermediateTensorInfo(i),u.dataId}write(e,t,n){if(((0,rN.env)().getBool("WEBGL_CHECK_NUMERICAL_PROBLEMS")||(0,rN.env)().getBool("DEBUG"))&&this.checkNumericalProblems(e),"complex64"===n&&null!=e)throw Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");let r={id:this.nextDataId()};return this.texData.set(r,{shape:t,dtype:n,values:e,usage:f.UPLOAD,refCount:1}),r}refCount(e){return this.texData.has(e)?this.texData.get(e).refCount:0}incRef(e){let t=this.texData.get(e);t.refCount++}decRef(e){if(this.texData.has(e)){let t=this.texData.get(e);t.refCount--}}move(e,t,n,r,a){if((0,rN.env)().getBool("DEBUG")&&this.checkNumericalProblems(t),"complex64"===r)throw Error("Cannot write to a complex64 dtype. Please use tf.complex(real, imag).");this.texData.set(e,{shape:n,dtype:r,values:t,usage:f.UPLOAD,refCount:a})}disposeIntermediateTensorInfo(e){this.disposeData(e.dataId)}readSync(e){let t,n,{values:r,dtype:a,complexTensorInfos:s,slice:i,shape:o,isPacked:l}=this.texData.get(e);if(null!=i){let t;t=l?new bq(o,bG):new b_(o,bG);let n=this.runWebGLProgram(t,[{dataId:e,shape:o,dtype:a}],a),r=this.readSync(n.dataId);return this.disposeIntermediateTensorInfo(n),r}if(null!=r)return this.convertAndCacheOnCPU(e);if("string"===a)return r;let u=null!=this.activeTimers;if(u&&(t=rR.util.now()),"complex64"===a){let e=this.readSync(s.real.dataId),t=this.readSync(s.imag.dataId);n=tN.mergeRealAndImagArrays(e,t)}else n=this.getValuesFromTexture(e);return u&&(this.downloadWaitMs+=rR.util.now()-t),this.convertAndCacheOnCPU(e,n)}async read(e){let t,n;if(this.pendingRead.has(e)){let t=this.pendingRead.get(e);return new Promise(e=>t.push(e))}let{values:r,shape:a,slice:s,dtype:i,complexTensorInfos:o,isPacked:l}=this.texData.get(e);if(null!=s){let t;t=l?new bq(a,bG):new b_(a,bG);let n=this.runWebGLProgram(t,[{dataId:e,shape:a,dtype:i}],i),r=this.read(n.dataId);return this.disposeIntermediateTensorInfo(n),r}if(null!=r)return this.convertAndCacheOnCPU(e);if((0,rN.env)().getBool("DEBUG")&&!(0,rN.env)().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")&&2===(0,rN.env)().getNumber("WEBGL_VERSION"))throw Error("tensor.data() with WEBGL_DOWNLOAD_FLOAT_ENABLED=false and WEBGL_VERSION=2 not yet supported.");let u=null;if("complex64"!==i&&(0,rN.env)().get("WEBGL_BUFFER_SUPPORTED")){t=this.decode(e);let n=this.texData.get(t.dataId);u=this.gpgpu.createBufferFromTexture(n.texture.texture,...xs(a))}if(this.pendingRead.set(e,[]),"complex64"!==i&&await this.gpgpu.createAndWaitForFence(),"complex64"===i){let e=await Promise.all([this.read(o.real.dataId),this.read(o.imag.dataId)]),t=e[0],r=e[1];n=tN.mergeRealAndImagArrays(t,r)}else if(null==u)n=this.getValuesFromTexture(e);else{let e=rR.util.sizeFromShape(a);n=this.gpgpu.downloadFloat32MatrixFromBuffer(u,e)}if(null!=t&&this.disposeIntermediateTensorInfo(t),null!=u){let e=this.gpgpu.gl;xl(e,()=>e.deleteBuffer(u))}let h=this.convertAndCacheOnCPU(e,n),p=this.pendingRead.get(e);return this.pendingRead.delete(e),p.forEach(e=>e(h)),this.pendingDisposal.has(e)&&(this.pendingDisposal.delete(e),this.disposeData(e)&&(0,r$.engine)().removeDataId(e,this),this.pendingDeletes--),h}readToGPU(e,t={}){let{values:n,shape:r,slice:a,dtype:s,isPacked:i,texture:o}=this.texData.get(e);if("complex64"===s)throw Error("Does not support reading texture for complex64 dtype.");if(null!=a){let n;n=i?new bq(r,bG):new b_(r,bG);let a=this.runWebGLProgram(n,[{dataId:e,shape:r,dtype:s}],s),o=this.readToGPU(a,t);return this.disposeIntermediateTensorInfo(a),o}if(null==o)if(null!=n)throw Error("Data is not on GPU but on CPU.");else throw Error("There is no data on GPU or CPU.");let l=this.decode(e,t.customTexShape);return Object.assign({tensorRef:(0,r$.engine)().makeTensorFromTensorInfo(l)},this.texData.get(l.dataId).texture)}bufferSync(e){let t=this.readSync(e.dataId);if("string"===e.dtype)try{let n=t.map(e=>rR.util.decodeString(e));return(0,pz.buffer)(e.shape,e.dtype,n)}catch(e){throw Error("Failed to decode encoded string bytes into utf-8")}return(0,pz.buffer)(e.shape,e.dtype,t)}checkNumericalProblems(e){if(null!=e)for(let t=0;t<e.length;t++){let n=e[t];if(!xu(n)){if((0,rN.env)().getBool("WEBGL_RENDER_FLOAT32_CAPABLE"))throw Error(`The value ${n} cannot be represented with your current settings. Consider enabling float32 rendering: 'tf.env().set('WEBGL_RENDER_FLOAT32_ENABLED', true);'`);throw Error(`The value ${n} cannot be represented on this device.`)}}}getValuesFromTexture(e){let{shape:t,dtype:n,isPacked:r}=this.texData.get(e),a=rR.util.sizeFromShape(t);if((0,rN.env)().getBool("WEBGL_DOWNLOAD_FLOAT_ENABLED")){let n=this.decode(e),r=this.texData.get(n.dataId),s=this.gpgpu.downloadMatrixFromPackedTexture(r.texture.texture,...xs(t)).subarray(0,a);return this.disposeIntermediateTensorInfo(n),s}let s=(0,rN.env)().getBool("WEBGL_PACK")&&!0===r,i=s?xB(t):t,o=s?new yx(i):new yg(i),l=this.runWebGLProgram(o,[{shape:i,dtype:n,dataId:e}],"float32"),u=this.texData.get(l.dataId),h=this.gpgpu.downloadByteEncodedFloatMatrixFromOutputTexture(u.texture.texture,u.texShape[0],u.texShape[1]).subarray(0,a);return this.disposeIntermediateTensorInfo(l),h}timerAvailable(){return(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0}time(e){let t=this.activeTimers,n=[],r=!1;null==this.programTimersStack?(this.programTimersStack=n,r=!0):this.activeTimers.push(n),this.activeTimers=n,e();let a=rR.util.flatten(this.activeTimers.map(e=>e.query)).filter(e=>null!=e),s=rR.util.flatten(this.activeTimers.map(e=>e.name)).filter(e=>null!=e);this.activeTimers=t,r&&(this.programTimersStack=null);let i={uploadWaitMs:this.uploadWaitMs,downloadWaitMs:this.downloadWaitMs,kernelMs:null,wallMs:null};return(async()=>{if((0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0){let e=await Promise.all(a);i.kernelMs=rR.util.sum(e),i.getExtraProfileInfo=()=>e.map((e,t)=>({name:s[t],ms:e})).map(e=>`${e.name}: ${e.ms}`).join(", ")}else i.kernelMs={error:"WebGL query timers are not supported in this environment."};return this.uploadWaitMs=0,this.downloadWaitMs=0,i})()}memory(){return{unreliable:!1,numBytesInGPU:this.numBytesInGPU,numBytesInGPUAllocated:this.textureManager.numBytesAllocated,numBytesInGPUFree:this.textureManager.numBytesFree}}startTimer(){return(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.beginQuery():{startMs:rR.util.now(),endMs:null}}endTimer(e){return(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.endQuery():e.endMs=rR.util.now(),e}async getQueryTime(e){return(0,rN.env)().getNumber("WEBGL_DISJOINT_QUERY_TIMER_EXTENSION_RELIABLE")>0?this.gpgpu.waitForQueryAndGetTime(e):e.endMs-e.startMs}disposeData(e,t=!1){if(this.pendingDisposal.has(e))return!1;if(!this.texData.has(e))return!0;if(t?this.texData.get(e).refCount=0:this.texData.get(e).refCount--,!t&&this.texData.get(e).refCount>0)return!1;if(this.pendingRead.has(e))return this.pendingDisposal.add(e),this.pendingDeletes++,!1;this.releaseGPUData(e);let{complexTensorInfos:n}=this.texData.get(e);return null!=n&&(this.disposeData(n.real.dataId,t),this.disposeData(n.imag.dataId,t)),this.texData.delete(e),!0}releaseGPUData(e){let{texture:t,dtype:n,texShape:r,usage:a,isPacked:s,slice:i}=this.texData.get(e),o=i&&i.origDataId||e,l=this.dataRefCount.get(o);l>1?this.dataRefCount.set(o,l-1):(this.dataRefCount.delete(o),null!=t&&(this.numBytesInGPU-=this.computeBytes(r,n),this.textureManager.releaseTexture(t,r,a,s)));let u=this.texData.get(e);u.texture=null,u.texShape=null,u.isPacked=!1,u.slice=null}getTexture(e){return this.uploadToGPU(e),this.texData.get(e).texture.texture}getDataInfo(e){return this.texData.get(e)}shouldExecuteOnCPU(e,t=bY){return(0,rN.env)().getBool("WEBGL_CPU_FORWARD")&&e.every(e=>null==this.texData.get(e.dataId).texture&&rR.util.sizeFromShape(e.shape)<t)}getGPGPUContext(){return this.gpgpu}where(e){tN.warn("tf.where() in webgl locks the UI thread. Call tf.whereAsync() instead");let t=e.dataSync();return bX(e.shape,t)}packedUnaryOp(e,t,n){let r=new bq(e.shape,t),a=this.compileAndRun(r,[e],n);return(0,r$.engine)().makeTensorFromTensorInfo(a)}abs(e){if(this.shouldExecuteOnCPU([e])&&"complex64"!==e.dtype){let t=bc(this.texData.get(e.dataId).values);return this.makeOutput(e.shape,e.dtype,t)}if((0,rN.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS"))return this.packedUnaryOp(e,bP,e.dtype);let t=new b_(e.shape,bP),n=this.compileAndRun(t,[e]);return(0,r$.engine)().makeTensorFromTensorInfo(n)}makeTensorInfo(e,t,n){let r;if("string"===t&&null!=n&&n.length>0&&rR.util.isString(n[0])){let a=n.map(e=>rR.util.encodeString(e));r=this.write(a,e,t)}else r=this.write(n,e,t);return this.texData.get(r).usage=null,{dataId:r,shape:e,dtype:t}}makeOutput(e,t,n){return(0,r$.engine)().makeTensorFromTensorInfo(this.makeTensorInfo(e,t,n),this)}unpackTensor(e){let t=new bj(e.shape);return this.runWebGLProgram(t,[e],e.dtype)}packTensor(e){let t=new bE(e.shape);return this.runWebGLProgram(t,[e],e.dtype,null,!0)}packedReshape(e,t){let n=[xM(e.shape),...xP(e.shape)],r={dtype:e.dtype,shape:n,dataId:e.dataId},a=new bF([xM(t),...xP(t)],n),s=this.runWebGLProgram(a,[r],e.dtype,[n],!0);return{dataId:s.dataId,shape:t,dtype:s.dtype}}decode(e,t){let n,{isPacked:r,shape:a,dtype:s}=this.texData.get(e);if(null!=t){let e=rR.util.sizeFromShape(a),n=t[0]*t[1]*4;rR.util.assert(e<=n,()=>"customTexShape is too small. Row * Column * 4 should be equal or larger than the size of the tensor data.")}let i=xB(a);n=r?new ym(i):new yf(i);let o=[null!=t?t:xs(i)],l=this.runWebGLProgram(n,[{shape:i,dtype:s,dataId:e}],s,o,!0,t);return{dtype:s,shape:a,dataId:l.dataId}}runWebGLProgram(e,t,n,r,a=!1,s){let i,o,l,u=this.makeTensorInfo(e.outputShape,n),h=this.texData.get(u.dataId);if(e.packedOutput&&(h.isPacked=!0),e.outPackingScheme===c.DENSE&&(h.texShape=(null!=s?s:xs(e.outputShape)).map(e=>2*e)),null!=e.outTexUsage&&(h.usage=e.outTexUsage),0===rR.util.sizeFromShape(u.shape))return h.values=rR.util.getTypedArrayFromDType(u.dtype,0),u;let p=[],d=t.map(t=>{if("complex64"===t.dtype)throw Error("GPGPUProgram does not support complex64 input. For complex64 dtypes, please separate the program into real and imaginary parts.");let n=this.texData.get(t.dataId);if(null==n.texture){if(!e.packedInputs&&rR.util.sizeFromShape(t.shape)<=(0,rN.env)().getNumber("WEBGL_SIZE_UPLOAD_UNIFORM"))return{shape:t.shape,texData:null,isUniform:!0,uniformValues:n.values};e.packedInputs&&(n.isPacked=!0,n.shape=t.shape)}if(this.uploadToGPU(t.dataId),!!n.isPacked!=!!e.packedInputs)t=n.isPacked?this.unpackTensor(t):this.packTensor(t),p.push(t),n=this.texData.get(t.dataId);else if(n.isPacked&&!xG(n.shape,t.shape)){let e=t,r=t.shape;t.shape=n.shape,t=this.packedReshape(t,r),p.push(t),n=this.texData.get(t.dataId),e.shape=r}return{shape:t.shape,texData:n,isUniform:!1}});this.uploadToGPU(u.dataId);let f={shape:u.shape,texData:h,isUniform:!1},m=(o="",d.concat(f).forEach(t=>{let n=null!=t.texData&&null!=t.texData.slice&&t.texData.slice.flatOffset>0;if(e.enableShapeUniforms&&!t.isUniform){let r=t.texData.texShape,{useSqueezeShape:a,uniformShape:s,keptDims:i}=yl(e.packedInputs,t.shape,r),l="",u="",h="";if(1===s.length&&e.packedInputs){let e=[Math.ceil(r[0]/2),Math.ceil(r[1]/2)];l=`${e[0]>1}_${e[1]>1}`}else if(2!==s.length||e.packedInputs){if(s.length>2&&!e.packedInputs){let e=rR.util.computeStrides(s);h=`${e[0]===r[1]}_${e[e.length-1]===r[1]}`}}else u=`${s[0]>1}_${s[1]>1}`;let p=t.shape.length,d=2===s.length&&rR.util.arraysEqual(t.shape,r),c=1===rR.util.sizeFromShape(t.shape),m=tN.getBroadcastDims(t.shape,f.shape),g=!e.packedInputs&&p===f.shape.length&&rR.util.arraysEqual(r,f.texData.texShape),x=e.packedInputs||s.length>2?"":`${r[0]>1}_${r[1]>1}`;o+=`${p}_${g}_${a?i:""}_${s.length}_${c}_${m}_${d}_${l}_${u}_${h}_${x}_${n}`}else{let e=t.isUniform?"uniform":t.texData.texShape;o+=`${t.shape}_${e}_${n}`}}),l=e.userCode,e.constructor.name+("_"+o+"_"+l)+`${(0,rN.env)().getNumber("WEBGL_VERSION")}`),g=this.getAndSaveBinary(m,()=>{var t;let n,r,a,s,i,o;return t=this.gpgpu,r=(n=d.map((t,n)=>{let r={logicalShape:t.shape,texShape:t.isUniform?null:t.texData.texShape,isUniform:t.isUniform,isPacked:!t.isUniform&&t.texData.isPacked,flatOffset:null};return null!=t.texData&&null!=t.texData.slice&&t.texData.slice.flatOffset>0&&(r.flatOffset=t.texData.slice.flatOffset),{name:e.variableNames[n],shapeInfo:r}})).map(e=>e.shapeInfo),s=function(e,t,n){var r,a,s,i;let o,l,u=[];if(e.forEach(e=>{let t=rR.util.sizeFromShape(e.shapeInfo.logicalShape);if(e.shapeInfo.isUniform?u.push(`uniform float ${e.name}${t>1?`[${t}]`:""};`):(u.push(`uniform sampler2D ${e.name};`),u.push(`uniform int offset${e.name};`)),n.enableShapeUniforms){let{uniformShape:t}=yl(n.packedInputs,e.shapeInfo.logicalShape,e.shapeInfo.texShape);switch(t.length){case 1:u.push(`uniform int ${e.name}Shape;`);break;case 2:u.push(`uniform ivec2 ${e.name}Shape;`);break;case 3:u.push(`uniform ivec3 ${e.name}Shape;`);break;case 4:u.push(`uniform ivec4 ${e.name}Shape;`)}u.push(`uniform ivec2 ${e.name}TexShape;`)}}),n.enableShapeUniforms){switch(t.logicalShape.length){case 1:u.push("uniform int outShape;");break;case 2:u.push("uniform ivec2 outShape;"),u.push("uniform int outShapeStrides;");break;case 3:u.push("uniform ivec3 outShape;"),u.push("uniform ivec2 outShapeStrides;");break;case 4:u.push("uniform ivec4 outShape;"),u.push("uniform ivec3 outShapeStrides;")}u.push("uniform ivec2 outTexShape;")}n.customUniforms&&n.customUniforms.forEach(e=>{u.push(`uniform ${e.type} ${e.name}${e.arrayIndex?`[${e.arrayIndex}]`:""};`)});let h=u.join("\n"),p=e.map(e=>(function(e,t,n=!1,r){let a="";n?a+=function e(t,n){switch(t.shapeInfo.logicalShape.length){case 0:let r,a,s;return a="get"+(r=t.name).charAt(0).toUpperCase()+r.slice(1),s=x3(),`
    vec4 ${a}() {
      return ${s.texture2D}(${r}, halfCR);
    }
  `;case 1:return function(e,t){let n=e.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1),a=e.shapeInfo.texShape,s=x3();if(t)return`
    vec4 ${r}(int index) {
      ivec2 packedTexShape = ivec2(ceil(float(${n}TexShape[0]) / 2.0), ceil(float(${n}TexShape[1]) / 2.0));
      vec2 uv = packedUVfrom1D(
        packedTexShape[0], packedTexShape[1], index);
      return ${s.texture2D}(${n}, uv);
    }
  `;let i=[Math.ceil(a[0]/2),Math.ceil(a[1]/2)];return`
    vec4 ${r}(int index) {
      vec2 uv = packedUVfrom1D(
        ${i[0]}, ${i[1]}, index);
      return ${s.texture2D}(${n}, uv);
    }
  `}(t,n);case 2:return function(e,t){let n=e.shapeInfo.logicalShape,r=e.name,a="get"+r.charAt(0).toUpperCase()+r.slice(1),s=e.shapeInfo.texShape,i=s[0],o=s[1],l=x3();if(null!=s&&rR.util.arraysEqual(n,s))return t?`
      vec4 ${a}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${r}TexShape[1], ${r}TexShape[0]);

        return ${l.texture2D}(${r}, uv);
      }
    `:`
      vec4 ${a}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${o}.0, ${i}.0);

        return ${l.texture2D}(${r}, uv);
      }
    `;if(t)return`
    vec4 ${a}(int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${r}TexShape[0]) / 2.0), ceil(float(${r}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${r}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom2D(valuesPerRow, packedTexShape[0], packedTexShape[1], row, col);
      return ${l.texture2D}(${r}, uv);
    }
  `;let u=[Math.ceil(s[0]/2),Math.ceil(s[1]/2)],h=Math.ceil(n[1]/2);return`
    vec4 ${a}(int row, int col) {
      vec2 uv = packedUVfrom2D(${h}, ${u[0]}, ${u[1]}, row, col);
      return ${l.texture2D}(${r}, uv);
    }
  `}(t,n);case 3:return function(t,n){let r=t.shapeInfo.logicalShape,a=t.name,s="get"+a.charAt(0).toUpperCase()+a.slice(1),i=t.shapeInfo.texShape,o=[Math.ceil(i[0]/2),Math.ceil(i[1]/2)];if(1===r[0]){let a=yu(t,r.slice(1));return`
        ${e(a,n)}
        vec4 ${s}(int b, int row, int col) {
          return ${s}(${yh(["b","row","col"],[1,2])});
        }
      `}let l=x3();if(n)return`
    vec4 ${s}(int b, int row, int col) {
      ivec2 packedTexShape = ivec2(ceil(float(${a}TexShape[0]) / 2.0), ceil(float(${a}TexShape[1]) / 2.0));
      int valuesPerRow = int(ceil(float(${a}Shape[2]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${a}Shape[1]) / 2.0));
      vec2 uv = packedUVfrom3D(
        packedTexShape[0], packedTexShape[1], texelsInBatch, valuesPerRow, b, row, col);
      return ${l.texture2D}(${a}, uv);
    }
  `;let u=o[0],h=o[1],p=Math.ceil(r[2]/2),d=p*Math.ceil(r[1]/2);return`
    vec4 ${s}(int b, int row, int col) {
      vec2 uv = packedUVfrom3D(
        ${u}, ${h}, ${d}, ${p}, b, row, col);
      return ${l.texture2D}(${a}, uv);
    }
  `}(t,n);default:return function(e,t){let n=e.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1),a=x3();if(t)return`
    vec4 ${r}(int b2, int b, int row, int col) {
      int valuesPerRow = int(ceil(float(${n}Shape[3]) / 2.0));
      int texelsInBatch = valuesPerRow * int(ceil(float(${n}Shape[2]) / 2.0));
      int index = b * texelsInBatch + (row / 2) * valuesPerRow + (col / 2);
      texelsInBatch *= ${n}Shape[1];
      index = b2 * texelsInBatch + index;
      ivec2 packedTexShape = ivec2(ceil(float(${n}TexShape[0]) / 2.0), ceil(float(${n}TexShape[1]) / 2.0));
      int texR = index / packedTexShape[1];
      int texC = index - texR * packedTexShape[1];
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(packedTexShape[1], packedTexShape[0]); return ${a.texture2D}(${n}, uv);
    }
  `;let s=e.shapeInfo.logicalShape,i=s.length,o=e.shapeInfo.texShape,l=[Math.ceil(o[0]/2),Math.ceil(o[1]/2)],u=l[0],h=l[1],p=Math.ceil(s[i-1]/2),d=p*Math.ceil(s[i-2]/2),c="int b, int row, int col",f=`b * ${d} + (row / 2) * ${p} + (col / 2)`;for(let e=2;e<i-1;e++)c=`int b${e}, `+c,d*=s[i-e-1],f=`b${e} * ${d} + `+f;return`
    vec4 ${r}(${c}) {
      int index = ${f};
      int texR = index / ${h};
      int texC = index - texR * ${h};
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${h}, ${u});
      return ${a.texture2D}(${n}, uv);
    }
  `}(t,n)}}(e,r):a+=function e(t,n=!1){let r=t.shapeInfo.logicalShape;switch(r.length){case 0:return function(e,t){let n=e.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1);if(e.shapeInfo.isUniform)return`float ${r}() {return ${n};}`;let[a,s]=e.shapeInfo.texShape;if(1===a&&1===s)return`
      float ${r}() {
        return sampleTexture(${n}, halfCR);
      }
    `;let i=ys(n);if(t)return`
    float ${r}() {
      vec2 uv = uvFromFlat(${n}TexShape[0], ${n}TexShape[1], ${i});
      return sampleTexture(${n}, uv);
    }
  `;let[o,l]=e.shapeInfo.texShape;return`
    float ${r}() {
      vec2 uv = uvFromFlat(${o}, ${l}, ${i});
      return sampleTexture(${n}, uv);
    }
  `}(t,n);case 1:return function(e,t){let n=e.name,r="get"+n.charAt(0).toUpperCase()+n.slice(1);if(e.shapeInfo.isUniform)return`
      float ${r}(int index) {
        ${yi(e)}
      }
    `;let a=e.shapeInfo.texShape,s=a[0],i=a[1];if(1===i&&1===s)return`
      float ${r}(int index) {
        return sampleTexture(${n}, halfCR);
      }
    `;let o=ys(n);return 1===i?t?`
      float ${r}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${o}) + 0.5) / float(${n}TexShape[0]));
        return sampleTexture(${n}, uv);
      }
    `:`
      float ${r}(int index) {
        vec2 uv = vec2(0.5, (float(index + ${o}) + 0.5) / ${s}.0);
        return sampleTexture(${n}, uv);
      }
    `:1===s?t?`
      float ${r}(int index) {
        vec2 uv = vec2((float(index + ${o}) + 0.5) / float(${n}TexShape[1]), 0.5);
        return sampleTexture(${n}, uv);
      }
    `:`
      float ${r}(int index) {
        vec2 uv = vec2((float(index + ${o}) + 0.5) / ${i}.0, 0.5);
        return sampleTexture(${n}, uv);
      }
    `:t?`
    float ${r}(int index) {
      vec2 uv = uvFromFlat(${n}TexShape[0], ${n}TexShape[1], index + ${o});
      return sampleTexture(${n}, uv);
    }
  `:`
    float ${r}(int index) {
      vec2 uv = uvFromFlat(${s}, ${i}, index + ${o});
      return sampleTexture(${n}, uv);
    }
  `}(t,n);case 2:return function(t,n){let r=t.shapeInfo.logicalShape,a=t.name,s="get"+a.charAt(0).toUpperCase()+a.slice(1),i=t.shapeInfo.texShape;if(null!=i&&rR.util.arraysEqual(r,i)){if(n)return`
      float ${s}(int row, int col) {
        vec2 uv = (vec2(col, row) + halfCR) / vec2(${a}TexShape[1], ${a}TexShape[0]);
        return sampleTexture(${a}, uv);
      }
    `;let e=i[0],t=i[1];return`
    float ${s}(int row, int col) {
      vec2 uv = (vec2(col, row) + halfCR) / vec2(${t}.0, ${e}.0);
      return sampleTexture(${a}, uv);
    }
  `}let{newShape:o,keptDims:l}=rR.util.squeezeShape(r);if(o.length<r.length){let r=yu(t,o);return`
      ${e(r,n)}
      float ${s}(int row, int col) {
        return ${s}(${yh(["row","col"],l)});
      }
    `}if(t.shapeInfo.isUniform)return`
      float ${s}(int row, int col) {
        int index = round(dot(vec2(row, col), vec2(${r[1]}, 1)));
        ${yi(t)}
      }
    `;let u=i[0],h=i[1],p=ys(a);return 1===h?n?`
      float ${s}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${a}Shape[1], 1, 1));
        vec2 uv = vec2(0.5, (index + 0.5) / float(${a}TexShape[0]));
        return sampleTexture(${a}, uv);
      }
    `:`
    float ${s}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${r[1]}, 1, 1));
      vec2 uv = vec2(0.5, (index + 0.5) / ${u}.0);
      return sampleTexture(${a}, uv);
    }
  `:1===u?n?`
      float ${s}(int row, int col) {
        float index = dot(vec3(row, col, ${p}), vec3(${a}Shape[1], 1, 1));
        vec2 uv = vec2((index + 0.5) / float(${a}TexShape[1]), 0.5);
        return sampleTexture(${a}, uv);
      }
    `:`
    float ${s}(int row, int col) {
      float index = dot(vec3(row, col, ${p}), vec3(${r[1]}, 1, 1));
      vec2 uv = vec2((index + 0.5) / ${h}.0, 0.5);
      return sampleTexture(${a}, uv);
    }
  `:n?`
      float ${s}(int row, int col) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${a}Shape[1] + col + ${p};
        vec2 uv = uvFromFlat(${a}TexShape[0], ${a}TexShape[1], index);
        return sampleTexture(${a}, uv);
      }
    `:`
  float ${s}(int row, int col) {
    // Explicitly use integer operations as dot() only works on floats.
    int index = row * ${r[1]} + col + ${p};
    vec2 uv = uvFromFlat(${u}, ${h}, index);
    return sampleTexture(${a}, uv);
  }
`}(t,n);case 3:return function(t,n){let r=t.shapeInfo.logicalShape,a=t.name,s="get"+a.charAt(0).toUpperCase()+a.slice(1),i=r[1]*r[2],o=r[2],{newShape:l,keptDims:u}=rR.util.squeezeShape(r);if(l.length<r.length){let r=yu(t,l);return`
        ${e(r,n)}
        float ${s}(int row, int col, int depth) {
          return ${s}(${yh(["row","col","depth"],u)});
        }
      `}if(t.shapeInfo.isUniform)return`
      float ${s}(int row, int col, int depth) {
        int index = round(dot(vec3(row, col, depth),
                          vec3(${i}, ${o}, 1)));
        ${yi(t)}
      }
    `;let h=t.shapeInfo.texShape,p=h[0],d=h[1],c=t.shapeInfo.flatOffset;if(d===i&&null==c)return n?`
      float ${s}(int row, int col, int depth) {
        int stride1 = ${a}Shape[2];
        float texR = float(row);
        float texC = dot(vec2(col, depth), vec2(stride1, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${a}TexShape[1], ${a}TexShape[0]);
        return sampleTexture(${a}, uv);
      }
    `:`
        float ${s}(int row, int col, int depth) {
          float texR = float(row);
          float texC = dot(vec2(col, depth), vec2(${o}, 1));
          vec2 uv = (vec2(texC, texR) + halfCR) /
                     vec2(${d}.0, ${p}.0);
          return sampleTexture(${a}, uv);
        }
      `;if(d===o&&null==c)return n?`
      float ${s}(int row, int col, int depth) {
        float texR = dot(vec2(row, col), vec2(${a}Shape[1], 1));
        float texC = float(depth);
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${a}TexShape[1], ${a}TexShape[0]);
        return sampleTexture(${a}, uv);
      }
    `:`
    float ${s}(int row, int col, int depth) {
      float texR = dot(vec2(row, col), vec2(${r[1]}, 1));
      float texC = float(depth);
      vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${d}.0, ${p}.0);
      return sampleTexture(${a}, uv);
    }
  `;let f=ys(a);return n?`
    float ${s}(int row, int col, int depth) {
      // Explicitly use integer operations as dot() only works on floats.
      int stride0 = ${a}Shape[1] * ${a}Shape[2];
      int stride1 = ${a}Shape[2];
      int index = row * stride0 + col * stride1 + depth + ${f};
      vec2 uv = uvFromFlat(${a}TexShape[0], ${a}TexShape[1], index);
      return sampleTexture(${a}, uv);
    }
    `:`
      float ${s}(int row, int col, int depth) {
        // Explicitly use integer operations as dot() only works on floats.
        int index = row * ${i} + col * ${o} + depth + ${f};
        vec2 uv = uvFromFlat(${p}, ${d}, index);
        return sampleTexture(${a}, uv);
      }
  `}(t,n);case 4:return function(t,n){let r=t.shapeInfo.logicalShape,a=t.name,s="get"+a.charAt(0).toUpperCase()+a.slice(1),i=r[3],o=r[2]*i,l=r[1]*o,{newShape:u,keptDims:h}=rR.util.squeezeShape(r);if(u.length<r.length){let r=yu(t,u);return`
      ${e(r,n)}
      float ${s}(int row, int col, int depth, int depth2) {
        return ${s}(${yh(["row","col","depth","depth2"],h)});
      }
    `}if(t.shapeInfo.isUniform)return`
      float ${s}(int row, int col, int depth, int depth2) {
        int index = round(dot(vec4(row, col, depth, depth2),
                          vec4(${l}, ${o}, ${i}, 1)));
        ${yi(t)}
      }
    `;let p=t.shapeInfo.flatOffset,d=t.shapeInfo.texShape,c=d[0],f=d[1],m=`int stride2 = ${a}Shape[3];`,g=`int stride1 = ${a}Shape[2] * stride2;`,x=`int stride0 = ${a}Shape[1] * stride1;`;if(f===l&&null==p)return n?`
      float ${s}(int row, int col, int depth, int depth2) {
        ${m}
        ${g}
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(stride1, stride2, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${a}TexShape[1], ${a}TexShape[0]);
        return sampleTexture(${a}, uv);
      }
    `:`
      float ${s}(int row, int col, int depth, int depth2) {
        float texR = float(row);
        float texC =
            dot(vec3(col, depth, depth2),
                vec3(${o}, ${i}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${c}.0);
        return sampleTexture(${a}, uv);
      }
    `;if(f===i&&null==p)return n?`
      float ${s}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${a}Shape[1] * ${a}Shape[2], ${a}Shape[2], 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${a}TexShape[1], ${a}TexShape[0]);
        return sampleTexture(${a}, uv);
      }
    `:`
      float ${s}(int row, int col, int depth, int depth2) {
        float texR = dot(vec3(row, col, depth),
                         vec3(${r[1]*r[2]}, ${r[2]}, 1));
        float texC = float(depth2);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${c}.0);
        return sampleTexture(${a}, uv);
      }
    `;let y=ys(a);return n?`
    float ${s}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      ${m}
      ${g}
      ${x}
      int index = row * stride0 + col * stride1 +
          depth * stride2 + depth2;
      vec2 uv = uvFromFlat(${a}TexShape[0], ${a}TexShape[1], index + ${y});
      return sampleTexture(${a}, uv);
    }
  `:`
    float ${s}(int row, int col, int depth, int depth2) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${l} + col * ${o} +
          depth * ${i} + depth2;
      vec2 uv = uvFromFlat(${c}, ${f}, index + ${y});
      return sampleTexture(${a}, uv);
    }
  `}(t,n);case 5:return function(t){let n=t.shapeInfo.logicalShape,r=t.name,a="get"+r.charAt(0).toUpperCase()+r.slice(1),s=n[4],i=n[3]*s,o=n[2]*i,l=n[1]*o,{newShape:u,keptDims:h}=rR.util.squeezeShape(n);if(u.length<n.length){let n=yu(t,u);return`
      ${e(n)}
      float ${a}(int row, int col, int depth, int depth2, int depth3) {
        return ${a}(${yh(["row","col","depth","depth2","depth3"],h)});
      }
    `}if(t.shapeInfo.isUniform)return`
      float ${a}(int row, int col, int depth, int depth2, int depth3) {
        float index = dot(
          vec4(row, col, depth, depth2),
          vec4(${l}, ${o}, ${i}, ${s})) +
          depth3;
        ${yi(t)}
      }
    `;let p=t.shapeInfo.flatOffset,d=t.shapeInfo.texShape,c=d[0],f=d[1];if(f===l&&null==p)return`
      float ${a}(int row, int col, int depth, int depth2, int depth3) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
                         vec4(${o}, ${i}, ${s}, 1));
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${f}.0, ${c}.0);
        return sampleTexture(${r}, uv);
      }
    `;if(f===s&&null==p)return`
      float ${a}(int row, int col, int depth, int depth2, int depth3) {
        float texR = dot(
          vec4(row, col, depth, depth2),
          vec4(${n[1]*n[2]*n[3]},
               ${n[2]*n[3]}, ${n[3]}, 1));
        int texC = depth3;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${f}.0, ${c}.0);
        return sampleTexture(${r}, uv);
      }
    `;let m=ys(r);return`
    float ${a}(int row, int col, int depth, int depth2, int depth3) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${l} + col * ${o} + depth * ${i} +
          depth2 * ${s} + depth3 + ${m};
      vec2 uv = uvFromFlat(${c}, ${f}, index);
      return sampleTexture(${r}, uv);
    }
  `}(t);case 6:return function(t){let n=t.shapeInfo.logicalShape,r=t.name,a="get"+r.charAt(0).toUpperCase()+r.slice(1),{newShape:s,keptDims:i}=rR.util.squeezeShape(n);if(s.length<n.length){let n=yu(t,s);return`
      ${e(n)}
      float ${a}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        return ${a}(${yh(["row","col","depth","depth2","depth3","depth4"],i)});
      }
    `}let o=n[5],l=n[4]*o,u=n[3]*l,h=n[2]*u,p=n[1]*h;if(t.shapeInfo.isUniform)return`
      float ${a}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
        int index = round(dot(
          vec4(row, col, depth, depth2),
          vec4(${p}, ${h}, ${u}, ${l})) +
          dot(
            vec2(depth3, depth4),
            vec2(${o}, 1)));
        ${yi(t)}
      }
    `;let d=t.shapeInfo.flatOffset,c=t.shapeInfo.texShape,f=c[0],m=c[1];if(m===p&&null==d)return`
      float ${a}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        int texR = row;
        float texC = dot(vec4(col, depth, depth2, depth3),
          vec4(${h}, ${u}, ${l}, ${o})) +
               float(depth4);
        vec2 uv = (vec2(texC, texR) + halfCR) /
                   vec2(${m}.0, ${f}.0);
        return sampleTexture(${r}, uv);
      }
    `;if(m===o&&null==d)return`
      float ${a}(int row, int col, int depth,
                    int depth2, int depth3, int depth4) {
        float texR = dot(vec4(row, col, depth, depth2),
          vec4(${n[1]*n[2]*n[3]*n[4]},
               ${n[2]*n[3]*n[4]},
               ${n[3]*n[4]},
               ${n[4]})) + float(depth3);
        int texC = depth4;
        vec2 uv = (vec2(texC, texR) + halfCR) /
                  vec2(${m}.0, ${f}.0);
        return sampleTexture(${r}, uv);
      }
    `;let g=ys(r);return`
    float ${a}(int row, int col, int depth,
                  int depth2, int depth3, int depth4) {
      // Explicitly use integer operations as dot() only works on floats.
      int index = row * ${p} + col * ${h} + depth * ${u} +
          depth2 * ${l} + depth3 * ${o} + depth4 + ${g};
      vec2 uv = uvFromFlat(${f}, ${m}, index);
      return sampleTexture(${r}, uv);
    }
  `}(t);default:throw Error(`${r.length}-D input sampling is not yet supported`)}}(e,r);let s=e.shapeInfo.logicalShape,i=t.logicalShape;return s.length<=i.length&&(n?a+=function(e,t){let n,r=e.name,a=r.charAt(0).toUpperCase()+r.slice(1),s=e.shapeInfo.logicalShape.length,i=t.logicalShape.length,o=x7(e.shapeInfo.logicalShape,t.logicalShape),l=yo(i),u=i-s,h=["x","y","z","w","u","v"];n=0===s?"":i<2&&o.length>=1?"coords = 0;":o.map(e=>`coords.${h[e+u]} = 0;`).join("\n");let p="";p=i<2&&s>0?"coords":e.shapeInfo.logicalShape.map((e,t)=>`coords.${h[t+u]}`).join(", ");let d="return outputValue;",c=1===rR.util.sizeFromShape(e.shapeInfo.logicalShape),f=1===rR.util.sizeFromShape(t.logicalShape);if(1!==s||c||f){if(c&&!f)d=1===i?`
        return vec4(outputValue.x, outputValue.x, 0., 0.);
      `:`
        return vec4(outputValue.x);
      `;else if(o.length){let e=s-2,t=s-1;o.indexOf(e)>-1&&o.indexOf(t)>-1?d="return vec4(outputValue.x);":o.indexOf(e)>-1?d="return vec4(outputValue.x, outputValue.y, outputValue.x, outputValue.y);":o.indexOf(t)>-1&&(d="return vec4(outputValue.xx, outputValue.zz);")}}else d=`
      return vec4(outputValue.xy, outputValue.xy);
    `;return`
    vec4 ${"get"+a+"AtOutCoords"}() {
      ${l} coords = getOutputCoords();
      ${n}
      vec4 outputValue = get${a}(${p});
      ${d}
    }
  `}(e,t):a+=function(e,t){let n,r=e.name,a=r.charAt(0).toUpperCase()+r.slice(1),s="get"+a+"AtOutCoords",i=t.texShape,o=e.shapeInfo.texShape,l=e.shapeInfo.logicalShape.length,u=t.logicalShape.length;if(!e.shapeInfo.isUniform&&l===u&&null==e.shapeInfo.flatOffset&&rR.util.arraysEqual(o,i))return`
      float ${s}() {
        return sampleTexture(${r}, resultUV);
      }
    `;let h=yo(u),p=x7(e.shapeInfo.logicalShape,t.logicalShape),d=u-l,c=["x","y","z","w","u","v"];n=0===l?"":u<2&&p.length>=1?"coords = 0;":p.map(e=>`coords.${c[e+d]} = 0;`).join("\n");let f="";return f=u<2&&l>0?"coords":e.shapeInfo.logicalShape.map((e,t)=>`coords.${c[t+d]}`).join(", "),`
    float ${s}() {
      ${h} coords = getOutputCoords();
      ${n}
      return get${a}(${f});
    }
  `}(e,t)),a})(e,t,n.packedInputs,n.enableShapeUniforms)).join("\n"),d=t.texShape,c=x3(),f=(r=c,`
    float sampleTexture(sampler2D textureSampler, vec2 uv) {
      return ${r.texture2D}(textureSampler, uv).r;
    }
  `),m=(a=c,`${a.version}
    precision highp float;
    precision highp int;
    precision highp sampler2D;
    ${a.varyingFs} vec2 resultUV;
    ${a.defineOutput}
    const vec2 halfCR = vec2(0.5, 0.5);

    struct ivec5
    {
      int x;
      int y;
      int z;
      int w;
      int u;
    };

    struct ivec6
    {
      int x;
      int y;
      int z;
      int w;
      int u;
      int v;
    };

    uniform float NAN;
    ${a.defineSpecialNaN}
    ${a.defineSpecialInf}
    ${a.defineRound}

    int imod(int x, int y) {
      return x - y * (x / y);
    }

    int idiv(int a, int b, float sign) {
      int res = a / b;
      int mod = imod(a, b);
      if (sign < 0. && mod != 0) {
        res -= 1;
      }
      return res;
    }

    //Based on the work of Dave Hoskins
    //https://www.shadertoy.com/view/4djSRW
    #define HASHSCALE1 443.8975
    float random(float seed){
      vec2 p = resultUV * seed;
      vec3 p3  = fract(vec3(p.xyx) * HASHSCALE1);
      p3 += dot(p3, p3.yzx + 19.19);
      return fract((p3.x + p3.y) * p3.z);
    }

    ${ye}
    ${yt}
    ${yn}
  `);return t.isPacked?(o=function(e,t,n){switch(e.length){case 0:return ya();case 1:var r,a;let s;return r=t,a=n,1===(s=[Math.ceil(r[0]/2),Math.ceil(r[1]/2)])[0]?a?`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ceil(float(outTexShape[1]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.x * ${s[1]}.0);
      }
    `:1===s[1]?a?`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ceil(float(outTexShape[0]) / 2.0));
      }
    `:`
      int getOutputCoords() {
        return 2 * int(resultUV.y * ${s[0]}.0);
      }
    `:a?`
    int getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      return 2 * (resTexRC.x * packedTexShape[1] + resTexRC.y);
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${s[0]}, ${s[1]}));
      return 2 * (resTexRC.x * ${s[1]} + resTexRC.y);
    }
  `;case 2:var i=e,o=t,l=n;let u=[Math.ceil(o[0]/2),Math.ceil(o[1]/2)];if(rR.util.arraysEqual(i,o))return l?`
      ivec2 getOutputCoords() {
        ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
        return 2 * ivec2(resultUV.yx * vec2(packedTexShape[0], packedTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return 2 * ivec2(resultUV.yx * vec2(${u[0]}, ${u[1]}));
      }
    `;let h=Math.ceil(i[1]/2);return l?`
    ivec2 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));

      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;
      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${u[0]}, ${u[1]}));

      int index = resTexRC.x * ${u[1]} + resTexRC.y;
      int r = 2 * (index / ${h});
      int c = imod(index, ${h}) * 2;

      return ivec2(r, c);
    }
  `;case 3:var p=e,d=t,c=n;if(c)return`
    ivec3 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      int texelsInLogicalRow = int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec3(b, r, c);
    }
  `;let f=[Math.ceil(d[0]/2),Math.ceil(d[1]/2)],m=Math.ceil(p[2]/2),g=m*Math.ceil(p[1]/2);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${f[0]}, ${f[1]}));
      int index = resTexRC.x * ${f[1]} + resTexRC.y;

      int b = index / ${g};
      index -= b * ${g};

      int r = 2 * (index / ${m});
      int c = imod(index, ${m}) * 2;

      return ivec3(b, r, c);
    }
  `;default:return function(e,t,n){if(n)return`
    ivec4 getOutputCoords() {
      ivec2 packedTexShape = ivec2(ceil(float(outTexShape[0]) / 2.0), ceil(float(outTexShape[1]) / 2.0));
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(packedTexShape[0], packedTexShape[1]));
      int index = resTexRC.x * packedTexShape[1] + resTexRC.y;

      int texelsInLogicalRow = int(ceil(float(outShape[3]) / 2.0));
      int texelsInBatch = texelsInLogicalRow * int(ceil(float(outShape[2]) / 2.0));
      int texelsInBatchN = texelsInBatch * outShape[1];

      int b2 = index / texelsInBatchN;
      index -= b2 * texelsInBatchN;

      int b = index / texelsInBatch;
      index -= b * texelsInBatch;

      int r = 2 * (index / texelsInLogicalRow);
      int c = imod(index, texelsInLogicalRow) * 2;

      return ivec4(b2, b, r, c);
    }
  `;let r=[Math.ceil(t[0]/2),Math.ceil(t[1]/2)],a=Math.ceil(e[e.length-1]/2),s=a*Math.ceil(e[e.length-2]/2),i=s,o="",l="b, r, c";for(let t=2;t<e.length-1;t++)i*=e[e.length-t-1],o=`
      int b${t} = index / ${i};
      index -= b${t} * ${i};
    `+o,l=`b${t}, `+l;return`
    ivec${e.length} getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      int index = resTexRC.x * ${r[1]} + resTexRC.y;

      ${o}

      int b = index / ${s};
      index -= b * ${s};

      int r = 2 * (index / ${a});
      int c = imod(index, ${a}) * 2;

      return ivec${e.length}(${l});
    }
  `}(e,t,n)}}(t.logicalShape,d,n.enableShapeUniforms),s=c,l=`
    void setOutput(vec4 val) {
      ${s.output} = val;
    }
  `):(o=function(e,t,n){switch(e.length){case 0:return ya();case 1:return r=t,a=n,1===r[0]?a?`
      int getOutputCoords() {
        return int(resultUV.x * float(outTexShape[1]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.x * ${r[1]}.0);
      }
    `:1===r[1]?a?`
      int getOutputCoords() {
        return int(resultUV.y * float(outTexShape[0]));
      }
    `:`
      int getOutputCoords() {
        return int(resultUV.y * ${r[0]}.0);
      }
    `:a?`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      return resTexRC.x * outTexShape[1] + resTexRC.y;
    }
  `:`
    int getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${r[0]}, ${r[1]}));
      return resTexRC.x * ${r[1]} + resTexRC.y;
    }
  `;case 2:return s=e,i=t,o=n,rR.util.arraysEqual(s,i)?o?`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(outTexShape[0], outTexShape[1]));
      }
    `:`
      ivec2 getOutputCoords() {
        return ivec2(resultUV.yx * vec2(${i[0]}, ${i[1]}));
      }
    `:1===s[1]?o?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(index, 0);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${i[0]}, ${i[1]}));
        int index = resTexRC.x * ${i[1]} + resTexRC.y;
        return ivec2(index, 0);
      }
    `:1===s[0]?o?`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(outTexShape[0], outTexShape[1]));
        int index = resTexRC.x * outTexShape[1] + resTexRC.y;
        return ivec2(0, index);
      }
    `:`
      ivec2 getOutputCoords() {
        ivec2 resTexRC = ivec2(resultUV.yx *
                               vec2(${i[0]}, ${i[1]}));
        int index = resTexRC.x * ${i[1]} + resTexRC.y;
        return ivec2(0, index);
      }
    `:o?`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      int r = index / outShape[1];
      int c = index - r * outShape[1];
      return ivec2(r, c);
    }
  `:`
    ivec2 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${i[0]}, ${i[1]}));
      int index = resTexRC.x * ${i[1]} + resTexRC.y;
      int r = index / ${s[1]};
      int c = index - r * ${s[1]};
      return ivec2(r, c);
    }
  `;case 3:var r,a,s,i,o,l,u,h,p,d=e,c=t,f=n;if(f){let e=x5(["r","c","d"],d);return`
  ivec3 getOutputCoords() {
    ivec2 resTexRC = ivec2(resultUV.yx *
                           vec2(outTexShape[0], outTexShape[1]));
    int index = resTexRC.x * outTexShape[1] + resTexRC.y;
    ${e}
    return ivec3(r, c, d);
  }
`}let m=x4(["r","c","d"],d);return`
    ivec3 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
                             vec2(${c[0]}, ${c[1]}));
      int index = resTexRC.x * ${c[1]} + resTexRC.y;
      ${m}
      return ivec3(r, c, d);
    }
  `;case 4:var g=e,x=t,y=n;if(y){let e=x5(["r","c","d","d2"],g);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(outTexShape[0], outTexShape[1]));
      int index = resTexRC.x * outTexShape[1] + resTexRC.y;
      ${e}
      return ivec4(r, c, d, d2);
    }
  `}let b=x4(["r","c","d","d2"],g);return`
    ivec4 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${x[0]}, ${x[1]}));
      int index = resTexRC.x * ${x[1]} + resTexRC.y;
      ${b}
      return ivec4(r, c, d, d2);
    }
  `;case 5:let v;return l=e,u=t,v=x4(["r","c","d","d2","d3"],l),`
    ivec5 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx * vec2(${u[0]},
                             ${u[1]}));

      int index = resTexRC.x * ${u[1]} + resTexRC.y;

      ${v}

      ivec5 outShape = ivec5(r, c, d, d2, d3);
      return outShape;
    }
  `;case 6:let w;return h=e,p=t,w=x4(["r","c","d","d2","d3","d4"],h),`
    ivec6 getOutputCoords() {
      ivec2 resTexRC = ivec2(resultUV.yx *
        vec2(${p[0]}, ${p[1]}));
      int index = resTexRC.x * ${p[1]} + resTexRC.y;

      ${w}

      ivec6 result = ivec6(r, c, d, d2, d3, d4);
      return result;
    }
  `;default:throw Error(`${e.length}-D output sampling is not yet supported`)}}(t.logicalShape,d,n.enableShapeUniforms),i=c,l=`
    void setOutput(float val) {
      ${i.output} = vec4(val, 0, 0, 0);
    }
  `),n.packedInputs&&(m+=yr),[m,f,l,h,o,p,n.userCode].join("\n")}(n,a={logicalShape:f.shape,texShape:f.texData.texShape,isUniform:!1,isPacked:f.texData.isPacked,flatOffset:null},e),i=xc(t.gl,s),o=t.createProgram(i),(0,rN.env)().get("ENGINE_COMPILE_ONLY")?{program:e,fragmentShader:i,source:s,webGLProgram:o,inShapeInfos:r,outShapeInfo:a,variablesLocations:null,customUniformLocations:null,infLoc:null,nanLoc:null,outShapeLocation:null,outShapeStridesLocation:null,outTexShapeLocation:null}:(t.buildVao(o),Object.assign({program:e,fragmentShader:i,source:s,webGLProgram:o,inShapeInfos:r,outShapeInfo:a},yp(t,e,o)))}),x=null!=this.activeTimers;x&&(i=this.startTimer()),(0,rN.env)().get("ENGINE_COMPILE_ONLY")||function(e,t,n,r,a){t.program.enableShapeUniforms||(yd(t.inShapeInfos,n),yd([t.outShapeInfo],[r]));let s=r.texData.texture,i=r.texData.texShape;r.texData.isPacked?e.setOutputPackedMatrixTexture(s.texture,i[0],i[1]):e.setOutputMatrixTexture(s.texture,i[0],i[1]),e.setProgram(t.webGLProgram),e.bindVertexArray(t.webGLProgram.vao),1===(0,rN.env)().getNumber("WEBGL_VERSION")&&null!==t.infLoc&&e.gl.uniform1f(t.infLoc,1/0),null!==t.nanLoc&&e.gl.uniform1f(t.nanLoc,NaN);for(let r=0;r<n.length;++r){let a=n[r],{uniform:s,offset:i,shape:o,texShape:l}=t.variablesLocations[r];if(o){let{uniformShape:n}=yl(t.program.packedInputs,a.shape,a.texData.texShape);switch(n.length){case 1:e.gl.uniform1iv(o,new Int32Array(n));break;case 2:e.gl.uniform2iv(o,new Int32Array(n));break;case 3:e.gl.uniform3iv(o,new Int32Array(n));break;case 4:e.gl.uniform4iv(o,new Int32Array(n))}}if(l&&e.gl.uniform2i(l,a.texData.texShape[0],a.texData.texShape[1]),null!=s){if(a.isUniform){if(2>rR.util.sizeFromShape(a.shape))e.gl.uniform1f(s,a.uniformValues[0]);else{let t=a.uniformValues;t instanceof Float32Array||(t=new Float32Array(t)),e.gl.uniform1fv(s,t)}continue}null!=a.texData.slice&&null!=i&&e.gl.uniform1i(i,a.texData.slice.flatOffset),e.setInputMatrixTexture(a.texData.texture.texture,s,r)}}let o=t.outShapeLocation;if(o)switch(r.shape.length){case 1:e.gl.uniform1iv(o,new Int32Array(r.shape));break;case 2:e.gl.uniform2iv(o,new Int32Array(r.shape));break;case 3:e.gl.uniform3iv(o,new Int32Array(r.shape));break;case 4:e.gl.uniform4iv(o,new Int32Array(r.shape))}if(t.outShapeStridesLocation){let n=rR.util.computeStrides(r.shape);switch(r.shape.length){case 2:e.gl.uniform1iv(t.outShapeStridesLocation,new Int32Array(n));break;case 3:e.gl.uniform2iv(t.outShapeStridesLocation,new Int32Array(n));break;case 4:e.gl.uniform3iv(t.outShapeStridesLocation,new Int32Array(n))}}if(t.outTexShapeLocation&&e.gl.uniform2i(t.outTexShapeLocation,r.texData.texShape[0],r.texData.texShape[1]),t.program.customUniforms&&a)for(let n=0;n<t.program.customUniforms.length;++n){let r=t.program.customUniforms[n],s=t.customUniformLocations[n],i=a[n];if("float"===r.type)e.gl.uniform1fv(s,i);else if("vec2"===r.type)e.gl.uniform2fv(s,i);else if("vec3"===r.type)e.gl.uniform3fv(s,i);else if("vec4"===r.type)e.gl.uniform4fv(s,i);else if("int"===r.type)e.gl.uniform1iv(s,i);else if("ivec2"===r.type)e.gl.uniform2iv(s,i);else if("ivec3"===r.type)e.gl.uniform3iv(s,i);else if("ivec4"===r.type)e.gl.uniform4iv(s,i);else throw Error(`uniform type ${r.type} is not supported yet.`)}e.executeProgram()}(this.gpgpu,g,d,f,r),p.forEach(e=>this.disposeIntermediateTensorInfo(e)),x&&(i=this.endTimer(i),this.activeTimers.push({name:e.constructor.name,query:this.getQueryTime(i)}));let y=(0,rN.env)().getNumber("WEBGL_FLUSH_THRESHOLD");if(y>0){let e=rR.util.now();e-this.lastGlFlushTime>y&&(this.gpgpu.gl.flush(),this.lastGlFlushTime=e)}if(!(0,rN.env)().getBool("WEBGL_LAZILY_UNPACK")&&h.isPacked&&!1===a){let e=this.unpackTensor(u);return this.disposeIntermediateTensorInfo(u),e}return u}compileAndRun(e,t,n,r,a=!1){return n=n||t[0].dtype,this.runWebGLProgram(e,t,n,r,a)}getAndSaveBinary(e,t){return e in this.binaryCache||(this.binaryCache[e]=t()),this.binaryCache[e]}getTextureManager(){return this.textureManager}dispose(){this.disposed||((0,rN.env)().getBool("IS_TEST")||Object.keys(this.binaryCache).forEach(e=>{this.gpgpu.deleteProgram(this.binaryCache[e].webGLProgram),delete this.binaryCache[e]}),this.textureManager.dispose(),null!=this.canvas&&"undefined"!=typeof HTMLCanvasElement&&this.canvas instanceof HTMLCanvasElement?this.canvas.remove():this.canvas=null,this.gpgpuCreatedLocally&&(this.gpgpu.program=null,this.gpgpu.dispose()),this.disposed=!0)}floatPrecision(){return null==this.floatPrecisionValue&&(this.floatPrecisionValue=(0,r$.tidy)(()=>{if(!(0,rN.env)().get("WEBGL_RENDER_FLOAT32_ENABLED")){let e=(0,rN.env)().getBool("DEBUG");(0,rN.env)().set("DEBUG",!1);let t=this.abs((0,k.scalar)(1e-8)).dataSync()[0];if((0,rN.env)().set("DEBUG",e),t>0)return 32}return 16})),this.floatPrecisionValue}epsilon(){return 32===this.floatPrecision()?1e-7:1e-4}uploadToGPU(e){let t,n=this.texData.get(e),{shape:r,dtype:a,values:s,texture:i,usage:o,isPacked:l}=n;if(null!=i)return;let u=null!=this.activeTimers;u&&(t=rR.util.now());let h=n.texShape;if(null==h&&(n.texShape=h=xW(r,l)),null!=s){let e,i=xB(r),o=h[1],p=h[0],d=s instanceof Uint8Array||s instanceof Uint8ClampedArray;(l||!d)&&([o,p]=xi(h[0],h[1])),e=l?new yv(i,d):new yb(i,d);let c=d?[p,o]:h,m=this.makeTensorInfo(c,a),g=this.texData.get(m.dataId);d?g.usage=f.PIXELS:g.usage=f.UPLOAD,g.texShape=c,this.gpgpu.uploadDenseMatrixToTexture(this.getTexture(m.dataId),o,p,s);let x=[[p,o]],y=this.runWebGLProgram(e,[m],a,x,!0),b=this.texData.get(y.dataId);n.texShape=b.texShape,n.isPacked=b.isPacked,n.usage=b.usage,(0,rN.env)().get("ENGINE_COMPILE_ONLY")?this.disposeData(y.dataId):(n.texture=b.texture,n.values=null,this.texData.delete(y.dataId)),this.disposeIntermediateTensorInfo(m),u&&(this.uploadWaitMs+=rR.util.now()-t)}else n.texture=this.acquireTexture(h,o,a,l)}convertAndCacheOnCPU(e,t){let n=this.texData.get(e),{dtype:r}=n;return null!=t&&(n.values=function(e,t){if("float32"===t||"complex64"===t)return e;if("int32"===t||"bool"===t){let n="int32"===t?new Int32Array(e.length):new Uint8Array(e.length);for(let t=0;t<n.length;++t)n[t]=Math.round(e[t]);return n}throw Error(`Unknown dtype ${t}`)}(t,r)),n.values}acquireTexture(e,t,n,r){if(this.numBytesInGPU+=this.computeBytes(e,n),!this.warnedAboutMemory&&this.numBytesInGPU>1024*this.numMBBeforeWarning*1024){let e=(this.numBytesInGPU/1024/1024).toFixed(2);this.warnedAboutMemory=!0,console.warn(`High memory usage in GPU: ${e} MB, most likely due to a memory leak`)}return this.textureManager.acquireTexture(e,t,r)}computeBytes(e,t){return e[0]*e[1]*rR.util.bytesPerElement(t)}checkCompileCompletion(){for(let[,e]of Object.entries(this.binaryCache))this.checkCompletion_(e)}async checkCompileCompletionAsync(){let e=[];if(this.gpgpu.parallelCompilationExtension){for(let[,t]of Object.entries(this.binaryCache))e.push(this.checkCompletionAsync_(t));return Promise.all(e)}for(let[,t]of Object.entries(this.binaryCache)){let n=new Promise(e=>{try{this.checkCompletion_(t),e(!0)}catch(e){throw e}});e.push(n)}return Promise.all(e)}async checkCompletionAsync_(e){return this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.parallelCompilationExtension.COMPLETION_STATUS_KHR)?this.checkCompletion_(e):(await (0,s1.nextFrame)(),this.checkCompletionAsync_(e))}checkCompletion_(e){if(!1===this.gpgpu.gl.getProgramParameter(e.webGLProgram,this.gpgpu.gl.LINK_STATUS)){if(console.log(this.gpgpu.gl.getProgramInfoLog(e.webGLProgram)),!1===this.gpgpu.gl.getShaderParameter(e.fragmentShader,this.gpgpu.gl.COMPILE_STATUS))throw xm(e.source,this.gpgpu.gl.getShaderInfoLog(e.fragmentShader)),Error("Failed to compile fragment shader.");throw Error("Failed to link vertex and fragment shaders.")}return!0}getUniformLocations(){for(let e of Object.values(this.binaryCache)){this.gpgpu.buildVao(e.webGLProgram);let{variablesLocations:t,customUniformLocations:n,infLoc:r,nanLoc:a,outShapeLocation:s,outShapeStridesLocation:i,outTexShapeLocation:o}=yp(this.gpgpu,e.program,e.webGLProgram);e.variablesLocations=t,e.customUniformLocations=n,e.infLoc=r,e.nanLoc=a,e.outShapeLocation=s,e.outShapeStridesLocation=i,e.outTexShapeLocation=o}}createTensorFromGPUData(e,t,n){e.channels=e.channels||"RGBA";let{texture:r,height:a,width:s,channels:i}=e,o=(0,r$.engine)().backend;if(!o.gpgpu.gl.isTexture(r))throw Error("The texture is invalid. Also, please make sure the texture and the TFJS WebGL backend are using the same canvas. If you want to use your own custom canvas, you have to create and use the custom TFJS WebGL backend created from the canvas through 'new tf.MathBackendWebGL(customCanvas)'.");let l=o.writeTexture(r,t,n,a,s,i);return(0,r$.engine)().makeTensorFromDataId(l,t,n,o)}}bZ.nextDataId=0;var bJ=e.i(198600),bQ=e.i(856479);function b0(){(0,rN.env)().set("WEBGL_FORCE_F16_TEXTURES",!0)}e.s(["forceHalfFloat",()=>b0],379312),xe.isBrowser()&&(0,r$.registerBackend)("webgl",()=>new bZ,2);let b1={forceHalfFloat:b0};e.s(["webgl",0,b1],874507);var c5=A,tN=tN,tN=tN;let b2=`
  if (isnan(a)) return a;
  if (isnan(b)) return b;
`;class b3{constructor(e,t,n){this.variableNames=["A","B"],this.outputShape=tN.assertAndGetBroadcastShape(t,n),this.enableShapeUniforms=yc(this.outputShape.length),this.userCode=`
      float binaryOperation(float a, float b) {
        ${e}
      }

      void main() {
        float a = getAAtOutCoords();
        float b = getBAtOutCoords();
        setOutput(binaryOperation(a, b));
      }
    `}}var tN=tN;let b4=`
  result.r = isNaN.r ? NAN : result.r;
  result.g = isNaN.g ? NAN : result.g;
  result.b = isNaN.b ? NAN : result.b;
  result.a = isNaN.a ? NAN : result.a;
`;class b5{constructor(e,t,n,r=!1){this.variableNames=["A","B"],this.supportsBroadcasting=!0,this.packedInputs=!0,this.packedOutput=!0,this.outputShape=tN.assertAndGetBroadcastShape(t,n);const a=this.outputShape.length;this.enableShapeUniforms=yc(a);let s="";if(r)if(0===a||1===rR.util.sizeFromShape(this.outputShape))s=`
          result.y = 0.;
          result.z = 0.;
          result.w = 0.;
        `;else{const e=yo(a);if(s=`
          ${e} coords = getOutputCoords();
        `,1===a)this.enableShapeUniforms?s+=`
            result.y = (coords + 1) >= outShape ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `:s+=`
            result.y = (coords + 1) >= ${this.outputShape[0]} ? 0. : result.y;
            result.z = 0.;
            result.w = 0.;
          `;else{const e=bA("coords",a);this.enableShapeUniforms?s+=`
            bool nextRowOutOfBounds =
              (${e[a-2]} + 1) >= outShape[${a} - 2];
            bool nextColOutOfBounds =
              (${e[a-1]} + 1) >= outShape[${a} - 1];
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `:s+=`
            bool nextRowOutOfBounds =
              (${e[a-2]} + 1) >= ${this.outputShape[a-2]};
            bool nextColOutOfBounds =
              (${e[a-1]} + 1) >= ${this.outputShape[a-1]};
            result.y = nextColOutOfBounds ? 0. : result.y;
            result.z = nextRowOutOfBounds ? 0. : result.z;
            result.w = nextColOutOfBounds || nextRowOutOfBounds ? 0. : result.w;
          `}}this.userCode=`
      vec4 binaryOperation(vec4 a, vec4 b) {
        ${e}
      }

      void main() {
        vec4 a = getAAtOutCoords();
        vec4 b = getBAtOutCoords();

        vec4 result = binaryOperation(a, b);
        ${s}

        setOutput(result);
      }
    `}}function b6(e){let{inputs:t,backend:n}=e,{x:r}=t;return n.incRef(r.dataId),{dataId:r.dataId,shape:r.shape,dtype:r.dtype}}let b8={kernelName:x.Identity,backendName:"webgl",kernelFunc:b6};function b9(e){let{inputs:t,backend:n}=e,{real:r,imag:a}=t,s=n.makeTensorInfo(r.shape,"complex64");return n.texData.get(s.dataId).complexTensorInfos={real:b6({inputs:{x:r},backend:n}),imag:b6({inputs:{x:a},backend:n})},s}let b7={kernelName:x.Complex,backendName:"webgl",kernelFunc:b9},ve="return (a < 0.) ? b * a : a;",vt=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`,vn={kernelName:x.LeakyRelu,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{alpha:s}=r,i=n.makeTensorInfo([],"float32",rR.util.createScalarValue(s,"float32")),o=(0,rN.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new b5(vt,a.shape,i.shape):new b3(ve,a.shape,i.shape),l=n.runWebGLProgram(o,[a,i],"float32");return n.disposeIntermediateTensorInfo(i),l}},vr="return (a < 0.) ? b * a : a;",va=`
  vec4 aLessThanZero = vec4(lessThan(a, vec4(0.)));
  return (aLessThanZero * (b * a)) + ((vec4(1.0) - aLessThanZero) * a);
`,vs={kernelName:x.Prelu,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{x:r,alpha:a}=t,s=(0,rN.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new b5(va,r.shape,a.shape):new b3(vr,r.shape,a.shape);return n.runWebGLProgram(s,[r,a],"float32")}},vi="if (isnan(x)) return x;";function vo({opSnippet:e,packedOpSnippet:t,cpuKernelImpl:n,dtype:r}){return({inputs:a,backend:s})=>{let i,{x:o}=a,l=r||o.dtype;if(s.shouldExecuteOnCPU([o])&&null!=n){let e=n(s.texData.get(o.dataId).values,l);return s.makeTensorInfo(o.shape,l,e)}return i=(0,rN.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS")&&null!=t?new bq(o.shape,t):new b_(o.shape,e),s.runWebGLProgram(i,[o],l)}}function vl({opSnippet:e,packedOpSnippet:t,checkOutOfBounds:n=!1,supportsComplex:r=!1,cpuKernelImpl:a,dtype:s}){return({inputs:i,backend:o})=>{let l,{a:u,b:h}=i;if(r&&"complex64"===u.dtype){let t=o.texData.get(u.dataId),n=o.texData.get(h.dataId),[r,a]=[[t.complexTensorInfos.real,n.complexTensorInfos.real],[t.complexTensorInfos.imag,n.complexTensorInfos.imag]].map(t=>{let[n,r]=t,a={dataId:n.dataId,dtype:n.dtype,shape:u.shape},s={dataId:r.dataId,dtype:r.dtype,shape:h.shape},i=new b3(e,u.shape,h.shape);return o.runWebGLProgram(i,[a,s],(0,d5.upcastType)(n.dtype,r.dtype))}),s=b9({inputs:{real:r,imag:a},backend:o});return o.disposeIntermediateTensorInfo(r),o.disposeIntermediateTensorInfo(a),s}let p=s||(0,d5.upcastType)(u.dtype,h.dtype);if(("string"===u.dtype||"string"===h.dtype||o.shouldExecuteOnCPU([u,h]))&&null!=a){let e=o.texData.get(u.dataId).values,t=o.texData.get(h.dataId).values,n="string"===u.dtype?tN.fromUint8ToStringArray(e):e,r="string"===u.dtype?tN.fromUint8ToStringArray(t):t,[s,i]=a(u.shape,h.shape,n,r,p),l=o.makeTensorInfo(i,p);return o.texData.get(l.dataId).values=s,l}return l=(0,rN.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")&&null!=t?new b5(t,u.shape,h.shape,n):new b3(e,u.shape,h.shape),o.runWebGLProgram(l,[u,h],p)}}function vu(e,t=!1){if("linear"===e)return"return x;";if("relu"===e)return t?bV:bB;if("elu"===e)return t?bU:"return (x >= 0.0) ? x : (exp(x) - 1.0);";if("relu6"===e)return t?bH:bW;if("prelu"===e)return t?va:vr;else if("leakyrelu"===e)return t?vt:ve;else if("sigmoid"===e)return"return 1.0 / (1.0 + exp(-1.0 * x));";throw Error(`Activation ${e} has not been implemented for the WebGL backend.`)}class vh{constructor(e,t,n,r=!1,a=!1,s=!1,i=null,o=!1,l=!1){this.variableNames=["matrixA","matrixB"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=n,this.enableShapeUniforms=yc(this.outputShape.length);const u=Math.ceil((r?e[1]:e[2])/2),h=r?["a.xxyy","a.zzww"]:["a.xxzz","a.yyww"],p=a?["b.xzxz","b.ywyw"]:["b.xyxy","b.zwzw"];let d="",c="";i&&(d=o?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${i}
        }`:l?`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${i}
        }`:`vec4 activation(vec4 x) {
          ${i}
        }`,c="result = activation(result);"),s&&this.variableNames.push("bias"),o&&this.variableNames.push("preluActivationWeights"),l&&this.variableNames.push("leakyreluAlpha");let f="rc.x",m="rc.x";e[0]<t[0]?f=`imod(rc.x, ${e[0]})`:t[0]<e[0]&&(m=`imod(rc.x, ${t[0]})`),this.userCode=`
      ${d}
      // Don't use uniform for sharedDimensionPacked for performance.
      const float sharedDimension = ${u}.0;

      vec4 dot2x2ARowBCol(ivec3 rc) {
        vec4 result = vec4(0);
        int batchA = ${f};
        int batchB = ${m};
        for (int i = 0; i < ${u}; i++) {
          vec4 a = getMatrixA(batchA, ${r?"i * 2, rc.y":"rc.y, i * 2"});
          vec4 b = getMatrixB(batchB, ${a?"rc.z, i * 2":"i * 2, rc.z"});

          // These swizzled products need to be separately added.
          // See: https://github.com/tensorflow/tfjs/issues/1735
          result += (${h[0]} * ${p[0]});
          result += (${h[1]} * ${p[1]});
        }
        return result;
      }

      void main() {
        ivec3 rc = getOutputCoords();
        vec4 result = dot2x2ARowBCol(rc);

        ${s?"result += getBiasAtOutCoords();":""}

        ${c}

        setOutput(result);
      }
    `}}var tN=tN,tN=tN;class vp{constructor(e,t,n){this.variableNames=["AReal","AImag","BReal","BImag"],this.outputShape=tN.assertAndGetBroadcastShape(t,n),this.userCode=`
      float binaryOpComplex(
          float areal, float aimag, float breal, float bimag) {
        ${e}
      }

      void main() {
        float areal = getARealAtOutCoords();
        float aimag = getAImagAtOutCoords();
        float breal = getBRealAtOutCoords();
        float bimag = getBImagAtOutCoords();
        setOutput(binaryOpComplex(areal, aimag, breal, bimag));
      }
    `}}let vd="return a * b;";function vc(e){let t,{inputs:n,backend:r}=e,{a,b:s}=n,i=tN.upcastType(a.dtype,s.dtype);if("complex64"===a.dtype){let e=r.texData.get(a.dataId),t=r.texData.get(s.dataId),n=new vp("return areal * breal - aimag * bimag;",a.shape,s.shape),i=new vp("return areal * bimag + aimag * breal;",a.shape,s.shape),o=[{dataId:e.complexTensorInfos.real.dataId,dtype:e.complexTensorInfos.real.dtype,shape:a.shape},{dataId:e.complexTensorInfos.imag.dataId,dtype:e.complexTensorInfos.imag.dtype,shape:a.shape},{dataId:t.complexTensorInfos.real.dataId,dtype:t.complexTensorInfos.real.dtype,shape:s.shape},{dataId:t.complexTensorInfos.imag.dataId,dtype:t.complexTensorInfos.imag.dtype,shape:s.shape}],l=r.runWebGLProgram(n,o,"float32"),u=r.runWebGLProgram(i,o,"float32"),h=b9({inputs:{real:l,imag:u},backend:r});return r.disposeIntermediateTensorInfo(l),r.disposeIntermediateTensorInfo(u),h}if(r.shouldExecuteOnCPU([a,s])){let e=r.texData.get(a.dataId),t=r.texData.get(s.dataId),[n,o]=bn(a.shape,s.shape,e.values,t.values,i),l=r.makeTensorInfo(o,i);return r.texData.get(l.dataId).values=n,l}return t=(0,rN.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new b5(vd,a.shape,s.shape):new b3(vd,a.shape,s.shape),r.runWebGLProgram(t,[a,s],i)}let vf={kernelName:x.Multiply,backendName:"webgl",kernelFunc:vc};function vm(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{shape:s}=r,i=rR.util.sizeFromShape(a.shape),o=rR.util.inferFromImplicitShape(s,i),l=rR.util.sizeFromShape(o);rR.util.assert(i===l,()=>`The new shape (${o}) has ${l} elements and the old shape (${a.shape}) has ${i} elements. The new shape and old shape must have the same number of elements.`);let u=n.texData.get(a.dataId);if(u.isPacked&&!xG(a.shape,o)&&!(null!==u.texture&&xG(u.shape,o))){let e,t,r,s,i;return e=[xM(a.shape),...xP(a.shape)],t={dtype:a.dtype,shape:e,dataId:a.dataId},r=new bF([xM(o),...xP(o)],e),s=[e],{dataId:(i=n.runWebGLProgram(r,[t],a.dtype,s,!0)).dataId,shape:o,dtype:i.dtype}}return n.incRef(a.dataId),{dataId:a.dataId,shape:o,dtype:a.dtype}}let vg={kernelName:x.Reshape,backendName:"webgl",kernelFunc:vm};var tN=tN,tN=tN;class vx{constructor(e,t){this.variableNames=["x"];const{windowSize:n,batchSize:r,inSize:a,outSize:s}=e;this.outputShape=[r,s];const i=4*Math.floor(n/4),o=n%4;let l="sumValue += dot(values, ones);";if(null!=t){const e=1/t;l=`sumValue += dot(values * ${rR.util.isInt(e)?e.toPrecision(2):e}, ones);`}let u="";a%n>0&&(u=`
        if (inIdx < 0 || inIdx >= ${a}) {
          return 0.0;
        }
      `),this.userCode=`
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${u}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${n};

        float sumValue = 0.0;

        for (int i = 0; i < ${i}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${l}
        }

        int inIdx = inOffset + ${i};
        if (${1===o}) {
          vec4 values = vec4(getValue(batch, inIdx), 0.0, 0.0, 0.0);

          ${l}
        } else if (${2===o}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1), 0.0, 0.0);

          ${l}
        } else if (${3===o}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2), 0.0);

          ${l}
        }
        setOutput(sumValue);
      }
    `}}class vy{constructor(e,t){this.variableNames=["x"];const{windowSize:n,batchSize:r,inSize:a,outSize:s}=e;this.outputShape=[r,s];let i="0.0",o="";"prod"===t?i="1.0":"min"===t?(i="1.0 / 1e-20",o="min"):"max"===t&&(i="-1.0 / 1e-20",o="max");let l=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;"sum"===t?l="sumValue":"prod"===t?l="prodValue":"all"===t?l="allValue":"any"===t&&(l="anyValue");const u=4*Math.floor(n/4),h=n%4;let p=`
      if (${"sum"===t}) {
        sumValue += dot(values, ones);
      } else if (${"prod"===t}) {
        vec2 tmp = vec2(values[0], values[1]) * vec2(values[2], values[3]);
        prodValue *= tmp[0] * tmp[1];
      } else {
        minMaxValue = ${o}(values, minMaxValue);
        if (${"min"===t} || ${"max"===t}) {
          minMaxValue = ${o}(values, minMaxValue);
          bvec4 isNaN = isnan(values);
          if (isNaN.r || isNaN.g || isNaN.b || isNaN.a) {
            minMaxValue = vec4(NAN);
          }
        }
      }
    `,d="vec4";"all"===t?(i="1.0",p=`
        bool reducedAllValue = all(values);
        float floatedReducedAllValue = float(reducedAllValue);
        allValue = float(allValue >= 1.0 && floatedReducedAllValue >= 1.0);
      `,d="bvec4"):"any"===t&&(i="0.0",p=`
        bool reducedAnyValue = any(values);
        float floatedReducedAnyValue = float(reducedAnyValue);
        anyValue = float(anyValue >= 1.0 || floatedReducedAnyValue >= 1.0);
      `,d="bvec4");let c="";a%n>0&&(c=`
        if (inIdx < 0 || inIdx >= ${a}) {
          return initializationValue;
        }
      `),this.userCode=`
      const float initializationValue = ${i};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float getValue(int batch, int inIdx) {
        ${c}
        return getX(batch, inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${n};

        vec4 minMaxValue = vec4(${i});
        float prodValue = 1.0;
        float sumValue = 0.0;
        float allValue = 1.0;
        float anyValue = 0.0;

        for (int i = 0; i < ${u}; i += 4) {
          int inIdx = inOffset + i;
          ${d} values = ${d}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          ${p}
        }

        int inIdx = inOffset + ${u};
        if (${1===h}) {
          ${d} values = ${d}(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          ${p}
        } else if (${2===h}) {
          ${d} values = ${d}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          ${p}
        } else if (${3===h}) {
          ${d} values = ${d}(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          ${p}
        }
        setOutput(${l});
      }
    `}}function vb(e,t,n,r){let a=function(e){let t=[];for(;0===t.length||1!==t[t.length-1].outSize;){let n=t.length?t[t.length-1].outSize:e[1],r=tN.computeOptimalWindowSize(n);t.push({inSize:n,windowSize:r,outSize:Math.ceil(n/r)})}return t}(e.shape),s=e;for(let i=0;i<a.length;i++){let o,l,{inSize:u,windowSize:h,outSize:p}=a[i];o="mean"===n?0===i?new vx({windowSize:h,inSize:u,batchSize:e.shape[0],outSize:p},u):new vx({windowSize:h,inSize:u,batchSize:e.shape[0],outSize:p}):new vy({windowSize:h,inSize:u,batchSize:e.shape[0],outSize:p},n),l=s,s=r.runWebGLProgram(o,[s],t),l.dataId!==e.dataId&&r.disposeIntermediateTensorInfo(l)}return s}class vv{constructor(e,t){this.variableNames=["A"];const n=Array(e.length);for(let r=0;r<n.length;r++)n[r]=e[t[r]];this.outputShape=n,this.rank=n.length;const r=yo(this.rank),a=function(e){let t=e.length;if(t>6)throw Error(`Transpose for rank ${t} is not yet supported`);let n=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u","resRC.v"],r=Array(t);for(let t=0;t<e.length;t++)r[e[t]]=n[t];return r.join()}(t);this.userCode=`
    void main() {
      ${r} resRC = getOutputCoords();
      setOutput(getA(${a}));
    }
    `}}class vw{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0;const n=Array(e.length);for(let r=0;r<n.length;r++)n[r]=e[t[r]];if(this.outputShape=n,this.rank=n.length,this.rank>6)throw Error(`Packed transpose for rank ${this.rank} is not yet supported.`);const r=yo(this.rank),a=bR("rc",this.rank),s=Array(this.rank);for(let e=0;e<t.length;e++)s[t[e]]=a[e];const i=`vec2(${s.slice(-2).join()})`,o=`++${a[this.rank-1]} < ${n[this.rank-1]}`,l=`getChannel(getA(${s.join()}), ${i})`;this.userCode=`
    void main() {
      ${r} rc = getOutputCoords();
      vec4 result = vec4(0.);
      result[0] = ${l};
      if(${o}) {
        result[1] = ${l};
      }
      --${a[this.rank-1]};
      if(++${a[this.rank-2]} < ${n[this.rank-2]}) {
        result[2] = ${l};
        if(${o}) {
          result[3] = ${l};
        }
      }
      setOutput(result);
    }
    `}}function vI(e,t,n){let r=(0,rN.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new vw(e.shape,t):new vv(e.shape,t);return n.runWebGLProgram(r,[e],e.dtype)}function vC(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,keepDims:i}=r;return function(e,t,n,r){let a=e.shape.length,s=rR.util.parseAxisParam(t,e.shape),i=s,o=tN.getAxesPermutation(i,a),l=null!=o,u=e;l&&(u=vI(e,o,r),i=tN.getInnerMostAxes(i.length,a)),tN.assertAxesAreInnerMostDims("sum",i,a);let[h,p]=tN.computeOutAndReduceShapes(u.shape,i),d=h;n&&(d=tN.expandShapeToKeepDim(h,s));let c=rR.util.sizeFromShape(p),f=vm({inputs:{x:u},attrs:{shape:[rR.util.sizeFromShape(e.shape)/c,c]},backend:r}),m=vb(f,(0,d5.sumOutType)(e.dtype),"sum",r),g=vm({inputs:{x:m},attrs:{shape:d},backend:r});return r.disposeIntermediateTensorInfo(f),r.disposeIntermediateTensorInfo(m),l&&r.disposeIntermediateTensorInfo(u),g}(a,s,i,n)}let vk={kernelName:x.Sum,backendName:"webgl",kernelFunc:vC};function vS(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{perm:i}=a,o=Array(s.shape.length);for(let e=0;e<o.length;e++)o[e]=s.shape[i[e]];if(r.shouldExecuteOnCPU([s])){let e=bN(r.texData.get(s.dataId).values,s.shape,s.dtype,i,o);t=r.makeTensorInfo(o,s.dtype),r.texData.get(t.dataId).values=e}else t=vI(s,i,r);return t}let vT={kernelName:x.Transpose,backendName:"webgl",kernelFunc:vS};function vN({a:e,b:t,transposeA:n,transposeB:r,backend:a,bias:s=null,preluActivationWeights:i=null,leakyreluAlpha:o=0,activation:l=null}){let u,h=e.shape.length,p=t.shape.length,d=n?e.shape[h-2]:e.shape[h-1],c=r?t.shape[p-1]:t.shape[p-2],f=n?e.shape[h-1]:e.shape[h-2],m=r?t.shape[p-2]:t.shape[p-1],g=e.shape.slice(0,-2),x=t.shape.slice(0,-2),y=rR.util.sizeFromShape(g),b=rR.util.sizeFromShape(x),v=c5.assertAndGetBroadcastShape(e.shape.slice(0,-2),t.shape.slice(0,-2)).concat([f,m]);rR.util.assert(d===c,()=>`Error in matMul: inner shapes (${d}) and (${c}) of Tensors with shapes ${e.shape} and ${t.shape} and transposeA=${n} and transposeB=${r} must match.`);let w=n?[y,d,f]:[y,f,d],I=r?[b,m,c]:[b,c,m],C=vm({inputs:{x:e},backend:a,attrs:{shape:w}}),k=vm({inputs:{x:t},backend:a,attrs:{shape:I}}),S=[C,k],T=Math.max(y,b),N=n?C.shape[1]:C.shape[2],$=null!=s,R=null!=i,A="leakyrelu"===l,E=null!=l?vu(l,!0):null,F=$||R||A||null!=E;if((1===f||1===m)&&N>1e3&&!1===F){let e=C,t=k;n&&(e=vS({inputs:{x:C},backend:a,attrs:{perm:[0,2,1]}}),S.push(e)),r&&(t=vS({inputs:{x:k},backend:a,attrs:{perm:[0,2,1]}}),S.push(t));let s=1!==m,i=1===m,o=e;s&&(o=vm({inputs:{x:e},backend:a,attrs:{shape:[T,N,1]}}),S.push(o));let l=t;i&&(l=vm({inputs:{x:t},backend:a,attrs:{shape:[T,1,N]}}),S.push(l));let h=vc({inputs:{a:o,b:l},backend:a});u=vC({inputs:{x:h},backend:a,attrs:{axis:1===m?2:1,keepDims:!0}}),S.push(h)}else{let l=(0,d5.upcastType)(e.dtype,t.dtype),h=new vh(w,I,[T,f,m],n,r,$,E,R,A),p=[C,k];if(null!=s&&p.push(s),R&&p.push(i),A){let e=a.makeTensorInfo([],"float32",rR.util.createScalarValue(o,"float32"));p.push(e),S.push(e)}u=a.runWebGLProgram(h,p,l)}let D=vm({inputs:{x:u},backend:a,attrs:{shape:v}});for(let e of(S.push(u),S))a.disposeIntermediateTensorInfo(e);return D}let v$={kernelName:x._FusedMatMul,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{a,b:s,bias:i,preluActivationWeights:o}=t,{transposeA:l,transposeB:u,activation:h,leakyreluAlpha:p}=r;return vN({a,b:s,transposeA:l,transposeB:u,backend:n,bias:i,preluActivationWeights:o,leakyreluAlpha:p,activation:h})}},vR="return abs(x);",vA={kernelName:x.Abs,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r}=e,{x:a}=n;if(r.shouldExecuteOnCPU([a])&&"complex64"!==a.dtype){let e=bc(r.texData.get(a.dataId).values);return r.makeTensorInfo(a.shape,a.dtype,e)}return t=(0,rN.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS")?new bq(a.shape,vR):new b_(a.shape,vR),r.runWebGLProgram(t,[a],a.dtype)}},vE=vo({opSnippet:bM+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return acos(x);
`}),vF={kernelName:x.Acos,backendName:"webgl",kernelFunc:vE},vD=vo({opSnippet:bM+`
  if (x < 1.0) return NAN;
return log(x + sqrt(x * x - 1.0));`}),vO={kernelName:x.Acosh,backendName:"webgl",kernelFunc:vD},vL="return a + b;",vz=vl({opSnippet:vL,packedOpSnippet:vL,supportsComplex:!0,cpuKernelImpl:yV}),v_={kernelName:x.Add,backendName:"webgl",kernelFunc:vz};class vM{constructor(e,t){this.outputShape=[],this.outputShape=e,this.variableNames=t.map((e,t)=>`T${t}`);const n=[];this.variableNames.forEach(e=>{n.push(`float v${e} = get${e}AtOutCoords();`)});const r=this.variableNames.map(e=>`v${e}`).join(" + ");this.userCode=`
      void main() {
        ${n.join("\n        ")}

        float result = ${r};
        setOutput(result);
      }
    `}}class vP{constructor(e,t){this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.variableNames=t.map((e,t)=>`T${t}`);const n=[];this.variableNames.forEach(e=>{n.push(`vec4 v${e} = get${e}AtOutCoords();`)});const r=this.variableNames.map(e=>`v${e}`).join(" + ");this.userCode=`
      void main() {
        ${n.join("\n        ")}

        vec4 result = ${r};
        setOutput(result);
      }
    `}}let vB={kernelName:x.AddN,backendName:"webgl",kernelFunc:function e(t){let{inputs:n,backend:r}=t;if(1===n.length)return b6({inputs:{x:n[0]},backend:r});if(n.length>(0,rN.env)().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER")){let t=Math.floor(n.length/2),a=e({inputs:n.slice(0,t),backend:r}),s=e({inputs:n.slice(t),backend:r});return e({inputs:[a,s],backend:r})}let a=n.map(e=>e.dtype).reduce((e,t)=>(0,d5.upcastType)(e,t)),s=n.map(e=>e.shape),i=(0,rN.env)().getBool("WEBGL_PACK")?new vP(n[0].shape,s):new vM(n[0].shape,s);return r.runWebGLProgram(i,n,a)}};var tN=tN;let vW={kernelName:x.All,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{axis:i,keepDims:o}=a,l=s.shape.length,u=rR.util.parseAxisParam(i,s.shape),h=u,p=tN.getAxesPermutation(h,l),d=s;null!=p&&(d=vS({inputs:{x:s},backend:r,attrs:{perm:p}}),h=tN.getInnerMostAxes(h.length,l)),tN.assertAxesAreInnerMostDims("all",h,l);let[c,f]=tN.computeOutAndReduceShapes(d.shape,h),m=vm({inputs:{x:d},backend:r,attrs:{shape:[-1,rR.util.sizeFromShape(f)]}}),g=vb(m,m.dtype,"all",r);return t=o?vm({inputs:{x:g},backend:r,attrs:{shape:tN.expandShapeToKeepDim(c,u)}}):vm({inputs:{x:g},backend:r,attrs:{shape:c}}),r.disposeIntermediateTensorInfo(m),r.disposeIntermediateTensorInfo(g),null!=p&&r.disposeIntermediateTensorInfo(d),t}};var tN=tN;let vG={kernelName:x.Any,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{axis:i,keepDims:o}=a,l=s.shape.length,u=rR.util.parseAxisParam(i,s.shape),h=u,p=tN.getAxesPermutation(h,l),d=s;null!=p&&(d=vS({inputs:{x:s},backend:r,attrs:{perm:p}}),h=tN.getInnerMostAxes(h.length,l)),tN.assertAxesAreInnerMostDims("any",h,l);let[c,f]=tN.computeOutAndReduceShapes(d.shape,h),m=vm({inputs:{x:d},backend:r,attrs:{shape:[-1,rR.util.sizeFromShape(f)]}}),g=vb(m,m.dtype,"any",r);return t=o?vm({inputs:{x:g},backend:r,attrs:{shape:tN.expandShapeToKeepDim(c,u)}}):vm({inputs:{x:g},backend:r,attrs:{shape:c}}),r.disposeIntermediateTensorInfo(m),r.disposeIntermediateTensorInfo(g),null!=p&&r.disposeIntermediateTensorInfo(d),t}};var tN=tN,tN=tN;class vU{constructor(e,t,n){this.variableNames=["A"];const{windowSize:r,batchSize:a,outSize:s}=e;n||this.variableNames.push("bestIndicesA"),this.outputShape=[a,s],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = outIdx * ${r};

        int bestIndex = inOffset;
        float bestValue = getA(batch, bestIndex);

        for (int i = 0; i < ${r}; i++) {
          int inIdx = ${n?"inOffset + i;":"round(getBestIndicesA(batch, inOffset + i));"};
          float candidate = getA(batch, inIdx);
          if (candidate ${"max"===t?">":"<"} bestValue) {
            bestValue = candidate;
            bestIndex = inIdx;
          }
        }
        setOutput(float(bestIndex));
      }
    `}}class vV{constructor(e,t,n,r){let a,s;this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,rR.util.assert(e.length>2,()=>`Packed arg${n.charAt(0).toUpperCase()+n.slice(1)} supports only inputs with rank above 2.`);const i=Math.ceil(e[e.length-1]/t);this.outputShape=e.slice(0,-1),i>1&&this.outputShape.push(i),r||this.variableNames.push("bestIndicesA");const o=this.outputShape,l=o.length,u=yo(l),h=bA("coords",l);if(1===i){const e=yo(s=l+1);a=`
        ${e} sourceLocR = ${e}(${h.join()}, 0);
        ++${h[l-1]};
        ${e} sourceLocG = ${e}(${h.join()}, 0);
        ++${h[l-2]};
        ${e} sourceLocA = ${e}(${h.join()}, 0);
        --${h[l-1]};
        ${e} sourceLocB = ${e}(${h.join()}, 0);
        --${h[l-2]};`}else s=l,a=`
        ${u} sourceLocR = coords;
        ++${h[l-1]};
        ${u} sourceLocG = coords;
        ++${h[l-2]};
        ${u} sourceLocA = coords;
        --${h[l-1]};
        ${u} sourceLocB = coords;
        --${h[l-2]};`;const p=["x","y","z","w","u","v"].slice(0,s),d="."+p[s-1],c=p.map(e=>"int "+e),f=bA("sourceLocR",s-1).concat("inIdx.r"),m=bA("sourceLocG",s-1).concat("inIdx.g"),g=bA("sourceLocB",s-1).concat("inIdx.b"),x=bA("sourceLocA",s-1).concat("inIdx.a"),y="max"===n?"greaterThan":"lessThan",b=r?"":`
          inIdx = round(vec4(getBestIndicesAChannel(${f.join()}),
                             getBestIndicesAChannel(${m.join()}),
                             getBestIndicesAChannel(${g.join()}),
                             getBestIndicesAChannel(${x.join()})));`,v=`vec4(
            getAChannel(${f.join()}),
            hasNextCol ? getAChannel(${m.join()}) : 0.,
            hasNextRow ? getAChannel(${g.join()}) : 0.,
            hasNextRow && hasNextCol ? getAChannel(${x.join()}) : 0.)`,w=r?"":`
      float getBestIndicesAChannel(${c.join()}) {
        return getChannel(getBestIndicesA(${p.join()}),
                                          vec2(${p.slice(-2).join()}));
      }`;this.userCode=`
      float getAChannel(${c.join()}) {
        return getChannel(getA(${p.join()}),
                               vec2(${p.slice(-2).join()}));
      }
      ${w}
      void main() {
        ${u} coords = getOutputCoords();
        bool hasNextCol = ${h[l-1]} < ${o[l-1]-1};
        bool hasNextRow = ${h[l-2]} < ${o[l-2]-1};
        ${a}
        ivec4 srcIdx = ivec4(sourceLocR${d}, sourceLocG${d},
          sourceLocB${d}, sourceLocA${d}) * ${t};
        ivec4 inIdx = srcIdx;
        vec4 bestIndex = vec4(inIdx);
        vec4 bestValue = ${v};

        for (int i = 0; i < ${t}; i++) {
          inIdx = srcIdx;
          ${b}
          vec4 candidate = ${v};
          bvec4 nan = isnan(candidate);
          bvec4 replace = bvec4(
            vec4(${y}(candidate, bestValue)) * (vec4(1.0) - vec4(nan)));

          bestValue = vec4(replace.x  ? candidate.x : bestValue.x,
                           replace.y  ? candidate.y : bestValue.y,
                           replace.z  ? candidate.z : bestValue.z,
                           replace.w  ? candidate.w : bestValue.w);
          bestIndex = mix(bestIndex, vec4(inIdx), vec4(replace));
          srcIdx++;
        }
        setOutput(bestIndex);
      }
    `}}function vH(e,t,n,r){let a=[n];if(tN.assertAxesAreInnerMostDims("arg"+r.charAt(0).toUpperCase()+r.slice(1),a,t.shape.length),!(0,rN.env)().getBool("WEBGL_PACK_REDUCE")||t.shape.length<=2){let n=[],s=e.texData.get(t.dataId),i=null!==s&&s.isPacked,o=t;i&&n.push(o=e.unpackTensor(t));let[l,u]=tN.computeOutAndReduceShapes(o.shape,a),h=vm({inputs:{x:o},backend:e,attrs:{shape:[-1,rR.util.sizeFromShape(u)]}});n.push(h);let p=function e(t,n,r,a=null){let s=n.shape[0],i=n.shape[1];null!=a&&(s=a.shape[0],i=a.shape[1]);let o=tN.computeOptimalWindowSize(i),l=new vU({windowSize:o,inSize:i,batchSize:s,outSize:Math.ceil(i/o)},r,null==a),u=[n];null!=a&&u.push(a);let h=t.runWebGLProgram(l,u,"int32");if(1===h.shape[1])return h;let p=e(t,n,r,h);return t.disposeIntermediateTensorInfo(h),p}(e,h,r);n.push(p);let d=vm({inputs:{x:p},backend:e,attrs:{shape:l}});return n.forEach(t=>e.disposeIntermediateTensorInfo(t)),d}return function e(t,n,r,a=null){let s=null!=a?a.shape:n.shape,i=s[s.length-1],o=new vV(s,tN.computeOptimalWindowSize(i),r,null==a),l=null==a?[n]:[n,a],u=t.runWebGLProgram(o,l,"int32");if(u.shape.length===n.shape.length){let a=e(t,n,r,u);return t.disposeIntermediateTensorInfo(u),a}return u}(e,t,r)}let vq={kernelName:x.ArgMax,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s}=r,i=rR.util.parseAxisParam(s,a.shape),o=tN.getAxesPermutation(i,a.shape.length),l=a,u=[];null!=o&&(u.push(l=vS({inputs:{x:a},backend:n,attrs:{perm:o}})),i=tN.getInnerMostAxes(i.length,l.shape.length)),tN.assertAxesAreInnerMostDims("argMax",[i[0]],l.shape.length);let h=vH(n,l,i[0],"max");return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),h}};var tN=tN;let vj={kernelName:x.ArgMin,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s}=r,i=rR.util.parseAxisParam(s,a.shape),o=tN.getAxesPermutation(i,a.shape.length),l=a,u=[];null!=o&&(u.push(l=vS({inputs:{x:a},backend:n,attrs:{perm:o}})),i=tN.getInnerMostAxes(i.length,l.shape.length)),tN.assertAxesAreInnerMostDims("argMin",[i[0]],l.shape.length);let h=vH(n,l,i[0],"min");return u.forEach(e=>n.disposeIntermediateTensorInfo(e)),h}},vX=vo({opSnippet:bM+`
  if (abs(x) > 1.) {
    return NAN;
  }
  return asin(x);
`}),vK={kernelName:x.Asin,backendName:"webgl",kernelFunc:vX},vY=vo({opSnippet:bM+"return log(x + sqrt(x * x + 1.0));"}),vZ={kernelName:x.Asinh,backendName:"webgl",kernelFunc:vY},vJ=vo({opSnippet:bM+`
  return atan(x);
`}),vQ={kernelName:x.Atan,backendName:"webgl",kernelFunc:vJ},v0=vl({opSnippet:b2+`
  return atan(a, b);
`,packedOpSnippet:`
  vec4 result = atan(a, b);
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+b4+`
  return result;
`}),v1={kernelName:x.Atan2,backendName:"webgl",kernelFunc:v0},v2=vo({opSnippet:bM+`
  if ((x < -1.0) || (x > 1.0)) return NAN;
return (log(1.0 + x) - log(1.0 - x)) / 2.0;`}),v3={kernelName:x.Atanh,backendName:"webgl",kernelFunc:v2};var tN=tN;class v4{constructor(e,t,n,r=!1,a=!1){if(this.variableNames=["x"],"avg"===t&&n)throw Error("Cannot compute positions for average pool.");const s=e.filterWidth,i=e.strideHeight,o=e.strideWidth,l=e.dilationHeight,u=e.dilationWidth,h=e.effectiveFilterHeight,p=e.effectiveFilterWidth,d=e.padInfo.top,c=e.padInfo.left;this.outputShape=e.outShape;const f="avg"===t,m=`((batch  * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + d`,g=`(xR * ${e.inWidth} + xC) * ${e.inChannels} + d`;let x="0.0";if(f||(x="-1.0 / 1e-20"),n){this.userCode=`
        const ivec2 strides = ivec2(${i}, ${o});
        const ivec2 pads = ivec2(${d}, ${c});

        void main() {
          ivec4 coords = getOutputCoords();
          int batch = coords[0];
          int d = coords[3];

          ivec2 xRCCorner = coords.yz * strides - pads;
          int xRCorner = xRCCorner.x;
          int xCCorner = xRCCorner.y;

          // max/min x(?, ?, d) to get y(yR, yC, d).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;
          float avgValue = 0.0;

          for (int wR = 0; wR < ${h};
              wR += ${l}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${p};
                wC += ${u}) {
              int xC = xCCorner + wC;

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float value = getX(batch, xR, xC, d);

              // If a min / max value has already been found, use it. If not,
              // use the current value.
              float currMinMaxValue = mix(
                  value, minMaxValue, minMaxValueFound);
              if (value >= currMinMaxValue) {
                minMaxValue = value;
                minMaxValueFound = 1.0;
                minMaxPosition = ${r?a?m:g:`wR * ${p} + wC`};
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let y=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;"avg"===t&&(y="avgValue / max(count, 1.0)");const b=4*Math.floor(s/4),v=s%4,w=`
      if (${f}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec2 strides = ivec2(${i}, ${o});
      const ivec2 pads = ivec2(${d}, ${c});
      const float initializationValue = ${x};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xR, int xC, int d) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xR, xC, d);
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d = coords[3];

        ivec2 xRCCorner = coords.yz * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // max/min x(?, ?, d) to get y(yR, yC, d).
        // ? = to be determined
        vec4 minMaxValue = vec4(${x});
        float avgValue = 0.0;
        count = 0.0;

        for (int wR = 0; wR < ${h};
            wR += ${l}) {
          int xR = xRCorner + wR;

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${b}; wC += 4) {
            int xC = xCCorner + wC * ${u};

            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              getValue(batch, xR, xC + 3 * ${u}, d)
            );

            ${w}
          }

          int xC = xCCorner + ${b};
          if (${1===v}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              initializationValue,
              initializationValue,
              initializationValue
            );

            ${w}
          } else if (${2===v}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              initializationValue,
              initializationValue
            );

            ${w}
          } else if (${3===v}) {
            vec4 values = vec4(
              getValue(batch, xR, xC, d),
              getValue(batch, xR, xC + ${u}, d),
              getValue(batch, xR, xC + 2 * ${u}, d),
              initializationValue
            );

            ${w}
          }
        }
        setOutput(${y});
      }
    `}}class v5{constructor(e,t,n,r=!1,a=!1){if(this.variableNames=["x"],"avg"===t&&n)throw Error("Cannot compute positions for average pool.");const s=e.filterWidth,i=e.strideDepth,o=e.strideHeight,l=e.strideWidth,u=e.dilationDepth,h=e.dilationHeight,p=e.dilationWidth,d=e.effectiveFilterDepth,c=e.effectiveFilterHeight,f=e.effectiveFilterWidth,m=e.padInfo.front,g=e.padInfo.top,x=e.padInfo.left;this.outputShape=e.outShape;const y="avg"===t;let b="0.0";if(y||(b="-1.0 / 1e-20"),n){this.userCode=`
        const ivec3 strides =
            ivec3(${i}, ${o}, ${l});
        const ivec3 pads = ivec3(${m}, ${g}, ${x});

        void main() {
          ivec5 coords = getOutputCoords();
          int batch = coords.x;
          int ch = coords.u;

          ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
          int xDCorner = xCorner.x;
          int xRCorner = xCorner.y;
          int xCCorner = xCorner.z;

          // max/min x(?, ?, ?, ch) to get y(yD, yR, yC, ch).
          // ? = to be determined
          float minMaxValue = 0.0;
          float minMaxValueFound = 0.0;
          int minMaxPosition = 0;

          for (int wD = 0; wD < ${d};
              wD += ${u}) {
            int xD = xDCorner + wD;

            if (xD < 0 || xD >= ${e.inDepth}) {
              continue;
            }

            for (int wR = 0; wR < ${c};
                wR += ${h}) {
              int xR = xRCorner + wR;

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int wC = 0; wC < ${f};
                  wC += ${p}) {
                int xC = xCCorner + wC;

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float value = getX(batch, xD, xR, xC, ch);

                // If a min / max value has already been found, use it. If not,
                // use the current value.
                float currMinMaxValue = mix(
                    value, minMaxValue, minMaxValueFound);
                if (value >= currMinMaxValue) {
                  minMaxValue = value;
                  minMaxValueFound = 1.0;
                  minMaxPosition = ${r?a?`(((batch * ${e.inDepth} + xD) * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`((xD * ${e.inHeight} + xR) * ${e.inWidth} + xC) * ${e.inChannels} + ch`:`wD * ${c} * ${f} +
                      wR * ${f} + wC`};
                }
              }
            }
          }
          setOutput(float(minMaxPosition));
        }
      `;return}let v=`${t}(${t}(${t}(minMaxValue[0], minMaxValue[1]), minMaxValue[2]), minMaxValue[3])`;"avg"===t&&(v="avgValue / max(count, 1.0)");const w=4*Math.floor(s/4),I=s%4,C=`
      if (${y}) {
        avgValue += dot(values, ones);
      } else {
        minMaxValue = max(values, minMaxValue);
      }
    `;this.userCode=`
      const ivec3 strides =
        ivec3(${i}, ${o}, ${l});
      const ivec3 pads = ivec3(${m}, ${g}, ${x});
      const float initializationValue = ${b};
      const vec4 ones = vec4(1.0, 1.0, 1.0, 1.0);

      float count = 0.0;

      float getValue(int batch, int xD, int xR, int xC, int ch) {
        if (xC < 0 || xC >= ${e.inWidth}) {
          return initializationValue;
        }
        count += 1.0;
        return getX(batch, xD, xR, xC, ch);
      }

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 xCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xDCorner = xCorner.x;
        int xRCorner = xCorner.y;
        int xCCorner = xCorner.z;

        // max/min x(?, ?, ?, d) to get y(yD, yR, yC, ch).
        // ? = to be determined
        vec4 minMaxValue = vec4(${b});
        float avgValue = 0.0;
        count = 0.0;

        for (int wD = 0; wD < ${d};
            wD += ${u}) {
          int xD = xDCorner + wD;

          if (xD < 0 || xD >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${c};
            wR += ${h}) {
            int xR = xRCorner + wR;

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${w}; wC += 4) {
              int xC = xCCorner + wC * ${p};

              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${p}, ch),
                getValue(batch, xD, xR, xC + 2 * ${p}, ch),
                getValue(batch, xD, xR, xC + 3 * ${p}, ch)
              );

              ${C}
            }

            int xC = xCCorner + ${w};
            if (${1===I}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                initializationValue,
                initializationValue,
                initializationValue
              );

              ${C}
            } else if (${2===I}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${p}, ch),
                initializationValue,
                initializationValue
              );

              ${C}
            } else if (${3===I}) {
              vec4 values = vec4(
                getValue(batch, xD, xR, xC, ch),
                getValue(batch, xD, xR, xC + ${p}, ch),
                getValue(batch, xD, xR, xC + 2 * ${p}, ch),
                initializationValue
              );

              ${C}
            }
          }
        }
        setOutput(${v});
      }
    `}}let v6={kernelName:x.AvgPool,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t;x0(a,"avgPool");let{filterSize:s,strides:i,pad:o,dimRoundingMode:l}=r;rR.util.assert(tN.eitherStridesOrDilationsAreOne(i,1),()=>`Error in avgPool: Either strides or dilations must be 1. Got strides ${i} and dilations '1'`);let u=tN.computePool2DInfo(a.shape,s,i,1,o,l);if(1===u.filterWidth&&1===u.filterHeight&&rR.util.arraysEqual(u.inShape,u.outShape))return b6({inputs:{x:a},backend:n});let h=new v4(u,"avg",!1);return n.runWebGLProgram(h,[a],"float32")}};var tN=tN;let v8={kernelName:x.AvgPool3D,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{filterSize:s,strides:i,pad:o,dimRoundingMode:l,dataFormat:u}=r,h=new v5(tN.computePool3DInfo(a.shape,s,i,[1,1,1],o,l,u),"avg",!1);return n.runWebGLProgram(h,[a],"float32")}};var tN=tN;class v9{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;const t=e.filterHeight,n=e.filterWidth,r=e.strideHeight,a=e.strideWidth,s=e.dilationHeight,i=e.dilationWidth,o=e.effectiveFilterHeight,l=e.effectiveFilterWidth,u=o-1-e.padInfo.top,h=l-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${u}, ${h});
      const float avgMultiplier = float(${1/(t*n)});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${o};
            wR += ${s}) {
          float dyR = float(dyRCorner + wR) / ${r}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${l};
            wC+= ${i}) {
            float dyC = float(dyCCorner + wC) / ${a}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);

            dotProd += dyValue * avgMultiplier;
          }
        }
        setOutput(dotProd);
      }
    `}}class v7{constructor(e){this.variableNames=["dy"],this.outputShape=e.inShape;const t=e.filterDepth,n=e.filterHeight,r=e.filterWidth,a=e.strideDepth,s=e.strideHeight,i=e.strideWidth,o=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,h=e.effectiveFilterDepth,p=e.effectiveFilterHeight,d=e.effectiveFilterWidth,c=h-1-e.padInfo.front,f=p-1-e.padInfo.top,m=d-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${c}, ${f}, ${m});
      const float avgMultiplier = float(${1/(t*n*r)});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, d) with pos mask(:, :, :, ch) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${h};
            wD += ${o}) {
          float dyD = float(dyDCorner + wD) / ${a}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${p};
              wR += ${l}) {
            float dyR = float(dyRCorner + wR) / ${s}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${d};
                wC += ${u}) {
              float dyC = float(dyCCorner + wC) / ${i}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);

              dotProd += dyValue * avgMultiplier;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let we={kernelName:x.AvgPool3DGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s}=t,{filterSize:i,strides:o,pad:l,dimRoundingMode:u}=r,h=new v7(tN.computePool3DInfo(s.shape,i,o,[1,1,1],l,u));return n.runWebGLProgram(h,[a],s.dtype)}};var tN=tN;let wt={kernelName:x.AvgPoolGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s}=t;x0([a,s],"avgPoolGrad");let{filterSize:i,strides:o,pad:l}=r,u=new v9(tN.computePool2DInfo(s.shape,i,o,1,l));return n.runWebGLProgram(u,[a],s.dtype)}},wn={kernelName:x.BatchMatMul,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{a,b:s}=t,{transposeA:i,transposeB:o}=r;return vN({a,b:s,transposeA:i,transposeB:o,backend:n})}};var tN=tN;class wr{constructor(e,t,n,r,a,s){this.outputShape=[],this.variableNames=["x","mean","variance"],tN.assertAndGetBroadcastShape(e,t),tN.assertAndGetBroadcastShape(e,n);let i="0.0";null!=r&&(tN.assertAndGetBroadcastShape(e,r),this.variableNames.push("offset"),i="getOffsetAtOutCoords()");let o="1.0";null!=a&&(tN.assertAndGetBroadcastShape(e,a),this.variableNames.push("scale"),o="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        float x = getXAtOutCoords();
        float mean = getMeanAtOutCoords();
        float variance = getVarianceAtOutCoords();
        float offset = ${i};
        float scale = ${o};
        float inv = scale * inversesqrt(variance + float(${s}));
        setOutput(dot(vec3(x, -mean, offset), vec3(inv, inv, 1)));
      }
    `}}var tN=tN;class wa{constructor(e,t,n,r,a,s){this.packedInputs=!0,this.packedOutput=!0,this.variableNames=["x","mean","variance"],tN.assertAndGetBroadcastShape(e,t),tN.assertAndGetBroadcastShape(e,n);let i="vec4(0.0)";null!=r&&(tN.assertAndGetBroadcastShape(e,r),this.variableNames.push("offset"),i="getOffsetAtOutCoords()");let o="vec4(1.0)";null!=a&&(tN.assertAndGetBroadcastShape(e,a),this.variableNames.push("scale"),o="getScaleAtOutCoords()"),this.outputShape=e,this.userCode=`
      void main() {
        vec4 offset = ${i};
        vec4 scale = ${o};

        vec4 x = getXAtOutCoords();
        vec4 mean = getMeanAtOutCoords();
        vec4 variance = getVarianceAtOutCoords();

        vec4 inv = scale * inversesqrt(variance + vec4(${s}));

        setOutput((x - mean) * inv + offset);
      }
    `}}let ws={kernelName:x.FusedBatchNorm,backendName:"webgl",kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r,mean:a,variance:s,offset:i,scale:o}=e;rR.util.assert(a.shape.length===s.shape.length,()=>"Batch normalization gradient requires mean and variance to have equal ranks."),rR.util.assert(null==i||a.shape.length===i.shape.length,()=>"Batch normalization gradient requires mean and offset to have equal ranks."),rR.util.assert(null==o||a.shape.length===o.shape.length,()=>"Batch normalization gradient requires mean and scale to have equal ranks.");let{varianceEpsilon:l}=n;null==l&&(l=.001);let u=[r,a,s],h=null;null!=i&&(h=i.shape,u.push(i));let p=null;null!=o&&(p=o.shape,u.push(o));let d=(0,rN.env)().getBool("WEBGL_PACK_NORMALIZATION")?new wa(r.shape,a.shape,s.shape,h,p,l):new wr(r.shape,a.shape,s.shape,h,p,l);return t.runWebGLProgram(d,u,u[0].dtype)}};var tN=tN,cx=tJ;class wi{constructor(e){let t;this.variableNames=["source"],this.outputShape=e,this.rank=e.length;const n=yo(this.rank);this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const r=function(e){if(1===e)return"sourceLoc";if(e<=6)return wo.slice(0,e).map(e=>"sourceLoc."+e).join(",");throw Error(`Slicing for rank ${e} is not yet supported`)}(this.rank),a=e.map((e,t)=>`sourceLoc.${wo[t]} = start[${t}] + coords.${wo[t]};`);t=`
        ${n} sourceLoc;
        ${n} coords = getOutputCoords();
        ${a.join("\n")}
      `,this.userCode=`
      void main() {
        ${t}
        setOutput(getSource(${r}));
      }
    `}}let wo=["x","y","z","w","u","v"];class wl{constructor(e){this.variableNames=["source"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=e,this.rank=e.length,this.customUniforms=[{name:"start",arrayIndex:this.rank,type:"int"}];const t=yo(this.rank),n=bA("coords",this.rank),r=bA("sourceLoc",this.rank),a=1===this.rank?"sourceLoc":`vec2(${r.slice(-2).join()})`,s=`getChannel(getSource(${r.join()}), ${a})`,i=`
      result.x = ${s};
      if (++${n[this.rank-1]} < ${e[this.rank-1]}) {
        ++${r[this.rank-1]};
        result.y = ${s};
        --${r[this.rank-1]};
      }
    `,o=1===this.rank?"":`
      --${n[this.rank-1]};
      if (++${n[this.rank-2]} < ${e[this.rank-2]}) {
        ++${r[this.rank-2]};
        result.z = ${s};
        if (++${n[this.rank-1]} < ${e[this.rank-1]}) {
          ++${r[this.rank-1]};
          result.w = ${s};
        }
      }
    `,l=this.rank<=4?`sourceLoc = coords +
            ${t}(${e.map((e,t)=>`start[${t}]`).join()});`:e.map((e,t)=>`${r[t]} = ${n[t]} + start[${t}];`).join("\n");this.userCode=`
      void main() {
        ${t} coords = getOutputCoords();
        ${t} sourceLoc;
        ${l}
        vec4 result = vec4(0.);
        ${i}
        ${o}
        setOutput(result);
      }
    `}}function wu(e){let t,n,r,a,s,{inputs:i,backend:o,attrs:l}=e,{x:u}=i,{begin:h,size:p}=l,[d,c]=cx.parseSliceParams(u,h,p);if(cx.assertParamsValid(u,d,c),0===rR.util.sizeFromShape(c))return o.makeTensorInfo(c,u.dtype,[]);if(o.shouldExecuteOnCPU([u])||"string"===u.dtype){let e=bf(o.texData.get(u.dataId).values,d,c,u.shape,u.dtype);return o.makeTensorInfo(c,u.dtype,e)}let{isPacked:f}=o.texData.get(u.dataId),m=cx.isSliceContinous(u.shape,d,c);if(f||!m){let e=(0,rN.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new wl(c):new wi(c),t=[d];return o.runWebGLProgram(e,[u],u.dtype,t)}return o.uploadToGPU(u.dataId),t=o.texData.get(u.dataId),n=o.makeTensorInfo(c,u.dtype),Object.assign(r=o.texData.get(n.dataId),t),r.refCount=1,r.shape=c,r.dtype=u.dtype,a=cx.computeFlatOffset(d,rR.util.computeStrides(u.shape)),t.slice&&(a+=t.slice.flatOffset),r.slice={flatOffset:a,origDataId:t.slice&&t.slice.origDataId||u.dataId},s=o.dataRefCount.get(r.slice.origDataId)||1,o.dataRefCount.set(r.slice.origDataId,s+1),n}let wh={kernelName:x.Slice,backendName:"webgl",kernelFunc:wu},wp={kernelName:x.BatchToSpaceND,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{blockShape:s,crops:i}=r;rR.util.assert(a.shape.length<=4,()=>"batchToSpaceND for rank > 4 with a WebGL backend not implemented yet");let o=s.reduce((e,t)=>e*t),l=tN.getReshaped(a.shape,s,o),u=tN.getPermuted(l.length,s.length),h=tN.getReshapedPermuted(a.shape,s,o),p=tN.getSliceBeginCoords(i,s.length),d=tN.getSliceSize(h,i,s.length),c=[],f=vm({inputs:{x:a},backend:n,attrs:{shape:l}}),m=vS({inputs:{x:f},backend:n,attrs:{perm:u}}),g=vm({inputs:{x:m},backend:n,attrs:{shape:h}}),x=wu({inputs:{x:g},backend:n,attrs:{begin:p,size:d}});return c.push(f),c.push(m),c.push(g),c.forEach(e=>n.disposeIntermediateTensorInfo(e)),x}},wd={kernelName:x.Bincount,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,weights:s}=t,{size:i}=r,o=yH(n.readSync(a.dataId),n.readSync(s.dataId),s.dtype,s.shape,i);return n.makeTensorInfo([i],s.dtype,o)}},wc=`
  int r = int(a.r) & int(b.r);
  int g = int(a.g) & int(b.g);
  int rb = int(a.b) & int(b.b);
  int ra = int(a.a) & int(b.a);
  return vec4(r, g, rb, ra);
`,wf=`
  return float(int(a.r) & int(b.r));
`,wm={kernelName:x.BitwiseAnd,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r}=e,{a,b:s}=n,i=(0,rN.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS"),o=(0,rN.env)().getNumber("WEBGL_VERSION");if(r.shouldExecuteOnCPU([a,s])||1===o){let e=r.texData.get(a.dataId).values,t=r.texData.get(s.dataId).values,[n,i]=yj(a.shape,s.shape,e,t,a.dtype),o=r.makeTensorInfo(i,a.dtype);return r.texData.get(o.dataId).values=n,o}return t=i?new b5(wc,a.shape,s.shape,!1):new b3(wf,a.shape,s.shape),r.runWebGLProgram(t,[a,s],a.dtype)}};var tN=tN;let wg={kernelName:x.BroadcastArgs,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{s0:r,s1:a}=t,s=n.readSync(r.dataId),i=n.readSync(a.dataId),o=tN.assertAndGetBroadcastShape(Array.from(s),Array.from(i));return n.makeTensorInfo([o.length],"int32",Int32Array.from(o))}},wx=vl({opSnippet:"return float(a != b);",cpuKernelImpl:ba,dtype:"bool"}),wy={kernelName:x.NotEqual,backendName:"webgl",kernelFunc:wx};function wb(e){let{inputs:t,backend:n}=e,{input:r}=t;return b6({inputs:{x:n.texData.get(r.dataId).complexTensorInfos.real},backend:n})}let wv={kernelName:x.Real,backendName:"webgl",kernelFunc:wb},ww={kernelName:x.Cast,backendName:"webgl",kernelFunc:function e(t){let{inputs:n,backend:r,attrs:a}=t,{x:s}=n,{dtype:i}=a;if("complex64"===i){if("complex64"===s.dtype)return b6({inputs:{x:s},backend:r});let t=tx.zeros(s.shape),n=e({inputs:{x:s},backend:r,attrs:{dtype:"float32"}}),a=b9({inputs:{real:n,imag:t},backend:r});return t.dispose(),r.disposeIntermediateTensorInfo(n),a}if("complex64"===s.dtype){let t=wb({inputs:{input:s},backend:r}),n=e({inputs:{x:t},backend:r,attrs:{dtype:i}});return r.disposeIntermediateTensorInfo(t),n}if(!rR.util.hasEncodingLoss(s.dtype,i)){let e=b6({inputs:{x:s},backend:r});return{dataId:e.dataId,shape:e.shape,dtype:i}}if(r.shouldExecuteOnCPU([s])){let[e,t,n]=yX(r.texData.get(s.dataId).values,s.shape,s.dtype,i);return r.makeTensorInfo(e,t,n)}if("int32"===i){let e,t;return e=new b_(s.shape,"return float(int(x));"),{dataId:(t=r.runWebGLProgram(e,[s],"int32")).dataId,shape:t.shape,dtype:t.dtype}}if("bool"===i){let e=r.makeTensorInfo([],"bool",rR.util.getTypedArrayFromDType("bool",1)),t=wx({inputs:{a:s,b:e},backend:r});return r.disposeIntermediateTensorInfo(e),t}throw Error(`Error in Cast: failed to cast ${s.dtype} to ${i}`)}},wI="return ceil(x);",wC=vo({opSnippet:wI,packedOpSnippet:wI,cpuKernelImpl:yK}),wk={kernelName:x.Ceil,backendName:"webgl",kernelFunc:wC};class wS{constructor(e){this.variableNames=["A"],this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`

      void main() {
        float value = getAAtOutCoords();
        if (isnan(value)) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, minVal, maxVal));
      }
    `}}class wT{constructor(e){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"minVal",type:"float"},{name:"maxVal",type:"float"}],this.outputShape=e,this.userCode=`
      void main() {
        vec4 value = getAAtOutCoords();

        if (any(isnan(value))) {
          setOutput(value);
          return;
        }

        setOutput(clamp(value, vec4(minVal), vec4(maxVal)));
      }
    `}}let wN={kernelName:x.ClipByValue,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{clipValueMin:i,clipValueMax:o}=a;return t=(0,rN.env)().getBool("WEBGL_PACK_CLIP")?new wT(s.shape):new wS(s.shape),r.runWebGLProgram(t,[s],s.dtype,[[i],[o]])}};class w${constructor(e){this.variableNames=["real","imag"],this.outputShape=e,this.userCode=`
      void main() {
        float re = abs(getRealAtOutCoords());
        float im = abs(getImagAtOutCoords());
        float mx = max(re, im);

        // sadly the length function in glsl is not underflow-safe
        // (at least not on Intel GPUs). So the safe solution is
        // to ensure underflow-safety in all cases.
        setOutput(
          mx == 0.0 ? 0.0 : mx * length(vec2(1, min(re, im)/mx))
        );
      }
    `}}function wR(e,t){return{dataId:t.dataId,dtype:t.dtype,shape:e.shape}}let wA={kernelName:x.ComplexAbs,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{x:r}=t,a=n.texData.get(r.dataId),s=new w$(r.shape),i=[wR(r,a.complexTensorInfos.real),wR(r,a.complexTensorInfos.imag)];return n.runWebGLProgram(s,i,i[0].dtype)}};var tN=tN,tN=tN,tN=tN;class wE{constructor(e){this.outputShape=[],this.outputShape=tN.computeOutShape(e,1),this.variableNames=e.map((e,t)=>`T${t}`);const t=Array(e.length-1);t[0]=e[0][1];for(let n=1;n<t.length;n++)t[n]=t[n-1]+e[n][1];const n=[`if (yC < ${t[0]}) setOutput(getT0(yR, yC));`];for(let e=1;e<t.length;e++){const r=t[e-1];n.push(`else if (yC < ${t[e]}) setOutput(getT${e}(yR, yC-${r}));`)}const r=t.length,a=t[t.length-1];n.push(`else setOutput(getT${r}(yR, yC-${a}));`),this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int yR = coords.x;
        int yC = coords.y;

        ${n.join("\n        ")}
      }
    `}}var tN=tN;class wF{constructor(e,t){this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[],this.outputShape=tN.computeOutShape(e,t);const n=this.outputShape,r=n.length,a=yo(r),s=bA("coords",r),i=["x","y","z","w","u","v"].slice(0,r);this.variableNames=e.map((e,t)=>`T${t}`);const o=Array(e.length-1);o[0]=e[0][t];for(let n=1;n<o.length;n++)o[n]=o[n-1]+e[n][t];const l=i[t],u=i.slice(-2),h=i.join();let p=`if (${l} < ${o[0]}) {
        return getChannel(
            getT0(${h}), vec2(${u.join()}));
        }`;for(let e=1;e<o.length;e++){const t=o[e-1];p+=`
        if (${l} < ${o[e]}  && ${l} >= ${o[e-1]}) {
          return getChannel(
            getT${e}(${wD(i,l,t)}),
            vec2(${wD(u,l,t)}));
        }`}const d=o.length,c=o[o.length-1];p+=`
        return getChannel(
          getT${d}(${wD(i,l,c)}),
          vec2(${wD(u,l,c)}));`,this.userCode=`
      float getValue(${i.map(e=>"int "+e)}) {
        ${p}
      }

      void main() {
        ${a} coords = getOutputCoords();
        vec4 result = vec4(getValue(${s}), 0., 0., 0.);

        ${s[r-1]} = ${s[r-1]} + 1;
        if (${s[r-1]} < ${n[r-1]}) {
          result.g = getValue(${s});
        }

        ${s[r-2]} = ${s[r-2]} + 1;
        if (${s[r-2]} < ${n[r-2]}) {
          result.a = getValue(${s});
        }

        ${s[r-1]} = ${s[r-1]} - 1;
        if (${s[r-2]} < ${n[r-2]} &&
            ${s[r-1]} < ${n[r-1]}) {
          result.b = getValue(${s});
        }
        setOutput(result);
      }
    `}}function wD(e,t,n){let r=e.indexOf(t);return e.map((e,t)=>t===r?`${e} - ${n}`:e).join()}function wO(e){let{inputs:t,backend:n}=e,{input:r}=t;return b6({inputs:{x:n.texData.get(r.dataId).complexTensorInfos.imag},backend:n})}let wL={kernelName:x.Imag,backendName:"webgl",kernelFunc:wO};function wz(e){let{inputs:t,backend:n,attrs:r}=e,{axis:a}=r,s=rR.util.parseAxisParam(a,t[0].shape)[0],i=t.map(e=>e.shape);tN.assertParamsConsistent(i,s);let o=tN.computeOutShape(t.map(e=>e.shape),s);if(0===rR.util.sizeFromShape(o))return n.makeTensorInfo(o,t[0].dtype,[]);let l=t.filter(e=>rR.util.sizeFromShape(e.shape)>0);return 1===l.length?b6({inputs:{x:l[0]},backend:n}):function e(t,n,r){var a,s,i;let o,l=t[0].dtype;if("complex64"===l){let a=t.map(e=>wb({inputs:{input:e},backend:r})),s=t.map(e=>wO({inputs:{input:e},backend:r})),i=e(a,n,r),o=e(s,n,r),l=b9({inputs:{real:i,imag:o},backend:r});return a.forEach(e=>r.disposeIntermediateTensorInfo(e)),s.forEach(e=>r.disposeIntermediateTensorInfo(e)),r.disposeIntermediateTensorInfo(i),r.disposeIntermediateTensorInfo(o),l}let u=r.shouldExecuteOnCPU(t);if("string"===l&&(u=!0),u){let e=t.map(e=>{let t=rR.util.sizeFromShape(e.shape.slice(n));return vm({inputs:{x:e},backend:r,attrs:{shape:[-1,t]}})}),a=yY(e.map(e=>({vals:r.readSync(e.dataId),shape:e.shape})),tN.computeOutShape(e.map(e=>e.shape),1),l,1===e[0].shape[0]),s=tN.computeOutShape(t.map(e=>e.shape),n),i=r.makeTensorInfo(s,l,a);return e.forEach(e=>r.disposeIntermediateTensorInfo(e)),i}let h=t.filter(e=>rR.util.sizeFromShape(e.shape)>0),p=(0,rN.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")&&h[0].shape.length>1;if(1===h.length){let e=p?new b_(t[0].shape,bG):new bq(t[0].shape,bG);return r.runWebGLProgram(e,t,l)}let d=(0,rN.env)().getNumber("WEBGL_MAX_TEXTURES_IN_SHADER");if(h.length>d){let t=[];for(let a=0;a<h.length;a+=d){let s=h.slice(a,a+d);t.push(e(s,n,r))}let a=e(t,n,r);for(let e of t)r.disposeIntermediateTensorInfo(e);return a}if(p){let e=new wF(h.map(e=>e.shape),n);return r.runWebGLProgram(e,h,l)}let{tensors2D:c,outShape:f}=(a=h,s=n,i=r,o=tN.computeOutShape(a.map(e=>e.shape),s),{tensors2D:a.map(e=>vm({inputs:{x:e},attrs:{shape:[-1,rR.util.sizeFromShape(e.shape.slice(s))]},backend:i})),outShape:o}),m=new wE(c.map(e=>e.shape)),g=r.runWebGLProgram(m,c,l);c.forEach(e=>r.disposeIntermediateTensorInfo(e));let x=vm({inputs:{x:g},attrs:{shape:f},backend:r});return r.disposeIntermediateTensorInfo(g),x}(l,s,n)}let w_={kernelName:x.Concat,backendName:"webgl",kernelFunc:wz};var tN=tN;class wM{constructor(e,t=!1,n=null,r=!1,a=!1){this.variableNames=["x","W"],this.outputShape=e.outShape;const s=e.padInfo.top,i=e.padInfo.left,o=e.strideHeight,l=e.strideWidth,u=e.dilationHeight,h=e.dilationWidth,p=e.filterHeight,d=e.filterWidth,c=4*Math.floor(e.inChannels/4),f=e.inChannels%4,m="channelsLast"===e.dataFormat;let g="",x="";n&&(g=r?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${n}
        }`:a?`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${n}
        }`:`
          float activation(float x) {
            ${n}
          }
        `,x="result = activation(result);"),t&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),a&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${g}

      const ivec2 strides = ivec2(${o}, ${l});
      const ivec2 pads = ivec2(${s}, ${i});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d2 = coords[${m?3:1}];

        ivec2 xRCCorner =
            ivec2(coords[${m?1:2}], coords[${m?2:3}]) * strides - pads;
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, d2) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${p}; wR++) {
          int xR = xRCorner + wR * ${u};

          if (xR < 0 || xR >= ${e.inHeight}) {
            continue;
          }

          for (int wC = 0; wC < ${d}; wC++) {
            int xC = xCCorner + wC * ${h};

            if (xC < 0 || xC >= ${e.inWidth}) {
              continue;
            }

            for (int d1 = 0; d1 < ${c}; d1 += 4) {
              vec4 wValues = vec4(
                getW(wR, wC, d1, d2),
                getW(wR, wC, d1 + 1, d2),
                getW(wR, wC, d1 + 2, d2),
                getW(wR, wC, d1 + 3, d2)
              );

              if (${m}) {
                vec4 xValues = vec4(
                  getX(batch, xR, xC, d1),
                  getX(batch, xR, xC, d1 + 1),
                  getX(batch, xR, xC, d1 + 2),
                  getX(batch, xR, xC, d1 + 3)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec4 xValues = vec4(
                  getX(batch, d1, xR, xC),
                  getX(batch, d1 + 1, xR, xC),
                  getX(batch, d1 + 2, xR, xC),
                  getX(batch, d1 + 3, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }
            }

            if (${1===f}) {

              if (${m}) {
                dotProd +=
                    getX(batch, xR, xC, ${c}) *
                    getW(wR, wC, ${c}, d2);
              } else {
                dotProd +=
                    getX(batch, ${c}, xR, xC) *
                    getW(wR, wC, ${c}, d2);
              }

            } else if (${2===f}) {
              vec2 wValues = vec2(
                getW(wR, wC, ${c}, d2),
                getW(wR, wC, ${c} + 1, d2)
              );

              if (${m}) {
                vec2 xValues = vec2(
                  getX(batch, xR, xC, ${c}),
                  getX(batch, xR, xC, ${c} + 1)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec2 xValues = vec2(
                  getX(batch, ${c}, xR, xC),
                  getX(batch, ${c} + 1, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            } else if (${3===f}) {
              vec3 wValues = vec3(
                getW(wR, wC, ${c}, d2),
                getW(wR, wC, ${c} + 1, d2),
                getW(wR, wC, ${c} + 2, d2)
              );

              if (${m}) {
                vec3 xValues = vec3(
                  getX(batch, xR, xC, ${c}),
                  getX(batch, xR, xC, ${c} + 1),
                  getX(batch, xR, xC, ${c} + 2)
                );
                dotProd += dot(xValues, wValues);
              } else {
                vec3 xValues = vec3(
                  getX(batch, ${c}, xR, xC),
                  getX(batch, ${c} + 1, xR, xC),
                  getX(batch, ${c} + 2, xR, xC)
                );
                dotProd += dot(xValues, wValues);
              }

            }
          }
        }

        float result = dotProd;
        ${t?"result += getBiasAtOutCoords();":""}
        ${x}
        setOutput(result);
      }
    `}}class wP{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;const t=e.padInfo.front,n=e.padInfo.top,r=e.padInfo.left,a=e.strideDepth,s=e.strideHeight,i=e.strideWidth,o=e.dilationDepth,l=e.dilationHeight,u=e.dilationWidth,h=e.filterDepth,p=e.filterHeight,d=e.filterWidth,c=4*Math.floor(e.inChannels/4),f=e.inChannels%4;this.userCode=`
      const ivec3 strides = ivec3(${a}, ${s}, ${i});
      const ivec3 pads = ivec3(${t}, ${n}, ${r});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d2 = coords.u;

        ivec3 xFRCCorner = ivec3(coords.y, coords.z, coords.w) * strides - pads;
        int xFCorner = xFRCCorner.x;
        int xRCorner = xFRCCorner.y;
        int xCCorner = xFRCCorner.z;

        // Convolve x(?, ?, ?, d1) with w(:, :, :, d1, d2) to get
        // y(yF, yR, yC, d2). ? = to be determined. : = across all
        // values in that axis.
        float dotProd = 0.0;
        for (int wF = 0; wF < ${h}; wF++) {
          int xF = xFCorner + wF * ${o};

          if (xF < 0 || xF >= ${e.inDepth}) {
            continue;
          }

          for (int wR = 0; wR < ${p}; wR++) {
            int xR = xRCorner + wR * ${l};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int wC = 0; wC < ${d}; wC++) {
              int xC = xCCorner + wC * ${u};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              for (int d1 = 0; d1 < ${c}; d1 += 4) {
                vec4 xValues = vec4(
                  getX(batch, xF, xR, xC, d1),
                  getX(batch, xF, xR, xC, d1 + 1),
                  getX(batch, xF, xR, xC, d1 + 2),
                  getX(batch, xF, xR, xC, d1 + 3)
                );
                vec4 wValues = vec4(
                  getW(wF, wR, wC, d1, d2),
                  getW(wF, wR, wC, d1 + 1, d2),
                  getW(wF, wR, wC, d1 + 2, d2),
                  getW(wF, wR, wC, d1 + 3, d2)
                );

                dotProd += dot(xValues, wValues);
              }

              if (${1===f}) {
                dotProd +=
                  getX(batch, xF, xR, xC, ${c}) *
                  getW(wF, wR, wC, ${c}, d2);
              } else if (${2===f}) {
                vec2 xValues = vec2(
                  getX(batch, xF, xR, xC, ${c}),
                  getX(batch, xF, xR, xC, ${c} + 1)
                );
                vec2 wValues = vec2(
                  getW(wF, wR, wC, ${c}, d2),
                  getW(wF, wR, wC, ${c} + 1, d2)
                );
                dotProd += dot(xValues, wValues);
              } else if (${3===f}) {
                vec3 xValues = vec3(
                  getX(batch, xF, xR, xC, ${c}),
                  getX(batch, xF, xR, xC, ${c} + 1),
                  getX(batch, xF, xR, xC, ${c} + 2)
                );
                vec3 wValues = vec3(
                  getW(wF, wR, wC, ${c}, d2),
                  getW(wF, wR, wC, ${c} + 1, d2),
                  getW(wF, wR, wC, ${c} + 2, d2)
                );
                dotProd += dot(xValues, wValues);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class wB{constructor(e,t=!1,n=null,r=!1,a=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=yc(this.outputShape.length);const s=e.padInfo.left,i=e.strideWidth,o=e.dilationWidth,l=e.filterHeight,u=e.filterWidth;let h=`
       int xR; int xC; int xCOffset;
       vec4 wTexel; vec4 previous; vec4 final;`;for(let e=0;e<u;e++)h+=`
           vec4 xTexelC${2*e};
           int xTexelC${2*e}Ready;
           vec4 xTexelC${2*e+1};
           int xTexelC${2*e+1}Ready;
           vec4 xC${e};`;h+=`
     for (int r = 0; r < ${l}; r++) {
      for (int d1 = 0; d1 < ${e.inChannels}; d1 += 2) {
       `;for(let e=0;e<u;e++)h+=`
           xTexelC${2*e} = vec4(0.0);
           xTexelC${2*e}Ready = 0;
           xTexelC${2*e+1} = vec4(0.0);
           xTexelC${2*e+1}Ready = 0;
           xC${e} = vec4(0.0);`;h+=`
         xR = xRCorner + r * dilations[0];
         if (xR >=0 && xR < inDims[0]) {
       `;for(let t=0;t<(u+1)/2;t++){const n=2*t;if(h+=`
           xC = xCCorner + ${n*o};
           `,1===i){if(n<u&&(s%2==1?(h+=`
                 xCOffset = xC + 1;
                 if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${n}Ready == 0) {
                   xTexelC${n} = getX(batch, xR, xCOffset, d1);

                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${n}.zw = vec2(0.0);
                   }
                   xTexelC${n}Ready = 1;
                 }
               `,1===o&&n>0?h+=`
                 xC${n} = vec4(xTexelC${n-2}.zw, xTexelC${n}.xy);
                 `:h+=`
                   xCOffset = xC + 1 - 2;

                   if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       previous.zw = vec2(0.0);
                     }

                     xC${n} = vec4(previous.zw, xTexelC${n}.xy);
                   } else {
                     xC${n} = vec4(0.0, 0.0, xTexelC${n}.xy);
                   }
                   `):h+=`
                 if (xC >= 0 && xC < inDims[1] && xTexelC${n}Ready == 0) {
                   xTexelC${n} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${n}.zw = vec2(0.0);
                   }
                   xTexelC${n}Ready = 1;
                 }

                 xC${n} = xTexelC${n};
                 `,n+1<u)){const e=s%2==0?rR.util.nearestLargerEven(o):o;o%2==0&&s%2==1||o%2!=0&&s%2!=1?(h+=`
                   xCOffset = xC + imod(pads[1], 2) + ${e};

                   if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${n+1}Ready == 0) {
                     xTexelC${n+1} = getX(batch, xR, xCOffset, d1);

                     // Need to manually clear unused channels in case
                     // we're reading from recycled texture.
                     if (xCOffset + 1 >= inDims[1]) {
                       xTexelC${n+1}.zw = vec2(0.0);
                     }
                     xTexelC${n+1}Ready = 1;
                   }
                   `,o>1?h+=`
                     xCOffset -= 2;
                     if (xCOffset >= 0 && xCOffset < inDims[1]) {
                      previous = getX(batch, xR, xCOffset, d1);
                      xC${n+1} = vec4(previous.zw, xTexelC${n+1}.xy);
                     } else {
                      xC${n+1} = vec4(0.0, 0.0, xTexelC${n+1}.xy);
                     }
                     `:h+=`
                     xC${n+1} = vec4(xTexelC${n}.zw, xTexelC${n+1}.xy);
                     `):1===e?h+=`
                     xC${n+1} = xTexelC${n};
                     `:h+=`
                     xCOffset = xC + ${e};

                     if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${n+1}Ready == 0) {
                       xTexelC${n+1} = getX(batch, xR, xCOffset, d1);
                       if (xCOffset + 1 >= inDims[1]) {
                         xTexelC${n+1}.zw = vec2(0.0);
                       }
                       xTexelC${n+1}Ready = 1;
                     }

                     xC${n+1} = xTexelC${n+1};
                     `}}else n<u&&(s%2==1?(h+=`
                 xCOffset = xC + 1 - strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${n}Ready == 0) {
                   xTexelC${n} = getX(batch, xR, xCOffset, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${n}.zw = vec2(0.0);
                   }
                   xTexelC${n}Ready = 1;
                 }

                 if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${n+1}Ready == 0) {
                   xTexelC${n+1} = getX(batch, xR, xC + 1, d1);
                   // Need to manually clear unused channels in case
                   // we're reading from recycled texture.
                   if (xC + 2 >= inDims[1]) {
                     xTexelC${n+1}.zw = vec2(0.0);
                   }
                   xTexelC${n+1}Ready = 1;
                 }

                 xC${n} = vec4(xTexelC${n}.zw, xTexelC${n+1}.zw);
               `,n+1<u&&(h+=`
                   final = vec4(0.0);
                   xCOffset = xC + 1 + strides[1];
                   if(xCOffset >= 0 && xCOffset < inDims[1]) {
                     final = getX(batch, xR, xCOffset, d1);
                   }
                   xC${n+1} = vec4(xTexelC${n+1}.xy, final.xy);
                 `)):(h+=`
                 if(xC >= 0 && xC < inDims[1] && xTexelC${n}Ready == 0) {
                   xTexelC${n} = getX(batch, xR, xC, d1);
                   if (xC + 1 >= inDims[1]) {
                     xTexelC${n}.zw = vec2(0.0);
                   }
                   xTexelC${n}Ready = 1;
                 }

                 xCOffset = xC + strides[1];
                 if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${n+1}Ready == 0) {
                   xTexelC${n+1} = getX(batch, xR, xCOffset, d1);
                   if (xCOffset + 1 >= inDims[1]) {
                     xTexelC${n+1}.zw = vec2(0.);
                   }
                   xTexelC${n+1}Ready = 1;
                 }

                 xC${n} = vec4(
                   xTexelC${n}.xy, xTexelC${n+1}.xy);
               `,n+1<u&&(h+=`
                   xC${n+1} = vec4(xTexelC${n}.zw, xTexelC${n+1}.zw);
                 `)));n<u&&(h+=`
             wTexel = getW(r, ${n}, d1, d2);
             dotProd += xC${n}.xxzz * vec4(wTexel.xy, wTexel.xy);
             if(d1 + 1 < ${e.inChannels}) {
               dotProd += xC${n}.yyww * vec4(wTexel.zw, wTexel.zw);
             }
           `,n+1<u&&(h+=`
               wTexel = getW(r, ${n+1}, d1, d2);
               dotProd += xC${n+1}.xxzz * vec4(wTexel.xy, wTexel.xy);
               if(d1 + 1 < ${e.inChannels}) {
                 dotProd += xC${n+1}.yyww * vec4(wTexel.zw, wTexel.zw);
               }
             `))}h+=`
     }
   
     }
   
     }
   `;let p="",d="";n&&(p=r?`vec4 activation(vec4 a) {
           vec4 b = getPreluActivationWeightsAtOutCoords();
           ${n}
         }`:a?`vec4 activation(vec4 a) {
           vec4 b = getLeakyreluAlphaAtOutCoords();
           ${n}
         }`:`vec4 activation(vec4 x) {
           ${n}
         }`,d="result = activation(result);"),t&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),a&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
       ${p}

       void main() {
         ivec4 coords = getOutputCoords();
         int batch = coords.x;
         ivec2 xRCCorner = coords.yz * strides - pads;
         int d2 = coords.w;
         int xRCorner = xRCCorner.x;
         int xCCorner = xRCCorner.y;

         //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
         vec4 dotProd = vec4(0.000000000000001);

         ${h}

         vec4 result = dotProd - vec4(0.000000000000001);
         ${t?"result += getBiasAtOutCoords();":""}
         ${d}
         setOutput(result);
       }
     `}}class wW{constructor(e,t){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"inputShape",type:"ivec4"},{name:"pad",type:"ivec2"},{name:"stride",type:"ivec2"},{name:"dilation",type:"ivec2"},{name:"inChannels",type:"int"},{name:"itemsPerBlockRow",type:"int"},{name:"outWidth",type:"int"}],this.outputShape=e,this.enableShapeUniforms=yc(this.outputShape.length);const{dataFormat:n}=t,r=x3(),a="channelsLast"===n,s=a?1:2,i=a?2:3,o=this.enableShapeUniforms?"if(blockIndex < outShape[2] && pos < outShape[1]) {":`if(blockIndex < ${e[2]} && pos < ${e[1]}) {`;let l="";for(let e=0;e<=1;e++)for(let t=0;t<=1;t++)l+=`
          blockIndex = rc.z + ${t};
          pos = rc.y + ${e};

          ${o}
            offsetY = int(blockIndex / outWidth) * stride[0] - pad[0];
            d0 = offsetY + dilation[0] * (pos / itemsPerBlockRow);

            if(d0 < inputShape[${s}] && d0 >= 0) {
              // Use custom imod instead mod. On Intel GPU, mod may generate
              // unexpected value.
              // https://github.com/tensorflow/tfjs/issues/5447
              offsetX = imod(blockIndex, outWidth) * stride[1] - pad[1];
              d1 = offsetX + dilation[1] * (imod(pos, itemsPerBlockRow) /
                  inChannels);

              if(d1 < inputShape[${i}] && d1 >= 0) {

                ch = imod(pos, inChannels);

                if (${a}) {
                  innerDims = vec2(d1, ch);
                  result[${2*e+t}] = getChannel(
                    getA(rc.x, d0, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                } else {
                  innerDims = vec2(d0, d1);
                  result[${2*e+t}] = getChannel(
                    getA(rc.x, ch, int(innerDims.x),
                    int(innerDims.y)), innerDims);
                }
              }
            }
          }
        `;this.userCode=`
      void main() {
        ivec3 rc = getOutputCoords();

        vec4 result = vec4(0);

        int blockIndex, pos, offsetY, d0, offsetX, d1, ch;
        vec2 innerDims;

        ${l}

        ${r.output} = result;
      }
    `}}function wG(e,t){let n=e.length;return n>=3?t?[...e.slice(0,-3),e[n-3]*e[n-2],e[n-1]]:[...e.slice(0,-3),e[n-3],e[n-2]*e[n-1]]:!t&&1===n&&e[0]>1?[e[0],1]:null}function wU({x:e,filter:t,convInfo:n,backend:r,bias:a=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:o=null}){let l,u=e.shape,h=r.texData.get(e.dataId),p=n.inChannels,d=u[0]*u[1]*u[2],c=n.outChannels,f="channelsLast"===n.dataFormat,m=[];if(null!=s){let e=wG(s.shape,f);null!=e&&(s=vm({inputs:{x:s},backend:r,attrs:{shape:e}}),m.push(s))}if(null!=a){let e=wG(a.shape,f);null!=e&&(a=vm({inputs:{x:a},backend:r,attrs:{shape:e}}),m.push(a))}if(!((1===d||1===c)&&p>1e3)&&h.isPacked&&f&&null!=h.texture&&u[2]%2!=0&&rR.util.arraysEqual(h.shape.slice(-3),u.slice(-3))){let p=u[0]*u[1]*(u[2]+1),d={dataId:e.dataId,shape:[1,p,n.inChannels],dtype:e.dtype},c=h.shape;h.shape=h.shape.slice(),h.shape[h.shape.length-2]++,rR.util.assert(xG(h.shape,d.shape),()=>`packed reshape ${h.shape} to ${d.shape} isn't free`);let f=vm({inputs:{x:t},backend:r,attrs:{shape:[1,n.inChannels,n.outChannels]}});m.push(f);let g=vN({a:d,b:f,backend:r,transposeA:!1,transposeB:!1,bias:a,activation:o,preluActivationWeights:s,leakyreluAlpha:i}),x=r.texData.get(g.dataId);rR.util.assert(x.isPacked,()=>"batchMatMul result is expected to be packed"),h.shape=c,x.shape=n.outShape,(l=b6({inputs:{x:g},backend:r})).shape=n.outShape,m.push(g)}else{let u=n.outHeight*n.outWidth,h=vm({inputs:{x:e},backend:r,attrs:{shape:f?[n.batchSize,u,n.inChannels]:[n.batchSize,n.inChannels,u]}}),p=vm({inputs:{x:t},backend:r,attrs:{shape:[1,n.inChannels,n.outChannels]}}),d=vN({a:f?h:p,b:f?p:h,transposeA:!f,transposeB:!1,backend:r,bias:a,activation:o,preluActivationWeights:s,leakyreluAlpha:i});l=vm({inputs:{x:d},backend:r,attrs:{shape:n.outShape}}),m.push(h),m.push(p),m.push(d)}for(let e of m)r.disposeIntermediateTensorInfo(e);return l}function wV({x:e,filter:t,convInfo:n,backend:r,bias:a=null,preluActivationWeights:s=null,leakyreluAlpha:i=0,activation:o=null}){let{filterWidth:l,filterHeight:u,inChannels:h,outWidth:p,outHeight:d,dataFormat:c}=n,f="channelsLast"===c,m=l*u*h,g=d*p,x=[n.batchSize,m,g],y=[];if(null!=s){let e=wG(s.shape,f);null!=e&&(s=vm({inputs:{x:s},backend:r,attrs:{shape:e}}),y.push(s))}if(null!=a){let e=wG(a.shape,f);null!=e&&(a=vm({inputs:{x:a},backend:r,attrs:{shape:e}}),y.push(a))}let b=vm({inputs:{x:t},backend:r,attrs:{shape:[1,m,rR.util.sizeFromShape(t.shape)/m]}});y.push(b);let v=new wW(x,n),w=[e.shape,[n.padInfo.top,n.padInfo.left],[n.strideHeight,n.strideWidth],[n.dilationHeight,n.dilationWidth],[n.inChannels],[n.filterWidth*n.inChannels],[n.outWidth]],I=r.runWebGLProgram(v,[e],"float32",w),C=vm({inputs:{x:I},backend:r,attrs:{shape:x}});y.push(I),y.push(C);let k=null!=a,S=null!=s,T="leakyrelu"===o,N=o?vu(o,!0):null,$=new vh(f?C.shape:b.shape,f?b.shape:C.shape,f?[n.batchSize,g,n.outChannels]:[n.batchSize,n.outChannels,g],!0,!1,k,N,S,T),R=f?[C,b]:[b,C];if(a&&R.push(a),S&&R.push(s),T){let e=r.makeTensorInfo([],"float32",rR.util.createScalarValue(i,"float32"));R.push(e),y.push(e)}let A=r.runWebGLProgram($,R,"float32"),E=vm({inputs:{x:A},backend:r,attrs:{shape:n.outShape}});for(let e of(y.push(A),y))r.disposeIntermediateTensorInfo(e);return E}let wH={kernelName:x.Conv2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s,filter:i}=n,{strides:o,pad:l,dataFormat:u,dilations:h,dimRoundingMode:p}=a,d=tN.convertConv2DDataFormat(u),c=tN.computeConv2DInfo(s.shape,i.shape,o,h,l,p,!1,d);if(1===c.filterHeight&&1===c.filterWidth&&1===c.dilationHeight&&1===c.dilationWidth&&1===c.strideHeight&&1===c.strideWidth&&("SAME"===c.padInfo.type||"VALID"===c.padInfo.type))t=wU({x:s,filter:i,convInfo:c,backend:r});else if(c.strideWidth<=2&&"channelsLast"===d&&(0,rN.env)().getBool("WEBGL_EXP_CONV")){let e=new wB(c),n=[[c.padInfo.top,c.padInfo.left],[c.strideHeight,c.strideWidth],[c.dilationHeight,c.dilationWidth],[c.inHeight,c.inWidth]];t=r.runWebGLProgram(e,[s,i],"float32",n)}else if((0,rN.env)().getBool("WEBGL_CONV_IM2COL"))t=wV({x:s,filter:i,convInfo:c,backend:r});else{let e=new wM(c);t=r.runWebGLProgram(e,[s,i],"float32")}let f=vm({inputs:{x:t},backend:r,attrs:{shape:c.outShape}});return r.disposeIntermediateTensorInfo(t),f}};var tN=tN;class wq{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideHeight,n=e.strideWidth,r=e.padInfo.top,a=e.padInfo.left,s="channelsLast"===e.dataFormat;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int d2 = coords.w;

        // Convolve x(?, ?, d1) with dy(:, :, d2) to get dw(wR, wC, d1, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${r};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${n} - ${a};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              ${s?`float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);`:`float dyValue = getDy(b, d2, yR, yC);
              float xValue = getX(b, d1, xR, xC);
              dotProd += (xValue * dyValue);`}
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class wj{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterHeight,n=e.filterWidth,r=e.strideHeight,a=e.strideWidth,s="channelsLast"===e.dataFormat,i=t-1-e.padInfo.top,o=n-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${o});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[${s?3:1}];

        ivec2 dyCorner = ivec2(coords[${s?1:2}], coords[${s?2:3}]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${r}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${n}; wC++) {
            float dyC = float(dyCCorner + wC) / ${a}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${n} - 1 - wC;

            for (int d2 = 0; d2 < ${e.outChannels}; d2++) {

              if (${s}) {
                float xValue = getDy(batch, idyR, idyC, d2);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              } else {
                float xValue = getDy(batch, d2, idyR, idyC);
                float wValue = getW(wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }

            }
          }
        }
        setOutput(dotProd);
      }
    `}}class wX{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideDepth,n=e.strideHeight,r=e.strideWidth,a=e.padInfo.front,s=e.padInfo.top,i=e.padInfo.left;this.userCode=`
      void main() {
        ivec5 coords = getOutputCoords();
        int wF = coords.x;
        int wR = coords.y;
        int wC = coords.z;
        int d1 = coords.w;
        int d2 = coords.u;

        float dotProd = 0.0;

        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yF = 0; yF < ${e.outDepth}; yF++) {
            int xF = wF + yF * ${t} - ${a};

            if (xF < 0 || xF >= ${e.inDepth}) {
              continue;
            }

            for (int yR = 0; yR < ${e.outHeight}; yR++) {
              int xR = wR + yR * ${n} - ${s};

              if (xR < 0 || xR >= ${e.inHeight}) {
                continue;
              }

              for (int yC = 0; yC < ${e.outWidth}; yC++) {
                int xC = wC + yC * ${r} - ${i};

                if (xC < 0 || xC >= ${e.inWidth}) {
                  continue;
                }

                float dyValue = getDy(b, yF, yR, yC, d2);
                float xValue = getX(b, xF, xR, xC, d1);
                dotProd += (xValue * dyValue);
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class wK{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterDepth,n=e.filterHeight,r=e.filterWidth,a=e.strideDepth,s=e.strideHeight,i=e.strideWidth,o=t-1-e.padInfo.front,l=n-1-e.padInfo.top,u=r-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${o}, ${l}, ${u});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.u;


        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyFCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        float dotProd = 0.0;
        for (int wF = 0; wF < ${t}; wF++) {
          float dyF = float(dyFCorner + wF) / ${a}.0;

          if (dyF < 0.0 || dyF >= ${e.outDepth}.0 || fract(dyF) > 0.0) {
            continue;
          }
          int idyF = int(dyF);

          int wFPerm = ${t} - 1 - wF;

          for (int wR = 0; wR < ${n}; wR++) {
            float dyR = float(dyRCorner + wR) / ${s}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
              fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            int wRPerm = ${n} - 1 - wR;

            for (int wC = 0; wC < ${r}; wC++) {
              float dyC = float(dyCCorner + wC) / ${i}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              int wCPerm = ${r} - 1 - wC;

              for (int d2 = 0; d2 < ${e.outChannels}; d2++) {
                float xValue = getDy(batch, idyF, idyR, idyC, d2);
                float wValue = getW(wFPerm, wRPerm, wCPerm, d1, d2);
                dotProd += xValue * wValue;
              }
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let wY={kernelName:x.Conv2DBackpropFilter,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,dy:s}=t,{strides:i,pad:o,dataFormat:l,dimRoundingMode:u,filterShape:h}=r,p=tN.convertConv2DDataFormat(l),d=new wq(tN.computeConv2DInfo(a.shape,h,i,1,o,u,!1,p));return n.runWebGLProgram(d,[a,s],"float32")}};var tN=tN;class wZ{constructor(e){this.variableNames=["dy","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"strides",type:"vec2"}],this.outputShape=e.inShape,this.enableShapeUniforms=yc(this.outputShape.length);const t=e.filterHeight,n=e.filterWidth,r=t-1-e.padInfo.top,a=n-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${r}, ${a});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];

        ivec2 dyCorner = ivec2(coords[1], coords[2]) - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        vec4 result = vec4(0.);
        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / strides[0];
          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);
          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${n}; wC++) {
            int wCPerm = ${n} - 1 - wC;

            float dyC = float(dyCCorner + wC) / strides[1];
            bool idyCVal = (dyC >= 0.0) && (dyC < ${e.outWidth}.0)
              && (fract(dyC) == 0.0);
            int idyC = int(dyC);

            float dyC2 = float(dyCCorner + wC + 1) / strides[1];
            bool idyCVal2 = (dyC2 >= 0.0) && (dyC2 < ${e.outWidth}.0)
              && (fract(dyC2) == 0.0);
            int idyC2 = int(dyC2);

            if (idyCVal && idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec4 dySample2 = (idyC / 2 == idyC2 / 2) ?
                  dySample : getDy(batch, idyR, idyC2, d2);

                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));

                dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample2.xy : dySample2.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC, d2);
                vec2 dyValue = mod(float(idyC), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.xy += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            } else if (idyCVal2) {
              for (int d2 = 0; d2 < ${e.outChannels}; d2 += 2) {
                vec4 wValue = getW(wRPerm, wCPerm, d1, d2);
                vec4 dySample = getDy(batch, idyR, idyC2, d2);
                vec2 dyValue = mod(float(idyC2), 2.) == 0. ?
                  dySample.xy : dySample.zw;
                result.zw += vec2(dot(dyValue, wValue.xy),
                  dot(dyValue, wValue.zw));
              }
            }
          }
        }
        setOutput(result);
      }
    `}}let wJ={kernelName:x.Conv2DBackpropInput,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,filter:s}=t,{inputShape:i,strides:o,pad:l,dataFormat:u,dimRoundingMode:h}=r,p=tN.convertConv2DDataFormat(u),d=tN.computeConv2DInfo(i,s.shape,o,1,l,h,!1,p);if((0,rN.env)().getBool("WEBGL_PACK_CONV2DTRANSPOSE")&&"channelsLast"===p){let e=[[d.strideHeight,d.strideWidth]],t=new wZ(d);return n.runWebGLProgram(t,[a,s],"float32",e)}{let e=new wj(d);return n.runWebGLProgram(e,[a,s],"float32")}}};var tN=tN;let wQ={kernelName:x.Conv3D,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,filter:s}=t,{strides:i,pad:o,dilations:l}=r,u=new wP(tN.computeConv3DInfo(a.shape,s.shape,i,l,o));return n.runWebGLProgram(u,[a,s],"float32")}};var tN=tN;let w0={kernelName:x.Conv3DBackpropFilterV2,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,dy:s}=t,{strides:i,pad:o,filterShape:l}=r,u=new wX(tN.computeConv3DInfo(a.shape,l,i,1,o));return n.runWebGLProgram(u,[a,s],"float32")}};var tN=tN;let w1={kernelName:x.Conv3DBackpropInputV2,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,filter:s}=t,{pad:i,strides:o,inputShape:l}=r,u=new wK(tN.computeConv3DInfo(l,s.shape,o,1,i));return n.runWebGLProgram(u,[a,s],"float32")}},w2=vo({opSnippet:vi+`
  return cos(x);
`,packedOpSnippet:`
  vec4 result = cos(x);
  bvec4 isNaN = isnan(x);
  ${b4}
  return result;
`}),w3={kernelName:x.Cos,backendName:"webgl",kernelFunc:w2},w4=vo({opSnippet:`
  float e2x = exp(-x);
  return (e2x + 1.0 / e2x) / 2.0;
`}),w5={kernelName:x.Cosh,backendName:"webgl",kernelFunc:w4};class w6{constructor(e,t,n,r,a){this.variableNames=["Image","Boxes","BoxInd"],this.outputShape=[];const[s,i,o,l]=e,[u]=t,[h,p]=n;this.outputShape=[u,h,p,l];const[d,c]=[`${i-1}.0`,`${o-1}.0`],[f,m,g]=h>1?[`${(i-1)/(h-1)}`,"(y2-y1) * height_ratio",`y1*${d} + float(y)*(height_scale)`]:["0.0","0.0",`0.5 * (y1+y2) * ${d}`],[x,y,b]=p>1?[`${(o-1)/(p-1)}`,"(x2-x1) * width_ratio",`x1*${c} + float(x)*(width_scale)`]:["0.0","0.0",`0.5 * (x1+x2) * ${c}`];this.userCode=`
      const float height_ratio = float(${f});
      const float width_ratio = float(${x});
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int y = coords[1];
        int x = coords[2];
        int d = coords[3];

        // get box vals
        float y1 = getBoxes(b,0);
        float x1 = getBoxes(b,1);
        float y2 = getBoxes(b,2);
        float x2 = getBoxes(b,3);

        // get image in batch index
        int bInd = round(getBoxInd(b));
        if(bInd < 0 || bInd >= ${s}) {
          return;
        }

        float height_scale = ${m};
        float width_scale = ${y};

        float in_y = ${g};
        if( in_y < 0.0 || in_y > ${d} ) {
          setOutput(float(${a}));
          return;
        }
        float in_x = ${b};
        if( in_x < 0.0 || in_x > ${c} ) {
          setOutput(float(${a}));
          return;
        }

        vec2 sourceFracIndexCR = vec2(in_x,in_y);
        if(${+("bilinear"===r)} == 1) {
          // Compute the four integer indices.
          ivec2 sourceFloorCR = ivec2(sourceFracIndexCR);
          ivec2 sourceCeilCR = ivec2(ceil(sourceFracIndexCR));

          float topLeft = getImage(b, sourceFloorCR.y, sourceFloorCR.x, d);
          float bottomLeft = getImage(b, sourceCeilCR.y, sourceFloorCR.x, d);
          float topRight = getImage(b, sourceFloorCR.y, sourceCeilCR.x, d);
          float bottomRight = getImage(b, sourceCeilCR.y, sourceCeilCR.x, d);

          vec2 fracCR = sourceFracIndexCR - vec2(sourceFloorCR);

          float top = topLeft + (topRight - topLeft) * fracCR.x;
          float bottom = bottomLeft + (bottomRight - bottomLeft) * fracCR.x;
          float newValue = top + (bottom - top) * fracCR.y;
          setOutput(newValue);
        } else {
          // Compute the coordinators of nearest neighbor point.
          ivec2 sourceNearestCR = ivec2(floor(
            sourceFracIndexCR + vec2(0.5,0.5)));
          float newValue = getImage(b, sourceNearestCR.y, sourceNearestCR.x, d);
          setOutput(newValue);
        }
      }
    `}}let w8={kernelName:x.CropAndResize,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{image:a,boxes:s,boxInd:i}=t,{cropSize:o,method:l,extrapolationValue:u}=r,h=new w6(a.shape,s.shape,o,l,u);return n.runWebGLProgram(h,[a,s,i],"float32")}};(h=g||(g={})).Prod="*",h.Sum="+";class w9{constructor(e,t,n,r){this.op=e,this.outputShape=t,this.variableNames=["x"],this.customUniforms=[{name:"index",type:"float"}];const a=this.outputShape.length,s=this.op===g.Prod?"1.0":"0.0",i=n?s:`getX(${w7(a,"coords",this.op)})`,o=this.outputShape[this.outputShape.length-1];let l="",u="";n?(l=r?`end != ${o-1}`:"end != 0",u=r?"end + 1":"end - 1"):(l=r?`end + pow2 < ${o}`:"end >= pow2",u=r?"end + pow2":"end - pow2"),this.userCode=`
      void main() {
        ${yo(a)} coords = getOutputCoords();
        int end = ${Ie(a,"coords",this.op)};
        float val = ${i};
        int pow2 = int(pow(2.0, index));
        if (${l}) {
          int idx = ${u};
          ${Ie(a,"coords",this.op)} = idx;
          val ${this.op}= getX(${w7(a,"coords",this.op)});
        }
        setOutput(val);
      }
    `}}function w7(e,t,n){if(1===e)return`${t}`;if(2===e)return`${t}.x, ${t}.y`;if(3===e)return`${t}.x, ${t}.y, ${t}.z`;if(4===e)return`${t}.x, ${t}.y, ${t}.z, ${t}.w`;throw Error(`Cumulative ${n} for rank ${e} is not yet supported`)}function Ie(e,t,n){if(1===e)return`${t}`;if(2===e)return`${t}.y`;if(3===e)return`${t}.z`;if(4===e)return`${t}.w`;throw Error(`Cumulative ${n} for rank ${e} is not yet supported`)}var tN=tN;function It(e,t,n,r,a,s){let i=t.shape.length,o=tN.getAxesPermutation([r],i),l=t;null!=o&&(l=vS({inputs:{x:t},backend:n,attrs:{perm:o}}));let u=tN.getInnerMostAxes(1,i)[0];if(u!==i-1)throw Error(`WebGL cumprod shader expects an inner-most axis=${t.shape.length-1} but got axis=${r}`);let h=l.shape[u],p=b6({inputs:{x:l},backend:n});for(let t=0;t<=Math.ceil(Math.log2(h))-1;t++){let r=new w9(e,l.shape,!1,s),a=[[t]],i=p;p=n.runWebGLProgram(r,[p],p.dtype,a),n.disposeIntermediateTensorInfo(i)}if(a){let t=new w9(e,l.shape,a,s),r=p;p=n.runWebGLProgram(t,[p],p.dtype),n.disposeIntermediateTensorInfo(r)}if(null!=o){let e=vS({inputs:{x:p},backend:n,attrs:{perm:tN.getUndoAxesPermutation(o)}});return n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(l),e}return p}let In={kernelName:x.Cumprod,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,exclusive:i,reverse:o}=r;return It(g.Prod,a,n,s,i,o)}},Ir={kernelName:x.Cumsum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{axis:s,exclusive:i,reverse:o}=r;return It(g.Sum,a,n,s,i,o)}},Ia={kernelName:x.DenseBincount,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,weights:s}=t,{size:i,binaryOutput:o}=r;if(1===a.shape.length){let e=yH(n.readSync(a.dataId),n.readSync(s.dataId),s.dtype,s.shape,i);return n.makeTensorInfo([i],s.dtype,e)}if(2===a.shape.length){let e=yq(n.bufferSync(a),n.bufferSync(s),i,o);return n.makeTensorInfo(e.shape,s.dtype,e.values)}throw Error(`Error in denseBincount: input must be at most rank 2, but got rank${a.shape.length}.`)}};class Is{constructor(e,t,n){this.variableNames=["x"],this.outputShape=[],this.outputShape=e,this.blockSize=t,this.dataFormat=n,this.userCode=`
    void main() {
      ivec4 coords = getOutputCoords();
      int b = coords[0];
      int h = ${this.getHeightCoordString()};
      int w = ${this.getWidthCoordString()};
      int d = ${this.getDepthCoordString()};

      int in_h = h / ${t};
      int offset_h = imod(h, ${t});
      int in_w = w / ${t};
      int offset_w = imod(w, ${t});
      int offset_d = (offset_h * ${t} + offset_w) *
        ${this.getOutputDepthSize()};
      int in_d = d + offset_d;

      float result = ${this.getInputSamplingString()};
      setOutput(result);
    }
  `}getHeightCoordString(){return"NHWC"===this.dataFormat?"coords[1]":"coords[2]"}getWidthCoordString(){return"NHWC"===this.dataFormat?"coords[2]":"coords[3]"}getDepthCoordString(){return"NHWC"===this.dataFormat?"coords[3]":"coords[1]"}getOutputDepthSize(){return"NHWC"===this.dataFormat?this.outputShape[3]:this.outputShape[1]}getInputSamplingString(){return"NHWC"===this.dataFormat?"getX(b, in_h, in_w, in_d)":"getX(b, in_d, in_h, in_w)"}}let Ii={kernelName:x.DepthToSpace,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{blockSize:s,dataFormat:i}=r,o=a.shape[0],l="NHWC"===i?a.shape[1]:a.shape[2],u="NHWC"===i?a.shape[2]:a.shape[3],h="NHWC"===i?a.shape[3]:a.shape[1],p=l*s,d=u*s,c=h/(s*s),f=new Is("NHWC"===i?[o,p,d,c]:[o,c,p,d],s,i);return n.runWebGLProgram(f,[a],a.dtype)}};var tN=tN;class Io{constructor(e,t=!1,n=null,r=!1,a=!1){this.variableNames=["x","W"],this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=yc(this.outputShape.length);const s=e.filterHeight,i=e.filterWidth,o=e.outChannels/e.inChannels;let l="",u="";n&&(l=r?`float activation(float a) {
          float b = getPreluActivationWeightsAtOutCoords();
          ${n}
        }`:a?`float activation(float a) {
          float b = getLeakyreluAlphaAtOutCoords();
          ${n}
        }`:`
          float activation(float x) {
            ${n}
          }
        `,u="result = activation(result);"),t&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),a&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${l}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${o};
        int q = d2 - d1 * ${o};

        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        // Convolve x(?, ?, d1) with w(:, :, d1, q) to get y(yR, yC, d2).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        // TO DO(dsmilkov): Flatten the two for loops and vec4 the operations.
        for (int wR = 0; wR < ${s}; wR++) {
          int xR = xRCorner + wR * dilations[0];

          if (xR < 0 || xR >= inDims[0]) {
            continue;
          }

          for (int wC = 0; wC < ${i}; wC++) {
            int xC = xCCorner + wC * dilations[1];

            if (xC < 0 || xC >= inDims[1]) {
              continue;
            }

            float xVal = getX(batch, xR, xC, d1);
            float wVal = getW(wR, wC, d1, q);
            dotProd += xVal * wVal;
          }
        }

        float result = dotProd;
        ${t?"result += getBiasAtOutCoords();":""}
        ${u}
        setOutput(result);
      }
    `}}class Il{constructor(e,t=!1,n=null,r=!1,a=!1){this.variableNames=["x","W"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"pads",type:"ivec2"},{name:"strides",type:"ivec2"},{name:"dilations",type:"ivec2"},{name:"inDims",type:"ivec2"}],this.outputShape=e.outShape,this.enableShapeUniforms=yc(this.outputShape.length);const s=e.outChannels/e.inChannels,i=e.padInfo.left,o=e.strideWidth,l=e.dilationWidth,u=e.filterHeight,h=e.filterWidth;let p=`
      int xR; int xC; int xCOffset;
      vec4 wTexel; vec4 previous; vec4 final;`;for(let e=0;e<h;e++)p+=`
          vec4 xTexelC${2*e};
          int xTexelC${2*e}Ready;
          vec4 xTexelC${2*e+1};
          int xTexelC${2*e+1}Ready;
          vec4 xC${e};`;p+=`
    for (int r = 0; r < ${u}; r++) {
      `;for(let e=0;e<h;e++)p+=`
          xTexelC${2*e} = vec4(0.0);
          xTexelC${2*e}Ready = 0;
          xTexelC${2*e+1} = vec4(0.0);
          xTexelC${2*e+1}Ready = 0;
          xC${e} = vec4(0.0);`;p+=`
        xR = xRCorner + r * dilations[0];
        if (xR >=0 && xR < inDims[0]) {
      `;for(let e=0;e<(h+1)/2;e++){const t=2*e;if(p+=`
          xC = xCCorner + ${t*l};
          `,1===o){if(t<h&&(i%2==1?(p+=`
                xCOffset = xC + 1;
                if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xCOffset, d1);

                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }
              `,1===l&&t>0?p+=`
                xC${t} = vec4(xTexelC${t-2}.zw, xTexelC${t}.xy);
                `:p+=`
                  xCOffset = xC + 1 - 2;

                  if (xCOffset >= 0 && xCOffset < inDims[1]) {
                    previous = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      previous.zw = vec2(0.0);
                    }

                    xC${t} = vec4(previous.zw, xTexelC${t}.xy);
                  } else {
                    xC${t} = vec4(0.0, 0.0, xTexelC${t}.xy);
                  }
                  `):p+=`
                if (xC >= 0 && xC < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }

                xC${t} = xTexelC${t};
                `,t+1<h)){const e=i%2==0?rR.util.nearestLargerEven(l):l;l%2==0&&i%2==1||l%2!=0&&i%2!=1?(p+=`
                  xCOffset = xC + imod(pads[1], 2) + ${e};

                  if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t+1}Ready == 0) {
                    xTexelC${t+1} = getX(batch, xR, xCOffset, d1);

                    // Need to manually clear unused channels in case
                    // we're reading from recycled texture.
                    if (xCOffset + 1 >= inDims[1]) {
                      xTexelC${t+1}.zw = vec2(0.0);
                    }
                    xTexelC${t+1}Ready = 1;
                  }
                  `,l>1?p+=`
                    xCOffset -= 2;
                    if (xCOffset >= 0 && xCOffset < inDims[1]) {
                     previous = getX(batch, xR, xCOffset, d1);
                     xC${t+1} = vec4(previous.zw, xTexelC${t+1}.xy);
                    } else {
                     xC${t+1} = vec4(0.0, 0.0, xTexelC${t+1}.xy);
                    }
                    `:p+=`
                    xC${t+1} = vec4(xTexelC${t}.zw, xTexelC${t+1}.xy);
                    `):1===e?p+=`
                    xC${t+1} = xTexelC${t};
                    `:p+=`
                    xCOffset = xC + ${e};

                    if (xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t+1}Ready == 0) {
                      xTexelC${t+1} = getX(batch, xR, xCOffset, d1);
                      if (xCOffset + 1 >= inDims[1]) {
                        xTexelC${t+1}.zw = vec2(0.0);
                      }
                      xTexelC${t+1}Ready = 1;
                    }

                    xC${t+1} = xTexelC${t+1};
                    `}}else t<h&&(i%2==1?(p+=`
                xCOffset = xC + 1 - strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xCOffset, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }

                if(xC + 1 >= 0 && xC + 1 < inDims[1] && xTexelC${t+1}Ready == 0) {
                  xTexelC${t+1} = getX(batch, xR, xC + 1, d1);
                  // Need to manually clear unused channels in case
                  // we're reading from recycled texture.
                  if (xC + 2 >= inDims[1]) {
                    xTexelC${t+1}.zw = vec2(0.0);
                  }
                  xTexelC${t+1}Ready = 1;
                }

                xC${t} = vec4(xTexelC${t}.zw, xTexelC${t+1}.zw);
              `,t+1<h&&(p+=`
                  final = vec4(0.0);
                  xCOffset = xC + 1 + strides[1];
                  if(xCOffset >= 0 && xCOffset < inDims[1]) {
                    final = getX(batch, xR, xCOffset, d1);
                  }
                  xC${t+1} = vec4(xTexelC${t+1}.xy, final.xy);
                `)):(p+=`
                if(xC >= 0 && xC < inDims[1] && xTexelC${t}Ready == 0) {
                  xTexelC${t} = getX(batch, xR, xC, d1);
                  if (xC + 1 >= inDims[1]) {
                    xTexelC${t}.zw = vec2(0.0);
                  }
                  xTexelC${t}Ready = 1;
                }

                xCOffset = xC + strides[1];
                if(xCOffset >= 0 && xCOffset < inDims[1] && xTexelC${t+1}Ready == 0) {
                  xTexelC${t+1} = getX(batch, xR, xCOffset, d1);
                  if (xCOffset + 1 >= inDims[1]) {
                    xTexelC${t+1}.zw = vec2(0.);
                  }
                  xTexelC${t+1}Ready = 1;
                }

                xC${t} = vec4(
                  xTexelC${t}.xy, xTexelC${t+1}.xy);
              `,t+1<h&&(p+=`
                  xC${t+1} = vec4(xTexelC${t}.zw, xTexelC${t+1}.zw);
                `)));t<h&&(p+=`
            wTexel = getW(r, ${t}, d1, q);
            dotProd += xC${t} * vec4(wTexel.xz, wTexel.xz);
          `,t+1<h&&(p+=`
              wTexel = getW(r, ${t+1}, d1, q);
              dotProd += xC${t+1} * vec4(wTexel.xz, wTexel.xz);
            `))}p+=`
    }
  
      }
    `;let d="",c="";n&&(d=r?`vec4 activation(vec4 a) {
          vec4 b = getPreluActivationWeightsAtOutCoords();
          ${n}
        }`:a?`vec4 activation(vec4 a) {
          vec4 b = getLeakyreluAlphaAtOutCoords();
          ${n}
        }`:`vec4 activation(vec4 x) {
          ${n}
        }`,c="result = activation(result);"),t&&this.variableNames.push("bias"),r&&this.variableNames.push("preluActivationWeights"),a&&this.variableNames.push("leakyreluAlpha"),this.userCode=`
      ${d}

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        ivec2 xRCCorner = coords.yz * strides - pads;
        int d2 = coords.w;
        int d1 = d2 / ${s};
        int q = d2 - d1 * ${s};
        int xRCorner = xRCCorner.x;
        int xCCorner = xRCCorner.y;

        //intialize dotProd with a small epsilon seems to reduce GPU accuracy loss.
        vec4 dotProd = vec4(0.000000000000001);

        ${p}

        vec4 result = dotProd - vec4(0.000000000000001);
        ${t?"result += getBiasAtOutCoords();":""}
        ${c}
        setOutput(result);
      }
    `}}let Iu={kernelName:x.DepthwiseConv2dNative,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s,filter:i}=n,{strides:o,pad:l,dilations:u,dimRoundingMode:h}=a,p=u;null==p&&(p=[1,1]),rR.util.assert(tN.eitherStridesOrDilationsAreOne(o,p),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${o} and dilations '${p}'`);let d=tN.computeConv2DInfo(s.shape,i.shape,o,p,l,h,!0);t=(0,rN.env)().getBool("WEBGL_PACK_DEPTHWISECONV")&&d.strideWidth<=2&&d.outChannels/d.inChannels==1?new Il(d):new Io(d);let c=[[d.padInfo.top,d.padInfo.left],[d.strideHeight,d.strideWidth],[d.dilationHeight,d.dilationWidth],[d.inHeight,d.inWidth]];return r.runWebGLProgram(t,[s,i],"float32",c)}};var tN=tN;class Ih{constructor(e){this.variableNames=["x","dy"],this.outputShape=e.filterShape;const t=e.strideHeight,n=e.strideWidth,r=e.padInfo.top,a=e.padInfo.left,s=e.outChannels/e.inChannels;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int wR = coords.x;
        int wC = coords.y;
        int d1 = coords.z;
        int dm = coords.w;
        int d2 = d1 * ${s} + dm;

        float dotProd = 0.0;

        // TO DO: Vec4 over the batch size
        for (int b = 0; b < ${e.batchSize}; b++) {
          for (int yR = 0; yR < ${e.outHeight}; yR++) {
            int xR = wR + yR * ${t} - ${r};

            if (xR < 0 || xR >= ${e.inHeight}) {
              continue;
            }

            for (int yC = 0; yC < ${e.outWidth}; yC++) {
              int xC = wC + yC * ${n} - ${a};

              if (xC < 0 || xC >= ${e.inWidth}) {
                continue;
              }

              float dyValue = getDy(b, yR, yC, d2);
              float xValue = getX(b, xR, xC, d1);
              dotProd += (xValue * dyValue);
            }
          }
        }
        setOutput(dotProd);
      }
    `}}class Ip{constructor(e){this.variableNames=["dy","W"],this.outputShape=e.inShape;const t=e.filterHeight,n=e.filterWidth,r=e.strideHeight,a=e.strideWidth,s=t-1-e.padInfo.top,i=n-1-e.padInfo.left,o=e.outChannels/e.inChannels;this.userCode=`
      const ivec2 pads = ivec2(${s}, ${i});

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords[0];
        int d1 = coords[3];
        ivec2 dyCorner = coords.yz - pads;
        int dyRCorner = dyCorner.x;
        int dyCCorner = dyCorner.y;

        float dotProd = 0.0;

        for (int wR = 0; wR < ${t}; wR++) {
          float dyR = float(dyRCorner + wR) / ${r}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          int wRPerm = ${t} - 1 - wR;

          for (int wC = 0; wC < ${n}; wC++) {
            float dyC = float(dyCCorner + wC) / ${a}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            int wCPerm = ${n} - 1 - wC;

            // TO DO: Vec4 over the channelMul
            for (int dm = 0; dm < ${o}; dm++) {
              int d2 = d1 * ${o} + dm;
              float xValue = getDy(batch, idyR, idyC, d2);
              float wValue = getW(wRPerm, wCPerm, d1, dm);
              dotProd += xValue * wValue;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let Id={kernelName:x.DepthwiseConv2dNativeBackpropFilter,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,dy:s}=t,{strides:i,dilations:o,pad:l,dimRoundingMode:u,filterShape:h}=r,p=new Ih(tN.computeConv2DInfo(a.shape,h,i,o,l,u,!0));return n.runWebGLProgram(p,[a,s],"float32")}};var tN=tN;let Ic={kernelName:x.DepthwiseConv2dNativeBackpropInput,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,filter:s}=t,{strides:i,dilations:o,pad:l,dimRoundingMode:u,inputShape:h}=r,p=new Ip(tN.computeConv2DInfo(h,s.shape,i,o,l,u,!0));return n.runWebGLProgram(p,[a,s],"float32")}};class If{constructor(e){this.variableNames=["X"],this.outputShape=[e,e],this.userCode=`
      void main() {
          ivec2 coords = getOutputCoords();
          float val = coords[0] == coords[1] ? getX(coords[0]) : 0.0;
          setOutput(val);
      }
    `}}let Im={kernelName:x.Diag,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{x:r}=t,a=[...r.shape,...r.shape],s=rR.util.sizeFromShape(r.shape),i=vm({inputs:{x:r},backend:n,attrs:{shape:[s]}}),o=new If(s),l=n.runWebGLProgram(o,[i],i.dtype),u=vm({inputs:{x:l},backend:n,attrs:{shape:a}});return n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(l),u}};var tN=tN;class Ig{constructor(e){this.variableNames=["x","W"],this.outputShape=e.outShape;const{inHeight:t,inWidth:n,padInfo:r,strideHeight:a,strideWidth:s,filterHeight:i,filterWidth:o,dilationHeight:l,dilationWidth:u}=e,{top:h,left:p}=r;this.userCode=`
      const ivec2 strides = ivec2(${a}, ${s});
      const ivec2 pads = ivec2(${h}, ${p});
      const float neg_infinity = -3.4e38;

      void main() {
        ivec4 coords = getOutputCoords();
        int batch = coords.x;
        int d1 = coords.w;
        ivec2 outTopLeftCorner =
            coords.yz * strides - pads;
        int hBeg = outTopLeftCorner.x;
        int wBeg = outTopLeftCorner.y;

        float curVal = neg_infinity;
        for (int h = 0; h < ${i}; h++) {
          int hIn = hBeg + h * ${l};

          if (hIn >= 0 && hIn < ${t}) {
            for (int w = 0; w < ${o}; w++) {
              int wIn = wBeg + w * ${u};

              if (wIn >= 0 && wIn < ${n}) {
                float xVal = getX(batch, hIn, wIn, d1);
                float wVal = getW(h, w, d1);

                float val = xVal + wVal;
                if (val > curVal) {
                  curVal = val;
                }
              }
            }
          }
        }

        float result = curVal;
        setOutput(result);
      }
    `}}let Ix={kernelName:x.Dilation2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s,filter:i}=n,{strides:o,pad:l,dilations:u}=a,h=tN.computeDilation2DInfo(s.shape,i.shape,o,l,"NHWC",u),p=new Ig(h),d=vm({inputs:{x:t=r.runWebGLProgram(p,[s,i],"float32")},backend:r,attrs:{shape:h.outShape}});return r.disposeIntermediateTensorInfo(t),d}};var tN=tN;let Iy={kernelName:x.Einsum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{equation:a}=r,{allDims:s,summedDims:i,idDims:o}=tN.decodeEinsumEquation(a,t.length);tN.checkEinsumDimSizes(s.length,o,t);let{path:l,steps:u}=tN.getEinsumComputePath(i,o),h=u.length,p=null,d=s.length,c=[];for(let e=0;e<h;++e){for(let r of u[e]){let e,{permutationIndices:a,expandDims:s}=tN.getEinsumPermutation(d,o[r]);tN.isIdentityPermutation(a)?e=t[r]:(e=vS({inputs:{x:t[r]},backend:n,attrs:{perm:a}}),c.push(e));let i=e.shape.slice();for(let e=0;e<s.length;++e)i.splice(s[e],0,1);rR.util.arraysEqual(e.shape,i)||(e=vm({inputs:{x:e},backend:n,attrs:{shape:i}}),c.push(e)),null===p?p=e:(p=vc({inputs:{a:e,b:p},backend:n}),c.push(p))}e<h-1&&(l[e]>=0&&(p=vC({inputs:{x:p},backend:n,attrs:{axis:l[e]-(s.length-d),keepDims:!1}}),c.push(p)),d--)}for(let e of c)e!==p&&n.disposeIntermediateTensorInfo(e);return p}},Ib=vo({opSnippet:"return (x >= 0.0) ? x : (exp(x) - 1.0);",packedOpSnippet:`
  vec4 result;

  result.r = (x.r >= 0.0) ? x.r : (exp(x.r) - 1.0);
  result.g = (x.g >= 0.0) ? x.g : (exp(x.g) - 1.0);
  result.b = (x.b >= 0.0) ? x.b : (exp(x.b) - 1.0);
  result.a = (x.a >= 0.0) ? x.a : (exp(x.a) - 1.0);

  return result;
`}),Iv={kernelName:x.Elu,backendName:"webgl",kernelFunc:Ib},Iw=`
  vec4 bGTEZero = vec4(greaterThanEqual(b, vec4(0.)));
  return (bGTEZero * a) + ((vec4(1.0) - bGTEZero) * (a * (b + vec4(1.0))));
`,II={kernelName:x.EluGrad,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:n}=e,{dy:r,y:a}=t,s=(0,rN.env)().getBool("WEBGL_PACK_BINARY_OPERATIONS")?new b5(Iw,r.shape,a.shape):new b3("return (b >= 0.0) ? a : a * (b + 1.0);",r.shape,a.shape);return n.runWebGLProgram(s,[r,a],r.dtype)}},IC=vl({opSnippet:"return float(a == b);",packedOpSnippet:`
  return vec4(equal(a, b));
`,dtype:"bool",cpuKernelImpl:yZ}),Ik={kernelName:x.Equal,backendName:"webgl",kernelFunc:IC};var tN=tN;let IS=vo({opSnippet:`
  // Error function is calculated approximately with elementary function.
  // See "Handbook of Mathematical Functions with Formulas,
  // Graphs, and Mathematical Tables", Abramowitz and Stegun.
  float p = ${tN.ERF_P};
  float a1 = ${tN.ERF_A1};
  float a2 = ${tN.ERF_A2};
  float a3 = ${tN.ERF_A3};
  float a4 = ${tN.ERF_A4};
  float a5 = ${tN.ERF_A5};

  float sign = sign(x);
  x = abs(x);
  float t = 1.0 / (1.0 + p * x);
  return sign * (1.0 - (((((a5*t + a4)*t) + a3)*t + a2)*t + a1)*t*exp(-x*x));
`}),IT={kernelName:x.Erf,backendName:"webgl",kernelFunc:IS},IN=vo({opSnippet:vi+`
  return exp(x);
`,packedOpSnippet:`
  vec4 result = exp(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,cpuKernelImpl:yJ,dtype:"float32"}),I$={kernelName:x.Exp,backendName:"webgl",kernelFunc:IN};function IR(e){let{inputs:t,attrs:n,backend:r}=e,{dim:a}=n,{input:s}=t,i=s.shape.length,o=s.shape.slice(),l=a;return a<0&&(rR.util.assert(-(i+1)<=a,()=>`Axis must be in the interval [${-(i+1)}, ${i}]`),l=i+a+1),o.splice(l,0,1),vm({inputs:{x:s},backend:r,attrs:{shape:o}})}let IA={kernelName:x.ExpandDims,backendName:"webgl",kernelFunc:IR},IE="return exp(x) - 1.0;",IF=vo({opSnippet:IE,packedOpSnippet:IE,cpuKernelImpl:yQ}),ID={kernelName:x.Expm1,backendName:"webgl",kernelFunc:IF};class IO{constructor(e,t,n){let r;this.variableNames=["real","imag"];const a=t[1];this.outputShape=t;const s=n?`2.0 * ${Math.PI}`:`-2.0 * ${Math.PI}`,i=n?`${a}.0`:"1.0";if("real"===e)r="return real * expR - imag * expI;";else if("imag"===e)r="return real * expI + imag * expR;";else throw Error(`FFT component must be either "real" or "imag", got ${e}.`);this.userCode=`
      const float exponentMultiplier = ${s};

      float unaryOpComplex(float real, float expR, float imag, float expI) {
        ${r}
      }

      float mulMatDFT(int batch, int index) {
        float indexRatio = float(index) / float(${a});
        float exponentMultiplierTimesIndexRatio =
            exponentMultiplier * indexRatio;

        float result = 0.0;

        for (int i = 0; i < ${a}; i++) {
          // x = (-2|2 * PI / N) * index * i;
          float x = exponentMultiplierTimesIndexRatio * float(i);
          float expR = cos(x);
          float expI = sin(x);
          float real = getReal(batch, i);
          float imag = getImag(batch, i);

          result +=
              unaryOpComplex(real, expR, imag, expI) / ${i};
        }

        return result;
      }

      void main() {
        ivec2 coords = getOutputCoords();
        setOutput(mulMatDFT(coords[0], coords[1]));
      }
    `}}function IL(e,t,n){let r=n.texData.get(e.dataId),a=rR.util.sizeFromShape(e.shape),s=e.shape[e.shape.length-1],i=vm({inputs:{x:e},backend:n,attrs:{shape:[a/s,s]}}),o=i.shape,l=new IO("real",o,t),u=new IO("imag",o,t),h=[{dataId:r.complexTensorInfos.real.dataId,dtype:r.complexTensorInfos.real.dtype,shape:o},{dataId:r.complexTensorInfos.imag.dataId,dtype:r.complexTensorInfos.imag.dtype,shape:o}],p=n.runWebGLProgram(l,h,"float32"),d=n.runWebGLProgram(u,h,"float32"),c=b9({inputs:{real:p,imag:d},backend:n});n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(d);let f=vm({inputs:{x:c},backend:n,attrs:{shape:e.shape}});return n.disposeIntermediateTensorInfo(i),n.disposeIntermediateTensorInfo(c),f}let Iz={kernelName:x.FFT,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{input:r}=t;return IL(r,!1,n)}};class I_{constructor(e,t){this.outputShape=[],this.customUniforms=[{name:"value",type:"float"}],this.variableNames=["x"],this.outputShape=e,this.userCode=`
      void main() {
        // Input can be obtained from uniform value.
        setOutput(value);
      }
    `}}function IM(e){let{backend:t,attrs:n}=e,{shape:r,value:a}=n,{dtype:s}=n;if("string"===(s=s||rR.util.inferDtype(a))){let e=rR.util.getArrayFromDType(s,rR.util.sizeFromShape(r));return e.fill(a),t.makeTensorInfo(r,s,e)}{let e=new I_(r,a),n=[[a]];return t.runWebGLProgram(e,[],s,n)}}let IP={kernelName:x.Fill,backendName:"webgl",kernelFunc:IM};class IB{constructor(e){this.variableNames=["Image"],this.outputShape=[];const t=e[2];this.outputShape=e,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];

          int coordX = ${t} - x - 1;
          float outputValue;
          if(coordX >= 0 && coordX < ${t}) {
            outputValue = getImage(coords[0], coords[1], coordX, coords[3]);
          } else {
            outputValue = getImage(coords[0], coords[1], coords[2], coords[3]);
          }
          setOutput(outputValue);
        }
    `}}let IW={kernelName:x.FlipLeftRight,backendName:"webgl",kernelFunc:({inputs:e,backend:t})=>{let{image:n}=e,r=new IB(n.shape);return t.runWebGLProgram(r,[n],n.dtype)}},IG="return floor(x);",IU=vo({opSnippet:IG,packedOpSnippet:IG,cpuKernelImpl:y0}),IV={kernelName:x.Floor,backendName:"webgl",kernelFunc:IU},IH=vl({opSnippet:`
  float s = sign(a) * sign(b);
  int ia = round(a);
  int ib = round(b);
  if (ib != 0) {
    // Windows (D3D) wants guaranteed non-zero int division at compile-time.
    return float(idiv(ia, ib, s));
  } else {
    return NAN;
  }
`,packedOpSnippet:`
  ivec4 ia = round(a);
  ivec4 ib = round(b);
  bvec4 cond = notEqual(ib, ivec4(0));
  ivec4 result = ivec4(0);
  vec4 s = sign(a) * sign(b);

  // Windows (D3D) wants guaranteed non-zero int division at compile-time.
  if (cond[0]) {
    result[0] = idiv(ia[0], ib[0], s[0]);
  }
  if (cond[1]) {
    result[1] = idiv(ia[1], ib[1], s[1]);
  }
  if (cond[2]) {
    result[2] = idiv(ia[2], ib[2], s[2]);
  }
  if (cond[3]) {
    result[3] = idiv(ia[3], ib[3], s[3]);
  }
  return vec4(result);
`,dtype:"int32"}),Iq={kernelName:x.FloorDiv,backendName:"webgl",kernelFunc:IH};class Ij{constructor(e){this.variableNames=["A"];const t=x3(),[n,r]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];
        vec2 uv = (vec2(texC, texR) + halfCR) / vec2(${r}.0, ${n}.0);

        vec4 values = ${t.texture2D}(A, uv);
        float value;
        if (depth == 0) {
          value = values.r;
        } else if (depth == 1) {
          value = values.g;
        } else if (depth == 2) {
          value = values.b;
        } else if (depth == 3) {
          value = values.a;
        }

        setOutput(floor(value * 255.0 + 0.5));
      }
    `}}class IX{constructor(e){this.variableNames=["A"],this.packedInputs=!1,this.packedOutput=!0;const t=x3(),[n,r]=e;this.outputShape=e,this.userCode=`
      void main() {
        ivec3 coords = getOutputCoords();
        int texR = coords[0];
        int texC = coords[1];
        int depth = coords[2];

        vec4 result = vec4(0.);

        for(int row=0; row<=1; row++) {
          for(int col=0; col<=1; col++) {
            texC = coords[1] + row;
            depth = coords[2] + col;

            vec2 uv = (vec2(texC, texR) + halfCR) /
                       vec2(${r}.0, ${n}.0);
            vec4 values = ${t.texture2D}(A, uv);
            float value;
            if (depth == 0) {
              value = values.r;
            } else if (depth == 1) {
              value = values.g;
            } else if (depth == 2) {
              value = values.b;
            } else if (depth == 3) {
              value = values.a;
            }

            result[row * 2 + col] = floor(value * 255.0 + 0.5);
          }
        }

        ${t.output} = result;
      }
    `}}let IK={kernelName:x.FromPixels,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{pixels:s}=t,{numChannels:i}=r,o="undefined"!=typeof HTMLVideoElement&&s instanceof HTMLVideoElement,l="undefined"!=typeof HTMLImageElement&&s instanceof HTMLImageElement,[u,h]=o?[s.videoWidth,s.videoHeight]:[s.width,s.height],p=[h,u],d=[h,u,i];if(l||o){let e=(0,rN.env)().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");(null==a||e!==IY)&&(IY=e,a=document.createElement("canvas").getContext("2d",{willReadFrequently:IY})),a.canvas.width=u,a.canvas.height=h,a.drawImage(s,0,0,u,h),s=a.canvas}let c=n.makeTensorInfo(p,"int32");n.texData.get(c.dataId).usage=f.PIXELS,n.gpgpu.uploadPixelDataToTexture(n.getTexture(c.dataId),s);let m=(0,rN.env)().getBool("WEBGL_PACK")?new IX(d):new Ij(d),g=n.runWebGLProgram(m,[c],"int32");return n.disposeData(c.dataId),g}},IY=(0,rN.env)().getBool("CANVAS2D_WILL_READ_FREQUENTLY_FOR_GPU");var tN=tN;let IZ={kernelName:x.FusedConv2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s,filter:i,bias:o,preluActivationWeights:l}=n,{strides:u,pad:h,dataFormat:p,dilations:d,dimRoundingMode:c,activation:f,leakyreluAlpha:m}=a,g=tN.convertConv2DDataFormat(p),x=tN.computeConv2DInfo(s.shape,i.shape,u,d,h,c,!1,g),y=[],b=null!=o,v=null!=l,w="leakyrelu"===f,I=()=>{let e=[s,i],t=(e,t)=>{if("NCHW"===t&&1===e.shape.length&&1!==e.shape[0]){let t=vm({inputs:{x:e},backend:r,attrs:{shape:[e.shape[0],1,1]}});return y.push(t),t}return e};if(b&&e.push(t(o,p)),v&&e.push(t(l,p)),w){let t=r.makeTensorInfo([],"float32",rR.util.createScalarValue(m,"float32"));e.push(t),y.push(t)}return e};if(1===x.filterHeight&&1===x.filterWidth&&1===x.dilationHeight&&1===x.dilationWidth&&1===x.strideHeight&&1===x.strideWidth&&("SAME"===x.padInfo.type||"VALID"===x.padInfo.type))t=wU({x:s,filter:i,convInfo:x,backend:r,bias:o,activation:f,preluActivationWeights:l,leakyreluAlpha:m});else if(x.strideWidth<=2&&"channelsLast"===g&&(0,rN.env)().getBool("WEBGL_EXP_CONV")){let e=new wB(x,b,f?vu(f,!0):null,v,w),n=[[x.padInfo.top,x.padInfo.left],[x.strideHeight,x.strideWidth],[x.dilationHeight,x.dilationWidth],[x.inHeight,x.inWidth]],a=I();t=r.runWebGLProgram(e,a,"float32",n)}else if((0,rN.env)().getBool("WEBGL_CONV_IM2COL"))t=wV({x:s,filter:i,convInfo:x,backend:r,bias:o,activation:f,preluActivationWeights:l,leakyreluAlpha:m});else{let e=new wM(x,b,f?vu(f,!1):null,v,w),n=I();t=r.runWebGLProgram(e,n,"float32")}let C=vm({inputs:{x:t},backend:r,attrs:{shape:x.outShape}});return y.push(t),y.forEach(e=>r.disposeIntermediateTensorInfo(e)),C}};var tN=tN;let IJ={kernelName:x.FusedDepthwiseConv2D,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s,filter:i,bias:o,preluActivationWeights:l}=n,{strides:u,pad:h,dilations:p,dimRoundingMode:d,activation:c,leakyreluAlpha:f}=a,m=[],g=p;null==g&&(g=[1,1]),rR.util.assert(tN.eitherStridesOrDilationsAreOne(u,g),()=>`Error in depthwiseConv2d: Either strides or dilations must be 1. Got strides ${u} and dilations '${g}'`);let x=tN.computeConv2DInfo(s.shape,i.shape,u,g,h,d,!0),y=(0,rN.env)().getBool("WEBGL_PACK_DEPTHWISECONV")&&x.strideWidth<=2&&x.outChannels/x.inChannels==1,b=c?vu(c,y):null,v=[s,i],w=null!=o,I=null!=l,C="leakyrelu"===c;if(w&&v.push(o),I&&v.push(l),C){let e=r.makeTensorInfo([],"float32",rR.util.createScalarValue(f,"float32"));v.push(e),m.push(e)}t=y?new Il(x,w,b,I,C):new Io(x,w,b,I,C);let k=[[x.padInfo.top,x.padInfo.left],[x.strideHeight,x.strideWidth],[x.dilationHeight,x.dilationWidth],[x.inHeight,x.inWidth]],S=r.runWebGLProgram(t,v,"float32",k);return m.forEach(e=>r.disposeIntermediateTensorInfo(e)),S}};var tN=tN;class IQ{constructor(e,t,n,r){this.sliceDim=e,this.strides=t,this.paramsShape=r,this.variableNames=["x","indices"],this.outputShape=n;const a=yo(n.length);let s=`
    int index;`;for(let e=0;e<this.sliceDim;e++)s+=`
          index = round(getIndices(coords[0], ${e}));
          out_of_bounds = out_of_bounds || index < 0;
          out_of_bounds = out_of_bounds || index >= ${this.paramsShape[e]};
          flattenIndex += index * ${this.strides[e]};`;this.userCode=`
         void main() {
          ${a} coords = getOutputCoords();
          int flattenIndex = 0;
          bool out_of_bounds = false;

          ${s}

          setOutput(out_of_bounds ? 0.0 : getX(flattenIndex, coords[1]));
        }
      `}}let I0={kernelName:x.GatherNd,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{params:r,indices:a}=t,s=a.shape,i=s[s.length-1],o=rR.util.sizeFromShape(r.shape),[l,u,h,p]=tN.prepareAndValidate(r,a),d=vm({inputs:{x:a},backend:n,attrs:{shape:[u,i]}}),c=vm({inputs:{x:r},backend:n,attrs:{shape:[rR.util.sizeFromShape(r.shape)/h,h]}});if(n.shouldExecuteOnCPU([r,a])||"string"===r.dtype){let e=y1(n.readSync(a.dataId),n.bufferSync(r),r.dtype,u,i,h,p,r.shape,o);return n.makeTensorInfo(l,r.dtype,e.values)}let f=new IQ(i,p,[u,h],r.shape),m=n.runWebGLProgram(f,[c,d],c.dtype),g=vm({inputs:{x:m},backend:n,attrs:{shape:l}});return n.disposeIntermediateTensorInfo(d),n.disposeIntermediateTensorInfo(c),n.disposeIntermediateTensorInfo(m),g}};var tN=tN;class I1{constructor(e,t){this.variableNames=["A","indices"],this.outputShape=t,this.rank=t.length;const n=yo(this.rank),r=function(e,t){let n=["resRC.x","resRC.y","resRC.z","resRC.w"],r=[];for(let t=0;t<e.length;t++)2===t?r.push("index"):r.push(`${n[t]}`);return r.join()}(e,0);this.userCode=`
      void main() {
        ${n} resRC = getOutputCoords();
        int index = int(getIndices(resRC.x, resRC.z));
        float inBounds = (index >= 0) && (index < ${e[2]}) ? 1.0 : 0.0;
        setOutput(inBounds * getA(${r}));
      }
    `}}function I2(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,indices:s}=t,{axis:i,batchDims:o}=r,l=rR.util.parseAxisParam(i,a.shape)[0];if((0,rN.env)().get("DEBUG")){let e=n.readSync(s.dataId),t=a.shape[l];for(let n=0;n<e.length;++n){let r=e[n];rR.util.assert(r<=t-1&&r>=0,()=>`GatherV2: the index value ${r} is not in [0, ${t-1}]`)}}let u=tN.segment_util.collectGatherOpShapeInfo(a,s,l,o),h=rR.util.sizeFromShape(s.shape),p=[],d=vm({inputs:{x:a},backend:n,attrs:{shape:[u.batchSize,u.outerSize,u.dimSize,u.sliceSize]}}),c=vm({inputs:{x:s},backend:n,attrs:{shape:[u.batchSize,h/u.batchSize]}});p.push(d),p.push(c);let f=[u.batchSize,u.outerSize,h/u.batchSize,u.sliceSize];if(n.shouldExecuteOnCPU([a,s])||"string"===a.dtype){let e=n.bufferSync(c),t=y2(n.bufferSync(d),e,f);return p.forEach(e=>n.disposeIntermediateTensorInfo(e)),n.makeTensorInfo(u.outputShape,t.dtype,t.values)}let m=new I1(d.shape,f),g=n.runWebGLProgram(m,[d,c],d.dtype);p.push(g);let x=vm({inputs:{x:g},backend:n,attrs:{shape:u.outputShape}});return p.forEach(e=>n.disposeIntermediateTensorInfo(e)),x}let I3={kernelName:x.GatherV2,backendName:"webgl",kernelFunc:I2},I4=vl({opSnippet:"return float(a > b);",packedOpSnippet:`
  return vec4(greaterThan(a, b));
`,cpuKernelImpl:y3,dtype:"bool"}),I5={kernelName:x.Greater,backendName:"webgl",kernelFunc:I4},I6=vl({opSnippet:"return float(a >= b);",packedOpSnippet:`
  return vec4(greaterThanEqual(a, b));
`,dtype:"bool",cpuKernelImpl:y4}),I8={kernelName:x.GreaterEqual,backendName:"webgl",kernelFunc:I6},I9={kernelName:x.IFFT,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{input:r}=t;return IL(r,!0,n)}},I7=vo({opSnippet:"return float(!isnan(x) && !isinf(x));",dtype:"bool"}),Ce={kernelName:x.IsFinite,backendName:"webgl",kernelFunc:I7},Ct=vo({opSnippet:"return float(isinf(x));",dtype:"bool"}),Cn={kernelName:x.IsInf,backendName:"webgl",kernelFunc:Ct},Cr=vo({opSnippet:"return float(isnan(x));",dtype:"bool"}),Ca={kernelName:x.IsNan,backendName:"webgl",kernelFunc:Cr},Cs=vl({opSnippet:"return float(a < b);",packedOpSnippet:`
  return vec4(lessThan(a, b));
`,cpuKernelImpl:y5,dtype:"bool"}),Ci={kernelName:x.Less,backendName:"webgl",kernelFunc:Cs},Co=vl({opSnippet:"return float(a <= b);",packedOpSnippet:`
  return vec4(lessThanEqual(a, b));
`,cpuKernelImpl:y6,dtype:"bool"}),Cl={kernelName:x.LessEqual,backendName:"webgl",kernelFunc:Co},Cu={kernelName:x.LinSpace,backendName:"webgl",kernelFunc:function(e){let{backend:t,attrs:n}=e,{start:r,stop:a,num:s}=n,i=y8(r,a,s);return t.makeTensorInfo([i.length],"float32",i)}},Ch=vo({opSnippet:vi+`
  return x < 0.0 ? 0./0. : log(x);
`,packedOpSnippet:`
  vec4 result = log(x);
  bvec4 isNaN = isnan(x);
  result.r = isNaN.r ? x.r : (x.r < 0.0 ? 0./0. : result.r);
  result.g = isNaN.g ? x.g : (x.g < 0.0 ? 0./0. : result.g);
  result.b = isNaN.b ? x.b : (x.b < 0.0 ? 0./0. : result.b);
  result.a = isNaN.a ? x.a : (x.a < 0.0 ? 0./0. : result.a);
  return result;
`,cpuKernelImpl:y9}),Cp={kernelName:x.Log,backendName:"webgl",kernelFunc:Ch},Cd=vo({opSnippet:vi+`
  return log(1.0 + x);
`}),Cc={kernelName:x.Log1p,backendName:"webgl",kernelFunc:Cd},Cf=vl({opSnippet:"return float(a >= 1.0 && b >= 1.0);",packedOpSnippet:`
  return vec4(
    vec4(greaterThanEqual(a, vec4(1.0))) *
    vec4(greaterThanEqual(b, vec4(1.0))));
`,dtype:"bool"}),Cm={kernelName:x.LogicalAnd,backendName:"webgl",kernelFunc:Cf},Cg=vo({opSnippet:"return float(!(x >= 1.0));"}),Cx={kernelName:x.LogicalNot,backendName:"webgl",kernelFunc:Cg},Cy=vl({opSnippet:"return float(a >= 1.0 || b >= 1.0);",packedOpSnippet:`
  return min(
    vec4(greaterThanEqual(a, vec4(1.0))) +
    vec4(greaterThanEqual(b, vec4(1.0))),
    vec4(1.0));
`,dtype:"bool"}),Cb={kernelName:x.LogicalOr,backendName:"webgl",kernelFunc:Cy};class Cv{constructor(e,t,n,r,a){let s;this.variableNames=["x"],this.outputShape=[];const i=e[3]-1;this.outputShape=e;const o=`float(${n}) + float(${r}) * sum`;s=.5===a?`inversesqrt(${o})`:1===a?`1.0/(${o})`:`exp(log(${o}) * float(-${a}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];
        int d = coords[3];
        float x = getX(b, r, c, d);
        float sum = 0.0;
        for (int j = -${t}; j <= ${t}; j++) {
          int idx = d + j;
          if (idx >= 0 && idx <=  ${i}) {
            float z = getX(b, r, c, idx);
            sum += z * z;
          }
        }
        float val = x * ${s};
        setOutput(val);
      }
    `}}class Cw{constructor(e,t,n,r,a){let s;this.variableNames=["x"],this.outputShape=[],this.packedInputs=!0,this.packedOutput=!0;const i=e[3]-1;this.outputShape=e;const o=`float(${n}) + float(${r}) * sum`;s=.5===a?`inversesqrt(${o})`:1===a?`1.0/(${o})`:`exp(log(${o}) * float(-${a}));`,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords.x;
        int r = coords.y;
        int c = coords.z;
        int d = coords.w;

        bool hasNextCol = d < ${this.outputShape[3]};
        bool hasNextRow = c < ${this.outputShape[2]};

        vec4 sum = vec4(0.);
        vec4 xFragAtOutputCoords = getX(b, r, c, d);

        vec4 xAtOutputCoords = vec4(
          getChannel(xFragAtOutputCoords, vec2(c, d)),
          hasNextCol ?
            getChannel(xFragAtOutputCoords, vec2(c, d + 1)) : 0.0,
          hasNextRow ?
            getChannel(xFragAtOutputCoords , vec2(c + 1, d)) : 0.0,
          (hasNextRow && hasNextCol) ?
            getChannel(xFragAtOutputCoords, vec2(c + 1, d + 1)) : 0.0
        );

        int firstChannel = d - ${t};
        vec2 cache = vec2(0.);
        if(firstChannel >= 0){
          vec4 firstChannelFrag = getX(b, r, c, firstChannel);
          cache.x = getChannel(firstChannelFrag, vec2(c, firstChannel));
            if(hasNextRow){
              cache.y = getChannel(firstChannelFrag, vec2(c + 1, firstChannel));
            }
        }

        ivec2 depth = ivec2(d, d + 1);
        for (int j = - ${t}; j <= ${t}; j++) {
          ivec2 idx = depth + j;
          bvec2 aboveLowerBound = greaterThanEqual(idx, ivec2(0));
          bvec2 belowUpperBound = lessThanEqual(idx, ivec2(${i}));

          bool depthInRange = aboveLowerBound.x && belowUpperBound.x;
          bool depthPlusOneInRange = aboveLowerBound.y && belowUpperBound.y;

          if(depthInRange || depthPlusOneInRange){
            vec4 z = vec4(0.);
            vec4 xFragAtCurrentDepth;
            z.xz = cache.xy;
            if(depthPlusOneInRange && hasNextCol){
              xFragAtCurrentDepth = idx.y != d ?
                getX(b, r, c, idx.y) : xFragAtOutputCoords;
              z.y = getChannel(xFragAtCurrentDepth, vec2(c, idx.y));
              if(hasNextRow){
                z.w = getChannel(xFragAtCurrentDepth, vec2(c + 1, idx.y));
              }
            }
            cache.xy = z.yw;
            sum += z * z;
          }
        }
        vec4 result = xAtOutputCoords * ${s};
        setOutput(result);
      }
    `}}let CI={kernelName:x.LRN,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{depthRadius:s,bias:i,alpha:o,beta:l}=r,u=(0,rN.env)().getBool("WEBGL_PACK_NORMALIZATION")?new Cw(a.shape,s,i,o,l):new Cv(a.shape,s,i,o,l);return n.runWebGLProgram(u,[a],a.dtype)}};class CC{constructor(e,t,n,r,a){this.variableNames=["inputImage","outputImage","dy"],this.outputShape=[],this.outputShape=e,this.depth=e[3],this.depthRadius=t,this.bias=n,this.alpha=r,this.beta=a,this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int r = coords[1];
        int c = coords[2];

        float result = 0.0;
        for (int d = 0; d < ${this.depth}; ++d) {
          int depthBegin = int(max(0.0, float(d - ${t})));
          int depthEnd = int(min(float(${this.depth}),
              float(d + ${t} + 1)));

          const int MIN_DEPTH_BEGIN = 0;
          const int MAX_DEPTH_END = ${this.depth};

          float norm = 0.0;
          for (int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k) {
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd) {
              norm += getInputImage(b, r, c, k) * getInputImage(b, r, c, k);
            }
            else {
              break;
            }
          }

          norm = float(${r}) * norm + float(${n});

          for(int k = MIN_DEPTH_BEGIN; k < MAX_DEPTH_END; ++k){
            if (k < depthBegin){
              continue;
            }
            else if (k >= depthBegin && k < depthEnd){
              float dyi = -2.0 * float(${r})
                * float(${a})
                * getInputImage(b, r, c, k) * getOutputImage(b, r, c, d)
                / norm;
              if (k == d) {
                dyi += pow(norm, -1.0 * ${a});
              }
              if (k == coords[3]) {
                dyi *= getDy(b, r, c, d);
                result += dyi;
              }
            }
            else {
              break;
            }
          }
      }
      setOutput(result);
      }
    `}}let Ck={kernelName:x.LRNGrad,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{x:a,y:s,dy:i}=t,{depthRadius:o,bias:l,alpha:u,beta:h}=r,p=new CC(a.shape,o,l,u,h);return n.runWebGLProgram(p,[a,s,i],a.dtype)}};var tN=tN;function CS(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{reductionIndices:i,keepDims:o}=a,l=s.shape.length,u=rR.util.parseAxisParam(i,s.shape),h=u,p=tN.getAxesPermutation(h,l),d=null!=p,c=r.shouldExecuteOnCPU([s]),f=s;if(d){if(c){let e=r.texData.get(f.dataId).values,t=Array(l);for(let e=0;e<t.length;e++)t[e]=s.shape[p[e]];let n=bN(e,s.shape,s.dtype,p,t);f=r.makeTensorInfo(t,s.dtype),r.texData.get(f.dataId).values=n}else f=vI(s,p,r);h=tN.getInnerMostAxes(h.length,l)}tN.assertAxesAreInnerMostDims("max",h,l);let[m,g]=tN.computeOutAndReduceShapes(f.shape,h),x=m;if(o&&(x=tN.expandShapeToKeepDim(m,u)),c){let e=y7(r.texData.get(f.dataId).values,rR.util.sizeFromShape(g),x,s.dtype);t=r.makeTensorInfo(x,s.dtype),r.texData.get(t.dataId).values=e}else{var y,b;let e,n,a,s,i;y=f,b=x,e=rR.util.sizeFromShape(g),n=rR.util.sizeFromShape(y.shape),s=vb(a=vm({inputs:{x:y},attrs:{shape:[n/e,e]},backend:r}),y.dtype,"max",r),i=vm({inputs:{x:s},attrs:{shape:b},backend:r}),r.disposeIntermediateTensorInfo(a),r.disposeIntermediateTensorInfo(s),t=i}return d&&r.disposeIntermediateTensorInfo(f),t}let CT={kernelName:x.Max,backendName:"webgl",kernelFunc:CS},CN=vl({opSnippet:b2+`
  return max(a, b);
`,packedOpSnippet:`
  vec4 result = vec4(max(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+b4+`
  return result;
`,cpuKernelImpl:be}),C$={kernelName:x.Maximum,backendName:"webgl",kernelFunc:CN};var tN=tN;let CR={kernelName:x.MaxPool,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t;x0(a,"maxPool");let{filterSize:s,strides:i,pad:o,dimRoundingMode:l}=r;rR.util.assert(tN.eitherStridesOrDilationsAreOne(i,1),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${i} and dilations '1'`);let u=tN.computePool2DInfo(a.shape,s,i,1,o,l);if(1===u.filterWidth&&1===u.filterHeight&&rR.util.arraysEqual(u.inShape,u.outShape))return b6({inputs:{x:a},backend:n});let h=new v4(u,"max",!1);return n.runWebGLProgram(h,[a],a.dtype)}};var tN=tN;let CA={kernelName:x.MaxPool3D,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{filterSize:s,strides:i,pad:o,dataFormat:l,dimRoundingMode:u}=r,h=new v5(tN.computePool3DInfo(a.shape,s,i,[1,1,1],o,u,l),"max",!1);return n.runWebGLProgram(h,[a],a.dtype)}};var tN=tN;class CE{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;const t=e.strideHeight,n=e.strideWidth,r=e.dilationHeight,a=e.effectiveFilterHeight,s=e.effectiveFilterWidth,i=a-1-e.padInfo.top,o=s-1-e.padInfo.left;this.userCode=`
      const ivec2 pads = ivec2(${i}, ${o});

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];

        ivec2 dyRCCorner = coords.yz - pads;
        int dyRCorner = dyRCCorner.x;
        int dyCCorner = dyRCCorner.y;

        // Convolve dy(?, ?, d) with pos mask(:, :, d) to get dx(xR, xC, d).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;
        for (int wR = 0; wR < ${a};
          wR += ${r}) {
          float dyR = float(dyRCorner + wR) / ${t}.0;

          if (dyR < 0.0 || dyR >= ${e.outHeight}.0 || fract(dyR) > 0.0) {
            continue;
          }
          int idyR = int(dyR);

          for (int wC = 0; wC < ${s}; wC++) {
            float dyC = float(dyCCorner + wC) / ${n}.0;

            if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                fract(dyC) > 0.0) {
              continue;
            }
            int idyC = int(dyC);

            float dyValue = getDy(b, idyR, idyC, d);
            int maxPosValue = ${a*s-1} - int(getMaxPos(b, idyR, idyC, d));

            // Get the current value, check it against the value from the
            // position matrix.
            int curPosValue = wR * ${s} + wC;
            float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

            dotProd += dyValue * mask;
          }
        }
        setOutput(dotProd);
      }
    `}}class CF{constructor(e){this.variableNames=["dy","maxPos"],this.outputShape=e.inShape;const t=e.strideDepth,n=e.strideHeight,r=e.strideWidth,a=e.dilationDepth,s=e.dilationHeight,i=e.dilationWidth,o=e.effectiveFilterDepth,l=e.effectiveFilterHeight,u=e.effectiveFilterWidth,h=o-1-e.padInfo.front,p=l-1-e.padInfo.top,d=u-1-e.padInfo.left;this.userCode=`
      const ivec3 pads = ivec3(${h}, ${p}, ${d});

      void main() {
        ivec5 coords = getOutputCoords();
        int batch = coords.x;
        int ch = coords.u;

        ivec3 dyCorner = ivec3(coords.y, coords.z, coords.w) - pads;
        int dyDCorner = dyCorner.x;
        int dyRCorner = dyCorner.y;
        int dyCCorner = dyCorner.z;

        // Convolve dy(?, ?, ?, ch) with pos mask(:, :, :, d) to get
        // dx(xD, xR, xC, ch).
        // ? = to be determined. : = across all values in that axis.
        float dotProd = 0.0;

        for (int wD = 0; wD < ${o};
           wD += ${a}) {
          float dyD = float(dyDCorner + wD) / ${t}.0;

          if (dyD < 0.0 || dyD >= ${e.outDepth}.0 || fract(dyD) > 0.0) {
            continue;
          }
          int idyD = int(dyD);

          for (int wR = 0; wR < ${l};
              wR += ${s}) {
            float dyR = float(dyRCorner + wR) / ${n}.0;

            if (dyR < 0.0 || dyR >= ${e.outHeight}.0 ||
                fract(dyR) > 0.0) {
              continue;
            }
            int idyR = int(dyR);

            for (int wC = 0; wC < ${u};
                wC += ${i}) {
              float dyC = float(dyCCorner + wC) / ${r}.0;

              if (dyC < 0.0 || dyC >= ${e.outWidth}.0 ||
                  fract(dyC) > 0.0) {
                continue;
              }
              int idyC = int(dyC);

              float dyValue = getDy(batch, idyD, idyR, idyC, ch);
              int maxPosValue = ${o*l*u-1} -
                  int(getMaxPos(batch, idyD, idyR, idyC, ch));

              // Get the current value, check it against the value from the
              // position matrix.
              int curPosValue =
                  wD * ${l} * ${u} +
                  wR * ${u} + wC;
              float mask = float(maxPosValue == curPosValue ? 1.0 : 0.0);

              dotProd += dyValue * mask;
            }
          }
        }
        setOutput(dotProd);
      }
    `}}let CD={kernelName:x.MaxPool3DGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s}=t,{filterSize:i,strides:o,pad:l,dimRoundingMode:u}=r,h=tN.computePool3DInfo(s.shape,i,o,[1,1,1],l,u),p=new v5(h,"max",!0),d=n.runWebGLProgram(p,[s],s.dtype),c=new CF(h),f=n.runWebGLProgram(c,[a,d],s.dtype);return n.disposeIntermediateTensorInfo(d),f}};var tN=tN;let CO={kernelName:x.MaxPoolGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{dy:a,input:s,output:i}=t;x0([s,i],"maxPoolGrad");let{filterSize:o,strides:l,pad:u,dimRoundingMode:h}=r,p=tN.computePool2DInfo(s.shape,o,l,1,u,h),d=new v4(p,"max",!0),c=n.runWebGLProgram(d,[s],s.dtype),f=new CE(p),m=n.runWebGLProgram(f,[a,c],s.dtype);return n.disposeIntermediateTensorInfo(c),m}};var tN=tN;let CL={kernelName:x.MaxPoolWithArgmax,backendName:"webgl",kernelFunc:({inputs:e,attrs:t,backend:n})=>{let r,a,{x:s}=e,{filterSize:i,strides:o,pad:l,includeBatchInIndex:u}=t;rR.util.assert(4===s.shape.length,()=>`Error in maxPool: input must be rank 4 but got rank ${s.shape.length}.`);let h=[1,1];rR.util.assert(tN.eitherStridesOrDilationsAreOne(o,h),()=>`Error in maxPool: Either strides or dilations must be 1. Got strides ${o} and dilations '${h}'`);let p=tN.computePool2DInfo(s.shape,i,o,h,l),[d,c]=(r=new v4(p,"max",!1),a=n.runWebGLProgram(r,[s],"float32"),r=new v4(p,"max",!0,!0,u),[a,n.runWebGLProgram(r,[s],"float32")]);return[d,c]}};var tN=tN;let Cz={kernelName:x.Mean,backendName:"webgl",kernelFunc:({inputs:e,attrs:t,backend:n})=>{var r,a;let s,i,o,l,u,{x:h}=e,{keepDims:p,axis:d}=t,c=h.shape.length,f=rR.util.parseAxisParam(d,h.shape),m=f,g=tN.getAxesPermutation(m,c),x=null!=g,y=n.shouldExecuteOnCPU([h]),b=[],v=h;if(x){if(y){let e=n.texData.get(v.dataId).values,t=Array(c);for(let e=0;e<t.length;e++)t[e]=h.shape[g[e]];let r=bN(e,h.shape,h.dtype,g,t);v=n.makeTensorInfo(t,h.dtype),n.texData.get(v.dataId).values=r}else v=vI(h,g,n);b.push(v),m=tN.getInnerMostAxes(m.length,c)}tN.assertAxesAreInnerMostDims("sum",m,c);let[w,I]=tN.computeOutAndReduceShapes(v.shape,m),C=w;p&&(C=tN.expandShapeToKeepDim(w,f));let k=(r=v,a=C,s=rR.util.sizeFromShape(I),i=rR.util.sizeFromShape(r.shape),l=vb(o=vm({inputs:{x:r},attrs:{shape:[i/s,s]},backend:n}),"float32","mean",n),u=vm({inputs:{x:l},attrs:{shape:a},backend:n}),n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(l),u);for(let e of b)n.disposeIntermediateTensorInfo(e);return k}};var tN=tN;let C_={kernelName:x.Min,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{axis:i,keepDims:o}=a,l=s.shape.length,u=rR.util.parseAxisParam(i,s.shape),h=u,p=tN.getAxesPermutation(h,l),d=s;null!=p&&(d=vS({inputs:{x:s},backend:r,attrs:{perm:p}}),h=tN.getInnerMostAxes(h.length,s.shape.length)),tN.assertAxesAreInnerMostDims("min",h,l);let[c,f]=tN.computeOutAndReduceShapes(d.shape,h),m=vm({inputs:{x:d},backend:r,attrs:{shape:[-1,rR.util.sizeFromShape(f)]}}),g=vb(m,m.dtype,"min",r);return t=o?vm({inputs:{x:g},backend:r,attrs:{shape:tN.expandShapeToKeepDim(c,u)}}):vm({inputs:{x:g},backend:r,attrs:{shape:c}}),r.disposeIntermediateTensorInfo(m),r.disposeIntermediateTensorInfo(g),null!=p&&r.disposeIntermediateTensorInfo(d),t}},CM=vl({opSnippet:b2+`
  return min(a, b);
`,packedOpSnippet:`
  vec4 result = vec4(min(a, b));
  bvec4 isNaNA = isnan(a);
  bvec4 isNaNB = isnan(b);
  bvec4 isNaN = bvec4(isNaNA.x || isNaNB.x, isNaNA.y || isNaNB.y, isNaNA.z || isNaNB.z, isNaNA.w || isNaNB.w);
  `+b4+`
  return result;
`,cpuKernelImpl:bt}),CP={kernelName:x.Minimum,backendName:"webgl",kernelFunc:CM};class CB{constructor(e,t,n){this.variableNames=["x"],this.outputShape=t.map((t,n)=>t[0]+e[n]+t[1]);const r=e.length,a=yo(r),s=t.map(e=>e[0]).join(","),i=t.map((t,n)=>t[0]+e[n]).join(","),o=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,r),l=+("reflect"!==n);if(1===r){this.userCode=`
        int start = ${s};
        int end = ${i};

        void main() {
          int outC = getOutputCoords();
          if (outC < start) {
            outC = start * 2 - outC - ${l};
          } else if(outC >= end) {
            outC = (end - 1) * 2 - outC + ${l};
          }
          setOutput(getX(outC - start));
        }
      `;return}this.userCode=`
      ${a} start = ${a}(${s});
      ${a} end = ${a}(${i});

      void main() {
        ${a} outC = getOutputCoords();
        for (int i = 0; i < ${r}; i++) {
          if (outC[i] < start[i]) {
            outC[i] = start[i] * 2 - outC[i] - ${l};
          } else if(outC[i] >= end[i]) {
            outC[i] = (end[i] - 1) * 2 - outC[i] + ${l};
          }
        }
        ${a} coords = outC - start;
        setOutput(getX(${o}));
      }
    `}}class CW{constructor(e,t,n){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=t.map((t,n)=>t[0]+e[n]+t[1]);const r=e.length,a=yo(r),s=t.map(e=>e[0]).join(","),i=t.map((t,n)=>t[0]+e[n]).join(","),o=bA("rc",r),l=bA("source",r),u=`${o[r-1]} < ${this.outputShape[r-1]}`,h=1===r?"source":`vec2(${l.slice(-2).join()})`,p=+("reflect"!==n);let d="";if(1===r){const e=`
        ${a} source = rc;
        if (source < start) {
          source = start * 2 - source - ${p};
        } else if (source >= end) {
          source = (end - 1) * 2 - source + ${p};
        }
        source -= start;
      `;d=`
        ${a} rc = outputLoc;
        ${e}
        result[0] = getChannel(getX(${l.join()}), ${h});
        ${o[r-1]} += 1;
        if(${u}) {
          ${e}
          result[1] = getChannel(getX(${l.join()}), ${h});
        }
      `}else{const e=`
        ${a} source = rc;
        ${a} lt = ${a}(lessThan(source, start));
        ${a} gte = ${a}(greaterThanEqual(source, end));
        ${a} orig = 1 - (lt + gte);
        source = orig * source +
                lt * (start * 2 - source - ${p}) +
                gte * ((end - 1) * 2 - source + ${p});
        source -= start;
      `;d=`
        ${a} rc = outputLoc;
        ${e}
        result[0] = getChannel(getX(${l.join()}), ${h});
        ${o[r-1]} += 1;
        if(${u}) {
          ${e}
          result[1] = getChannel(getX(${l.join()}), ${h});
        }
        rc = outputLoc;
        ${o[r-2]} += 1;
        if(${o[r-2]} < ${this.outputShape[r-2]}) {
          ${e}
          result[2] = getChannel(getX(${l.join()}), ${h});
          ${o[r-1]} += 1;
          if(${u}) {
            ${e}
            result[3] = getChannel(getX(${l.join()}), ${h});
          }
        }
      `}this.userCode=`
      const ${a} start = ${a}(${s});
      const ${a} end = ${a}(${i});

      void main() {
        ${a} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${d}
        setOutput(result);
      }
    `}}let CG={kernelName:x.MirrorPad,backendName:"webgl",kernelFunc:({inputs:e,backend:t,attrs:n})=>{let{x:r}=e,{paddings:a,mode:s}=n,i=(0,rN.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new CW(r.shape,a,s):new CB(r.shape,a,s);return t.runWebGLProgram(i,[r],r.dtype)}},CU=vl({opSnippet:`if (b == 0.0) return NAN;
  return mod(a, b);`,packedOpSnippet:`
  vec4 result = mod(a, b);
  bvec4 isNaN = equal(b, vec4(0.0));
  `+b4+`
  return result;
`}),CV={kernelName:x.Mod,backendName:"webgl",kernelFunc:CU};class CH{constructor(e,t,n){this.variableNames=["probs"],this.customUniforms=[{name:"seed",type:"float"}],this.outputShape=[e,n],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];

        float r = random(seed);
        float cdf = 0.0;

        for (int i = 0; i < ${t-1}; i++) {
          cdf += getProbs(batch, i);

          if (r < cdf) {
            setOutput(float(i));
            return;
          }
        }

        // If no other event happened, last event happened.
        setOutput(float(${t-1}));
      }
    `}}var tN=tN;let Cq=vl({opSnippet:`
if (a == b) {
  return 1.0;
};
return a / b;`,packedOpSnippet:`
  // vec4 one = vec4(equal(a, b));
  // return one + (vec4(1.0) - one) * a / b;
  vec4 result = a / b;
  if(a.x == b.x) {
    result.x = 1.;
  }
  if(a.y == b.y) {
    result.y = 1.;
  }
  if(a.z == b.z) {
    result.z = 1.;
  }
  if(a.w == b.w) {
    result.w = 1.;
  }

  return result;
`,checkOutOfBounds:!0}),Cj={kernelName:x.RealDiv,backendName:"webgl",kernelFunc:Cq},CX="return a - b;",CK=vl({opSnippet:CX,packedOpSnippet:CX,supportsComplex:!0,cpuKernelImpl:bk}),CY={kernelName:x.Sub,backendName:"webgl",kernelFunc:CK};function CZ(e){let{inputs:t,backend:n,attrs:r}=e,{logits:a}=t,{dim:s}=r,i=rR.util.parseAxisParam([s],a.shape),o=CS({inputs:{x:a},backend:n,attrs:{reductionIndices:i,keepDims:!1}}),l=tN.expandShapeToKeepDim(o.shape,i),u=vm({inputs:{x:o},backend:n,attrs:{shape:l}}),h=CK({inputs:{a:a,b:u},backend:n}),p=IN({inputs:{x:h},backend:n}),d=vC({inputs:{x:p},backend:n,attrs:{axis:i,keepDims:!1}}),c=vm({inputs:{x:d},backend:n,attrs:{shape:l}}),f=Cq({inputs:{a:p,b:c},backend:n});return n.disposeIntermediateTensorInfo(o),n.disposeIntermediateTensorInfo(u),n.disposeIntermediateTensorInfo(h),n.disposeIntermediateTensorInfo(p),n.disposeIntermediateTensorInfo(d),n.disposeIntermediateTensorInfo(c),f}let CJ={kernelName:x.Softmax,backendName:"webgl",kernelFunc:CZ},CQ={kernelName:x.Multinomial,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{logits:a}=t,{numSamples:s,seed:i,normalized:o}=r,l=o?a:CZ({inputs:{logits:a},backend:n,attrs:{dim:a.shape.length-1}}),u=new CH(l.shape[0],l.shape[1],s),h=n.runWebGLProgram(u,[l],"int32",[[i]]);return o||n.disposeIntermediateTensorInfo(l),h}},C0=bM+`
  return -x;
`,C1=`
  vec4 result = -x;
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,C2={kernelName:x.Neg,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r}=e,{x:a}=n;if(r.shouldExecuteOnCPU([a])){let[e,t]=br(r.texData.get(a.dataId).values,a.shape,a.dtype);return r.makeTensorInfo(t,a.dtype,e)}return t=(0,rN.env)().getBool("WEBGL_PACK_UNARY_OPERATIONS")?new bq(a.shape,C1):new b_(a.shape,C0),r.runWebGLProgram(t,[a],a.dtype)}};var tN=tN,pM=pM;let C3=pM.nonMaxSuppressionV3Impl,C4={kernelName:x.NonMaxSuppressionV3,backendName:"webgl",kernelFunc:function(e){tN.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:n,attrs:r}=e,{boxes:a,scores:s}=t,{maxOutputSize:i,iouThreshold:o,scoreThreshold:l}=r,{selectedIndices:u}=C3(n.readSync(a.dataId),n.readSync(s.dataId),i,o,l);return n.makeTensorInfo([u.length],"int32",new Int32Array(u))}};var tN=tN,pM=pM;let C5=pM.nonMaxSuppressionV4Impl,C6={kernelName:x.NonMaxSuppressionV4,backendName:"webgl",kernelFunc:function(e){tN.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:n,attrs:r}=e,{boxes:a,scores:s}=t,{maxOutputSize:i,iouThreshold:o,scoreThreshold:l,padToMaxOutputSize:u}=r,{selectedIndices:h,validOutputs:p}=C5(n.readSync(a.dataId),n.readSync(s.dataId),i,o,l,u);return[n.makeTensorInfo([h.length],"int32",new Int32Array(h)),n.makeTensorInfo([],"int32",new Int32Array([p]))]}};var tN=tN,pM=pM;let C8=pM.nonMaxSuppressionV5Impl,C9={kernelName:x.NonMaxSuppressionV5,backendName:"webgl",kernelFunc:function(e){tN.warn("tf.nonMaxSuppression() in webgl locks the UI thread. Call tf.nonMaxSuppressionAsync() instead");let{inputs:t,backend:n,attrs:r}=e,{boxes:a,scores:s}=t,{maxOutputSize:i,iouThreshold:o,scoreThreshold:l,softNmsSigma:u}=r,{selectedIndices:h,selectedScores:p}=C8(n.readSync(a.dataId),n.readSync(s.dataId),i,o,l,u);return[n.makeTensorInfo([h.length],"int32",new Int32Array(h)),n.makeTensorInfo([p.length],"float32",new Float32Array(p))]}};class C7{constructor(e,t,n,r){this.variableNames=["indices"],this.outputShape=[e,t],this.userCode=`
      void main() {
        ivec2 coords = getOutputCoords();
        int index = round(getIndices(coords.x));
        setOutput(mix(float(${r}), float(${n}),
                      float(index == coords.y)));
      }
    `}}let ke={kernelName:x.OneHot,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{indices:a}=t,{dtype:s,depth:i,onValue:o,offValue:l}=r,u=rR.util.sizeFromShape(a.shape),h=new C7(u,i,o,l),p=vm({inputs:{x:a},backend:n,attrs:{shape:[u]}}),d=n.runWebGLProgram(h,[p],s);n.disposeIntermediateTensorInfo(p);let c=vm({inputs:{x:d},backend:n,attrs:{shape:[...a.shape,i]}});return n.disposeIntermediateTensorInfo(d),c}};function kt(e){let{inputs:t,backend:n}=e,{x:r}=t;if("complex64"!==r.dtype)return IM({attrs:{shape:r.shape,dtype:r.dtype,value:"string"===r.dtype?"":0},backend:n});{let e=wb({inputs:{input:r},backend:n}),t=kt({inputs:{x:e},backend:n}),a=wO({inputs:{input:r},backend:n}),s=kt({inputs:{x:a},backend:n}),i=b9({inputs:{real:t,imag:s},backend:n});return n.disposeIntermediateTensorInfo(e),n.disposeIntermediateTensorInfo(t),n.disposeIntermediateTensorInfo(a),n.disposeIntermediateTensorInfo(s),i}}let kn={kernelName:x.ZerosLike,backendName:"webgl",kernelFunc:kt},kr={kernelName:x.OnesLike,backendName:"webgl",kernelFunc:function e(t){let{inputs:n,backend:r}=t,{x:a}=n;if("string"===a.dtype)throw Error("onesLike is not supported under string dtype");if("complex64"!==a.dtype)return IM({attrs:{shape:a.shape,dtype:a.dtype,value:1},backend:r});{let t=wb({inputs:{input:a},backend:r}),n=e({inputs:{x:t},backend:r}),s=wO({inputs:{input:a},backend:r}),i=kt({inputs:{x:s},backend:r}),o=b9({inputs:{real:n,imag:i},backend:r});return r.disposeIntermediateTensorInfo(t),r.disposeIntermediateTensorInfo(n),r.disposeIntermediateTensorInfo(s),r.disposeIntermediateTensorInfo(i),o}}},ka={kernelName:x.Pack,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{axis:a}=r;if(1===t.length)return IR({inputs:{input:t[0]},backend:n,attrs:{dim:a}});let s=t[0].shape,i=t[0].dtype;t.forEach(e=>{rR.util.assertShapesMatch(s,e.shape,"All tensors passed to stack must have matching shapes"),rR.util.assert(i===e.dtype,()=>"All tensors passed to stack must have matching dtypes")});let o=[],l=wz({inputs:t.map(e=>{let t=IR({inputs:{input:e},backend:n,attrs:{dim:a}});return o.push(t),t}),backend:n,attrs:{axis:a}});return o.forEach(e=>n.disposeIntermediateTensorInfo(e)),l}};class ks{constructor(e,t,n){this.variableNames=["x"],this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((t,n)=>t[0]+e[n]+t[1]);const r=e.length,a=yo(r),s=t.map(e=>e[0]).join(","),i=t.map((t,n)=>t[0]+e[n]).join(","),o=["coords[0]","coords[1]","coords[2]","coords[3]"].slice(0,r);if(1===r){this.userCode=`
        int start = ${s};
        int end = ${i};

        void main() {
          int outC = getOutputCoords();
          if (outC < start || outC >= end) {
            setOutput(value);
          } else {
            setOutput(getX(outC - start));
          }
        }
      `;return}this.userCode=`
      ${a} start = ${a}(${s});
      ${a} end = ${a}(${i});

      void main() {
        ${a} outC = getOutputCoords();
        if (any(lessThan(outC, start)) || any(greaterThanEqual(outC, end))) {
          setOutput(value);
        } else {
          ${a} coords = outC - start;
          setOutput(getX(${o}));
        }
      }
    `}}class ki{constructor(e,t,n){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0,this.customUniforms=[{name:"value",type:"float"}],this.outputShape=t.map((t,n)=>t[0]+e[n]+t[1]);const r=e.length,a=yo(r),s=t.map(e=>e[0]).join(","),i=t.map((t,n)=>t[0]+e[n]).join(","),o=bA("rc",r),l=bA("source",r),u=`${o[r-1]} < ${this.outputShape[r-1]}`,h=1===r?"source":`vec2(${l.slice(-2).join()})`,p=[`${a} rc = outputLoc;`,`${o[r-1]} += 1;
       if(${u}) {
      `,1===r?"":`}
       rc = outputLoc;
       ${o[r-2]} += 1;
       if(${o[r-2]} < ${this.outputShape[r-2]}) {`,1===r?"":`  ${o[r-1]} += 1;
         if(${u}) {`],d=1===r?"rc < start || rc >= end":"any(lessThan(rc, start)) || any(greaterThanEqual(rc, end))";let c="";for(let e=0,t=1===r?2:4;e<t;e++)c+=`
        ${p[e]}
        if (${d}) {
          result[${e}] = float(value);
        } else {
          ${a} source = rc - start;
          result[${e}] = getChannel(getX(${l.join()}), ${h});
        }
      `;c+=1===r?"} ":"}}",this.userCode=`
      const ${a} start = ${a}(${s});
      const ${a} end = ${a}(${i});

      void main() {
        ${a} outputLoc = getOutputCoords();
        vec4 result = vec4(0.);
        ${c}
        setOutput(result);
      }
    `}}let ko=e=>{let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{paddings:s,constantValue:i}=r;if(0===rR.util.sizeFromShape(a.shape))return IM({backend:n,attrs:{shape:s.map((e,t)=>e[0]+a.shape[t]+e[1]),value:i,dtype:a.dtype}});let o=(0,rN.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new ki(a.shape,s,i):new ks(a.shape,s,i),l=[[i]];return n.runWebGLProgram(o,[a],a.dtype,l)},kl={kernelName:x.PadV2,backendName:"webgl",kernelFunc:ko},ku=vl({opSnippet:`
  if(a < 0.0 && floor(b) < b){
    return NAN;
  }
  if (b == 0.0) {
    return 1.0;
  }
  return (round(mod(b, 2.0)) != 1) ?
      pow(abs(a), b) : sign(a) * pow(abs(a), b);
`,packedOpSnippet:`
  // isModRound1 has 1 for components with round(mod(b, 2.0)) == 1, 0 otherwise.
  vec4 isModRound1 = vec4(equal(round(mod(b, 2.0)), ivec4(1)));
  vec4 multiplier = sign(a) * isModRound1 + (vec4(1.0) - isModRound1);
  vec4 result = multiplier * pow(abs(a), b);

  // Ensure that a^0 = 1, including 0^0 = 1 as this correspond to TF and JS
  bvec4 isExpZero = equal(b, vec4(0.0));
  result.r = isExpZero.r ? 1.0 : result.r;
  result.g = isExpZero.g ? 1.0 : result.g;
  result.b = isExpZero.b ? 1.0 : result.b;
  result.a = isExpZero.a ? 1.0 : result.a;

  bvec4 isNaN1 = lessThan(a, vec4(0.0));
  bvec4 isNaN2 = lessThan(floor(b), b);
  bvec4 isNaN = bvec4(isNaN1.x && isNaN2.x, isNaN1.y && isNaN2.y, isNaN1.z && isNaN2.z, isNaN1.w && isNaN2.w);
  `+b4+`
  return result;
`}),kh={kernelName:x.Pow,backendName:"webgl",kernelFunc:ku};var tN=tN;let kp={kernelName:x.Prod,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{axis:i,keepDims:o}=a,l=s.shape.length,u=[],h=rR.util.parseAxisParam(i,s.shape),p=h,d=tN.getAxesPermutation(p,l),c=s;if(null!=d&&(c=vS({inputs:{x:s},backend:r,attrs:{perm:d}}),p=tN.getInnerMostAxes(p.length,l),u.push(c)),tN.assertAxesAreInnerMostDims("prod",p,l),r.shouldExecuteOnCPU([c])){let e=r.texData.get(c.dataId).values,{outVals:n,outShape:a,outDtype:s}=bs(c.shape,c.dtype,e,p);t=r.makeTensorInfo(a,s,n)}else{let[e,n]=tN.computeOutAndReduceShapes(c.shape,p),a=vm({inputs:{x:c},backend:r,attrs:{shape:[-1,rR.util.sizeFromShape(n)]}}),i=vb(a,(0,d5.sumOutType)(s.dtype),"prod",r);t=vm({inputs:{x:i},backend:r,attrs:{shape:e}}),u.push(a),u.push(i)}if(o){u.push(t);let e=tN.expandShapeToKeepDim(t.shape,h);t=vm({inputs:{x:t},backend:r,attrs:{shape:e}})}return u.forEach(e=>r.disposeIntermediateTensorInfo(e)),t}},kd={kernelName:x.RaggedGather,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{paramsNestedSplits:a,paramsDenseValues:s,indices:i}=t,{outputRaggedRank:o}=r,l=a.map(e=>n.readSync(e.dataId)),u=a.map(e=>e.shape),h=n.readSync(s.dataId),p=n.readSync(i.dataId),[d,c,f]=bi(l,u,h,s.shape,s.dtype,p,i.shape,o),m=d.map(e=>n.makeTensorInfo([e.length],"int32",e)),g=n.makeTensorInfo(f,s.dtype,c);return m.concat([g])}},kc={kernelName:x.RaggedRange,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{starts:r,limits:a,deltas:s}=t,i=n.readSync(r.dataId),o=n.readSync(a.dataId),l=n.readSync(s.dataId),[u,h]=bo(i,r.shape,r.dtype,o,a.shape,l,s.shape);return[n.makeTensorInfo([u.length],"int32",u),n.makeTensorInfo([h.length],r.dtype,h)]}},kf={kernelName:x.RaggedTensorToTensor,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{shape:a,values:s,defaultValue:i,rowPartitionTensors:o}=t,{rowPartitionTypes:l}=r,u=n.readSync(a.dataId),h=n.readSync(s.dataId),p=n.readSync(i.dataId),d=o.map(e=>n.readSync(e.dataId)),c=o.map(e=>e.shape),[f,m]=bl(u,a.shape,h,s.shape,s.dtype,p,i.shape,d,c,l);return n.makeTensorInfo(f,s.dtype,m)}},km=e=>{let{backend:t,attrs:n}=e,{start:r,stop:a,step:s,dtype:i}=n,o=bu(r,a,s,i);return t.makeTensorInfo([o.length],i,o)},kg={kernelName:x.Range,backendName:"webgl",kernelFunc:km},kx=vo({opSnippet:"return 1.0 / x;"}),ky={kernelName:x.Reciprocal,backendName:"webgl",kernelFunc:kx},kb=vo({opSnippet:bM+`
  return (x < 0.0) ? 0.0 : x;
`,packedOpSnippet:`
  vec4 result = x * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`}),kv={kernelName:x.Relu,backendName:"webgl",kernelFunc:kb},kw=vo({opSnippet:bM+`
  return (x < 0.0) ? 0.0 : min(6.0, x);
`,packedOpSnippet:`
  vec4 result = min(x, vec4(6.)) * vec4(greaterThanEqual(x, vec4(0.0)));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`}),kI={kernelName:x.Relu6,backendName:"webgl",kernelFunc:kw};class kC{constructor(e,t,n,r,a){this.variableNames=["A"],this.outputShape=[];const[s,i,o,l]=e;this.outputShape=[s,t,n,l];const u=[r&&t>1?i-1:i,r&&n>1?o-1:o],h=[r&&t>1?t-1:t,r&&n>1?n-1:n];this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/h[0]},
          ${u[1]/h[1]});
      const vec2 inputShapeRC = vec2(${i}.0, ${o}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${a?"(vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC - vec2(0.5)":"vec2(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the four integer indices.
        ivec2 sourceFloorRC = ivec2(max(sourceFracIndexRC, vec2(0.0)));
        ivec2 sourceCeilRC = ivec2(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        float topLeft = getA(b, sourceFloorRC.x, sourceFloorRC.y, d);
        float bottomLeft = getA(b, sourceCeilRC.x, sourceFloorRC.y, d);
        float topRight = getA(b, sourceFloorRC.x, sourceCeilRC.y, d);
        float bottomRight = getA(b, sourceCeilRC.x, sourceCeilRC.y, d);

        vec2 fracRC = sourceFracIndexRC - vec2(sourceFloorRC);

        float top = topLeft + (topRight - topLeft) * fracRC.y;
        float bottom = bottomLeft + (bottomRight - bottomLeft) * fracRC.y;
        float newValue = top + (bottom - top) * fracRC.x;

        setOutput(newValue);
      }
    `}}class kk{constructor(e,t,n,r,a){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[s,i,o,l]=e;this.outputShape=[s,t,n,l];const u=[r&&t>1?i-1:i,r&&n>1?o-1:o],h=[r&&t>1?t-1:t,r&&n>1?n-1:n];this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/h[0]},
          ${u[1]/h[1]},
          ${u[1]/h[1]});
      const vec3 inputShapeRC = vec3(${i}.0, ${o}.0,
                                     ${o}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${a?"(vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC - vec3(0.5)":"vec3(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the four integer indices.
        ivec3 sourceFloorRC = ivec3(max(sourceFracIndexRC, vec3(0.0)));
        ivec3 sourceCeilRC = ivec3(
          min(inputShapeRC - 1.0, ceil(sourceFracIndexRC)));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${n-1};

        // In parallel, construct four corners for all four components in
        // packed 2x2 cell.
        vec4 topLeft = vec4(
          getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 bottomLeft = vec4(
          getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceFloorRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceFloorRC.z, d + 1) : 0.0);

        vec4 topRight = vec4(
          getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceFloorRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceFloorRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec4 bottomRight = vec4(
          getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d),
          hasNextCol ? getAValue(b, sourceCeilRC.x, sourceCeilRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceCeilRC.x, sourceCeilRC.z, d + 1) : 0.0);

        vec3 fracRC = sourceFracIndexRC - vec3(sourceFloorRC);

        vec4 top = mix(topLeft, topRight, fracRC.yyzz);
        vec4 bottom = mix(bottomLeft, bottomRight, fracRC.yyzz);
        vec4 newValue = mix(top, bottom, fracRC.x);

        setOutput(newValue);
      }
    `}}let kS={kernelName:x.ResizeBilinear,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a}=t,{alignCorners:s,halfPixelCenters:i,size:o}=r,[l,u]=o,h=(0,rN.env)().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new kk(a.shape,l,u,s,i):new kC(a.shape,l,u,s,i);return n.runWebGLProgram(h,[a],"float32")}};class kT{constructor(e,t,n){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;const[,r,a]=t,[,s,i]=e,o=[n&&s>1?r-1:r,n&&i>1?a-1:a],l=[n&&s>1?s-1:s,n&&i>1?i-1:i],u=o[0]/l[0],h=o[1]/l[1],p=1/u,d=1/h,c=2*Math.ceil(p)+2,f=2*Math.ceil(d)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${h});

        const float invHeightScale = float(${p});
        const float invWidthScale = float(${d});

        const int winHeight = int(${c});
        const int winWidth = int(${f});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(startRLerp - float(winHeight / 2));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(startCLerp - float(winWidth / 2));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${s}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${i}) {
              continue;
            }

            float dxR = float(dyR) * heightScale;
            int topDxRIndex = int(floor(dxR));
            int bottomDxRIndex = int(min(ceil(dxR), ${r-1}.0));
            float dxRLerp = dxR - float(topDxRIndex);
            float inverseDxRLerp = 1.0 - dxRLerp;

            float dxC = float(dyC) * widthScale;
            int leftDxCIndex = int(floor(dxC));
            int rightDxCIndex = int(min(ceil(dxC), ${a-1}.0));
            float dxCLerp = dxC - float(leftDxCIndex);
            float inverseDxCLerp = 1.0 - dxCLerp;

            if (r == topDxRIndex && c == leftDxCIndex) {
              // topLeft
              accumulator +=
                getDy(b, dyR, dyC, d) * inverseDxRLerp * inverseDxCLerp;
            }

            if (r == topDxRIndex && c == rightDxCIndex) {
              // topRight
              accumulator += getDy(b, dyR, dyC, d) * inverseDxRLerp * dxCLerp;
            }

            if (r == bottomDxRIndex && c == leftDxCIndex) {
              // bottomLeft
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * inverseDxCLerp;
            }

            if (r == bottomDxRIndex && c == rightDxCIndex) {
              // bottomRight
              accumulator += getDy(b, dyR, dyC, d) * dxRLerp * dxCLerp;
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}let kN={kernelName:x.ResizeBilinearGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a,dy:s}=t,{alignCorners:i}=r,o=new kT(s.shape,a.shape,i);return n.runWebGLProgram(o,[s],s.dtype)}};class k${constructor(e,t,n,r,a){this.variableNames=["A"],this.outputShape=[];const[s,i,o,l]=e;this.outputShape=[s,t,n,l];const u=[r&&t>1?i-1:i,r&&n>1?o-1:o],h=[r&&t>1?t-1:t,r&&n>1?n-1:n];this.userCode=`
      const vec2 effectiveInputOverOutputRatioRC = vec2(
          ${u[0]/h[0]},
          ${u[1]/h[1]});
      const vec2 inputShapeRC = vec2(${i}.0, ${o}.0);

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        ivec2 yRC = coords.yz;

        // Fractional source index.
        vec2 sourceFracIndexRC = ${a?"max((vec2(yRC) + vec2(0.5)) * effectiveInputOverOutputRatioRC, vec2(0.0))":"vec2(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the coordinators of nearest neighbor point.
        ivec2 sourceNearestRC = ivec2(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${r?"0.5":"0.0"})));
        float newValue = getA(b, sourceNearestRC.x, sourceNearestRC.y, d);

        setOutput(newValue);
      }
    `}}class kR{constructor(e,t,n,r,a){this.variableNames=["A"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=[];const[s,i,o,l]=e;this.outputShape=[s,t,n,l];const u=[r&&t>1?i-1:i,r&&n>1?o-1:o],h=[r&&t>1?t-1:t,r&&n>1?n-1:n];this.userCode=`
      const vec3 effectiveInputOverOutputRatioRC = vec3(
          ${u[0]/h[0]},
          ${u[1]/h[1]},
          ${u[1]/h[1]});
      const vec3 inputShapeRC = vec3(${i}.0, ${o}.0,
                                     ${o}.0);

      float getAValue(int b, int r, int c, int d) {
        return getChannel(getA(b, r, c, d), vec2(c, d));
      }

      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        // Calculate values for next column in yRC.z.
        ivec3 yRC = coords.yzz + ivec3(0, 0, 1);

        // Fractional source index.
        vec3 sourceFracIndexRC = ${a?"max((vec3(yRC) + vec3(0.5)) * effectiveInputOverOutputRatioRC, vec3(0.0))":"vec3(yRC) * effectiveInputOverOutputRatioRC"};

        // Compute the coordinators of nearest neighbor point.
        ivec3 sourceNearestRC = ivec3(
          min(inputShapeRC - 1.0, floor(sourceFracIndexRC + ${r?"0.5":"0.0"})));

        // Should we calculate next column and row elements in 2x2 packed cell.
        bool hasNextCol = d < ${l-1};
        bool hasNextRow = coords.z < ${n-1};

        vec4 newValue = vec4(
          getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d),
          hasNextCol ? getAValue(b, sourceNearestRC.x, sourceNearestRC.y, d + 1)
                     : 0.0,
          hasNextRow ? getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d)
                     : 0.0,
          (hasNextRow && hasNextCol) ?
            getAValue(b, sourceNearestRC.x, sourceNearestRC.z, d + 1) : 0.0);

        setOutput(newValue);
      }
    `}}let kA={kernelName:x.ResizeNearestNeighbor,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a}=t,{alignCorners:s,halfPixelCenters:i,size:o}=r,[l,u]=o,h=(0,rN.env)().getBool("WEBGL_PACK_IMAGE_OPERATIONS")?new kR(a.shape,l,u,s,i):new k$(a.shape,l,u,s,i);return n.runWebGLProgram(h,[a],a.dtype)}};class kE{constructor(e,t,n){this.variableNames=["dy"],this.outputShape=[],this.outputShape=t;const[,r,a]=t,[,s,i]=e,o=[n&&s>1?r-1:r,n&&i>1?a-1:a],l=[n&&s>1?s-1:s,n&&i>1?i-1:i],u=o[0]/l[0],h=o[1]/l[1],p=1/u,d=1/h,c=2*Math.ceil(p)+2,f=2*Math.ceil(d)+2;this.userCode=`
      void main() {
        ivec4 coords = getOutputCoords();
        int b = coords[0];
        int d = coords[3];
        int r = coords[1];
        int c = coords[2];

        float accumulator = 0.0;

        const float heightScale = float(${u});
        const float widthScale = float(${h});

        const float invHeightScale = float(${p});
        const float invWidthScale = float(${d});

        const int winHeight = int(${c});
        const int winWidth = int(${f});

        // Compute bounds for where in dy we will look
        float startRLerp = floor(float(r) * invHeightScale);
        int startDyR = int(floor(startRLerp - float(winHeight / 2)));

        float startCLerp = floor(float(c) * invWidthScale);
        int startDyC = int(floor(startCLerp - float(winWidth / 2)));

        // Loop over dy
        for (int dyROffset = 0; dyROffset < winHeight; dyROffset++) {
          int dyR = dyROffset + startDyR;

          // Guard against the window exceeding the bounds of dy
          if (dyR < 0 || dyR >= ${s}) {
            continue;
          }

          for (int dyCOffset = 0; dyCOffset < winWidth; dyCOffset++) {
            int dyC = dyCOffset + startDyC;

            // Guard against the window exceeding the bounds of dy
            if (dyC < 0 || dyC >= ${i}) {
              continue;
            }

            float sourceFracRow =
              float(${o[0]}) *
                (float(dyR) / float(${l[0]}));

            float sourceFracCol =
                float(${o[1]}) *
                  (float(dyC) / float(${l[1]}));

            int sourceNearestRow = int(min(
                float(int(${r}) - 1),
                ${n} ? float(round(sourceFracRow)) :
                                  float(floor(sourceFracRow))));

            int sourceNearestCol = int(min(
                float(int(${a}) - 1),
                ${n} ? float(round(sourceFracCol)) :
                                  float(floor(sourceFracCol))));

            if (r == sourceNearestRow && c == sourceNearestCol) {
              accumulator += getDy(b, dyR, dyC, d);
            }
          }
        }
        // End loop over dy

        setOutput(accumulator);
      }
    `}}let kF={kernelName:x.ResizeNearestNeighborGrad,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{images:a,dy:s}=t,{alignCorners:i}=r,o=new kE(s.shape,a.shape,i);return n.runWebGLProgram(o,[s],s.dtype)}};class kD{constructor(e,t){this.variableNames=["x"];const n=e.length;if(n>4)throw Error(`WebGL backend: Reverse of rank-${n} tensor is not yet supported`);if(this.outputShape=e,1===n){this.userCode=`
        void main() {
          int coord = getOutputCoords();
          setOutput(getX(${e[0]} - coord - 1));
        }
      `;return}const r=e.map((n,r)=>-1!==t.indexOf(r)&&1!==e[r]?`${e[r]} - coords[${r}] - 1`:`coords[${r}]`).join(","),a=yo(n);this.userCode=`
      void main() {
        ${a} coords = getOutputCoords();
        setOutput(getX(${r}));
      }
    `}}class kO{constructor(e,t){this.variableNames=["x"],this.packedInputs=!0,this.packedOutput=!0;const n=e.length;if(n>4)throw Error(`WebGL backend: Reverse of rank-${n} tensor is not yet supported`);this.outputShape=e;const r=bA("rc",n),a=`${r[n-1]} + 1 < ${this.outputShape[n-1]}`,s=`${r[n-2]} + 1 < ${this.outputShape[n-2]}`,i=yo(n);function o(n){let r=e.map((r,a)=>{var s,i;return s=a,i=n,-1!==t.indexOf(s)&&1!==e[s]?`${e[s]} - ${i[s]} - 1`:`${i[s]}`}),a=r.join(","),s=r.slice(-2).join(",");return`getChannel(getX(${a}), vec2(${s}))`}1===n?this.userCode=`
        void main(){
          int rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = getChannel(getX(${e[0]} - rc - 1),
            ${e[0]} - rc - 1);
          if(${a}){
              result.g = getChannel(getX(${e[0]} - (rc  + 1) - 1),
                ${e[0]} - (rc  + 1) - 1);
          }
          setOutput(result);
        }
      `:this.userCode=`
        void main() {
          ${i} rc = getOutputCoords();
          vec4 result = vec4(0.);
          result.r = ${o(r.slice())};
          if(${a}){
            result.g = ${function(e){return e[n-1]="("+e[n-1]+" + 1)",o(e)}(r.slice())};
          }
          if(${s}) {
            result.b = ${function(e){return e[n-2]="("+e[n-2]+" + 1)",o(e)}(r.slice())};
            if(${a}) {
              result.a = ${function(e){return e[n-1]="("+e[n-1]+" + 1)",e[n-2]="("+e[n-2]+" + 1)",o(e)}(r.slice())};
            }
          }
          setOutput(result);
        }
    `}}let kL={kernelName:x.Reverse,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{dims:s}=r,i=a.shape.length,o=rR.util.parseAxisParam(s,a.shape);if(0===i)return b6({inputs:{x:a},backend:n});let l=(0,rN.env)().getBool("WEBGL_PACK_ARRAY_OPERATIONS")?new kO(a.shape,o):new kD(a.shape,o);return n.runWebGLProgram(l,[a],a.dtype)}};var tN=tN;class kz{constructor(e,t){this.variableNames=["Image"],this.outputShape=[],this.customUniforms=[{name:"params",type:"vec4"}];const n=e[1],r=e[2];this.outputShape=e;let a="";a="number"==typeof t?`float outputValue = ${t.toFixed(2)};`:`
        vec3 fill = vec3(${t.join(",")});
        float outputValue = fill[coords[3]];`,this.userCode=`
        void main() {
          ivec4 coords = getOutputCoords();
          int x = coords[2];
          int y = coords[1];
          float coordXFloat = (float(x) - params[0]) * params[3] -
            (float(y) - params[1]) * params[2];
          float coordYFloat = (float(x) - params[0]) * params[2] +
            (float(y) - params[1]) * params[3];
          int coordX = int(round(coordXFloat + params[0]));
          int coordY = int(round(coordYFloat + params[1]));
          ${a}
          if(coordX >= 0 && coordX < ${r} && coordY >= 0 && coordY < ${n}) {
            outputValue = getImage(coords[0], coordY, coordX, coords[3]);
          }
          setOutput(outputValue);
        }
    `}}let k_={kernelName:x.RotateWithOffset,backendName:"webgl",kernelFunc:({inputs:e,attrs:t,backend:n})=>{let{image:r}=e,{radians:a,fillValue:s,center:i}=t,o=new kz(r.shape,s),[l,u]=tN.getImageCenter(i,r.shape[1],r.shape[2]),h=[[l,u,Math.sin(a),Math.cos(a)]];return n.runWebGLProgram(o,[r],r.dtype,h)}},kM=vo({opSnippet:`
  // OpenGL ES does not support round function.
  // The algorithm is based on banker's rounding.
  float base = floor(x);
  if ((x - base) < 0.5) {
    return floor(x);
  } else if ((x - base) > 0.5) {
    return ceil(x);
  } else {
    if (mod(base, 2.0) == 0.0) {
      return base;
    } else {
      return base + 1.0;
    }
  }
`}),kP={kernelName:x.Round,backendName:"webgl",kernelFunc:kM},kB=vo({opSnippet:"return inversesqrt(x);",cpuKernelImpl:bh}),kW={kernelName:x.Rsqrt,backendName:"webgl",kernelFunc:kB};var tN=tN;class kG{constructor(e,t,n,r,a,s,i=!0,o=!1){this.variableNames=["updates","indices","defaultValue"],this.outputShape=s;const l=yo(a.length),u=yo(s.length);let h="";1===n?h="i":2===n&&(h="i, j");const p=`getIndices(${h})`;let d="";1===r?d="i":2===r&&(d="i, coords[1]");const c=`getUpdates(${d})`;let f="";o&&(f="coords[0], coords[1]");const m=`getDefaultValue(${f})`;this.userCode=`
        ${l} strides = ${l}(${a});

        void main() {
          ${u} coords = getOutputCoords();
          float sum = 0.0;
          bool found = false;
          for (int i = 0; i < ${e}; i++) {
            int flattenedIndex = 0;
            for (int j = 0; j < ${t}; j++) {
              int index = round(${p});
              flattenedIndex += index * ${t>1?"strides[j]":"strides"};
            }
            if (flattenedIndex == coords[0]) {
              sum += ${c};
              found = true;
            }
          }
          setOutput(mix(${m}, sum, float(found)));
        }
      `}}class kU{constructor(e,t,n,r,a,s,i=!0,o=!1){this.variableNames=["updates","indices","defaultValue"],this.packedInputs=!0,this.packedOutput=!0,this.outputShape=s;const l=yo(a.length),u=yo(s.length);let h="";1===n?h="i":2===n&&(h="i, j");const p=`getIndices(${h})`;let d="";1===r?d="i":2===r&&(d="i, coords[1]");const c=`getUpdates(${d})`;let f="";o&&(f="coords[0], coords[1]");const m=`getDefaultValue(${f})`;this.userCode=`
        ${l} strides = ${l}(${a});

        void main() {
          ${u} coords = getOutputCoords();
          vec4 sum = vec4(0.);
          vec4 found = vec4(0.);
          for (int i = 0; i < ${e}; i+=2) {
            ivec2 flattenedIndex = ivec2(0);
            for (int j = 0; j < ${t}; j+=2) {
              ivec4 index = round(${p});
              flattenedIndex += index.xz * ${t>1?"strides[j]":"strides"};
              if (j + 1 < ${t}) {
                flattenedIndex += index.yw * ${t>1?"strides[j + 1]":"strides"};
              }
            }
            if (flattenedIndex[0] == coords[0] || flattenedIndex[1] == coords[0] ||
                flattenedIndex[0] == coords[0] + 1 || flattenedIndex[1] == coords[0] + 1) {
              vec4 updVals = ${c};
              if (flattenedIndex[0] == coords[0]) {
                sum.xy += updVals.xy;
                found.xy = vec2(1.);
              } else if (flattenedIndex[0] == coords[0] + 1) {
                sum.zw += updVals.xy;
                found.zw = vec2(1.);
              }
              if (flattenedIndex[1] == coords[0]) {
                sum.xy += updVals.zw;
                found.xy = vec2(1.);
              } else if (flattenedIndex[1] == coords[0] + 1) {
                sum.zw += updVals.zw;
                found.zw = vec2(1.);
              }
            }
          }
          setOutput(mix(${m}, sum, found));
        }
      `}}let kV={kernelName:x.ScatterNd,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{indices:s,updates:i}=n,{shape:o}=a,{sliceRank:l,numUpdates:u,sliceSize:h,strides:p,outputSize:d}=tN.calculateShapes(i,s,o),c=[d/h,h];if(0===d)return r.makeTensorInfo(o,s.dtype);let f=vm({inputs:{x:s},backend:r,attrs:{shape:[u,l]}}),m=vm({inputs:{x:i},backend:r,attrs:{shape:[u,h]}}),g=r.makeTensorInfo([],"float32",new Float32Array([0]));t=(0,rN.env)().getBool("WEBGL_PACK")?new kU(u,l,f.shape.length,m.shape.length,p,c):new kG(u,l,f.shape.length,m.shape.length,p,c);let x=r.runWebGLProgram(t,[m,f,g],m.dtype),y=vm({inputs:{x:x},backend:r,attrs:{shape:o}});return r.disposeIntermediateTensorInfo(f),r.disposeIntermediateTensorInfo(m),r.disposeIntermediateTensorInfo(x),r.disposeIntermediateTensorInfo(g),y}};class kH{constructor(e,t,n,r){this.variableNames=["sortedSequence","values"],this.customUniforms=[{name:"numInputs",type:"int"}],this.outputShape=[e,n];const a=`for (int i = 0; i < ${Math.ceil(Math.log2(t+1))}; ++i) { if (left >= right) break;`,s=2===(0,rN.env)().getNumber("WEBGL_VERSION")?"while (left < right) {":a;this.userCode=`
       int findBound(int batch, float value) {
         int left = 0;
         int right = numInputs;
         int mid;
         ${s}
           mid = (left + right) / 2;
           if (getSortedSequence(batch, mid) ${"left"===r?"<":"<="} value) {
             left = mid + 1;
           } else {
             right = mid;
           }
         }
         return right;
       }

       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int valueIndex = coords[1];

         float value = getValues(batch, valueIndex);

         setOutput(float(findBound(batch, value)));
       }
     `}}let kq={kernelName:x.SearchSorted,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{sortedSequence:a,values:s}=t,{side:i}=r,o=new kH(a.shape[0],a.shape[1],s.shape[1],i),l=[[a.shape[1]]];return n.runWebGLProgram(o,[a,s],"int32",l)}};class kj{constructor(e,t,n){let r,a;if(this.variableNames=["c","a","b"],this.outputShape=t,n>4)throw Error(`Where for rank ${n} is not yet supported`);if(1===n)a="resRC",r="resRC";else{const n=["resRC.x","resRC.y","resRC.z","resRC.w"],s=[],i=[];for(let r=0;r<t.length;r++)i.push(`${n[r]}`),r<e&&s.push(`${n[r]}`);r=s.join(),a=i.join()}const s=yo(n);this.userCode=`
      void main() {
        ${s} resRC = getOutputCoords();
        float cVal = getC(${r});
        if (cVal >= 1.0) {
          setOutput(getA(${a}));
        } else {
          setOutput(getB(${a}));
        }
      }
    `}}let kX={kernelName:x.Select,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{condition:r,t:a,e:s}=t,i=new kj(r.shape.length,a.shape,a.shape.length);return n.runWebGLProgram(i,[r,a,s],(0,d5.upcastType)(a.dtype,s.dtype))}};var tN=tN;let kK=vo({opSnippet:`
  // Stable and Attracting Fixed Point (0, 1) for Normalized Weights.
  // see: https://arxiv.org/abs/1706.02515
  float scaleAlpha = ${tN.SELU_SCALEALPHA};
  float scale = ${tN.SELU_SCALE};
  return (x >= 0.0) ? scale * x : scaleAlpha * (exp(x) - 1.0);
`}),kY={kernelName:x.Selu,backendName:"webgl",kernelFunc:kK},kZ=vo({opSnippet:vi+`
  return 1.0 / (1.0 + exp(-1.0 * x));
`,packedOpSnippet:`
  vec4 result = 1.0 / (1.0 + exp(-1.0 * x));
  bvec4 isNaN = isnan(x);

  result.r = isNaN.r ? x.r : result.r;
  result.g = isNaN.g ? x.g : result.g;
  result.b = isNaN.b ? x.b : result.b;
  result.a = isNaN.a ? x.a : result.a;

  return result;
`,cpuKernelImpl:bd}),kJ={kernelName:x.Sigmoid,backendName:"webgl",kernelFunc:kZ},kQ=vo({opSnippet:`
  if (isnan(x)) { return 0.0; }
  return sign(x);
`}),k0={kernelName:x.Sign,backendName:"webgl",kernelFunc:kQ},k1=vo({opSnippet:vi+`
  return sin(x);
`,packedOpSnippet:`
  vec4 result = sin(x);
  bvec4 isNaN = isnan(x);
  ${b4}
  return result;
`}),k2={kernelName:x.Sin,backendName:"webgl",kernelFunc:k1},k3=vo({opSnippet:`
  float e2x = exp(x);
  return (e2x - 1.0 / e2x) / 2.0;
`}),k4={kernelName:x.Sinh,backendName:"webgl",kernelFunc:k3},k5=vo({opSnippet:`
  float epsilon = 1.1920928955078125e-7;
  float threshold = log(epsilon) + 2.0;

  bool too_large = x > -threshold;
  bool too_small = x < threshold;

  float result;
  float exp_x = exp(x);

  if (too_large){
    result = x;
  }
  else if (too_small){
    result = exp_x;
  }
  else{
    result = log(exp_x + 1.0);
  }
  return result;
`}),k6={kernelName:x.Softplus,backendName:"webgl",kernelFunc:k5};var tN=tN;let k8={kernelName:x.SpaceToBatchND,backendName:"webgl",kernelFunc:e=>{let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{blockShape:s,paddings:i}=r;rR.util.assert(a.shape.length<=4,()=>"spaceToBatchND for rank > 4 with a WebGL backend not implemented yet");let o=s.reduce((e,t)=>e*t),l=[[0,0]];l.push(...i);for(let e=1+s.length;e<a.shape.length;++e)l.push([0,0]);let u=[],h=ko({inputs:{x:a},backend:n,attrs:{paddings:l,constantValue:0}}),p=tN.getReshaped(h.shape,s,o,!1),d=tN.getPermuted(p.length,s.length,!1),c=tN.getReshapedPermuted(h.shape,s,o,!1),f=vm({inputs:{x:h},backend:n,attrs:{shape:p}}),m=vS({inputs:{x:f},backend:n,attrs:{perm:d}}),g=vm({inputs:{x:m},backend:n,attrs:{shape:c}});return u.push(h),u.push(f),u.push(m),u.forEach(e=>n.disposeIntermediateTensorInfo(e)),g}},k9={kernelName:x.SparseFillEmptyRows,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{indices:r,values:a,denseShape:s,defaultValue:i}=t;if(1!==s.shape.length)throw Error(`Dense shape must be a vector, saw:
         ${s.shape}`);if(2!==r.shape.length)throw Error(`Indices must be a matrix, saw:
         ${r.shape}`);if(1!==a.shape.length)throw Error(`Values must be a vector, saw:
         ${a.shape}`);if(0!==i.shape.length)throw Error(`Default value must be a scalar, saw:
        ${i.shape}`);let o=n.readSync(r.dataId),l=n.readSync(a.dataId),u=n.readSync(s.dataId),h=n.readSync(i.dataId)[0],[p,d,c,f,m]=bm(o,r.shape,r.dtype,l,a.dtype,u,h);return[n.makeTensorInfo(d,r.dtype,p),n.makeTensorInfo([d[0]],a.dtype,c),n.makeTensorInfo([f.length],"bool",new Uint8Array(f.map(e=>Number(e)))),n.makeTensorInfo([m.length],r.dtype,new Int32Array(m))]}},k7={kernelName:x.SparseReshape,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{inputIndices:r,inputShape:a,newShape:s}=t;if(2!==r.shape.length)throw Error(`Input indices should be a matrix but received shape ${r.shape}`);if(1!==a.shape.length)throw Error(`Input shape should be a vector but received shape ${a.shape}`);if(1!==s.shape.length)throw Error(`Target shape should be a vector but received shape ${s.shape}`);let i=Array.from(n.readSync(a.dataId)),o=n.readSync(r.dataId),l=Array.from(n.readSync(s.dataId)),[u,h,p]=bg(o,r.shape,r.dtype,i,l);return[n.makeTensorInfo(h,r.dtype,u),n.makeTensorInfo([p.length],s.dtype,new Int32Array(p))]}},Se={kernelName:x.SparseSegmentMean,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{data:r,indices:a,segmentIds:s}=t;if(r.shape.length<1)throw Error("Data should be at least 1 dimensional but received scalar");if(1!==a.shape.length)throw Error(`Indices should be a vector but received shape
              ${a.shape}`);if(1!==s.shape.length)throw Error(`Segment ids should be a vector but received shape
              ${s.shape}`);let i=n.readSync(r.dataId),o=n.readSync(a.dataId),l=n.readSync(s.dataId),[u,h]=bx(i,r.shape,r.dtype,o,l,!0);return n.makeTensorInfo(h,r.dtype,u)}},St={kernelName:x.SparseSegmentSum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n}=e,{data:r,indices:a,segmentIds:s}=t;if(r.shape.length<1)throw Error("Data should be at least 1 dimensional but received scalar");if(1!==a.shape.length)throw Error(`Indices should be a vector but received shape
             ${a.shape}`);if(1!==s.shape.length)throw Error(`Segment ids should be a vector but received shape
             ${s.shape}`);let i=n.readSync(r.dataId),o=n.readSync(a.dataId),l=n.readSync(s.dataId),[u,h]=bx(i,r.shape,r.dtype,o,l);return n.makeTensorInfo(h,r.dtype,u)}};var tN=tN;let Sn={kernelName:x.SparseToDense,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{sparseIndices:a,sparseValues:s,defaultValue:i}=t,{outputShape:o}=r,{sliceRank:l,numUpdates:u,sliceSize:h,strides:p,outputSize:d}=tN.calculateShapes(s,a,o);if("string"===s.dtype){let e=bp(n.bufferSync(a),n.bufferSync(s),o,d,h,u,l,p,rR.util.decodeString(n.readSync(i.dataId)[0]),!1);return n.makeTensorInfo(o,e.dtype,e.values)}let c=new kG(u,l,a.shape.length,s.shape.length,p,[d,1],!1),f=n.runWebGLProgram(c,[s,a,i],s.dtype),m=vm({inputs:{x:f},backend:n,attrs:{shape:o}});return n.disposeIntermediateTensorInfo(f),m}};var tN=tN;let Sr={kernelName:x.SplitV,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{numOrSizeSplits:s,axis:i}=r,o=rR.util.parseAxisParam(i,a.shape)[0],l=tN.prepareSplitSize(a,s,o),u=Array(a.shape.length).fill(0),h=a.shape.slice();return l.map(e=>{let t=[...h];t[o]=e;let r=wu({inputs:{x:a},backend:n,attrs:{begin:u,size:t}});return u[o]+=e,r})}},Sa="return sqrt(x);",Ss=vo({opSnippet:Sa,packedOpSnippet:Sa,cpuKernelImpl:by}),Si={kernelName:x.Sqrt,backendName:"webgl",kernelFunc:Ss},So=vo({opSnippet:"return x * x;"}),Sl={kernelName:x.Square,backendName:"webgl",kernelFunc:So},Su="return (a - b) * (a - b);",Sh=vl({opSnippet:Su,packedOpSnippet:Su}),Sp={kernelName:x.SquaredDifference,backendName:"webgl",kernelFunc:Sh};var tN=tN;let Sd={kernelName:x.StaticRegexReplace,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t;if("string"!==a.dtype)throw Error("Input must be of datatype string");let s=n.readSync(a.dataId),i=bb(tN.fromUint8ToStringArray(s),"string",r);return n.makeTensorInfo(a.shape,"string",i)}},Sc={kernelName:x.Step,backendName:"webgl",kernelFunc:function({inputs:e,attrs:t,backend:n}){let{x:r}=e,a=bM+`
    return x > 0.0 ? 1.0 : float(${t.alpha});
  `,s=new b_(r.shape,a);return n.runWebGLProgram(s,[r],r.dtype)}};var cx=tJ;class Sf{constructor(e,t,n){this.variableNames=["x"],this.outputShape=n;const r=n.length,a=yo(n.length),s=yo(n.length);let i="";if(1===r)i="coords * strides + begin";else{let e=0;i=n.map((t,r)=>(e++,1===n.length?`coords * strides[${r}] + begin[${r}]`:`coords[${e-1}] * strides[${r}] + begin[${r}]`)).join(",")}this.userCode=`
      ${a} begin = ${a}(${e});
      ${a} strides = ${a}(${t});

      void main() {
        ${s} coords = getOutputCoords();
        setOutput(getX(${i}));
      }
    `}}let Sm={kernelName:x.StridedSlice,backendName:"webgl",kernelFunc:function(e){let t,{inputs:n,backend:r,attrs:a}=e,{x:s}=n,{begin:i,end:o,strides:l,beginMask:u,endMask:h,ellipsisMask:p,newAxisMask:d,shrinkAxisMask:c}=a,{finalShapeSparse:f,finalShape:m,isIdentity:g,sliceDim0:x,isSimpleSlice:y,begin:b,end:v,strides:w}=cx.sliceInfo(s.shape,i,o,l,u,h,p,d,c);if(g)t=vm({inputs:{x:s},backend:r,attrs:{shape:m}});else if(x||y){rR.util.assert(s.shape.length>=1,()=>`Input must have rank at least 1, got: ${s.shape.length}`);let e=cx.computeOutShape(b,v,w),n=wu({inputs:{x:s},backend:r,attrs:{begin:b,size:e}});t=vm({inputs:{x:n},backend:r,attrs:{shape:m}}),r.disposeIntermediateTensorInfo(n)}else if(r.shouldExecuteOnCPU([s])){let e=r.readSync(s.dataId),n=bv(f,(0,pz.buffer)(s.shape,s.dtype,e),w,b);t=r.makeTensorInfo(m,s.dtype,n.values)}else{let e=new Sf(b,w,f);t=r.runWebGLProgram(e,[s],s.dtype)}let I=vm({inputs:{x:t},backend:r,attrs:{shape:m}});return r.disposeIntermediateTensorInfo(t),I}},Sg={kernelName:x.StringNGrams,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{separator:a,nGramWidths:s,leftPad:i,rightPad:o,padWidth:l,preserveShortSequences:u}=r,{data:h,dataSplits:p}=t,[d,c]=bw(n.readSync(h.dataId),n.readSync(p.dataId),a,s,i,o,l,u);return[n.makeTensorInfo([d.length],"string",d),n.makeTensorInfo(p.shape,"int32",c)]}},Sx={kernelName:x.StringSplit,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{skipEmpty:a}=r,{input:s,delimiter:i}=t;if("string"!==s.dtype)throw Error("Input must be of datatype string");if(1!==s.shape.length)throw Error(`Input must be a vector, got shape: ${s.shape}`);if(0!==i.shape.length)throw Error(`Delimiter must be a scalar, got shape: ${i.shape}`);let[o,l,u]=bI(n.readSync(s.dataId),n.readSync(i.dataId)[0],a),h=l.length;return[n.makeTensorInfo([h,2],"int32",o),n.makeTensorInfo([h],"string",l),n.makeTensorInfo([2],"int32",new Int32Array(u))]}},Sy={kernelName:x.StringToHashBucketFast,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{numBuckets:a}=r,{input:s}=t;if("string"!==s.dtype)throw Error("Input must be of datatype string");if(a<=0)throw Error("Number of buckets must be at least 1");let i=bC(n.readSync(s.dataId),a);return n.makeTensorInfo(s.shape,"int32",i)}},Sb=vo({opSnippet:"return tan(x);"}),Sv={kernelName:x.Tan,backendName:"webgl",kernelFunc:Sb},Sw=vo({opSnippet:`
  float e2x = exp(-2.0 * abs(x));
  return sign(x) * (1.0 - e2x) / (1.0 + e2x);
`}),SI={kernelName:x.Tanh,backendName:"webgl",kernelFunc:Sw};var tN=tN;let SC={kernelName:x.TensorScatterUpdate,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{tensor:a,indices:s,updates:i}=t,{}=r,{sliceRank:o,numUpdates:l,sliceSize:u,strides:h,outputSize:p}=tN.calculateShapes(i,s,a.shape),d=[p/u,u];if(0===p)return n.makeTensorInfo(a.shape,s.dtype);let c=vm({inputs:{x:s},backend:n,attrs:{shape:[l,o]}}),f=vm({inputs:{x:i},backend:n,attrs:{shape:[l,u]}}),m=vm({inputs:{x:a},backend:n,attrs:{shape:d}}),g=new kG(l,o,c.shape.length,f.shape.length,h,d,!1,!0),x=n.runWebGLProgram(g,[f,c,m],m.dtype),y=vm({inputs:{x:x},backend:n,attrs:{shape:a.shape}});return n.disposeIntermediateTensorInfo(c),n.disposeIntermediateTensorInfo(f),n.disposeIntermediateTensorInfo(m),n.disposeIntermediateTensorInfo(x),y}};class Sk{constructor(e,t){this.variableNames=["A"];const n=Array(e.length);for(let r=0;r<n.length;r++)n[r]=e[r]*t[r];this.outputShape=n,this.rank=n.length;const r=yo(this.rank),a=function(e){let t=e.length;if(t>5)throw Error(`Tile for rank ${t} is not yet supported`);if(1===t)return`imod(resRC, ${e[0]})`;let n=["resRC.x","resRC.y","resRC.z","resRC.w","resRC.u"],r=[];for(let t=0;t<e.length;t++)r.push(`imod(${n[t]}, ${e[t]})`);return r.join()}(e);this.userCode=`
      void main() {
        ${r} resRC = getOutputCoords();
        setOutput(getA(${a}));
      }
    `}}function SS(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{reps:s}=r;if("string"===a.dtype||a.shape.length>5){let e=n.readSync(a.dataId),t="string"===a.dtype?e.map(e=>rR.util.decodeString(e)):e,r=bS((0,pz.buffer)(a.shape,a.dtype,t),s);return n.makeTensorInfo(r.shape,r.dtype,r.values)}let i=new Sk(a.shape,s);return n.runWebGLProgram(i,[a],a.dtype)}let ST={kernelName:x.Tile,backendName:"webgl",kernelFunc:SS};class SN{constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"negativeInf",type:"float"},{name:"dir",type:"int"},{name:"inc",type:"int"}],this.outputShape=e,this.userCode=`
       void main() {
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // We compare elements pair-wise within a group of size 2 * inc.
         // The comparing rule for each group alternates between ascending
         // and descending. Within each group, we compare each pair at
         // positions i and i+inc. To decide whether an element at position i
         // is x0 or x1, we mod it by 2 * inc, if the result is smaller than
         // inc, it is in the first half of the group, we denote it as x0,
         // otherwise we denote it as x1.
         // For example, as shown in the Bitonic top K paper referenced above,
         // Figure5(a) shows that element[1] is in the
         // second half of the group when group size is 2, but it is in the
         // first half of the group when group size is 4.

         bool isFirstInPair = imod(elemIdx, 2 * inc) < inc;
         int i = isFirstInPair ? elemIdx : elemIdx - inc;

         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + inc : int(getIndices(batch, i + inc));
         float x0 = i0 < n ? getX(batch, i0) : negativeInf;
         float x1 = i1 < n ? getX(batch, i1) : negativeInf;

         // Denotes which direction indices are in (ascending or descending).
         bool reverse = imod(elemIdx, 2 * dir) >= dir;
         bool isGreater = x0 > x1 || (x0 == x1 && i1 > i0);
         if (reverse == isGreater) { // Elements in opposite order of direction
           int iTemp = i0;
           i0 = i1;
           i1 = iTemp;
         }
         if (isFirstInPair) {
            setOutput(float(i0));
         } else {
            setOutput(float(i1));
         }
       }
     `}}class S${constructor(e){this.variableNames=["x","indices"],this.customUniforms=[{name:"n",type:"int"},{name:"firstPass",type:"int"},{name:"k",type:"int"}],this.outputShape=e,this.userCode=`
    void main() {
         // Takes max of indices (0, k), (1, k + 1), (2, k + 2) ...
         ivec2 coords = getOutputCoords();
         int batch = coords[0];
         int elemIdx = coords[1];

         // The output size is half of the previous size.
         // If the previous sequence is | | | | _ _ _ _  | | | |  _ _ _ _ (k=4),
         // we only need to output the indices at positions |, the indices at
         // positions _ can be thrown away, see Figure5(b) After Phase 2
         // (Merge phase) in the Bitonic Top K paper referenced above.
         // For example, the paper shows we only need to output the orange bars.
         // The output sequence should look like this | | | | | | | |.
         // Because the sequence is halved, to map the output index back
         // to the previous sequence to find the corresponding value,
         // we need to double the index. When we double the index,
         // we basically interpolate a position, so 2i looks like
         // | _ | _ | _ | _ | _ | _ | _. We move the | to the first k position
         // of each 2k positions by - elemIdx % k. E.g. for output at
         // index 4,5,6,7, we want to get the corresponding element at
         // original index 8,9,10,11, for output at index 8,9,10,11,
         // we want to get the corresponding element at original index
         // 16,17,18,19, so on and so forth.

         int i = elemIdx < k ? elemIdx : (elemIdx * 2 - imod(elemIdx, k));
         int i0 = firstPass == 1 ? i : int(getIndices(batch, i));
         int i1 = firstPass == 1 ? i + k : int(getIndices(batch, i + k));

         float x0 = getX(batch, i0);
         float x1 = i1 < n ? getX(batch, i1) : x0;

         setOutput(x0 >= x1 ? float(i0) : float(i1));
       }
     `}}function SR(e,t){null!==t&&e.disposeIntermediateTensorInfo(t)}function SA(e){let t=1;for(;t<e;)t*=2;return t}let SE={kernelName:x.TopK,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a}=t,{k:s,sorted:i}=r,o=(0,rN.env)().getNumber("TOPK_LAST_DIM_CPU_HANDOFF_SIZE_THRESHOLD"),l=(0,rN.env)().getNumber("TOPK_K_CPU_HANDOFF_THRESHOLD"),u=a.shape,h=u[u.length-1];if(n.shouldExecuteOnCPU([a])||h<o||s>l){let[e,t]=bT(n.readSync(a.dataId),u,a.dtype,s,i);return[n.makeTensorInfo(e.shape,e.dtype,e.values),n.makeTensorInfo(t.shape,t.dtype,t.values)]}if(0===s)return u[u.length-1]=0,[n.makeTensorInfo(u,a.dtype,[]),n.makeTensorInfo(u,"int32",[])];if(1===h)return[a,IM({attrs:{shape:u,dtype:"int32",value:0},backend:n})];let p=n.texData.get(a.dataId),d=null!==p&&p.isPacked,c=d?n.unpackTensor(a):a,f=rR.util.sizeFromShape(u)/h,m=vm({inputs:{x:c},attrs:{shape:[f,h]},backend:n});d&&SR(n,c);let g=SA(s),x=SA(h),y=null,b=()=>null===y?[m,m]:[m,y],v=(e,t,r)=>{let a=b(),s=new SN(r),i=[[h],[+(null===y)],[-1/0],[e],[t]],o=y;y=n.runWebGLProgram(s,a,"int32",i),SR(n,o)};for(let e=1;e<g;e*=2){let t=2*e;for(let n=e;n>=1;n/=2)v(t,n,[f,x])}for(let e=x;e>g;e/=2){let t=b(),r=new S$([f,e/2]),a=[[h],[+(null===y)],[g]],s=y;y=n.runWebGLProgram(r,t,"int32",a),SR(n,s);let i=g/2,o=2*i;for(let e=i;e>=1;e/=2)v(o,e,y.shape)}let w=y;y=wu({inputs:{x:y},backend:n,attrs:{begin:0,size:[f,s]}}),SR(n,w);let I=I2({inputs:{x:m,indices:y},backend:n,attrs:{axis:1,batchDims:1}});SR(n,m);let C=u.slice(0,-1);C.push(s),w=y,y=vm({inputs:{x:y},attrs:{shape:C},backend:n}),SR(n,w);let k=I;return I=vm({inputs:{x:I},attrs:{shape:C},backend:n}),SR(n,k),[I,y]}};class SF{constructor(e,t,n,r,a,s){let i;switch(this.variableNames=["Image","Transforms"],this.outputShape=s,r){case"constant":default:i=1;break;case"reflect":i=2;break;case"wrap":i=3;break;case"nearest":i=4}this.userCode=`
            float mapCoord(float outCoord, float len) {
              float inCoord = outCoord;
              if(${i} == 2) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    if (inCoord < sz2) {
                      inCoord = sz2 * float(int(float(-inCoord / sz2))) +
                      inCoord;
                    }
                    inCoord = inCoord < -len ? inCoord + sz2 : -inCoord - 1.0;
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz2 = 2.0 * len;
                    inCoord -= sz2 * float(int(float(inCoord / sz2)));
                    if (inCoord >= len) {
                      inCoord = sz2 - inCoord - 1.0;
                    }
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${i} == 3) {
                if (inCoord < 0.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord += len * (float(int(float(-inCoord / sz))) + 1.0);
                  }
                } else if (inCoord > len - 1.0) {
                  if (len <= 1.0) {
                    inCoord = 0.0;
                  } else {
                    float sz = len - 1.0;
                    inCoord -= len * float(int(float(inCoord / sz)));
                  }
                }
                return clamp(inCoord, 0.0, len - 1.0);
              } else if (${i} == 4) {
                return clamp(outCoord, 0.0, len - 1.0);
              } else {
                return outCoord;
              }
            }

            float readWithFillValue(int batch, int coordY, int coordX,
              int channel) {
              float outputValue;
              if (0 <= coordY && coordY < ${e} && 0 <= coordX && coordX < ${t}) {
                  outputValue = getImage(batch, coordY, coordX, channel);
              } else {
                outputValue = float(${a});
              }
              return outputValue;
            }

            void main() {
              ivec4 coords = getOutputCoords();
              float outputValue;
              int batch = coords[0];
              int x = coords[2];
              int y = coords[1];
              int channel = coords[3];
              float xf = float(x);
              float yf = float(y);
              float a1 = getTransforms(batch, 0);
              float a2 = getTransforms(batch, 1);
              float a3 = getTransforms(batch, 2);
              float b1 = getTransforms(batch, 3);
              float b2 = getTransforms(batch, 4);
              float b3 = getTransforms(batch, 5);
              float c1 = getTransforms(batch, 6);
              float c2 = getTransforms(batch, 7);
              float projection = c1 * xf + c2 * yf + 1.0;
              if (projection == 0.0) {
                outputValue = float(${a});
              } else {
                float inX = (a1 * xf + a2 * yf + a3) / projection;
                float inY = (b1 * xf + b2 * yf + b3) / projection;
                float mapX = mapCoord(inX, float(${t}));
                float mapY = mapCoord(inY, float(${e}));

                if (${"nearest"===n?1:2} == 1) {
                  int coordY = int(round(mapY));
                  int coordX = int(round(mapX));
                  outputValue = readWithFillValue(batch, coordY, coordX,
                    channel);
                } else {
                  float yFloor = floor(mapY);
                  float xFloor = floor(mapX);
                  float yCeil = yFloor + 1.0;
                  float xCeil = xFloor + 1.0;
                  float valueYFloor = (xCeil - mapX) *
                  readWithFillValue(batch, int(yFloor), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yFloor), int(xCeil), channel);
                  float valueYCeil = (xCeil - mapX) *
                  readWithFillValue(batch, int(yCeil), int(xFloor), channel) +
                  (mapX - xFloor) *
                  readWithFillValue(batch, int(yCeil), int(xCeil), channel);
                  outputValue = (yCeil - mapY) * valueYFloor +
                  (mapY - yFloor) * valueYCeil;
                }
              }
              setOutput(outputValue);
            }
        `}}let SD={kernelName:x.Transform,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{image:a,transforms:s}=t,{interpolation:i,fillMode:o,fillValue:l,outputShape:u}=r,[h,p,d,c]=a.shape,[f,m]=null!=u?u:[p,d],g=new SF(p,d,i,o,l,[h,f,m,c]);return n.runWebGLProgram(g,[a,s],"float32")}},SO={kernelName:x.Unique,backendName:"webgl",kernelFunc:function(e){let{inputs:t,attrs:n,backend:r}=e,{axis:a}=n,{x:s}=t;x0(s,"unique"),console.warn("WARNING: ","UI might be locked temporarily as data is being downloaded");let{outputValues:i,outputShape:o,indices:l}=b$(r.readSync(s.dataId),a,s.shape,s.dtype);return[r.makeTensorInfo(o,s.dtype,i),r.makeTensorInfo([l.length],"int32",l)]}},SL={kernelName:x.Unpack,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{value:a}=t,{axis:s}=r;s<0&&(s+=a.shape.length);let i=a.shape.length,o=a.shape[s],l=Array(i-1),u=0;for(let e=0;e<i;e++)e!==s&&(l[u++]=a.shape[e]);let h=[],p=Array(i).fill(0),d=a.shape.slice();d[s]=1;let c=Array(o);for(let e=0;e<c.length;e++){p[s]=e;let t=wu({inputs:{x:a},backend:n,attrs:{begin:p,size:d}}),r=vm({inputs:{x:t},backend:n,attrs:{shape:l}});c[e]=r,h.push(t)}return h.forEach(e=>n.disposeIntermediateTensorInfo(e)),c}};var tN=tN;class Sz{constructor(e,t){this.variableNames=["x","segmentIds"];const n=e.windowSize,r=e.batchSize,a=e.inSize,s=e.numSegments,i=s*Math.ceil(a/n);this.outputShape=[r,i];const o=4*Math.floor(n/4),l=n%4,u=`
        sumValue += dot(values, segFilter);
    `;let h="";a%n>0&&(h=`
        if (inIdx < 0 || inIdx >= ${a}) {
          return initializationValue;
        }
      `);let p="";a%n>0&&(p=`
        if (inIdx < 0 || inIdx >= ${a}) {
          return -1.0;
        }
      `),this.userCode=`
      const float initializationValue = 0.0;

      float getValue(int batch, int inIdx) {
        ${h}
        return getX(batch, inIdx);
      }

      float getSegmentIdAtIndex(int inIdx) {
        ${p}
        return getSegmentIds(inIdx);
      }

      void main() {
        ivec2 coords = getOutputCoords();
        int batch = coords[0];
        int outIdx = coords[1];
        int inOffset = int(floor(float(outIdx) / float(
          ${s})) * float(${n}));
        int currentSeg = int(mod(float(outIdx), float(${s})));

        float sumValue = 0.0;

        for (int i = 0; i < ${o}; i += 4) {
          int inIdx = inOffset + i;
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            getValue(batch, inIdx + 3)
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 3)) == currentSeg ? 1 : 0
          );

          ${u}
        }

        int inIdx = inOffset + ${o};
        if (${1===l}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            initializationValue,
            initializationValue,
            initializationValue
          );

          int inIdxSeg = int(getSegmentIdAtIndex(inIdx));

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            0,
            0,
            0
          );

          ${u}
        } else if (${2===l}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            initializationValue,
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
              0,
              0
          );

          ${u}
        } else if (${3===l}) {
          vec4 values = vec4(
            getValue(batch, inIdx),
            getValue(batch, inIdx + 1),
            getValue(batch, inIdx + 2),
            initializationValue
          );

          vec4 segFilter = vec4(
            int(getSegmentIdAtIndex(inIdx)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 1)) == currentSeg ? 1 : 0,
            int(getSegmentIdAtIndex(inIdx + 2)) == currentSeg ? 1 : 0,
            0
          );

          ${u}
        }
        setOutput(sumValue);
      }
    `}}for(let e of[v$,vA,vF,vO,v_,vB,vW,vG,vq,vj,vK,vZ,vQ,v1,v3,v6,v8,we,wt,wn,ws,wp,wd,wm,wg,ww,wk,wN,b7,wA,w_,wH,wY,wJ,wQ,w0,w1,w3,w5,w8,In,Ir,Ia,Ii,Iu,Id,Ic,Im,Ix,Iy,Iv,II,Ik,IT,I$,IA,ID,Iz,IP,IW,IV,Iq,IK,IZ,IJ,I0,I3,I5,I8,b8,I9,wL,Ce,Cn,Ca,vn,Ci,Cl,Cu,Cp,Cc,Cm,Cx,Cb,CI,Ck,CT,C$,CR,CA,CD,CO,CL,Cz,C_,CP,CG,CV,CQ,vf,C2,C4,C6,C9,wy,ke,kr,ka,kl,kh,vs,kp,kd,kc,kf,kg,wv,Cj,ky,kv,kI,vg,kS,kN,kA,kF,kL,k_,kP,kW,kV,kq,kX,kY,kJ,k0,k2,k4,wh,CJ,k6,k8,k9,k7,Se,St,Sn,Sr,Si,Sl,Sp,Sd,Sc,Sm,Sg,Sx,Sy,CY,vk,Sv,SI,SC,ST,SE,SD,vT,SO,SL,{kernelName:x.UnsortedSegmentSum,backendName:"webgl",kernelFunc:function(e){let{inputs:t,backend:n,attrs:r}=e,{x:a,segmentIds:s}=t,{numSegments:i}=r,o=a.shape.length,l=[],u=0,h=tN.getAxesPermutation([u],o),p=a;null!=h&&(p=vS({inputs:{x:a},backend:n,attrs:{perm:h}}),l.push(p),u=tN.getInnerMostAxes(1,o)[0]);let d=tN.segment_util.computeOutShape(p.shape,u,i),c=rR.util.sizeFromShape([p.shape[u]]),f=vm({inputs:{x:p},backend:n,attrs:{shape:[-1,c]}});l.push(f);let m=(0,d5.sumOutType)(a.dtype),g=(e,t,r,a,s)=>{let i=e.shape[0],o=e.shape[1],u=tN.segment_util.segOpComputeOptimalWindowSize(o,s),h=new Sz({windowSize:u,inSize:o,batchSize:i,numSegments:s},t),p=n.compileAndRun(h,[e,r],a);if(l.push(p),p.shape[1]===s)return p;let d=km({backend:n,attrs:{start:0,stop:s,step:1,dtype:"float32"}}),c=SS({inputs:{x:d},backend:n,attrs:{reps:[o/u]}});return l.push(d),l.push(c),g(p,t,c,a,s)},x=vm({inputs:{x:g(f,"unsortedSegmentSum",s,m,i)},backend:n,attrs:{shape:d}}),y=x;return null!=h&&(l.push(x),y=vS({inputs:{x:y},backend:n,attrs:{perm:tN.getUndoAxesPermutation(h)}})),l.forEach(e=>n.disposeIntermediateTensorInfo(e)),y}},kn])(0,nc.registerKernel)(e);e.s([],74659);var S_=e.i(302458),S_=S_;e.i(178983);let SM="4.22.0";e.s(["MathBackendCPU",()=>pW,"shared",0,cq,"version_cpu",()=>SM],179655),e.i(874507);let SP="4.22.0";e.i(379312),e.s(["GPGPUContext",()=>yU,"MathBackendWebGL",()=>bZ,"forceHalfFloat",()=>b0,"gpgpu_util",0,bJ,"setWebGLContext",()=>xr,"webgl_util",0,bQ],125430),e.i(125430),e.s(["GPGPUContext",()=>yU,"MathBackendWebGL",()=>bZ,"forceHalfFloat",()=>b0,"gpgpu_util",()=>bJ,"setWebGLContext",()=>xr,"version_webgl",()=>SP,"webgl",0,b1,"webgl_util",()=>bQ],566545);var SB=e.i(837322),SB=SB;let SW={"tfjs-core":S_.version,"tfjs-backend-cpu":SM,"tfjs-backend-webgl":SP,"tfjs-data":pL,"tfjs-layers":iE,"tfjs-converter":SB.version,tfjs:"4.22.0"};e.s(["version",0,SW],285344),e.i(180338),e.s(["Callback",()=>hO,"CallbackList",()=>s5,"CustomCallback",()=>s9,"EarlyStopping",()=>h_,"History",()=>s8,"InputSpec",()=>sd,"LayerVariable",()=>su,"LayersModel",()=>iZ,"RNN",()=>oZ,"Sequential",()=>i2,"SymbolicTensor",()=>sc,"callbacks",0,{earlyStopping:function(e){return new h_(e)}},"constraints",0,sM,"initializers",0,s0,"input",()=>i5,"layers",0,hp,"loadLayersModel",()=>i0,"metrics",0,h$,"model",()=>i3,"models",0,hR,"registerCallbackConstructor",()=>i6,"regularizers",0,hD,"sequential",()=>i4,"version_layers",()=>iE],192823)}]);

//# debugId=0f09e528-f253-9fcd-b279-553a5b09ab37
//# sourceMappingURL=9918be4bf50d7822.js.map
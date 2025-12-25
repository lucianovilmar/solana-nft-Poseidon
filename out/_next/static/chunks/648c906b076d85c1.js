(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,85621,e=>{"use strict";let t,a;var o,r=e.i(43476),i=e.i(71645),s=e.i(67762),l=e.i(57970),n=e.i(60208);function c({walletIcon:e,walletName:t,...a}){return i.default.createElement(l.Button,{...a,className:"wallet-adapter-button-trigger",startIcon:e&&t?i.default.createElement(n.WalletIcon,{wallet:{adapter:{icon:e,name:t}}}):void 0})}var d=e.i(86614);function p({children:e,labels:t,...a}){let{setVisible:o}=(0,d.useWalletModal)(),{buttonState:r,onConnect:l,onDisconnect:n,publicKey:p,walletIcon:u,walletName:m}=function({onSelectWallet:e}){let t,{connect:a,connected:o,connecting:r,disconnect:l,disconnecting:n,publicKey:c,select:d,wallet:p,wallets:u}=(0,s.useWallet)();t=r?"connecting":o?"connected":n?"disconnecting":p?"has-wallet":"no-wallet";let m=(0,i.useCallback)(()=>{a().catch(()=>{})},[a]),f=(0,i.useCallback)(()=>{l().catch(()=>{})},[l]);return{buttonState:t,onConnect:"has-wallet"===t?m:void 0,onDisconnect:"disconnecting"!==t&&"no-wallet"!==t?f:void 0,onSelectWallet:(0,i.useCallback)(()=>{e({onSelectWallet:d,wallets:u})},[e,d,u]),publicKey:c??void 0,walletIcon:p?.adapter.icon,walletName:p?.adapter.name}}({onSelectWallet(){o(!0)}}),[f,g]=(0,i.useState)(!1),[b,h]=(0,i.useState)(!1),w=(0,i.useRef)(null);(0,i.useEffect)(()=>{let e=e=>{let t=w.current;!t||t.contains(e.target)||h(!1)};return document.addEventListener("mousedown",e),document.addEventListener("touchstart",e),()=>{document.removeEventListener("mousedown",e),document.removeEventListener("touchstart",e)}},[]);let y=(0,i.useMemo)(()=>{if(e)return e;if(p){let e=p.toBase58();return e.slice(0,4)+".."+e.slice(-4)}return"connecting"===r||"has-wallet"===r?t[r]:t["no-wallet"]},[r,e,t,p]);return i.default.createElement("div",{className:"wallet-adapter-dropdown"},i.default.createElement(c,{...a,"aria-expanded":b,style:{pointerEvents:b?"none":"auto",...a.style},onClick:()=>{switch(r){case"no-wallet":o(!0);break;case"has-wallet":l&&l();break;case"connected":h(!0)}},walletIcon:u,walletName:m},y),i.default.createElement("ul",{"aria-label":"dropdown-list",className:`wallet-adapter-dropdown-list ${b&&"wallet-adapter-dropdown-list-active"}`,ref:w,role:"menu"},p?i.default.createElement("li",{className:"wallet-adapter-dropdown-list-item",onClick:async()=>{await navigator.clipboard.writeText(p.toBase58()),g(!0),setTimeout(()=>g(!1),400)},role:"menuitem"},f?t.copied:t["copy-address"]):null,i.default.createElement("li",{className:"wallet-adapter-dropdown-list-item",onClick:()=>{o(!0),h(!1)},role:"menuitem"},t["change-wallet"]),n?i.default.createElement("li",{className:"wallet-adapter-dropdown-list-item",onClick:()=>{n(),h(!1)},role:"menuitem"},t.disconnect):null))}let u={"change-wallet":"Change wallet",connecting:"Connecting ...","copy-address":"Copy address",copied:"Copied",disconnect:"Disconnect","has-wallet":"Connect","no-wallet":"Select Wallet"};function m(e){return i.default.createElement(p,{...e,labels:u})}let f={data:""},g=/(?:([\u0080-\uFFFF\w-%@]+) *:? *([^{;]+?);|([^;}{]*?) *{)|(}\s*)/g,b=/\/\*[^]*?\*\/|  +/g,h=/\n+/g,w=(e,t)=>{let a="",o="",r="";for(let i in e){let s=e[i];"@"==i[0]?"i"==i[1]?a=i+" "+s+";":o+="f"==i[1]?w(s,i):i+"{"+w(s,"k"==i[1]?"":t)+"}":"object"==typeof s?o+=w(s,t?t.replace(/([^,])+/g,e=>i.replace(/([^,]*:\S+\([^)]*\))|([^,])+/g,t=>/&/.test(t)?t.replace(/&/g,e):e?e+" "+t:t)):i):null!=s&&(i=/^--/.test(i)?i:i.replace(/[A-Z]/g,"-$&").toLowerCase(),r+=w.p?w.p(i,s):i+":"+s+";")}return a+(t&&r?t+"{"+r+"}":r)+o},y={},v=e=>{if("object"==typeof e){let t="";for(let a in e)t+=a+v(e[a]);return t}return e};function x(e){let t,a,o,r=this||{},i=e.call?e(r.p):e;return((e,t,a,o,r)=>{var i;let s=v(e),l=y[s]||(y[s]=(e=>{let t=0,a=11;for(;t<e.length;)a=101*a+e.charCodeAt(t++)>>>0;return"go"+a})(s));if(!y[l]){let t=s!==e?e:(e=>{let t,a,o=[{}];for(;t=g.exec(e.replace(b,""));)t[4]?o.shift():t[3]?(a=t[3].replace(h," ").trim(),o.unshift(o[0][a]=o[0][a]||{})):o[0][t[1]]=t[2].replace(h," ").trim();return o[0]})(e);y[l]=w(r?{["@keyframes "+l]:t}:t,a?"":"."+l)}let n=a&&y.g?y.g:null;return a&&(y.g=y[l]),i=y[l],n?t.data=t.data.replace(n,i):-1===t.data.indexOf(i)&&(t.data=o?i+t.data:t.data+i),l})(i.unshift?i.raw?(t=[].slice.call(arguments,1),a=r.p,i.reduce((e,o,r)=>{let i=t[r];if(i&&i.call){let e=i(a),t=e&&e.props&&e.props.className||/^go/.test(e)&&e;i=t?"."+t:e&&"object"==typeof e?e.props?"":w(e,""):!1===e?"":e}return e+o+(null==i?"":i)},"")):i.reduce((e,t)=>Object.assign(e,t&&t.call?t(r.p):t),{}):i,(o=r.target,"object"==typeof window?((o?o.querySelector("#_goober"):window._goober)||Object.assign((o||document.head).appendChild(document.createElement("style")),{innerHTML:" ",id:"_goober"})).firstChild:o||f),r.g,r.o,r.k)}x.bind({g:1});let E,k,C,$=x.bind({k:1});function j(e,t){let a=this||{};return function(){let o=arguments;function r(i,s){let l=Object.assign({},i),n=l.className||r.className;a.p=Object.assign({theme:k&&k()},l),a.o=/ *go\d+/.test(n),l.className=x.apply(a,o)+(n?" "+n:""),t&&(l.ref=s);let c=e;return e[0]&&(c=l.as||e,delete l.as),C&&c[0]&&C(l),E(c,l)}return t?t(r):r}}var N=(e,t)=>"function"==typeof e?e(t):e,S=(t=0,()=>(++t).toString()),A="default",I=(e,t)=>{let{toastLimit:a}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,a)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:o}=t;return I(e,{type:+!!e.toasts.find(e=>e.id===o.id),toast:o});case 3:let{toastId:r}=t;return{...e,toasts:e.toasts.map(e=>e.id===r||void 0===r?{...e,dismissed:!0,visible:!1}:e)};case 4:return void 0===t.toastId?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let i=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+i}))}}},O=[],W={toasts:[],pausedAt:void 0,settings:{toastLimit:20}},z={},B=(e,t=A)=>{z[t]=I(z[t]||W,e),O.forEach(([e,a])=>{e===t&&a(z[t])})},L=e=>Object.keys(z).forEach(t=>B(e,t)),T=(e=A)=>t=>{B(t,e)},D=e=>(t,a)=>{let o,r=((e,t="blank",a)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:"status","aria-live":"polite"},message:e,pauseDuration:0,...a,id:(null==a?void 0:a.id)||S()}))(t,e,a);return T(r.toasterId||(o=r.id,Object.keys(z).find(e=>z[e].toasts.some(e=>e.id===o))))({type:2,toast:r}),r.id},F=(e,t)=>D("blank")(e,t);F.error=D("error"),F.success=D("success"),F.loading=D("loading"),F.custom=D("custom"),F.dismiss=(e,t)=>{let a={type:3,toastId:e};t?T(t)(a):L(a)},F.dismissAll=e=>F.dismiss(void 0,e),F.remove=(e,t)=>{let a={type:4,toastId:e};t?T(t)(a):L(a)},F.removeAll=e=>F.remove(void 0,e),F.promise=(e,t,a)=>{let o=F.loading(t.loading,{...a,...null==a?void 0:a.loading});return"function"==typeof e&&(e=e()),e.then(e=>{let r=t.success?N(t.success,e):void 0;return r?F.success(r,{id:o,...a,...null==a?void 0:a.success}):F.dismiss(o),e}).catch(e=>{let r=t.error?N(t.error,e):void 0;r?F.error(r,{id:o,...a,...null==a?void 0:a.error}):F.dismiss(o)}),e};var M=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,P=$`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,K=$`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,R=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#ff4b4b"};
  position: relative;
  transform: rotate(45deg);

  animation: ${M} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${P} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||"#fff"};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${K} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,_=$`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,J=j("div")`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||"#e0e0e0"};
  border-right-color: ${e=>e.primary||"#616161"};
  animation: ${_} 1s linear infinite;
`,U=$`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,q=$`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,H=j("div")`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||"#61d345"};
  position: relative;
  transform: rotate(45deg);

  animation: ${U} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${q} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||"#fff"};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,V=j("div")`
  position: absolute;
`,Z=j("div")`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,G=$`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,Q=j("div")`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${G} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,X=({toast:e})=>{let{icon:t,type:a,iconTheme:o}=e;return void 0!==t?"string"==typeof t?i.createElement(Q,null,t):t:"blank"===a?null:i.createElement(Z,null,i.createElement(J,{...o}),"loading"!==a&&i.createElement(V,null,"error"===a?i.createElement(R,{...o}):i.createElement(H,{...o})))},Y=j("div")`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,ee=j("div")`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`;function et({onClick:e}){let{publicKey:t}=(0,s.useWallet)();return t?(0,r.jsx)("button",{onClick:()=>{if(e)return void e();if(!t)return;let a=t.toBase58(),o=localStorage.getItem("pendingWallets"),r=o?JSON.parse(o):[];if(r.includes(a))return void F.error("Esta carteira já está na lista para ser adicionada.");let i=[...r,a];localStorage.setItem("pendingWallets",JSON.stringify(i)),F.success("Carteira pronta para ser adicionada ao seu perfil!")},className:"bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors shadow-md",children:"+"}):null}i.memo(({toast:e,position:t,style:o,children:r})=>{let s=e.height?((e,t)=>{let o=e.includes("top")?1:-1,[r,i]=(()=>{if(void 0===a&&"u">typeof window){let e=matchMedia("(prefers-reduced-motion: reduce)");a=!e||e.matches}return a})()?["0%{opacity:0;} 100%{opacity:1;}","0%{opacity:1;} 100%{opacity:0;}"]:[`
0% {transform: translate3d(0,${-200*o}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${-150*o}%,-1px) scale(.6); opacity:0;}
`];return{animation:t?`${$(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${$(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}})(e.position||t||"top-center",e.visible):{opacity:0},l=i.createElement(X,{toast:e}),n=i.createElement(ee,{...e.ariaProps},N(e.message,e));return i.createElement(Y,{className:e.className,style:{...s,...o,...e.style}},"function"==typeof r?r({icon:l,message:n}):i.createElement(i.Fragment,null,l,n))}),o=i.createElement,w.p=void 0,E=o,k=void 0,C=void 0,x`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`;var ea=e.i(381);e.s(["default",0,()=>{let{publicKey:e}=(0,s.useWallet)(),{userProfile:t,setUserProfile:a}=(0,ea.useAppContext)(),[o,l]=(0,i.useState)(!1);(0,i.useEffect)(()=>{if(e&&t.wallets){let a=e.toBase58();l(!t.wallets.includes(a)),console.log("Endereço da carteira conectada:",a,t),n()}else l(!1)},[e,t.wallets]);let n=()=>{if(!e||!t)return;let o=e.toBase58();t.wallets.includes(o)||a({...t,wallets:[...t.wallets,o]})};return(0,r.jsxs)("div",{className:"flex items-center space-x-3 px-4 py-2 bg-white/10 rounded-lg hover:bg-white/20 transition-all duration-200 text-white",children:[(0,r.jsx)(m,{}),o&&(0,r.jsx)(et,{onClick:n})]})}],85621)},77862,e=>{e.n(e.i(85621))}]);
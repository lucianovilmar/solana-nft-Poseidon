(globalThis.TURBOPACK||(globalThis.TURBOPACK=[])).push(["object"==typeof document?document.currentScript:void 0,2709,t=>{"use strict";let e=["abort","canplay","canplaythrough","durationchange","emptied","encrypted","ended","error","loadeddata","loadedmetadata","loadstart","pause","play","playing","progress","ratechange","seeked","seeking","stalled","suspend","timeupdate","volumechange","waiting","waitingforkey","resize","enterpictureinpicture","leavepictureinpicture","webkitbeginfullscreen","webkitendfullscreen","webkitpresentationmodechanged"],i=["autopictureinpicture","disablepictureinpicture","disableremoteplayback","autoplay","controls","controlslist","crossorigin","loop","muted","playsinline","poster","preload","src"];function s(t){return`
    <style>
      :host {
        display: inline-flex;
        line-height: 0;
        flex-direction: column;
        justify-content: end;
      }

      audio {
        width: 100%;
      }
    </style>
    <slot name="media">
      <audio${a(t)}></audio>
    </slot>
    <slot></slot>
  `}function r(t){return`
    <style>
      :host {
        display: inline-block;
        line-height: 0;
      }

      video {
        max-width: 100%;
        max-height: 100%;
        min-width: 100%;
        min-height: 100%;
        object-fit: var(--media-object-fit, contain);
        object-position: var(--media-object-position, 50% 50%);
      }

      video::-webkit-media-text-track-container {
        transform: var(--media-webkit-text-track-transform);
        transition: var(--media-webkit-text-track-transition);
      }
    </style>
    <slot name="media">
      <video${a(t)}></video>
    </slot>
    <slot></slot>
  `}function n(t,{tag:n,is:a}){let o=globalThis.document?.createElement?.(n,{is:a}),l=o?function(t){let e=[];for(let i=Object.getPrototypeOf(t);i&&i!==HTMLElement.prototype;i=Object.getPrototypeOf(i)){let t=Object.getOwnPropertyNames(i);e.push(...t)}return e}(o):[];return class d extends t{static getTemplateHTML=n.endsWith("audio")?s:r;static shadowRootOptions={mode:"open"};static Events=e;static #t=!1;static get observedAttributes(){return d.#e(),[...o?.constructor?.observedAttributes??[],...i]}static #e(){if(this.#t)return;this.#t=!0;let t=new Set(this.observedAttributes);for(let e of(t.delete("muted"),l))if(!(e in this.prototype))if("function"==typeof o[e])this.prototype[e]=function(...t){return this.#i(),(()=>{if(this.call)return this.call(e,...t);let i=this.nativeEl?.[e];return i?.apply(this.nativeEl,t)})()};else{let i={get(){this.#i();let i=e.toLowerCase();if(t.has(i)){let t=this.getAttribute(i);return null!==t&&(""===t||t)}return this.get?.(e)??this.nativeEl?.[e]}};e!==e.toUpperCase()&&(i.set=function(i){this.#i();let s=e.toLowerCase();t.has(s)?!0===i||!1===i||null==i?this.toggleAttribute(s,!!i):this.setAttribute(s,i):this.set?this.set(e,i):this.nativeEl&&(this.nativeEl[e]=i)}),Object.defineProperty(this.prototype,e,i)}}#s=!1;#r=null;#n=new Map;#a;get;set;call;get nativeEl(){return this.#i(),this.#r??this.querySelector(":scope > [slot=media]")??this.querySelector(n)??this.shadowRoot?.querySelector(n)??null}set nativeEl(t){this.#r=t}get defaultMuted(){return this.hasAttribute("muted")}set defaultMuted(t){this.toggleAttribute("muted",t)}get src(){return this.getAttribute("src")}set src(t){this.setAttribute("src",`${t}`)}get preload(){return this.getAttribute("preload")??this.nativeEl?.preload}set preload(t){this.setAttribute("preload",`${t}`)}#i(){this.#s||(this.#s=!0,this.init())}init(){if(!this.shadowRoot){this.attachShadow({mode:"open"});let t=function(t){let e={};for(let i of t)e[i.name]=i.value;return e}(this.attributes);a&&(t.is=a),n&&(t.part=n),this.shadowRoot.innerHTML=this.constructor.getTemplateHTML(t)}for(let t of(this.nativeEl.muted=this.hasAttribute("muted"),l))this.#o(t);for(let t of(this.#a=new MutationObserver(this.#l.bind(this)),this.shadowRoot.addEventListener("slotchange",()=>this.#d()),this.#d(),this.constructor.Events))this.shadowRoot.addEventListener(t,this,!0)}handleEvent(t){t.target===this.nativeEl&&this.dispatchEvent(new CustomEvent(t.type,{detail:t.detail}))}#d(){let t=new Map(this.#n),e=this.shadowRoot?.querySelector("slot:not([name])");(e?.assignedElements({flatten:!0}).filter(t=>["track","source"].includes(t.localName))).forEach(e=>{t.delete(e);let i=this.#n.get(e);i||(i=e.cloneNode(),this.#n.set(e,i),this.#a?.observe(e,{attributes:!0})),this.nativeEl?.append(i),this.#h(i)}),t.forEach((t,e)=>{t.remove(),this.#n.delete(e)})}#l(t){for(let e of t)if("attributes"===e.type){let{target:t,attributeName:i}=e,s=this.#n.get(t);s&&i&&(s.setAttribute(i,t.getAttribute(i)??""),this.#h(s))}}#h(t){t&&"track"===t.localName&&t.default&&("chapters"===t.kind||"metadata"===t.kind)&&"disabled"===t.track.mode&&(t.track.mode="hidden")}#o(t){if(Object.prototype.hasOwnProperty.call(this,t)){let e=this[t];delete this[t],this[t]=e}}attributeChangedCallback(t,e,i){this.#i(),this.#c(t,e,i)}#c(t,e,i){["id","class"].includes(t)||!d.observedAttributes.includes(t)&&this.constructor.observedAttributes.includes(t)||(null===i?this.nativeEl?.removeAttribute(t):this.nativeEl?.getAttribute(t)!==i&&this.nativeEl?.setAttribute(t,i))}connectedCallback(){this.#i()}}}function a(t){let e="";for(let s in t){if(!i.includes(s))continue;let r=t[s];""===r?e+=` ${s}`:e+=` ${s}="${r}"`}return e}let o=n(globalThis.HTMLElement??class{},{tag:"video"});n(globalThis.HTMLElement??class{},{tag:"audio"}),t.s(["CustomVideoElement",()=>o,"Events",()=>e])}]);
/* BloomText — interactive text studio. No external JavaScript libraries required. */

(() => {
  const targets = document.querySelectorAll(".section, .stats, .bio-section, .about");
  if (!("IntersectionObserver" in window) || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  targets.forEach(el => el.classList.add("reveal-ready"));
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.10 });
  targets.forEach(el => observer.observe(el));
})();

(() => {
"use strict";
const $ = s => document.querySelector(s);
let toastTimer;
function notify(message){const t=$("#toast");t.textContent=message;t.classList.add("show");clearTimeout(toastTimer);toastTimer=setTimeout(()=>t.classList.remove("show"),1700);}
async function copyText(value){
 try{
  if(navigator.clipboard && window.isSecureContext) await navigator.clipboard.writeText(value);
  else {const el=document.createElement("textarea");el.value=value;el.style.position="fixed";el.style.opacity="0";document.body.appendChild(el);el.select();if(!document.execCommand("copy"))throw Error("copy");el.remove();}
  notify("Copied! ♡");
 }catch(e){notify("Copy unavailable — select the text manually.");}
}
const faces=[
["Happy","(｡♥‿♥｡)"],["Happy","(＾▽＾)"],["Happy","ヽ(・∀・)ﾉ"],["Happy","(≧◡≦)"],["Happy","(๑˃ᴗ˂)ﻭ"],["Happy","٩(◕‿◕｡)۶"],["Happy","(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧"],["Happy","(˶ᵔ ᵕ ᵔ˶)"],["Happy","(๑>ᴗ<๑)"],["Happy","(✿◠‿◠)"],
["Love","( ˘ ³˘)♥"],["Love","(♡˙︶˙♡)"],["Love","(っ˘з(˘⌣˘ )"],["Love","(｡・//ε//・｡)"],["Love","(♥ω♥*)"],["Love","(づ￣ ³￣)づ"],["Love","(ෆ˙ᵕ˙ෆ)"],["Love","(灬♥ω♥灬)"],
["Shy","(⁄ ⁄•⁄ω⁄•⁄ ⁄)"],["Shy","(〃▽〃)"],["Shy","(,,>﹏<,,)"],["Shy","(๑•́ ₃ •̀๑)"],["Shy","(⁄ ⁄>⁄ω⁄<⁄ ⁄)"],
["Sad","(ಥ﹏ಥ)"],["Sad","(╥_╥)"],["Sad","(っ˕ -｡)"],["Sad","(｡•́︿•̀｡)"],["Sad","(ノ_<。)"],["Sad","(╯︵╰,)"],["Sad","(｡╯︵╰｡)"],
["Angry","(＃`Д´)"],["Angry","(ง'̀-'́)ง"],["Angry","(ノಠ益ಠ)ノ"],["Angry","(눈_눈)"],["Angry","(¬_¬)"],
["Excited","＼(＾▽＾)／"],["Excited","ヾ(≧▽≦*)o"],["Excited","٩(ˊᗜˋ*)و"],["Excited","ヽ(o＾▽＾o)ノ"],["Excited","(ﾉ´ヮ`)ﾉ*: ･ﾟ"],
["Sleepy","(－ω－) zzZ"],["Sleepy","(￣o￣) . z Z"],["Sleepy","(∪｡∪)｡｡｡"],["Sleepy","(ᴗ˳ᴗ)"],
["Animals","ฅ^•ﻌ•^ฅ"],["Animals","(=^･ω･^=)"],["Animals","(=｀ω´=)"],["Animals","ʕ•ᴥ•ʔ"],["Animals","ʕっ•ᴥ•ʔっ"],["Animals","U・ᴥ・U"],["Animals","(ᵔᴥᵔ)"],
["Funny","¯\\_(ツ)_/¯"],["Funny","(ノಠ益ಠ)ノ彡┻━┻"],["Funny","(¬‿¬)"],["Funny","(☞ﾟヮﾟ)☞"],["Funny","( ͡° ͜ʖ ͡°)"],["Funny","ლ(ಠ益ಠლ)"]
].map(([category,text])=>({category,text}));
const combos=[
["Love","୨୧ ˚｡⋆♡˚"],["Love","♡₊˚ 🦢・₊✧"],["Love","💗ྀི"],["Love","꒰ა ♡ ໒꒱"],["Love","♥︎‧₊˚"],["Love","୨୧♡୨୧"],
["Flowers","✿ 🌷 ✿"],["Flowers","❀˖°🌸"],["Flowers","ꕤ.｡.:*"],["Flowers","🌼₊˚ෆ"],["Flowers","𓍢ִ໋🌷͙֒"],
["Dreamy","⋆｡°✩🌙"],["Dreamy","✧˖°🪐"],["Dreamy","☾⋆⁺₊✧"],["Dreamy","ੈ✩‧₊˚"],["Dreamy","⋆｡‧˚ʚ♡ɞ˚‧｡⋆"],
["Nature","𓇼 ⋆｡˚ 𓆉"],["Nature","🌿₊˚ෆ"],["Nature","☁️🌱☁️"],["Nature","🌱˚ ༘♡"],
["Soft","૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა"],["Soft","୨୧・┈・୨୧"],["Soft","₊˚⊹♡"],["Soft","｡ﾟﾟ･｡･ﾟﾟ｡"],
["Celebration","✧･ﾟ: *✧･ﾟ:*"],["Celebration","୨୧ 🎀 ୨୧"],["Celebration","⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆"],["Celebration","🎀✨💫"]
].map(([category,text])=>({category,text}));
const symbols="♡ ♥ ღ დ ۵ ❥ ❣ ෆ ᰔ ꨄ ಇ ლ ✧ ✦ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ★ ☆ ⋆ ⊹ ⭒ ⟡ ✵ ✶ ✷ ✸ ✿ ❀ ❁ ❃ ❋ ✾ ❊ ❉ ⚘ ☘ ♧ ♣ ୨୧ ༄ ༅ ༺ ༻ ࿐ ꕤ ꕥ ꧁ ꧂ ࿔ ⌁ ⌇ ⌖ ⌗ ⸙ → ← ↑ ↓ ↗ ↘ ↙ ↖ ➜ ➤ ➳ ➵ ➶ ➷ ➸ ➺ ∞ ≋ ≈ ≠ ≤ ≥ ± × ÷ √ ∆ ∇ ∴ ∵ ° ˚ ˖ ⁺ ₊ ˙ ｡ ･ · • ◦ ○ ● ◈ ◇ 「 」 『 』 〖 〗 〔 〕 〈 〉 《 》 ︵ ︶ ︷ ︸".split(" ");
const maps={
bold:["𝐀𝐁𝐂𝐃𝐄𝐅𝐆𝐇𝐈𝐉𝐊𝐋𝐌𝐍𝐎𝐏𝐐𝐑𝐒𝐓𝐔𝐕𝐖𝐗𝐘𝐙","𝐚𝐛𝐜𝐝𝐞𝐟𝐠𝐡𝐢𝐣𝐤𝐥𝐦𝐧𝐨𝐩𝐪𝐫𝐬𝐭𝐮𝐯𝐰𝐱𝐲𝐳","𝟎𝟏𝟐𝟑𝟒𝟓𝟔𝟕𝟖𝟗"],
italic:["𝐴𝐵𝐶𝐷𝐸𝐹𝐺𝐻𝐼𝐽𝐾𝐿𝑀𝑁𝑂𝑃𝑄𝑅𝑆𝑇𝑈𝑉𝑊𝑋𝑌𝑍","𝑎𝑏𝑐𝑑𝑒𝑓𝑔ℎ𝑖𝑗𝑘𝑙𝑚𝑛𝑜𝑝𝑞𝑟𝑠𝑡𝑢𝑣𝑤𝑥𝑦𝑧","0123456789"],
script:["𝒜𝐵𝒞𝒟𝐸𝐹𝒢𝐻𝐼𝒥𝒦𝐿𝑀𝒩𝒪𝒫𝒬𝑅𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵","𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏","0123456789"],
gothic:["𝔄𝔅ℭ𝔇𝔈𝔉𝔊ℌℑ𝔍𝔎𝔏𝔐𝔑𝔒𝔓𝔔ℜ𝔖𝔗𝔘𝔙𝔚𝔛𝔜ℨ","𝔞𝔟𝔠𝔡𝔢𝔣𝔤𝔥𝔦𝔧𝔨𝔩𝔪𝔫𝔬𝔭𝔮𝔯𝔰𝔱𝔲𝔳𝔴𝔵𝔶𝔷","0123456789"],
double:["𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ","𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫","𝟘𝟙𝟚𝟛𝟜𝟝𝟞𝟟𝟠𝟡"],
small:["ABCDEFGHIJKLMNOPQRSTUVWXYZ","ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ","0123456789"]};
const styles=[["Bold","bold"],["Italic","italic"],["Cursive","script"],["Gothic","gothic"],["Double-struck","double"],["Small caps","small"]];
function convert(text,key){const [u,l,d]=maps[key],normal="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789",fancy=u+l+d,dict=new Map([...normal].map((c,i)=>[c,[...fancy][i]]));return [...text].map(c=>dict.get(c)||c).join("");}
function renderFonts(){const q=$("#font-search").value.toLowerCase(),f=$("#font-filter").value,t=$("#font-input").value||"Your text here",host=$("#font-results");host.replaceChildren();const list=styles.filter(([n,k])=>(f==="all"||f===k)&&(n.toLowerCase().includes(q)||k.includes(q)));list.forEach(([name,key])=>{const b=document.createElement("button");b.type="button";b.className="font-card";const left=document.createElement("span");left.className="font-preview-wrap";const label=document.createElement("small");label.textContent=name;const preview=document.createElement("span");preview.className="font-preview";preview.textContent=convert(t,key);left.append(label,preview);const copy=document.createElement("span");copy.className="copy-label";copy.textContent="COPY ↗";b.append(left,copy);b.addEventListener("click",()=>copyText(convert($("#font-input").value,key)));host.append(b);});$("#font-total").textContent=list.length+" styles";}
function renderCards(data,hostId,queryId,filterId,kind){const host=$(hostId),q=$(queryId).value.toLowerCase(),f=$(filterId).value;host.replaceChildren();const list=data.filter(x=>(f==="all"||x.category===f)&&(`${x.category} ${x.text}`).toLowerCase().includes(q));list.forEach(x=>{const b=document.createElement("button");b.type="button";b.className=kind+"-card";const text=document.createElement("span");text.className=kind==="face"?"face-text":"";text.textContent=x.text;const small=document.createElement("small");small.textContent=kind==="combo"?x.category+" · COPY":x.category;b.append(text,small);b.addEventListener("click",()=>copyText(x.text));host.append(b);});if(!list.length)host.innerHTML='<p class="empty">Nothing found — try another search ♡</p>';}
function renderSymbols(){const q=$("#symbol-search").value.toLowerCase(),host=$("#symbol-results");host.replaceChildren();const list=symbols.filter(s=>s.toLowerCase().includes(q));list.forEach(s=>{const b=document.createElement("button");b.type="button";b.className="symbol-card";b.textContent=s;b.title="Copy "+s;b.addEventListener("click",()=>copyText(s));host.append(b);});if(!list.length)host.innerHTML='<p class="empty">No symbols found ♡</p>';}
$("#font-input").addEventListener("input",()=>{$("#font-count").textContent=$("#font-input").value.length+" / 120";renderFonts();});
$("#font-search").addEventListener("input",renderFonts);$("#font-filter").addEventListener("change",renderFonts);
$("#clear-font").addEventListener("click",()=>{$("#font-input").value="";$("#font-input").dispatchEvent(new Event("input"));$("#font-input").focus();});
$("#face-search").addEventListener("input",()=>renderCards(faces,"#face-results","#face-search","#face-filter","face"));
$("#face-filter").addEventListener("change",()=>renderCards(faces,"#face-results","#face-search","#face-filter","face"));
$("#combo-search").addEventListener("input",()=>renderCards(combos,"#combo-results","#combo-search","#combo-filter","combo"));
$("#combo-filter").addEventListener("change",()=>renderCards(combos,"#combo-results","#combo-search","#combo-filter","combo"));
$("#symbol-search").addEventListener("input",renderSymbols);
$("#bio-input").addEventListener("input",()=>$("#bio-count").textContent=$("#bio-input").value.length+" / 160");
$("#copy-bio").addEventListener("click",()=>{const v=$("#bio-input").value.trim();if(!v){notify("Write your bio first ♡");return;}copyText(v);});
renderFonts();renderCards(faces,"#face-results","#face-search","#face-filter","face");renderCards(combos,"#combo-results","#combo-search","#combo-filter","combo");renderSymbols();
})();

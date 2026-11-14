/* BloomText — expanded copy-and-paste studio. No libraries, APIs, or build tools. */
(() => {
"use strict";
const $ = (selector) => document.querySelector(selector);
const toast = $("#toast");
let toastTimer;

function notify(message) {
  if (!toast) return;
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 1800);
}
async function copyText(value) {
  const text = String(value ?? "");
  if (!text) return notify("Nothing to copy yet ♡");
  try {
    if (navigator.clipboard && window.isSecureContext) {
      await navigator.clipboard.writeText(text);
    } else {
      const field = document.createElement("textarea");
      field.value = text;
      field.setAttribute("readonly", "");
      field.style.cssText = "position:fixed;left:-9999px;top:0;opacity:0";
      document.body.appendChild(field);
      field.select();
      const ok = document.execCommand("copy");
      field.remove();
      if (!ok) throw new Error("Clipboard copy failed");
    }
    notify("Copied to clipboard! ♡");
  } catch (error) {
    notify("Copy blocked by browser — please select and copy manually.");
  }
}

/* Unicode alphabets: some characters intentionally fall back where Unicode has gaps. */
const ranges = {
  bold:[0x1D400,0x1D41A,0x1D7CE],
  italic:[0x1D434,0x1D44E,null],
  boldItalic:[0x1D468,0x1D482,null],
  sans:[0x1D5A0,0x1D5BA,0x1D7E2],
  sansBold:[0x1D5D4,0x1D5EE,0x1D7EC],
  sansItalic:[0x1D608,0x1D622,null],
  sansBoldItalic:[0x1D63C,0x1D656,null],
  mono:[0x1D670,0x1D68A,0x1D7F6],
  double:[0x1D538,0x1D552,0x1D7D8],
  fraktur:[0x1D504,0x1D51E,null],
  boldFraktur:[0x1D56C,0x1D586,null],
  circled:[0x24B6,0x24D0,null],
  fullwidth:[0xFF21,0xFF41,0xFF10]
};
const special = {
  italic:{"h":"ℎ"}, double:{"C":"ℂ","H":"ℍ","N":"ℕ","P":"ℙ","Q":"ℚ","R":"ℝ","Z":"ℤ"},
  fraktur:{"C":"ℭ","H":"ℌ","I":"ℑ","R":"ℜ","Z":"ℨ"},
  script:{"B":"ℬ","E":"ℰ","F":"ℱ","H":"ℋ","I":"ℐ","L":"ℒ","M":"ℳ","R":"ℛ","e":"ℯ","g":"ℊ","o":"ℴ"}
};
function mapRange(text, key) {
  const [upper, lower, digits] = ranges[key];
  const overrides = special[key] || {};
  return Array.from(text, ch => {
    if (overrides[ch]) return overrides[ch];
    const cp = ch.codePointAt(0);
    if (cp >= 65 && cp <= 90) return upper ? String.fromCodePoint(upper + cp - 65) : ch;
    if (cp >= 97 && cp <= 122) return lower ? String.fromCodePoint(lower + cp - 97) : ch;
    if (cp >= 48 && cp <= 57) return digits ? String.fromCodePoint(digits + cp - 48) : ch;
    return ch;
  }).join("");
}
const smallCaps = "ᴀʙᴄᴅᴇғɢʜɪᴊᴋʟᴍɴᴏᴘǫʀsᴛᴜᴠᴡxʏᴢ";
const smallMap = Object.fromEntries(Array.from("abcdefghijklmnopqrstuvwxyz", (c,i)=>[c,smallCaps[i]]));
const circledDigits = ["⓪","①","②","③","④","⑤","⑥","⑦","⑧","⑨"];
const styles = [
  ["Bold","bold"],["Italic","italic"],["Bold italic","boldItalic"],
  ["Cursive","script"],["Gothic","fraktur"],["Bold gothic","boldFraktur"],
  ["Double-struck","double"],["Sans serif","sans"],["Sans bold","sansBold"],
  ["Sans italic","sansItalic"],["Sans bold italic","sansBoldItalic"],
  ["Monospace","mono"],["Fullwidth","fullwidth"],["Circled","circled"],
  ["Small caps","small"],["Uppercase","upper"],["Lowercase","lower"],
  ["Spaced","spaced"],["Underline","underline"],["Double underline","doubleUnderline"],
  ["Strikethrough","strike"],["Overline","overline"],["Dotted","dotted"]
];
function convert(text, key) {
  if (ranges[key]) return mapRange(text,key);
  if (key === "script") return mapRange(text,"script");
  if (key === "small") return Array.from(text,c=>smallMap[c]||c).join("");
  if (key === "upper") return text.toUpperCase();
  if (key === "lower") return text.toLowerCase();
  if (key === "spaced") return Array.from(text).join(" ");
  const marks = {underline:"\u0332",doubleUnderline:"\u0333",strike:"\u0336",overline:"\u0305",dotted:"\u0323"};
  if (marks[key]) return Array.from(text,c => /\\s/.test(c) ? c : c+marks[key]).join("");
  return text;
}
/* Script alphabet has gaps in Unicode's mathematical alphabet blocks; use the standard script set. */
special.script = {"B":"ℬ","E":"ℰ","F":"ℱ","H":"ℋ","I":"ℐ","L":"ℒ","M":"ℳ","R":"ℛ","e":"ℯ","g":"ℊ","o":"ℴ"};
const originalMapRange = mapRange;
function convert(text,key) {
  if (key === "script") {
    const upper = "𝒜ℬ𝒞𝒟ℰℱ𝒢ℋℐ𝒥𝒦ℒℳ𝒩𝒪𝒫𝒬ℛ𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵";
    const lower = "𝒶𝒷𝒸𝒹ℯ𝒻ℊ𝒽𝒾𝒿𝓀𝓁𝓂𝓃ℴ𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏";
    const dict = new Map([... "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"].map((c,i)=>[c,[...upper,...lower][i]]));
    return Array.from(text,c=>dict.get(c)||c).join("");
  }
  if (key === "boldFraktur") {
    const up="𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅";
    const lo="𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟";
    const dict=new Map([... "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz"].map((c,i)=>[c,[...up,...lo][i]]));
    return Array.from(text,c=>dict.get(c)||c).join("");
  }
  if (key === "circled") return Array.from(text,c=>{
    const n=c.codePointAt(0);
    if(n>=65&&n<=90)return String.fromCodePoint(0x24B6+n-65);
    if(n>=97&&n<=122)return String.fromCodePoint(0x24D0+n-97);
    if(n>=48&&n<=57)return circledDigits[n-48];
    return c;
  }).join("");
  if (key === "small") return Array.from(text,c=>smallMap[c]||c).join("");
  if (key === "upper") return text.toUpperCase();
  if (key === "lower") return text.toLowerCase();
  if (key === "spaced") return Array.from(text).join(" ");
  const marks={underline:"\u0332",doubleUnderline:"\u0333",strike:"\u0336",overline:"\u0305",dotted:"\u0323"};
  if(marks[key]) return Array.from(text,c=>/\s/.test(c)?c:c+marks[key]).join("");
  return mapRange(text,key);
}
function renderFonts() {
  const input=$("#font-input"), host=$("#font-results");
  if(!input||!host)return;
  const value=input.value || "Your text here";
  host.replaceChildren();
  styles.forEach(([name,key])=>{
    const button=document.createElement("button");
    button.type="button";button.className="font-card";
    const wrap=document.createElement("span");wrap.className="font-preview-wrap";
    const label=document.createElement("small");label.textContent=name;
    const preview=document.createElement("span");preview.className="font-preview";preview.textContent=convert(value,key);
    const copy=document.createElement("span");copy.className="copy-label";copy.textContent="COPY ↗";
    wrap.append(label,preview);button.append(wrap,copy);
    button.addEventListener("click",()=>copyText(convert(input.value,key)));
    host.append(button);
  });
  const total=$("#font-total");if(total)total.textContent=styles.length+" styles";
}
const faceGroups = {
"Happy":["(｡♥‿♥｡)","(＾▽＾)","ヽ(・∀・)ﾉ","(≧◡≦)","(๑˃ᴗ˂)ﻭ","٩(◕‿◕｡)۶","(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧","(˶ᵔ ᵕ ᵔ˶)","(๑>ᴗ<๑)","(✿◠‿◠)","(｡•̀ᴗ-)✧","(๑˘︶˘๑)","٩(｡•́‿•̀｡)۶","(♡˙︶˙♡)","(๑˃̵ᴗ˂̵)و","(ﾉ´ヮ`)ﾉ*: ･ﾟ","(๑ᵔ⤙ᵔ๑)","(◕‿◕)","(｡•̀ᴗ-)✧","(✧ω✧)"],
"Love":["( ˘ ³˘)♥","(♡˙︶˙♡)","(っ˘з(˘⌣˘ )","(｡・//ε//・｡)","(♥ω♥*)","(づ￣ ³￣)づ","(ෆ˙ᵕ˙ෆ)","(灬♥ω♥灬)","(♡μ_μ)","(｡♥‿♥｡)","(♡°▽°♡)","(ღ˘⌣˘ღ)","( ˘͈ ᵕ ˘͈♡)","(ෆˊ͈ ु꒳ ूˋ͈ෆ)","(♡ˊ͈ ꒳ ˋ͈)","(づ｡◕‿‿◕｡)づ","♡(˃͈ દ ˂͈ ༶ )","(｡･ω･｡)ﾉ♡"],
"Shy":["(⁄ ⁄•⁄ω⁄•⁄ ⁄)","(〃▽〃)","(,,>﹏<,,)","(๑•́ ₃ •̀๑)","(⁄ ⁄>⁄ω⁄<⁄ ⁄)","(*/ω＼*)","(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)","(〃ω〃)","(｡･･｡)","(⁄ ⁄•⁄-⁄•⁄ ⁄)","(๑´ㅂ`๑)"],
"Sad":["(ಥ﹏ಥ)","(╥_╥)","(っ˕ -｡)","(｡•́︿•̀｡)","(ノ_<。)","(╯︵╰,)","(｡╯︵╰｡)","(つω`｡)","(இ﹏இ`｡)","(｡•́︿•̀｡)","(ಥ_ಥ)","(っ- ‸ - ς)"],
"Angry":["(＃`Д´)","(ง'̀-'́)ง","(ノಠ益ಠ)ノ","(눈_눈)","(¬_¬)","( `ε´ )","(•̀o•́)ง","(╬ Ò﹏Ó)","(҂` ﾛ ´)凸","(ಠ_ಠ)"],
"Excited":["＼(＾▽＾)／","ヾ(≧▽≦*)o","٩(ˊᗜˋ*)و","ヽ(o＾▽＾o)ノ","(ﾉ´ヮ`)ﾉ*:･ﾟ✧","٩(◕‿◕｡)۶","(ﾉ>ω<)ﾉ","ଘ(੭ˊᵕˋ)੭","(★ω★)/","(๑˃ᴗ˂)ﻭ"],
"Sleepy":["(－ω－) zzZ","(￣o￣) . z Z","(∪｡∪)｡｡｡","(ᴗ˳ᴗ)","(－_－) zzZ","(＿ ＿*) Z z z","(｡ρω-｡)","(。-ω-)zzz"],
"Cat":["ฅ^•ﻌ•^ฅ","(=^･ω･^=)","(=｀ω´=)","(=^･ｪ･^=)","(=；ェ；=)","(=ＴェＴ=)","(=①ω①=)","(=චᆽච=)","(=^‥^=)","(=｀ェ´=)","(ΦωΦ)","(=^-ω-^=)","(=^･^=)","ฅ(＾・ω・＾ฅ)","(^._.^)ﾉ"],
"Dog & bear":["ʕ•ᴥ•ʔ","ʕっ•ᴥ•ʔっ","U・ᴥ・U","(ᵔᴥᵔ)","૮ ・ﻌ・ა","૮₍ ˶•⤙•˶ ₎ა","(ᵔﻌᵔ)","(ᵕᴥᵕ)","ʕ￫ᴥ￩ʔ","U^ｪ^U","૮₍ ´ ꒳ `₎ა","(❍ᴥ❍ʋ)"],
"Bunny":["／(･ × ･)＼","／(=･ x ･=)＼","૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა","૮꒰ ˶• ༝ •˶꒱ა","૮₍ ˃ ⤙ ˂ ₎ა","૮₍ ˶•⤙•˶ ₎ა","૮₍ ´ ꒳ `₎ა","૮₍ ˶• ༝ •˶ ₎ა","૮₍｡´ᴖ ˔ ᴖ`｡₎ა","૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა"],
"Butterfly & fairy":["ʚїɞ","ʚ♡ɞ","ʚ(｡˃ ᵕ ˂ )ɞ","ଘ(੭ˊᵕˋ)੭","꒰ঌ(⃔ ⌯' '⌯)⃕໒꒱","ʚɞ","ʚଓ","ʚ(｡˃ ᵕ ˂ )ɞ","୨୧","(｡･ω･｡)ﾉ♡"],
"Surprised":["(⊙_⊙)","Σ(°ロ°)","(°o°)","(๑°ㅁ°๑)‼","(⊙ˍ⊙)","(ﾟДﾟ)","(」°ロ°)」","(・o・)","(ʘᗩʘ')","(⊙.☉)"],
"Funny":["¯\\_(ツ)_/¯","(ノಠ益ಠ)ノ彡┻━┻","(¬‿¬)","(☞ﾟヮﾟ)☞","( ͡° ͜ʖ ͡°)","ლ(ಠ益ಠლ)","(☞ ͡° ͜ʖ ͡°)☞","┬─┬ノ( º _ ºノ)","(ಡωಡ)","(≖ ͜ʖ≖)","(ง ื▿ ื)ว","(๑ ิټ ิ)"]
};
const faces=[];
Object.entries(faceGroups).forEach(([category,items])=>items.forEach(text=>faces.push({category,text})));
/* Top up with additional original variations while avoiding duplicates. */
const extraFaces=[
["Cat","ฅ(•ㅅ•❀)ฅ"],["Cat","(=ＴェＴ=)"],["Cat","(=｀ω´=)"],["Bunny","(｡ rabbit ｡)"],["Bunny","૮₍ ˶•⤙•˶ ₎ა"],["Happy","(๑ˊ͈ ꇴ ˋ͈)"],["Happy","(๑˃́ꇴ˂̀๑)"],["Love","(ෆ˙ᵕ˙ෆ)"],["Love","♡(˃͈ દ ˂͈ ༶ )"],["Shy","(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)"],["Sad","(｡•́︿•̀｡)"],["Sleepy","(っ- ‸ - ς)"],["Dog & bear","૮₍ ˶•⤙•˶ ₎ა"],["Butterfly & fairy","ʚ(｡˃ ᵕ ˂ )ɞ"],["Surprised","(๑°ㅁ°๑)‼"],["Funny","(☞ﾟヮﾟ)☞"],["Happy","(ﾉ´ヮ`)ﾉ*: ･ﾟ"],["Cat","(ΦωΦ)"],["Bunny","(｡•ㅅ•｡)♡"],["Butterfly & fairy","ʚїɞ"]
];
extraFaces.forEach(([category,text])=>faces.push({category,text}));
const faceHost=$("#face-results"),faceSearch=$("#face-search"),faceFilter=$("#face-filter");
function renderFaces(){
  if(!faceHost)return;
  const q=(faceSearch?.value||"").toLowerCase(),f=faceFilter?.value||"all";
  faceHost.replaceChildren();
  const list=faces.filter(x=>(f==="all"||x.category===f)&&(`${x.category} ${x.text}`).toLowerCase().includes(q));
  list.forEach(x=>{
    const b=document.createElement("button");b.type="button";b.className="face-card";
    const value=document.createElement("span");value.className="face-text";value.textContent=x.text;
    const label=document.createElement("small");label.textContent=x.category;
    b.append(value,label);b.addEventListener("click",()=>copyText(x.text));faceHost.append(b);
  });
  if(!list.length){const p=document.createElement("p");p.className="empty";p.textContent="No faces found — try another mood ♡";faceHost.append(p);}
}
const comboThemes = [
["Love",["💗","💞","💘","💓","💝","💕","🩷","❤️‍🩹","💌","🫶"]],
["Flowers",["🌸","🌷","🌺","🌼","🪷","💐","🌻","🪻","🌹","🌿"]],
["Dreamy",["🌙","⭐","✨","☁️","🪐","🌌","💫","🪽","🌠","🔮"]],
["Nature",["🍃","🌱","🦋","🌿","🌊","🌻","🍄","🐚","🌳","🪴"]],
["Soft",["🎀","🧸","🩰","🫧","🕯️","🪽","🪞","🧁","🍓","🧺"]],
["Ocean",["🪼","🐬","🐚","🫧","🪸","🌊","🐠","🦢","🩵","⚓"]],
["Starlight",["🌟","🌙","☄️","🌠","✨","🪄","🪐","⭐","💫","🔭"]],
["Cozy",["☕","🧸","🧣","🍂","📖","🕯️","🍪","🧦","🫖","🍯"]],
["Magic",["🪄","🦄","🔮","🧚","🪽","✨","🌈","🪷","🦢","💎"]],
["Kawaii",["🐰","🐱","🐻","🍡","🍮","🍰","🍓","🎀","🩷","🌸"]],
["Celebration",["🎉","🎂","🎁","🥳","🎊","💐","🎈","🪩","🍰","✨"]]
];
const comboPatterns=["{e} ୨୧","୨୧ {e} ୨୧","⋆｡°✩ {e} ✩°｡⋆","₊˚⊹ {e} ⊹˚₊","꒰ა {e} ໒꒱","{e} ˚ ༘♡","♡₊˚ {e}・₊✧","𓍢ִ໋ {e} 𓂃","{e} ⋆｡‧˚ʚ♡ɞ˚‧｡⋆","✧･ﾟ: *{e}*:･ﾟ✧"];
const combos=[];
comboThemes.forEach(([category,emojis])=>emojis.forEach((emoji,i)=>{
  combos.push({category,text:comboPatterns[i].replaceAll("{e}",emoji)});
}));
const comboHost=$("#combo-results"),comboSearch=$("#combo-search"),comboFilter=$("#combo-filter");
function renderCombos(){
  if(!comboHost)return;
  const q=(comboSearch?.value||"").toLowerCase(),f=comboFilter?.value||"all";
  comboHost.replaceChildren();
  const list=combos.filter(x=>(f==="all"||x.category===f)&&(`${x.category} ${x.text}`).toLowerCase().includes(q));
  list.forEach(x=>{
    const b=document.createElement("button");b.type="button";b.className="combo-card";
    const value=document.createElement("span");value.textContent=x.text;
    const label=document.createElement("small");label.textContent=x.category+" · COPY";
    b.append(value,label);b.addEventListener("click",()=>copyText(x.text));comboHost.append(b);
  });
}
const symbolGroups=[
"♡ ♥ ღ დ ۵ ❥ ❣ ෆ ᰔ ꨄ ಇ ლ","✧ ✦ ✩ ✪ ✫ ✬ ✭ ✮ ✯ ✰ ★ ☆ ⋆ ⊹ ⭒ ⟡ ✵ ✶ ✷ ✸","✿ ❀ ❁ ❃ ❋ ✾ ❊ ❉ ⚘ ☘ ♧ ♣ ꕤ ꕥ","୨୧ ༄ ༅ ༺ ༻ ࿐ ꧁ ꧂ ࿔ ⌁ ⌇ ⌖ ⌗ ⸙","→ ← ↑ ↓ ↗ ↘ ↙ ↖ ➜ ➤ ➳ ➵ ➶ ➷ ➸ ➺","∞ ≋ ≈ ≠ ≤ ≥ ± × ÷ √ ∆ ∇ ∴ ∵ ° ˚ ˖ ⁺ ₊ ˙","｡ ･ · • ◦ ○ ● ◈ ◇ 「 」 『 』 〖 〗 〔 〕 〈 〉 《 》 ︵ ︶ ︷ ︸ ༶ ༷ ᯓ ᭄"
];
const symbols=Array.from(new Set(symbolGroups.join(" ").split(/\s+/).filter(Boolean)));
const symbolHost=$("#symbol-results"),symbolSearch=$("#symbol-search");
function renderSymbols(){
  if(!symbolHost)return;
  const q=(symbolSearch?.value||"").toLowerCase();symbolHost.replaceChildren();
  symbols.filter(s=>s.toLowerCase().includes(q)).forEach(s=>{
    const b=document.createElement("button");b.type="button";b.className="symbol-card";b.textContent=s;b.title="Copy "+s;
    b.addEventListener("click",()=>copyText(s));symbolHost.append(b);
  });
}
function bind(id,event,fn){const el=$(id);if(el)el.addEventListener(event,fn);}
bind("#font-input","input",()=>{const input=$("#font-input"),count=$("#font-count");if(count)count.textContent=input.value.length+" / 120";renderFonts();});
bind("#clear-font","click",()=>{const input=$("#font-input");input.value="";input.dispatchEvent(new Event("input"));input.focus();});
bind("#face-search","input",renderFaces);bind("#face-filter","change",renderFaces);
bind("#combo-search","input",renderCombos);bind("#combo-filter","change",renderCombos);
bind("#symbol-search","input",renderSymbols);
bind("#bio-input","input",()=>{const input=$("#bio-input"),count=$("#bio-count");if(count)count.textContent=input.value.length+" / 160";});
bind("#copy-bio","click",()=>{const value=$("#bio-input")?.value.trim()||"";if(!value)return notify("Write your bio first ♡");copyText(value);});

renderFonts();renderFaces();renderCombos();renderSymbols();
const revealTargets=document.querySelectorAll(".section,.stats,.bio-section,.about");
if("IntersectionObserver" in window&&!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  revealTargets.forEach(el=>el.classList.add("reveal-ready"));
  const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
    if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target);}
  }),{threshold:.08});
  revealTargets.forEach(el=>observer.observe(el));
}
})();

/* ==========================================================
   BLOOMTEXT — PROFESSIONAL TEXT ART STUDIO
   Version: 2.0.0
   Vanilla JavaScript | No dependencies
   ========================================================== */

(() => {
  "use strict";

  /* --------------------------------------------------------
     1. UTILITIES
  -------------------------------------------------------- */

  const $ = (selector) => document.querySelector(selector);

  const escapeText = (value) =>
    String(value ?? "");

  const unique = (array) =>
    [...new Set(array)];

  const shuffle = (array) =>
    [...array].sort(() => Math.random() - 0.5);

  const elements = {
    fontInput: $("#font-input"),
    fontSearch: $("#font-search"),
    fontFilter: $("#font-filter"),
    fontResults: $("#font-results"),
    fontCount: $("#font-count"),
    charCount: $("#char-count"),
    clearText: $("#clear-text"),

    faceSearch: $("#face-search"),
    faceFilter: $("#face-filter"),
    faceResults: $("#face-results"),

    emojiSearch: $("#emoji-search"),
    emojiFilter: $("#emoji-filter"),
    emojiResults: $("#emoji-results"),

    symbolResults: $("#symbol-results"),

    bioInput: $("#bio-input"),
    bioCount: $("#bio-count"),
    bioCopy: $("#bio-copy"),

    toast: $("#toast")
  };

  /* --------------------------------------------------------
     2. NOTIFICATION SYSTEM
  -------------------------------------------------------- */

  let toastTimer;

  function notify(message = "Copied! ♡") {
    if (!elements.toast) return;

    elements.toast.textContent = message;
    elements.toast.classList.add("show");

    clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      elements.toast.classList.remove("show");
    }, 2200);
  }

  /* --------------------------------------------------------
     3. UNIVERSAL COPY SYSTEM
  -------------------------------------------------------- */

  async function copyText(text) {
    const value = escapeText(text);

    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(value);
      } else {
        const textarea = document.createElement("textarea");

        textarea.value = value;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";
        textarea.style.pointerEvents = "none";

        document.body.appendChild(textarea);

        textarea.select();

        const successful = document.execCommand("copy");

        textarea.remove();

        if (!successful) {
          throw new Error("Copy command failed");
        }
      }

      notify("Copied successfully! ♡");

      return true;

    } catch (error) {
      console.error("BloomText copy error:", error);

      notify("Unable to copy. Please try again.");

      return false;
    }
  }

  /* --------------------------------------------------------
     4. FANCY FONT GENERATOR
  -------------------------------------------------------- */

  function createUnicodeFont(upperStart, lowerStart, numberStart) {
    return (text) => {
      return Array.from(text).map(char => {
        const code = char.codePointAt(0);

        if (code >= 65 && code <= 90 && upperStart) {
          return String.fromCodePoint(
            upperStart + code - 65
          );
        }

        if (code >= 97 && code <= 122 && lowerStart) {
          return String.fromCodePoint(
            lowerStart + code - 97
          );
        }

        if (code >= 48 && code <= 57 && numberStart) {
          return String.fromCodePoint(
            numberStart + code - 48
          );
        }

        return char;
      }).join("");
    };
  }

  const fontStyles = [
    {
      name: "Bold",
      category: "bold",
      convert: createUnicodeFont(0x1D400, 0x1D41A, 0x1D7CE)
    },
    {
      name: "Italic",
      category: "script",
      convert: createUnicodeFont(0x1D434, 0x1D44E, null)
    },
    {
      name: "Bold Italic",
      category: "bold",
      convert: createUnicodeFont(0x1D468, 0x1D482, null)
    },
    {
      name: "Script",
      category: "script",
      convert: createUnicodeFont(0x1D49C, 0x1D4B6, null)
    },
    {
      name: "Bold Script",
      category: "script",
      convert: createUnicodeFont(0x1D4D0, 0x1D4EA, null)
    },
    {
      name: "Fraktur",
      category: "gothic",
      convert: createUnicodeFont(0x1D504, 0x1D51E, null)
    },
    {
      name: "Double Struck",
      category: "classic",
      convert: createUnicodeFont(0x1D538, 0x1D552, 0x1D7D8)
    },
    {
      name: "Sans Serif",
      category: "classic",
      convert: createUnicodeFont(0x1D5A0, 0x1D5BA, 0x1D7E2)
    },
    {
      name: "Sans Bold",
      category: "bold",
      convert: createUnicodeFont(0x1D5D4, 0x1D5EE, 0x1D7EC)
    },
    {
      name: "Sans Italic",
      category: "script",
      convert: createUnicodeFont(0x1D608, 0x1D622, null)
    },
    {
      name: "Sans Bold Italic",
      category: "bold",
      convert: createUnicodeFont(0x1D63C, 0x1D656, null)
    },
    {
      name: "Monospace",
      category: "classic",
      convert: createUnicodeFont(0x1D670, 0x1D68A, 0x1D7F6)
    },
    {
      name: "Small Caps",
      category: "small",
      convert: (text) => {
        const small = {
          a:"ᴀ",b:"ʙ",c:"ᴄ",d:"ᴅ",e:"ᴇ",
          f:"ꜰ",g:"ɢ",h:"ʜ",i:"ɪ",j:"ᴊ",
          k:"ᴋ",l:"ʟ",m:"ᴍ",n:"ɴ",o:"ᴏ",
          p:"ᴘ",q:"ǫ",r:"ʀ",s:"s",t:"ᴛ",
          u:"ᴜ",v:"ᴠ",w:"ᴡ",x:"x",y:"ʏ",z:"ᴢ"
        };

        return text.split("").map(c =>
          small[c.toLowerCase()] || c
        ).join("");
      }
    }
  ];

  const decorations = [
    {
      name: "Cute Hearts",
      category: "cute",
      wrap: t => `♡ ${t} ♡`
    },
    {
      name: "Sparkle",
      category: "cute",
      wrap: t => `✧ ${t} ✧`
    },
    {
      name: "Flower",
      category: "cute",
      wrap: t => `❀ ${t} ❀`
    },
    {
      name: "Ribbon",
      category: "cute",
      wrap: t => `୨୧ ${t} ୨୧`
    },
    {
      name: "Stars",
      category: "cute",
      wrap: t => `⋆｡°✩ ${t} ✩°｡⋆`
    },
    {
      name: "Brackets",
      category: "classic",
      wrap: t => `『 ${t} 』`
    },
    {
      name: "Waves",
      category: "small",
      wrap: t => `〜 ${t} 〜`
    },
    {
      name: "Gothic Frame",
      category: "gothic",
      wrap: t => `꧁ ${t} ꧂`
    }
  ];

  const allFonts = [];

  fontStyles.forEach(style => {
    allFonts.push({
      name: style.name,
      category: style.category,
      convert: style.convert
    });

    decorations.forEach(decoration => {
      allFonts.push({
        name: `${style.name} + ${decoration.name}`,
        category: decoration.category,
        convert: text =>
          decoration.wrap(style.convert(text))
      });
    });
  });

  function renderFonts() {
    if (!elements.fontResults) return;

    const text = elements.fontInput?.value || "";
    const search = elements.fontSearch?.value
      .toLowerCase().trim() || "";

    const category = elements.fontFilter?.value || "all";

    if (elements.charCount) {
      elements.charCount.textContent =
        `${text.length} / 180`;
    }

    const filtered = allFonts.filter(style => {
      const matchesSearch =
        style.name.toLowerCase().includes(search);

      const matchesCategory =
        category === "all" ||
        style.category === category;

      return matchesSearch && matchesCategory;
    });

    elements.fontResults.replaceChildren();

    if (!text.trim()) {
      elements.fontResults.innerHTML =
        '<div class="empty-state">Type something to see your beautiful fonts ♡</div>';
      return;
    }

    if (!filtered.length) {
      elements.fontResults.innerHTML =
        '<div class="empty-state">No matching styles found ♡</div>';
      return;
    }

    const fragment = document.createDocumentFragment();

    filtered.forEach(style => {
      const card = document.createElement("button");

      card.type = "button";
      card.className = "font-card";

      const preview = document.createElement("span");
      preview.className = "preview";

      const label = document.createElement("span");
      label.className = "style-name";
      label.textContent = style.name;

      const result = document.createElement("span");
      result.textContent = style.convert(text);

      preview.append(label, result);

      const copy = document.createElement("span");
      copy.className = "copy-mini";
      copy.textContent = "COPY ↗";

      card.append(preview, copy);

      card.addEventListener("click", () => {
        copyText(style.convert(text));
      });

      fragment.appendChild(card);
    });

    elements.fontResults.appendChild(fragment);
  }

  /* --------------------------------------------------------
     5. KAOMOJI DATABASE
  -------------------------------------------------------- */

  const faceGroups = {

    Happy: [
      "ヾ(＾∇＾)",
      "(≧▽≦)",
      "(｡♥‿♥｡)",
      "(＾▽＾)",
      "(⌒▽⌒)",
      "(o^▽^o)",
      "ヽ(・∀・)ﾉ",
      "(´｡• ᵕ •｡`)",
      "(๑˃ᴗ˂)ﻭ",
      "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
      "٩(◕‿◕｡)۶",
      "(๑˘︶˘๑)",
      "(˶ᵔ ᵕ ᵔ˶)",
      "(*≧ω≦*)",
      "ヾ(≧▽≦*)o",
      "(๑>◡<๑)",
      "(｡•̀ᴗ-)✧",
      "٩(｡•́‿•̀｡)۶",
      "(♡°▽°♡)",
      "(ﾉ´ヮ`)ﾉ*: ･ﾟ"
    ],

    Love: [
      "(｡♥‿♥｡)",
      "(♡˙︶˙♡)",
      "(´,,•ω•,,)♡",
      "(っ˘з(˘⌣˘ )",
      "(づ￣ ³￣)づ",
      "♡(˃͈ દ ˂͈ ༶ )",
      "( ˘ ³˘)♥",
      "(♡ >ω< ♡)",
      "♡(｡- ω -)",
      "(´｡• ᵕ •｡`) ♡",
      "(ෆ˙ᵕ˙ෆ)",
      "꒰ა ♡ ໒꒱",
      "♡〜٩( ˃́▿˂̀ )۶〜♡",
      "(๑♡⌓♡๑)",
      "♡(˃͈ દ ˂͈ ༶ )"
    ],

    Shy: [
      "(⁄ ⁄•⁄ω⁄•⁄ ⁄)",
      "(〃ω〃)",
      "(⁄ ⁄>⁄ ▽ ⁄<⁄ ⁄)",
      "(๑•﹏•)",
      "(*/ω＼)",
      "(〃▽〃)",
      "(｡･･｡)",
      "(⁄ ⁄>⁄ω⁄<⁄ ⁄)",
      "(⁄ ⁄•⁄-⁄•⁄ ⁄)",
      "(*ﾉωﾉ)",
      "(〃´∀｀)",
      "(๑>///<๑)"
    ],

    Sad: [
      "(╥﹏╥)",
      "(ಥ﹏ಥ)",
      "(T_T)",
      "(｡•́︿•̀｡)",
      "(ノ_<。)",
      "(；ω；)",
      "(っ˕ -｡)",
      "(｡╯︵╰｡)",
      "(ಥ_ಥ)",
      "(இ﹏இ`｡)",
      "(╥_╥)",
      "(｡•́︿•̀｡)",
      "｡ﾟ(ﾟ´Д｀ﾟ)ﾟ｡",
      "(っ- ‸ - ς)"
    ],

    Angry: [
      "(＃`Д´)",
      "(╬ Ò﹏Ó)",
      "(ಠ益ಠ)",
      "(ノಠ益ಠ)ノ彡┻━┻",
      "(≧ロ≦)",
      "(눈_눈)",
      "(¬_¬)",
      "(；¬д¬)",
      "(╯°□°）╯",
      "٩(╬ʘ益ʘ╬)۶"
    ],

    Excited: [
      "\\(★ω★)/",
      "\\(≧▽≦)/",
      "ヽ(>∀<☆)ノ",
      "ヾ(☆▽☆)",
      "٩(ˊᗜˋ*)و",
      "ヽ(*⌒▽⌒*)ﾉ",
      "(ﾉ◕ヮ◕)ﾉ*:･ﾟ✧",
      "☆*:.｡.o(≧▽≦)o.｡.:*☆",
      "ヾ(≧▽≦*)o",
      "٩(๑> ₃ <)۶"
    ],

    Sleepy: [
      "(－_－) zzZ",
      "(￣o￣) . z Z",
      "(∪｡∪)｡｡｡zzZ",
      "(-_-) zzz",
      "(－ω－) zzZ",
      "(ᴗ˳ᴗ)",
      "(＿ ＿*) Z z z",
      "(∪.∪ )...zzz",
      "(。-ω-)zzz",
      "(*´ο`*)"
    ],

    Animals: [
      "ฅ^•ﻌ•^ฅ",
      "(=^･ω･^=)",
      "(=^‥^=)",
      "₍^. .^₎⟆",
      "ʕ•ᴥ•ʔ",
      "ʕ￫ᴥ￩ʔ",
      "U・ᴥ・U",
      "૮₍ ˶ᵔ ᵕ ᵔ˶ ₎ა",
      "V●ᴥ●V",
      "／(･ × ･)＼",
      "Ꮚ˘ ꈊ ˘Ꮚ",
      "ฅ(•ㅅ•❀)ฅ",
      "ʕ´•ᴥ•`ʔ",
      "૮₍ ´ ꒳ `₎ა"
    ],

    Magic: [
      "✧･ﾟ: *✧･ﾟ:*",
      "｡･:*:･ﾟ★",
      "⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "✧･ﾟ: *✧･ﾟ:*",
      "｡☆✼★━━━━━━━━",
      "꒰ა ☆ ໒꒱",
      "✧˖°.",
      "⋆ ˚｡⋆୨୧˚",
      "✩°｡⋆⸜ 🎧✮",
      "｡ﾟ•┈୨♡୧┈•ﾟ｡"
    ],

    Funny: [
      "¯\\_(ツ)_/¯",
      "(¬‿¬)",
      "( ͡° ͜ʖ ͡°)",
      "┐(￣ヘ￣)┌",
      "(☞ﾟヮﾟ)☞",
      "☜(ﾟヮﾟ☜)",
      "(￣▽￣)ノ",
      "ლ(ಠ益ಠლ)",
      "ᕕ( ᐛ )ᕗ",
      "(ง ื▿ ื)ว"
    ],

    Confused: [
      "(・・?)",
      "(⊙_⊙)?",
      "(・_・ヾ",
      "(￣ω￣;)",
      "(◎_◎;)",
      "(•ิ_•ิ)?",
      "┐(￣ヘ￣)┌",
      "(・・;)ゞ",
      "(⊙_☉)",
      "(•́ω•̀)"
    ]

  };

  /* --------------------------------------------------------
     6. GENERATE 500+ UNIQUE KAOMOJI
  -------------------------------------------------------- */

  const faceDecorations = [
    ["♡ ", " ♡"],
    ["✧ ", " ✧"],
    ["꒰ ", " ꒱"],
    ["୨୧ ", " ୨୧"],
    ["⋆ ", " ⋆"],
    ["❀ ", " ❀"],
    ["꒰ა ", " ໒꒱"],
    ["｡ ", " ｡"],
    ["☆ ", " ☆"],
    ["ෆ ", " ෆ"]
  ];

  const faces = [];

  Object.entries(faceGroups).forEach(([category, items]) => {

    items.forEach((face, index) => {

      faces.push({
        text: face,
        category,
        name: `${category} face ${index + 1}`
      });

      faceDecorations.forEach(([before, after], variation) => {

        faces.push({
          text: `${before}${face}${after}`,
          category,
          name: `${category} decorated ${variation + 1}`
        });

      });

    });

  });

  /* --------------------------------------------------------
     7. RENDER KAOMOJI
  -------------------------------------------------------- */

  function renderFaces() {
    if (!elements.faceResults) return;

    const search =
      elements.faceSearch?.value.toLowerCase().trim() || "";

    const category =
      elements.faceFilter?.value || "all";

    const filtered = faces.filter(item => {

      const matchesSearch =
        item.text.toLowerCase().includes(search) ||
        item.name.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search);

      const matchesCategory =
        category === "all" ||
        item.category.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;

    });

    elements.faceResults.replaceChildren();

    if (!filtered.length) {
      elements.faceResults.innerHTML =
        '<div class="empty-state">No faces found. Try another search ♡</div>';
      return;
    }

    const fragment = document.createDocumentFragment();

    filtered.forEach(item => {

      const button = document.createElement("button");

      button.type = "button";
      button.className = "face-card";

      const face = document.createElement("span");
      face.className = "face";
      face.textContent = item.text;

      const label = document.createElement("small");
      label.textContent = item.category;

      button.append(face, label);

      button.addEventListener("click", () => {
        copyText(item.text);
      });

      fragment.appendChild(button);

    });

    elements.faceResults.appendChild(fragment);
  }

  /* --------------------------------------------------------
     8. EMOJI DATABASE
  -------------------------------------------------------- */

  const emojiGroups = {

    Hearts: [
      "❤️","🩷","🧡","💛","💚","💙","💜","🤎",
      "🖤","🤍","🩶","💔","❤️‍🔥","💕","💞",
      "💓","💗","💖","💘","💝","💟","❣️","♥️"
    ],

    Stars: [
      "⭐","🌟","✨","💫","🌠","✦","✧","★",
      "☆","⋆","✩","✪","✫","✬","✭","✮"
    ],

    Flowers: [
      "🌸","🌺","🌷","🌹","🌻","🌼","💐",
      "🪷","🏵️","🥀","🪻","❀","✿","❁"
    ],

    Nature: [
      "🌙","☀️","🌈","☁️","🌧️","❄️","🌊",
      "🦋","🍃","🌿","🌱","🍀","🌳","🌻",
      "🌼","🌵","🌴","🌎","🌌","☄️"
    ],

    Food: [
      "🍓","🍒","🍑","🍉","🍇","🍰","🧁",
      "🍪","🍩","🍫","🍬","🍭","🍡","🍮",
      "🍦","🍧","🍨","🧋","🍵","☕"
    ],

    Faces: [
      "🥹","🥺","😭","😂","🤣","😍","🥰",
      "😘","😚","😻","😽","🙈","🙉","🙊",
      "😴","😇","🤭","😳","😎","🤍"
    ],

    Objects: [
      "🎀","🧸","🎧","💌","📷","🪞","🕯️",
      "🫧","🪄","🔮","💎","👑","🪷","🧿",
      "🎐","🪭","🩰","🪡","📖","🖋️"
    ],

    Combos: [
      "🎀✨","🩷🫧","🌸🤍","🦋💫","🌷🎀",
      "🥹🫶","💗🧸","🌙⭐","🍓🍰","🩰🎀",
      "🪷✨","☁️🩵","♡₊˚ 🦢・₊✧",
      "⋆｡ﾟ☁︎｡⋆｡ ﾟ☾ ﾟ｡⋆",
      "୨୧・┈・♡・┈・୨୧",
      "🌸₊˚⊹♡","🎀ྀི"
    ]

  };

  const emojis = Object.entries(emojiGroups).flatMap(
    ([category, items]) =>
      items.map(text => ({
        text,
        category
      }))
  );

  /* --------------------------------------------------------
     9. RENDER EMOJI
  -------------------------------------------------------- */

  function renderEmojis() {
    if (!elements.emojiResults) return;

    const search =
      elements.emojiSearch?.value.toLowerCase().trim() || "";

    const category =
      elements.emojiFilter?.value || "all";

    const filtered = emojis.filter(item => {

      const matchesSearch =
        item.text.toLowerCase().includes(search) ||
        item.category.toLowerCase().includes(search);

      const matchesCategory =
        category === "all" ||
        item.category.toLowerCase() === category.toLowerCase();

      return matchesSearch && matchesCategory;

    });

    elements.emojiResults.replaceChildren();

    if (!filtered.length) {
      elements.emojiResults.innerHTML =
        '<div class="empty-state">No emoji found ♡</div>';
      return;
    }

    const fragment = document.createDocumentFragment();

    filtered.forEach(item => {

      const button = document.createElement("button");

      button.type = "button";
      button.className = "emoji-card";

      const emoji = document.createElement("span");
      emoji.textContent = item.text;

      const label = document.createElement("small");
      label.textContent = item.category;

      button.append(emoji, label);

      button.addEventListener("click", () => {
        copyText(item.text);
      });

      fragment.appendChild(button);

    });

    elements.emojiResults.appendChild(fragment);
  }

  /* --------------------------------------------------------
     10. AESTHETIC SYMBOL DATABASE
  -------------------------------------------------------- */

  const symbolGroups = {

    Stars: [
      "✧","✦","✩","✪","✫","✬","✭","✮",
      "✯","✰","★","☆","⋆","｡","⁺","˚",
      "⊹","⭒","⟡","⍣","✵","✶","✷","✸",
      "✹","✺","✻","✼","✽","✾","✿","❀"
    ],

    Hearts: [
      "♡","♥","ღ","დ","۵","❥","❣","❦",
      "❧","ෆ","ᰔ","ꨄ","ৎ୭","ಇ","ლ","დ",
      "♡⃝","♥︎","❥︎","❣︎"
    ],

    Brackets: [
      "「 」","『 』","【 】","〔 〕","〈 〉",
      "《 》","꧁ ꧂","༺ ༻","༒ ༒","⟦ ⟧",
      "⟨ ⟩","❮ ❯","❰ ❱","⌜ ⌝","⌞ ⌟",
      "﹝ ﹞","︵ ︶","︷ ︸"
    ],

    Lines: [
      "─","━","═","╌","┄","┈","┉","╴",
      "╶","╸","╺","│","┃","║","╎","╏",
      "┊","┋","┆","┇","┅","┉","⸺","⸻"
    ],

    Flowers: [
      "✿","❀","❁","❃","❋","✾","❊","❉",
      "⚘","❦","❧","☘","♧","♣","❇","✤"
    ],

    Arrows: [
      "→","←","↑","↓","↗","↘","↙","↖",
      "➜","➤","➳","➵","➶","➷","➸","➺",
      "➻","➼","➽","➾","⇢","⇠","⇡","⇣"
    ],

    Decorative: [
      "୨୧","༄","༅","༆","༇","༺","༻","࿐",
      "ꕤ","ꕥ","꧁","꧂","࿔","࿓","࿙","࿚",
      "⌁","⌇","⌖","⌑","⌗","⸙","⸝","⸜"
    ],

    Math: [
      "∞","≋","≈","≠","≤","≥","±","×",
      "÷","∑","√","∫","∆","∇","∴","∵",
      "∝","∠","⊕","⊗","⊙","⊥","∧","∨"
    ],

    Aesthetic: [
      "°","˚","˖","⁺","₊","˗","˙","｡",
      "･","·","•","◦","○","●","◌","◍",
      "◐","◑","◒","◓","◖","◗","◈","◇"
    ]

  };

  const symbols = unique(
    Object.values(symbolGroups).flat()
  );

  /* --------------------------------------------------------
     11. RENDER SYMBOLS
  -------------------------------------------------------- */

  function renderSymbols() {
    if (!elements.symbolResults) return;

    elements.symbolResults.replaceChildren();

    const fragment = document.createDocumentFragment();

    symbols.forEach(symbol => {

      const button = document.createElement("button");

      button.type = "button";
      button.className = "symbol-card";
      button.textContent = symbol;

      button.title = `Copy ${symbol}`;

      button.addEventListener("click", () => {
        copyText(symbol);
      });

      fragment.appendChild(button);

    });

    elements.symbolResults.appendChild(fragment);
  }

  /* --------------------------------------------------------
     12. BIO CREATOR
  -------------------------------------------------------- */

  function updateBioCount() {
    if (!elements.bioInput || !elements.bioCount) return;

    elements.bioCount.textContent =
      `${elements.bioInput.value.length} / 160`;
  }

  function copyBio() {
    if (!elements.bioInput) return;

    const text = elements.bioInput.value.trim();

    if (!text) {
      notify("Write something first ♡");
      return;
    }

    copyText(text);
  }

  /* --------------------------------------------------------
     13. CLEAR TEXT
  --------------------------------------------
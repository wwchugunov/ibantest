
const qrLines = [
  "BCD",
  "002",
  "2",
  "UCT",
  "",
  "Магазин одягу Марія",
  "UA663077700000026208121463098",
  "UAH100",
  "3561913674",
  "",
  "",
  "Тест"
];


function encodeWin1251(str) {
  const table = {
    "А":0xC0,"Б":0xC1,"В":0xC2,"Г":0xC3,"Д":0xC4,"Е":0xC5,"Ж":0xC6,"З":0xC7,
    "И":0xC8,"Й":0xC9,"К":0xCA,"Л":0xCB,"М":0xCC,"Н":0xCD,"О":0xCE,"П":0xCF,
    "Р":0xD0,"С":0xD1,"Т":0xD2,"У":0xD3,"Ф":0xD4,"Х":0xD5,"Ц":0xD6,"Ч":0xD7,
    "Ш":0xD8,"Щ":0xD9,"Ъ":0xDA,"Ы":0xDB,"Ь":0xDC,"Э":0xDD,"Ю":0xDE,"Я":0xDF,
    "а":0xE0,"б":0xE1,"в":0xE2,"г":0xE3,"д":0xE4,"е":0xE5,"ж":0xE6,"з":0xE7,
    "и":0xE8,"й":0xE9,"к":0xEA,"л":0xEB,"м":0xEC,"н":0xED,"о":0xEE,"п":0xEF,
    "р":0xF0,"с":0xF1,"т":0xF2,"у":0xF3,"ф":0xF4,"х":0xF5,"ц":0xF6,"ч":0xF7,
    "ш":0xF8,"щ":0xF9,"ъ":0xFA,"ы":0xFB,"ь":0xFC,"э":0xFD,"ю":0xFE,"я":0xFF,
    "І":0xA6,"і":0xB6,"Ї":0xA7,"ї":0xB7,"Є":0xAA,"є":0xBA
  };

  const bytes = [];
  for (let ch of str) {
    if (ch.charCodeAt(0) < 128) bytes.push(ch.charCodeAt(0));
    else if (table[ch]) bytes.push(table[ch]);
    else bytes.push(63); // ?
  }
  return new Uint8Array(bytes);
}


function base64UrlEncode(bytes) {
  let binary = "";
  bytes.forEach(b => binary += String.fromCharCode(b));
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/, "");
}


const qrText = qrLines.join("\n");
const win1251 = encodeWin1251(qrText);
const encoded = base64UrlEncode(win1251);
const paymentUrl = "https://bank.gov.ua/qr/" + encoded;


const ua = navigator.userAgent.toLowerCase();
const isMobile = ua.includes("android") || ua.includes("iphone");

if (isMobile) {
  document.getElementById("banks").style.display = "block";
}

function openPayment() {
  window.open(paymentUrl, "_blank");
}


const banks = {
  mono:  { android:"com.ftband.mono", ios:"mono" },
  abank: { android:"ua.com.abank", ios:"abank24" },
  sense: { android:"ua.alfabank.mobile.android", ios:"alfabank" },
  privat: { android:"ua.privatbank.ap24", ios:"privat24" }
};

function openBank(code) {
  const b = banks[code];
  if (!b) return;

  let link = paymentUrl;

  if (ua.includes("android")) {
    link = paymentUrl.replace("https://", "intent://") +
      "#Intent;scheme=https;package=" + b.android + ";end";
     // alert(${link})
  }

  if (ua.includes("iphone")) {
    link = paymentUrl.replace("https://", b.ios + "://");
     // alert(${link});
    
  }

  // alert(${link})
  location.href = link;
}

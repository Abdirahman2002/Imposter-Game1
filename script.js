// === Imposter Game JavaScript ===
let aktuelleSprache = 'de';
let namen = [];
let rollen = [];
let stimmen = {};
let punkte = {};
let lebendeSpieler = [];

const gewinnSound = new Audio('https://actions.google.com/sounds/v1/cartoon/clang_and_wobble.ogg');
const verlustSound = new Audio('https://actions.google.com/sounds/v1/cartoon/wood_plank_flicks.ogg');

const texte = {
  farben: ["#f28b82", "#fbbc04", "#fff475", "#ccff90", "#a7ffeb", "#cbf0f8", "#aecbfa", "#d7aefb"],
  de: {
    title: "🎭 Imposter Game",
    labelSpieler: "Wie viele Spieler?",
    labelUndercover: "Wie viele Undercover?",
    labelWhite: "Wie viele Mr. White?",
    weiterBtn: "Weiter zur Namenseingabe",
    startBtn: "Spiel starten",
    anleitung: `<h2>Spielanleitung</h2><p>Die meisten Spieler erhalten dasselbe Wort.<br>Undercover: ein verwandtes Wort.<br>Mr. White: ein Fragezeichen.<br><br>Danach stimmt jeder ab, wer verdächtig ist. Ziel: Mr. White und Undercover entlarven!</p>` ,
    stimmeAbgeben: "Stimme abgeben",
    gewinnerText: "🏆 Gewinner: ",
    rauswurfText: "wurde rausgeworfen.",
    civiliansWin: "🎉 Die Civilians haben gewonnen und alle Imposter entdeckt!",
    impostersWin: "😈 Die Imposter haben das Spiel übernommen!"
  },
  so: {
    title: "🎭 Ciyaarta Imposter-ka",
    labelSpieler: "Imisa ciyaartoy?",
    labelUndercover: "Imisa Undercover?",
    labelWhite: "Imisa Mr. White?",
    weiterBtn: "Geli magacyada",
    startBtn: "Bilow ciyaarta",
    anleitung: `<h2>Tilmaamaha ciyaarta</h2><p>Inta badan waxay helayaan eray isku mid ah.<br>Undercover: eray la mid ah.<br>Mr. White: calaamad su'aal ah.<br><br>Cod u dhiib cidda aad u maleyneyso! Ujeeddo: hel Undercover/Mr. White</p>` ,
    stimmeAbgeben: "Cod dhiibid",
    gewinnerText: "🏆 Guuleyste: ",
    rauswurfText: "waa la saaray.",
    civiliansWin: "🎉 Dadka caadiga ah ayaa guuleystay!",
    impostersWin: "😈 Imposter-ku waa guuleysteen!"
  }
};

const wortpaare = {
  de: [
    { normal: "Apfel", undercover: "Birne" },
    { normal: "Auto", undercover: "Motorrad" },
    { normal: "Hund", undercover: "Wolf" },
    { normal: "Schule", undercover: "Universität" },
    { normal: "Wasser", undercover: "Saft" },
    { normal: "Sonne", undercover: "Lampe" },
    { normal: "Zug", undercover: "Tram" },
    { normal: "Lehrer", undercover: "Professor" },
    { normal: "Pizza", undercover: "Flammkuchen" },
    { normal: "Stuhl", undercover: "Sessel" }
  ],
  so: [
    { normal: "Biyo", undercover: "Caano" },
    { normal: "Baabuur", undercover: "Mooto" },
    { normal: "Ey", undercover: "Yaxaas" },
    { normal: "Iskuul", undercover: "Jaamacad" },
    { normal: "Qorrax", undercover: "Laydh" },
    { normal: "Buug", undercover: "Majalad" },
    { normal: "Shaah", undercover: "Kafeega" },
    { normal: "Cunto", undercover: "Canjeero" },
    { normal: "Qalin", undercover: "Biro" },
    { normal: "Telefishin", undercover: "Muraayad" }
  ]
};

function spracheWechseln() {
  aktuelleSprache = document.getElementById("languageSelect").value;
  const t = texte[aktuelleSprache];
  document.getElementById("title").textContent = t.title;
  document.getElementById("labelSpieler").textContent = t.labelSpieler;
  document.getElementById("labelUndercover").textContent = t.labelUndercover;
  document.getElementById("labelWhite").textContent = t.labelWhite;
  document.getElementById("weiterBtn").textContent = t.weiterBtn;
  document.getElementById("startBtn").textContent = t.startBtn;
}

function toggleAnleitung() {
  const hilfe = document.getElementById("anleitung");
  hilfe.innerHTML = texte[aktuelleSprache].anleitung;
  hilfe.style.display = hilfe.style.display === "none" ? "block" : "none";
}

function zeigeNamensfelder() {
  const anzahl = parseInt(document.getElementById("anzahl").value);
  const namenDiv = document.getElementById("namensfelder");
  namenDiv.innerHTML = "";
  for (let i = 0; i < anzahl; i++) {
    const input = document.createElement("input");
    input.placeholder = `Spieler ${i + 1}`;
    input.id = "spieler_" + i;
    namenDiv.appendChild(input);
  }
  document.getElementById("startBtn").style.display = "inline-block";
}

function spielStarten() {
  const anzahl = parseInt(document.getElementById("anzahl").value);
  const undercover = parseInt(document.getElementById("undercover").value);
  const white = parseInt(document.getElementById("white").value);
  if (undercover + white >= anzahl) {
    alert("Mindestens ein Civilian muss übrig bleiben!");
    return;
  }
  namen = [];
  rollen = [];
  lebendeSpieler = [];
  for (let i = 0; i < anzahl; i++) {
    const name = document.getElementById("spieler_" + i).value.trim();
    if (!name) return alert("Alle Namen müssen ausgefüllt sein.");
    namen.push(name);
    lebendeSpieler.push(name);
    if (!(name in punkte)) punkte[name] = 0;
  }
  let alleRollen = Array(anzahl - undercover - white).fill("civilian")
    .concat(Array(undercover).fill("undercover"))
    .concat(Array(white).fill("white"));
  alleRollen = alleRollen.sort(() => Math.random() - 0.5);
  for (let i = 0; i < namen.length; i++) rollen[i] = alleRollen[i];

  const w = wortpaare[aktuelleSprache][Math.floor(Math.random() * wortpaare[aktuelleSprache].length)];
  const liste = document.getElementById("spielerListe");
  liste.innerHTML = "";
  document.getElementById("setupBereich").style.display = "none";
  for (let i = 0; i < namen.length; i++) {
    const btn = document.createElement("button");
    btn.textContent = namen[i] + " - Verdeckt";
    btn.dataset.index = i;
    btn.onclick = () => {
      const idx = parseInt(btn.dataset.index);
      if (btn.dataset.aufgedeckt !== "true") {
        if (rollen[idx] === "white") btn.textContent = namen[idx] + ": ?";
        else if (rollen[idx] === "undercover") btn.textContent = namen[idx] + ": " + w.undercover;
        else btn.textContent = namen[idx] + ": " + w.normal;
        btn.dataset.aufgedeckt = "true";
      } else {
        btn.textContent = namen[idx] + " - Verdeckt";
        btn.dataset.aufgedeckt = "false";
      }
    };
    btn.style.backgroundColor = texte.farben[i % texte.farben.length];
    btn.style.color = "#000";
    liste.appendChild(btn);
  }
  baueVoting();
  zeigePunkteRanking();
}

function baueVoting() {
  const vDiv = document.getElementById("voting");
  vDiv.innerHTML = "<h3>Voting</h3>";
  stimmen = {};
  lebendeSpieler.forEach(name => {
    const btn = document.createElement("button");
    btn.textContent = name;
    btn.onclick = () => auswerten(name);
    vDiv.appendChild(btn);
  });
  vDiv.style.display = "block";
}

function auswerten(name) {
  const i = namen.indexOf(name);
  lebendeSpieler = lebendeSpieler.filter(n => n !== name);
  document.getElementById("gewinnerAnzeige").textContent = name + " " + texte[aktuelleSprache].rauswurfText + " (" + rollen[i] + ")";
  if ((rollen[i] === "undercover") || (rollen[i] === "white")) {
    punkte[namen[i]] += 0;
  } else {
    punkte[namen[i]] -= 1;
  }
  pruefeSpielende();
}

function pruefeSpielende() {
  const nochRollen = lebendeSpieler.map(n => rollen[namen.indexOf(n)]);
  const imposters = nochRollen.filter(r => r !== "civilian").length;
  const civilians = nochRollen.length - imposters;

  if (imposters === 0) {
  document.getElementById("gewinnerAnzeige").textContent += "\n" + texte[aktuelleSprache].civiliansWin;
    gewinnSound.play();
    lebendeSpieler.forEach(n => punkte[n] += 1);
    neueRundeStarten();
  } else if (imposters >= civilians) {
document.getElementById("gewinnerAnzeige").textContent += "\n" + texte[aktuelleSprache].impostersWin;
    verlustSound.play();
    lebendeSpieler.forEach(n => {
      if (rollen[namen.indexOf(n)] !== "civilian") punkte[n] += 1;
    });
    neueRundeStarten();
  } else {
    baueVoting();
  }
  zeigePunkteRanking();
}

function zeigePunkteRanking() {
  const rDiv = document.getElementById("ranking");
  const btn = document.createElement("button");
  btn.textContent = "📊 Punkte anzeigen/verstecken";
  btn.onclick = () => {
    const punkteDiv = document.getElementById("punkteTabelle");
    punkteDiv.style.display = punkteDiv.style.display === "none" ? "block" : "none";
  };
  rDiv.innerHTML = "";
  rDiv.appendChild(btn);
  const punkteDiv = document.createElement("div");
  punkteDiv.id = "punkteTabelle";
  punkteDiv.style.display = "none";
  const sorted = Object.entries(punkte).sort((a,b) => b[1] - a[1]);
  sorted.forEach(([n, p]) => {
    const d = document.createElement("div");
    d.textContent = `${n}: ${p}`;
    punkteDiv.appendChild(d);
  });
  rDiv.appendChild(punkteDiv);
}

function neueRundeStarten() {
  const b = document.getElementById("neustart");
  b.innerHTML = "<button onclick='location.reload()'>Neue Runde</button>";
}

// === PWA Vorbereitung ===
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('service-worker.js')
      .then(reg => console.log('Service Worker registriert', reg))
      .catch(err => console.error('SW Fehler', err));
  });
}
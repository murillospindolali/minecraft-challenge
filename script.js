import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   DOM
========================= */

const murilloEl = document.getElementById("murillo");
const leoEl = document.getElementById("leo");
const kauaEl = document.getElementById("kaua");
const marianaEl = document.getElementById("mariana");
const fernandaEl = document.getElementById("fernanda");

const div = document.getElementById("objetivos");

console.log("Minecraft Challenge iniciado!");

/* =========================
   FIREBASE
========================= */

const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "minecraft-challenge-9535f.firebaseapp.com",
  projectId: "minecraft-challenge-9535f",
  storageBucket: "minecraft-challenge-9535f.appspot.com",
  messagingSenderId: "853907945609",
  appId: "1:853907945609:web:d7af1914f87acb3201ae58"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/* cria doc inicial */
async function inicializarDoc() {
    const ref = doc(db, "jogo", "progresso");
    await setDoc(ref, {}, { merge: true });
}
inicializarDoc();

/* =========================
   DADOS
========================= */

const objetivos = [
{ nome: "Pegar madeira", pontos: 1, categoria: "🌱 Fáceis" },
{ nome: "Fazer bancada de trabalho", pontos: 1, categoria: "🌱 Fáceis" },
{ nome: "Fazer fornalha", pontos: 2, categoria: "🌱 Fáceis" },
{ nome: "Fazer cama", pontos: 2, categoria: "🌱 Fáceis" },
{ nome: "Plantar trigo", pontos: 2, categoria: "🌱 Fáceis" },
{ nome: "Conseguir carvão", pontos: 2, categoria: "🌱 Fáceis" },
{ nome: "Domesticar um lobo", pontos: 3, categoria: "🌱 Fáceis" },
{ nome: "Domesticar um gato", pontos: 3, categoria: "🌱 Fáceis" },
{ nome: "Fazer um barco", pontos: 2, categoria: "🌱 Fáceis" },
{ nome: "Pescar um peixe", pontos: 3, categoria: "🌱 Fáceis" },

{ nome: "Conseguir ferro", pontos: 3, categoria: "⛏️ Médios" },
{ nome: "Fazer armadura completa de ferro", pontos: 5, categoria: "⛏️ Médios" },
{ nome: "Fazer escudo", pontos: 3, categoria: "⛏️ Médios" },
{ nome: "Conseguir ouro", pontos: 4, categoria: "⛏️ Médios" },
{ nome: "Encontrar uma vila", pontos: 5, categoria: "⛏️ Médios" },
{ nome: "Conseguir uma esmeralda", pontos: 5, categoria: "⛏️ Médios" },
{ nome: "Fazer um mapa", pontos: 4, categoria: "⛏️ Médios" },
{ nome: "Entrar no Nether", pontos: 7, categoria: "⛏️ Médios" },

{ nome: "Encontrar diamante", pontos: 5, categoria: "💎 Difíceis" },
{ nome: "Fazer picareta de diamante", pontos: 8, categoria: "💎 Difíceis" },
{ nome: "Armadura completa de diamante", pontos: 12, categoria: "💎 Difíceis" },

{ nome: "Conseguir Netherite", pontos: 15, categoria: "🔥 Muito Difíceis" },
{ nome: "Matar o Wither", pontos: 30, categoria: "🔥 Muito Difíceis" },
{ nome: "Matar o Ender Dragon", pontos: 40, categoria: "🔥 Muito Difíceis" }
];

const jogadores = ["Murillo", "Léo", "Kauã", "Mariana", "Fernanda"];

let progresso = {};

let pontos = {
    Murillo: 0,
    Léo: 0,
    Kauã: 0,
    Mariana: 0,
    Fernanda: 0
};

/* =========================
   SALVAR
========================= */

async function salvarProgresso() {
    const ref = doc(db, "jogo", "progresso");
    await setDoc(ref, structuredClone(progresso));
}

/* =========================
   LISTENER REALTIME
========================= */

onSnapshot(doc(db, "jogo", "progresso"), (snap) => {

    console.log("🔥 SNAPSHOT ATIVOU");

    progresso = snap.data() || {};

    recalcularPontos();
    atualizarCheckboxes();
});

/* =========================
   RANKING
========================= */

function atualizarPlacar() {

    const ranking = [
        { nome: "Murillo", pontos: pontos.Murillo },
        { nome: "Léo", pontos: pontos.Léo },
        { nome: "Kauã", pontos: pontos.Kauã },
        { nome: "Mariana", pontos: pontos.Mariana },
        { nome: "Fernanda", pontos: pontos.Fernanda }
    ];

    ranking.sort((a, b) => b.pontos - a.pontos);

    const container = murilloEl?.parentElement;
    if (!container) return;

    container.innerHTML = "";

    const classes = ["first", "second", "third"];

    ranking.forEach((jogador, index) => {

        const el = document.createElement("div");

        el.innerText = `${index + 1}º ${jogador.nome} - ${jogador.pontos} pts`;

        if (classes[index]) el.classList.add(classes[index]);

        container.appendChild(el);
    });
}

/* =========================
   RECALCULAR PONTOS (CORRIGIDO)
========================= */

function recalcularPontos() {

    pontos = {
        Murillo: 0,
        Léo: 0,
        Kauã: 0,
        Mariana: 0,
        Fernanda: 0
    };

    objetivos.forEach(obj => {
        jogadores.forEach(jogador => {

            if (progresso[jogador]?.[obj.nome] === true) {
                pontos[jogador] += obj.pontos;
            }

        });
    });

    atualizarPlacar();
}

/* =========================
   CHECKBOX UPDATE
========================= */

function atualizarCheckboxes() {

    document.querySelectorAll("input[type=checkbox]").forEach(cb => {

        const jogador = cb.dataset.jogador;
        const objetivo = cb.dataset.objetivo;

        cb.checked = progresso[jogador]?.[objetivo] || false;
    });
}

/* =========================
   CRIAR INTERFACE
========================= */

objetivos.forEach(obj => {

    const card = document.createElement("div");
    card.className = "card";

    let html = `<h3>${obj.nome} (${obj.pontos} pts)</h3>`;

    jogadores.forEach(j => {
        html += `
        <label>
            <input type="checkbox"
                data-jogador="${j}"
                data-objetivo="${obj.nome}">
            ${j}
        </label>
        `;
    });

    card.innerHTML = html;
    div.appendChild(card);
});

/* =========================
   EVENTO CHECKBOX
========================= */

document.addEventListener("change", async (e) => {

    if (e.target.type === "checkbox") {

        const jogador = e.target.dataset.jogador;
        const objetivo = e.target.dataset.objetivo;

        if (!progresso[jogador]) progresso[jogador] = {};

        progresso[jogador][objetivo] = e.target.checked;

        recalcularPontos();
        salvarProgresso();
    }
});


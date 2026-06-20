
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const murilloEl = document.getElementById("murillo");
const leoEl = document.getElementById("leo");
const kauaEl = document.getElementById("kaua");

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

console.log("🔥 Firebase conectado com sucesso!");

/* =========================
   DADOS DO JOGO
========================= */

const objetivos = [
    { nome: "Pegar madeira", pontos: 1 },
    { nome: "Fazer cama", pontos: 2 },
    { nome: "Fazer bancada", pontos: 1 },
    { nome: "Conseguir ferro", pontos: 3 },
    { nome: "Encontrar diamante", pontos: 5 },
    { nome: "Netherite", pontos: 15 }
];

const jogadores = ["Murillo", "Léo", "Kauã"];

const div = document.getElementById("objetivos");

/* =========================
   ESTADO DO JOGO (PROGRESSO REAL)
========================= */

let progresso = {
    Murillo: {},
    Léo: {},
    Kauã: {}
};

/* =========================
   PONTOS CALCULADOS
========================= */

let pontos = {
    Murillo: 0,
    Léo: 0,
    Kauã: 0
};

/* =========================
   PASSO 4 — SALVAR NO FIREBASE
========================= */

async function salvarProgresso() {
    await setDoc(doc(db, "jogo", "progresso"), progresso);
}

/* =========================
   PASSO 5 — ATUALIZAR PLACAR
========================= */

function atualizarPlacar() {

    const ranking = [
        { nome: "Murillo", pontos: pontos.Murillo, el: murilloEl },
        { nome: "Léo", pontos: pontos.Léo, el: leoEl },
        { nome: "Kauã", pontos: pontos.Kauã, el: kauaEl }
    ];

    // ordena por pontos
    ranking.sort((a, b) => b.pontos - a.pontos);

    const container = murilloEl.parentElement;

    // limpa ordem atual
    container.innerHTML = "";

    ranking.forEach((jogador, index) => {

        const el = jogador.el;

        el.innerText = `${index + 1}º ${jogador.nome} - ${jogador.pontos} pts`;

        el.classList.remove("first", "second", "third");

        const classes = ["first", "second", "third"];
        el.classList.add(classes[index]);

        // re-insere na ordem correta
        container.appendChild(el);
    });
}

/* =========================
   PASSO 7 — RECARREGAR CHECKBOX + RECONTAR PONTOS
========================= */

function atualizarCheckboxes() {

    // marca/desmarca checkboxes conforme Firebase
    document.querySelectorAll("input[type=checkbox]").forEach(cb => {

        const jogador = cb.dataset.jogador;
        const objetivo = cb.dataset.objetivo;

        cb.checked = progresso[jogador]?.[objetivo] || false;
    });

    recalcularPontos();
}

/* =========================
   RECONTAR PONTOS (SEM BUG)
========================= */

function recalcularPontos() {

    pontos = {
        Murillo: 0,
        Léo: 0,
        Kauã: 0
    };

    objetivos.forEach(obj => {

        jogadores.forEach(j => {

            if (progresso[j]?.[obj.nome]) {
                pontos[j] += obj.pontos;
            }

        });

    });

    atualizarPlacar();
}

/* =========================
   CRIAR INTERFACE
========================= */

objetivos.forEach((obj) => {

    const card = document.createElement("div");
    card.className = "card";

    let html = `<h3>${obj.nome} (${obj.pontos} pts)</h3>`;

    jogadores.forEach((jogador) => {

        html += `
        <label>
            <input type="checkbox"
                data-jogador="${jogador}"
                data-objetivo="${obj.nome}">
            ${jogador}
        </label>
        `;
    });

    card.innerHTML = html;
    div.appendChild(card);
});

/* =========================
   LÓGICA DOS CHECKBOX
========================= */

document.addEventListener("change", async (e) => {

    if (e.target.type === "checkbox") {

        const jogador = e.target.dataset.jogador;
        const objetivo = e.target.dataset.objetivo;

        progresso[jogador][objetivo] = e.target.checked;

        recalcularPontos();

        await salvarProgresso();
    }
});
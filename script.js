import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
    getFirestore,
    doc,
    setDoc,
    onSnapshot
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

/* =========================
   ELEMENTOS DO DOM
========================= */

const murilloEl = document.getElementById("murillo");
const leoEl = document.getElementById("leo");
const kauaEl = document.getElementById("kaua");

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

/* =========================
   ESTADO GLOBAL (CORRIGIDO)
========================= */

let progresso = null;

let pontos = {
    Murillo: 0,
    Léo: 0,
    Kauã: 0
};

/* =========================
   SALVAR NO FIREBASE (SEGURADO)
========================= */

async function salvarProgresso() {
    if (!progresso) return;

    await setDoc(doc(db, "jogo", "progresso"), progresso);
}

/* =========================
   RANKING
========================= */

function atualizarPlacar() {

    const ranking = [
        { nome: "Murillo", pontos: pontos.Murillo, el: murilloEl },
        { nome: "Léo", pontos: pontos.Léo, el: leoEl },
        { nome: "Kauã", pontos: pontos.Kauã, el: kauaEl }
    ];

    ranking.sort((a, b) => b.pontos - a.pontos);

    const container = murilloEl.parentElement;

    container.innerHTML = "";

    const classes = ["first", "second", "third"];

    ranking.forEach((jogador, index) => {

        const el = jogador.el;

        el.innerText = `${index + 1}º ${jogador.nome} - ${jogador.pontos} pts`;

        el.classList.remove("first", "second", "third");
        el.classList.add(classes[index]);

        container.appendChild(el);
    });
}

/* =========================
   RECONTAR PONTOS
========================= */

function recalcularPontos() {

    pontos = {
        Murillo: 0,
        Léo: 0,
        Kauã: 0
    };

    if (!progresso) return;

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
   ATUALIZAR CHECKBOX
========================= */

function atualizarCheckboxes() {

    if (!progresso) return;

    document.querySelectorAll("input[type=checkbox]").forEach(cb => {

        const jogador = cb.dataset.jogador;
        const objetivo = cb.dataset.objetivo;

        cb.checked = progresso[jogador]?.[objetivo] || false;
    });

    recalcularPontos();
}

/* =========================
   FIREBASE LISTENER (CORRETO)
========================= */

onSnapshot(doc(db, "jogo", "progresso"), (snap) => {

    if (snap.exists()) {
        progresso = snap.data();
    } else {
        progresso = {
            Murillo: {},
            Léo: {},
            Kauã: {}
        };
        salvarProgresso();
    }

    atualizarCheckboxes();
});

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
   CHECKBOX LOGIC
========================= */

document.addEventListener("change", async (e) => {

    if (e.target.type === "checkbox") {

        const jogador = e.target.dataset.jogador;
        const objetivo = e.target.dataset.objetivo;

        if (!progresso[jogador]) {
            progresso[jogador] = {};
        }

        progresso[jogador][objetivo] = e.target.checked;

        recalcularPontos();
        await salvarProgresso();
    }
});

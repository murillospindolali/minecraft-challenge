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

/* =========================
   🌱 FÁCEIS
========================= */
{ nome: "Pegar madeira", pontos: 1 },
{ nome: "Fazer bancada de trabalho", pontos: 1 },
{ nome: "Fazer fornalha", pontos: 2 },
{ nome: "Fazer cama", pontos: 2 },
{ nome: "Plantar trigo", pontos: 2 },
{ nome: "Conseguir carvão", pontos: 2 },
{ nome: "Domesticar um lobo", pontos: 3 },
{ nome: "Domesticar um gato", pontos: 3 },
{ nome: "Fazer um barco", pontos: 2 },
{ nome: "Pescar um peixe", pontos: 3 },

/* =========================
   ⛏️ MÉDIOS
========================= */
{ nome: "Conseguir ferro", pontos: 3 },
{ nome: "Fazer armadura completa de ferro", pontos: 5 },
{ nome: "Fazer escudo", pontos: 3 },
{ nome: "Conseguir ouro", pontos: 4 },
{ nome: "Encontrar uma vila", pontos: 5 },
{ nome: "Conseguir uma esmeralda", pontos: 5 },
{ nome: "Fazer um mapa", pontos: 4 },
{ nome: "Encontrar portal em ruínas", pontos: 6 },
{ nome: "Entrar no Nether", pontos: 7 },
{ nome: "Conseguir quartzo", pontos: 5 },

/* =========================
   💎 DIFÍCEIS
========================= */
{ nome: "Encontrar diamante", pontos: 5 },
{ nome: "Fazer picareta de diamante", pontos: 8 },
{ nome: "Armadura completa de diamante", pontos: 12 },
{ nome: "Conseguir obsidiana", pontos: 6 },
{ nome: "Encantar um item", pontos: 10 },
{ nome: "Fortaleza do Nether", pontos: 12 },
{ nome: "Conseguir Blaze Rod", pontos: 10 },
{ nome: "Conseguir Pérola do End", pontos: 8 },
{ nome: "Mansão da Floresta", pontos: 20 },
{ nome: "Cidade Antiga", pontos: 20 },

/* =========================
   🔥 MUITO DIFÍCEIS
========================= */
{ nome: "Conseguir Netherite", pontos: 15 },
{ nome: "Ferramenta de Netherite", pontos: 20 },
{ nome: "Armadura completa de Netherite", pontos: 30 },
{ nome: "Encontrar Elytra", pontos: 35 },
{ nome: "Matar o Wither", pontos: 30 },
{ nome: "Matar o Ender Dragon", pontos: 40 },
{ nome: "Totem da Imortalidade", pontos: 25 },
{ nome: "Cidade do End", pontos: 20 },
{ nome: "Ovo de dragão", pontos: 50 },
{ nome: "Beacon funcionando", pontos: 40 },

/* =========================
   🏠 CONSTRUÇÃO
========================= */
{ nome: "Casa mais bonita (votação)", pontos: 20 },
{ nome: "Base mais bonita", pontos: 30 },
{ nome: "Fazenda automática", pontos: 20 },
{ nome: "Melhor decoração interna", pontos: 15 },
{ nome: "Melhor ponte", pontos: 10 },
{ nome: "Melhor fazenda de animais", pontos: 10 },
{ nome: "Melhor armazenamento organizado", pontos: 15 },
{ nome: "Portal do Nether decorado", pontos: 15 },
{ nome: "Melhor jardim", pontos: 10 },
{ nome: "Melhor castelo ou torre", pontos: 25 },

/* =========================
   😂 EXTRAS
========================= */
{ nome: "Cair na lava e sobreviver", pontos: 5 },
{ nome: "Achar templo do deserto", pontos: 8 },
{ nome: "Achar navio naufragado", pontos: 5 },
{ nome: "Encontrar tesouro enterrado", pontos: 10 },
{ nome: "Domesticar um cavalo", pontos: 5 },
{ nome: "Criar golem de ferro", pontos: 10 },
{ nome: "Conseguir tridente", pontos: 15 },
{ nome: "Maçã dourada encantada", pontos: 40 },
{ nome: "Conseguir disco de música", pontos: 10 },
{ nome: "Aldeão com profissão útil", pontos: 8 }

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

    if (!snap.exists()) {
        console.log("Sem dados ainda no Firebase");
        return;
    }

    progresso = snap.data();

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

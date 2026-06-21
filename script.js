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

console.log("🔥 Firebase conectado com sucesso!");

/* =========================
   DADOS DO JOGO
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
{ nome: "Encontrar portal em ruínas", pontos: 6, categoria: "⛏️ Médios" },
{ nome: "Entrar no Nether", pontos: 7, categoria: "⛏️ Médios" },
{ nome: "Conseguir quartzo", pontos: 5, categoria: "⛏️ Médios" },

{ nome: "Encontrar diamante", pontos: 5, categoria: "💎 Difíceis" },
{ nome: "Fazer picareta de diamante", pontos: 8, categoria: "💎 Difíceis" },
{ nome: "Armadura completa de diamante", pontos: 12, categoria: "💎 Difíceis" },
{ nome: "Conseguir obsidiana", pontos: 6, categoria: "💎 Difíceis" },
{ nome: "Encantar um item", pontos: 10, categoria: "💎 Difíceis" },
{ nome: "Fortaleza do Nether", pontos: 12, categoria: "💎 Difíceis" },
{ nome: "Conseguir Blaze Rod", pontos: 10, categoria: "💎 Difíceis" },
{ nome: "Conseguir Pérola do End", pontos: 8, categoria: "💎 Difíceis" },
{ nome: "Mansão da Floresta", pontos: 20, categoria: "💎 Difíceis" },
{ nome: "Cidade Antiga", pontos: 20, categoria: "💎 Difíceis" },

{ nome: "Conseguir Netherite", pontos: 15, categoria: "🔥 Muito Difíceis" },
{ nome: "Ferramenta de Netherite", pontos: 20, categoria: "🔥 Muito Difíceis" },
{ nome: "Armadura completa de Netherite", pontos: 30, categoria: "🔥 Muito Difíceis" },
{ nome: "Encontrar Elytra", pontos: 35, categoria: "🔥 Muito Difíceis" },
{ nome: "Matar o Wither", pontos: 30, categoria: "🔥 Muito Difíceis" },
{ nome: "Matar o Ender Dragon", pontos: 40, categoria: "🔥 Muito Difíceis" },
{ nome: "Totem da Imortalidade", pontos: 25, categoria: "🔥 Muito Difíceis" },
{ nome: "Cidade do End", pontos: 20, categoria: "🔥 Muito Difíceis" },
{ nome: "Ovo de dragão", pontos: 50, categoria: "🔥 Muito Difíceis" },
{ nome: "Beacon funcionando", pontos: 40, categoria: "🔥 Muito Difíceis" },

{ nome: "Casa mais bonita (votação)", pontos: 20, categoria: "🏠 Construção" },
{ nome: "Base mais bonita", pontos: 30, categoria: "🏠 Construção" },
{ nome: "Fazenda automática", pontos: 20, categoria: "🏠 Construção" },
{ nome: "Melhor decoração interna", pontos: 15, categoria: "🏠 Construção" },
{ nome: "Melhor ponte", pontos: 10, categoria: "🏠 Construção" },
{ nome: "Melhor fazenda de animais", pontos: 10, categoria: "🏠 Construção" },
{ nome: "Melhor armazenamento organizado", pontos: 15, categoria: "🏠 Construção" },
{ nome: "Portal do Nether decorado", pontos: 15, categoria: "🏠 Construção" },
{ nome: "Melhor jardim", pontos: 10, categoria: "🏠 Construção" },
{ nome: "Melhor castelo ou torre", pontos: 25, categoria: "🏠 Construção" },

{ nome: "Cair na lava e sobreviver", pontos: 5, categoria: "😂 Extras" },
{ nome: "Achar templo do deserto", pontos: 8, categoria: "😂 Extras" },
{ nome: "Achar navio naufragado", pontos: 5, categoria: "😂 Extras" },
{ nome: "Encontrar tesouro enterrado", pontos: 10, categoria: "😂 Extras" },
{ nome: "Domesticar um cavalo", pontos: 5, categoria: "😂 Extras" },
{ nome: "Criar golem de ferro", pontos: 10, categoria: "😂 Extras" },
{ nome: "Conseguir tridente", pontos: 15, categoria: "😂 Extras" },
{ nome: "Maçã dourada encantada", pontos: 40, categoria: "😂 Extras" },
{ nome: "Conseguir disco de música", pontos: 10, categoria: "😂 Extras" },
{ nome: "Aldeão com profissão útil", pontos: 8, categoria: "😂 Extras" }

];

const jogadores = [
    "Murillo",
    "Léo",
    "Kauã",
    "Mariana",
    "Fernanda"
];

/* =========================
   ESTADO GLOBAL (CORRIGIDO)
========================= */

let progresso = {};

let pontos = {
    Murillo: 0,
    Léo: 0,
    Kauã: 0,
    Mariana: 0,
    Fernanda: 0
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
        { nome: "Kauã", pontos: pontos.Kauã, el: kauaEl },
        { nome: "Mariana", pontos: pontos.Mariana, el: marianaEl },
        { nome: "Fernanda", pontos: pontos.Fernanda, el: fernandaEl }
    ];

    ranking.sort((a, b) => b.pontos - a.pontos);

    const container = murilloEl?.parentElement;

    if (!container) return; // 🔥 evita erro do null

    container.innerHTML = "";

    const classes = ["first", "second", "third"];

    ranking.forEach((jogador, index) => {

        const el = document.createElement("div");

        el.innerText = `${index + 1}º ${jogador.nome} - ${jogador.pontos} pts`;

        // 🔥 só adiciona se existir classe válida
        if (classes[index]) {
            el.classList.add(classes[index]);
        }

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
    Kauã: 0,
    Mariana: 0,
    Fernanda: 0
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


}

/* =========================
   FIREBASE LISTENER (CORRETO)
========================= */

onSnapshot(doc(db, "jogo", "progresso"), (snap) => {
    console.log("🔥 SNAPSHOT AO VIVO:", snap.data());

    if (!snap.exists()) return;

    progresso = snap.data() || {};

    recalcularPontos();
    atualizarCheckboxes();
});

/* =========================
   CRIAR INTERFACE
========================= */

const categorias = [...new Set(objetivos.map(o => o.categoria))];

categorias.forEach(categoria => {

const secao = document.createElement("div");
secao.className = "secao-categoria";
secao.dataset.categoria = categoria;

const titulo = document.createElement("h2");
titulo.className = "categoria";
titulo.textContent = categoria;

secao.appendChild(titulo);


    const grid = document.createElement("div");
    grid.className = "grid-categoria";

    objetivos
        .filter(obj => obj.categoria === categoria)
        .forEach(obj => {

            const card = document.createElement("div");
            card.className = "card";

            let html = `<h3>${obj.nome} (${obj.pontos} pts)</h3>`;

            jogadores.forEach(jogador => {

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
            grid.appendChild(card);
        });

    secao.appendChild(grid);
    div.appendChild(secao);
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

/* =========================
   FILTROS
========================= */

const botoesFiltro = document.querySelectorAll(".filtro");

botoesFiltro.forEach(botao => {

    botao.addEventListener("click", () => {

        botoesFiltro.forEach(b =>
            b.classList.remove("ativo")
        );

        botao.classList.add("ativo");

        const filtro = botao.dataset.filtro;

        document
            .querySelectorAll(".secao-categoria")
            .forEach(secao => {

                const categoria = secao.dataset.categoria;

                if (filtro === "todos") {
                    secao.style.display = "block";
                    return;
                }

                const mapa = {
                    "faceis": "🌱 Fáceis",
                    "medios": "⛏️ Médios",
                    "dificeis": "💎 Difíceis",
                    "muito": "🔥 Muito Difíceis",
                    "construcao": "🏠 Construção",
                    "extras": "😂 Extras"
                };

                secao.style.display =
                    categoria === mapa[filtro]
                        ? "block"
                        : "none";

            });

    });

});

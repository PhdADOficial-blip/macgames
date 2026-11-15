/* ========== MODAL DO CUPOM ========== */

function obterCookie(nome) {
    let nomeProcurado = nome + "=";
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let c = cookies[i].trim();
        if (c.indexOf(nomeProcurado) == 0) return c.substring(nomeProcurado.length, c.length);
    }
    return "";
}

// Fecha o modal ao clicar no botão ou no X
function fecharModalGame() {
    const modal = document.getElementById("meuModalCookie");
    if (modal) modal.style.display = "none";
}

// Antes era um DOMContentLoaded. Agora só roda quando for CHAMADA.
function mostrarModalPromocao() {
    const modal = document.getElementById("meuModalCookie");
    if (!modal) return;

    let visitou = obterCookie("usuario_ja_visitou");
    if (visitou === "") {
        try {
            const validadeLocal = Number(localStorage.getItem("usuario_ja_visitou") || 0);
            if (validadeLocal > Date.now()) {
                visitou = "sim";
            } else {
                localStorage.removeItem("usuario_ja_visitou");
            }
        } catch (error) {
            visitou = "";
        }
    }

    if (visitou === "") {
        modal.style.display = "flex";

        // Cria o cookie para não incomodar o usuário na próxima vez
        let data = new Date();
        data.setTime(data.getTime() + (7 * 24 * 60 * 60 * 1000));
        document.cookie = "usuario_ja_visitou=sim; expires=" + data.toUTCString() + "; path=/; SameSite=Lax";

        if (obterCookie("usuario_ja_visitou") === "") {
            try {
                localStorage.setItem("usuario_ja_visitou", String(data.getTime()));
            } catch (error) {
                // O modal continua funcionando mesmo quando o navegador bloqueia o armazenamento.
            }
        }
    }
}

/* ========== BANNER DE LGPD ========== */

function obterConsentimento() {
    try {
        return localStorage.getItem("consentimento_lgpd");
    } catch (erro) {
        return null;
    }
}

function salvarConsentimento(valor) {
    try {
        localStorage.setItem("consentimento_lgpd", valor);
    } catch (erro) {
        // se o navegador bloquear, o banner só some nesta visita
    }
    document.getElementById("bannerLgpd").style.display = "none";
    if (valor === "aceito") {
        carregarScriptsOpcionais();
    }
}

function carregarScriptsOpcionais() {
    // Aqui entraria o código do Google Analytics, Pixel etc.
    // Ele só roda DEPOIS do "Aceitar".

    mostrarModalPromocao();   // ← NOVA LINHA: o cupom só aparece aqui
}

/* ========== PARTIDA (único DOMContentLoaded) ========== */

document.addEventListener("DOMContentLoaded", function () {
    const banner = document.getElementById("bannerLgpd");
    if (!banner) return;

    const escolha = obterConsentimento();
    if (escolha === null) {
        banner.style.display = "flex";
    } else if (escolha === "aceito") {
        carregarScriptsOpcionais();
    }
});


/*localStorage.clear();
location.reload();*/
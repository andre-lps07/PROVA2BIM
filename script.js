document.addEventListener("DOMContentLoaded", () => {
    const cepInput = document.getElementById("cep");
    const nameInput = document.getElementById("name");
    const logradouro = document.getElementById("logradouro");
    const bairro = document.getElementById("bairro");
    const localidade = document.getElementById("localidade");
    const uf = document.getElementById("uf");
    const enviarBtn = document.querySelector("button");

    let errorDiv = document.querySelector(".error");
    if (!errorDiv) {
        errorDiv = document.createElement("div");
        errorDiv.className = "error";
        document.getElementById("principal").appendChild(errorDiv);
    }

    function limpaCampos() {
        logradouro.value = "";
        bairro.value = "";
        localidade.value = "";
        uf.value = "";
    }

    function buscarCEP() {
        const cep = cepInput.value.trim();
        errorDiv.style.display = "none";

        if (cep.length !== 8 || isNaN(cep)) {
            limpaCampos();
            errorDiv.innerText = "CEP inválido. Digite 8 números.";
            errorDiv.style.display = "block";
            return;
        }

        fetch(`https://viacep.com.br/ws/${cep}/json/`)
            .then(response => {
                if (!response.ok) throw new Error("Erro na requisição.");
                return response.json();
            })
            .then(data => {
                if (data.erro) {
                    limpaCampos();
                    errorDiv.innerText = "CEP não encontrado.";
                    errorDiv.style.display = "block";
                } else {
                    logradouro.value = data.logradouro || "";
                    bairro.value = data.bairro || "";
                    localidade.value = data.localidade || "";
                    uf.value = data.uf || "";
                }
            })
            .catch(() => {
                limpaCampos();
                errorDiv.innerText = "Erro ao buscar o CEP.";
                errorDiv.style.display = "block";
            });
    }

    cepInput.addEventListener("blur", buscarCEP);

    cepInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            buscarCEP();
        }
    });

    enviarBtn.addEventListener("click", () => {
        errorDiv.style.display = "none";

        // Valida se o nome e o CEP estão preenchidos
        if (!nameInput.value.trim()) {
            errorDiv.innerText = "Por favor, informe o nome.";
            errorDiv.style.display = "block";
            return;
        }
        if (!cepInput.value.trim()) {
            errorDiv.innerText = "Por favor, informe o CEP.";
            errorDiv.style.display = "block";
            return;
        }
        if (!logradouro.value || !bairro.value || !localidade.value || !uf.value) {
            errorDiv.innerText = "Endereço incompleto. Verifique o CEP.";
            errorDiv.style.display = "block";
            return;
        }

        const dadosParaSalvar = {
            nome: nameInput.value.trim(),
            cep: cepInput.value.trim(),
            logradouro: logradouro.value,
            bairro: bairro.value,
            cidade: localidade.value,
            uf: uf.value
        };

        // Salva no localStorage (stringify para converter objeto em string)
        localStorage.setItem("dadosEndereco", JSON.stringify(dadosParaSalvar));

        alert("Dados salvos com sucesso!");
    });
});
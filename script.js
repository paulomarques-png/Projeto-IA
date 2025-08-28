document.addEventListener('DOMContentLoaded', () => {
    // Seleciona elementos do formulário
    const formulario = document.querySelector('form');
    const entradaChaveApi = document.getElementById('api-key');
    const entradaPergunta = document.getElementById('pergunta');
    const selecaoModelo = document.getElementById('model');
    const botaoEnviar = document.querySelector('.btn-pgt');
    const areaResposta = document.getElementById('resposta-ia');

    //Cria botão copiar, mas deixa oculto
    const botaoCopiar = document.createElement('button');
    botaoCopiar.textContent = 'Copiar resposta';
    botaoCopiar.type = 'button';
    botaoCopiar.className = 'btn-copiar';
    botaoCopiar.style.display = 'none';
//    formulario.appendChild(botaoCopiar);
    areaResposta.insertAdjacentElement('afterend', botaoCopiar);

    // Oculta a área de resposta inicialmente
    areaResposta.style.display = 'none';

    formulario.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        // Limpa resposta anterior e erros
        areaResposta.value = '';
        areaResposta.style.display = 'none';
        botaoCopiar.style.display = 'none';
        limparErros();

        // Valida entradas
        const chaveApi = entradaChaveApi.value.trim();
        const pergunta = entradaPergunta.value.trim();

        if (!chaveApi) {
            exibirErro('Por favor, insira uma chave API válida.');
            return;
        }

        if (!pergunta) {
            exibirErro('Por favor, insira uma pergunta.');
            return;
        }

        // Exibe estado de carregamento
        exibirCarregamento(true);

        try {
            // Faz requisição à API
            const resposta = await fetch('https://api.openai.com/v1/chat/completions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${chaveApi}`
                },
                body: JSON.stringify({
                    model: selecaoModelo.value,
                    messages: [{ role: 'user', content: pergunta }],
                    max_tokens: 500
                })
            });

            // Verifica se a resposta é válida
            if (!resposta.ok) {
                const dadosErro = await resposta.json();
                throw new Error(dadosErro.error?.message || 'Erro ao conectar com a API');
            }

            const dados = await resposta.json();
            const respostaIa = dados.choices[0].message.content;

            // Exibe resposta
            areaResposta.innerHTML = marked.parse(respostaIa);
            areaResposta.style.display = 'block';
            botaoCopiar.style.display = 'inline-block'; // mostra botão copiar

        } catch (erro) {
            exibirErro(erro.message || 'Ocorreu um erro ao processar sua solicitação.');
        } finally {
            exibirCarregamento(false);
        }
    });

    // Manipula redefinição do formulário
    formulario.addEventListener('reset', () => {
        areaResposta.value = '';
        areaResposta.style.display = 'none';
        botaoCopiar.style.display = 'none';
        limparErros();
    });

    //Botão copiar
    botaoCopiar.addEventListener('click', () => {
        navigator.clipboard.writeText(areaResposta.textContent)
            .then(() => {
                botaoCopiar.textContent = 'Copiado!';
                setTimeout(() => botaoCopiar.textContent = 'Copiar resposta', 1500);
            })
            .catch(() => {
                exibirErro('Não foi possível copiar o texto.');
            });
    });



    // Funções auxiliares
    function exibirCarregamento(estaCarregando) {
        botaoEnviar.disabled = estaCarregando;
        botaoEnviar.textContent = estaCarregando ? 'Carregando...' : 'Perguntar';
        botaoEnviar.style.opacity = estaCarregando ? '0.6' : '1';
    }

    function exibirErro(mensagem) {
        const divErro = document.createElement('div');
        divErro.className = 'mensagem-erro';
        divErro.style.color = 'red';
        divErro.style.marginTop = '10px';
        divErro.textContent = mensagem;
        formulario.appendChild(divErro);
    }

    function limparErros() {
        const mensagensErro = document.querySelectorAll('.mensagem-erro');
        mensagensErro.forEach(erro => erro.remove());
    }
});










// Define sua chave de API da Google Gemini 
const chaveDaAPI = 'Digite aqui sua chave';

// Define a pergunta que será enviada à IA
const perguntaDoUsuario = 'Quantos dedos tem um onitorrinco?';

// URL da API Gemini (modelo flash 2.0)
const urlDaAPI = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent';

// Cabeçalhos HTTP necessários pra requisição funcionar
const headers  = {
  'Content-Type': 'application/json', // Diz que estamos enviando um JSON
  'X-goog-api-key': chaveDaAPI        // Autenticação da requisição usando sua chave
};

// Corpo da requisição, com a pergunta formatada como a API exige
const body = {
  contents: [
    {
      parts: [
        {
          text: perguntaDoUsuario // Texto da pergunta enviada
        }
      ]
    }
  ]
};

// Faz a chamada para a API com método POST usando fetch
fetch(urlDaAPI, {
  method: 'POST', // Tipo de requisição HTTP
  headers: headers , // Envia os cabeçalhos definidos
  body: JSON.stringify(body) // Converte o corpo em string JSON
})
  .then(resposta => resposta.json()) // Converte a resposta da API em objeto JS
  .then(dadosRecebidos => {
    // Acessa o texto da resposta da IA dentro da estrutura recebida
    const respostaIA = dadosRecebidos?.candidates?.[0]?.content?.parts?.[0]?.text;

    // Mostra o resultado no terminal
    console.log('Resposta da IA:', respostaIA);
  })
  .catch(erro => {
    // Se algo der errado, exibe o erro
    console.error('Erro ao chamar a API:', erro);
  });

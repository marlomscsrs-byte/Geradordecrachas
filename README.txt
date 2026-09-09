GERADOR DE CRACHÁS — V14
=========================

Esta versão mantém o layout da V13 e adiciona remoção automática de fundo.

COMO FUNCIONA
-------------
1. O usuário envia JPG, PNG ou WEBP.
2. A foto aparece normalmente no crachá.
3. O botão "✨ REMOVER FUNDO" envia a imagem para o servidor.
4. O servidor chama a API do remove.bg sem expor a API Key no navegador.
5. O PNG transparente retornado substitui automaticamente a foto original.
6. A foto continua podendo ser arrastada e ajustada com +/−.

CONFIGURAÇÃO
------------
Pré-requisito: Node.js 18 ou superior.

1. Copie .env.example para .env
2. Abra .env e informe sua chave:
   REMOVE_BG_API_KEY=SUA_CHAVE_AQUI
3. Abra um terminal nesta pasta e rode:
   npm install
   npm start
4. Acesse:
   http://localhost:3000

IMPORTANTE
----------
- NÃO coloque a chave do remove.bg dentro do HTML/JavaScript.
- NÃO publique o arquivo .env.
- O limite deste servidor é 15 MB por imagem.
- Se a remoção de fundo falhar, a foto original continua disponível.

API
---
Endpoint local: POST /api/remove-bg
Campo multipart: image

SERVIÇO USADO
-------------
remove.bg API: https://www.remove.bg/api
A documentação oficial informa suporte a upload direto e uso do endpoint
https://api.remove.bg/v1.0/removebg com o cabeçalho X-Api-Key.

OBSERVAÇÃO DE LONGO PRAZO
-------------------------
A documentação atual do remove.bg informa uma migração da remoção de fundo
para Leonardo.Ai a partir de 1º de dezembro de 2026. A estrutura desta V14
isola a integração no server.js para facilitar uma eventual troca de provedor.

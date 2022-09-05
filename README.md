# Valex

## Uma API feita com TypeScript para cartões de benefícios

### Features

- Cartões
  - [x] Criação de cartões
  - [x] Ativação de cartões
  - [x] Visualização de saldo e transações
  - [x] Bloqueio de cartões
  - [x] Desbloqueio de cartões
- Recargas
  - [x] Recarga de cartões
- Pagamentos
  - [x] Compras em pontos de vendas

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina as seguintes ferramentas:
[Git](https://git-scm.com), [Node.js](https://nodejs.org/en/) e [PostgreSQL](https://www.postgresql.org/download/).
Além disto é bom ter um editor para trabalhar com o código como [VSCode](https://code.visualstudio.com/)

### 🎲 Rodando a Aplicação

```bash
# Clone este repositório
$ git clone <https://github.com/thalesAlves758/valex>

# Acesse a pasta do projeto no terminal/cmd
$ cd valex

# Instale as dependências
$ npm install

# Copie o arquivo .env.example
$ cp .env.example .env

# Insira as credenciais no arquivo .env
PORT=<PORTA_DA_APLICACAO>
DATABASE_URL=<STRING_DE_CONEXAO_COM_POSTGRES>
CRYPTR_SECRET=<SEGREDO_PARA_CRYPTR>

# Execute a aplicação
$ npm start

# * Também é possível executar a aplicação em modo de desenvolvimento
$ npm run dev

# O servidor inciará na porta definida - acesse <http://localhost:<PORTA>>
```

### 🛣️ Rotas

- POST /cards<br>
  Nessa rota, empresas com uma chave de API válida podem criar cartões para os seus empregados. Para um cartão ser criado precisamos do identificador do empregado e do tipo do cartão.

  - Exemplo de body:

    ```json
    {
      "employeeId": 1,
      "cardType": "restaurant"
    }
    ```

  - Headers?<br>
    Deverá ser enviado no header uma chave `x-api-key` com a chave da empresa como valor.
    <br>

- POST /cards/:cardId/active<br>
  Nessa rota, os empregados podem ativar seus cartões, isso significa, gerar uma senha para o cartão. Para um cartão ser ativado precisamos do identificador, do CVC do mesmo e da senha que será cadastrada.

  - Exemplo de body:

    ```json
    {
      "securityCode": "999",
      "password": "1234"
    }
    ```

  - Headers?<br>
    Não é necessário
    <br>

- GET /cards/:cardId/balance<br>
  Nessa rota, empregados podem visualizar o saldo de um cartão e as transações do mesmo. Para isso, precisamos do identificador do cartão.

  - Exemplo retorno:

    ```json
    {
      "balance": 35000,
      "transactions": [
        {
          "id": 1,
          "cardId": 1,
          "businessId": 1,
          "businessName": "Negócio",
          "timestamp": "22/01/2022",
          "amount": 5000
        }
      ],
      "recharges": [
        { "id": 1, "cardId": 1, "timestamp": "21/01/2022", "amount": 40000 }
      ]
    }
    ```

  - Headers?<br>
    Não é necessário
    <br>

- POST /cards/:cardId/block<br>
  Nessa rota, empregados podem bloquear cartões. Para um cartão ser bloqueado precisamos do identificador e da senha do mesmo.

  - Exemplo de body:

    ```json
    {
      "password": "1234"
    }
    ```

  - Headers?<br>
    Não é necessário
    <br>

- POST /cards/:cardId/unblock<br>
  Nessa rota, empregados podem desbloquear cartões. Para um cartão ser desbloqueado precisamos do identificador e da senha do mesmo.

  - Exemplo de body:

    ```json
    {
      "password": "1234"
    }
    ```

  - Headers?<br>
    Não é necessário
    <br>

- POST /cards/:cardId/recharge<br>
  Nessa rota, empresas com uma chave de API válida podem recarregar cartões de seus empregados. Para um cartão ser recarregado precisamos do identificador do mesmo e do montade da recarga.

  - Exemplo de body:

    ```json
    {
      "amount": 200000
    }
    ```

  - Headers?<br>
    Deverá ser enviado no header uma chave `x-api-key` com a chave da empresa como valor.
    <br>

- POST /cards/:cardId/payment<br>
  Nessa rota, empregados podem comprar em Points of Sale (maquininhas). Para uma compra em um POS ser efetuada precisamos do identificador do cartão utilizado e da senha do mesmo, do identificador do estabelecimento e do montante da compra.

  - Exemplo de body:

    ```json
    {
      "password": "1234",
      "businessId": 1,
      "amount": 10000
    }
    ```

  - Headers?<br>
    Não é necessário
    <br>

### 🛠 Principais tecnologias utilizadas

As seguintes ferramentas foram usadas na construção do projeto:

- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)
- [PostgreSQL](https://www.postgresql.org/download/)

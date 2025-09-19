# Gerenciador de Contratos (DApp Cartesi)

Este projeto é um DApp (Aplicação Descentralizada) que permite aos usuários gerenciar aluguéis de imóveis em uma blockchain da Cartesi. O backend é escrito em Python e o frontend em React com TypeScript, utilizando o Wagmi e o RainbowKit para interações com a carteira e contratos inteligentes.

## Funcionalidades
* **Criar anúncios de aluguel:** Vendedores podem criar novos anúncios de imóveis com descrição, preço e comentários.
* **Alugar imóveis:** Clientes podem alugar imóveis disponíveis.
* **Visualizar imóveis:** Os usuários podem ver a lista de imóveis disponíveis (Visão do Cliente) e os imóveis que eles mesmos anunciaram (Visão do Vendedor).

## Estrutura do Projeto
O projeto é dividido em duas partes principais:
* `dapp/`: Contém o código do backend em Python, incluindo o `dapp.py` que define a lógica da aplicação.
* `meu-dapp-frontend/`: Contém o frontend da aplicação construído com React e TypeScript.

## Pré-requisitos
Para executar este projeto, você precisará ter o seguinte software instalado em sua máquina:
* **Docker Desktop**: Necessário para rodar o ambiente do Cartesi Rollups.
* **Node.js e npm**: Para instalar as dependências e rodar o frontend.
* **Cartesi CLI**: A ferramenta de linha de comando oficial da Cartesi, que facilita a construção e execução do DApp. Você pode instalá-la globalmente com `npm install -g @cartesi/cli`.

## Instalação e Execução

Siga os passos abaixo para colocar o DApp em funcionamento.

### 1. Configurar o Backend

O backend do DApp já está configurado no diretório `dapp/`. O `Dockerfile` e o `requirements.txt` definem o ambiente necessário. Para prepará-lo, use o Cartesi CLI.

Abra o terminal no diretório raiz do projeto e execute o comando:
```bash
cartesi build
```
Após o termino da execução
```bash
cartesi run
```

### 2. Configurar o FrontEnd

O FrontEnd se encontra na pasta `contract-manager/meu-dapp-frontend`.

#### 2.1 Instalação de dependêcias
Na pasta meu-dapp-frontend excute as seguintes linhas
```bash
npm install
```
```bash
npm run dev
```
Isso vai instalar as dependêcias e iniciar o app

## Contato

Se tiver dúvidas ou sugestões, entre em contato:

- **Desenvolvedor:** Carlos Mikael Cardoso
- **Email:** mikael.cardoso.costa13@gmail.com

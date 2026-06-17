# MarceloBank - Frontend

O MarceloBank é uma aplicação de simulação do sistema bancário que permite aos clientes gerenciar suas contas, realizar transações de saque, depósito e transferência, solicitar empréstimos e emitir cartões. Este projeto foi desenvolvido como parte dos requisitos da disciplina de Banco de Dados. Este repositório contém o código-fonte da interface do usuário (Frontend).

## Visão Geral do Projeto

A interface foi desenvolvida para oferecer uma experiência de usuário fluida, responsiva e intuitiva, simulando um internet banking moderno. O painel principal (Dashboard) consolida informações de extrato, limites de cartão e andamento de empréstimos em tempo real, refletindo diretamente as operações consolidadas no banco de dados.

## Stack Tecnológica

- Framework Principal: React (com TypeScript)
- Ferramenta de Build: Vite
- Estilização: Tailwind CSS
- Cliente HTTP: Axios (Configuração de interceptors e serviços de API)

## Estrutura do Projeto

O projeto segue uma divisão modular focada na separação de responsabilidades:

- /api: Configurações de URL base e interceptors do cliente HTTP.
- /components: Componentes reutilizáveis de interface (Header, Sidebar, Formulários).
- /pages: Telas principais da aplicação (Home, Cliente, Conta).
- /services: Camada de integração com a API REST (auth, conta, cliente, transacao).
- /types: Definições de interfaces TypeScript para tipagem estática e garantia de contratos.
- /utils: Formatadores numéricos e funções de validação de regras de negócio no lado cliente.

## Integração com o Backend

Este frontend atua como a camada de apresentação e depende exclusivamente do servidor principal para o processamento das transações e validação de segurança.

- Repositório do Backend: [MarceloBank - Backend](https://github.com/TacioMoreira25/marcelobank)
- Comunicação: O frontend consome uma API RESTful robusta desenvolvida em Java com Spring Boot, responsável por gerenciar a persistência no banco de dados relacional da disciplina, aplicar regras de negócio de saldo e garantir o controle de acesso seguro via tokens JWT.

## Como Executar a Aplicação

1. Clone este repositório:
   git clone https://github.com/TacioMoreira25/marcelobank-frontend.git

2. Acesse o diretório do projeto e instale as dependências:
   npm install

3. Inicie o servidor de desenvolvimento local:
   npm run dev

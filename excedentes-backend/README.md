# Excedentes-backend

Repositório Backend para o projeto Excedentes.

O frontend desse projeto é composto por Nest.js, Typescript, npm, and TypeOrm. Contém duas branches: main e dev.

## Processo de instalação e execução

Após instalar Nodejs, basta seguir os passos abaixo para baixar e executar o projeto.

1. Em uma pasta de sua preferência, abre o terminal e clone o projeto utilizando o comando: `git clone https://tools.ages.pucrs.br/excedentes/excedentes-backend.git`. Caso requisitado, inclua seu _username_ e senha do gitlab.

**IMPORTANTE**

Antes de executar, sempre verifique se está dentro da pasta correta no terminal. Para entrar use o comando: `cd excedentes-backend`.

2. Quando o processo de clonagem terminar, basta abrir a pasta do projeto na sua IDE: `excedentes-backend`.

3. E Após isso, abrir o teminal e instalar os módulos npm: `npm install`.

4. Para executar o projeto, escreva o comando `npm run start:dev` no terminal.
Opcional: para criar os dados mockados, após rodar o start:dev, rode o comando `npm run migration:run`

5. O projeto estará rodando e poderá ser acessado no seu navegador através do endereço http://localhost:5050/ .

6. Para acessar a documentação do swagger, acesse: http://localhost:5050/api/documentation .

## Processo de commit, pull request e merge

É importante atentarmos aos padrões estabelecidos no projeto.

1. Sua branch deve ser feita a partir da **main**.

2. Este repositório segue padrões de nomenclatura de branches para manter a organização e a consistência no versionamento do código. Abaixo estão os padrões recomendados para diferentes tipos de branches:

#### Branches de Funcionalidades (Feature)

- `nome-da-squad/feature/<nome-da-feature>`: Utilizado para desenvolver uma nova funcionalidade.
  - Exemplo: `atena/feature/user-authentication`.

#### Branches de Correção de Bugs (Bugfix)

- `nome-da-squad/bugfix/<descricao-do-bug>`: Utilizado para corrigir bugs.
  - Exemplo: `atena/bugfix/login-validation-issue`.

#### Branches de Correções Urgentes em Produção (Hotfix)

- `nome-da-squad/hotfix/<descricao-do-problema>`: Utilizado para correções rápidas em produção.
  - Exemplo: `atena/hotfix/production-crash-fix`.

#### Branches de Preparação para Implantação (Release)

- `nome-da-squad/release/<versao>`: Utilizado para preparar uma nova versão para implantação.
  - Exemplo: `atena/release/v1.0`.

#### Branches de Refatoração (Refactor)

- `nome-da-squad/refactor/<descricao-da-refatoracao>`: Utilizado para melhorar o código sem alterar seu comportamento.
  - Exemplo: `atena/refactor/update-variable-names`.

#### Branches de Testes (Test)

- `nome-da-squad/test/<descricao-do-teste>`: Utilizado para desenvolver testes.
  - Exemplo: `atena/test/login-validation-tests`.

#### Branches de Documentação (Docs)

- `nome-da-squad/docs/<descricao-da-documentacao>`: Utilizado para atualizar ou adicionar documentação.
  - Exemplo: `atena/docs/update-readme`.

3. Os commits seguirão um exemplo parecido de padrão:
- `[nome-da-squad]tipo-do-commit: descrição do commit`
  - Exemplo: `[atena]chore: adds logic to create jwt token.`

4. Quando for fazer um pull request, aponte o pull request para a branch **dev**, essa branch será o meio termo entre as novas adições ao código e a aplicação que já estará disponível para o cliente.

5. Um pull request só pode ser mergeado após aprovação de um **AGES III**.

6. Devemos sempre nos atentar se os jobs foram rodados com sucesso, se as discussões foram finalizadas e se o código foi devidamente testado para garantir que não adicionaremos nenhum bug ao ambiente de produção.
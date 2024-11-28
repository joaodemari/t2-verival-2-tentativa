# EXCEDENTES-WEB

Este projeto é uma aplicação web construída com React, TypeScript e Vite. A arquitetura do projeto foi organizada para promover clareza e manutenibilidade.

## O que é o Vite?

[Vite](https://vitejs.dev/) é uma ferramenta de construção front-end moderna que melhora significativamente a experiência de desenvolvimento. Ele serve código via módulos ES nativos, permitindo um início rápido do servidor e substituição de módulos a quente (HMR). Durante o desenvolvimento, o Vite compila apenas o módulo atual quando um arquivo é editado, em vez de empacotar todos os módulos antecipadamente. Isso leva a um ciclo de atualização muito mais rápido. Para produção, o Vite utiliza o Rollup para empacotar o código, fornecendo otimizações avançadas como divisão de código e carregamento lento para garantir que seu aplicativo seja eficiente e rápido.

## Estrutura de Pastas

- `public/`: Contém os arquivos estáticos servidos pelo Vite, como `index.html`.
- `src/`: O diretório principal onde o código fonte do projeto está localizado.
  - `app/`: Contém os componentes principais do React, como App e o roteador principal.
  - `assets/`: Diretório para arquivos estáticos, como imagens e estilos globais.
  - `components/`: Componentes React reutilizáveis utilizados em todo o projeto.
  - `config/`: Configurações globais do projeto, como as do Axios.
  - `core/`: Contém tipos essenciais, APIs, modelos e serviços centrais.
  - `helpers/`: Funções auxiliares para formatação de dados, validações, etc.
  - `modules/`: Features modulares da aplicação, cada uma com seu próprio contexto, páginas, estilos e tipos.
- `.env.*`: Arquivos de variáveis de ambiente para diferentes ambientes (desenvolvimento, produção).

## Executando o Projeto

Para executar o projeto, siga os seguintes passos:

1. Instale as dependências com `npm install`.
2. Execute o projeto em modo de desenvolvimento com `npm run dev`.
3. Para a produção, primeiro faça a build com `npm run build`, e depois sirva com `npm run serve`.

Por padrão, a aplicação será servida na porta `3000`. Acesse `http://localhost:3000` no seu navegador.

Se precisar rodar o projeto em uma porta diferente, você pode configurar isso no arquivo `vite.config.ts` ou definir a variável de ambiente `VITE_PORT` no seu arquivo `.env`.

Lembre-se de configurar as variáveis de ambiente apropriadas nos arquivos `.env.development` ou `.env.production` antes de executar ou fazer a build do projeto.

## Criando Testes com Jest

Jest é configurado neste projeto para facilitar a escrita e execução de testes. Aqui estão as diretrizes básicas:

### Escrevendo Testes

1. Os testes são colocados em arquivos `.test.tsx` ou `.spec.tsx` no diretório relevante.
2. Um exemplo de teste para uma função `sum` poderia ser:

```typescript
import { sum } from './math';

test('sums two values', () => {
  expect(sum(1, 2)).toBe(3);
});
```

## Rodando os Testes Criados

Depois de escrever os testes, executá-los regularmente é crucial para garantir a qualidade do código ao longo do desenvolvimento do projeto. Aqui está como você pode fazer isso:

### Comandos para Executar Testes

Para executar todos os testes do projeto, você pode usar o seguinte comando na raiz do seu projeto:

```bash
npm test
```

Se você deseja que o Jest observe mudanças nos arquivos de teste e os execute automaticamente, você pode iniciar o Jest em modo de observação com o seguinte comando:

```bash
npm test --watch
```

Para gerar um relatório de cobertura de testes, mostrando quais linhas de código foram executadas durante os testes, você pode usar o comando:

```bash
npm test -- --coverage
```

## Contribuindo

Para contribuir com o projeto:

1. Crie uma nova branch seguindo o padrão: `squadname/feature/descricaoatividade`.
2. Faça suas alterações e implemente sua feature.
3. Envie um pull request para a branch `dev` com suas alterações.

Por favor, siga as boas práticas de codificação e mantenha a qualidade e consistência do código.

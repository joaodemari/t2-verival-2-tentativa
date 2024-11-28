/// <reference types="cypress" />

import { generateCNPJ, isValidCNPJ } from "@brazilian-utils/brazilian-utils";
import * as cnpj from "@fnando/cnpj"; // import the whole library

function executarLogin(email, senha) {
  cy.get('[placeholder="E-mail"]').type(email);
  cy.get('[placeholder="Senha"]').type(senha);
  cy.get(
    '[style="display: flex; justify-content: center; margin-top: 6rem;"] > .chakra-button'
  ).click();
}

describe("Testes de sistema para ajudar no teste de listar produtos por localização", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    cy.intercept("POST", "/contractor-companies").as("createCompany");
    cy.intercept("/login/me").as("login");
    cy.intercept("GET", "/products/mine").as("getMineProducts");
    cy.intercept("GET", "/products/location*").as("getProductsByLocation");
  });

  it("Como uma pessoa consumidora, EU QUERO me cadastrar na plataforma, PARA acessar os produtos disponíveis.", () => {
    // Criar conta de cliente
    cy.get(
      '[style="display: flex; justify-content: center; margin-top: 0.5rem;"] > .chakra-button'
    ).click();
    cy.get(":nth-child(1) > .chakra-radio__control").click();
    cy.get(".chakra-modal__footer > .css-3p09dj").click();
    cy.get('[placeholder="Nome"]').type("Ruan Cliente");
    cy.get('[placeholder="E-mail"]').type("ruan@cliente.com");
    cy.get('[placeholder="CPF"]').type("04965987080");
    cy.get('[placeholder="Senha"]').type("123456");
    cy.get('[placeholder="Confirme a senha"]').type("123456");
    cy.get(".chakra-checkbox__control").click();
    cy.get(".chakra-button").click();
  });

  it("Criar empresa contratante", () => {
    cy.get(
      '[style="display: flex; justify-content: center; margin-top: 0.5rem;"] > .chakra-button'
    ).click();

    cy.get(":nth-child(3) > .chakra-radio__control").click();

    cy.get(".chakra-modal__footer > .css-3p09dj").click();

    cy.get('[placeholder="Nome"]').type("João Demari");

    cy.get('[placeholder="E-mail"]').type("joaozinhogamer@gmail.com");

    cy.get('[placeholder="Senha"]').type("123456");

    cy.get('[placeholder="Confirmar Senha"]').type("123456");

    cy.get(".w-full > div > .chakra-input").type(
      "Av. Ipiranga, 7120 - Praia de Belas, Porto Alegre - RS, Brasil"
    );

    cy.get(":nth-child(5) > .pac-item").click();

    // cnpj puc 33.555.921/0001-70
    cy.get('[placeholder="CNPJ"]').type("3355592170");

    cy.get(".chakra-textarea").type("13h - 18h");

    cy.get(".chakra-checkbox__control").click();

    cy.get(".chakra-button").click();
  });

  it("Criar novo produto", () => {
    const companyEmail = "joaozinhogamer@gmail.com";
    const companyPassword = "123456";

    executarLogin(companyEmail, companyPassword);
    cy.get(".flex > .chakra-button").click();

    cy.get('[placeholder="Digite uma breve descrição do produto"]').type(
      "Banana que está para vencer"
    );
    cy.get(".css-14tgeuo > .css-tl3ftk > .chakra-input").type("10");
    cy.get(".css-rru7f3 > :nth-child(1) > .chakra-input").type("Banana");
    cy.get(".css-rru7f3 > :nth-child(2) > .chakra-input").type("2025-12-21");
    cy.get(".chakra-input__group > .chakra-stack > .chakra-input").type("50");
    cy.get('[placeholder="Marca"]').type("Prata");
    cy.get(".chakra-select").select("Hortifruti");
    cy.get('[placeholder="Código de barras"]').type("123456789");
    cy.get(".css-3p09dj").click();
  });

  it("Deve exibir a lista de produtos disponíveis, de acordo com a localização", () => {
    const clientEmail = "ruan@cliente.com";
    const clientPassword = "123456";

    executarLogin(clientEmail, clientPassword);

    cy.wait("@getProductsByLocation");

    cy.get(":nth-child(1) > .pl-2 > .css-1fimlhp").should(
      "contain.text",
      "Banana"
    );

    // cy.wait("@getMineProducts");
    // cy.get(".css-h4ggqi > .chakra-text").click();
  });
});

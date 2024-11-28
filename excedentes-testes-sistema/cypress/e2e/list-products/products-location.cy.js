/// <reference types="cypress" />

function executarLogin(email, senha) {
  cy.get('[placeholder="E-mail"]').type(email);
  cy.get('[placeholder="Senha"]').type(senha);
  cy.get(
    '[style="display: flex; justify-content: center; margin-top: 6rem;"] > .chakra-button'
  ).click();
}

describe("Como uma pessoa consumidora, EU QUERO ver uma lista de produtos disponíveis, PARA escolher os itens que desejo adquirir", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");

    cy.intercept("POST", "/contractor-companies").as("createCompany");
    cy.intercept("/login/me").as("login");
    cy.intercept("GET", "/products/mine").as("getMineProducts");
    cy.intercept("GET", "/products/location*").as("getProductsByLocation");
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
  });
});

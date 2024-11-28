/// <reference types="cypress" />

import { generateCNPJ, isValidCNPJ } from "@brazilian-utils/brazilian-utils";
import * as cnpj from "@fnando/cnpj"; // import the whole library

describe("Como uma pessoa consumidora, EU QUERO ver uma lista de produtos disponíveis, PARA escolher os itens que desejo adquirir", () => {
  beforeEach(() => {
    cy.visit("http://localhost:3000/");
  });

  it("Deve exibir a lista de produtos disponíveis, de acordo com a localização", () => {
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
    cy.get('[placeholder="CNPJ"]').type('3355592170');

    cy.get(".chakra-textarea").type("13h - 18h");

    cy.get(".chakra-checkbox__control").click();

    cy.get(".chakra-button").click();
  });
});

function validate(cnpj) {
  if (typeof cnpj !== "string") return false;

  cnpj = cnpj.replace(/[^\d]+/g, "");

  if (cnpj === "") return false;
  if (cnpj.length !== 14) return false;

  if (
    cnpj === "00000000000000" ||
    cnpj === "11111111111111" ||
    cnpj === "22222222222222" ||
    cnpj === "33333333333333" ||
    cnpj === "44444444444444" ||
    cnpj === "55555555555555" ||
    cnpj === "66666666666666" ||
    cnpj === "77777777777777" ||
    cnpj === "88888888888888" ||
    cnpj === "99999999999999"
  )
    return false;

  let tamanho = cnpj.length - 2;
  let numeros = cnpj.substring(0, tamanho);
  const digitos = cnpj.substring(tamanho);
  let soma = 0;
  let pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  let resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(0)) return false;

  tamanho = tamanho + 1;
  numeros = cnpj.substring(0, tamanho);
  soma = 0;
  pos = tamanho - 7;
  for (let i = tamanho; i >= 1; i--) {
    soma += numeros.charAt(tamanho - i) * pos--;
    if (pos < 2) pos = 9;
  }
  resultado = soma % 11 < 2 ? 0 : 11 - (soma % 11);
  if (resultado != digitos.charAt(1)) return false;

  return true;
}

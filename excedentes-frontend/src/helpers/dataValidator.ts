import { isValidCPF, isValidCNPJ, isValidEmail, isValidCEP } from '@brazilian-utils/brazilian-utils';

function isCpfValid(cpf: string): boolean {
  return isValidCPF(cpf);
}

function isCnpjValid(cpf: string): boolean {
  return isValidCNPJ(cpf);
}

function isEmailValid(cpf: string): boolean {
  return isValidEmail(cpf);
}

function isValidCep(cep: string): boolean {
  return isValidCEP(cep);
}

export function isValidName(name: string): boolean {
  const re = new RegExp('^[A-Za-zÀ-ÿ]{2,}(?:\\s[A-Za-zÀ-ÿ]{2,})+$')
  return re.test(name)
}

export function isValidPassword(password: string): boolean {
  const re = new RegExp('^(?=.*[A-Z])(?=.*[a-z])(?=.*[0-9])(?=.*[!@#$%^&*()_+\\-=[\\]{};:\'\"\\\\|,.<>/?]).{8,}$')
  return re.test(password);
}
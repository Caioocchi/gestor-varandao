export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  cpf = cpf.replace(/\D/g, '');

  // Verifica tamanho
  if (cpf.length !== 11) {
    return false;
  }

  // Verifica CPFs inválidos conhecidos
  if (/^(\d)\1+$/.test(cpf)) {
    return false;
  }

  let soma = 0;
  let resto;

  // Primeiro dígito
  for (let i = 1; i <= 9; i++) {
    soma += Number(cpf.substring(i - 1, i)) * (11 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== Number(cpf.substring(9, 10))) {
    return false;
  }

  soma = 0;

  // Segundo dígito
  for (let i = 1; i <= 10; i++) {
    soma += Number(cpf.substring(i - 1, i)) * (12 - i);
  }

  resto = (soma * 10) % 11;

  if (resto === 10 || resto === 11) {
    resto = 0;
  }

  if (resto !== Number(cpf.substring(10, 11))) {
    return false;
  }

  return true;
}

export function calcularIdade(dataNascimento: string): number {
  const partes = dataNascimento.split('-');

  const ano = Number(partes[0]);
  const mes = Number(partes[1]);
  const dia = Number(partes[2]);

  const nascimento = new Date(ano, mes - 1, dia);

  const hoje = new Date();

  let idade = hoje.getFullYear() - nascimento.getFullYear();

  const aindaNaoFezAniversario =
    hoje.getMonth() < nascimento.getMonth() ||
    (hoje.getMonth() === nascimento.getMonth() && hoje.getDate() < nascimento.getDate());

  if (aindaNaoFezAniversario) {
    idade--;
  }

  return idade;
}

<template>
  <div class="q-pa-md">
    <ButtonComponent label="Adicionar" icon="add" />
    <CardFreelaComponent
      :nome="freela.nome"
      :idade="freela.idade"
      :pix="freela.pix"
      :telefone="freela.telefone"
      :funcao="freela.funcao"
    />
  </div>
</template>

<script setup lang="ts">
import ButtonComponent from 'src/components/ButtonComponent.vue';
import CardFreelaComponent from 'src/components/CardFreelaComponent.vue';

const freela = {
  nome: 'Caio Occhi',
  idade: 28,
  pix: '27999157779',
  telefone: '(27)99915-7779',
  funcao: 'Garçom',
};
</script>

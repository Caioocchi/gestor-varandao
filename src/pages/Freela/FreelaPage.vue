<template>
  <div class="q-pa-md">
    <ButtonComponent label="Adicionar" icon="add" link="/freelas/adicionar" />
    <CardFreelaComponent
      v-for="freela in freelas"
      :key="freela._id"
      :id="freela._id"
      :nome="freela.nome"
      :idade="calcularIdade(freela.dt_nascimento)"
      :pix="freela.pix"
      :telefone="freela.telefone"
      :funcao="freela.funcao"
      :url-foto="freela.urlFoto"
      @deleted="loadFreelas"
    />
  </div>
</template>

<script setup lang="ts">
import { api } from 'src/boot/axios';
import ButtonComponent from 'src/components/ButtonComponent.vue';
import CardFreelaComponent from 'src/components/CardFreelaComponent.vue';
import { onMounted, ref } from 'vue';
import { calcularIdade } from 'src/utils/calcularIdade';

interface Freela {
  _id: string;
  nome: string;
  dt_nascimento: string;
  pix: string;
  telefone: string;
  cpf: string;
  funcao: string;
  urlFoto: string;
}

const freelas = ref<Freela[]>([]);

const loadFreelas = async () => {
  const { data } = await api.get('/freelas');
  freelas.value = data;
};

onMounted(loadFreelas);
</script>

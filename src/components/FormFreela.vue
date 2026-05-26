<template>
  <q-form ref="formRef" @submit.prevent="enviarFreela" class="q-gutter-md">
    <q-input
      filled
      v-model="nome"
      label="Nome completo *"
      color="white"
      lazy-rules
      bg-color="white"
      :rules="[(val) => (val && val.length > 0) || 'Digite o nome completo do Freela']"
    />

    <q-input
      filled
      type="date"
      v-model="dt_nascimento"
      label="Data de nascimento *"
      lazy-rules
      bg-color="white"
      :rules="[
        (val) => (val !== null && val !== '') || 'Digite a data de nascimento do Freela',
        (val) => calcularIdade(val) >= 18 || 'O Freela precisa ser maior que 18 anos',
      ]"
    />

    <q-input
      filled
      v-model="pix"
      label="Pix *"
      lazy-rules
      bg-color="white"
      :rules="[(val) => (val !== null && val !== '') || 'Digite o Pix do Freela']"
    />

    <q-input
      filled
      v-model="telefone"
      label="Telefone *"
      lazy-rules
      bg-color="white"
      mask="(xx) xxxxx-xxxx"
      :rules="[(val) => (val !== null && val !== '') || 'Digite o telefone do Freela']"
    />

    <q-input
      filled
      v-model="cpf"
      label="CPF *"
      lazy-rules
      bg-color="white"
      mask="xxx.xxx.xxx-xx"
      :rules="[
        (val) => (val !== null && val !== '') || 'Digite o CPF do Freela',
        (val) => validarCPF(val) || 'CPF inválido',
      ]"
    />

    <q-select
      filled
      v-model="funcao"
      :options="options"
      label="Função *"
      bg-color="white"
      :rules="[(val) => (val !== null && val !== '') || 'Escolha uma função']"
    />

    <q-file
      outlined
      v-model="urlFoto"
      accept="image/*"
      label="Selecione uma foto"
      bg-color="white"
    />

    <div>
      <q-btn
        class="shadow-10"
        color="blue-grey-10"
        type="submit"
        :label="label"
        style="width: 100%; height: 56px"
        no-caps
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { calcularIdade } from 'src/utils/calcularIdade';
import { validarCPF } from 'src/utils/validarCPF';
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';

interface Freela {
  nome: string;
  dt_nascimento: string;
  pix: string;
  telefone: string;
  cpf: string;
  funcao: string;
  urlFoto: File | null;
}

const props = defineProps({
  freela: {
    type: Object as PropType<Freela>,
    default: () => ({
      nome: '',
      dt_nascimento: '',
      pix: '',
      telefone: '',
      cpf: '',
      funcao: '',
      urlFoto: null,
    }),
  },
  submitLabel: {
    type: String,
    default: 'Adicionar',
  },
});

const emit = defineEmits<(e: 'freela', freela: Freela) => void>();

const nome = ref(props.freela.nome);
const dt_nascimento = ref(props.freela.dt_nascimento);
const pix = ref(props.freela.pix);
const telefone = ref(props.freela.telefone);
const cpf = ref(props.freela.cpf);
const funcao = ref(props.freela.funcao);
const urlFoto = ref<File | null>(props.freela.urlFoto ?? null);

const options = ['Chef', 'Sous Chef', 'Garçom', 'Meitre', 'Pia'];

watch(
  () => props.freela,
  (value) => {
    nome.value = value.nome;
    dt_nascimento.value = value.dt_nascimento;
    pix.value = value.pix;
    telefone.value = value.telefone;
    cpf.value = value.cpf;
    funcao.value = value.funcao;
    urlFoto.value = value.urlFoto ?? null;
  },
  { immediate: true, deep: true },
);

const label = computed(() => props.submitLabel);

function enviarFreela() {
  emit('freela', {
    nome: nome.value,
    dt_nascimento: dt_nascimento.value,
    pix: pix.value,
    telefone: telefone.value,
    cpf: cpf.value,
    funcao: funcao.value,
    urlFoto: urlFoto.value,
  });
}
</script>

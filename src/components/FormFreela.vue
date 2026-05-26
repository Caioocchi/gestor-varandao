<template>
  <q-form ref="formRef" @submit.prevent="enviarFreela" class="q-gutter-y-md">
    <q-card class="form-card shadow-light" bordered>
      <q-card-section class="q-gutter-y-md q-pa-lg">
        <q-input
          outlined
          v-model="nome"
          label="Nome completo"
          placeholder="Ex: João Silva"
          stack-label
          color="primary"
          bg-color="white"
          class="custom-input"
          lazy-rules
          :rules="[(val) => (val && val.length > 0) || 'Digite o nome completo do Freela']"
        >
          <template v-slot:prepend>
            <q-icon name="person" color="primary" />
          </template>
        </q-input>

        <q-input
          outlined
          type="date"
          v-model="dt_nascimento"
          label="Data de nascimento"
          stack-label
          color="primary"
          bg-color="white"
          class="custom-input"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Digite a data de nascimento do Freela',
            (val) => calcularIdade(val) >= 18 || 'O Freela precisa ser maior que 18 anos',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="event" color="primary" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="pix"
          label="Pix"
          placeholder="Chave Pix para pagamento"
          stack-label
          color="primary"
          bg-color="white"
          class="custom-input"
          lazy-rules
          :rules="[(val) => (val !== null && val !== '') || 'Digite o Pix do Freela']"
        >
          <template v-slot:prepend>
            <q-icon name="payments" color="primary" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="telefone"
          label="Telefone"
          placeholder="(00) 00000-0000"
          stack-label
          color="primary"
          bg-color="white"
          class="custom-input"
          mask="(##) #####-####"
          lazy-rules
          :rules="[(val) => (val !== null && val !== '') || 'Digite o telefone do Freela']"
        >
          <template v-slot:prepend>
            <q-icon name="phone" color="primary" />
          </template>
        </q-input>

        <q-input
          outlined
          v-model="cpf"
          label="CPF"
          placeholder="000.000.000-00"
          stack-label
          color="primary"
          bg-color="white"
          class="custom-input"
          mask="###.###.###-##"
          lazy-rules
          :rules="[
            (val) => (val !== null && val !== '') || 'Digite o CPF do Freela',
            (val) => validarCPF(val) || 'CPF inválido',
          ]"
        >
          <template v-slot:prepend>
            <q-icon name="badge" color="primary" />
          </template>
        </q-input>

        <q-select
          outlined
          v-model="funcao"
          :options="options"
          label="Função"
          stack-label
          color="primary"
          bg-color="white"
          class="custom-input"
          :rules="[(val) => (val !== null && val !== '') || 'Escolha uma função']"
        >
          <template v-slot:prepend>
            <q-icon name="work" color="primary" />
          </template>
        </q-select>

        <q-file
          outlined
          v-model="urlFoto"
          accept="image/*"
          label="Foto do perfil"
          stack-label
          color="primary"
          bg-color="white"
          class="custom-input"
        >
          <template v-slot:prepend>
            <q-icon name="image" color="primary" />
          </template>
        </q-file>
      </q-card-section>
    </q-card>

    <div class="q-pt-md">
      <q-btn
        class="custom-submit-btn shadow-robust"
        color="primary"
        unelevated
        type="submit"
        :label="label"
        no-caps
      />
    </div>
  </q-form>
</template>

<style lang="scss" scoped>
.form-card {
  border-radius: 16px;
  background-color: #faf9f6;
}

.custom-input {
  :deep(.q-field__control) {
    border-radius: 12px;
  }
}

.custom-submit-btn {
  width: 100%;
  height: 56px;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  letter-spacing: 0.5px;
}
</style>

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

<template>
  <q-form ref="formRef" @submit.prevent="enviarFreela" class="q-gutter-y-md">
    <q-card class="card-base shadow-soft" bordered>
      <q-card-section class="q-gutter-y-md q-pa-lg">
        <q-input
          outlined
          v-model="nome"
          label="Nome completo"
          stack-label
          color="primary"
          bg-color="white"
          class="input-rounded"
        >
          <template v-slot:prepend>
            <q-icon name="person_outline" color="primary" />
          </template>
        </q-input>

        <q-input
          outlined
          mask="##/##"
          v-model="dt_nascimento"
          label="Aniversário"
          stack-label
          color="primary"
          bg-color="white"
          class="input-rounded"
        >
          <template v-slot:prepend>
            <q-icon name="celebration" color="primary" />
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
          class="input-rounded"
        >
          <template v-slot:prepend>
            <q-icon name="account_balance_wallet" color="primary" />
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
          class="input-rounded"
          mask="(##) #####-####"
        >
          <template v-slot:prepend>
            <q-icon name="phone_iphone" color="primary" />
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
          class="input-rounded"
          mask="###.###.###-##"
        >
          <template v-slot:prepend>
            <q-icon name="assignment_ind" color="primary" />
          </template>
        </q-input>

        <q-file
          outlined
          v-model="urlFoto"
          accept="image/*"
          label="Foto do perfil"
          stack-label
          color="primary"
          bg-color="white"
          class="input-rounded"
        >
          <template v-slot:prepend>
            <q-icon name="add_a_photo" color="primary" />
          </template>
        </q-file>
      </q-card-section>
    </q-card>

    <div class="q-pt-md">
      <q-btn
        class="btn-primary shadow-elevated"
        color="primary"
        unelevated
        type="submit"
        :label="label"
        no-caps
      />
    </div>
  </q-form>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import type { PropType } from 'vue';

interface Freela {
  nome: string;
  dt_nascimento: string;
  pix: string;
  telefone: string;
  cpf: string;
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
const urlFoto = ref<File | null>(props.freela.urlFoto ?? null);

watch(
  () => props.freela,
  (value) => {
    nome.value = value.nome;
    dt_nascimento.value = value.dt_nascimento;
    pix.value = value.pix;
    telefone.value = value.telefone;
    cpf.value = value.cpf;
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
    urlFoto: urlFoto.value,
  });
}
</script>

<style lang="scss" scoped>
// Component uses global utility classes from app.scss
</style>

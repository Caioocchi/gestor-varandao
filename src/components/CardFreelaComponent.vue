<template>
  <div class="q-pt-md">
    <q-card class="bg-blue-grey-10 text-white shadow-10" style="width: 100%" bordered>
      <q-card-section horizontal>
        <q-img
          class="col-5 q-ma-md"
          src="/src/assets/caio_3x4.png"
          style="height: 100%; clip-path: circle()"
        />

        <q-card-section class="content-center">
          <div class="column">
            <p>Nome: {{ props.nome }}</p>
            <p>Idade: {{ props.idade }}</p>
            <q-btn
              flat
              no-caps
              @click="copyToClipboard(props.pix || '')"
              style="font-weight: 400; text-decoration: underline"
            >
              <p>Pix: {{ props.pix }}</p>
            </q-btn>
            <p>Telefone: {{ props.telefone }}</p>
            <p>Função: {{ props.funcao }}</p>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
export default {
  props: {
    nome: {
      type: String,
      required: true,
    },
    idade: {
      type: Number,
      required: true,
    },
    pix: {
      type: String,
    },
    telefone: {
      type: String,
      required: true,
    },
    funcao: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text.toString());
        alert('Copiado!');
      } catch (err) {
        console.error('Erro ao copiar: ', err);
      }
    };
    return {
      props,
      copyToClipboard,
    };
  },
};
</script>

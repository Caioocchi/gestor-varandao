<template>
  <div class="q-pt-md">
    <q-card class="bg-blue-grey-10 text-white shadow-10" style="width: 100%" bordered>
      <q-card-section horizontal class="justify-around">
        <q-img
          class="col-5 q-ma-md"
          :src="
            props.urlFoto === undefined
              ? '/src/assets/avatar.png'
              : `http://localhost:3000/freelas/${props.urlFoto}`
          "
          style="height: 100%; clip-path: circle(); max-height: 200px; max-width: 170px"
        />

        <q-card-section class="content-center">
          <div class="column items-start">
            <p>Nome: {{ props.nome }}</p>
            <p>Idade: {{ props.idade }}</p>
            <q-btn
              flat
              no-caps
              dense
              @click="copyToClipboard(props.pix || '')"
              style="font-weight: 400; text-decoration: underline; padding: 0"
            >
              <p>Pix: {{ props.pix }}</p>
            </q-btn>
            <p>Telefone: {{ props.telefone }}</p>
            <p class="text-no-wrap">Função: {{ props.funcao }}</p>
            <div class="row self-between q-gutter-sm no-wrap">
              <q-btn icon="delete" no-caps color="red" @click="confirm = true" />
              <q-btn :to="`/freelas/editar/${props.id}`" icon="edit" no-caps />
            </div>

            <q-dialog v-model="confirm">
              <q-card>
                <q-card-section class="row items-center">
                  <span class="q-ml-sm">Tem certeza de que deseja exluir este Freela?</span>
                </q-card-section>

                <q-card-actions align="right">
                  <q-btn flat label="Cancelar" color="primary" v-close-popup />
                  <q-btn
                    @click="deleteFreela(props.id)"
                    label="Excluir"
                    color="red"
                    v-close-popup
                  />
                </q-card-actions>
              </q-card>
            </q-dialog>
          </div>
        </q-card-section>
      </q-card-section>
    </q-card>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

export default {
  props: {
    id: {
      type: String,
      required: true,
    },
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
    urlFoto: {
      type: String,
      required: true,
    },
  },
  emits: ['deleted'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text.toString());
        $q.notify({
          color: 'green-4',
          textColor: 'white',
          message: 'Pix copiado!',
        });
      } catch (err) {
        console.error('Erro ao copiar: ', err);
      }
    };

    const deleteFreela = async (id: string) => {
      try {
        const deletado = await api.post(`/freelas/delete/${id}`);

        if (deletado.status === 200 || deletado.status === 201 || deletado.status === 204) {
          $q.notify({
            color: 'green-4',
            textColor: 'white',
            message: 'Freela excluído com sucesso.',
          });
          emit('deleted', id);
        }
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'red',
          textColor: 'white',
          message: 'Erro ao excluir freela.',
        });
      }
    };

    return {
      props,
      copyToClipboard,
      deleteFreela,
      confirm: ref(false),
    };
  },
};
</script>

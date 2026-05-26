<template>
  <div class="q-pt-md">
    <q-card class="freela-card shadow-light" bordered>
      <q-card-section horizontal>
        <div class="q-pa-md flex flex-center bg-grey-2">
          <q-avatar size="100px" class="shadow-2 border-primary">
            <q-img
              :src="
                props.urlFoto === undefined
                  ? '/src/assets/avatar.png'
                  : `http://localhost:3000/freelas/${props.urlFoto}`
              "
              spinner-color="primary"
            />
          </q-avatar>
        </div>

        <q-card-section class="col q-pa-lg">
          <div class="row justify-between items-start no-wrap">
            <div class="column">
              <div class="text-h6 text-weight-bold text-primary">{{ props.nome }}</div>
              <div class="text-subtitle2 text-secondary">{{ props.funcao }}</div>
            </div>
            <div class="row q-gutter-x-sm">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                :to="`/freelas/editar/${props.id}`"
              />
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                @click="confirm = true"
              />
            </div>
          </div>

          <div class="q-mt-md grid-info">
            <div class="info-item">
              <q-icon name="person" color="grey-7" size="18px" />
              <span class="text-grey-9">{{ props.idade }} anos</span>
            </div>
            <div class="info-item">
              <q-icon name="phone" color="grey-7" size="18px" />
              <span class="text-grey-9">{{ props.telefone }}</span>
            </div>
            <div class="info-item cursor-pointer" @click="copyToClipboard(props.pix || '')">
              <q-icon name="payments" color="grey-7" size="18px" />
              <span class="text-secondary text-weight-medium">Pix (copiar)</span>
            </div>
          </div>
        </q-card-section>
      </q-card-section>

      <q-dialog v-model="confirm">
        <q-card class="confirm-card">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6">Confirmar exclusão</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md">
            Você tem certeza que deseja excluir <strong>{{ props.nome }}</strong>? Esta ação não pode ser desfeita.
          </q-card-section>

          <q-card-actions align="right" class="q-pb-md q-pr-md">
            <q-btn flat label="Cancelar" color="primary" v-close-popup />
            <q-btn
              unelevated
              label="Excluir"
              color="negative"
              @click="deleteFreela(props.id)"
              v-close-popup
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </q-card>
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import { ref } from 'vue';

export default {
  name: 'CardFreelaComponent',
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
    const confirm = ref(false);

    const copyToClipboard = async (text: string) => {
      try {
        await navigator.clipboard.writeText(text.toString());
        $q.notify({
          color: 'positive',
          textColor: 'white',
          message: 'Pix copiado com sucesso!',
          icon: 'check',
        });
      } catch (err) {
        console.error('Erro ao copiar: ', err);
      }
    };

    const deleteFreela = async (id: string) => {
      try {
        $q.loading.show({ message: 'Excluindo...' });
        const deletado = await api.post(`/freelas/delete/${id}`);

        if (deletado.status === 200 || deletado.status === 201 || deletado.status === 204) {
          $q.notify({
            color: 'positive',
            textColor: 'white',
            message: 'Freela excluído com sucesso.',
            icon: 'delete',
          });
          emit('deleted', id);
        }
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          textColor: 'white',
          message: 'Erro ao excluir freela.',
          icon: 'error',
        });
      } finally {
        $q.loading.hide();
      }
    };

    return {
      props,
      copyToClipboard,
      deleteFreela,
      confirm,
    };
  },
};
</script>

<style lang="scss" scoped>
.freela-card {
  width: 100%;
  border-radius: 16px;
  background-color: #faf9f6; // Accent color
  overflow: hidden;
  transition: transform 0.2s;

  &:hover {
    transform: translateY(-2px);
  }
}

.border-primary {
  border: 2px solid white;
}

.grid-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 0.95rem;
}

.confirm-card {
  border-radius: 16px;
  width: 100%;
  max-width: 350px;
}
</style>

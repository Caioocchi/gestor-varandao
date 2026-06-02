<template>
  <div class="q-pt-md">
    <q-card class="card-base shadow-soft" bordered>
      <q-card-section horizontal>
        <div
          class="q-pa-md flex flex-center bg-grey-1"
          style="border-right: 1px solid rgba(0, 0, 0, 0.05)"
        >
          <q-avatar size="90px" class="shadow-1" style="border: 2px solid white">
            <q-img
              :src="
                props.urlFoto === undefined || props.urlFoto === ''
                  ? avatar
                  : urlApi + props.urlFoto
              "
              spinner-color="primary"
            />
          </q-avatar>
        </div>

        <q-card-section class="col q-pa-lg">
          <div class="row justify-between items-start no-wrap">
            <div class="column">
              <div class="text-h6 text-weight-bold text-primary">{{ props.nome }}</div>
            </div>
            <div class="row q-gutter-x-xs no-wrap">
              <q-btn
                flat
                round
                dense
                color="primary"
                icon="edit"
                size="sm"
                :to="`/freelas/editar/${props.id}`"
              />
              <q-btn
                flat
                round
                dense
                color="negative"
                icon="delete"
                size="sm"
                @click="confirm = true"
              />
            </div>
          </div>

          <div class="q-mt-md grid-info">
            <div class="info-item">
              <q-icon name="celebration" color="grey-6" size="16px" />
              <span class="text-grey-8 text-caption">{{ props.aniversario }}</span>
            </div>
            <div class="info-item">
              <q-icon name="phone_iphone" color="grey-6" size="16px" />
              <span class="text-grey-8 text-caption">{{ props.telefone }}</span>
            </div>
            <div class="info-item cursor-pointer" @click="copyToClipboard(props.pix || '')">
              <q-icon name="account_balance_wallet" color="secondary" size="16px" />
              <span class="text-secondary text-caption text-weight-bold">Pix (copiar)</span>
            </div>
          </div>
        </q-card-section>
      </q-card-section>

      <q-dialog v-model="confirm" backdrop-filter="blur(4px)">
        <q-card class="confirm-card card-base">
          <q-card-section class="row items-center q-pb-none">
            <div class="text-h6 text-weight-bold">Confirmar exclusão</div>
            <q-space />
            <q-btn icon="close" flat round dense v-close-popup />
          </q-card-section>

          <q-card-section class="q-pt-md">
            Você tem certeza que deseja excluir <strong>{{ props.nome }}</strong
            >? Esta ação não pode ser desfeita.
          </q-card-section>

          <q-card-actions align="right" class="q-pb-md q-pr-md">
            <q-btn flat label="Cancelar" color="primary" no-caps v-close-popup />
            <q-btn
              unelevated
              label="Excluir"
              color="negative"
              class="btn-rounded"
              style="padding: 4px 20px"
              @click="deleteFreela(props.id)"
              v-close-popup
              no-caps
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
import avatar from 'src/assets/avatar.png';

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
    aniversario: {
      type: String,
    },
    pix: {
      type: String,
    },
    telefone: {
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
    const urlApi = 'https://gestor-varandao-api.onrender.com/freelas/';

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
          iconColor: 'white',
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
      urlApi,
      avatar,
    };
  },
};
</script>

<style lang="scss" scoped>
.grid-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.confirm-card {
  width: 100%;
  max-width: 380px;
}

.btn-rounded {
  border-radius: 8px;
}
</style>

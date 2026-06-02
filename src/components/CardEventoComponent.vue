<template>
  <div class="q-pt-md">
    <q-card class="card-base shadow-soft" bordered>
      <q-card-section class="q-pa-lg">
        <div class="row justify-between items-start no-wrap">
          <div class="column">
            <div class="text-h6 text-weight-bold text-primary">
              {{ props.evento.nome_contratante }}
            </div>
            <div
              class="row items-center q-gutter-x-sm text-subtitle2 text-secondary text-weight-medium"
            >
              <q-icon name="menu_book" size="18px" />
              <span>{{ props.evento.menu }}</span>
            </div>
          </div>
          <div class="row q-gutter-x-xs no-wrap">
            <q-btn
              flat
              round
              dense
              color="secondary"
              icon="visibility"
              size="md"
              :to="`/eventos/visualizar/${props.evento._id}`"
            />
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              size="md"
              :to="`/eventos/editar/${props.evento._id}`"
            />

            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              size="md"
              @click="confirm = true"
            />
          </div>
        </div>

        <div class="q-mt-sm grid-info">
          <div class="info-item">
            <q-icon name="mdi-chef-hat" color="grey-6" size="16px" />
            <span class="text-grey-8 text-caption">{{ props.evento.responsavel }}</span>
          </div>
          <div class="info-item">
            <q-icon name="phone" color="grey-6" size="16px" />
            <span class="text-grey-8 text-caption">{{ props.evento.telefone }}</span>
          </div>
          <div
            v-show="
              props.evento.endereco && !Object.values(props.evento.endereco).every((v) => v === '')
            "
            class="info-item cursor-pointer"
            @click="abrirMapa"
          >
            <q-icon name="place" color="grey-6" size="16px" />
            <span class="text-grey-8 text-caption">
              <span class="text-secondary text-caption text-weight-bold">
                {{ formatarEndereco(props.evento.endereco) }}
                (abrir mapa)
              </span>
            </span>
          </div>
          <div class="row q-col-gutter-sm">
            <div class="col-auto">
              <div class="info-item">
                <q-icon name="event" color="primary" size="16px" />
                <span class="text-grey-8 text-caption">{{ formatarData(props.evento.data) }}</span>
              </div>
            </div>
            <div class="col-auto">
              <div class="info-item">
                <q-icon name="schedule" color="primary" size="16px" />
                <span class="text-grey-8 text-caption">{{ props.evento.hora }}</span>
              </div>
            </div>
            <div class="col-auto">
              <div class="info-item">
                <q-icon name="groups" color="secondary" size="16px" />
                <span class="text-secondary text-caption text-weight-bold">
                  {{ props.evento.qtde_pessoas }} pessoas
                </span>
              </div>
            </div>
          </div>
        </div>
      </q-card-section>
    </q-card>

    <q-dialog v-model="confirm" backdrop-filter="blur(4px)">
      <q-card class="confirm-card card-base">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6 text-weight-bold">Confirmar exclusão</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-md">
          Você tem certeza que deseja excluir o evento de
          <strong>{{ props.evento.nome_contratante }}</strong
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
            @click="deleteEvento(props.evento._id)"
            v-close-popup
            no-caps
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script lang="ts">
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';

interface Endereco {
  cep: string;
  logradouro: string;
  numero: string;
  complemento: string;
  bairro: string;
  cidade: string;
}

interface Evento {
  _id: string;
  nome_contratante: string;
  telefone: string;
  endereco: Endereco;
  data: string;
  hora: string;
  responsavel: string;
  qtde_pessoas: number;
  menu: string;
}

export default {
  name: 'CardEventoComponent',
  props: {
    evento: {
      type: Object as () => Evento,
      required: true,
    },
  },
  emits: ['deleted'],
  setup(props, { emit }) {
    const $q = useQuasar();
    const confirm = ref(false);

    const formatarEndereco = (end: Endereco) => {
      if (!end) return '';
      const parts = [
        end.logradouro,
        end.numero ? `nº ${end.numero}` : '',
        end.complemento,
        end.bairro,
        end.cidade,
      ].filter(Boolean);
      return parts.join(', ');
    };

    const formatarData = (data: string) => {
      if (!data) return '';
      const [ano, mes, dia] = data.split('-');
      return `${dia}/${mes}/${ano}`;
    };

    const abrirMapa = () => {
      const fullAddress = `${formatarEndereco(props.evento.endereco)}, CEP: ${props.evento.endereco?.cep}`;

      window.open(
        `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(fullAddress)}`,
        '_blank',
      );
    };

    const deleteEvento = async (id: string) => {
      try {
        $q.loading.show({ message: 'Excluindo evento...' });
        await api.post(`/eventos/delete/${id}`);

        $q.notify({
          color: 'positive',
          textColor: 'white',
          message: 'Evento excluído com sucesso.',
          icon: 'delete',
        });
        emit('deleted', id);
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'negative',
          textColor: 'white',
          message: 'Erro ao excluir evento.',
          icon: 'error',
        });
      } finally {
        $q.loading.hide();
      }
    };

    return {
      props,
      confirm,
      formatarEndereco,
      formatarData,
      abrirMapa,
      deleteEvento,
    };
  },
};
</script>

<style lang="scss" scoped>
.grid-info {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.cursor-pointer {
  cursor: pointer;
}

.confirm-card {
  width: 100%;
  max-width: 380px;
}

.btn-rounded {
  border-radius: 8px;
}
</style>

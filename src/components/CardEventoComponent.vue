<template>
  <div class="q-pt-md">
    <q-card class="card-base shadow-soft" bordered>
      <q-card-section class="q-pa-lg">
        <div class="row justify-between items-center q-gutter-sm">
          <div
            class="text-h6 text-weight-bold text-primary col"
            style="word-break: break-word; min-width: 120px"
          >
            {{ props.evento.nome_contratante }}
          </div>
          <div class="row q-gutter-x-sm no-wrap col-auto">
            <q-btn
              flat
              round
              dense
              color="secondary"
              icon="visibility"
              size="14px"
              :to="`/eventos/visualizar/${props.evento._id}`"
            />
            <q-btn
              flat
              round
              dense
              color="primary"
              icon="edit"
              size="14px"
              :to="`/eventos/editar/${props.evento._id}`"
            />

            <q-btn
              flat
              round
              dense
              color="negative"
              icon="delete"
              size="14px"
              @click="confirm = true"
            />
          </div>
        </div>
        <!-- Principais Informações do Evento -->
        <div class="row items-center q-gutter-x-md q-gutter-y-xs">
          <div class="row items-center text-caption text-grey-8 no-wrap">
            <div class="row items-center q-gutter-x-xs">
              <q-icon name="event" color="primary" size="14px" />
              <span>{{ formatarData(props.evento.data) }}</span>
            </div>
            <q-separator vertical class="q-mx-xs" />
            <div class="row items-center q-gutter-x-xs">
              <q-icon name="schedule" color="primary" size="14px" />
              <span>{{ props.evento.hora_evento }}</span>
            </div>
          </div>

          <div class="info-item text-caption text-secondary text-weight-bold">
            <q-icon name="groups" size="16px" class="q-mr-xs" />
            <span style="word-break: break-word">
              {{ props.evento.quantidade_pessoas.quantidade_adultos || 0 }} Adultos,
              {{ props.evento.quantidade_pessoas.quantidade_criancas || 0 }} Crianças,
              {{ props.evento.quantidade_pessoas.quantidade_staffs || 0 }} Staffs
            </span>
          </div>
        </div>

        <div class="info-item text-grey-9 text-weight-bold text-caption q-my-xs">
          <q-icon name="mdi-chef-hat" color="primary" size="16px" class="q-mr-xs" />
          <span style="word-break: break-word">{{ props.evento.responsavel }}</span>
        </div>

        <!-- Informações Secundárias -->
        <div class="grid-info">
          <div class="row items-center q-col-gutter-sm">
            <div class="col-12 col-md-auto">
              <div
                class="row items-center q-gutter-x-xs text-subtitle2 text-secondary text-weight-bold"
              >
                <q-icon name="menu_book" size="16px" />
                <span>{{ props.evento.menu }}</span>
              </div>
            </div>
          </div>

          <div class="info-item">
            <q-icon name="local_bar" color="grey-6" size="16px" />
            <span class="text-grey-8 text-caption"
              >Terá bebidas?
              <span class="text-weight-bold text-secondary">{{
                props.evento.bebidas ? 'Sim' : 'Não'
              }}</span></span
            >
          </div>

          <div class="info-item">
            <q-icon name="phone" color="grey-6" size="16px" />
            <span class="text-grey-8 text-caption">{{ props.evento.telefone }}</span>
          </div>

          <div
            v-show="
              props.evento.endereco && !Object.values(props.evento.endereco).every((v) => v === '')
            "
            class="info-item"
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
  hora_evento: string;
  hora_saida: string;
  responsavel: string;
  quantidade_pessoas: {
    quantidade_adultos: number | null;
    quantidade_criancas: number | null;
    quantidade_staffs: number | null;
  };
  menu: string;
  bebidas: boolean;
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

      const endereco = encodeURIComponent(fullAddress);

      window.open(`https://www.google.com/maps/search/?api=1&query=${endereco}`, '_blank');
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
  gap: 4px;
}

.confirm-card {
  width: 100%;
  max-width: 380px;
  border-radius: 20px;
}

.btn-rounded {
  border-radius: 8px;
}
</style>

<template>
  <div class="q-pa-md">
    <div v-if="loading">Carregando freela...</div>
    <div v-else>
      <FormFreela :freela="freela" submitLabel="Salvar" @freela="onSubmit" />
    </div>
  </div>
</template>

<script lang="ts">
import { onMounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { api } from 'src/boot/axios';
import FormFreela from 'src/components/FormFreela.vue';

export default {
  components: {
    FormFreela,
  },
  setup() {
    interface Freela {
      nome: string;
      dt_nascimento: string;
      pix: string;
      telefone: string;
      cpf: string;
      funcao: string;
      urlFoto: File | null;
    }

    const route = useRoute();
    const router = useRouter();
    const $q = useQuasar();
    const loading = ref(true);
    const freela = ref<Freela>({
      nome: '',
      dt_nascimento: '',
      pix: '',
      telefone: '',
      cpf: '',
      funcao: '',
      urlFoto: null,
    });

    const id = route.params.id?.toString();

    const loadFreela = async () => {
      if (!id) {
        $q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: 'ID do freela não informado.',
        });
        await router.replace('/freelas');
        return;
      }

      try {
        const { data } = await api.get(`/freelas/${id}`);

        freela.value = {
          nome: data.nome,
          dt_nascimento: data.dt_nascimento,
          pix: data.pix,
          telefone: data.telefone,
          cpf: data.cpf,
          funcao: data.funcao,
          urlFoto: null,
        };
      } catch (error) {
        console.error(error);
        $q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: 'Não foi possível carregar o freela.',
        });
        await router.replace('/freelas');
      } finally {
        loading.value = false;
      }
    };

    const onSubmit = async (freela: Freela) => {
      try {
        const formData = new FormData();

        formData.append('nome', freela.nome);
        formData.append('dt_nascimento', freela.dt_nascimento);
        formData.append('pix', freela.pix);
        formData.append('telefone', freela.telefone);
        formData.append('cpf', freela.cpf);
        formData.append('funcao', freela.funcao);

        if (freela.urlFoto) {
          formData.append('urlFoto', freela.urlFoto);
        }

        console.log('formData', formData);

        await api.put(`/freelas/update/${id}`, formData);

        await router.push('/freelas');

        $q.notify({
          color: 'green-4',
          textColor: 'white',
          icon: 'cloud_done',
          message: 'Freela criado com sucesso',
        });
      } catch (error) {
        console.log(error);

        $q.notify({
          color: 'red',
          textColor: 'white',
          icon: 'error',
          message: 'Erro ao criar freela',
        });
      }
    };

    onMounted(loadFreela);

    return {
      loadFreela,
      onSubmit,
      loading,
      freela,
    };
  },
};
</script>

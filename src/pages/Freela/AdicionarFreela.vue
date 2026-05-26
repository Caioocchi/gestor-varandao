<template>
  <div class="q-pa-md">
    <FormFreela submitLabel="Adicionar" @freela="onSubmit" />
  </div>
</template>

<script lang="ts">
import { useQuasar } from 'quasar';
import { useRouter } from 'vue-router';
import { api } from 'src/boot/axios';
import FormFreela from 'src/components/FormFreela.vue';

export default {
  components: {
    FormFreela,
  },
  setup() {
    const $q = useQuasar();
    const router = useRouter();

    interface Freela {
      nome: string;
      dt_nascimento: string;
      pix: string;
      telefone: string;
      cpf: string;
      funcao: string;
      urlFoto: File | null;
    }

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

        await api.post('/freelas', formData, {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        });

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

    return {
      onSubmit,
    };
  },
};
</script>

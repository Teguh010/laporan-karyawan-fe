<template>
  <q-page padding>
    <div class="q-pa-md">
      <h5 class="q-mt-none">Buat Laporan Baru</h5>
      
      <q-form @submit="onSubmit" class="q-gutter-md">
        <!-- Form Fields -->
        <q-input
          v-model="form.namaBarang"
          label="Nama Barang"
          :rules="[val => !!val || 'Field is required']"
        />
        
        <q-input
          v-model="form.nomorBarang"
          label="Nomor Barang"
          :rules="[val => !!val || 'Field is required']"
        />
        
        <q-input
          v-model="form.noSurat"
          label="Nomor Surat"
          :rules="[val => !!val || 'Field is required']"
        />

        <!-- Need Approve Files -->
        <div class="q-mb-md">
          <div class="text-h6">Files Need Approve</div>
          <div v-for="(file, index) in needApproveFiles" :key="'na-'+index" class="q-mb-sm">
            <q-file
              v-model="needApproveFiles[index]"
              label="Select File"
              accept=".pdf"
              @update:model-value="onFileSelected($event, 'needApprove', index)"
            />
          </div>
          <q-btn
            flat
            color="primary"
            icon="add"
            label="Add More Files"
            @click="needApproveFiles.push(null)"
          />
        </div>

        <!-- No Need Approve Files -->
        <div class="q-mb-md">
          <div class="text-h6">Files No Need Approve</div>
          <div v-for="(file, index) in noNeedApproveFiles" :key="'nna-'+index" class="q-mb-sm">
            <q-file
              v-model="noNeedApproveFiles[index]"
              label="Select File"
              accept=".pdf"
              @update:model-value="onFileSelected($event, 'noNeedApprove', index)"
            />
          </div>
          <q-btn
            flat
            color="primary"
            icon="add"
            label="Add More Files"
            @click="noNeedApproveFiles.push(null)"
          />
        </div>

        <div>
          <q-btn type="submit" color="primary" label="Submit" :loading="loading" />
        </div>
      </q-form>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref } from 'vue';
import { useRouter } from 'vue-router';
import { useLaporanStore } from 'stores/laporan-store';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'LaporanCreate',

  setup() {
    const router = useRouter();
    const laporanStore = useLaporanStore();
    const $q = useQuasar();
    const loading = ref(false);

    const form = ref({
      namaBarang: '',
      nomorBarang: '',
      noSurat: ''
    });

    const needApproveFiles = ref([null]);
    const noNeedApproveFiles = ref([null]);

    const onFileSelected = (file, type, index) => {
      if (!file) return;
      console.log(`File selected for ${type}:`, file);
    };

    const onSubmit = async () => {
      try {
        loading.value = true;
        
        // Create FormData
        const formData = new FormData();
        formData.append('namaBarang', form.value.namaBarang);
        formData.append('nomorBarang', form.value.nomorBarang);
        formData.append('noSurat', form.value.noSurat);

        // Append files
        needApproveFiles.value.forEach((file, index) => {
          if (file) formData.append(`needApprove_${index}`, file);
        });

        noNeedApproveFiles.value.forEach((file, index) => {
          if (file) formData.append(`noNeedApprove_${index}`, file);
        });

        const result = await laporanStore.createLaporan(formData);
        
        $q.notify({
          type: 'positive',
          message: 'Laporan berhasil dibuat'
        });

        router.push(`/laporan/${result.id}`);
      } catch (error) {
        $q.notify({
          type: 'negative',
          message: 'Terjadi kesalahan saat membuat laporan'
        });
      } finally {
        loading.value = false;
      }
    };

    return {
      form,
      loading,
      needApproveFiles,
      noNeedApproveFiles,
      onFileSelected,
      onSubmit
    };
  }
});
</script>
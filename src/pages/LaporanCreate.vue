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
         <q-btn flat label="Print PDF" color="primary" @click="generatePdf" />
      </q-form>
    </div>

    <q-dialog v-model="showPdfPreview">
      <q-card style="width: 800px; max-width: 90vw;">
        <q-card-section>
          <div class="text-h6">Preview Laporan</div>
        </q-card-section>

        <q-card-section class="q-pt-none">
          <LaporanPdfTemplate :data="form" ref="pdfTemplate" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Tutup" color="primary" v-close-popup />
          <q-btn flat label="Print PDF" color="primary" @click="generatePdf" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script>
import { defineComponent, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLaporanStore } from 'stores/laporan-store'
import html2pdf from 'html2pdf.js'
import LaporanPdfTemplate from 'components/LaporanPdfTemplate.vue'

export default defineComponent({
  name: 'LaporanCreate',
  
  components: {
    LaporanPdfTemplate
  },

  setup() {
    const router = useRouter()
    const laporanStore = useLaporanStore()
    const $q = useQuasar()
    const loading = ref(false)
    const showPdfPreview = ref(false)
    const pdfTemplate = ref(null)

    const form = ref({
      namaBarang: '',
      nomorBarang: '',
      noSurat: ''
    })

    const needApproveFiles = ref([null])
    const noNeedApproveFiles = ref([null])

    const onFileSelected = (file, type, index) => {
      if (!file) return
      console.log(`File selected for ${type}:`, file)
    }

    const onSubmit = async () => {
      try {
        loading.value = true;
        
        const formData = new FormData();
        
        // Append form fields
        Object.keys(form.value).forEach(key => {
          formData.append(key, form.value[key]);
        });

        // Append Need Approve files
        needApproveFiles.value.forEach((file, index) => {
          if (file) {
            formData.append(`needApproveFiles`, file);
          }
        });

        // Append No Need Approve files
        noNeedApproveFiles.value.forEach((file, index) => {
          if (file) {
            formData.append(`noNeedApproveFiles`, file);
          }
        });

        const result = await laporanStore.createLaporan(formData);
        
        $q.notify({
          type: 'positive',
          message: 'Laporan berhasil dibuat'
        });

        // Show PDF preview
        showPdfPreview.value = true;

        // Add watcher for when preview is closed
        watch(showPdfPreview, (newValue) => {
          if (!newValue) {
            // Preview was closed, now redirect
            router.push(`/laporan/${result.id}`);
          }
        });

      } catch (error) {
        console.error('Error submitting form:', error);
        $q.notify({
          type: 'negative',
          message: 'Terjadi kesalahan saat membuat laporan'
        });
      } finally {
        loading.value = false;
      }
    }

    const generatePdf = async () => {
      const element = document.getElementById('pdf-content')
      if (!element) {
        console.error('PDF content element not found')
        $q.notify({
          type: 'negative',
          message: 'PDF content not found'
        })
        return
      }

      try {
        const opt = {
          margin: 1,
          filename: `laporan-${form.value.nomorBarang}.pdf`,
          image: { type: 'jpeg', quality: 0.98 },
          html2canvas: { 
            scale: 2,
            useCORS: true,
            logging: true
          },
          jsPDF: { 
            unit: 'mm', 
            format: 'a4', 
            orientation: 'portrait'
          }
        }

        // Wait for images to load
        await new Promise(resolve => setTimeout(resolve, 500))

        $q.loading.show({
          message: 'Generating PDF...'
        })

        await html2pdf().set(opt).from(element).save()

        $q.loading.hide()
        $q.notify({
          type: 'positive',
          message: 'PDF generated successfully'
        })
      } catch (error) {
        console.error('Error generating PDF:', error)
        $q.loading.hide()
        $q.notify({
          type: 'negative',
          message: 'Error generating PDF'
        })
      }
    }

    return {
      form,
      loading,
      needApproveFiles,
      noNeedApproveFiles,
      onFileSelected,
      onSubmit,
      showPdfPreview,
      generatePdf,
      pdfTemplate
    }
  }
})
</script>

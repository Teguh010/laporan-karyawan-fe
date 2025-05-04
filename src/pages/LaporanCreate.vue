<template>
  <q-page padding>
    <div class="q-pa-md">
      <h5 class="q-mt-none">Buat Laporan Baru</h5>
      
      <q-form @submit.prevent class="q-gutter-md">
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

        <div class="row q-gutter-md">
          <q-btn color="grey" label="Save" :loading="loading" @click="onSave" />
          <q-btn color="primary" label="Submit" :loading="loading" @click="onSubmit" />
          <q-btn flat label="Print PDF" color="primary" @click="generatePdf" />
        </div>
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

<script setup>
import { ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLaporanStore } from 'stores/laporan-store'
import html2pdf from 'html2pdf.js'
import LaporanPdfTemplate from 'components/LaporanPdfTemplate.vue'

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

const prepareFormData = () => {
  const formData = new FormData()
  
  // Append form fields
  Object.keys(form.value).forEach(key => {
    formData.append(key, form.value[key])
  })

  // Append Need Approve files
  needApproveFiles.value.forEach((file) => {
    if (file) {
      formData.append('needApproveFiles', file)
    }
  })

  // Append No Need Approve files
  noNeedApproveFiles.value.forEach((file) => {
    if (file) {
      formData.append('noNeedApproveFiles', file)
    }
  })
  
  return formData
}

const onSave = async () => {
  try {
    loading.value = true
    const formData = prepareFormData()
    console.log('Saving form with isSubmitted=false')
    const result = await laporanStore.createLaporan(formData, false)
    
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil disimpan sebagai draft'
    })
    
    router.push(`/${result.id}`)
  } catch (error) {
    console.error('Error saving form:', error)
    $q.notify({
      type: 'negative',
      message: 'Terjadi kesalahan saat menyimpan laporan'
    })
  } finally {
    loading.value = false
  }
}

const onSubmit = async () => {
  try {
    loading.value = true
    const formData = prepareFormData()
    console.log('Submitting form with isSubmitted=true')
    const result = await laporanStore.createLaporan(formData, true)
    
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil disubmit'
    })

    // Show PDF preview
    showPdfPreview.value = true

    // Add watcher for when preview is closed
    watch(showPdfPreview, (newValue) => {
      if (!newValue) {
        // Preview was closed, now redirect
        router.push(`/${result.id}`)
      }
    })
  } catch (error) {
    console.error('Error submitting form:', error)
    $q.notify({
      type: 'negative',
      message: 'Terjadi kesalahan saat submit laporan'
    })
  } finally {
    loading.value = false
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
</script>

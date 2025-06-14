<template>
  <q-page padding>
    <div class="q-pa-md">
      <h5 class="q-mt-none">Buat Laporan Baru</h5>
      
      <q-form @submit.prevent="onSubmit" class="q-gutter-md">
        <!-- Form Fields -->
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-input
              v-model="form.requestId"
              label="Request ID"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.title"
              label="Title"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.requestName"
              label="Request Name"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.companyCode"
              label="Company Code"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.requestObjective"
              label="Request Objective"
              type="textarea"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.requestBackground"
              label="Request Background"
              type="textarea"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-6">
            <q-select
              v-model="form.poType"
              label="PO Type"
              :options="['purchase_order', 'direct_purchase']"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-6">
            <q-select
              v-model="form.assetType"
              label="Asset Type"
              :options="['fixed_asset', 'consumable']"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-6">
            <q-input
              v-model="form.totalAmountIdr"
              label="Total Amount (IDR)"
              type="text"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-6">
            <q-input
              v-model="form.totalAmountOriginalCurrency"
              label="Total Amount (Original Currency)"
              type="text"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.remarks"
              label="Remarks"
              type="textarea"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.assignTo"
              label="Assign To"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-6">
            <q-input
              v-model="form.requestDate"
              label="Request Date"
              type="date"
              :rules="[val => !!val || 'Field is required']"
              @input="formatDateInput('requestDate')"
            />
          </div>
          
          <div class="col-6">
            <q-input
              v-model="form.deliveryDate"
              label="Delivery Date"
              type="date"
              :rules="[val => !!val || 'Field is required']"
              @input="formatDateInput('deliveryDate')"
            />
          </div>
          
          <div class="col-12">
            <q-input
              v-model="form.department"
              label="Department"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-6">
            <q-input
              v-model="form.buyer"
              label="Buyer"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
          
          <div class="col-6">
            <q-input
              v-model="form.currency"
              label="Currency"
              :rules="[val => !!val || 'Field is required']"
            />
          </div>
        </div>

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
          <q-btn type="button" color="grey" label="Save" :loading="loading" @click="onSave" />
          <q-btn type="submit" color="primary" label="Submit" :loading="loading" />
          <q-btn type="button" flat label="Print PDF" color="primary" @click="generatePdf" />
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
import { ref, watch, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'

// Helper function to format date to ISO string
function formatDateToISO(date) {
  const d = new Date(date)
  return d.toISOString().split('T')[0]
}
import { useQuasar } from 'quasar'
import { useLaporanStore } from 'stores/laporan-store'
import html2pdf from 'html2pdf.js'
import LaporanPdfTemplate from 'components/LaporanPdfTemplate.vue'

const route = useRoute()
const router = useRouter()
const laporanStore = useLaporanStore()
const $q = useQuasar()
const loading = ref(false)
const showPdfPreview = ref(false)
const pdfTemplate = ref(null)
const isEditMode = ref(false)
const laporanId = ref(null)

const form = ref({
  requestId: '',
  title: '',
  requestName: '',
  companyCode: '',
  requestObjective: '',
  requestBackground: '',
  poType: '',
  assetType: '',
  totalAmountIdr: '',
  totalAmountOriginalCurrency: '',
  remarks: '',
  assignTo: '',
  requestDate: '',
  deliveryDate: '',
  department: '',
  buyer: '',
  currency: '',
  status: 'entry', // Default status for new reports
  resubmissionCount: 0
})

// Load laporan data for edit
const loadLaporanData = async () => {
  if (!isEditMode.value) return
  
  try {
    loading.value = true
    const laporan = await laporanStore.getLaporanDetail(laporanId.value)
    
    // Map laporan data to form
    if (laporan) {
      // Copy all fields except status and resubmissionCount
      const { status, resubmissionCount, ...laporanData } = laporan
      
      // Set form values
      Object.keys(form.value).forEach(key => {
        if (laporanData[key] !== undefined) {
          form.value[key] = laporanData[key]
        }
      })
      
      // Set status and resubmission count
      if (status === 'rejected') {
        form.value.status = 'resubmitted'
        form.value.resubmissionCount = (resubmissionCount || 0) + 1
      } else {
        form.value.status = status
        form.value.resubmissionCount = resubmissionCount || 0
      }
    }
    
    // Handle dates
    if (laporan.requestDate) form.value.requestDate = laporan.requestDate.split('T')[0]
    if (laporan.deliveryDate) form.value.deliveryDate = laporan.deliveryDate.split('T')[0]
    
  } catch (error) {
    console.error('Error loading laporan:', error)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat data laporan'
    })
  } finally {
    loading.value = false
  }
}

// Initialize component
onMounted(() => {
  isEditMode.value = route.name === 'edit-laporan' || route.params.id !== undefined
  if (isEditMode.value) {
    laporanId.value = route.params.id
    loadLaporanData()
  }
})

// Format date input to ISO format
function formatDateInput(fieldName) {
  const date = form.value[fieldName]
  if (date) {
    form.value[fieldName] = formatDateToISO(date)
  }
}

const needApproveFiles = ref([null])
const noNeedApproveFiles = ref([null])

const onFileSelected = (file, type, index) => {
  if (!file) return
  console.log(`File selected for ${type}:`, file)
}

const prepareFormData = () => {
  const formData = new FormData()
  
  // Create a copy of form data to avoid modifying the original
  const formDataToSend = { ...form.value }
  
  // Don't include resubmissionCount in the form data
  // The backend will handle incrementing it when resubmitting
  delete formDataToSend.resubmissionCount;
  
  console.log('Form data to send:', formDataToSend);
  
  // Append form fields
  Object.entries(formDataToSend).forEach(([key, value]) => {
    // Skip null or undefined values to avoid "null" string
    if (value !== null && value !== undefined) {
      try {
        // Special handling for resubmissionCount to ensure it's a number
        if (key === 'resubmissionCount') {
          const numValue = Number(value);
          if (!isNaN(numValue)) {
            formData.append(key, numValue);
            return;
          }
        }
        
        // Convert boolean values to string
        if (typeof value === 'boolean') {
          formData.append(key, value.toString());
        } 
        // Handle dates
        else if (value instanceof Date) {
          formData.append(key, value.toISOString().split('T')[0]);
        } 
        // Handle file arrays
        else if (Array.isArray(value)) {
          value.forEach(item => {
            if (item instanceof File) {
              formData.append(key, item);
            }
          });
        } 
        // Handle all other values
        else {
          formData.append(key, value);
        }
      } catch (error) {
        console.error(`Error processing field ${key}:`, error);
        // Fallback to default behavior if something goes wrong
        formData.append(key, value);
      }
    }
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
  
  console.log('FormData prepared:', [...formData.entries()])
  return formData
}

const onSave = async () => {
  try {
    loading.value = true
    const formData = prepareFormData()
    
    if (isEditMode.value) {
      // For edit mode, use updateLaporan
      console.log('Updating laporan as draft')
      await laporanStore.updateLaporan(laporanId.value, formData)
      
      $q.notify({
        type: 'positive',
        message: 'Laporan berhasil diperbarui sebagai draft'
      })
      
      router.push(`/edit/${laporanId.value}`)
    } else {
      // For new laporan, use createLaporan with isSubmitted=false
      console.log('Saving new laporan as draft')
      const result = await laporanStore.createLaporan(formData, false)
      
      $q.notify({
        type: 'positive',
        message: 'Laporan berhasil disimpan sebagai draft'
      })
      
      router.push(`/edit/${result.id}`)
    }
  } catch (error) {
    console.error('Error saving form:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Terjadi kesalahan saat menyimpan laporan'
    })
  } finally {
    loading.value = false
  }
}

const onSubmit = async (event) => {
  console.log('onSubmit called', { isEditMode: isEditMode.value, event });
  
  if (isEditMode.value) {
    console.log('Calling onUpdate from onSubmit');
    return onUpdate() // Return here to prevent the code below from executing
  }
  
  console.log('Creating new laporan');
  // Only for new laporan creation
  try {
    loading.value = true
    const formData = prepareFormData()
    console.log('Calling createLaporan with formData:', formData);
    await laporanStore.createLaporan(formData)
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil dibuat',
      position: 'top'
    })
    router.push('/')
  } catch (error) {
    console.error('Error creating laporan:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal membuat laporan',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const onUpdate = async () => {
  console.log('onUpdate called');
  if (!laporanId.value) {
    console.log('No laporanId, returning');
    return;
  }
  
  try {
    loading.value = true;
    
    // Check if this is a resubmission of a rejected laporan
    const isResubmission = laporanStore.currentLaporan?.status === 'rejected';
    
    // Set the appropriate status
    if (isResubmission) {
      form.value.status = 'resubmitted';
      console.log('Preparing resubmission for rejected laporan');
    } else {
      form.value.status = 'draft';
    }
    
    // Prepare form data with the correct status
    const formData = prepareFormData();
    console.log('Updating laporan with data:', [...formData.entries()]);
    
    let result;
    
    if (isResubmission) {
      console.log('Processing resubmission - calling resubmitLaporan');
      
      // Call resubmitLaporan for rejected laporan
      result = await laporanStore.resubmitLaporan(laporanId.value, formData);
      console.log('resubmitLaporan result:', result);
      
      $q.notify({
        type: 'positive',
        message: 'Laporan berhasil dikirim ulang untuk persetujuan',
        position: 'top'
      });
    } else {
      // Regular update for non-rejected laporan
      console.log('Processing regular update');
      result = await laporanStore.updateLaporan(laporanId.value, formData);
      $q.notify({
        type: 'positive',
        message: 'Laporan berhasil diperbarui',
        position: 'top'
      });
    }
    
    // Show PDF preview after successful update
    showPdfPreview.value = true;
    
    // Add watcher for when preview is closed
    const unwatch = watch(showPdfPreview, (newValue) => {
      if (!newValue) {
        // Preview was closed, now redirect
        router.push(`/edit/${laporanId.value}`);
        unwatch(); // Clean up the watcher
      }
    });
    
  } catch (error) {
    console.error('Error updating laporan:', error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal memperbarui laporan',
      position: 'top'
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
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <h5 class="q-mt-none">Edit Purchase Request</h5>
      
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
          <div class="text-h6">Preview Purchase Request</div>
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
import { usePurchaseRequestStore } from 'stores/purchase-request-store'
import html2pdf from 'html2pdf.js'
import PurchaseRequestPdfTemplate from 'components/PurchaseRequestPdfTemplate.vue'

const route = useRoute()
const router = useRouter()
const purchaseRequestStore = usePurchaseRequestStore()
const $q = useQuasar()
const loading = ref(false)
const showPdfPreview = ref(false)
const pdfTemplate = ref(null)
const isEditMode = ref(false)
const purchaseRequestId = ref(null)

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

// Load purchase request data for edit
const loadPurchaseRequestData = async () => {
  if (!isEditMode.value) return
  
  try {
    loading.value = true
    const purchaseRequest = await purchaseRequestStore.getPurchaseRequestDetail(purchaseRequestId.value)
    
    // Map purchase request data to form
    if (purchaseRequest) {
      // Copy all fields except status and resubmissionCount
      const { status, resubmissionCount, ...purchaseRequestData } = purchaseRequest
      
      // Set form values
      Object.keys(form.value).forEach(key => {
        if (purchaseRequestData[key] !== undefined) {
          form.value[key] = purchaseRequestData[key]
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
    if (purchaseRequest.requestDate) form.value.requestDate = purchaseRequest.requestDate.split('T')[0]
    if (purchaseRequest.deliveryDate) form.value.deliveryDate = purchaseRequest.deliveryDate.split('T')[0]
    
  } catch (error) {
    console.error('Error loading purchase request:', error)
    $q.notify({
      type: 'negative',
      message: 'Failed to load purchase request data'
    })
  } finally {
    loading.value = false
  }
}

// Initialize component
onMounted(() => {
  isEditMode.value = route.name === 'edit-purchase-request' || route.params.id !== undefined
  if (isEditMode.value) {
    purchaseRequestId.value = route.params.id
    loadPurchaseRequestData()
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
      // For edit mode, use updatePurchaseRequest
      console.log('Updating purchase request as draft')
      await purchaseRequestStore.updatePurchaseRequest(purchaseRequestId.value, formData)
      
      $q.notify({
        type: 'positive',
        message: 'Purchase request updated as draft successfully'
      })
      
      router.push(`/edit/${purchaseRequestId.value}`)
    } else {
      // For new purchase request, use createPurchaseRequest with isSubmitted=false
      console.log('Saving new purchase request as draft')
      const result = await purchaseRequestStore.createPurchaseRequest(formData, false)
      
      $q.notify({
        type: 'positive',
        message: 'Purchase request saved as draft successfully'
      })
      
      router.push(`/edit/${result.id}`)
    }
  } catch (error) {
    console.error('Error saving form:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Error occurred while saving purchase request'
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
  
  console.log('Creating new purchase request');
  // Only for new purchase request creation
  try {
    loading.value = true
    const formData = prepareFormData()
    console.log('Calling createPurchaseRequest with formData:', formData);
    await purchaseRequestStore.createPurchaseRequest(formData)
    $q.notify({
      type: 'positive',
      message: 'Purchase request created successfully',
      position: 'top'
    })
    router.push('/')
  } catch (error) {
    console.error('Error creating purchase request:', error)
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to create purchase request',
      position: 'top'
    })
  } finally {
    loading.value = false
  }
}

const onUpdate = async () => {
  console.log('onUpdate called');
  if (!purchaseRequestId.value) {
    console.log('No purchaseRequestId, returning');
    return;
  }
  
  try {
    loading.value = true;
    
    // Check if this is a resubmission of a rejected purchase request
    const isResubmission = purchaseRequestStore.currentPurchaseRequest?.status === 'rejected';
    
    // Set the appropriate status
    if (isResubmission) {
      form.value.status = 'resubmitted';
      console.log('Preparing resubmission for rejected purchase request');
    } else {
      form.value.status = 'draft';
    }
    
    // Prepare form data with the correct status
    const formData = prepareFormData();
    console.log('Updating purchase request with data:', [...formData.entries()]);
    
    let result;
    
    if (isResubmission) {
      console.log('Processing resubmission - calling resubmitPurchaseRequest');
      
      // Call resubmitPurchaseRequest for rejected purchase request
      result = await purchaseRequestStore.resubmitPurchaseRequest(purchaseRequestId.value, formData);
      console.log('resubmitPurchaseRequest result:', result);
      
      $q.notify({
        type: 'positive',
        message: 'Purchase request resubmitted successfully',
        position: 'top'
      });
    } else {
      // Regular update for non-rejected purchase request
      console.log('Processing regular update');
      result = await purchaseRequestStore.updatePurchaseRequest(purchaseRequestId.value, formData);
      $q.notify({
        type: 'positive',
        message: 'Purchase request updated successfully',
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

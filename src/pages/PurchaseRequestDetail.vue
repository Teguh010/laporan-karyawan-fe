<template>
  <q-page padding>
    <div class="q-pa-md">
      <template v-if="laporan">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <div class="row items-center q-mb-md">
              <div class="text-h6">Purchase Request Details</div>
              <q-space />
              <q-btn 
                color="primary" 
                icon="picture_as_pdf" 
                label="Preview PDF" 
                @click="previewPdf"
                class="q-ml-md"
              />
            </div>
            <div class="row q-col-gutter-md">
              <div class="col-6">
                <q-card class="q-mb-md">
                  <q-card-section>
                    <div class="q-table__container">
                      <table class="q-table q-table--bordered q-table--dense">
                        <tbody>
                          <tr>
                            <td class="text-weight-medium">Request ID</td>
                            <td>{{ laporan.requestId }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Title</td>
                            <td>{{ laporan.title }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Request Name</td>
                            <td>{{ laporan.requestName }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Company Code</td>
                            <td>{{ laporan.companyCode }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">PO Type</td>
                            <td>{{ laporan.poType }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Asset Type</td>
                            <td>{{ laporan.assetType }}</td>
                          </tr>
                            <tr>
                            <td class="text-weight-medium">Request Objective</td>
                            <td>{{ laporan.requestObjective }}</td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
              <div class="col-6">
                <q-card class="q-mb-md">
                  <q-card-section>
                    <div class="q-table__container">
                      <table class="q-table q-table--bordered q-table--dense">
                        <tbody>
                           <tr>
                            <td class="text-weight-medium">Request Background</td>
                            <td>{{ laporan.requestBackground }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Total Amount (IDR)</td>
                            <td>{{ formatNumber(laporan.totalAmountIdr) }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Total Amount (Original Currency)</td>
                            <td>{{ formatNumber(laporan.totalAmountOriginalCurrency) }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Request Date</td>
                            <td>{{ formatDate(laporan.requestDate) }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Delivery Date</td>
                            <td>{{ formatDate(laporan.deliveryDate) }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Department</td>
                            <td>{{ laporan.department }}</td>
                          </tr>
                          <tr>
                            <td class="text-weight-medium">Status</td>
                            <td>
                              <div class="column items-start">
                                <q-badge :color="getStatusColor(laporan.status)" class="q-mb-xs">
                                  {{ getStatusLabel(laporan.status) }}
                                </q-badge>
                                <div v-if="laporan.resubmissionCount > 0" class="text-caption text-grey-7">
                                  Resubmitted {{ laporan.resubmissionCount }} time{{ laporan.resubmissionCount > 1 ? 's' : '' }}
                                </div>
                              </div>
                            </td>
                          </tr>
                        </tbody>
                      </table>
                    </div>
                  </q-card-section>
                </q-card>
              </div>
            </div>
          </div>

          <!-- Need Approve Files -->
          <div class="col-12 col-md-6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Files Need Approve</div>
                <q-list>
                  <q-item v-for="file in laporan.needApproveFiles" :key="file.path">
                    <q-item-section>
                      <q-item-label>{{ file.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn flat color="primary" icon="download" @click="downloadFile(file)" />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="!laporan.needApproveFiles?.length">
                    <q-item-section>
                      <q-item-label>No files available</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <!-- No Need Approve Files -->
          <div class="col-12 col-md-6">
            <q-card>
              <q-card-section>
                <div class="text-h6">Files No Need Approve</div>
                <q-list>
                  <q-item v-for="file in laporan.noNeedApproveFiles" :key="file.path">
                    <q-item-section>
                      <q-item-label>{{ file.name }}</q-item-label>
                    </q-item-section>
                    <q-item-section side>
                      <q-btn flat color="primary" icon="download" @click="downloadFile(file)" />
                    </q-item-section>
                  </q-item>
                  <q-item v-if="!laporan.noNeedApproveFiles?.length">
                    <q-item-section>
                      <q-item-label>No files available</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Approval Status Card -->
        <div class="row q-mt-md">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Status Persetujuan</div>
                
                <!-- Status Ditolak -->
                <template v-if="laporan.status === 'rejected'">
                  <div class="q-mt-md q-pa-md bg-negative text-white rounded-borders">
                    <div class="row items-center">
                      <q-icon name="warning" size="24px" class="q-mr-sm" />
                      <div>
                        <div class="text-subtitle1">Laporan Ditolak</div>
                        <div v-if="laporan.rejectReason" class="q-mt-xs">Alasan: {{ laporan.rejectReason }}</div>
                        <div v-else class="q-mt-xs">Laporan ini telah ditolak</div>
                      </div>
                    </div>
                  </div>
                </template>
                
                <!-- Status Persetujuan Normal -->
                <template v-else>
                  <div class="q-mt-md">
                    <div class="row q-col-gutter-md">
                      <!-- EM Approval -->
                      <div class="col-12 col-md-6">
                        <q-item>
                          <q-item-section>
                            <q-item-label>Persetujuan EM</q-item-label>
                            <q-item-label caption>Engineering Manager</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-icon 
                              :name="laporan.emApproved ? 'check_circle' : 'cancel'" 
                              :color="laporan.emApproved ? 'positive' : 'grey-5'"
                              size="24px"
                            />
                          </q-item-section>
                        </q-item>
                      </div>
                      
                      <!-- User Approval -->
                      <div class="col-12 col-md-6">
                        <q-item>
                          <q-item-section>
                            <q-item-label>Persetujuan User</q-item-label>
                            <q-item-label caption>User</q-item-label>
                          </q-item-section>
                          <q-item-section side>
                            <q-icon 
                              :name="laporan.userApproved ? 'check_circle' : 'cancel'" 
                              :color="laporan.userApproved ? 'positive' : 'grey-5'"
                              size="24px"
                            />
                          </q-item-section>
                        </q-item>
                      </div>
                    </div>
                  </div>
                </template>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Submit Button -->
        <div class="row q-mt-md" v-if="laporan.status === 'entry' && canSubmit">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Submit Laporan</div>
                <p v-if="!laporan.emApproved || !laporan.userApproved" class="text-negative">
                  Laporan membutuhkan persetujuan dari EM dan User sebelum dapat disubmit.
                </p>
                <p v-else>
                  Semua persetujuan telah diterima. Klik tombol di bawah untuk submit laporan.
                </p>
                <q-btn 
                  color="primary" 
                  icon="send" 
                  label="Submit Laporan" 
                  @click="showSubmitDialog = true" 
                  :loading="submitLoading"
                  :disable="!canSubmit"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Resubmit Button for Rejected Laporan -->
        <div class="row q-mt-md" v-if="(laporan.status === 'rejected' || laporan.status === 'resubmitted') && isVendor">
          <div class="col-12">
            <q-card :class="{'bg-blue-1': laporan.status === 'resubmitted'}">
              <q-card-section>
                <div class="text-h6">
                  {{ laporan.status === 'rejected' ? 'Laporan Ditolak' : 'Menunggu Persetujuan' }}
                </div>
                <p class="text-negative" v-if="laporan.rejectReason">
                  <strong>Alasan Penolakan:</strong> {{ laporan.rejectReason }}
                </p>
                <p class="q-mt-md">
                  Laporan ini telah ditolak. Silakan perbaiki dan kirim ulang untuk persetujuan.
                </p>
                <div class="row q-mt-sm">
                  <div class="col">
                    <q-btn 
                      color="primary" 
                      icon="edit" 
                      label="Edit Laporan" 
                      :to="`/edit/${laporan.id}`"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Approval Buttons for EM and USER -->
        <div class="row q-mt-md" v-if="laporan.status === 'entry' && (userRole === 'em' || userRole === 'user')">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Approval</div>
                <p v-if="(userRole === 'em' && !laporan.emApproved) || (userRole === 'user' && !laporan.userApproved)">
                  Silakan tinjau laporan dan berikan persetujuan Anda.
                </p>
                <p v-else class="text-positive">
                  Anda telah memberikan persetujuan untuk laporan ini.
                </p>
                <div class="row q-mt-md">
                  <div class="col">
                    <q-btn 
                      v-if="(userRole === 'em' && !laporan.emApproved) || (userRole === 'user' && !laporan.userApproved)"
                      color="positive" 
                      icon="check" 
                      :label="`Approve as ${userRole}`" 
                      @click="approveLaporan" 
                      :loading="approvalLoading"
                      class="q-mr-sm"
                    />
                    <q-btn 
                      v-if="(userRole === 'em' && laporan.emApproved) || (userRole === 'user' && laporan.userApproved)"
                      color="negative" 
                      icon="close" 
                      label="Batalkan Persetujuan" 
                      @click="cancelApproval" 
                      :loading="approvalLoading"
                      class="q-mr-sm"
                    />
                    <q-btn 
                      v-if="canReject"
                      color="negative" 
                      outline
                      icon="thumb_down" 
                      label="Tolak Laporan" 
                      @click="openRejectDialog" 
                      :loading="rejectLoading"
                    />
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>

      <div v-else class="text-center q-pa-md">
        <q-spinner-dots size="40px" color="primary" />
        <div class="q-mt-sm">Loading...</div>
      </div>

      <!-- Dialog Konfirmasi Penolakan -->
      <q-dialog v-model="showRejectDialog" persistent>
        <q-card style="min-width: 400px">
          <q-card-section>
            <div class="text-h6">Tolak Laporan</div>
          </q-card-section>

          <q-card-section class="q-pt-none">
            <q-input
              v-model="rejectReason"
              type="textarea"
              label="Alasan Penolakan"
              hint="Silakan masukkan alasan penolakan"
              :rules="[val => !!val || 'Alasan penolakan harus diisi']"
              autogrow
              class="q-mb-md"
            />
          </q-card-section>

          <q-card-actions align="right" class="text-primary">
            <q-btn 
              flat 
              label="Batal" 
              v-close-popup 
              :disabled="rejectLoading" 
            />
            <q-btn 
              flat 
              label="Tolak Laporan" 
              color="negative" 
              @click="handleReject" 
              :loading="rejectLoading"
            />
          </q-card-actions>
        </q-card>
      </q-dialog>
    </div>
    <!-- PDF Preview Dialog -->
    <q-dialog v-model="showPdfPreview" maximized>
      <q-card style="max-width: 90vw; max-height: 90vh;">
        <q-card-section class="row items-center q-pb-none">
          <div class="text-h6">Preview Laporan</div>
          <q-space />
          <q-btn icon="close" flat round dense v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none scroll" style="max-height: calc(90vh - 110px);">
          <div id="pdf-content">
            <LaporanPdfTemplate :data="laporan" ref="pdfTemplate" />
          </div>
        </q-card-section>

        <q-card-actions align="right" class="q-pa-md">
          <q-btn flat label="Tutup" color="primary" v-close-popup />
          <q-btn label="Print PDF" color="primary" @click="printPdf" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { usePurchaseRequestStore } from 'stores/purchase-request-store';
import { useAuthStore } from 'src/stores/auth-store';
import PurchaseRequestPdfTemplate from 'components/PurchaseRequestPdfTemplate.vue';
import html2pdf from 'html2pdf.js';


const route = useRoute();
const router = useRouter();
const $q = useQuasar();
const purchaseRequestStore = usePurchaseRequestStore();
const authStore = useAuthStore();

// State
const purchaseRequest = ref(null);
const loading = ref(false);
const error = ref(null);
const approvalLoading = ref(false);
const submitLoading = ref(false);
const rejectLoading = ref(false);
const showRejectDialog = ref(false);
const showPdfPreview = ref(false);
const pdfDialog = ref(false);
const rejectReason = ref('');
const pdfTemplate = ref(null);
const userRole = ref(authStore.user?.role || '');

// Computed
const isVendor = computed(() => {
  return userRole.value?.toLowerCase() === 'vendor';
});

const canReject = computed(() => {
  if (!purchaseRequest.value) return false;
  // Hanya bisa menolak jika status masih 'entry' dan user memiliki akses
  return purchaseRequest.value.status === 'entry' && 
         (userRole.value === 'em' || userRole.value === 'user');
});

// Computed properties
const canApprove = computed(() => {
  return ['em', 'user'].includes(userRole.value);
});

const hasApproved = computed(() => {
  if (!purchaseRequest.value) return false;
  return userRole.value === 'em' 
    ? purchaseRequest.value.emApproved 
    : userRole.value === 'user' 
      ? purchaseRequest.value.userApproved 
      : false;
});

console.log('userRole.value', purchaseRequest);

const showApprovalButtons = computed(() => {
  return purchaseRequest.value?.status === 'entry' && canApprove.value;
});

const canSubmit = computed(() => {
  if (!purchaseRequest.value) return false;
  return purchaseRequest.value.emApproved && 
         purchaseRequest.value.userApproved && 
         purchaseRequest.value.status === 'entry';
});

// Helper functions
const formatDate = (dateString) => {
  if (!dateString) return '-';
  return new Date(dateString).toLocaleDateString('id-ID', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

const formatNumber = (number) => {
  if (number === null || number === undefined) return '-';
  return new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(number);
};

const getStatusColor = (status) => {
  if (!status) return 'grey';
  switch (status.toLowerCase()) {
    case 'submitted':
      return 'blue';
    case 'resubmitted':
      return 'deep-purple';
    case 'approved':
      return 'positive';
    case 'rejected':
      return 'negative';
    case 'entry':
      return 'grey';
    default:
      return 'grey';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case 'submitted':
      return 'Submitted';
    case 'resubmitted':
      return 'Resubmitted';
    case 'approved':
      return 'Approved';
    case 'rejected':
      return 'Rejected';
    case 'entry':
      return 'Entry';
    default:
      return status;
  }
};

// Load purchase request details
const loadPurchaseRequest = async () => {
  try {
    loading.value = true;
    const data = await purchaseRequestStore.getPurchaseRequestDetail(route.params.id);
    purchaseRequest.value = data;
    console.log('Purchase Request data:', data);
  } catch (err) {
    error.value = err.message;
    console.error('Error loading purchase request:', err);
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat detail purchase request',
    });
  } finally {
    loading.value = false;
  }
};

// Download file
const downloadFile = async (file) => {
  try {
    $q.loading.show();
    const response = await laporanStore.downloadFile(file.path);
    
    // Create a blob from the response
    const blob = new Blob([response.data], { type: response.headers['content-type'] });
    const url = window.URL.createObjectURL(blob);
    
    // Create a temporary link and trigger download
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', file.name);
    document.body.appendChild(link);
    link.click();
    
    // Cleanup
    link.remove();
    window.URL.revokeObjectURL(url);
    
  } catch (error) {
    console.error('Error downloading file:', error);
    $q.notify({
      type: 'negative',
      message: 'Gagal mengunduh file',
    });
  } finally {
    $q.loading.hide();
  }
};

// Approve laporan
const approveLaporan = async () => {
  try {
    approvalLoading.value = true;
    await laporanStore.approveLaporan(route.params.id, userRole.value);
    await loadPurchaseRequest();
    $q.notify({
      color: 'positive',
      message: `Persetujuan sebagai ${userRole.value} berhasil disimpan`,
      icon: 'check'
    });
  } catch (error) {
    console.error('Error approving laporan:', error);
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Gagal menyimpan persetujuan',
      icon: 'error'
    });
  } finally {
    approvalLoading.value = false;
  }
};

// Cancel approval
const cancelApproval = async () => {
  try {
    approvalLoading.value = true;
    // You'll need to implement cancelApproval in your store and backend
    // For now, we'll just show a message
    $q.dialog({
      title: 'Batalkan Persetujuan',
      message: 'Fitur pembatalan persetujuan belum tersedia. Silakan hubungi administrator.',
      cancel: true,
      persistent: true
    });
  } catch (error) {
    console.error('Error canceling approval:', error);
    $q.notify({
      color: 'negative',
      message: error.response?.data?.message || 'Gagal membatalkan persetujuan',
      icon: 'error'
    });
  } finally {
    approvalLoading.value = false;
  }
};

// Submit laporan
const submitLaporan = async () => {
  try {
    submitLoading.value = true;
    
    // Gunakan resubmit jika laporan pernah di-reject
    if (laporan.value.status === 'rejected') {
      await laporanStore.resubmitLaporan(laporan.value.id);
    } else {
      await laporanStore.submitLaporan(laporan.value.id);
    }
    
    $q.notify({
      type: 'positive',
      message: laporan.value.status === 'rejected' 
        ? 'Laporan berhasil dikirim ulang untuk persetujuan' 
        : 'Laporan berhasil disubmit',
      position: 'top'
    });
    
    // Refresh data laporan
    await loadPurchaseRequest();
  } catch (error) {
    console.error('Error submitting laporan:', error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || error.message || 'Gagal memproses laporan',
      position: 'top'
    });
  } finally {
    submitLoading.value = false;
  }
};

// Reject laporan
const handleReject = async () => {
  if (!rejectReason.value) {
    $q.notify({
      type: 'warning',
      message: 'Harap masukkan alasan penolakan',
    });
    return;
  }

  rejectLoading.value = true;
  try {
    await laporanStore.rejectLaporan(route.params.id, rejectReason.value);
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil ditolak',
    });
    showRejectDialog.value = false;
    rejectReason.value = '';
    await loadPurchaseRequest();
  } catch (error) {
    console.error('Error rejecting laporan:', error);
    $q.notify({
      type: 'negative',
      message: 'Gagal menolak laporan: ' + (error.response?.data?.message || error.message),
    });
  } finally {
    rejectLoading.value = false;
  }
};

const handleResubmit = async () => {
  $q.dialog({
    title: 'Kirim Ulang Laporan',
    message: 'Apakah Anda yakin ingin mengirim ulang laporan ini untuk persetujuan?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      await laporanStore.resubmitLaporan(route.params.id);
      $q.notify({
        type: 'positive',
        message: 'Laporan berhasil dikirim ulang untuk persetujuan',
      });
      await loadPurchaseRequest();
    } catch (error) {
      console.error('Error resubmitting laporan:', error);
      $q.notify({
        type: 'negative',
        message: 'Gagal mengirim ulang laporan: ' + (error.response?.data?.message || error.message),
      });
    }
  });
};

// Open reject confirmation dialog
const openRejectDialog = () => {
  rejectReason.value = '';
  showRejectDialog.value = true;
};

const previewPdf = () => {
  showPdfPreview.value = true;
};

const printPdf = async () => {
  const element = document.getElementById('pdf-content');
  if (!element) {
    console.error('PDF content element not found');
    $q.notify({
      type: 'negative',
      message: 'PDF content not found',
      position: 'top'
    });
    return;
  }

  try {
    $q.loading.show({
      message: 'Membuat PDF...'
    });
    
    const opt = {
      margin: 1,
      filename: `laporan-${laporan.value.requestId || 'report'}.pdf`,
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
    };

    // Wait for images to load
    await new Promise(resolve => setTimeout(resolve, 500));
    
    // Generate and download PDF
    await html2pdf().set(opt).from(element).save();
    
    $q.notify({
      type: 'positive',
      message: 'PDF berhasil dibuat',
      position: 'top',
      timeout: 2000
    });
    
    // Close the preview dialog after download
    showPdfPreview.value = false;
    
  } catch (error) {
    console.error('Error generating PDF:', error);
    $q.notify({
      type: 'negative',
      message: 'Gagal membuat PDF: ' + (error.message || 'Terjadi kesalahan'),
      position: 'top',
      timeout: 3000
    });
  } finally {
    $q.loading.hide();
  }
};

// const previewPdf = async () => {
//   try {
//     $q.loading.show({
//       message: 'Menyiapkan pratinjau PDF...'
//     });

//     await new Promise(resolve => setTimeout(resolve, 1000));
//     $q.loading.hide();

//     Dialog.create({
//       title: 'Preview PDF',
//       message: 'Fitur preview PDF akan segera tersedia.',
//       ok: true,
//       persistent: true
//     });
//   } catch (error) {
//     console.error('Error in previewPdf:', error);
//     $q.loading.hide();
//     $q.notify({
//       type: 'negative',
//       message: 'Gagal membuka pratinjau PDF',
//       position: 'top',
//       timeout: 3000
//     });
//   }
// };

// Initialize component
onMounted(() => {
  loadPurchaseRequest();
});
</script>

<template>
  <q-page padding>
    <div class="q-pa-md">
      <template v-if="laporan">
        <div class="row q-col-gutter-md">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Detail Laporan</div>
                <q-list>
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Nama Barang</q-item-label>
                      <q-item-label>{{ laporan.namaBarang }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Nomor Barang</q-item-label>
                      <q-item-label>{{ laporan.nomorBarang }}</q-item-label>
                    </q-item-section>
                  </q-item>
                  
                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Nomor Surat</q-item-label>
                      <q-item-label>{{ laporan.noSurat }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section>
                      <q-item-label caption>Tanggal Dibuat</q-item-label>
                      <q-item-label>{{ new Date(laporan.createdAt).toLocaleDateString('id-ID') }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
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

        <!-- Tambahkan tombol Submit jika status masih 'entry' -->
        <div class="row q-mt-md" v-if="laporan.status === 'entry'">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Submit Laporan</div>
                <p>Laporan ini masih dalam status draft. Klik tombol di bawah untuk submit laporan.</p>
                <q-btn 
                  color="primary" 
                  icon="send" 
                  label="Submit Laporan" 
                  @click="submitLaporan" 
                  :loading="submitLoading"
                />
              </q-card-section>
            </q-card>
          </div>
        </div>

        <!-- Tombol approval hanya muncul jika status 'submitted' -->
        <div class="row q-mt-md" v-if="laporan.status === 'submitted' && userCanApprove">
          <div class="col-12">
            <q-card>
              <q-card-section>
                <div class="text-h6">Approval</div>
                <div class="row q-mt-md">
                  <div class="col">
                    <q-btn 
                      color="positive" 
                      icon="check" 
                      label="Approve" 
                      @click="approveLaporan" 
                      :loading="approvalLoading"
                    />
                    <q-btn 
                      color="negative" 
                      icon="close" 
                      label="Reject" 
                      class="q-ml-sm" 
                      @click="rejectLaporan" 
                      :loading="approvalLoading"
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
    </div>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useLaporanStore } from 'stores/laporan-store'
import { useAuthStore } from 'stores/auth-store'
import { useQuasar } from 'quasar'

const route = useRoute()
const router = useRouter()
const laporanStore = useLaporanStore()
const authStore = useAuthStore()
const $q = useQuasar()
const laporan = ref(null)
const approvalLoading = ref(false)
const submitLoading = ref(false)

// Check if current user can approve (EM or USER)
const userCanApprove = computed(() => {
  return ['em', 'user'].includes(authStore.user?.role)
})

const loadLaporan = async () => {
  try {
    const data = await laporanStore.getLaporanDetail(route.params.id)
    console.log('Laporan data:', data) // Debugging
    laporan.value = data
  } catch (error) {
    console.error('Error loading laporan:', error) // Debugging
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat detail laporan'
    })
  }
}

const downloadFile = async (file) => {
  try {
    if (file.url) {
      window.open(file.url, '_blank')
      
      $q.notify({
        type: 'positive',
        message: `Downloading ${file.name}`
      })
    } else {
      throw new Error('File URL not available')
    }
  } catch (error) {
    console.error('Error downloading file:', error)
    $q.notify({
      type: 'negative',
      message: `Failed to download ${file.name}`
    })
  }
}

const approveLaporan = async () => {
  try {
    approvalLoading.value = true;
    console.log(`Approving laporan ${route.params.id}`);
    await laporanStore.approveLaporan(route.params.id);
    
    // Reload laporan detail to see updated status
    await loadLaporan();
    
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil diapprove'
    });
    
    // Navigate back to list after successful approval
    router.push('/');
  } catch (error) {
    console.error('Error approving laporan:', error);
    $q.notify({
      type: 'negative',
      message: 'Gagal approve laporan'
    });
  } finally {
    approvalLoading.value = false;
  }
}

const rejectLaporan = async () => {
  try {
    approvalLoading.value = true
    await laporanStore.rejectLaporan(route.params.id)
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil direject'
    })
    loadLaporan()
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal reject laporan'
    })
  } finally {
    approvalLoading.value = false
  }
}

const submitLaporan = async () => {
  try {
    submitLoading.value = true
    console.log(`Submitting laporan with ID: ${route.params.id}`)
    await laporanStore.submitLaporan(route.params.id)
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil disubmit'
    })
    // Reload laporan untuk mendapatkan status terbaru
    await loadLaporan()
  } catch (error) {
    console.error('Error submitting laporan:', error)
    $q.notify({
      type: 'negative',
      message: `Gagal submit laporan: ${error.message || 'Unknown error'}`
    })
  } finally {
    submitLoading.value = false
  }
}

onMounted(() => {
  loadLaporan()
})
</script>

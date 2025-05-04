<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-mb-md">
        <div class="col">
          <div class="text-h6">Daftar Laporan</div>
        </div>
        <div class="col-auto">
          <q-btn 
            color="primary" 
            icon="add" 
            label="Buat Laporan" 
            to="/create" 
          />
        </div>
      </div>

      <!-- Filter Section -->
      <q-card class="q-mb-md">
        <q-card-section>
          <div class="text-subtitle1 q-mb-sm">Filter Laporan</div>
          <div class="row q-col-gutter-md">
            <div class="col-12 col-sm-4">
              <q-select
                v-model="filters.status"
                :options="statusOptions"
                label="Status"
                clearable
                emit-value
                map-options
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                v-model="filters.startDate"
                label="Tanggal Mulai"
                type="date"
                @update:model-value="applyFilters"
              />
            </div>
            <div class="col-12 col-sm-4">
              <q-input
                v-model="filters.endDate"
                label="Tanggal Akhir"
                type="date"
                @update:model-value="applyFilters"
              />
            </div>
          </div>
          <div class="row q-mt-md">
            <div class="col-auto">
              <q-btn
                color="primary"
                label="Terapkan Filter"
                @click="applyFilters"
              />
              <q-btn
                flat
                color="grey"
                label="Reset"
                class="q-ml-sm"
                @click="resetFilters"
              />
            </div>
          </div>
        </q-card-section>
      </q-card>

      <q-card>
        <q-table
          :rows="laporanList"
          :columns="columns"
          row-key="id"
          :loading="loading"
          @row-click="onRowClick"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <q-spinner-dots size="50px" />
            </q-inner-loading>
          </template>

          <template v-slot:no-data>
            <div class="full-width row flex-center q-pa-md text-grey">
              Tidak ada data laporan
            </div>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                color="primary"
                icon="visibility"
                size="sm"
                @click.stop="viewDetail(props.row)"
              >
                <q-tooltip>Lihat Detail</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click.stop="confirmDelete(props.row)"
              >
                <q-tooltip>Hapus</q-tooltip>
              </q-btn>
            </q-td>
          </template>

          <template v-slot:body-cell-createdAt="props">
            <q-td :props="props">
              {{ formatDate(props.row.createdAt) }}
            </q-td>
          </template>

          <template v-slot:body-cell-status="props">
            <q-td :props="props">
              <q-badge :color="getStatusColor(props.row.status)">
                {{ formatStatus(props.row.status) }}
              </q-badge>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Apakah Anda yakin ingin menghapus laporan ini?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Hapus" color="negative" @click="deleteLaporan" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLaporanStore } from 'stores/laporan-store'

const router = useRouter()
const $q = useQuasar()
const laporanStore = useLaporanStore()

const loading = ref(false)
const laporanList = ref([])
const showDeleteConfirm = ref(false)
const selectedLaporan = ref(null)

// Filter state
const filters = ref({
  status: null,
  startDate: null,
  endDate: null
})

const statusOptions = [
  { label: 'Draft', value: 'draft' },
  { label: 'Approved', value: 'approved' },
  { label: 'Not Approved', value: 'not_approved' }
]

const columns = [
  {
    name: 'nomorBarang',
    required: true,
    label: 'Nomor Barang',
    align: 'left',
    field: 'nomorBarang',
    sortable: true
  },
  {
    name: 'namaBarang',
    required: true,
    label: 'Nama Barang',
    align: 'left',
    field: 'namaBarang',
    sortable: true
  },
  {
    name: 'noSurat',
    required: true,
    label: 'Nomor Surat',
    align: 'left',
    field: 'noSurat',
    sortable: true
  },
  {
    name: 'status',
    required: true,
    label: 'Status',
    align: 'left',
    field: 'status',
    sortable: true
  },
  {
    name: 'createdAt',
    required: true,
    label: 'Tanggal Dibuat',
    align: 'left',
    field: 'createdAt',
    sortable: true
  },
  {
    name: 'actions',
    required: true,
    label: 'Aksi',
    align: 'center',
    field: 'actions'
  }
]

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('id-ID')
}

const formatStatus = (status) => {
  const statusMap = {
    'draft': 'Draft',
    'approved': 'Disetujui',
    'not_approved': 'Ditolak'
  }
  return statusMap[status] || status
}

const getStatusColor = (status) => {
  const colorMap = {
    'draft': 'blue',
    'approved': 'positive',
    'not_approved': 'negative'
  }
  return colorMap[status] || 'grey'
}

const loadLaporanList = async () => {
  loading.value = true
  try {
    const data = await laporanStore.getAllLaporan()
    laporanList.value = data
  } catch (error) {
    console.error('Error loading laporan list:', error)
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat daftar laporan'
    })
  } finally {
    loading.value = false
  }
}

const applyFilters = async () => {
  loading.value = true
  try {
    console.log('Applying filters:', filters.value)
    const data = await laporanStore.filterLaporan(filters.value)
    laporanList.value = data
  } catch (error) {
    console.error('Error filtering laporan:', error)
    $q.notify({
      type: 'negative',
      message: 'Gagal menerapkan filter'
    })
  } finally {
    loading.value = false
  }
}

const resetFilters = () => {
  filters.value = {
    status: null,
    startDate: null,
    endDate: null
  }
  loadLaporanList()
}

const viewDetail = (row) => {
  router.push(`/${row.id}`)
}

const onRowClick = (evt, row) => {
  viewDetail(row)
}

const confirmDelete = (row) => {
  selectedLaporan.value = row
  showDeleteConfirm.value = true
}

const deleteLaporan = async () => {
  try {
    await laporanStore.deleteLaporan(selectedLaporan.value.id)
    await loadLaporanList()
    $q.notify({
      type: 'positive',
      message: 'Laporan berhasil dihapus'
    })
  } catch (error) {
    console.error('Error deleting laporan:', error)
    $q.notify({
      type: 'negative',
      message: 'Gagal menghapus laporan'
    })
  }
}

onMounted(() => {
  loadLaporanList()
})
</script>

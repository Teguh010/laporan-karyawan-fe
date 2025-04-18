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
            to="/laporan/create" 
          />
        </div>
      </div>

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

<script>
import { defineComponent, ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import { useLaporanStore } from 'stores/laporan-store'

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

export default defineComponent({
  name: 'LaporanList',

  setup () {
    const router = useRouter()
    const $q = useQuasar()
    
    const loading = ref(false)
    const laporanList = ref([])
    const showDeleteConfirm = ref(false)
    const selectedLaporan = ref(null)

    const formatDate = (dateString) => {
      return new Date(dateString).toLocaleDateString('id-ID')
    }

    const loadLaporanList = async () => {
      loading.value = true
      try {
        const laporanStore = useLaporanStore()
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

    const viewDetail = (row) => {
      router.push(`/laporan/${row.id}`)
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
        const laporanStore = useLaporanStore()
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

    return {
      loading,
      laporanList,
      columns,
      showDeleteConfirm,
      onRowClick,
      viewDetail,
      confirmDelete,
      deleteLaporan,
      formatDate
    }
  }
})
</script>

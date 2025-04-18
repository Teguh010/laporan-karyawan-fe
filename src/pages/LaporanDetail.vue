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
      </template>

      <div v-else class="text-center q-pa-md">
        <q-spinner-dots size="40px" color="primary" />
        <div class="q-mt-sm">Loading...</div>
      </div>
    </div>
  </q-page>
</template>

<script>
import { defineComponent, ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import { useLaporanStore } from 'stores/laporan-store';
import { useQuasar } from 'quasar';

export default defineComponent({
  name: 'LaporanDetail',

  setup() {
    const route = useRoute();
    const laporanStore = useLaporanStore();
    const $q = useQuasar();
    const laporan = ref(null);

    const loadLaporan = async () => {
      try {
        const data = await laporanStore.getLaporanDetail(route.params.id);
        console.log('Laporan data:', data); // Debugging
        laporan.value = data;
      } catch (error) {
        console.error('Error loading laporan:', error); // Debugging
        $q.notify({
          type: 'negative',
          message: 'Gagal memuat detail laporan'
        });
      }
    };

    const downloadFile = async (file) => {
      try {
        if (file.url) {
          window.open(file.url, '_blank');
          
          $q.notify({
            type: 'positive',
            message: `Downloading ${file.name}`
          });
        } else {
          throw new Error('File URL not available');
        }
      } catch (error) {
        console.error('Error downloading file:', error);
        $q.notify({
          type: 'negative',
          message: `Failed to download ${file.name}`
        });
      }
    };

    onMounted(() => {
      loadLaporan();
    });

    return {
      laporan,
      downloadFile
    };
  }
});
</script>

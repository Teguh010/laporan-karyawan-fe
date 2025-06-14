<template>
  <div id="pdf-content" class="pdf-container">
    <!-- Kop Surat -->
    <div class="header">
      <!-- <img src="logo-perusahaan.png" alt="Logo" class="logo"> -->
      <div class="company-info">
        <h3>PT. NAMA PERUSAHAAN</h3>
        <p>Jl. Alamat Perusahaan No. 123</p>
        <p>Telp: (021) 1234567 | Email: info@perusahaan.com</p>
      </div>
      <hr class="divider">
    </div>

    <!-- Judul BAP -->
    <div class="text-center">
      <p>No. BAP : {{ data.noBap || '________________' }}</p>
    </div>

    <div class="content">
      <p>Dengan hormat,</p>
      <p>Bersama ini kami beritahukan bahwa hasil pekerjaan :</p>
      
      <table class="data-table">
        <tr>
          <td width="200">PO Number</td>
          <td>: {{ data.requestId || '________________' }}</td>
        </tr>
        <tr>
          <td>Deskripsi</td>
          <td>: {{ data.requestBackground || '________________' }}</td>
        </tr>
        <tr>
          <td>Deskripsi pembayaran</td>
          <td>: {{ data.title || '________________' }}</td>
        </tr>
        <tr>
          <td>Prosentase pembayaran</td>
          <td>: 100%</td>
        </tr>
        <tr>
          <td>Jumlah Pembayaran</td>
          <td>: Rp. {{ data.totalAmountIdr ? formatCurrency(data.totalAmountIdr) : '________________' }} (harga belum termasuk ppn)</td>
        </tr>
        <tr>
          <td>Nomor PO/SAP</td>
          <td>: {{ data.requestId || '________________' }}</td>
        </tr>
      </table>

      <p class="mt-3">Telah dilakukan pengecekan Hasil Pekerjaan Konstruksi / Jasa sebagai berikut :</p>

      <!-- Tabel Pengecekan -->
      <table class="checklist-table" border="1" cellspacing="0" cellpadding="5">
        <thead>
          <tr>
            <th>No</th>
            <th>ITEM</th>
            <th>CATATAN HASIL PENGECEKAN</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>1.</td>
            <td>Cek Administrasi (dengan check point) :</td>
            <td>
              <div>- Quantity Material sesuai dengan Order <span class="check-mark">[{{ data.cekAdministrasi?.quantityMaterial ? '✓' : ' ' }}]</span></div>
              <div>- Dokumen Perhitungan <span class="check-mark">[{{ data.cekAdministrasi?.dokumenPerhitungan ? '✓' : ' ' }}]</span></div>
              <div>- Drawing <span class="check-mark">[{{ data.cekAdministrasi?.drawing ? '✓' : ' ' }}]</span></div>
              <div>- Report Test <span class="check-mark">[{{ data.cekAdministrasi?.reportTest ? '✓' : ' ' }}]</span></div>
            </td>
          </tr>
          <tr>
            <td>2.</td>
            <td>Cek Fisik (dengan check point) :</td>
            <td>
              <div>- Kesesuaian dengan spesifikasi <span class="check-mark">[{{ data.cekFisik?.kesesuaianSpesifikasi ? '✓' : ' ' }}]</span></div>
              <div>- Kerapian hasil kerja <span class="check-mark">[{{ data.cekFisik?.kerapian ? '✓' : ' ' }}]</span></div>
              <div>- Volume Kerja <span class="check-mark">[{{ data.cekFisik?.volumeKerja ? '✓' : ' ' }}]</span></div>
            </td>
          </tr>
          <tr>
            <td>3.</td>
            <td>Cek Performance (dengan check point) :</td>
            <td>
              <div>- Kontrol safety/keselamatan <span class="check-mark">[{{ data.cekPerformance?.safety ? '✓' : ' ' }}]</span></div>
              <div>- Kontrol environment/lingkungan <span class="check-mark">[{{ data.cekPerformance?.environment ? '✓' : ' ' }}]</span></div>
              <div>- Kontrol schedule <span class="check-mark">[{{ data.cekPerformance?.schedule ? '✓' : ' ' }}]</span></div>
              <div>- Kontrol kualitas <span class="check-mark">[{{ data.cekPerformance?.kualitas ? '✓' : ' ' }}]</span></div>
            </td>
          </tr>
        </tbody>
      </table>

      <div class="mt-3">
        <p>Lain-Lain penyelesaian pekerjaan telah sesuai dengan spesifikasi order, yaitu (#):</p>
        <div v-if="data.lainLain && data.lainLain.length > 0">
          <div v-for="(item, index) in data.lainLain" :key="index" class="ml-4">
            <p>{{ String.fromCharCode(97 + index) }}. {{ item }}</p>
          </div>
        </div>
        <div v-else class="ml-4">
          <p>a. __________________________________________________________</p>
          <p>b. __________________________________________________________</p>
          <p>c. __________________________________________________________</p>
        </div>
      </div>

      <p class="mt-3">
        Lingkari sesuai dengan item pekerjaan dan jika tidak ada yang sesuai maka
        tambahkan pada baris yang kosong. Dilengkapi juga dengan laporan hasil pengujian.
      </p>

      <p class="mt-3">
        Kesimpulan : Sesuai dengan pengecekan hasil pekerjaan diatas, maka terhitung mulai tanggal 
        <span class="underline">{{ formatDate(data.tanggalKesimpulan) || '________________' }}</span>
      </p>
      <p>
        <span :class="{'selected': data.statusKesimpulan === 'memenuhi'}">Memenuhi</span> / 
        <span :class="{'selected': data.statusKesimpulan === 'tidak_memenuhi'}">Tidak Memenuhi</span> (*)
        untuk diserahkan kepada PT Ajinomoto Indonesia / PT Ajinex International (*),
        dengan kondisi area kerja Bersih dan Aman untuk di gunakan.
      </p>

      <p class="mt-3">
        Dan apabila dalam penyerahan ini masih ada kekurangannya dimohon untuk menginformasikan paling lambat
        1 (satu) minggu setelah berita acara penyerahan hasil pekerjaan
      </p>
      <p>*) Coret yang tidak perlu</p>

      <div class="signature-container mt-5">
        <div class="signature-box">
          <p>Di terima oleh,</p>
          <div class="signature-placeholder"></div>
          <p>( {{ data.diterimaOleh || '________________' }} )</p>
        </div>
        <div class="signature-box">
          <p>Di serahkan oleh,</p>
          <div class="signature-placeholder"></div>
          <p>( {{ data.diserahkanOleh || '________________' }} )</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LaporanPdfTemplate',
  props: {
    data: {
      type: Object,
      required: true,
      default: () => ({
        noBap: '',
        poNumber: '',
        deskripsiPekerjaan: '',
        deskripsiPembayaran: {
          ke: 1,
          persen: 100,
          jumlah: 0
        },
        noPoSap: '',
        cekAdministrasi: {
          quantityMaterial: false,
          dokumenPerhitungan: false,
          drawing: false,
          reportTest: false
        },
        cekFisik: {
          kesesuaianSpesifikasi: false,
          kerapian: false,
          volumeKerja: false
        },
        cekPerformance: {
          safety: false,
          environment: false,
          schedule: false,
          kualitas: false
        },
        lainLain: [
          'Jika pekerjaan konstruksi (pengecoran) sesuai dengan job mix desain',
          'Jika pekerjaan konstruksi (welding) sudah dilakukan leak test',
          'Jika pekerjaan konstruksi (seting machine) sudah dilkukan leak test & flushing sampai dengan commisioning test',
          'Jika perkerjaan konstruksi (electric) sudah dilakukan loop test & meggering'
        ],
        tanggalKesimpulan: new Date(),
        statusKesimpulan: 'memenuhi',
        diterimaOleh: 'AFANDI TATA, TJHIN',
        diserahkanOleh: '',
        perusahaanPenyerah: 'PT. DWI TUNGGAL JAYADI MAKMUR'
      })
    }
  },
  methods: {
    formatDate(date) {
      if (!date) return ''
      try {
        const options = { day: '2-digit', month: 'long', year: 'numeric' }
        return new Date(date).toLocaleDateString('id-ID', options)
      } catch (e) {
        return ''
      }
    },
    formatCurrency(amount) {
      if (amount === undefined || amount === null || isNaN(amount)) return '0,00'
      return parseFloat(amount).toLocaleString('id-ID', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      })
    }
  }
}
</script>

<style scoped>
.pdf-container {
  font-family: 'Arial', sans-serif;
  line-height: 1.5;
  padding: 20px;
  max-width: 1000px;
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 20px;
}

.header img.logo {
  max-width: 150px;
  margin-bottom: 10px;
}

.divider {
  border: 1px solid #000;
  margin: 10px 0;
}

.content {
  margin-top: 20px;
}

.text-center {
  text-align: center;
}

.data-table {
  width: 100%;
  margin: 15px 0;
  border-collapse: collapse;
}

.data-table td {
  padding: 5px;
  vertical-align: top;
}

.checklist-table {
  width: 100%;
  margin: 15px 0;
  border-collapse: collapse;
}

.checklist-table th, 
.checklist-table td {
  border: 1px solid #000;
  padding: 8px;
  text-align: left;
}

.check-mark {
  display: inline-block;
  width: 20px;
  text-align: center;
}

.selected {
  text-decoration: underline;
  font-weight: bold;
}

.underline {
  text-decoration: underline;
}

.signature-container {
  display: flex;
  justify-content: space-between;
  margin-top: 50px;
}

.signature-box {
  text-align: center;
  width: 200px;
}

.signature-placeholder {
  height: 50px;
  margin: 20px 0;
  border-bottom: 1px solid #000;
}

.mt-3 {
  margin-top: 1rem;
}

.mt-5 {
  margin-top: 3rem;
}

.ml-4 {
  margin-left: 1.5rem;
}

.logo {
  height: 60px;
  margin-bottom: 10px;
}

.company-info h2 {
  margin: 5px 0;
}

.company-info p {
  margin: 2px 0;
}

.divider {
  border-top: 2px solid #000;
  margin: 10px 0;
}

.letter-info {
  margin: 20px 0;
}

.content {
  margin: 20px 0;
}

.text-center {
  text-align: center;
}

.data-section {
  margin: 20px 0;
}

.data-section table {
  width: 100%;
}

.data-section td {
  padding: 5px 0;
}

.description {
  margin: 30px 0;
}

.signature {
  margin-top: 50px;
  text-align: right;
}

.signature-section {
  display: inline-block;
  text-align: center;
}

.signature-box {
  height: 80px;
  margin: 20px 0;
}
</style>

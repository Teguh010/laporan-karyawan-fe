<template>
  <div id="pdf-content" class="pdf-container">
    <!-- Kop Surat -->
    <div class="header">
      <img src="logo-perusahaan.png" alt="Logo" class="logo">
      <div class="company-info">
        <h2>PT. NAMA PERUSAHAAN</h2>
        <p>Jl. Alamat Perusahaan No. 123</p>
        <p>Telp: (021) 1234567 | Email: info@perusahaan.com</p>
      </div>
      <hr class="divider">
    </div>

    <!-- Nomor Surat dan Tanggal -->
    <div class="letter-info">
      <p>Nomor: {{ data.noSurat }}</p>
      <p>Tanggal: {{ new Date().toLocaleDateString('id-ID') }}</p>
    </div>

    <!-- Konten Surat -->
    <div class="content">
      <h3 class="text-center">LAPORAN BARANG</h3>
      
      <div class="data-section">
        <table>
          <tr>
            <td width="150">Nama Barang</td>
            <td>: {{ data.namaBarang }}</td>
          </tr>
          <tr>
            <td>Nomor Barang</td>
            <td>: {{ data.nomorBarang }}</td>
          </tr>
        </table>
      </div>

      <!-- Keterangan Template -->
      <div class="description">
        <p>Dengan ini kami menyatakan bahwa barang tersebut di atas telah tercatat dalam sistem inventaris perusahaan.</p>
      </div>
    </div>

    <!-- Tanda Tangan -->
    <div class="signature">
      <div class="signature-section">
        <p>Jakarta, {{ new Date().toLocaleDateString('id-ID') }}</p>
        <p>Mengetahui,</p>
        <div class="signature-box"></div>
        <p>( ............................ )</p>
        <p>Kepala Bagian Inventaris</p>
      </div>
    </div>
  </div>
</template>

<script>
import { defineComponent } from 'vue'

export default defineComponent({
  name: 'LaporanPdfTemplate',
  props: {
    data: {
      type: Object,
      required: true
    }
  }
})
</script>

<style scoped>
.pdf-container {
  padding: 40px;
  max-width: 210mm; /* A4 width */
  margin: 0 auto;
}

.header {
  text-align: center;
  margin-bottom: 30px;
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
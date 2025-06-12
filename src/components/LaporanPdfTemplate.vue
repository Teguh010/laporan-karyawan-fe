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

    <!-- Request Information -->
    <div class="request-info">
      <p>Request ID: {{ data.requestId }}</p>
      <p>Request Date: {{ new Date(data.requestDate).toLocaleDateString('id-ID') }}</p>
    </div>

    <!-- Konten Surat -->
    <div class="content">
      <h3 class="text-center">LAPORAN PERMINTAAN BARANG</h3>
      
      <div class="data-section">
        <table>
          <tbody>
            <tr>
              <td width="150">Title</td>
              <td>: {{ data.title }}</td>
            </tr>
            <tr>
              <td>Request Name</td>
              <td>: {{ data.requestName }}</td>
            </tr>
            <tr>
              <td>Company Code</td>
              <td>: {{ data.companyCode }}</td>
            </tr>
            <tr>
              <td>Request Objective</td>
              <td>: {{ data.requestObjective }}</td>
            </tr>
            <tr>
              <td>Request Background</td>
              <td>: {{ data.requestBackground }}</td>
            </tr>
            <tr>
              <td>PO Type</td>
              <td>: {{ data.poType }}</td>
            </tr>
            <tr>
              <td>Asset Type</td>
              <td>: {{ data.assetType }}</td>
            </tr>
            <tr>
              <td>Total Amount (IDR)</td>
              <td>: IDR {{ data.totalAmountIdr.toLocaleString() }}</td>
            </tr>
            <tr>
              <td>Total Amount ({{ data.currency }})</td>
              <td>: {{ data.currency }} {{ data.totalAmountOriginalCurrency.toLocaleString() }}</td>
            </tr>
            <tr>
              <td>Remarks</td>
              <td>: {{ data.remarks }}</td>
            </tr>
            <tr>
              <td>Assign To</td>
              <td>: {{ data.assignTo }}</td>
            </tr>
            <tr>
              <td>Department</td>
              <td>: {{ data.department }}</td>
            </tr>
            <tr>
              <td>Buyer</td>
              <td>: {{ data.buyer }}</td>
            </tr>
            <tr>
              <td>Delivery Date</td>
              <td>: {{ new Date(data.deliveryDate).toLocaleDateString('id-ID') }}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Keterangan Template -->
      <div class="description">
        <p>Berikut adalah detail permintaan barang yang diajukan:</p>
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

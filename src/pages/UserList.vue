<template>
  <q-page padding>
    <div class="q-pa-md">
      <div class="row q-mb-md">
        <div class="col">
          <div class="text-h6">Manajemen User</div>
        </div>
        <div class="col-auto">
          <q-btn 
            color="primary" 
            icon="add" 
            label="Tambah User" 
            @click="openCreateDialog" 
          />
        </div>
      </div>

      <q-card>
        <q-table
          :rows="users"
          :columns="columns"
          row-key="id"
          :loading="loading"
        >
          <template v-slot:loading>
            <q-inner-loading showing color="primary">
              <q-spinner-dots size="50px" />
            </q-inner-loading>
          </template>

          <template v-slot:body-cell-actions="props">
            <q-td :props="props">
              <q-btn
                flat
                round
                color="primary"
                icon="edit"
                size="sm"
                @click="openEditDialog(props.row)"
              >
                <q-tooltip>Edit</q-tooltip>
              </q-btn>
              <q-btn
                flat
                round
                color="negative"
                icon="delete"
                size="sm"
                @click="confirmDelete(props.row)"
              >
                <q-tooltip>Hapus</q-tooltip>
              </q-btn>
            </q-td>
          </template>
        </q-table>
      </q-card>
    </div>

    <!-- Dialog untuk Create/Edit User -->
    <q-dialog v-model="showDialog" persistent>
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ isEditing ? 'Edit User' : 'Tambah User' }}</div>
        </q-card-section>

        <q-card-section>
          <q-form @submit="onSubmit" class="q-gutter-md">
            <q-input
              v-model="form.username"
              label="Username"
              :rules="[val => !!val || 'Username wajib diisi']"
              :disable="isEditing"
            />

            <q-input
              v-model="form.password"
              label="Password"
              type="password"
              :rules="[val => !isEditing || !!val || 'Password wajib diisi']"
            />

            <q-input
              v-model="form.fullName"
              label="Nama Lengkap"
              :rules="[val => !!val || 'Nama lengkap wajib diisi']"
            />

            <q-select
              v-model="form.role"
              :options="roleOptions"
              label="Role"
              :rules="[val => !!val || 'Role wajib dipilih']"
            />
          </q-form>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Simpan" color="primary" @click="onSubmit" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Dialog Konfirmasi Hapus -->
    <q-dialog v-model="showDeleteConfirm" persistent>
      <q-card>
        <q-card-section class="row items-center">
          <span class="q-ml-sm">Apakah Anda yakin ingin menghapus user ini?</span>
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Batal" color="primary" v-close-popup />
          <q-btn flat label="Hapus" color="negative" @click="deleteUser" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useQuasar } from 'quasar';
import { useUserStore } from '../stores/user-store';

const $q = useQuasar();
const userStore = useUserStore();

const loading = ref(false);
const users = ref([]);
const showDialog = ref(false);
const showDeleteConfirm = ref(false);
const isEditing = ref(false);
const selectedUser = ref(null);

const columns = [
  { name: 'username', label: 'Username', field: 'username', align: 'left' },
  { name: 'fullName', label: 'Nama Lengkap', field: 'fullName', align: 'left' },
  { 
    name: 'role', 
    label: 'Role', 
    field: row => formatRole(row.role), 
    align: 'left' 
  },
  { name: 'actions', label: 'Actions', field: 'actions', align: 'center' }
];

const roleOptions = ['vendor', 'em', 'user']; // Ubah menjadi lowercase

const form = ref({
  username: '',
  password: '',
  fullName: '',
  role: null
});

const resetForm = () => {
  form.value = {
    username: '',
    password: '',
    fullName: '',
    role: null
  };
};

const loadUsers = async () => {
  loading.value = true;
  try {
    const data = await userStore.getAllUsers();
    users.value = data;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal memuat daftar user'
    });
  } finally {
    loading.value = false;
  }
};

const openCreateDialog = () => {
  isEditing.value = false;
  resetForm();
  showDialog.value = true;
};

const openEditDialog = (user) => {
  isEditing.value = true;
  selectedUser.value = user;
  form.value = {
    username: user.username,
    password: '',
    fullName: user.fullName,
    role: user.role
  };
  showDialog.value = true;
};

const confirmDelete = (user) => {
  selectedUser.value = user;
  showDeleteConfirm.value = true;
};

const onSubmit = async () => {
  try {
    // Pastikan role dalam lowercase
    const userData = {
      ...form.value,
      role: form.value.role.toLowerCase()
    };

    if (isEditing.value) {
      await userStore.updateUser(selectedUser.value.id, userData);
      $q.notify({
        type: 'positive',
        message: 'User berhasil diperbarui'
      });
    } else {
      await userStore.createUser(userData);
      $q.notify({
        type: 'positive',
        message: 'User berhasil ditambahkan'
      });
    }
    showDialog.value = false;
    loadUsers();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Gagal menyimpan user'
    });
  }
};

const deleteUser = async () => {
  try {
    await userStore.deleteUser(selectedUser.value.id);
    $q.notify({
      type: 'positive',
      message: 'User berhasil dihapus'
    });
    loadUsers();
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Gagal menghapus user'
    });
  }
};

// Untuk menampilkan data di tabel, tambahkan fungsi untuk mengkapitalisasi role
const formatRole = (role) => {
  return role?.toUpperCase() || '';
};

onMounted(() => {
  loadUsers();
});
</script>

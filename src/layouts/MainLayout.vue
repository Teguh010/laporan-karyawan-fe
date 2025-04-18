<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="arrow_back"
          aria-label="Back"
          @click="goBack"
        />

        <q-toolbar-title>
          Laporan Karyawan
        </q-toolbar-title>

        <q-btn
          flat
          dense
          round
          icon="logout"
          aria-label="Logout"
          @click="logout"
        />
      </q-toolbar>
    </q-header>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth-store';
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const goBack = () => {
  router.back();
};

const logout = () => {
  authStore.logout();
  $q.notify({
    type: 'info',
    message: 'Logged out successfully'
  });
  router.push('/login');
};
</script>

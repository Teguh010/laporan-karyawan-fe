<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
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

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
      :width="250"
    >
      <q-list padding>
        <q-item-label header>Menu Navigasi</q-item-label>

        <q-item
          clickable
          v-ripple
          to="/"
          exact
        >
          <q-item-section avatar>
            <q-icon name="description" />
          </q-item-section>
          <q-item-section>
            Daftar Laporan
          </q-item-section>
        </q-item>

        <q-item
          clickable
          v-ripple
          to="/users"
          exact
        >
          <q-item-section avatar>
            <q-icon name="people" />
          </q-item-section>
          <q-item-section>
            Manajemen User
          </q-item-section>
        </q-item>

        <q-separator spaced />

        <q-item
          clickable
          v-ripple
          @click="logout"
        >
          <q-item-section avatar>
            <q-icon name="logout" />
          </q-item-section>
          <q-item-section>
            Logout
          </q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useAuthStore } from 'stores/auth-store';
import { useQuasar } from 'quasar';

const router = useRouter();
const authStore = useAuthStore();
const $q = useQuasar();

const leftDrawerOpen = ref(false);

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value;
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

<style lang="scss" scoped>
.q-drawer {
  background-color: #f5f5f5;
}

.q-item {
  border-radius: 8px;
  margin: 4px 8px;

  &.q-router-link-exact-active {
    background-color: $primary;
    color: white;

    .q-icon {
      color: white;
    }
  }
}
</style>

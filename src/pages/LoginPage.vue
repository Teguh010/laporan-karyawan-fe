<template>
  <q-page class="flex flex-center">
    <div class="row justify-center">
      <q-card class="login-card q-pa-md">
          <q-card-section>
            <div class="text-h6 text-center q-mb-md">Login</div>
          </q-card-section>

          <q-card-section>
            <q-form @submit="onSubmit" class="q-gutter-md">
              <q-input
                v-model="form.username"
                label="Username"
                :rules="[val => !!val || 'Username is required']"
                outlined
              />

              <q-input
                v-model="form.password"
                label="Password"
                :type="isPwd ? 'password' : 'text'"
                :rules="[val => !!val || 'Password is required']"
                outlined
              >
                <template v-slot:append>
                  <q-icon
                    :name="isPwd ? 'visibility_off' : 'visibility'"
                    class="cursor-pointer"
                    @click="isPwd = !isPwd"
                  />
                </template>
              </q-input>

              <div>
                <q-btn
                  label="Login"
                  type="submit"
                  color="primary"
                  class="full-width"
                  :loading="authStore.loading"
                />
              </div>
            </q-form>
          </q-card-section>
          version 4
        </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth-store';
import { androidLog } from 'boot/logger';
import axios from 'axios';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const isPwd = ref(true);
const form = ref({
  username: '',
  password: ''
});

const onSubmit = async () => {
  try {
    // Test koneksi dulu
    $q.notify({
      type: 'info',
      message: `Connecting to: ${api.defaults.baseURL}`
    });

    // Tunggu sebentar agar notifikasi bisa dibaca
    await new Promise(resolve => setTimeout(resolve, 1000));

    androidLog.log('Login attempt with username:', form.value.username);
    await authStore.login(form.value.username, form.value.password);
    
    androidLog.log('Login successful');
    $q.notify({
      type: 'positive',
      message: 'Login successful'
    });

    router.push('/');
  } catch (error) {
    androidLog.error('Login failed:', error);
    androidLog.error('Error details:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    let errorMessage = 'Login failed';
    if (error.message === 'Network Error') {
      errorMessage = 'Cannot connect to server. Please check your internet connection or server URL';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }
    
    $q.notify({
      type: 'negative',
      message: errorMessage
    });
  }
};
</script>

<style lang="scss" scoped>
.login-card {
  width: 100%;
}
</style>

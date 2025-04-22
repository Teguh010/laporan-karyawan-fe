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
          version 7
        </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth-store';
import { api } from 'boot/axios';
import { androidLog } from 'boot/logger';

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();

const isPwd = ref(true);
const form = ref({
  username: '',
  password: ''
});

const onSubmit = async () => {
  try {
    androidLog.log('Starting login process...');

    // Modifikasi log untuk menghindari akses ke api.defaults
    androidLog.log('Proceeding with login attempt:', {
      username: form.value.username,
      // Hapus referensi ke api.defaults.baseURL
    });

    await authStore.login(form.value.username, form.value.password);

    androidLog.log('Login successful');
    $q.notify({
      type: 'positive',
      message: 'Login successful'
    });

    await router.replace('/');
  } catch (error) {
    androidLog.error('Login process failed:', {
      message: error.message,
      type: error.constructor.name,
      stack: error.stack
    });

    let errorMessage = 'Login failed';
    if (error.message === 'Network Error') {
      errorMessage = 'Cannot connect to server. Please check your internet connection';
    } else if (error.response?.data?.message) {
      errorMessage = error.response.data.message;
    }

    $q.notify({
      type: 'negative',
      message: errorMessage,
      timeout: 2000
    });
  }
};
</script>

<style lang="scss" scoped>
.login-card {
  width: 100%;
}
</style>

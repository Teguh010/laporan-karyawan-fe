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
        </q-card>
    </div>
  </q-page>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from 'stores/auth-store';

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
    await authStore.login(form.value.username, form.value.password);
    
    $q.notify({
      type: 'positive',
      message: 'Login successful'
    });

    // Redirect to home page
    router.push('/');
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Login failed'
    });
  }
};
</script>

<style lang="scss" scoped>
.login-card {
  width: 100%;
}
</style>
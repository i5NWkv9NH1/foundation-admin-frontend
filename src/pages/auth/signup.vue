<script lang="ts" setup>
import axios from 'axios';
import { useAppStore } from '@/stores/app';
import { validationRules } from '@/helpers';

const appStore = useAppStore();
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
});

const loading = ref(false);

async function onSubmit(formEl: any) {
  const { valid } = await formEl.validate();
  if (valid) {
    try {
      loading.value = true;
      await axios.post('http://localhost:3200/api/auth/signup', {
        ...form,
        uniqueId: appStore.uniqueId
      });
      // TODO: store, navigate
    } catch (error) {
      alert('Error submitting form:' + error);
    } finally {
      loading.value = false;
    }
  } else {
    alert('Front-end validation failed');
    // Handle captcha refresh
  }
}
</script>

<template>
  <VSheet>
    <div class="text-h4 mb-4 font-weight-bold">Sign Up</div>
    <Authentication
      :loading="loading"
      submit-text="Signup"
      @submit="onSubmit"
    >
      <template #fields>
        <VLabel class="mb-2"> Username </VLabel>
        <VTextField
          v-model="form.username"
          class="mb-2"
          placeholder="Please input username"
          :rules="validationRules.username"
          variant="solo"
        />
        <VLabel class="mb-2"> Password </VLabel>
        <VTextField
          v-model="form.password"
          class="mb-2"
          placeholder="Please input password"
          :rules="validationRules.password"
          type="password"
          variant="solo"
        />
        <VLabel class="mb-2"> Confirm Password </VLabel>
        <VTextField
          v-model="form.confirmPassword"
          class="mb-2"
          placeholder="Confirm your password"
          type="password"
          variant="solo"
        />
        <CaptchaInput
          v-model="form.captcha"
          placeholder="Text of the graphic shown on the right."
          :rules="validationRules.captcha"
        />
      </template>
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="mdi-arrow-left"
          rounded="0"
          text="Already have an account?"
          to="/auth/signin"
          variant="text"
        />
      </template>
    </Authentication>
  </VSheet>
</template>

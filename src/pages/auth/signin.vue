<script lang="ts" setup>
import axios from 'axios';
import { useAppStore } from '@/stores';
import { validationRules } from '@/helpers';

const appStore = useAppStore();
const form = reactive({
  username: '',
  password: '',
  captcha: ''
});

const loading = ref(false);

async function onSubmit(formEl: any) {
  const { valid } = await formEl.validate();
  if (valid) {
    try {
      loading.value = true;
      await axios.post('http://localhost:3200/api/system/auth/signin', {
        ...form,
        uniqueId: appStore.uniqueId
      });
      // TODO: store and navigate
    } catch (error) {
      alert('Error submitting form: ' + error);
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
    <div class="text-h4 mb-4 font-weight-bold">Signin</div>
    <Authentication
      :loading="loading"
      submit-text="Signin"
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
        <CaptchaInput
          v-model="form.captcha"
          placeholder="Text of the graphic shown on the right."
          :rules="validationRules.captcha"
        />
      </template>
      <template #actions>
        <VBtn
          color="primary"
          prepend-icon="mdi-arrow-right"
          rounded="0"
          text="Don't have an account?"
          to="/auth/signup"
          variant="text"
        />
        <VBtn
          class="text-decoration-underline"
          color="red"
          prepend-icon="mdi-lock"
          rounded="0"
          size="small"
          text="Forget your password?"
          to="/auth/reset-password"
          variant="text"
        />
      </template>
    </Authentication>
  </VSheet>
</template>

<script lang="ts" setup>
import { useAppStore } from '@/stores/app';
import { validationRules } from '@/helpers';
import { useAuthStore } from '@/stores';

const loading = ref(false);
const { signup } = useAuthStore();
const { uniqueId, updateAuthVideo } = useAppStore();
const captchaEl = ref();
const form = reactive({
  username: '',
  password: '',
  confirmPassword: '',
  captcha: ''
});
const confirmPasswordRules = computed(() => {
  return [(v: string) => !!v || 'Please confirm your password', (v: string) => v === form.password || 'Passwords do not match'];
});
async function onSubmit(formEl: any) {
  const { valid } = await formEl.validate();
  if (!valid) {
    return;
  }
  try {
    loading.value = true;
    await signup({ ...form, uniqueId });
  } catch (error) {
    await captchaEl.value.fetchCaptcha();
    form.captcha = '';
    throw error;
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  updateAuthVideo('/public/signup.mp4');
});
</script>

<template>
  <VCard>
    <VCardSubtitle class="text-h4 mb-4 font-weight-bold">Sign Up</VCardSubtitle>
    <AuthenticationForm
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
          :rules="confirmPasswordRules"
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
          text="Already have an account?"
          to="/auth/signin"
          variant="text"
        />
      </template>
    </AuthenticationForm>
  </VCard>
</template>

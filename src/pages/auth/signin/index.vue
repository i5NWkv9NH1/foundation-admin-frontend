<script lang="ts" setup>
import axios from 'axios';
import { useAppStore } from '@/stores/app';
import { VCard, VCardActions, VCardText, VCol, VContainer, VForm, VImg, VLabel, VRow, VSlideXTransition, VTextField } from 'vuetify/components';
import { validationRules } from '@/helpers';
import { useCaptcha } from '@/composables';

const appStore = useAppStore();
const form = reactive({
  username: '',
  password: '',
  captcha: ''
});

const formEl = ref<any>(null);
const loading = ref(false);
const { captchaImage, countdown, isRunning, isGetCaptcha, fetchCaptcha } = useCaptcha();

async function onSubmit() {
  const { valid } = await formEl.value.validate();
  if (valid) {
    try {
      loading.value = true;
      const response = await axios.post('http://localhost:3200/api/system/auth/signin', { ...form, uniqueId: appStore.uniqueId });
      console.log(response.data);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      loading.value = false;
    }
  } else {
    alert('Front-end validation failed');
    await fetchCaptcha();
  }
}
</script>

<template>
  <VContainer fluid>
    <VRow
      align="center"
      class="full-height"
      justify="center"
      no-gutters
    >
      <VCol cols="12">
        <div class="text-h4 mb-4 font-weight-bold">Signin</div>
        <VForm
          ref="formEl"
          @submit.prevent="onSubmit"
        >
          <VCard>
            <VCardText>
              <VLabel class="mb-2">Username</VLabel>
              <VTextField
                v-model="form.username"
                class="mb-2"
                placeholder="Please input username"
                :rules="validationRules.username"
                variant="solo"
              />
              <VLabel class="mb-2">Password</VLabel>
              <VTextField
                v-model="form.password"
                class="mb-2"
                placeholder="Please input password"
                :rules="validationRules.password"
                type="password"
                variant="solo"
              />
              <VTextField
                v-model="form.captcha"
                :placeholder="!captchaImage ? 'Text of the graphic shown on the right.' : ''"
                :rules="validationRules.captcha"
                variant="solo"
              >
                <template
                  v-if="isGetCaptcha"
                  #details
                >
                  <div>{{ countdown }} seconds to refetch captcha</div>
                </template>
                <template #append-inner>
                  <VSlideXTransition hide-on-leave>
                    <VBtn
                      v-if="!captchaImage"
                      color="primary"
                      variant="outlined"
                      @click.stop="fetchCaptcha"
                    >
                      <span>Captcha</span>
                    </VBtn>
                    <VBtn
                      v-else
                      :disabled="isRunning"
                      height="auto"
                      variant="flat"
                      @click="fetchCaptcha"
                    >
                      <VImg
                        cover
                        height="50"
                        v-html="captchaImage"
                      />
                    </VBtn>
                  </VSlideXTransition>
                </template>
              </VTextField>
            </VCardText>
            <VCardActions>
              <VBtn
                block
                color="primary"
                :loading="loading"
                rounded="lg"
                text="Signin"
                type="submit"
                variant="flat"
              />
            </VCardActions>
            <VCardActions>
              <VBtn
                color="primary"
                prepend-icon="mdi-arrow-right"
                rounded="0"
                text="Don't have an account?"
                to="/auth/signup"
                variant="text"
              />
            </VCardActions>
            <VCardActions>
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
            </VCardActions>
          </VCard>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

<script lang="ts" setup>
import { useCaptcha } from '@/composables';

const { captchaImage, countdown, isRunning, isGetCaptcha, fetchCaptcha } =
  useCaptcha();
const props = defineProps<{
  rules: Array<(value: string) => boolean | string>;
  placeholder?: string;
}>();
const modelValue = defineModel<string>('modelValue', { required: true });
const updateCaptcha = () => fetchCaptcha();

onMounted(async () => {
  await fetchCaptcha();
});
</script>

<template>
  <VTextField
    v-model="modelValue"
    :placeholder="props.placeholder"
    :rules="props.rules"
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
          @click.stop="updateCaptcha"
        >
          <span>Captcha</span>
        </VBtn>
        <VBtn
          v-else
          :disabled="isRunning"
          height="auto"
          variant="flat"
          @click="updateCaptcha"
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
</template>

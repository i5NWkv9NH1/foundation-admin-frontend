<script lang="ts" setup>
import { useCaptcha } from '@/composables'

const { image, countdown, isRunning, isGetCaptcha, fetchCaptcha } = useCaptcha()
const props = defineProps<{
  rules: Array<(value: string) => boolean | string>
  placeholder?: string
}>()
const modelValue = defineModel<string>('modelValue', { required: true })
const updateCaptcha = () => {
  if (isRunning.value) return
  fetchCaptcha()
}
// ? useCaptcha is shared composable
// ? expose it's state
defineExpose({
  fetchCaptcha: fetchCaptcha
})
onMounted(async () => {
  await fetchCaptcha()
})
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
          v-if="!image"
          color="primary"
          variant="outlined"
          @click.stop="updateCaptcha"
        >
          <span>Captcha</span>
        </VBtn>
        <img
          v-else
          cover
          height="50"
          :src="image"
          :key="image"
          @click="updateCaptcha"
          :class="[isRunning ? 'cursor-default' : 'cursor-pointer', 'captcha']"
        />
      </VSlideXTransition>
    </template>
  </VTextField>
</template>

<style lang="scss" scoped>
.captcha {
  background: rgb(var(--v-theme-on-primary));
}
</style>

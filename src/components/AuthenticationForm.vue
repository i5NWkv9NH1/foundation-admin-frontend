<!-- TOOD: Form generator -->
<script lang="ts" setup>
const props = defineProps<{
  loading: boolean
  submitText: string
}>()
const emits = defineEmits<{
  (formEl: 'submit', forEl: any): void
}>()
const formEl = ref<any>()
function handleSubmit() {
  emits('submit', formEl.value)
}
</script>

<template>
  <VForm ref="formEl" @submit.prevent="handleSubmit">
    <VCard color="transparent" variant="flat" :loading="props.loading">
      <VCardText>
        <slot name="fields" />
      </VCardText>
      <VCardActions>
        <VBtn block color="primary" :disabled="props.loading" :text="props.submitText" type="submit" variant="flat" />
      </VCardActions>
      <VCardActions>
        <slot name="actions" />
      </VCardActions>
    </VCard>
  </VForm>
</template>

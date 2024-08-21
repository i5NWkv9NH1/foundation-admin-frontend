<script setup lang="ts">
type Mode = 'single' | 'multiple'
interface Props {
  mode: 'single' | 'multiple'
}
const modelValue = defineModel<boolean>('modelValue', { required: true })
const emits = defineEmits<{
  (e: 'confirm', mode: Mode): void
}>()
const props = withDefaults(defineProps<Props>(), {
  mode: 'single'
})
const onClose = () => (modelValue.value = false)
const onConfirm = () => {
  onClose()
  emits('confirm', props.mode)
}
</script>

<template>
  <VDialog
    v-model="modelValue"
    max-width="500"
  >
    <VCard>
      <VCardTitle> Confirm Deletion </VCardTitle>
      <VCardText>
        Are you sure you want to delete
        <strong class="text-error">
          {{ props.mode === 'multiple' ? 'items?' : 'this item?' }}
        </strong>
      </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon start> mdi-close-thick </VIcon>
          <span>Cancel</span>
        </VBtn>
        <VBtn
          color="error"
          variant="elevated"
          @click="onConfirm"
        >
          <VIcon
            start
            icon="mdi-trash-can-outline"
          />
          <span>Confirm</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

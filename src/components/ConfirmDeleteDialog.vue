<script setup lang="ts">
const props = withDefaults(
  defineProps<{
    modelValue?: boolean;
    action?: 'single' | 'multiple'; // Added action prop
  }>(),
  {
    modelValue: false,
    action: 'single'
  }
);

const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm', action: 'single' | 'multiple'): void; // Pass action type on confirm
  (e: 'close'): void;
}>();

const isVisible = ref(props.modelValue);
// Watch for changes in prop to update local ref
watch(
  () => props.modelValue,
  (value) => {
    isVisible.value = value;
  }
);
// Watch for changes in local ref to emit event
watch(isVisible, (value) => {
  emits('update:modelValue', value);
});
// Emit events for dialog actions
const onClose = () => {
  emits('update:modelValue', false);
  emits('close');
};
const onConfirm = () => {
  emits('confirm', props.action);
  onClose(); // Optionally close the dialog after confirmation
};
</script>

<template>
  <VDialog
    v-model:modelValue="isVisible"
    max-width="500"
  >
    <VCard>
      <VCardTitle> Confirm Deletion </VCardTitle>
      <VCardText> Are you sure you want to delete this item? </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon start>mdi-close-thick</VIcon>
          <span>Cancel</span>
        </VBtn>
        <VBtn
          color="error"
          variant="elevated"
          @click="onConfirm"
        >
          <VIcon start>mdi-trash-can-outline</VIcon>
          <span>Delete</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
import { Organization } from '@/types';

interface Props {
  items: Organization[]
  // organizationIds: string[];
  organizationIds: string[]
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  organizationIds: () => []
})
const modelValue = defineModel<boolean>('modelValue', { required: true })
const emits = defineEmits<{
  (e: 'save', selected: string[]): void
}>()
const selected = defineModel<string[]>('selected', { required: true })
watch(
  () => props.organizationIds,
  () => {
    selected.value = props.organizationIds
  }
)
const onSave = () => {
  emits('save', toRaw(selected.value))
  modelValue.value = false
}
</script>

<template>
  <VDialog v-model="modelValue" scrollable max-width="400px" max-height="400px" close-on-back>
    <VCard>
      <VCardTitle>Organizations</VCardTitle>
      <VCardText>
        <TreeSelector :items="props.items" v-model="selected" />
      </VCardText>
      <VCardActions>
        <VBtn @click="modelValue = false">
          <VIcon icon="mdi-close-thick" start />
          <span>Cancel</span>
        </VBtn>
        <VBtn @click="onSave">
          <VIcon icon="mdi-content-save-outline" start />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

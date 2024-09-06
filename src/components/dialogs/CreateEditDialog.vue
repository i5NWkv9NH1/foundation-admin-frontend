<script lang="ts" setup>
import { FormField } from '@/types';
import { VForm } from 'vuetify/components';

interface Props {
  fields: FormField[]
  isEidting: boolean
  form: any
}
const props = defineProps<Props>()
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', form: any): void
  (e: 'close'): void
}>()
const modelValue = defineModel<boolean>('modelValue', {
  required: true,
  default: false
})
const formEl = ref()
const form = ref({ ...props.form })
watch(
  () => props.form,
  () => {
    formEl.value.reset()
    formEl.value.resetValidation()
    form.value = props.form
  }
)
/**
 * * Emits
 */
async function onSave() {
  const { valid } = await formEl.value.validate()
  if (!valid) return
  emits('save', form.value)
}
function onClose() {
  modelValue.value = false
  emits('close')
}
</script>

<template>
  <VDialog v-model="modelValue" max-width="600px" scroll-strategy="block" scrollable>
    <VCard>
      <VCardTitle>
        {{ props.isEidting ? 'Edit Item' : 'New Item' }}
      </VCardTitle>
      <VCardSubtitle v-if="props.isEidting"> Editing {{ form.id || 'New Item' }} {{ form.name || form.label || '' }}
      </VCardSubtitle>
      <VCardText>
        <VForm ref="formEl">
          <GeneratorField :fields="props.fields" :form="form" />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon start icon="mdi-close-thick" />
          <span>Cancel</span>
        </VBtn>
        <VBtn color="primary" @click="onSave">
          <VIcon start icon="mdi-content-save-outlined" />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

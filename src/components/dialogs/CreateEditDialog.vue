<script lang="ts" setup>
import { FormField } from '@/types';
import { VForm } from 'vuetify/components';

interface Props {
  fields: FormField[];
  isEidting: boolean;
}
const props = defineProps<Props>();
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'save', form: Record<string, any>): void;
  (e: 'close'): void;
}>();
const modelValue = defineModel<boolean>('modelValue', { required: true, default: false });
const form = defineModel<Record<string, any>>('form', { required: true });
const formRef = ref<InstanceType<typeof VForm> | null>(null);
const isValid = ref(true);
/**
 * * Emits
 */
const closeDialog = () => (modelValue.value = false);
const onClose = () => {
  closeDialog();
  emits('close');
};
const onSave = () => {
  closeDialog();
  emits('save', form.value);
};
</script>

<template>
  <VDialog
    v-model="modelValue"
    max-width="600px"
    scroll-strategy="block"
    scrollable
  >
    <VCard>
      <VCardTitle>
        {{ props.isEidting ? 'Edit Item' : 'New Item' }}
      </VCardTitle>
      <VCardSubtitle v-if="props.isEidting"> Editing {{ form.id || 'New Item' }} </VCardSubtitle>
      <VCardText>
        <VForm ref="formRef">
          <GeneratorField
            :fields="props.fields"
            :form="form"
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon
            start
            icon="mdi-close-thick"
          />
          <span>Cancel</span>
        </VBtn>
        <VBtn
          color="primary"
          :disabled="!isValid"
          @click="onSave"
        >
          <VIcon
            start
            icon="mdi-content-save-outlined"
          />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

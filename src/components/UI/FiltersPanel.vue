<script setup lang="ts">
import { FormField } from '@/types';

interface Props {
  fields: FormField[];
}

const props = defineProps<Props>();
const filters = defineModel<Record<string, any>>('modelValue', {
  default: {},
  required: true
});
const emits = defineEmits<{
  (e: 'submit', filters: Record<string, any>): void;
  (e: 'reset'): void;
}>();

const submitFilters = () => {
  emits('submit', filters.value);
};
const resetFilters = () => {
  emits('reset');
};
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol
          v-for="(field, index) in props.fields"
          :key="index"
          cols="12"
          :md="field.type === 'textarea' ? 12 : 6"
        >
          <!-- Text Field -->
          <VTextField
            v-if="field.type === 'text'"
            v-model="filters[field.name]"
            :required="field.required"
            v-bind="field.attrs"
            :rules="field.rules"
            variant="plain"
            :prepend-icon="`mdi-filter`"
            placeholder="Type something"
            hide-spin-buttons
          />

          <!-- Textarea Field -->
          <VTextarea
            v-if="field.type === 'textarea'"
            v-model="filters[field.name]"
            :label="field.label"
            :placeholder="field.placeholder"
            :required="field.required"
            v-bind="field.attrs"
            :rules="field.rules"
          />

          <!-- Select Field -->
          <VSelect
            v-if="field.type === 'select'"
            v-model="filters[field.name]"
            :chips="field.chips"
            :items="field.options"
            :label="field.label"
            :multiple="field.multiple"
            :required="field.required"
            v-bind="field.attrs"
            :rules="field.rules"
          />

          <!-- Checkbox Field -->
          <VCheckbox
            v-if="field.type === 'checkbox'"
            v-model="filters[field.name]"
            :label="field.label"
            :required="field.required"
            v-bind="field.attrs"
            :rules="field.rules"
          />

          <!-- Switch Field -->
          <VSwitch
            v-if="field.type === 'switch'"
            v-model="filters[field.name]"
            :label="field.label"
            :required="field.required"
            v-bind="field.attrs"
            :rules="field.rules"
          />

          <!-- Date Picker Field -->
          <VDatePicker
            v-if="field.type === 'date'"
            v-model="filters[field.name]"
            :label="field.label"
            :required="field.required"
            v-bind="field.attrs"
            :rules="field.rules"
          />
        </VCol>
      </VRow>
      <VBtn
        class="mr-2"
        color="primary"
        @click="submitFilters"
        variant="outlined"
      >
        <span>Apply</span>
      </VBtn>
      <VBtn
        variant="plain"
        @click="resetFilters"
      >
        <span>Reset</span>
      </VBtn>
    </VCardText>
  </VCard>
</template>

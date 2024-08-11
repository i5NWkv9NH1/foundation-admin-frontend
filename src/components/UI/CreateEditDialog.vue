<script setup lang="ts">
import { FormComponent, FormField } from '@/types';
import {
  VAutocomplete,
  VBtn,
  VCard,
  VCardActions,
  VCardSubtitle,
  VCardText,
  VCardTitle,
  VCheckbox,
  VChipGroup,
  VCol,
  VColorPicker,
  VContainer,
  VDatePicker,
  VDialog,
  VFileInput,
  VForm,
  VRadio,
  VRadioGroup,
  VRow,
  VSelect,
  VSlider,
  VSwitch,
  VTextField
} from 'vuetify/components';

// Define props
const props = defineProps<{
  // isVisible: boolean;
  fields: FormField[];
  isEdit: boolean;
}>();
// Define emits
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'submit', form: Record<string, any>): void;
  (e: 'close'): void;
}>();

// const isVisible = ref(props.isVisible);
const isVisible = defineModel<boolean>('isVisible', {
  default: false,
  required: true
});
const form = defineModel<Record<string, any>>('form', {
  required: true
});
const formRef = ref<InstanceType<typeof VForm> | null>(null);
// TODO: add validation
const isValid = ref(true);
// Watch for changes in visibility
// watch(
//   () => props.isVisible,
//   () => {
//     isVisible.value = props.isVisible;
//   }
// );
// watch(isVisible, (value) => {
//   emits('update:modelValue', value);
// });
// Clear form data when dialog closes
const onClose = () => {
  isVisible.value = false;
};
const onSubmit = () => {
  // TODO: validation
  emits('submit', form.value);
  isVisible.value = false;
};

// Determine the appropriate component for each field type
const fieldComponent = (type: FormComponent): Component => {
  switch (type) {
    case 'text':
    case 'number':
      return VTextField;
    case 'select':
      return VSelect;
    case 'checkbox':
      return VCheckbox;
    case 'date':
      return VDatePicker;
    case 'switch':
      return VSwitch;
    case 'textarea':
      return VTextField;
    case 'autocomplete':
      return VAutocomplete;
    case 'file':
      return VFileInput;
    case 'slider':
      return VSlider;
    case 'chips':
      return VChipGroup;
    case 'color-picker':
      return VColorPicker;
    case 'radios':
      return VRadioGroup;
    default:
      return VTextField;
  }
};
</script>

<template>
  <VDialog
    v-model="isVisible"
    close-on-back
    max-width="600px"
    scroll-strategy="block"
    scrollable
  >
    <VCard>
      <VCardTitle>
        {{ props.isEdit ? 'Edit Item' : 'New Item' }}
      </VCardTitle>
      <VCardSubtitle v-if="props.isEdit">
        Editing {{ form.id || 'New Item' }}
      </VCardSubtitle>
      <VCardText>
        <VForm
          ref="formRef"
          v-model:valid="isValid"
        >
          <VContainer>
            <VSheet class="text-center my-4">
              <VSlideYTransition>
                <VAvatar
                  v-if="
                    !!props.fields.filter(
                      (field) => field.name === 'avatarUrl'
                    ) && !!form['avatarUrl']
                  "
                  :image="form['avatarUrl']"
                  size="120"
                />
                <VAvatar
                  v-else
                  color="secondary"
                  size="120"
                >
                  <span class="text-h4">Avatar</span>
                </VAvatar>
                <!-- Upload -->
              </VSlideYTransition>
            </VSheet>
            <VRow
              v-for="(field, index) in props.fields"
              :key="index"
            >
              <VCol
                :cols="field.type === 'radios' ? 12 : 12"
                :md="field.type === 'radios' ? 12 : 12"
              >
                <!-- TODO: 优化 -->
                <!-- 针对 radios 组件的特殊处理 -->
                <template v-if="field.type === 'radios'">
                  <VRadioGroup
                    v-model="form[field.name]"
                    v-bind="field.attrs"
                    inline
                  >
                    <VRadio
                      v-for="option in field.options"
                      :key="option.value"
                      :color="'primary'"
                      :label="option.text"
                      :value="option.value"
                    >
                      <template #label>
                        <strong :class="[`text-${option.color}`]">
                          {{ option.text }}
                        </strong>
                        <VIcon
                          v-if="option.icon"
                          start
                        >
                          {{ option.icon }}
                        </VIcon>
                      </template>
                    </VRadio>
                  </VRadioGroup>
                </template>
                <template v-else-if="field.type === 'select'">
                  <VSelect
                    v-model="form[field.name]"
                    :chips="field.chips"
                    :items="field.options"
                    v-bind="field.attrs"
                    :label="field.label"
                    :multiple="field.multiple"
                  />
                </template>
                <component
                  :is="fieldComponent(field.type)"
                  v-else
                  v-model="form[field.name]"
                  :data-json="JSON.stringify(field, null, 2)"
                  hide-details="auto"
                  :label="field.label"
                  :options="field.options"
                  :placeholder="field.placeholder"
                  :required="field.required"
                  :rules="field.rules"
                  v-bind="field.attrs"
                />
              </VCol>
            </VRow>
          </VContainer>
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon start> mdi-close-thick </VIcon>
          <span>Cancel</span>
        </VBtn>
        <VBtn
          color="primary"
          :disabled="!isValid"
          variant="elevated"
          @click="onSubmit"
        >
          <VIcon start> mdi-content-save-outline </VIcon>
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

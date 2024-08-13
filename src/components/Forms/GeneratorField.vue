<script setup lang="ts">
import { FormComponent, FormField } from '@/types/form';
import { VAutocomplete, VAvatar, VBtn, VCheckbox, VChipGroup, VColorPicker, VDatePicker, VFileInput, VRadioGroup, VSelect, VSlider, VSwitch, VTextField } from 'vuetify/components';

interface Props {
  fields: FormField[];
  form: Record<string, any>;
}
const props = defineProps<Props>();
function RenderField(type: FormComponent) {
  switch (type) {
    case 'avatar':
      return VAvatar;
    case 'btn':
    case 'button':
      return VBtn;
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
    case 'tree-activator':
      return;
    default:
      return VTextField;
  }
}
</script>

<template>
  <div>
    <VRow>
      <VCol
        cols="12"
        v-bind="field.attrs?.grid"
        v-for="(field, index) in props.fields"
        :key="index"
      >
        <!-- Avatar -->
        <template v-if="field.type === 'avatar'">
          <VSlideXTransition>
            <VAvatar
              :color="form.avatarUrl ? undefined : 'secondary'"
              :image="form.avatarUrl ?? undefined"
              size="120"
            />
          </VSlideXTransition>
        </template>
        <!-- Radio Group -->
        <template v-else-if="field.type === 'radios'">
          <VRadioGroup
            v-model="form[field.name]"
            v-bind="field.attrs"
          >
            <VRadio
              v-for="option in field.options"
              :key="option.value"
              :label="option.text"
              :value="option.value"
            >
              <template v-slot:label>
                <strong :class="[`text-${option.color}`]">{{ option.text }}</strong>
                <VIcon
                  v-if="option.icon"
                  start
                  :icon="option.icon"
                />
              </template>
            </VRadio>
          </VRadioGroup>
        </template>

        <!-- Select -->
        <!-- TreeView -->

        <component
          v-else
          :is="RenderField(field.type)"
          v-model="form[field.name]"
          :data="JSON.stringify(field)"
          v-bind="field.attrs"
          :label="field.label"
          :options="field.options"
          :rules="field.rules"
          :required="field.required"
          :placeholder="field.placeholder"
        />
      </VCol>
    </VRow>
  </div>
</template>

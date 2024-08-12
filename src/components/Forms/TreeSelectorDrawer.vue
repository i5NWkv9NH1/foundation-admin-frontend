<script setup lang="ts" generic="T extends BaseEntity">
import { BaseEntity } from '@/types';
import { buildTree, organizationFieldMapping } from '@/helpers';
interface Props {
  items: T[];
  activateds: string[];
  modelValue: boolean;
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  activateds: () => [] as string[]
});
// const activatedIds = defineModel<string[]>('activatedIds', { required: true });
const emits = defineEmits<{
  (e: 'save', activateds: string[]): void;
  (e: 'update:modelValue', value: boolean): void;
}>();
const modelValue = ref(props.modelValue);
watch(
  () => props.modelValue,
  () => {
    modelValue.value = props.modelValue;
  }
);
watch(modelValue, (value) => emits('update:modelValue', value));
const activateds = ref<string[]>(props.activateds);

function onSave() {
  emits('save', activateds.value!);
}
function onClose() {
  modelValue.value = false;
  // emits('close');
}
const itemChildren = (item: any): any =>
  item.children ? (item.children.length === 0 ? false : item.children) : false;
</script>
<template>
  <VDialog
    v-model:model-value="modelValue"
    scrollable
    max-width="400px"
    max-height="400"
    scroll-strategy="none"
  >
    <VCard height="100%">
      <VCardTitle>Organizations</VCardTitle>
      <VCardText>
        <VTreeview
          v-model:selected="activateds"
          :items="buildTree(props.items, organizationFieldMapping)"
          item-title="name"
          :item-children="itemChildren"
          selectable
          select-strategy="independent"
          item-props
          return-object
          :activatable="false"
          item-value="id"
          density="compact"
          open-all
        />
      </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon start>mdi-close-thick</VIcon>
          <span>Close</span>
        </VBtn>
        <VBtn
          color="primary"
          @click="onSave"
        >
          <VIcon start>icon="mdi-content-save-outline"</VIcon>
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

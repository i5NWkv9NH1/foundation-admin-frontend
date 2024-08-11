<script setup lang="ts" generic="T extends BaseEntity">
import { BaseEntity } from '@/types';

interface Props {
  itemTitle?: string;
  items: T[];
  activatedIds?: string[];
}
const props = withDefaults(defineProps<Props>(), {
  itemTitle: 'name',
  items: () => [],
  activatedIds: () => []
});
// ? two way binding for activatedIds
const emits = defineEmits(['update:activatedIds']);
const activatedIds = ref(props.activatedIds);
watch(
  () => props.activatedIds,
  () => (activatedIds.value = props.activatedIds)
);
watch(activatedIds, (newActivatedIds) =>
  emits('update:activatedIds', newActivatedIds)
);
const tree = computed(() => buildTree(props.items, organizationFieldMapping));
// Utility Functions
const itemChildren = (item: any): any =>
  item.children ? (item.children.length === 0 ? false : item.children) : false;
const itemTitle = (item: T) => `${item[props.itemTitle]}`;
const itemValue = (item: T) => item.id;
// ? el
</script>

<template>
  <VTreeview
    v-model:activated="activatedIds"
    v-bind="$attrs"
    activatable
    active-strategy="single-independent"
    color="primary"
    :item-children="itemChildren"
    item-props
    :item-title="itemTitle"
    :item-value="itemValue"
    open-all
    :items="tree"
    mandatory
  >
    <template
      v-for="(slotName, i) in Object.keys($slots) as unknown"
      :key="i"
      #[slotName]="slotProps"
    >
      <slot
        :name="slotName"
        v-bind="slotProps as any"
      />
    </template>
  </VTreeview>
</template>

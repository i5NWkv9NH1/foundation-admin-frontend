<script setup lang="ts" generic="T extends BaseEntity">
import { buildTree, organizationFieldMapping } from '@/helpers';
import { BaseEntity, SelectItemKey } from '@/types';

interface Props {
  items: T[] | undefined;
  activated?: string[];
  itemTitle?: SelectItemKey;
  itemValue?: SelectItemKey;
  activeStrategy?: 'single-independent' | 'independent';
  color?: string;
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  // itemTitle: (item: any) => `${item['name']}`,
  // itemValue: (item: any) => item.id,
  itemTitle: 'name',
  itemValue: 'id',
  activated: () => [],
  activeStrategy: 'single-independent',
  color: 'primary'
});
// ? two way binding for activatedIds
const emits = defineEmits(['update:activatedIds']);
const activated = ref(props.activated);
watch(
  () => props.activated,
  () => (activated.value = props.activated)
);
watch(activated, (newActivatedIds) => emits('update:activatedIds', newActivatedIds));
const tree = computed(() => buildTree(props.items, organizationFieldMapping));
// Utility Functions
const itemChildren = (item: any): any => (item.children ? (item.children.length === 0 ? false : item.children) : false);
// const itemTitle = (item: T) => `${item[props.itemTitle]}`;
// const itemValue = (item: T) => item.id;
// ? el
</script>

<template>
  <VTreeview
    v-model:activated="activated"
    v-bind="$attrs"
    activatable
    :active-strategy="props.activeStrategy"
    :color="props.color"
    :item-children="itemChildren"
    :item-title="props.itemTitle"
    :item-value="props.itemValue"
    :items="tree"
    open-all
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

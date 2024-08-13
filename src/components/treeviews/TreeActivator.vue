<script setup lang="ts" generic="T extends BaseEntity">
import { BaseEntity } from '@/types';

interface Props {
  items: T[] | undefined;
  activeStrategy?: 'single-independent' | 'independent';
  color?: string;
  itemTitle?: (item: T) => string;
  itemValue?: (item: T) => string | T;
  itemChildren?: (item: T) => boolean | T;
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  color: 'primary',
  activeStrategy: 'single-independent',
  itemTitle: (item: T) => item.label,
  itemValue: (item: T) => item.id as string,
  // itemChild: (item: T) => {
  //   if (!item.children) return false;
  //   return !!item.children.length ? item.children : false;
  // }
  itemChildren: (item: T) => (item.children ? (item.children.length === 0 ? false : item.children) : false)
});

const activated = defineModel('modelValue', { required: true });
</script>

<template>
  <!-- prettier-ignore -->
  <VTreeview
    v-model:activated="activated"
    v-bind="$attrs"
    activatable
    :active-strategy="props.activeStrategy"
    :items="props.items"
    :item-title="props.itemTitle"
    :item-value="(props.itemValue as any)"
    :item-children="(item: any): any => (item.children ?
     (item.children.length === 0 ? false : item.children)
     : false)"
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

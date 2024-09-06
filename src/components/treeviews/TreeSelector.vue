<!-- TODO: type field bug-->
<script setup lang="ts" generic="T extends BaseEntity & { label: string; id: string | number; children: any}">
import { BaseEntity } from '@/types';

interface Props {
  items: T[] | undefined
  selectStrategy?: 'single-independent' | 'independent'
  color?: string
  itemTitle?: (item: T) => string
  itemValue?: (item: T) => string | T
  itemChildren?: (item: T) => boolean | T
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  color: 'primary',
  activeStrategy: 'independent',
  itemTitle: (item: T) => item.label,
  itemValue: (item: T) => item.id!,
  itemChildren: (item: T) => (item.children ? (item.children.length === 0 ? false : item.children) : false)
})
const emits = defineEmits<{
  (e: 'save', activateds: string[]): void
  (e: 'update:modelValue', value: boolean): void
}>()
const selected = defineModel('modelValue', { required: true })
const itemChildren = (item: any): any => (item.children ? (item.children.length === 0 ? false : item.children) : false)
</script>
<template>
  <!-- prettier-ignore -->
  <VTreeview v-model:selected="selected" v-bind="$attrs" selectable :items="props.items" :item-title="props.itemTitle"
    :item-value="(props.itemValue as any)" :item-children="itemChildren" select-strategy='independent' return-object
    mandatory :activatable="false" open-all opened />
</template>

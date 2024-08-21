<script setup lang="ts" generic="T extends BaseEntity & { label?: string; name: string; id: string; children?: any[] } & unknown">
import { BaseEntity } from '@/types'
import { isEqual } from 'lodash'

interface Props {
  items: T[] | undefined
  activeStrategy?: 'single-independent' | 'independent'
  color?: string
  itemTitle?: (item: T) => string
  itemValue?: (item: T) => string | T
  itemChildren?: (item: T) => boolean | T
}
const props = withDefaults(defineProps<Props>(), {
  items: () => [],
  color: 'primary',
  activeStrategy: 'single-independent',
  // @ts-ignore
  itemTitle: (item: T) => item.label,
  itemValue: (item: T) => item.id,
  // @ts-ignore
  itemChildren: (item: T) => {
    if (!item.children) return false
    if (!item.children.length) return false
    return item.children
  }
})

const modelValue = defineModel('modelValue', { required: true })
function onUpdateActivated(value: string[] | unknown) {
  if (isEqual(value, modelValue.value)) return
  modelValue.value = value
}
</script>

<template>
  <!-- prettier-ignore -->
  <VTreeview
    :activated="modelValue"
    @update:activated="onUpdateActivated"
    v-bind="$attrs"
    open-all
    activatable
    :active-strategy="props.activeStrategy"
    :items="props.items"
    :item-title="props.itemTitle"
    :item-value="(props.itemValue as any)"
    :item-children="(item => {
      if (!item.children) return false
      if (!!!item.children.length) return false
      return item.children
    })"
  />
</template>

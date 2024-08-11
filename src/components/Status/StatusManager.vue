<template>
  <component
    :is="currentComponent"
    class="status-wrapper"
  >
    <slot v-if="status === UIStatus.OK" />
  </component>
</template>

<script setup lang="ts">
import { UIStatus } from '@/types';
import { computed } from 'vue';
import StatusLoading from './StatusLoading.vue';
import StatusEmpty from './StatusEmpty.vue';
import StatusFailed from './StatusFailed.vue';

const props = defineProps<{
  status: UIStatus;
}>();

const currentComponent = computed(() => {
  switch (props.status) {
    case UIStatus.LOADING:
      return StatusLoading; // 替换为实际的加载组件
    case UIStatus.EMPTY:
      return StatusEmpty; // 替换为实际的空状态组件
    case UIStatus.FAILED:
      return StatusFailed; // 替换为实际的错误状态组件
    case UIStatus.OK:
    default:
      return `div`; // 正常状态下直接渲染默认插槽内容
  }
});
</script>

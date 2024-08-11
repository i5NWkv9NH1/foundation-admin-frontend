<script lang="ts" setup>
const modelValue = defineModel<boolean>('modelValue', { required: true });
const progress = defineModel<number>('progress', { required: true });
const props = withDefaults(
  defineProps<{
    randomColor?: boolean;
    color?: string;
    height?: number;
  }>(),
  { randomColor: true, color: 'primary', height: 8 }
);
const rainbowColors = [
  'red', // Red
  'orange', // Orange
  'yellow', // Yellow
  'green', // Green
  'blue', // Blue
  'indigo', // Indigo
  'violet' // Violet
];
const chromatic = computed(() => {
  if (!props.randomColor) {
    return props.color;
  }
  const numColors = rainbowColors.length;
  const index = Math.floor((progress.value / 100) * (numColors - 1));
  return rainbowColors[index];
});
</script>

<template>
  <VProgressLinear
    v-if="modelValue"
    v-model="progress"
    absolute
    :color="chromatic"
    :height="props.height"
    left
    right
    striped
    top
    :value="progress"
  />
</template>

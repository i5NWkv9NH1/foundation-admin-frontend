<script setup lang="ts">
interface Notification {
  id: string;
  color: string;
  message: string;
}

const props = withDefaults(
  defineProps<{
    items: Notification[];
    absolute?: boolean;
    bottom?: boolean;
    closeButtonColor?: string;
    closeButtonIcon?: string;
    left?: boolean;
    multiLine?: boolean;
    nextButtonColor?: string;
    nextButtonCountText?: string;
    nextButtonText?: string;
    right?: boolean;
    timeout?: number;
    top?: boolean;
    vertical?: boolean;
  }>(),
  {
    absolute: false,
    bottom: false,
    closeButtonColor: 'white',
    closeButtonIcon: 'close',
    left: false,
    multiLine: false,
    nextButtonColor: 'white',
    nextButtonCountText: 'More',
    nextButtonText: 'Next',
    right: false,
    timeout: 6000,
    top: false,
    vertical: false
  }
);

const emit = defineEmits<{
  (e: 'remove', id: string): void;
}>();

const processing = ref(false);
const timeoutId = ref<number | null>(null);
const isVisible = ref(true);

const processItems = () => {
  processing.value = true;
  if (props.items.length > 0) {
    const item = props.items[0];
    timeoutId.value = setTimeout(() => {
      removeItem(item.id);
    }, props.timeout ?? 6000);
  }
  processing.value = false;
};

const removeItem = (id: string) => {
  if (timeoutId.value !== null) {
    clearTimeout(timeoutId.value);
  }
  emit('remove', id);
  if (props.items.length > 0) {
    processItems();
  }
};

watch(() => props.items, processItems, { immediate: true });
</script>

<template>
  <VSnackbar
    v-for="item in items"
    :key="item.id"
    :absolute="absolute"
    :bottom="bottom"
    :color="item.color"
    :left="left"
    :multi-line="multiLine"
    :right="right"
    :timeout="timeout"
    :top="top"
    :value="isVisible"
    :vertical="vertical"
  >
    {{ item.message }}
    <template #actions="{ isActive }">
      <VBtn
        v-if="items.length > 1"
        :actived="isActive"
        :color="nextButtonColor"
        @click="removeItem(item.id)"
      >
        {{ nextButtonText }} ({{ items.length - 1 }} {{ nextButtonCountText }})
      </VBtn>
      <VBtn
        v-else
        :actived="isActive"
        :color="closeButtonColor"
        icon
        @click="removeItem(item.id)"
      >
        <VIcon>{{ closeButtonIcon }}</VIcon>
      </VBtn>
    </template>
  </VSnackbar>
</template>

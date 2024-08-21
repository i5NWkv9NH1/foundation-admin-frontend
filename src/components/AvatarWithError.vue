<script setup lang="ts">
interface Props {
  image?: string | undefined | null
  size?: number
  color?: string
  icon?: string
  text?: string
}

const props = defineProps<Props>()
</script>

<template>
  <div v-if="props.image">
    <VAvatar
      :image="props.image"
      :size="props.size || 30"
    />
  </div>
  <div v-else>
    <VAvatar
      :color="props.color || 'primary'"
      :icon="props.icon"
    >
      <span v-if="props.text">
        {{ text }}
      </span>
    </VAvatar>
  </div>
</template>

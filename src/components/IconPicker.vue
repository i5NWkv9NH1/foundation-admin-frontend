<template>
  <VDialog v-model="dialog" max-width="800px">
    <VCard>
      <VCardTitle>Select an Icon</VCardTitle>
      <VCardText>
        <VContainer>
          <VRow>
            <VCol
              v-for="icon in icons"
              :key="icon"
              class="text-center"
              cols="4"
            >
              <VBtn
                :class="{ 'mdi-icon-active': selectedIcon === icon }"
                variant="plain"
                @click="selectIcon(icon)"
              >
                <v-icon class="mdi-icon" :icon="icon" />
              </VBtn>
              <div>{{ icon }}</div>
            </VCol>
          </VRow>
        </VContainer>
      </VCardText>
      <VCardActions>
        <VBtn @click="closeDialog">Cancel</VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

<script setup lang="ts">
  import { defineEmits, ref, watch } from 'vue'

  const emit = defineEmits(['update:icon'])
  const selectedIcon = ref('')

  const dialog = defineModel('dialog', { required: false, default: false })

  // prettier-ignore
  const icons = ref([
    'mdi-heart', 'mdi-star', 'mdi-account', 'mdi-settings', 'mdi-home',
    'mdi-email', 'mdi-phone', 'mdi-calendar', 'mdi-map', 'mdi-camera',
    'mdi-account-circle', 'mdi-alert', 'mdi-bell', 'mdi-chat', 'mdi-cloud',
    'mdi-credit-card', 'mdi-database', 'mdi-download', 'mdi-upload', 'mdi-file',
    'mdi-folder', 'mdi-lock', 'mdi-key', 'mdi-message', 'mdi-note',
    'mdi-pencil', 'mdi-printer', 'mdi-share', 'mdi-tag', 'mdi-trash-can',
    'mdi-trophy', 'mdi-weather-sunny', 'mdi-weather-rainy', 'mdi-heart-outline',
    'mdi-star-outline', 'mdi-account-outline', 'mdi-settings-outline', 'mdi-home-outline',
    'mdi-email-outline', 'mdi-phone-outline', 'mdi-calendar-outline', 'mdi-map-outline',
    'mdi-camera-outline', 'mdi-account-circle-outline', 'mdi-alert-outline', 'mdi-bell-outline',
    'mdi-chat-outline', 'mdi-cloud-outline', 'mdi-credit-card-outline', 'mdi-database-outline',
    'mdi-download-outline', 'mdi-upload-outline', 'mdi-file-outline', 'mdi-folder-outline',
    'mdi-lock-outline', 'mdi-key-outline', 'mdi-message-outline', 'mdi-note-outline',
    'mdi-pencil-outline', 'mdi-printer-outline', 'mdi-share-outline', 'mdi-tag-outline',
    'mdi-trash-can-outline', 'mdi-trophy-outline', 'mdi-weather-sunny-outline',
    'mdi-weather-rainy-outline',
  ])

  const selectIcon = (icon: string) => {
    selectedIcon.value = icon
    emit('update:icon', icon)
    dialog.value = false
  }

  const closeDialog = () => {
    dialog.value = false
  }
</script>

<style scoped>
.mdi-icon {
  font-size: 2rem;
}
.mdi-icon-active {
  border: 2px solid blue;
}
</style>

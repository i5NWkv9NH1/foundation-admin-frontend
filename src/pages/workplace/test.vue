<template>
  <VContainer>
    <div class="text-h4">Test</div>
    <VBtn @click="triggerSnackbar">Snackbar</VBtn>
  </VContainer>
</template>

<script setup lang="ts">
import { useSnackbar } from '@/composables/useSnackbar';

// Generate a random string
function generateRandomText(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

// Use the snackbar composable
const { showErrorMessage } = useSnackbar();

// Trigger snackbar with random text
function triggerSnackbar() {
  const randomText = generateRandomText(10); // Generate a random text of length 10
  showErrorMessage(randomText, 1000);
}
</script>

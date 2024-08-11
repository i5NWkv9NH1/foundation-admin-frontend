// useCaptcha.ts
import axios from 'axios';
import { ref } from 'vue';
import { useCountdown } from '@/composables';
import { useAppStore } from '@/stores/app';

export function useCaptcha() {
  const appStore = useAppStore();
  const captchaImage = ref('');
  const { countdown, isRunning, start } = useCountdown(60);
  const isGetCaptcha = ref(false);

  async function fetchCaptcha() {
    try {
      const response = await axios.post('http://localhost:3200/api/captcha/generate', {
        uniqueId: appStore.uniqueId
      });
      captchaImage.value = response.data;
      isGetCaptcha.value = true;
      start();
    } catch (error) {
      console.error('Error fetching captcha:', error);
    }
  }

  return { captchaImage, countdown, isRunning, isGetCaptcha, fetchCaptcha };
}

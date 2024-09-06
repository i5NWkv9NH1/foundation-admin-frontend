// useCaptcha.ts
import { apiCommon } from '@/api'
import { useCountdown } from '@/composables'
import { useAppStore } from '@/stores/app'
import { ref } from 'vue'

export function useCaptcha() {
  const appStore = useAppStore()
  const captchaImage = ref('')
  const { countdown, isRunning, start } = useCountdown(60)
  const isGetCaptcha = ref(false)

  const image = computed(() => URL.createObjectURL(new Blob([captchaImage.value], { type: 'image/svg+xml' })))

  async function fetchCaptcha(isStart?: boolean) {
    try {
      const response = await apiCommon.getCaptcha(appStore.uniqueId)
      captchaImage.value = response.data
      if (isStart) {
        isGetCaptcha.value = isStart
        start()
      }
    } catch (error) {
      console.error('Error fetching captcha:', error)
    }
  }

  return {
    captchaImage,
    image,
    countdown,
    isRunning,
    isGetCaptcha,
    fetchCaptcha
  }
}

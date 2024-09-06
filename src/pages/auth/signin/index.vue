<script lang="ts" setup>
import { validationRules } from '@/helpers';
import { useAppStore, useAuthStore } from '@/stores';
import { LocationQuery } from 'vue-router';

const form = reactive({
  username: '',
  password: '',
  captcha: ''
})

const loading = ref(false)
const { signin } = useAuthStore()
const { uniqueId } = useAppStore()
const captchaEl = ref()
const router = useRouter()
const route = useRoute()

function parseRedirect(): {
  path: string
  queryParams: Record<string, string>
} {
  const query: LocationQuery = route.query
  const redirect = (query.redirect as string) ?? '/'

  const url = new URL(redirect, window.location.origin)
  const path = url.pathname
  const queryParams: Record<string, string> = {}

  url.searchParams.forEach((value, key) => {
    queryParams[key] = value
  })

  return { path, queryParams }
}

async function onSubmit(formEl: any) {
  const { valid } = await formEl.validate()
  if (!valid) {
    return
  }
  try {
    loading.value = true
    await signin({
      account: { username: form.username, password: form.password },
      verify: { uniqueId, captcha: form.captcha }
    })
    const { path, queryParams } = parseRedirect()
    router.push({ path: path, query: queryParams })
  } catch (error) {
    await captchaEl.value.fetchCaptcha()
    form.captcha = ''
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <VCard class="pa-4">
    <VCardSubtitle class="text-h4 mb-4 font-weight-bold">Signin</VCardSubtitle>
    <AuthenticationForm :loading="loading" submit-text="Signin" @submit="onSubmit">
      <template #fields>
        <VLabel class="mb-2"> Username </VLabel>
        <VTextField v-model="form.username" class="mb-2" placeholder="Please input username"
          :rules="validationRules.username" variant="solo" :disabled="loading" />
        <VLabel class="mb-2"> Password </VLabel>
        <VTextField v-model="form.password" class="mb-2" placeholder="Please input password"
          :rules="validationRules.password" type="password" variant="solo" :disabled="loading" />
        <CaptchaInput ref="captchaEl" v-model="form.captcha" placeholder="Text of the graphic shown on the right."
          :rules="validationRules.captcha" :disabled="loading" />
      </template>
      <template #actions>
        <VBtn color="primary" prepend-icon="mdi-arrow-right" text="Don't have an account?" to="/auth/signup"
          variant="text" />
        <VBtn class="text-decoration-underline" color="red" prepend-icon="mdi-lock" size="small"
          text="Forget your password?" to="/auth/reset-password" variant="text" />
      </template>
    </AuthenticationForm>
  </VCard>
</template>

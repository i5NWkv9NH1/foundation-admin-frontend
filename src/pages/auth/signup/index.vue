<script lang="ts" setup>
//
  const form = ref(false)
  const loading = ref(false)
  async function handleSubmit () {
    loading.value = true
    console.log('submit', form.value)
    loading.value = false
    return false
  }
</script>

<template>
  <VContainer fluid>
    <VRow align="center" class="full-height" justify="center" no-gutters>
      <VCol cols="12">
        <div class="text-h4 mb-4 font-weight-bold">Signup</div>
        <VForm :model-value="form" @submit.prevent="handleSubmit">
          <VCard>
            <VCardText>
              <VLabel class="mb-2"> Username </VLabel>
              <VTextField density="compact" variant="solo-filled" />
              <VLabel class="mb-2"> Password </VLabel>
              <VTextField density="compact" variant="solo-filled" />
            </VCardText>
            <VCardActions>
              <VBtn
                block
                color="primary"
                :loading="loading"
                rounded="lg"
                text="Signin"
                type="submit"
                variant="flat"
              />
            </VCardActions>
            <VCardActions>
              <VBtn
                color="primary"
                prepend-icon="mdi-arrow-right"
                rounded="0"
                text="Already have account?"
                to="/auth/signin"
                variant="text"
              />
            </VCardActions>
          </VCard>
        </VForm>
      </VCol>
    </VRow>
  </VContainer>
</template>

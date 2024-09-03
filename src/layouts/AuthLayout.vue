<script setup lang="ts">
import { useAppStore } from '@/stores'

const appStore = useAppStore()
</script>

<template>
  <VApp>
    <VMain>
      <VContainer
        class="pa-0 full-height overflow-hidden"
        fluid
      >
        <VRow no-gutters>
          <VCol
            class="hidden-sm position-relative"
            lg="4"
            md="4"
          >
            <div class="caption">
              <RouterLink
                class="text-primary text-decoration-none text-h4 text-weight"
                to="/"
              >
                Foundation Admin
              </RouterLink>
            </div>
            <video
              autoplay
              class="video"
              loop
              muted
              :src="appStore.authVideo"
            />
          </VCol>
          <VCol
            cols="12"
            lg="8"
            md="8"
            sm="12"
          >
            <VContainer fluid>
              <VRow
                align="center"
                class="full-height"
                justify="center"
                no-gutters
              >
                <VCol
                  cols="10"
                  lg="6"
                  md="8"
                  sm="6"
                >
                  <RouterView v-slot="{ Component, route }">
                    <VScrollXReverseTransition hide-on-leave>
                      <component
                        :is="Component"
                        :key="route.path"
                      />
                    </VScrollXReverseTransition>
                  </RouterView>
                </VCol>
              </VRow>
            </VContainer>
          </VCol>
        </VRow>
      </VContainer>
    </VMain>
  </VApp>
</template>

<style scoped lang="scss">
.caption {
  position: absolute;
  z-index: 999;
  left: 10%;
  top: 10%;
  > div {
    letter-spacing: 0.5rem !important;
  }
}
video {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  z-index: 1;
}
</style>

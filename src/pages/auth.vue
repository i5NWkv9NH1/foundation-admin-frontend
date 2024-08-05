<!--
 * 父级模板
 * 使用 layout 去定义
 * 显示子路由: auth/*
-->
<script setup lang="ts">
  import { RouterView } from 'vue-router'

  const hidden = ref(false)
</script>

<template>
  <VApp>
    <!-- <VFab
      absolute
      :active="!hidden"
      app
      appear
      class="ms-4 mb-4"
      extended
      location="bottom end"
      offset
      prepend-icon="mdi-arrow-left"
      to="/"
      transition="slide-x-transition"
    >
      Back to Home
    </VFab> -->
    <VMain>
      <VContainer class="pa-0 full-height overflow-hidden" fluid>
        <VRow no-gutters>
          <VCol class="hidden-xs position-relative" lg="8" md="7" sm="6">
            <!-- <VImg
              cover
              height="100vh"
              src="/public/auth-bg.jpg"
              transition="slide-x-transition"
            /> -->
            <div class="caption">
              <!-- <div class="text-h2 text-white font-weight-bold">Welcome</div> -->
              <!-- <ThemeSwitch /> -->
              <VList rounded="lg">
                <VListItem
                  prepend-avatar="@/assets/logo.svg"
                  title="Foundation Admin"
                  to="/"
                >
                  <template #append>
                    <ThemeSwitch />
                  </template>
                </VListItem>
              </VList>
            </div>
            <video
              autoplay
              class="auth-video"
              loop
              muted
              poster="/public/auth-poster.jpg"
              src="https://www.w3schools.com/howto/rain.mp4"
            >
              <!-- <source src="/public/auth-video.mp4" type="video/mp4"> -->
              <!-- <source
                src="https://www.w3schools.com/howto/rain.mp4"
                type="video/mp4"
              > -->
            </video>
          </VCol>
          <VCol cols="12" lg="4" md="5" sm="6">
            <RouterView v-slot="{ Component, route }">
              <VSlideXTransition>
                <component :is="Component" :key="route.path" />
              </VSlideXTransition>
            </RouterView>
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
  // width: 100%;
  // height: 100%;
  // display: flex;
  // justify-content: center;
  // align-items: center;
  > div {
    letter-spacing: 0.5rem !important;
  }
}
.auth-video {
  width: 100%;
  height: 100vh;
  object-fit: cover;
  // position: absolute;
  z-index: 1;
}
</style>

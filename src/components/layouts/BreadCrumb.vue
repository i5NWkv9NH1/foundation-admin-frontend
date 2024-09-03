<script setup lang="tsx">
import { VBreadcrumbs } from 'vuetify/components'

const route = useRoute()

const matched = computed(() =>
  route.matched
    .filter((match) => match.path !== '/')
    .map((match) => {
      return {
        key: match.name,
        title: match.name || match.meta.title,
        to: match.path
      }
    })
)

function BreadcrumbNavigate({ items }: { items: any[] }) {
  return <VBreadcrumbs items={items} />
}
</script>

<template>
  <BreadcrumbNavigate :items="matched" />
</template>

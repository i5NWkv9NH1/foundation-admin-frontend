<script setup lang="ts">
import { FormField, TableRowAction } from '@/types';

interface Props {
  fields: FormField[]
  form: Record<string, any>
}
const props = withDefaults(defineProps<Props>(), {})
const expand = ref(false)
const emits = defineEmits<{
  (e: 'reset'): void
  (e: 'submit'): void
  (e: 'create'): void
}>()
const queryFilterActions = ref<TableRowAction[]>([
  { title: 'Query', icon: 'mdi-magnify', cb: () => emits('submit'), color: '' },
  { title: 'Reset', icon: 'mdi-refresh', cb: () => emits('reset'), color: '' },
  { title: 'Create Item', icon: 'mdi-plus', cb: () => emits('create'), color: '' }
])
</script>

<template>
  <VForm @submit.prevent="emits('submit')">
    <VCard>
      <VCardTitle>Query Filter</VCardTitle>
      <VCardItem>
        <VToolbar color="transparent">
          <VBtn :icon="expand ? 'mdi-filter-variant-remove' : 'mdi-filter-variant-plus'"
            :key="expand ? 'mdi-filter-variant-remove' : 'mdi-filter-variant-plus'" @click="() => (expand = !expand)" />
          <VTextField v-model="form.text!" hide-details variant="plain" label="Search by text"
            placeholder="Typing something" persistent-placeholder />
          <template #append>
            <VTooltip v-for="btn in queryFilterActions" :key="btn.title" :text="btn.title" location="top">
              <template #activator="args">
                <VBtn :icon="btn.icon" @click="btn.cb" v-bind="args.props" />
              </template>
            </VTooltip>
          </template>
        </VToolbar>
      </VCardItem>
      <VExpandTransition>
        <VCardItem v-if="expand">
          <VCardText>
            <GeneratorField :fields="props.fields" :form="props.form" />
          </VCardText>
          <VCardActions class="justify-end">
            <VBtn @click="() => emits('reset')">Reset</VBtn>
            <VBtn variant="outlined" @click="() => emits('submit')">Apply</VBtn>
          </VCardActions>
        </VCardItem>
      </VExpandTransition>
    </VCard>
  </VForm>
</template>

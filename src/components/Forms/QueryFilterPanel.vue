<script setup lang="ts">
import { FormField } from '@/types';

interface Props {
  fields: FormField[];
  form: Record<string, any>;
}
const props = withDefaults(defineProps<Props>(), {});
const expand = ref(false);
const emits = defineEmits<{
  (e: 'reset'): void;
  (e: 'submit'): void;
  (e: 'create'): void;
}>();
const headerPrependBtns = ref([
  { icon: 'mdi-magnify', action: () => emits('submit') },
  { icon: 'mdi-refresh', action: () => emits('reset') },
  { icon: 'mdi-plus', action: () => emits('create') }
]);
</script>

<template>
  <VForm @submit.prevent="emits('submit')">
    <VCard>
      <VCardItem>
        <VToolbar color="transparent">
          <VBtn
            :icon="expand ? 'mdi-filter-variant-remove' : 'mdi-filter-variant-plus'"
            :key="expand ? 'mdi-filter-variant-remove' : 'mdi-filter-variant-plus'"
            @click="() => (expand = !expand)"
          />
          <VTextField
            v-model="form['text']"
            hide-details
            variant="plain"
            label="Search by text"
            placeholder="Typing something"
            persistent-placeholder
          />
          <template #append>
            <VBtn
              v-for="(btn, index) in headerPrependBtns"
              :key="index"
              :icon="btn.icon"
              @click="btn.action"
            />
          </template>
        </VToolbar>
      </VCardItem>
      <VExpandTransition>
        <VCardItem v-if="expand">
          <VCardText class="py-0">
            <GeneratorField
              :fields="props.fields"
              :form="props.form"
            />
          </VCardText>
          <VCardActions class="justify-end">
            <VBtn @click="() => emits('reset')">Reset</VBtn>
            <VBtn
              variant="outlined"
              @click="() => emits('submit')"
              >Apply</VBtn
            >
          </VCardActions>
        </VCardItem>
      </VExpandTransition>
    </VCard>
  </VForm>
</template>

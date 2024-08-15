<script setup lang="ts">
import { Action, Menu, PaginationMeta, TableHeader } from '@/types';

interface Props {
  items: Menu[];
  actions: Action[];
  menuActions: Action[];
  onRoleActionsTableUpdate: () => void;
  closeOnSave?: boolean;
}
const headers = ref<TableHeader[]>([
  { title: 'Name', value: 'name', sortable: false, key: 'name' },
  { title: '@Code', value: 'code', sortable: false, key: 'code' },
  { title: 'Icon', value: 'icon', sortable: false, key: 'icon' }
]);
const props = withDefaults(defineProps<Props>(), {
  closeOnSave: false
});
const modelValue = defineModel<boolean>('modelValue', { required: true });
const activated = defineModel<string[]>('activated', { required: true });
const selectedActions = ref<Action[]>([...props.actions]);
// 监听 props.actions 变化
watch(
  () => props.actions,
  () => {
    selectedActions.value = props.actions;
  }
);
const tableMeta = defineModel<PaginationMeta & { loading: boolean }>('tableMeta', { required: true });

const emits = defineEmits<{
  (e: 'save', selectedActions: Action[]): void;
}>();
const onSave = () => {
  if (!selectedActions.value) return;
  if (props.closeOnSave) modelValue.value = false;
  emits('save', selectedActions.value);
};

function highlightCode(split: string) {
  if (split === 'view') return ['text-info'];
  if (split === 'create') return ['text-success'];
  if (split === 'update') return ['text-warning'];
  if (split === 'delete') return ['text-error'];
  return 'text-default';
}
</script>

<template>
  <VDialog
    v-model="modelValue"
    scrollable
    close-on-back
    max-width="800px"
  >
    <VCard>
      <VCardTitle>Role Actions</VCardTitle>
      <VCardText>
        <VRow>
          <!-- prettier-ignore -->
          <VCol cols="12" sm="4" md="4" lg="3">
            <TreeActivator
              v-model="activated"
              :items="props.items"
              :item-title="(item) => item.name"
            />
          </VCol>
          <!-- prettier-ignore -->
          <VCol
            cols="12"  sm="8" md="8" lg="9"
          >
            <VDataTableServer
              v-model="selectedActions"
              :items="props.menuActions"
              :headers="headers"
              v-model:page="tableMeta.page"
              v-model:items-per-page="tableMeta.itemsPerPage"
              :items-length="tableMeta.itemsCount"
              return-object
              :loading="tableMeta.loading"
              @update:options="props.onRoleActionsTableUpdate"
              show-select
            >
            <template #loading>
              <VSkeletonLoader type="table-row@4" />
            </template>
              <template #item.icon="{ item }">
                <VIcon :icon="item.icon || 'mdi-empty'" />
              </template>
              <template #item.code="{ item }">
                <template v-for="action in item.code.split(':')" :key="action">
                  <strong :class="highlightCode(action)">
                    {{ action }}
                    {{
                    item.code.split(':').indexOf(action) !== item.code.split(':').length -1 ? ':' : ''
                  }}
                  </strong>
                </template>
              </template>
            </VDataTableServer>
          </VCol>
        </VRow>
      </VCardText>
      <VCardActions>
        <VBtn @click="modelValue = false">
          <VIcon
            icon="mdi-close-thick"
            start
          />
          <span>Cancel</span>
        </VBtn>
        <VBtn @click="onSave">
          <VIcon
            icon="mdi-content-save-outline"
            start
          />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

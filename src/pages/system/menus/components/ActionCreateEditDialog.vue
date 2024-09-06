<script lang="ts" setup>
import { CreateActionDto } from '@/types';

const status = ref([
  { label: 'Enabled', value: 'Enabled', color: 'success' },
  { label: 'Disabled', value: 'Disabled', color: 'grey' }
])
interface Props {
  isEidting: boolean
  action: CreateActionDto
}
const modelValue = defineModel<boolean>('modelValue', {
  required: true
})
const props = defineProps<Props>()
const form = ref({ ...props.action })
const formEl = ref()
const isValid = ref<boolean | null>(false)
const rules = computed(
  () =>
    form.value && {
      name: [(v: string) => !!v || 'Name is required'],
      code: [(v: string) => !!v || 'Code is required']
    }
)

// ! Update form state when updating props
watch(
  () => props.action,
  () => {
    form.value = props.action
  }
)

/**
 * * Emits
 */
const emits = defineEmits<{
  (e: 'update:modelValue', value: boolean): void
  (e: 'save', form: any): void
  (e: 'close'): void
}>()
async function onSave() {
  if (!isValid.value) return
  emits('save', form.value)
  modelValue.value = false
}
function onClose() {
  modelValue.value = false
  emits('close')
}
</script>

<template>
  <VDialog v-model="modelValue" width="400" scroll-strategy="block" scrollable>
    <VCard>
      <VCardTitle>
        {{ props.isEidting ? `Edit Action` : 'New Action' }}
      </VCardTitle>
      <VCardSubtitle v-if="props.isEidting"> Editing {{ form.id }} </VCardSubtitle>
      <VCardText>
        <VForm ref="formEl" v-model="isValid" @submit.prevent="onSave" fast-fail class="d-flex flex-column ga-4">
          <VTextField v-model="form.name" label="Name" variant="outlined" persistent-placeholder :rules="rules.name" />

          <VTextField v-model="form.code" label="Code" variant="outlined" persistent-placeholder :rules="rules.code" />

          <VTextField v-model="form.icon" label="Icon" variant="outlined" persistent-placeholder
            :prepend-inner-icon="form.icon" hide-details />

          <VRadioGroup v-model="form.status" label="Status" inline>
            <VRadio v-for="item in status" :key="item.value" :value="item.value" :color="item.color"
              :label="item.label" />
          </VRadioGroup>

          <VTextField v-if="form.menuId" :value="form.menuId" variant="outlined" label="Menu Id" persistent-placeholder
            readonly />

          <VNumberInput v-model="form.sort" :min="0" :max="100" variant="outlined" label="Sort" hide-details />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon start icon="mdi-close-thick" />
          <span>Cancel</span>
        </VBtn>
        <VBtn color="primary" @click="onSave" :disabled="!isValid">
          <VIcon start icon="mdi-content-save-outline" />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

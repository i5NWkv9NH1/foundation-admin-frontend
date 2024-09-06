<script lang="ts" setup>
import { CreateRoleDto } from '@/types';

const status = ref([
  { label: 'Enabled', value: 'Enabled', color: 'success' },
  { label: 'Disabled', value: 'Disabled', color: 'grey' }
])
interface Props {
  isEidting: boolean
  role: CreateRoleDto
}
const modelValue = defineModel<boolean>('modelValue', {
  required: true
})
const props = defineProps<Props>()
const form = ref({ ...props.role })
const formEl = ref()
const isValid = ref<boolean | null>(false)
const rules = computed(
  () =>
    form.value && {
      label: [(v: string) => !!v || 'Label is required'],
      name: [(v: string) => !!v || 'Name is required']
    }
)

// ! Update form state when updating props
watch(
  () => props.role,
  () => {
    form.value = props.role
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
        {{ props.isEidting ? `Edit Role` : 'New Role' }}
      </VCardTitle>
      <VCardSubtitle v-if="props.isEidting"> Editing {{ form.id }} </VCardSubtitle>
      <VCardText>
        <VForm ref="formEl" v-model="isValid" @submit.prevent="onSave" fast-fail class="d-flex flex-column ga-4">
          <VTextField v-model="form.label" label="Label" variant="outlined" persistent-placeholder
            :rules="rules.label" />
          <VTextField v-model="form.name" label="Name" variant="outlined" persistent-placeholder :rules="rules.name" />
          <VRadioGroup v-model="form.status" label="Status" inline hide-details>
            <VRadio v-for="item in status" :key="item.value" :value="item.value" :color="item.color"
              :label="item.label" />
          </VRadioGroup>

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

<script lang="ts" setup>
import { CreateOrganizationDto } from '@/types'

const status = ref([
  { label: 'Enabled', value: 'Enabled', color: 'success' },
  { label: 'Disabled', value: 'Disabled', color: 'grey' }
])

interface Props {
  isEidting: boolean
  organization: CreateOrganizationDto
}
const modelValue = defineModel<boolean>('modelValue', {
  required: true
})
const props = defineProps<Props>()
const form = ref({ ...props.organization })
const formEl = ref()
const isValid = ref<boolean | null>(false)
const rules = computed(
  () =>
    form.value && {
      label: [(v: string) => !!v || 'Label is required'],
      name: [(v: string) => !!v || 'Name is required'],
      sort: [(v: number) => !!v || 'Sort is required']
    }
)

// ! Update form state when updating props
watch(
  () => props.organization,
  () => {
    form.value = props.organization
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
  console.log(props.organization)
}
</script>

<template>
  <VDialog
    v-model="modelValue"
    max-width="450"
    max-height="600"
    scroll-strategy="block"
    scrollable
  >
    <VCard>
      <VCardTitle>
        {{ props.isEidting ? `Edit Menu` : 'New Menu' }}
      </VCardTitle>
      <VCardSubtitle
        v-if="props.isEidting"
        class="text-info"
      >
        {{ form.name }}
      </VCardSubtitle>
      <VCardText>
        <VForm
          ref="formEl"
          v-model="isValid"
          @submit.prevent="onSave"
          fast-fail
          class="d-flex flex-column ga-4"
        >
          <VTextField
            v-model="form.label"
            label="Label"
            variant="outlined"
            persistent-placeholder
            :rules="rules.label"
          />

          <VTextField
            v-model="form.name"
            label="Name"
            variant="outlined"
            placeholder="Unique name"
            persistent-placeholder
            :rules="rules.name"
          />

          <VTextarea
            :value="form.path"
            label="Path"
            variant="outlined"
            persistent-placeholder
            readonly
          />

          <VRadioGroup
            v-model="form.status"
            label="Status"
            inline
          >
            <VRadio
              v-for="item in status"
              :key="item.value"
              :label="item.label"
              :color="item.color"
              :value="item.value"
            />
          </VRadioGroup>

          <VTextField
            v-if="form.parent"
            v-model="form.parent.label"
            label="Parent"
            variant="outlined"
            persistent-placeholder
            readonly
          />

          <VTextField
            v-model="form.icon"
            label="Icon"
            variant="outlined"
            persistent-placeholder
            :prepend-inner-icon="form.icon"
          />

          <VNumberInput
            v-model="form.sort"
            :min="0"
            :max="100"
            variant="outlined"
            label="Sort"
            :rules="rules.sort"
            control-variant="split"
            hide-details
          />
        </VForm>
      </VCardText>
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon
            start
            icon="mdi-close-thick"
          />
          <span>Cancel</span>
        </VBtn>
        <VBtn
          color="primary"
          @click="onSave"
          :disabled="!isValid"
        >
          <VIcon
            start
            icon="mdi-content-save-outline"
          />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </VCard>
  </VDialog>
</template>

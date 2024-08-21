<script lang="ts" setup>
import { CreateMenuDto } from '@/types'

interface Props {
  isEidting: boolean
  menu: CreateMenuDto
}
const modelValue = defineModel<boolean>('modelValue', {
  required: true
})
const props = defineProps<Props>()
const form = ref({ ...props.menu })
const formEl = ref()
const isValid = ref<boolean | null>(false)
const rules = computed(
  () =>
    form.value && {
      name: [(v: string) => !!v || 'Label is required'],
      router: [(v: string) => !!v || 'Name is required'],
      component: [(v: string) => !!v || 'Component is required'],
      icon: [(v: string) => !!v || 'Icon is required'],
      sort: [(v: number) => !!v || 'Sort is required']
    }
)

// ! Update form state when updating props
watch(
  () => props.menu,
  () => {
    form.value = props.menu
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
  console.log(props.menu)
}
</script>

<template>
  <VDialog
    v-model="modelValue"
    width="400"
    max-height="600"
    scroll-strategy="block"
    scrollable
  >
    <VCard>
      <VCardTitle>
        {{ props.isEidting ? `Edit Menu` : 'New Menu' }}
      </VCardTitle>
      <VCardSubtitle v-if="props.isEidting"> Editing {{ form.id }} </VCardSubtitle>
      <VCardText>
        <VForm
          ref="formEl"
          v-model="isValid"
          @submit.prevent="onSave"
          fast-fail
          class="d-flex flex-column ga-4"
        >
          <VTextField
            v-model="form.name"
            label="Name"
            variant="outlined"
            persistent-placeholder
            :rules="rules.name"
          />
          <VTextField
            v-model="form.router"
            label="Router"
            variant="outlined"
            persistent-placeholder
            :rules="rules.router"
          />
          <VTextField
            v-model="form.component"
            label="Component"
            variant="outlined"
            persistent-placeholder
            :rules="rules.component"
          />
          <VTextField
            v-if="form.parent"
            v-model="form.parent.name"
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
            :rules="rules.icon"
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

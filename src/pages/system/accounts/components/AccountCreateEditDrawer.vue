<script setup lang="ts">
import { CreateAccountDto, Organization, Role } from '@/types'

const genders = ref([
  { label: 'Private', value: 'Private', color: 'grey', icon: 'mdi-help' },
  { label: 'Male', value: 'Male', color: 'blue', icon: 'mdi-gender-male' },
  { label: 'Female', value: 'Female', color: 'pink', icon: 'mdi-gender-female' }
])
const status = ref([
  { label: 'Enabled', value: 'Enabled', color: 'success' },
  { label: 'Disabled', value: 'Disabled', color: 'grey' }
])
const rules = computed(
  () =>
    form.value && {
      name: [(v: string) => !!v || 'Name is required'],
      username: [(v: string) => !!v || 'Username is required', (v: string) => v.length >= 3 || 'Username must be at least 3 characters'],
      roles: [(v: Role[]) => v.length > 0 || 'At least one role is required'],
      profile: {
        status: [(v: string) => !!v || 'Status is required'],
        gender: [(v: string) => !!v || 'Gender is required'],
        email: [(v: string) => !!v || 'Email is required', (v: string) => /.+@.+\..+/.test(v) || 'Email must be valid'],
        phone: [(v: string) => !!v || 'Phone number is required', (v: string) => /^\d{10,15}$/.test(v) || 'Phone number must be between 10 and 15 digits'],
        address: [(v: string) => !!v || 'Address is required']
        // bio: [(v: string) => !!v || v.length <= 500 || 'Bio must be less than 500 characters']
      }
    }
)

interface Props {
  isEditing: boolean
  account: CreateAccountDto
  roles: Role[]
  organizaitons: Organization[]
}
const modelValue = defineModel<boolean>('modelValue', { required: true })
const props = defineProps<Props>()
const form = ref({ ...props.account })
const formEl = ref()
const isValid = ref<boolean | null>(false)

watch(
  () => props.account,
  async () => {
    form.value = props.account
    if (!props.isEditing) {
      await nextTick(async () => {
        await formEl.value.resetValidation()
      })
    }
  },
  { deep: true }
)

const emits = defineEmits<{
  (e: 'save', account: CreateAccountDto): void
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
  <VNavigationDrawer
    v-model="modelValue"
    width="400"
    temporary
    location="right"
  >
    <template #prepend>
      <VCardTitle>
        {{ props.isEditing ? `Edit: ${form.name}` : 'Create' }}
      </VCardTitle>
    </template>
    <template #default>
      <VCardText>
        <VForm
          ref="formEl"
          v-model="isValid"
          class="d-flex flex-column ga-4"
          @submit.prevent="onSave"
        >
          <VTextField
            v-model="form.name"
            label="Name"
            persistent-placeholder
            variant="outlined"
            :rules="rules.name"
          />
          <VTextField
            v-model="form.username"
            label="Username"
            persistent-placeholder
            variant="outlined"
            :rules="rules.username"
          />
          <VTextField
            v-if="!props.isEditing"
            v-model="form.password"
            label="Password"
            persistent-placeholder
            variant="outlined"
          />

          <VSelect
            variant="outlined"
            v-model="form.roles"
            multiple
            label="Roles"
            chips
            :rules="rules.roles"
            :items="props.roles"
            :item-value="(role: Role) => role"
            :item-title="(role: Role) => role.name"
          />

          <VDivider />

          <VRadioGroup
            v-model="form.profile.status"
            label="Status"
            :rules="rules.profile.status"
            inline
          >
            <VRadio
              v-for="item in status"
              :key="item.value"
              :value="item.value"
              :color="item.color"
              :label="item.label"
            />
          </VRadioGroup>

          <VRadioGroup
            v-model="form.profile.gender"
            label="Gender"
            :rules="rules.profile.gender"
          >
            <VRadio
              v-for="item in genders"
              :key="item.value"
              :value="item.value"
              :color="item.color"
              :label="item.label"
            >
              <template #label>
                <VIcon
                  :icon="item.icon"
                  :color="item.color"
                  start
                />
                <span>{{ item.label }}</span>
              </template>
            </VRadio>
          </VRadioGroup>

          <VTextField
            v-model="form.profile.email"
            label="Email"
            persistent-placeholder
            :rules="rules.profile.email"
            variant="outlined"
          />
          <VTextField
            v-model="form.profile.phone"
            label="Phone"
            persistent-placeholder
            :rules="rules.profile.phone"
            variant="outlined"
          />
          <VTextField
            v-model="form.profile.address"
            label="Address"
            persistent-placeholder
            :rules="rules.profile.address"
            variant="outlined"
          />
          <VTextarea
            v-model="form.profile.bio"
            label="Bio"
            persistent-placeholder
            variant="outlined"
          />
        </VForm>
      </VCardText>
    </template>
    <template #append>
      <VDivider />
      <VCardActions>
        <VBtn @click="onClose">
          <VIcon
            icon="mdi-close-thick"
            start
          />
          <span>Cancel</span>
        </VBtn>
        <VBtn
          @click="onSave"
          color="primary"
          :disabled="!isValid"
        >
          <VIcon
            icon="mdi-content-save-outline"
            start
          />
          <span>Save</span>
        </VBtn>
      </VCardActions>
    </template>
  </VNavigationDrawer>
</template>

<style lang="scss">
.v-radio-group > .v-input__control > .v-label {
  margin: unset;
}
</style>

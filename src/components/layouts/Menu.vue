<template>
  <v-list>
    <template v-if="hasChildren(item)">
      <v-list-group
        v-for="item in items"
        :key="item.id"
        v-model="active"
        :prepend-icon="item.icon"
      >
        <template v-slot:activator>
          <v-list-item-title>{{ item.name }}</v-list-item-title>
        </template>

        <template
          v-for="child in item.children"
          :key="child.id"
        >
          <v-list-group
            v-if="hasChildren(child)"
            v-model="active"
            :prepend-icon="child.icon"
          >
            <template v-slot:activator>
              <v-list-item-title>{{ child.name }}</v-list-item-title>
            </template>

            <template
              v-for="subChild in child.children"
              :key="subChild.id"
            >
              <v-list-item
                v-if="!hasChildren(subChild)"
                :title="subChild.name"
                :prepend-icon="subChild.icon"
                @click="handleClick(subChild)"
              ></v-list-item>

              <Menu
                v-else
                :items="[subChild]"
                v-model:active="active"
              />
            </template>
          </v-list-group>

          <v-list-item
            v-else
            :title="child.name"
            :prepend-icon="child.icon"
            @click="handleClick(child)"
          ></v-list-item>
        </template>
      </v-list-group>
    </template>

    <v-list-item
      v-else
      :title="item.name"
      :prepend-icon="item.icon"
      @click="handleClick(item)"
    ></v-list-item>
  </v-list>
</template>

<script setup>
const props = defineProps({
  items: {
    type: Array,
    required: true
  },
  modelValue: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['update:modelValue'])
const active = ref(null)

const hasChildren = (item) => {
  return Array.isArray(item.children) && item.children.length > 0
}

const handleClick = (clickedItem) => {
  emit('update:modelValue', clickedItem)
}
</script>

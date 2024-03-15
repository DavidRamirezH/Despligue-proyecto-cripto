<script setup lang="ts">
import navigationData from '~~/data/navigation.json'

const userStore = useUserStore()
const userRole = computed(() => userStore.getRole)
const userPermissions = computed(() => userStore.getPermissions)
const extensionStore = useExtensionStore()
const extensions = computed(() => extensionStore.extensionsUser)
const navigation = ref([])
const settingsStore = useSettingsStore()
const settings = computed(() => settingsStore.settings)

const route = useRoute()
onMounted(async () => {
  if (extensionStore.extensions.length === 0) {
    await extensionStore.fetchExtensionsUser()
  }

  navigation.value = reactive(filterNavigation(navigationData))

  navigation.value.forEach((item) => {
    if (isActive(item)) {
      selecteditem.value = item
    }
  })
})

watch(
  () => route.path,
  (newPath) => {
    navigation.value.forEach((item) => {
      if (isActive(item)) {
        selecteditem.value = item
      }
    })
  },
)

const filterNavigation = (items) => {
  return items.filter((item) => {
    if (!hasAccess(item)) return false

    if (item.children) {
      item.children = filterNavigation(item.children)
      if (item.children.length === 0) return false
    }

    return true
  })
}

const hasAccess = (item) => {
  if (item.extension && !extensions.value[item.extension]) {
    return false
  }

  if (
    Array.isArray(item.setting) &&
    item.setting.some((setting) => !settings.value[setting])
  ) {
    return false
  }

  if (userRole.value === 'Super Admin') {
    return true
  }

  if (
    item.permission &&
    !userPermissions.value.some((permission) =>
      permission.includes(item.permission),
    )
  ) {
    return false
  }

  return true
}

const selecteditem = ref(navigationData[0])
const target = ref(null)
const open = ref(false)

function openDropdown() {
  open.value = !open.value
}

onClickOutside(target, () => (open.value = false))

const submenuState = reactive({})

// Function to toggle submenu expansion
const toggleSubmenu = (itemName) => {
  submenuState[itemName] = !submenuState[itemName]
}

// Adjust setitem function to include submenu toggle logic
function setitem(item) {
  if (!item.to) {
    toggleSubmenu(item.name)
    return
  }
  selecteditem.value = item
  open.value = false
}

const isActive = (item) => {
  // End item check: direct match
  if (item.to && route.path === item.to) {
    return true
  }

  // Parent item check: path starts with activePath
  if (item.activePath && route.path.startsWith(item.activePath)) {
    return true
  }

  // Subitem check: any child is a direct match
  if (item.children) {
    return item.children.some((child) => route.path === child.to)
  }

  return false
}
</script>

<template>
  <div
    ref="target"
    class="relative w-full z-10 group/item max-w-[170px] md:max-w-[240px] ms-auto md:ms-0"
  >
    <button
      type="button"
      class="w-full py-2 ps-2 pe-3 group-hover:item:bg-muted-100 dark:group-hover:item:bg-muted-900/60 rounded-xl max-w-[170px] md:max-w-[240px] transition-colors duration-300"
      :class="{ 'bg-muted-100 dark:bg-muted-900/60': open }"
      @click="openDropdown()"
    >
      <span class="w-full flex items-center gap-3 text-start">
        <Icon
          :name="selecteditem?.icon.name"
          :class="selecteditem?.icon.class + ' group-hover:text-primary-500'"
        />
        <div>
          <BaseText
            size="sm"
            class="block text-muted-800 dark:text-muted-200 line-clamp-1"
          >
            {{ selecteditem.name }}
          </BaseText>
        </div>
        <Icon
          name="lucide:chevrons-up-down"
          class="w-4 h-4 ms-auto text-muted-400 transition-transform duration-300"
          :class="{ 'rotate-180': open }"
        />
      </span>
    </button>

    <Transition
      enter-active-class="transition duration-100 ease-out"
      enter-from-class="transform scale-95 opacity-0"
      enter-to-class="transform scale-100 opacity-100"
      leave-active-class="transition duration-75 ease-in"
      leave-from-class="transform scale-100 opacity-100"
      leave-to-class="transform scale-95 opacity-0"
    >
      <div
        v-if="open"
        class="absolute overflow-auto max-h-[calc(50vh)] min-w-[280px] top-12 end-0 md:start-0 w-full rounded-xl border border-muted-200 dark:border-muted-800 bg-white dark:bg-muted-950 shadow-xl shadow-muted-400/10 dark:shadow-muted-800/10"
      >
        <div class="p-3 flex flex-col">
          <ul class="space-y-1">
            <li v-for="item in navigation" :key="item.name">
              <!-- Regular item -->
              <NuxtLink
                v-if="item.to && !item.children"
                :to="item.to"
                :class="[
                  'flex items-center gap-2 py-2 ps-2 pe-4 rounded-lg hover:bg-muted-100 dark:hover:bg-muted-800 w-full transition-colors duration-200',
                  isActive(item)
                    ? 'bg-primary-500 text-gray-200 hover:text-gray-800 dark:hover:text-gray-200'
                    : 'text-gray-600 dark:text-gray-400',
                ]"
                @click="setitem(item)"
              >
                <Icon
                  :name="item.icon.name"
                  :class="item.icon.class + ' group-hover:text-primary-500'"
                />
                <BaseText size="sm" class="group-hover:text-primary-500">{{
                  item.name
                }}</BaseText>
              </NuxtLink>

              <!-- Item with children -->
              <div v-if="item.children" class="space-y-1">
                <button
                  :class="[
                    'flex items-center gap-2 py-2 ps-2 pe-4 rounded-lg w-full text-left transition-colors duration-200',
                    isActive(item)
                      ? 'bg-muted-100 dark:bg-muted-800 text-gray-700 dark:text-gray-300'
                      : 'hover:bg-muted-100 dark:hover:bg-muted-800 text-gray-600 dark:text-gray-400',
                  ]"
                  @click="toggleSubmenu(item.activePath)"
                >
                  <Icon
                    :name="item.icon.name"
                    :class="item.icon.class + ' group-hover:text-primary-500'"
                  />
                  <BaseText size="sm" class="group-hover:text-primary-500">{{
                    item.name
                  }}</BaseText>
                  <Icon
                    name="lucide:chevron-down"
                    class="transition-transform duration-300 ml-auto"
                    :class="{ 'rotate-180': submenuState[item.activePath] }"
                  />
                </button>
                <ul v-show="submenuState[item.activePath]" class="pl-4">
                  <li v-for="child in item.children" :key="child.name">
                    <NuxtLink
                      :to="child.to"
                      :class="[
                        'flex items-center gap-2 py-2 ps-2 pe-4 rounded-lg hover:bg-muted-100 dark:hover:bg-muted-800 w-full transition-colors duration-200',
                        isActive(child)
                          ? 'bg-primary-500 text-gray-700 dark:text-gray-300'
                          : 'text-gray-600 dark:text-gray-400',
                      ]"
                      @click="setitem(child)"
                    >
                      <Icon
                        :name="child.icon.name"
                        :class="
                          child.icon.class + ' group-hover:text-primary-500'
                        "
                      />
                      <BaseText
                        size="sm"
                        class="group-hover:text-primary-500"
                        >{{ child.name }}</BaseText
                      >
                    </NuxtLink>
                  </li>
                </ul>
              </div>

              <!-- Divider -->
              <div
                v-if="item.divider"
                class="border-muted-200 dark:border-muted-700 my-3 h-px w-full border-t"
              ></div>
            </li>
          </ul>
        </div>
      </div>
    </Transition>
  </div>
</template>

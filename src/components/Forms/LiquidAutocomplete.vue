<template>
  <div
    ref="rootEl"
    :class="['lq-autocomplete', `lq-autocomplete--${size}`, { 'is-disabled': disabled }]"
  >
    <label class="lq-autocomplete__control">
      <span v-if="icon" class="lq-autocomplete__icon" v-html="iconSvg(icon, iconSize)" />

      <input
        ref="inputEl"
        type="text"
        role="combobox"
        autocomplete="off"
        spellcheck="false"
        :value="text"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-expanded="open"
        :aria-activedescendant="activeId"
        aria-autocomplete="list"
        @input="onInput"
        @focus="onFocus"
        @blur="onBlur"
        @keydown="onKeydown"
      />

      <span v-if="loading" class="lq-autocomplete__spinner" />

      <button
        v-else-if="clearable && modelValue"
        type="button"
        class="lq-autocomplete__clear"
        aria-label="Clear"
        tabindex="-1"
        @mousedown.prevent
        @click="clear"
      >
        <span v-html="iconSvg('close', 12)" />
      </button>

      <span v-else class="lq-autocomplete__caret" v-html="iconSvg('chevronDown', 14)" />
    </label>

    <Teleport to="body">
      <div
        v-if="open"
        ref="panelEl"
        class="lq-autocomplete__panel lq-glass"
        role="listbox"
        :style="panelStyle"
      >
        <p v-if="loading && !options.length" class="lq-autocomplete__note">Searching…</p>

        <template v-else-if="options.length">
          <button
            v-for="(option, index) in options"
            :id="`${uid}-o${index}`"
            :key="option.value"
            type="button"
            role="option"
            :aria-selected="index === active"
            :class="[
              'lq-autocomplete__option',
              { 'is-active': index === active, 'is-current': option.value === modelValue },
            ]"
            @mousedown.prevent
            @mousemove="active = index"
            @click="choose(option)"
          >
            <span class="lq-autocomplete__label">{{ option.label ?? option.value }}</span>
            <span v-if="option.description" class="lq-autocomplete__description">
              {{ option.description }}
            </span>
          </button>
        </template>

        <p v-else class="lq-autocomplete__note">{{ emptyText }}</p>

        <button
          v-if="allowCreate && canCreate"
          type="button"
          :class="[
            'lq-autocomplete__option',
            'lq-autocomplete__create',
            { 'is-active': active === options.length },
          ]"
          @mousedown.prevent
          @mousemove="active = options.length"
          @click="createFromQuery"
        >
          <span class="lq-autocomplete__label">Use “{{ query.trim() }}”</span>
        </button>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { computed, nextTick, onBeforeUnmount, ref, watch } from 'vue'
import { iconSvg, type IconName } from '../../icons'

export interface AutocompleteOption {
  value: string
  label?: string
  description?: string
}

interface Props {
  modelValue?: string
  options?: AutocompleteOption[]
  placeholder?: string
  icon?: IconName | ''
  loading?: boolean
  disabled?: boolean
  clearable?: boolean
  /** Offer the typed text as a value of its own when it matches nothing. */
  allowCreate?: boolean
  emptyText?: string
  debounce?: number
  size?: 'sm' | 'md' | 'lg'
}

const props = withDefaults(defineProps<Props>(), {
  modelValue: '',
  options: () => [],
  placeholder: '',
  icon: '',
  loading: false,
  disabled: false,
  clearable: true,
  allowCreate: false,
  emptyText: 'No matches',
  debounce: 250,
  size: 'md',
})

const emit = defineEmits<{
  (e: 'update:modelValue', v: string): void
  (e: 'search', v: string): void
  (e: 'open'): void
}>()

let seq = 0
const uid = `lq-ac-${(seq += 1)}-${Math.random().toString(36).slice(2, 7)}`

const iconSize = computed(() => (props.size === 'sm' ? 13 : 15))

const rootEl = ref<HTMLElement | null>(null)
const inputEl = ref<HTMLInputElement | null>(null)

const panelEl = ref<HTMLElement | null>(null)

const open = ref(false)
const query = ref('')
const active = ref(0)

const PANEL_MAX = 260
const PANEL_MIN = 120
const GAP = 4
const EDGE = 8

const anchor = ref({ top: 0, left: 0, width: 0, below: true, max: PANEL_MAX })

const panelStyle = computed(() => ({
  position: 'fixed' as const,
  left: `${anchor.value.left}px`,
  width: `${anchor.value.width}px`,
  maxHeight: `${anchor.value.max}px`,
  ...(anchor.value.below
    ? { top: `${anchor.value.top}px` }
    : { bottom: `${window.innerHeight - anchor.value.top}px` }),
}))

function measure() {
  const box = rootEl.value?.getBoundingClientRect()
  if (!box) return

  const below = window.innerHeight - box.bottom - GAP - EDGE
  const above = box.top - GAP - EDGE

  const openDown = below >= Math.min(PANEL_MAX, PANEL_MIN) || below >= above

  anchor.value = {
    left: box.left,
    width: box.width,
    top: openDown ? box.bottom + GAP : box.top - GAP,
    below: openDown,
    max: Math.max(PANEL_MIN, Math.min(PANEL_MAX, openDown ? below : above)),
  }
}

const text = computed(() => {
  if (open.value) return query.value
  const match = props.options.find((option) => option.value === props.modelValue)
  return match?.label ?? props.modelValue
})

const canCreate = computed(() => {
  const typed = query.value.trim()
  if (!typed) return false
  return !props.options.some((option) => option.value === typed)
})

const rowCount = computed(
  () => props.options.length + (props.allowCreate && canCreate.value ? 1 : 0),
)

const activeId = computed(() =>
  open.value && active.value < props.options.length ? `${uid}-o${active.value}` : undefined,
)

let timer: ReturnType<typeof setTimeout> | null = null

function search(value: string, immediate = false) {
  if (timer) clearTimeout(timer)
  if (immediate || props.debounce <= 0) {
    emit('search', value)
    return
  }
  timer = setTimeout(() => emit('search', value), props.debounce)
}

onBeforeUnmount(() => {
  if (timer) clearTimeout(timer)
  document.removeEventListener('pointerdown', onOutside, true)
  window.removeEventListener('scroll', measure, true)
  window.removeEventListener('resize', measure)
})

function onOutside(event: PointerEvent) {
  const target = event.target as Node
  if (rootEl.value?.contains(target) || panelEl.value?.contains(target)) return
  close()
}

function onFocus() {
  if (props.disabled) return
  open.value = true
  query.value = ''
  active.value = 0
  emit('open')
  search('', true)
  measure()

  document.addEventListener('pointerdown', onOutside, true)
  window.addEventListener('scroll', measure, true)
  window.addEventListener('resize', measure)
}

function onBlur() {
  setTimeout(() => {
    const focused = document.activeElement
    if (rootEl.value?.contains(focused) || panelEl.value?.contains(focused)) return
    close()
  }, 0)
}

function close() {
  open.value = false
  query.value = ''
  document.removeEventListener('pointerdown', onOutside, true)
  window.removeEventListener('scroll', measure, true)
  window.removeEventListener('resize', measure)
}

function onInput(event: Event) {
  query.value = (event.target as HTMLInputElement).value
  open.value = true
  active.value = 0
  search(query.value)
}

function choose(option: AutocompleteOption) {
  emit('update:modelValue', option.value)
  close()
  void nextTick(() => inputEl.value?.blur())
}

function createFromQuery() {
  emit('update:modelValue', query.value.trim())
  close()
  void nextTick(() => inputEl.value?.blur())
}

function clear() {
  emit('update:modelValue', '')
  inputEl.value?.focus()
}

function onKeydown(event: KeyboardEvent) {
  if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
    event.preventDefault()
    if (!open.value) {
      onFocus()
      return
    }
    const total = rowCount.value
    if (!total) return
    const step = event.key === 'ArrowDown' ? 1 : -1
    active.value = (active.value + step + total) % total
    return
  }

  if (event.key === 'Enter') {
    if (!open.value) return
    event.preventDefault()
    if (active.value < props.options.length) {
      const option = props.options[active.value]
      if (option) choose(option)
    } else if (props.allowCreate && canCreate.value) {
      createFromQuery()
    }
    return
  }

  if (event.key === 'Escape') {
    if (!open.value) return
    event.preventDefault()
    event.stopPropagation()
    close()
    inputEl.value?.blur()
  }
}

watch(
  () => props.options,
  () => {
    if (active.value >= rowCount.value) active.value = 0
  },
)
</script>

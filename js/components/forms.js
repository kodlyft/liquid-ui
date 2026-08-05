;(function () {
  // ============================================================
  // Liquid UI -- Form components
  // LiquidToggle, LiquidCheck, LiquidSegmented, LiquidSlider, LiquidInput,
  // LiquidSearchBar, LiquidStepper, LiquidAutocomplete
  // ============================================================

  const { defineComponent, computed, ref, watch, nextTick, onMounted, onUnmounted } = Vue

  // ---------- LiquidToggle ----------
  const LiquidToggle = defineComponent({
    name: 'LiquidToggle',
    props: {
      modelValue: { type: Boolean, default: false },
      color: { type: String, default: 'green' }, // green | accent | orange | red | purple
      size: { type: String, default: 'md' }, // sm | md
      disabled: { type: Boolean, default: false },
      label: { type: String, default: '' },
    },
    emits: ['update:modelValue', 'change'],
    template: `
    <button
      :class="['lq-toggle', 'lq-toggle--' + size, 'lq-toggle--' + color, { 'is-on': modelValue, 'is-disabled': disabled }]"
      role="switch"
      :aria-checked="modelValue"
      :aria-label="label"
      :disabled="disabled"
      @click="toggle">
      <span class="lq-toggle__track"></span>
      <span class="lq-toggle__thumb"></span>
    </button>
  `,
    setup(props, { emit }) {
      const toggle = () => {
        if (props.disabled) return
        emit('update:modelValue', !props.modelValue)
        emit('change', !props.modelValue)
      }
      return { toggle }
    },
  })

  // ---------- LiquidCheck ----------
  const LiquidCheck = defineComponent({
    name: 'LiquidCheck',
    props: {
      modelValue: { type: Boolean, default: false },
      label: { type: String, default: '' },
      description: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      indeterminate: { type: Boolean, default: false },
      size: { type: String, default: 'md' }, // sm | md
      name: { type: String, default: undefined },
      value: { type: [String, Number], default: undefined },
    },
    emits: ['update:modelValue', 'change'],
    template: `
    <label
      :class="[
        'lq-check',
        'lq-check--' + size,
        { 'is-checked': modelValue, 'is-indeterminate': indeterminate, 'is-disabled': disabled },
        { 'lq-check--stacked': hasDescription }
      ]">
      <input
        ref="input"
        class="lq-check__input"
        type="checkbox"
        :checked="modelValue"
        :disabled="disabled"
        :name="name"
        :value="value"
        :aria-label="label || undefined"
        @change="onChange" />
      <span class="lq-check__box" aria-hidden="true">
        <span class="lq-check__mark" v-html="markSvg"></span>
      </span>
      <span v-if="hasText" class="lq-check__text">
        <span class="lq-check__label"><slot>{{ label }}</slot></span>
        <span v-if="hasDescription" class="lq-check__hint">
          <slot name="description">{{ description }}</slot>
        </span>
      </span>
    </label>
  `,
    setup(props, { emit, slots }) {
      const input = ref(null)

      const hasDescription = computed(() => !!props.description || !!slots.description)
      const hasText = computed(() => !!props.label || !!slots.default || hasDescription.value)
      const markSvg = computed(() => window.IconSvg(props.indeterminate ? 'minus' : 'check', 24))

      const syncIndeterminate = () => {
        if (input.value) input.value.indeterminate = props.indeterminate
      }
      onMounted(syncIndeterminate)
      watch(() => props.indeterminate, syncIndeterminate)

      const onChange = (event) => {
        const next = event.target.checked
        emit('update:modelValue', next)
        emit('change', next)
      }

      return { input, hasDescription, hasText, markSvg, onChange }
    },
  })

  // ---------- LiquidSegmented ----------
  const LiquidSegmented = defineComponent({
    name: 'LiquidSegmented',
    props: {
      modelValue: { type: [String, Number], default: '' },
      options: { type: Array, required: true }, // [{value, label, icon?}]
      size: { type: String, default: 'md' },
      style2: { type: String, default: 'glass' }, // glass | inline (TabBar-style)
    },
    emits: ['update:modelValue'],
    template: `
    <div :class="['lq-seg', 'lq-seg--' + size, 'lq-seg--' + style2]">
      <button
        v-for="opt in options"
        :key="opt.value"
        :class="['lq-seg__opt', { 'is-active': opt.value === modelValue }]"
        @click="$emit('update:modelValue', opt.value)">
        <span v-if="opt.icon" class="lq-seg__icon" v-html="iconSvg(opt.icon, iconSize)"></span>
        <span v-if="opt.label" class="lq-seg__label">{{ opt.label }}</span>
      </button>
      <span class="lq-seg__indicator" :style="indicatorStyle" aria-hidden="true"></span>
    </div>
  `,
    setup(props) {
      const idx = computed(() =>
        Math.max(
          0,
          props.options.findIndex((o) => o.value === props.modelValue),
        ),
      )
      const indicatorStyle = computed(() => ({
        width: `calc((100% - 8px) / ${props.options.length})`,
        transform: `translateX(calc(${idx.value} * 100%))`,
      }))
      const iconSize = computed(() => (props.size === 'sm' ? 14 : 16))
      return { indicatorStyle, iconSvg: window.IconSvg, iconSize }
    },
  })

  // ---------- LiquidSlider ----------
  const LiquidSlider = defineComponent({
    name: 'LiquidSlider',
    props: {
      modelValue: { type: Number, default: 50 },
      min: { type: Number, default: 0 },
      max: { type: Number, default: 100 },
      step: { type: Number, default: 1 },
      color: { type: String, default: 'accent' }, // accent | white | green
      iconLeft: { type: String, default: '' },
      iconRight: { type: String, default: '' },
      disabled: { type: Boolean, default: false },
      showValue: { type: Boolean, default: false },
    },
    emits: ['update:modelValue'],
    template: `
    <div :class="['lq-slider', 'lq-slider--' + color, { 'is-disabled': disabled }]">
      <span v-if="iconLeft" class="lq-slider__icon" v-html="iconSvg(iconLeft, 16)"></span>
      <div class="lq-slider__track" ref="trackEl" @pointerdown="onDown">
        <div class="lq-slider__fill" :style="{ width: percent + '%' }"></div>
        <div class="lq-slider__thumb" :style="{ left: percent + '%' }"></div>
      </div>
      <span v-if="iconRight" class="lq-slider__icon" v-html="iconSvg(iconRight, 16)"></span>
      <span v-if="showValue" class="lq-slider__value">{{ modelValue }}</span>
    </div>
  `,
    setup(props, { emit }) {
      const trackEl = ref(null)
      const percent = computed(() => {
        const p = (props.modelValue - props.min) / (props.max - props.min)
        return Math.max(0, Math.min(100, p * 100))
      })
      const setFromEvent = (e) => {
        if (!trackEl.value || props.disabled) return
        const r = trackEl.value.getBoundingClientRect()
        const x = (e.clientX - r.left) / r.width
        const raw = props.min + Math.max(0, Math.min(1, x)) * (props.max - props.min)
        const stepped = Math.round(raw / props.step) * props.step
        emit('update:modelValue', Math.max(props.min, Math.min(props.max, stepped)))
      }
      const onDown = (e) => {
        e.preventDefault()
        setFromEvent(e)
        const move = (ev) => setFromEvent(ev)
        const up = () => {
          window.removeEventListener('pointermove', move)
          window.removeEventListener('pointerup', up)
        }
        window.addEventListener('pointermove', move)
        window.addEventListener('pointerup', up)
      }
      return { trackEl, percent, onDown, iconSvg: window.IconSvg }
    },
  })

  // ---------- LiquidStepper ----------
  const LiquidStepper = defineComponent({
    name: 'LiquidStepper',
    props: {
      modelValue: { type: Number, default: 0 },
      min: { type: Number, default: -Infinity },
      max: { type: Number, default: Infinity },
      step: { type: Number, default: 1 },
    },
    emits: ['update:modelValue'],
    template: `
    <div class="lq-stepper lq-glass">
      <button class="lq-stepper__btn lq-press" @click="bump(-1)" :disabled="modelValue <= min" aria-label="Decrease">
        <span v-html="iconSvg('minus', 18)"></span>
      </button>
      <span class="lq-stepper__divider"></span>
      <button class="lq-stepper__btn lq-press" @click="bump(1)" :disabled="modelValue >= max" aria-label="Increase">
        <span v-html="iconSvg('plus', 18)"></span>
      </button>
    </div>
  `,
    setup(props, { emit }) {
      const bump = (dir) => {
        const next = props.modelValue + dir * props.step
        emit('update:modelValue', Math.max(props.min, Math.min(props.max, next)))
      }
      return { bump, iconSvg: window.IconSvg }
    },
  })

  // ---------- LiquidInput ----------
  const LiquidInput = defineComponent({
    name: 'LiquidInput',
    props: {
      modelValue: { type: String, default: '' },
      placeholder: { type: String, default: '' },
      type: { type: String, default: 'text' },
      icon: { type: String, default: '' },
      clearable: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      size: { type: String, default: 'md' },
    },
    emits: ['update:modelValue', 'submit'],
    template: `
    <label :class="['lq-input', 'lq-input--' + size, { 'is-disabled': disabled, 'has-icon': !!icon }]">
      <span v-if="icon" class="lq-input__icon" v-html="iconSvg(icon, iconSize)"></span>
      <input
        :type="type"
        :value="modelValue"
        :placeholder="placeholder"
        :disabled="disabled"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter="$emit('submit', modelValue)" />
      <button
        v-if="clearable && modelValue"
        class="lq-input__clear"
        @click.prevent="$emit('update:modelValue', '')"
        aria-label="Clear">
        <span v-html="iconSvg('close', 12)"></span>
      </button>
    </label>
  `,
    setup(props) {
      const iconSize = computed(() => (props.size === 'sm' ? 14 : 16))
      return { iconSvg: window.IconSvg, iconSize }
    },
  })

  // ---------- LiquidSearchBar ----------
  const LiquidSearchBar = defineComponent({
    name: 'LiquidSearchBar',
    props: {
      modelValue: { type: String, default: '' },
      placeholder: { type: String, default: 'Search' },
      showMic: { type: Boolean, default: true },
    },
    emits: ['update:modelValue', 'submit'],
    template: `
    <label class="lq-search">
      <span class="lq-search__icon" v-html="iconSvg('search', 16)"></span>
      <input
        :value="modelValue"
        :placeholder="placeholder"
        @input="$emit('update:modelValue', $event.target.value)"
        @keydown.enter="$emit('submit', modelValue)" />
      <button
        v-if="showMic"
        class="lq-search__mic"
        @click.prevent
        aria-label="Voice search">
        <span v-html="iconSvg('mic', 16)"></span>
      </button>
    </label>
  `,
    setup() {
      return { iconSvg: window.IconSvg }
    },
  })

  // ---------- LiquidAutocomplete ----------
  let acSeq = 0

  const LiquidAutocomplete = defineComponent({
    name: 'LiquidAutocomplete',
    props: {
      modelValue: { type: String, default: '' },
      options: { type: Array, default: () => [] }, // [{value, label?, description?}]
      placeholder: { type: String, default: '' },
      icon: { type: String, default: '' },
      loading: { type: Boolean, default: false },
      disabled: { type: Boolean, default: false },
      clearable: { type: Boolean, default: true },
      allowCreate: { type: Boolean, default: false }, // offer the typed text as its own value
      emptyText: { type: String, default: 'No matches' },
      debounce: { type: Number, default: 250 },
      size: { type: String, default: 'md' }, // sm | md | lg
    },
    emits: ['update:modelValue', 'search', 'open'],
    template: `
    <div ref="rootEl" :class="['lq-autocomplete', 'lq-autocomplete--' + size, { 'is-disabled': disabled }]">
      <label class="lq-autocomplete__control">
        <span v-if="icon" class="lq-autocomplete__icon" v-html="iconSvg(icon, iconSize)"></span>
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
          @keydown="onKeydown" />
        <span v-if="loading" class="lq-autocomplete__spinner"></span>
        <button
          v-else-if="clearable && modelValue"
          type="button"
          class="lq-autocomplete__clear"
          aria-label="Clear"
          tabindex="-1"
          @mousedown.prevent
          @click="clear">
          <span v-html="iconSvg('close', 12)"></span>
        </button>
        <span v-else class="lq-autocomplete__caret" v-html="iconSvg('chevronDown', 14)"></span>
      </label>

      <teleport to="body">
        <div
          v-if="open"
          ref="panelEl"
          class="lq-autocomplete__panel lq-glass"
          role="listbox"
          :style="panelStyle">
          <p v-if="loading && !options.length" class="lq-autocomplete__note">Searching…</p>

          <template v-else-if="options.length">
            <button
              v-for="(option, index) in options"
              :id="uid + '-o' + index"
              :key="option.value"
              type="button"
              role="option"
              :aria-selected="index === active"
              :class="['lq-autocomplete__option', { 'is-active': index === active, 'is-current': option.value === modelValue }]"
              @mousedown.prevent
              @mousemove="active = index"
              @click="choose(option)">
              <span class="lq-autocomplete__label">{{ option.label ?? option.value }}</span>
              <span v-if="option.description" class="lq-autocomplete__description">{{ option.description }}</span>
            </button>
          </template>

          <p v-else class="lq-autocomplete__note">{{ emptyText }}</p>

          <button
            v-if="allowCreate && canCreate"
            type="button"
            :class="['lq-autocomplete__option', 'lq-autocomplete__create', { 'is-active': active === options.length }]"
            @mousedown.prevent
            @mousemove="active = options.length"
            @click="createFromQuery">
            <span class="lq-autocomplete__label">Use “{{ query.trim() }}”</span>
          </button>
        </div>
      </teleport>
    </div>
  `,
    setup(props, { emit }) {
      const uid = `lq-ac-${(acSeq += 1)}-${Math.random().toString(36).slice(2, 7)}`

      const rootEl = ref(null)
      const inputEl = ref(null)
      const panelEl = ref(null)

      const open = ref(false)
      const query = ref('')
      const active = ref(0)

      const PANEL_MAX = 260
      const PANEL_MIN = 120
      const GAP = 4
      const EDGE = 8

      const iconSize = computed(() => (props.size === 'sm' ? 13 : 15))

      const anchor = ref({ top: 0, left: 0, width: 0, below: true, max: PANEL_MAX })

      const panelStyle = computed(() => ({
        position: 'fixed',
        left: `${anchor.value.left}px`,
        width: `${anchor.value.width}px`,
        maxHeight: `${anchor.value.max}px`,
        ...(anchor.value.below
          ? { top: `${anchor.value.top}px` }
          : { bottom: `${window.innerHeight - anchor.value.top}px` }),
      }))

      const measure = () => {
        const box = rootEl.value && rootEl.value.getBoundingClientRect()
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
        return (match && match.label) ?? props.modelValue
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

      let timer = null

      const search = (value, immediate) => {
        if (timer) clearTimeout(timer)
        if (immediate || props.debounce <= 0) {
          emit('search', value)
          return
        }
        timer = setTimeout(() => emit('search', value), props.debounce)
      }

      const onOutside = (event) => {
        const target = event.target
        if (rootEl.value && rootEl.value.contains(target)) return
        if (panelEl.value && panelEl.value.contains(target)) return
        close()
      }

      const bind = (method) => {
        document[method]('pointerdown', onOutside, true)
        window[method]('scroll', measure, true)
        window[method]('resize', measure)
      }

      function close() {
        open.value = false
        query.value = ''
        bind('removeEventListener')
      }

      const onFocus = () => {
        if (props.disabled) return
        open.value = true
        query.value = ''
        active.value = 0
        emit('open')
        search('', true)
        measure()
        bind('addEventListener')
      }

      const onBlur = () => {
        setTimeout(() => {
          const focused = document.activeElement
          if (rootEl.value && rootEl.value.contains(focused)) return
          if (panelEl.value && panelEl.value.contains(focused)) return
          close()
        }, 0)
      }

      const onInput = (event) => {
        query.value = event.target.value
        open.value = true
        active.value = 0
        search(query.value)
      }

      const blurInput = () => nextTick(() => inputEl.value && inputEl.value.blur())

      const choose = (option) => {
        emit('update:modelValue', option.value)
        close()
        blurInput()
      }

      const createFromQuery = () => {
        emit('update:modelValue', query.value.trim())
        close()
        blurInput()
      }

      const clear = () => {
        emit('update:modelValue', '')
        if (inputEl.value) inputEl.value.focus()
      }

      const onKeydown = (event) => {
        if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
          event.preventDefault()
          if (!open.value) {
            onFocus()
            return
          }
          const total = rowCount.value
          if (!total) return
          active.value = (active.value + (event.key === 'ArrowDown' ? 1 : -1) + total) % total
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
          if (inputEl.value) inputEl.value.blur()
        }
      }

      watch(
        () => props.options,
        () => {
          if (active.value >= rowCount.value) active.value = 0
        },
      )

      onUnmounted(() => {
        if (timer) clearTimeout(timer)
        bind('removeEventListener')
      })

      return {
        uid,
        rootEl,
        inputEl,
        panelEl,
        open,
        query,
        active,
        activeId,
        canCreate,
        iconSize,
        panelStyle,
        text,
        onFocus,
        onBlur,
        onInput,
        onKeydown,
        choose,
        createFromQuery,
        clear,
        iconSvg: window.IconSvg,
      }
    },
  })

  window.LiquidToggle = LiquidToggle
  window.LiquidCheck = LiquidCheck
  window.LiquidSegmented = LiquidSegmented
  window.LiquidSlider = LiquidSlider
  window.LiquidStepper = LiquidStepper
  window.LiquidInput = LiquidInput
  window.LiquidSearchBar = LiquidSearchBar
  window.LiquidAutocomplete = LiquidAutocomplete
})()

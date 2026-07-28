;(function () {
  // ============================================================
  // Liquid UI -- Form components
  // LiquidToggle, LiquidSegmented, LiquidSlider, LiquidInput, LiquidSearchBar, LiquidStepper
  // ============================================================

  const { defineComponent, computed, ref, watch } = Vue

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

  window.LiquidToggle = LiquidToggle
  window.LiquidSegmented = LiquidSegmented
  window.LiquidSlider = LiquidSlider
  window.LiquidStepper = LiquidStepper
  window.LiquidInput = LiquidInput
  window.LiquidSearchBar = LiquidSearchBar
})()

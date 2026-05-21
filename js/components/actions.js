(function() {
// ============================================================
// Liquid UI — Action components (Button, IconButton)
// ============================================================

const { defineComponent, computed, h } = Vue;

// ---------- LiquidButton ----------
const LiquidButton = defineComponent({
  name: 'LiquidButton',
  props: {
    variant: { type: String, default: 'primary' },   // primary | secondary | destructive | tinted | ghost
    size: { type: String, default: 'md' },           // sm | md | lg
    icon: { type: String, default: '' },             // icon name (leading)
    iconRight: { type: String, default: '' },
    block: { type: Boolean, default: false },
    disabled: { type: Boolean, default: false },
    loading: { type: Boolean, default: false },
    rounded: { type: String, default: 'pill' },      // pill | md | lg
  },
  emits: ['click'],
  template: `
    <button
      :class="['lq-btn', 'lq-btn--' + variant, 'lq-btn--' + size, 'lq-btn--r-' + rounded, 'lq-press', { 'is-block': block, 'is-loading': loading, 'is-disabled': disabled }]"
      :disabled="disabled || loading"
      @click="$emit('click', $event)">
      <span v-if="loading" class="lq-btn__spinner" aria-hidden="true"></span>
      <span v-else-if="icon" class="lq-btn__icon" v-html="iconSvg(icon, iconSize)"></span>
      <span class="lq-btn__label"><slot/></span>
      <span v-if="iconRight" class="lq-btn__icon" v-html="iconSvg(iconRight, iconSize)"></span>
    </button>
  `,
  setup(props) {
    const iconSize = computed(() => props.size === 'sm' ? 14 : props.size === 'lg' ? 20 : 16);
    return { iconSvg: window.IconSvg, iconSize };
  }
});

// ---------- LiquidIconButton ----------
const LiquidIconButton = defineComponent({
  name: 'LiquidIconButton',
  props: {
    icon: { type: String, required: true },
    variant: { type: String, default: 'glass' },   // glass | tinted | destructive | ghost
    size: { type: String, default: 'md' },         // sm | md | lg
    label: { type: String, default: '' },          // a11y label
    badge: { type: [String, Number], default: '' },
    disabled: { type: Boolean, default: false },
  },
  emits: ['click'],
  template: `
    <button
      :class="['lq-iconbtn', 'lq-iconbtn--' + variant, 'lq-iconbtn--' + size, 'lq-press', { 'is-disabled': disabled }]"
      :aria-label="label"
      :disabled="disabled"
      @click="$emit('click', $event)">
      <span class="lq-iconbtn__inner" v-html="iconSvg(icon, iconSize)"></span>
      <span v-if="badge !== '' && badge !== null" class="lq-iconbtn__badge">{{ badge }}</span>
    </button>
  `,
  setup(props) {
    const iconSize = computed(() => props.size === 'sm' ? 14 : props.size === 'lg' ? 22 : 18);
    return { iconSvg: window.IconSvg, iconSize };
  }
});

window.LiquidButton = LiquidButton;
window.LiquidIconButton = LiquidIconButton;

})();

(function() {
// ============================================================
// Liquid UI — Display components
// LiquidCard, LiquidBadge, LiquidAvatar, LiquidListRow, LiquidProgress, LiquidSpinner
// ============================================================

const { defineComponent, computed } = Vue;

// ---------- LiquidCard ----------
const LiquidCard = defineComponent({
  name: 'LiquidCard',
  props: {
    variant: { type: String, default: 'glass' },  // glass | strong | tinted | solid
    padding: { type: String, default: 'md' },     // sm | md | lg | none
    rounded: { type: String, default: 'lg' },     // md | lg | xl
    elevated: { type: Boolean, default: true },
  },
  template: `
    <div :class="['lq-card', 'lq-card--' + variant, 'lq-card--p-' + padding, 'lq-card--r-' + rounded, { 'is-elevated': elevated }]">
      <slot/>
    </div>
  `
});

// ---------- LiquidBadge ----------
const LiquidBadge = defineComponent({
  name: 'LiquidBadge',
  props: {
    variant: { type: String, default: 'glass' },  // glass | accent | success | warning | danger
    size: { type: String, default: 'md' },        // sm | md
    icon: { type: String, default: '' },
    dot: { type: Boolean, default: false },
  },
  template: `
    <span :class="['lq-badge', 'lq-badge--' + variant, 'lq-badge--' + size, { 'has-icon': !!icon, 'is-dot': dot }]">
      <span v-if="dot" class="lq-badge__dot"></span>
      <span v-if="icon" class="lq-badge__icon" v-html="iconSvg(icon, size === 'sm' ? 10 : 12)"></span>
      <slot/>
    </span>
  `,
  setup() { return { iconSvg: window.IconSvg }; }
});

// ---------- LiquidAvatar ----------
const LiquidAvatar = defineComponent({
  name: 'LiquidAvatar',
  props: {
    src: { type: String, default: '' },
    initials: { type: String, default: '' },
    size: { type: [String, Number], default: 40 },
    color: { type: String, default: '' },          // hex/css, used when no src
    status: { type: String, default: '' },         // online | away | busy | offline
    badge: { type: [String, Number], default: '' },
    shape: { type: String, default: 'circle' },    // circle | rounded
  },
  template: `
    <span :class="['lq-avatar', 'lq-avatar--' + shape]" :style="rootStyle">
      <img v-if="src" :src="src" :alt="initials" class="lq-avatar__img" />
      <span v-else class="lq-avatar__initials" :style="{ background: bg }">{{ initials || '?' }}</span>
      <span v-if="status" :class="['lq-avatar__status', 'lq-avatar__status--' + status]"></span>
      <span v-if="badge !== '' && badge !== null && badge !== 0" class="lq-avatar__badge">{{ badge }}</span>
    </span>
  `,
  setup(props) {
    const rootStyle = computed(() => ({
      width: typeof props.size === 'number' ? props.size + 'px' : props.size,
      height: typeof props.size === 'number' ? props.size + 'px' : props.size,
      fontSize: `calc(${typeof props.size === 'number' ? props.size + 'px' : props.size} * 0.4)`,
    }));
    const palette = ['#ff6b9d', '#5e8cff', '#30d158', '#ff9f0a', '#bf5af2', '#40c8e0'];
    const bg = computed(() => {
      if (props.color) return props.color;
      const i = (props.initials.charCodeAt(0) || 65) % palette.length;
      return `linear-gradient(135deg, ${palette[i]} 0%, ${palette[(i+2)%palette.length]} 100%)`;
    });
    return { rootStyle, bg };
  }
});

// ---------- LiquidListRow ----------
const LiquidListRow = defineComponent({
  name: 'LiquidListRow',
  props: {
    icon: { type: String, default: '' },
    iconBg: { type: String, default: '' },   // a color or 'accent' etc
    title: { type: String, default: '' },
    subtitle: { type: String, default: '' },
    value: { type: String, default: '' },
    chevron: { type: Boolean, default: false },
    interactive: { type: Boolean, default: true },
    divider: { type: Boolean, default: true },
  },
  emits: ['click'],
  template: `
    <div
      :class="['lq-row', { 'is-interactive': interactive, 'has-divider': divider }]"
      @click="interactive && $emit('click', $event)">
      <span v-if="icon" class="lq-row__iconwrap" :style="{ background: iconBg || 'rgba(255,255,255,0.08)' }">
        <span v-html="iconSvg(icon, 16)"></span>
      </span>
      <div class="lq-row__main">
        <div class="lq-row__title"><slot name="title">{{ title }}</slot></div>
        <div v-if="subtitle || $slots.subtitle" class="lq-row__subtitle"><slot name="subtitle">{{ subtitle }}</slot></div>
      </div>
      <div v-if="$slots.value || value" class="lq-row__value">
        <slot name="value">{{ value }}</slot>
      </div>
      <slot name="trailing"/>
      <span v-if="chevron" class="lq-row__chevron" v-html="iconSvg('chevronRight', 14)"></span>
    </div>
  `,
  setup() { return { iconSvg: window.IconSvg }; }
});

// ---------- LiquidProgress (linear) ----------
const LiquidProgress = defineComponent({
  name: 'LiquidProgress',
  props: {
    value: { type: Number, default: 0 },    // 0-100; null/indeterminate when -1
    color: { type: String, default: 'accent' },
    size: { type: String, default: 'md' },   // sm | md
    indeterminate: { type: Boolean, default: false },
    label: { type: String, default: '' },
  },
  template: `
    <div class="lq-progress-wrap">
      <div v-if="label" class="lq-progress-label">{{ label }}</div>
      <div :class="['lq-progress', 'lq-progress--' + color, 'lq-progress--' + size, { 'is-indeterminate': indeterminate }]">
        <div v-if="!indeterminate" class="lq-progress__fill" :style="{ width: clamped + '%' }"></div>
        <div v-else class="lq-progress__indet"></div>
      </div>
    </div>
  `,
  setup(props) {
    const clamped = computed(() => Math.max(0, Math.min(100, props.value)));
    return { clamped };
  }
});

// ---------- LiquidSpinner ----------
const LiquidSpinner = defineComponent({
  name: 'LiquidSpinner',
  props: {
    size: { type: [String, Number], default: 18 },
    color: { type: String, default: '' },
  },
  template: `
    <span class="lq-spinner" :style="rootStyle">
      <svg viewBox="0 0 24 24" :width="size" :height="size">
        <circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="2.4" fill="none" opacity="0.18"/>
        <path d="M12 3a9 9 0 0 1 9 9" stroke="currentColor" stroke-width="2.4" fill="none" stroke-linecap="round"/>
      </svg>
    </span>
  `,
  setup(props) {
    const rootStyle = computed(() => ({
      color: props.color || 'currentColor',
      width: (typeof props.size === 'number' ? props.size + 'px' : props.size),
      height: (typeof props.size === 'number' ? props.size + 'px' : props.size),
    }));
    return { rootStyle };
  }
});

window.LiquidCard = LiquidCard;
window.LiquidBadge = LiquidBadge;
window.LiquidAvatar = LiquidAvatar;
window.LiquidListRow = LiquidListRow;
window.LiquidProgress = LiquidProgress;
window.LiquidSpinner = LiquidSpinner;

})();

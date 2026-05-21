// ============================================================
// Docs registry — one entry per component shown in the showcase.
// Each entry defines: title, eyebrow, description, the live Vue
// component to mount in the demo, knob definitions for the
// playground, a variant gallery, the SFC source, and a usage
// snippet shown in the code panel.
// ============================================================

window.LiquidDocs = [
  // -----------------------------------------------------------
  // ACTIONS
  // -----------------------------------------------------------
  {
    id: 'button', category: 'Actions', label: 'Button', icon: 'bolt',
    title: 'Button',
    description: 'The primary call-to-action. Five variants — primary, secondary glass, destructive, tinted, and ghost — with three sizes and optional leading/trailing icons. The signature top inner highlight + soft saturated drop shadow gives every press surface a hint of refraction.',
    component: 'LiquidButton',
    knobs: {
      label: { type: 'text', default: 'Continue' },
      variant: { type: 'select', options: ['primary', 'secondary', 'destructive', 'tinted', 'ghost'], default: 'primary' },
      size: { type: 'seg', options: ['sm', 'md', 'lg'], default: 'md' },
      rounded: { type: 'seg', options: ['pill', 'md', 'lg'], default: 'pill' },
      icon: { type: 'select', options: ['', 'play', 'sparkles', 'plus', 'check', 'trash', 'share'], default: '' },
      iconRight: { type: 'select', options: ['', 'chevronRight', 'chevronDown'], default: '' },
      block: { type: 'bool', default: false },
      loading: { type: 'bool', default: false },
      disabled: { type: 'bool', default: false },
    },
    render: (k) => `<liquid-button variant="${k.variant}" size="${k.size}" rounded="${k.rounded}" icon="${k.icon}" icon-right="${k.iconRight}" ${k.block?'block':''} ${k.loading?'loading':''} ${k.disabled?'disabled':''}>${k.label}</liquid-button>`,
    variants: [
      { label: 'Primary', props: { variant: 'primary' }, slot: 'Continue' },
      { label: 'Destructive', props: { variant: 'destructive' }, slot: 'Delete' },
      { label: 'Secondary', props: { variant: 'secondary' }, slot: 'Cancel' },
      { label: 'Tinted', props: { variant: 'tinted' }, slot: 'Subscribe' },
      { label: 'Ghost', props: { variant: 'ghost' }, slot: 'Skip' },
      { label: 'With icon', props: { variant: 'primary', icon: 'play' }, slot: 'Play' },
      { label: 'Loading', props: { variant: 'primary', loading: true }, slot: 'Saving…' },
      { label: 'Disabled', props: { variant: 'primary', disabled: true }, slot: 'Submit' },
    ],
    usage: `<template>
  <LiquidButton variant="primary" icon="play" @click="onPlay">
    Play
  </LiquidButton>

  <LiquidButton variant="destructive" @click="onDelete">
    Delete
  </LiquidButton>

  <LiquidButton variant="secondary">Cancel</LiquidButton>
</template>

<script setup>
import { LiquidButton } from 'liquid-ui'

const onPlay = () => console.log('play')
const onDelete = () => console.log('delete')
</script>`,
    sfc: `<template>
  <button
    :class="[
      'lq-btn',
      \`lq-btn--\${variant}\`,
      \`lq-btn--\${size}\`,
      \`lq-btn--r-\${rounded}\`,
      'lq-press',
      { 'is-block': block, 'is-loading': loading }
    ]"
    :disabled="disabled || loading"
    @click="$emit('click', $event)"
  >
    <span v-if="loading" class="lq-btn__spinner" />
    <span v-else-if="icon" v-html="iconSvg(icon)" />
    <span class="lq-btn__label"><slot/></span>
    <span v-if="iconRight" v-html="iconSvg(iconRight)" />
  </button>
</template>

<script setup>
import { iconSvg } from '../icons'

defineProps({
  variant:   { type: String, default: 'primary' },
  size:      { type: String, default: 'md' },
  rounded:   { type: String, default: 'pill' },
  icon:      { type: String, default: '' },
  iconRight: { type: String, default: '' },
  block:     Boolean,
  loading:   Boolean,
  disabled:  Boolean,
})
defineEmits(['click'])
</script>`,
  },

  {
    id: 'iconbutton', category: 'Actions', label: 'IconButton', icon: 'sparkles',
    title: 'Icon Button',
    description: 'A circular icon-only action for toolbars, headers, and floating controls. Pairs perfectly with the larger buttons — same glass language at a smaller surface.',
    component: 'LiquidIconButton',
    knobs: {
      icon: { type: 'select', options: ['share', 'more', 'undo', 'redo', 'search', 'plus', 'check'], default: 'share' },
      variant: { type: 'seg', options: ['glass', 'tinted', 'destructive', 'ghost'], default: 'glass' },
      size: { type: 'seg', options: ['sm', 'md', 'lg'], default: 'md' },
      badge: { type: 'text', default: '' },
      disabled: { type: 'bool', default: false },
    },
    render: (k) => `<liquid-icon-button icon="${k.icon}" variant="${k.variant}" size="${k.size}" badge="${k.badge}" ${k.disabled?'disabled':''} label="${k.icon}"></liquid-icon-button>`,
    variants: [
      { label: 'Share', props: { icon: 'share', variant: 'glass' } },
      { label: 'More', props: { icon: 'more', variant: 'glass' } },
      { label: 'Undo', props: { icon: 'undo', variant: 'glass' } },
      { label: 'Tinted', props: { icon: 'check', variant: 'tinted' } },
      { label: 'Destructive', props: { icon: 'trash', variant: 'destructive' } },
      { label: 'With badge', props: { icon: 'bell', variant: 'glass', badge: '3' } },
    ],
    usage: `<LiquidIconButton icon="share" label="Share" @click="share" />
<LiquidIconButton icon="trash" variant="destructive" label="Delete" />
<LiquidIconButton icon="bell" badge="3" label="Notifications" />`,
    sfc: `<template>
  <button
    :class="['lq-iconbtn', \`lq-iconbtn--\${variant}\`, \`lq-iconbtn--\${size}\`, 'lq-press']"
    :aria-label="label"
    :disabled="disabled"
    @click="$emit('click', $event)"
  >
    <span class="lq-iconbtn__inner" v-html="iconSvg(icon, iconSize)" />
    <span v-if="badge" class="lq-iconbtn__badge">{{ badge }}</span>
  </button>
</template>`,
  },

  // -----------------------------------------------------------
  // FORMS
  // -----------------------------------------------------------
  {
    id: 'toggle', category: 'Forms', label: 'Toggle', icon: 'speaker',
    title: 'Toggle',
    description: 'Binary switch with a chunky 3D thumb that springs across the track. Glow tinted to match the active color. Tap to flip; v-model binds a boolean.',
    component: 'LiquidToggle',
    knobs: {
      modelValue: { type: 'bool', default: true, label: 'value' },
      color: { type: 'select', options: ['green', 'accent', 'orange', 'red', 'purple'], default: 'green' },
      size: { type: 'seg', options: ['sm', 'md'], default: 'md' },
      disabled: { type: 'bool', default: false },
    },
    isModel: 'modelValue',
    render: (k) => `<liquid-toggle :model-value="${k.modelValue}" color="${k.color}" size="${k.size}" ${k.disabled?'disabled':''} @update:model-value="updateValue"></liquid-toggle>`,
    variants: [
      { label: 'Green (on)', props: { modelValue: true, color: 'green' } },
      { label: 'Off', props: { modelValue: false } },
      { label: 'Accent', props: { modelValue: true, color: 'accent' } },
      { label: 'Orange', props: { modelValue: true, color: 'orange' } },
      { label: 'Small', props: { modelValue: true, size: 'sm' } },
      { label: 'Disabled', props: { modelValue: false, disabled: true } },
    ],
    usage: `<LiquidToggle v-model="wifi" color="green" />
<LiquidToggle v-model="airplane" color="orange" />`,
    sfc: `<template>
  <button
    :class="['lq-toggle', \`lq-toggle--\${size}\`, \`lq-toggle--\${color}\`, { 'is-on': modelValue }]"
    role="switch"
    :aria-checked="modelValue"
    :disabled="disabled"
    @click="toggle"
  >
    <span class="lq-toggle__track" />
    <span class="lq-toggle__thumb" />
  </button>
</template>

<script setup>
const props = defineProps({
  modelValue: Boolean,
  color:      { type: String, default: 'green' },
  size:       { type: String, default: 'md' },
  disabled:   Boolean,
})
const emit = defineEmits(['update:modelValue'])
const toggle = () => !props.disabled && emit('update:modelValue', !props.modelValue)
</script>`,
  },

  {
    id: 'segmented', category: 'Forms', label: 'Segmented', icon: 'layers',
    title: 'Segmented Control',
    description: 'Pick one option from a small set. The selected indicator slides on a spring; underlying glass refracts the wallpaper behind it.',
    component: 'LiquidSegmented',
    knobs: {
      modelValue: { type: 'select', options: ['style', 'text', 'arrange'], default: 'text', label: 'value' },
      size: { type: 'seg', options: ['sm', 'md'], default: 'md' },
    },
    isModel: 'modelValue',
    ctxExtras: () => ({ segOpts: [{value:'style',label:'Style'},{value:'text',label:'Text'},{value:'arrange',label:'Arrange'}] }),
    render: (k) => `<liquid-segmented :model-value="modelValue" size="${k.size}" :options="segOpts" @update:model-value="updateValue"></liquid-segmented>`,
    variants: [
      { label: 'Three options', props: { modelValue: 'b', options: [{value:'a',label:'Style'},{value:'b',label:'Text'},{value:'c',label:'Arrange'}] } },
      { label: 'Two options', props: { modelValue: 'a', options: [{value:'a',label:'Day'},{value:'b',label:'Week'}] } },
      { label: 'Small', props: { modelValue: 'b', size: 'sm', options: [{value:'a',label:'Style'},{value:'b',label:'Text'},{value:'c',label:'Arrange'}] } },
      { label: 'With icons', props: { modelValue: 'home', options: [{value:'home',label:'Home',icon:'home'},{value:'apps',label:'Apps',icon:'apps'},{value:'arcade',label:'Arcade',icon:'arcade'}] } },
    ],
    usage: `<LiquidSegmented
  v-model="mode"
  :options="[
    { value: 'style',   label: 'Style' },
    { value: 'text',    label: 'Text' },
    { value: 'arrange', label: 'Arrange' },
  ]"
/>`,
    sfc: `<template>
  <div :class="['lq-seg', \`lq-seg--\${size}\`]">
    <button v-for="opt in options" :key="opt.value"
      :class="['lq-seg__opt', { 'is-active': opt.value === modelValue }]"
      @click="$emit('update:modelValue', opt.value)">
      <span v-if="opt.icon" v-html="iconSvg(opt.icon)" />
      <span>{{ opt.label }}</span>
    </button>
    <span class="lq-seg__indicator" :style="indicatorStyle" />
  </div>
</template>`,
  },

  {
    id: 'slider', category: 'Forms', label: 'Slider', icon: 'sun',
    title: 'Slider',
    description: 'Drag the thumb to set a value. Use the iconLeft / iconRight props for context (sun for brightness, volume for audio). Spring-thumb and soft glow on the fill.',
    component: 'LiquidSlider',
    knobs: {
      modelValue: { type: 'slider', min: 0, max: 100, default: 65, label: 'value' },
      color: { type: 'seg', options: ['accent', 'white', 'green'], default: 'white' },
      iconLeft: { type: 'select', options: ['', 'sun', 'volume', 'moon'], default: 'sun' },
      iconRight: { type: 'select', options: ['', 'sun', 'volume', 'moon'], default: '' },
      showValue: { type: 'bool', default: false },
      disabled: { type: 'bool', default: false },
    },
    isModel: 'modelValue',
    render: (k) => `<liquid-slider :model-value="${k.modelValue}" color="${k.color}" icon-left="${k.iconLeft}" icon-right="${k.iconRight}" ${k.showValue?'show-value':''} ${k.disabled?'disabled':''} @update:model-value="updateValue"></liquid-slider>`,
    variants: [
      { label: 'Brightness', props: { modelValue: 65, iconLeft: 'sun' } },
      { label: 'Volume', props: { modelValue: 40, iconLeft: 'volume', color: 'white' } },
      { label: 'Accent', props: { modelValue: 80, color: 'accent' } },
      { label: 'With value', props: { modelValue: 50, showValue: true, iconLeft: 'sun' } },
    ],
    usage: `<LiquidSlider v-model="brightness" icon-left="sun" />
<LiquidSlider v-model="volume" icon-left="volume" color="white" />`,
  },

  {
    id: 'input', category: 'Forms', label: 'Input', icon: 'edit',
    title: 'Input',
    description: 'Single-line text input with optional leading icon, clearable affordance, and focus ring tinted with your accent color.',
    component: 'LiquidInput',
    knobs: {
      modelValue: { type: 'text', default: '', label: 'value' },
      placeholder: { type: 'text', default: 'Name' },
      icon: { type: 'select', options: ['', 'person', 'message', 'search', 'edit'], default: '' },
      size: { type: 'seg', options: ['sm', 'md', 'lg'], default: 'md' },
      clearable: { type: 'bool', default: true },
      disabled: { type: 'bool', default: false },
    },
    isModel: 'modelValue',
    render: (k) => `<liquid-input :model-value="'${k.modelValue}'" placeholder="${k.placeholder}" icon="${k.icon}" size="${k.size}" ${k.clearable?'clearable':''} ${k.disabled?'disabled':''} @update:model-value="updateValue"></liquid-input>`,
    variants: [
      { label: 'Plain', props: { modelValue: '', placeholder: 'Your name' } },
      { label: 'With icon', props: { modelValue: 'shira@apple.com', placeholder: 'Email', icon: 'message' } },
      { label: 'Clearable', props: { modelValue: 'Drafting…', clearable: true } },
    ],
    usage: `<LiquidInput v-model="email" icon="message" placeholder="Email" clearable />`,
  },

  {
    id: 'searchbar', category: 'Forms', label: 'SearchBar', icon: 'search',
    title: 'Search Bar',
    description: 'iOS-style search field — pill shape, leading search glyph, optional voice mic. Drop it into a navigation header or a sheet.',
    component: 'LiquidSearchBar',
    knobs: {
      modelValue: { type: 'text', default: '', label: 'value' },
      placeholder: { type: 'text', default: 'Search' },
      showMic: { type: 'bool', default: true },
    },
    isModel: 'modelValue',
    render: (k) => `<liquid-search-bar :model-value="'${k.modelValue}'" placeholder="${k.placeholder}" :show-mic="${k.showMic}" @update:model-value="updateValue"></liquid-search-bar>`,
    variants: [
      { label: 'Empty', props: { modelValue: '', placeholder: 'Search' } },
      { label: 'Filled', props: { modelValue: 'Bon Iver', placeholder: 'Search' } },
      { label: 'No mic', props: { modelValue: '', showMic: false } },
    ],
    usage: `<LiquidSearchBar v-model="query" placeholder="Search music" @submit="onSearch" />`,
  },

  {
    id: 'stepper', category: 'Forms', label: 'Stepper', icon: 'plus',
    title: 'Stepper',
    description: 'Compact +/− control. Min/max/step clamp the value. Tap-and-hold support is up to you to bind.',
    component: 'LiquidStepper',
    knobs: {
      modelValue: { type: 'slider', min: 0, max: 20, default: 4, label: 'value' },
      min: { type: 'slider', min: 0, max: 10, default: 0 },
      max: { type: 'slider', min: 1, max: 50, default: 20 },
    },
    isModel: 'modelValue',
    render: (k) => `<liquid-stepper :model-value="${k.modelValue}" :min="${k.min}" :max="${k.max}" @update:model-value="updateValue"></liquid-stepper>`,
    variants: [
      { label: 'Default', props: { modelValue: 4 } },
      { label: 'At min', props: { modelValue: 0 } },
      { label: 'At max', props: { modelValue: 20 } },
    ],
    usage: `<LiquidStepper v-model="quantity" :min="0" :max="20" />`,
  },

  // -----------------------------------------------------------
  // DISPLAY
  // -----------------------------------------------------------
  {
    id: 'card', category: 'Display', label: 'Card', icon: 'cube',
    title: 'Card',
    description: 'A flexible glass surface. Use `variant="glass"` over a wallpaper, `strong` over a busy page, `tinted` for promotional content, and `solid` for chrome-y UI.',
    component: 'LiquidCard',
    knobs: {
      variant: { type: 'seg', options: ['glass', 'strong', 'tinted', 'solid'], default: 'glass' },
      padding: { type: 'seg', options: ['sm', 'md', 'lg'], default: 'md' },
      rounded: { type: 'seg', options: ['md', 'lg', 'xl'], default: 'lg' },
    },
    render: (k) => `<liquid-card variant="${k.variant}" padding="${k.padding}" rounded="${k.rounded}" style="max-width:280px"><div style="font-weight:600;font-size:15px;margin-bottom:4px">Liquid Glass</div><div style="color:var(--text-2);font-size:13.5px;line-height:1.45">A flexible surface for grouping content. Layers blur, tint, and a soft top highlight.</div></liquid-card>`,
    variants: [],
    usage: `<LiquidCard variant="glass" padding="md">
  <h3>Card title</h3>
  <p>Some content goes here.</p>
</LiquidCard>`,
  },

  {
    id: 'badge', category: 'Display', label: 'Badge', icon: 'sparkles',
    title: 'Badge',
    description: 'Tiny status/label chips. Five variants: glass, accent, success, warning, danger. Optional leading icon or pulse dot.',
    component: 'LiquidBadge',
    knobs: {
      variant: { type: 'seg', options: ['glass', 'accent', 'success', 'warning', 'danger'], default: 'glass' },
      size: { type: 'seg', options: ['sm', 'md'], default: 'md' },
      icon: { type: 'select', options: ['', 'check', 'bolt', 'sparkles'], default: '' },
      dot: { type: 'bool', default: false },
      label: { type: 'text', default: 'New' },
    },
    render: (k) => `<liquid-badge variant="${k.variant}" size="${k.size}" icon="${k.icon}" ${k.dot?'dot':''}>${k.label}</liquid-badge>`,
    variants: [
      { label: 'Glass', props: { variant: 'glass' }, slot: 'Beta' },
      { label: 'Accent', props: { variant: 'accent' }, slot: 'New' },
      { label: 'Success', props: { variant: 'success', icon: 'check' }, slot: 'Done' },
      { label: 'Warning', props: { variant: 'warning' }, slot: 'Pending' },
      { label: 'Danger', props: { variant: 'danger', dot: true }, slot: 'Live' },
    ],
    usage: `<LiquidBadge variant="success" icon="check">Verified</LiquidBadge>
<LiquidBadge variant="danger" dot>Live</LiquidBadge>`,
  },

  {
    id: 'avatar', category: 'Display', label: 'Avatar', icon: 'person',
    title: 'Avatar',
    description: 'User avatar with image or generated initials, status dot, and optional unread badge. Use `shape="rounded"` for app-style icons.',
    component: 'LiquidAvatar',
    knobs: {
      initials: { type: 'text', default: 'SS' },
      size: { type: 'slider', min: 24, max: 80, default: 48 },
      status: { type: 'select', options: ['', 'online', 'away', 'busy', 'offline'], default: 'online' },
      shape: { type: 'seg', options: ['circle', 'rounded'], default: 'circle' },
      badge: { type: 'text', default: '' },
    },
    render: (k) => `<liquid-avatar initials="${k.initials}" :size="${k.size}" status="${k.status}" shape="${k.shape}" badge="${k.badge}"></liquid-avatar>`,
    variants: [
      { label: 'Initials', props: { initials: 'SS', size: 48 } },
      { label: 'Online', props: { initials: 'AK', size: 48, status: 'online' } },
      { label: 'Busy', props: { initials: 'MR', size: 48, status: 'busy' } },
      { label: 'With badge', props: { initials: 'JD', size: 48, badge: '2' } },
      { label: 'Rounded', props: { initials: 'XL', size: 48, shape: 'rounded' } },
    ],
    usage: `<LiquidAvatar initials="SS" status="online" :size="48" />
<LiquidAvatar src="/u/shira.jpg" badge="3" />`,
  },

  {
    id: 'listrow', category: 'Display', label: 'List Row', icon: 'options',
    title: 'List Row',
    description: 'A single row in a settings list — colored icon tile, title, subtitle, value, chevron. Stack them inside a `LiquidCard` for the classic grouped-list look.',
    component: 'LiquidListRow',
    knobs: {
      icon: { type: 'select', options: ['airplane', 'wifi', 'bluetooth', 'bell', 'shield'], default: 'airplane' },
      iconBg: { type: 'select', options: ['var(--orange)', 'var(--accent)', 'var(--green)', 'var(--red)', 'var(--purple)'], default: 'var(--orange)' },
      title: { type: 'text', default: 'Airplane Mode' },
      subtitle: { type: 'text', default: '' },
      value: { type: 'text', default: 'Not Connected' },
      chevron: { type: 'bool', default: true },
    },
    render: (k) => `<div style="width:320px"><liquid-card variant="strong" padding="none" rounded="lg"><liquid-list-row icon="${k.icon}" icon-bg="${k.iconBg}" title="${k.title}" subtitle="${k.subtitle}" value="${k.value}" ${k.chevron?'chevron':''} :divider="false"></liquid-list-row></liquid-card></div>`,
    variants: [],
    usage: `<LiquidCard variant="strong" padding="none">
  <LiquidListRow icon="airplane" icon-bg="var(--orange)"
    title="Airplane Mode" value="Off" />
  <LiquidListRow icon="wifi" icon-bg="var(--accent)"
    title="Wi-Fi" value="Home" chevron />
  <LiquidListRow icon="bluetooth" icon-bg="var(--accent)"
    title="Bluetooth" value="On" chevron />
</LiquidCard>`,
  },

  {
    id: 'progress', category: 'Display', label: 'Progress', icon: 'loader',
    title: 'Progress',
    description: 'Linear progress bar. Set `value` (0–100) for determinate, or pass `indeterminate` for the looping shimmer used during syncing.',
    component: 'LiquidProgress',
    knobs: {
      value: { type: 'slider', min: 0, max: 100, default: 64 },
      color: { type: 'seg', options: ['accent', 'success', 'warning', 'white'], default: 'white' },
      indeterminate: { type: 'bool', default: false },
      label: { type: 'text', default: 'Syncing…' },
    },
    render: (k) => `<div style="width:280px"><liquid-progress :value="${k.value}" color="${k.color}" ${k.indeterminate?'indeterminate':''} label="${k.label}"></liquid-progress></div>`,
    variants: [
      { label: '64%', props: { value: 64, label: 'Syncing…' } },
      { label: 'Indeterminate', props: { indeterminate: true, label: 'Syncing…' } },
      { label: 'Success', props: { value: 100, color: 'success', label: 'Done' } },
    ],
    usage: `<LiquidProgress :value="syncPct" label="Syncing…" />
<LiquidProgress indeterminate label="Loading" />`,
  },

  {
    id: 'spinner', category: 'Display', label: 'Spinner', icon: 'loader',
    title: 'Spinner',
    description: 'A subtle circular indeterminate loader. Inherits `currentColor`, so it works against any surface.',
    component: 'LiquidSpinner',
    knobs: {
      size: { type: 'slider', min: 12, max: 48, default: 22 },
    },
    render: (k) => `<liquid-spinner :size="${k.size}"></liquid-spinner>`,
    variants: [],
    usage: `<LiquidSpinner :size="22" />`,
  },

  // -----------------------------------------------------------
  // OVERLAYS
  // -----------------------------------------------------------
  {
    id: 'modal', category: 'Overlays', label: 'Modal', icon: 'shield',
    title: 'Modal',
    description: 'A centered confirmation dialog with the classic iOS divider buttons. `v-model` controls visibility; `@confirm` and `@cancel` fire when the user acts.',
    component: '__inline_modal',
    knobs: {
      title: { type: 'text', default: 'Delete Recording?' },
      message: { type: 'text', default: "This recording will be removed from your library. This can't be undone." },
      confirmText: { type: 'text', default: 'Delete' },
      cancelText: { type: 'text', default: 'Cancel' },
      destructive: { type: 'bool', default: true },
      icon: { type: 'select', options: ['', 'trash', 'shield', 'bell'], default: 'trash' },
    },
    custom: 'modal',
    variants: [],
    usage: `<LiquidButton @click="open = true">Show dialog</LiquidButton>

<LiquidModal
  v-model="open"
  title="Delete Recording?"
  message="This can't be undone."
  confirm-text="Delete"
  destructive
  icon="trash"
  @confirm="del"
/>`,
  },

  {
    id: 'menu', category: 'Overlays', label: 'Context Menu', icon: 'options',
    title: 'Context Menu',
    description: 'A floating list of actions. Glass tinted, items support icons and danger styling.',
    component: 'LiquidContextMenu',
    custom: 'menu',
    knobs: {},
    usage: `<LiquidContextMenu
  :items="[
    { label: 'Edit Recording', icon: 'edit' },
    { label: 'View Transcript', icon: 'transcript' },
    { label: 'Options', icon: 'options' },
    { divider: true },
    { label: 'Share', icon: 'share' },
    { label: 'Copy', icon: 'copy' },
    { label: 'Duplicate', icon: 'duplicate' },
    { label: 'Delete', icon: 'trash', danger: true },
  ]"
  @select="onAction"
/>`,
  },

  {
    id: 'toast', category: 'Overlays', label: 'Toast', icon: 'bell',
    title: 'Toast',
    description: 'A transient notification that floats in from the bottom. Pair with a timer to auto-dismiss. Variants: glass, success, warning, danger.',
    component: 'LiquidToast',
    custom: 'toast',
    knobs: {
      title: { type: 'text', default: 'Copied to clipboard' },
      description: { type: 'text', default: '' },
      variant: { type: 'seg', options: ['glass', 'success', 'warning', 'danger'], default: 'glass' },
      icon: { type: 'select', options: ['', 'check', 'bell', 'bolt'], default: 'check' },
    },
    usage: `<LiquidToast
  v-model="showToast"
  title="Copied to clipboard"
  icon="check"
  variant="glass"
/>`,
  },

  {
    id: 'notification', category: 'Overlays', label: 'Notification', icon: 'bell',
    title: 'Notification',
    description: 'A lock-screen-style notification banner. Use for previewing how your app surfaces messages in iOS.',
    component: 'LiquidNotification',
    knobs: {
      appName: { type: 'text', default: 'Messages' },
      appIcon: { type: 'select', options: ['message', 'bell', 'bolt'], default: 'message' },
      title: { type: 'text', default: 'Shira Salehi' },
      message: { type: 'text', default: 'Leaving now — see you in 10 minutes!' },
      time: { type: 'text', default: 'now' },
      grouped: { type: 'slider', min: 0, max: 5, default: 0 },
    },
    render: (k) => `<div style="width:340px"><liquid-notification app-name="${k.appName}" app-icon="${k.appIcon}" title="${k.title}" message="${k.message}" time="${k.time}" :grouped="${k.grouped}"></liquid-notification></div>`,
    variants: [],
    usage: `<LiquidNotification
  app-name="Messages"
  app-icon="message"
  app-color="var(--green)"
  title="Shira Salehi"
  message="Leaving now"
  time="now"
/>`,
  },

  // -----------------------------------------------------------
  // NAV
  // -----------------------------------------------------------
  {
    id: 'tabbar', category: 'Navigation', label: 'Tab Bar', icon: 'apps',
    title: 'Tab Bar',
    description: 'The floating bottom navigation. Active item gets an accent-tinted glass pill; supports badges for unread counts.',
    component: 'LiquidTabBar',
    custom: 'tabbar',
    knobs: {
      modelValue: { type: 'seg', options: ['today', 'games', 'apps', 'arcade'], default: 'today', label: 'active' },
    },
    isModel: 'modelValue',
    usage: `<LiquidTabBar
  v-model="tab"
  :items="[
    { value: 'today',  label: 'Today',  icon: 'today' },
    { value: 'games',  label: 'Games',  icon: 'rocket', badge: 2 },
    { value: 'apps',   label: 'Apps',   icon: 'apps' },
    { value: 'arcade', label: 'Arcade', icon: 'arcade' },
  ]"
/>`,
  },

  // -----------------------------------------------------------
  // MEDIA
  // -----------------------------------------------------------
  {
    id: 'audio', category: 'Media', label: 'Audio Player', icon: 'play',
    title: 'Audio Player',
    description: 'Mini-player card with cover art, scrubbable progress, and play/skip controls. Times tick when playing.',
    component: 'LiquidAudioPlayer',
    knobs: {
      title: { type: 'text', default: 'Everything Is Free' },
      artist: { type: 'text', default: 'Bon Iver' },
      coverColor: { type: 'select', options: ['linear-gradient(135deg,#ff6b9d,#a85ef2)', 'linear-gradient(135deg,#ff5a5a,#ff9a3c)', 'linear-gradient(135deg,#30d158,#0a84ff)', 'linear-gradient(135deg,#bf5af2,#5e5ce6)'], default: 'linear-gradient(135deg,#ff5a5a,#ff9a3c)' },
      duration: { type: 'slider', min: 60, max: 600, default: 240 },
      compact: { type: 'bool', default: false },
    },
    render: (k) => `<liquid-audio-player title="${k.title}" artist="${k.artist}" cover-color="${k.coverColor}" :duration="${k.duration}" ${k.compact?'compact':''}></liquid-audio-player>`,
    variants: [
      { label: 'Full', props: { title: 'Everything Is Free', artist: 'Bon Iver' } },
      { label: 'Compact', props: { title: 'Holocene', artist: 'Bon Iver', compact: true } },
    ],
    usage: `<LiquidAudioPlayer
  title="Everything Is Free"
  artist="Bon Iver"
  :duration="240"
  cover-color="linear-gradient(135deg,#ff5a5a,#ff9a3c)"
/>`,
  },

  // -----------------------------------------------------------
  // INPUT
  // -----------------------------------------------------------
  {
    id: 'keyboard', category: 'Input', label: 'Keyboard', icon: 'shift',
    title: 'Keyboard',
    description: 'The iOS soft keyboard, rendered as glass keys. Emits a `key` event for every press — wire it to an input or your own state machine.',
    component: 'LiquidKeyboard',
    knobs: {
      layout: { type: 'seg', options: ['letters', 'numbers'], default: 'letters' },
      capsLock: { type: 'bool', default: false },
    },
    render: (k) => `<liquid-keyboard layout="${k.layout}" :caps-lock="${k.capsLock}" @key="onKey"></liquid-keyboard>`,
    variants: [],
    usage: `<LiquidKeyboard
  :caps-lock="caps"
  @key="onKey"
/>

<script setup>
const onKey = (k) => {
  if (k === 'backspace') text.value = text.value.slice(0, -1)
  else if (k === 'shift') caps.value = !caps.value
  else if (k.length === 1) text.value += k
}
</script>`,
  },
];

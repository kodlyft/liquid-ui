<template>
  <div
    :class="['lq-row', { 'is-interactive': interactive, 'has-divider': divider }]"
    @click="onClick"
  >
    <span
      v-if="icon"
      class="lq-row__iconwrap"
      :style="{ background: iconBg || 'rgba(255,255,255,0.08)' }"
    >
      <span v-html="iconSvg(icon, 16)" />
    </span>
    <div class="lq-row__main">
      <div class="lq-row__title">
        <slot name="title">{{ title }}</slot>
      </div>
      <div v-if="subtitle || $slots.subtitle" class="lq-row__subtitle">
        <slot name="subtitle">{{ subtitle }}</slot>
      </div>
    </div>
    <div v-if="$slots.value || value" class="lq-row__value">
      <slot name="value">{{ value }}</slot>
    </div>
    <slot name="trailing" />
    <span v-if="chevron" class="lq-row__chevron" v-html="iconSvg('chevronRight', 14)" />
  </div>
</template>

<script setup lang="ts">
import { iconSvg, type IconName } from '../../icons'

interface Props {
  icon?: IconName | ''
  iconBg?: string
  title?: string
  subtitle?: string
  value?: string
  chevron?: boolean
  interactive?: boolean
  divider?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  icon: '',
  iconBg: '',
  title: '',
  subtitle: '',
  value: '',
  chevron: false,
  interactive: true,
  divider: true,
})

const emit = defineEmits<{ (e: 'click', event: MouseEvent): void }>()

function onClick(e: MouseEvent) {
  if (props.interactive) emit('click', e)
}
</script>

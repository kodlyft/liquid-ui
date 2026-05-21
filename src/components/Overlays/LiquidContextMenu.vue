<template>
  <div class="lq-menu lq-glass-strong lq-specular" role="menu">
    <template v-for="(item, i) in items" :key="i">
      <div v-if="item.divider" class="lq-menu__divider" />
      <button
        v-else
        :class="['lq-menu__item', { 'is-danger': item.danger, 'is-disabled': item.disabled }]"
        :disabled="item.disabled"
        @click="$emit('select', item)"
      >
        <span class="lq-menu__label">{{ item.label }}</span>
        <span v-if="item.icon" class="lq-menu__icon" v-html="iconSvg(item.icon, 16)" />
      </button>
    </template>
  </div>
</template>

<script setup lang="ts">
import { iconSvg, type IconName } from '../../icons'

export interface MenuItem {
  label?: string
  icon?: IconName
  danger?: boolean
  divider?: boolean
  disabled?: boolean
  key?: string
}

interface Props {
  items: MenuItem[]
}

defineProps<Props>()
defineEmits<{ (e: 'select', item: MenuItem): void }>()
</script>

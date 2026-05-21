<template>
  <nav :class="['lq-tabbar', { 'is-floating': floating }]" role="tablist">
    <button
      v-for="item in items"
      :key="String(item.value)"
      :class="['lq-tabbar__item', { 'is-active': item.value === modelValue }]"
      role="tab"
      :aria-selected="item.value === modelValue"
      @click="$emit('update:modelValue', item.value)"
    >
      <span class="lq-tabbar__iconwrap">
        <span class="lq-tabbar__icon" v-html="iconSvg(item.icon, 24)" />
        <span v-if="item.badge" class="lq-tabbar__badge">{{ item.badge }}</span>
      </span>
      <span class="lq-tabbar__label">{{ item.label }}</span>
    </button>
  </nav>
</template>

<script setup lang="ts" generic="T extends string | number">
import { iconSvg, type IconName } from '../../icons'

export interface TabBarItem<V> {
  value: V
  label: string
  icon: IconName
  badge?: string | number
}

interface Props {
  modelValue: T
  items: TabBarItem<T>[]
  floating?: boolean
}

withDefaults(defineProps<Props>(), { floating: true })
defineEmits<{ (e: 'update:modelValue', v: T): void }>()
</script>

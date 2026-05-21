<template>
  <span class="lq-popover-host">
    <slot name="trigger" />
    <Transition name="lq-pop">
      <span
        v-if="open"
        :class="['lq-popover', 'lq-glass-strong', 'lq-specular', `lq-popover--${placement}`]"
      >
        <slot />
      </span>
    </Transition>
  </span>
</template>

<script setup lang="ts">
interface Props {
  open?: boolean
  placement?: 'top' | 'bottom'
}

withDefaults(defineProps<Props>(), {
  open: false,
  placement: 'top',
})
</script>

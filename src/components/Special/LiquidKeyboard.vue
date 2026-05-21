<template>
  <div class="lq-kb lq-glass-strong">
    <template v-if="layout === 'letters'">
      <div class="lq-kb__row">
        <button
          v-for="k in row1"
          :key="k"
          class="lq-kb__key lq-press"
          @click="$emit('key', k)"
        >
          {{ display(k) }}
        </button>
      </div>
      <div class="lq-kb__row lq-kb__row--mid">
        <button
          v-for="k in row2"
          :key="k"
          class="lq-kb__key lq-press"
          @click="$emit('key', k)"
        >
          {{ display(k) }}
        </button>
      </div>
      <div class="lq-kb__row">
        <button
          :class="['lq-kb__key', 'lq-kb__shift', 'lq-press', { 'is-active': capsLock }]"
          @click="$emit('key', 'shift')"
        >
          <span v-html="iconSvg('shift', 18)" />
        </button>
        <button
          v-for="k in row3"
          :key="k"
          class="lq-kb__key lq-press"
          @click="$emit('key', k)"
        >
          {{ display(k) }}
        </button>
        <button class="lq-kb__key lq-kb__back lq-press" @click="$emit('key', 'backspace')">
          <span v-html="iconSvg('delete', 18)" />
        </button>
      </div>
      <div class="lq-kb__row">
        <button class="lq-kb__key lq-kb__sym lq-press" @click="$emit('key', 'sym')">123</button>
        <button class="lq-kb__key lq-kb__emoji lq-press" @click="$emit('key', 'emoji')">
          <span v-html="iconSvg('emoji', 20)" />
        </button>
        <button class="lq-kb__key lq-kb__space lq-press" @click="$emit('key', ' ')">space</button>
        <button class="lq-kb__key lq-kb__return lq-press" @click="$emit('key', 'enter')">
          return
        </button>
      </div>
    </template>
    <template v-else>
      <div v-for="(row, i) in numericRows" :key="i" class="lq-kb__row">
        <button
          v-for="k in row"
          :key="k"
          :class="['lq-kb__key', 'lq-press', { 'lq-kb__back': k === 'back' }]"
          @click="$emit('key', k)"
        >
          <span v-if="k === 'back'" v-html="iconSvg('delete', 18)" />
          <span v-else>{{ k }}</span>
        </button>
      </div>
    </template>
  </div>
</template>

<script setup lang="ts">
import { iconSvg } from '../../icons'

interface Props {
  layout?: 'letters' | 'numbers'
  capsLock?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  layout: 'letters',
  capsLock: false,
})

defineEmits<{ (e: 'key', value: string): void }>()

const row1 = 'qwertyuiop'.split('')
const row2 = 'asdfghjkl'.split('')
const row3 = 'zxcvbnm'.split('')
const numericRows = [
  ['1', '2', '3'],
  ['4', '5', '6'],
  ['7', '8', '9'],
  ['.', '0', 'back'],
]
const display = (k: string) => (props.capsLock ? k.toUpperCase() : k.toUpperCase())
</script>

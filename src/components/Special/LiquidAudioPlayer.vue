<template>
  <div :class="['lq-player', 'lq-glass-strong', 'lq-specular', { 'is-compact': compact }]">
    <div class="lq-player__cover" :style="{ background: coverColor }">
      <span v-if="coverIcon" v-html="iconSvg(coverIcon, compact ? 18 : 24)" />
      <span v-else class="lq-player__cover-glyph" />
    </div>
    <div class="lq-player__main">
      <div class="lq-player__title">{{ title }}</div>
      <div v-if="artist" class="lq-player__artist">{{ artist }}</div>
      <div v-if="!compact" class="lq-player__progress">
        <div class="lq-player__bar" @pointerdown="seek">
          <div class="lq-player__fill" :style="{ width: progressPct + '%' }" />
        </div>
        <div class="lq-player__times">
          <span>{{ fmt(current) }}</span>
          <span>-{{ fmt(duration - current) }}</span>
        </div>
      </div>
    </div>
    <div class="lq-player__controls">
      <button
        v-if="!compact"
        class="lq-player__btn lq-press"
        aria-label="Back 15s"
        @click="skip(-15)"
      >
        <span v-html="iconSvg('skipBack', 18)" />
      </button>
      <button class="lq-player__play lq-press" aria-label="Play/Pause" @click="togglePlay">
        <span v-html="iconSvg(playing ? 'pause' : 'play', compact ? 18 : 22)" />
      </button>
      <button
        v-if="!compact"
        class="lq-player__btn lq-press"
        aria-label="Forward 15s"
        @click="skip(15)"
      >
        <span v-html="iconSvg('skipForward', 18)" />
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
import { iconSvg, type IconName } from '../../icons'

interface Props {
  title?: string
  artist?: string
  coverColor?: string
  coverIcon?: IconName | ''
  duration?: number
  autoplay?: boolean
  compact?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  title: 'Untitled',
  artist: '',
  coverColor: 'linear-gradient(135deg,#ff6b9d,#a85ef2)',
  coverIcon: '',
  duration: 240,
  autoplay: false,
  compact: false,
})

const playing = ref(props.autoplay)
const current = ref(0)
let interval: ReturnType<typeof setInterval> | undefined

onMounted(() => {
  interval = setInterval(() => {
    if (playing.value) current.value = (current.value + 0.5) % props.duration
  }, 500)
})
onUnmounted(() => clearInterval(interval))

const togglePlay = () => (playing.value = !playing.value)
const skip = (s: number) => {
  current.value = Math.max(0, Math.min(props.duration, current.value + s))
}
const progressPct = computed(() => (current.value / props.duration) * 100)
const fmt = (s: number) => {
  const m = Math.floor(s / 60)
  const r = Math.floor(s % 60)
  return `${m}:${String(r).padStart(2, '0')}`
}
function seek(e: PointerEvent) {
  const target = e.currentTarget as HTMLElement
  const r = target.getBoundingClientRect()
  const x = (e.clientX - r.left) / r.width
  current.value = Math.max(0, Math.min(1, x)) * props.duration
}
</script>

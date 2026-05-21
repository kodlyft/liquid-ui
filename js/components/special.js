(function() {
// ============================================================
// Liquid UI — Navigation, Media, Keyboard
// LiquidTabBar, LiquidAudioPlayer, LiquidKeyboard
// ============================================================

const { defineComponent, computed, ref, onMounted, onUnmounted } = Vue;

// ---------- LiquidTabBar ----------
// Bottom navigation bar with icons + labels, glass-tinted, with sliding accent
const LiquidTabBar = defineComponent({
  name: 'LiquidTabBar',
  props: {
    modelValue: { type: [String, Number], required: true },
    items: { type: Array, required: true },  // [{value, label, icon, badge?}]
    floating: { type: Boolean, default: true },
  },
  emits: ['update:modelValue'],
  template: `
    <nav :class="['lq-tabbar', { 'is-floating': floating }]" role="tablist">
      <button
        v-for="item in items"
        :key="item.value"
        :class="['lq-tabbar__item', { 'is-active': item.value === modelValue }]"
        @click="$emit('update:modelValue', item.value)"
        role="tab"
        :aria-selected="item.value === modelValue">
        <span class="lq-tabbar__iconwrap">
          <span class="lq-tabbar__icon" v-html="iconSvg(item.icon, 24)"></span>
          <span v-if="item.badge" class="lq-tabbar__badge">{{ item.badge }}</span>
        </span>
        <span class="lq-tabbar__label">{{ item.label }}</span>
      </button>
    </nav>
  `,
  setup() { return { iconSvg: window.IconSvg }; }
});

// ---------- LiquidAudioPlayer ----------
const LiquidAudioPlayer = defineComponent({
  name: 'LiquidAudioPlayer',
  props: {
    title: { type: String, default: 'Untitled' },
    artist: { type: String, default: '' },
    coverColor: { type: String, default: 'linear-gradient(135deg,#ff6b9d,#a85ef2)' },
    coverIcon: { type: String, default: '' },
    duration: { type: Number, default: 240 },  // seconds
    autoplay: { type: Boolean, default: false },
    compact: { type: Boolean, default: false },
  },
  template: `
    <div :class="['lq-player', 'lq-glass-strong', 'lq-specular', { 'is-compact': compact }]">
      <div class="lq-player__cover" :style="{ background: coverColor }">
        <span v-if="coverIcon" v-html="iconSvg(coverIcon, compact ? 18 : 24)"></span>
        <span v-else class="lq-player__cover-glyph"></span>
      </div>
      <div class="lq-player__main">
        <div class="lq-player__title">{{ title }}</div>
        <div v-if="artist" class="lq-player__artist">{{ artist }}</div>
        <div v-if="!compact" class="lq-player__progress">
          <div class="lq-player__bar" @pointerdown="seek">
            <div class="lq-player__fill" :style="{ width: progressPct + '%' }"></div>
          </div>
          <div class="lq-player__times">
            <span>{{ fmt(current) }}</span>
            <span>-{{ fmt(duration - current) }}</span>
          </div>
        </div>
      </div>
      <div class="lq-player__controls">
        <button v-if="!compact" class="lq-player__btn lq-press" @click="skip(-15)" aria-label="Back 15s">
          <span v-html="iconSvg('skipBack', 18)"></span>
        </button>
        <button class="lq-player__play lq-press" @click="togglePlay" aria-label="Play/Pause">
          <span v-html="iconSvg(playing ? 'pause' : 'play', compact ? 18 : 22)"></span>
        </button>
        <button v-if="!compact" class="lq-player__btn lq-press" @click="skip(15)" aria-label="Forward 15s">
          <span v-html="iconSvg('skipForward', 18)"></span>
        </button>
      </div>
    </div>
  `,
  setup(props) {
    const playing = ref(props.autoplay);
    const current = ref(0);
    let iv;
    const tick = () => {
      if (playing.value) {
        current.value = (current.value + 0.5) % props.duration;
      }
    };
    onMounted(() => { iv = setInterval(tick, 500); });
    onUnmounted(() => clearInterval(iv));
    const togglePlay = () => playing.value = !playing.value;
    const skip = (s) => { current.value = Math.max(0, Math.min(props.duration, current.value + s)); };
    const progressPct = computed(() => (current.value / props.duration) * 100);
    const fmt = (s) => {
      const m = Math.floor(s / 60); const r = Math.floor(s % 60);
      return `${m}:${String(r).padStart(2, '0')}`;
    };
    const seek = (e) => {
      const r = e.currentTarget.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      current.value = Math.max(0, Math.min(1, x)) * props.duration;
    };
    return { playing, current, togglePlay, skip, progressPct, fmt, seek, iconSvg: window.IconSvg };
  }
});

// ---------- LiquidKeyboard ----------
const LiquidKeyboard = defineComponent({
  name: 'LiquidKeyboard',
  props: {
    layout: { type: String, default: 'letters' },   // letters | numbers
    capsLock: { type: Boolean, default: false },
  },
  emits: ['key'],
  template: `
    <div class="lq-kb lq-glass-strong">
      <template v-if="layout === 'letters'">
        <div class="lq-kb__row">
          <button v-for="k in row1" :key="k" class="lq-kb__key lq-press" @click="$emit('key', k)">{{ display(k) }}</button>
        </div>
        <div class="lq-kb__row lq-kb__row--mid">
          <button v-for="k in row2" :key="k" class="lq-kb__key lq-press" @click="$emit('key', k)">{{ display(k) }}</button>
        </div>
        <div class="lq-kb__row">
          <button :class="['lq-kb__key', 'lq-kb__shift', 'lq-press', { 'is-active': capsLock }]" @click="$emit('key', 'shift')">
            <span v-html="iconSvg('shift', 18)"></span>
          </button>
          <button v-for="k in row3" :key="k" class="lq-kb__key lq-press" @click="$emit('key', k)">{{ display(k) }}</button>
          <button class="lq-kb__key lq-kb__back lq-press" @click="$emit('key', 'backspace')">
            <span v-html="iconSvg('delete', 18)"></span>
          </button>
        </div>
        <div class="lq-kb__row">
          <button class="lq-kb__key lq-kb__sym lq-press" @click="$emit('key', 'sym')">123</button>
          <button class="lq-kb__key lq-kb__emoji lq-press" @click="$emit('key', 'emoji')">
            <span v-html="iconSvg('emoji', 20)"></span>
          </button>
          <button class="lq-kb__key lq-kb__space lq-press" @click="$emit('key', ' ')">space</button>
          <button class="lq-kb__key lq-kb__return lq-press" @click="$emit('key', 'enter')">return</button>
        </div>
      </template>
      <template v-else>
        <div class="lq-kb__row" v-for="(row, i) in numericRows" :key="i">
          <button v-for="k in row" :key="k" :class="['lq-kb__key', 'lq-press', { 'lq-kb__back': k === 'back' }]"
                  @click="$emit('key', k)">
            <span v-if="k === 'back'" v-html="iconSvg('delete', 18)"></span>
            <span v-else>{{ k }}</span>
          </button>
        </div>
      </template>
    </div>
  `,
  setup(props) {
    const row1 = 'qwertyuiop'.split('');
    const row2 = 'asdfghjkl'.split('');
    const row3 = 'zxcvbnm'.split('');
    const numericRows = [
      ['1','2','3'],
      ['4','5','6'],
      ['7','8','9'],
      ['.','0','back']
    ];
    const display = (k) => props.capsLock ? k.toUpperCase() : k.toUpperCase();
    return { row1, row2, row3, numericRows, display, iconSvg: window.IconSvg };
  }
});

window.LiquidTabBar = LiquidTabBar;
window.LiquidAudioPlayer = LiquidAudioPlayer;
window.LiquidKeyboard = LiquidKeyboard;

})();

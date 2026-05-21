;(function () {
  // ============================================================
  // Main App, ties together sidebar, page, right panel, top bar, tweaks
  // ============================================================

  const { createApp, defineComponent, ref, reactive, computed, watch, onMounted, h } = Vue
  const SS = window.ShowcaseShell

  // Lift knob state so right-panel and page share it
  const App = defineComponent({
    setup() {
      // --- Routing / active page ---
      const activeId = ref('button')
      const query = ref('')
      const pages = window.LiquidDocs
      const activePage = computed(() => pages.find((p) => p.id === activeId.value) || pages[0])

      // --- Knob state (shared between demo + props playground) ---
      const knobs = reactive({})
      const seedKnobs = () => {
        Object.keys(knobs).forEach((k) => delete knobs[k])
        const defs = activePage.value.knobs || {}
        Object.keys(defs).forEach((k) => (knobs[k] = defs[k].default))
      }
      watch(activePage, seedKnobs, { immediate: true })
      const setKnob = (key, v) => {
        knobs[key] = v
      }

      // --- Theme / wallpaper / tweaks (persisted) ---
      const PERSIST_KEY = 'liquid-ui-state-v1'
      const tweaks = reactive({
        theme: 'dark',
        wallpaper: 'sunset',
        accent: '#0a84ff',
        blur: 24,
        opacity: 1,
        borderStrength: 1,
        radiusScale: 1,
      })
      try {
        const stored = JSON.parse(localStorage.getItem(PERSIST_KEY) || 'null')
        if (stored) Object.assign(tweaks, stored)
      } catch (e) {}

      const wallpaper = computed(
        () => window.Wallpapers.find((w) => w.id === tweaks.wallpaper) || window.Wallpapers[0],
      )

      const applyTweaks = () => {
        const root = document.documentElement
        root.dataset.theme = tweaks.theme
        root.style.setProperty('--glass-blur', tweaks.blur + 'px')
        root.style.setProperty('--glass-opacity', tweaks.opacity)
        root.style.setProperty('--glass-border-strength', tweaks.borderStrength)
        root.style.setProperty('--radius-scale', tweaks.radiusScale)
        // Parse accent hex to set HSL parts (so accent-soft etc resolve)
        const hex = tweaks.accent.replace('#', '')
        const r = parseInt(hex.substr(0, 2), 16) / 255
        const g = parseInt(hex.substr(2, 2), 16) / 255
        const b = parseInt(hex.substr(4, 2), 16) / 255
        const max = Math.max(r, g, b),
          min = Math.min(r, g, b)
        const l = (max + min) / 2
        let s = 0,
          hh = 0
        if (max !== min) {
          const d = max - min
          s = l > 0.5 ? d / (2 - max - min) : d / (max + min)
          if (max === r) hh = (g - b) / d + (g < b ? 6 : 0)
          else if (max === g) hh = (b - r) / d + 2
          else hh = (r - g) / d + 4
          hh *= 60
        }
        root.style.setProperty('--accent-h', Math.round(hh))
        root.style.setProperty('--accent-s', Math.round(s * 100) + '%')
        root.style.setProperty('--accent-l', Math.round(l * 100) + '%')
        root.style.setProperty('--accent', tweaks.accent)
        try {
          localStorage.setItem(PERSIST_KEY, JSON.stringify({ ...tweaks }))
        } catch (e) {}
      }
      watch(tweaks, applyTweaks, { immediate: true, deep: true })

      // --- Tweaks panel state ---
      const tweaksOpen = ref(false)

      return () =>
        h('div', { class: 'app-root' }, [
          // Wallpaper
          h('div', { class: 'lq-wallpaper', style: wallpaper.value.css }),
          h('div', { class: 'shell' }, [
            // Sidebar
            h(SS.Sidebar, {
              pages,
              active: activeId.value,
              query: query.value,
              onNav: (id) => (activeId.value = id),
              onSearch: (q) => (query.value = q),
            }),
            // Main canvas
            h(MainCanvas, { page: activePage.value, knobs, onUpdate: setKnob }),
            // Right panel
            h(RightPanel, {
              page: activePage.value,
              knobs,
              tweaks,
              wallpaper: wallpaper.value,
              tweaksOpen: tweaksOpen.value,
              onUpdate: setKnob,
              onToggleTweaks: () => (tweaksOpen.value = !tweaksOpen.value),
            }),
          ]),
          // Top bar (theme + wallpaper picker + tweaks toggle)
          h(TopBar, {
            tweaks,
            tweaksOpen: tweaksOpen.value,
            onTheme: () => (tweaks.theme = tweaks.theme === 'dark' ? 'light' : 'dark'),
            onCycleWallpaper: () => {
              const idx = window.Wallpapers.findIndex((w) => w.id === tweaks.wallpaper)
              tweaks.wallpaper = window.Wallpapers[(idx + 1) % window.Wallpapers.length].id
            },
            onTweaks: () => (tweaksOpen.value = !tweaksOpen.value),
          }),
          // Tweaks panel
          tweaksOpen.value
            ? h(TweaksPanel, { tweaks, onClose: () => (tweaksOpen.value = false) })
            : null,
        ])
    },
  })

  // ---------- MainCanvas — page header + demo + variants + code ----------
  const MainCanvas = defineComponent({
    props: ['page', 'knobs'],
    emits: ['update'],
    setup(props, { emit }) {
      return () => {
        const page = props.page
        const knobs = props.knobs
        const extras = typeof page.ctxExtras === 'function' ? page.ctxExtras(knobs) : {}
        const dataCtx = {
          ...knobs,
          ...extras,
          updateValue: (v) => {
            if (page.isModel) emit('update', page.isModel, v)
          },
          onKey: () => {},
        }

        let demoBody
        if (page.custom === 'modal') demoBody = h(SS.ModalDemo, { knobs })
        else if (page.custom === 'menu') demoBody = h(SS.MenuDemo, { knobs })
        else if (page.custom === 'toast') demoBody = h(SS.ToastDemo, { knobs })
        else if (page.custom === 'tabbar')
          demoBody = h(SS.TabBarDemo, { knobs, onUpdate: (k, v) => emit('update', k, v) })
        else if (typeof page.render === 'function') {
          const tpl = page.render(knobs)
          demoBody = h(SS.DynamicTemplate, {
            tpl: `<div class="demo-row">${tpl}</div>`,
            data: dataCtx,
          })
        } else {
          demoBody = h('div', { class: 'muted' }, 'No demo')
        }

        return h('main', { class: 'main' }, [
          h('div', { class: 'main-inner' }, [
            h('header', { class: 'page-header' }, [
              h('div', { class: 'page-eyebrow' }, page.category),
              h('h1', { class: 'page-title' }, page.title),
              h('p', { class: 'page-desc' }, page.description),
            ]),
            h('div', { class: 'section' }, [
              h('div', { class: 'section-label' }, [
                h('div', { class: 'section-title' }, 'Preview'),
                h('div', { class: 'section-meta' }, 'Live · interact below'),
              ]),
              h(
                'div',
                {
                  class: [
                    'demo',
                    page.id === 'keyboard' ||
                    page.id === 'audio' ||
                    page.id === 'menu' ||
                    page.id === 'tabbar'
                      ? 'tall'
                      : '',
                  ],
                },
                demoBody,
              ),
            ]),
            page.variants && page.variants.length
              ? h('div', { class: 'section' }, [
                  h('div', { class: 'section-label' }, [
                    h('div', { class: 'section-title' }, 'Variants'),
                    h('div', { class: 'section-meta' }, page.variants.length + ' examples'),
                  ]),
                  h(
                    'div',
                    { class: 'variant-grid' },
                    page.variants.map((v) => h(SS.VariantCell, { page, variant: v })),
                  ),
                ])
              : null,
            h('div', { class: 'section' }, [
              h('div', { class: 'section-label' }, [
                h('div', { class: 'section-title' }, 'Code'),
                h('div', { class: 'section-meta' }, 'Vue 3 · script setup'),
              ]),
              h(SS.CodePanel, { sfc: page.sfc, usage: page.usage }),
            ]),
          ]),
        ])
      }
    },
  })

  // ---------- RightPanel — props playground ----------
  const RightPanel = defineComponent({
    props: ['page', 'knobs'],
    emits: ['update'],
    setup(props, { emit }) {
      return () =>
        h('aside', { class: 'props' }, [
          h('h4', null, 'Props'),
          h(SS.PropsPlayground, {
            knobs: props.page.knobs || {},
            values: props.knobs,
            onUpdate: (k, v) => emit('update', k, v),
          }),
        ])
    },
  })

  // ---------- TopBar — theme toggle + wallpaper cycle + tweaks open ----------
  const TopBar = defineComponent({
    props: ['tweaks', 'tweaksOpen'],
    emits: ['theme', 'cycleWallpaper', 'tweaks'],
    setup(props, { emit }) {
      return () =>
        h('div', { class: 'topbar' }, [
          h(window.LiquidIconButton, {
            icon: 'palette',
            size: 'sm',
            variant: 'glass',
            label: 'Cycle wallpaper',
            onClick: () => emit('cycleWallpaper'),
          }),
          h(window.LiquidIconButton, {
            icon: props.tweaks.theme === 'dark' ? 'sun' : 'moon',
            size: 'sm',
            variant: 'glass',
            label: 'Toggle theme',
            onClick: () => emit('theme'),
          }),
          h(window.LiquidIconButton, {
            icon: 'gear',
            size: 'sm',
            variant: props.tweaksOpen ? 'tinted' : 'glass',
            label: 'Open tweaks',
            onClick: () => emit('tweaks'),
          }),
        ])
    },
  })

  // ---------- TweaksPanel — toolbar for the whole showcase ----------
  const TweaksPanel = defineComponent({
    props: ['tweaks'],
    emits: ['close'],
    setup(props, { emit }) {
      return () =>
        h('div', { class: 'tweaks-panel lq-glass-strong lq-specular' }, [
          h('div', { class: 'tweaks-head' }, [
            h('div', { class: 'tweaks-title' }, 'Tweaks'),
            h('button', {
              class: 'tweaks-close',
              onClick: () => emit('close'),
              innerHTML: window.IconSvg('close', 14),
            }),
          ]),
          h('div', { class: 'tweaks-body' }, [
            h('div', { class: 'tweak-group' }, [
              h('div', { class: 'tweak-label' }, 'Accent'),
              h(
                'div',
                { class: 'tweak-swatches' },
                ['#0a84ff', '#bf5af2', '#ff375f', '#30d158', '#ff9f0a', '#5e5ce6'].map((c) =>
                  h('button', {
                    class: ['tweak-swatch', { active: props.tweaks.accent === c }],
                    style: { background: c },
                    onClick: () => (props.tweaks.accent = c),
                  }),
                ),
              ),
            ]),

            h('div', { class: 'tweak-group' }, [
              h('div', { class: 'tweak-label' }, 'Wallpaper'),
              h(
                'div',
                { class: 'tweak-wallpapers' },
                window.Wallpapers.map((w) =>
                  h('button', {
                    class: ['tweak-wp', { active: props.tweaks.wallpaper === w.id }],
                    style: w.css
                      .replace('background:', 'background:')
                      .replace(/position: fixed.*?;/, ''),
                    onClick: () => (props.tweaks.wallpaper = w.id),
                    title: w.name,
                  }),
                ),
              ),
            ]),

            h('div', { class: 'tweak-group' }, [
              h('div', { class: 'tweak-label-row' }, [
                h('span', null, 'Glass blur'),
                h('span', { class: 'tweak-value' }, props.tweaks.blur + 'px'),
              ]),
              h('input', {
                type: 'range',
                min: 0,
                max: 60,
                step: 2,
                value: props.tweaks.blur,
                onInput: (e) => (props.tweaks.blur = Number(e.target.value)),
              }),
            ]),

            h('div', { class: 'tweak-group' }, [
              h('div', { class: 'tweak-label-row' }, [
                h('span', null, 'Glass opacity'),
                h('span', { class: 'tweak-value' }, props.tweaks.opacity.toFixed(2)),
              ]),
              h('input', {
                type: 'range',
                min: 0.2,
                max: 1.5,
                step: 0.05,
                value: props.tweaks.opacity,
                onInput: (e) => (props.tweaks.opacity = Number(e.target.value)),
              }),
            ]),

            h('div', { class: 'tweak-group' }, [
              h('div', { class: 'tweak-label-row' }, [
                h('span', null, 'Border highlight'),
                h('span', { class: 'tweak-value' }, props.tweaks.borderStrength.toFixed(2)),
              ]),
              h('input', {
                type: 'range',
                min: 0,
                max: 2,
                step: 0.05,
                value: props.tweaks.borderStrength,
                onInput: (e) => (props.tweaks.borderStrength = Number(e.target.value)),
              }),
            ]),

            h('div', { class: 'tweak-group' }, [
              h('div', { class: 'tweak-label-row' }, [
                h('span', null, 'Radius scale'),
                h('span', { class: 'tweak-value' }, props.tweaks.radiusScale.toFixed(2)),
              ]),
              h('input', {
                type: 'range',
                min: 0.5,
                max: 1.5,
                step: 0.05,
                value: props.tweaks.radiusScale,
                onInput: (e) => (props.tweaks.radiusScale = Number(e.target.value)),
              }),
            ]),
          ]),
        ])
    },
  })

  // ---------- Mount ----------
  function mount() {
    const app = createApp(App)
    // Globally register all components so dynamic templates work
    const comps = [
      'LiquidButton',
      'LiquidIconButton',
      'LiquidToggle',
      'LiquidSegmented',
      'LiquidSlider',
      'LiquidStepper',
      'LiquidInput',
      'LiquidSearchBar',
      'LiquidCard',
      'LiquidBadge',
      'LiquidAvatar',
      'LiquidListRow',
      'LiquidProgress',
      'LiquidSpinner',
      'LiquidModal',
      'LiquidContextMenu',
      'LiquidToast',
      'LiquidNotification',
      'LiquidPopover',
      'LiquidTabBar',
      'LiquidAudioPlayer',
      'LiquidKeyboard',
    ]
    comps.forEach((name) => {
      if (window[name]) app.component(name, window[name])
    })
    app.mount('#app')
  }

  window.addEventListener('DOMContentLoaded', mount)
})()

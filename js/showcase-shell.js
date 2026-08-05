;(function () {
  // ============================================================
  // Showcase shell -- sidebar nav + main canvas + props playground
  // Mounts every page from window.LiquidDocs
  // ============================================================

  const { createApp, defineComponent, ref, reactive, computed, watch, onMounted, h, Transition } =
    Vue

  // ---------- DynamicTemplate ----------
  // Compiles a template string at runtime and renders it with a provided ctx.
  // Lets each page's `render(knobs)` produce a live demo without bundling.
  const DynamicTemplate = defineComponent({
    name: 'DynamicTemplate',
    props: {
      tpl: { type: String, default: '<div></div>' },
      data: { type: Object, default: () => ({}) },
    },
    setup(props) {
      const compiled = computed(() => {
        try {
          const r = Vue.compile(props.tpl)
          const render = typeof r === 'function' ? r : r.render || (() => null)

          return defineComponent({
            name: 'DynamicTemplateRender',
            props: {
              ctx: { type: Object, default: () => ({}) },
            },
            setup(innerProps) {
              const exposed = {}
              Object.keys(innerProps.ctx || {}).forEach((key) => {
                Object.defineProperty(exposed, key, {
                  enumerable: true,
                  get: () => innerProps.ctx?.[key],
                })
              })
              return exposed
            },
            render,
          })
        } catch (e) {
          console.warn('compile error', e)
          return defineComponent({
            render: () => null,
          })
        }
      })
      return () => h(compiled.value, { ctx: props.data })
    },
  })

  // ---------- Highlight Vue template (token-based, no recursion) ----------
  function highlight(code) {
    const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    // Tokenize: walk char-by-char picking out strings, comments, tags, attrs, keywords.
    const out = []
    let i = 0
    const n = code.length
    const peek = (k) => code.substr(i, k)
    const KEYWORDS = new Set([
      'const',
      'let',
      'var',
      'import',
      'export',
      'from',
      'default',
      'function',
      'return',
      'defineProps',
      'defineEmits',
      'setup',
      'defineComponent',
      'if',
      'else',
      'for',
      'await',
      'async',
    ])
    let inTag = false // inside <...>
    let inAttrVal = null // null | '"' | "'"
    while (i < n) {
      const c = code[i]
      // Line comments outside tags
      if (!inTag && peek(2) === '//') {
        const j = code.indexOf('\n', i)
        const end = j === -1 ? n : j
        out.push('<span class="tk-com">' + escape(code.slice(i, end)) + '</span>')
        i = end
        continue
      }
      if (!inTag && c === '<') {
        // detect closing or opening tag
        let j = i + 1
        if (code[j] === '/') j++
        const start = j
        while (j < n && /[\w-]/.test(code[j])) j++
        if (j > start) {
          out.push(
            '&lt;' +
              (code[i + 1] === '/' ? '/' : '') +
              '<span class="tk-tag">' +
              escape(code.slice(start, j)) +
              '</span>',
          )
          i = j
          inTag = true
          continue
        }
        out.push('&lt;')
        i++
        continue
      }
      if (inTag && (c === '"' || c === "'") && inAttrVal === null) {
        inAttrVal = c
        out.push(c + '<span class="tk-str">')
        i++
        continue
      }
      if (inTag && inAttrVal && c === inAttrVal) {
        out.push('</span>' + c)
        inAttrVal = null
        i++
        continue
      }
      if (inTag && inAttrVal === null && c === '>') {
        out.push('&gt;')
        inTag = false
        i++
        continue
      }
      if (inTag && inAttrVal === null && /[:@\w-]/.test(c)) {
        // attribute name? -- preceded by whitespace
        const prev = code[i - 1]
        if (prev && /\s/.test(prev)) {
          let j = i
          while (j < n && /[:@\w.-]/.test(code[j])) j++
          if (code[j] === '=' || /\s/.test(code[j]) || code[j] === '>' || code[j] === '/') {
            out.push('<span class="tk-attr">' + escape(code.slice(i, j)) + '</span>')
            i = j
            continue
          }
        }
      }
      // Outside tag -- strings
      if (!inTag && (c === '"' || c === "'" || c === '`')) {
        const q = c
        let j = i + 1
        while (j < n && code[j] !== q) {
          if (code[j] === '\\') j++
          j++
        }
        out.push('<span class="tk-str">' + escape(code.slice(i, j + 1)) + '</span>')
        i = j + 1
        continue
      }
      // Keywords (outside tags)
      if (!inTag && /[A-Za-z_$]/.test(c)) {
        let j = i
        while (j < n && /[\w$]/.test(code[j])) j++
        const word = code.slice(i, j)
        if (KEYWORDS.has(word)) {
          out.push('<span class="tk-key">' + escape(word) + '</span>')
        } else {
          out.push(escape(word))
        }
        i = j
        continue
      }
      // Default
      out.push(escape(c))
      i++
    }
    return out.join('')
  }

  // ---------- Code Panel ----------
  const CodePanel = defineComponent({
    props: ['sfc', 'usage'],
    setup(props) {
      const tab = ref('usage')
      const copied = ref(false)
      const body = computed(() => (tab.value === 'usage' ? props.usage : props.sfc))
      const copy = async () => {
        try {
          await navigator.clipboard.writeText(body.value || '')
          copied.value = true
          setTimeout(() => (copied.value = false), 1200)
        } catch (e) {}
      }
      return () =>
        h('div', { class: 'code-panel' }, [
          h('div', { class: 'code-head' }, [
            h('div', { class: 'code-tabs' }, [
              h(
                'div',
                {
                  class: ['code-tab', { active: tab.value === 'usage' }],
                  onClick: () => (tab.value = 'usage'),
                },
                'Usage',
              ),
              props.sfc
                ? h(
                    'div',
                    {
                      class: ['code-tab', { active: tab.value === 'sfc' }],
                      onClick: () => (tab.value = 'sfc'),
                    },
                    'Component.vue',
                  )
                : null,
            ]),
            h('div', { class: 'code-actions' }, [
              h('div', { class: 'code-copy', onClick: copy }, copied.value ? 'Copied!' : 'Copy'),
            ]),
          ]),
          h('div', { class: 'code-body' }, [h('pre', { innerHTML: highlight(body.value || '') })]),
        ])
    },
  })

  // ---------- Knob renderer ----------
  const PropsPlayground = defineComponent({
    props: ['knobs', 'values'],
    emits: ['knob-change'],
    setup(props, { emit }) {
      return () => {
        const keys = Object.keys(props.knobs || {})
        if (keys.length === 0) {
          return h(
            'div',
            { class: 'muted', style: 'font-size:12px' },
            'No props for this component.',
          )
        }
        return h(
          'div',
          null,
          keys.map((k) =>
            renderKnob(k, props.knobs[k], props.values[k], (v) => emit('knob-change', k, v)),
          ),
        )
      }
    },
  })

  function renderKnob(name, def, val, set) {
    const label = def.label || name
    const valueDisplay =
      def.type === 'slider' ? val : def.type === 'bool' ? (val ? 'true' : 'false') : ''
    return h('div', { class: 'knob', key: name }, [
      h('div', { class: 'knob-label' }, [
        h('span', null, label),
        h('code', { class: 'knob-value' }, valueDisplay),
      ]),
      def.type === 'select'
        ? h(
            'select',
            {
              value: val,
              onChange: (e) => set(e.target.value),
            },
            (def.options || []).map((o) => h('option', { value: o }, o || '(none)')),
          )
        : def.type === 'seg'
          ? h(
              'div',
              { class: 'knob-seg' },
              def.options.map((o) =>
                h(
                  'button',
                  {
                    class: { active: o === val },
                    onClick: () => set(o),
                  },
                  String(o),
                ),
              ),
            )
          : def.type === 'bool'
            ? h(
                'div',
                { class: 'knob-bool' },
                h(window.LiquidToggle, {
                  modelValue: Boolean(val),
                  'onUpdate:modelValue': set,
                  size: 'sm',
                  label,
                }),
              )
            : def.type === 'slider'
              ? h('input', {
                  type: 'range',
                  min: def.min,
                  max: def.max,
                  step: def.step || 1,
                  value: val,
                  style: 'width:100%',
                  onInput: (e) => set(Number(e.target.value)),
                })
              : h('input', {
                  type: 'text',
                  value: val,
                  onInput: (e) => set(e.target.value),
                }),
    ])
  }

  // ---------- Custom demo components ----------
  // For pages with stateful interactions that don't fit a simple template string

  const ModalDemo = defineComponent({
    props: ['knobs'],
    setup(props) {
      const open = ref(false)
      return () =>
        h('div', null, [
          h('div', { class: 'demo-row' }, [
            h(
              window.LiquidButton,
              {
                variant: props.knobs.destructive ? 'destructive' : 'primary',
                onClick: () => (open.value = true),
              },
              () => 'Open dialog',
            ),
          ]),
          h(
            window.LiquidModal,
            {
              modelValue: open.value,
              'onUpdate:modelValue': (v) => (open.value = v),
              title: props.knobs.title,
              message: props.knobs.message,
              confirmText: props.knobs.confirmText,
              cancelText: props.knobs.cancelText,
              destructive: props.knobs.destructive,
              icon: props.knobs.icon,
              iconColor: props.knobs.destructive ? 'var(--red)' : 'var(--accent)',
              size: props.knobs.size,
              actions: props.knobs.actions,
              dismissible: props.knobs.dismissible,
            },
            props.knobs.size !== 'alert'
              ? () =>
                  h(
                    'p',
                    { style: 'font-size:13px;color:var(--text-2)' },
                    'Body content goes in the default slot. Wider sizes left-align it and let it scroll.',
                  )
              : undefined,
          ),
        ])
    },
  })

  const MenuDemo = defineComponent({
    props: ['knobs'],
    setup() {
      const items = [
        { label: 'Edit Recording', icon: 'edit' },
        { label: 'View Transcript', icon: 'transcript' },
        { label: 'Options', icon: 'options' },
        { divider: true },
        { label: 'Share', icon: 'share' },
        { label: 'Copy', icon: 'copy' },
        { label: 'Copy Transcript', icon: 'document' },
        { label: 'Duplicate', icon: 'duplicate' },
        { divider: true },
        { label: 'Delete', icon: 'trash', danger: true },
      ]
      const lastAction = ref('')
      return () =>
        h('div', null, [
          h(window.LiquidContextMenu, {
            items,
            onSelect: (i) => (lastAction.value = i.label),
          }),
          lastAction.value
            ? h(
                'div',
                { style: 'margin-top:14px;font-size:12px;color:var(--text-3);text-align:center' },
                'Selected: ' + lastAction.value,
              )
            : null,
        ])
    },
  })

  const MenuTriggerDemo = defineComponent({
    props: ['knobs'],
    setup() {
      const items = [
        { label: 'Actions', heading: true },
        { key: 'edit', label: 'Edit', icon: 'edit', shortcut: 'Ctrl+E' },
        { key: 'duplicate', label: 'Duplicate', icon: 'duplicate', shortcut: 'Ctrl+D' },
        {
          key: 'insert',
          label: 'Insert',
          children: [
            { key: 'insert:text', label: 'Text' },
            { key: 'insert:image', label: 'Image' },
            { key: 'insert:table', label: 'Table' },
          ],
        },
        { divider: true },
        { key: 'delete', label: 'Delete', icon: 'trash', danger: true, shortcut: 'Del' },
      ]
      const lastAction = ref('')
      return () =>
        h('div', null, [
          h(
            window.LiquidContextMenuTrigger,
            { items, onSelect: (i) => (lastAction.value = i.label) },
            () =>
              h(
                'div',
                {
                  class: 'lq-glass',
                  style:
                    'display:grid;place-items:center;height:170px;border-radius:16px;' +
                    'font-size:13px;color:var(--text-3);user-select:none;cursor:context-menu',
                },
                'Right-click anywhere in this area',
              ),
          ),
          lastAction.value
            ? h(
                'div',
                { style: 'margin-top:14px;font-size:12px;color:var(--text-3);text-align:center' },
                'Selected: ' + lastAction.value,
              )
            : null,
        ])
    },
  })

  const ToastDemo = defineComponent({
    props: ['knobs'],
    setup(props) {
      const visible = ref(true)
      let t
      const show = () => {
        visible.value = false
        clearTimeout(t)
        setTimeout(() => (visible.value = true), 60)
      }
      return () =>
        h('div', null, [
          h('div', { class: 'demo-row', style: 'margin-bottom:18px' }, [
            h(
              window.LiquidButton,
              { variant: 'secondary', size: 'sm', onClick: show },
              () => 'Replay',
            ),
          ]),
          h(window.LiquidToast, {
            modelValue: visible.value,
            'onUpdate:modelValue': (v) => (visible.value = v),
            title: props.knobs.title,
            description: props.knobs.description,
            variant: props.knobs.variant,
            icon: props.knobs.icon,
          }),
        ])
    },
  })

  const PopoverDemo = defineComponent({
    props: ['knobs'],
    emits: ['update'],
    setup(props, { emit }) {
      return () =>
        h(
          window.LiquidPopover,
          {
            open: props.knobs.open,
            placement: props.knobs.placement,
          },
          {
            trigger: () =>
              h(
                window.LiquidButton,
                {
                  variant: props.knobs.open ? 'tinted' : 'secondary',
                  onClick: () => emit('update', 'open', !props.knobs.open),
                },
                () => props.knobs.label,
              ),
            default: () => props.knobs.content,
          },
        )
    },
  })

  const AutocompleteDemo = defineComponent({
    props: ['knobs'],
    emits: ['update'],
    setup(props, { emit }) {
      const CITIES = [
        { value: 'amsterdam', label: 'Amsterdam', description: 'Netherlands' },
        { value: 'barcelona', label: 'Barcelona', description: 'Spain' },
        { value: 'berlin', label: 'Berlin', description: 'Germany' },
        { value: 'copenhagen', label: 'Copenhagen', description: 'Denmark' },
        { value: 'kyoto', label: 'Kyoto', description: 'Japan' },
        { value: 'lisbon', label: 'Lisbon', description: 'Portugal' },
        { value: 'melbourne', label: 'Melbourne', description: 'Australia' },
        { value: 'montreal', label: 'Montréal', description: 'Canada' },
        { value: 'reykjavik', label: 'Reykjavík', description: 'Iceland' },
        { value: 'seoul', label: 'Seoul', description: 'South Korea' },
        { value: 'tbilisi', label: 'Tbilisi', description: 'Georgia' },
        { value: 'vienna', label: 'Vienna', description: 'Austria' },
      ]

      // Mirrors a real integration: the parent owns the list and narrows it
      // whenever the component asks with @search.
      const query = ref('')
      const options = computed(() => {
        const q = query.value.trim().toLowerCase()
        if (!q) return CITIES
        return CITIES.filter(
          (c) =>
            c.label.toLowerCase().includes(q) || (c.description || '').toLowerCase().includes(q),
        )
      })

      return () =>
        h('div', { style: 'width:300px' }, [
          h(window.LiquidAutocomplete, {
            modelValue: props.knobs.modelValue,
            'onUpdate:modelValue': (v) => emit('update', 'modelValue', v),
            onSearch: (v) => (query.value = v),
            options: options.value,
            placeholder: props.knobs.placeholder,
            icon: props.knobs.icon,
            size: props.knobs.size,
            clearable: props.knobs.clearable,
            allowCreate: props.knobs.allowCreate,
            loading: props.knobs.loading,
            disabled: props.knobs.disabled,
            emptyText: props.knobs.emptyText,
            debounce: 0,
          }),
        ])
    },
  })

  const TabBarDemo = defineComponent({
    props: ['knobs'],
    emits: ['update'],
    setup(props, { emit }) {
      const items = [
        { value: 'today', label: 'Today', icon: 'today' },
        { value: 'games', label: 'Games', icon: 'rocket', badge: 2 },
        { value: 'apps', label: 'Apps', icon: 'apps' },
        { value: 'arcade', label: 'Arcade', icon: 'arcade' },
      ]
      return () =>
        h(window.LiquidTabBar, {
          modelValue: props.knobs.modelValue,
          'onUpdate:modelValue': (v) => emit('update', 'modelValue', v),
          items,
        })
    },
  })

  // ---------- Variant cell renderer ----------
  // Interactive -- keeps its own modelValue state so the demo flips on click.
  const VariantCell = defineComponent({
    props: ['page', 'variant'],
    setup(props) {
      const local = ref(props.variant.props?.modelValue)
      watch(
        () => props.variant,
        () => {
          local.value = props.variant.props?.modelValue
        },
        { deep: false },
      )
      return () => {
        const Cmp = window[props.page.component] || null
        if (!Cmp) return h('div', { class: 'muted' }, 'n/a')
        const propsObj = { ...(props.variant.props || {}) }
        const hasModel = 'modelValue' in propsObj
        if (hasModel) {
          propsObj.modelValue = local.value
          propsObj['onUpdate:modelValue'] = (v) => {
            local.value = v
          }
        }
        // Disable items in disabled variant
        return h('div', { class: 'variant-cell' }, [
          h(Cmp, propsObj, props.variant.slot ? () => props.variant.slot : null),
          h('div', { class: 'variant-cell-label' }, props.variant.label),
        ])
      }
    },
  })

  // ---------- Sidebar ----------
  const Sidebar = defineComponent({
    props: ['pages', 'active', 'query'],
    emits: ['nav', 'search'],
    setup(props, { emit }) {
      return () => {
        const filtered = props.query
          ? props.pages.filter((p) =>
              (p.label + ' ' + p.title).toLowerCase().includes(props.query.toLowerCase()),
            )
          : props.pages
        // Group by category
        const groups = {}
        filtered.forEach((p) => {
          groups[p.category] = groups[p.category] || []
          groups[p.category].push(p)
        })
        const order = ['Actions', 'Forms', 'Display', 'Overlays', 'Navigation', 'Media', 'Input']

        return h('aside', { class: 'sidebar' }, [
          h('div', { class: 'brand' }, [
            h('div', { class: 'brand-mark' }),
            h('div', { class: 'brand-text' }, [
              h('span', { class: 'brand-name' }, 'Liquid UI'),
              h('span', { class: 'brand-sub' }, 'Vue 3 · v0.1.0'),
            ]),
          ]),
          h('div', { class: 'side-search' }, [
            h('span', { innerHTML: window.IconSvg('search', 13) }),
            h('input', {
              type: 'text',
              placeholder: 'Search components',
              value: props.query,
              onInput: (e) => emit('search', e.target.value),
            }),
          ]),
          ...order
            .filter((g) => groups[g])
            .map((g) =>
              h('div', { class: 'nav-group' }, [
                h('div', { class: 'nav-group-label' }, g),
                ...groups[g].map((p) =>
                  h(
                    'div',
                    {
                      class: ['nav-item', { active: p.id === props.active }],
                      onClick: () => emit('nav', p.id),
                    },
                    [
                      h('span', { innerHTML: window.IconSvg(p.icon || 'cube', 14) }),
                      h('span', null, p.label),
                    ],
                  ),
                ),
              ]),
            ),
        ])
      }
    },
  })

  // ---------- Page renderer ----------
  const Page = defineComponent({
    props: ['page'],
    setup(props) {
      // Local reactive knob values per page
      const knobValues = reactive({})
      watch(
        () => props.page.id,
        () => {
          // reset knobs to defaults
          Object.keys(knobValues).forEach((k) => delete knobValues[k])
          const k = props.page.knobs || {}
          Object.keys(k).forEach((key) => (knobValues[key] = k[key].default))
        },
        { immediate: true },
      )

      const setKnob = (key, v) => {
        knobValues[key] = v
      }

      // For pages with a `render(knobs)` template:
      // Provide an `updateValue` helper that maps to isModel key.
      const dataCtx = computed(() => ({
        ...knobValues,
        updateValue: (v) => {
          if (props.page.isModel) knobValues[props.page.isModel] = v
        },
        onKey: () => {},
      }))

      return () => {
        const page = props.page

        // Demo body -- either a custom component or a dynamic template
        let demoBody
        if (page.custom === 'modal') demoBody = h(ModalDemo, { knobs: knobValues })
        else if (page.custom === 'menu') demoBody = h(MenuDemo, { knobs: knobValues })
        else if (page.custom === 'menuTrigger') demoBody = h(MenuTriggerDemo, { knobs: knobValues })
        else if (page.custom === 'toast') demoBody = h(ToastDemo, { knobs: knobValues })
        else if (page.custom === 'popover')
          demoBody = h(PopoverDemo, { knobs: knobValues, onUpdate: setKnob })
        else if (page.custom === 'autocomplete')
          demoBody = h(AutocompleteDemo, { knobs: knobValues, onUpdate: setKnob })
        else if (page.custom === 'tabbar')
          demoBody = h(TabBarDemo, { knobs: knobValues, onUpdate: setKnob })
        else if (typeof page.render === 'function') {
          const tpl = page.render(knobValues)
          demoBody = h(DynamicTemplate, {
            tpl: `<div class="demo-row">${tpl}</div>`,
            data: dataCtx.value,
          })
        } else {
          demoBody = h('div', { class: 'muted' }, 'No demo')
        }

        const variants =
          page.variants && page.variants.length
            ? h('div', { class: 'section' }, [
                h('div', { class: 'section-label' }, [
                  h('div', { class: 'section-title' }, 'Variants'),
                  h('div', { class: 'section-meta' }, `${page.variants.length} examples`),
                ]),
                h(
                  'div',
                  { class: 'variant-grid' },
                  page.variants.map((v) => h(VariantCell, { page, variant: v })),
                ),
              ])
            : null

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
                    page.id === 'keyboard' ? 'tall' : '',
                    page.id === 'audio' ? 'tall' : '',
                  ],
                },
                demoBody,
              ),
            ]),
            variants,
            h('div', { class: 'section' }, [
              h('div', { class: 'section-label' }, [
                h('div', { class: 'section-title' }, 'Code'),
                h('div', { class: 'section-meta' }, 'Vue 3 · <script setup>'),
              ]),
              h(CodePanel, { sfc: page.sfc, usage: page.usage }),
            ]),
          ]),
        ])
      }
    },
  })

  // Expose the page playground knobs to the right panel
  const PageProps = defineComponent({
    props: ['page'],
    setup(props) {
      // Reactive ref shared with Page -- for simplicity we look it up via a global
      // store, but a cleaner approach is to lift state. We'll do this in the App.
      return () => null
    },
  })

  window.ShowcaseShell = {
    Sidebar,
    Page,
    CodePanel,
    PropsPlayground,
    DynamicTemplate,
    highlight,
    ModalDemo,
    MenuDemo,
    MenuTriggerDemo,
    ToastDemo,
    PopoverDemo,
    AutocompleteDemo,
    TabBarDemo,
    VariantCell,
  }
})()

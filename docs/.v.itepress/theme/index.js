import DefaultTheme from 'vitepress/theme'
import { h, onMounted, onUnmounted, ref, nextTick } from 'vue'
import './custom.css'

/* ========================================
   手绘背景 SVG 组件
   ======================================== */
const HandDrawnBackground = {
  setup() {
    return () => h('div', { class: 'hand-drawn-bg' }, [
      // 背景层 1 - 代码和网格
      h('svg', {
        class: 'bg-layer bg-layer-1',
        viewBox: '0 0 1200 800',
        preserveAspectRatio: 'xMidYMid slice'
      }, [
        // 网格线
        h('defs', {}, [
          h('pattern', {
            id: 'grid1',
            width: '40',
            height: '40',
            patternUnits: 'userSpaceOnUse'
          }, [
            h('path', {
              d: 'M 40 0 L 0 0 0 40',
              fill: 'none',
              stroke: '#64b5f6',
              'stroke-width': '0.5',
              opacity: '0.3'
            })
          ])
        ]),
        h('rect', { width: '100%', height: '100%', fill: 'url(#grid1)' }),

        // 散落的代码片段
        h('text', { x: '50', y: '100', class: 'code-sketch' }, 'function closure() {'),
        h('text', { x: '80', y: '125', class: 'code-sketch' }, '  let x = 10;'),
        h('text', { x: '80', y: '150', class: 'code-sketch' }, '  return () => x++;'),
        h('text', { x: '50', y: '175', class: 'code-sketch' }, '}'),

        h('text', { x: '900', y: '200', class: 'code-sketch' }, 'const vm = new VM();'),
        h('text', { x: '870', y: '225', class: 'code-sketch' }, 'vm.run(code);'),

        h('text', { x: '200', y: '600', class: 'code-sketch' }, 'AST: { type: "CallExpr", callee: "foo" }'),

        h('text', { x: '700', y: '650', class: 'code-sketch' }, '堆栈: [frame1, frame2, frame3]'),
      ]),

      // 背景层 2 - 语法树和图形
      h('svg', {
        class: 'bg-layer bg-layer-2',
        viewBox: '0 0 1200 800',
        preserveAspectRatio: 'xMidYMid slice'
      }, [
        // 语法树
        h('g', { transform: 'translate(300, 150)' }, [
          h('circle', { cx: '0', cy: '0', r: '20', fill: 'none', stroke: '#64b5f6', 'stroke-width': '1.5' }),
          h('line', { x1: '0', y1: '20', x2: '-40', y2: '60', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('line', { x1: '0', y1: '20', x2: '40', y2: '60', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('circle', { cx: '-40', cy: '60', r: '15', fill: 'none', stroke: '#ffb74d', 'stroke-width': '1.5' }),
          h('circle', { cx: '40', cy: '60', r: '15', fill: 'none', stroke: '#ffb74d', 'stroke-width': '1.5' }),
          h('line', { x1: '-40', y1: '75', x2: '-60', y2: '100', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('line', { x1: '-40', y1: '75', x2: '-20', y2: '100', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('line', { x1: '40', y1: '75', x2: '20', y2: '100', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('line', { x1: '40', y1: '75', x2: '60', y2: '100', stroke: '#64b5f6', 'stroke-width': '1' }),
        ]),

        // 哈希表
        h('g', { transform: 'translate(800, 400)' }, [
          h('rect', { x: '0', y: '0', width: '150', height: '120', fill: 'none', stroke: '#64b5f6', 'stroke-width': '1.5', rx: '5' }),
          h('line', { x1: '0', y1: '30', x2: '150', y2: '30', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('line', { x1: '0', y1: '60', x2: '150', y2: '60', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('line', { x1: '0', y1: '90', x2: '150', y2: '90', stroke: '#64b5f6', 'stroke-width': '1' }),
          h('text', { x: '10', y: '22', fill: '#ffb74d', 'font-size': '12', 'font-family': 'monospace' }, '0:'),
          h('text', { x: '40', y: '22', fill: '#a8b0bc', 'font-size': '10', 'font-family': 'monospace' }, '"key" -> val'),
          h('text', { x: '10', y: '52', fill: '#ffb74d', 'font-size': '12', 'font-family': 'monospace' }, '1:'),
          h('text', { x: '10', y: '82', fill: '#ffb74d', 'font-size': '12', 'font-family': 'monospace' }, '2:'),
          h('text', { x: '10', y: '112', fill: '#ffb74d', 'font-size': '12', 'font-family': 'monospace' }, 'n:'),
        ]),

        // 虚拟机指令流
        h('g', { transform: 'translate(100, 450)' }, [
          h('text', { fill: '#a8b0bc', 'font-size': '10', 'font-family': 'monospace' }, 'VM Instructions:'),
          h('rect', { x: '0', y: '20', width: '80', height: '20', fill: 'none', stroke: '#ffb74d', 'stroke-width': '1', rx: '3' }),
          h('text', { x: '5', y: '35', fill: '#a8b0bc', 'font-size': '9', 'font-family': 'monospace' }, 'LOAD 0'),
          h('rect', { x: '90', y: '20', width: '80', height: '20', fill: 'none', stroke: '#ffb74d', 'stroke-width': '1', rx: '3' }),
          h('text', { x: '95', y: '35', fill: '#a8b0bc', 'font-size': '9', 'font-family': 'monospace' }, 'CALL fn'),
          h('rect', { x: '180', y: '20', width: '80', height: '20', fill: 'none', stroke: '#ffb74d', 'stroke-width': '1', rx: '3' }),
          h('text', { x: '185', y: '35', fill: '#a8b0bc', 'font-size': '9', 'font-family': 'monospace' }, 'RETURN'),
          h('path', { d: 'M 40 30 L 90 30', stroke: '#64b5f6', 'stroke-width': '1', fill: 'none', 'marker-end': 'url(#arrow)' }),
        ]),
      ]),

      // 背景层 3 - 装饰性元素
      h('svg', {
        class: 'bg-layer bg-layer-3',
        viewBox: '0 0 1200 800',
        preserveAspectRatio: 'xMidYMid slice'
      }, [
        // 装饰性括号
        h('text', {
          x: '50',
          y: '350',
          fill: 'none',
          stroke: '#64b5f6',
          'stroke-width': '1',
          'font-size': '80',
          opacity: '0.2',
          'font-family': 'monospace'
        }, '{'),

        h('text', {
          x: '1100',
          y: '400',
          fill: 'none',
          stroke: '#ffb74d',
          'stroke-width': '1',
          'font-size': '60',
          opacity: '0.15',
          'font-family': 'monospace'
        }, '}'),

        // 散落的小元素
        h('circle', { cx: '150', cy: '750', r: '3', fill: '#64b5f6', opacity: '0.3' }),
        h('circle', { cx: '350', cy: '780', r: '2', fill: '#ffb74d', opacity: '0.3' }),
        h('circle', { cx: '550', cy: '760', r: '4', fill: '#64b5f6', opacity: '0.2' }),
        h('circle', { cx: '750', cy: '790', r: '2', fill: '#ffb74d', opacity: '0.3' }),
        h('circle', { cx: '950', cy: '770', r: '3', fill: '#64b5f6', opacity: '0.2' }),
        h('circle', { cx: '1050', cy: '755', r: '2', fill: '#ffb74d', opacity: '0.3' }),

        // 装饰线条
        h('path', {
          d: 'M 0 300 Q 300 280 600 300 T 1200 300',
          fill: 'none',
          stroke: '#64b5f6',
          'stroke-width': '0.5',
          opacity: '0.1'
        }),
      ]),
    ])
  }
}

/* ========================================
   底部运行时间栏组件
   ======================================== */
const FooterBar = {
  setup() {
    const runningTime = ref('')
    let startTime = null
    let intervalId = null

    onMounted(() => {
      // 设置博客开始时间（修改这里设置你的博客创建时间）
      startTime = new Date('2024-01-01T00:00:00').getTime()

      const updateTime = () => {
        const now = new Date().getTime()
        const diff = now - startTime

        const days = Math.floor(diff / (1000 * 60 * 60 * 24))
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        const seconds = Math.floor((diff % (1000 * 60)) / 1000)

        runningTime.value = `${days} d ${hours} h ${minutes} m ${seconds} s`
      }

      updateTime()
      intervalId = setInterval(updateTime, 1000)
    })

    onUnmounted(() => {
      if (intervalId) {
        clearInterval(intervalId)
      }
    })

    return () => h('div', { class: 'footer-bar' }, [
      h('span', { class: 'running-time' }, [
        'This blog has running: ',
        h('span', { id: 'running-time' }, runningTime.value || '0 d 0 h 0 m 0 s')
      ]),
      h('span', { class: 'copyright' }, [
        '博客园 © 2024-2026 浙ICP备 XXX',
        h('span', { class: 'theme-version' }, 'Theme v1.2.9'),
        h('span', { class: 'heart' }, '♡')
      ])
    ])
  }
}

/* ========================================
   自定义目录框组件
   ======================================== */
const CustomOutlinePanel = {
  setup() {
    const outline = ref([])
    const activeId = ref('')
    const showingPopup = ref(false)
    const currentHeadingId = ref('')
    const noteText = ref('')
    const notes = ref({})

    // 从 localStorage 加载注释
    const loadNotes = () => {
      const saved = localStorage.getItem('outline-notes')
      if (saved) {
        notes.value = JSON.parse(saved)
      }
    }

    // 保存注释到 localStorage
    const saveNotes = () => {
      localStorage.setItem('outline-notes', JSON.stringify(notes.value))
    }

    // 提取页面的标题作为目录
    const extractHeadings = () => {
      const headings = document.querySelectorAll('.vp-doc h2, .vp-doc h3')
      const items = []

      headings.forEach(heading => {
        const text = heading.textContent
        const id = heading.id || heading.textContent.toLowerCase().replace(/\s+/g, '-')
        if (!heading.id) heading.id = id

        items.push({
          id,
          text,
          level: heading.tagName.toLowerCase(),
          note: notes.value[id] || null
        })
      })

      outline.value = items
    }

    // 监听滚动以更新激活状态
    const updateActiveHeading = () => {
      const headings = document.querySelectorAll('.vp-doc h2, .vp-doc h3')
      let active = ''

      for (let i = headings.length - 1; i >= 0; i--) {
        const heading = headings[i]
        const rect = heading.getBoundingClientRect()

        if (rect.top <= 100) {
          active = heading.id
          break
        }
      }

      activeId.value = active
    }

    // 打开添加注释弹窗
    const openNotePopup = (headingId) => {
      currentHeadingId.value = headingId
      noteText.value = notes.value[headingId] || ''
      showingPopup.value = true
    }

    // 保存注释
    const saveNote = () => {
      if (noteText.value.trim()) {
        notes.value[currentHeadingId.value] = noteText.value.trim()
      } else {
        delete notes.value[currentHeadingId.value]
      }
      saveNotes()
      extractHeadings()
      showingPopup.value = false
    }

    // 取消添加注释
    const cancelNote = () => {
      showingPopup.value = false
    }

    // 关闭弹窗（点击外部）
    const closePopupOnClickOutside = (e) => {
      if (e.target.closest('.note-popup')) return
      showingPopup.value = false
    }

    onMounted(() => {
      loadNotes()
      nextTick(() => {
        extractHeadings()
        updateActiveHeading()
      })
      window.addEventListener('scroll', updateActiveHeading, { passive: true })
      document.addEventListener('click', closePopupOnClickOutside)
    })

    onUnmounted(() => {
      window.removeEventListener('scroll', updateActiveHeading)
      document.removeEventListener('click', closePopupOnClickOutside)
    })

    return () => h('div', { class: 'custom-outline-panel' }, [
      h('h3', '文章目录'),

      showingPopup.value ? h('div', {
        class: 'note-popup',
        style: { position: 'absolute', top: '40px', left: '10px' }
      }, [
        h('h4', '添加注释'),
        h('textarea', {
          value: noteText.value,
          onInput: (e) => { noteText.value = e.target.value },
          placeholder: '在这里写下你的想法...'
        }),
        h('div', { class: 'note-popup-actions' }, [
          h('button', {
            class: 'note-popup-btn cancel',
            onClick: cancelNote
          }, '取消'),
          h('button', {
            class: 'note-popup-btn save',
            onClick: saveNote
          }, '保存')
        ])
      ]) : null,

      h('ul', { class: 'custom-outline-list' },
        outline.value.map(item => h('li', {
          class: ['custom-outline-item', `level-${item.level.replace('h', '')}`, activeId.value === item.id ? 'active' : '']
        }, [
          h('a', {
            class: ['custom-outline-link', activeId.value === item.id ? 'active' : ''],
            href: `#${item.id}`,
            onClick: (e) => {
              e.preventDefault()
              document.getElementById(item.id)?.scrollIntoView({ behavior: 'smooth' })
            }
          }, [
            item.text,
            // 注释标记
            item.note ? h('span', {
              class: 'note-indicator',
              onClick: (e) => {
                e.stopPropagation()
                openNotePopup(item.id)
              },
              title: item.note
            }, 'N') : null,
            // 添加注释按钮
            h('span', {
              class: 'add-note-btn',
              onClick: (e) => {
                e.stopPropagation()
                openNotePopup(item.id)
              },
              title: item.note ? '编辑注释' : '添加注释'
            }, '+')
          ]),
          // 显示注释内容
          item.note ? h('div', {
            class: 'note-content-display',
            onClick: (e) => {
              e.stopPropagation()
              openNotePopup(item.id)
            }
          }, item.note) : null
        ]))
      )
    ])
  }
}

/* ========================================
   点击粒子特效
   ======================================== */
const PARTICLE_SYMBOLS = [
  '{ }', '< >', '( )', '[ ]', '/**/', '=>', '::',
  '→', '←', '↑', '↓', '◈', '◇', '○', '□', '△',
  'λ', 'σ', 'π', 'ω', '∑', '∏', '√', '∞'
]

function createParticle(x, y) {
  const particle = document.createElement('span')
  particle.className = 'particle'

  const symbol = PARTICLE_SYMBOLS[Math.floor(Math.random() * PARTICLE_SYMBOLS.length)]
  particle.textContent = symbol

  const angle = Math.random() * Math.PI * 2
  const distance = 50 + Math.random() * 100
  const tx = Math.cos(angle) * distance
  const ty = Math.sin(angle) * distance - 50
  const rot = (Math.random() - 0.5) * 360

  particle.style.left = x + 'px'
  particle.style.top = y + 'px'
  particle.style.setProperty('--tx', tx + 'px')
  particle.style.setProperty('--ty', ty + 'px')
  particle.style.setProperty('--rot', rot + 'deg')

  const colors = ['#64b5f6', '#ffb74d', '#90caf9', '#ffcc80', '#a8b0bc', '#f57c00']
  particle.style.color = colors[Math.floor(Math.random() * colors.length)]

  document.body.appendChild(particle)

  setTimeout(() => particle.remove(), 1000)
}

function handleClick(e) {
  const target = e.target
  if (target.closest('.VPNav') || target.closest('.VPSidebar') || target.closest('.footer-bar')) {
    return
  }

  const count = 3 + Math.floor(Math.random() * 3)
  for (let i = 0; i < count; i++) {
    setTimeout(() => {
      const offsetX = (Math.random() - 0.5) * 40
      const offsetY = (Math.random() - 0.5) * 40
      createParticle(e.clientX + offsetX, e.clientY + offsetY)
    }, i * 50)
  }
}

/* ========================================
   视差滚动效果
   ======================================== */
let ticking = false

function updateParallax() {
  const scrollY = window.scrollY
  const layers = document.querySelectorAll('.bg-layer')

  layers.forEach((layer, index) => {
    const speed = (index + 1) * 0.05
    const yPos = -(scrollY * speed)
    layer.style.transform = `translateY(${yPos}px)`
  })

  ticking = false
}

function handleScroll() {
  if (!ticking) {
    requestAnimationFrame(updateParallax)
    ticking = true
  }
}

/* ========================================
   主主题扩展
   ======================================== */
export default {
  extends: DefaultTheme,
  Layout() {
    return h(DefaultTheme.Layout, null, {
      // 替换默认的 content 插槽，添加背景、底部栏和目录框
      'layout-after': () => h('div', {}, [
        h(HandDrawnBackground),
        h(FooterBar),
        h(CustomOutlinePanel)
      ])
    })
  },
  mounted() {
    // 初始化点击事件
    document.addEventListener('click', handleClick)

    // 初始化视差滚动
    window.addEventListener('scroll', handleScroll, { passive: true })
  },
  unmounted() {
    document.removeEventListener('click', handleClick)
    window.removeEventListener('scroll', handleScroll)
  }
}

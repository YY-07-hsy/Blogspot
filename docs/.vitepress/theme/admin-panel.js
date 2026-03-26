import { ref, onMounted, computed } from 'vue'

/* ========================================
   文章管理面板组件
   ======================================== */
export const AdminPanel = {
  setup() {
    const articles = ref([])
    const currentView = ref('list')
    const editingArticle = ref(null)
    const showDeleteConfirm = ref(false)
    const articleToDelete = ref(null)

    // 表单数据
    const form = ref({
      id: '',
      title: '',
      category: '',
      date: '',
      excerpt: '',
      content: ''
    })

    // 加载文章
    const loadArticles = () => {
      const stored = localStorage.getItem('blog-articles')
      if (stored) {
        articles.value = JSON.parse(stored)
      } else {
        // 初始化示例文章
        articles.value = [
          {
            id: 'javascript-closure',
            title: '深入理解JavaScript闭包',
            category: 'JavaScript',
            date: '2024年1月15日',
            excerpt: '闭包是JavaScript中最强大的概念之一。本文将带你从基础到实践，全面掌握闭包的奥秘。',
            content: `# 深入理解JavaScript闭包

闭包是 JavaScript 中最强大但也最容易被误解的概念之一。本文将带你从基础到实践，全面掌握闭包的奥秘。

## 什么是闭包

闭包是指一个函数能够"记住"它创建时的环境，即使这个函数在不同的作用域中执行。简单来说，闭包就是一个函数加上它创建时所在的 lexical scope（词法作用域）。

### 一个简单的例子

\`\`\`javascript
function outer() {
  const name = 'JavaScript';

  function inner() {
    console.log(name);
  }

  return inner;
}

const fn = outer();
fn(); // 输出: JavaScript
\`\`\`

在这个例子中，\`inner\` 函数可以访问 \`outer\` 函数中的 \`name\` 变量，即使 \`outer\` 函数已经执行完毕。这就是闭包的魔力。

## 闭包的实际应用

### 1. 数据私有化

\`\`\`javascript
function createCounter() {
  let count = 0;

  return {
    increment() {
      count++;
      return count;
    },
    decrement() {
      count--;
      return count;
    },
    getCount() {
      return count;
    }
  };
}

const counter = createCounter();
console.log(counter.increment()); // 1
console.log(counter.increment()); // 2
console.log(counter.getCount());  // 2
\`\`\`

### 2. 函数工厂

\`\`\`javascript
function createMultiplier(factor) {
  return function(number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log(double(5)); // 10
console.log(triple(5)); // 15
\`\`\`

### 3. 异步操作中的闭包

\`\`\`javascript
for (var i = 1; i <= 3; i++) {
  setTimeout(() => {
    console.log(i);
  }, i * 1000);
}
// 输出: 4, 4, 4 (使用 let 可以避免这个问题)
\`\`\`

## 闭包的性能考虑

闭包会占用内存，因为它们会保留对外部变量的引用。在不需要使用时，应该手动释放引用。

\`\`\`javascript
function heavyOperation() {
  const largeData = new Array(1000000).fill('*');

  return function() {
    return largeData.length;
  };
}

const fn = heavyOperation();
// 使用完毕后释放
fn = null;
\`\`\`

## 总结

闭包是 JavaScript 的核心概念之一，它让我们能够：

- 创建私有变量
- 实现函数柯里化
- 保持状态
- 编写更优雅的代码

理解闭包将帮助你写出更好的 JavaScript 代码。`
          },
          {
            id: 'css-layout',
            title: 'CSS布局的艺术',
            category: 'CSS',
            date: '2024年1月8日',
            excerpt: '从Flexbox到Grid，现代CSS布局技术让网页设计变得更加优雅和强大。',
            content: `# CSS布局的艺术

从 Flexbox 到 Grid，现代 CSS 布局技术让网页设计变得更加优雅和强大。

## 传统的布局方式

在 Flexbox 和 Grid 出现之前，我们主要依赖：

- \`float\` 布局
- \`position\` 定位
- \`display: inline-block\`

这些方法虽然有效，但往往需要大量的 hack 代码来实现复杂的布局。

## Flexbox 弹性布局

Flexbox 是一种一维布局模型，非常适合处理行或列的对齐。

### 基本用法

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
}
\`\`\`

### 常见场景

\`\`\`css
/* 垂直居中 */
.center-flex {
  display: flex;
  justify-content: center;
  align-items: center;
}

/* 等间距排列 */
.even-spacing {
  display: flex;
  justify-content: space-evenly;
}

/* 响应式换行 */
.responsive-wrap {
  display: flex;
  flex-wrap: wrap;
}
\`\`\`

## CSS Grid 网格布局

Grid 是二维布局模型，可以同时控制行和列。

### 基本用法

\`\`\`css
.grid-container {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  grid-template-rows: auto;
  gap: 20px;
}
\`\`\`

### 实战示例

\`\`\`css
.dashboard {
  display: grid;
  grid-template-areas:
    "header header header"
    "sidebar main main"
    "footer footer footer";
  grid-template-columns: 200px 1fr 1fr;
  grid-template-rows: 60px 1fr 40px;
  min-height: 100vh;
}

.header { grid-area: header; }
.sidebar { grid-area: sidebar; }
.main { { grid-area: main; }
.footer { grid-area: footer; }
\`\`\`

## 选择 Flexbox 还是 Grid

| 场景 | 推荐方案 |
|------|----------|
| 一维布局（单行或单列） | Flexbox |
| 二维布局（行和列） | Grid |
| 简单对齐 | Flexbox |
| 复杂网格 | Grid |
| 组件内部布局 | Flexbox |
| 页面整体布局 | Grid |

## 现代布局技巧

### 1. \`gap\` 属性

\`\`\`css
.cards {
  display: flex;
  flex-wrap: wrap;
  gap: 24px; /* 替代 margin */
}
\`\`\`

### 2. \`min()\`、\`max()\`、\`clamp()\`

\`\`\`css
.responsive-text {
  font-size: clamp(1rem, 5vw, 2rem);
}

.sidebar {
  width: min(300px, 30%);
}
\`\`\`

### 3. \`subgrid\`（较新特性）

\`\`\`css
.parent {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
}

.child {
  display: grid;
  grid-column: span 3;
  grid-template-columns: subgrid;
}
\`\`\`

## 总结

现代 CSS 布局让响应式设计变得前所未有的简单。掌握 Flexbox 和 Grid，将帮助你构建任何你想象中的布局。`
          },
          {
            id: 'typescript-types',
            title: 'TypeScript类型系统入门',
            category: 'TypeScript',
            date: '2023年12月28日',
            excerpt: 'TypeScript的类型系统是其核心优势所在。了解类型推断、泛型和高级类型。',
            content: `# TypeScript类型系统入门

TypeScript 的类型系统是其核心优势所在。了解类型推断、泛型和高级类型，写出更安全的代码。

## 基础类型

TypeScript 提供了一系列基础类型：

\`\`\`typescript
// 基础类型
let name: string = 'Alice';
let age: number = 25;
let isActive: boolean = true;

// 数组
let numbers: number[] = [1, 2, 3];
let names: Array<string> = ['Alice', 'Bob'];

// 元组
let pair: [string, number] = ['age', 25];

// 枚举
enum Color {
  Red = 'red',
  Green = 'green',
  Blue = 'blue'
}
\`\`\`

## 类型推断

TypeScript 能够根据初始值自动推断类型：

\`\`\`typescript
// TypeScript 自动推断为 string 类型
let message = 'Hello'; // type: string

// 函数返回类型推断
function add(a: number, b: number) {
  return a + b; // 推断返回类型为 number
}
\`\`\`

## 接口和类型别名

\`\`\`typescript
// 接口
interface User {
  name: string;
  age: number;
  email?: string; // 可选属性
  readonly id: number; // 只读属性
}

// 类型别名
type ID = string | number;
type Status = 'pending' | 'success' | 'error';
\`\`\`

## 泛型

泛型让我们能够创建可复用的组件，能够支持多种类型：

\`\`\`typescript
// 泛型函数
function identity<T>(arg: T): T {
  return arg;
}

// 泛型接口
interface Container<T> {
  value: T;
  getValue(): T;
}

// 泛型类
class Box<T> {
  constructor(private content: T) {}

  get(): T {
    return this.content;
  }
}
\`\`\`

## 高级类型

### 1. 联合类型

\`\`\`typescript
function format(value: string | number): string {
  if (typeof value === 'string') {
    return value.toUpperCase();
  }
  return value.toFixed(2);
}
\`\`\`

### 2. 交叉类型

\`\`\`typescript
interface Loggable {
  log(): void;
}

interface Serializable {
  serialize(): string;
}

type LoggableSerializable = Loggable & Serializable;
\`\`\`

### 3. 映射类型

\`\`\`typescript
type Readonly<T> = {
  readonly [P in keyof T]: T[P];
};

type Partial<T> = {
  [P in keyof T]?: T[P];
};

type User = {
  name: string;
  age: number;
};

type ReadonlyUser = Readonly<User>;
type PartialUser = Partial<User>;
\`\`\`

## 实用技巧

### 1. \`typeof\` 运算符

\`\`\`typescript
const config = {
  apiUrl: 'https://api.example.com',
  timeout: 5000
};

type Config = typeof config;
\`\`\`

### 2. 索引访问类型

\`\`\`typescript
interface Response {
  data: {
    user: {
      name: string;
      email: string;
    };
  };
}

type UserName = Response['data']['user']['name'];
\`\`\`

### 3. 条件类型

\`\`\`typescript
type NonNullable<T> = T extends null | undefined ? never : T;

type A = NonNullable<string | null>; // string
type B = NonNullable<number | undefined>; // number
\`\`\`

## 总结

TypeScript 的类型系统非常强大，善用它可以：

- 在编译时捕获错误
- 提供更好的代码提示
- 作为文档使用
- 实现类型安全的重构

掌握这些高级类型技巧，将帮助你写出更健壮的 TypeScript 代码。`
          },
          {
            id: 'responsive-design',
            title: '响应式设计的最佳实践',
            category: '响应式设计',
            date: '2023年12月20日',
            excerpt: '在多设备时代，响应式设计已成为前端开发的必备技能。',
            content: `# 响应式设计的最佳实践

在多设备时代，响应式设计已成为前端开发的必备技能。本文介绍响应式设计的核心概念和最佳实践。

## 响应式设计基础

响应式设计的核心是让网站能够适配不同的屏幕尺寸。主要包含三个关键点：

1. **流式布局** - 使用相对单位而非固定像素
2. **弹性图片** - 图片能够适应容器大小
3. **媒体查询** - 根据设备特性应用不同样式

## 视口和基础设置

\`\`\`html
<meta name="viewport" content="width=device-width, initial-scale=1.0">
\`\`\`

这是响应式设计的基础，确保页面在移动设备上正确显示。

## 相对单位

\`\`\`css
/* 视口单位 */
width: 50vw;   /* 视口宽度的50% */
height: 100vh; /* 视口高度的100% */

/* rem - 相对于根元素 */
font-size: 1.5rem;

/* em - 相对于父元素 */
padding: 1em;

/* 百分比 */
width: 80%;
\`\`\`

## 媒体查询

### 基本语法

\`\`\`css
/* 最小宽度 - 移动优先 */
@media (min-width: 768px) {
  .container {
    max-width: 720px;
  }
}

/* 最大宽度 - 桌面优先 */
@media (max-width: 1024px) {
  .sidebar {
    display: none;
  }
}

/* 设备方向 */
@media (orientation: landscape) {
  .hero {
    flex-direction: row;
  }
}
\`\`\`

### 断点策略

\`\`\`css
/* 手机 */
@media (max-width: 576px) { }

/* 平板 */
@media (min-width: 768px) { }

/* 小笔记本 */
@media (min-width: 992px) { }

/* 桌面显示器 */
@media (min-width: 1200px) { }

/* 大屏 */
@media (min-width: 1400px) { }
\`\`\`

## 弹性图片和媒体

\`\`\`css
img {
  max-width: 100%;
  height: auto;
}

video, iframe {
  max-width: 100%;
  height: auto;
}
\`\`\`

## 实战技巧

### 1. 使用 CSS Grid

\`\`\`css
.container {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
}
\`\`\`

### 2. 使用 Flexbox

\`\`\`css
.nav-menu {
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
}
\`\`\`

### 3. 容器查询（Container Queries）

\`\`\`css
.card-container {
  container-type: inline-size;
}

@container (min-width: 400px) {
  .card {
    display: flex;
    flex-direction: row;
  }
}
\`\`\`

### 4. 移动端优化

\`\`\`css
/* 触摸友好 */
button, a {
  min-height: 44px;
  min-width: 44px;
}

/* 防止水平滚动 */
body {
  overflow-x: hidden;
}
\`\`\`

## 性能优化

### 1. 图片优化

\`\`\`html
<picture>
  <source media="(min-width: 1200px)" srcset="large.jpg">
  <source media="(min-width: 768px)" srcset="medium.jpg">
  <img src="small.jpg" alt="描述">
</picture>
\`\`\`

### 2. 字体优化

\`\`\`css
/* 系统字体栈 */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* 加载优化 */
font-display: swap;
\`\`\`

### 3. CSS 优化

\`\`\`css
/* 使用 will-change */
.animated-element {
  will-change: transform;
}

/* 减少重排 */
transform: translateZ(0);
\`\`\`

## 测试工具

1. **浏览器 DevTools** - 使用设备模拟
2. **BrowserStack** - 真实设备测试
3. **Chrome Lighthouse** - 性能审计

## 总结

响应式设计的关键原则：

- **移动优先** - 从最小屏幕开始，逐步增强
- **内容优先** - 设计服务于内容
- **渐进增强** - 基础体验优先，功能逐步添加
- **性能意识** - 考虑网络和设备限制

掌握这些最佳实践，你就能构建出在各种设备上都能良好体验的网站。`
          }
        ]
        saveArticles()
      }
    }

    // 保存文章
    const saveArticles = () => {
      localStorage.setItem('blog-articles', JSON.stringify(articles.value))
    }

    // 切换视图
    const switchView = (view) => {
      currentView.value = view
    }

    // 创建新文章
    const createArticle = () => {
      form.value = {
        id: '',
        title: '',
        category: '',
        date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
        excerpt: '',
        content: ''
      }
      editingArticle.value = null
      switchView('edit')
    }

    // 编辑文章
    const editArticle = (article) => {
      form.value = { ...article }
      editingArticle.value = article
      switchView('edit')
    }

    // 保存表单
    const saveForm = () => {
      if (!form.value.title || !form.value.content) {
        alert('请填写标题和内容')
        return
      }

      if (editingArticle.value) {
        // 更新现有文章
        const index = articles.value.findIndex(a => a.id === editingArticle.value.id)
        if (index !== -1) {
          articles.value[index] = { ...form.value }
        }
      } else {
        // 创建新文章
        const newId = form.value.title.toLowerCase()
          .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
          .replace(/^-+|-+$/g, '')
        form.value.id = newId || 'untitled-' + Date.now()
        articles.value.unshift({ ...form.value })
      }

      saveArticles()
      switchView('list')
    }

    // 删除文章确认
    const confirmDelete = (article) => {
      articleToDelete.value = article
      showDeleteConfirm.value = true
    }

    // 删除文章
    const deleteArticle = () => {
      if (articleToDelete.value) {
        articles.value = articles.value.filter(a => a.id !== articleToDelete.value.id)
        saveArticles()
        showDeleteConfirm.value = false
        articleToDelete.value = null
      }
    }

    // 取消删除
    const cancelDelete = () => {
      showDeleteConfirm.value = false
      articleToDelete.value = null
    }

    // 导出文章
    const exportArticles = () => {
      const data = JSON.stringify(articles.value, null, 2)
      const blob = new Blob([data], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = 'blog-articles.json'
      a.click()
      URL.revokeObjectURL(url)
    }

    // 导入文章
    const importArticles = (event) => {
      const file = event.target.files[0]
      if (!file) return

      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const imported = JSON.parse(e.target.result)
          if (Array.isArray(imported)) {
            articles = [...imported, ...articles.value]
            saveArticles()
            alert('导入成功！')
          }
        } catch (error) {
          alert('导入失败：无效的文件格式')
        }
      }
      reader.readAsText(file)
      event.target.value = ''
    }

    onMounted(() => {
      loadArticles()
    })

    return {
      articles,
      currentView,
      editingArticle,
      showDeleteConfirm,
      articleToDelete,
      form,
      switchView,
      createArticle,
      editArticle,
      saveForm,
      confirmDelete,
      deleteArticle,
      cancelDelete,
      exportArticles,
      importArticles
    }
  }
}

/* ========================================
   AdminPanel 组件渲染函数
   ======================================== */
export function renderAdminPanel(props) {
  const h = window.vue_h || ((tag, props, children) => {
    const el = document.createElement(tag)
    Object.entries(props || {}).forEach(([key, value]) => {
      if (key === 'class' && typeof value === 'object') {
        el.className = value.filter(Boolean).join(' ')
      } else if (key.startsWith('on')) {
        el.addEventListener(key.slice(2).toLowerCase(), value)
      } else if (key === 'style' && typeof value === 'object') {
        Object.entries(value).forEach(([k, v]) => el.style[k] = v)
      } else {
        el[key] = value
      }
    })
    if (Array.isArray(children)) {
      children.forEach(child => {
        if (typeof child === 'string' || typeof child === 'number') {
          el.appendChild(document.createTextNode(child))
        } else if (child?.nodeType) {
          el.appendChild(child)
        } else if (child) {
          // 处理数组
        }
      })
    } else if (children) {
      el.appendChild(document.createTextNode(children))
    }
    return el
  })

  return AdminPanel
}

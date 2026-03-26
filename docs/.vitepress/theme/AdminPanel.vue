<template>
  <div class="admin-panel">
    <div class="admin-header">
      <h1>📝 文章管理后台</h1>
      <div class="admin-actions">
        <button @click="createArticle" class="btn btn-primary">
          ➕ 新建文章
        </button>
        <button @click="exportArticles" class="btn btn-secondary">
          📥 导出文章
        </button>
        <label class="btn btn-secondary">
          📤 导入文章
          <input type="file" @change="importArticles" accept=".json" style="display: none;">
        </label>
        <button @click="goBack" class="btn btn-back">
          ← 返回博客
        </button>
      </div>
    </div>

    <!-- 文章列表视图 -->
    <div v-if="currentView === 'list'" class="articles-list">
      <div class="article-cards">
        <div
          v-for="article in articles"
          :key="article.id"
          class="article-card"
        >
          <div class="card-header">
            <span class="section-badge">{{ article.section || '技术学习' }}</span>
            <span class="badge">{{ article.category }}</span>
            <span class="date">{{ article.date }}</span>
          </div>
          <h3>{{ article.title }}</h3>
          <p class="excerpt">{{ article.excerpt }}</p>
          <div class="card-actions">
            <button @click="editArticle(article)" class="btn btn-sm">✏️ 编辑</button>
            <button @click="confirmDelete(article)" class="btn btn-sm btn-danger">🗑️ 删除</button>
          </div>
        </div>
      </div>

      <div v-if="articles.length === 0" class="empty-state">
        <p>还没有文章，点击"新建文章"开始创作吧！</p>
      </div>
    </div>

    <!-- 编辑视图 -->
    <div v-if="currentView === 'edit'" class="editor-view">
      <form @submit.prevent="saveForm" class="article-form">
        <div class="form-group">
          <label>文章标题 *</label>
          <input
            v-model="form.title"
            type="text"
            placeholder="请输入文章标题"
            required
          />
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>板块分类</label>
            <select v-model="form.section" class="select-input">
              <option value="技术学习">技术学习</option>
              <option value="Daily & Reading">Daily & Reading</option>
            </select>
          </div>

          <div class="form-group">
            <label>文章分类</label>
            <input
              v-model="form.category"
              type="text"
              placeholder="例如：JavaScript"
              list="categories"
            />
            <datalist id="categories">
              <option value="JavaScript"></option>
              <option value="TypeScript"></option>
              <option value="CSS"></option>
              <option value="Vue"></option>
              <option value="React"></option>
              <option value="其他"></option>
            </datalist>
          </div>
        </div>

        <div class="form-group">
          <label>发布日期</label>
          <input
            v-model="form.date"
            type="text"
            placeholder="例如：2024年1月15日"
          />
        </div>

        <div class="form-group">
          <label>文章摘要</label>
          <textarea
            v-model="form.excerpt"
            rows="3"
            placeholder="简短描述文章内容，显示在首页"
          ></textarea>
        </div>

        <div class="form-group">
          <label>文章内容 *（支持 Markdown 格式）</label>
          <div class="editor-tabs">
            <button
              type="button"
              :class="['tab-btn', { active: editorMode === 'write' }]"
              @click="editorMode = 'write'"
            >
              ✏️ 编辑
            </button>
            <button
              type="button"
              :class="['tab-btn', { active: editorMode === 'preview' }]"
              @click="editorMode = 'preview'"
            >
              👁️ 预览
            </button>
          </div>
          <div class="editor-container">
            <textarea
              v-if="editorMode === 'write'"
              v-model="form.content"
              rows="20"
              placeholder="在这里编写文章内容，支持 Markdown 语法..."
              required
              class="markdown-editor"
            ></textarea>
            <div v-else class="markdown-preview" v-html="previewHtml"></div>
          </div>
        </div>

        <div class="form-actions">
          <button type="submit" class="btn btn-primary">
            💾 保存文章
          </button>
          <button type="button" @click="switchView('list')" class="btn btn-secondary">
            取消
          </button>
        </div>
      </form>
    </div>

    <!-- 删除确认弹窗 -->
    <div v-if="showDeleteConfirm" class="modal-overlay" @click.self="cancelDelete">
      <div class="modal-content">
        <h2>⚠️ 确认删除</h2>
        <p>确定要删除文章"{{ articleToDelete?.title }}"吗？此操作不可撤销。</p>
        <div class="modal-actions">
          <button @click="deleteArticle" class="btn btn-danger">确认删除</button>
          <button @click="cancelDelete" class="btn btn-secondary">取消</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vitepress'

const router = useRouter()
const articles = ref([])
const currentView = ref('list')
const editingArticle = ref(null)
const showDeleteConfirm = ref(false)
const articleToDelete = ref(null)
const editorMode = ref('write')

const form = ref({
  id: '',
  title: '',
  section: '技术学习',
  category: '',
  date: '',
  excerpt: '',
  content: ''
})

// 简单的 Markdown 预览（基础实现）
const previewHtml = computed(() => {
  if (!form.value.content) return ''
  let html = form.value.content
    // 代码块
    .replace(/```(\w+)?\n([\s\S]*?)```/g, '<pre><code>$2</code></pre>')
    // 行内代码
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // 标题
    .replace(/^### (.+)$/gm, '<h3>$1</h3>')
    .replace(/^## (.+)$/gm, '<h2>$1</h2>')
    .replace(/^# (.+)$/gm, '<h1>$1</h1>')
    // 粗体和斜体
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // 链接
    .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>')
    // 列表
    .replace(/^\- (.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>')
    // 段落
    .replace(/^([^<].+)$/gm, '<p>$1</p>')
    // 换行
    .replace(/\n/g, '<br>')
  return html
})

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
        section: '技术学习',
        category: 'JavaScript',
        date: '2024年1月15日',
        excerpt: '闭包是JavaScript中最强大的概念之一。本文将带你从基础到实践，全面掌握闭包的奥秘。',
        content: `# 深入理解JavaScript闭包

闭包是 JavaScript 中最强大但也最容易被误解的概念之一。

## 什么是闭包

闭包是指一个函数能够"记住"它创建时的环境。

### 一个简单的例子

\`\`\`javascript
function outer() {
  const name = 'JavaScript';
  function inner() {
    console.log(name);
  }
  returnra inner;
}
const fn = outer();
fn(); // 输出: JavaScript
\`\`\`

## 总结

理解闭包将帮助你写出更好的 JavaScript 代码。`
      },
      {
        id: 'css-layout',
        title: 'CSS布局的艺术',
        section: '技术学习',
        category: 'CSS',
        date: '2024年1月8日',
        excerpt: '从Flexbox到Grid，现代CSS布局技术让网页设计变得更加优雅和强大。',
        content: `# CSS布局的艺术

从 Flexbox 到 Grid，现代 CSS 布局技术让网页设计变得更加优雅和强大。

## Flexbox 弹性布局

\`\`\`css
.container {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
\`\`\`

## 总结

掌握 Flexbox 和 Grid，将帮助你构建任何你想象中的布局。`
      },
      {
        id: 'typescript-types',
        title: 'TypeScript类型系统入门',
        section: '技术学习',
        category: 'TypeScript',
        date: '2023年12月28日',
        excerpt: 'TypeScript的类型系统是其核心优势所在。了解类型推断、泛型和高级类型。',
        content: `# TypeScript类型系统入门

TypeScript 的类型系统是其核心优势所在。

## 基础类型

\`\`\`typescript
let name: string = 'Alice';
let age: number = 25;
\`\`\`

## 总结

掌握这些高级类型技巧，将帮助你写出更健壮的 TypeScript 代码。`
      },
      {
        id: 'responsive-design',
        title: '响应式设计的最佳实践',
        section: '技术学习',
        category: '响应式设计',
        date: '2023年12月20日',
        excerpt: '在多设备时代，响应式设计已成为前端开发的必备技能。',
        content: `# 响应式设计的最佳实践

在多设备时代，响应式设计已成为前端开发的必备技能。

## 响应式设计基础

响应式设计的核心是让网站能够适配不同的屏幕尺寸。

## 总结

掌握这些最佳实践，你就能构建出在各种设备上都能良好体验的网站。`
      }
    ]
    saveArticles()
  }
}

const saveArticles = () => {
  localStorage.setItem('blog-articles', JSON.stringify(articles.value))
}

const switchView = (view) => {
  currentView.value = view
}

const createArticle = () => {
  form.value = {
    id: '',
    title: '',
    section: '技术学习',
    category: '',
    date: new Date().toLocaleDateString('zh-CN', { year: 'numeric', month: 'long', day: 'numeric' }),
    excerpt: '',
    content: ''
  }
  editingArticle.value = null
  editorMode.value = 'write'
  switchView('edit')
}

const editArticle = (article) => {
  form.value = { ...article }
  editingArticle.value = article
  editorMode.value = 'write'
  switchView('edit')
}

const saveForm = () => {
  if (!form.value.title || !form.value.content) {
    alert('请填写标题和内容')
    return
  }

  if (editingArticle.value) {
    const index = articles.value.findIndex(a => a.id === editingArticle.value.id)
    if (index !== -1) {
      articles.value[index] = { ...form.value }
    }
  } else {
    const newId = form.value.title.toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
    form.value.id = newId || 'untitled-' + Date.now()
    articles.value.unshift({ ...form.value })
  }

  saveArticles()

  // 提示用户运行同步命令
  alert('文章已保存！\n\n请在终端运行: npm run sync:articles\n\n同步后会自动更新首页和文章目录')
  switchView('list')
}

const confirmDelete = (article) => {
  articleToDelete.value = article
  showDeleteConfirm.value = true
}

const deleteArticle = () => {
  if (articleToDelete.value) {
    articles.value = articles.value.filter(a => a.id !== articleToDelete.value.id)
    saveArticles()
    showDeleteConfirm.value = false
    articleToDelete.value = null
  }
}

const cancelDelete = () => {
  showDeleteConfirm.value = false
  articleToDelete.value = null
}

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

const importArticles = (event) => {
  const file = event.target.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.onload = (e) => {
    try {
      const imported = JSON.parse(e.target.result)
      if (Array.isArray(imported)) {
        articles.value = [...imported, ...articles.value]
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

const goBack = () => {
  router.go('/')
}

onMounted(() => {
  loadArticles()
})
</script>

<style scoped>
.admin-panel {
  max-width: 1200px;
  margin: 40px auto;
  padding: 0 20px;
}

.admin-header {
  background: white;
  padding: 24px 32px;
  border-radius: 12px;
  margin-bottom: 32px;
  border: 2px solid #d8d4cc;
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 16px;
}

.admin-header h1 {
  font-family: 'Caveat', 'Patrick Hand', cursive, Georgia, serif;
  font-size: 2remari
  margin: 0;
  color: #2d3436;
}

.admin-actions {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
}

.btn {
  padding: 10px 20px;
  border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px;
  border: 2px solid #5c8bc8;
  background: white;
  color: #5c8bc8;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 600;
}

.btn:hover {
  background: #5c8bc8;
  color: white;
  transform: rotate(-1deg);
}

.btn-primary {
  background: #5c8bc8;
  color: white;
}

.btn-primary:hover {
  background: #4a7bc0;
  transform: scale(1.05);
}

.btn-secondary {
  border-color: #e8a647;
  color: #e8a647;
}

.btn-secondary:hover {
  background: #e8a647;
  color: white;
}

.btn-danger {
  border-color: #e74c3c;
  color: #e74c3c;
}

.btn-danger:hover {
  background: #e74c3c;
  color: white;
}

.btn-back {
  margin-left: auto;
}

.btn-sm {
  padding: 6px 12px;
  font-size: 12px;
}

.articles-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
  gap: 24px;
}

.article-cards {
  display: contents;
}

.article-card {
  background: white;
  padding: 24px;
  border-radius: 12px;
  border: 2px solid #d8d4cc;
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.1);
  border-color: #5c8bc8;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
  gap: 8px;
  flex-wrap: wrap;
}

.section-badge {
  padding: 4px 12px;
  background: #e8a647;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.badge {
  padding: 4px 12px;
  background: #5c8bc8;
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.date {
  color: #8a8a8a;
  font-size: 13px;
}

.article-card h3 {
  font-family: 'Caveat', 'Patrick Hand', carius, Georgia, serif;
  font-size: 1.5rem;
  margin: 0 0 12px;
  color: #2d3436;
}

.excerpt {
  color: #5a5a5a;
  margin-bottom: 16px;
  line-height: 1.6;
}

.card-actions {
  display: flex;
  gap: 8px;
}

.empty-state {
  grid-column: 1 / -1;
  text-align: center;
  padding: 80px;
  color: #8a8a8a;
}

.editor-view {
  background: white;
  padding: 32px;
  border-radius: 12px;
  border: 2px solid #d8d4cc;
}

.form-group {
  margin-bottom: 24px;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 600;
  color: #2d3436;
}

.form-group input,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d8d4cc;
  border-radius: 8px;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  transition: border-color 0.3s;
}

.form-group input:focus,
.form-group textarea:focus,
.form-group select:focus {
  outline: none;
  border-color: #5c8bc8;
}

.select-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #d8d4cc;
  border-radius: 8px;
  font-family: 'Source Code Pro', monospace;
  font-size: 14px;
  transition: border-color 0.3s;
  background-color: white;
  cursor: pointer;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.editor-tabs {
  display: flex;
  gap: 4px;
  margin-bottom: 12px;
  border-bottom: 2px solid #d8d4cc;
}

.tab-btn {
  padding: 8px 16px;
  background: none;
  border: none;
  cursor: pointer;
  font-weight: 600;
  color: #8a8a8a;
  border-bottom: 2px solid transparent;
  margin-bottom: -2px;
}

.tab-btn.active {
  color: #5c8bc8;
  border-bottom-color: #5c8bc8;
}

.editor-container {
  min-height: 400px;
}

.markdown-editor {
  font-family: 'Source Code Pro', monospace;
  line-height: 1.6;
  resize: vertical;
}

.markdown-preview {
  padding: 20px;
  background: #f8f4ed;
  border-radius: 8px;
  line-height: 1.8;
  min-height: 400px;
}

.markdown-preview :deep(h1),
.markdown-preview :deep(h2),
.markdown-preview :deep(h3) {
  font-family: 'Caveat', 'Patrick Hand', cursive, Georgia, serif;
  margin-top: 1.5em;
  margin-bottom: 0.8em;
}

.markdown-preview :deep(pre) {
  background: #2d3436;
  color: #f8f4ed;
  padding: 16px;
  border-radius: 8px;
  overflow-x: auto;
  margin: 16px 0;
}

.markdown-preview :deep(code) {
  background: #e8a64733;
  padding: 2px 6px;
  border-radius: 4px;
  font-family: 'Source Code Pro', monospace;
}

.markdown-preview :deep(a) {
  color: #5c8bc8;
  text-decoration: underline;
}

.form-actions {
  display: flex;
  gap: 12px;
  margin-top: 32px;
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 32px;
  border-radius: 12px;
  max-width: 400px;
  width: 90%;
  border: 2px solid #e74c3c;
}

.modal-content h2 {
  margin-top: 0;
  color: #e74c3c;
}

.modal-content p {
  color: #5a5a5a;
  margin: 16px 0;
}

.modal-actions {
  display: flex;
  gap: 12px;
  justify-content: flex-end;
}

@media (max-width: 768px) {
  .admin-header {
    flex-direction: column;
    align-items: flex-start;
  }

  .admin-actions {
    width: 100%;
    justify-content: center;
  }

  .btn-back {
    margin-left: 0;
  }

  .form-row {
    grid-template-columns: 1fr;
  }

  .articles-list {
    grid-template-columns: 1fr;
  }
}
</style>

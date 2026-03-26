---
title: 所有文章
---

<script setup>
const articles = [
  {
    id: 'javascript-closure',
    title: '深入理解JavaScript闭包',
    category: 'JavaScript',
    date: '2024年1月15日',
    excerpt: '闭包是JavaScript中最强大的概念之一。本文将带你从基础到实践，全面掌握闭包的奥秘。'
  },
  {
    id: 'css-layout',
    title: 'CSS布局的艺术',
    category: 'CSS',
    date: '2024年1月8日',
    excerpt: '从Flexbox到Grid，现代CSS布局技术让网页设计变得更加优雅和强大。'
  },
  {
    id: 'typescript-types',
    title: 'TypeScript类型系统入门',
    category: 'TypeScript',
    date: '2023年12月28日',
    excerpt: 'TypeScript的类型系统是其核心优势所在。了解类型推断、泛型和高级类型。'
  },
  {
    id: 'responsive-design',
    title: '响应式设计的最佳实践',
    category: '响应式设计',
    date: '2023年12月20日',
    excerpt: '在多设备时代，响应式设计已成为前端开发的必备技能。'
  }
]
</script>

<div class="articles-page">
  <div class="page-header">
    <h1>📚 所有文章</h1>
    <p class="page-subtitle">探索知识的海洋</p>
  </div>

  <div class="article-cards">
    <article
      v-for="article in articles"
      :key="article.id"
      class="article-card"
    >
      <div class="card-meta">
        <span class="badge">{{ article.category }}</span>
        <span class="date">{{ article.date }}</span>
      </div>
      <h2><a :href="'/articles/' + article.id">{{ article.title }}</a></h2>
      <p class="excerpt">{{ article.excerpt }}</p>
      <a :href="'/articles/' + article.id" class="read-more">
        阅读全文 →
      </a>
    </article>
  </div>
</div>

<style scoped>
.articles-page {
  max-width: 820px;
  margin: 40px auto;
  padding: 0 20px;
}

.page-header {
  text-align: center;
  margin-bottom: 48px;
}

.page-header h1 {
  font-family: var(--vp-font-family-base);
  font-size: 3rem;
  margin-bottom: 12px;
  color: var(--vp-c-text-1);
}

.page-subtitle {
  color: var(--vp-c-text-2);
  font-size: 1.1rem;
}

.article-cards {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.article-card {
  background: var(--vp-c-bg-alt);
  padding: 32px;
  border-radius: 12px;
  border: 2px solid var(--vp-c-border);
  transition: all 0.3s ease;
}

.article-card:hover {
  transform: translateX(8px);
  border-color: var(--vp-c-brand-1);
  box-shadow: -4px 4px 0 var(--vp-c-brand-1);
}

.card-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.badge {
  padding: 6px 16px;
  background: var(--vp-c-brand-1);
  color: white;
  border-radius: 12px;
  font-size: 12px;
  font-weight: 600;
}

.date {
  color: var(--vp-c-text-3);
  font-size: 13px;
}

.article-card h2 {
  font-family: var(--vp-font-family-base);
  font-size: 2rem;
  margin: 0 0 16px;
}

.article-card h2 a {
  color: var(--vp-c-text-1);
  text-decoration: none;
  transition: color 0.2s;
}

.article-card h2 a:hover {
  color: var(--vp-c-brand-1);
}

.excerpt {
  color: var(--vp-c-text-2);
  margin-bottom: 20px;
  line-height: 1.8;
}

.read-more {
  color: var(--vp-c-brand-1);
  font-weight: 600;
  text-decoration: none;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  transition: gap 0.2s;
}

.read-more:hover {
  gap: 8px;
}

@media (max-width: 768px) {
  .page-header h1 {
    font-size: 2rem;
  }

  .article-card {
    padding: 24px;
  }

  .article-card h2 {
    font-size: 1.5rem;
  }
}
</style>

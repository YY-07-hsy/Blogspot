#!/usr/bin/env node

/**
 * 文章同步脚本
 * 将 localStorage 中的文章数据同步到 Markdown 文件
 * 更新首页和侧边栏
 */

const fs = require('fs')
const path = require('path')

// 读取文章数据
function loadArticlesData(dataPath) {
  try {
    const data = JSON.parse(fs.readFileSync(dataPath, 'utf-8'))
    console.log(`✓ 成功读取 ${data.length} 篇文章`)
    return data
  } catch (error) {
    console.error(`✗ 读取文章数据失败: ${error.message}`)
    return null
  }
}

// 生成 Markdown 文件内容
function generateMarkdown(article) {
  const frontmatter = `---
title: ${article.title}
date: ${article.date}
category: ${article.category || '未分类'}
section: ${article.section || '技术学习'}
excerpt: ${article.excerpt || ''}
---

`

  return frontmatter + article.content
}

// 写入文章文件
function writeArticleFile(article, outputDir) {
  const filename = `${article.id}.md`
  const filepath = path.join(outputDir, filename)

  try {
    const content = generateMarkdown(article)
    fs.writeFileSync(filepath, content, 'utf-8')
    console.log(`  ✓ 已生成: ${filename}`)
    return true
  } catch (error) {
    console.error(`  ✗ 生成失败 ${filename}: ${error.message}`)
    return false
  }
}

// 生成首页内容
function generateHomePage(articles) {
  // 将文章分为两个板块
  const techArticles = articles.filter(a => a.section === '技术学习')
  const dailyArticles = articles.filter(a => a.section === 'Daily & Reading')
  const recentArticles = articles.slice(0, 3) // 取最近3篇

  // 生成技术学习文章列表
  const techLinks = techArticles.map(a =>
    `- [${a.title}](/articles/${a.id})`
  ).join('\n')

  // 生成 Daily & Reading 文章列表
  const dailyLinks = dailyArticles.length > 0
    ? dailyArticles.map(a => `- [${a.title}](/articles/${a.id})`).join('\n')
    : '*暂无内容，敬请期待*'

  // 生成最近更新文章列表
  const recentLinks = recentArticles.map(a =>
    `### [${a.title}](/articles/${a.id})\n${a.excerpt}`
  ).join('\n\n')

  return `---
hero:
  name: 我的博客
  text: 探索与分享
  tagline: 代码不仅是工具，更是思想的载体
---

::: section-box author-section
<div class="icon-decoration">✍️</div>

## 作者简介

你好，我是一名热爱技术的前端开发者。

我热衷于探索新的技术领域，喜欢将复杂的概念以简单易懂的方式分享出来。这个博客是我记录学习心得、分享技术见解的地方。

**我的兴趣领域：**
- JavaScript & TypeScript
- Vue.js & React
- CSS & 响应式设计
- 编译器原理
- 编程语言设计

欢迎与我交流学习！
:::

::: section-box category-section
<div class="icon-decoration">📁</div>

## 主题分类

### 技术学习

这里是我分享技术心得和编程知识的地方。

${techLinks}

### Daily & Reading

记录日常生活和阅读笔记。

${dailyLinks}
:::

::: section-box recent-section
<div class="icon-decoration">🕐</div>

## 最近更新

${recentLinks}
:::
`
}

// 生成侧边栏配置
function generateSidebarConfig(articles) {
  // 按板块分组
  const techArticles = articles.filter(a => a.section === '技术学习')
  const dailyArticles = articles.filter(a => a.section === 'Daily & Reading')

  // 生成技术学习侧边栏
  const techSidebarItems = techArticles.map(a => ({
    text: a.title,
    link: `/articles/${a.id}`
  }))

  // 生成 Daily & Reading 侧边栏
  const dailySidebarItems = dailyArticles.map(a => ({
    text: a.title,
    link: `/articles/${a.id}`
  }))

  const sections = []

  if (techArticles.length > 0) {
    sections.push(`{
      text: '技术学习',
      items: ${JSON.stringify(techSidebarItems, null, 2)}
    }`)
  }

  if (dailyArticles.length > 0) {
    sections.push(`{
      text: 'Daily & Reading',
      items: ${JSON.stringify(dailySidebarItems, null, 2)}
    }`)
  }

  return `export default {
  '/articles/': [
    ${sections.join(',\n')}
  ]
}`
}

// 主函数
function main() {
  console.log('\n📝 博客文章同步工具\n')
  console.log('='.repeat(50))

  // 配置路径
  const rootDir = path.resolve(__dirname)
  const dataPath = path.join(rootDir, 'articles-data.json')
  const outputDir = path.join(rootDir, 'docs', 'articles')
  const homePath = path.join(rootDir, 'docs', 'index.md')
  const sidebarPath = path.join(rootDir, 'docs', '.vitepress', 'sidebar.js')

  // 检查数据文件是否存在
  if (!fs.existsSync(dataPath)) {
    console.error('\n✗ 文章数据文件不存在！')
    console.error(`  请确保 ${dataPath} 文件存在\n`)
    console.log('\n💡 提示: 从管理后台导出文章数据，保存为 articles-data.json\n')
    process.exit(1)
  }

  // 确保输出目录存在
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true })
    console.log(`✓ 已创建输出目录: ${outputDir}\n`)
  }

  // 读取文章数据
  const articles = loadArticlesData(dataPath)
  if (!articles) {
    process.exit(1)
  }

  console.log('\n正在同步文章数据...\n')

  // 1. 生成文章 Markdown 文件
  console.log('1️⃣ 生成文章文件...')
  console.log('\n正在生成 Markdown 文件...\n')
  let successCount = 0
  articles.forEach(article => {
    if (writeArticleFile(article, outputDir)) {
      successCount++
    }
  })
  console.log(`  ✓ 成功生成 ${successCount}/${articles.length} 篇文章\n`)

  // 2. 更新首页
  console.log('2️⃣ 更新首页...')
  try {
    const homeContent = generateHomePage(articles)
    fs.writeFileSync(homePath, homeContent, 'utf-8')
    console.log('  ✓ 首页已更新\n')
  } catch (error) {
    console.error(`  ✗ 更新首页失败: ${error.message}\n`)
  }

  // 3. 更新侧边栏配置
  console.log('3️⃣ 更新侧边栏配置...')
  try {
    const sidebarContent = generateSidebarConfig(articles)
    fs.writeFileSync(sidebarPath, sidebarContent, 'utf-8')
    console.log('  ✓ 侧边栏配置已更新\n')
  } catch (error) {
    console.error(`  ✗ 更新侧边栏失败: ${error.message}\n`)
  }

  console.log('='.repeat(50))
  console.log('\n✅ 同步完成！')
  console.log(`📂 文章目录: ${outputDir}`)
  console.log(`🏠 首页文件: ${homePath}`)
  console.log(`📋 侧边栏配置: ${sidebarPath}`)
  console.log('\n💡 提示: 运行 npm run docs:dev 查看效果\n')
}

// 运行主函数
main()

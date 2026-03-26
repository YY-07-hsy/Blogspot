---
title: 深入理解JavaScript闭包
date: 2024年1月15日
category: JavaScript
section: 技术学习
excerpt: 闭包是JavaScript中最强大的概念之一。本文将带你从基础到实践，全面掌握闭包的奥秘。
---

# 深入理解JavaScript闭包

闭包是 JavaScript 中最强大但也最容易被误解的概念之一。

## 什么是闭包

闭包是指一个函数能够"记住"它创建时的环境。

### 一个简单的例子

```javascript
function outer() {
  const name = 'JavaScript';
  function inner() {
    console.log(name);
  }
  return inner;
}
const fn = outer();
fn(); // 输出: JavaScript
```

## 总结

理解闭包将帮助你写出更好的 JavaScript 代码。
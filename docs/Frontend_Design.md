# 前端设计说明文档

## 1. 技术栈选型
* **核心框架**：Vue 3 (Composition API) + Vite
* **路由管理**：Vue Router 4
* **UI 样式**：Tailwind CSS (Utility-first CSS 框架)
* **图标库**：Lucide Vue Next
* **状态管理**：基于 Vue 3 的 `ref/reactive` 封装的 Composables (如 `useAuth.ts`)，结合 `localStorage` 实现本地持久化。

## 2. UI/UX 设计规范 (Apple HIG 风格)
* **色彩系统**：
  * 主题色 (Primary)：`#007AFF` (Apple Blue)
  * 背景色 (Background)：`#F5F5F7` (浅灰白，用于大背景)
  * 卡片色 (Surface)：`#FFFFFF` (纯白，用于内容承载)
  * 文字色 (Text)：`#1D1D1F` (深黑，主标题/正文)、`#86868B` (次要文本)
* **排版与形状**：
  * 广泛使用大圆角：`rounded-2xl` (16px) 或 `rounded-3xl` (24px)。
  * 阴影与层级：使用 `shadow-sm` 和 `shadow-md` 区分卡片层级，弹窗使用 `backdrop-blur-sm` (毛玻璃遮罩)。
* **交互反馈**：
  * 按钮点击与悬浮：统一使用 `transition-colors` 和 `hover:bg-opacity`。
  * 弹窗动画：使用 Vue `<Transition name="modal">` 实现平滑的缩放与淡入淡出。

## 3. 核心目录结构
```text
src/
├── components/
│   └── Layout.vue          # 全局响应式布局（顶部导航/底部Tab）
├── composables/
│   └── useAuth.ts          # 认证状态与逻辑复用钩子
├── router/
│   └── index.ts            # 路由配置（包含路由守卫基础）
├── views/
│   ├── Home.vue            # 首页（设备列表）
│   ├── EquipmentDetail.vue # 设备详情页（含日历、评价、支付）
│   ├── Community.vue       # 社区瀑布流页
│   ├── Profile.vue         # 个人中心（含各类管理弹窗）
│   └── Login.vue           # 登录与注册页
```

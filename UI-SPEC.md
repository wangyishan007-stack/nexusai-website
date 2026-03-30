# NexusAI UI 设计规范

## 1. 颜色系统

基于 Material Design 3，定义在 `src/index.css` 的 `@theme` 中。

### 主色 (Primary)

| Token | 色值 | 用途 |
|-------|------|------|
| `primary` | `#004ac6` | 品牌蓝，按钮、链接、强调 |
| `primary-container` | `#2563eb` | 浅主色容器背景 |
| `on-primary` | `#ffffff` | 主色上的文字 |
| `on-primary-container` | `#eeefff` | 主色容器上的文字 |

### 表面 (Surface)

| Token | 色值 | 用途 |
|-------|------|------|
| `background` / `surface` | `#f7f9fb` | 页面背景 |
| `surface-container-lowest` | `#ffffff` | 卡片背景（白色） |
| `surface-container-low` | `#f2f4f6` | 浅色容器 |
| `surface-container` | `#eceef0` | 标准容器 |
| `surface-container-high` | `#e6e8ea` | 深色容器、按钮背景 |
| `surface-container-highest` | `#e0e3e5` | 最深容器 |

### 文字 (Text)

| Token | 色值 | 用途 |
|-------|------|------|
| `on-surface` | `#191c1e` | 主文字 |
| `on-surface-variant` | `#434655` | 次要文字、描述 |
| `outline` | `#737686` | 边框 |
| `outline-variant` | `#c3c6d7` | 浅边框 |

### 语义色 (Semantic)

| Token | 色值 | 用途 |
|-------|------|------|
| `error` | `#ba1a1a` | 错误状态 |
| `secondary` | `#495c95` | 次要蓝 |
| `tertiary` | `#943700` | 橙色强调 |

### 状态色 (Tailwind 原生)

| 用途 | 背景 | 文字 |
|------|------|------|
| 成功 | `bg-emerald-50` | `text-emerald-700` |
| 警告 | `bg-amber-50` | `text-amber-700` |
| 错误 | `bg-red-50` | `text-red-700` |
| 默认 | `bg-slate-100` | `text-slate-600` |

---

## 2. 字体

| 变量 | 字体 | 用途 |
|------|------|------|
| `font-headline` | Manrope | 标题、品牌名 |
| `font-body` | Inter | 正文、按钮 |
| `font-label` | Inter | 标签、小字 |

---

## 3. 排版层级

| 场景 | 字号 | 字重 | 字体 | 字距 |
|------|------|------|------|------|
| Hero 标题 | `text-5xl` ~ `text-7xl` | `font-extrabold` | headline | `tracking-tight` |
| 页面标题 | `text-3xl` | `font-bold` | headline | `tracking-tight` |
| 区块标题 | `text-lg` | `font-bold` | headline | — |
| 卡片标题 | `text-sm` | `font-bold` / `font-semibold` | headline | — |
| 正文 | `text-sm` | 默认 | body | — |
| 页面副标题 | `text-sm` | 默认 | body | — |
| 小标签 (大写) | `text-[10px]` | `font-bold` | label | `tracking-[0.15em]` |
| 表单标签 | `text-[11px]` | `font-bold` | label | `tracking-wider` |
| 统计数值 | `text-xl` | `font-bold` | headline | — |
| 按钮文字 | `text-sm` | `font-semibold` | body | — |
| 导航项 | `text-sm` | `font-medium` | body | `tracking-wide` |

---

## 4. 间距

### 内边距 (Padding)

| 类名 | 值 | 用途 |
|------|------|------|
| `p-2` | 8px | 图标按钮、紧凑控件 |
| `p-4` | 16px | 标准内边距 |
| `p-5` | 20px | 卡片内容 |
| `p-6` | 24px | 区块、容器 |
| `p-10` | 40px | 页面主内容区 |

### 外边距 (Margin)

| 类名 | 值 | 用途 |
|------|------|------|
| `mb-1` | 4px | 紧凑间距 |
| `mb-2` | 8px | 标题与副标题间 |
| `mb-4` | 16px | 小区块间距 |
| `mb-8` | 32px | 页面标题区与内容间 |
| `mb-12` | 48px | 大区块间距 |

### 间隙 (Gap)

| 类名 | 值 | 用途 |
|------|------|------|
| `gap-2` | 8px | 图标与文字 |
| `gap-3` | 12px | 导航项（图标+文字） |
| `gap-4` | 16px | 卡片网格 |
| `gap-6` | 24px | 大卡片网格 |
| `gap-8` | 32px | 区块间距 |

---

## 5. 圆角

| 类名 | 值 | 用途 |
|------|------|------|
| `rounded-full` | 9999px | 头像、进度条、圆形指示器 |
| `rounded-2xl` | 16px | 大容器、展示区 |
| `rounded-xl` | 12px | 卡片、弹窗、大按钮 |
| `rounded-lg` | 8px | 按钮、输入框、导航项 |
| `rounded-md` | 6px | 小标签、图标按钮 |

---

## 6. 阴影

| 类名 | 用途 |
|------|------|
| `.ambient-shadow` | 品牌投影 `0px 12px 32px rgba(25,28,30,0.04)` |
| `shadow-sm` | 导航项激活态、小元素 |
| `shadow-md` | 按钮 |
| `shadow-2xl` | 弹窗 |

---

## 7. 边框

| 类名 | 用途 |
|------|------|
| `border border-outline-variant/15` | 标准卡片边框 |
| `border border-outline-variant/30` | 略深卡片边框 |
| `border border-slate-200` | 侧边栏分隔线 |
| `border border-slate-100` | 弹窗分隔线 |
| `border-primary/10` | 彩色装饰边框 |

---

## 8. 组件规范

### 8.1 Settings 页面结构

```
<SettingsLayout activeTab="xxx">
  <main className="flex-1 p-10 max-w-6xl w-full mx-auto">
    {/* 页面标题 */}
    <header className="mb-8">
      <h2 className="text-3xl font-bold font-headline tracking-tight mb-2">
        页面名称
      </h2>
      <p className="text-on-surface-variant text-sm">
        页面描述文案
      </p>
    </header>

    {/* 内容区 */}
    <section className="space-y-6 mb-12">
      ...
    </section>
  </main>
</SettingsLayout>
```

### 8.2 按钮

**主按钮 (Primary)**
```html
<button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90 transition-opacity">
  按钮文字
</button>
```

**次按钮 (Outline)**
```html
<button className="px-4 py-2 border border-primary text-primary font-bold rounded-lg text-xs uppercase tracking-widest hover:bg-primary/5 transition-colors">
  按钮文字
</button>
```

**表面按钮 (Surface)**
```html
<button className="px-4 py-2 bg-surface-container-high text-on-surface rounded-lg text-sm font-medium hover:bg-surface-variant transition-colors flex items-center gap-2">
  <span className="material-symbols-outlined text-[18px]">icon</span>
  按钮文字
</button>
```

**图标按钮**
```html
<button className="w-8 h-8 flex items-center justify-center text-slate-500 hover:bg-slate-50 rounded-lg transition-all">
  <span className="material-symbols-outlined text-[20px]">icon_name</span>
</button>
```

### 8.3 卡片

**标准卡片**
```html
<div className="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant/15">
  ...
</div>
```

**白色卡片（Settings 页内）**
```html
<div className="bg-white rounded-xl p-6 border border-outline-variant/30">
  ...
</div>
```

### 8.4 输入框

```html
<input
  className="w-full bg-white border border-outline-variant/30 rounded-lg px-3 py-2 text-sm focus:ring-1 focus:ring-primary focus:border-primary transition-all placeholder:text-slate-400"
  placeholder="输入内容..."
/>
```

### 8.5 开关 (Toggle)

```html
<label className="relative inline-flex items-center cursor-pointer">
  <input className="sr-only peer" type="checkbox" />
  <div className="w-11 h-6 bg-surface-container-highest rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary" />
</label>
```

### 8.6 状态标签 (Badge)

```html
<!-- 成功 -->
<span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700">Active</span>

<!-- 警告 -->
<span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-700">Warning</span>

<!-- 错误 -->
<span className="px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider bg-red-50 text-red-700">Expired</span>
```

### 8.7 表格

```html
<!-- 表头 -->
<thead className="bg-surface-container-low">
  <tr className="border-b border-outline-variant/10">
    <th className="px-6 py-4 text-[11px] font-extrabold uppercase tracking-widest text-on-surface-variant text-left">
      列名
    </th>
  </tr>
</thead>

<!-- 数据行 -->
<tr className="border-b border-outline-variant/5 hover:bg-surface-container-low/50 transition-colors">
  <td className="px-6 py-4 text-sm text-on-surface">内容</td>
</tr>
```

### 8.8 弹窗 (Modal)

```html
<!-- 遮罩 -->
<div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50" onClick={onClose}>
  <!-- 弹窗容器 -->
  <div className="bg-white rounded-xl shadow-2xl w-full max-w-md mx-4" onClick={e => e.stopPropagation()}>
    {/* Header */}
    <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
      <h3 className="text-lg font-bold font-headline">标题</h3>
      <button className="w-7 h-7 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center">
        <span className="material-symbols-outlined text-[18px]">close</span>
      </button>
    </div>
    {/* Body */}
    <div className="px-6 py-5">...</div>
    {/* Footer */}
    <div className="flex justify-end gap-3 px-6 py-4 border-t border-slate-100">
      <button className="px-4 py-2.5 text-sm font-medium text-slate-600 hover:bg-slate-50 rounded-lg">取消</button>
      <button className="px-5 py-2.5 bg-primary text-white font-semibold rounded-lg text-sm hover:opacity-90">确认</button>
    </div>
  </div>
</div>
```

---

## 9. 图标

使用 **Material Symbols Outlined**，通过 `<span className="material-symbols-outlined">` 渲染。

**尺寸映射：**

| 场景 | 类名 |
|------|------|
| 导航图标 | `text-[20px]` |
| 按钮内图标 | `text-[18px]` |
| 小图标 | `text-sm` (14px) |
| 大图标 | `text-[28px]` |
| 空状态图标 | `text-4xl` (36px) |

**填充变体：**
```html
<span className="material-symbols-outlined" style={{ fontVariationSettings: "'FILL' 1" }}>
  check_circle
</span>
```

---

## 10. 导航

### 侧边栏 (Settings)

```
容器: h-screen w-64 fixed, bg-slate-50, border-r border-slate-200

分组标题: text-[10px] uppercase tracking-[0.15em] text-on-surface-variant font-bold

导航项 (默认):
  flex items-center gap-3 px-3 py-2 text-slate-600
  hover:bg-slate-100 hover:text-slate-900 rounded-lg

导航项 (激活):
  flex items-center gap-3 px-3 py-2 bg-white text-primary
  shadow-sm rounded-lg font-semibold
```

### 顶部导航 (公共页面)

```
容器: fixed top-0 w-full z-50, h-20
  bg-white/80 backdrop-blur-md border-b border-slate-200/50

Logo: text-2xl font-extrabold tracking-tight font-headline

链接 (默认): text-sm font-medium text-slate-600 hover:text-slate-900
链接 (激活): text-blue-600 border-b-2 border-blue-600 pb-1
```

---

## 11. 自定义 CSS

```css
/* 毛玻璃导航 */
.glass-nav {
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}

/* 品牌投影 */
.ambient-shadow {
  box-shadow: 0px 12px 32px rgba(25, 28, 30, 0.04);
}

/* Hero 背景渐变 */
.hero-gradient {
  background: radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent 40%),
              radial-gradient(circle at bottom left, rgba(0, 74, 198, 0.05), transparent 40%);
}
```

---

## 12. 响应式断点

| 前缀 | 宽度 | 用途 |
|------|------|------|
| 默认 | < 640px | 移动端 |
| `sm:` | >= 640px | 小屏 |
| `md:` | >= 768px | 平板（显示导航链接） |
| `lg:` | >= 1024px | 桌面（多列布局） |
| `xl:` | >= 1280px | 大屏 |

常用模式：
- `grid-cols-1 sm:grid-cols-2 lg:grid-cols-3` — 响应式网格
- `hidden md:flex` — 移动端隐藏
- `text-3xl md:text-5xl` — 响应式字号

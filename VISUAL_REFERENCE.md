# 🎨 MediConnect Visual Design Reference

## 🎨 COLOR PALETTE

### Hospital Portal (Medical Blue)
```
Primary Blue:     #2A5C82  ████████
Light Blue:       #3B7BA9  ████████
Accent Blue:      #4A90D9  ████████
Background:       #F8FAFC  ████████
Border:           #E2E8F0  ████████
```

### Support Portal (Teal Green)
```
Primary Teal:     #008080  ████████
Light Teal:       #0D9488  ████████
Accent Teal:      #14B8A6  ████████
Dark Sidebar:     #1E293B  ████████
Darker Sidebar:   #0F172A  ████████
```

### Status Colors
```
Success/Active:   #10B981  ████████ Green
Warning/Pending:  #F59E0B  ████████ Yellow
Critical/Error:   #EF4444  ████████ Red
Info:             #3B82F6  ████████ Blue
```

### Neutral Colors
```
Text Dark:        #0F172A  ████████
Text Medium:      #475569  ████████
Text Light:       #94A3B8  ████████
Background:       #FFFFFF  ████████
Border:           #E2E8F0  ████████
```

---

## 📐 LAYOUT STRUCTURE

### Login Page Layout
```
┌─────────────────────────────────────────┐
│  ┌──────────┬───────────────────────┐  │
│  │          │  LOGO & WELCOME       │  │
│  │  BRAND   │  ┌─────────┬────────┐ │  │
│  │  INFO    │  │HOSPITAL │SUPPORT │ │  │
│  │          │  └─────────┴────────┘ │  │
│  │  SECURE  │  [Username Input]     │  │
│  │  REAL-   │  [Password Input]     │  │
│  │  TIME    │  ☑ Remember  Forgot?  │  │
│  │          │  [   LOGIN BUTTON  ]  │  │
│  │  TRUST   │  Demo Credentials     │  │
│  └──────────┴───────────────────────┘  │
└─────────────────────────────────────────┘
```

### Hospital Dashboard Layout
```
┌─────────────────────────────────────────────┐
│ 🏥 City Hospital  [Search] 🔔 👤 [Logout]  │
├─────────────────────────────────────────────┤
│ Dashboard │ Patients │ Appointments │ etc.. │
├─────────────────────────────────────────────┤
│ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐       │
│ │STAT 1│ │STAT 2│ │STAT 3│ │STAT 4│       │
│ └──────┘ └──────┘ └──────┘ └──────┘       │
│                                             │
│ ┌─────────────────────────────────────┐   │
│ │  ⚠️ ALERTS                          │   │
│ └─────────────────────────────────────┘   │
│                                             │
│ ┌──────────────────┐ ┌─────────────────┐  │
│ │ PATIENT          │ │ APPOINTMENTS    │  │
│ │ ADMISSIONS       │ │ TODAY           │  │
│ │                  │ │                 │  │
│ └──────────────────┘ └─────────────────┘  │
└─────────────────────────────────────────────┘
```

### Support Dashboard Layout
```
┌──────┬────────────────────────────────────┐
│      │ Dashboard Overview    [Search] 🔔  │
│ HOME ├────────────────────────────────────┤
│ 🏥   │ ┌──────┐ ┌──────┐ ┌──────┐ ┌─────┐│
│ 👥   │ │STAT 1│ │STAT 2│ │STAT 3│ │STAT4││
│ 🛒   │ └──────┘ └──────┘ └──────┘ └─────┘│
│ 📦   │                                     │
│ 💬 8 │ ┌─────────────┐ ┌────────────────┐ │
│ 📊   │ │ HOSPITALS   │ │ SUPPORT        │ │
│ ⚙️   │ │             │ │ TICKETS        │ │
│      │ └─────────────┘ └────────────────┘ │
│──────│                                     │
│ 👤   │ ┌──────────────────────────────────┤
│Admin │ │ RECENT ORDERS TABLE             ││
│[OUT] │ └──────────────────────────────────┘│
└──────┴────────────────────────────────────┘
```

---

## 🎯 COMPONENT STYLES

### Button Styles

**Primary (Teal)**
```css
bg-teal-600 hover:bg-teal-700 text-white
rounded-lg px-4 py-3 shadow-lg
```

**Secondary (Slate)**
```css
bg-slate-100 hover:bg-slate-200 text-slate-700
rounded-lg px-4 py-2
```

**Icon Button**
```css
p-2 hover:bg-slate-100 rounded-lg
transition-colors
```

### Card Styles

**Default Card**
```css
bg-white rounded-xl p-6
border border-slate-200
hover:shadow-lg transition-shadow
```

**Stat Card**
```css
bg-white rounded-xl p-6
shadow-sm border border-slate-200
```

**Alert Card**
```css
bg-gradient-to-r from-red-50 to-orange-50
border-l-4 border-red-500 rounded-lg p-4
```

### Badge Styles

**Success**
```css
bg-green-100 text-green-700
px-3 py-1 rounded-full text-sm
```

**Warning**
```css
bg-yellow-100 text-yellow-700
px-3 py-1 rounded-full text-sm
```

**Error**
```css
bg-red-100 text-red-700
px-3 py-1 rounded-full text-sm
```

**Info**
```css
bg-blue-100 text-blue-700
px-3 py-1 rounded-full text-sm
```

---

## 📏 SPACING SYSTEM

### Padding Scale
```
p-2  → 8px     Small elements
p-4  → 16px    Medium elements
p-6  → 24px    Cards
p-8  → 32px    Page sections
p-12 → 48px    Large sections
```

### Gap Scale
```
gap-2 → 8px    Tight grouping
gap-3 → 12px   Default spacing
gap-4 → 16px   Comfortable spacing
gap-6 → 24px   Section spacing
gap-8 → 32px   Large spacing
```

### Border Radius
```
rounded     → 4px     Small elements
rounded-lg  → 8px     Buttons, inputs
rounded-xl  → 12px    Cards
rounded-2xl → 16px    Large cards
rounded-full → 9999px Pills, badges
```

---

## ✏️ TYPOGRAPHY

### Font Sizes
```
text-xs   → 12px   Small labels
text-sm   → 14px   Secondary text
text-base → 16px   Body text
text-lg   → 18px   Subheadings
text-xl   → 20px   Headings
text-2xl  → 24px   Large headings
text-3xl  → 30px   Hero text
```

### Font Weights
```
font-normal   → 400   Body text
font-medium   → 500   Emphasis
font-semibold → 600   Headings
font-bold     → 700   Strong headings
```

### Line Heights
```
leading-tight   → 1.25   Headlines
leading-normal  → 1.5    Body text
leading-relaxed → 1.625  Comfortable reading
```

---

## 🎨 GRADIENTS

### Login Background
```css
bg-gradient-to-br from-teal-50 via-white to-blue-50
```

### Hospital Theme
```css
bg-gradient-to-r from-blue-600 to-blue-700
```

### Support Sidebar
```css
bg-gradient-to-b from-slate-800 to-slate-900
```

### Alert Banner
```css
bg-gradient-to-r from-red-50 to-orange-50
```

---

## 🌟 SHADOWS

### Card Shadow
```css
shadow-sm    → Small elevation
shadow       → Medium elevation
shadow-lg    → Large elevation
shadow-2xl   → Modal elevation
```

### Colored Shadows
```css
shadow-teal-200   → Teal glow
shadow-blue-200   → Blue glow
shadow-red-200    → Red glow
```

---

## 🎯 ICON SIZES

### Usage
```
size={16}  → Small icons (badges, inline)
size={18}  → Medium icons (buttons)
size={20}  → Default icons (navigation)
size={24}  → Large icons (stats, headers)
size={28}  → Extra large icons (logos)
```

---

## 📊 STATUS INDICATORS

### Patient Status
```
Critical   → Red background, urgent
Stable     → Green background, good
Recovering → Blue background, progress
Post-Op    → Yellow background, watch
```

### Order Status
```
Delivered  → Green, complete
Shipped    → Blue, in transit
Processing → Yellow, pending
Pending    → Gray, waiting
```

### Ticket Priority
```
High       → Red badge
Medium     → Yellow badge
Low        → Blue badge
```

### Ticket Status
```
Open       → Red, needs attention
In-Progress → Blue, being handled
Resolved   → Green, complete
```

---

## 🎨 VISUAL HIERARCHY

### Level 1 (Highest)
```
- Page titles (text-2xl, font-bold)
- Primary actions (bg-teal-600)
- Critical alerts (bg-red-100)
```

### Level 2
```
- Section headings (text-xl, font-bold)
- Important stats (text-3xl, font-bold)
- Secondary actions (bg-slate-100)
```

### Level 3
```
- Card titles (text-lg, font-semibold)
- Labels (text-sm, font-medium)
- Body text (text-base)
```

### Level 4 (Lowest)
```
- Helper text (text-sm, text-slate-500)
- Timestamps (text-xs, text-slate-400)
- Disabled elements (opacity-50)
```

---

## 🔄 TRANSITIONS

### Duration
```css
transition-all       → All properties
transition-colors    → Colors only
transition-shadow    → Shadow only
transition-transform → Transform only
```

### Speed
```css
duration-150 → 150ms  Quick
duration-200 → 200ms  Default
duration-300 → 300ms  Smooth
duration-500 → 500ms  Slow
```

---

## 📱 RESPONSIVE BREAKPOINTS

### Tailwind Breakpoints
```
sm:  640px   → Small tablets
md:  768px   → Tablets
lg:  1024px  → Small laptops
xl:  1280px  → Laptops
2xl: 1536px  → Desktops
```

### Grid Responsive
```
grid grid-cols-1       → Mobile (1 column)
md:grid-cols-2        → Tablet (2 columns)
lg:grid-cols-4        → Desktop (4 columns)
```

---

## ✨ VISUAL EFFECTS

### Hover States
```css
hover:bg-slate-50       → Subtle highlight
hover:shadow-lg         → Elevation
hover:scale-105        → Slight grow
hover:translate-x-1    → Subtle movement
```

### Focus States
```css
focus:ring-2 focus:ring-teal-500
focus:border-teal-500
outline-none
```

### Active States
```css
active:scale-95        → Press effect
active:bg-teal-700     → Darker on press
```

---

## 🎨 ACCESSIBILITY

### Contrast Ratios
```
Text on white:     #0F172A (21:1) AAA
Links:             #0D9488 (4.5:1) AA
Buttons:           #FFFFFF on #008080 (4.5:1) AA
Disabled:          opacity-50 (reduced)
```

### Focus Indicators
```css
Always visible focus rings
2px solid ring
Teal color for visibility
Clear tab order
```

---

## 📏 MEASUREMENTS

### Component Heights
```
Button:      44px (py-3)
Input:       44px (py-3)
Header:      64px
Sidebar:     100vh
Card:        auto with p-6
```

### Component Widths
```
Login card:  max-w-5xl
Sidebar:     w-64 (256px)
Search:      w-80 (320px)
Modal:       max-w-2xl
```

---

**Use this reference when customizing or extending the design!** 🎨

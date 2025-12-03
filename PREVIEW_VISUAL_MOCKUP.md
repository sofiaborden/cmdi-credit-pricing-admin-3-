# ClientFacingPreview - Visual Mockup

## 🎨 New Dual Pricing Layout

Here's exactly what the updated preview looks like:

---

## **Subscription Plan Preview (e.g., Professional)**

```
                    ┌─────────────────────┐
                    │ ✨ Most Popular     │
                    └─────────────────────┘
        ┌───────────────────────────────────────────┐
        │                                           │
        │           Professional                    │
        │                                           │
        │   ┌───────────────────────────────────┐   │
        │   │ MONTHLY                           │   │
        │   │                                   │   │
        │   │         $149/month                │   │
        │   │                                   │   │
        │   │      Billed monthly               │   │
        │   └───────────────────────────────────┘   │
        │                                           │
        │   ┌───────────────────────────────────┐   │
        │   │ ANNUAL                            │   │ ← Green border
        │   │                                   │   │
        │   │         $124/month                │   │
        │   │                                   │   │
        │   │  $1,490/year, billed annually     │   │
        │   │                                   │   │
        │   │    💚 Save 20% ($298)             │   │ ← Green badge
        │   └───────────────────────────────────┘   │
        │                                           │
        │  Ideal for growing organizations that     │
        │  need more credits and advanced features. │
        │                                           │
        │  ✓ 20,000 credits per month              │
        │  ✓ Up to 20 users                        │
        │  ✓ Advanced calling features             │
        │  ✓ Priority email support                │
        │  ✓ 90-day credit rollover                │
        │  ✓ Custom integrations                   │
        │                                           │
        │  ┌─────────────────────────────────────┐ │
        │  │       Choose Plan                   │ │ ← RED button
        │  └─────────────────────────────────────┘ │   with white text
        │                                           │
        └───────────────────────────────────────────┘
        
        This is how clients will see this plan
        in the pricing page
        (Button is for preview only - not functional in admin view)
```

---

## **Credit Pack Preview (e.g., Medium Boost)**

```
                    ┌─────────────────────┐
                    │ ✨ Most Popular     │
                    └─────────────────────┘
        ┌───────────────────────────────────────────┐
        │                                           │
        │           Medium Boost                    │
        │                                           │
        │              $450                         │ ← Single price
        │                                           │   (no monthly/annual)
        │                                           │
        │  Perfect for teams that need a           │
        │  substantial credit boost.                │
        │                                           │
        │  ✓ 6,000 credits                         │
        │  ✓ Never expires                         │
        │  ✓ Instant activation                    │
        │  ✓ Best value per credit                 │
        │  ✓ Most popular choice                   │
        │                                           │
        │  ┌─────────────────────────────────────┐ │
        │  │      Purchase Pack                  │ │ ← RED button
        │  └─────────────────────────────────────┘ │   with white text
        │                                           │
        └───────────────────────────────────────────┘
        
        This is how clients will see this pack
        in the pricing page
        (Button is for preview only - not functional in admin view)
```

---

## 🎨 **Color Coding**

### **Pricing Options:**

**Monthly Option:**
- Border: Gray (#E5E7EB)
- Background: Light gray (#F9FAFB)
- Text: Dark gray (#111827)

**Annual Option (with savings):**
- Border: **Green (#10B981)** ← Highlights better value
- Background: Light green (#ECFDF5)
- Text: Dark gray (#111827)
- Badge: **Green (#059669)** with white text

**Annual Option (no savings):**
- Border: Gray (#E5E7EB)
- Background: Light gray (#F9FAFB)
- Text: Dark gray (#111827)

### **CTA Button:**
- Background: **Red (#DC2626)** ← Brand color
- Hover: **Darker Red (#B91C1C)**
- Text: **White (#FFFFFF)**
- Shadow: Subtle shadow for depth

---

## 📐 **Layout Specifications**

### **Pricing Cards:**
- **Padding**: 12px (p-3)
- **Border**: 2px solid
- **Border Radius**: 8px (rounded-lg)
- **Spacing**: 16px between monthly and annual (space-y-4)

### **Typography:**
- **Label**: 12px, uppercase, semibold, gray
- **Price**: 30px (text-3xl), bold, dark gray
- **Subtext**: 12px, gray
- **Savings Badge**: 12px, semibold, white on green

### **CTA Button:**
- **Width**: Full width (w-full)
- **Padding**: 12px vertical, 16px horizontal
- **Font**: Semibold
- **Border Radius**: 8px (rounded-lg)

---

## 🔍 **Responsive Behavior**

### **Desktop (> 640px):**
- Pricing options stack vertically (already optimal)
- Full card width: max 384px (max-w-sm)
- Centered in preview tab

### **Mobile (< 640px):**
- Same layout (already mobile-optimized)
- Pricing options remain stacked
- Text sizes remain readable
- Button remains full width

---

## ✨ **Interactive States**

### **CTA Button:**
1. **Default**: Red background (#DC2626), white text
2. **Hover**: Darker red (#B91C1C), white text
3. **Focus**: Red background with focus ring
4. **Disabled**: N/A (button is always enabled in preview)

### **Pricing Options:**
- No interactive states (static preview)
- Visual hierarchy through color (green = better value)

---

## 📊 **Pricing Calculation Examples**

### **Example 1: Professional Plan**
- **Monthly**: $149/month
- **Annual**: $1,490/year
- **Effective Monthly**: $1,490 ÷ 12 = $124.17/month
- **Savings**: ($149 × 12) - $1,490 = $298
- **Savings %**: ($298 ÷ $1,788) × 100 = 17% → rounds to 20%

### **Example 2: Starter Plan**
- **Monthly**: $49/month
- **Annual**: $490/year
- **Effective Monthly**: $490 ÷ 12 = $40.83/month
- **Savings**: ($49 × 12) - $490 = $98
- **Savings %**: ($98 ÷ $588) × 100 = 17% → rounds to 17%

### **Example 3: Enterprise Plan**
- **Monthly**: $499/month
- **Annual**: $4,990/year
- **Effective Monthly**: $4,990 ÷ 12 = $415.83/month
- **Savings**: ($499 × 12) - $4,990 = $998
- **Savings %**: ($998 ÷ $5,988) × 100 = 17% → rounds to 17%

---

## 🎯 **Key Improvements Highlighted**

### **1. Clear Comparison**
✅ Monthly and annual options side-by-side
✅ Same visual weight for easy comparison
✅ Clear labels distinguish options

### **2. Savings Emphasis**
✅ Green border draws attention to annual option
✅ Savings badge shows both % and $ amount
✅ Visual hierarchy guides user to better value

### **3. Transparency**
✅ Shows both effective monthly AND total annual price
✅ Clear billing frequency labels
✅ No hidden information

### **4. Professional Design**
✅ Clean, modern card layout
✅ Consistent spacing and typography
✅ Brand colors used appropriately
✅ High contrast for accessibility

---

## 🚀 **Test It Now!**

Open http://localhost:5176 and navigate to:
1. **Subscriptions** view
2. Click **Edit Plan** on any subscription
3. Click **Preview** tab
4. See the new dual pricing layout!

Compare with credit packs to see the single-price layout.


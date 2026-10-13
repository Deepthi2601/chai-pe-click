# Chai Pe Click! ☕🍪

**"Catch the biscuits. Brew the chai. Rule Hyderabad!"**

A fast-paced, Hyderabad-inspired incremental arcade & clicker game celebrating Old City Irani cafés and Subhan Bakery's iconic Osmania biscuits.

---

## Gameplay & Features

### Two Playable Game Modes
1. **Mode A: Biscuit Catcher 🍪**
   - Slide your vintage silver tea tray across the café floor using your **Mouse**, **Touch Drag**, or **Arrow Keys / A & D**.
   - Catch Normal Osmania Biscuits (**+10 pts**), Golden Biscuits (**+50 pts**), and Special Power-Up Biscuits (**+25 pts**).
   - Protect your **3 Lives** as falling speeds increase with each level!
2. **Mode B: Irani Chai Rush ☕**
   - Rapidly click, tap, hold the pointer down, or press **Spacebar** to pour steaming Assam decoction and creamy malai into fluted Irani tea glasses.
   - Each pour pulse generates Chai Points and fills the brew gauge.
   - Completing a full cup awards **+20 Bonus Points**, with extra **Perfect Brewing Streak** bonuses every 3rd cup!

### Power-Ups & Hyderabad Special Events
- **Power-Ups**: Chai Boost (2x points), Biscuit Magnet, Slow Motion, Golden Hour, and Extra Life (+1 ❤️).
- **Random Hyderabad Café Events**:
  - *Charminar Rush*: Faster biscuits & 1.5x points.
  - *Monsoon Over Hussain Sagar (Rainy Evening)*: Cozy rainy café vibe with +50% bonus points.
  - *Fresh Subhan Bakery Batch*: High-density biscuit shower.
  - *Special Zafrani Golden Chai*: Tap the glowing Golden Tea Glass on screen for +120 bonus points!
  - *Nimrah Café Rush Hour*: High-speed challenge awarding +25 bonus Osmaniye Coins on survival.

### Incremental Progression, Upgrades & Local Leaderboard
- Earn **Osmaniye Coins** based on your score and events survived.
- Unlock up to 5 multi-level upgrades in the **Café Upgrade Shop**: *Bigger Silver Tray*, *Ustad Faster Hands*, *Lucky Pearled Biscuit Jar*, *Assam & Elaichi Tea Leaves*, and *Brass Super Strainer*.
- Unlock 8 persistent **Hyderabad Achievements** and track your best scores on the **Local Café Leaderboard** with one-click score sharing.

---

## Local Development Setup

```bash
# 1. Install dependencies
npm install

# 2. Start the development server on port 3000
npm run dev

# 3. Type-check and build for production
npm run lint
npm run build
```

---

## Deployment Instructions (Vercel / Netlify)

- **Build Command**: `npm run build`
- **Output Directory**: `dist`
- **Node.js Version**: `20.x` or later
- No external database or secret API keys are required; progress is persisted safely in browser `localStorage`.

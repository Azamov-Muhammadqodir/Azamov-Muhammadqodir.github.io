# 🚀 Dasturchi Portfolio Sayti

Modern va professional dasturchi portfoliosi - to'liq responsive va animatsiyalar bilan.

## ✨ Xususiyatlar

- 🎨 **Zamonaviy Dizayn**: Chiroyli gradient ranglari va smooth animatsiyalar
- 📱 **Responsive**: Barcha ekran o'lchamlarida mukammal ishlaydi
- ⚡ **Tez yuklash**: Optimallashtirilgan kod va resurslar
- 🎭 **Animatsiyalar**: Smooth scroll va hover effektlari
- 💼 **Portfolio bo'limlari**: 
  - Bosh sahifa (Hero)
  - Men haqimda
  - Ko'nikmalar
  - Loyihalar
  - Bog'lanish shakli

## 🛠️ Texnologiyalar

- HTML5
- CSS3 (Flexbox, Grid, Animations)
- JavaScript (ES6+)
- Font Awesome Icons

## 🚀 Ishga tushirish

1. Repozitoriyani yuklab oling yoki klonlang
2. `index.html` faylini brauzerda oching
3. Yoki live server yordamida ishga tushiring:
   ```bash
   # VS Code Live Server extension bilan
   # Yoki oddiy HTTP server:
   python -m http.server 8000
   ```

## 📝 O'zgartirish

### Shaxsiy ma'lumotlarni o'zgartirish:

1. `index.html` faylini oching
2. Quyidagi bo'limlarni o'zingizga moslang:
   - Ism va familiya
   - Professional unvon
   - Men haqimda matni
   - Kontakt ma'lumotlari
   - Ijtimoiy tarmoq havolalari

### Ko'nikmalarni qo'shish:

`index.html` faylida Skills bo'limiga yangi skill card qo'shing:

```html
<div class="skill-card">
    <div class="skill-icon">
        <i class="fab fa-icon-name"></i>
    </div>
    <h3>Skill nomi</h3>
    <div class="skill-bar">
        <div class="skill-progress" data-progress="85"></div>
    </div>
    <span class="skill-percent">85%</span>
</div>
```

### Loyihalar qo'shish:

Projects bo'limiga yangi loyiha kartasi qo'shing:

```html
<div class="project-card">
    <div class="project-image">
        <i class="fas fa-icon"></i>
    </div>
    <div class="project-content">
        <h3>Loyiha nomi</h3>
        <p>Loyiha tavsifi</p>
        <div class="project-tags">
            <span class="tag">Tech 1</span>
            <span class="tag">Tech 2</span>
        </div>
        <div class="project-links">
            <a href="#" class="project-link"><i class="fab fa-github"></i> Code</a>
            <a href="#" class="project-link"><i class="fas fa-external-link-alt"></i> Demo</a>
        </div>
    </div>
</div>
```

### Ranglarni o'zgartirish:

`css/style.css` faylida `:root` bo'limidagi CSS o'zgaruvchilarni tahrirlang:

```css
:root {
    --primary-color: #6366f1;  /* Asosiy rang */
    --secondary-color: #8b5cf6; /* Ikkinchi darajali rang */
    --dark-color: #0f172a;      /* Qora rang */
    /* ... */
}
```

## 📱 Responsive Breakpoints

- Desktop: 1200px+
- Tablet: 768px - 1199px
- Mobile: < 768px

## 🎨 Dizayn Xususiyatlari

- **Ranglar**: Indigo/Purple gradient palitra
- **Font**: Segoe UI (system font)
- **Icons**: Font Awesome 6.4.0
- **Animatsiyalar**: CSS keyframes + JavaScript

## 📄 Fayl Tuzilishi

```
portfolio/
│
├── index.html          # Asosiy HTML fayl
├── css/
│   └── style.css      # Barcha stillar
├── js/
│   └── script.js      # JavaScript funksiyalar
└── README.md          # Bu fayl
```

## 🌟 Keyingi Rivojlanishlar

- [ ] Blog bo'limi qo'shish
- [ ] Dark mode qo'shish
- [ ] Multi-language support
- [ ] Backend bilan integratsiya
- [ ] Portfolio admin panel

## 📞 Bog'lanish

- Email: info@portfolio.uz
- Telegram: @username
- GitHub: github.com/username

## 📜 Litsenziya

MIT License - O'zingizning loyihalaringizda erkin foydalaning!

---

⭐ Agar bu loyiha yoqsa, Github'da star bering!

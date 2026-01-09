# 🚀 QUICK START - ELEV8 E-Commerce

## ⚡ Fastest Way to Get Started (30 seconds)

### **Step 1:** Download all files
Make sure you have this structure:
```
📁 elev8-ecommerce/
  ├── 📄 index.html
  ├── 📄 product.html  
  ├── 📄 test.html (test page)
  ├── 📁 css/
  │   └── 📄 style.css
  ├── 📁 js/
  │   ├── 📄 app.js
  │   └── 📄 products.js
  └── 📁 data/
      └── 📄 products.json
```

### **Step 2:** Start a local server

**Windows (Python):**
```bash
# Open Command Prompt in the project folder
python -m http.server 8000
```

**Mac/Linux (Python):**
```bash
# Open Terminal in the project folder
python3 -m http.server 8000
```

**Node.js (any OS):**
```bash
npx http-server -p 8000
```

### **Step 3:** Open in browser
Go to: **http://localhost:8000**

---

## ❌ Common Mistake

**DON'T** double-click `index.html` to open it!

**Why?** Browsers block CSS/JS files when opening HTML directly (security feature).

**ALWAYS** use a local server (see Step 2 above).

---

## ✅ Verify It's Working

When the site loads correctly, you should see:

1. ✨ **Beautiful hero section** with "Elevate Your Everyday"
2. 🎨 **Elegant fonts** (not default browser fonts)
3. 🛍️ **Product cards** in a grid layout
4. 🌓 **Dark mode toggle** (top-right corner)
5. 🔍 **Search bar** in header
6. 💫 **Smooth animations** when hovering products

If you DON'T see these → CSS isn't loading → Use a server!

---

## 🧪 Test First

Open **test.html** in your browser to check if everything is set up correctly:
```
http://localhost:8000/test.html
```

This page will tell you if CSS is loading properly.

---

## 🎯 Features to Try

1. **Search** - Type "leather" in search bar
2. **Filter** - Select a category from dropdown
3. **Sort** - Sort by price (low to high)
4. **Dark Mode** - Click moon icon (top right)
5. **Product Details** - Click any product card
6. **Buy Now** - Click button (opens example.com)
7. **Related Products** - Scroll down on product page

---

## 🌐 Deploy to Internet (Free)

### **Option 1: Netlify** (Easiest)
1. Go to https://app.netlify.com/drop
2. Drag folder into browser
3. Get instant URL! 🎉

### **Option 2: GitHub Pages**
```bash
git init
git add .
git commit -m "Initial commit"
# Create repo on GitHub, then:
git remote add origin YOUR-REPO-URL
git push -u origin main
# Enable Pages in repo settings
```

### **Option 3: Vercel**
```bash
npm i -g vercel
vercel
```

---

## 🆘 Still Having Issues?

### Problem: CSS not loading
**Solution:** Use local server (Step 2 above)

### Problem: Images not showing
**Solution:** Check internet connection (images from Unsplash)

### Problem: Products not loading
**Solution:** Make sure `data/products.json` exists

### Problem: Blank page
**Solution:** 
1. Open browser console (F12)
2. Look for error messages
3. Make sure you're using a server

---

## 📝 Customize Products

Edit `data/products.json`:

```json
{
  "id": "prod-013",
  "name": "Your Product Name",
  "description": "Product description here",
  "price": 99.99,
  "category": "Your Category",
  "image": "https://your-image-url.com/image.jpg",
  "externalBuyUrl": "https://your-buy-link.com",
  "badge": "New"
}
```

Refresh page to see changes!

---

## 💡 Pro Tips

- Use **VS Code** with **Live Server extension** for auto-refresh
- Test on **mobile devices** for responsive design
- Add **Google Analytics** for tracking (if deploying)
- Optimize **images** before adding (recommended: 800x800px)

---

## 📚 Learn More

- Full documentation: `README.md`
- Detailed setup guide: `SETUP-GUIDE.md`
- Test page: `test.html`

---

**Need help?** Check browser console (F12) for error messages.

**Ready to go?** → `python -m http.server 8000` → Open browser! 🚀

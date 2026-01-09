# 🚀 Setup Guide - ELEV8 E-Commerce Website

## ⚠️ CSS Not Working? Follow These Steps:

### **Issue**: CSS is not loading when opening index.html directly

**Why?** Modern browsers have security restrictions when opening HTML files directly from your computer (file:// protocol). The CSS and JavaScript files may not load properly.

---

## ✅ **SOLUTION 1: Use a Local Server (RECOMMENDED)**

Choose one of these methods:

### Method A: Python (Easiest)
```bash
# Navigate to the project folder
cd path/to/elev8-ecommerce

# Start server (Python 3)
python -m http.server 8000

# OR for Python 2
python -m SimpleHTTPServer 8000
```
Then open: **http://localhost:8000**

### Method B: Node.js
```bash
# Install http-server globally (one time)
npm install -g http-server

# Navigate to project folder
cd path/to/elev8-ecommerce

# Start server
http-server -p 8000
```
Then open: **http://localhost:8000**

### Method C: VS Code Live Server
1. Install "Live Server" extension in VS Code
2. Right-click on `index.html`
3. Select "Open with Live Server"

### Method D: PHP
```bash
cd path/to/elev8-ecommerce
php -S localhost:8000
```
Then open: **http://localhost:8000**

---

## ✅ **SOLUTION 2: Browser Settings (Firefox Only)**

Firefox allows local files to access each other:

1. Open Firefox
2. Type `about:config` in address bar
3. Accept the warning
4. Search for: `security.fileuri.strict_origin_policy`
5. Set it to `false`
6. Now you can open `index.html` directly

**⚠️ Not recommended for security reasons - use local server instead**

---

## ✅ **SOLUTION 3: Deploy to Hosting (Production)**

### GitHub Pages (Free)
```bash
# Initialize git repo
git init
git add .
git commit -m "Initial commit"

# Create repo on GitHub, then:
git remote add origin https://github.com/yourusername/your-repo.git
git push -u origin main

# Enable GitHub Pages in repo Settings → Pages
```
Your site will be live at: `https://yourusername.github.io/your-repo`

### Netlify (Free)
1. Go to https://app.netlify.com/drop
2. Drag and drop the entire project folder
3. Get instant URL like: `https://your-site-name.netlify.app`

### Vercel (Free)
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd path/to/elev8-ecommerce
vercel
```

### AWS S3
1. Create S3 bucket
2. Enable static website hosting
3. Upload all files maintaining folder structure
4. Set public read permissions
5. Access via S3 website URL

---

## 📁 **Verify File Structure**

Make sure your folder structure looks like this:

```
elev8-ecommerce/
├── index.html              ← Main page
├── product.html            ← Product details
├── README.md
├── SETUP-GUIDE.md
├── css/
│   └── style.css          ← Styles (1000+ lines)
├── js/
│   ├── app.js             ← Homepage JS
│   └── products.js        ← Product page JS
└── data/
    └── products.json      ← Product data
```

---

## 🔍 **Quick Test**

### Test 1: Check if CSS file exists
- Navigate to the `css` folder
- Verify `style.css` exists and is not empty (should be ~1000 lines)

### Test 2: Check browser console
1. Open the website
2. Press `F12` (Developer Tools)
3. Go to "Console" tab
4. Look for errors like:
   - ❌ "Failed to load resource: css/style.css"
   - ❌ "Cross-Origin Request Blocked"
   - ❌ "net::ERR_FILE_NOT_FOUND"

If you see these errors → **You need a local server** (Solution 1)

### Test 3: Check Network tab
1. Open Developer Tools (`F12`)
2. Go to "Network" tab
3. Refresh the page
4. Look for `style.css` in the list
5. Check its status:
   - ✅ **200** = Working correctly
   - ❌ **Failed** or **CORS error** = Use local server

---

## 🎯 **Expected Result**

When working correctly, you should see:
- ✅ Beautiful hero section with animated circles
- ✅ Elegant fonts (Cormorant Garamond & Manrope)
- ✅ Product cards in a responsive grid
- ✅ Dark/light mode toggle button (top right)
- ✅ Search bar and filters in header
- ✅ Smooth hover effects on products

---

## 🐛 **Still Not Working?**

### Check these common issues:

1. **File names are case-sensitive**
   - Make sure `css/style.css` not `CSS/Style.css`

2. **No spaces in folder names**
   - ✅ `elev8-ecommerce`
   - ❌ `elev8 ecommerce`

3. **All files downloaded?**
   - Verify you have: index.html, product.html, css/, js/, data/

4. **Try different browser**
   - Test in Chrome, Firefox, or Edge

5. **Clear browser cache**
   - Press `Ctrl+Shift+Del` (Windows) or `Cmd+Shift+Del` (Mac)
   - Clear cache and reload

---

## 📞 **Support Checklist**

If CSS still doesn't work, provide:
1. Screenshot of file structure
2. Screenshot of browser console (F12)
3. How you're opening the file (directly or via server)
4. Browser and version
5. Operating system

---

## 💡 **Pro Tips**

1. **Always use a local server during development**
2. **Use VS Code with Live Server** for automatic reload
3. **Deploy to Netlify** for free hosting with HTTPS
4. **Test in multiple browsers** before going live

---

## 🎓 **Why This Happens**

Modern browsers implement **CORS (Cross-Origin Resource Sharing)** security policies. When you open an HTML file directly (`file:///C:/path/to/index.html`), the browser treats it as a different "origin" from the CSS/JS files, blocking them for security.

**Solution**: Serve files through HTTP (localhost) where everything shares the same origin.

---

**Still having issues? Make sure you're using one of the server methods above!**

Last updated: January 2026

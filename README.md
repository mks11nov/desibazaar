# ELEV8 - Premium E-Commerce Website

A fully static, modern, and elegant e-commerce website built with HTML, CSS, and Vanilla JavaScript. Features a premium design with smooth animations, dark/light mode, and complete product browsing capabilities.

## 🎨 Features

### Design & UX
- **Premium Minimalist Design** - Apple-like aesthetic with refined typography
- **Dark/Light Mode Toggle** - Persistent theme preference
- **Smooth Animations** - Micro-interactions and scroll effects
- **Fully Responsive** - Mobile-first design approach
- **Skeleton Loaders** - Professional loading states

### Functionality
- **Real-time Search** - Instant product filtering
- **Category Filters** - Dynamic category selection
- **Multiple Sort Options** - Price and name sorting
- **Pagination/Load More** - Optimized product display
- **Product Detail Pages** - Dynamic URL-based routing
- **Related Products** - Category-based recommendations
- **External Buy Links** - Redirect to dropshipping URLs
- **Product Badges** - New/Trending indicators

### Performance
- **Lazy Loading Images** - Optimized image loading
- **Lightweight CSS** - No framework dependencies
- **SEO Optimized** - Semantic HTML and meta tags
- **Accessible** - ARIA labels and keyboard navigation
- **Static Hosting Ready** - Works on S3, GitHub Pages, etc.

## 📁 Project Structure

```
elev8-ecommerce/
├── index.html              # Homepage
├── product.html            # Product detail page
├── css/
│   └── style.css          # All styles with CSS variables
├── js/
│   ├── app.js             # Homepage functionality
│   └── products.js        # Product detail page functionality
├── data/
│   └── products.json      # Product database
├── assets/
│   └── images/            # Local product images (optional)
└── README.md              # This file
```

## 🚀 Quick Start

### Option 1: Local Development
1. Clone or download this repository
2. Open `index.html` in your web browser
3. That's it! No build process required.

### Option 2: Local Server (Recommended)
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js http-server
npx http-server -p 8000

# Then open http://localhost:8000 in your browser
```

## 🌐 Deployment

### GitHub Pages
1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch (main) and root folder
4. Your site will be available at `https://yourusername.github.io/repo-name`

### AWS S3 Static Hosting
1. Create S3 bucket
2. Enable static website hosting
3. Upload all files maintaining folder structure
4. Set bucket policy for public read access:
```json
{
  "Version": "2012-10-17",
  "Statement": [{
    "Sid": "PublicReadGetObject",
    "Effect": "Allow",
    "Principal": "*",
    "Action": "s3:GetObject",
    "Resource": "arn:aws:s3:::your-bucket-name/*"
  }]
}
```

### Netlify / Vercel
1. Connect repository or drag & drop folder
2. No build settings needed
3. Deploy instantly

## 🛠️ Customization

### Adding Products
Edit `data/products.json`:
```json
{
  "id": "prod-xxx",
  "name": "Product Name",
  "description": "Product description",
  "price": 99.99,
  "category": "Category Name",
  "image": "https://image-url.com/image.jpg",
  "externalBuyUrl": "https://your-dropshipping-link.com",
  "badge": "New" // Optional: "New" or "Trending"
}
```

### Changing Colors
Edit CSS variables in `css/style.css`:
```css
:root {
  --color-primary: #2A2A2A;
  --color-secondary: #8B7355;
  --color-accent: #C9A882;
  /* Add more customizations */
}
```

### Modifying Typography
Update Google Fonts link in HTML and CSS variables:
```css
:root {
  --font-display: 'Your Display Font', serif;
  --font-body: 'Your Body Font', sans-serif;
}
```

### Changing Products Per Page
Edit in `js/app.js`:
```javascript
const PRODUCTS_PER_PAGE = 8; // Change to desired number
```

## 🎯 How It Works

### Search Functionality
- Searches product name, description, and category
- Real-time filtering with 300ms debounce
- Case-insensitive matching

### Category Filter
- Dynamically populated from products.json
- Combines with search and sort
- Preserves other filter states

### Sort Options
- Price: Low to High
- Price: High to Low
- Name: A to Z
- Default: Original order

### Product Detail Pages
- Uses URL query parameters (`?id=prod-001`)
- Dynamically loads product data
- Shows related products from same category
- Direct external purchase links

### Theme Toggle
- Saves preference to localStorage
- Instant theme switching
- Smooth transitions

## 📱 Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## 🔒 Security Notes

- All external links open with `noopener,noreferrer`
- No authentication or payment processing
- No sensitive data storage
- Safe for static hosting

## 📦 Dependencies

**None!** This project uses:
- Pure HTML5
- Pure CSS3
- Vanilla JavaScript (ES6+)
- Google Fonts (external CDN)
- Unsplash images (sample products)

## 🎨 Design Decisions

### Typography
- **Display Font**: Cormorant Garamond (elegant serif)
- **Body Font**: Manrope (modern sans-serif)
- Avoids generic fonts like Inter, Roboto

### Color Palette
- Sophisticated earth tones
- High contrast for accessibility
- Separate light/dark themes

### Animation Philosophy
- Subtle and purposeful
- Enhances UX without distraction
- Performance-optimized CSS animations

### Layout Strategy
- CSS Grid for product layouts
- Flexbox for components
- Mobile-first responsive design

## 🚧 Limitations

This is a **display-only** e-commerce site:
- ❌ No shopping cart
- ❌ No checkout process
- ❌ No user authentication
- ❌ No backend/database
- ✅ Pure redirect-to-purchase model

## 📝 License

Free to use for personal and commercial projects.

## 🤝 Contributing

Feel free to customize and enhance! Some ideas:
- Add more filter options
- Implement wishlist (localStorage)
- Add product comparison
- Create collection pages
- Add newsletter signup

## 💡 Tips

1. **Images**: Use high-quality images (800x800px minimum)
2. **Performance**: Optimize images before upload
3. **SEO**: Update meta tags for each product
4. **Testing**: Test on multiple devices and browsers
5. **Analytics**: Add Google Analytics if needed

## 🎓 Learning Resources

This project demonstrates:
- Modern CSS (Grid, Flexbox, Custom Properties)
- ES6+ JavaScript (Async/Await, Arrow Functions, Array Methods)
- DOM Manipulation and Event Handling
- Responsive Web Design
- Web Accessibility (ARIA, Semantic HTML)
- Performance Optimization

## 📞 Support

For questions or issues:
1. Check the browser console for errors
2. Verify all file paths are correct
3. Ensure products.json is valid JSON
4. Test with a local server

---

**Built with ❤️ for modern e-commerce**

Last updated: 2026

# Offline Utility Suite 🛠️

A fully offline-capable Progressive Web App (PWA) for PDF and image manipulation.

## Features ✨

- **Merge PDFs** - Combine multiple PDF files into one
- **Reorder PDF Pages** - Drag & drop to reorganize pages
- **Image to PDF** - Convert JPG/PNG images to PDF
- **Image Editor** - Rotate, adjust brightness, contrast, saturation
- **PDF Tools** - Delete pages, rotate specific pages
- **100% Offline** - Works without internet connection after first load
- **Mobile Installable** - Install as a native app on Android/iOS
- **No Data Upload** - All processing happens locally in your browser

## Installation

### Option 1: GitHub Pages (Easiest)
1. Enable GitHub Pages in repository settings
2. Visit: `https://mgfaizan123-png.github.io/offline-utility-suite/`
3. Open in Chrome/Firefox on mobile
4. Click "Install" to add to home screen

### Option 2: Local Server
```bash
# Using Python 3
python -m http.server 8000

# Using Node.js (http-server)
npx http-server
```
Then visit: `http://localhost:8000/`

### Option 3: Deploy to Netlify
1. Push to GitHub
2. Connect to Netlify
3. It will auto-deploy

## How to Use on Android

1. **Open in Chrome**
   - Go to the deployed URL

2. **Install the App**
   - Wait for install prompt or tap 3-dot menu → "Install app"
   - App appears on home screen

3. **Use Offline**
   - App works even when airplane mode is on
   - All features available without internet

## How to Use on iOS

1. Open in Safari
2. Tap Share → "Add to Home Screen"
3. App works like regular web app

## Technology Stack

- **PDF Manipulation**: pdf-lib, pdf.js
- **Image Processing**: HTML5 Canvas
- **Offline Support**: Service Worker, Progressive Web App
- **Frameworks**: Vanilla JavaScript (no dependencies)

## Browser Compatibility

- ✅ Chrome/Edge (Android, Windows, Mac)
- ✅ Firefox (Android, Windows, Mac)
- ✅ Safari (iOS, Mac)
- ✅ Samsung Internet (Android)

## File Structure

```
.
├── index.html          # Main UI
├── app.js             # Application logic
├── service-worker.js  # Offline support
├── manifest.json      # PWA configuration
├── .htaccess          # Server routing
└── README.md          # This file
```

## Development

### Local Development
```bash
# Start local server
python -m http.server 8000

# Visit http://localhost:8000
# Open DevTools to check Service Worker
```

### Build for Production
- Ensure `manifest.json` has correct paths
- Ensure service worker caches all static assets
- Test offline functionality
- Deploy to HTTPS server

## Troubleshooting

### Service Worker Not Registering
- Ensure HTTPS or localhost
- Check browser console for errors
- Clear browser cache and service workers

### PDF Libraries Not Loading
- Check internet connection (required for CDN libraries on first load)
- Check browser console for network errors
- Try disabling browser extensions

### App Not Installing
- Use Chrome or Edge browser
- Ensure HTTPS connection
- Wait a few seconds for install prompt
- Try adding to home screen manually (3-dot menu)

## Performance Tips

- **First Load**: Requires internet to download libraries (~2-3 MB)
- **Subsequent Loads**: Works offline completely
- **Large Files**: PDF merging works with files up to ~500MB
- **Mobile Storage**: App uses ~20-30 MB of device storage

## Privacy & Security

- ✅ No server uploads - all processing is local
- ✅ No tracking or analytics
- ✅ No cookies or user data storage
- ✅ Open source - code is transparent

## License

MIT License - Free to use, modify, and distribute

## Support

For issues or feature requests, please open a GitHub issue.

---

**Made with ❤️ for offline productivity**

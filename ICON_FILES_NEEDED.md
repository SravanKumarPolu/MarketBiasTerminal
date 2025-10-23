# Icon Files Needed for Daily Bias India

## Required Icon Files

To complete the metadata setup, you need to create the following icon files and place them in the `public/` directory:

### **Favicon Files**
- `favicon.ico` - Main favicon (16x16, 32x32, 48x48 pixels)
- `icon-16x16.png` - 16x16 pixel PNG icon
- `icon-32x32.png` - 32x32 pixel PNG icon

### **Apple Touch Icon**
- `apple-touch-icon.png` - 180x180 pixel PNG for iOS devices

### **Safari Pinned Tab**
- `safari-pinned-tab.svg` - SVG icon for Safari pinned tabs

### **Open Graph Image**
- `og-image.jpg` - 1200x630 pixel image for social media sharing

## Icon Creation Tools

### **Online Favicon Generators**
- [Favicon.io](https://favicon.io/) - Free favicon generator
- [RealFaviconGenerator](https://realfavicongenerator.net/) - Comprehensive favicon generator
- [Favicon Generator](https://www.favicon-generator.org/) - Simple favicon generator

### **Design Tools**
- [Canva](https://canva.com/) - For creating og-image.jpg
- [Figma](https://figma.com/) - Professional design tool
- [Adobe Express](https://express.adobe.com/) - Quick design tool

## Icon Specifications

### **Favicon.ico**
- Sizes: 16x16, 32x32, 48x48 pixels
- Format: ICO
- Should be simple and recognizable at small sizes

### **PNG Icons**
- icon-16x16.png: 16x16 pixels
- icon-32x32.png: 32x32 pixels
- apple-touch-icon.png: 180x180 pixels
- Format: PNG with transparency

### **SVG Icon**
- safari-pinned-tab.svg: Vector format
- Should be monochrome (single color)
- Simple design that works at small sizes

### **Open Graph Image**
- og-image.jpg: 1200x630 pixels
- Format: JPG
- Should include your logo and key messaging
- High contrast for social media visibility

## Current Status

The metadata in `layout.tsx` has been updated to:
- Use the correct domain: `https://dailyindianbias.netlify.app/`
- Include proper icon references
- Set up Open Graph images with full URLs
- Add comprehensive favicon support

## Next Steps

1. Create the icon files using the tools above
2. Place them in the `public/` directory
3. Test the favicon in different browsers
4. Verify Open Graph images work on social media
5. Check that all icons display correctly in browser tabs

## Testing

After adding the icon files:
- Test favicon in Chrome, Firefox, Safari, Edge
- Test Open Graph image on Facebook, Twitter, LinkedIn
- Verify Apple touch icon on iOS devices
- Check Safari pinned tab icon

The metadata is now properly configured for the Netlify deployment at https://dailyindianbias.netlify.app/

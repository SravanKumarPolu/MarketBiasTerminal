# 🎯 Market Bias Terminal

> **Trade Smart. Trade Aligned.** - Get clear daily market bias for Indian markets with actionable context.

[![Netlify Status](https://api.netlify.com/api/v1/badges/your-badge-id/deploy-status)](https://app.netlify.com/sites/your-site-name/deploys)
[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-4.0-38B2AC)](https://tailwindcss.com/)

## 🚀 Live Demo

**🌐 [View Live Application](https://dailyindianbias.netlify.app/)**

## 📊 Features

### 🎯 **Core Functionality**
- **Daily Market Bias** - Clear bullish/bearish/neutral signals for NIFTY 50 & BANK NIFTY
- **Key Levels** - Support, resistance, and pivot levels with copy-to-clipboard functionality
- **First 15m Range** - Critical opening range analysis for day trading
- **Sector Heatmap** - Real-time sector performance visualization
- **News Integration** - Market-relevant news with sentiment analysis

### 🔧 **Technical Features**
- **Auto-Update System** - Seamless updates without URL versioning
- **Service Worker** - Intelligent caching and background sync
- **PWA Support** - Install as mobile app
- **Responsive Design** - Optimized for all devices
- **Error Boundaries** - Graceful error handling
- **Performance Optimized** - Fast loading and smooth interactions

### 📈 **Market Analysis**
- **Bias Engine** - Transparent rule-based calculation system
- **Sentiment Analysis** - News headline sentiment scoring
- **Gap Analysis** - Opening gap detection and impact
- **Momentum Indicators** - Technical momentum assessment
- **Range Context** - Previous day high/low positioning

## 🛠️ Tech Stack

- **Framework**: Next.js 15.5.6 with App Router
- **Language**: TypeScript 5.0
- **Styling**: Tailwind CSS 4.0
- **State Management**: Zustand with persistence
- **UI Components**: shadcn/ui + Radix UI
- **Icons**: Lucide React
- **Notifications**: Sonner
- **Deployment**: Netlify with static export

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or pnpm

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SravanKumarPolu/MarketBiasTerminal.git
   cd MarketBiasTerminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages & Features

### 🏠 **Dashboard** (`/`)
- Market bias cards for NIFTY 50 & BANK NIFTY
- Key levels panel with copy functionality
- First 15m range analysis
- Sector heatmap
- Latest market news

### 📊 **Indices** (`/indices`)
- Detailed index analysis
- Historical bias trends
- Performance metrics

### 📰 **News** (`/news`)
- Market-relevant news feed
- Sentiment analysis
- Real-time updates

### 🏢 **Sectors** (`/sectors`)
- Sector performance heatmap
- Individual sector analysis
- Trending sectors

### 📈 **Stocks** (`/stocks`)
- Individual stock analysis
- Stock-specific bias calculations
- Custom stock tracking

### ⚙️ **Settings** (`/settings`)
- Data source configuration
- API key management
- Display preferences
- Cache management

## 🔧 Configuration

### Environment Variables (Optional)
Create a `.env.local` file for custom configuration:

```bash
# API Configuration
NEXT_PUBLIC_API_KEY=your_api_key
NEXT_PUBLIC_API_BASE_URL=your_api_endpoint
NEXT_PUBLIC_USE_LIVE_DATA=true

# Cache Settings
NEXT_PUBLIC_CACHE_TTL=15
NEXT_PUBLIC_NEWS_CACHE_TTL=30
NEXT_PUBLIC_STOCK_CACHE_TTL=5

# Feature Flags
NEXT_PUBLIC_ENABLE_NEWS_FETCH=true
NEXT_PUBLIC_ENABLE_SECTOR_ANALYSIS=true
NEXT_PUBLIC_DEBUG_MODE=false
```

**Note**: The app works with mock data by default, so environment variables are optional.

## 🏗️ Build & Deployment

### Development
```bash
npm run dev          # Start development server
npm run lint         # Run ESLint
```

### Production
```bash
npm run build        # Build for production
npm run start        # Start production server
```

### Static Export (Netlify)
```bash
npm run build        # Creates optimized static files in 'out' directory
```

## 📊 Bias Calculation Engine

The bias engine uses transparent, rule-based calculations:

### **Higher Timeframe Analysis (60 points)**
- Daily trend analysis
- 4H momentum assessment
- Structure analysis (HH/HL vs LH/LL)

### **Range Context (20 points)**
- Above Previous Day High: +10 points
- Below Previous Day Low: -10 points

### **Gap Analysis (20 points)**
- Gap Up > 0.5%: +10 points
- Gap Down > 0.5%: -10 points

### **Momentum (20 points)**
- 1H Close above mid-band: +10 points
- 1H Close below mid-band: -10 points

### **News Sentiment (20 points)**
- Positive sentiment: +10 to +20 points
- Negative sentiment: -10 to -20 points

### **Final Bias Determination**
- **Score > +15**: Bullish
- **Score < -15**: Bearish  
- **Score -15 to +15**: Neutral
- **Confidence**: Absolute value mapped to 0-100%

## 🎨 Design System

### **Color Palette**
- Primary: `#2563eb` (Blue)
- Success: `#10b981` (Green)
- Warning: `#f59e0b` (Amber)
- Error: `#ef4444` (Red)
- Neutral: `#6b7280` (Gray)

### **Typography**
- Font Family: Geist Sans & Geist Mono
- Responsive scaling with Tailwind CSS

### **Components**
- Built with shadcn/ui components
- Radix UI primitives
- Custom market analysis components

## 🔄 Auto-Update System

The application features a sophisticated auto-update system:

- **Service Worker**: Background caching and update detection
- **Periodic Checks**: Automatic update checks every 5 minutes
- **User Notifications**: Toast notifications for available updates
- **Seamless Updates**: No URL versioning required
- **Cache Management**: Intelligent cache invalidation

## 📱 PWA Features

- **Installable**: Add to home screen on mobile devices
- **Offline Support**: Service worker caching
- **App-like Experience**: Full-screen mode
- **Push Notifications**: Update notifications

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/SravanKumarPolu/MarketBiasTerminal/issues)
- **Discussions**: [GitHub Discussions](https://github.com/SravanKumarPolu/MarketBiasTerminal/discussions)
- **Email**: [Your Contact Email]

## 🙏 Acknowledgments

- **Next.js Team** - For the amazing framework
- **Tailwind CSS** - For the utility-first CSS framework
- **shadcn/ui** - For the beautiful component library
- **Indian Stock Market Community** - For inspiration and feedback

---

**⚠️ Disclaimer**: This tool is for educational and informational purposes only. It is not financial advice. Always do your own research and consult with qualified financial advisors before making investment decisions.

**📈 Happy Trading!** 🚀

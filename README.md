# Daily Bias India - Indian Market Daily Bias Web App

**Tagline:** "Trade Smart. Trade Aligned."

A comprehensive web application that provides clear daily market bias (Bullish/Bearish/Neutral) for Indian markets with actionable context including levels, intraday triggers, and invalidation points. Optimized for NIFTY 50 and BANK NIFTY.

## Features

### 🎯 Core Functionality
- **Daily Market Bias**: Clear Bullish/Bearish/Neutral signals for NIFTY 50 and BANK NIFTY
- **Confidence Scoring**: 0-100% confidence levels based on multiple factors
- **Key Levels**: PDH/PDL, weekly highs/lows, central range, round numbers
- **First 15m Range**: Live tracking of opening range for intraday trading
- **News Sentiment**: Rule-based sentiment analysis with bias impact detection
- **Sector Analysis**: Heatmap and bias tags for all major sectors

### 📊 Pages & Sections
- **Dashboard**: Main bias cards, levels, first 15m range, sectors, and news
- **Indices**: Detailed view of NIFTY, BANK NIFTY, and FIN NIFTY
- **Sectors**: Sector performance heatmap with bias analysis
- **Stocks**: User watchlist with NIFTY 50 universe
- **News**: Market news with sentiment analysis and bias impact
- **Settings**: Data source configuration, refresh schedules, trading preferences

### 🔧 Technical Features
- **Data Source Adapters**: Pluggable architecture for Mock and Live data sources
- **Bias Engine**: Transparent rule-based bias calculation
- **Scheduling System**: Automatic refresh at key market times (IST)
- **Caching**: LocalStorage with configurable TTL
- **Responsive Design**: Mobile-first with dark/light theme support

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **State Management**: Zustand with persistence
- **Icons**: Lucide React
- **Notifications**: Sonner

## Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd market-bias-terminal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables (Optional)**
   ```bash
   # Create .env.local file for local development
   touch .env.local
   
   # Edit .env.local with your configuration
   nano .env.local
   ```
   
   **Environment Variables (Optional):**
   - `NEXT_PUBLIC_API_KEY`: Your API key for live data
   - `NEXT_PUBLIC_API_BASE_URL`: Custom API endpoint URL
   - `NEXT_PUBLIC_USE_LIVE_DATA`: Enable live data (true/false)
   - `NEXT_PUBLIC_CACHE_TTL`: Cache TTL in minutes (default: 15)
   
   **Note:** The app works with mock data by default, so environment variables are optional for basic usage.

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Data Sources

The app uses a pluggable data source architecture:

### MockAdapter (Default)
- Generates realistic mock data for demonstration
- No API keys required
- Perfect for development and testing

### LiveAdapter
- Connects to real market data APIs
- Requires API keys (see .env.example)
- Includes fallback to MockAdapter on errors

### Switching Data Sources
1. Go to Settings page
2. Toggle "Use Live Data" switch
3. Configure API keys in environment variables

## Bias Calculation Engine

The bias engine uses transparent rules with the following components:

### 1. Higher Timeframe Analysis (60 points)
- **Daily Trend**: Bullish/Bearish/Neutral based on price structure
- **4H Trend**: Short-term momentum analysis
- **Structure Analysis**: HH/HL vs LH/LL patterns

### 2. Range Context (20 points)
- **Above PDH**: +10 points
- **Below PDL**: -10 points

### 3. Gap Analysis (20 points)
- **Gap Up > 0.5%**: +10 points
- **Gap Down > 0.5%**: -10 points

### 4. Momentum (20 points)
- **1H Close above mid-band**: +10 points
- **1H Close below mid-band**: -10 points

### 5. News Sentiment (20 points, capped)
- **Positive sentiment**: +10 to +20 points
- **Negative sentiment**: -10 to -20 points
- **Bias impact boost**: Additional relevance for market-specific news

### Final Bias Determination
- **Score > +15**: Bullish
- **Score < -15**: Bearish
- **Score -15 to +15**: Neutral
- **Confidence**: Absolute value of score mapped to 0-100%

## Sentiment Analysis

Rule-based classifier analyzing news headlines:

### Positive Keywords
upgrade, beats, profit rises, approval, expansion, record, strong demand, growth, surge, rally, gains, increase, improve, strong, robust, outperform, exceed, success, breakthrough, milestone, boost, recovery, rebound, momentum, soar, jump, leap

### Negative Keywords
downgrade, misses, loss, probe, penalty, default, outage, resignation, fraud, decline, fall, drop, decrease, worse, weak, negative, pessimistic, bearish, crash, plunge, tumble, slump, downturn, recession, crisis, concern, worried, fear, uncertain, risk, threat, challenge, problem, issue, struggle, pressure, underperform, disappoint, failure

### Bias Impact Detection
News items mentioning NIFTY, BANK NIFTY, or specific sectors receive higher relevance scores.

## Scheduling System

Automatic data refresh at key market times (all times in IST):

- **09:00 AM**: Pre-market refresh
- **09:30 AM**: Post-open refresh (after first 15m)
- **12:00 PM**: Mid-day refresh
- **15:35 PM**: Post-close refresh

## Configuration

### Environment Variables (.env.local)
```env
# Optional: API keys for live data sources
NSE_API_KEY=your_api_key_here
RSS_API_KEY=your_rss_api_key_here

# Optional: Custom data source endpoints
CUSTOM_API_BASE_URL=https://your-api.com
```

### Settings Page Options
- **Data Source**: Toggle between Mock and Live data
- **Refresh Schedule**: Customize refresh times
- **Risk Management**: Set risk per trade percentage
- **Default Instrument**: Choose NIFTY or BANK NIFTY as default
- **Advanced Levels**: Show/hide additional technical indicators
- **Theme**: Light/Dark/System preference
- **Cache TTL**: Data caching duration (5-60 minutes)

## Market Hours & Holidays

### Trading Hours (IST)
- **Pre-Open**: 09:00 - 09:15 AM
- **Normal Market**: 09:15 AM - 03:30 PM
- **Post-Close**: 03:40 - 04:00 PM

### Holidays
The app includes NSE trading holidays for 2024-2025 and automatically handles:
- Weekend closures
- Public holidays
- Market status detection

## Performance Optimization

- **Lazy Loading**: Components loaded on demand
- **Caching**: Aggressive caching with configurable TTL
- **Debouncing**: API calls debounced to prevent rate limiting
- **Responsive Images**: Optimized for different screen sizes
- **Code Splitting**: Automatic code splitting by Next.js

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## Development

### Project Structure
```
src/
├── app/                    # Next.js app router pages
├── components/            # Reusable UI components
├── adapters/             # Data source adapters
├── store/                # Zustand state management
├── utils/                # Utility functions
└── types/                # TypeScript type definitions
```

### Key Components
- `BiasCard`: Main bias display component
- `LevelsPanel`: Key levels with copy functionality
- `First15mBox`: Opening range tracker
- `SectorHeatmap`: Sector performance visualization
- `NewsList`: News with sentiment analysis

### Adding New Data Sources
1. Implement the `MarketDataSource` interface
2. Add to the adapter factory
3. Update settings UI
4. Test with mock data first

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## Disclaimer

This tool is for educational purposes only and should not be considered as investment advice. Please consult with a qualified financial advisor before making any trading decisions. Past performance is not indicative of future results.

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the documentation
2. Search existing issues
3. Create a new issue with detailed information

---

**Built with ❤️ for the Indian trading community**
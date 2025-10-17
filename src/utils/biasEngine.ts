import { MarketBias, HTFContext, KeyLevels, Candles, NewsItem, BiasType } from '@/types/market';
import { sentimentAnalyzer } from './sentimentAnalyzer';

export class BiasEngine {
  private sentimentAnalyzer = sentimentAnalyzer;

  async calculateBias(
    index: 'NIFTY' | 'BANKNIFTY',
    dailyCandles: Candles[],
    fourHourCandles: Candles[],
    oneHourCandles: Candles[],
    previousDayData: { high: number; low: number; close: number; open: number },
    newsItems: NewsItem[],
    currentPrice?: number
  ): Promise<MarketBias> {
    let totalScore = 0;
    const rationale: string[] = [];

    // 1. HTF Scan (Daily & 4H) - Weight: 60 points total
    const htfContext = this.analyzeHTFContext(dailyCandles, fourHourCandles);
    const htfScore = this.calculateHTFScore(htfContext);
    totalScore += htfScore;
    rationale.push(`HTF Analysis: Daily ${htfContext.dailyTrend}, 4H ${htfContext.fourHourTrend} (${htfScore > 0 ? '+' : ''}${htfScore})`);

    // 2. Range Context - Weight: 20 points
    const rangeScore = this.calculateRangeScore(previousDayData, currentPrice || previousDayData.close);
    totalScore += rangeScore;
    if (rangeScore !== 0) {
      rationale.push(`Range Context: ${rangeScore > 0 ? 'Above PDH' : 'Below PDL'} (${rangeScore > 0 ? '+' : ''}${rangeScore})`);
    }

    // 3. Gap Analysis - Weight: 20 points
    const gapScore = this.calculateGapScore(previousDayData);
    totalScore += gapScore;
    if (gapScore !== 0) {
      rationale.push(`Gap: ${previousDayData.open > previousDayData.close ? 'Up' : 'Down'} ${Math.abs(gapScore)}% (${gapScore > 0 ? '+' : ''}${gapScore})`);
    }

    // 4. Momentum (1H) - Weight: 20 points
    const momentumScore = this.calculateMomentumScore(oneHourCandles);
    totalScore += momentumScore;
    if (momentumScore !== 0) {
      rationale.push(`Momentum: 1H ${momentumScore > 0 ? 'Bullish' : 'Bearish'} (${momentumScore > 0 ? '+' : ''}${momentumScore})`);
    }

    // 5. News Sentiment - Weight: 20 points (capped)
    const newsScore = this.calculateNewsSentiment(newsItems);
    totalScore += newsScore;
    if (newsScore !== 0) {
      rationale.push(`News Sentiment: ${newsScore > 0 ? 'Positive' : 'Negative'} (${newsScore > 0 ? '+' : ''}${newsScore})`);
    }

    // Cap total score between -100 and +100
    totalScore = Math.max(-100, Math.min(100, totalScore));

    // Determine bias
    let bias: BiasType;
    if (totalScore > 15) {
      bias = 'Bullish';
    } else if (totalScore < -15) {
      bias = 'Bearish';
    } else {
      bias = 'Neutral';
    }

    // Calculate confidence (0-100)
    const confidence = Math.abs(totalScore);

    // Generate invalidation level and triggers
    const invalidationLevel = this.calculateInvalidationLevel(previousDayData, bias);
    const primaryTrigger = this.generatePrimaryTrigger(bias, previousDayData);

    return {
      index,
      bias,
      confidence,
      score: totalScore,
      lastUpdated: new Date().toISOString(),
      rationale,
      invalidationLevel,
      primaryTrigger,
    };
  }

  private analyzeHTFContext(dailyCandles: Candles[], fourHourCandles: Candles[]): HTFContext {
    // Analyze daily trend
    const dailyTrend = this.analyzeTrend(dailyCandles.slice(-10)); // Last 10 days
    
    // Analyze 4H trend
    const fourHourTrend = this.analyzeTrend(fourHourCandles.slice(-20)); // Last 20 4H candles

    // Determine structure (simplified)
    const structure = this.determineStructure(dailyCandles.slice(-20));

    return {
      dailyTrend,
      fourHourTrend,
      structure,
    };
  }

  private analyzeTrend(candles: Candles[]): BiasType {
    if (candles.length < 3) return 'Neutral';

    // Simple trend analysis: check for HH/HL or LH/LL

    // Check for higher highs and higher lows (bullish structure)
    let higherHighs = 0;
    let higherLows = 0;
    let lowerHighs = 0;
    let lowerLows = 0;

    for (let i = 1; i < candles.length; i++) {
      const current = candles[i];
      const previous = candles[i - 1];

      if (current.high > previous.high) higherHighs++;
      if (current.low > previous.low) higherLows++;
      if (current.high < previous.high) lowerHighs++;
      if (current.low < previous.low) lowerLows++;
    }

    // Determine trend based on structure
    if (higherHighs > lowerHighs && higherLows > lowerLows) {
      return 'Bullish';
    } else if (lowerHighs > higherHighs && lowerLows > higherLows) {
      return 'Bearish';
    }

    return 'Neutral';
  }

  private determineStructure(candles: Candles[]): 'HH_HL' | 'LH_LL' | 'Neutral' {
    if (candles.length < 4) return 'Neutral';

    // Find significant highs and lows
    const highs = candles.map(c => c.high);
    const lows = candles.map(c => c.low);

    const recentHigh = Math.max(...highs.slice(-3));
    const previousHigh = Math.max(...highs.slice(-6, -3));
    const recentLow = Math.min(...lows.slice(-3));
    const previousLow = Math.min(...lows.slice(-6, -3));

    if (recentHigh > previousHigh && recentLow > previousLow) {
      return 'HH_HL';
    } else if (recentHigh < previousHigh && recentLow < previousLow) {
      return 'LH_LL';
    }

    return 'Neutral';
  }

  private calculateHTFScore(htfContext: HTFContext): number {
    let score = 0;

    // Daily trend weight (2x 4H)
    if (htfContext.dailyTrend === 'Bullish') score += 30;
    else if (htfContext.dailyTrend === 'Bearish') score -= 30;

    // 4H trend weight
    if (htfContext.fourHourTrend === 'Bullish') score += 15;
    else if (htfContext.fourHourTrend === 'Bearish') score -= 15;

    // Structure bonus
    if (htfContext.structure === 'HH_HL') score += 10;
    else if (htfContext.structure === 'LH_LL') score -= 10;

    return score;
  }

  private calculateRangeScore(previousDayData: { high: number; low: number; close: number }, currentPrice: number): number {
    // Check if price is above PDH or below PDL
    if (currentPrice > previousDayData.high) return 10;
    if (currentPrice < previousDayData.low) return -10;
    return 0;
  }

  private calculateGapScore(previousDayData: { high: number; low: number; close: number; open: number }): number {
    const gapPercentage = ((previousDayData.open - previousDayData.close) / previousDayData.close) * 100;
    
    if (gapPercentage > 0.5) return 10; // Gap up > 0.5%
    if (gapPercentage < -0.5) return -10; // Gap down > 0.5%
    return 0;
  }

  private calculateMomentumScore(oneHourCandles: Candles[]): number {
    if (oneHourCandles.length < 5) return 0;

    // Simple momentum: compare recent closes to mid-band
    const recentCandles = oneHourCandles.slice(-5);
    const highs = recentCandles.map(c => c.high);
    const lows = recentCandles.map(c => c.low);
    const midBand = (Math.max(...highs) + Math.min(...lows)) / 2;
    
    const lastClose = recentCandles[recentCandles.length - 1].close;
    
    if (lastClose > midBand) return 10;
    if (lastClose < midBand) return -10;
    return 0;
  }

  private calculateNewsSentiment(newsItems: NewsItem[]): number {
    if (newsItems.length === 0) return 0;

    // Filter news from last 12-24 hours
    const now = new Date();
    const recentNews = newsItems.filter(news => {
      const newsDate = new Date(news.pubDate);
      const hoursDiff = (now.getTime() - newsDate.getTime()) / (1000 * 60 * 60);
      return hoursDiff <= 24;
    });

    if (recentNews.length === 0) return 0;

    let totalScore = 0;
    let relevantNewsCount = 0;

    recentNews.forEach(news => {
      const sentiment = this.sentimentAnalyzer.analyzeSentiment(news.title);
      const hasBiasImpact = this.sentimentAnalyzer.hasBiasImpact(news.title);
      
      if (hasBiasImpact) {
        if (sentiment === 'Positive') totalScore += 3;
        else if (sentiment === 'Negative') totalScore -= 3;
        relevantNewsCount++;
      }
    });

    if (relevantNewsCount === 0) return 0;

    // Cap at ±20 points
    return Math.max(-20, Math.min(20, totalScore));
  }

  private calculateInvalidationLevel(
    previousDayData: { high: number; low: number; close: number },
    bias: BiasType
  ): number {
    if (bias === 'Bullish') {
      // For bullish bias, invalidation is below PDL
      return previousDayData.low;
    } else if (bias === 'Bearish') {
      // For bearish bias, invalidation is above PDH
      return previousDayData.high;
    }
    
    // For neutral bias, use mid-range
    return (previousDayData.high + previousDayData.low) / 2;
  }

  private generatePrimaryTrigger(
    bias: BiasType,
    previousDayData: { high: number; low: number; close: number }
  ): string {
    if (bias === 'Bullish') {
      return `Break above ${previousDayData.high} (PDH) with retest for long entry`;
    } else if (bias === 'Bearish') {
      return `Break below ${previousDayData.low} (PDL) with retest for short entry`;
    }
    
    return 'Wait for clear directional breakout above PDH or below PDL';
  }

  // Calculate key levels
  calculateKeyLevels(previousDayData: { high: number; low: number; close: number }): KeyLevels {
    const pdh = previousDayData.high;
    const pdl = previousDayData.low;
    const mid = (pdh + pdl + previousDayData.close) / 3;
    
    // Simple round numbers around current levels
    const currentLevel = previousDayData.close;
    const roundNumbers = [];
    
    for (let i = -5; i <= 5; i++) {
      const level = Math.round(currentLevel / 100) * 100 + (i * 100);
      if (level > 0) roundNumbers.push(level);
    }

    return {
      pdh,
      pdl,
      mid,
      weeklyHigh: pdh * 1.02, // Approximate weekly high
      weeklyLow: pdl * 0.98,  // Approximate weekly low
      roundNumbers: roundNumbers.slice(0, 5), // Limit to 5 levels
    };
  }
}

// Singleton instance
export const biasEngine = new BiasEngine();

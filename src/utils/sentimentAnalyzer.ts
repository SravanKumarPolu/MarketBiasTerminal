import { SentimentType } from '@/types/market';

export class SentimentAnalyzer {
  private positiveKeywords: string[] = [
    'upgrade', 'upgraded', 'beats', 'profit rises', 'approval', 'expansion', 'record', 'strong demand',
    'growth', 'surge', 'rally', 'gains', 'positive', 'optimistic', 'bullish', 'rise', 'rises', 'rising',
    'increase', 'increases', 'increasing', 'improve', 'improves', 'improvement', 'strong', 'robust',
    'outperform', 'outperforms', 'exceed', 'exceeds', 'beat', 'beats', 'success', 'successful',
    'breakthrough', 'milestone', 'achievement', 'boost', 'boosts', 'boosted', 'recovery', 'recover',
    'recovering', 'rebound', 'rebounds', 'momentum', 'breakthrough', 'all-time high', 'new high',
    'soar', 'soars', 'soaring', 'jump', 'jumps', 'jumping', 'leap', 'leaps', 'leaping'
  ];

  private negativeKeywords: string[] = [
    'downgrade', 'downgraded', 'misses', 'loss', 'probe', 'penalty', 'default', 'outage', 'resignation',
    'fraud', 'decline', 'declines', 'declining', 'fall', 'falls', 'falling', 'drop', 'drops', 'dropping',
    'decrease', 'decreases', 'decreasing', 'worse', 'worst', 'weak', 'weakness', 'negative', 'pessimistic',
    'bearish', 'crash', 'crashes', 'crashing', 'plunge', 'plunges', 'plunging', 'tumble', 'tumbles',
    'tumbling', 'slump', 'slumps', 'slumping', 'downturn', 'recession', 'crisis', 'concern', 'concerns',
    'worried', 'worrying', 'fear', 'fears', 'fearful', 'uncertain', 'uncertainty', 'volatile', 'volatility',
    'risk', 'risks', 'risky', 'threat', 'threats', 'challenge', 'challenges', 'problem', 'problems',
    'issue', 'issues', 'struggle', 'struggles', 'struggling', 'pressure', 'pressures', 'underperform',
    'underperforms', 'disappoint', 'disappoints', 'disappointing', 'failure', 'fail', 'fails', 'failing'
  ];

  private sectorKeywords: string[] = [
    'nifty', 'bank nifty', 'banknifty', 'finnifty', 'psu banks', 'private banks', 'banking',
    'it', 'information technology', 'tech', 'technology', 'pharma', 'pharmaceutical', 'auto',
    'automobile', 'fmcg', 'fast moving consumer goods', 'energy', 'oil', 'gas', 'metals',
    'steel', 'aluminum', 'real estate', 'cement', 'telecom', 'telecommunications', 'media',
    'insurance', 'nbfc', 'non-banking financial company', 'infrastructure', 'power'
  ];

  private indexKeywords: string[] = [
    'nifty', 'bank nifty', 'banknifty', 'finnifty', 'nifty 50', 'sensex', 'bse', 'nse'
  ];

  analyzeSentiment(text: string): SentimentType {
    const lowerText = text.toLowerCase();
    let score = 0;

    // Check for positive keywords
    this.positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 2;
      }
    });

    // Check for negative keywords
    this.negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score -= 2;
      }
    });

    // Boost score if it mentions sectors or indices (more relevant to market bias)
    let relevanceBoost = 0;
    [...this.sectorKeywords, ...this.indexKeywords].forEach(keyword => {
      if (lowerText.includes(keyword)) {
        relevanceBoost += 1;
      }
    });

    // Apply relevance boost (max +3)
    if (relevanceBoost > 0) {
      score += Math.min(relevanceBoost, 3);
    }

    // Determine sentiment
    if (score > 2) return 'Positive';
    if (score < -2) return 'Negative';
    return 'Neutral';
  }

  hasBiasImpact(text: string): boolean {
    const lowerText = text.toLowerCase();
    return this.indexKeywords.some(keyword => lowerText.includes(keyword)) ||
           this.sectorKeywords.some(keyword => lowerText.includes(keyword));
  }

  getSentimentScore(text: string): number {
    const lowerText = text.toLowerCase();
    let score = 0;

    this.positiveKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score += 2;
      }
    });

    this.negativeKeywords.forEach(keyword => {
      if (lowerText.includes(keyword)) {
        score -= 2;
      }
    });

    return Math.max(-20, Math.min(20, score)); // Cap at ±20
  }

  // Method to manually correct sentiment (for user feedback)
  correctSentiment(text: string, correctSentiment: SentimentType): void {
    // In a real implementation, this could store corrections for learning
    console.log(`Sentiment correction: "${text}" -> ${correctSentiment}`);
  }
}

// Singleton instance
export const sentimentAnalyzer = new SentimentAnalyzer();

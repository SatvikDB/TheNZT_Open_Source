/**
 * Frontend utility for detecting user response preferences
 * This is a simplified version for immediate feedback before API call
 */

export interface PreferenceResult {
  preference: 'visual' | 'text' | null;
  confidence?: number;
}

export function detectResponsePreference(text: string): PreferenceResult {
  if (!text || typeof text !== 'string') {
    return { preference: null };
  }

  const textLower = text.toLowerCase();

  // Visual keywords
  const visualKeywords = [
    'chart', 'charts', 'graph', 'graphs', 'visual', 'visuals',
    'diagram', 'diagrams', 'plot', 'plots', 'visualization',
    'graphic', 'graphics', 'dashboard', 'map', 'timeline',
    'pie chart', 'bar chart', 'line chart'
  ];

  // Text keywords
  const textKeywords = [
    'text', 'explanation', 'explanations', 'detail', 'details',
    'detailed', 'description', 'analysis', 'report', 'summary',
    'elaborate', 'comprehensive', 'thorough', 'in-depth', 'written'
  ];

  let visualScore = 0;
  let textScore = 0;

  // Count keyword matches
  visualKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = textLower.match(regex);
    if (matches) visualScore += matches.length;
  });

  textKeywords.forEach(keyword => {
    const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
    const matches = textLower.match(regex);
    if (matches) textScore += matches.length;
  });

  // Check for preference phrases
  const visualPhrases = [
    /\b(prefer|like|want|need|show me|give me).{0,20}(chart|graph|visual)/i,
    /\bvisual\w*\s+(person|learner|type)/i,
    /\bvisualize\b/i
  ];

  const textPhrases = [
    /\b(prefer|like|want|need|give me|show me).{0,20}(text|explanation|detail)/i,
    /\btext\w*\s+(person|learner|type)/i,
    /\bexplain.{0,10}(detail|thorough)/i
  ];

  visualPhrases.forEach(phrase => {
    if (phrase.test(textLower)) visualScore += 2;
  });

  textPhrases.forEach(phrase => {
    if (phrase.test(textLower)) textScore += 2;
  });

  // Determine preference
  if (visualScore > textScore) {
    return { preference: 'visual', confidence: Math.min(0.9, 0.3 + visualScore * 0.15) };
  } else if (textScore > visualScore) {
    return { preference: 'text', confidence: Math.min(0.9, 0.3 + textScore * 0.15) };
  } else {
    return { preference: null, confidence: 0 };
  }
}

export function getPreferenceDisplayText(preference: 'visual' | 'text' | null): string {
  switch (preference) {
    case 'visual':
      return 'Visual content (charts, graphs, diagrams)';
    case 'text':
      return 'Text-based content (detailed explanations, reports)';
    default:
      return 'No specific preference detected';
  }
}

export function getPreferenceColor(preference: 'visual' | 'text' | null): string {
  switch (preference) {
    case 'visual':
      return 'bg-blue-500';
    case 'text':
      return 'bg-green-500';
    default:
      return 'bg-gray-400';
  }
}
import { DHR_KNOWLEDGE_BASE, KnowledgeChunk } from '../data/dhrKnowledgeBase';
import { DHR_STATIONS, DHRStation } from '../data/dhrStations';

export interface RAGSearchResult {
  chunk: KnowledgeChunk;
  score: number;
  matchedKeywords: string[];
}

export interface AIResponse {
  answer: string;
  sourceTitle: string;
  category: string;
  relatedStation?: DHRStation;
  followUpQuestions: string[];
  confidence: number;
  executionMode: 'Chrome Prompt API (window.ai)' | 'Offline Vector & BM25 Local RAG' | 'Curated Knowledge Base';
}

// Common English stopwords to ignore in search
const STOPWORDS = new Set([
  'a', 'about', 'above', 'after', 'again', 'against', 'all', 'am', 'an', 'and', 'any', 'are', 'as',
  'at', 'be', 'because', 'been', 'before', 'being', 'below', 'between', 'both', 'but', 'by', 'can',
  'did', 'do', 'does', 'doing', 'down', 'during', 'each', 'few', 'for', 'from', 'further', 'had',
  'has', 'have', 'having', 'he', 'her', 'here', 'hers', 'herself', 'him', 'himself', 'his', 'how',
  'i', 'if', 'in', 'into', 'is', 'it', 'its', 'itself', 'just', 'me', 'more', 'most', 'my', 'myself',
  'no', 'nor', 'not', 'of', 'off', 'on', 'once', 'only', 'or', 'other', 'our', 'ours', 'ourselves',
  'out', 'over', 'own', 's', 'same', 'she', 'should', 'so', 'some', 'such', 't', 'than', 'that',
  'the', 'their', 'theirs', 'them', 'themselves', 'then', 'there', 'these', 'they', 'this', 'those',
  'through', 'to', 'too', 'under', 'until', 'up', 'very', 'was', 'we', 'were', 'what', 'when',
  'where', 'which', 'while', 'who', 'whom', 'why', 'will', 'with', 'would', 'you', 'your', 'yours'
]);

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(token => token.length > 2 && !STOPWORDS.has(token));
}

// Pre-index knowledge base
interface IndexedDoc {
  chunk: KnowledgeChunk;
  termFrequencies: Map<string, number>;
  length: number;
}

const INDEXED_DOCS: IndexedDoc[] = DHR_KNOWLEDGE_BASE.map(chunk => {
  const allText = `${chunk.title} ${chunk.summary} ${chunk.content} ${chunk.keywords.join(' ')} ${chunk.quickQuestions.join(' ')}`;
  const tokens = tokenize(allText);
  const tf = new Map<string, number>();

  for (const token of tokens) {
    tf.set(token, (tf.get(token) || 0) + 1);
  }

  return {
    chunk,
    termFrequencies: tf,
    length: tokens.length
  };
});

// Calculate IDF across indexed documents
const DOC_COUNT = INDEXED_DOCS.length;
const IDF = new Map<string, number>();

for (const doc of INDEXED_DOCS) {
  for (const term of doc.termFrequencies.keys()) {
    IDF.set(term, (IDF.get(term) || 0) + 1);
  }
}

for (const [term, count] of IDF.entries()) {
  IDF.set(term, Math.log(1 + (DOC_COUNT - count + 0.5) / (count + 0.5)));
}

export function searchLocalKnowledge(query: string, currentStationId?: string): RAGSearchResult[] {
  const queryTokens = tokenize(query);
  if (queryTokens.length === 0) {
    return [];
  }

  const results: RAGSearchResult[] = [];

  for (const doc of INDEXED_DOCS) {
    let score = 0;
    const matchedKeywords: string[] = [];

    // BM25-style scoring
    const k1 = 1.2;
    const b = 0.75;
    const avgDocLength = 60;

    for (const token of queryTokens) {
      const tf = doc.termFrequencies.get(token) || 0;
      const idf = IDF.get(token) || 0.5;

      if (tf > 0) {
        const termScore = idf * ((tf * (k1 + 1)) / (tf + k1 * (1 - b + b * (doc.length / avgDocLength))));
        score += termScore;
        matchedKeywords.push(token);
      }
    }

    // Exact phrase match bonus on title or keywords
    const lowerQuery = query.toLowerCase();
    for (const keyword of doc.chunk.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += 3.0;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }

    // Proximity bias: if current station is related, boost relevance
    if (currentStationId && doc.chunk.relatedStations.includes(currentStationId)) {
      score += 2.0;
    }

    if (score > 0) {
      results.push({
        chunk: doc.chunk,
        score,
        matchedKeywords
      });
    }
  }

  results.sort((a, b) => b.score - a.score);
  return results;
}

/**
 * Multi-Tier Offline AI Query Execution
 */
export async function askHillwayAI(query: string, currentStationId?: string): Promise<AIResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      answer: "Please ask a question about the Darjeeling Himalayan Railway, Batasia Loop, B-class steam locomotives, or the journey route!",
      sourceTitle: "DHR Heritage Guide",
      category: "history",
      followUpQuestions: [
        "Why does the train loop at Batasia?",
        "What is a B-class steam locomotive?",
        "Why is the track gauge only 2 feet?"
      ],
      confidence: 1.0,
      executionMode: 'Curated Knowledge Base'
    };
  }

  // Check station specific queries
  const stationMatch = DHR_STATIONS.find(s => 
    query.toLowerCase().includes(s.name.toLowerCase().split(' ')[0].toLowerCase()) ||
    query.toLowerCase().includes(s.id)
  );

  // Search local RAG knowledge base
  const searchResults = searchLocalKnowledge(query, currentStationId);
  const bestMatch = searchResults[0];

  // Try Chrome Built-in Prompt API (window.ai) if available
  // Check if browser has window.ai with languageModel
  const winAI = (window as unknown as { ai?: { languageModel?: { create: () => Promise<{ prompt: (p: string) => Promise<string> }> } } }).ai;
  
  if (winAI && winAI.languageModel) {
    try {
      const session = await winAI.languageModel.create();
      const contextText = bestMatch 
        ? `Context: ${bestMatch.chunk.content}\nSummary: ${bestMatch.chunk.summary}`
        : `Context: Darjeeling Himalayan Railway (DHR) is an 88 km 2-foot narrow gauge UNESCO World Heritage mountain railway in West Bengal, India.`;
      
      const prompt = `You are the offline DHR Heritage Companion guide. Answer the passenger's question concisely based on the context.\n${contextText}\nPassenger Question: ${query}\nConcise Answer:`;
      const aiAnswer = await session.prompt(prompt);

      if (aiAnswer && aiAnswer.trim().length > 10) {
        return {
          answer: aiAnswer.trim(),
          sourceTitle: bestMatch ? bestMatch.chunk.title : "On-Device Chrome AI",
          category: bestMatch ? bestMatch.chunk.category : "engineering",
          relatedStation: stationMatch || (bestMatch ? DHR_STATIONS.find(s => bestMatch.chunk.relatedStations.includes(s.id)) : undefined),
          followUpQuestions: bestMatch ? bestMatch.chunk.quickQuestions : [
            "Why is the track gauge 2 feet?",
            "What is Batasia Loop?",
            "How high is Ghum station?"
          ],
          confidence: 0.95,
          executionMode: 'Chrome Prompt API (window.ai)'
        };
      }
    } catch {
      // Fall through to fast local RAG
    }
  }

  // Tier 2: Instant Local Vector/BM25 RAG
  if (bestMatch && bestMatch.score > 0.8) {
    const chunk = bestMatch.chunk;
    const relatedStation = DHR_STATIONS.find(s => chunk.relatedStations.includes(s.id));

    // Construct high-quality grounded answer
    return {
      answer: `${chunk.summary} ${chunk.content}`,
      sourceTitle: chunk.title,
      category: chunk.category,
      relatedStation,
      followUpQuestions: chunk.quickQuestions,
      confidence: Math.min(1.0, 0.7 + (bestMatch.score / 10)),
      executionMode: 'Offline Vector & BM25 Local RAG'
    };
  }

  // If matched a specific station but not a KB chunk
  if (stationMatch) {
    return {
      answer: `${stationMatch.name} (elevation ${stationMatch.elevationM}m / ${stationMatch.elevationFt}ft) is located at km ${stationMatch.distanceKm} along the DHR route. ${stationMatch.description} ${stationMatch.specialTips}`,
      sourceTitle: `${stationMatch.name} Station Profile`,
      category: 'history',
      relatedStation: stationMatch,
      followUpQuestions: [
        `What is the altitude of ${stationMatch.name}?`,
        `How long does the train stop at ${stationMatch.name}?`,
        "Why does the train have Z-reverses?"
      ],
      confidence: 0.85,
      executionMode: 'Offline Vector & BM25 Local RAG'
    };
  }

  // Tier 3: Curated fallback
  return {
    answer: "The Darjeeling Himalayan Railway (DHR), opened in 1881, is an 88 km long, 2-foot (610 mm) narrow-gauge railway climbing from New Jalpaiguri (100 m) to Ghum (2,258 m) and Darjeeling. It was declared a UNESCO World Heritage site in 1999 for its groundbreaking mountain engineering, including loops, zig-zags, and B-class steam locomotives.",
    sourceTitle: "DHR Heritage Overview",
    category: "unesco",
    followUpQuestions: [
      "Why does the train loop around at Batasia?",
      "What is a B-class steam locomotive?",
      "Why is the track gauge so narrow (2 feet)?"
    ],
    confidence: 0.6,
    executionMode: 'Curated Knowledge Base'
  };
}


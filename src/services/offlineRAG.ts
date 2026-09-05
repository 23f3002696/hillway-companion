import { DHR_KNOWLEDGE_BASE, DHR_DIRECT_QA, KnowledgeChunk, QAPair } from '../data/dhrKnowledgeBase';
import { DHR_STATIONS, DHRStation } from '../data/dhrStations';

export interface RAGSearchResult {
  chunk: KnowledgeChunk;
  score: number;
  matchedKeywords: string[];
}

export interface AIResponse {
  query: string;
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

function cleanString(str: string): string {
  return str.toLowerCase().replace(/[^a-z0-9]/g, '');
}

function areQuestionsEquivalent(q1: string, q2: string): boolean {
  const c1 = cleanString(q1);
  const c2 = cleanString(q2);
  if (c1 === c2) return true;
  if (c1.length > 10 && c2.length > 10) {
    if (c1.includes(c2) || c2.includes(c1)) return true;
    // Check significant token overlap
    const t1 = tokenize(q1);
    const t2 = tokenize(q2);
    if (t1.length > 0 && t2.length > 0) {
      const matchCount = t1.filter(t => t2.includes(t)).length;
      if (matchCount >= Math.min(t1.length, t2.length) * 0.8) return true;
    }
  }
  return false;
}

const GLOBAL_FALLBACK_QUESTIONS = [
  "When did DHR become a UNESCO World Heritage Site?",
  "Why was DHR given UNESCO status?",
  "What other mountain railways in India are UNESCO sites?",
  "Why does the train loop around at Batasia?",
  "What is the memorial inside Batasia Loop?",
  "Which mountain peak is visible from Batasia?",
  "Why is the train moving backwards?",
  "How do the Z-reverses work on the DHR?",
  "What type of steam engine pulls the toy train?",
  "Where are the steam locomotives repaired?",
  "Why does a crew member sit on the front of the engine?",
  "Why is the track gauge so narrow?",
  "Are there any tunnels on the Toy Train route?",
  "Who built the Darjeeling Himalayan Railway?",
  "What is the elevation of Ghum station?",
  "What makes Darjeeling tea so famous?",
  "Does the train really run through a crowded bazaar?",
  "How tall is Mount Kanchenjunga?",
  "What happens to the toy train during the monsoon?"
];

function getCuratedFollowUps(activeQuery: string, preferred: string[] = []): string[] {
  const result: string[] = [];
  
  for (const q of preferred) {
    if (!areQuestionsEquivalent(q, activeQuery) && !result.includes(q)) {
      result.push(q);
    }
  }

  for (const q of GLOBAL_FALLBACK_QUESTIONS) {
    if (result.length >= 3) break;
    if (!areQuestionsEquivalent(q, activeQuery) && !result.includes(q)) {
      result.push(q);
    }
  }

  return result.slice(0, 3);
}

// Pre-index knowledge base chunks for BM25
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

    const lowerQuery = query.toLowerCase();
    for (const keyword of doc.chunk.keywords) {
      if (lowerQuery.includes(keyword.toLowerCase())) {
        score += 3.0;
        if (!matchedKeywords.includes(keyword)) {
          matchedKeywords.push(keyword);
        }
      }
    }

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
 * Match against curated direct QA registry
 */
function findDirectQAMatch(query: string): QAPair | null {
  const cleanQ = cleanString(query);
  const qTokens = tokenize(query);

  // Exact question match
  for (const qa of DHR_DIRECT_QA) {
    if (cleanString(qa.question) === cleanQ) {
      return qa;
    }
  }

  // Alias match
  for (const qa of DHR_DIRECT_QA) {
    if (qa.aliases) {
      for (const alias of qa.aliases) {
        const cleanAlias = cleanString(alias);
        if (cleanQ === cleanAlias || cleanQ.includes(cleanAlias) || cleanAlias.includes(cleanQ)) {
          return qa;
        }
      }
    }
  }

  // Token-level high-similarity match (> 70% token overlap)
  if (qTokens.length >= 2) {
    let bestQA: QAPair | null = null;
    let highestOverlap = 0;

    for (const qa of DHR_DIRECT_QA) {
      const qaTokens = tokenize(qa.question);
      if (qaTokens.length === 0) continue;

      const overlap = qTokens.filter(t => qaTokens.includes(t)).length;
      const score = overlap / Math.max(qTokens.length, qaTokens.length);

      if (score > 0.65 && score > highestOverlap) {
        highestOverlap = score;
        bestQA = qa;
      }
    }

    if (bestQA) {
      return bestQA;
    }
  }

  return null;
}

/**
 * Multi-Tier Offline AI Query Execution
 */
export async function askHillwayAI(query: string, currentStationId?: string): Promise<AIResponse> {
  const trimmed = query.trim();
  if (!trimmed) {
    return {
      query: "General Inquiry",
      answer: "Please ask a question about the Darjeeling Himalayan Railway, Batasia Loop, B-class steam locomotives, or the journey route!",
      sourceTitle: "DHR Heritage Guide",
      category: "history",
      followUpQuestions: [
        "Why does the train loop around at Batasia?",
        "What is a B-class steam locomotive?",
        "Why is the track gauge only 2 feet?"
      ],
      confidence: 1.0,
      executionMode: 'Curated Knowledge Base'
    };
  }

  // Tier 1: Check high-precision Direct QA pairs
  const directQA = findDirectQAMatch(trimmed);
  if (directQA) {
    const relatedStation = directQA.relatedStationId 
      ? DHR_STATIONS.find(s => s.id === directQA.relatedStationId)
      : undefined;

    return {
      query: directQA.question,
      answer: directQA.answer,
      sourceTitle: directQA.sourceTitle,
      category: directQA.category,
      relatedStation,
      followUpQuestions: getCuratedFollowUps(directQA.question, directQA.followUpQuestions),
      confidence: 0.99,
      executionMode: 'Curated Knowledge Base'
    };
  }

  // Check station specific queries (e.g. "Tell me about Tindharia" or "Sukna")
  const stationMatch = DHR_STATIONS.find(s => 
    trimmed.toLowerCase().includes(s.name.toLowerCase().split(' ')[0].toLowerCase()) ||
    trimmed.toLowerCase().includes(s.id)
  );

  // Search local RAG knowledge base
  const searchResults = searchLocalKnowledge(trimmed, currentStationId);
  const bestMatch = searchResults[0];

  // Try Chrome Built-in Prompt API (window.ai) if available
  const winAI = (window as unknown as { ai?: { languageModel?: { create: () => Promise<{ prompt: (p: string) => Promise<string> }> } } }).ai;
  
  if (winAI && winAI.languageModel) {
    try {
      const session = await winAI.languageModel.create();
      const contextText = bestMatch 
        ? `Context: ${bestMatch.chunk.content}\nSummary: ${bestMatch.chunk.summary}`
        : `Context: Darjeeling Himalayan Railway (DHR) is an 88 km 2-foot narrow gauge UNESCO World Heritage mountain railway in West Bengal, India.`;
      
      const prompt = `You are the offline DHR Heritage Companion guide. Answer the passenger's question concisely based on the context.\n${contextText}\nPassenger Question: ${trimmed}\nConcise Answer:`;
      const aiAnswer = await session.prompt(prompt);

      if (aiAnswer && aiAnswer.trim().length > 10) {
        return {
          query: trimmed,
          answer: aiAnswer.trim(),
          sourceTitle: bestMatch ? bestMatch.chunk.title : "On-Device Chrome AI",
          category: bestMatch ? bestMatch.chunk.category : "engineering",
          relatedStation: stationMatch || (bestMatch ? DHR_STATIONS.find(s => bestMatch.chunk.relatedStations.includes(s.id)) : undefined),
          followUpQuestions: getCuratedFollowUps(trimmed, bestMatch ? bestMatch.chunk.quickQuestions : []),
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

    return {
      query: trimmed,
      answer: `${chunk.summary} ${chunk.content}`,
      sourceTitle: chunk.title,
      category: chunk.category,
      relatedStation,
      followUpQuestions: getCuratedFollowUps(trimmed, chunk.quickQuestions),
      confidence: Math.min(1.0, 0.7 + (bestMatch.score / 10)),
      executionMode: 'Offline Vector & BM25 Local RAG'
    };
  }

  // If matched a specific station but not a KB chunk
  if (stationMatch) {
    return {
      query: `About ${stationMatch.name}`,
      answer: `${stationMatch.name} (elevation ${stationMatch.elevationM}m / ${stationMatch.elevationFt}ft) is located at km ${stationMatch.distanceKm} along the DHR route. ${stationMatch.description} ${stationMatch.specialTips}`,
      sourceTitle: `${stationMatch.name} Station Profile`,
      category: 'history',
      relatedStation: stationMatch,
      followUpQuestions: getCuratedFollowUps(stationMatch.name, [
        `What is the altitude of ${stationMatch.name}?`,
        `How long does the train stop at ${stationMatch.name}?`,
        "Why does the train have Z-reverses?"
      ]),
      confidence: 0.85,
      executionMode: 'Offline Vector & BM25 Local RAG'
    };
  }

  // Tier 3: Curated fallback
  return {
    query: trimmed,
    answer: "The Darjeeling Himalayan Railway (DHR), opened in 1881, is an 88 km long, 2-foot (610 mm) narrow-gauge railway climbing from New Jalpaiguri (100 m) to Ghum (2,258 m) and Darjeeling. It was declared a UNESCO World Heritage site in 1999 for its groundbreaking mountain engineering, including loops, zig-zags, and B-class steam locomotives.",
    sourceTitle: "DHR Heritage Overview",
    category: "unesco",
    followUpQuestions: getCuratedFollowUps(trimmed, [
      "Why does the train loop around at Batasia?",
      "What is a B-class steam locomotive?",
      "Why is the track gauge so narrow?"
    ]),
    confidence: 0.6,
    executionMode: 'Curated Knowledge Base'
  };
}

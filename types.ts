export interface KnowledgeItem {
  id: string;
  entity: string;
  standard_value?: string;
  threshold?: number;
  unit?: string;
  condition?: string;
  source: string;
  hard_negative?: string;
  attribute?: string;
  description?: string;
}

export interface ThoughtStep {
  label: string;
  status: 'pending' | 'active' | 'completed';
  detail?: string;
}

export interface Message {
  id: string;
  role: 'user' | 'agent';
  content: string;
  timestamp: Date;
  thoughtChain?: ThoughtStep[];
}

export interface TestCase {
  case_id: number;
  user_query: string;
  intent: string;
  thought_chain: string[];
  response: string;
}

export interface MockDatabase {
  knowledge_base: KnowledgeItem[];
  test_cases: TestCase[];
}
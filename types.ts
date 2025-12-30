export type PageMode = 'agent' | 'kb' | 'audit';
export type PanelViewMode = 'default' | 'graph' | 'doc' | 'dashboard';

export interface KnowledgeItem {
  id: string;
  code: string;
  name: string;
  category: string;
  updated: string;
  status: 'active' | 'deprecated';
}

export interface AuditLog {
  id: string;
  time: string;
  user: string;
  action: string;
  result: 'Pass' | 'Fail' | 'Warning' | 'Info';
  detail: string;
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
  relatedView?: PanelViewMode;
  relatedData?: any;
}

export interface Scenario {
  id: string;
  label: string;
  icon: string;
  userQuery: string;
  panelView: PanelViewMode;
  panelData: any; // Flexible payload
  thoughtChain: ThoughtStep[];
  response: string;
}

export interface MockDatabase {
  scenarios: Scenario[];
  knowledgeBase: KnowledgeItem[];
  auditLogs: AuditLog[];
}
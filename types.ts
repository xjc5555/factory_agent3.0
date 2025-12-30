export type PanelViewMode = 'default' | 'graph' | 'doc' | 'dashboard';

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
  relatedView?: PanelViewMode; // Trigger a specific view when this message is active
  relatedData?: any; // Data payload for the right panel
}

export interface Scenario {
  id: string;
  label: string;
  icon: string;
  userQuery: string;
  panelView: PanelViewMode;
  panelData: any; // Flexible payload for graph/doc/dashboard
  thoughtChain: ThoughtStep[];
  response: string;
}

export interface MockDatabase {
  scenarios: Scenario[];
}
import { MockDatabase, Scenario, KnowledgeItem, AuditLog } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'case_1',
    label: '场景1: 单位冲突',
    icon: 'Ruler',
    userQuery: '我把加热测试时间设为了 60mm，这样设置合规吗？',
    panelView: 'graph',
    panelData: {
      type: 'conflict',
      center: { label: '参数: 持续时间', type: 'entity' },
      nodes: [
        { label: '60秒 (标准)', type: 'correct', val: '60s' },
        { label: '60mm (错误)', type: 'wrong', val: '60mm' }
      ]
    },
    thoughtChain: [
      { label: '实体提取', status: 'completed', detail: '提取参数: 持续时间, 值: 60mm' },
      { label: '知识检索', status: 'completed', detail: '检索标准: Heating_Test_Proc' },
      { label: '单位校验', status: 'completed', detail: '发现冲突: 期望 Time(s), 实际 Length(mm)' }
    ],
    response: "⚠️ **单位维度不匹配**\n\n系统检测到单位错误。**“持续时间”** 的标准单位应为 **秒(s)**，而您输入的是 **毫米(mm)**。\n\n* **标准要求**: 60 ± 5 秒\n* **您输入的**: 60 mm (通常用于距离参数)\n\n请确认您是否混淆了“加热距离”与“加热时间”。"
  },
  {
    id: 'case_2',
    label: '场景2: 振动超标',
    icon: 'Activity',
    userQuery: '当前电机振动测试值为 2.8 m/s²，是否满足 TSP-003 标准？',
    panelView: 'dashboard',
    panelData: {
      type: 'gauge',
      metric: '振动加速度 (Vibration)',
      value: 2.8,
      limit: 2.5,
      unit: 'm/s²',
      status: 'Fail'
    },
    thoughtChain: [
      { label: '标准定位', status: 'completed', detail: '锁定标准: TSP-003 振动规范' },
      { label: '阈值对比', status: 'completed', detail: '2.8 > 2.5 (超限)' },
      { label: '判定生成', status: 'completed', detail: '结果: 不合格 (FAIL)' }
    ],
    response: "❌ **检测不合格 (FAIL)**\n\n根据 **TSP-003** 标准，电机的振动加速度不得超过 **2.5 m/s²**。\n\n* **当前读数**: 2.8 m/s²\n* **限制阈值**: ≤ 2.5 m/s²\n\n该偏差可能导致轴承过早磨损，建议检查动平衡。"
  },
  {
    id: 'case_3',
    label: '场景3: 故障复现',
    icon: 'AlertTriangle',
    userQuery: '在什么条件下可以复现喷嘴阀门的断裂故障？',
    panelView: 'doc',
    panelData: {
      title: '故障分析报告: 喷嘴阀门失效',
      highlight: '复现条件',
      content: [
        "故障ID: FL-2024-089",
        "部件: 高压喷嘴阀门 (V-Nozzle)",
        "现象: 阀体根部疲劳断裂",
        "---",
        "复现条件 (Reproduction):",
        "1. 系统压力波动频率 > 20Hz",
        "2. 介质温度维持在 120℃ 以上",
        "3. 且安装力矩超过 45 N·m (过紧)",
        "---",
        "结论: 高频脉冲与热应力叠加导致的疲劳失效。"
      ]
    },
    thoughtChain: [
      { label: '语义搜索', status: 'completed', detail: '关键词: 喷嘴, 阀门, 断裂, 复现' },
      { label: '历史库匹配', status: 'completed', detail: '匹配度 98%: 报告 FL-2024-089' },
      { label: '关键段落提取', status: 'completed', detail: '提取章节: [复现条件]' }
    ],
    response: "🔍 **已找到历史故障报告**\n\n根据案例库 **FL-2024-089**，复现该断裂故障需要同时满足以下三个条件：\n\n1. **压力波动**: 频率 > 20Hz\n2. **介质温度**: > 120℃\n3. **安装扭矩**: > 45 N·m (过紧)\n\n详细信息请参阅右侧高亮文档。"
  },
  {
    id: 'case_4',
    label: '场景4: 收尘计算',
    icon: 'Calculator',
    userQuery: '测试投入粉尘 200g，残留 8g，请计算收尘率并判断是否合格。',
    panelView: 'dashboard',
    panelData: {
      type: 'progress',
      metric: '收尘效率 (Dust Collection)',
      value: 96.0,
      limit: 95.0,
      unit: '%',
      status: 'Pass',
      formula: '(200 - 8) / 200 * 100%'
    },
    thoughtChain: [
      { label: '参数解析', status: 'completed', detail: 'Input=200g, Residue=8g' },
      { label: '公式计算', status: 'completed', detail: 'Eff = (200-8)/200 = 96%' },
      { label: '合规判断', status: 'completed', detail: '96% >= 95% (Pass)' }
    ],
    response: "✅ **计算合格 (PASS)**\n\n根据 IEC 60312 收尘测试标准：\n\n* **计算公式**: (投入量 - 残留量) / 投入量\n* **计算结果**: (200 - 8) / 200 = **96.0%**\n* **合格线**: ≥ 95.0%\n\n判定：**合格**。"
  },
  {
    id: 'case_5',
    label: '场景5: 风险评估',
    icon: 'FileText',
    userQuery: '如果将密封公差从 IT5 降级为 IT9，会有什么风险？',
    panelView: 'graph',
    panelData: {
      type: 'risk',
      nodes: [
        { id: 'change', label: '变更: IT5 -> IT9', status: 'neutral' },
        { id: 'effect', label: '间隙增大', status: 'warning' },
        { id: 'risk', label: '泄漏风险 (High)', status: 'danger' }
      ]
    },
    thoughtChain: [
      { label: '变更影响分析', status: 'completed', detail: 'IT5 -> IT9: 精度降低' },
      { label: '公差链推演', status: 'completed', detail: '配合间隙最大增加 0.08mm' },
      { label: '风险预测', status: 'completed', detail: '关联失效模式: 介质泄漏' }
    ],
    response: "⚠️ **高风险警告 (High Risk)**\n\n将公差等级从 **IT5** 降级为 **IT9** 会导致配合间隙显著增大。\n\n**风险推演路径：**\n1. **精度降低**: 公差带变宽约 4 倍。\n2. **间隙增大**: 在最差工况下，密封面间隙将超出密封圈的补偿能力。\n3. **最终后果**: 极高概率发生 **介质泄漏 (Leakage)**。\n\n建议维持 IT5 或仅降级至 IT6。"
  }
];

export const MOCK_KB: KnowledgeItem[] = [
  { id: 'KB-001', code: 'TSS-002', name: '防水等级测试规范', category: 'Testing', updated: '2023-10-12', status: 'active' },
  { id: 'KB-002', code: 'TSP-003', name: '电机振动性能评价', category: 'Performance', updated: '2024-01-05', status: 'active' },
  { id: 'KB-003', code: 'IEC-60335', name: '家用电器安全通用要求', category: 'Safety', updated: '2023-05-20', status: 'active' },
  { id: 'KB-004', code: 'GB/T-2423', name: '电工电子环境试验', category: 'Testing', updated: '2022-11-15', status: 'active' },
  { id: 'KB-005', code: 'FMEA-BAT', name: '动力电池失效模式库', category: 'Risk', updated: '2024-02-10', status: 'active' },
  { id: 'KB-006', code: 'STD-HEAT', name: '加热组件测试标准 V2', category: 'Testing', updated: '2023-08-30', status: 'deprecated' },
];

export const MOCK_AUDIT: AuditLog[] = [
  { id: 'LOG-992', time: '10:42:15', user: 'Engineer_Wang', action: 'Compliance Check (TSS-002)', result: 'Fail', detail: 'IPX2 < IPX4' },
  { id: 'LOG-991', time: '10:38:00', user: 'Engineer_Wang', action: 'Query Knowledge (Vibration)', result: 'Info', detail: 'Retrieved TSP-003' },
  { id: 'LOG-990', time: '09:15:22', user: 'Manager_Li', action: 'Risk Assessment (Seal)', result: 'Warning', detail: 'Tolerance Change' },
  { id: 'LOG-989', time: '09:10:05', user: 'Manager_Li', action: 'Calculation (Dust)', result: 'Pass', detail: 'Eff: 96%' },
  { id: 'LOG-988', time: '08:55:10', user: 'System', action: 'Daily Self-Check', result: 'Pass', detail: 'All models online' },
];

export const MOCK_DATABASE: MockDatabase = {
  scenarios: SCENARIOS,
  knowledgeBase: MOCK_KB,
  auditLogs: MOCK_AUDIT
};
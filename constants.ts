import { MockDatabase, Scenario } from './types';

export const SCENARIOS: Scenario[] = [
  {
    id: 'case_1',
    label: '场景1: 单位冲突',
    icon: 'Ruler',
    userQuery: '加热测试的持续时间我设置了 60mm，这个参数合规吗？',
    panelView: 'graph',
    panelData: {
      nodes: [
        { id: '用户输入', label: '60mm', type: 'input' },
        { id: '实体识别', label: '持续时间', type: 'entity' },
        { id: '知识库', label: '60±5秒', type: 'standard' },
        { id: '负样本', label: '60mm (距离)', type: 'negative' }
      ]
    },
    thoughtChain: [
      { label: '意图识别', status: 'completed', detail: '合规性检查 (Check)' },
      { label: '实体提取', status: 'completed', detail: '参数: 持续时间, 值: 60mm' },
      { label: '知识图谱检索', status: 'completed', detail: '命中标准: Heating_Test_V2' },
      { label: '逻辑冲突检测', status: 'completed', detail: '警告: 单位维度不匹配 (Time vs Length)' }
    ],
    response: "⚠️ **检测到单位冲突**\n\n您输入的参数 **60mm** 是长度单位，而 **“持续时间”** 要求的标准单位是 **秒(s)**。\n\n* **标准要求**：60 ± 5 秒\n* **系统判定**：您可能混淆了“加热距离”与“加热时间”。\n\n建议您检查是否误用了距离参数。"
  },
  {
    id: 'case_2',
    label: '场景2: 振动合规',
    icon: 'Activity',
    userQuery: 'TSP-003 标准下，当前电机振动幅值为 2.8 m/s²，是否通过？',
    panelView: 'dashboard',
    panelData: {
      score: 0,
      status: 'Fail',
      metric: '振动加速度',
      value: 2.8,
      limit: 2.5,
      unit: 'm/s²'
    },
    thoughtChain: [
      { label: '标准定位', status: 'completed', detail: 'TSP-003 振动性能评价' },
      { label: '阈值提取', status: 'completed', detail: '最大允许值: 2.5 m/s²' },
      { label: '数值比对', status: 'completed', detail: '2.8 > 2.5 (超标)' },
      { label: '生成报告', status: 'completed', detail: '判定结果: FAIL' }
    ],
    response: "❌ **不合规 (超标)**\n\n根据 **TSP-003** 标准，电机振动加速度不得超过 **2.5 m/s²**。\n\n* **当前值**：2.8 m/s²\n* **阈值**：≤ 2.5 m/s²\n* **偏差**：+0.3 m/s² (12%)\n\n建议检查电机轴承偏心度或底座固定扭矩。"
  },
  {
    id: 'case_3',
    label: '场景3: 故障根因',
    icon: 'AlertTriangle',
    userQuery: '密封圈在 85℃ 高温测试中发生脆性断裂，可能原因是什么？',
    panelView: 'graph',
    panelData: {
      nodes: [
        { id: '现象', label: '脆性断裂', type: 'input' },
        { id: '条件', label: '85℃ 高温', type: 'input' },
        { id: '材料', label: 'NBR 橡胶', type: 'entity' },
        { id: '根因', label: '热氧化老化', type: 'root' }
      ]
    },
    thoughtChain: [
      { label: '故障现象分析', status: 'completed', detail: '脆性断裂 + 高温环境' },
      { label: '材料属性关联', status: 'completed', detail: 'NBR橡胶耐热极限 ≈ 100℃' },
      { label: '历史案例匹配', status: 'completed', detail: '相似度 94%: 热氧化导致硬化' },
      { label: '推荐方案', status: 'completed', detail: '建议更换 FKM (氟橡胶)' }
    ],
    response: "🔍 **故障分析报告**\n\n基于故障特征库分析，**NBR (丁腈橡胶)** 在长期高温环境下容易发生**热氧化老化**，导致材料变硬变脆。\n\n**可能根因：**\n1. 材料耐温等级不足（NBR通常用于 <100℃，但在持续85℃下寿命大幅缩短）。\n2. 缺乏抗氧化剂添加。\n\n**建议：**\n考虑升级材料为 **FKM (氟橡胶)**，其耐温可达 200℃。"
  },
  {
    id: 'case_4',
    label: '场景4: 参数计算',
    icon: 'Calculator',
    userQuery: '根据 IEC 60335，额定功率 2000W 的设备，爬电距离至少需要多少？',
    panelView: 'dashboard',
    panelData: {
      score: 100,
      status: 'Calc',
      metric: '最小爬电距离',
      value: 3.0,
      limit: 3.0,
      unit: 'mm',
      formula: 'Voltage > 250V & Pollution Deg 2'
    },
    thoughtChain: [
      { label: '标准索引', status: 'completed', detail: 'IEC 60335-1:2020 Clause 29' },
      { label: '参数推断', status: 'completed', detail: '2000W -> 假设电压 220-240V' },
      { label: '查表计算', status: 'completed', detail: '污染等级 2, 材料组别 IIIa' },
      { label: '最终结果', status: 'completed', detail: 'Min Creepage = 3.0mm' }
    ],
    response: "✅ **计算结果**\n\n根据 **IEC 60335-1 (第29章)**，对于工作电压在 250V 以下、污染等级为 2 的 II 类器具：\n\n**最小爬电距离 (Creepage Distance) 要求为：3.0 mm**\n\n* **前提假设**：\n  * 工作电压：220V-240V\n  * 材料组别：IIIa (175V ≤ CTI < 400V)\n  * 绝缘类型：基本绝缘"
  },
  {
    id: 'case_5',
    label: '场景5: 风险评估',
    icon: 'FileText',
    userQuery: '查询电池包热失控的 FMEA 风险等级及处理措施。',
    panelView: 'doc',
    panelData: {
      title: 'FMEA-BAT-2024: 动力电池系统',
      highlight: '失效模式: 热失控 (Thermal Runaway)',
      content: [
        "项目: 电池模组 (Module Level)",
        "功能: 能量存储与释放",
        "失效模式: 单体热失控导致扩散",
        "后果 (S): 10 (极高 - 起火/爆炸)",
        "频度 (O): 2 (低)",
        "探测度 (D): 4 (温度传感器监控)",
        "RPN: 80 (高风险)",
        "措施: 增加气凝胶隔热垫; 优化BMS采样频率。"
      ]
    },
    thoughtChain: [
      { label: '文档检索', status: 'completed', detail: '检索词: FMEA, 电池, 热失控' },
      { label: '定位条款', status: 'completed', detail: 'FMEA-BAT-2024 Row #42' },
      { label: '风险提取', status: 'completed', detail: 'RPN=80, 严重度(S)=10' },
      { label: '措施汇总', status: 'completed', detail: '物理隔离 + 软件监控' }
    ],
    response: "⚠️ **高风险项 (RPN: 80)**\n\n在最新的 FMEA 文档中，**电池热失控**被列为最高严重度风险 (S=10)。\n\n**关键信息：**\n* **风险优先级数 (RPN)**：80\n* **现有控制**：NTC 温度传感器监控\n* **推荐改进措施**：\n  1. 模组间增加 **气凝胶隔热垫** 以阻断热扩散。\n  2. BMS 采样频率从 100ms 提升至 **10ms**。\n\n请查看右侧面板的原始文档摘录。"
  }
];

export const MOCK_DATABASE: MockDatabase = {
  scenarios: SCENARIOS
};
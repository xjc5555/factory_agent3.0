import { MockDatabase } from './types';

export const MOCK_DATA: MockDatabase = {
  "knowledge_base": [
    {
      "id": "kb_001",
      "entity": "持续时间",
      "standard_value": "60±5秒",
      "source": "加热测试标准 V2.0",
      "hard_negative": "60±5mm (距离参数)"
    },
    {
      "id": "kb_002",
      "entity": "TSS-002",
      "attribute": "防水等级",
      "standard_value": "IPX4",
      "description": "要求吸尘器外壳设计满足IPX4防护等级。",
      "source": "TSS-002 触及带电部件防护"
    },
    {
      "id": "kb_003",
      "entity": "TSP-003",
      "attribute": "振动加速度",
      "threshold": 2.5,
      "unit": "m/s²",
      "condition": "<=",
      "source": "TSP-003 振动性能评价"
    }
  ],
  "test_cases": [
    {
      "case_id": 1,
      "user_query": "那个加热测试的持续时间参数，我设置成 60mm 可以吗？",
      "intent": "compliance_check",
      "thought_chain": [
        "识别意图：合规性校验",
        "提取实体：持续时间, 用户值=60mm",
        "检索知识库：发现标准值为 60±5秒",
        "逻辑冲突检测：单位不匹配 (mm vs 秒)",
        "触发论文亮点：成功过滤负样本 60±5mm"
      ],
      "response": "⚠️ **单位配置错误**\n您提到的参数有误。**“持续时间”** 的标准单位是 **秒(s)**，而不是毫米(mm)。\n\n* **标准要求**：60±5 **秒**\n* **您提到的值**：60 **mm** (这通常是距离参数)\n\n请确认您是否想查询“距离”参数？"
    },
    {
      "case_id": 2,
      "user_query": "我现在正在做TSS-002测试，目前的防水方案是IPX2等级，请问这样合规吗？",
      "intent": "compliance_check",
      "thought_chain": [
        "识别意图：合规性校验",
        "提取实体：TSS-002, 防水等级, 当前值=IPX2",
        "检索知识库：标准要求 IPX4",
        "逻辑比对：IPX2 < IPX4",
        "判定：不合规"
      ],
      "response": "❌ **不合规**\n根据 **TSS-002** 标准要求，设备外壳必须至少满足 **IPX4** 防护等级。\n\n* **标准要求**：IPX4 (防溅水)\n* **当前方案**：IPX2 (防倾斜滴水)\n\n建议升级密封设计。"
    }
  ]
};

export const DEMO_QUESTIONS = [
  { label: "Demo 1: 单位混淆 (Time vs Dist)", text: "那个加热测试的持续时间参数，我设置成 60mm 可以吗？" },
  { label: "Demo 2: 合规检查 (IPX2 vs IPX4)", text: "我现在正在做TSS-002测试，目前的防水方案是IPX2等级，请问这样合规吗？" },
  { label: "Demo 3: 通用查询", text: "TSP-003 的振动标准是多少？" }
];
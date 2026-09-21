import { createFileRoute } from "@tanstack/react-router";
import {
  Activity, AlertTriangle, BarChart3, BatteryCharging, BellRing, Boxes,
  ChevronRight, CircleGauge, Clock3, Filter,
  LayoutDashboard, Leaf, RadioTower, Search, ShieldCheck, Wrench,
  Zap,
} from "lucide-react";
import { useEffect, useMemo, useState, type ReactNode } from "react";
import type { EChartsOption } from "echarts";
import { EnergyChart } from "@/components/EnergyChart";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "智慧能源数字化综合管控平台" },
      { name: "description", content: "园区能源实时监控、能耗分析、碳排双控与设备运维综合管理平台。" },
      { property: "og:title", content: "智慧能源数字化综合管控平台" },
      { property: "og:description", content: "面向园区的智慧能源数字化综合管控平台。" },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: EnergyPlatform,
});

const colors = { green: "#43f6a0", cyan: "#1ed8f5", blue: "#3a8dff", amber: "#ffb548", red: "#ff5e78", text: "#91a5bd", grid: "rgba(115,156,190,.12)" };
const axis = { axisLine: { lineStyle: { color: colors.grid } }, axisLabel: { color: colors.text, fontSize: 10 }, splitLine: { lineStyle: { color: colors.grid, type: "dashed" as const } }, axisTick: { show: false } };
const tooltip = { trigger: "axis" as const, backgroundColor: "rgba(6,18,31,.94)", borderColor: "#1ed8f5", textStyle: { color: "#dff7ff" } };
const legend = { top: 8, right: 8, textStyle: { color: colors.text, fontSize: 10 }, itemWidth: 14, itemHeight: 6 };
const hours = ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00", "24:00"];
const days = ["09/15", "09/16", "09/17", "09/18", "09/19", "09/20", "09/21"];

const lineOption = (series: NonNullable<EChartsOption["series"]>, x = hours): EChartsOption => ({
  color: [colors.cyan, colors.green, colors.amber, colors.blue], tooltip, legend,
  grid: { left: 42, right: 18, top: 48, bottom: 28 }, xAxis: { type: "category", data: x, boundaryGap: false, ...axis }, yAxis: { type: "value", ...axis }, series,
});

const menu = [
  { id: "overview", label: "综合态势", icon: LayoutDashboard }, { id: "power", label: "电力监控", icon: Zap },
  { id: "analysis", label: "能耗分析", icon: BarChart3 }, { id: "carbon", label: "碳排双控", icon: Leaf },
  { id: "maintenance", label: "设备运维", icon: Wrench }, { id: "alarm", label: "告警预警", icon: BellRing },
] as const;
type PageId = typeof menu[number]["id"];

function EnergyPlatform() {
  const [page, setPage] = useState<PageId>("overview");
  const [now, setNow] = useState(new Date());
  useEffect(() => { const timer = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(timer); }, []);
  const active = menu.find((item) => item.id === page) ?? menu[0];

  return <main className="energy-shell min-h-screen bg-background text-foreground">
    <header className="fixed inset-x-0 top-0 z-50 border-b border-primary/20 bg-background/75 backdrop-blur-xl">
      <div className="mx-auto grid h-[78px] max-w-[1920px] grid-cols-[1fr_auto_1fr] items-center gap-4 px-5">
        <NavGroup items={menu.slice(0, 3)} page={page} setPage={setPage} />
        <div className="text-center">
          <div className="flex items-center justify-center gap-2"><Zap className="h-5 w-5 text-energy-green" /><h1 className="whitespace-nowrap text-lg font-bold md:text-2xl">智慧能源数字化综合管控平台</h1></div>
          <div className="mt-1 hidden items-center justify-center gap-3 text-[10px] uppercase tracking-[.26em] text-muted-foreground md:flex"><span>SMART ENERGY COMMAND CENTER</span></div>
        </div>
        <NavGroup items={menu.slice(3)} page={page} setPage={setPage} align="right" />
      </div>
      <div className="nav-status flex h-8 items-center justify-between px-5 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-4"><span className="flex items-center gap-1.5 text-energy-green"><i className="status-dot bg-energy-green" />系统运行正常</span><span className="hidden sm:inline">园区总接入设备 2,846</span></div>
        <div className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5 text-primary" /><span className="font-mono text-foreground">{now.toLocaleDateString("zh-CN")} {now.toLocaleTimeString("zh-CN", { hour12: false })}</span></div>
      </div>
    </header>
    <div className="mx-auto max-w-[1920px] px-4 pb-5 pt-[126px] md:px-5">
      <div className="mb-4 flex items-end justify-between"><div><p className="mb-1 text-[10px] tracking-[.28em] text-primary">ENERGY CONTROL / {active.id.toUpperCase()}</p><h2 className="text-xl font-semibold">{active.label}</h2></div><div className="hidden items-center gap-2 md:flex"><span className="tag">实时数据</span><span className="tag">华东 · 一号园区</span></div></div>
      {page === "overview" && <Overview />}{page === "power" && <Power />}{page === "analysis" && <Analysis />}{page === "carbon" && <CarbonPage />}{page === "maintenance" && <Maintenance />}{page === "alarm" && <Alarm />}
    </div>
  </main>;
}

function NavGroup({ items, page, setPage, align = "left" }: { items: readonly typeof menu[number][]; page: PageId; setPage: (p: PageId) => void; align?: "left" | "right" }) {
  return <nav className={`hidden gap-1 lg:flex ${align === "right" ? "justify-end" : "justify-start"}`}>{items.map((item) => { const Icon = item.icon; return <button key={item.id} title={item.label} onClick={() => setPage(item.id)} className={`nav-button ${page === item.id ? "nav-button-active" : ""}`}><Icon className="h-5 w-5" /><span>{item.label}</span></button>; })}</nav>;
}

function Panel({ title, code, children, className = "", action }: { title: string; code?: string; children: ReactNode; className?: string; action?: ReactNode }) {
  return <section className={`glass-panel ${className}`}><div className="panel-head"><div><span className="panel-code">{code ?? "LIVE"}</span><h3>{title}</h3></div>{action ?? <Activity className="h-4 w-4 text-primary" />}</div>{children}</section>;
}
function Kpi({ label, value, unit, change, tone = "cyan", icon }: { label: string; value: string; unit: string; change: string; tone?: "cyan" | "green" | "amber" | "blue"; icon: ReactNode }) {
  return <div className={`kpi-card tone-${tone}`}><div className="flex items-start justify-between"><div><p className="text-xs text-muted-foreground">{label}</p><div className="mt-2"><strong className="font-mono text-2xl">{value}</strong><span className="ml-1 text-xs text-muted-foreground">{unit}</span></div></div><div className="kpi-icon">{icon}</div></div><div className="mt-3 flex items-center justify-between border-t border-border/60 pt-2 text-[10px]"><span className="text-muted-foreground">较昨日同期</span><span className="text-energy-green">↗ {change}</span></div></div>;
}
const SmoothLine = ({ data, name, color, area = false }: { data: number[]; name: string; color: string; area?: boolean }) => ({ name, type: "line" as const, smooth: true, symbol: "none", data, lineStyle: { width: 2, color }, ...(area ? { areaStyle: { color, opacity: .1 } } : {}) });

function Overview() {
  const load = useMemo(() => lineOption([SmoothLine({ name: "实时负荷", data: [3120, 2860, 3540, 4210, 3980, 3680, 3460], color: colors.cyan, area: true }), SmoothLine({ name: "预测负荷", data: [3200, 2950, 3460, 4080, 4120, 3760, 3540], color: colors.amber })]), []);
  const flow: EChartsOption = { color: [colors.green, colors.cyan, colors.amber, colors.blue], grid: { left: 38, right: 12, top: 28, bottom: 26 }, xAxis: { type: "category", data: ["光伏", "储能", "市电", "燃气"], ...axis }, yAxis: { type: "value", ...axis }, series: [{ type: "bar", data: [2180, 950, 3260, 680], barWidth: 20, itemStyle: { borderRadius: [3,3,0,0], color: (p: { dataIndex: number }) => [colors.green, colors.cyan, colors.blue, colors.amber][p.dataIndex] ?? colors.cyan } }] };
  const radar: EChartsOption = { color: [colors.cyan, colors.amber], legend, radar: { center: ["50%","57%"], radius: "63%", indicator: ["电力","水","燃气","热力","可再生"].map(name => ({ name, max: 100 })), axisName: { color: colors.text }, splitLine: { lineStyle: { color: colors.grid } }, splitArea: { areaStyle: { color: ["transparent","rgba(30,216,245,.03)"] } } }, series: [{ type: "radar", data: [{ name: "今日", value: [82,66,48,71,90], areaStyle: { opacity: .16 } }, { name: "目标", value: [75,72,60,68,82] }] }] };
  return <><div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4"><Kpi label="综合用能功率" value="4,286.7" unit="kW" change="3.6%" tone="cyan" icon={<Zap />} /><Kpi label="今日综合能耗" value="82.46" unit="MWh" change="2.1%" tone="green" icon={<BatteryCharging />} /><Kpi label="可再生能源占比" value="38.6" unit="%" change="5.2%" tone="blue" icon={<Activity />} /><Kpi label="今日碳排放" value="16.82" unit="tCO₂" change="-4.8%" tone="amber" icon={<Leaf />} /></div>
    <div className="mt-3 grid gap-3 xl:grid-cols-12"><Panel title="实时负荷趋势" code="01 / LOAD" className="xl:col-span-6"><EnergyChart option={load} className="h-[270px]" /></Panel><Panel title="多能供给构成" code="02 / FLOW" className="xl:col-span-3"><EnergyChart option={flow} className="h-[270px]" /></Panel><Panel title="综合能耗画像" code="03 / RADAR" className="xl:col-span-3"><EnergyChart option={radar} className="h-[270px]" /></Panel></div>
    <div className="mt-3 grid gap-3 xl:grid-cols-5"><Panel title="关键设备运行状态" code="04 / DEVICE" className="xl:col-span-3"><DeviceGrid /></Panel><Panel title="实时告警动态流" code="05 / ALERT" className="xl:col-span-2"><AlertFeed /></Panel></div></>;
}

function Power() {
  const mix = useMemo(() => lineOption([{ name: "负荷率", type: "bar", data: [52,64,76,81,69,58,61], barWidth: 16, itemStyle: { color: colors.blue, borderRadius: [3,3,0,0] } }, { ...SmoothLine({ name: "温升", data: [28,31,38,45,42,34,30], color: colors.amber }), yAxisIndex: 1 }], days), []);
  mix.yAxis = [{ type: "value", ...axis }, { type: "value", ...axis }];
  const balance = useMemo(() => lineOption([SmoothLine({ name: "A相", data: [220,221,219,222,220,218,221], color: colors.green }), SmoothLine({ name: "B相", data: [219,220,221,221,219,220,220], color: colors.cyan }), SmoothLine({ name: "C相", data: [221,219,220,219,221,222,219], color: colors.amber })]), []);
  return <><div className="grid gap-3 md:grid-cols-3"><Transformer name="1# 主变" load="68.4%" temp="46.2°C" state="稳定" /><Transformer name="2# 主变" load="72.1%" temp="48.8°C" state="稳定" /><Transformer name="3# 备用变" load="12.6%" temp="31.4°C" state="轻载" /></div><div className="mt-3 grid gap-3 xl:grid-cols-2"><Panel title="主变负荷率与温升" code="P01 / TRANSFORMER"><EnergyChart option={mix} className="h-[300px]" /></Panel><Panel title="三相电压平衡趋势" code="P02 / PHASE"><EnergyChart option={balance} className="h-[300px]" /></Panel></div><Panel title="实时遥测数据" code="P03 / TELEMETRY" className="mt-3"><DataTable headers={["回路名称","电压 Ua/Ub/Uc","电流 Ia/Ib/Ic","有功功率","功率因数","频率","状态"]} rows={[["10kV进线01","220.4 / 219.8 / 221.1 V","436 / 428 / 441 A","286.4 kW","0.96","50.02 Hz","正常"],["制冷机房01","219.6 / 220.2 / 219.9 V","186 / 191 / 184 A","118.7 kW","0.94","50.01 Hz","正常"],["生产线A-03","221.0 / 219.4 / 220.3 V","328 / 312 / 335 A","214.2 kW","0.91","49.99 Hz","关注"],["充电站母线","220.1 / 220.5 / 219.7 V","126 / 130 / 122 A","84.6 kW","0.98","50.00 Hz","正常"]]} /></Panel></>;
}

function Analysis() {
  const donut: EChartsOption = { color: [colors.blue, colors.cyan, colors.green, colors.amber, colors.red], tooltip: { trigger: "item" }, legend: { bottom: 0, textStyle: { color: colors.text }, itemWidth: 10 }, series: [{ type: "pie", radius: ["48%","72%"], center: ["50%","43%"], label: { color: "#bcd0e4", formatter: "{d}%" }, data: [{name:"生产动力",value:46},{name:"空调制冷",value:24},{name:"照明",value:12},{name:"办公",value:10},{name:"其他",value:8}] }] };
  const compare = useMemo(() => lineOption([{ name: "本期", type: "bar", data: [72,76,81,78,86,82,84], itemStyle: { color: colors.cyan }, barWidth: 12 }, SmoothLine({ name: "同期", data: [78,80,79,84,88,86,89], color: colors.amber })], days), []);
  return <><div className="grid gap-3 xl:grid-cols-12"><Panel title="分类分项能耗" code="E01 / CATEGORY" className="xl:col-span-4"><EnergyChart option={donut} className="h-[320px]" /></Panel><Panel title="同比环比用能分析" code="E02 / COMPARE" className="xl:col-span-5"><EnergyChart option={compare} className="h-[320px]" /></Panel><Panel title="区域能效排行" code="E03 / RANK" className="xl:col-span-3"><RankList /></Panel></div><Panel title="重点回路能耗明细" code="E04 / CIRCUIT" className="mt-3"><DataTable headers={["排名","重点回路","本日能耗","同比","环比","单位产值能耗","能效等级"]} rows={[["01","生产线A动力","18.62 MWh","-4.2%","+1.8%","0.086 kWh/¥","A级"],["02","中央制冷站","12.38 MWh","-2.1%","-0.8%","0.102 kWh/¥","A级"],["03","生产线B动力","10.84 MWh","+3.6%","+2.4%","0.118 kWh/¥","B级"],["04","空压机组","8.46 MWh","+6.2%","+4.1%","0.136 kWh/¥","待优化"],["05","办公楼照明","3.21 MWh","-8.5%","-2.7%","0.064 kWh/¥","A级"]]} /></Panel></>;
}

function CarbonPage() {
  const gauge: EChartsOption = { series: [{ type: "gauge", startAngle: 210, endAngle: -30, min: 0, max: 100, splitNumber: 5, progress: { show: true, width: 16, itemStyle: { color: colors.green } }, axisLine: { lineStyle: { width: 16, color: [[1,"rgba(112,154,180,.14)"]] } }, axisTick: { show: false }, splitLine: { length: 9, lineStyle: { color: colors.text } }, axisLabel: { color: colors.text, distance: 24 }, pointer: { itemStyle: { color: colors.cyan } }, detail: { valueAnimation: true, formatter: "{value}%\n配额已使用", color: "#e8f8ff", fontSize: 16, offsetCenter: [0,"65%"] }, data: [{ value: 67.4 }] }] };
  const trend = useMemo(() => lineOption([SmoothLine({ name: "实际排放", data: [116,112,108,109,103,99,96], color: colors.cyan, area: true }), SmoothLine({ name: "预测排放", data: [116,113,110,106,102,98,94], color: colors.green }), SmoothLine({ name: "控制目标", data: [115,112,109,106,103,100,97], color: colors.amber })], ["3月","4月","5月","6月","7月","8月","9月"]), []);
  const source: EChartsOption = { color: [colors.blue, colors.amber, colors.green, colors.cyan], legend: { bottom: 0, textStyle: { color: colors.text } }, series: [{ type: "pie", radius: ["35%","68%"], roseType: "radius", center: ["50%","44%"], label: { color: colors.text }, data: [{name:"外购电力",value:58},{name:"天然气",value:23},{name:"交通燃油",value:12},{name:"其他",value:7}] }] };
  return <><div className="grid gap-3 xl:grid-cols-12"><Panel title="年度碳配额消耗进度" code="C01 / QUOTA" className="xl:col-span-3"><EnergyChart option={gauge} className="h-[310px]" /></Panel><Panel title="碳排放趋势与预测" code="C02 / FORECAST" className="xl:col-span-6"><EnergyChart option={trend} className="h-[310px]" /></Panel><Panel title="碳排放源结构" code="C03 / SOURCE" className="xl:col-span-3"><EnergyChart option={source} className="h-[310px]" /></Panel></div><Panel title="减碳行动追踪" code="C04 / ACTION" className="mt-3"><DataTable headers={["行动项目","责任部门","年度减碳目标","已完成","进度","预计完成","状态"]} rows={[["屋顶分布式光伏三期","工程能源部","1,280 tCO₂","886 tCO₂","69%","2026-11-30","进行中"],["空压站群控优化","生产保障部","420 tCO₂","368 tCO₂","88%","2026-10-15","进行中"],["冷站AI节能控制","数字化中心","560 tCO₂","560 tCO₂","100%","2026-08-20","已达成"],["物流车辆电动化","行政运营部","310 tCO₂","126 tCO₂","41%","2026-12-25","有风险"]]} /></Panel></>;
}

function Maintenance() {
  const health: EChartsOption = { color: [colors.green, colors.cyan], legend, radar: { center: ["50%","57%"], radius: "64%", indicator: ["电气性能","机械性能","热状态","绝缘水平","维护合规","运行环境"].map(name => ({ name, max: 100 })), axisName: { color: colors.text }, splitLine: { lineStyle: { color: colors.grid } } }, series: [{ type: "radar", data: [{ name: "设备健康", value: [92,86,82,95,88,90], areaStyle: { opacity: .18 } }] }] };
  return <><div className="grid gap-3 xl:grid-cols-12"><Panel title="全域设备健康度" code="M01 / HEALTH" className="xl:col-span-4"><EnergyChart option={health} className="h-[300px]" /></Panel><Panel title="运行状态总览" code="M02 / STATUS" className="xl:col-span-3"><StatusBoard /></Panel><Panel title="运维工单派发概览" code="M03 / WORKORDER" className="xl:col-span-5"><WorkOrders /></Panel></div><Panel title="设备维保台账" code="M04 / LEDGER" className="mt-3"><DataTable headers={["设备编号","设备名称","位置","上次维保","下次维保","负责人","健康度","运行状态"]} rows={[["TR-10KV-001","1#配电变压器","能源中心A区","2026-08-16","2026-11-16","周海峰","96%","正常"],["CH-0800-003","3#离心冷水机组","制冷机房","2026-07-28","2026-09-28","陈启明","82%","预警"],["AC-0250-012","12#空压机","动力站B区","2026-09-03","2026-10-03","赵行远","89%","正常"],["PV-INV-026","26#光伏逆变器","3号厂房屋顶","2026-06-12","2026-09-12","林宁","--","离线"]]} /></Panel></>;
}

function Alarm() {
  const pie: EChartsOption = { color: [colors.red, colors.amber, colors.blue, colors.cyan], legend: { bottom: 0, textStyle: { color: colors.text } }, series: [{ type: "pie", radius: ["42%","70%"], center: ["50%","43%"], label: { color: colors.text, formatter: "{b} {c}" }, data: [{name:"紧急",value:3},{name:"重要",value:8},{name:"一般",value:16},{name:"提示",value:24}] }] };
  const wave = useMemo(() => lineOption([SmoothLine({ name: "振动值", data: [12,14,13,18,16,38,42,26,19,17,15,14], color: colors.red, area: true }), SmoothLine({ name: "告警阈值", data: [30,30,30,30,30,30,30,30,30,30,30,30], color: colors.amber })], ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00","16:00","17:00","18:00","19:00"]), []);
  const [level, setLevel] = useState("全部等级");
  return <><div className="grid gap-3 xl:grid-cols-12"><Panel title="告警等级分布" code="A01 / LEVEL" className="xl:col-span-3"><EnergyChart option={pie} className="h-[290px]" /></Panel><Panel title="异常时序波动" code="A02 / ANOMALY" className="xl:col-span-6"><EnergyChart option={wave} className="h-[290px]" /></Panel><Panel title="智能诊断分析" code="A03 / AI DIAGNOSIS" className="xl:col-span-3"><Diagnosis /></Panel></div><Panel title="多维告警事件日志" code="A04 / EVENT LOG" className="mt-3" action={<div className="flex gap-2"><div className="relative"><Filter className="absolute left-2 top-2 h-3.5 w-3.5 text-muted-foreground"/><select value={level} onChange={(e) => setLevel(e.target.value)} className="control-select"><option>全部等级</option><option>紧急</option><option>重要</option><option>一般</option></select></div><button className="icon-control" title="搜索"><Search className="h-4 w-4"/></button></div>}><DataTable headers={["发生时间","告警等级","设备/位置","告警内容","持续时间","诊断结果","处理状态"]} rows={[["2026-09-21 09:08:36","紧急","3#冷水机组","轴承振动超高限","6分24秒","疑似轴承松动","处理中"],["2026-09-21 08:42:17","重要","生产线A-03","三相电流不平衡","27分","C相负载偏高","待确认"],["2026-09-21 08:16:09","一般","26#光伏逆变器","通讯中断","52分","网络链路异常","已派单"],["2026-09-21 07:58:45","重要","空压站2#机","排气温度高","18分","冷却效率下降","处理中"]]} /></Panel></>;
}

function Transformer({ name, load, temp, state }: { name: string; load: string; temp: string; state: string }) { return <div className="glass-panel flex items-center gap-4 p-4"><div className="relative flex h-16 w-16 items-center justify-center border border-primary/40 bg-primary/5"><Boxes className="h-8 w-8 text-primary"/><i className="absolute right-1 top-1 status-dot bg-energy-green"/></div><div className="flex-1"><div className="flex justify-between"><strong>{name}</strong><span className="text-xs text-energy-green">{state}</span></div><div className="mt-3 grid grid-cols-2 gap-3 text-xs"><div><span className="text-muted-foreground">负荷率</span><b className="ml-2 font-mono text-primary">{load}</b></div><div><span className="text-muted-foreground">温度</span><b className="ml-2 font-mono text-energy-amber">{temp}</b></div></div></div></div>; }
function DeviceGrid() { return <div className="grid grid-cols-2 gap-2 py-2 md:grid-cols-4">{[["高压配电","286","正常"],["变压器","18","正常"],["制冷机组","26","2台预警"],["光伏逆变器","186","1台离线"],["空压机组","32","正常"],["充电终端","158","正常"],["储能电柜","48","正常"],["智能电表","2,092","3台离线"]].map(([name,count,state],i)=><div className="device-cell" key={name}><div className="flex items-center gap-2"><i className={`status-dot ${i===2?"bg-energy-amber":i===3?"bg-destructive":"bg-energy-green"}`}/><span className="text-xs">{name}</span></div><strong className="mt-3 block font-mono text-xl">{count}</strong><span className="text-[10px] text-muted-foreground">{state}</span></div>)}</div>; }
function AlertFeed() { return <div className="space-y-2 pt-2">{[["09:08:36","紧急","3#冷水机组轴承振动超限"],["08:42:17","重要","A-03回路三相电流不平衡"],["08:16:09","一般","26#光伏逆变器通讯中断"],["07:58:45","重要","2#空压机排气温度偏高"]].map(([time,level,text],i)=><div className="alert-row" key={time}><span className="font-mono text-[10px] text-muted-foreground">{time}</span><span className={`level ${i===0?"level-red":i===2?"level-blue":"level-amber"}`}>{level}</span><span className="min-w-0 flex-1 truncate text-xs">{text}</span><ChevronRight className="h-3.5 w-3.5 text-muted-foreground"/></div>)}</div>; }
function RankList() { return <div className="space-y-4 py-4">{[["动力中心A区",96],["生产制造一区",91],["综合办公区",86],["生产制造二区",82],["仓储物流区",76]].map(([name,score],i)=><div key={String(name)}><div className="mb-1.5 flex justify-between text-xs"><span><b className="mr-2 font-mono text-primary">0{i+1}</b>{name}</span><strong className="font-mono">{score}</strong></div><div className="h-1.5 overflow-hidden bg-muted"><div className="h-full bg-gradient-to-r from-primary to-energy-green" style={{width:`${score}%`}}/></div></div>)}</div>; }
function StatusBoard() { return <div className="grid h-[280px] grid-cols-2 place-content-center gap-3"><StatusItem icon={<ShieldCheck/>} count="2,774" label="正常运行" tone="green"/><StatusItem icon={<AlertTriangle/>} count="42" label="预警关注" tone="amber"/><StatusItem icon={<RadioTower/>} count="18" label="通讯离线" tone="red"/><StatusItem icon={<Wrench/>} count="12" label="停机检修" tone="blue"/></div>; }
function StatusItem({icon,count,label,tone}:{icon:ReactNode;count:string;label:string;tone:string}) { return <div className={`status-card status-${tone}`}><div className="mb-2 flex justify-between">{icon}<i className="status-dot"/></div><strong className="font-mono text-xl">{count}</strong><p className="text-[10px] text-muted-foreground">{label}</p></div>; }
function WorkOrders() { return <div className="space-y-3 py-3"><div className="grid grid-cols-4 gap-2">{[["待派发","9"],["处理中","16"],["待验收","7"],["今日完成","24"]].map(([a,b])=><div className="device-cell text-center" key={a}><strong className="font-mono text-xl text-primary">{b}</strong><p className="text-[10px] text-muted-foreground">{a}</p></div>)}</div>{[["WO-260921-018","3#冷水机组振动排查","王博","进行中"],["WO-260921-017","逆变器通讯恢复","李卓","已接单"],["WO-260921-016","空压机高温检查","陈启明","进行中"]].map(r=><div className="flex items-center gap-3 border-b border-border/50 pb-2 text-xs" key={r[0]}><span className="font-mono text-primary">{r[0]}</span><span className="flex-1">{r[1]}</span><span className="text-muted-foreground">{r[2]}</span><span className="text-energy-green">{r[3]}</span></div>)}</div>; }
function Diagnosis() { return <div className="py-3"><div className="mb-3 flex items-center gap-3 border-b border-border pb-3"><div className="ai-core"><CircleGauge className="h-6 w-6"/></div><div><strong>诊断置信度 92%</strong><p className="text-[10px] text-muted-foreground">ENERGY-AI · 实时分析</p></div></div><p className="text-xs leading-6 text-muted-foreground">检测到 <b className="text-energy-amber">3#冷水机组</b> 轴承频谱在 38Hz 出现异常峰值，结合温升趋势，判断为联轴器松动或轴承早期磨损。</p><div className="mt-3 border-l-2 border-energy-green bg-energy-green/5 p-3 text-xs"><b className="text-energy-green">建议处置</b><p className="mt-1 text-muted-foreground">建议 2 小时内停机检查紧固件，并采集轴承润滑油样。</p></div></div>; }
function DataTable({ headers, rows }: { headers: string[]; rows: string[][] }) { return <div className="overflow-x-auto"><table className="data-table"><thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead><tbody>{rows.map((row,i)=><tr key={i}>{row.map((cell,j)=><td key={`${i}-${j}`} className={j===row.length-1?"last-state":""}>{cell}</td>)}</tr>)}</tbody></table></div>; }

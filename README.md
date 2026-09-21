# Energy Command Center

Implement the requested scope now; use internal planning and do not present another implementation plan for user approval.

### User Request
做一个能源管理平台，6个一级菜单，要求：
1. 能源相关科技风背景，能源相关配色为主色调（深色科技底底色，搭配荧光绿、青蓝、电光蓝、琥珀橙等能源色系），带能源风格科技纹理/粒子/网格背景。
2. 毛玻璃半透明卡片（backdrop-blur），带流光渐变边框和hover浮起/发光效果。
3. 顶部固定导航栏：左侧3个图标菜单 + 大标题居中（如“智慧能源数字化综合管控平台”）+ 右侧3个图标菜单，导航栏带有玻璃质感及科技感分割线、时间与状态展示。
4. 6个一级页面布局各有明显差异，内容丰富充实：
   - 综合态势（能源驾驶舱）：核心KPI指标卡、实时负荷趋势曲线、多能互补流向图/柱状图、能耗雷达图、关键设备运行状态分布、实时告警动态流。
   - 电力监控：配电变压器监测、负荷率柱线混合图、三相电压/电流平衡度、实时遥测数据表格。
   - 能耗分析：分类分项能耗环形图、同比环比用能分析图、区域能效排行、重点回路能耗明细表。
   - 碳排双控：碳配额消耗进度仪表盘、碳排放趋势与预测折线、碳排放源结构分解、减碳行动追踪表。
   - 设备运维：设备健康度雷达、运行状态脉冲指示灯（正常/预警/离线）、运维工单派发概览、设备维保台账表格。
   - 告警预警：告警等级分布饼图、异常时序波动图、智能诊断分析卡片、多维告警事件日志过滤与处理表格。
5. 数据要有立体感和色彩冲击力，整体炫酷、现代、有科技感。

### Chart & Technical Rules
- 使用 ECharts 构建图表（折线图、柱状图、雷达图、饼图/环形图、仪表盘混排）。
- 图表样式规则：所有折线图及折线/柱状混合图的图例（legend）必须置于图表顶部（如 `legend: { top: 10, ... }`），并配合设置合理的 `grid.top` 间距，严禁图例与图表内容或轴标签重叠。
- ECharts 样式和配置合并时，覆盖参数必须放在 spread 对象最后以确保生效。
- 所有 6 个一级菜单可流畅切换，每个页面提供完整的交互体验与丰富拟真数据。

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://lumen-core-synth.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/daefc5b7-a328-4e16-8b6d-7c2f735f3238).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```

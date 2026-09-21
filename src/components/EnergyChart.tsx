import { useEffect, useRef } from "react";
import type { EChartsOption } from "echarts";

type EnergyChartProps = {
  option: EChartsOption;
  className?: string;
};

export function EnergyChart({ option, className = "h-64" }: EnergyChartProps) {
  const chartRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let chart: import("echarts").ECharts | undefined;
    let disposed = false;

    void import("echarts").then((echarts) => {
      if (disposed || !chartRef.current) return;
      chart = echarts.init(chartRef.current, undefined, { renderer: "canvas" });
      chart.setOption(option, true);
    });

    const resizeObserver = new ResizeObserver(() => chart?.resize());
    if (chartRef.current) resizeObserver.observe(chartRef.current);

    return () => {
      disposed = true;
      resizeObserver.disconnect();
      chart?.dispose();
    };
  }, [option]);

  return <div ref={chartRef} className={className} aria-label="能源数据图表" />;
}
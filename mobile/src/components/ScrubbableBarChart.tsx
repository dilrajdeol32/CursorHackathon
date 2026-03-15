import React, { useRef, useState } from "react";
import { View, Text, PanResponder, StyleSheet } from "react-native";
import { BarChart } from "react-native-chart-kit";
import { colors, radius } from "../theme";

/**
 * react-native-chart-kit BarChart internal layout constants.
 *
 * The y-axis label area occupies `paddingRight` (64 px default – misleading
 * name).  Bars are distributed so the centre of the first bar sits at
 * firstX = paddingRight/2 and the last at lastX = width - paddingRight/2.
 *
 * The data area occupies the top 75 % of the height; the remaining 25 % is
 * reserved for x-axis labels.
 */
const CHART_PADDING_RIGHT = 64;
const CHART_PADDING_TOP = 16;
const DATA_AREA_HEIGHT_RATIO = 0.75;

const TOOLTIP_W = 90;
const TOOLTIP_H = 58;
const DOT_R = 6;

interface Dataset {
  data: number[];
  color?: (opacity: number) => string;
  strokeWidth?: number;
}

interface Props {
  data: { labels: string[]; datasets: Dataset[] };
  width: number;
  height: number;
  chartConfig: object;
  style?: object;
  yAxisLabel?: string;
  yAxisSuffix?: string;
  fromZero?: boolean;
}

export function ScrubbableBarChart({
  data,
  width,
  height,
  chartConfig,
  style,
  yAxisLabel = "",
  yAxisSuffix = "",
  fromZero,
}: Props) {
  const [active, setActive] = useState<{
    index: number;
    px: number;
    py: number;
  } | null>(null);

  const labels = data.labels;
  const values = data.datasets[0].data;
  const n = values.length;
  const min = fromZero ? 0 : Math.min(...values);
  const max = Math.max(...values);
  const dataAreaH = height * DATA_AREA_HEIGHT_RATIO;

  const firstX = CHART_PADDING_RIGHT / 2;
  const stepX = n > 1 ? (width - CHART_PADDING_RIGHT) / (n - 1) : 0;

  function xForIndex(i: number): number {
    return firstX + i * stepX;
  }

  function yForValue(v: number): number {
    const norm = max === min ? 0.5 : (v - min) / (max - min);
    return CHART_PADDING_TOP + (1 - norm) * dataAreaH;
  }

  function touchToIndex(touchX: number): number {
    const raw = Math.round((touchX - firstX) / stepX);
    return Math.max(0, Math.min(n - 1, raw));
  }

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,

      onPanResponderGrant: (evt) => {
        const idx = touchToIndex(evt.nativeEvent.locationX);
        setActive({ index: idx, px: xForIndex(idx), py: yForValue(values[idx]) });
      },
      onPanResponderMove: (evt) => {
        const idx = touchToIndex(evt.nativeEvent.locationX);
        setActive({ index: idx, px: xForIndex(idx), py: yForValue(values[idx]) });
      },
      onPanResponderRelease: () => setActive(null),
      onPanResponderTerminate: () => setActive(null),
    })
  ).current;

  const tooltipLeft = active
    ? Math.max(4, Math.min(width - TOOLTIP_W - 4, active.px - TOOLTIP_W / 2))
    : 0;

  const tooltipTop = active
    ? active.py > height * 0.5
      ? Math.max(4, active.py - TOOLTIP_H - 10)
      : active.py + 14
    : 0;

  const activeVal = active !== null ? values[active.index] : null;
  const activeLabel = active !== null ? labels[active.index] : null;

  const formattedVal =
    activeVal !== null
      ? Number.isInteger(activeVal)
        ? String(activeVal)
        : activeVal.toFixed(1)
      : "";

  return (
    <View style={[{ width, height }, style]}>
      <BarChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        yAxisLabel={yAxisLabel}
        yAxisSuffix={yAxisSuffix}
        fromZero={fromZero}
        style={s.chartInner}
      />

      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
        {active !== null && (
          <>
            {/* Vertical scrub line */}
            <View
              style={[
                s.scrubLine,
                {
                  left: active.px - 0.75,
                  top: CHART_PADDING_TOP,
                  height: dataAreaH,
                },
              ]}
            />

            {/* Dot at the top of the bar */}
            <View
              style={[
                s.dot,
                {
                  left: active.px - DOT_R,
                  top: active.py - DOT_R,
                },
              ]}
            />

            {/* Tooltip card */}
            <View
              style={[
                s.tooltip,
                {
                  left: tooltipLeft,
                  top: tooltipTop,
                  width: TOOLTIP_W,
                },
              ]}
            >
              <Text style={s.tooltipValue}>
                {yAxisLabel}
                {formattedVal}
                {yAxisSuffix}
              </Text>
              <Text style={s.tooltipLabel}>{activeLabel}</Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
}

const s = StyleSheet.create({
  chartInner: {
    borderRadius: 8,
  },
  scrubLine: {
    position: "absolute",
    width: 1.5,
    backgroundColor: colors.primary,
    opacity: 0.85,
  },
  dot: {
    position: "absolute",
    width: DOT_R * 2,
    height: DOT_R * 2,
    borderRadius: DOT_R,
    backgroundColor: colors.primary,
    borderWidth: 2.5,
    borderColor: colors.card,
    shadowColor: colors.primary,
    shadowOpacity: 0.4,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 0 },
    elevation: 4,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    borderColor: colors.primary,
    paddingVertical: 8,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.18,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 3 },
    elevation: 6,
  },
  tooltipValue: {
    color: colors.primary,
    fontWeight: "700",
    fontSize: 17,
  },
  tooltipLabel: {
    color: colors.mutedForeground,
    fontSize: 12,
    marginTop: 2,
  },
});

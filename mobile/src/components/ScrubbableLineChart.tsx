import React, { useRef, useState } from "react";
import { View, Text, PanResponder, StyleSheet } from "react-native";
import { LineChart } from "react-native-chart-kit";
import { colors, radius } from "../theme";

/**
 * react-native-chart-kit LineChart internal layout constants (defaults).
 *
 * The library places y-axis labels in a reserved left region whose width equals
 * `paddingRight` (64 by default – the prop name is misleading).  Data points
 * are distributed symmetrically so the first point sits at x = paddingRight/2
 * and the last point sits at x = chartWidth - paddingRight/2.
 *
 * Vertically, the data area starts at PADDING_TOP (16 px) and occupies 75 % of
 * the total chart height (the remaining 25 % belongs to the x-axis labels).
 */
const CHART_PADDING_RIGHT = 64; // left space reserved for y-axis labels
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
  yAxisSuffix?: string;
  bezier?: boolean;
  /** Whether to draw a filled area below the line. Defaults to false (line only). */
  withShadow?: boolean;
  /** Whether to draw dots at each data point. Defaults to true. */
  withDots?: boolean;
}

export function ScrubbableLineChart({
  data,
  width,
  height,
  chartConfig,
  style,
  yAxisSuffix = "",
  bezier,
  withShadow = false,
  withDots = true,
}: Props) {
  const [active, setActive] = useState<{
    index: number;
    px: number;
    py: number;
  } | null>(null);

  const labels = data.labels;
  const values = data.datasets[0].data;
  const n = values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const dataAreaH = height * DATA_AREA_HEIGHT_RATIO;

  // X layout: points run from firstX to lastX with equal stepX spacing.
  const firstX = CHART_PADDING_RIGHT / 2;
  const stepX = n > 1 ? (width - CHART_PADDING_RIGHT) / (n - 1) : 0;

  function xForIndex(i: number): number {
    return firstX + i * stepX;
  }

  // Y layout: normalise value into [0,1] then map into the data area.
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
      // Claim every touch that starts inside this overlay so the ScrollView
      // doesn't steal the gesture while the user scrubs the chart.
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      // Prevent parent gesture handlers from taking over mid-scrub.
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

  // Keep tooltip inside horizontal bounds.
  const tooltipLeft = active
    ? Math.max(4, Math.min(width - TOOLTIP_W - 4, active.px - TOOLTIP_W / 2))
    : 0;

  // Flip tooltip above the dot when the dot is in the lower half so the
  // tooltip never obscures the region the user is touching.
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
      {/* The underlying chart – rendered first so overlays appear on top */}
      <LineChart
        data={data}
        width={width}
        height={height}
        chartConfig={chartConfig}
        bezier={bezier}
        yAxisSuffix={yAxisSuffix}
        withShadow={withShadow}
        withDots={withDots}
        style={s.chartInner}
      />

      {/* Full-size transparent overlay that captures all touch events */}
      <View style={StyleSheet.absoluteFill} {...panResponder.panHandlers}>
        {active !== null && (
          <>
            {/* ─── Vertical scrub line ─── */}
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

            {/* ─── Dot on the curve ─── */}
            <View
              style={[
                s.dot,
                {
                  left: active.px - DOT_R,
                  top: active.py - DOT_R,
                },
              ]}
            />

            {/* ─── Tooltip card ─── */}
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
    // Subtle shadow to lift the dot off the line
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
    // Shadow
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

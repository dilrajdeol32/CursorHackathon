import React, { useRef, useState } from "react";
import { View, Text, PanResponder, StyleSheet } from "react-native";
import { colors, radius } from "../theme";

/**
 * Pure React Native bar chart with per-bar highlight scrubbing.
 *
 * Layout (all sizes in logical pixels):
 *   Y_AXIS_W  – left strip reserved for y-axis tick labels
 *   X_AXIS_H  – bottom strip reserved for x-axis labels
 *   PADDING_T – top gap so the tallest bar doesn't clip the top tick label
 *
 * Touch handling uses PanResponder so the user can drag across bars
 * continuously.  The active bar is rendered at full colour while all
 * other bars fade to LOW_OPACITY.  A tooltip card floats above the
 * active bar.
 */

const Y_AXIS_W = 38;
const X_AXIS_H = 30;
const PADDING_T = 14;
const TICK_COUNT = 4; // horizontal grid lines (not counting the baseline)
const BAR_PCT = 0.6; // fraction of each slot occupied by a bar
const BAR_R = 5; // top-corner border radius
const LOW_OPACITY = 0.22;
const FULL_OPACITY = 1;
const REST_OPACITY = 0.85;

const TIP_W = 88;
const TIP_H = 50;

function niceMax(raw: number): number {
  if (raw <= 0) return 10;
  const mag = Math.pow(10, Math.floor(Math.log10(raw)));
  const n = raw / mag;
  if (n <= 1) return mag;
  if (n <= 2) return 2 * mag;
  if (n <= 5) return 5 * mag;
  return 10 * mag;
}

export interface CustomBarChartProps {
  data: { labels: string[]; datasets: [{ data: number[] }] };
  width: number;
  height: number;
  /** Fill colour for bars at rest. */
  barColor?: string;
  /** Fill colour for the active (highlighted) bar – defaults to barColor. */
  highlightColor?: string;
  yAxisSuffix?: string;
  style?: object;
}

export function CustomBarChart({
  data,
  width,
  height,
  barColor = colors.primary,
  highlightColor,
  yAxisSuffix = "",
  style,
}: CustomBarChartProps) {
  const [activeIdx, setActiveIdx] = useState<number | null>(null);

  const labels = data.labels;
  const values = data.datasets[0].data;
  const n = values.length;
  const maxVal = niceMax(Math.max(...values));

  const barsW = width - Y_AXIS_W;
  const barsH = height - PADDING_T - X_AXIS_H;
  const slotW = barsW / n;
  const barW = slotW * BAR_PCT;

  const hColor = highlightColor ?? barColor;

  // Geometry helpers
  const barLeft = (i: number) => i * slotW + (slotW - barW) / 2;
  const barH = (v: number) => (v / maxVal) * barsH;
  const hitIndex = (x: number) =>
    Math.max(0, Math.min(n - 1, Math.floor((x - Y_AXIS_W) / slotW)));

  const pan = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderTerminationRequest: () => false,
      onPanResponderGrant: (e) => setActiveIdx(hitIndex(e.nativeEvent.locationX)),
      onPanResponderMove: (e) => setActiveIdx(hitIndex(e.nativeEvent.locationX)),
      onPanResponderRelease: () => setActiveIdx(null),
      onPanResponderTerminate: () => setActiveIdx(null),
    })
  ).current;

  // Y-axis ticks: evenly spaced from maxVal down to 0
  const ticks = Array.from({ length: TICK_COUNT + 1 }, (_, i) =>
    Math.round(maxVal - (maxVal / TICK_COUNT) * i)
  );

  // Tooltip geometry
  const aH = activeIdx !== null ? barH(values[activeIdx]) : 0;
  const tipCenterX =
    activeIdx !== null ? Y_AXIS_W + barLeft(activeIdx) + barW / 2 : 0;
  const tipLeft = Math.max(0, Math.min(width - TIP_W, tipCenterX - TIP_W / 2));
  // Place tooltip above bar top; if bar is very tall push it down a bit
  const tipTop = Math.max(
    PADDING_T + 4,
    PADDING_T + barsH - aH - TIP_H - 8
  );

  return (
    <View style={[{ width, height }, style]} {...pan.panHandlers}>
      {/* Y-axis tick labels */}
      {ticks.map((tick, i) => {
        const y = PADDING_T + (i / TICK_COUNT) * barsH;
        return (
          <Text
            key={i}
            style={[
              s.yLabel,
              { position: "absolute", top: y - 8, left: 0, width: Y_AXIS_W - 4 },
            ]}
          >
            {tick}
            {yAxisSuffix}
          </Text>
        );
      })}

      {/* Bars + grid area */}
      <View
        style={{
          position: "absolute",
          left: Y_AXIS_W,
          top: PADDING_T,
          width: barsW,
          height: barsH,
          overflow: "hidden",
        }}
      >
        {/* Horizontal grid lines */}
        {ticks.map((_, i) => (
          <View
            key={i}
            style={[s.gridLine, { top: (i / TICK_COUNT) * barsH }]}
          />
        ))}

        {/* Baseline */}
        <View style={[s.gridLine, { top: barsH - 1 }]} />

        {/* Column hover wash */}
        {activeIdx !== null && (
          <View
            style={{
              position: "absolute",
              left: barLeft(activeIdx),
              top: 0,
              width: barW,
              height: barsH,
              backgroundColor: hColor,
              opacity: 0.1,
              borderRadius: BAR_R,
            }}
          />
        )}

        {/* Bars */}
        {values.map((val, i) => {
          const bh = barH(val);
          const isActive = activeIdx === i;
          const anyActive = activeIdx !== null;
          return (
            <View
              key={i}
              style={{
                position: "absolute",
                left: barLeft(i),
                bottom: 0,
                width: barW,
                height: bh,
                backgroundColor: isActive ? hColor : barColor,
                opacity: anyActive
                  ? isActive
                    ? FULL_OPACITY
                    : LOW_OPACITY
                  : REST_OPACITY,
                borderTopLeftRadius: BAR_R,
                borderTopRightRadius: BAR_R,
              }}
            />
          );
        })}
      </View>

      {/* X-axis labels */}
      <View
        style={{
          position: "absolute",
          left: Y_AXIS_W,
          top: PADDING_T + barsH,
          width: barsW,
          flexDirection: "row",
        }}
      >
        {labels.map((lbl, i) => (
          <View
            key={i}
            style={{ width: slotW, alignItems: "center", paddingTop: 7 }}
          >
            <Text
              style={[
                s.xLabel,
                activeIdx === i && { color: hColor, fontWeight: "600" },
              ]}
            >
              {lbl}
            </Text>
          </View>
        ))}
      </View>

      {/* Tooltip */}
      {activeIdx !== null && (
        <View
          style={[
            s.tooltip,
            { left: tipLeft, top: tipTop, width: TIP_W, borderColor: hColor },
          ]}
        >
          <Text style={[s.tooltipValue, { color: hColor }]}>
            {Number.isInteger(values[activeIdx])
              ? values[activeIdx]
              : values[activeIdx].toFixed(1)}
            {yAxisSuffix}
          </Text>
          <Text style={s.tooltipLabel}>{labels[activeIdx]}</Text>
        </View>
      )}
    </View>
  );
}

const s = StyleSheet.create({
  yLabel: {
    fontSize: 10,
    color: colors.mutedForeground,
    textAlign: "right",
  },
  xLabel: { fontSize: 10, color: colors.mutedForeground },
  gridLine: {
    position: "absolute",
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: colors.border,
  },
  tooltip: {
    position: "absolute",
    backgroundColor: colors.card,
    borderRadius: radius.md,
    borderWidth: 1.5,
    paddingVertical: 7,
    paddingHorizontal: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.14,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 5,
  },
  tooltipValue: { fontWeight: "700", fontSize: 16 },
  tooltipLabel: {
    color: colors.mutedForeground,
    fontSize: 11,
    marginTop: 2,
  },
});

import React from "react";
import { useNavigate } from "react-router";
import { ArrowLeft } from "lucide-react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const interruptionsByHour = [
  { hour: "06", count: 2 },
  { hour: "07", count: 5 },
  { hour: "08", count: 8 },
  { hour: "09", count: 6 },
  { hour: "10", count: 4 },
  { hour: "11", count: 3 },
  { hour: "12", count: 7 },
  { hour: "13", count: 5 },
  { hour: "14", count: 4 },
  { hour: "15", count: 3 },
  { hour: "16", count: 6 },
  { hour: "17", count: 4 },
];

const interruptionsBySource = [
  { name: "Bed Alarm", value: 28 },
  { name: "Phone Call", value: 22 },
  { name: "Code Alert", value: 15 },
  { name: "Patient Req", value: 20 },
  { name: "Other", value: 15 },
];

const COLORS = ["#4A90D9", "#5BA8A0", "#E5A84D", "#E54D4D", "#7B6BD9"];

const mostInterruptedTasks = [
  { task: "Medication", count: 18 },
  { task: "Charting", count: 12 },
  { task: "Wound Care", count: 8 },
  { task: "IV Check", count: 6 },
  { task: "Vitals", count: 4 },
];

const resumeDelay = [
  { day: "Mon", avg: 5.2 },
  { day: "Tue", avg: 7.1 },
  { day: "Wed", avg: 4.8 },
  { day: "Thu", avg: 6.3 },
  { day: "Fri", avg: 8.5 },
  { day: "Sat", avg: 4.0 },
  { day: "Sun", avg: 3.8 },
];

export function Analytics() {
  const navigate = useNavigate();

  return (
    <div className="pb-28 px-5 pt-6 min-h-screen">
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-primary mb-6"
      >
        <ArrowLeft className="w-5 h-5" />
        Back
      </button>

      <h1 className="text-foreground mb-2">Analytics</h1>
      <p className="text-muted-foreground mb-6">This week's overview</p>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-8">
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-3xl text-primary">47</p>
          <p className="text-muted-foreground">Total Interruptions</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-3xl text-[#5BA8A0]">5.7m</p>
          <p className="text-muted-foreground">Avg Resume Delay</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-3xl text-[#E5A84D]">12%</p>
          <p className="text-muted-foreground">High Risk Rate</p>
        </div>
        <div className="bg-card rounded-2xl p-4 shadow-sm border border-border text-center">
          <p className="text-3xl text-[#4CAF7D]">94%</p>
          <p className="text-muted-foreground">Safe Resumes</p>
        </div>
      </div>

      {/* Chart 1: Interruptions by Hour */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
        <h3 className="text-foreground mb-4">Interruptions by Hour</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={interruptionsByHour}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
            <XAxis dataKey="hour" tick={{ fill: "#6B7A8D" }} />
            <YAxis tick={{ fill: "#6B7A8D" }} />
            <Tooltip />
            <Bar dataKey="count" fill="#4A90D9" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 2: Interruptions by Source */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
        <h3 className="text-foreground mb-4">Interruptions by Source</h3>
        <ResponsiveContainer width="100%" height={220}>
          <PieChart>
            <Pie
              data={interruptionsBySource}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {interruptionsBySource.map((_, index) => (
                <Cell key={index} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
        <div className="flex flex-wrap gap-3 justify-center mt-2">
          {interruptionsBySource.map((item, i) => (
            <div key={item.name} className="flex items-center gap-1.5">
              <span
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: COLORS[i] }}
              />
              <span className="text-muted-foreground">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Chart 3: Most Interrupted Tasks */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
        <h3 className="text-foreground mb-4">Most Interrupted Tasks</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={mostInterruptedTasks} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
            <XAxis type="number" tick={{ fill: "#6B7A8D" }} />
            <YAxis
              type="category"
              dataKey="task"
              tick={{ fill: "#6B7A8D" }}
              width={80}
            />
            <Tooltip />
            <Bar dataKey="count" fill="#5BA8A0" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Chart 4: Average Resume Delay */}
      <div className="bg-card rounded-2xl p-5 shadow-sm border border-border mb-6">
        <h3 className="text-foreground mb-4">Avg Resume Delay (min)</h3>
        <ResponsiveContainer width="100%" height={200}>
          <LineChart data={resumeDelay}>
            <CartesianGrid strokeDasharray="3 3" stroke="#E8ECF1" />
            <XAxis dataKey="day" tick={{ fill: "#6B7A8D" }} />
            <YAxis tick={{ fill: "#6B7A8D" }} />
            <Tooltip />
            <Line
              type="monotone"
              dataKey="avg"
              stroke="#E5A84D"
              strokeWidth={2}
              dot={{ r: 4, fill: "#E5A84D" }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

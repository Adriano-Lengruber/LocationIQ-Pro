'use client';

import {
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell
} from 'recharts';

interface ScoreData {
  subject: string;
  score: number;
  fullMark: number;
}

interface ScoreChartsProps {
  scores: {
    label: string;
    value: number;
    color: string;
  }[];
}

export function ScoreRadarChart({ scores }: ScoreChartsProps) {
  const data: ScoreData[] = scores.map(score => ({
    subject: score.label,
    score: score.value,
    fullMark: 10
  }));

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data}>
          <PolarGrid />
          <PolarAngleAxis dataKey="subject" tick={{ fontSize: 12 }} />
          <PolarRadiusAxis 
            angle={30} 
            domain={[0, 10]} 
            tick={{ fontSize: 10 }}
            tickCount={6}
          />
          <Radar
            name="Score"
            dataKey="score"
            stroke="#3b82f6"
            fill="#3b82f6"
            fillOpacity={0.2}
            strokeWidth={2}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}

export function ScoreBarChart({ scores }: ScoreChartsProps) {
  const data = scores.map(score => ({
    name: score.label,
    score: score.value,
    color: score.color
  }));

  const getBarColor = (value: number) => {
    if (value >= 8.5) return '#10b981'; // green-500
    if (value >= 7.0) return '#f59e0b'; // yellow-500
    return '#ef4444'; // red-500
  };

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          margin={{
            top: 20,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="name" 
            tick={{ fontSize: 12 }}
            interval={0}
            angle={-45}
            textAnchor="end"
            height={80}
          />
          <YAxis domain={[0, 10]} tick={{ fontSize: 12 }} />
          <Tooltip 
            formatter={(value: number) => [value.toFixed(1), 'Score']}
            labelStyle={{ color: '#374151' }}
            contentStyle={{ 
              backgroundColor: '#f9fafb', 
              border: '1px solid #e5e7eb',
              borderRadius: '8px'
            }}
          />
          <Bar dataKey="score" radius={[4, 4, 0, 0]}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={getBarColor(entry.score)} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

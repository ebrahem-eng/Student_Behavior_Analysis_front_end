import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface TrendChartProps {
  data: any[];
  xKey: string;
  yKey: string;
  height?: number;
  strokeColor?: string;
  valuePrefix?: string;
  valueSuffix?: string;
}

export function TrendChart({ 
  data, 
  xKey, 
  yKey, 
  height = 300, 
  strokeColor = "#3b82f6", // blue-500
  valuePrefix = "",
  valueSuffix = ""
}: TrendChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.5} vertical={false} />
          <XAxis 
            dataKey={xKey} 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            dy={10}
          />
          <YAxis 
            stroke="#64748b" 
            fontSize={12} 
            tickLine={false} 
            axisLine={false}
            tickFormatter={(value) => `${valuePrefix}${value}${valueSuffix}`}
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
            formatter={(value: any) => [`${valuePrefix}${value}${valueSuffix}`, 'Value']}
            labelStyle={{ color: '#94a3b8', marginBottom: '4px' }}
          />
          <Line 
            type="monotone" 
            dataKey={yKey} 
            stroke={strokeColor} 
            strokeWidth={3}
            dot={{ fill: strokeColor, strokeWidth: 2, r: 4, stroke: '#0f172a' }}
            activeDot={{ r: 6, strokeWidth: 0 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

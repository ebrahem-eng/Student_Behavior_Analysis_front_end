import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface ComparisonChartProps {
  data: any[];
  xKey: string;
  bars: { key: string; name: string; color: string }[];
  height?: number;
}

export function ComparisonChart({ 
  data, 
  xKey, 
  bars, 
  height = 300 
}: ComparisonChartProps) {
  return (
    <div style={{ width: '100%', height }}>
      <ResponsiveContainer>
        <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
          />
          <Tooltip 
            contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '8px' }}
            itemStyle={{ color: '#f8fafc' }}
            cursor={{ fill: '#334155', opacity: 0.4 }}
          />
          <Legend 
            verticalAlign="top" 
            height={36}
            wrapperStyle={{ fontSize: '12px', color: '#94a3b8' }}
          />
          {bars.map((bar) => (
            <Bar 
              key={bar.key} 
              dataKey={bar.key} 
              name={bar.name} 
              fill={bar.color} 
              radius={[4, 4, 0, 0]} 
            />
          ))}
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

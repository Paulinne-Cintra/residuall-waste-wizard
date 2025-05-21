
import { useEffect, useRef } from 'react';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

// Tipos de gráficos disponíveis
type ChartType = 'bar' | 'pie' | 'line';

// Interface para as props do componente
interface ChartProps {
  type: ChartType;
  data: any[];
  title?: string;
  height?: number;
  width?: string;
  colors?: string[];
}

const Chart = ({
  type,
  data,
  title,
  height = 300,
  width = '100%',
  colors = ['#2a4a3d', '#6e7848', '#434b3c', '#ff8c42', '#8a8a8a', '#3b3b3b']
}: ChartProps) => {
  const renderChart = () => {
    switch (type) {
      case 'bar':
        return (
          <ResponsiveContainer width={width} height={height}>
            <BarChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#252525' }} 
                axisLine={{ stroke: '#c4c2c2' }}
              />
              <YAxis 
                tick={{ fill: '#252525' }} 
                axisLine={{ stroke: '#c4c2c2' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
              {/* Renderiza barras para cada chave diferente de "name" */}
              {Object.keys(data[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Bar 
                    key={key} 
                    dataKey={key} 
                    fill={colors[index % colors.length]} 
                    radius={[4, 4, 0, 0]}
                  />
                ))}
            </BarChart>
          </ResponsiveContainer>
        );

      case 'pie':
        return (
          <ResponsiveContainer width={width} height={height}>
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                labelLine={false}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
                ))}
              </Pie>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0'
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        );

      case 'line':
        return (
          <ResponsiveContainer width={width} height={height}>
            <LineChart
              data={data}
              margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
              <XAxis 
                dataKey="name" 
                tick={{ fill: '#252525' }} 
                axisLine={{ stroke: '#c4c2c2' }}
              />
              <YAxis 
                tick={{ fill: '#252525' }} 
                axisLine={{ stroke: '#c4c2c2' }}
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  borderRadius: '8px', 
                  boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)',
                  border: '1px solid #f0f0f0'
                }}
              />
              <Legend 
                wrapperStyle={{ 
                  paddingTop: '10px',
                  fontSize: '12px'
                }}
              />
              {/* Renderiza linhas para cada chave diferente de "name" */}
              {Object.keys(data[0] || {})
                .filter(key => key !== 'name')
                .map((key, index) => (
                  <Line
                    key={key}
                    type="monotone"
                    dataKey={key}
                    stroke={colors[index % colors.length]}
                    activeDot={{ r: 8 }}
                  />
                ))}
            </LineChart>
          </ResponsiveContainer>
        );

      default:
        return <div>Tipo de gráfico não suportado</div>;
    }
  };

  return (
    <div className="chart-container">
      {title && <h3 className="text-lg font-montserrat font-medium mb-4 text-residuall-gray-tableText">{title}</h3>}
      {renderChart()}
    </div>
  );
};

export default Chart;

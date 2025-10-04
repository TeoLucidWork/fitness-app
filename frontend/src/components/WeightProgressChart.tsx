import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Alert,
  Grid,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { WeightProgressEntry } from '../types/weight.types';
import { weightService } from '../services/weightService';

interface WeightProgressChartProps {
  clientId?: number;
}

interface ChartDataPoint {
  date: string;
  weight: number;
  formattedDate: string;
  notes?: string;
}

export const WeightProgressChart: React.FC<WeightProgressChartProps> = ({ clientId }) => {
  const [data, setData] = useState<ChartDataPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [period, setPeriod] = useState<number>(30); // Default 30 days

  useEffect(() => {
    fetchProgressData();
  }, [clientId, period]);

  const fetchProgressData = async () => {
    try {
      setLoading(true);
      const progressData = await weightService.getWeightProgress(clientId, period === 0 ? undefined : period);

      const chartData: ChartDataPoint[] = progressData.map((entry: WeightProgressEntry) => ({
        date: entry.createdAt,
        weight: entry.weight,
        formattedDate: new Date(entry.createdAt).toLocaleDateString('bg-BG', {
          day: '2-digit',
          month: '2-digit',
          year: '2-digit'
        }),
        notes: entry.notes,
      }));

      setData(chartData);
    } catch (err: any) {
      setError('Грешка при зареждане на данните за прогреса');
      console.error('Failed to fetch progress data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatTooltipValue = (value: number, name: string) => {
    if (name === 'weight') {
      return [`${value} кг`, 'Тегло'];
    }
    return [value, name];
  };

  const formatTooltipLabel = (label: string) => {
    return new Date(label).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getAverageWeight = () => {
    if (data.length === 0) return 0;
    const sum = data.reduce((acc, point) => acc + point.weight, 0);
    return sum / data.length;
  };

  const getMinMaxWeight = () => {
    if (data.length === 0) return { min: 0, max: 100 };
    const weights = data.map(d => d.weight);
    const min = Math.min(...weights);
    const max = Math.max(...weights);
    const padding = (max - min) * 0.1 || 5; // Add 10% padding or 5kg minimum
    return {
      min: Math.max(0, min - padding),
      max: max + padding
    };
  };

  const { min: minWeight, max: maxWeight } = getMinMaxWeight();
  const avgWeight = getAverageWeight();

  if (loading) {
    return (
      <Card>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: 200 }}>
            <CircularProgress />
          </Box>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent>
        <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <Typography variant="h6">
              Прогрес на теглото
            </Typography>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormControl fullWidth size="small">
              <InputLabel>Период</InputLabel>
              <Select
                value={period}
                label="Период"
                onChange={(e) => setPeriod(Number(e.target.value))}
              >
                <MenuItem value={7}>Последните 7 дни</MenuItem>
                <MenuItem value={30}>Последните 30 дни</MenuItem>
                <MenuItem value={90}>Последните 3 месеца</MenuItem>
                <MenuItem value={180}>Последните 6 месеца</MenuItem>
                <MenuItem value={365}>Последната година</MenuItem>
                <MenuItem value={0}>Всички записи</MenuItem>
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {data.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography variant="body1" color="text.secondary">
              Няма данни за избрания период
            </Typography>
          </Box>
        ) : (
          <Box sx={{ width: '100%', height: 400 }}>
            <ResponsiveContainer>
              <LineChart data={data} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                <XAxis
                  dataKey="formattedDate"
                  stroke="#666"
                  fontSize={12}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis
                  stroke="#666"
                  fontSize={12}
                  domain={[minWeight, maxWeight]}
                  tickFormatter={(value) => `${value.toFixed(1)} кг`}
                />
                <Tooltip
                  formatter={formatTooltipValue}
                  labelFormatter={formatTooltipLabel}
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as ChartDataPoint;
                      return (
                        <div style={{
                          backgroundColor: '#fff',
                          border: '1px solid #ccc',
                          borderRadius: '4px',
                          padding: '10px'
                        }}>
                          <p style={{ margin: 0, fontWeight: 'bold' }}>
                            {label ? formatTooltipLabel(String(label)) : ''}
                          </p>
                          <p style={{ margin: '5px 0', color: '#1976d2' }}>
                            Тегло: {payload[0].value} кг
                          </p>
                          {data.notes && (
                            <p style={{ margin: '5px 0', fontSize: '12px', color: '#666' }}>
                              Бележки: {data.notes}
                            </p>
                          )}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="weight"
                  stroke="#1976d2"
                  strokeWidth={2}
                  dot={{ fill: '#1976d2', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6, stroke: '#1976d2', strokeWidth: 2 }}
                />
                {/* Average weight reference line */}
                {avgWeight > 0 && (
                  <ReferenceLine
                    y={avgWeight}
                    stroke="#ff9800"
                    strokeDasharray="5 5"
                    label={{ value: `Средно: ${avgWeight.toFixed(1)} кг`, position: 'top' }}
                  />
                )}
              </LineChart>
            </ResponsiveContainer>
          </Box>
        )}

        {data.length > 0 && (
          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'center', gap: 3 }}>
            <Typography variant="body2" color="text.secondary">
              <span style={{ color: '#1976d2', fontWeight: 'bold' }}>●</span> Тегло
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <span style={{ color: '#ff9800', fontWeight: 'bold' }}>- - -</span> Средно ({avgWeight.toFixed(1)} кг)
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  );
};
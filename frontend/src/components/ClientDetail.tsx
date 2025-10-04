import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Alert,
  Divider,
  Chip,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  TrendingUp as TrendingUpIcon,
  TrendingDown as TrendingDownIcon,
  FitnessCenter as FitnessCenterIcon,
  CheckCircle as CheckCircleIcon,
} from '@mui/icons-material';
import { userService } from '../services/userService';
import { WeightProgressChart } from './WeightProgressChart';

interface ClientDetailProps {
  clientId: number;
  onNavigateBack: () => void;
}

export const ClientDetail: React.FC<ClientDetailProps> = ({
  clientId,
  onNavigateBack,
}) => {
  const [clientData, setClientData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchClientDetails = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await userService.getClientDetails(clientId);
      setClientData(data);
    } catch (err: any) {
      setError('Грешка при зареждане на данните за клиента');
      console.error('Failed to fetch client details:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [clientId]);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getDisplayName = (client: any) => {
    if (client.firstName && client.lastName) {
      return `${client.firstName} ${client.lastName}`;
    }
    if (client.firstName) {
      return client.firstName;
    }
    return client.username;
  };

  const getInitials = (client: any) => {
    if (client.firstName && client.lastName) {
      return `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();
    }
    if (client.firstName) {
      return client.firstName[0].toUpperCase();
    }
    return client.username[0].toUpperCase();
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ p: 3 }}>
        <Alert severity="error" onClose={() => setError(null)}>
          {error}
        </Alert>
      </Box>
    );
  }

  if (!clientData) {
    return null;
  }

  const { client, weight, workouts, programs } = clientData;
  const weightChange = weight.change;
  const hasWeightData = weight.latest !== null;

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onNavigateBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
            <Avatar sx={{ width: 56, height: 56, mr: 2, bgcolor: 'primary.main' }}>
              {getInitials(client)}
            </Avatar>
            <Box>
              <Typography variant="h4" component="h1">
                {getDisplayName(client)}
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {client.email}
              </Typography>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 3 }} />

        {/* Stats Cards */}
        <Box sx={{
          display: 'grid',
          gridTemplateColumns: { xs: '1fr', md: 'repeat(3, 1fr)' },
          gap: 3,
          mb: 3
        }}>
          <Card variant="outlined">
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Тегло
              </Typography>
                {hasWeightData ? (
                  <>
                    <Typography variant="h3" sx={{ mb: 1 }}>
                      {weight.latest} кг
                    </Typography>
                    {weightChange !== null && (
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        {weightChange > 0 ? (
                          <TrendingUpIcon color="error" />
                        ) : weightChange < 0 ? (
                          <TrendingDownIcon color="success" />
                        ) : null}
                        <Typography
                          variant="body2"
                          color={weightChange > 0 ? 'error' : weightChange < 0 ? 'success' : 'text.secondary'}
                        >
                          {weightChange > 0 ? '+' : ''}{weightChange?.toFixed(1)} кг от началото
                        </Typography>
                      </Box>
                    )}
                  </>
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    Няма записи за тегло
                  </Typography>
                )}
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <FitnessCenterIcon sx={{ mr: 1 }} color="primary" />
                  <Typography variant="h6">
                    Тренировки
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {workouts.total}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Общо тренировки
                </Typography>
              </CardContent>
            </Card>
            <Card variant="outlined">
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <CheckCircleIcon sx={{ mr: 1 }} color="success" />
                  <Typography variant="h6">
                    Завършени
                  </Typography>
                </Box>
                <Typography variant="h3" sx={{ mb: 1 }}>
                  {workouts.completed}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {workouts.total > 0
                    ? `${((workouts.completed / workouts.total) * 100).toFixed(0)}% успеваемост`
                    : 'Няма тренировки'
                  }
                </Typography>
              </CardContent>
            </Card>
        </Box>

        {/* Weight Progress Chart */}
        {hasWeightData && (
          <Box sx={{ mb: 3 }}>
            <WeightProgressChart clientId={clientId} />
          </Box>
        )}

        {/* Recent Weight Entries */}
        {weight.entries && weight.entries.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Последни записи на теглото
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell align="right">Тегло (кг)</TableCell>
                    <TableCell>Бележки</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {weight.entries.slice(0, 10).map((entry: any, index: number) => (
                    <TableRow key={entry.id || index}>
                      <TableCell>{formatDateTime(entry.createdAt)}</TableCell>
                      <TableCell align="right">{entry.weight}</TableCell>
                      <TableCell>{entry.notes || '-'}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Recent Workouts */}
        {workouts.recentLogs && workouts.recentLogs.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <Typography variant="h5" gutterBottom>
              Последни тренировки
            </Typography>
            <TableContainer component={Paper} variant="outlined">
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Дата</TableCell>
                    <TableCell>Програма</TableCell>
                    <TableCell>Продължителност</TableCell>
                    <TableCell>Статус</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {workouts.recentLogs.map((log: any) => (
                    <TableRow key={log.id}>
                      <TableCell>{formatDateTime(log.startedAt)}</TableCell>
                      <TableCell>{log.programSession?.program?.name || log.programSession?.name || 'Без програма'}</TableCell>
                      <TableCell>
                        {log.completedAt
                          ? `${Math.round((new Date(log.completedAt).getTime() - new Date(log.startedAt).getTime()) / 60000)} мин`
                          : '-'
                        }
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={log.isCompleted ? 'Завършена' : 'В процес'}
                          color={log.isCompleted ? 'success' : 'primary'}
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        )}

        {/* Assigned Programs */}
        {programs && programs.length > 0 && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Назначени програми
            </Typography>
            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(2, 1fr)' },
              gap: 2
            }}>
              {programs.map((program: any) => (
                  <Card key={program.id} variant="outlined">
                    <CardContent>
                      <Typography variant="h6" gutterBottom>
                        {program.name}
                      </Typography>
                      {program.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                          {program.description}
                        </Typography>
                      )}
                      <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
                        <Chip label={`${program.sessionsCount} сесии`} size="small" />
                        <Chip label={formatDate(program.createdAt)} size="small" variant="outlined" />
                      </Box>
                    </CardContent>
                  </Card>
              ))}
            </Box>
          </Box>
        )}

        {/* No Data State */}
        {!hasWeightData && workouts.total === 0 && (!programs || programs.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <Typography variant="h6" color="text.secondary" gutterBottom>
              Няма данни за показване
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Клиентът все още няма записи за тегло, тренировки или програми
            </Typography>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

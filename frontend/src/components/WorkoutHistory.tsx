import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Alert,
  Chip,
  Grid,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Rating,
  Paper,
  LinearProgress,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore as ExpandMoreIcon,
  TrendingUp as TrendingUpIcon,
  FitnessCenter as FitnessCenterIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
} from '@mui/icons-material';
import { WorkoutLog, WorkoutStats } from '../types/workout.types';
import { workoutService } from '../services/workoutService';

interface WorkoutHistoryProps {
  onNavigateBack: () => void;
}

export const WorkoutHistory: React.FC<WorkoutHistoryProps> = ({ onNavigateBack }) => {
  const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>([]);
  const [workoutStats, setWorkoutStats] = useState<WorkoutStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchWorkoutData();
  }, []);

  const fetchWorkoutData = async () => {
    try {
      setLoading(true);
      const [logs, stats] = await Promise.all([
        workoutService.getWorkoutLogs(),
        workoutService.getWorkoutStats()
      ]);
      setWorkoutLogs(logs);
      setWorkoutStats(stats);
    } catch (err: any) {
      setError('Грешка при зареждане на историята на тренировките');
      console.error('Failed to fetch workout data:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatDuration = (startedAt: string, completedAt: string | null) => {
    if (!completedAt) return 'В прогрес';

    const start = new Date(startedAt);
    const end = new Date(completedAt);
    const durationMs = end.getTime() - start.getTime();
    const minutes = Math.floor(durationMs / (1000 * 60));
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    if (hours > 0) {
      return `${hours}ч ${remainingMinutes}мин`;
    }
    return `${remainingMinutes}мин`;
  };

  const completedWorkouts = workoutLogs.filter(log => log.isCompleted);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <IconButton
            size="large"
            edge="start"
            color="inherit"
            onClick={onNavigateBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            История на тренировките
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Statistics Cards */}
        {workoutStats && (
          <Grid container spacing={3} sx={{ mb: 4 }}>
            <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ boxShadow: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <FitnessCenterIcon sx={{ fontSize: 40, color: 'primary.main', mb: 1 }} />
                  <Typography variant="h4" color="primary.main">
                    {workoutStats.totalWorkouts}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Общо тренировки
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ boxShadow: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <ScheduleIcon sx={{ fontSize: 40, color: 'secondary.main', mb: 1 }} />
                  <Typography variant="h4" color="secondary.main">
                    {workoutStats.workoutsThisWeek}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Тази седмица
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ boxShadow: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <StarIcon sx={{ fontSize: 40, color: 'warning.main', mb: 1 }} />
                  <Typography variant="h4" color="warning.main">
                    {workoutStats.averageRating ? workoutStats.averageRating.toFixed(1) : 'N/A'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Средна оценка
                  </Typography>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 3 }}>
              <Card sx={{ boxShadow: 2, height: '100%' }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <TrendingUpIcon sx={{ fontSize: 40, color: 'success.main', mb: 1 }} />
                  <Typography variant="body1" color="success.main" sx={{ fontWeight: 'bold' }}>
                    {workoutStats.recentWorkout ? 'Активен' : 'Неактивен'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Статус
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )}

        {/* Recent Workout */}
        {workoutStats?.recentWorkout && (
          <Card sx={{ boxShadow: 3, mb: 3 }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Последна тренировка
              </Typography>
              <Grid container spacing={2} alignItems="center">
                <Grid size={{ xs: 12, md: 8 }}>
                  <Typography variant="body1" fontWeight="500">
                    {workoutStats.recentWorkout.sessionName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {workoutStats.recentWorkout.programName}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {formatDate(workoutStats.recentWorkout.completedAt)}
                  </Typography>
                </Grid>
                <Grid size={{ xs: 12, md: 4 }}>
                  {workoutStats.recentWorkout.rating && (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      <Typography variant="body2">Оценка:</Typography>
                      <Rating value={workoutStats.recentWorkout.rating} readOnly size="small" />
                    </Box>
                  )}
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        )}

        {/* Workout History */}
        {completedWorkouts.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Няма завършени тренировки
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Започнете първата си тренировка, за да видите прогреса си тук.
            </Typography>
          </Paper>
        ) : (
          <Box>
            <Typography variant="h6" gutterBottom sx={{ mb: 3 }}>
              История ({completedWorkouts.length} тренировки)
            </Typography>

            {completedWorkouts.map((workout) => (
              <Accordion key={workout.id} sx={{ mb: 2 }}>
                <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                    <Box sx={{ flexGrow: 1 }}>
                      <Typography variant="body1" fontWeight="500">
                        {workout.programSession?.name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {workout.programSession?.program.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {formatDate(workout.completedAt || workout.startedAt)} • {formatDuration(workout.startedAt, workout.completedAt)}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {workout.rating && (
                        <Rating value={workout.rating} readOnly size="small" />
                      )}
                      <Chip
                        label="Завършена"
                        size="small"
                        color="success"
                        variant="outlined"
                      />
                    </Box>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  {workout.exerciseLogs && workout.exerciseLogs.length > 0 ? (
                    <>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Упражнения ({workout.exerciseLogs.length})
                      </Typography>
                      <List dense>
                        {workout.exerciseLogs.map((exerciseLog, index) => (
                          <React.Fragment key={exerciseLog.id}>
                            <ListItem>
                              <ListItemText
                                primary={
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <Typography variant="body2" fontWeight="500">
                                      {exerciseLog.programExercise?.exercise.name}
                                    </Typography>
                                    {exerciseLog.isCompleted && (
                                      <Chip label="✓" size="small" color="success" />
                                    )}
                                  </Box>
                                }
                                secondary={
                                  <Box sx={{ mt: 0.5 }}>
                                    <Typography variant="caption" color="text.secondary">
                                      Серии: {exerciseLog.actualSets} • Повторения: {exerciseLog.actualReps}
                                      {exerciseLog.actualWeight && ` • Тегло: ${exerciseLog.actualWeight} кг`}
                                      {exerciseLog.actualRpe && ` • RPE: ${exerciseLog.actualRpe}/10`}
                                    </Typography>
                                    {exerciseLog.notes && (
                                      <Typography variant="caption" display="block" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                                        💡 {exerciseLog.notes}
                                      </Typography>
                                    )}
                                  </Box>
                                }
                              />
                            </ListItem>
                            {index < workout.exerciseLogs!.length - 1 && <Divider />}
                          </React.Fragment>
                        ))}
                      </List>
                    </>
                  ) : (
                    <Typography variant="body2" color="text.secondary">
                      Няма записи за упражнения
                    </Typography>
                  )}

                  {workout.notes && (
                    <Box sx={{ mt: 2, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
                      <Typography variant="body2" color="text.secondary" gutterBottom>
                        Бележки:
                      </Typography>
                      <Typography variant="body2">
                        {workout.notes}
                      </Typography>
                    </Box>
                  )}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
        )}
      </Container>
    </Box>
  );
};
import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Alert,
  Chip,
  LinearProgress,
  Grid,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Rating,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Divider,
  CircularProgress,
} from '@mui/material';
import {
  ArrowBack,
  PlayArrow as StartIcon,
  Stop as StopIcon,
  Check as CheckIcon,
  ExpandMore as ExpandMoreIcon,
  Timer as TimerIcon,
  FitnessCenter as FitnessCenterIcon,
} from '@mui/icons-material';
import { WorkoutLog, CreateExerciseLogDto } from '../types/workout.types';
import { Program, ProgramSession } from '../types/program.types';
import { workoutService } from '../services/workoutService';

interface WorkoutSessionProps {
  program: Program;
  session: ProgramSession;
  onNavigateBack: () => void;
  onWorkoutCompleted: () => void;
}

interface ExerciseLogState {
  programExerciseId: number;
  actualSets: number;
  actualReps: string;
  actualWeight: string;
  actualRestPeriod: number | null;
  actualRpe: number | null;
  notes: string;
  isCompleted: boolean;
}

export const WorkoutSession: React.FC<WorkoutSessionProps> = ({
  program,
  session,
  onNavigateBack,
  onWorkoutCompleted,
}) => {
  const [workoutLog, setWorkoutLog] = useState<WorkoutLog | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isWorkoutStarted, setIsWorkoutStarted] = useState(false);
  const [workoutStartTime, setWorkoutStartTime] = useState<Date | null>(null);
  const [elapsedTime, setElapsedTime] = useState(0);
  const [showCompleteDialog, setShowCompleteDialog] = useState(false);
  const [workoutRating, setWorkoutRating] = useState<number | null>(null);
  const [workoutNotes, setWorkoutNotes] = useState('');

  // Initialize exercise log state
  const [exerciseLogs, setExerciseLogs] = useState<ExerciseLogState[]>(
    session.exercises?.map(ex => ({
      programExerciseId: ex.id,
      actualSets: ex.sets,
      actualReps: Array(ex.sets).fill('').join(','),
      actualWeight: ex.weight ? Array(ex.sets).fill(ex.weight.toString()).join(',') : '',
      actualRestPeriod: null,
      actualRpe: ex.rpe || null,
      notes: '',
      isCompleted: false,
    })) || []
  );

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorkoutStarted && workoutStartTime) {
      interval = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - workoutStartTime.getTime()) / 1000));
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isWorkoutStarted, workoutStartTime]);

  const formatTime = (seconds: number): string => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startWorkout = async () => {
    try {
      setLoading(true);
      const newWorkoutLog = await workoutService.startWorkout(session.id, workoutNotes);
      setWorkoutLog(newWorkoutLog);
      setIsWorkoutStarted(true);
      setWorkoutStartTime(new Date());
    } catch (err: any) {
      setError('Грешка при стартиране на тренировката');
      console.error('Failed to start workout:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateExerciseLog = (index: number, field: keyof ExerciseLogState, value: any) => {
    setExerciseLogs(prev => prev.map((log, i) =>
      i === index ? { ...log, [field]: value } : log
    ));
  };

  const toggleExerciseComplete = async (index: number) => {
    const exerciseLog = exerciseLogs[index];
    const newIsCompleted = !exerciseLog.isCompleted;

    updateExerciseLog(index, 'isCompleted', newIsCompleted);

    if (workoutLog && newIsCompleted) {
      try {
        // Save the exercise log to the backend when marked as completed
        const createExerciseLogDto: CreateExerciseLogDto = {
          programExerciseId: exerciseLog.programExerciseId,
          actualSets: exerciseLog.actualSets,
          actualReps: exerciseLog.actualReps,
          actualWeight: exerciseLog.actualWeight || undefined,
          actualRestPeriod: exerciseLog.actualRestPeriod || undefined,
          actualRpe: exerciseLog.actualRpe || undefined,
          notes: exerciseLog.notes || undefined,
          isCompleted: true,
        };

        await workoutService.addExerciseLog(workoutLog.id, createExerciseLogDto);
      } catch (err: any) {
        console.error('Failed to save exercise log:', err);
        // Revert the change if saving failed
        updateExerciseLog(index, 'isCompleted', !newIsCompleted);
        setError('Грешка при запазване на упражнението');
      }
    }
  };

  const completeWorkout = async () => {
    if (!workoutLog) return;

    try {
      setLoading(true);
      await workoutService.completeWorkout(workoutLog.id, workoutRating || undefined, workoutNotes);
      setShowCompleteDialog(false);
      onWorkoutCompleted();
    } catch (err: any) {
      setError('Грешка при завършване на тренировката');
      console.error('Failed to complete workout:', err);
    } finally {
      setLoading(false);
    }
  };

  const completedExercises = exerciseLogs.filter(log => log.isCompleted).length;
  const totalExercises = exerciseLogs.length;
  const progressPercentage = totalExercises > 0 ? (completedExercises / totalExercises) * 100 : 0;

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
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h6" component="div">
              {session.name}
            </Typography>
            <Typography variant="body2" sx={{ opacity: 0.8 }}>
              {program.name}
            </Typography>
          </Box>
          {isWorkoutStarted && (
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <TimerIcon />
              <Typography variant="body1">
                {formatTime(elapsedTime)}
              </Typography>
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {!isWorkoutStarted ? (
          // Pre-workout screen
          <Card sx={{ boxShadow: 3, mb: 3 }}>
            <CardContent sx={{ p: 4, textAlign: 'center' }}>
              <FitnessCenterIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
              <Typography variant="h4" gutterBottom>
                Готови ли сте да започнете?
              </Typography>
              <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                {session.name} - {totalExercises} упражнения
              </Typography>

              <TextField
                fullWidth
                multiline
                rows={3}
                label="Бележки за тренировката (опционално)"
                value={workoutNotes}
                onChange={(e) => setWorkoutNotes(e.target.value)}
                sx={{ mb: 3 }}
              />

              <Button
                variant="contained"
                size="large"
                startIcon={<StartIcon />}
                onClick={startWorkout}
                disabled={loading}
                sx={{ minWidth: 200 }}
              >
                {loading ? 'Стартиране...' : 'Започни тренировка'}
              </Button>
            </CardContent>
          </Card>
        ) : (
          // Active workout screen
          <>
            {/* Progress Card */}
            <Card sx={{ boxShadow: 3, mb: 3 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6">
                    Прогрес: {completedExercises} от {totalExercises}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {Math.round(progressPercentage)}% завършено
                  </Typography>
                </Box>
                <LinearProgress variant="determinate" value={progressPercentage} sx={{ height: 8, borderRadius: 4 }} />
              </CardContent>
            </Card>

            {/* Exercises */}
            {session.exercises?.map((programExercise, index) => {
              const exerciseLog = exerciseLogs[index];
              const isCompleted = exerciseLog?.isCompleted || false;

              return (
                <Accordion key={programExercise.id} sx={{ mb: 2 }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                      <IconButton
                        color={isCompleted ? 'success' : 'default'}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleExerciseComplete(index);
                        }}
                      >
                        <CheckIcon />
                      </IconButton>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="body1" fontWeight="500">
                          {programExercise.exercise.name}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {programExercise.sets} серии × {programExercise.reps} повторения
                          {programExercise.weight && ` @ ${programExercise.weight} кг`}
                        </Typography>
                      </Box>
                      {isCompleted && (
                        <Chip label="Завършено" size="small" color="success" />
                      )}
                    </Box>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Grid container spacing={2}>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          label="Изпълнени серии"
                          type="number"
                          value={exerciseLog?.actualSets || programExercise.sets}
                          onChange={(e) => updateExerciseLog(index, 'actualSets', parseInt(e.target.value))}
                          inputProps={{ min: 1 }}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          label="Повторения (разделени със запетая)"
                          placeholder="8,10,12"
                          value={exerciseLog?.actualReps || ''}
                          onChange={(e) => updateExerciseLog(index, 'actualReps', e.target.value)}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          label="Тегла (кг, разделени със запетая)"
                          placeholder="50,52.5,55"
                          value={exerciseLog?.actualWeight || ''}
                          onChange={(e) => updateExerciseLog(index, 'actualWeight', e.target.value)}
                        />
                      </Grid>
                      <Grid size={6}>
                        <TextField
                          fullWidth
                          label="RPE (1-10)"
                          type="number"
                          value={exerciseLog?.actualRpe || ''}
                          onChange={(e) => updateExerciseLog(index, 'actualRpe', parseInt(e.target.value) || null)}
                          inputProps={{ min: 1, max: 10 }}
                        />
                      </Grid>
                      <Grid size={12}>
                        <TextField
                          fullWidth
                          multiline
                          rows={2}
                          label="Бележки за упражнението"
                          value={exerciseLog?.notes || ''}
                          onChange={(e) => updateExerciseLog(index, 'notes', e.target.value)}
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              );
            })}

            {/* Complete Workout Button */}
            <Card sx={{ boxShadow: 3, mt: 3 }}>
              <CardContent sx={{ textAlign: 'center' }}>
                <Button
                  variant="contained"
                  size="large"
                  startIcon={<StopIcon />}
                  onClick={() => setShowCompleteDialog(true)}
                  color="success"
                  sx={{ minWidth: 200 }}
                >
                  Завърши тренировка
                </Button>
              </CardContent>
            </Card>
          </>
        )}
      </Container>

      {/* Complete Workout Dialog */}
      <Dialog open={showCompleteDialog} onClose={() => setShowCompleteDialog(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Завършване на тренировка</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 2 }}>
            <Typography variant="body1" gutterBottom>
              Как се чувствахте по време на тренировката?
            </Typography>
            <Rating
              value={workoutRating}
              onChange={(_, newValue) => setWorkoutRating(newValue)}
              size="large"
              sx={{ mb: 3 }}
            />

            <TextField
              fullWidth
              multiline
              rows={4}
              label="Общи бележки за тренировката"
              value={workoutNotes}
              onChange={(e) => setWorkoutNotes(e.target.value)}
              placeholder="Как се чувствахте? Какво можеше да бъде по-добре?"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCompleteDialog(false)}>Отказ</Button>
          <Button onClick={completeWorkout} variant="contained" disabled={loading}>
            {loading ? <CircularProgress size={24} /> : 'Завърши'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
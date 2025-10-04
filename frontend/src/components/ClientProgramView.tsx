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
  Chip,
  Grid,
  Alert,
  Paper,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  List,
  ListItem,
  ListItemText,
  Divider,
  CircularProgress,
  Button,
} from '@mui/material';
import {
  ArrowBack,
  ExpandMore as ExpandMoreIcon,
  FitnessCenter as FitnessCenterIcon,
  Person as PersonIcon,
  Schedule as ScheduleIcon,
  Timeline as TimelineIcon,
  SportsMartialArts as SportsIcon,
  PlayArrow as PlayArrowIcon,
  History as HistoryIcon,
} from '@mui/icons-material';
import { Program, ProgramSession } from '../types/program.types';
import { programService } from '../services/programService';
import { DifficultyTranslations, DifficultyColors } from '../types/exercise.types';
import { GoalTranslations } from '../types/program.types';
import { WorkoutSession } from './WorkoutSession';
import { WorkoutHistory } from './WorkoutHistory';

interface ClientProgramViewProps {
  onNavigateBack: () => void;
}

export const ClientProgramView: React.FC<ClientProgramViewProps> = ({ onNavigateBack }) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentView, setCurrentView] = useState<'programs' | 'workout-session' | 'workout-history'>('programs');
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [selectedSession, setSelectedSession] = useState<ProgramSession | null>(null);

  useEffect(() => {
    fetchMyPrograms();
  }, []);

  const fetchMyPrograms = async () => {
    try {
      setLoading(true);
      const myPrograms = await programService.getMyPrograms();
      setPrograms(myPrograms);
    } catch (err: any) {
      setError('Грешка при зареждане на програмите');
      console.error('Failed to fetch programs:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatRestPeriod = (seconds: number): string => {
    if (seconds < 60) {
      return `${seconds} сек.`;
    }
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    if (remainingSeconds === 0) {
      return `${minutes} мин.`;
    }
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')} мин.`;
  };

  const getTrainerName = (program: Program): string => {
    if (program.trainer.firstName || program.trainer.lastName) {
      return `${program.trainer.firstName || ''} ${program.trainer.lastName || ''}`.trim();
    }
    return program.trainer.username;
  };

  const handleStartWorkout = (program: Program, session: ProgramSession) => {
    setSelectedProgram(program);
    setSelectedSession(session);
    setCurrentView('workout-session');
  };

  const handleViewWorkoutHistory = () => {
    setCurrentView('workout-history');
  };

  const handleWorkoutCompleted = () => {
    setCurrentView('programs');
    setSelectedProgram(null);
    setSelectedSession(null);
  };

  const handleNavigateBack = () => {
    if (currentView === 'programs') {
      onNavigateBack();
    } else {
      setCurrentView('programs');
      setSelectedProgram(null);
      setSelectedSession(null);
    }
  };

  // Show workout session view
  if (currentView === 'workout-session' && selectedProgram && selectedSession) {
    return (
      <WorkoutSession
        program={selectedProgram}
        session={selectedSession}
        onNavigateBack={handleNavigateBack}
        onWorkoutCompleted={handleWorkoutCompleted}
      />
    );
  }

  // Show workout history view
  if (currentView === 'workout-history') {
    return (
      <WorkoutHistory
        onNavigateBack={handleNavigateBack}
      />
    );
  }

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
            onClick={handleNavigateBack}
            sx={{ mr: 2 }}
          >
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Моите програми
          </Typography>
          <IconButton
            color="inherit"
            onClick={handleViewWorkoutHistory}
            title="История на тренировките"
          >
            <HistoryIcon />
          </IconButton>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {programs.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center' }}>
            <FitnessCenterIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Няма назначени програми
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Вашият треньор все още не ви е назначил тренировъчна програма.
              Свържете се с него за повече информация.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {programs.map((program) => (
              <Grid size={12} key={program.id}>
                <Card sx={{ boxShadow: 3 }}>
                  <CardContent>
                    {/* Program Header */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h4" component="h1" gutterBottom>
                          {program.name}
                        </Typography>
                        {program.description && (
                          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                            {program.description}
                          </Typography>
                        )}
                      </Box>
                    </Box>

                    {/* Program Details */}
                    <Grid container spacing={2} sx={{ mb: 3 }}>
                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <PersonIcon color="primary" />
                          <Box>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Треньор
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {getTrainerName(program)}
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <ScheduleIcon color="primary" />
                          <Box>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Продължителност
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {program.duration} седмици
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <TimelineIcon color="primary" />
                          <Box>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Честота
                            </Typography>
                            <Typography variant="body2" fontWeight="500">
                              {program.sessionsPerWeek}x седмично
                            </Typography>
                          </Box>
                        </Box>
                      </Grid>

                      <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <SportsIcon color="primary" />
                          <Box>
                            <Typography variant="caption" display="block" color="text.secondary">
                              Ниво
                            </Typography>
                            <Chip
                              label={DifficultyTranslations[program.difficulty]}
                              size="small"
                              style={{
                                backgroundColor: DifficultyColors[program.difficulty],
                                color: 'white',
                                fontSize: '0.75rem'
                              }}
                            />
                          </Box>
                        </Box>
                      </Grid>
                    </Grid>

                    {/* Program Goals */}
                    {program.goals.length > 0 && (
                      <Box sx={{ mb: 3 }}>
                        <Typography variant="h6" gutterBottom>
                          Цели на програмата
                        </Typography>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                          {program.goals.map((goal, index) => (
                            <Chip
                              key={index}
                              label={GoalTranslations[goal as keyof typeof GoalTranslations]}
                              variant="outlined"
                              color="primary"
                            />
                          ))}
                        </Box>
                      </Box>
                    )}

                    {/* Program Sessions */}
                    {program.sessions && program.sessions.length > 0 && (
                      <Box>
                        <Typography variant="h6" gutterBottom>
                          Тренировъчни сесии
                        </Typography>
                        {program.sessions
                          .sort((a, b) => a.weekNumber - b.weekNumber || a.order - b.order)
                          .map((session) => (
                            <Accordion key={session.id} sx={{ mb: 1 }}>
                              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, width: '100%' }}>
                                  <Box sx={{ flexGrow: 1 }}>
                                    <Typography variant="body1" fontWeight="500">
                                      {session.name}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mt: 0.5 }}>
                                      <Chip
                                        label={`Седмица ${session.weekNumber}`}
                                        size="small"
                                        variant="outlined"
                                      />
                                      {session.restDay && (
                                        <Chip label="Почивен ден" size="small" color="secondary" />
                                      )}
                                    </Box>
                                  </Box>
                                  {!session.restDay && (
                                    <Button
                                      variant="contained"
                                      size="small"
                                      startIcon={<PlayArrowIcon />}
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleStartWorkout(program, session);
                                      }}
                                    >
                                      Започни
                                    </Button>
                                  )}
                                </Box>
                              </AccordionSummary>
                              <AccordionDetails>
                                {session.exercises && session.exercises.length > 0 ? (
                                  <List dense>
                                    {session.exercises
                                      .sort((a, b) => a.order - b.order)
                                      .map((programExercise, index) => (
                                        <React.Fragment key={programExercise.id}>
                                          <ListItem>
                                            <ListItemText
                                              primary={
                                                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                                  <Typography variant="body1" fontWeight="500">
                                                    {programExercise.exercise.name}
                                                  </Typography>
                                                  {programExercise.isSuperset && (
                                                    <Chip label="Суперсет" size="small" color="warning" />
                                                  )}
                                                </Box>
                                              }
                                              secondary={
                                                <Box sx={{ mt: 1 }}>
                                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 1 }}>
                                                    <Typography variant="body2" color="text.secondary">
                                                      <strong>Серии:</strong> {programExercise.sets}
                                                    </Typography>
                                                    <Typography variant="body2" color="text.secondary">
                                                      <strong>Повторения:</strong> {programExercise.reps}
                                                    </Typography>
                                                    {programExercise.weight && (
                                                      <Typography variant="body2" color="text.secondary">
                                                        <strong>Тегло:</strong> {programExercise.weight} кг
                                                      </Typography>
                                                    )}
                                                    <Typography variant="body2" color="text.secondary">
                                                      <strong>Почивка:</strong> {formatRestPeriod(programExercise.restPeriod)}
                                                    </Typography>
                                                    {programExercise.rpe && (
                                                      <Typography variant="body2" color="text.secondary">
                                                        <strong>RPE:</strong> {programExercise.rpe}/10
                                                      </Typography>
                                                    )}
                                                  </Box>
                                                  {programExercise.notes && (
                                                    <Typography variant="body2" color="primary" sx={{ fontStyle: 'italic' }}>
                                                      💡 {programExercise.notes}
                                                    </Typography>
                                                  )}
                                                </Box>
                                              }
                                            />
                                          </ListItem>
                                          {index < session.exercises!.length - 1 && <Divider />}
                                        </React.Fragment>
                                      ))}
                                  </List>
                                ) : (
                                  <Typography color="text.secondary">
                                    Няма упражнения в тази сесия
                                  </Typography>
                                )}
                              </AccordionDetails>
                            </Accordion>
                          ))}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
      </Container>
    </Box>
  );
};
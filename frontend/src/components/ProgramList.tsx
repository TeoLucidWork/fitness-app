import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  Card,
  CardContent,
  Chip,
  IconButton,
  Alert,
  Snackbar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  ContentCopy as CopyIcon,
  Close as CloseIcon,
} from '@mui/icons-material';

import { Program, GoalTranslations } from '../types/program.types';
import { DifficultyTranslations, DifficultyColors } from '../types/exercise.types';
import { programService } from '../services/programService';

interface ProgramListProps {
  onNavigateBack: () => void;
  onCreateProgram: () => void;
  onEditProgram: (programId: number) => void;
  onViewProgram: (programId: number) => void;
}

export const ProgramList: React.FC<ProgramListProps> = ({
  onNavigateBack,
  onCreateProgram,
  onEditProgram,
  onViewProgram,
}) => {
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedProgram, setSelectedProgram] = useState<Program | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showCopyDialog, setShowCopyDialog] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [formattedProgram, setFormattedProgram] = useState<string>('');

  useEffect(() => {
    loadPrograms();
  }, []);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      const data = await programService.getPrograms();
      
      // Load full details for each program including exercises
      const programsWithDetails = await Promise.all(
        data.map(async (program) => {
          try {
            return await programService.getProgram(program.id);
          } catch (error) {
            console.error(`Failed to load details for program ${program.id}:`, error);
            return program; // Return basic program data if details fail to load
          }
        })
      );
      
      setPrograms(programsWithDetails);
    } catch (err) {
      setError('Грешка при зареждане на програмите');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProgram = async () => {
    if (!selectedProgram) return;

    try {
      console.log(`Deleting program with ID: ${selectedProgram.id}`);
      await programService.deleteProgram(selectedProgram.id);
      
      // Update the programs list by removing the deleted program
      const updatedPrograms = programs.filter(p => p.id !== selectedProgram.id);
      setPrograms(updatedPrograms);
      
      // Close dialog and clear selection
      setShowDeleteDialog(false);
      setSelectedProgram(null);
      
      // Show success message
      console.log('Program deleted successfully');
      setDeleteSuccess(true);
      
    } catch (err: any) {
      console.error('Error deleting program:', err);
      
      // Provide more specific error messages based on the error type
      let errorMessage = 'Грешка при изтриване на програмата';
      
      if (err.response?.status === 401) {
        errorMessage = 'Нямате права за изтриване на тази програма';
      } else if (err.response?.status === 404) {
        errorMessage = 'Програмата не съществува';
      } else if (err.response?.status === 403) {
        errorMessage = 'Достъп отказан';
      } else if (err.response?.data?.message) {
        errorMessage = `Грешка: ${err.response.data.message}`;
      }
      
      setError(errorMessage);
      
      // Close the dialog even if deletion failed
      setShowDeleteDialog(false);
      setSelectedProgram(null);
    }
  };

  const formatProgramForCopy = (program: Program): string => {
    let formatted = `🏋️ **${program.name}**\n`;
    
    if (program.description) {
      formatted += `📝 ${program.description}\n`;
    }
    
    formatted += `\n📊 **Детайли:**\n`;
    formatted += `⏰ Продължителност: ${program.duration} седмици\n`;
    formatted += `📅 Тренировки: ${program.sessionsPerWeek} пъти в седмицата\n`;
    formatted += `🎯 Трудност: ${DifficultyTranslations[program.difficulty]}\n`;
    
    if (program.goals.length > 0) {
      const goalTexts = program.goals.map(goal => GoalTranslations[goal as keyof typeof GoalTranslations]).join(', ');
      formatted += `🎯 Цели: ${goalTexts}\n`;
    }
    
    formatted += `\n💪 **Упражнения:**\n`;
    
    if (program.sessions && program.sessions.length > 0) {
      program.sessions.forEach((session, sessionIndex) => {
        if (session.exercises && session.exercises.length > 0) {
          if (program.sessions!.length > 1) {
            formatted += `\n**${session.name}:**\n`;
          }
          
          session.exercises
            .sort((a, b) => a.order - b.order)
            .forEach((exercise, index) => {
              formatted += `${index + 1}. **${exercise.exercise.name}**\n`;
              formatted += `   • ${exercise.sets} серии x ${exercise.reps} повторения\n`;
              
              if (exercise.weight) {
                formatted += `   • Тегло: ${exercise.weight}кг\n`;
              }
              
              if (exercise.rpe) {
                formatted += `   • RPE: ${exercise.rpe}/10\n`;
              }
              
              if (exercise.tempo) {
                formatted += `   • Темпо: ${exercise.tempo}\n`;
              }
              
              if (exercise.notes) {
                formatted += `   • Бележки: ${exercise.notes}\n`;
              }
              
              formatted += '\n';
            });
        }
      });
    } else {
      formatted += 'Няма добавени упражнения\n';
    }
    
    formatted += `\n👨‍💼 Треньор: ${program.trainer.firstName} ${program.trainer.lastName}\n`;
    formatted += `📅 Създадена: ${new Date(program.createdAt).toLocaleDateString('bg-BG')}`;
    
    return formatted;
  };

  const handleCopyProgram = async (program: Program) => {
    try {
      // Get full program details with exercises
      const fullProgram = await programService.getProgram(program.id);
      const formatted = formatProgramForCopy(fullProgram);
      setFormattedProgram(formatted);
      setSelectedProgram(fullProgram);
      setShowCopyDialog(true);
    } catch (err) {
      setError('Грешка при зареждане на програмата');
    }
  };

  const handleCopyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(formattedProgram);
      setCopySuccess(true);
      setShowCopyDialog(false);
    } catch (err) {
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = formattedProgram;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      setCopySuccess(true);
      setShowCopyDialog(false);
    }
  };


  if (loading) {
    return (
      <Box sx={{ p: 3, textAlign: 'center' }}>
        <Typography>Зареждане на програми...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Програми ({programs.length})
          </Typography>
          <Box sx={{ display: 'flex', gap: 2 }}>
            <Button variant="outlined" onClick={onNavigateBack}>
              Назад
            </Button>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateProgram}
            >
              Нова програма
            </Button>
          </Box>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {programs.length === 0 ? (
          <Paper sx={{ p: 6, textAlign: 'center', color: 'text.secondary' }}>
            <Typography variant="h6" gutterBottom>
              Няма създадени програми
            </Typography>
            <Typography variant="body1" sx={{ mb: 3 }}>
              Създайте първата си тренировъчна програма
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={onCreateProgram}
              size="large"
            >
              Създай програма
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {programs.map((program) => (
              <Card key={program.id} sx={{ width: '100%' }}>
                <CardContent>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ flex: 1 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 1 }}>
                        <Typography variant="h5" component="div">
                          {program.name}
                        </Typography>
                        {program.client ? (
                          <Chip
                            label={`👤 ${program.client.firstName || program.client.username}`}
                            size="small"
                            color="success"
                            variant="filled"
                            sx={{ fontWeight: 'bold' }}
                          />
                        ) : (
                          <Chip
                            label="📋 Шаблон"
                            size="small"
                            color="default"
                            variant="outlined"
                          />
                        )}
                      </Box>
                      
                      {program.description && (
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                          {program.description}
                        </Typography>
                      )}

                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 2 }}>
                        <Chip
                          label={`${program.duration} седмици`}
                          size="small"
                          color="primary"
                        />
                        <Chip
                          label={`${program.sessionsPerWeek} тренировки/седмица`}
                          size="small"
                          color="primary"
                        />
                        <Chip
                          label={DifficultyTranslations[program.difficulty]}
                          size="small"
                          style={{
                            backgroundColor: DifficultyColors[program.difficulty],
                            color: 'white'
                          }}
                        />
                      </Box>

                      {program.goals.length > 0 && (
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                          {program.goals.map((goal) => (
                            <Chip
                              key={goal}
                              label={GoalTranslations[goal as keyof typeof GoalTranslations]}
                              size="small"
                              variant="outlined"
                            />
                          ))}
                        </Box>
                      )}

                      <Typography variant="caption" color="text.secondary">
                        Треньор: {program.trainer.firstName} {program.trainer.lastName}
                        {program.client ? (
                          <> • Клиент: {program.client.firstName ? `${program.client.firstName} ${program.client.lastName || ''}`.trim() : program.client.username}</>
                        ) : (
                          <> • Общ шаблон</>
                        )}
                        <> • Създадена: {new Date(program.createdAt).toLocaleDateString('bg-BG')}</>
                      </Typography>
                    </Box>
                    
                    <Box sx={{ display: 'flex', gap: 1, ml: 2 }}>
                      <IconButton
                        onClick={() => onEditProgram(program.id)}
                        color="primary"
                        title="Редактирай"
                      >
                        <EditIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => handleCopyProgram(program)}
                        color="secondary"
                        title="Копирай за споделяне"
                      >
                        <CopyIcon />
                      </IconButton>
                      <IconButton
                        onClick={() => {
                          setSelectedProgram(program);
                          setShowDeleteDialog(true);
                        }}
                        color="error"
                        title="Изтрий"
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </Box>
                  
                  <Divider sx={{ my: 2 }} />
                  
                  {/* Program Exercises */}
                  <Typography variant="h6" gutterBottom>
                    Упражнения
                  </Typography>
                  
                  {program.sessions && program.sessions.length > 0 ? (
                    <Box>
                      {program.sessions.map((session, sessionIndex) => (
                        <Box key={session.id} sx={{ mb: 3 }}>
                          {program.sessions!.length > 1 && (
                            <Typography variant="subtitle1" color="primary" gutterBottom>
                              {session.name}
                            </Typography>
                          )}
                          
                          {session.exercises && session.exercises.length > 0 ? (
                            <Box sx={{ display: 'grid', gap: 1 }}>
                              {session.exercises
                                .sort((a, b) => a.order - b.order)
                                .map((exercise, index) => (
                                  <Paper
                                    key={exercise.id}
                                    variant="outlined"
                                    sx={{ p: 2, backgroundColor: 'grey.50' }}
                                  >
                                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                                      <Box sx={{ flex: 1 }}>
                                        <Typography variant="subtitle2" gutterBottom>
                                          {index + 1}. {exercise.exercise.name}
                                        </Typography>
                                        
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                                          <Chip
                                            label={`${exercise.sets} серии`}
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                          />
                                          <Chip
                                            label={`${exercise.reps} повторения`}
                                            size="small"
                                            color="info"
                                            variant="outlined"
                                          />
                                          {exercise.weight && (
                                            <Chip
                                              label={`${exercise.weight}кг`}
                                              size="small"
                                              color="secondary"
                                              variant="outlined"
                                            />
                                          )}
                                          {exercise.rpe && (
                                            <Chip
                                              label={`RPE ${exercise.rpe}`}
                                              size="small"
                                              color="warning"
                                              variant="outlined"
                                            />
                                          )}
                                          {exercise.tempo && (
                                            <Chip
                                              label={`Темпо: ${exercise.tempo}`}
                                              size="small"
                                              variant="outlined"
                                            />
                                          )}
                                        </Box>
                                        
                                        {exercise.notes && (
                                          <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic' }}>
                                            💬 {exercise.notes}
                                          </Typography>
                                        )}
                                      </Box>
                                    </Box>
                                  </Paper>
                                ))
                              }
                            </Box>
                          ) : (
                            <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                              Няма упражнения в тази сесия
                            </Typography>
                          )}
                        </Box>
                      ))}
                    </Box>
                  ) : (
                    <Typography color="text.secondary" sx={{ fontStyle: 'italic' }}>
                      Няма добавени упражнения
                    </Typography>
                  )}
                </CardContent>

              </Card>
            ))}
          </Box>
        )}
      </Paper>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={showDeleteDialog}
        onClose={() => setShowDeleteDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Потвърдете изтриването
        </DialogTitle>
        <DialogContent>
          <Typography>
            Сигурни ли сте, че искате да изтриете програмата "{selectedProgram?.name}"?
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Това действие не може да бъде отменено.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowDeleteDialog(false)}>
            Отказ
          </Button>
          <Button
            onClick={handleDeleteProgram}
            variant="contained"
            color="error"
          >
            Изтрий
          </Button>
        </DialogActions>
      </Dialog>

      {/* Copy Dialog */}
      <Dialog
        open={showCopyDialog}
        onClose={() => setShowCopyDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Копирай програма за споделяне
            <IconButton onClick={() => setShowCopyDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Натиснете "Копирай" за да копирате форматираният текст в клипборда за лесно споделяне в Viber, Messenger или други приложения.
          </Typography>
          <Paper
            sx={{
              p: 2,
              backgroundColor: 'grey.50',
              maxHeight: 400,
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              whiteSpace: 'pre-line'
            }}
          >
            {formattedProgram}
          </Paper>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCopyDialog(false)}>
            Затвори
          </Button>
          <Button
            onClick={handleCopyToClipboard}
            variant="contained"
            startIcon={<CopyIcon />}
          >
            Копирай в клипборда
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbars */}
      <Snackbar
        open={copySuccess}
        autoHideDuration={3000}
        onClose={() => setCopySuccess(false)}
        message="Програмата е копирана в клипборда!"
      />
      
      <Snackbar
        open={deleteSuccess}
        autoHideDuration={3000}
        onClose={() => setDeleteSuccess(false)}
        message="Програмата е изтрита успешно!"
      />
    </Box>
  );
};
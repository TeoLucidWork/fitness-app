import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Autocomplete,
  Divider,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  DragIndicator as DragIcon,
  Search as SearchIcon,
  Close as CloseIcon,
} from '@mui/icons-material';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import {
  useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { Exercise, ExerciseFilters, ExerciseDifficulty, CategoryTranslations, DifficultyTranslations } from '../types/exercise.types';
import { ProgramExerciseConfig, CreateProgramDto, PROGRAM_GOALS, GoalTranslations } from '../types/program.types';
import { User } from '../types/auth.types';
import { exerciseService } from '../services/exerciseService';
import { programService } from '../services/programService';
import { userService } from '../services/userService';

interface ProgramBuilderProps {
  programId?: number | null;
  onNavigateBack: () => void;
  onProgramSaved: () => void;
}

interface SortableExerciseItemProps {
  exerciseConfig: ProgramExerciseConfig;
  onEdit: (exercise: ProgramExerciseConfig) => void;
  onDelete: (index: number) => void;
  index: number;
}

function SortableExerciseItem({ exerciseConfig, onEdit, onDelete, index }: SortableExerciseItemProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({ id: exerciseConfig.exercise.id.toString() + index });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <Card
      ref={setNodeRef}
      style={style}
      sx={{ mb: 2 }}
    >
      <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
        <IconButton {...attributes} {...listeners} size="small">
          <DragIcon />
        </IconButton>
        
        <Box sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="div" gutterBottom>
            {exerciseConfig.exercise.name}
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, alignItems: 'center', flexWrap: 'wrap' }}>
            <Chip
              label={`${exerciseConfig.sets} sets`}
              size="small"
              color="primary"
            />
            <Chip
              label={`${exerciseConfig.reps} reps`}
              size="small"
              color="primary"
            />
            {exerciseConfig.weight && (
              <Chip
                label={`${exerciseConfig.weight}kg`}
                size="small"
                color="secondary"
              />
            )}
            {exerciseConfig.rpe && (
              <Chip
                label={`RPE ${exerciseConfig.rpe}`}
                size="small"
                color="warning"
              />
            )}
            {exerciseConfig.tempo && (
              <Chip
                label={exerciseConfig.tempo}
                size="small"
                variant="outlined"
              />
            )}
          </Box>
          {exerciseConfig.notes && (
            <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
              Бележки: {exerciseConfig.notes}
            </Typography>
          )}
        </Box>

        <Button
          variant="outlined"
          size="small"
          onClick={() => onEdit(exerciseConfig)}
        >
          Редактирай
        </Button>
        <IconButton
          onClick={() => onDelete(index)}
          color="error"
          size="small"
        >
          <DeleteIcon />
        </IconButton>
      </CardContent>
    </Card>
  );
}

export const ProgramBuilder: React.FC<ProgramBuilderProps> = ({
  programId,
  onNavigateBack,
  onProgramSaved,
}) => {
  const [programName, setProgramName] = useState('');
  const [programDescription, setProgramDescription] = useState('');
  const [duration, setDuration] = useState(4);
  const [sessionsPerWeek, setSessionsPerWeek] = useState(3);
  const [difficulty, setDifficulty] = useState<ExerciseDifficulty>(ExerciseDifficulty.INTERMEDIATE);
  const [goals, setGoals] = useState<string[]>([]);
  const [selectedClient, setSelectedClient] = useState<User | null>(null);
  const [clients, setClients] = useState<User[]>([]);
  const [clientSearchTerm, setClientSearchTerm] = useState('');
  
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<ProgramExerciseConfig[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filters] = useState<ExerciseFilters>({});
  
  const [showExerciseDialog, setShowExerciseDialog] = useState(false);
  const [showConfigDialog, setShowConfigDialog] = useState(false);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [editingExercise, setEditingExercise] = useState<ProgramExerciseConfig | null>(null);
  
  const [exerciseConfig, setExerciseConfig] = useState({
    sets: 3,
    reps: '8-12',
    weight: undefined as number | undefined,
    rpe: undefined as number | undefined,
    tempo: '',
    notes: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    loadExercises();
    loadClients();
    if (programId) {
      loadProgram(programId);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [programId]);

  const loadExercises = async () => {
    try {
      const data = await exerciseService.getExercises(filters);
      setExercises(data);
    } catch (err) {
      setError('Грешка при зареждане на упражненията');
    }
  };

  const loadClients = async () => {
    try {
      const data = await userService.getClients();
      setClients(data);
    } catch (err) {
      console.warn('Грешка при зареждане на клиентите:', err);
    }
  };

  const loadProgram = async (id: number) => {
    try {
      const program = await programService.getProgram(id);
      setProgramName(program.name);
      setProgramDescription(program.description || '');
      setDuration(program.duration);
      setSessionsPerWeek(program.sessionsPerWeek);
      setDifficulty(program.difficulty);
      setGoals(program.goals);
      
      // Load exercises from first session (simplified for now)
      if (program.sessions && program.sessions[0]?.exercises) {
        const configs = program.sessions[0].exercises.map((pe, index) => ({
          exercise: pe.exercise,
          sets: pe.sets,
          reps: pe.reps,
          weight: pe.weight,
          rpe: pe.rpe,
          tempo: pe.tempo,
          notes: pe.notes,
          order: index + 1,
        }));
        setSelectedExercises(configs);
      }
    } catch (err) {
      setError('Грешка при зареждане на програмата');
    }
  };

  const filteredExercises = exercises.filter(exercise =>
    exercise.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (exercise.nameEn && exercise.nameEn.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleAddExercise = (exercise: Exercise) => {
    setSelectedExercise(exercise);
    setExerciseConfig({
      sets: 3,
      reps: '8-12',
      weight: undefined,
      rpe: undefined,
      tempo: '',
      notes: '',
    });
    setShowConfigDialog(true);
    setShowExerciseDialog(false);
  };

  const handleSaveExerciseConfig = () => {
    if (selectedExercise) {
      const config: ProgramExerciseConfig = {
        exercise: selectedExercise,
        ...exerciseConfig,
        order: selectedExercises.length + 1,
      };
      
      if (editingExercise) {
        const index = selectedExercises.findIndex(e => e.exercise.id === editingExercise.exercise.id);
        const updated = [...selectedExercises];
        updated[index] = { ...config, order: editingExercise.order };
        setSelectedExercises(updated);
        setEditingExercise(null);
      } else {
        setSelectedExercises([...selectedExercises, config]);
      }
      
      setShowConfigDialog(false);
      setSelectedExercise(null);
    }
  };

  const handleEditExercise = (exercise: ProgramExerciseConfig) => {
    setSelectedExercise(exercise.exercise);
    setExerciseConfig({
      sets: exercise.sets,
      reps: exercise.reps,
      weight: exercise.weight,
      rpe: exercise.rpe,
      tempo: exercise.tempo || '',
      notes: exercise.notes || '',
    });
    setEditingExercise(exercise);
    setShowConfigDialog(true);
  };

  const handleDeleteExercise = (index: number) => {
    const updated = selectedExercises.filter((_, i) => i !== index);
    setSelectedExercises(updated.map((e, i) => ({ ...e, order: i + 1 })));
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setSelectedExercises((items) => {
        const oldIndex = items.findIndex((item) => 
          (item.exercise.id.toString() + items.indexOf(item)) === active.id
        );
        const newIndex = items.findIndex((item) => 
          (item.exercise.id.toString() + items.indexOf(item)) === over?.id
        );

        const newItems = arrayMove(items, oldIndex, newIndex);
        return newItems.map((item, index) => ({ ...item, order: index + 1 }));
      });
    }
  };

  const handleSaveProgram = async () => {
    if (!selectedClient) {
      setError('Моля изберете клиент');
      return;
    }

    if (!programName.trim()) {
      setError('Моля въведете име на програмата');
      return;
    }

    if (selectedExercises.length === 0) {
      setError('Моля добавете поне едно упражнение');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const programData: CreateProgramDto = {
        name: programName,
        description: programDescription,
        duration,
        sessionsPerWeek,
        difficulty,
        goals,
        clientId: selectedClient.id,
        isTemplate: false,
        isActive: true,
      };

      let savedProgram;
      if (programId) {
        savedProgram = await programService.updateProgram(programId, programData);
      } else {
        savedProgram = await programService.createProgram(programData);
      }

      // Create a basic session with all exercises
      const session = await programService.addSession(savedProgram.id, {
        name: 'Тренировка 1',
        weekNumber: 1,
        order: 1,
        restDay: false,
      });

      // Add exercises to session
      for (const exerciseConfig of selectedExercises) {
        await programService.addExerciseToSession(session.id, {
          exerciseId: exerciseConfig.exercise.id,
          order: exerciseConfig.order,
          sets: exerciseConfig.sets,
          reps: exerciseConfig.reps,
          weight: exerciseConfig.weight,
          restPeriod: 60, // default 60 seconds
          tempo: exerciseConfig.tempo,
          rpe: exerciseConfig.rpe,
          notes: exerciseConfig.notes,
          isSuperset: false,
        });
      }

      onProgramSaved();
    } catch (err) {
      setError('Грешка при запазване на програмата');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            {programId ? 'Редактирай програма' : 'Създай програма'}
          </Typography>
          <Button variant="outlined" onClick={onNavigateBack}>
            Назад
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Grid container spacing={3}>
          <Grid size={12}>
            <Autocomplete
              options={clients}
              getOptionLabel={(option) => `${option.firstName || ''} ${option.lastName || ''} (${option.email})`.trim()}
              value={selectedClient}
              onChange={(_, newValue) => setSelectedClient(newValue)}
              onInputChange={(_, newInputValue) => setClientSearchTerm(newInputValue)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Избери клиент"
                  placeholder="Търси по име или имейл..."
                  margin="normal"
                  required
                />
              )}
              renderOption={(props, option) => (
                <Box component="li" {...props}>
                  <Box>
                    <Typography variant="body1">
                      {option.firstName || ''} {option.lastName || ''}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {option.email}
                    </Typography>
                  </Box>
                </Box>
              )}
              noOptionsText="Няма намерени клиенти"
              isOptionEqualToValue={(option, value) => option.id === value.id}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Име на програмата"
              value={programName}
              onChange={(e) => setProgramName(e.target.value)}
              margin="normal"
              required
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Продължителност (седмици)"
              type="number"
              value={duration}
              onChange={(e) => setDuration(Number(e.target.value))}
              margin="normal"
              inputProps={{ min: 1, max: 52 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <TextField
              fullWidth
              label="Тренировки на седмица"
              type="number"
              value={sessionsPerWeek}
              onChange={(e) => setSessionsPerWeek(Number(e.target.value))}
              margin="normal"
              inputProps={{ min: 1, max: 7 }}
            />
          </Grid>
          <Grid size={{ xs: 12, md: 6 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Трудност</InputLabel>
              <Select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as ExerciseDifficulty)}
                label="Трудност"
              >
                {Object.values(ExerciseDifficulty).map((diff) => (
                  <MenuItem key={diff} value={diff}>
                    {DifficultyTranslations[diff]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
          <Grid size={12}>
            <Autocomplete
              multiple
              options={PROGRAM_GOALS}
              getOptionLabel={(option) => GoalTranslations[option as keyof typeof GoalTranslations]}
              value={goals}
              onChange={(_, newValue) => setGoals(newValue)}
              renderTags={(value, getTagProps) =>
                value.map((option, index) => (
                  <Chip
                    variant="outlined"
                    label={GoalTranslations[option as keyof typeof GoalTranslations]}
                    {...getTagProps({ index })}
                    key={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Цели"
                  placeholder="Изберете цели"
                  margin="normal"
                />
              )}
            />
          </Grid>
          <Grid size={12}>
            <TextField
              fullWidth
              label="Описание"
              value={programDescription}
              onChange={(e) => setProgramDescription(e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
          <Typography variant="h5" component="h2">
            Упражнения ({selectedExercises.length})
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => setShowExerciseDialog(true)}
          >
            Добави упражнение
          </Button>
        </Box>

        {selectedExercises.length === 0 ? (
          <Paper sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
            <Typography>Няма добавени упражнения</Typography>
            <Typography variant="body2">
              Натиснете "Добави упражнение" за да започнете
            </Typography>
          </Paper>
        ) : (
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={selectedExercises.map((e, i) => e.exercise.id.toString() + i)}
              strategy={verticalListSortingStrategy}
            >
              {selectedExercises.map((exerciseConfig, index) => (
                <SortableExerciseItem
                  key={exerciseConfig.exercise.id.toString() + index}
                  exerciseConfig={exerciseConfig}
                  onEdit={handleEditExercise}
                  onDelete={handleDeleteExercise}
                  index={index}
                />
              ))}
            </SortableContext>
          </DndContext>
        )}

        <Box sx={{ mt: 3, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onNavigateBack}>
            Отказ
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveProgram}
            disabled={loading || !selectedClient || !programName.trim() || selectedExercises.length === 0}
          >
            {loading ? 'Запазване...' : 'Запази програма'}
          </Button>
        </Box>
      </Paper>

      {/* Exercise Selection Dialog */}
      <Dialog
        open={showExerciseDialog}
        onClose={() => setShowExerciseDialog(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            Избери упражнение
            <IconButton onClick={() => setShowExerciseDialog(false)}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            placeholder="Търси упражнения..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            InputProps={{
              startAdornment: <SearchIcon sx={{ mr: 1, color: 'text.secondary' }} />,
            }}
            margin="normal"
          />
          
          <Box sx={{ mt: 2, maxHeight: 400, overflow: 'auto' }}>
            {filteredExercises.map((exercise) => (
              <Card
                key={exercise.id}
                sx={{ mb: 1, cursor: 'pointer' }}
                onClick={() => handleAddExercise(exercise)}
              >
                <CardContent sx={{ py: 2 }}>
                  <Typography variant="h6" component="div">
                    {exercise.name}
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                    <Chip
                      label={CategoryTranslations[exercise.category]}
                      size="small"
                      color="primary"
                    />
                    <Chip
                      label={DifficultyTranslations[exercise.difficulty]}
                      size="small"
                      style={{ backgroundColor: DifficultyTranslations[exercise.difficulty] === 'Начинаещ' ? '#4CAF50' : DifficultyTranslations[exercise.difficulty] === 'Среден' ? '#FF9800' : '#F44336', color: 'white' }}
                    />
                  </Box>
                </CardContent>
              </Card>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Exercise Configuration Dialog */}
      <Dialog
        open={showConfigDialog}
        onClose={() => setShowConfigDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          Конфигурирай упражнение
          {selectedExercise && (
            <Typography variant="subtitle1" color="text.secondary">
              {selectedExercise.name}
            </Typography>
          )}
        </DialogTitle>
        <DialogContent>
          <Grid container spacing={2}>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Серии"
                type="number"
                value={exerciseConfig.sets}
                onChange={(e) => setExerciseConfig({ ...exerciseConfig, sets: Number(e.target.value) })}
                margin="normal"
                inputProps={{ min: 1, max: 50 }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Повторения"
                value={exerciseConfig.reps}
                onChange={(e) => setExerciseConfig({ ...exerciseConfig, reps: e.target.value })}
                margin="normal"
                placeholder="например: 8-12, 10, AMRAP"
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="Тегло (кг)"
                type="number"
                value={exerciseConfig.weight || ''}
                onChange={(e) => setExerciseConfig({ ...exerciseConfig, weight: e.target.value ? Number(e.target.value) : undefined })}
                margin="normal"
                inputProps={{ min: 0, step: 0.5 }}
              />
            </Grid>
            <Grid size={6}>
              <TextField
                fullWidth
                label="RPE (1-10)"
                type="number"
                value={exerciseConfig.rpe || ''}
                onChange={(e) => setExerciseConfig({ ...exerciseConfig, rpe: e.target.value ? Number(e.target.value) : undefined })}
                margin="normal"
                inputProps={{ min: 1, max: 10 }}
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Темпо"
                value={exerciseConfig.tempo}
                onChange={(e) => setExerciseConfig({ ...exerciseConfig, tempo: e.target.value })}
                margin="normal"
                placeholder="например: 3-1-2-1"
              />
            </Grid>
            <Grid size={12}>
              <TextField
                fullWidth
                label="Бележки от треньора"
                value={exerciseConfig.notes}
                onChange={(e) => setExerciseConfig({ ...exerciseConfig, notes: e.target.value })}
                margin="normal"
                multiline
                rows={3}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowConfigDialog(false)}>
            Отказ
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveExerciseConfig}
            disabled={!exerciseConfig.sets || !exerciseConfig.reps}
          >
            {editingExercise ? 'Актуализирай' : 'Добави'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
import React, { useState } from 'react';
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  IconButton,
  Alert,
  Autocomplete,
  Divider,
  Stack,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  ArrowBack as ArrowBackIcon,
} from '@mui/icons-material';
import {
  ExerciseCategory,
  ExerciseDifficulty,
  CategoryTranslations,
  DifficultyTranslations,
} from '../types/exercise.types';
import { exerciseService } from '../services/exerciseService';

interface ExerciseBuilderProps {
  onNavigateBack: () => void;
  onExerciseSaved: () => void;
}

// Common muscle groups options
const MUSCLE_GROUPS = [
  'Гърди', 'Горни гърди', 'Долни гърди',
  'Гръб', 'Латерални', 'Рамбоиди', 'Трапец',
  'Предни крака', 'Задни крака', 'Глутеуси', 'Прасци', 'Седалище',
  'Предни рамене', 'Задни рамене', 'Странични рамене',
  'Бицепс', 'Трицепс', 'Предмишници',
  'Горни коремни', 'Долни коремни', 'Странични коремни',
  'Сърце', 'Цяло тяло'
];

// Common equipment options
const EQUIPMENT_OPTIONS = [
  'Телесно тегло', 'Щанга', 'Дъмбели', 'Кетълбели',
  'Лента за съпротивление', 'Машина', 'Кабел машина',
  'Лост', 'Топка за упражнения', 'TRX', 'Паралелки',
  'Тегловна жилетка', 'Медицинска топка', 'Боксов чувал',
  'Въже за скачане', 'Стъпки', 'Борила'
];

export const ExerciseBuilder: React.FC<ExerciseBuilderProps> = ({
  onNavigateBack,
  onExerciseSaved,
}) => {
  const [exerciseData, setExerciseData] = useState({
    name: '',
    nameEn: '',
    description: '',
    category: ExerciseCategory.CHEST,
    difficulty: ExerciseDifficulty.INTERMEDIATE,
    muscleGroups: [] as string[],
    equipment: [] as string[],
    videoUrl: '',
    thumbnailUrl: '',
    instructions: [''],
    tips: [''],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (field: string, value: any) => {
    setExerciseData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayFieldChange = (field: 'instructions' | 'tips', index: number, value: string) => {
    const newArray = [...exerciseData[field]];
    newArray[index] = value;
    setExerciseData(prev => ({
      ...prev,
      [field]: newArray
    }));
  };

  const addArrayField = (field: 'instructions' | 'tips') => {
    setExerciseData(prev => ({
      ...prev,
      [field]: [...prev[field], '']
    }));
  };

  const removeArrayField = (field: 'instructions' | 'tips', index: number) => {
    if (exerciseData[field].length > 1) {
      const newArray = exerciseData[field].filter((_, i) => i !== index);
      setExerciseData(prev => ({
        ...prev,
        [field]: newArray
      }));
    }
  };

  const handleSave = async () => {
    // Validate required fields
    if (!exerciseData.name.trim()) {
      setError('Моля въведете име на упражнението');
      return;
    }

    if (exerciseData.muscleGroups.length === 0) {
      setError('Моля изберете поне една мускулна група');
      return;
    }

    if (exerciseData.equipment.length === 0) {
      setError('Моля изберете поне едно оборудване');
      return;
    }

    const filteredInstructions = exerciseData.instructions.filter(inst => inst.trim());
    if (filteredInstructions.length === 0) {
      setError('Моля добавете поне една инструкция');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const exerciseToCreate = {
        ...exerciseData,
        instructions: filteredInstructions,
        tips: exerciseData.tips.filter(tip => tip.trim()),
        isActive: true,
      };

      await exerciseService.createExercise(exerciseToCreate);
      setSuccess(true);
      setTimeout(() => {
        onExerciseSaved();
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Грешка при създаване на упражнението');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <Box sx={{ p: 3 }}>
        <Paper sx={{ p: 4, textAlign: 'center' }}>
          <Typography variant="h4" color="success.main" gutterBottom>
            ✅ Упражнението е създадено успешно!
          </Typography>
          <Typography variant="body1">
            Пренасочване...
          </Typography>
        </Paper>
      </Box>
    );
  }

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onNavigateBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Добави ново упражнение
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Basic Information */}
          <Box>
            <Typography variant="h6" gutterBottom>
              Основна информация
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2, mb: 2 }}>
              <TextField
                fullWidth
                label="Име на упражнението *"
                value={exerciseData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                margin="normal"
                required
              />
              <TextField
                fullWidth
                label="Име на английски"
                value={exerciseData.nameEn}
                onChange={(e) => handleInputChange('nameEn', e.target.value)}
                margin="normal"
              />
            </Box>
            <TextField
              fullWidth
              label="Описание"
              value={exerciseData.description}
              onChange={(e) => handleInputChange('description', e.target.value)}
              margin="normal"
              multiline
              rows={3}
            />
          </Box>

          {/* Category and Difficulty */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <FormControl fullWidth margin="normal">
              <InputLabel>Категория *</InputLabel>
              <Select
                value={exerciseData.category}
                onChange={(e) => handleInputChange('category', e.target.value)}
                label="Категория *"
              >
                {Object.values(ExerciseCategory).map((category) => (
                  <MenuItem key={category} value={category}>
                    {CategoryTranslations[category]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth margin="normal">
              <InputLabel>Трудност *</InputLabel>
              <Select
                value={exerciseData.difficulty}
                onChange={(e) => handleInputChange('difficulty', e.target.value)}
                label="Трудност *"
              >
                {Object.values(ExerciseDifficulty).map((difficulty) => (
                  <MenuItem key={difficulty} value={difficulty}>
                    {DifficultyTranslations[difficulty]}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>

          {/* Muscle Groups */}
          <Autocomplete
            multiple
            options={MUSCLE_GROUPS}
            value={exerciseData.muscleGroups}
            onChange={(_, newValue) => handleInputChange('muscleGroups', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Мускулни групи *"
                placeholder="Изберете мускулни групи"
                margin="normal"
                required
              />
            )}
          />

          {/* Equipment */}
          <Autocomplete
            multiple
            options={EQUIPMENT_OPTIONS}
            value={exerciseData.equipment}
            onChange={(_, newValue) => handleInputChange('equipment', newValue)}
            renderTags={(value, getTagProps) =>
              value.map((option, index) => (
                <Chip
                  variant="outlined"
                  label={option}
                  {...getTagProps({ index })}
                  key={option}
                />
              ))
            }
            renderInput={(params) => (
              <TextField
                {...params}
                label="Оборудване *"
                placeholder="Изберете необходимо оборудване"
                margin="normal"
                required
              />
            )}
          />

          {/* Media URLs */}
          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
            <TextField
              fullWidth
              label="YouTube видео URL"
              value={exerciseData.videoUrl}
              onChange={(e) => handleInputChange('videoUrl', e.target.value)}
              margin="normal"
              placeholder="https://www.youtube.com/watch?v=..."
            />
            <TextField
              fullWidth
              label="Thumbnail URL"
              value={exerciseData.thumbnailUrl}
              onChange={(e) => handleInputChange('thumbnailUrl', e.target.value)}
              margin="normal"
              placeholder="https://example.com/image.jpg"
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          {/* Instructions */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Инструкции за изпълнение *
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addArrayField('instructions')}
              >
                Добави стъпка
              </Button>
            </Box>
            <Stack spacing={2}>
              {exerciseData.instructions.map((instruction, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    label={`Стъпка ${index + 1}`}
                    value={instruction}
                    onChange={(e) => handleArrayFieldChange('instructions', index, e.target.value)}
                    multiline
                    rows={2}
                  />
                  {exerciseData.instructions.length > 1 && (
                    <IconButton
                      onClick={() => removeArrayField('instructions', index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>

          {/* Tips */}
          <Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Съвети и бележки
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon />}
                onClick={() => addArrayField('tips')}
              >
                Добави съвет
              </Button>
            </Box>
            <Stack spacing={2}>
              {exerciseData.tips.map((tip, index) => (
                <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <TextField
                    fullWidth
                    label={`Съвет ${index + 1}`}
                    value={tip}
                    onChange={(e) => handleArrayFieldChange('tips', index, e.target.value)}
                    multiline
                    rows={2}
                  />
                  {exerciseData.tips.length > 1 && (
                    <IconButton
                      onClick={() => removeArrayField('tips', index)}
                      color="error"
                    >
                      <DeleteIcon />
                    </IconButton>
                  )}
                </Box>
              ))}
            </Stack>
          </Box>
        </Stack>

        {/* Action Buttons */}
        <Box sx={{ mt: 4, display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
          <Button variant="outlined" onClick={onNavigateBack}>
            Отказ
          </Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={loading || !exerciseData.name.trim()}
          >
            {loading ? 'Създаване...' : 'Създай упражнение'}
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
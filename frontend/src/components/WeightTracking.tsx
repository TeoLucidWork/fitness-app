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
  Paper,
  CircularProgress,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  Divider,
  Chip,
  Fab,
  Grid,
} from '@mui/material';
import {
  ArrowBack,
  Scale as ScaleIcon,
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  TrendingUp,
  TrendingDown,
  TrendingFlat,
  Timeline as TimelineIcon,
} from '@mui/icons-material';
import { WeightEntry, CreateWeightEntryDto, UpdateWeightEntryDto, WeightStats } from '../types/weight.types';
import { weightService } from '../services/weightService';
import { WeightProgressChart } from './WeightProgressChart';

interface WeightTrackingProps {
  onNavigateBack: () => void;
  clientId?: number; // For trainers viewing client data
}

export const WeightTracking: React.FC<WeightTrackingProps> = ({ onNavigateBack, clientId }) => {
  const [entries, setEntries] = useState<WeightEntry[]>([]);
  const [stats, setStats] = useState<WeightStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [selectedEntry, setSelectedEntry] = useState<WeightEntry | null>(null);
  const [formData, setFormData] = useState({ weight: '', notes: '' });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchData();
  }, [clientId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [entriesData, statsData] = await Promise.all([
        weightService.getWeightEntries(clientId),
        weightService.getWeightStats(clientId)
      ]);
      setEntries(entriesData);
      setStats(statsData);
    } catch (err: any) {
      setError('Грешка при зареждане на данните за теглото');
      console.error('Failed to fetch weight data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddEntry = async () => {
    if (!formData.weight) return;

    try {
      setSubmitting(true);
      const data: CreateWeightEntryDto = {
        weight: parseFloat(formData.weight),
        notes: formData.notes || undefined,
      };
      await weightService.createWeightEntry(data);
      await fetchData();
      handleCloseAddDialog();
    } catch (err: any) {
      setError('Грешка при добавяне на записа');
      console.error('Failed to create weight entry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateEntry = async () => {
    if (!selectedEntry || !formData.weight) return;

    try {
      setSubmitting(true);
      const data: UpdateWeightEntryDto = {
        weight: parseFloat(formData.weight),
        notes: formData.notes || undefined,
      };
      await weightService.updateWeightEntry(selectedEntry.id, data);
      await fetchData();
      handleCloseEditDialog();
    } catch (err: any) {
      setError('Грешка при обновяване на записа');
      console.error('Failed to update weight entry:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteEntry = async (id: number) => {
    if (!window.confirm('Сигурни ли сте, че искате да изтриете този запис?')) {
      return;
    }

    try {
      await weightService.deleteWeightEntry(id);
      await fetchData();
    } catch (err: any) {
      setError('Грешка при изтриване на записа');
      console.error('Failed to delete weight entry:', err);
    }
  };

  const handleOpenAddDialog = () => {
    setFormData({ weight: '', notes: '' });
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
    setFormData({ weight: '', notes: '' });
  };

  const handleOpenEditDialog = (entry: WeightEntry) => {
    setSelectedEntry(entry);
    setFormData({ weight: entry.weight.toString(), notes: entry.notes || '' });
    setEditDialogOpen(true);
  };

  const handleCloseEditDialog = () => {
    setEditDialogOpen(false);
    setSelectedEntry(null);
    setFormData({ weight: '', notes: '' });
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getTrendIcon = (trend: string | null) => {
    switch (trend) {
      case 'increasing':
        return <TrendingUp color="error" />;
      case 'decreasing':
        return <TrendingDown color="success" />;
      case 'stable':
        return <TrendingFlat color="info" />;
      default:
        return null;
    }
  };

  const getTrendColor = (trend: string | null) => {
    switch (trend) {
      case 'increasing':
        return 'error';
      case 'decreasing':
        return 'success';
      case 'stable':
        return 'info';
      default:
        return 'default';
    }
  };

  const getTrendText = (trend: string | null) => {
    switch (trend) {
      case 'increasing':
        return 'Нарастващо';
      case 'decreasing':
        return 'Намаляващо';
      case 'stable':
        return 'Стабилно';
      default:
        return 'Няма данни';
    }
  };

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
            Проследяване на теглото
          </Typography>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Statistics Card */}
        {stats && (
          <Card sx={{ mb: 3 }}>
            <CardContent>
              <Typography variant="h5" gutterBottom>
                <ScaleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Статистика за теглото
              </Typography>

              <Grid container spacing={2}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="primary">
                      {stats.currentWeight ? `${stats.currentWeight} кг` : 'Няма данни'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Текущо тегло
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color={stats.weightChange && stats.weightChange > 0 ? 'error' : 'success'}>
                      {stats.weightChange ? `${stats.weightChange > 0 ? '+' : ''}${stats.weightChange.toFixed(1)} кг` : 'Няма данни'}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Промяна
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
                      {getTrendIcon(stats.trend)}
                      <Chip
                        label={getTrendText(stats.trend)}
                        color={getTrendColor(stats.trend) as any}
                        size="small"
                      />
                    </Box>
                    <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                      Тенденция
                    </Typography>
                  </Paper>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                  <Paper sx={{ p: 2, textAlign: 'center' }}>
                    <Typography variant="h4" color="info.main">
                      {stats.totalEntries}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Общо записи
                    </Typography>
                  </Paper>
                </Grid>
              </Grid>

              {stats.averageWeight && (
                <Box sx={{ mt: 2 }}>
                  <Grid container spacing={2}>
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">
                        Средно тегло: <strong>{stats.averageWeight} кг</strong>
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">
                        Най-ниско: <strong>{stats.lowestWeight} кг</strong>
                      </Typography>
                    </Grid>
                    <Grid size={4}>
                      <Typography variant="body2" color="text.secondary">
                        Най-високо: <strong>{stats.highestWeight} кг</strong>
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
              )}
            </CardContent>
          </Card>
        )}

        {/* Weight Progress Chart */}
        {entries.length > 0 && (
          <Box sx={{ mb: 3 }}>
            <WeightProgressChart clientId={clientId} />
          </Box>
        )}

        {/* Weight Entries List */}
        <Card>
          <CardContent>
            <Typography variant="h6" gutterBottom>
              История на записите
            </Typography>

            {entries.length === 0 ? (
              <Paper sx={{ p: 4, textAlign: 'center' }}>
                <ScaleIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  Няма записи за тегло
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Добавете първия си запис за тегло
                </Typography>
              </Paper>
            ) : (
              <List>
                {entries.map((entry, index) => (
                  <React.Fragment key={entry.id}>
                    <ListItem>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                            <Typography variant="h6" color="primary">
                              {entry.weight} кг
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {formatDate(entry.createdAt)}
                            </Typography>
                          </Box>
                        }
                        secondary={entry.notes}
                      />
                      {!clientId && (
                        <ListItemSecondaryAction>
                          <IconButton
                            edge="end"
                            aria-label="edit"
                            onClick={() => handleOpenEditDialog(entry)}
                            sx={{ mr: 1 }}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            edge="end"
                            aria-label="delete"
                            onClick={() => handleDeleteEntry(entry.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </ListItemSecondaryAction>
                      )}
                    </ListItem>
                    {index < entries.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            )}
          </CardContent>
        </Card>

        {/* Add Weight Entry FAB */}
        {!clientId && (
          <Fab
            color="primary"
            aria-label="add"
            sx={{ position: 'fixed', bottom: 16, right: 16 }}
            onClick={handleOpenAddDialog}
          >
            <AddIcon />
          </Fab>
        )}

        {/* Add Entry Dialog */}
        <Dialog open={addDialogOpen} onClose={handleCloseAddDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Добави нов запис за тегло</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Тегло (кг)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              inputProps={{ min: 20, max: 500, step: 0.1 }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Бележки (опционално)"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseAddDialog}>Отказ</Button>
            <Button
              onClick={handleAddEntry}
              variant="contained"
              disabled={!formData.weight || submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Добави'}
            </Button>
          </DialogActions>
        </Dialog>

        {/* Edit Entry Dialog */}
        <Dialog open={editDialogOpen} onClose={handleCloseEditDialog} maxWidth="sm" fullWidth>
          <DialogTitle>Редактирай запис за тегло</DialogTitle>
          <DialogContent>
            <TextField
              autoFocus
              margin="dense"
              label="Тегло (кг)"
              type="number"
              fullWidth
              variant="outlined"
              value={formData.weight}
              onChange={(e) => setFormData({ ...formData, weight: e.target.value })}
              inputProps={{ min: 20, max: 500, step: 0.1 }}
              sx={{ mb: 2 }}
            />
            <TextField
              margin="dense"
              label="Бележки (опционално)"
              multiline
              rows={3}
              fullWidth
              variant="outlined"
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleCloseEditDialog}>Отказ</Button>
            <Button
              onClick={handleUpdateEntry}
              variant="contained"
              disabled={!formData.weight || submitting}
            >
              {submitting ? <CircularProgress size={24} /> : 'Запази'}
            </Button>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};
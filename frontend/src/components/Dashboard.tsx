import React, { useEffect, useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  AppBar,
  Toolbar,
  Avatar,
  IconButton,
  Menu,
  MenuItem,
  Container,
  Chip,
  Divider,
  CardActions,
} from '@mui/material';
import { FitnessCenter, AccountCircle, ExitToApp, Add as AddIcon, Visibility as ViewIcon, Edit as EditIcon, Scale as ScaleIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { authService } from '../services/authService';
import { User } from '../types/auth.types';
import { Program, GoalTranslations } from '../types/program.types';
import { programService } from '../services/programService';
import { DifficultyTranslations, DifficultyColors } from '../types/exercise.types';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<User | null>(null);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loadingPrograms, setLoadingPrograms] = useState(false);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const userData = await authService.getProfile();
        setUser(userData);
        
        // If user is trainer, fetch their programs
        if (userData.role === 'TRAINER') {
          fetchPrograms();
        }
      } catch (error) {
        console.error('Failed to fetch user profile:', error);
        authService.logout();
        navigate('/login');
      }
    };

    fetchUser();
  }, [navigate]);

  const fetchPrograms = async () => {
    try {
      setLoadingPrograms(true);
      const programsData = await programService.getPrograms();
      setPrograms(programsData.slice(0, 3)); // Show only first 3 programs
    } catch (error) {
      console.error('Failed to fetch programs:', error);
    } finally {
      setLoadingPrograms(false);
    }
  };

  const handleMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    authService.logout();
    handleMenuClose();
    navigate('/login');
  };

  if (!user) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <Typography>Зареждане...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ flexGrow: 1 }}>
      {/* App Bar */}
      <AppBar position="static" elevation={1}>
        <Toolbar>
          <FitnessCenter sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1, fontWeight: 'bold' }}>
            ФитАпп
          </Typography>
          
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="body2" sx={{ mr: 2 }}>
              {user.firstName || user.username}
            </Typography>
            <IconButton
              size="large"
              edge="end"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleMenuOpen}
              color="inherit"
            >
              <Avatar sx={{ width: 32, height: 32 }}>
                <AccountCircle />
              </Avatar>
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorEl}
              anchorOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right',
              }}
              open={Boolean(anchorEl)}
              onClose={handleMenuClose}
            >
              <MenuItem onClick={handleLogout}>
                <ExitToApp sx={{ mr: 1 }} />
                Изход
              </MenuItem>
            </Menu>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Dashboard Content */}
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {/* Welcome Card */}
          <Card sx={{ boxShadow: 2 }}>
            <CardContent sx={{ p: 4 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <Box>
                  <Typography variant="h4" component="h1" gutterBottom>
                    Добре дошли отново, {user.firstName || user.username}! 👋
                  </Typography>
                  <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
                    Готови ли сте да продължите своето фитнес пътешествие?
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                    <Chip 
                      label={user.role === 'TRAINER' ? 'Персонален треньор' : 'Фитнес ентусиаст'} 
                      color={user.role === 'TRAINER' ? 'secondary' : 'primary'} 
                      variant="outlined"
                    />
                    <Chip label={user.email} variant="outlined" />
                  </Box>
                </Box>
              </Box>
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Box sx={{ 
            display: 'grid', 
            gridTemplateColumns: { xs: '1fr', md: '1fr 1fr 1fr' }, 
            gap: 3 
          }}>
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Тренировки тази седмица
                </Typography>
                <Typography variant="h3" color="primary.main">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Време е да се движим!
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  Общо сесии
                </Typography>
                <Typography variant="h3" color="secondary.main">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Вашето фитнес пътешествие започва оттук
                </Typography>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Typography variant="h6" component="h2" gutterBottom>
                  {user.role === 'TRAINER' ? 'Клиенти' : 'Лични рекорди'}
                </Typography>
                <Typography variant="h3" color="success.main">
                  0
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {user.role === 'TRAINER' ? 'Готови да помогнете на другите!' : 'Поставете си първата цел!'}
                </Typography>
              </CardContent>
            </Card>
          </Box>

          {/* Action Cards */}
          <Box sx={{
            display: 'grid',
            gridTemplateColumns: { xs: '1fr', md: user.role === 'TRAINER' ? '1fr 1fr 1fr 1fr' : '1fr 1fr 1fr' },
            gap: 3
          }}>
            <Card sx={{ boxShadow: 2, height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Начни тренировка
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  Начнете нова тренировка и проследявайте прогреса
                </Typography>
                <Button variant="contained" size="large" fullWidth>
                  Начни тренировка
                </Button>
              </CardContent>
            </Card>

            <Card sx={{ boxShadow: 2, height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  {user.role === 'TRAINER' ? 'Управление на клиенти' : 'Моите програми'}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  {user.role === 'TRAINER'
                    ? 'Преглед и управление на клиентските отношения'
                    : 'Прегледайте назначените ви тренировъчни програми'
                  }
                </Typography>
                {user.role === 'TRAINER' ? (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/client-list')}
                    >
                      Преглед клиенти
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/client-builder')}
                    >
                      Добави клиент
                    </Button>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/registration-links')}
                    >
                      Линкове за регистрация
                    </Button>
                  </Box>
                ) : (
                  <Button
                    variant="contained"
                    size="large"
                    fullWidth
                    onClick={() => navigate('/client-programs')}
                  >
                    Виж програми
                  </Button>
                )}
              </CardContent>
            </Card>

            {/* Weight Tracking Card */}
            <Card sx={{ boxShadow: 2, height: '100%' }}>
              <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                <Typography variant="h6" component="h2" gutterBottom>
                  <ScaleIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                  Проследяване на теглото
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                  Записвайте теглото си и следете прогреса
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  fullWidth
                  onClick={() => navigate('/weight-tracking')}
                >
                  Управление на теглото
                </Button>
              </CardContent>
            </Card>

            {/* Program Management Card - Only for Trainers */}
            {user.role === 'TRAINER' && (
              <Card sx={{ boxShadow: 2, height: '100%' }}>
                <CardContent sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
                  <Typography variant="h6" component="h2" gutterBottom>
                    Управление на програми
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flexGrow: 1 }}>
                    Създавайте и управлявайте тренировъчни програми за клиенти
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/programs')}
                    >
                      Управление на програми
                    </Button>
                    <Button
                      variant="contained"
                      size="large"
                      fullWidth
                      onClick={() => navigate('/exercise-builder')}
                      sx={{ mt: 1 }}
                    >
                      Добави упражнение
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            )}
          </Box>

          {/* Recent Programs Section - Only for Trainers */}
          {user.role === 'TRAINER' && (
            <Card sx={{ boxShadow: 2 }}>
              <CardContent>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                  <Typography variant="h6" component="h2">
                    Последни програми ({programs.length})
                  </Typography>
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => navigate('/programs')}
                    >
                      Виж всички
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/program-builder')}
                    >
                      Нова програма
                    </Button>
                  </Box>
                </Box>
                
                <Divider sx={{ mb: 2 }} />
                
                {loadingPrograms ? (
                  <Typography color="text.secondary">Зареждане на програми...</Typography>
                ) : programs.length === 0 ? (
                  <Box sx={{ textAlign: 'center', py: 4 }}>
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                      Няма създадени програми
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                      Създайте първата си тренировъчна програма
                    </Typography>
                    <Button
                      variant="contained"
                      startIcon={<AddIcon />}
                      onClick={() => navigate('/program-builder')}
                    >
                      Създай програма
                    </Button>
                  </Box>
                ) : (
                  <Box sx={{
                    display: 'grid',
                    gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fit, minmax(300px, 1fr))' },
                    gap: 2
                  }}>
                    {programs.map((program) => (
                      <Card key={program.id} variant="outlined" sx={{ height: 'fit-content' }}>
                        <CardContent sx={{ pb: 1 }}>
                          <Typography variant="h6" component="div" gutterBottom noWrap>
                            {program.name}
                          </Typography>
                          
                          {program.description && (
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>  
                              {program.description.length > 100 
                                ? `${program.description.substring(0, 100)}...` 
                                : program.description
                              }
                            </Typography>
                          )}
                          
                          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                            <Chip
                              label={`${program.duration} седм.`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
                            <Chip
                              label={`${program.sessionsPerWeek}x/седм.`}
                              size="small"
                              color="primary"
                              variant="outlined"
                            />
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
                          
                          {program.goals.length > 0 && (
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 1 }}>
                              {program.goals.slice(0, 2).map((goal) => (
                                <Chip
                                  key={goal}
                                  label={GoalTranslations[goal as keyof typeof GoalTranslations]}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              ))}
                              {program.goals.length > 2 && (
                                <Chip
                                  label={`+${program.goals.length - 2}`}
                                  size="small"
                                  variant="outlined"
                                  sx={{ fontSize: '0.7rem' }}
                                />
                              )}
                            </Box>
                          )}
                          
                          <Typography variant="caption" color="text.secondary">
                            Създадена: {new Date(program.createdAt).toLocaleDateString('bg-BG')}
                          </Typography>
                        </CardContent>
                        
                        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
                          <IconButton
                            size="small"
                            color="primary"
                            title="Преглед"
                            onClick={() => navigate('/programs')}
                          >
                            <ViewIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            size="small"
                            color="primary"
                            title="Редактирай"
                            onClick={() => navigate('/programs')}
                          >
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </CardActions>
                      </Card>
                    ))}
                  </Box>
                )}
              </CardContent>
            </Card>
          )}
        </Box>
      </Container>
    </Box>
  );
};
import React, { useState } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  CircularProgress,
  Container,
  InputAdornment,
  IconButton,
} from '@mui/material';
import { FitnessCenter, Login as LoginIcon, Visibility, VisibilityOff } from '@mui/icons-material';
import { authService } from '../services/authService';
import { LoginRequest } from '../types/auth.types';
import { LoginProps } from '../types/component.types';

export const Login: React.FC<LoginProps> = ({ onSuccess, onSwitchToRegister }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const loginData: LoginRequest = {
        email: formData.email,
        password: formData.password,
      };

      await authService.login(loginData);
      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Невалиден имейл или парола');
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          minHeight: '100vh',
          justifyContent: 'center',
          py: 3,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <FitnessCenter sx={{ fontSize: 40, color: 'primary.main', mr: 1 }} />
          <Typography variant="h4" component="h1" fontWeight="bold">
            ФитАпп
          </Typography>
        </Box>

        <Card sx={{ width: '100%', boxShadow: 3 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, justifyContent: 'center' }}>
              <LoginIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" fontWeight="600">
                Добре дошли отново
              </Typography>
            </Box>

            <Typography
              variant="body1"
              color="text.secondary"
              sx={{ textAlign: 'center', mb: 3 }}
            >
              Влезте в своето фитнес пътешествие
            </Typography>

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <TextField
                name="email"
                label="Имейл"
                type="email"
                value={formData.email}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                sx={{ mb: 2 }}
                autoComplete="email"
              />

              <TextField
                name="password"
                label="Парола"
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={handleChange}
                fullWidth
                variant="outlined"
                required
                sx={{ mb: 3 }}
                autoComplete="current-password"
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        aria-label="покажи/скрий парола"
                        onClick={handleTogglePasswordVisibility}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mb: 2, py: 1.5, borderRadius: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  'Влез'
                )}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Нямате акаунт?{' '}
                <Button
                  variant="text"
                  onClick={onSwitchToRegister}
                  sx={{ textTransform: 'none', p: 0 }}
                >
                  Създай акаунт
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>

        <Typography variant="caption" color="text.secondary" sx={{ mt: 3, textAlign: 'center' }}>
          Трансформирайте своето фитнес пътешествие с персонализирани тренировки и експертно ръководство
        </Typography>
      </Box>
    </Container>
  );
};
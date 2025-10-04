import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardContent,
  TextField,
  Button,
  Typography,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  CircularProgress,
  Container,
  SelectChangeEvent,
} from '@mui/material';
import { FitnessCenter, PersonAdd } from '@mui/icons-material';
import { authService } from '../services/authService';
import { RegisterRequest } from '../types/auth.types';
import { RegisterProps } from '../types/component.types';

export const Register: React.FC<RegisterProps> = ({ onSuccess, onSwitchToLogin }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    firstName: '',
    lastName: '',
    role: 'TRAINER' as 'USER' | 'TRAINER', // Default to TRAINER for direct registrations
  });
  const [registrationToken, setRegistrationToken] = useState<string | null>(null);
  const [trainerName, setTrainerName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    // Check for registration token in URL
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get('token');
    if (token) {
      setRegistrationToken(token);
      // Optionally validate token with backend
    }
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSelectChange = (e: SelectChangeEvent) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Паролите не съвпадат');
      setLoading(false);
      return;
    }

    if (formData.password.length < 6) {
      setError('Паролата трябва да бъде поне 6 знака');
      setLoading(false);
      return;
    }

    try {
      const registerData: RegisterRequest = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName || undefined,
        lastName: formData.lastName || undefined,
        role: registrationToken ? 'USER' : formData.role, // Force USER role when using trainer token
      };

      if (registrationToken) {
        // Register with trainer token
        const response = await fetch('http://localhost:3001/auth/register-with-token', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...registerData,
            token: registrationToken,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.message || 'Регистрацията не успя');
        }

        const data = await response.json();
        localStorage.setItem('token', data.access_token);
        localStorage.setItem('user', JSON.stringify(data.user));
      } else {
        // Regular registration
        await authService.register(registerData);
      }

      onSuccess();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Регистрацията не успя. Моля, опитайте отново.');
    } finally {
      setLoading(false);
    }
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
              <PersonAdd sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h5" component="h2" fontWeight="600">
                {registrationToken ? 'Регистрация по покана' : 'Регистрация за треньори'}
              </Typography>
            </Box>

            {registrationToken ? (
              <Alert severity="info" sx={{ mb: 2 }}>
                Регистрирате се по покана от персонален треньор. След регистрацията автоматично ще бъдете присвоени към треньора си.
              </Alert>
            ) : (
              <Alert severity="info" sx={{ mb: 2 }}>
                Регистрацията е достъпна само за персонални треньори. Клиентите получават покани за регистрация от своя треньор.
              </Alert>
            )}

            {error && (
              <Alert severity="error" sx={{ mb: 2 }}>
                {error}
              </Alert>
            )}

            <form onSubmit={handleSubmit}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Box sx={{ 
                  display: 'grid', 
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr' }, 
                  gap: 2 
                }}>
                  <TextField
                    name="firstName"
                    label="Име"
                    value={formData.firstName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                  <TextField
                    name="lastName"
                    label="Фамилия"
                    value={formData.lastName}
                    onChange={handleChange}
                    fullWidth
                    variant="outlined"
                  />
                </Box>
                
                <TextField
                  name="email"
                  label="Имейл"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
                
                
                
                <TextField
                  name="password"
                  label="Парола"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
                
                <TextField
                  name="confirmPassword"
                  label="Потвърди парола"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  fullWidth
                  variant="outlined"
                  required
                />
              </Box>

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                sx={{ mt: 3, mb: 2, py: 1.5, borderRadius: 2 }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : registrationToken ? (
                  'Създай акаунт'
                ) : (
                  'Регистрирай се като треньор'
                )}
              </Button>
            </form>

            <Box sx={{ textAlign: 'center', mt: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Вече имате акаунт?{' '}
                <Button
                  variant="text"
                  onClick={onSwitchToLogin}
                  sx={{ textTransform: 'none', p: 0 }}
                >
                  Влез
                </Button>
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};
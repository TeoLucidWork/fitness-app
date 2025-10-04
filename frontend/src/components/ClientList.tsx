import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Card,
  CardContent,
  Avatar,
  Chip,
  Alert,
  Button,
  Stack,
  Divider,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Person as PersonIcon,
  Add as AddIcon,
  Email as EmailIcon,
  AccessTime as AccessTimeIcon,
} from '@mui/icons-material';
import { userService } from '../services/userService';
import { User } from '../types/auth.types';

interface ClientListProps {
  onNavigateBack: () => void;
  onCreateClient: () => void;
  onViewClient?: (clientId: number) => void;
}

export const ClientList: React.FC<ClientListProps> = ({
  onNavigateBack,
  onCreateClient,
  onViewClient,
}) => {
  const [clients, setClients] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);
      const clientsData = await userService.getClients();
      setClients(clientsData);
    } catch (err: any) {
      setError('Грешка при зареждане на клиенти');
      console.error('Failed to fetch clients:', err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('bg-BG', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const getDisplayName = (client: User) => {
    if (client.firstName && client.lastName) {
      return `${client.firstName} ${client.lastName}`;
    }
    if (client.firstName) {
      return client.firstName;
    }
    return client.username;
  };

  const getInitials = (client: User) => {
    if (client.firstName && client.lastName) {
      return `${client.firstName[0]}${client.lastName[0]}`.toUpperCase();
    }
    if (client.firstName) {
      return client.firstName[0].toUpperCase();
    }
    return client.username[0].toUpperCase();
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        {/* Header */}
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <IconButton onClick={onNavigateBack} sx={{ mr: 2 }}>
              <ArrowBackIcon />
            </IconButton>
            <Typography variant="h4" component="h1">
              Мои клиенти
            </Typography>
          </Box>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={onCreateClient}
          >
            Добави клиент
          </Button>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {/* Loading State */}
        {loading && (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <Typography color="text.secondary">
              Зареждане на клиенти...
            </Typography>
          </Box>
        )}

        {/* Empty State */}
        {!loading && clients.length === 0 && !error && (
          <Box sx={{ textAlign: 'center', py: 6 }}>
            <PersonIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
            <Typography variant="h5" color="text.secondary" gutterBottom>
              Няма клиенти
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
              Все още няма добавени клиенти към профила ви.
            </Typography>
            <Button
              variant="contained"
              size="large"
              startIcon={<AddIcon />}
              onClick={onCreateClient}
            >
              Добави първия клиент
            </Button>
          </Box>
        )}

        {/* Clients List */}
        {!loading && clients.length > 0 && (
          <Stack spacing={2}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
              <Typography variant="h6">
                Общо клиенти: {clients.length}
              </Typography>
            </Box>

            <Divider />

            <Box sx={{
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', md: 'repeat(auto-fill, minmax(350px, 1fr))' },
              gap: 2,
              mt: 2
            }}>
              {clients.map((client) => (
                <Card key={client.id} variant="outlined" sx={{ height: 'fit-content' }}>
                  <CardContent>
                    {/* Client Header */}
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                      <Avatar sx={{ mr: 2, bgcolor: 'primary.main' }}>
                        {getInitials(client)}
                      </Avatar>
                      <Box sx={{ flexGrow: 1 }}>
                        <Typography variant="h6" component="div" noWrap>
                          {getDisplayName(client)}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" noWrap>
                          @{client.username}
                        </Typography>
                      </Box>
                      <Chip
                        label="Клиент"
                        size="small"
                        color="primary"
                        variant="outlined"
                      />
                    </Box>

                    {/* Client Details */}
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1, mb: 2 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                        <EmailIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                        <Typography variant="body2" color="text.secondary" noWrap>
                          {client.email}
                        </Typography>
                      </Box>

                      {client.createdAt && (
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <AccessTimeIcon sx={{ fontSize: 16, color: 'text.secondary' }} />
                          <Typography variant="body2" color="text.secondary">
                            Регистриран: {formatDate(client.createdAt)}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    {/* Actions */}
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <Button
                        variant="outlined"
                        size="small"
                        fullWidth
                        onClick={() => onViewClient?.(client.id)}
                      >
                        Преглед
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        fullWidth
                      >
                        Създай програма
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Stack>
        )}
      </Paper>
    </Box>
  );
};
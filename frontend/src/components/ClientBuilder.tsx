import React from 'react';
import {
  Box,
  Paper,
  Typography,
  Button,
  IconButton,
  Alert,
  Card,
  CardContent,
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Link as LinkIcon,
  Info as InfoIcon,
} from '@mui/icons-material';

interface ClientBuilderProps {
  onNavigateBack: () => void;
  onClientSaved: () => void;
}

export const ClientBuilder: React.FC<ClientBuilderProps> = ({
  onNavigateBack,
  onClientSaved,
}) => {
  const handleGoToRegistrationLinks = () => {
    // This will be handled by the parent component to navigate to registration links
    onClientSaved(); // This will trigger navigation to registration-links
  };

  return (
    <Box sx={{ p: 3 }}>
      <Paper sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <IconButton onClick={onNavigateBack} sx={{ mr: 2 }}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h4" component="h1">
            Добави нов клиент
          </Typography>
        </Box>

        <Alert severity="info" sx={{ mb: 3 }} icon={<InfoIcon />}>
          <Typography variant="h6" gutterBottom>
            Новият начин за добавяне на клиенти
          </Typography>
          <Typography variant="body2">
            За по-голяма сигурност, клиентите сега задават собствените си пароли.
            Използвайте регистрационни линкове за покана на нови клиенти.
          </Typography>
        </Alert>

        <Card sx={{ mb: 3, border: '2px solid', borderColor: 'primary.main' }}>
          <CardContent>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <LinkIcon sx={{ mr: 1, color: 'primary.main' }} />
              <Typography variant="h6" color="primary.main">
                Регистрационни линкове
              </Typography>
            </Box>

            <Typography variant="body1" paragraph>
              <strong>Как работи:</strong>
            </Typography>

            <Box component="ol" sx={{ pl: 2, mb: 2 }}>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Генерирате уникален регистрационен линк
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Изпращате линка на клиента (имейл, SMS, лично)
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Клиентът отваря линка и създава собствената си парола
              </Typography>
              <Typography component="li" variant="body2" sx={{ mb: 1 }}>
                Клиентът автоматично се присвоява към вас като треньор
              </Typography>
            </Box>

            <Alert severity="success" sx={{ mb: 2 }}>
              <Typography variant="body2">
                <strong>Предимства:</strong> По-сигурно, клиентът контролира паролата си,
                автоматично присвояване, валидност на линка до 7 дни
              </Typography>
            </Alert>

            <Button
              variant="contained"
              size="large"
              startIcon={<LinkIcon />}
              onClick={handleGoToRegistrationLinks}
              fullWidth
            >
              Отиди към регистрационните линкове
            </Button>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
          <Button variant="outlined" onClick={onNavigateBack}>
            Назад към клиенти
          </Button>
        </Box>
      </Paper>
    </Box>
  );
};
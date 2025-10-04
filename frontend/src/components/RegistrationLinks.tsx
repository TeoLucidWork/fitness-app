import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  AppBar,
  Toolbar,
  IconButton,
  Container,
  Alert,
  Stack,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  DialogActions,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
  Snackbar,
} from '@mui/material';
import {
  ArrowBack,
  Add as AddIcon,
  ContentCopy as CopyIcon,
  Link as LinkIcon
} from '@mui/icons-material';

interface RegistrationLinksProps {
  onNavigateBack: () => void;
}

interface RegistrationToken {
  id: string;
  token: string;
  expiresAt: string;
  isUsed: boolean;
  createdAt: string;
  usedBy?: {
    id: number;
    email: string;
    firstName?: string;
    lastName?: string;
  };
}

export const RegistrationLinks: React.FC<RegistrationLinksProps> = ({ onNavigateBack }) => {
  const [tokens, setTokens] = useState<RegistrationToken[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newLink, setNewLink] = useState<{ token: string; link: string; expiresAt: string } | null>(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    fetchTokens();
  }, []);

  const fetchTokens = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Не сте оторизирани');
        return;
      }

      const response = await fetch('http://localhost:3001/auth/registration-tokens', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Грешка при зареждане на линковете');
      }

      const data = await response.json();
      setTokens(data);
    } catch (err: any) {
      setError(err.message || 'Грешка при зареждане на линковете');
    } finally {
      setLoading(false);
    }
  };

  const generateLink = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Не сте оторизирани');
        return;
      }

      const response = await fetch('http://localhost:3001/auth/generate-registration-link', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Грешка при генериране на линк');
      }

      const data = await response.json();
      setNewLink(data);
      setShowCreateDialog(false);
      await fetchTokens(); // Refresh the list
    } catch (err: any) {
      setError(err.message || 'Грешка при генериране на линк');
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setSnackbarMessage('Линкът е копиран в клипборда');
      setSnackbarOpen(true);
    } catch (err) {
      console.error('Failed to copy:', err);
      setSnackbarMessage('Грешка при копиране');
      setSnackbarOpen(true);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('bg-BG');
  };

  const isExpired = (dateString: string) => {
    return new Date(dateString) < new Date();
  };

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
            Линкове за регистрация
          </Typography>
          <Button
            color="inherit"
            startIcon={<AddIcon />}
            onClick={() => setShowCreateDialog(true)}
          >
            Генерирай нов линк
          </Button>
        </Toolbar>
      </AppBar>

      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
            {error}
          </Alert>
        )}

        {newLink && (
          <Card sx={{ mb: 3, backgroundColor: 'success.light', color: 'success.contrastText' }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Новият регистрационен линк е готов!
              </Typography>
              <Box sx={{
                display: 'flex',
                alignItems: 'center',
                gap: 1,
                mb: 2,
                backgroundColor: 'rgba(255,255,255,0.1)',
                p: 2,
                borderRadius: 1,
                wordBreak: 'break-all'
              }}>
                <LinkIcon />
                <Typography variant="body2" sx={{ flexGrow: 1 }}>
                  {newLink.link}
                </Typography>
                <IconButton
                  onClick={() => copyToClipboard(newLink.link)}
                  sx={{ color: 'inherit' }}
                >
                  <CopyIcon />
                </IconButton>
              </Box>
              <Typography variant="body2">
                Валиден до: {formatDate(newLink.expiresAt)}
              </Typography>
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={() => setNewLink(null)}
              >
                Затвори
              </Button>
            </CardContent>
          </Card>
        )}

        <Paper sx={{ width: '100%', overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Създаден</TableCell>
                <TableCell>Валиден до</TableCell>
                <TableCell>Статус</TableCell>
                <TableCell>Използван от</TableCell>
                <TableCell>Действия</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    Зареждане...
                  </TableCell>
                </TableRow>
              ) : tokens.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    <Box sx={{ py: 4 }}>
                      <Typography variant="h6" color="text.secondary" gutterBottom>
                        Няма създадени линкове
                      </Typography>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        Създайте първия си регистрационен линк за клиенти
                      </Typography>
                      <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => setShowCreateDialog(true)}
                      >
                        Генерирай линк
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ) : (
                tokens.map((token) => (
                  <TableRow key={token.id}>
                    <TableCell>
                      {formatDate(token.createdAt)}
                    </TableCell>
                    <TableCell>
                      {formatDate(token.expiresAt)}
                    </TableCell>
                    <TableCell>
                      <Chip
                        label={
                          token.isUsed
                            ? 'Използван'
                            : isExpired(token.expiresAt)
                            ? 'Изтекъл'
                            : 'Активен'
                        }
                        color={
                          token.isUsed
                            ? 'success'
                            : isExpired(token.expiresAt)
                            ? 'error'
                            : 'primary'
                        }
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      {token.usedBy ? (
                        <Box>
                          <Typography variant="body2">
                            {token.usedBy.firstName || token.usedBy.lastName
                              ? `${token.usedBy.firstName || ''} ${token.usedBy.lastName || ''}`.trim()
                              : token.usedBy.email
                            }
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {token.usedBy.email}
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body2" color="text.secondary">
                          Неизползван
                        </Typography>
                      )}
                    </TableCell>
                    <TableCell>
                      {!token.isUsed && !isExpired(token.expiresAt) && (
                        <IconButton
                          onClick={() => copyToClipboard(`${window.location.origin}/register?token=${token.token}`)}
                          title="Копирай линк"
                        >
                          <CopyIcon />
                        </IconButton>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Paper>
      </Container>

      {/* Generate Link Dialog */}
      <Dialog open={showCreateDialog} onClose={() => setShowCreateDialog(false)}>
        <DialogTitle>Генериране на нов регистрационен линк</DialogTitle>
        <DialogContent>
          <Typography variant="body1" sx={{ mb: 2 }}>
            Ще бъде създаден нов линк за регистрация, който ще бъде валиден 7 дни.
            Клиентът ще може да се регистрира с този линк и автоматично ще бъде присвоен към вас.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Линкът може да бъде използван само веднъж.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowCreateDialog(false)}>
            Отказ
          </Button>
          <Button onClick={generateLink} variant="contained" disabled={loading}>
            Генерирай линк
          </Button>
        </DialogActions>
      </Dialog>

      {/* Success Snackbar */}
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={3000}
        onClose={() => setSnackbarOpen(false)}
        message={snackbarMessage}
      />
    </Box>
  );
};
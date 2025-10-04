export interface LoginProps {
  onSuccess: () => void;
  onSwitchToRegister: () => void;
}

export interface RegisterProps {
  onSuccess: () => void;
  onSwitchToLogin: () => void;
}

export interface DashboardProps {
  onLogout: () => void;
  onNavigate: (view: ViewType) => void;
}

export type ViewType = 'login' | 'register' | 'dashboard' | 'exercises' | 'programs' | 'program-builder' | 'exercise-builder' | 'client-builder' | 'client-list' | 'registration-links' | 'client-programs' | 'weight-tracking';
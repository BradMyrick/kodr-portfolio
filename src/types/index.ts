// Core types for the Innovation Hub application

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  createdAt: string;
  updatedAt: string;
}

export interface ProjectMember {
  userId: string;
  role: 'owner' | 'admin' | 'member' | 'viewer';
  joinedAt: string;
  invitedBy: string;
  lastActive: string;
}

export interface ProjectProgress {
  completionPercentage: number;
  totalIdeas: number;
  completedIdeas: number;
  inProgressIdeas: number;
  daysElapsed: number;
  daysRemaining: number;
  isOnSchedule: boolean;
  weeklyActivity: number;
  monthlyActivity: number;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  avatar: string;
  color: string;
  status: 'active' | 'completed' | 'on_hold' | 'archived';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  owner: string;
  members: ProjectMember[];
  tags: string[];
  category: string;
  isPublic: boolean;
  progress: ProjectProgress;
  aiEnabled: boolean;
  autoGenerateIdeas: boolean;
  createdAt: string;
  updatedAt: string;
  lastActivity: string;
}

export interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'in-progress' | 'review' | 'done';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  assignee?: User;
  projectId: string;
  createdAt: string;
  updatedAt: string;
  dueDate?: string;
}

export interface Idea {
  id: string;
  title: string;
  description: string;
  tags: string[];
  votes: number;
  author: User;
  projectId?: string;
  createdAt: string;
  updatedAt: string;
  attachments?: string[];
}

export interface Team {
  id: string;
  name: string;
  description: string;
  members: TeamMember[];
  projects: Project[];
  createdAt: string;
  updatedAt: string;
}

export interface TeamMember {
  user: User;
  role: 'owner' | 'admin' | 'member';
  joinedAt: string;
}

export interface Resource {
  id: string;
  title: string;
  description: string;
  type: 'template' | 'code-snippet' | 'dataset' | 'best-practice' | 'documentation';
  content: string;
  author: User;
  tags: string[];
  upvotes: number;
  downvotes: number;
  createdAt: string;
  updatedAt: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  userId: string;
  createdAt: string;
  actionUrl?: string;
}

export interface ChatMessage {
  id: string;
  content: string;
  author: User;
  projectId: string;
  createdAt: string;
  edited?: boolean;
  editedAt?: string;
}

export interface AIAssistant {
  id: string;
  name: string;
  description: string;
  capabilities: string[];
  active: boolean;
}

export interface WhiteboardElement {
  id: string;
  type: 'note' | 'drawing' | 'text' | 'image' | 'shape';
  position: { x: number; y: number };
  size: { width: number; height: number };
  content: string;
  color: string;
  author: User;
  createdAt: string;
  updatedAt: string;
}

export interface Integration {
  id: string;
  name: string;
  type: 'github' | 'slack' | 'wallet' | 'google' | 'other';
  connected: boolean;
  settings: Record<string, any>;
  userId: string;
}

// Form types
export interface LoginForm {
  email: string;
  password: string;
}

export interface RegisterForm {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface ProjectForm {
  name: string;
  description: string;
  tags: string[];
  color: string;
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  isPublic: boolean;
  aiEnabled: boolean;
  autoGenerateIdeas: boolean;
}

export interface TaskForm {
  title: string;
  description?: string;
  priority: Task['priority'];
  assigneeId?: string;
  dueDate?: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// UI Component Props
export interface BaseComponentProps {
  className?: string;
  children?: React.ReactNode;
}

export interface ButtonProps extends BaseComponentProps {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'destructive';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  loading?: boolean;
  onClick?: () => void;
  type?: 'button' | 'submit' | 'reset';
}

export interface ModalProps extends BaseComponentProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: string;
}

// Store types
export interface AppState {
  user: User | null;
  projects: Project[];
  currentProject: Project | null;
  notifications: Notification[];
  theme: 'light' | 'dark';
  sidebarCollapsed: boolean;
}

export interface ProjectState {
  tasks: Task[];
  ideas: Idea[];
  chatMessages: ChatMessage[];
  whiteboardElements: WhiteboardElement[];
  activeView: 'overview' | 'kanban' | 'chat' | 'whiteboard' | 'ai';
}

// Utility types
export type Theme = 'light' | 'dark';
export type ViewMode = 'grid' | 'list';
export type SortOrder = 'asc' | 'desc';
export type FilterOption = 'all' | 'active' | 'completed' | 'archived';

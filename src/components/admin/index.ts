// Barrel export pour tous les composants admin

// Layout
export { default as AdminSidebar } from './layout/AdminSidebar';

// Dashboard
export { default as AdminActivityChart } from './dashboard/AdminActivityChart';
export { default as AdminQuickActions } from './dashboard/AdminQuickActions';
export { default as AdminStatsCards } from './dashboard/AdminStatsCards';

// Users
export { default as BanUserModal } from './users/BanUserModal';
export { default as DeleteUserModal } from './users/DeleteUserModal';
export { default as UpdateRolesModal } from './users/UpdateRolesModal';
export { default as UserDetailsCard } from './users/UserDetailsCard';
export { default as UsersTable } from './users/UsersTable';

// Moderation
export { default as DeleteContentModal } from './moderations/DeleteContentModal';
export { default as ModerationAvisTable } from './moderations/ModerationAvisTable';
export { default as ModerationDemandesTable } from './moderations/ModerationDemandesTable';
export { default as ModerationVoyagesTable } from './moderations/ModerationVoyagesTable';
export { default as SignalementsTable } from './moderations/SignalementsTable';
export { default as TraiterSignalementModal } from './moderations/TraiterSignalementModal';

// Logs
export { default as LogFilters } from './logs/LogFilters';
export { default as LogsTable } from './logs/LogsTable';
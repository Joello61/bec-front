// Barrel export pour tous les composants admin

// Layout
export { default as AdminSidebar } from './layout/AdminSidebar';

// Dashboard
export { default as AdminStatsCards } from './dashboard/AdminStatsCards';
export { default as AdminActivityChart } from './dashboard/AdminActivityChart';
export { default as AdminQuickActions } from './dashboard/AdminQuickActions';

// Users
export { default as UsersTable } from './users/UsersTable';
export { default as UserDetailsCard } from './users/UserDetailsCard';
export { default as BanUserModal } from './users/BanUserModal';
export { default as UpdateRolesModal } from './users/UpdateRolesModal';
export { default as DeleteUserModal } from './users/DeleteUserModal';

// Moderation
export { default as ModerationVoyagesTable } from './moderations/ModerationVoyagesTable';
export { default as ModerationDemandesTable } from './moderations/ModerationDemandesTable';
export { default as DeleteContentModal } from './moderations/DeleteContentModal';

// Logs
export { default as LogsTable } from './logs/LogsTable';
export { default as LogFilters } from './logs/LogFilters';
/**
 * Modern Icon System using Lucide React
 * Consistent, accessible, and modern icons for 2025/2026
 */
import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  Box,
  Users,
  PieChart,
  Edit,
  Save,
  ArrowLeft,
  Download,
  Printer,
  RefreshCw,
  Calendar,
  FileText,
  DollarSign,
  Package,
  Puzzle,
  PlusCircle,
  CheckCircle,
  TrendingUp,
  AlertTriangle,
  Star,
  Database,
  List,
  Grid3x3,
  BarChart3,
  Info,
} from 'lucide-react';

interface IconProps {
  className?: string;
  size?: number | 'small' | 'medium' | 'large';
}

const getSizeValue = (size?: number | 'small' | 'medium' | 'large'): number => {
  if (typeof size === 'number') return size;
  const sizeMap = {
    small: 16,
    medium: 20,
    large: 28,
  };
  return sizeMap[size || 'medium'];
};

// Sidebar Icons
export const DashboardIcon = ({ className, size = 24 }: IconProps) => (
  <LayoutDashboard className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const SubscriptionIcon = ({ className, size = 24 }: IconProps) => (
  <CreditCard className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const FeaturesIcon = ({ className, size = 24 }: IconProps) => (
  <Box className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const ClientsIcon = ({ className, size = 24 }: IconProps) => (
  <Users className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const ReportsIcon = ({ className, size = 24 }: IconProps) => (
  <PieChart className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);

// General Action Icons
export const EditIcon = ({ className, size = 16 }: IconProps) => (
  <Edit className={`mr-1 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const SaveIcon = ({ className, size = 20 }: IconProps) => (
  <Save className={`mr-2 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const ArrowLeftIcon = ({ className, size = 16 }: IconProps) => (
  <ArrowLeft className={`mr-2 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const ExportIcon = ({ className, size = 16 }: IconProps) => (
  <Download className={`mr-2 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const PrintIcon = ({ className, size = 16 }: IconProps) => (
  <Printer className={`mr-2 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const RefreshIcon = ({ className, size = 20 }: IconProps) => (
  <RefreshCw className={`mr-2 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const ScheduleIcon = ({ className, size = 20 }: IconProps) => (
  <Calendar className={`mr-2 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const GenerateReportIcon = ({ className, size = 20 }: IconProps) => (
  <FileText className={`mr-2 ${className}`} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const InfoIcon = ({ className, size = 20 }: IconProps) => (
  <Info className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);

// Thematic Icons
export const TotalRevenueIcon = ({ className, size = 'medium' }: IconProps) => (
  <DollarSign className={className} size={getSizeValue(size)} />
);
export const CreditsIcon = ({ className, size = 'medium' }: IconProps) => (
  <Database className={className} size={getSizeValue(size)} />
);
export const StarIcon = ({ className, size = 'medium' }: IconProps) => (
  <Star className={className} size={getSizeValue(size)} />
);
export const ArrowTrendingUpIcon = ({ className, size = 'medium' }: IconProps) => (
  <TrendingUp className={className} size={getSizeValue(size)} />
);
export const AlertTriangleIcon = ({ className, size = 'medium' }: IconProps) => (
  <AlertTriangle className={className} size={getSizeValue(size)} />
);
export const DollarIcon = ({ className, size = 20 }: IconProps) => (
  <DollarSign className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const PackageIcon = ({ className, size = 20 }: IconProps) => (
  <Package className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const PuzzleIcon = ({ className, size = 20 }: IconProps) => (
  <Puzzle className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const PlusCircleIcon = ({ className, size = 20 }: IconProps) => (
  <PlusCircle className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const CheckCircleIcon = ({ className, size = 'medium' }: IconProps) => (
  <CheckCircle className={className} size={getSizeValue(size)} />
);
export const UsersIcon = ({ className, size = 'medium' }: IconProps) => (
  <Users className={className} size={getSizeValue(size)} />
);
export const CalendarIcon = ({ className, size = 20 }: IconProps) => (
  <Calendar className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const ChartLineIcon = ({ className, size = 20 }: IconProps) => (
  <TrendingUp className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const ChartBarIcon = ({ className, size = 'medium' }: IconProps) => (
  <BarChart3 className={className} size={getSizeValue(size)} />
);
export const FileTextIcon = ({ className, size = 'medium' }: IconProps) => (
  <FileText className={className} size={getSizeValue(size)} />
);
export const ListIcon = ({ className, size = 20 }: IconProps) => (
  <List className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);
export const GridIcon = ({ className, size = 20 }: IconProps) => (
  <Grid3x3 className={className} size={typeof size === 'number' ? size : getSizeValue(size)} />
);

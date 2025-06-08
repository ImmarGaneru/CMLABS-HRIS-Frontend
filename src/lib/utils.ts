import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { InvoiceStatus, SubscriptionStatus } from '@/lib/enums';

type StatusClassMap = Record<InvoiceStatus | SubscriptionStatus, string>;

const statusClassMap: StatusClassMap = {
  [InvoiceStatus.Unpaid]: 'bg-yellow-100 text-yellow-800',
  [InvoiceStatus.Paid]: 'bg-green-100 text-green-800',
  [InvoiceStatus.Overdue]: 'bg-red-100 text-red-800',
  [SubscriptionStatus.Active]: 'bg-green-100 text-green-800',
  [SubscriptionStatus.Trial]: 'bg-blue-100 text-blue-800',
  [SubscriptionStatus.Expired]: 'bg-gray-100 text-gray-800',
};

export const getStatusClass = (
  status: InvoiceStatus | SubscriptionStatus
): string => {
  return statusClassMap[status] || 'bg-gray-100 text-gray-800';
};

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
};

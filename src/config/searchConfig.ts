interface SearchItem {
    title: string;
    path: string;
    category: string;
    keywords: string[];
}

export const searchableItems: SearchItem[] = [
    // Dashboard
    {
        title: 'Dashboard',
        path: '/dashboard',
        category: 'Main',
        keywords: ['dashboard', 'home', 'overview', 'main']
    },
    // Employee Management
    {
        title: 'Employee List',
        path: '/employee',
        category: 'Employee',
        keywords: ['employee', 'staff', 'personnel', 'workers', 'list']
    },
    {
        title: 'Add Employee',
        path: '/employee/add',
        category: 'Employee',
        keywords: ['add employee', 'new employee', 'hire', 'recruit']
    },
    // Attendance
    {
        title: 'Attendance',
        path: '/attendance',
        category: 'Attendance',
        keywords: ['attendance', 'clock in', 'clock out', 'time tracking']
    },
    // Payroll
    {
        title: 'Payroll',
        path: '/payroll',
        category: 'Payroll',
        keywords: ['payroll', 'salary', 'payment', 'compensation']
    },
    // Profile
    {
        title: 'Profile',
        path: '/profile',
        category: 'User',
        keywords: ['profile', 'account', 'user info', 'my profile']
    },
    // Settings
    {
        title: 'Settings',
        path: '/settings',
        category: 'Settings',
        keywords: ['settings', 'preferences', 'configuration']
    }
]; 
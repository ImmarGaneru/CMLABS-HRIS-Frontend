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
        path: '/manager/dashboard',
        category: 'Main',
        keywords: ['dashboard', 'home', 'overview', 'main']
    },
    // Employee Management
    {
        title: 'Employee List',
        path: '/manager/employee',
        category: 'Employee',
        keywords: ['employee', 'staff', 'personnel', 'workers', 'list']
    },
    {
        title: 'Add Employee',
        path: '/manager/employee/tambah',
        category: 'Employee',
        keywords: ['add employee', 'new employee', 'hire', 'recruit']
    },
    // Attendance
    {
        title: 'Attendance',
        path: '/manager/attendance',
        category: 'Attendance',
        keywords: ['attendance', 'clock in', 'clock out', 'time tracking']
    },
    {
        title: 'Approval',
        path: '/manager/approval',
        category: 'Approval',
        keywords: ['attendance', 'clock in', 'clock out', 'time tracking']
    },
    // Jadwal
    {
        title: 'Schedule',
        path: '/manager/jadwal',
        category: 'Approval',
        keywords: ['attendance', 'clock in', 'clock out', 'time tracking']
    },
    {
        title: 'Schedule',
        path: '/manager/jadwal',
        category: 'Approval',
        keywords: ['attendance', 'clock in', 'clock out', 'time tracking']
    },
    // Profile
    {
        title: 'Profile',
        path: '/manager/profile',
        category: 'User',
        keywords: ['profile', 'account', 'user info', 'my profile']
    },
    // Settings
    {
        title: 'Company Settings',
        path: '/manager/settings',
        category: 'Settings',
        keywords: ['settings', 'preferences', 'configuration']
    },
    {
        title: 'Company Department',
        path: '/manager/settings/department',
        category: 'Settings',
        keywords: ['settings', 'department', 'configuration']
    },
    {
        title: 'Company Position',
        path: '/manager/settings/position',
        category: 'Settings',
        keywords: ['settings', 'department', 'configuration']
    },
];

export const employeeSearchableItems: SearchItem[] = [
    {
        title: 'Dashboard',
        path: '/employee/dashboard',
        category: 'Main',
        keywords: ['dashboard', 'home', 'overview', 'main']
    },
    {
        title: 'Attendance',
        path: '/employee/attendance',
        category: 'Attendance',
        keywords: ['attendance', 'clock in', 'clock out', 'absen', 'time tracking']
    },
    {
        title: 'Profile',
        path: '/employee/profile',
        category: 'User',
        keywords: ['profile', 'account', 'user info', 'my profile', 'biodata']
    },
    {
        title: 'Schedule',
        path: '/employee/jadwal',
        category: 'Schedule',
        keywords: ['schedule', 'jadwal', 'shift', 'work hours']
    },
    {
        title: 'Lettering',
        path: '/employee/lettering',
        category: 'Letter',
        keywords: ['letter', 'surat', 'izin', 'cuti', 'sick', 'leave']
    },
    {
        title: 'Overtime',
        path: '/employee/overtime',
        category: 'Overtime',
        keywords: ['overtime', 'lembur', 'extra hours']
    },
]; 
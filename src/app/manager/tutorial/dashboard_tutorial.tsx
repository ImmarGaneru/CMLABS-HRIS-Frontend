import { TutorialStep } from '@/components/Tutorial';

export const dashboardTutorialSteps: TutorialStep[] = [
  {
    target: '.employee-sum-card',
    content: 'Selamat datang di HRIS Dashboard! disini anda dapat melihat informasi data seputar pengelolaan karyawan Company anda.',
    placement: 'bottom',
    centered: false,
  },
  {
    target: '.employee-sum-card',
    content: 'Data yang ditampilkan berupa statistik maupun rangkuman informasi yang dapat anda filter berdasarkan "tanggal" maupun "status".',
    placement: 'bottom',
    centered: false,
  },
  {
    target: '.employee-sum-card',
    content: 'Anda dapat mencari fitur-fitur yang ada inginkan lewat search diatas.',
    // placement: 'bottom',
    centered: true,
  },
  {
    target: '.employee-sum-card',
    content: 'Profil anda, informasi langganan ada di bagian kanan atas ini.',
    placement: 'right',
    centered: false,
  },
  {
    target: '.employee-attendance',
    content: 'Anda bisa menekan tutorial kembali pada ikon "?" di kanan bawah',
    placement: 'right',
    centered: false,
  },
]; 
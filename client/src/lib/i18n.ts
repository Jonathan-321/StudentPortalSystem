import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

// English translations
const enTranslations = {
  // General
  'University of Rwanda': 'University of Rwanda',
  'Student Portal': 'Student Portal',
  'Welcome back': 'Welcome back',
  'Academic Year': 'Academic Year',
  'Last login': 'Last login',
  'Logout': 'Logout',
  'Profile': 'Profile',
  'Account Settings': 'Account Settings',
  'Select language': 'Select language',
  
  // Authentication
  'Login': 'Login',
  'Register': 'Register',
  'Username': 'Username',
  'Password': 'Password',
  'Email': 'Email',
  'First Name': 'First Name',
  'Last Name': 'Last Name',
  'Student ID': 'Student ID',
  'Already have an account?': 'Already have an account?',
  'Don\'t have an account?': 'Don\'t have an account?',
  'Sign in to your account': 'Sign in to your account',
  'Create your account': 'Create your account',
  'Join the University of Rwanda student community': 'Join the University of Rwanda student community',
  
  // Navigation
  'Dashboard': 'Dashboard',
  'Academics': 'Academics',
  'Course Registration': 'Course Registration',
  'Results & Transcripts': 'Results & Transcripts',
  'Finance': 'Finance',
  'Timetable': 'Timetable',
  'Resources': 'Resources',
  'Messages': 'Messages',
  'Settings': 'Settings',
  'Help & Support': 'Help & Support',
  
  // Dashboard
  'Next Class': 'Next Class',
  'Registered Courses': 'Registered Courses',
  'Account Balance': 'Account Balance',
  'Pending Tasks': 'Pending Tasks',
  'Overview': 'Overview',
  'Courses': 'Courses',
  'Announcements': 'Announcements',
  'Tasks': 'Tasks',
  'Current Courses': 'Current Courses',
  'View All': 'View All',
  'Progress': 'Progress',
  'Weeks': 'Weeks',
  'Details': 'Details',
  'Upcoming Tasks': 'Upcoming Tasks',
  'Due in': 'Due in',
  'days': 'days',
  'Today\'s Schedule': 'Today\'s Schedule',
  'Full Timetable': 'Full Timetable',
  'Quick Links': 'Quick Links',
  'Library Resources': 'Library Resources',
  'E-Learning': 'E-Learning',
  'Transcript Request': 'Transcript Request',
  'IT Support': 'IT Support',
  'Academic Calendar': 'Academic Calendar',
  
  // Notifications
  'Notifications': 'Notifications',
  'New': 'New',
  'Earlier': 'Earlier',
  'Mark all as read': 'Mark all as read',
  'hour ago': 'hour ago',
  'hours ago': 'hours ago',
  'Yesterday': 'Yesterday',
  'days ago': 'days ago',
  'week ago': 'week ago',
  'weeks ago': 'weeks ago',
  
  // Offline
  'You are currently in offline mode': 'You are currently in offline mode. Some features may be limited.',
};

// Kinyarwanda translations
const rwTranslations = {
  // General
  'University of Rwanda': 'Kaminuza y\'u Rwanda',
  'Student Portal': 'Urubuga rw\'Abanyeshuri',
  'Welcome back': 'Murakaza neza',
  'Academic Year': 'Umwaka w\'Amashuri',
  'Last login': 'Igihe waheruka kwinjira',
  'Logout': 'Gusohoka',
  'Profile': 'Umwirondoro',
  'Account Settings': 'Igenamiterere ry\'Konti',
  'Select language': 'Hitamo ururimi',
  
  // Authentication
  'Login': 'Injira',
  'Register': 'Iyandikishe',
  'Username': 'Izina ry\'ukoresha',
  'Password': 'Ijambo ry\'ibanga',
  'Email': 'Imeri',
  'First Name': 'Izina',
  'Last Name': 'Irindi zina',
  'Student ID': 'Nomero y\'Umunyeshuri',
  'Already have an account?': 'Usanzwe ufite konti?',
  'Don\'t have an account?': 'Nta konti ufite?',
  'Sign in to your account': 'Injira muri konti yawe',
  'Create your account': 'Kora konti yawe',
  'Join the University of Rwanda student community': 'Ifatanye n\'umuryango w\'abanyeshuri ba Kaminuza y\'u Rwanda',
  
  // Navigation
  'Dashboard': 'Mburabuzi',
  'Academics': 'Amashuri',
  'Course Registration': 'Kwiyandikisha mu Masomo',
  'Results & Transcripts': 'Amanota n\'Impamyabumenyi',
  'Finance': 'Imari',
  'Timetable': 'Gahunda y\'Amasomo',
  'Resources': 'Ibikoresho',
  'Messages': 'Ubutumwa',
  'Settings': 'Igenamiterere',
  'Help & Support': 'Ubufasha',
  
  // Dashboard
  'Next Class': 'Isomo rikurikira',
  'Registered Courses': 'Amasomo Wanditsemo',
  'Account Balance': 'Amafaranga Asigaye',
  'Pending Tasks': 'Imirimo Itegereje',
  'Overview': 'Incamake',
  'Courses': 'Amasomo',
  'Announcements': 'Amatangazo',
  'Tasks': 'Imirimo',
  'Current Courses': 'Amasomo y\'Ubu',
  'View All': 'Reba Byose',
  'Progress': 'Aho Ugeze',
  'Weeks': 'Ibyumweru',
  'Details': 'Ibisobanuro',
  'Upcoming Tasks': 'Imirimo Itegereje',
  'Due in': 'Izarangira mu',
  'days': 'minsi',
  'Today\'s Schedule': 'Gahunda y\'Uyu Munsi',
  'Full Timetable': 'Gahunda Yuzuye',
  'Quick Links': 'Aho Wegera Vuba',
  'Library Resources': 'Ibikoresho bya Bibiliyoteke',
  'E-Learning': 'Kwiga kuri interineti',
  'Transcript Request': 'Gusaba Impamyabumenyi',
  'IT Support': 'Ubufasha bwa IT',
  'Academic Calendar': 'Kalendari y\'Amashuri',
  
  // Notifications
  'Notifications': 'Amatangazo',
  'New': 'Bishya',
  'Earlier': 'Bya Kera',
  'Mark all as read': 'Guhindura byose nk\'ibisomwe',
  'hour ago': 'isaha ishize',
  'hours ago': 'amasaha ashize',
  'Yesterday': 'Ejo',
  'days ago': 'iminsi ishize',
  'week ago': 'icyumweru gishize',
  'weeks ago': 'ibyumweru bishize',
  
  // Offline
  'You are currently in offline mode': 'Ubu uri mu buryo butari kuri interineti. Zimwe muri serivisi zishobora kuba zidakora.',
};

// French translations
const frTranslations = {
  // General
  'University of Rwanda': 'Université du Rwanda',
  'Student Portal': 'Portail Étudiant',
  'Welcome back': 'Bienvenue',
  'Academic Year': 'Année Académique',
  'Last login': 'Dernière connexion',
  'Logout': 'Déconnexion',
  'Profile': 'Profil',
  'Account Settings': 'Paramètres du Compte',
  'Select language': 'Sélectionner la langue',
  
  // Authentication
  'Login': 'Connexion',
  'Register': 'S\'inscrire',
  'Username': 'Nom d\'utilisateur',
  'Password': 'Mot de passe',
  'Email': 'Email',
  'First Name': 'Prénom',
  'Last Name': 'Nom',
  'Student ID': 'Identifiant Étudiant',
  'Already have an account?': 'Vous avez déjà un compte?',
  'Don\'t have an account?': 'Vous n\'avez pas de compte?',
  'Sign in to your account': 'Connectez-vous à votre compte',
  'Create your account': 'Créez votre compte',
  'Join the University of Rwanda student community': 'Rejoignez la communauté étudiante de l\'Université du Rwanda',
  
  // Navigation
  'Dashboard': 'Tableau de Bord',
  'Academics': 'Études',
  'Course Registration': 'Inscription aux Cours',
  'Results & Transcripts': 'Résultats et Relevés',
  'Finance': 'Finance',
  'Timetable': 'Emploi du Temps',
  'Resources': 'Ressources',
  'Messages': 'Messages',
  'Settings': 'Paramètres',
  'Help & Support': 'Aide et Support',
  
  // Dashboard
  'Next Class': 'Prochain Cours',
  'Registered Courses': 'Cours Inscrits',
  'Account Balance': 'Solde du Compte',
  'Pending Tasks': 'Tâches en Attente',
  'Overview': 'Aperçu',
  'Courses': 'Cours',
  'Announcements': 'Annonces',
  'Tasks': 'Tâches',
  'Current Courses': 'Cours Actuels',
  'View All': 'Voir Tout',
  'Progress': 'Progrès',
  'Weeks': 'Semaines',
  'Details': 'Détails',
  'Upcoming Tasks': 'Tâches à Venir',
  'Due in': 'Échéance dans',
  'days': 'jours',
  'Today\'s Schedule': 'Programme d\'Aujourd\'hui',
  'Full Timetable': 'Emploi du Temps Complet',
  'Quick Links': 'Liens Rapides',
  'Library Resources': 'Ressources Bibliothécaires',
  'E-Learning': 'Apprentissage en Ligne',
  'Transcript Request': 'Demande de Relevé',
  'IT Support': 'Support Informatique',
  'Academic Calendar': 'Calendrier Académique',
  
  // Notifications
  'Notifications': 'Notifications',
  'New': 'Nouveau',
  'Earlier': 'Plus Ancien',
  'Mark all as read': 'Marquer tout comme lu',
  'hour ago': 'il y a une heure',
  'hours ago': 'il y a quelques heures',
  'Yesterday': 'Hier',
  'days ago': 'il y a quelques jours',
  'week ago': 'il y a une semaine',
  'weeks ago': 'il y a quelques semaines',
  
  // Offline
  'You are currently in offline mode': 'Vous êtes actuellement en mode hors ligne. Certaines fonctionnalités peuvent être limitées.',
};

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: { translation: enTranslations },
      rw: { translation: rwTranslations },
      fr: { translation: frTranslations },
    },
    lng: 'en',
    fallbackLng: 'en',
    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;

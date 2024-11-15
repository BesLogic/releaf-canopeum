import type Shape from '../en/settings'

export default {
  tabs: {
    'edit-profile': 'Modifier Mon Profil',
    'manage-admins': 'Gérer les Administrateurs',
    'terms-and-policies': 'Conditions & Politiques',
  },
  'edit-profile': {
    title: 'Modifier Mon Profil',
    'profile-saved': 'Profil sauvegardé avec succès!',
    'current-password': 'Mot de passe actuel',
    'new-password': 'Nouveau mot de passe',
    'new-password-confirmation': 'Confirmation du nouveau mot de passe',
    'current-password-invalid': 'Le mot de passe actuel entré est invalide.',
    'save-profile-error': 'Un problème est survenu lors de la sauvegarde de votre profil.',
  },
  'manage-admins': {
    title: 'Gérer les Administrateurs',
    'invite-admin': 'Inviter un Administrateur',
    'generate-link': 'Générer un Lien',
    'copy-link': 'Copier le Lien',
    'assign-to-label': 'Assigner à',
    'generate-link-error': 'Une erreur est survenue en essayant de générer le lien.',
    'copy-link-message':
      "Veuillez copier et partager ce lien avec le propriétaire de l'adresse courriel suivante:",
  },
  'terms-and-policies': {
    title: 'Conditions & Politiques',
  },
} satisfies typeof Shape

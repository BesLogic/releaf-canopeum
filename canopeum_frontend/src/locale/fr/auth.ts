import type Shape from '../en/auth'

export default {
  'keep-password': 'Garder le même mot de passe',
  'change-password': 'Change de mot de passe',
  'log-in-header-text': 'Connectez-vous à votre compte',
  'sign-up-header-text': 'Créez votre compte',
  'username-label': "Nom d'utilisateur",
  'username-error-required': " Veuillez entrer un nom d'utilisateur",
  'email-label': 'Adresse courriel',
  'email-error-required': 'Veuillez entrer une adresse courriel',
  'email-error-format': 'Veuillez entrer une adresse courriel valide',
  'password-label': 'Mot de passe',
  'password-error-required': 'Veuillez entrer un mot de passe',
  'password-error-format':
    "Le mot de passe n'est pas valide. Il doit contenir au minimum 8 caractères, et au moins 1 lettre et 1 chiffre.",
  'create-password-label': 'Créez votre mot de passe',
  'password-confirmation-label': 'Entrez à nouveau le mot de passe',
  'password-confirmation-error-required': 'Veuillez entrer à nouveau le mot de passe',
  'password-error-must-match': 'Passwords do not match',
  'log-in': 'Se Connecter',
  'log-out': 'Se Déconnecter',
  'log-out-confirmation': 'Est-vous certain de vouloir vous déconnecter?',
  'sign-up': "S'inscrire",
  'create-account': 'Créer mon compte',
  'already-have-an-account': 'Vous avez déjà un compte?',
  'back-to-map': 'Retourner à la carte',
  'log-in-error': 'Erreur lors de la tentative de connexion',
  'sign-up-error': "Erreur lors de la tentative d'inscription",
  'code-invalid':
    "Votre lien d'invitation est invalide. Veuillez contacter la personne qui vous a invité pour demander un nouveau lien.",
  'invitation-expired':
    'Votre invitation est expirée. Veuillez contacter la personne qui vous a invité pour demander un nouveau lien.',
} satisfies typeof Shape

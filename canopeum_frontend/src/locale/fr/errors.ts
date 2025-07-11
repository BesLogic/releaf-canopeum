import type Shape from '../en/errors'

export default {
  'email-taken': 'Il y a déjà un utilisateur qui utilise cette adresse courriel.',
  'current-password-invalid': 'Le mot de passe actuel saisi est invalide.',
  'password-error-must-match': 'Les mots de passe ne correspondent pas.',
  'email-invalid': "Format d'adresse courriel invalide (exemple: john.doe@contoso.com)",
  'url-invalid': "Format d'URL invalide (exemple: https://www.contoso.com)",
  'phone-invalid': 'Format de numéro de téléphone invalide (exemple: +1 123 456 7890)',
  'change-language-failed': 'Erreur: changement de langue impossible',
  'fetch-batch-failed': 'Erreur: le chargement du lot {{batchName}} a échoué',
  'fetch-batches-failed': 'Erreur: le chargement des lots a échoué',
  'fetch-fertilizers-failed': 'Erreur: le chargement des engrais a échoué',
  'fetch-mulch-layers-failed': 'Erreur: le chargement des couches de paillis a échoué',
  'fetch-support-species-failed': 'Erreur: le chargement des espèces de support a échoué',
  'fetch-tree-species-failed': "Erreur: le chargement des espèces d'arbres a échoué",
  'fetch-site-types-failed': 'Erreur: le chargement des types de sites a échoué',
  'fetch-site-failed': 'Erreur: le chargement du site a échoué',
  'fetch-site-data-failed': 'Erreur: le chargement des données du site a échoué',
  'delete-site-failed': 'Erreur: la suppression du site a échouée',
  'fetch-all-sites-failed': 'Erreur: le chargement des sites a échoué',
  'copy-to-clibboard-failed': 'Erreur: la copie vers le presse-papiers a échouée',
  'fetch-comments-failed': 'Erreur: le chargement des commentaires a échoué',
  'delete-comment-failed': 'Erreur: la suppression du commentaire a échoué',
  'fetch-posts-failed': 'Erreur: le chargement des publications a échoué',
  'fetch-post-failed': 'Erreur: le chargement de la publication a échoué',
  'new-post-failed': 'Erreur: la création de la publication a échoué',
  'delete-post-failed': 'Erreur: la supression de la publication a échoué',
  'delete-like-failed': 'Erreur: la supression du like a échoué',
  'post-like-failed': 'Erreur: le like a échoué',
  'fetch-admins-failed': 'Erreur: le chargement des administrateurs a échoué',
  'update-admins-failed':
    'Erreur: la mise à jour des administrateurs pour le site {{siteName}} a échoué',
  'fetch-user-invitation-failed': "Erreur: le chargement de l'invitation de utilisateur a échoué",
  'fetch-current-user-failed': "Erreur: le chargement des informations de l'utilisateur a échoué",
  'follow-failed': 'Erreur: le suivi a échoué',
  'unfollow-failed': 'Erreur: le retrait du suivi a échoué',
  'update-site-status-failed': 'Erreur: la mise à jour du status publique du site a échoué',
} satisfies typeof Shape

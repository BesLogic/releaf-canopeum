import type Shape from '../en/social'

export default {
  'site-social-header': {
    follow: 'Suivre',
    unfollow: 'Ne plus suivre',
    sponsors: 'Commanditaires',
    public: 'Publique',
  },
  comments: {
    'leave-a-comment': 'Laisser un Commentaire',
    word_one: 'mot',
    word_other: 'mots',
    comments: 'Commentaires',
    send: 'Envoyer',
    'comment-body-required': 'Votre commentaire ne peut pas être vide.',
    'comment-body-max-chars_one': 'Votre commentaire ne peut pas contenir plus de {{count}} mots.',
    'comment-body-max-chars_other':
      'Votre commentaire ne peut pas contenir plus de {{count}} mots.',
    'comment-deletion-error': 'Un problème est survenu lors de la suppression du commentaire.',
    'comment-deletion-confirm-title': 'Supprimer le Commentaire',
    'comment-deletion-confirm-self':
      'Êtes-vous sûr de vouloir supprimer votre commentaire? Cela supprimera définitivement le commentaire; cette action est irréversible.',
    'comment-deletion-confirm-other':
      'Êtes-vous sûr de vouloir supprimer ce commentaire de {{author}}? Cela supprimera définitivement le commentaire; cette action est irréversible.',
  },
  'share-dialog': {
    title: 'Partager le Message',
    message:
      'Pour partager ce message, copiez simplement ce lien et collez-le sur vos plateformes de réseaux sociaux préférées, ou envoyez-le à un ami!',
    'copy-link': 'Copier le lien',
  },
  posts: {
    'post-body-required': 'Vous devez saisir un message pour pouvoir publier votre message.',
  },
  widgets: {
    create: 'ajouter un nouveau widget',
    submit: 'soumettre',
    cancel: 'annuler',
    'max-word': '100 mots maximum',
    title: 'titre du widget',
  },
  contact: {
    title: 'Contact',
    address: 'Adresse',
    phone: 'Téléphone',
    email: 'Email',
    feedback: {
      'edit-success': 'Contact modifié avec succès',
      'edit-error': 'Erreur lors de la modification du contact',
    },
  },
  announcement: {
    title: 'Annonce',
    body: 'Corps',
    link: 'Lien',
    feedback: {
      'edit-success': 'Annonce modifiée avec succès',
      'edit-error': "Erreur lors de la modification de l'annonce",
    },
  },
} satisfies typeof Shape
import type Shape from '../en/analytics'

export default {
  title: 'Gérer mes Sites',
  'create-site': 'Créer un Nouveau Site',
  'edit-site-info': "Modifier les données d'un Site",
  average: 'moyenne',
  batch_one: 'lot',
  batch_other: 'lots',
  sufficient: 'suffisant',
  insufficient: 'insuffisant',
  'table-row-1': 'nom du lot / ID',
  'table-row-2': 'sponsor',
  'table-row-3': 'espèces',
  'table-row-4': 'taille du terrain planté',
  'table-row-5': 'état du sol',
  'table-row-6': 'engrais',
  'table-row-7': 'couches de paillis',
  'table-row-8': 'espèces supportées',
  'table-row-9': 'nombre de plants',
  'table-row-10': 'combien ont survécu',
  'table-row-11': 'combien ont été remplacés',
  'table-row-12': 'quantité de graines collectées dans la zone',
  'table-row-13': 'types de graines collectées',
  'last-update': 'Dernière Mise à Jour',
  visitors: 'Visiteurs',
  sponsored: 'Sponsorisé',
  'unnamed-site': 'Site sans nom',
  'site-save-success': 'Site saved successfully',
  'site-save-error': 'Error saving Site',
  'success-rate-chart': {
    title: 'Taux De Réussite Annuel Moyen Par Site',
  },
  'batch-tracking': 'Suivi des Lots',
  'site-summary': {
    planted: 'Planté',
    survived: 'Survécu',
    propagation: 'Propagation',
    sponsored: 'Sponsorisé',
    'no-admins': "Pas d'administrateurs",
    visitors: 'Visiteurs',
    unknown: 'Inconnu',
    'admins-saved': 'Administrateurs sauvegardés avec succès pour {{siteName}}!',
    'delete-site-confirmation-title': 'Suppression du Site',
    'delete-site-confirmation-message': 'Êtes vous sur de vouloir supprimer le site {{siteName}}?',
    'site-deleted': 'Le site {{siteName}} a été supprimé avec succès.',
    'site-deleted-error':
      'Un problème est survenu lors de la tentative de suppression du site {{siteName}}...',
  },
  'site-modal': {
    'site-name': 'nom du site',
    'site-type': 'type de site',
    'site-image': "image du projet ou logo de l'entreprise",
    'site-gps-coordinates': 'coordonnées GPS',
    'site-dms-latitude': 'latitude DMS',
    'site-dms-longitude': 'longitude DMS',
    'site-presentation': 'présentation brève',
    'site-size': 'taille du terrain',
    'site-tree-species': "nombre d'arbres par espèce",
    'site-research-partner': 'partenariat de recherche?',
    'site-map-visibility': 'visibilité sur la carte',
    yes: 'oui',
    no: 'non',
    visible: 'visible',
    invisible: 'invisible',
  },
  'image-upload': 'ou déposez une image à téléverser',
} satisfies typeof Shape

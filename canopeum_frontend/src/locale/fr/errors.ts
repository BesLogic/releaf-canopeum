import type Shape from '../en/errors'

export default {
  'email-taken': 'Il y a déjà un utilisateur qui utilise cette adresse courriel.',
  'current-password-invalid': 'Le mot de passe actuel saisi est invalide.',
  'password-error-must-match': 'Les mots de passe ne correspondent pas.',
  'email-invalid': "Format d'adresse courriel invalide (exemple: john.doe@contoso.com)",
  'url-invalid': "Format d'URL invalide (exemple: https://www.contoso.com)",
  'phone-invalid': 'Format de numéro de téléphone invalide (exemple: +1 123 456 7890)',
} satisfies typeof Shape

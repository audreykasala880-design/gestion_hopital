# Centre Médical Hope — démonstration statique

Interface de démonstration de gestion des rendez-vous médicaux, réalisée pour le TP de **Programmation Web II** (UCC).

## Démarrage

Le projet est maintenant un site statique : aucune installation PHP, aucun serveur Apache/MySQL et aucune base de données ne sont nécessaires.

- Ouvrir [`index.html`](./index.html) dans un navigateur, ou
- Depuis ce dossier, lancer `python -m http.server 8000`, puis ouvrir <http://localhost:8000>.

## Limites de la démonstration

- Les écrans affichent des exemples de données.
- Les formulaires et actions sont simulés côté navigateur, en mémoire uniquement.
- Les modifications temporaires disparaissent au rechargement; aucune donnée n’est envoyée ou sauvegardée.
- L’authentification est désactivée : aucun compte ni mot de passe n’est vérifié.
- Les tests PHP/SQL de l’ancienne version ne s’exécutent plus; la page [`tests/run_tests.html`](./tests/run_tests.html) explique cette limite.
- Les archives d’e-mails historiques sont exclues du dépôt public; elles peuvent contenir des renseignements personnels.
- L’interface s’adapte aux écrans mobiles : formulaires et blocs passent en une colonne, tableaux défilent horizontalement et le menu latéral devient un tiroir.

## Écrans principaux

- Accueil : [`index.html`](./index.html)
- Prise de rendez-vous : [`rendez_vous/prendre.html`](./rendez_vous/prendre.html)
- Planning : [`rendez_vous/index.html`](./rendez_vous/index.html)
- Patients : [`patients/index.html`](./patients/index.html)
- Médecins : [`medecins/index.html`](./medecins/index.html)
- Salles : [`salles/index.html`](./salles/index.html)
- Disponibilités : [`disponibilites/index.html`](./disponibilites/index.html), [maintenance](./disponibilites/maintenance-salles.html), [horaires](./disponibilites/horaires-medecins.html)
- Statistiques : [`statistiques/index.html`](./statistiques/index.html)

La feuille de style gère les adaptations aux écrans mobiles; les pages HTML autonomes d’e-mails ne font pas partie des écrans de démonstration.

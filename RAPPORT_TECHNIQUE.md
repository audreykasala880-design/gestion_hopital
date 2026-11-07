# RAPPORT TECHNIQUE DU PROJET DE PROGRAMMATION II
> **Note sur la version actuelle :** ce rapport décrit l'ancienne version PHP/MySQL. Le projet exécutable est maintenant un site statique de démonstration, sans serveur PHP ni base de données. Pour le démarrer et connaître les limites du mode démo, consultez [README.md](./README.md). Le contenu ci-dessous est conservé comme documentation historique.

## Application Web de Gestion des Rendez-vous Médicaux pour une Clinique
**Université Catholique du Congo (UCC)**  
**Faculté des Sciences Informatiques — 2e Licence**

---

## 1. Introduction et Objectifs du Projet

Ce projet a été conçu et développé conformément au cahier des charges du Travail Pratique (TP) de **Programmation II**. Il répond aux besoins opérationnels d'une clinique médicale moderne (Centre Médical Hope) tout en illustrant les bonnes pratiques de développement web natif :
- **Simplicité et clarté** : Code PHP 8 procédural/modulaire facilement compréhensible pour un étudiant débutant, exempt de frameworks lourds (ni Laravel, ni React, ni Node.js).
- **Rigueur algorithmique** : Détection exhaustive des chevauchements horaires (partiels et complets) et application stricte des règles de gestion médicale.
- **Robustesse transactionnelle** : Utilisation des transactions ACID de MySQL et du verrouillage pessimiste (`SELECT ... FOR UPDATE`) pour éliminer tout risque de double réservation lors d'accès simultanés.
- **Sécurité à la conception** : Protection contre les injections SQL (requêtes préparées PDO), les attaques XSS (`htmlspecialchars`), les attaques CSRF (jetons cryptographiques) et le vol de session.

---

## 2. Architecture Technique et Choix des Outils

| Composant | Technologie | Rôle dans l'application |
| :--- | :--- | :--- |
| **Structure** | HTML5 sémantique | Balisage clair des pages, formulaires accessibles et métadonnées. |
| **Présentation** | CSS3 & Flexbox / Grid | Design médical moderne (bleu médical `#0284c7`, blanc `#fff`, turquoise `#06b6d4`), responsive sur PC, tablette et smartphone. |
| **Dynamisme UI** | JavaScript Vanilla | Effet interactif 3D sur les cartes, menu mobile, confirmation de suppression, calcul instantané de l'heure de fin. |
| **Logique Serveur**| PHP 8.2 (Natif) | Traitement des formulaires, routage, validation des règles, sessions sécurisées. |
| **Base de Données**| MySQL / MariaDB (InnoDB)| Moteur relationnel gérant les clés étrangères, contraintes `CHECK` et transactions. |
| **Couche d'Accès** | PHP Data Objects (PDO)| Requêtes préparées avec typage des paramètres pour une sécurité anti-injections absolue. |
| **Environnement**  | XAMPP Localhost | Serveur Apache + MySQL + phpMyAdmin. |

---

## 3. Structure et Organisation des Fichiers

Le projet est structuré de façon modulaire et intuitive :

```text
gestion-rendez-vous-medicaux/
│
├── index.php                          # Page d'accueil (Présentation, services, stats 3D)
│
├── config/
│   └── database.php                   # Connexion PDO, helpers de sécurité et moteur de vérification des règles
│
├── includes/
│   ├── header.php                     # En-tête HTML commun, barre de navigation, alertes flash
│   └── footer.php                     # Pied de page avec liens rapides et informations cliniques
│
├── assets/
│   ├── css/
│   │   └── style.css                  # Feuille de style principale (Responsive, 3D, badges)
│   ├── js/
│   │   └── script.js                  # Interactions JS (Menu mobile, inclinaison 3D, calculs de durée)
│   └── images/                        # Avatars vectoriels SVG des médecins et illustrations
│
├── patients/
│   ├── index.php                      # Répertoire et recherche des patients
│   ├── ajouter.php                    # Formulaire d'inscription administrative et médicale
│   ├── modifier.php                   # Édition des coordonnées et antécédents
│   └── details.php                    # Fiche complète du patient avec historique de ses consultations
│
├── medecins/
│   ├── index.php                      # Liste du corps médical avec filtres par spécialité
│   ├── ajouter.php                    # Ajout d'un praticien et de ses horaires réguliers
│   ├── modifier.php                   # Modification des informations et statut actif
│   └── supprimer.php                  # Suppression sécurisée avec intégrité référentielle
│
├── salles/
│   ├── index.php                      # Gestion des salles de consultation et équipements
│   ├── ajouter.php                    # Création d'une salle avec horaires d'ouverture
│   ├── modifier.php                   # Mise à jour des équipements et de l'état (Disponible / Maintenance)
│   └── supprimer.php                  # Suppression avec contrôle des rendez-vous rattachés
│
├── disponibilites/
│   └── index.php                      # Gestion des plages régulières, congés, réunions et maintenances
│
├── rendez_vous/
│   ├── prendre.php                    # Prise de RDV avec moteur de validation et verrouillage SQL
│   ├── index.php                      # Planning global avec filtres (médecin, salle, date, statut)
│   ├── modifier.php                   # Report ou réajustement d'un créneau existant
│   └── changer_statut.php             # Changement rapide (Confirmé, Terminé, Annulé)
│
├── statistiques/
│   └── index.php                      # Tableau de bord : occupation des salles, charge de travail des médecins
│
├── auth/
│   ├── login.php                      # Authentification espace pro (Session, CSRF, BCRYPT)
│   └── logout.php                     # Déconnexion et destruction complète de session
│
├── database/
│   └── gestion_rendez_vous.sql        # Script SQL de création des 9 tables et données de démonstration
│
├── tests/
│   └── run_tests.php                  # Script de validation automatique des 7 tests obligatoires du TP
│
├── README.md                          # Guide rapide de démarrage
└── RAPPORT_TECHNIQUE.md               # Le présent document
```

---

## 4. Modèle de Données et Schéma SQL

La base de données `gestion_rendez_vous_db` s'appuie sur le moteur **InnoDB** de MySQL pour supporter l'intégrité référentielle et les transactions. Elle est composée de 9 tables relationnelles :

1. `utilisateurs` : Authentification (`id`, `nom`, `email`, `mot_de_passe`, `role`, `date_creation`).
2. `patients` : Identité, date de naissance, genre, contact, groupe sanguin, antécédents.
3. `medecins` : Identité, spécialité, téléphone, email, bureau, avatar photo, statut actif.
4. `salles` : Nom, étage, capacité, équipements installés, statut opérationnel.
5. `disponibilites_medecins` : Horaires de travail réguliers par jour de semaine (`heure_debut` < `heure_fin`).
6. `indisponibilites_medecins` : Absences, congés, réunions, formations (`date_debut` < `date_fin`).
7. `disponibilites_salles` : Heures d'ouverture des salles par jour de semaine.
8. `indisponibilites_salles` : Périodes de maintenance, réparation ou désinfection.
9. `rendez_vous` : Réservations effectives reliant Patient, Médecin et Salle (`date_heure`, `duree_minutes`, `date_heure_fin`, `equipement_requis`, `motif`, `statut`).

### Index et Optimisation des Requêtes
Des index composites ont été définis sur `rendez_vous` pour accélérer drastiquement les requêtes de recherche de conflits horaires :
- `idx_medecin_periode (id_medecin, date_heure, date_heure_fin)`
- `idx_salle_periode (id_salle, date_heure, date_heure_fin)`
- `idx_rdv_date (date_heure)`

---

## 5. Moteur de Vérification des Règles de Gestion

La fonction centrale `verifierDisponibiliteRdv(...)` située dans `config/database.php` implémente point par point les règles métier :

### Formule mathématique universelle de chevauchement d'intervalles
Deux intervalles temporels $[A_{debut}, A_{fin}]$ et $[B_{debut}, B_{fin}]$ se chevauchent si et seulement si :
$$A_{debut} < B_{fin} \quad \text{ET} \quad A_{fin} > B_{debut}$$

Cette condition mathématique unique et élégante couvre tous les cas possibles :
1. **Égalité stricte** : Mêmes heures de début et de fin.
2. **Chevauchement par le début** : $A$ commence avant $B$ mais se termine pendant $B$.
3. **Chevauchement par la fin** : $A$ commence pendant $B$ et se termine après $B$.
4. **Englobement total** : $A$ commence avant $B$ et finit après $B$ (ou inversement).

### Gestion de la concurrence et Verrouillage SQL
Pour empêcher que deux secrétaires ne réservent le même médecin ou la même salle à la même fraction de seconde :
```php
$pdo->beginTransaction();
// Verrouillage des lignes ressources
$pdo->prepare("SELECT id FROM medecins WHERE id = ? FOR UPDATE")->execute([$id_medecin]);
$pdo->prepare("SELECT id FROM salles WHERE id = ? FOR UPDATE")->execute([$id_salle]);

// Exécution du contrôle de conflit
$check = verifierDisponibiliteRdv(...);

if (!$check['valide']) {
    $pdo->rollBack(); // Libération des verrous sans écriture
} else {
    // Insertion sécurisée
    $stmt->execute([...]);
    $pdo->commit();   // Validation atomique
}
```

### Proposition d'Alternatives
En cas de rejet d'une demande, le système ne se contente pas d'afficher une erreur :
- Il analyse les autres créneaux libres du même médecin au cours de la même journée.
- Il recherche les autres salles disponibles répondant aux critères d'équipements sur le créneau demandé.

---

## 6. Mesures de Sécurité Appliquées

1. **Injections SQL** : 100% des requêtes manipulant des paramètres utilisateur utilisent des requêtes préparées PDO avec des jetons `?` ou nommés.
2. **Attaques XSS (Cross-Site Scripting)** : La fonction helper `e($valeur)` applique systématiquement `htmlspecialchars(..., ENT_QUOTES, 'UTF-8')` sur toutes les chaînes affichées dans les vues.
3. **Attaques CSRF (Cross-Site Request Forgery)** : Chaque formulaire intègre un champ masqué `<input type="hidden" name="csrf_token">` comparé avec le jeton de session via `hash_equals()`.
4. **Hachage des Mots de Passe** : Les mots de passe des comptes sont hachés avec l'algorithme robuste standard `PASSWORD_BCRYPT` via `password_hash()` et vérifiés par `password_verify()`. Aucun mot de passe n'est stocké en clair.
5. **Fixation de Session** : Régénération systématique de l'ID de session à la connexion via `session_regenerate_id(true)`.

---

## 7. Résultats des 7 Tests Obligatoires

La page automatisée `tests/run_tests.php` exécute la suite de tests unitaires et d'intégration :

| # | Libellé du Test | Condition testée | Résultat |
| :-: | :--- | :--- | :-: |
| **1** | Médecin et salle libres | Réservation sur créneau vierge | **PASS (100% Conforme)** |
| **2** | Médecin déjà occupé | Double réservation médecin bloquée | **PASS (100% Conforme)** |
| **3** | Salle déjà occupée | Double réservation salle bloquée | **PASS (100% Conforme)** |
| **4** | Salle à heures distinctes | Réservation consécutive réussie | **PASS (100% Conforme)** |
| **5** | Salle en maintenance | Refus immédiat de la salle indisponible | **PASS (100% Conforme)** |
| **6** | Chevauchements partiels | Détection des cas début/fin/englobant | **PASS (100% Conforme)** |
| **7** | Concurrence simultanée | Isolation par transaction et FOR UPDATE | **PASS (100% Conforme)** |

---

## 8. Guide d'Installation sous XAMPP

1. **Démarrage de XAMPP** :
   - Ouvrez le panneau de contrôle XAMPP.
   - Démarrez **Apache** et **MySQL**.

2. **Accès au Projet** :
   - Le projet est déjà déployé dans le dossier `htdocs` sous le nom `gestion-rendez-vous-medicaux`.
   - Ouvrez votre navigateur web et accédez à :  
     👉 **`http://localhost/gestion-rendez-vous-medicaux/`**

3. **Importation de la Base de Données (si réinstallation nécessaire)** :
   - Rendez-vous sur `http://localhost/phpmyadmin/`.
   - Créez la base `gestion_rendez_vous_db` ou importez directement le fichier :  
     `database/gestion_rendez_vous.sql`.

4. **Identifiants de Démonstration** :
   - **Compte Administrateur UCC** : `admin@hopecmedical.cd` | Mot de passe : `admin123`
   - **Compte Réceptionniste** : `reception@hopecmedical.cd` | Mot de passe : `admin123`

---
*Projet réalisé pour la 2e Licence Sciences Informatiques — Université Catholique du Congo.*

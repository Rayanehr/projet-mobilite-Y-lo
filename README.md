# Application Web de Mobilité — Yélo La Rochelle

Application web développée dans le cadre d'un projet universitaire à l'Université de La Rochelle en 2022.

L'objectif du projet est d'exploiter les données ouvertes du réseau de transport **Yélo de La Rochelle** et de les représenter de manière interactive sur une carte.

## Fonctionnalités

* Récupération des données du réseau Yélo depuis les plateformes Open Data
* Requêtes HTTP avec Axios
* Traitement et exploitation des données en JavaScript
* Affichage des données sur une carte interactive
* Localisation des informations de mobilité avec Leaflet
* Mise à jour dynamique des informations affichées

## Technologies utilisées

* HTML5
* CSS3
* JavaScript
* Axios
* Leaflet
* Open Data

## Fonctionnement

L'application récupère les données ouvertes du réseau Yélo, les traite avec JavaScript, puis les représente sur une carte interactive à l'aide de Leaflet.

```text
Données Open Data Yélo
          ↓
        Axios
          ↓
      JavaScript
          ↓
   Traitement des données
          ↓
   Carte interactive
       Leaflet
```

## Source des données

Les données ouvertes du réseau de transport Yélo sont accessibles sur :

* [Portail Open Data de la Communauté d'Agglomération de La Rochelle](https://opendata.agglo-larochelle.fr/)
* [transport.data.gouv.fr — Données des réseaux de transport](https://transport.data.gouv.fr/datasets/arrets-horaires-et-parcours-theoriques-des-reseaux-naq-lro-nva-m)

## Installation et utilisation

### Cloner le projet

```bash
git clone https://github.com/Rayanehr/projet-mobilite-yelo.git
```

### Accéder au projet

```bash
cd projet-mobilite-yelo
```

### Lancer l'application

Le projet étant basé sur HTML, CSS et JavaScript, il peut être ouvert directement dans un navigateur.

Pour une meilleure expérience, il est recommandé d'utiliser un serveur local, par exemple avec **Live Server** dans Visual Studio Code.

## Contexte

**Projet universitaire — Université de La Rochelle**
**Année : 2022**

Ce projet m'a permis de mettre en pratique le développement web côté client, la consommation de données provenant de sources Open Data et la représentation de données géographiques sur une carte interactive.

## Auteur

**Rayane HARKATI**

Étudiant en Master 2 Programmation, Sûreté et Sécurité
Université Sorbonne Paris Nord

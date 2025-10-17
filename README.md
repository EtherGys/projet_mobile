# 📱 EventEase – Application mobile React Native - Projet Mobile

**EventEase** est une application mobile prototype (sans besoin d'un backend). Elle permet aux membres d’une association fictive de consulter, créer et gérer des événements communautaires.

La navigation entre les écrans est gérée avec React Navigation (stack + tabs). Les données des événements sont stockées localement via AsyncStorage, permettant une persistance sans backend. La structure du code suit une organisation en composants modulaires (screens/, components/).
Le CRUD complet sur les événements est fonctionnel (création, modification, suppression), avec une option pour marquer un événement comme "participé".
Une gestion simple d’authentification (mockée) permet à l’utilisateur de se connecter ou s’inscrire sans appel serveur. Les informations de connexion de l'utilisateur sont stockés dans un store Zustand afin de simuler une gestion avec par exemple un token.
Le bonus intégré : l’affichage calendrier via react-native-calendars où l'utilisateur peut naviger pour voir les différents événements.

---

## 🚀 Fonctionnalités principales

✅ Connexion / inscription (mockée, sans backend)  
✅ Liste des événements (titre, description, date)  
✅ Ajout, modification, suppression d’événements  
✅ Marquer un événement comme "participé"  
✅ Persistance locale avec **AsyncStorage**

---

## 🎁 Fonctionnalités bonus (implémentées)

- 📅 Affichage des événements dans un **calendrier** (`react-native-calendars`)

---

## 🛠️ Architecture & choix techniques

- **Framework** : [React Native](https://reactnative.dev/) avec [Expo](https://expo.dev/)
- **Navigation** : `@react-navigation/native` (Stack + Tabs)
- **Persistance locale** : `@react-native-async-storage/async-storage`
- **Organisation du code** : Composants réutilisables, écrans séparés

---

## 📦 Installation & lancement

1. Cloner le repo
2. Installer les dépendances : 
npm install
3. Lancer l’application avec Expo : 
npx expo start


# Site formation professionnelle

_Started 2026-04-29 12:01 UTC_

---

## User

fais moi un site web pour mon organisme de formation, voici un exemple de site que je prends comme modele : https://lexom.fr/formations

## Assistant

_[tool: questions_v2]_

_[tool: web_fetch]_

Parfait, j'ai bien analysé le site de référence. Avant de construire, j'ai besoin d'en savoir plus sur votre organisme !

## User

Questions answered:
- nom: Ad cognita
- slogan: Développez les compétences qui font la différence"

- categories: Management, Bureautique, RH, IA, Marketing, Droit, Entrepreneuriat
- pages: Décidez pour moi
- couleurs: Décidez pour moi
- qualiopi: Oui
- cpf: Oui
- style: Sobre & corporate (comme Lexom)
- variations: Décidez pour moi

## Assistant

_[tool: update_todos]_

_[tool: copy_starter_component]_

Je commence à construire le site Ad Cognita ! Direction choisie : **corporate sobre**, navy profond + accent ambré, typographie "Plus Jakarta Sans", inspiré de Lexom mais entièrement original.

_[tool: write_file]_

_[tool: write_file]_

## Assistant

## Assistant

Je continue la construction des pages !

_[tool: write_file]_

Je continue avec les pages catalogue, détail, à propos et contact !

_[tool: write_file]_

_[tool: write_file]_

Je finalise avec les pages À propos et Contact, puis j'assemble tout !

_[tool: write_file]_

_[tool: write_file]_

Maintenant j'assemble tout dans le fichier principal !

_[tool: write_file]_

_[tool: done]_

Le site charge proprement, sans erreur !

_[tool: fork_verifier_agent]_

Voici ce qui a été construit pour **Ad Cognita** :

---

**5 pages entièrement fonctionnelles :**

- **Accueil** — hero avec formulaire de recherche, bandeau stats, grille des 7 domaines, formations populaires, section financement CPF/OPCO, CTA
- **Catalogue** — sidebar avec filtres (domaine, modalité, CPF), tri, recherche textuelle, 24 formations
- **Détail formation** — programme, objectifs, public & prérequis via onglets, carte prix + inscription, formations liées
- **À propos** — mission, valeurs, certification Qualiopi, équipe
- **Contact** — formulaire complet avec confirmation

**Tweaks disponibles** (bouton en bas à droite) : couleur principale, couleur accent, police.

---

**Prochaines étapes suggérées :**
- Ajouter vos vraies formations, prix et descriptions
- Remplacer les coordonnées et le NDA Qualiopi par les vôtres
- Ajouter votre logo en SVG ou PNG
- Intégrer un vrai backend pour le formulaire de contact

## User

Verifier agent check completed

## Assistant

Bonne détection, je corrige ça immédiatement !

_[tool: str_replace_edit]_

_[tool: done]_

Le root est vide, je vérifie les logs pour diagnostiquer.

_[tool: get_webview_logs]_

`TweaksUI` n'est pas exporté par tweaks-panel — je vais regarder ce que le composant expose réellement.

_[tool: grep]_

`TweaksUI` n'existe pas — il faut utiliser `TweaksPanel` directement. Je corrige le fichier principal :

_[tool: str_replace_edit]_

_[tool: done]_

Le site charge maintenant sans erreur !

_[tool: fork_verifier_agent]_

Le site est opérationnel ! Voici un résumé de ce qui a été livré :

**Site Ad Cognita** — 5 pages interactives :
- **Accueil** — hero avec recherche, 7 domaines, formations populaires, section financement, CTA
- **Catalogue** — 24 formations filtrables (domaine, modalité, CPF), tri, recherche
- **Détail formation** — onglets programme / objectifs / public, carte prix, formations liées
- **À propos** — mission, valeurs, Qualiopi, équipe
- **Contact** — formulaire complet avec confirmation

**Tweaks** disponibles via le bouton en bas à droite : couleurs, police, navigation rapide entre pages.

**Prochaines étapes à votre convenance :**
1. Me donner vos vraies formations pour les intégrer
2. Ajouter votre logo (PNG/SVG)
3. Compléter les coordonnées réelles (téléphone, adresse, NDA Qualiopi)
4. Choisir une palette de couleurs si vous souhaitez un autre univers visuel


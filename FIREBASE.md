# Bloqueig sense commit (Firebase, gratuït)

Amb Firebase el professor activa o desactiva el bloqueig des de `professor.html` i s'aplica a l'instant a tots els alumnes.

1. Entra a <https://console.firebase.google.com> i crea un projecte (sense Analytics).
2. **Authentication → Get started → Email/Password → activa'l.** A *Users* afegeix:
   - `carles@m0372.app` amb la contrasenya que vulguis
   - `bruno@m0372.app` amb la contrasenya que vulguis
   (A la web s'entra només amb `carles` o `bruno`.)
3. **Realtime Database → Create database** (regió Europa, mode *locked*). A la pestanya **Rules** enganxa:
```
{
  "rules": {
    "exam": {
      ".read": true,
      ".write": "auth != null && (auth.token.email == 'carles@m0372.app' || auth.token.email == 'bruno@m0372.app')"
    }
  }
}
```
4. **Project settings → Your apps → Web (`</>`)**: copia l'objecte `firebaseConfig` (ha d'incloure `databaseURL`).
5. Enganxa'l a `assets/data/firebase-config.js` (substitueix `null`), fes un únic commit i ja està.

Si ho deixes en `null`, la web funciona en mode `exam.json` (cal commit per canviar el bloqueig).

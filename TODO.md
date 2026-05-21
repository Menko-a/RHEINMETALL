# TODO

## Rheinmetall-Marketplace (Expo + Firebase)
- [ ] Create new Expo RN project structure in a new folder: Rheinmetall-Marketplace
- [ ] Add Firebase config via env vars (no secrets committed)
- [ ] Implement Firebase Auth (register/login, validation, session persistence)
- [ ] Firestore data model with 8 collections:
  - users
  - userProfiles
  - transactions
  - transactionItems
  - transactionStatusHistory
  - payments
  - mediaFiles
  - auditLogs
- [ ] Implement core transaction flows: create, update status, cancel/complete + write history
- [ ] Implement media uploads to Firebase Storage + store URLs in Firestore
- [ ] Implement real-time UI updates via Firestore listeners
- [ ] Build screens (Login, Register, AccountSetup/Profile, Marketplace/Homepage, Cart/Transactions)
- [ ] Ensure modular code structure: services/, hooks/, screens/, components/
- [ ] Lint/typecheck/build + commit and push


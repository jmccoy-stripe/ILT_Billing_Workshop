# ILT_Billing_Workshop
Final handoff code for ILT Billing Workshop

## Module 2: Initial Application Structure & Stripe Setup
- Update .env
### M2.a: Sign up:
#### Frontend:
- /src/app/signup/page.tsx:
  - Import API Handlers
  - Add Submit Handler
- /src/app/actions.tsx:
  - Function to create user
  - Function to auth user
#### Backend:
- /src/controllers/authController.ts:
  - Function to create user
  - Generate token
- /src/stripe.ts:
  - New file to handle env
### M2.b: Sign in:
#### Frontend:
- /src/app/actions.tsx:
  - Function to singin user
- /src/signin/page.tsx:
  - Import action handlers
  - Add submit handler
#### Backend:
- /src/controllers/authController.ts:
  - Function to signin user
### M2.c: Customer header:
#### Frontend:
- /src/components/Header.tsx:
  - Function to show header
  - Add logout handler
#### Backend:
- 

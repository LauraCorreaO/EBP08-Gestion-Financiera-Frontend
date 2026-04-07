---

AUTHENTICATION

The backend uses JWT authentication. The flow is:
1. User registers or logs in via POST request
2. Backend returns a JWT token as a plain String in the response body
3. The frontend must store this token (localStorage or memory)
4. Every protected request must include the header:
   Authorization: Bearer <token>
5. On logout, the frontend must delete the stored token locally — 
   the backend only responds 200 OK, it does not invalidate the token server-side
6. If any protected request returns 401 or 403, redirect the user to the login screen

---

BASE URL

http://localhost:8080/api

---

ENDPOINTS AND EXPECTED DATA

-- USERS --

POST /usuarios/registro          (public, no token required)
Request body:
{
  "nombre": "string",
  "correo": "string",
  "clave": "string"
}
Success: 201 Created — returns the created user object
Errors: 409 Conflict (email already registered)

POST /usuarios/login             (public, no token required)
Request body:
{
  "correo": "string",
  "clave": "string"
}
Success: 200 OK — returns JWT token as plain String in body
Errors:
  401 Unauthorized — wrong password
  403 Forbidden — user blocked or inactive
  404 Not Found — email not registered

POST /usuarios/logout            (requires token)
No body required
Success: 200 OK — frontend must delete the stored token

---

-- CATEGORIES --

POST /categorias                 (requires token)
Creates a custom category for the authenticated user.
The backend automatically assigns the category to the logged-in user — 
do NOT send idUsuario in this request.
Request body:
{
  "nombre": "string",
  "descripcion": "string"
}
Success: 201 Created — returns the created category object

GET /categorias/usuario/{idUsuario}   (requires token)
Returns all categories available for the user: 
global categories (no owner) + user's personal categories.
idUsuario must match the logged-in user's ID.
Success: 200 OK — returns array of category objects

---

-- TRANSACTIONS --

POST /transacciones              (requires token)
Creates a transaction for the authenticated user.
The backend automatically assigns the transaction to the logged-in user —
do NOT send idUsuario in this request.
Request body:
{
  "idCategoria": number,
  "tipo": "INGRESO" | "GASTO",
  "descripcion": "string (optional)",
  "monto": "string (send as string, e.g. '25000')"
}
Note: monto must be sent as a string, not a number.
Success: 201 Created — returns the created transaction object
Errors:
  400 Bad Request — missing or invalid fields
  403 Forbidden — category does not belong to the user
  404 Not Found — category not found

GET /transacciones/usuario/{idUsuario}   (requires token)
Returns all transactions for the specified user.
idUsuario must match the logged-in user's ID.
Success: 200 OK — returns array of transaction objects

---

-- BUDGETS --

POST /presupuestos/global        (requires token)
Creates or updates a global monthly budget for the authenticated user.
The backend automatically assigns it to the logged-in user —
do NOT send idUsuario in this request.
If a global budget already exists for the current month, it updates the amount instead of creating a new one.
Request body:
{
  "montoLimite": number
}
Success: 201 Created — returns the budget object

POST /presupuestos/categoria     (requires token)
Creates or updates a budget for a specific category.
Same upsert behavior as global budget.
Request body:
{
  "idCategoria": number,
  "montoLimite": number
}
Success: 201 Created — returns the budget object
Errors:
  403 Forbidden — category does not belong to the user

GET /presupuestos/usuario/{idUsuario}    (requires token)
Returns all budgets for the specified user.
idUsuario must match the logged-in user's ID.
Success: 200 OK — returns array of budget objects

---

IMPORTANT NOTES FOR IMPLEMENTATION

- The logged-in user's ID must be extracted from the stored user object after login, 
  NOT from the JWT token itself (the token only contains the email)
- After a successful login, store both the JWT token and the user object 
  returned from the registro endpoint so you have the user's ID available for 
  subsequent requests
- All monetary amounts are handled with up to 2 decimal places
- All dates follow ISO 8601 format: "2026-03-25T00:23:42"
- All endpoints except /registro and /login require the Authorization header
- If the token is missing or invalid on a protected route, 
  the backend returns 401 — redirect to login

---

SCREENS NEEDED

1. Register screen — form with nombre, correo, clave
2. Login screen — form with correo, clave. Show error messages for each case 
   (wrong password, blocked user, email not found)
3. Dashboard — shows balance summary, recent transactions, budget status
4. Transactions screen — list of transactions, button to create new one
5. Categories screen — list of categories (global + personal), 
   button to create personal category
6. Budgets screen — global budget and budgets per category, 
   button to create or update
7. Navigation — all protected screens should show a logout button
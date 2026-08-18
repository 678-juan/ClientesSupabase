# Demo Supabase: clientes por usuario

Esta carpeta contiene una demo simple lista para subir a Vercel como sitio estático.

## Qué hace

- `login.html` solo inicia sesión o registra usuarios.
- `clientes.html` solo agrega y lista clientes.
- Cada cliente se asocia al usuario autenticado con `user_id`.
- RLS permite ver y guardar solo los clientes del usuario actual.

## Archivos

## Estructura

- `index.html`: redirige al login.
- `pages/login.html`: solo autenticación.
- `pages/clientes.html`: solo registro y listado de clientes.
- `js/login.js`: lógica del login.
- `js/clientes.js`: lógica de clientes.
- `css/styles.css`: estilos básicos.

## Paso a paso para Supabase

### 1. Crea el proyecto

Entra a Supabase y crea un proyecto nuevo.

### 2. Copia la URL y la anon key

Ve a `Settings > API` y copia:

- `Project URL`
- `anon public key`

Pégalos en `js/login.js` y `js/clientes.js` en estas variables:

```js
const SUPABASE_URL = "PON_AQUI_TU_SUPABASE_URL";
const SUPABASE_ANON_KEY = "PON_AQUI_TU_SUPABASE_ANON_KEY";
```

### 3. Crea la tabla

En `SQL Editor`, ejecuta esto:

```sql
create table public.clientes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id),
  nombre text not null,
  email text,
  telefono text,
  created_at timestamptz not null default now()
);
```

### 4. Activa RLS

```sql
alter table public.clientes enable row level security;
```

### 5. Crea las policies

```sql
create policy "Select own clients"
on public.clientes
for select
to authenticated
using (auth.uid() = user_id);

create policy "Insert own clients"
on public.clientes
for insert
to authenticated
with check (auth.uid() = user_id);
```

### 6. Configura Auth

En `Authentication > Providers`, revisa que `Email` esté habilitado.

### 7. Sube el frontend a Vercel

Sube toda la carpeta del proyecto a Vercel como sitio estático.

No necesitas backend ni `api/insert`.

Vercel debe servir estas rutas:

- `/` -> `index.html`
- `/pages/login.html` -> login
- `/pages/clientes.html` -> clientes

La `anon key` puede ir en el frontend porque es pública. No uses `service_role` en el navegador.

## Flujo de uso

1. El usuario abre `/` y cae en el login.
2. Supabase crea la sesión y el JWT automáticamente.
3. `pages/login.html` redirige a `pages/clientes.html` cuando hay sesión.
4. `pages/clientes.html` obtiene el usuario actual y muestra una tabla con sus clientes.
5. Al guardar un cliente, se envía `user_id` junto al resto de campos.
6. RLS deja guardar y leer solo los clientes del usuario autenticado.

## Errores comunes

- `Pega tu SUPABASE_URL y tu SUPABASE_ANON_KEY`: aún no reemplazaste los valores en `js/login.js` y `js/clientes.js`.
- `new row violates row-level security policy`: la policy no está creada o `user_id` no coincide con el usuario autenticado.
- `No has iniciado sesión`: primero debes hacer login o registrarte.
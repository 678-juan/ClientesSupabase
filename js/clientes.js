const SUPABASE_URL = "https://wyijenjdtuaentumtxek.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZXB-QbPQAdY62A-0bugCJA_9b1lmdSt";

const ready = typeof window.supabase !== "undefined" && SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("PON_AQUI") && !SUPABASE_ANON_KEY.includes("PON_AQUI");
const client = ready ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const authStatus = document.getElementById("authStatus");
const result = document.getElementById("result");
const form = document.getElementById("clientForm");
const tbody = document.getElementById("clientsTbody");
const logoutBtn = document.getElementById("logoutBtn");

function setMessage(text) {
  result.textContent = text;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function renderRows(rows) {
  if (!rows.length) {
    tbody.innerHTML = '<tr><td colspan="4">Todavía no hay clientes.</td></tr>';
    return;
  }

  tbody.innerHTML = rows.map((row) => `
    <tr>
      <td>${escapeHtml(row.nombre || "")}</td>
      <td>${escapeHtml(row.email || "")}</td>
      <td>${escapeHtml(row.telefono || "")}</td>
      <td>${new Date(row.created_at).toLocaleString()}</td>
    </tr>
  `).join("");
}

async function session() {
  if (!client) return null;
  const { data } = await client.auth.getSession();
  return data.session;
}

async function loadClients() {
  const s = await session();
  if (!s) {
    window.location.href = "login.html";
    return;
  }

  authStatus.textContent = s.user.email;

  const { data, error } = await client
    .from("clientes")
    .select("nombre, email, telefono, created_at")
    .eq("user_id", s.user.id)
    .order("created_at", { ascending: false });

  if (error) {
    setMessage("No se pudieron cargar los clientes.");
    return;
  }

  renderRows(data || []);
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!client) {
    setMessage("No se pudo conectar. Intenta más tarde.");
    return;
  }

  const s = await session();
  if (!s) {
    window.location.href = "login.html";
    return;
  }

  const nombre = document.getElementById("nombre").value.trim();
  const email = document.getElementById("email").value.trim();
  const telefono = document.getElementById("telefono").value.trim();

  if (!nombre) {
    setMessage("Escribe el nombre del cliente.");
    return;
  }

  const { error } = await client.from("clientes").insert([{ user_id: s.user.id, nombre, email, telefono }]);

  if (error) {
    setMessage("No se pudo guardar el cliente.");
    return;
  }

  form.reset();
  setMessage("Cliente agregado.");
  await loadClients();
});

logoutBtn.addEventListener("click", async () => {
  if (!client) return;
  await client.auth.signOut();
  window.location.href = "login.html";
});

if (!client) {
  authStatus.textContent = "Sin conexión";
  setMessage("No se pudo conectar. Intenta más tarde.");
} else {
  loadClients();
}
const SUPABASE_URL = "PON_AQUI_TU_SUPABASE_URL";
const SUPABASE_ANON_KEY = "sb_publishable_ZXB-QbPQAdY62A-0bugCJA_9b1lmdSt";

const ready = typeof window.supabase !== "undefined" && SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("PON_AQUI") && !SUPABASE_ANON_KEY.includes("PON_AQUI");
const client = ready ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const form = document.getElementById("authForm");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("toggleBtn");
let mode = "login";

function setMessage(text) {
  result.textContent = text;
}

function updateMode() {
  submitBtn.textContent = mode === "login" ? "Entrar" : "Registrar y entrar";
  toggleBtn.textContent = mode === "login" ? "Crear cuenta" : "Ya tengo cuenta";
}

toggleBtn.addEventListener("click", () => {
  mode = mode === "login" ? "signup" : "login";
  updateMode();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!client) {
    setMessage("Pega tu SUPABASE_URL y tu SUPABASE_ANON_KEY en login.js.");
    return;
  }

  const email = document.getElementById("authEmail").value.trim();
  const password = document.getElementById("authPassword").value;

  if (!email || !password) {
    setMessage("Escribe email y contraseña.");
    return;
  }

  const response = mode === "login"
    ? await client.auth.signInWithPassword({ email, password })
    : await client.auth.signUp({ email, password });

  if (response.error) {
    setMessage(`Error: ${response.error.message}`);
    return;
  }

  if (mode === "signup" && !response.data.session) {
    setMessage("Cuenta creada. Revisa tu correo si activaste confirmación.");
    return;
  }

  window.location.href = "clientes.html";
});

if (!client) {
  setMessage("Pega tu SUPABASE_URL y tu SUPABASE_ANON_KEY en login.js.");
}

updateMode();
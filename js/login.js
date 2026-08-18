const SUPABASE_URL = "https://wyijenjdtuaentumtxek.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ZXB-QbPQAdY62A-0bugCJA_9b1lmdSt";

const ready = typeof window.supabase !== "undefined" && SUPABASE_URL.startsWith("https://") && !SUPABASE_URL.includes("PON_AQUI") && !SUPABASE_ANON_KEY.includes("PON_AQUI");
const client = ready ? window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY) : null;

const form = document.getElementById("authForm");
const result = document.getElementById("result");
const submitBtn = document.getElementById("submitBtn");
const toggleBtn = document.getElementById("toggleBtn");
const passwordInput = document.getElementById("authPassword");
const confirmPasswordInput = document.getElementById("authConfirmPassword");
let mode = "login";

function setMessage(text) {
  result.textContent = text;
}

function updateMode() {
  const isSignup = mode === "signup";

  submitBtn.textContent = isSignup ? "Registrar" : "Entrar";
  toggleBtn.textContent = isSignup ? "Ya tengo cuenta" : "Crear cuenta";
  confirmPasswordInput.style.display = isSignup ? "block" : "none";
  confirmPasswordInput.required = isSignup;

  if (!isSignup) {
    confirmPasswordInput.value = "";
  }
}

toggleBtn.addEventListener("click", () => {
  mode = mode === "login" ? "signup" : "login";
  updateMode();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  if (!client) {
    setMessage("No se pudo conectar. Intenta más tarde.");
    return;
  }

  const email = document.getElementById("authEmail").value.trim();
  const password = passwordInput.value;
  const confirmPassword = confirmPasswordInput.value;

  if (!email || !password) {
    setMessage("Completa email y contraseña.");
    return;
  }

  if (mode === "signup") {
    if (!confirmPassword) {
      setMessage("Confirma tu contraseña.");
      return;
    }

    if (password !== confirmPassword) {
      setMessage("Las contraseñas no coinciden.");
      return;
    }
  }

  const response = mode === "login"
    ? await client.auth.signInWithPassword({ email, password })
    : await client.auth.signUp({ email, password });

  if (response.error) {
    setMessage(mode === "login"
      ? "No se pudo iniciar sesión. Verifica tus datos."
      : "No se pudo crear la cuenta. Intenta otra vez.");
    return;
  }

  if (mode === "signup") {
    form.reset();
    mode = "login";
    updateMode();
    setMessage("Cuenta creada. Inicia sesión con tu usuario.");
    window.location.href = "login.html";
    return;
  }

  window.location.href = "clientes.html";
});

if (!client) {
  setMessage("No se pudo conectar. Intenta más tarde.");
}

updateMode();
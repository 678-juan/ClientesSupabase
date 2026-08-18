import java.io.IOException;
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;
import java.nio.charset.StandardCharsets;

public class SupabaseInsertExample {

    public static void main(String[] args) throws Exception {
        String supabaseUrl = requiredEnv("SUPABASE_URL");
        String supabaseKey = requiredEnv("SUPABASE_KEY");
        String table = System.getenv().getOrDefault("SUPABASE_TABLE", "clientes");

        String name = System.getenv().getOrDefault("CLIENT_NAME", "Juan Perez");
        String email = System.getenv().getOrDefault("CLIENT_EMAIL", "juan@example.com");
        String phone = System.getenv().getOrDefault("CLIENT_PHONE", "555-123-456");

        String jsonBody = "{" +
                "\"nombre\":\"" + escapeJson(name) + "\"," +
                "\"email\":\"" + escapeJson(email) + "\"," +
                "\"telefono\":\"" + escapeJson(phone) + "\"" +
                "}";

        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create(supabaseUrl + "/rest/v1/" + table))
                .header("apikey", supabaseKey)
                .header("Authorization", "Bearer " + supabaseKey)
                .header("Content-Type", "application/json")
                .header("Prefer", "return=representation")
                .POST(HttpRequest.BodyPublishers.ofString(jsonBody, StandardCharsets.UTF_8))
                .build();

        HttpClient client = HttpClient.newHttpClient();
        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString(StandardCharsets.UTF_8));

        System.out.println("Status: " + response.statusCode());
        System.out.println("Respuesta: " + response.body());
    }

    private static String requiredEnv(String name) {
        String value = System.getenv(name);
        if (value == null || value.isBlank()) {
            throw new IllegalStateException("Falta la variable de entorno " + name);
        }
        return value;
    }

    private static String escapeJson(String value) {
        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"")
                .replace("\n", "\\n")
                .replace("\r", "\\r")
                .replace("\t", "\\t");
    }
}
import { defineConfig, loadEnv } from "vite";
import tailwindcss from "@tailwindcss/vite";
import { resolve } from "node:path";
import { readFileSync } from "node:fs";
import { Resend } from "resend";

// Resolves <!--include:name.html--> markers against src/partials/
function htmlIncludes() {
  const partialsDir = resolve(import.meta.dirname, "src/partials");
  return {
    name: "html-includes",
    transformIndexHtml(html) {
      return html.replace(/<!--\s*include:(\S+?)\s*-->/g, (_, name) =>
        readFileSync(resolve(partialsDir, name), "utf-8"),
      );
    },
  };
}

function buildEmailText({ name, email, phone, message }) {
  return `New Contact Form Submission

Name: ${name}
Phone: ${phone || "N/A"}
Email: ${email}

Message:
${message || "N/A"}`;
}

function resendApiPlugin() {
  const handleEmailRequest = async (req, res, env) => {
    let body = "";
    req.on("data", (chunk) => {
      body += chunk.toString();
    });
    req.on("end", async () => {
      try {
        const data = JSON.parse(body || "{}");
        const apiKey = env.VITE_RESEND_API_KEY;
        const resend = new Resend(apiKey);
        const { name, email, phone, message } = data;

        if (!name || !email) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              success: false,
              error: "Name and email are required.",
            }),
          );
          return;
        }

        const fromEmail = env.VITE_RESEND_FROM_EMAIL;
        const toEmail = env.VITE_RESEND_TO_EMAIL;

        const response = await resend.emails.send({
          from: fromEmail,
          to: [toEmail],
          subject: `New Contact Inquiry from ${name}`,
          text: buildEmailText({ name, email, phone, message }),
        });

        if (response.error) {
          res.statusCode = 400;
          res.setHeader("Content-Type", "application/json");
          res.end(
            JSON.stringify({
              success: false,
              error: response.error.message || "Resend API error",
            }),
          );
          return;
        }

        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.end(JSON.stringify({ success: true, id: response.data?.id }));
      } catch (err) {
        res.statusCode = 500;
        res.setHeader("Content-Type", "application/json");
        res.end(
          JSON.stringify({
            success: false,
            error: err.message || "Internal server error",
          }),
        );
      }
    });
  };

  return {
    name: "resend-api",
    configureServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/send-email" && req.method === "POST") {
          handleEmailRequest(req, res, env);
        } else {
          next();
        }
      });
    },
    configurePreviewServer(server) {
      const env = loadEnv(server.config.mode, process.cwd(), "");
      server.middlewares.use((req, res, next) => {
        if (req.url === "/api/send-email" && req.method === "POST") {
          handleEmailRequest(req, res, env);
        } else {
          next();
        }
      });
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), htmlIncludes(), resendApiPlugin()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, "index.html"),
        velmora: resolve(import.meta.dirname, "velmora.html"),
      },
    },
  },
});

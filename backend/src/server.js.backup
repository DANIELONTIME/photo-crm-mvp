require("dotenv").config();
const app = require("./app");

// 🛠️ Rotas
const clientRoutes = require("../routes/clients");
const authRoutes = require("../routes/auth");

// 🧠 Use as rotas ANTES de iniciar o servidor
app.use("/api/clients", clientRoutes);
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3001;
const HOST = process.env.HOST || "0.0.0.0";

app.listen(PORT, HOST, () => {
  console.log("🚀 ================================");
  console.log(`📍 Servidor rodando em http://${HOST}:${PORT}` );
  console.log(`🏥 Health check: http://${HOST}:${PORT}/health` );
  console.log(`🌍 Ambiente: ${process.env.NODE_ENV || "development"}`);
  console.log("🚀 ================================");
});

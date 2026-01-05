import app from "./app.js";
import { envVars } from "./app/config/env.js";

const PORT = envVars.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

import app from "./app";
import https from 'https';
import fs from 'fs';
import { initRelatorioJob } from './jobs/relatorio';

const PORT = process.env.PORT || 3000;
const keyPath = 'cert/localhost+2-key.pem';
const certPath = 'cert/localhost+2.pem';

// Inicializa o agendamento de relatórios diários (18h)
initRelatorioJob();

if (fs.existsSync(keyPath) && fs.existsSync(certPath)) {
  const options = {
    key: fs.readFileSync(keyPath),
    cert: fs.readFileSync(certPath)
  };
  https.createServer(options, app).listen(PORT, () => {
    console.log(`Server is running at https://127.0.0.1:${PORT}/`);
    console.log(`Swagger documentation at https://127.0.0.1:${PORT}/api-docs`);
  });
} else {
  app.listen(PORT, () => {
    console.log(`Server is running at http://127.0.0.1:${PORT}/`);
    console.log(`Swagger documentation at http://127.0.0.1:${PORT}/api-docs`);
  });
}


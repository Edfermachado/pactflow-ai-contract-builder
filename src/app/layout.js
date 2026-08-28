import "./globals.css";

export const metadata = {
  title: "PactFlow AI — Generador & Auditor de Contratos Legales",
  description: "Cree, audite y exporte contratos de servicios profesionales para freelancers y agencias con inteligencia artificial.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link 
          rel="stylesheet" 
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,100..700,0..1,-50..200&display=block" 
        />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

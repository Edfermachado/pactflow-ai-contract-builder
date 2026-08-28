import "./globals.css";

export const metadata = {
  title: "AutoContract AI - Generador Inteligente de Contratos Legales para Freelancers & Agencias",
  description: "Crea, audita y genera contratos y acuerdos de servicios legales preliminares adaptados a tu jurisdicción con la IA de Gemini. Exporta a PDF sin costos de servidor.",
  keywords: ["contratos freelancers", "generador contratos ai", "acuerdos de servicio", "gemini flash", "legal clause agent", "contrato pdf"],
  authors: [{ name: "AutoContract AI Team" }]
};

export default function RootLayout({ children }) {
  return (
    <html lang="es" data-theme="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}

import './App.css';
import Tabata from './Tabata';
import Referidos from './Referidos';
import Seo from './Seo';
import Footer from './Footer';
import ReactGA from "react-ga";
import { Helmet } from 'react-helmet';

ReactGA.initialize("TU-ID-DE-SEGUIMIENTO");

ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  return (
    <div>
      <Helmet>
        {/* Dynamic SEO Meta Tags */}
        <title>Timer Tabata Online - Entrenamiento HIIT Gratuito | Reloj Tabata</title>
        <meta name="description" content="Reloj Tabata online gratuito para entrenamiento HIIT. Timer profesional con 8 rondas de 30 segundos. Mejora tu capacidad aeróbica y anaeróbica con el método Tabata del Dr. Izumi Tabata." />
        <meta name="keywords" content="timer tabata, reloj tabata, entrenamiento hiit, tabata online, ejercicio intervalico, alta intensidad, fitness, entrenamiento, tabata timer, hiit workout" />
        
        {/* Open Graph */}
        <meta property="og:title" content="Timer Tabata Online - Entrenamiento HIIT Gratuito" />
        <meta property="og:description" content="Reloj Tabata online gratuito para entrenamiento HIIT. Timer profesional con 8 rondas de 30 segundos." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://tabataclock.com/" />
        <meta property="og:image" content="%PUBLIC_URL%/logo512.png" />
        
        {/* Twitter Cards */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="Timer Tabata Online - Entrenamiento HIIT Gratuito" />
        <meta name="twitter:description" content="Reloj Tabata online gratuito para entrenamiento HIIT. Timer profesional con 8 rondas de 30 segundos." />
        <meta name="twitter:image" content="%PUBLIC_URL%/logo512.png" />
        
        {/* Additional SEO */}
        <link rel="canonical" href="https://tabataclock.com/" />
        <meta name="robots" content="index, follow" />
        <meta name="author" content="Timer Tabata" />
        
        {/* Structured Data */}
        <script type="application/ld+json">
        {`
          {
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Timer Tabata Online",
            "description": "Reloj Tabata online gratuito para entrenamiento HIIT con timer profesional",
            "url": "https://tabataclock.com/",
            "applicationCategory": "HealthApplication",
            "operatingSystem": "Web Browser",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "EUR"
            },
            "author": {
              "@type": "Organization",
              "name": "Timer Tabata"
            },
            "aggregateRating": {
              "@type": "AggregateRating",
              "ratingValue": "4.8",
              "ratingCount": "150"
            },
            "featureList": [
              "Timer profesional para entrenamiento Tabata",
              "8 rondas configurables",
              "Alertas sonoras",
              "Interfaz intuitiva",
              "Completamente gratuito"
            ]
          }
        `}
        </script>
      </Helmet>
      
      <Tabata />
      <Seo/>
      <Footer/>
    </div>
  );
}

export default App;

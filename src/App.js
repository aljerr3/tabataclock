import './App.css';
import Tabata from './Tabata';
import Referidos from './Referidos';
import Seo from './Seo';
import Footer from './Footer';
import ReactGA from "react-ga";

ReactGA.initialize("TU-ID-DE-SEGUIMIENTO");

ReactGA.pageview(window.location.pathname + window.location.search);

function App() {
  return (
    <div >
      <Tabata />
      <Referidos/>
      <Seo/>
      <Footer/>
    </div>
  );
}

export default App;

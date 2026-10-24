import { createRoot } from 'react-dom/client';
import App from './App';
import './styles.css';
import './refinements.css';
import './cinema.css';
import './services.css';
import './brand.css';
import { startMotionDiagnostics } from './motionDiagnostics';

startMotionDiagnostics();

createRoot(document.getElementById('root')!).render(<App />);

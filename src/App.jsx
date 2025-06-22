import { YMaps } from '@pbe/react-yandex-maps';
import Main from './compomemts/Layers/Main/Main';

const apikey = import.meta.env.VITE_API_KEY_YANDEX;

export default function App() {
  return (
    <YMaps query={{ apikey }}>
      <Main />
    </YMaps>
  );
}

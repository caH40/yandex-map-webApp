import { useEffect } from 'react';
import { Map, Placemark, useYMaps } from '@pbe/react-yandex-maps';

import { INIT_CENTER_MAP, INIT_ZOOM_MAP } from '../../../constants/navigation';
import { useFetchData } from '../../../hooks/useFetchData';
import { useGeocode } from '../../../hooks/useGeocode';
import styles from './Main.module.css';

const init = { center: INIT_CENTER_MAP, zoom: INIT_ZOOM_MAP };

export default function Main() {
  const ymaps = useYMaps(['geocode']);
  const { placemark, address, handleClickOnMap } = useGeocode(ymaps);

  const pathParts = window.location.pathname.split('/');
  const entity = pathParts[1];
  const tg = window.Telegram.WebApp;

  // Обработчик отправки данных на сервер, запущенный в боте.
  const { handleClick, error } = useFetchData({ address, placemark, tg, entity });

  useEffect(() => {
    tg.ready();

    tg.MainButton.setText('Отправить локацию');
    tg.MainButton.show();

    tg.MainButton.onClick(handleClick);

    // Очистка при размонтировании.
    return () => {
      tg.MainButton.offClick(handleClick);
    };
  }, [handleClick, tg]);

  if (entity !== 'start' && entity !== 'weather') {
    <h1 className={styles.error}>Не получено название выбираемой сущности!</h1>;
  }

  return (
    <div className={styles.wrapper}>
      <h1 className={styles.title}>
        Выбор {entity === 'start' ? 'места старта' : 'места контроля погоды'}
      </h1>
      <Map
        defaultState={init}
        width={380}
        height={430}
        onClick={handleClickOnMap}
        className={styles.map}
      >
        <Placemark geometry={placemark} />
      </Map>
      <div className={styles.description}>
        {address?.name && (
          <dl>
            <dt>Адрес:</dt>
            <dd>
              {address?.description}, {address.name}
            </dd>
          </dl>
        )}

        {error && (
          <dl>
            <dt>Адрес:</dt>
            <dd>
              <span className={styles.error}>{error}</span>
            </dd>
          </dl>
        )}
      </div>
    </div>
  );
}

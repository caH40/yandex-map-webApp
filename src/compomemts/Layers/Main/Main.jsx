import { useCallback, useEffect, useState } from 'react';
import { Map, Placemark, useYMaps } from '@pbe/react-yandex-maps';

import { INIT_CENTER_MAP, INIT_ZOOM_MAP } from '../../../constants/navigation';
import styles from './Main.module.css';
// import { roundingNumber } from '../../../utils/numbers';

const init = { center: INIT_CENTER_MAP, zoom: INIT_ZOOM_MAP };

export default function Main() {
  const [placemark, setPlacemark] = useState(init.center);
  const [address, setAddress] = useState(null);
  const [error, setError] = useState(null);

  const pathParts = window.location.pathname.split('/');
  const entity = pathParts[1];

  const ymaps = useYMaps(['geocode']);

  const tg = window.Telegram.WebApp;

  // Обработчик отправки данных на сервер (сервер отправляет в чат телеграм с ботом).
  const handleClick = useCallback(() => {
    setError(null);
    const userId = tg.initDataUnsafe?.user?.id;

    fetch(`https://impossibly-achieving-vervet.cloudpub.ru/${entity}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        userId,
        data: { address, coords: placemark },
      }),
    })
      .then((res) => {
        if (res.ok) {
          tg.close();
        } else {
          throw new Error('Ошибка сервера');
        }
      })
      .catch((e) => setError(e.message ? e.message : 'Ошибка при отправке данных на сервер!'));
  }, [address, placemark, tg, entity]);

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

  const handleClickOnMap = (e) => {
    const coords = e.get('coords');
    setPlacemark(coords);

    ymaps
      .geocode(coords)
      .then((result) => {
        const firstGeoObject = result.geoObjects.get(0);
        const properties = firstGeoObject.properties;

        if (properties) {
          const description = String(properties.get('description', {}));
          const name = String(properties.get('name', {}));
          setAddress({ description, name });
        } else {
          setAddress(null);
        }
      })
      .catch(() => setAddress(null));
  };

  return (
    <div className={styles.wrapper}>
      <Map defaultState={init} width={380} height={430} onClick={handleClickOnMap}>
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
        {/* 
        <dl>
          <dt>Координаты:</dt>
          <dd>
            {roundingNumber(placemark[0], 4)}, {roundingNumber(placemark[1], 4)}
          </dd>
        </dl> */}

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

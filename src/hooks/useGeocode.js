import { useState, useCallback } from 'react';

/**
 * Хук для работы с геокодированием Yandex Maps.
 * @param {object} ymaps - Объект Yandex Maps API (должен быть загружен через useYMaps).
 */
export const useGeocode = (ymaps) => {
  const [placemark, setPlacemark] = useState(null);
  const [address, setAddress] = useState(null);

  /**
   * Обработчик клика по карте.
   * - Получает координаты клика.
   * - Обновляет метку (`placemark`).
   * - Геокодирует координаты в адрес (`address`).
   */
  const handleClickOnMap = useCallback(
    async (e) => {
      const coords = e.get('coords');
      setPlacemark(coords);

      if (!ymaps) return;

      try {
        const result = await ymaps.geocode(coords);
        const firstGeoObject = result.geoObjects.get(0);
        const properties = firstGeoObject.properties;

        if (properties) {
          const description = String(properties.get('description', {}));
          const name = String(properties.get('name', {}));
          setAddress({ description, name });
        } else {
          setAddress(null);
        }
      } catch {
        setAddress(null);
      }
    },
    [ymaps]
  );

  return { placemark, address, handleClickOnMap };
};

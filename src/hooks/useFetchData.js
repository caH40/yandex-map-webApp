import { useCallback, useState } from 'react';

const REST_SERVER = import.meta.env.VITE_REST_SERVER;

/**
 * Через POST запрос отправляются гео данные: координаты и название выбранной точки на карте.
 * Сервер, обрабатывающий запросы, запущен в боте.
 */
export function useFetchData({ address, placemark, tg, entity }) {
  const [error, setError] = useState(null);
  const handleClick = useCallback(() => {
    setError(null);
    const userId = tg.initDataUnsafe?.user?.id;

    fetch(`${REST_SERVER}/${entity}`, {
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

  return { handleClick, error };
}

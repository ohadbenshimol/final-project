import { useState, useEffect } from 'react';
import { onValue, ref, off } from 'firebase/database';
import { db } from '../helpers/firebase';

const useRealtimeQuery = <T extends any>(path: string) => {
  const [data, setData] = useState<T>();

  useEffect(() => {
    const dbRef = ref(db, path);
    const handleValueChange = (snapshot: any) => {
      setData(snapshot.val());
    };

    onValue(dbRef, handleValueChange);

    return () => {
      off(dbRef, 'value', handleValueChange);
    };
  }, [path]);

  return data;
};

export default useRealtimeQuery;

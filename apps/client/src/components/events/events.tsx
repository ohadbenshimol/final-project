import './events.less';
import {db, eventRef} from "../../helpers/init-firebase";
import {useEffect, useState} from "react";
import {onValue, ref} from "firebase/database";

type Event = {
  creationDate: string;
  owner: string
  name: string
  url: string
}

export interface LoginProps {
}

export function Events() {
  // const {isLoading, error, data} = useQuery({
  //   queryKey: ['repoData'],
  //   onError: (err) => console.error(err),
  //   onSuccess: (data) => console.log(data),
  //   queryFn: () =>
  //     getAllEvents(),
  // })
  const [events, setEvents] = useState([])
  useEffect(() => {
    console.log("bla blas")

    onValue(eventRef, (snapshot) => {
      setEvents(snapshot.val())
    });
  }, [])
  return (
    <div>
      im events
      {Object.values(events)?.map((event, index) => <div key={index}>{event}</div>)}
    </div>
  );
}

export default Events;


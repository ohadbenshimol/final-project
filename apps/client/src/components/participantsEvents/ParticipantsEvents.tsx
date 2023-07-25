import { eventsRef } from '../../helpers/firebase';
import { FC, useEffect, useState } from 'react';
import { equalTo, off, onValue, orderByChild, query } from 'firebase/database';
import { Card } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getUser, getUserID } from '../../store/reducers/userSlice';
import { NewEvent } from '../../shared/models/event';
import { debounce } from 'ts-debounce';
import { useCookies } from 'react-cookie';
import { Row } from 'antd';
import { useNavigation } from '../../hooks/navigate';
import { Fade } from 'react-awesome-reveal';
import { CardComp, LoadingCards } from '../card/Card';
import './ParticipantsEvents.less';

interface ParticipantsEventsProps {}

const ParticipantsEvents: FC<ParticipantsEventsProps> = () => {
  const userID = useSelector(getUserID);
  const user = useSelector(getUser);
  const [participantsEvents, setParticipantsEvents] =
    useState<Record<string, NewEvent>>();
  const [filteredEvents, setFilteredEvents] =
    useState<Record<string, NewEvent>>();
  const { goToLoginPage } = useNavigation('/shared-events');
  const [cookies] = useCookies(['user']);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!(user.email && cookies.user.email)) {
      goToLoginPage();
    }
  }, [user, cookies]);

  useEffect(() => {
    if (!userID) return;
    const eventQuery = query(
      eventsRef,
      orderByChild(`subscribers/${userID}`),
      equalTo(true)
    );

    const handleValueChange = (snapshot: any) => {
      const data = snapshot.val() as Record<string, NewEvent>;
      const EventsByUserID =
        data &&
        Object.fromEntries(
          Object.entries(data).filter(([k, event]) => event.owner !== userID)
        );
      setLoading(false);
      setParticipantsEvents(EventsByUserID);
      setFilteredEvents(EventsByUserID);
    };

    onValue(eventQuery, handleValueChange);

    return () => {
      off(eventQuery, 'value', handleValueChange);
    };
  }, [userID]);

  const handleInputChange = (event: any) => {
    const filteredEvent = Object.fromEntries(
      Object.entries(participantsEvents!).filter(([id, newEvent]) => {
        const lowerCaseInput = event.target.value?.toLowerCase();
        return (
          newEvent.name.toLowerCase().includes(lowerCaseInput) ||
          id?.toLowerCase().includes(lowerCaseInput)
        );
      })
    );

    setFilteredEvents(filteredEvent);
  };

  const debounceInputChange = debounce(handleInputChange, 300);

  return (
    <>
      {participantsEvents && Object.keys(participantsEvents)?.length > 0 && (
        <>
          <Card.Group centered>
            <Row
              style={{
                width: '100%',
                display: 'flex',
                justifyContent: 'center',
              }}
            >
              <div className="ui icon input">
                <input
                  type="text"
                  placeholder="enter event id or name"
                  onKeyUp={debounceInputChange}
                />
                <i
                  aria-hidden="true"
                  className="search icon"
                  style={{ color: 'var(--main-color)', opacity: 0.9 }}
                />
              </div>
            </Row>
            {Object.entries(filteredEvents!)?.map(
              ([id, event]: [string, NewEvent], index) => (
                <CardComp key={id} id={id} event={event} />
              )
            )}
          </Card.Group>
        </>
      )}

      {loading && <LoadingCards />}

      {filteredEvents && Object.values(filteredEvents).length === 0 && (
        <Row>
          <Fade
            direction="right"
            duration={30}
            cascade
            className={'not-found-message'}
          >
            Sorry, we couldn't find the event you were looking for...
          </Fade>
        </Row>
      )}
    </>
  );
};

export default ParticipantsEvents;

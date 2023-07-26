import CreateNewEvent from '../createNewEvent/createNewEvent';
import { eventsRef } from '../../helpers/firebase';
import { FC, useEffect, useState } from 'react';
import { equalTo, off, onValue, orderByChild, query } from 'firebase/database';
import { Card } from 'semantic-ui-react';
import { useSelector } from 'react-redux';
import { getUser, getUserID } from '../../store/reducers/userSlice';
import { NewEvent } from '../../shared/models/event';
import { debounce } from 'ts-debounce';
import { useCookies } from 'react-cookie';
import { Col, Modal, Row, Tooltip } from 'antd';
import { AppstoreAddOutlined } from '@ant-design/icons';
import { useNavigation } from '../../hooks/navigate';
import { Fade } from 'react-awesome-reveal';
import { CardComp, LoadingCards } from '../card/Card';
import './OwnerEvents.less';

export const OwnerEvents: FC = () => {
  const userID = useSelector(getUserID);
  const user = useSelector(getUser);
  const [ownerEvents, setOwnerEvents] = useState<Record<string, NewEvent>>();
  const [filteredEvents, setFilteredEvents] =
    useState<Record<string, NewEvent>>();
  const { goToLoginPage } = useNavigation('/own-events');
  const [cookies] = useCookies(['user']);
  const [current, setCurrent] = useState(0);
  const [searchText, setSearchText] = useState('');
  const [createEventIsOpen, setCreateEventIsOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!(user.email && cookies.user.email)) {
      goToLoginPage();
    }
  }, [user, cookies]);

  const onClickAddEvent = () => setCreateEventIsOpen(true);

  useEffect(() => {
    if (!userID) return;
    const eventQuery = query(eventsRef, orderByChild(`owner`), equalTo(userID));

    const handleValueChange = (snapshot: any) => {
      const data = snapshot.val() as Record<string, NewEvent>;
      if (data) {
        const eventsByUserID = Object.fromEntries(
          Object.entries(data).filter(([_, event]) => event.owner === userID)
        );
        setOwnerEvents(eventsByUserID);
        setFilteredEvents(eventsByUserID);
      }
      setLoading(false);
    };

    onValue(eventQuery, handleValueChange);

    return () => {
      off(eventQuery, 'value', handleValueChange);
    };
  }, [userID]);

  const handleInputChange = (event: any) => {
    const text = event.target.value;
    setSearchText(text);
    const filteredEvent = Object.fromEntries(
      Object.entries(ownerEvents!).filter(([id, newEvent]) => {
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
      {ownerEvents && (
        <>
          <Card.Group centered>
            <Row className="cards-con">
              <Col>
                <Tooltip title="create new event">
                  <AppstoreAddOutlined
                    rev={undefined}
                    style={{
                      fontSize: '2.2em',
                      borderColor: 'var(--main-color)',
                      borderRadius: '20%',
                      borderWidth: '4px',
                    }}
                    onClick={onClickAddEvent}
                  />
                </Tooltip>
              </Col>
              <Col>
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
              </Col>
            </Row>
            {Object.entries(filteredEvents!)?.map(
              ([id, event]: [string, NewEvent]) => (
                <CardComp key={id} id={id} event={event} isOwner />
              )
            )}
          </Card.Group>
        </>
      )}

      {loading && <LoadingCards />}
      {searchText &&
        filteredEvents &&
        Object.values(filteredEvents!)?.length === 0 && (
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
      {!ownerEvents && !searchText && (
        <div className="empty">
          There isn't event yet click this button to create one
          <Tooltip title="create new event">
            <AppstoreAddOutlined
              rev={undefined}
              style={{
                fontSize: '2.2em',
                borderColor: 'var(--main-color)',
                borderRadius: '20%',
                borderWidth: '5px',
              }}
              onClick={onClickAddEvent}
            />
          </Tooltip>
        </div>
      )}

      <Modal
        footer={null}
        okButtonProps={{ disabled: true }}
        cancelButtonProps={{ disabled: true }}
        width={860}
        title="Create new event"
        centered
        open={createEventIsOpen}
        onOk={() => setCreateEventIsOpen(false)}
        onCancel={() => {
          setCurrent(0);
          setCreateEventIsOpen(false);
        }}
      >
        <CreateNewEvent
          setCreateEventIsOpen={setCreateEventIsOpen}
          setCurrent={setCurrent}
          current={current}
        ></CreateNewEvent>
      </Modal>
    </>
  );
};

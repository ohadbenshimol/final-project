import defaultImg from '../../assets/default.svg';
import useRealtimeQuery from '../../hooks/useRealtimeQuery';
import { db } from '../../helpers/firebase';
import { FC } from 'react';
import { get, ref, update } from 'firebase/database';
import { Card, Image } from 'semantic-ui-react';
import { UserState } from '../../store/reducers/userSlice';
import { NewEvent } from '../../shared/models/event';
import { Skeleton, Tooltip } from 'antd';
import {
  CarryOutOutlined,
  CloudUploadOutlined,
  FormOutlined,
  MinusCircleOutlined,
  ShareAltOutlined,
} from '@ant-design/icons';
import { closeEvent } from '../../helpers/requests';
import { useNavigation } from '../../hooks/useNavigation';
import { shareClick } from '../../helpers/utils';
import { CLIENT_URL } from '../../helpers/config';
import { UsersPhotos } from '../usersPhotos/UsersPhotos';
import './Card.less';

export const CardComp: FC<{
  id: string;
  event: NewEvent;
  hideBtns?: boolean;
  isOwner?: boolean;
}> = ({ event, id, hideBtns, isOwner }) => {
  const { goToUploadFilePage } = useNavigation('/own-events');
  const users = useRealtimeQuery<Record<string, UserState>>('users');

  const getEvent = async (eventId: string) => {
    const snapshot = await get(ref(db, `/events/${eventId}`));
    return snapshot.val();
  };

  const endEvent = async (eventId: string) => {
    const event: NewEvent = await getEvent(eventId);
    if (event) {
      await update(ref(db, `events/${eventId}`), {
        ...event,
        isActive: false,
      });

      await closeEvent({ eventId });
    }
  };

  return (
    <Card>
      <div
        className="image-container"
        style={{
          position: 'relative',
          overflow: 'hidden',
          maxHeight: '14.5em',
          width: '100%',
        }}
      >
        <div
          style={{
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundImage: `url(${event.imgUrl || defaultImg})`,
            filter: 'blur(10px)',
          }}
        />
        <Image
          style={{
            position: 'relative',
            maxHeight: '15em',
            objectFit: 'contain',
            zIndex: 1,
            margin: 'auto',
          }}
          className="Sad"
          src={event.imgUrl || defaultImg}
          fluid
          ui={false}
        />
      </div>

      <Card.Content className="card-text">
        <Card.Header>{event.name}</Card.Header>
        <Card.Meta>
          <span className="date">{event.creationDate}</span>
        </Card.Meta>
        <Card.Description>{event.description}</Card.Description>
      </Card.Content>
      {!hideBtns && (
        <Card.Content extra>
          <div className="users-con">
            <UsersPhotos subscribers={event.subscribers} users={users} />
            <div className="buttons">
              <Tooltip title="share">
                <ShareAltOutlined
                  rev={undefined}
                  onClick={() =>
                    shareClick(`${CLIENT_URL}/register-event/${id}`)
                  }
                />
              </Tooltip>
              {event.isActive && (
                <Tooltip title="upload images">
                  <CloudUploadOutlined
                    rev={undefined}
                    onClick={() => goToUploadFilePage(id)}
                  />
                </Tooltip>
              )}
              {event.isActive ? (
                isOwner ? (
                  <Tooltip title="end event">
                    <MinusCircleOutlined
                      rev={undefined}
                      onClick={() => endEvent(id)}
                    />
                  </Tooltip>
                ) : null
              ) : (
                <Tooltip title="event is finish">
                  <CarryOutOutlined rev={undefined} />
                </Tooltip>
              )}
            </div>
          </div>
        </Card.Content>
      )}
    </Card>
  );
};

export const LoadingCards: FC = () => {
  const loadingCards = new Array(15).fill(null).map((_, index) => {
    return (
      <Card key={index}>
        <Skeleton.Image active style={{ width: '100%', height: '14em' }} />
        <Card.Content>
          <Skeleton.Input active style={{ marginBottom: '0.2em' }} />
          <Skeleton.Input active style={{ marginBottom: '0.2em' }} />
          <Skeleton.Input active style={{ marginBottom: '0.2em' }} />
        </Card.Content>
        <Card.Content extra>
          <div className="c">
            <div className="avatars">
              <Skeleton.Avatar active />
              <Skeleton.Avatar active />
              <Skeleton.Avatar active />
            </div>

            <div className="buttons">
              <ShareAltOutlined rev={undefined} />
              <FormOutlined rev={undefined} />
              <CloudUploadOutlined rev={undefined} />
            </div>
          </div>
        </Card.Content>
      </Card>
    );
  });

  return <Card.Group centered>{loadingCards}</Card.Group>;
};

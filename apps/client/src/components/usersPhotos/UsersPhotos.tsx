import { FC } from 'react';
import { UserState } from '../../store/reducers/userSlice';
import { Avatar } from 'antd';
import { UserOutlined } from '@ant-design/icons';
import './UsersPhotos.less';

interface UsersPhotosProps {
  subscribers: Record<string, boolean>;
  users?: Record<string, UserState>;
}

export const UsersPhotos: FC<UsersPhotosProps> = ({ subscribers, users }) => {
  const ids = Object.keys(subscribers);
  const maxCount = 3;

  return (
    <>
      <Avatar.Group
        maxCount={maxCount}
        maxPopoverPlacement={'bottom'}
        maxStyle={{ color: '#f56a00', backgroundColor: '#fde3cf' }}
      >
        {users &&
          Object.entries(users)
            ?.filter(([k, v]) => ids.includes(k)) //TODO
            .map(([k, v], index) => (
              <div key={k}>
                <Avatar
                  gap={8}
                  icon={
                    <img
                      style={{ display: 'block' }}
                      onError={(e: any) => {
                        e.target.src = '../../assets/user.png';
                        return true;
                      }}
                      src={v.pictureUrl}
                    />
                  }
                  alt={`${v.firstName} ${v.lastName}`}
                >
                  <UserOutlined rev={undefined} />
                </Avatar>
              </div>
            ))}
      </Avatar.Group>
    </>
  );
};

import jwt_decode from 'jwt-decode';
import { GoogleLogin } from '@react-oauth/google';
import { toast } from 'react-toastify';
import './Login.less';

interface User {
  email: string;
  fullName: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
}
export interface LoginProps {}
export function Login(props: LoginProps) {
  return (
    <div>
      <GoogleLogin
        onSuccess={(response) => {
          if (response.credential) {
            const responsePayload: any = jwt_decode(response.credential);

            const user: User = {
              email: responsePayload.email,
              firstName: responsePayload.given_name,
              lastName: responsePayload.family_name,
              fullName: responsePayload.name,
              pictureUrl: responsePayload.picture,
            };

            toast.success(`welcome ${user.fullName} :)`);
          }
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
}

export default Login;

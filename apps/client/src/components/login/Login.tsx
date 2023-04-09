import { GoogleLogin } from '@react-oauth/google';
import './Login.less';

export interface LoginProps {}

export function Login(props: LoginProps) {
  return (
    <div>
      <GoogleLogin
        onSuccess={(credentialResponse) => {
          console.log(credentialResponse);
        }}
        onError={() => {
          console.log('Login Failed');
        }}
      />
    </div>
  );
}

export default Login;

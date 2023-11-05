import auth from '@react-native-firebase/auth';

let user: any = auth()?.currentUser;

export {user};

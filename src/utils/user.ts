import auth from '@react-native-firebase/auth';

let user = auth()?.currentUser;

export {user};

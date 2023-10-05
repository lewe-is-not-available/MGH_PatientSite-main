import { useAuth0 } from "@auth0/auth0-react";

const Profile = () => {
  const { user, isAuthenticated } = useAuth0();
  return (
    isAuthenticated && (
     <article className="">
        {user?.picture && <img src = {user.picture0} alt={user?.name}/>}
        <h2>{user?.name}</h2>
        <ul>
            {Object.keys(user).map((objKey, i) => <li key={i}>{objKey}: {user[objKey]}
            </li>)}
        </ul>
     </article>
    )
  );
};

export default Profile;

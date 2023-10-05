

const LoginButton = ({open}) => {
  //const { isAuthenticated } = useAuth0();
  return (

      <button
        type="submit"
        onClick={open}
        className="ring-2 text-white ring-white hover:ring-[#5f915a] hover:text-[#315E30] hover:bg-[#A5DD9D] transition duration-100 px-2 rounded-full self-center"
      >
        Sign In
      </button>
    
  );
};

export default LoginButton;

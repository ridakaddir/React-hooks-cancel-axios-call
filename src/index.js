import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Axios from "axios";

const App = () => {
  const [showUser, setShowUser] = useState(true);
  return (
    <>
      <button onClick={() => setShowUser(value => !value)}>Toggle user</button>
      {showUser ? <UserCard userId={7} /> : <div>User hidden</div>}
    </>
  );
};

const UserCard = ({ userId }) => {
  const user = useUsers(userId);

  if (user.loading) {
    return <div>Loading ...</div>;
  }
  if (user.error) {
    return <div>Error loading</div>;
  }
  if (user.data) {
    return <div>{JSON.stringify(user.data)}</div>;
  }
  return null;
};

const useUsers = id => {
  const url = `https://reqres.in/api/users/${id}?delay=2`;
  const [meta, setMeta] = useState({
    error: false,
    loading: true,
    data: null
  });
  useEffect(() => {
    let source = Axios.CancelToken.source();
    const loadData = async () => {
      try {
        const response = await Axios.get(url, {
          cancelToken: source.token
        });
        console.log("AxiosCancel: got response");
        setMeta({ error: false, loading: false, data: response.data });
      } catch (error) {
        if (Axios.isCancel(error)) {
          setMeta({ error: false, loading: false, data: null });
          console.log("AxiosCancel: caught cancel");
        } else {
          setMeta({ error: true, loading: false, data: null });
          throw error;
        }
      }
    };
    loadData();
    return () => {
      console.log("AxiosCancel: unmounting");
      source.cancel();
    };
  }, []);
  return meta;
};

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);

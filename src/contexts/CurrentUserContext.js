import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axios from 'axios';
import { axiosReq, axiosRes } from '../api/axiosDefaults';
import { useHistory } from 'react-router-dom/cjs/react-router-dom.min';

export const CurrentUserContext = createContext();
export const SetCurrentUnserContext = createContext();

export const useCurrentUser = () => useContext(CurrentUserContext);
export const useSetCurrentUser = () => useContext(SetCurrentUnserContext);

export const CurrentUserProvider = ({children}) => {
    const [currentUser, setCurrentUser] = useState(null);
    const history = useHistory();

  const handleMount = async () => {
    try {
      const {data} = await axiosRes.get('dj-rest-auth/user/')
      setCurrentUser(data)
    } catch(err) {
      console.log(err)
    }
  }

  useEffect(() => {
    handleMount()
  }, []);

  useMemo(() => {
    axiosReq.interceptors.response.use(
        async (config) => {
            try {
                await axios.post('/dj-rest-auth/token/refresh/');
            } catch (err) {
                setCurrentUser((prevCurrentUser) => {
                    if (prevCurrentUser) {
                        history.push('/signin');
                    }
                    return null;
                });
                return config;
            }
            return config;
        },
        (err) => {
            return Promise.reject(err);
        }
    );

    axiosRes.interceptors.response.use(
        (response) => response,
        async (err) => {
            if (err.response?.status === 401){
                try {
                    await axios.post('/dj-rest-auth/token/refresh/');
                } catch(err) {
                    setCurrentUser(prevCurrentUser => {
                        if (prevCurrentUser){
                            history.push('/signin');
                        }
                        return null
                    });
                }
                return axios(err.config);
            }
            return Promise.reject(err);
        }
    );
  }, [history]);

  return (
    <CurrentUserContext.Provider value={currentUser}>
      <SetCurrentUnserContext.Provider value={setCurrentUser}>
        {children}
      </SetCurrentUnserContext.Provider>
    </CurrentUserContext.Provider>
  )
};
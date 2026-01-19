import { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../store/UserContext';
import { createSession as apiCreateSession } from '../api/consult';

export default function useNewSession() {
  const { user } = useContext(UserContext) || {};
  const navigate = useNavigate();

  const createSession = async (payload = {}) => {
    if (!user) {
      navigate('/auth/login');
      throw new Error('未登录');
    }
    const session = await apiCreateSession(payload);
    return session;
  };

  const goToSession = (sessionId) => {
    if (!sessionId) return;
    navigate(`/consultation/chat/${sessionId}`);
  };

  return { createSession, goToSession };
}

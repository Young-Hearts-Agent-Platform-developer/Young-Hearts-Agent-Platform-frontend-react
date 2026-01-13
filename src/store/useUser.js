import { useContext } from 'react';
import { UserContext } from './UserContext';

const defaultValue = {
	user: null,
	isAuthenticated: false,
	loading: false,
	login: () => {},
	logout: () => {},
	checkPermission: () => false,
	refreshUser: () => {},
};

export const useUser = () => useContext(UserContext) || defaultValue;
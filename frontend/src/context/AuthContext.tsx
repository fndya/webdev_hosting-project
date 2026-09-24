import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import type { ReactNode } from "react";

import {
    getCurrentUser,
    login as loginRequest,
    logout as logoutRequest,
    register as registerRequest,
} from "@/api/auth";

import type {
    LoginData,
    RegisterData,
} from "@/api/auth";

import type { User } from "@/types/user";

interface AuthContextValue {
    user: User | null;
    isLoading: boolean;
    login: (data: LoginData) => Promise<User>;
    register: (data: RegisterData) => Promise<User>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(
    undefined
);

interface AuthProviderProps {
    children: ReactNode;
}

export function AuthProvider({
    children,
}: AuthProviderProps) {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        getCurrentUser()
            .then((currentUser) => {
                setUser(currentUser);
            })
            .catch(() => {
                setUser(null);
            })
            .finally(() => {
                setIsLoading(false);
            });
    }, []);

    const login = async (
        data: LoginData
    ): Promise<User> => {
        const currentUser = await loginRequest(data);

        setUser(currentUser);

        return currentUser;
    };

    const register = async (
        data: RegisterData
    ): Promise<User> => {
        const currentUser = await registerRequest(data);

        setUser(currentUser);

        return currentUser;
    };

    const logout = async (): Promise<void> => {
        await logoutRequest();

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth(): AuthContextValue {
    const context = useContext(AuthContext);

    if (!context) {
        throw new Error(
            "useAuth должен использоваться внутри AuthProvider"
        );
    }

    return context;
}
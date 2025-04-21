'use client';

import React, {
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react';
import { createClient } from '@/utils/supabase/client';
import { supabaseAdmin } from '@/lib/supabaseAdmin';

type Theme = 'light' | 'dark';

interface User {
    id: string;
    username: string;
    email: string;
    role: string;
}
export interface Project {
    id: string;
    name: string;
    description: string;
    deadline: string;
    priority: string;
    created_by: string;
}

interface GlobalContextType {
    userdetails: User | null;
    setUserdetails: (user: User | null) => void;
    theme: Theme;
    toggleTheme: () => void;
    projects: Project[];
    setProjects: (projects: Project[]) => void;
    allusers: User[];
    setAllUsers: (users: User[]) => void;
}

const GlobalContext = createContext<GlobalContextType | undefined>(undefined);
const supabase = createClient();

export const GlobalProvider = ({ children }: { children: ReactNode }) => {
    const [userdetails, setUserdetails] = useState<User | null>(null);
    const [theme, setTheme] = useState<Theme>('light');
    const [projects, setProjects] = useState<Project[]>([]);
    const [allusers, setAllUsers] = useState<User[]>([]);

    const fetchUsers = async () => {
        const { data, error } = await supabaseAdmin.auth.admin.listUsers();
        if (error) {
            console.error('Error fetching users:', error);
            return;
        }

        const formattedUsers = data.users
            .filter((user) => user.user_metadata?.role === 'user')
            .map((user) => ({
                id: user.id,
                username: user.user_metadata?.username || 'Unnamed',
                email: user.email || '',
                role: user.user_metadata?.role || 'user',
            }));

        setAllUsers(formattedUsers);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    useEffect(() => {
        const fetchUserAndProjects = async () => {
            const { data: { user }, error: userError } = await supabase.auth.getUser();

            if (user) {
                const { id, email, user_metadata } = user;
                setUserdetails({
                    id,
                    username: user_metadata?.username ?? 'No name',
                    email: email ?? 'No email',
                    role: user_metadata?.role ?? 'user',
                });
            } else {
                setUserdetails(null);
            }

            if (userError) console.error('Supabase user fetch error:', userError.message);

            const { data, error } = await supabase.from('project').select('*');
            if (error) {
                console.error('Error fetching projects:', error.message);
            } else {
                setProjects(data || []);
            }
        };

        fetchUserAndProjects();
    }, []);

    const toggleTheme = () => {
        setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
    };

    return (
        <GlobalContext.Provider
            value={{
                userdetails,
                setUserdetails,
                theme,
                toggleTheme,
                projects,
                setProjects,
                allusers,
                setAllUsers,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export const useGlobalContext = (): GlobalContextType => {
    const context = useContext(GlobalContext);
    if (!context) {
        throw new Error('useGlobalContext must be used within a GlobalProvider');
    }
    return context;
};

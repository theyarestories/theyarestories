import ApiClient from "@/helpers/api-client/apiClient";
import { DBUser } from "@/interfaces/database/DBUser";
import { ServerApiResponse } from "@/interfaces/server/ServerApiResponse";
import {
  Dispatch,
  ReactNode,
  SetStateAction,
  createContext,
  useEffect,
  useState,
} from "react";

export interface UserContextType {
  user: DBUser | null;
  setUser: Dispatch<SetStateAction<DBUser | null>>;
  isUserLoading: boolean;
}

export const UserContext = createContext<UserContextType | null>(null);

const apiClient = new ApiClient();

export default function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<DBUser | null>(null);
  const [isUserLoading, setIsUserLoading] = useState(true);

  async function getAndSetUser() {
    const result = await apiClient.get<ServerApiResponse<DBUser>>(
      `/api/auth/get-user-by-token`
    );
    if (result.isOk() && result.value.success) {
      setUser(result.value.data);
    }
    setIsUserLoading(false);
  }

  useEffect(() => {
    getAndSetUser();
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, isUserLoading }}>
      {children}
    </UserContext.Provider>
  );
}

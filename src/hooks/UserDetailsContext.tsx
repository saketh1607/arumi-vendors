import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useLocation } from "react-router-dom";

// Define the shape of userDetails if known more specifically
interface UserDetails {
  TeamContactID: string;
  BusinessID: string;
  [key: string]: any;
}

interface UserDetailsContextType {
  userDetails: UserDetails | null;
  isLoading: boolean;
  error: string | null;
  token: string | null;
  account_id: string | null;
  version: string | null;
}

const UserDetailsContext = createContext<UserDetailsContextType | undefined>(undefined);

interface UserDetailsProviderProps {
  children: ReactNode;
}

export const UserDetailsProvider: React.FC<UserDetailsProviderProps> = ({ children }) => {
  const [userDetails, setUserDetails] = useState<UserDetails | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [account_id, setAccountId] = useState<string | null>(null);
  const [version, setVersion] = useState<string | null>(null);

  const location = useLocation();

  const extractParamsFromUrl = () => {
    const urlParams = new URLSearchParams(location.search);
    return {
      account_id: urlParams.get("account_id") || urlParams.get("account_id"),
      version: urlParams.get("version"),
      token: urlParams.get("token") || urlParams.get("deviceToken"),
    };
  };

  useEffect(() => {
    const { account_id, version, token } = extractParamsFromUrl();
    console.log("Extracted Account ID:", account_id);
    console.log("Extracted Version:", version);
    console.log("Extracted Token:", token);

    if (account_id) setAccountId(account_id);
    if (version) setVersion(version);
    if (token) setToken(token);
  }, [location.search]);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const idToUse = account_id || version;
      if (!idToUse) {
        console.warn("No Account ID found, skipping fetch.");
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        const response = await fetch(
         `${import.meta.env.VITE_API_URL}${import.meta.env.VITE_PORTNO}/Onboard/GetUserDetails?account_id=${account_id}&version=${version}`,

          {
            method: "GET",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch user details. Status: ${response.status}`);
        }

        const data = await response.json();

        if (!data || !data.TeamContactID || !data.BusinessID) {
          throw new Error("Invalid user details received");
        }

        setUserDetails(data);
        setError(null);
      } catch (err: any) {
        console.error("Error fetching user details:", err);
        setError(err.message);
        setUserDetails(null);
      } finally {
        setIsLoading(false);
      }
    };

    fetchUserDetails();
  }, [account_id, version]);

  const value: UserDetailsContextType = {
    userDetails,
    isLoading,
    error,
    token,
    account_id,
    version,
  };

  return (
    <UserDetailsContext.Provider value={value}>
      {children}
    </UserDetailsContext.Provider>
  );
};

export const useUserDetails = (): UserDetailsContextType => {
  const context = useContext(UserDetailsContext);
  if (!context) {
    throw new Error("useUserDetails must be used within a UserDetailsProvider");
  }
  return context;
};

export default UserDetailsContext;
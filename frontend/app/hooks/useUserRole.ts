import { useEffect, useState } from "react";
import type { types } from "../lib/client";
import useAuthFetch from "./useAuthFetch";

const useUserRole = () => {
    const [userRole, setUserRole] = useState<types.Role>("USER");
    const { authRequestClient } = useAuthFetch();

    useEffect(() => {
        (async () => {
            if (!authRequestClient) {
                setUserRole("USER");
                return;
            }

            (async () => {
                const userRole = await authRequestClient.user.getUserRoleForClient();
                if (userRole) {
                    setUserRole(userRole.role);
                }
            })()
        })();
    }, [authRequestClient]);

    return { userRole };
}

export default useUserRole;
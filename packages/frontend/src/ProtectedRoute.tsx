import {Navigate, Outlet} from "react-router";

interface IProtectedRouteProps {
    authToken: string;
}

export function ProtectedRoute(props: IProtectedRouteProps) {
    if (!props.authToken) {
        return <Navigate to="/login" replace />
    }

    return <Outlet />;
}
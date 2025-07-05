import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';

export const Route = createRootRoute({
    component: () => (
        <>
            <div className="p-4 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>
                <Link to="/about" className="[&.active]:font-bold">
                    About
                </Link>
                <Link to="/vote" className="[&.active]:font-bold">
                    Vote
                </Link>
                <Link to="/auth" className="[&.active]:font-bold">
                    Auth
                </Link>
                <Link to="/todo" className="[&.active]:font-bold">
                    Todo
                </Link>
            </div>
            <hr />
            <Outlet />
            <TanStackRouterDevtools />
        </>
    ),
})
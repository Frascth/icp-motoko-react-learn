import { createRootRoute, Link, Outlet } from '@tanstack/react-router';
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools';
import App from '../App';

export const Route = createRootRoute({
    component: () => (
        <>
            <div className="p-4 flex gap-2">
                <Link to="/" className="[&.active]:font-bold">
                    Home
                </Link>{' '}
                <Link to="/about" className="[&.active]:font-bold">
                    About
                </Link>
            </div>
            <hr />
            <Outlet />
            <div className='mt-8 p-4'>
                <App />
            </div>
            <TanStackRouterDevtools />
        </>
    ),
})
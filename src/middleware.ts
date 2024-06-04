import { withAuth } from 'next-auth/middleware'

export default withAuth({
    callbacks: {
        authorized: ({ token }) => token?.user_id !== undefined,
    },
    pages: {
        signIn: '/signin',
    },
});

export const config = {
    matcher: ['/((?!signup|api|signin|check-works).*)'],
};

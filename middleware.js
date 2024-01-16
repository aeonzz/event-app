export { default } from "next-auth/middleware"

export const config = { 
    matcher: ["/", "/admin", "/admin/users", "/user", "/user/account", "/events", "/announcements", "/post/:path*", "/user/:path*" ] 
}
export { default } from "next-auth/middleware"

export const config = { 
    matcher: ["/", "/admin", "/admin/users", "/user", "/user/account", ] 
}
import home from "@/public/icons/home.svg";
import haha from "@/public/icons/haha.svg";
import megaphone from "@/public/icons/megaphone.svg";
import events from "@/public/icons/events.svg";


export const sidebarNav = [
    {
        title: "Announcements",
        icon: megaphone,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, ea.",
        link: "/",
        alt: "announcements"
    },
    {
        title: "Events",
        icon: events,
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Voluptates, ea.",
        link: "/",
        alt: 'evens'
    }
]

export const sidebarNavItems = [
    {
      title: "Profile",
      href: "/user/profile",
    },
    {
      title: "Account",
      href: "/user/account",
    },
    {
      title: "Appearance",
      href: "/examples/forms/appearance",
    },
    {
      title: "Notifications",
      href: "/examples/forms/notifications",
    },
    {
      title: "Display",
      href: "/examples/forms/display",
    },
  ]
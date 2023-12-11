import home from "@/public/icons/home.svg";
import haha from "@/public/icons/haha.svg";
import megaphone from "@/public/icons/megaphone.svg";
import events from "@/public/icons/events.svg";
import bird from "@/public/icons/bird.svg";


export const postTabsNav = [
  {
    href: '/',
    title: 'home',
    tooltip: 'home',
    icon: home,
  },
  {
    href: '/events',
    title: 'event',
    tooltip: 'events',
    icon: events,
  },
  {
    href: '/announcements',
    title: 'announcements',
    tooltip: 'announcements',
    icon: megaphone,
  }
]

export const sidebarNav = [
  {
    title: "Home",
    icon: home,
    link: "/",
    alt: 'home'
  },
  {
    title: "Events",
    icon: events,
    link: "/events",
    alt: 'events'
  },
  {
    title: "Announcements",
    icon: megaphone,
    link: "/announcements",
    alt: "announcements"
  },
  {
    title: "Freedom Wall",
    icon: bird,
    link: "/freedom-wall",
    alt: "Freedom Wall"
  },
]

export const adminNav = [
  {
    title: "Overview",
    link: "/admin",
  },
  {
    title: "Users",
    link: "/admin/users",
  },
  {
    title: "Notifications",
    link: "/admin/notifications",
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

export const departments = [
  {
    title: "None",
    value: "None",
  },
  {
    title: "Information Technology",
    value: "BSIT",
  },
  {
    title: "Energy Systems and Management",
    value: "BSESM"
  }
]
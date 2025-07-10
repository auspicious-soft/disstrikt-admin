"use client";

import * as React from "react";
import { NavMain } from "./nav-main";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarTrigger,
  useSidebar,
} from "./ui/sidebar";
import AppLogo from "./app-logo";
import {
  DashboardIcon,
  ReviewtaskIcon,
  UserIcon,
  SettingsIcon
} from "../../../lib/icons";
import TaskLogo from "../././../../assets/icons/Task.png";
import subscptionLogo from "../././../../assets/icons/Subscription.png";
import FrameLogo from "../././../../assets/icons/Frame.png";
import Revenue from "../././../../assets/icons/revenue.png";
import { NavProjects } from "./nav-projects";
import { redirect } from "next/dist/server/api-utils";
import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
// This is sample data.
const data = {
  user: {
    name: "Kane",
    profile: "Admin",
    avatar: "https://github.com/shadcn.png",
  },

  navMain: [
    {
      title: "Dashboard",
      url: "/admin/dashboard",
      icon: () => <DashboardIcon />,
    },
    {
      title: "Review Tasks",
      url: "/admin/review-tasks",
      icon: () => <ReviewtaskIcon />,
    },
    {
      title: "User Management",
      url: "/admin/users",
      icon: () => <UserIcon />,
    },
    {
      title: "Job Management",
      url: "/admin/job-management",
      icon: () => <img src={FrameLogo.src} alt="Job" />,
    },
    {
      title: "Task Management",
      url: "/admin/task-management",
      icon: () => <img src={TaskLogo.src} alt="Task" />,
    },
    {
      title: "Revenue",
      url: "/admin/revenue",
      icon: () => <img src={Revenue.src} alt="Revenue" />,
    },
    {
      title: "Subscription-Plans",
      url: "/admin/subscription-plans",
      icon: () => (
        <img
          src={subscptionLogo.src}
          alt="Subscription"
          className="  hover:invert"
        />
      ),
    },
  ],
  projects: [
    {
      title: "Settings",
      url: "/",
      icon: SettingsIcon,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const router = useRouter();
  const { isMobile, state } = useSidebar();
  const handleLogout = async () => {
    try {
      localStorage.removeItem("token");
      await signOut({
        redirect: false,
      });
      router.push("/");
    } catch (error) {
      localStorage.removeItem("token");
      await signOut({
        redirect: false,
      });
      router.push("/");
    }
  };
  const projectsWithHandlers = data.projects.map((item) => {
    if (item.title === "Logout") {
      return {
        ...item,
        onClick: handleLogout,
      };
    }
    return item;
  });

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader
        className={
          !isMobile && state === "expanded"
            ? "flex items-center justify-between px-[26px] pt-[40px] pb-[22px]"
            : "flex items-center justify-between pt-[40px] pb-[22px]"
        }
      >
        {/* Show logo inside sidebar when expanded (desktop or mobile) */}
        {state === "expanded" && <AppLogo />}
        {/* Show trigger when collapsed or mobile */}
        {(isMobile || state === "collapsed") && (
          <SidebarTrigger className="sidebar-trigger-collapse" />
        )}
        {/* Show trigger next to logo when expanded and desktop */}
        {!isMobile && state === "expanded" && (
          <SidebarTrigger className="sidebar-trigger-collapse" />
        )}
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>
      <SidebarFooter>
        <NavProjects items={projectsWithHandlers} />
      </SidebarFooter>
    </Sidebar>
  );
}

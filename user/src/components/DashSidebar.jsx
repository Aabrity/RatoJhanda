
"use client"

import { Sidebar } from "flowbite-react"
import { HiUser, HiArrowSmRight, HiDocumentText, HiOutlineUserGroup, HiAnnotation, HiChartPie, HiFlag, HiExclamation } from "react-icons/hi"
import { useEffect, useState } from "react"
import { Link, useLocation } from "react-router-dom"
import { signoutSuccess } from "../redux/user/userSlice"
import { useDispatch, useSelector } from "react-redux"

export default function DashSidebar() {
  const location = useLocation()
  const dispatch = useDispatch()
  const { currentUser } = useSelector((state) => state.user)
  const [tab, setTab] = useState("")

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const tabFromUrl = urlParams.get("tab")
    if (tabFromUrl) {
      setTab(tabFromUrl)
    }
  }, [location.search])

  const handleSignout = async () => {
    try {
      const res = await fetch("/api/user/signout", {
        method: "POST",
      })
      const data = await res.json()
      if (!res.ok) {
        console.log(data.message)
      } else {
        dispatch(signoutSuccess())
      }
    } catch (error) {
      console.log(error.message)
    }
  }

  const navigationItems = [
    ...(currentUser?.isAdmin
      ? [
          {
            label: "Dashboard",
            icon: HiChartPie,
            href: "/dashboard?tab=dash",
            isActive: tab === "dash" || !tab,
          },
        ]
      : []),
    {
      label: "Profile",
      icon: HiUser,
      href: "/dashboard?tab=profile",
      isActive: tab === "profile",
      badge: currentUser?.isAdmin ? "Admin" : "User",
    },
     {
      className: "mt-4",
      label: "Your Flags",
      icon: HiFlag,
      href: "/dashboard?tab=showposts",
      isActive: tab === "showposts",
     
    },
    ...(currentUser?.isAdmin
      ? [
          {
            label: "Posts",
            icon: HiDocumentText,
            href: "/dashboard?tab=posts",
            isActive: tab === "posts",
          },
          {
            label: "Users",
            icon: HiOutlineUserGroup,
            href: "/dashboard?tab=users",
            isActive: tab === "users",
          },
          {
            label: "Comments",
            icon: HiAnnotation,
            href: "/dashboard?tab=comments",
            isActive: tab === "comments",
          },
          {
            label: "Reports",
            icon: HiExclamation,
            href: "/dashboard?tab=reports",
            isActive: tab === "reports",
          },
        ]
      : []),
  ]

  return (
    <div className="h-full">
      <Sidebar
        className="w-full md:w-64 border-r border-gray-200 dark:border-gray-700"
        theme={{
          root: {
            base: "h-full bg-white dark:bg-gray-900",
            inner: "h-full overflow-y-auto overflow-x-hidden bg-white py-4 px-3 dark:bg-gray-900",
          },
        }}
      >
        {/* Header Section */}
        <div className="mb-6 px-3 py-2 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-red-600 rounded-lg flex items-center justify-center">
              <HiChartPie className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Dashboard</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">{currentUser?.username}</p>
            </div>
          </div>
        </div>

        <Sidebar.Items>
          <Sidebar.ItemGroup className="space-y-1">
            {navigationItems.map((item) => (
              <Link key={item.label} to={item.href}>
                <Sidebar.Item
                  active={item.isActive}
                  icon={item.icon}
                  // label={item.badge}
                  labelColor={item.badge === "Admin" ? "blue" : "gray"}
                  as="div"
                  className={`
                    group flex items-center p-2 text-sm font-medium rounded-lg transition-all duration-200
                    ${
                      item.isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900 dark:text-blue-200"
                        : "text-gray-700 hover:bg-gray-50 dark:text-gray-300 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  {/* <item.icon
                    className={`
                    w-5 h-5 transition-colors duration-200
                    ${
                      item.isActive
                        ? "text-blue-600 dark:text-blue-400"
                        : "text-gray-500 group-hover:text-gray-700 dark:text-gray-400 dark:group-hover:text-gray-200"
                    }
                  `}
                  /> */}
                  <span className="ml-3 flex-1">{item.label}</span>
                  {item.badge && (
                    <span
                      className={`
                      inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium
                      ${
                        item.badge === "Admin"
                          ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                          : "bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                      }
                    `}
                    >
                      {item.badge}
                    </span>
                  )}
                </Sidebar.Item>
              </Link>
            ))}
          </Sidebar.ItemGroup>

          {/* Separator */}
          <div className="my-4 border-t border-gray-200 dark:border-gray-700"></div>

          {/* Sign Out Section */}
          <Sidebar.ItemGroup>
            <Sidebar.Item
              icon={HiArrowSmRight}
              onClick={handleSignout}
              as="div"
              className="
                group flex items-center p-2 text-sm font-medium rounded-lg cursor-pointer transition-all duration-200
                text-gray-700 hover:bg-red-50 hover:text-red-700 
                dark:text-gray-300 dark:hover:bg-red-900 dark:hover:text-red-200
              "
            >
              {/* <HiArrowSmRight
                className="
                w-5 h-5 transition-colors duration-200
                text-gray-500 group-hover:text-red-600 
                dark:text-gray-400 dark:group-hover:text-red-400
              "
              /> */}
              <span className="ml-3">Sign Out</span>
            </Sidebar.Item>
          </Sidebar.ItemGroup>
        </Sidebar.Items>
      </Sidebar>
    </div>
  )
}

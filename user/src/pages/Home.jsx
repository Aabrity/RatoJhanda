"use client"

import { Link } from "react-router-dom"
import { useEffect, useState } from "react"
import PostCard from "../components/PostCard"
import { FaBook, FaGlobe, FaShieldAlt, FaFlag } from "react-icons/fa"
import tree from "../assets/tree.png"
import people from "../assets/pinkpeo.png"

export default function Home() {
  const [posts, setPosts] = useState([])

  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch("/api/post/getPosts")
      const data = await res.json()
      setPosts(data.posts)
    }
    fetchPosts()
  }, [])

  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      {/* Hero Section */}
      <section className="py-6 md:py-12">
        <div className="grid grid-cols-5 gap-6 items-center">
          <div className="col-span-2">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 dark:text-white">Welcome to RatoFlag</h1>
            <p className="text-sm text-gray-700 dark:text-gray-300 mb-4">
              RatoFlag is a platform where citizens can report issues they encounter 
              in their locality and ensure about a solution. Reporting issues has 
              never been easier. With RatoFlag, you can report any issue you encounter
              in your locality, from potholes to broken streetlights, from garbage dumps
              to water leakage. Our platform connects you to the concerned authorities
              and RatoFlag ensures you to find a solution to your reported issue.
            </p>
            <div className="flex justify-center">
              <img src={tree} alt="Colorful tree illustration" className="w-70 h-60" />
            </div>
          </div>
          <div className="col-span-3 flex justify-center">
            <img
              src={people}
              alt="People with flag illustration"
              className="max-w-full h-auto rounded-lg"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-full mb-4">
              <FaFlag className="text-3xl w-12 h-12 text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">Incident Reporting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Your input helps alert others and keep the community informed.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-full mb-4">
              <FaBook className="text-3xl w-12 h-12 text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">Community Blog Posts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">See where incidents are happening around you and stay aware of danger zones.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-full mb-4">
              <FaGlobe className="text-3xl w-12 h-12 text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">Location Specific Awareness</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Share detailed stories or updates about local incidents, experiences, or safety tips with others through blog-style posts.</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-white p-4 rounded-full mb-4">
              <FaShieldAlt className="text-3xl w-12 h-12 text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2 dark:text-white">User Privacy Controls</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300">Post anonymously or control what location details are shown — your safety and privacy come first.</p>
          </div>
        </div>
      </section>

      
      <section className="py-6 flex justify-center">
        <div className="text-center mt-8">
          <Link to="/help" className="text-red-600 font-medium hover:underline">
            Help and Contact
          </Link>
        </div>
      </section>

      {/* Trending Flags Section */}
      <section className="py-8">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6">
            <h2 className="text-xl font-bold mb-6 dark:text-white">Trending Flags</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.slice(0, 6).map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <div className="text-center mt-8">
              <Link to="/search" className="text-red-600 font-medium hover:underline">
                View All Flags
              </Link>
            </div>
          </div>
        )}
      </section>
    </div>
  )
}

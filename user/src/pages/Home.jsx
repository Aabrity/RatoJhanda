import { Link } from "react-router-dom"
import { Button } from "flowbite-react"
import { FaBook, FaGlobe, FaShieldAlt, FaFlag } from "react-icons/fa"

export default function Home() {
  return (
    <div className="max-w-7xl mx-auto px-4 pb-12">
      {/* Hero Section */}
      <section className="py-8 md:py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
          <div className="bg-red-50 p-6 rounded-lg">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">Welcome to RatoFlag</h1>
            <p className="text-gray-700 mb-6">
              RatoFlag is a platform where citizens can report issues they encounter in their locality and ensure about
              a solution. Reporting issues has never been easier. With RatoFlag, you can report any issue you encounter
              in your locality, from potholes to broken streetlights, from garbage dumps to water leakage. Our platform
              connects you to the concerned authorities and RatoFlag ensures you to find a solution to your reported
              issue.
            </p>
            <img src="/placeholder.svg?height=150&width=150" alt="Colorful tree illustration" className="mx-auto" />
          </div>
          <div className="flex justify-center">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-wgvh96H09onkSReBTpRwWAnpAwQL6s.png"
              alt="People with flag illustration"
              className="max-w-full h-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-8 md:py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FaFlag className="text-3xl text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2">Report Anything</h3>
            <p className="text-sm text-gray-600">You can report any issue you encounter in your locality</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FaBook className="text-3xl text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2">Comprehensive Posts</h3>
            <p className="text-sm text-gray-600">
              Share detailed information regarding your issue with images and location
            </p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FaGlobe className="text-3xl text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2">Location Specific Awareness</h3>
            <p className="text-sm text-gray-600">Browse reports in your location through our interactive map</p>
          </div>

          <div className="flex flex-col items-center text-center">
            <div className="bg-gray-100 p-4 rounded-full mb-4">
              <FaShieldAlt className="text-3xl text-gray-800" />
            </div>
            <h3 className="font-semibold mb-2">User Privacy Controls</h3>
            <p className="text-sm text-gray-600">Full control over your personal data and privacy settings</p>
          </div>
        </div>
      </section>

      {/* CTA Button */}
      <section className="py-6 flex justify-center">
        <Link to="/raise-flags">
          <Button color="failure" size="lg" className="px-8">
            Raise Your Flag Now
          </Button>
        </Link>
      </section>

      {/* Trending Flags Section */}
      <section className="py-8">
        <h2 className="text-xl font-bold mb-6">Trending Flags</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Flag Card 1 */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Broken Streetlight"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-sm">Broken Streetlight Creating Dangerous Crossroads at Night</h3>
              <p className="text-xs text-gray-500 mt-2">• Posted two hours ago</p>
            </div>
          </div>

          {/* Flag Card 2 */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Landslide blocks road"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-sm">
                Landslide Debris from Lakeside Road Residential Area for Several Nights
              </h3>
              <p className="text-xs text-gray-500 mt-2">• Posted two hours ago</p>
            </div>
          </div>

          {/* Flag Card 3 */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Broken Streetlight"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-sm">Broken Streetlight Creating Dangerous Crossroads at Night</h3>
              <p className="text-xs text-gray-500 mt-2">• Posted two hours ago</p>
            </div>
          </div>

          {/* Flag Card 4 */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Landslide blocks road"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-sm">
                Landslide Debris from Lakeside Road Residential Area for Several Nights
              </h3>
              <p className="text-xs text-gray-500 mt-2">• Posted two hours ago</p>
            </div>
          </div>

          {/* Flag Card 5 */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Broken Streetlight"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-sm">Broken Streetlight Creating Dangerous Crossroads at Night</h3>
              <p className="text-xs text-gray-500 mt-2">• Posted two hours ago</p>
            </div>
          </div>

          {/* Flag Card 6 */}
          <div className="border rounded-lg overflow-hidden shadow-sm">
            <img
              src="/placeholder.svg?height=200&width=400"
              alt="Landslide blocks road"
              className="w-full h-48 object-cover"
            />
            <div className="p-4">
              <h3 className="font-medium text-sm">
                Landslide Debris from Lakeside Road Residential Area for Several Nights
              </h3>
              <p className="text-xs text-gray-500 mt-2">• Posted two hours ago</p>
            </div>
          </div>
        </div>

        {/* View All Link */}
        <div className="text-center mt-8">
          <Link to="/flags" className="text-red-600 font-medium hover:underline">
            View All Flags
          </Link>
        </div>
      </section>
    </div>
  )
}

import Hero from "@/components/hero";
import Profile from "@/components/profile";
import Navbar from "@/components/navbar";
import WorkExperiences from "@/components/work-experience";
import Achievements from "@/components/achievements";
import Projects from "@/components/projects";

export default function Home() {
  return (
    <div className="min-h-screen lg:max-h-screen lg:overflow-hidden bg-base-300 p-5 lg:p-10">
      {/* Navigation */}
      <Navbar />

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row lg:px-8 mt-8 overflow-hidden">
        {/* Left Column */}
        <div className="w-full md:flex md:flex-row lg:flex-col lg:w-1/3 px-8 pr-16">
          <Profile />
        </div>

        {/* Right Column */}
        <div className="w-full lg:w-2/3 lg:max-h-[calc(100vh-120px)] pb-10 overflow-y-auto">
          <div className="px-8 mt-5 lg:mt-0">
            <Hero />

            {/* Working Experience */}
            <div className="mb-12">
              <h3 className="text-2xl font-serif mb-6">Working experience</h3>
              <WorkExperiences />
            </div>

            {/* Projects */}
            <div className="mb-12">
              <h3 className="text-2xl font-serif mb-6">Projects</h3>
              <Projects />
            </div>

            {/* Awards Section */}
            <div className="mb-12">
              <h3 className="text-2xl font-serif mb-6">Achievement</h3>
              <Achievements />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useEffect } from "react";
import { Search, MapPin, Users, TrendingUp, Globe, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import JobCard from "@/components/JobCard";
import { supabase } from "@/integrations/supabase/client";
import { TARGETED_LOCATIONS } from "@/components/LocationSelect";

const Index = () => {
  const [featuredJobs, setFeaturedJobs] = useState([]);
  const [locationStats, setLocationStats] = useState<Record<string, number>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFeaturedJobs();
    fetchLocationStats();
  }, []);

  const fetchFeaturedJobs = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('*')
      .eq('is_featured', true)
      .eq('status', 'active')
      .limit(6);

    if (!error && data) {
      setFeaturedJobs(data);
    }
    setLoading(false);
  };

  const fetchLocationStats = async () => {
    const { data, error } = await supabase
      .from('jobs')
      .select('location')
      .eq('status', 'active');

    if (!error && data) {
      const stats: Record<string, number> = {};
      
      // Initialize all targeted locations with 0
      TARGETED_LOCATIONS.forEach(location => {
        stats[location] = 0;
      });

      // Count jobs by location
      data.forEach(job => {
        if (stats.hasOwnProperty(job.location)) {
          stats[job.location]++;
        }
      });

      setLocationStats(stats);
    }
  };

  const getTopLocations = () => {
    return Object.entries(locationStats)
      .filter(([_, count]) => count > 0)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 8);
  };

  const handleSearch = () => {
    if (searchQuery.trim() !== "") {
      alert(`Searching for: ${searchQuery}`);
    } else {
      alert("Please enter a search query.");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />
      
      {/* Hero Section */}
      <section className="relative py-20 px-4 text-center">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-200 via-blue-300 to-blue-400 opacity-20 rounded-xl blur-lg -z-10"></div>
        <h1 className="text-4xl font-extrabold text-gray-900 mb-6 md:text-5xl lg:text-6xl">
          Find Your Dream Job Today
        </h1>
        <p className="text-lg text-gray-700 mb-8 md:text-xl">
          Explore thousands of job opportunities from around the globe. Your next career move starts here.
        </p>
        <div className="flex flex-col md:flex-row justify-center items-center space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex items-center bg-white rounded-full shadow-md overflow-hidden">
            <Input
              type="text"
              placeholder="Search for jobs..."
              className="border-none shadow-none focus-visible:ring-0 rounded-l-full"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <Button
              onClick={handleSearch}
              className="bg-blue-600 hover:bg-blue-700 text-white rounded-r-full px-6"
            >
              <Search className="h-5 w-5 mr-2" />
              Search
            </Button>
          </div>
        </div>
        <div className="mt-8">
          <Button variant="outline" className="mr-4">
            <TrendingUp className="h-4 w-4 mr-2" />
            Featured Jobs
          </Button>
          <Button variant="secondary">
            <Globe className="h-4 w-4 mr-2" />
            Explore All Jobs
          </Button>
        </div>
      </section>

      {/* Global Opportunities Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Explore Global Opportunities
            </h2>
            <p className="text-xl text-gray-600">
              Discover career opportunities across our targeted locations worldwide
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {getTopLocations().map(([location, count]) => (
              <Card key={location} className="hover:shadow-lg transition-shadow cursor-pointer group">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-3">
                    <MapPin className="h-8 w-8 text-blue-600" />
                    <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                      {count} {count === 1 ? 'job' : 'jobs'}
                    </Badge>
                  </div>
                  <h3 className="font-semibold text-lg text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                    {location}
                  </h3>
                  <p className="text-gray-600 text-sm">
                    {count > 0 ? `${count} active opportunities` : 'Coming soon'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          {getTopLocations().length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-600">Loading location statistics...</p>
            </div>
          )}
        </div>
      </section>

      {/* Featured Jobs Section */}
      <section className="py-16 px-4 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Featured Jobs
            </h2>
            <p className="text-xl text-gray-600">
              Explore some of our top job listings.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {loading ? (
              <div className="text-center py-8 col-span-full">
                <p className="text-gray-600">Loading featured jobs...</p>
              </div>
            ) : featuredJobs.length > 0 ? (
              featuredJobs.map((job) => (
                <JobCard key={job.id} job={job} />
              ))
            ) : (
              <div className="text-center py-8 col-span-full">
                <p className="text-gray-600">No featured jobs available at the moment.</p>
              </div>
            )}
          </div>
          {!loading && featuredJobs.length > 0 && (
            <div className="text-center mt-8">
              <Button>
                View All Featured Jobs <ChevronRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-16 px-4 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Online Career Navigator?
            </h2>
            <p className="text-xl text-gray-600">
              We provide the best resources and support to help you find your dream job.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <Users className="h-8 w-8 text-blue-600 mr-4" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Extensive Job Listings
                  </h3>
                </div>
                <p className="text-gray-700">
                  Access thousands of job opportunities across various industries and locations.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <MapPin className="h-8 w-8 text-green-600 mr-4" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Global Opportunities
                  </h3>
                </div>
                <p className="text-gray-700">
                  Explore job openings in different countries and discover international career paths.
                </p>
              </CardContent>
            </Card>
            <Card className="shadow-md hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center mb-4">
                  <TrendingUp className="h-8 w-8 text-purple-600 mr-4" />
                  <h3 className="text-xl font-semibold text-gray-900">
                    Career Growth
                  </h3>
                </div>
                <p className="text-gray-700">
                  Find jobs that offer opportunities for professional development and career advancement.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section className="py-24 px-4 bg-gradient-to-r from-blue-600 to-indigo-700 text-white text-center">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl font-bold mb-8">
            Ready to Take the Next Step?
          </h2>
          <p className="text-xl mb-12">
            Join our platform today and unlock a world of career opportunities.
          </p>
          <Button variant="default" className="bg-white text-blue-700 hover:bg-blue-50">
            Sign Up Now
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

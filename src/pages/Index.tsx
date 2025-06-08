
import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { jobsData, countries, categories } from '@/data/jobsData';

const Index = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const navigate = useNavigate();

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCountry) params.set('country', selectedCountry);
    if (selectedCategory) params.set('category', selectedCategory);
    
    navigate(`/jobs?${params.toString()}`);
  };

  const featuredJobs = jobsData.slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 to-blue-800 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Navigate Your Career Journey
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              Discover thousands of opportunities across Gulf countries, USA, and UK. 
              Your dream job is just a search away.
            </p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto">
            <Card className="p-6">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="md:col-span-2">
                    <Input
                      placeholder="Job title, keywords, or company"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-12"
                    />
                  </div>
                  <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                    <SelectTrigger className="h-12">
                      <SelectValue placeholder="Select Country" />
                    </SelectTrigger>
                    <SelectContent>
                      {countries.map(country => (
                        <SelectItem key={country} value={country}>{country}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Button onClick={handleSearch} className="h-12 bg-blue-600 hover:bg-blue-700">
                    <Search className="w-5 h-5 mr-2" />
                    Search Jobs
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">10,000+</div>
              <div className="text-gray-600">Active Job Listings</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">500+</div>
              <div className="text-gray-600">Trusted Companies</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-blue-600 mb-2">50,000+</div>
              <div className="text-gray-600">Success Stories</div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-xl text-gray-600">Explore top job openings from leading companies</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {featuredJobs.map(job => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/jobs">
              <Button variant="outline" size="lg">
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-16 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Explore Opportunities by Region</h2>
            <p className="text-xl text-gray-600">Find your next career move in these dynamic markets</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["UAE", "Saudi Arabia", "Qatar", "Kuwait", "USA", "UK", "Bahrain", "Oman"].map(country => (
              <Link key={country} to={`/jobs?country=${country}`}>
                <Card className="hover:shadow-lg transition-shadow duration-200 cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <h3 className="font-semibold text-gray-900">{country}</h3>
                    <p className="text-sm text-gray-600 mt-2">
                      {Math.floor(Math.random() * 500) + 100}+ jobs
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;


import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, MapPin, Users, Briefcase, TrendingUp, Globe, Award, Clock } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
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

  const featuredJobs = jobsData.slice(0, 6);
  const topCategories = [
    { name: 'Technology', count: '2,500+', icon: '💻' },
    { name: 'Engineering', count: '1,800+', icon: '⚙️' },
    { name: 'Healthcare', count: '1,200+', icon: '🏥' },
    { name: 'Finance', count: '950+', icon: '💰' },
    { name: 'Marketing', count: '750+', icon: '📈' },
    { name: 'Education', count: '600+', icon: '🎓' }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-5xl md:text-7xl font-bold mb-8 leading-tight">
              Navigate Your <span className="text-blue-200">Career Journey</span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-4xl mx-auto leading-relaxed">
              Discover thousands of premium career opportunities across Gulf countries, USA, and UK. 
              Connect with top employers and take your career to new heights.
            </p>
            <div className="flex flex-wrap justify-center gap-4 mb-12">
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Globe className="w-5 h-5 mr-2" />
                Global Opportunities
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Users className="w-5 h-5 mr-2" />
                Trusted by 50,000+
              </Badge>
              <Badge variant="secondary" className="px-4 py-2 text-lg">
                <Award className="w-5 h-5 mr-2" />
                Premium Employers
              </Badge>
            </div>
          </div>

          {/* Enhanced Search Form */}
          <div className="max-w-5xl mx-auto">
            <Card className="p-8 shadow-2xl">
              <CardContent className="p-0">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Job Title or Keywords
                    </label>
                    <Input
                      placeholder="e.g. Software Engineer, Marketing Manager"
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="h-14 text-lg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Country/Region
                    </label>
                    <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                      <SelectTrigger className="h-14 text-lg">
                        <SelectValue placeholder="Select Location" />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map(country => (
                          <SelectItem key={country} value={country}>{country}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      &nbsp;
                    </label>
                    <Button onClick={handleSearch} className="h-14 w-full text-lg bg-blue-600 hover:bg-blue-700">
                      <Search className="w-6 h-6 mr-3" />
                      Find Jobs
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Trusted by Professionals Worldwide</h2>
            <p className="text-xl text-gray-600">Join thousands of successful career transitions</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">10,000+</div>
              <div className="text-gray-600 text-lg">Active Job Listings</div>
              <Briefcase className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">500+</div>
              <div className="text-gray-600 text-lg">Trusted Companies</div>
              <Users className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">50,000+</div>
              <div className="text-gray-600 text-lg">Success Stories</div>
              <TrendingUp className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
            <div className="p-6">
              <div className="text-5xl font-bold text-blue-600 mb-3">15+</div>
              <div className="text-gray-600 text-lg">Countries Covered</div>
              <Globe className="w-8 h-8 text-blue-500 mx-auto mt-4" />
            </div>
          </div>
        </div>
      </section>

      {/* Top Categories Section */}
      <section className="py-20 bg-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Explore Top Categories</h2>
            <p className="text-xl text-gray-600">Find opportunities in your field of expertise</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-6 mb-12">
            {topCategories.map((category, index) => (
              <Link key={index} to={`/jobs?category=${category.name}`}>
                <Card className="hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1">
                  <CardContent className="p-8 text-center">
                    <div className="text-4xl mb-4">{category.icon}</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{category.name}</h3>
                    <p className="text-blue-600 font-medium text-lg">{category.count} jobs</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Jobs */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Featured Opportunities</h2>
            <p className="text-xl text-gray-600">Hand-picked premium positions from top employers</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
            {featuredJobs.map(job => (
              <JobCard key={job.id} {...job} />
            ))}
          </div>

          <div className="text-center">
            <Link to="/jobs">
              <Button size="lg" className="px-8 py-4 text-lg">
                <Search className="w-5 h-5 mr-2" />
                View All Jobs
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Countries Section */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4">Explore Global Opportunities</h2>
            <p className="text-xl text-gray-300">Find your next career move in these dynamic markets</p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {["UAE", "Saudi Arabia", "Qatar", "Kuwait", "USA", "UK", "Bahrain", "Oman"].map(country => (
              <Link key={country} to={`/jobs?country=${country}`}>
                <Card className="bg-gray-800 border-gray-700 hover:shadow-2xl transition-all duration-300 cursor-pointer transform hover:-translate-y-1 hover:bg-gray-700">
                  <CardContent className="p-8 text-center">
                    <MapPin className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                    <h3 className="font-semibold text-white text-lg mb-2">{country}</h3>
                    <p className="text-blue-300 font-medium">
                      {Math.floor(Math.random() * 500) + 100}+ jobs
                    </p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Why Choose Online Career Navigator?</h2>
            <p className="text-xl text-gray-600">Your success is our mission</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Real-Time Updates</h3>
              <p className="text-gray-600 leading-relaxed">
                Get instant notifications about new job openings that match your profile and preferences.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Premium Employers</h3>
              <p className="text-gray-600 leading-relaxed">
                Connect with top-tier companies and multinational corporations across multiple regions.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-600 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-4">Global Reach</h3>
              <p className="text-gray-600 leading-relaxed">
                Access opportunities across Gulf countries, USA, UK, and other major job markets worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;

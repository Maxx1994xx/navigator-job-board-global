import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Filter, MapPin, Briefcase, Clock, TrendingUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import JobCard from '@/components/JobCard';
import { supabase } from '@/integrations/supabase/client';

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary?: string;
  description: string;
  requirements: string[];
  benefits: string[];
  created_at: string;
  postedDate: string;  // Made required to match JobCardProps
  contactEmail?: string;
  country?: string;
}

const Jobs = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState(searchParams.get('search') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || 'All Countries');
  const [selectedType, setSelectedType] = useState(searchParams.get('type') || 'All Types');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Categories');
  const [jobs, setJobs] = useState<Job[]>([]);
  const [filteredJobs, setFilteredJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);

  // Static options for filters
  const countries = ['All Countries', 'UAE', 'Saudi Arabia', 'Qatar', 'Kuwait', 'USA', 'UK'];
  const jobTypes = ['All Types', 'Full-time', 'Part-time', 'Contract', 'Remote'];
  const categories = ['All Categories', 'Technology', 'Healthcare', 'Finance', 'Education', 'Engineering', 'Marketing', 'Other'];

  useEffect(() => {
    fetchJobs();
  }, []);

  useEffect(() => {
    filterJobs();
  }, [searchTerm, selectedCountry, selectedType, selectedCategory, jobs]);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Transform data to match JobCard component expectations
      const transformedJobs = (data || []).map(job => ({
        ...job,
        postedDate: new Date(job.created_at).toLocaleDateString(), // Always ensure postedDate is a string
        contactEmail: 'hr@' + job.company.toLowerCase().replace(/\s+/g, '') + '.com',
        country: job.location.split(',').pop()?.trim() || job.location,
      }));

      setJobs(transformedJobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterJobs = () => {
    let filtered = jobs;

    if (searchTerm) {
      filtered = filtered.filter(job => 
        job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCountry !== 'All Countries') {
      filtered = filtered.filter(job => job.country === selectedCountry);
    }

    if (selectedType !== 'All Types') {
      filtered = filtered.filter(job => job.type === selectedType);
    }

    if (selectedCategory !== 'All Categories') {
      filtered = filtered.filter(job => job.category === selectedCategory);
    }

    setFilteredJobs(filtered);
  };

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (searchTerm) params.set('search', searchTerm);
    if (selectedCountry !== 'All Countries') params.set('country', selectedCountry);
    if (selectedType !== 'All Types') params.set('type', selectedType);
    if (selectedCategory !== 'All Categories') params.set('category', selectedCategory);
    
    setSearchParams(params);
  };

  const quickStats = [
    { label: 'Total Jobs', value: filteredJobs.length, icon: Briefcase },
    { label: 'New Today', value: Math.floor(filteredJobs.length * 0.1), icon: Clock },
    { label: 'Top Companies', value: Math.floor(filteredJobs.length * 0.3), icon: TrendingUp },
    { label: 'Locations', value: new Set(filteredJobs.map(job => job.country)).size, icon: MapPin }
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading jobs...</div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-600 to-blue-800 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Find Your Dream Job
            </h1>
            <p className="text-xl text-blue-100">
              Explore thousands of opportunities from top employers worldwide
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {quickStats.map((stat, index) => (
              <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-4 text-center">
                <stat.icon className="w-6 h-6 mx-auto mb-2 text-blue-200" />
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="text-sm text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search and Filter Section */}
        <Card className="mb-8 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center mb-6">
              <Filter className="w-5 h-5 text-blue-600 mr-2" />
              <h2 className="text-xl font-semibold text-gray-900">Refine Your Search</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Search Jobs
                </label>
                <Input
                  placeholder="Job title, keywords, or company..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="h-12"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Location
                </label>
                <Select value={selectedCountry} onValueChange={setSelectedCountry}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
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
                  Job Type
                </label>
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {jobTypes.map(type => (
                      <SelectItem key={type} value={type}>{type}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger className="h-12">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map(category => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-4 mt-6">
              <Button onClick={handleSearch} className="flex-1 md:flex-none">
                <Search className="w-4 h-4 mr-2" />
                Search Jobs
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('All Countries');
                  setSelectedType('All Types');
                  setSelectedCategory('All Categories');
                  setSearchParams({});
                }}
              >
                Clear Filters
              </Button>
            </div>

            {/* Active Filters */}
            {(searchTerm || selectedCountry !== 'All Countries' || selectedType !== 'All Types' || selectedCategory !== 'All Categories') && (
              <div className="mt-6 pt-6 border-t">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Active Filters:</h3>
                <div className="flex flex-wrap gap-2">
                  {searchTerm && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Search: {searchTerm}
                    </Badge>
                  )}
                  {selectedCountry !== 'All Countries' && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Location: {selectedCountry}
                    </Badge>
                  )}
                  {selectedType !== 'All Types' && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Type: {selectedType}
                    </Badge>
                  )}
                  {selectedCategory !== 'All Categories' && (
                    <Badge variant="secondary" className="px-3 py-1">
                      Category: {selectedCategory}
                    </Badge>
                  )}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Results Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Job Opportunities
            </h1>
            <p className="text-lg text-gray-600 mt-1">
              {filteredJobs.length} {filteredJobs.length === 1 ? 'job' : 'jobs'} found
            </p>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <Clock className="w-4 h-4" />
            Updated {new Date().toLocaleDateString()}
          </div>
        </div>

        {/* Job Listings */}
        {filteredJobs.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {filteredJobs.map(job => (
              <div key={job.id} className="transform transition-all duration-200 hover:scale-[1.02]">
                <JobCard {...job} />
              </div>
            ))}
          </div>
        ) : (
          <Card className="shadow-lg">
            <CardContent className="p-16 text-center">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <Search className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-3">No jobs found</h3>
              <p className="text-gray-600 mb-6 max-w-md mx-auto">
                We couldn't find any jobs matching your criteria. Try adjusting your search parameters or browse all available positions.
              </p>
              <Button 
                variant="outline" 
                size="lg"
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCountry('All Countries');
                  setSelectedType('All Types');
                  setSelectedCategory('All Categories');
                  setSearchParams({});
                }}
              >
                Browse All Jobs
              </Button>
            </CardContent>
          </Card>
        )}

        {/* Load More Button (if needed) */}
        {filteredJobs.length > 0 && (
          <div className="text-center mt-12">
            <p className="text-gray-600 mb-4">
              Showing {filteredJobs.length} of {jobs.length} total jobs
            </p>
            <Button variant="outline" size="lg">
              Load More Jobs
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default Jobs;


import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Search, MapPin, Briefcase, Filter } from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import OptimizedJobCard from '@/components/OptimizedJobCard';
import JobCardSkeleton from '@/components/JobCardSkeleton';
import SEO from '@/components/SEO';
import AdSenseAd from '@/components/AdSenseAd';
import { useJobs, type Job } from '@/hooks/useJobs';

const Jobs = () => {
  const [searchParams] = useSearchParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [typeFilter, setTypeFilter] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  
  const { data: jobs = [], isLoading: loading } = useJobs();

  // Initialize filters from URL parameters
  useEffect(() => {
    const search = searchParams.get('search');
    const country = searchParams.get('country'); 
    const category = searchParams.get('category');
    const type = searchParams.get('type');

    if (search) setSearchTerm(search);
    if (country) setLocationFilter(country);
    if (category) setCategoryFilter(category);
    if (type) setTypeFilter(type);
  }, [searchParams]);


  const filteredJobs = useMemo(() => {
    let filtered = jobs;

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filtered = filtered.filter(job =>
        job.title.toLowerCase().includes(searchLower) ||
        job.company.toLowerCase().includes(searchLower) ||
        job.description.toLowerCase().includes(searchLower)
      );
    }

    if (locationFilter) {
      const locationLower = locationFilter.toLowerCase();
      filtered = filtered.filter(job =>
        job.location.toLowerCase().includes(locationLower)
      );
    }

    if (typeFilter) {
      filtered = filtered.filter(job => job.type === typeFilter);
    }

    if (categoryFilter) {
      filtered = filtered.filter(job => job.category === categoryFilter);
    }

    return filtered;
  }, [jobs, searchTerm, locationFilter, typeFilter, categoryFilter]);

  const clearFilters = useCallback(() => {
    setSearchTerm('');
    setLocationFilter('');
    setTypeFilter('');
    setCategoryFilter('');
  }, []);

  const formatPostedDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) return '1 day ago';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.ceil(diffDays / 7)} weeks ago`;
    return `${Math.ceil(diffDays / 30)} months ago`;
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title="Find Jobs in Gulf, USA & UK - Online Career Navigator"
        description="Browse thousands of job opportunities across Gulf countries, USA, and UK. Filter by location, category, and job type to find your perfect career match."
        keywords="job search, jobs in gulf, jobs in USA, jobs in UK, employment opportunities, career search, job listings"
        structuredData={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          "name": "Job Search - Online Career Navigator",
          "description": "Browse thousands of job opportunities across Gulf countries, USA, and UK. Filter by location, category, and job type to find your perfect career match.",
          "url": "https://onlinecareernavigator.com/jobs",
          "mainEntity": {
            "@type": "ItemList",
            "name": "Job Listings",
            "numberOfItems": jobs.length
          }
        }}
      />
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-purple-600 to-blue-800 text-white py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4 sm:mb-6">
              Find Your Dream Job
            </h1>
            <p className="text-lg sm:text-xl text-blue-100 max-w-3xl mx-auto px-4">
              Discover thousands of job opportunities from top companies worldwide
            </p>
          </div>

          {/* Search Filters */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-4 sm:p-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Job title or keywords"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Location"
                    value={locationFilter}
                    onChange={(e) => setLocationFilter(e.target.value)}
                    className="pl-10"
                  />
                </div>

                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger>
                    <Briefcase className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Job Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Full-time">Full-time</SelectItem>
                    <SelectItem value="Part-time">Part-time</SelectItem>
                    <SelectItem value="Contract">Contract</SelectItem>
                    <SelectItem value="Internship">Internship</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                  <SelectTrigger>
                    <Filter className="h-4 w-4 mr-2" />
                    <SelectValue placeholder="Category" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Technology">Technology</SelectItem>
                    <SelectItem value="Marketing">Marketing</SelectItem>
                    <SelectItem value="Sales">Sales</SelectItem>
                    <SelectItem value="Design">Design</SelectItem>
                    <SelectItem value="Finance">Finance</SelectItem>
                    <SelectItem value="Healthcare">Healthcare</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
                <p className="text-sm text-gray-600">
                  {filteredJobs.length} jobs found
                </p>
                <Button variant="outline" onClick={clearFilters} className="w-full sm:w-auto">
                  Clear Filters
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* AdSense Ad - After Search */}
      <div className="bg-gray-50 py-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <AdSenseAd format="square" className="text-center" />
        </div>
      </div>

      {/* Jobs List */}
      <section className="py-8 sm:py-12 lg:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid gap-6">
              {Array(6).fill(0).map((_, index) => (
                <JobCardSkeleton key={index} />
              ))}
            </div>
          ) : filteredJobs.length === 0 ? (
            <div className="text-center py-12">
              <Briefcase className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No jobs found</h3>
              <p className="text-gray-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {filteredJobs.map((job, index) => (
                <React.Fragment key={job.id}>
                  <OptimizedJobCard
                    id={job.id}
                    title={job.title}
                    company={job.company}
                    location={job.location}
                    type={job.type}
                    category={job.category}
                    description={job.description}
                    salary={job.salary}
                    postedDate={formatPostedDate(job.created_at)}
                  />
                  {/* AdSense Ad - Every 5 jobs */}
                  {(index + 1) % 5 === 0 && (
                    <div className="my-8">
                      <AdSenseAd format="square" className="text-center" />
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Jobs;

import { useParams, Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ArrowLeft, MapPin, Clock, DollarSign, Building, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import SEO from '@/components/SEO';
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
}

const JobDetail = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  const fetchJob = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('id', jobId)
        .eq('is_active', true)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      console.error('Error fetching job:', error);
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">Loading job details...</div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card>
            <CardContent className="p-12 text-center">
              <h1 className="text-2xl font-bold text-gray-900 mb-4">Job Not Found</h1>
              <p className="text-gray-600 mb-6">The job you're looking for doesn't exist or has been removed.</p>
              <Link to="/jobs">
                <Button>Browse All Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  const contactEmail = `hr@${job.company.toLowerCase().replace(/\s+/g, '')}.com`;
  const postedDate = new Date(job.created_at).toLocaleDateString();
  const applyPath = `/job/${job.id}/apply`;

  // Show salary & currency together (if either available)
  const displaySalary = job.salary ? job.salary : null;
  // job.currency may not be present for all jobs
  const displayCurrency = (job as any).currency
    ? (job as any).currency
    : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={`${job.title} at ${job.company} - ${job.location} | Online Career Navigator`}
        description={`${job.title} position at ${job.company} in ${job.location}. ${job.type} role in ${job.category}. Apply now through Online Career Navigator.`}
        keywords={`${job.title}, ${job.company}, ${job.location}, ${job.category}, ${job.type}, job opportunity, career`}
        type="article"
      />
      <Header />
      
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button */}
        <Link to="/jobs" className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6">
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back to Jobs
        </Link>

        {/* Job Header */}
        <Card className="mb-8">
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-6">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-900 mb-4">{job.title}</h1>
                
                <div className="flex flex-wrap gap-4 text-gray-600 mb-4">
                  <div className="flex items-center">
                    <Building className="w-5 h-5 mr-2" />
                    {job.company}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-5 h-5 mr-2" />
                    {job.location}
                  </div>
                  <div className="flex items-center">
                    <Clock className="w-5 h-5 mr-2" />
                    {job.type}
                  </div>
                  {(displaySalary || displayCurrency) && (
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      {displaySalary}
                      {displayCurrency && (
                        <span className="ml-1 text-xs text-gray-600">({displayCurrency})</span>
                      )}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge>{job.category}</Badge>
                  <Badge variant="outline">{job.type}</Badge>
                  <Badge variant="secondary">Posted {postedDate}</Badge>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Link to={applyPath}>
                  <Button size="lg" className="w-full md:w-auto">
                    <Mail className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </Link>
                <p className="text-sm text-gray-600 text-center md:text-right">
                  Apply at: {contactEmail}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Job Description */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold text-gray-900 mb-4">Job Description</h2>
                <p className="text-gray-700 leading-relaxed">{job.description}</p>
              </CardContent>
            </Card>

            {/* Requirements */}
            {job.requirements && job.requirements.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Requirements</h2>
                  <ul className="space-y-2">
                    {job.requirements.map((req, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Benefits */}
            {job.benefits && job.benefits.length > 0 && (
              <Card>
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-4">Benefits & Perks</h2>
                  <ul className="space-y-2">
                    {job.benefits.map((benefit, index) => (
                      <li key={index} className="flex items-start">
                        <span className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                        <span className="text-gray-700">{benefit}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Apply</h3>
                {(displaySalary || displayCurrency) && (
                  <div className="mb-3">
                    <span className="font-semibold">Salary:</span>{" "}
                    <span>
                      {displaySalary}
                      {displayCurrency && (
                        <span className="ml-1 text-xs text-gray-600">({displayCurrency})</span>
                      )}
                    </span>
                  </div>
                )}
                <p className="text-gray-600 mb-4">
                  Ready to take the next step in your career? Apply now and join our team!
                </p>
                <Link to={applyPath}>
                  <Button className="w-full mb-3">
                    <Mail className="w-4 h-4 mr-2" />
                    Apply Now
                  </Button>
                </Link>
                <Separator className="my-3" />
                <p className="text-sm text-gray-600 text-center">
                  Send your application to:<br />
                  <strong>{contactEmail}</strong>
                </p>
              </CardContent>
            </Card>

            {/* Company Info */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">About {job.company}</h3>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Location:</span>
                    <span className="font-medium">{job.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Industry:</span>
                    <span className="font-medium">{job.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Job Type:</span>
                    <span className="font-medium">{job.type}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default JobDetail;

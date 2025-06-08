
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, MapPin, Clock, DollarSign, Building, Mail } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { jobsData } from '@/data/jobsData';

const JobDetail = () => {
  const { id } = useParams();
  const job = jobsData.find(j => j.id === id);

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

  return (
    <div className="min-h-screen bg-gray-50">
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
                  {job.salary && (
                    <div className="flex items-center">
                      <DollarSign className="w-5 h-5 mr-2" />
                      {job.salary}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-2 mb-6">
                  <Badge>{job.category}</Badge>
                  <Badge variant="outline">{job.type}</Badge>
                  <Badge variant="secondary">Posted {job.postedDate}</Badge>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <Button size="lg" className="w-full md:w-auto">
                  <Mail className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <p className="text-sm text-gray-600 text-center md:text-right">
                  Apply at: {job.contactEmail}
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

            {/* Benefits */}
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
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Apply */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Apply</h3>
                <p className="text-gray-600 mb-4">
                  Ready to take the next step in your career? Apply now and join our team!
                </p>
                <Button className="w-full mb-3">
                  <Mail className="w-4 h-4 mr-2" />
                  Apply Now
                </Button>
                <Separator className="my-3" />
                <p className="text-sm text-gray-600 text-center">
                  Send your application to:<br />
                  <strong>{job.contactEmail}</strong>
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

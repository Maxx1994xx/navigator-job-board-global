import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Timer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import SEO from "@/components/SEO";
import EzoicAd from "@/components/EzoicAd";
import { supabase } from "@/integrations/supabase/client";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary?: string;
  currency?: string | null;
  description: string;
  requirements: string[];
  benefits: string[];
  created_at: string;
  listing_url?: string;
}

const WAIT_SECONDS = 15;

const JobApply = () => {
  const { id } = useParams();
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState(true);
  const [timer, setTimer] = useState(WAIT_SECONDS);
  const [canApply, setCanApply] = useState(false);

  useEffect(() => {
    if (id) {
      fetchJob(id);
    }
  }, [id]);

  useEffect(() => {
    if (!loading && timer > 0 && !canApply) {
      const t = setTimeout(() => {
        setTimer((s) => s - 1);
      }, 1000);
      return () => clearTimeout(t);
    } else if (timer === 0) {
      setCanApply(true);
    }
  }, [loading, timer, canApply]);

  const fetchJob = async (jobId: string) => {
    try {
      const { data, error } = await supabase
        .from("jobs")
        .select("*")
        .eq("id", jobId)
        .single();

      if (error) throw error;
      setJob(data);
    } catch (error) {
      setJob(null);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-8 text-center">Loading...</div>
        <Footer />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="max-w-2xl mx-auto p-8 text-center">
          <Card>
            <CardContent className="p-10">
              <h1 className="text-2xl font-bold mb-4">Job Not Found</h1>
              <Link to="/jobs">
                <Button>Back to Jobs</Button>
              </Link>
            </CardContent>
          </Card>
        </div>
        <Footer />
      </div>
    );
  }

  // Get the currency from the job, if set (no more auto-mapping)
  const displaySalary = job.salary;
  const displayCurrency = job.currency;

  return (
    <div className="min-h-screen bg-gray-50">
      <SEO 
        title={`Apply for ${job.title} at ${job.company} | Online Career Navigator`}
        description={`Apply for ${job.title} position at ${job.company} in ${job.location}. Submit your application through Online Career Navigator for this ${job.type} opportunity.`}
        keywords={`apply for job, ${job.title}, ${job.company}, ${job.location}, job application, career opportunity`}
        type="article"
      />
      <Header />
      <div className="flex justify-center gap-8 px-4 py-10 max-w-7xl mx-auto">
        {/* Left Vertical Ad */}
        <div className="hidden xl:block w-48 flex-shrink-0">
          <div className="sticky top-24">
            <EzoicAd placementId={107} className="w-48" />
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-2xl">
          <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-3 text-gray-600 mb-2">
              <Badge>{job.company}</Badge>
              <Badge variant="outline">{job.location}</Badge>
              <Badge variant="secondary">{job.type}</Badge>
              {displaySalary && (
                <Badge variant="outline">
                  {displaySalary}
                  {displayCurrency && (
                    <span className="ml-1 text-xs text-gray-600">{displayCurrency}</span>
                  )}
                </Badge>
              )}
            </div>
            <Separator className="my-4" />
            <p className="mb-6 text-gray-700 whitespace-pre-line">{job.description}</p>
            {job.requirements && job.requirements.length > 0 && (
              <>
                <h2 className="font-semibold mb-2 text-lg">Requirements</h2>
                <ul className="mb-6 ml-5 list-disc">
                  {job.requirements.map((req, i) => (
                    <li key={i} className="text-gray-700">{req}</li>
                  ))}
                </ul>
              </>
            )}
            {job.benefits && job.benefits.length > 0 && (
              <>
                <h2 className="font-semibold mb-2 text-lg">Perks &amp; Benefits</h2>
                <ul className="mb-6 ml-5 list-disc">
                  {job.benefits.map((perk, i) => (
                    <li key={i} className="text-gray-700">{perk}</li>
                  ))}
                </ul>
              </>
            )}
            <div className="mt-10 flex flex-col items-center gap-2">
              {!canApply ? (
                <div className="flex flex-col items-center">
                  <Timer className="w-10 h-10 mb-2 text-blue-600 animate-pulse" />
                  <span className="font-semibold text-lg mb-1">Please wait {timer} seconds...</span>
                  <span className="text-gray-500 text-xs">You will be able to apply after the timer finishes</span>
                </div>
              ) : (
                <Button
                  className="mt-2 w-full max-w-xs"
                  size="lg"
                  onClick={() => {
                    if (job.listing_url) {
                      window.open(job.listing_url, "_blank", "noopener");
                    }
                  }}
                >
                  Go to Official Job Listing
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
        </div>

        {/* Right Vertical Ad */}
        <div className="hidden xl:block w-48 flex-shrink-0">
          <div className="sticky top-24">
            <EzoicAd placementId={108} className="w-48" />
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default JobApply;

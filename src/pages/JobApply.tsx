
import { useParams, useNavigate, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Timer } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <Card>
          <CardContent className="p-8">
            <h1 className="text-2xl font-bold mb-2">{job.title}</h1>
            <div className="flex flex-wrap gap-3 text-gray-600 mb-2">
              <Badge>{job.company}</Badge>
              <Badge variant="outline">{job.location}</Badge>
              <Badge variant="secondary">{job.type}</Badge>
              {job.salary && (
                <Badge variant="outline">{job.salary}</Badge>
              )}
              {job.currency && (
                <span className="text-xs text-gray-500">
                  Currency:&nbsp;
                  <Badge variant="secondary">{job.currency}</Badge>
                </span>
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
      <Footer />
    </div>
  );
};

export default JobApply;

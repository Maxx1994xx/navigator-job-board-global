import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { Loader2, Download, Search } from 'lucide-react';

const JobBoardFetcher = ({ onJobsAdded }: { onJobsAdded?: () => void }) => {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [limit, setLimit] = useState(20);
  const [sources, setSources] = useState(['jsearch', 'adzuna']);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const jobSources = [
    { id: 'jsearch', name: 'JSearch (Indeed, LinkedIn, ZipRecruiter)', description: 'Aggregates jobs from major job boards' },
    { id: 'adzuna', name: 'Adzuna', description: 'Global job search engine' }
  ];

  const handleSourceToggle = (sourceId: string, checked: boolean) => {
    if (checked) {
      setSources([...sources, sourceId]);
    } else {
      setSources(sources.filter(s => s !== sourceId));
    }
  };

  const handleFetchJobs = async () => {
    if (!query.trim()) {
      toast({
        title: "Error",
        description: "Please enter a search query",
        variant: "destructive",
      });
      return;
    }

    if (sources.length === 0) {
      toast({
        title: "Error",
        description: "Please select at least one job source",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { data, error } = await supabase.functions.invoke('fetch-job-boards', {
        body: {
          query: query.trim(),
          location: location.trim() || undefined,
          sources,
          limit
        }
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Success!",
        description: `Fetched ${data.jobsFetched} jobs and added ${data.jobsInserted} to database from ${data.sources.join(', ')}`,
      });

      // Reset form
      setQuery('');
      setLocation('');
      
      // Refresh parent component if callback provided
      if (onJobsAdded) {
        onJobsAdded();
      }
      
    } catch (error) {
      console.error('Error fetching jobs:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to fetch jobs from job boards",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Download className="h-5 w-5" />
          Fetch Jobs from Job Boards
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="query">Search Query *</Label>
            <Input
              id="query"
              placeholder="e.g., Software Engineer, Marketing Manager"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="location">Location (Optional)</Label>
            <Input
              id="location"
              placeholder="e.g., New York, Remote, California"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="limit">Number of Jobs to Fetch</Label>
          <Input
            id="limit"
            type="number"
            min="1"
            max="100"
            value={limit}
            onChange={(e) => setLimit(parseInt(e.target.value) || 20)}
          />
        </div>

        <div className="space-y-3">
          <Label>Job Sources</Label>
          {jobSources.map((source) => (
            <div key={source.id} className="flex items-start space-x-2">
              <Checkbox
                id={source.id}
                checked={sources.includes(source.id)}
                onCheckedChange={(checked) => handleSourceToggle(source.id, checked as boolean)}
              />
              <div className="grid gap-1.5 leading-none">
                <label
                  htmlFor={source.id}
                  className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                >
                  {source.name}
                </label>
                <p className="text-xs text-muted-foreground">
                  {source.description}
                </p>
              </div>
            </div>
          ))}
        </div>

        <Button 
          onClick={handleFetchJobs} 
          disabled={isLoading || !query.trim() || sources.length === 0}
          className="w-full"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Fetching Jobs...
            </>
          ) : (
            <>
              <Search className="mr-2 h-4 w-4" />
              Fetch Jobs from External Boards
            </>
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default JobBoardFetcher;
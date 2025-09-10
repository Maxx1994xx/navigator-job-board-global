import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface Job {
  id: string;
  job_id?: string;
  title: string;
  company: string;
  location: string;
  type: string;
  category: string;
  salary?: string;
  description: string;
  requirements?: string[];
  benefits?: string[];
  created_at: string;
  is_active: boolean;
  is_featured?: boolean;
  status: string;
}

export const useJobs = () => {
  return useQuery({
    queryKey: ['jobs'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      return (data || []) as Job[];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    refetchOnWindowFocus: false,
  });
};

export const useFeaturedJobs = () => {
  const { data: allJobs = [], isLoading, error } = useJobs();
  
  const featuredJobs = allJobs.filter(job => job.is_featured).slice(0, 6);
  
  return {
    data: featuredJobs,
    isLoading,
    error
  };
};
import React, { useMemo } from 'react';
import { FixedSizeList as List } from 'react-window';
import JobCard from './JobCard'; 
import { type Job } from '@/hooks/useJobs';

interface VirtualizedJobListProps {
  jobs: Job[];
  formatPostedDate: (date: string) => string;
}

const VirtualizedJobList = ({ jobs, formatPostedDate }: VirtualizedJobListProps) => {
  const itemHeight = 200; // Approximate height of each job card
  const listHeight = Math.min(jobs.length * itemHeight, 800); // Max height of 800px

  const JobItem = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const job = jobs[index];
    
    return (
      <div style={{ ...style, padding: '8px 0' }}>
        <JobCard
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
      </div>
    );
  };

  if (jobs.length <= 10) {
    // For small lists, render normally without virtualization
    return (
      <div className="grid gap-6">
        {jobs.map((job) => (
          <JobCard
            key={job.id}
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
        ))}
      </div>
    );
  }

  return (
    <List
      height={listHeight}
      width="100%"
      itemCount={jobs.length}
      itemSize={itemHeight}
      className="scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-gray-100"
    >
      {JobItem}
    </List>
  );
};

export default VirtualizedJobList;
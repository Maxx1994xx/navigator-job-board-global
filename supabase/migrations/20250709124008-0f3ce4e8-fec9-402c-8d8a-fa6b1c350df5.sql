-- Create blogs table for admin management
CREATE TABLE public.blogs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  excerpt TEXT NOT NULL,
  content TEXT NOT NULL,
  html_content TEXT,
  category TEXT NOT NULL,
  author TEXT NOT NULL DEFAULT 'Admin',
  image_url TEXT,
  seo_title TEXT,
  seo_description TEXT,
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  is_published BOOLEAN DEFAULT true,
  reading_time INTEGER DEFAULT 5,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID REFERENCES admin_users(id)
);

-- Enable Row Level Security
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;

-- Create policies for blog management
CREATE POLICY "Anyone can view published blogs" 
ON public.blogs 
FOR SELECT 
USING (is_published = true);

CREATE POLICY "Admins can manage all blogs" 
ON public.blogs 
FOR ALL 
USING (EXISTS (
  SELECT 1 FROM admin_users 
  WHERE admin_users.id = auth.uid()
));

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_blogs_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_blogs_updated_at
  BEFORE UPDATE ON public.blogs
  FOR EACH ROW
  EXECUTE FUNCTION public.update_blogs_updated_at();

-- Insert existing blog data
INSERT INTO public.blogs (title, slug, excerpt, content, category, image_url, seo_title, seo_description, reading_time) VALUES
('Remote Work Best Practices for 2024', 'remote-work-best-practices-2024', 'Discover the latest strategies for successful remote work in 2024, including productivity tips and team collaboration methods.', 'The landscape of remote work continues to evolve rapidly. In 2024, organizations are discovering new ways to maintain productivity while ensuring employee satisfaction...', 'Career Tips', 'https://images.unsplash.com/photo-1521737604893-d14cc237f11d?w=800&h=400&fit=crop', 'Remote Work Best Practices for 2024 | Career Success Guide', 'Learn proven remote work strategies for 2024. Boost productivity, improve collaboration, and achieve work-life balance with expert tips.', 8),
('AI in Recruitment: Transforming Hiring Processes', 'ai-recruitment-transforming-hiring', 'Explore how artificial intelligence is revolutionizing recruitment processes and what it means for job seekers and employers.', 'Artificial Intelligence is fundamentally changing how companies approach recruitment. From automated resume screening to predictive analytics...', 'Industry Trends', 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&h=400&fit=crop', 'AI in Recruitment: How Technology is Transforming Hiring', 'Discover how AI is revolutionizing recruitment processes. Learn about automated screening, predictive analytics, and the future of hiring.', 7),
('Salary Negotiation Strategies That Actually Work', 'salary-negotiation-strategies-work', 'Master the art of salary negotiation with proven strategies that help you secure better compensation packages.', 'Negotiating your salary can be one of the most impactful conversations of your career. Yet many professionals avoid it entirely...', 'Career Tips', 'https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&h=400&fit=crop', 'Salary Negotiation Strategies That Work | Career Advancement', 'Master salary negotiation with proven strategies. Learn how to research, prepare, and negotiate better compensation packages effectively.', 6),
('Tech Industry Job Market Analysis 2024', 'tech-industry-job-market-2024', 'Comprehensive analysis of the current tech job market, including in-demand skills and emerging opportunities.', 'The technology sector continues to be a driving force in the global economy. Despite economic uncertainties, the demand for skilled tech professionals remains strong...', 'Industry Trends', 'https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=800&h=400&fit=crop', 'Tech Job Market Analysis 2024 | Industry Trends & Opportunities', 'Get insights into the 2024 tech job market. Discover in-demand skills, salary trends, and emerging opportunities in technology careers.', 9),
('Building a Portfolio That Gets You Hired', 'building-portfolio-gets-hired', 'Learn how to create a compelling professional portfolio that showcases your skills and attracts potential employers.', 'In todays competitive job market, a well-crafted portfolio can be the difference between landing your dream job and being overlooked...', 'Career Tips', 'https://images.unsplash.com/photo-1586717791821-3f44a563fa4c?w=800&h=400&fit=crop', 'Build a Portfolio That Gets You Hired | Professional Development', 'Learn to create compelling portfolios that showcase your skills. Get tips on design, content, and presentation that attract employers.', 10);
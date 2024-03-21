import { Component, OnInit, SecurityContext } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

interface CareerOption {
  title: string;
  description: string;
  requirements: string[];
  averageSalary: string;
}
interface Blog {
  blog_id: string;
  title: string;
  banner?: string;
  des?: string;
  content?: { blocks: Block[] }[]; // Change the type to match the actual type of the content
  tags?: string[];
  author: string; // Assuming author is a string representing the ObjectId
  activity: {
    total_likes: number;
    total_comments: number;
    total_reads: number;
    total_parent_comments: number;
  };
  comments?: string[]; // Assuming comments is an array of strings representing the ObjectIds
  draft?: boolean;
  createdAt?: Date;
}
interface Block {
  id: string;
  type: string;
  data: {
    text?: string;
  };
}
@Component({
  selector: 'app-blog',
  templateUrl: './blog.component.html',
  styleUrls: ['./blog.component.css']
})
export class BlogComponent {
  blogId: string | null = null; // Initialize blogId with null or any default value
  blogDetails: Blog | null = null;
  Array: any;

  constructor(private route: ActivatedRoute, private http: HttpClient, private sanitizer: DomSanitizer) { }
  i: any;


  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.blogId = params.get('id');
      if (this.blogId) {
        this.fetchBlogDetails(this.blogId);
      }
    });
  }

  parseHTML(htmlString: string | undefined): SafeHtml {
    if (htmlString) {
        // Ensure that htmlString contains valid HTML markup
        const sanitizedHtml = this.sanitizer.sanitize(
            SecurityContext.HTML,
            htmlString
        );
        // Return sanitized HTML
        return this.sanitizer.bypassSecurityTrustHtml(sanitizedHtml || '');
    } else {
        return '';
    }
}
  fetchBlogDetails(blogId: string): void {
    this.http.post<any>('https://hustleforwork.com:3000/get-blog', { blog_id: blogId, draft: false, mode: 'view' }).subscribe(
      (response: any) => {
        if (response.error) {
          console.error('Error fetching blog details:', response.error);
          // Handle error, display user-friendly message
        } else {
          console.log('Blog details fetched successfully:', response.blog);
          this.blogDetails = response.blog;
        }
      },
      error => {
        console.error('Error fetching blog details:', error);
        // Handle error, display user-friendly message
      }
    );
  }


  isObject(value: any): boolean {
    return typeof value === 'object' && value !== null;
  }

  getImageWidth(): number {
    // Calculate and return the image width based on the screen width
    return window.innerWidth * 0.4; // Adjust the percentage as needed
  }

  getImageHeight(): number {
    // Calculate and return the image height based on the screen height
    return window.innerHeight * 0.5; // Adjust the percentage as needed
  }
  // careerOptions: CareerOption[] = [
  //   {
  //     title: 'Chemical Engineer',
  //     description: 'This is one of the leading career options that students are opting for after 12th PCM. A Chemical Engineer processes natural and artificial chemicals into products.',
  //     requirements: [
  //       '50% aggregate marks in 12th PCM',
  //       'A four-year bachelor’s degree in chemical engineering'
  //     ],
  //     averageSalary: '₹19,658 per month'
  //   },
  //   {
  //     title: 'Software Engineer',
  //     description: 'Most of the students that choose 12th PCM look into software engineering. It requires creating tools, applications, computer software, and digital solutions.',
  //     requirements: [
  //       '50% aggregate marks in 12th PCM',
  //       'A four-year degree in Bachelor of Science/Computer Science Engineering'
  //     ],
  //     averageSalary: '₹24,519 per month'
  //   },
  //   {
  //     title: 'Data Scientist',
  //     description: 'Data scientists are people with extensive knowledge of numbers and algorithms to study data and create new models. They predict, classify, and cluster data while validating unstructured and structured data.',
  //     requirements: [
  //       '50% aggregate marks in 12th PCM',
  //       'A four-year bachelor’s degree in Data Science'
  //     ],
  //     averageSalary: '₹8,56,470 per year'
  //   },
  //   {
  //     title: 'Machine Learning Engineer',
  //     description: 'Machine Learning and AI are an important part of this generation. ML Engineers work in collaboration with data scientists, analysts, data engineers, and administrators. They develop AI systems to create automated predictive models.',
  //     requirements: [
  //       '50% aggregate marks in 12th PCM',
  //       'A four-year degree in computer science/data science',
  //       'An industry-recognized AI ML Certification'
  //     ],
  //     averageSalary: '₹4,22,980 per year'
  //   },
  //   {
  //     title: 'Mathematician',
  //     description: 'Being a mathematician is one of the most reputable jobs. They have to apply mathematical principles and theorems in industries such as architecture, computer graphics, and business processes.',
  //     requirements: [
  //       '50% aggregate marks in 12th PCM',
  //       'A four-year degree in Mathematics',
  //       'A doctorate degree to improve future prospects'
  //     ],
  //     averageSalary: '₹3,27,844 per year'
  //   },
  //   {
  //     title: 'Aeronautical Engineer',
  //     description: 'Aeronautical Engineers are professionals who study, design and manufacture aircraft, missiles, and spacecraft. They perform extensive research and development procedures to improve aircraft, defence systems, and space research.',
  //     requirements: [
  //       '50% aggregate marks in 12th PCM',
  //       'A four years’ bachelor’s in aeronautical engineering'
  //     ],
  //     averageSalary: '₹3,52,546 per year'
  //   },
  //   {
  //     title: 'Product Designer',
  //     description: 'Last but not least career option on our list after 12th Science (PCM) with Salary is Product Designer. It is one of the least explored career options after 12th PCM. A product designer analyses trends consumer requirements to design products for customer aid.',
  //     requirements: [
  //       '50% aggregate marks in 12th PCM',
  //       'A four-year bachelor’s degree in design'
  //     ],
  //     averageSalary: '₹2,63,309 per year'
  //   }
  // ];


  // dataArray = [
  //   { heading: 'Research the company and interviewers', text: 'The number one thing that you should do before any interview is to research the company and the interviewers. This will help you understand the key information which may be asked in the interview. ' },
  //   { heading: 'Make a list of the possible questions', text: 'One of the best interview tips is to list the possible questions you might have to answer. This will help you analyze what you could possibly face on the day. ' },
  //   { heading: 'Reread the job description', text: 'Reading the JD or Job Description may be the first thing that you may do for any job. Moving forward, make sure to read it carefully or read it twice. It is one of the most proven interview tips that will help you make the goal.' },
  //   {
  //     heading: 'Practice answering with someone', text: 'To make the flow of your speech, try practicing answers with someone. This will help you gain confidence and make sure you do not hesitate to respond.'
  //   },
  //   {
  //     heading: 'Prepare a list of references', text: 'Make a list of references for yourself. This will back you up as a strong candidate and make a lasting impression on the interviewer. It is one of the most basic interview tips that you should follow.'
  //   },
  //   {
  //     heading: 'Make the resume', text: 'Make sure you make an easy-to-read and attractive resume that briefly describes you. It will help you gain the attention of the interviewers just by reading it like a bio-data.'
  //   },
  //   {
  //     heading: 'Attach files of your work', text: 'Attach your resume with some examples of your work. This will put a good first impression on the interviewers while they analyze your documents. Perhaps they will question you based on what you have already done.'
  //   },
  //   {
  //     heading: 'Plan your interview outfit the night before', text: 'You do not want to be late on your first day of the interview. If you plan your interview outfit a night before, it will save you time and help you decide the best attire'
  //   },
  //   {
  //     heading: 'Bring resume copies, a scrapbook, and a pen', text: 'Bring your resume photocopies, a scrapbook, and a pen. These are basic things that you might require in an interview.'
  //   },
  //   {
  //     heading: 'Arrive 10–15 minutes early', text: 'Come a little early for the interview. This will give a good impression about you on the management and give you plus points to getting hired.'
  //   },
  //   { heading: 'Make a great first impression', text: 'The first impression is the last impression! Make sure you are clean, look confident, and enthusiastic and aren\'t sleepy. This will encourage the interviewers to take more interest in you.' },
  //   { heading: 'Treat everyone with respect', text: 'Make sure to show etiquette and treat everyone you meet with respect. Greet them with good words and respond peacefully.' },
  //   { heading: 'Show authenticity and positivity', text: 'Being genuine during the interview will encourage the interviewers to trust you. Make sure you do not lie about anything and positively answer them.' },
  //   { heading: 'Answer based on your skills and accomplishments', text: 'Hopefully, the interviewer will ask questions based on your skills and accomplishments. If not, make sure to add a word or two about it in the end.' },
  //   { heading: 'Keep your answers brief and focused', text: 'Do not try to confuse the interviewers, rather, keep your answers concise and focused.' },
  //   { heading: 'Don\'t speak negatively about previous employers', text: 'Your interviewers will judge you on this. Ensure not to speak negatively about previous employers if you are an experienced candidate.' },
  //   { heading: 'Ask about next steps', text: 'Ask about the next steps to getting hired. This will make you look more interested in the job vacancy and make a good impression on the interviews. Not only this, but this is one of the best interview tips that will help you start a conversation with the interviewers.' },
  //   { heading: 'Show interest in the company’s values', text: 'Ask about the company, its values, editors, CEOs, and more. This will show interest and help you learn about the company hiring you.' },
  //   { heading: 'Mail a thank-you letter after the interview', text: 'Mailing a thank you letter after the interview will show your sincerity and make a good last impression. Make sure to greet them, show positivity, and add some good words about the company, the staff, and the interviewers.' },


  // ];

}

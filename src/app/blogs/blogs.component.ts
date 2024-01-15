import { Component } from '@angular/core';
interface CareerOption {
  title: string;
  description: string;
  requirements: string[];
  averageSalary: string;
}

@Component({
  selector: 'app-blogs',
  templateUrl: './blogs.component.html',
  styleUrls: ['./blogs.component.css']
})
export class BlogsComponent {
  careerOptions: CareerOption[] = [
    {
      title: 'Chemical Engineer',
      description: 'This is one of the leading career options that students are opting for after 12th PCM. A Chemical Engineer processes natural and artificial chemicals into products.',
      requirements: [
        '50% aggregate marks in 12th PCM',
        'A four-year bachelor’s degree in chemical engineering'
      ],
      averageSalary: '₹19,658 per month'
    },
    {
      title: 'Software Engineer',
      description: 'Most of the students that choose 12th PCM look into software engineering. It requires creating tools, applications, computer software, and digital solutions.',
      requirements: [
        '50% aggregate marks in 12th PCM',
        'A four-year degree in Bachelor of Science/Computer Science Engineering'
      ],
      averageSalary: '₹24,519 per month'
    },
    {
      title: 'Data Scientist',
      description: 'Data scientists are people with extensive knowledge of numbers and algorithms to study data and create new models. They predict, classify, and cluster data while validating unstructured and structured data.',
      requirements: [
        '50% aggregate marks in 12th PCM',
        'A four-year bachelor’s degree in Data Science'
      ],
      averageSalary: '₹8,56,470 per year'
    },
    {
      title: 'Machine Learning Engineer',
      description: 'Machine Learning and AI are an important part of this generation. ML Engineers work in collaboration with data scientists, analysts, data engineers, and administrators. They develop AI systems to create automated predictive models.',
      requirements: [
        '50% aggregate marks in 12th PCM',
        'A four-year degree in computer science/data science',
        'An industry-recognized AI ML Certification'
      ],
      averageSalary: '₹4,22,980 per year'
    },
    {
      title: 'Mathematician',
      description: 'Being a mathematician is one of the most reputable jobs. They have to apply mathematical principles and theorems in industries such as architecture, computer graphics, and business processes.',
      requirements: [
        '50% aggregate marks in 12th PCM',
        'A four-year degree in Mathematics',
        'A doctorate degree to improve future prospects'
      ],
      averageSalary: '₹3,27,844 per year'
    },
    {
      title: 'Aeronautical Engineer',
      description: 'Aeronautical Engineers are professionals who study, design and manufacture aircraft, missiles, and spacecraft. They perform extensive research and development procedures to improve aircraft, defence systems, and space research.',
      requirements: [
        '50% aggregate marks in 12th PCM',
        'A four years’ bachelor’s in aeronautical engineering'
      ],
      averageSalary: '₹3,52,546 per year'
    },
    {
      title: 'Product Designer',
      description: 'Last but not least career option on our list after 12th Science (PCM) with Salary is Product Designer. It is one of the least explored career options after 12th PCM. A product designer analyses trends consumer requirements to design products for customer aid.',
      requirements: [
        '50% aggregate marks in 12th PCM',
        'A four-year bachelor’s degree in design'
      ],
      averageSalary: '₹2,63,309 per year'
    }
  ];
}

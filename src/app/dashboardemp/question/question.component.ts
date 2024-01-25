import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from 'src/app/auth/user.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  jobid!: string;
  questionForm!: FormGroup;
  currentQuestionIndex: number = 0;
  private questionCounter = 0;
  constructor(
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private b1:UserService,
    private router:Router
    // private quizService: QuizService
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      this.jobid = params['jobid'];

      // Initialize the form with jobid as a hidden field
      this.initializeForm();
    });
  }

  initializeForm(): void {
    // Create the form with validation rules
    this.questionForm = this.formBuilder.group({
      question: ['', Validators.required],
      optionA: ['', Validators.required],
      optionB: ['', Validators.required],
      optionC: ['', Validators.required],
      optionD: ['', Validators.required],
      correctAnswer: ['', Validators.required],
      jobid: [this.jobid, Validators.required]
    });
  }

  submitForm(): void {
    if (this.questionForm.valid && this.questionCounter < 5) {
      const questionData = this.questionForm.value;
      this.b1.addQuestion(questionData).subscribe(
        (response: any) => {
          console.log('Question added successfully:', response);
          this.questionCounter++;
          this.currentQuestionIndex++;
          this.questionForm.reset();
          if (this.questionCounter === 5) {
            console.log('All 5 questions added. Redirecting...');
            this.router.navigate(['/dashboardemp/alljobs']);
          }
        },
        (error) => {
          console.error('Error adding question:', error);
        }
      );
    } else {
      console.error('Form is invalid or reached the limit of 5 questions.');
    }
  }

  skipQuestion(): void {
    this.router.navigate(['/dashboardemp/alljobs']);
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AdminserviceService } from '../adminauth/adminservice.service';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.css']
})
export class QuestionComponent implements OnInit {
  questionForm!: FormGroup;

  constructor(private fb: FormBuilder, private adminauth: AdminserviceService ) { }

  ngOnInit(): void {
    this.questionForm = this.fb.group({
      question: ['', Validators.required],
      optionA: ['', Validators.required],
      optionB: ['', Validators.required],
      optionC: ['', Validators.required],
      optionD: ['', Validators.required],
      correctAnswer: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.questionForm.valid) {
      const questionData = this.questionForm.value;
      this.adminauth.addQuestion(questionData).subscribe(
     {
      next:(response:any) =>{
        console.log('Question added successfully', response);
        // Reset the form after successful submission
        this.questionForm.reset();
      },
      error:(err:any)=>{
        console.error('Error adding question', err);
      }
     }
      );
    } else {
      // Handle form validation errors or display an error message
    }
  }

}

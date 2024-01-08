import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
    import {  Router } from '@angular/router';
    import { UserService } from 'src/app/auth/user.service';


    interface UserAnswer {
      questionId: number;
      userResponse: string; // Ensure this matches the property name in your component
    }
    


    @Component({
      selector: 'app-questionpaper',
      templateUrl: './questionpaper.component.html',
      styleUrls: ['./questionpaper.component.css']
    })
    export class QuestionpaperComponent implements OnInit {
      data: any[] = [];
      userAnswers: UserAnswer[] = [];
      form!: FormGroup;

      constructor(private http: UserService , private router:Router , private formbuilder:FormBuilder ) {}

      ngOnInit(): void {
        this.form = this.formbuilder.group({});
    
        let response = this.http.fetchquestion();
        response.subscribe((data1: any) => {
          // Initialize userAnswers with empty responses for each question
          this.userAnswers = data1.map((question: any) => ({
            questionId: question.id,
            userResponse: '' // Ensure it matches the property name in your HTML template
          }));
          this.data = data1;
    
          // Dynamically create form controls for each question
          data1.forEach((question: any) => {
            this.form.addControl(`question${question.id}`, new FormControl(''));
          });
        }); 
      }
    
      submitAnswers() {
        // Iterate over the form controls and update userAnswers
        Object.keys(this.form.controls).forEach(key => {
          const questionId = parseInt(key.replace('question', ''), 10);
          const userResponse = this.form.get(key)?.value;
          const userAnswer = this.userAnswers.find(answer => answer.questionId === questionId);
    
          if (userAnswer) {
            userAnswer.userResponse = userResponse;
          }
        });
    
        // console.log(this.userAnswers+"checking the user answere");
        this.http.checkallanswer(this.userAnswers);
      }

    }

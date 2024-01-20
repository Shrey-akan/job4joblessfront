import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
    import {  Router } from '@angular/router';
    import { UserService } from 'src/app/auth/user.service';


    interface UserAnswer {
      questionId: string;
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
          this.userAnswers = data1.map((question: any) => ({
            questionId: question.id,
            userResponse: '' 
          }));
          this.data = data1;
          data1.forEach((question: any) => {
            this.form.addControl(`question${question.id}`, new FormControl(''));
          });
        }); 
      }
    
      submitAnswers() {
        Object.keys(this.form.controls).forEach(key => {
          // const questionId = parseInt(key.replace('question', ''), 10);
          // const userResponse = this.form.get(key)?.value;
          // const userAnswer = this.userAnswers.find(answer => answer.questionId === questionId);
  

        const questionId = key.replace('question', '');  // No need to parse if it's a string
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

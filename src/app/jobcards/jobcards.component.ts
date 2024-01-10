import { Component } from '@angular/core';

interface Job {
  jobtitle: string;
  companyforthisjob: string;
  numberofopening: string;
  locationjob: string;
  descriptiondata: string[];
  jobtype: string;
  schedulejob: string;
  payjob: string;
}

@Component({
  selector: 'app-jobcards',
  templateUrl: './jobcards.component.html',
  styleUrls: ['./jobcards.component.css']
})

export class JobcardsComponent {
  public job: Job = {
    jobtitle: "Software Developer",
    companyforthisjob: "Orage Technologies",
    numberofopening: "12",
    locationjob: "Noida, Uttar Pradesh",
    descriptiondata: ["meow", "sekiro"],
    jobtype: "Remote",
    schedulejob: "Day Shift",
    payjob: "25000 - 45000",
  }
}

import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {
  showDashboardButton!: boolean;
  uid: string | null;
  accessToken: string | null;
  showNavbar = true;
  constructor(private router: Router) {
    // Initialize properties from local storage
    this.accessToken = localStorage.getItem('accessToken');
    this.uid = localStorage.getItem('uid');

  }


  ngOnInit() {
    // Determine whether to show the "Dashboard User" button
   
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const currentRoute = event.urlAfterRedirects;

        // Check if the current route is 'employer'
        this.showNavbar = !['/employer','/login','/admin','/adminlogin','/dashboarduser/savedjob', '/employer/resetpasswordemployer','/employer/overcoming', '/dashboardemp/videocall', '/sign-in', '/employer/resetpass', '/admin/question', '/dashboardemp/notificationemp', "/dashboarduser/myjobs", "/admin/profile", "/employer/optverify", "/dashboardemp/updateempprofile", "/dashboarduser/updateprofile", "/dashboarduser/questionpaper", '/dashboardemp/applieduserdetails', '/employer/postjob', '/employer/advancesearch', '/employer/resources', '/employer/help-center', '/employer/products', '/dashboardemp/geinfoform', '/employer/empsign', '/employer/empregister', '/employer/findcv', '/seeker/firstpage', '/seeker/companiesseker', '/seeker/salaryseeker', '/seeker/messageseeker', '/seeker/notificationseeker', '/seeker/profileseeker', '/employers/findacv', '/employers/product', '/employers/resources', '/employers/helpcenter', '/employers/sign-in-emp', '/employers/findjobsemp', '/seeker/myjobsuser', '/seeker/setting', '/seeker/helpcenteruser', '/seeker/applyjob', '/seeker/kapply', '/employers/advancesearch', '/employers/sign-in-checkemp', '/employers/employerform', '/employerdashboard', '/employerdashboard/dashboardemployer', '/dashboarduser', '/admin', '/employerdashboard/addjobbasics', '/dashboarduser/findjobu', '/dashboarduser/company', '/dashboarduser/salary', '/dashboarduser/message', '/dashboarduser/settinguser', '/dashboarduser/resume', '/dashboarduser/notification', '/dashboarduser/userprofile', '/dashboarduser/applyjob', '/dashboardemp/profilemep', '/dashboardemp/alljobs', '/dashboardemp/empmessage', '/dashboardemp/postjob', '/dashboardemp', '/dashboarduser/userprofile', '/admin', '/admin/userdetails', '/admin/employerdetails', '/admin/jobprovided', '/admin/adminprofile', '/admin/enquirydetails', '/admin/notify'].includes(currentRoute);
        // Check if the current route is 'updateempprofile'
        if (currentRoute.startsWith('/dashboarduser/videocall/') || currentRoute.startsWith('/dashboardemp/updateempprofile/') || currentRoute.startsWith('/dashboardemp/updatejob/') || currentRoute.startsWith('/employer/checkotpemployer/') || currentRoute.startsWith('/admin/notify/') || currentRoute.startsWith('/dashboardemp/videocall/') || currentRoute.startsWith('/dashboardemp/empmessage/') || currentRoute.startsWith('/employer/optverify/') || currentRoute.startsWith('/dashboarduser/updateprofile/')) {
          this.showNavbar = false;
        }
      }
    });
    this.showDashboardButton = this.accessToken && this.uid ? true : false;
  }

}

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { CookieService } from 'ngx-cookie-service';
import { ApplyJob } from 'src/app/apply-job';
import { BehaviorSubject, Observable, catchError, throwError } from 'rxjs';
import {
  Auth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
} from '@angular/fire/auth';
import { AuthInterceptor } from '../interceptors/auth.interceptor';
import { JobPostService } from './job-post.service';

// Define your API base URL as a constant variable
const API_BASE_URL = 'https://job4jobless.com:9001/';
interface User {
  uid: Number;
  userName: String;
  userFirstName: String;
  userLastName: String;
  userPassword: String;
  companyuser: String;
  websiteuser: String;
  userphone: String;
  usercountry: String;
  userstate: String;
  usercity: String;
  profile: String;
}
interface Employer {
  empid: Number;
  empfname: String;
  emplname: String;
  empcompany: String;
  empmailid: String;
  emppass: String;
  empphone: String;
  empcountry: String;
  empstate: String;
  empcity: String;
  descriptionemp: String;
}

@Injectable({
  providedIn: 'root'
})
export class UserService {
  getUser() {
    throw new Error('Method not implemented.');
  }
  private jobTitleSource = new BehaviorSubject<string | null>(null);
  private companyNameSource = new BehaviorSubject<string | null>(null);
  private jobIdSource = new BehaviorSubject<string | null>(null);

  private empIdSource = new BehaviorSubject<string | null>(null);
  empId$ = this.empIdSource.asObservable();

  jobTitle$ = this.jobTitleSource.asObservable();
  jobId$ = this.jobIdSource.asObservable();
  companyName$ = this.companyNameSource.asObservable();

  setJobTitle(jobTitle: string) {
    this.jobTitleSource.next(jobTitle);
  }

  setEmpId(empId: string) {
    this.empIdSource.next(empId);
  }
  setJobId(jobId: string) {
    this.jobIdSource.next(jobId);
    // console.log("check the jobid",jobId);
  }

  setCompanyName(companyName: string) {
    this.companyNameSource.next(companyName);
  }

  contactformurl = `${API_BASE_URL}insertfrontform`;
  inserturlc = `${API_BASE_URL}insertusermail`;
  logincheckurl = `${API_BASE_URL}logincheck`;
  logincheckurlgmail = `${API_BASE_URL}logincheckgmail`;
  insertgmail = `${API_BASE_URL}createOrGetUser`;

  fetchuserurl = `${API_BASE_URL}fetchuser`;
  updateUserurl = `${API_BASE_URL}updateUser`;
  insertusermailurl = `${API_BASE_URL}insertusermailgog`;
  deleteuseraccount = `${API_BASE_URL}`;
  // Employer
  inserturle = `${API_BASE_URL}insertemployer`;
  inserturlemail = `${API_BASE_URL}insertemployeremail`;
  employercheckurl = `${API_BASE_URL}logincheckemp`;
  employerdetailsfetchurl = `${API_BASE_URL}fetchemployer`;
  employerupdateurl = `${API_BASE_URL}updateEmployee`;
  deleteemployeraccount = `${API_BASE_URL}`;
  logincheckurlgmailemp = `${API_BASE_URL}employerLoginCheck`;
  insertgmailemp = `${API_BASE_URL}createOrGetEmployer`;
  // Job Post
  inserturljobpost = `${API_BASE_URL}jobpostinsert`;
  fetchjobposturl = `${API_BASE_URL}fetchjobpost`;
  // Contact
  inserturlcontact = `${API_BASE_URL}insertcontact`;
  fetchcontactdetails = `${API_BASE_URL}fetchcontact`;
  // Apply Job
  inserturlapplyjob = `${API_BASE_URL}insertapplyjob`;
  fetchapplyjobform = `${API_BASE_URL}fetchapplyform`;
  // Notification
  notificationurl = `${API_BASE_URL}insertnotification`;
  fetchnotificationurl = `${API_BASE_URL}fetchnotify`;

  // Resume Builder
  insert_resumeurl = `${API_BASE_URL}resumeinsert`;
  // Fetch Question
  fetchquestionpaperurl = `${API_BASE_URL}fetchquestion`;
  // Check Answer URL
  checkalanswere = `${API_BASE_URL}checkallanswer`;
  constructor(private h1: HttpClient, private jobPostService: JobPostService, private router: Router, private auth: Auth, public cookie: CookieService) { }




  //Contact
  insertfrontform(formData: any) {
    return this.h1.post(this.contactformurl, formData);
  }


  //User 
  public insertusermail(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlc, data).subscribe({
      next: (resp: any) => {

        // console.log(resp);

        // console.log("Data inserted");
      },
      error: (err: any) => {
        // console.log(err, "get the error");
      }
    });
  }

  insertusermailgog(data: string) {

    // console.log("inside user google login");

    return this.h1.post(this.insertusermailurl, data).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        // console.log("data inserted");
      },
      error: (err: any) => {
        // console.log(err, "get the error");
      }
    })
  }
  deleteUser(uid: string): Observable<any> {
    const urldu = `${this.deleteuseraccount}deleteUser/${uid}`;
    return this.h1.delete(urldu);
  }


  fetchuser() {
    return this.h1.get(this.fetchuserurl).pipe(catchError(this.handleError));
  }


  checkUser(userName: string): Observable<any> {
    const url = `${API_BASE_URL}checkuser?userName=${userName}`;
    return this.h1.get(url);
  }


  //update user
  updateUser(data: any): Observable<any> {
    return this.h1.post(this.updateUserurl, data).pipe(
      catchError(this.handleEr)
    );
  }

  public logincheck(data: any) {
    // console.log("done");
    return this.h1.post(this.logincheckurl, data).subscribe({
      next: (resp: any) => {

        // console.log("Access Token Generated" + resp.accessToken);
        const mainres: User = resp;
        // console.log(`Login response from the server: ${mainres}`);

        // Store the access token and uid in cookies
        this.cookie.set('accessToken', resp.accessToken);
        this.cookie.set('uid', resp.uid);
        this.cookie.set('refreshToken', resp.refreshToken);
        // console.log("refresh token saved ", resp.refreshToken);
        // Inside your logincheckgmail function
        const accessToken = resp.accessToken; // Assuming this is where you get the access token
        AuthInterceptor.accessToken = accessToken;
        // Check if both accessToken and uid are present to determine authentication
        const isAuthenticated = resp.accessToken && resp.uid;

        if (isAuthenticated) {
          // console.log("Server responded with an object of the user");

          // Redirect to the dashboard if the response is true
          alert('Login Successful!');
          this.router.navigate(['/dashboarduser']);
        } else {
          // Handle other response statuses or errors
          alert('Incorrect Credentials!');
          this.router.navigate(['/login']);
        }
        // console.log("Data checked");
      },
      error: (err: any) => {
        // console.log(err);
        alert('Incorrect Credentials!');
        this.router.navigate(['/login']);
      }
    });
  }


  public logincheckgmail(userName: string) {
    const data = { userName }; // Wrap the username in an object

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.h1.post(this.logincheckurlgmail, data, { headers }).subscribe({
      next: (resp: any) => {

        // console.log(resp);
        // console.log("Access Token Generated" + resp.accessToken);
        const mainres: User = resp;
        // console.log(`Login response from the server: ${mainres}`);

        // Store the access token and uid in cookies
        this.cookie.set('accessToken', resp.accessToken);
        this.cookie.set('uid', resp.uid);
        this.cookie.set('refreshToken', resp.refreshToken);
        // console.log("Refresh token saved ", resp.refreshToken);
        // console.log('Response from server:', resp);
        // Inside your logincheckgmail function
        const accessToken = resp.accessToken; // Assuming this is where you get the access token
        AuthInterceptor.accessToken = accessToken;

        // Rest of your logincheckgmail function

        // Check if both accessToken and uid are present to determine authentication
        const isAuthenticated = resp.accessToken && resp.uid;
        // console.log("Checking the value of isAuthenticated", isAuthenticated);
        if (isAuthenticated) {
          // console.log("Server responded with an object of the user");

          // Redirect to the dashboard if the response is true
          alert('Login Successful!');
          this.router.navigate(['/dashboarduser']);
        } else {
          // Handle other response statuses or errors
          alert('Incorrect Credentials!');
          this.router.navigate(['/login']);
        }
        // console.log("Data checked");
      },
      error: (err: any) => {
        // console.log(err);
        alert('Incorrect Credentials!');
        this.router.navigate(['/login']);
      }
    });
  }



  fetchapplyformbyjobid(empid: string, jobid: string): Observable<any> {
    const url = `https://job4jobless.com:9001/fetchapplyformbyjobid?empid=${empid}&jobid=${jobid}`;
    return this.h1.get(url).pipe(
      catchError(error => {
        console.error('Error fetching apply form by job id:', error);
        return throwError('Failed to fetch apply form by job id');
      })
    );
  }
  // public createOrGetUser(userName: any) {
  //   const data = { userName }; // Wrap the username in an object

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   this.h1.post(this.insertgmail, userName, { headers }).subscribe({
  //     next: (resp: any) => {

  //       console.log("Access Token Generated" + resp.accessToken);
  //       const mainres: User = resp;
  //       console.log(`Login response from the server: ${mainres}`);

  //       // Store the access token and uid in cookies
  //       this.cookie.set('accessToken', resp.accessToken);
  //       this.cookie.set('uid', resp.uid);
  //       this.cookie.set('refreshToken', resp.refreshToken);
  //       console.log("refresh token saved ", resp.refreshToken);
  //       // Inside your logincheckgmail function
  //       const accessToken = resp.accessToken; // Assuming this is where you get the access token
  //       AuthInterceptor.accessToken = accessToken;
  //       // Check if both accessToken and uid are present to determine authentication
  //       const isAuthenticated = resp.accessToken && resp.uid;

  //       if (isAuthenticated) {
  //         console.log("Server responded with an object of the user");

  //         // Redirect to the dashboard if the response is true
  //         alert('Login Successful!');
  //         this.router.navigate(['/dashboarduser']);
  //       } else {
  //         // Handle other response statuses or errors
  //         alert('Incorrect Credentials!');
  //         this.router.navigate(['/login']);
  //       }
  //       console.log("Data checked");
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //       alert('Incorrect Credentials!');
  //       this.router.navigate(['/login']);
  //     }
  //   });
  // }

  createOrGetUser(userName: any,userFirstName:any) {
    const requestBody = { userName ,userFirstName };
    console.log(requestBody);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.h1
      .post<Map<string, Object>>('https://job4jobless.com:9001/createOrGetUser', requestBody, {
        headers,
        observe: 'response', // to access the full HTTP response, including headers
      })
      .subscribe(
        {
          next: (response: any) => {
            if (response.status === 200) {
              // API call was successful
              const responseBody = response.body;
              console.log('API Response:', responseBody);

              // You can access the data from the response as needed, e.g., responseBody.accessToken
              const accessToken = responseBody.accessToken;
              const uid = responseBody.uid;

              // Handle the response data here
              if (accessToken && uid) {
                // console.log("Access Token Generated" + accessToken);
                const mainres: User = response;
                // console.log(`Login response from the server: ${mainres}`);

                // Store the access token and uid in cookies
                this.cookie.set('accessToken', accessToken);
                this.cookie.set('uid', uid);
                this.cookie.set('refreshToken', responseBody.refreshToken);
                // console.log("refresh token saved ", responseBody.refreshToken);
                // Inside your logincheckgmail function

                AuthInterceptor.accessToken = accessToken;
                // Check if both accessToken and uid are present to determine authentication
                const isAuthenticated = accessToken && uid;
                // User data is available, do something with it
                if (isAuthenticated) {
                  // console.log("Server responded with an object of the user");

                  // Redirect to the dashboard if the response is true
                  alert('Login Successful!');
                  this.router.navigate(['/dashboarduser']);
                } else {
                  // Handle other response statuses or errors
                  alert('Incorrect Credentials!');
                  this.router.navigate(['/login']);
                }
              } else {
                // Handle the case when the API response does not contain the expected data
              }
            } else {
              // Handle non-200 status codes here (e.g., error responses)
            }
          },
          error: (error: any) => {
            // Handle HTTP error or client-side error here
            // console.error('API Error:', error);
          }
        }
      );
  }


  //Employer
  deleteEmployer(empid: string): Observable<any> {
    const urlde = `${this.deleteemployeraccount}deleteEmployer/${empid}`;
    return this.h1.delete(urlde);
  }


  checkEmployer(empmailid: string): Observable<any> {
    const url = `${API_BASE_URL}checkEmployer?empmailid=${empmailid}`;
    return this.h1.get(url);
  }

  //update employer data
  updateEmployee(data: any): Observable<any> {
    return this.h1.post(this.employerupdateurl, data).pipe(
      catchError(this.handleEr)
    );
  }
  private handleEr(error: HttpErrorResponse) {
    let errorMessage = 'An error occurred';
    if (error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    // console.error(errorMessage);
    return throwError(errorMessage);
  }


  logincheckemp(data: any) {
    // console.log(data);

    return this.h1.post(this.employercheckurl, data).subscribe({
      next: (resp: any) => {
        // console.log("Access Token Generated" + resp.accessToken);
        const mainres: Employer = resp;
        // console.log(`Login response from the server: ${mainres}`);
        this.cookie.set('emp', resp.empid);
        this.cookie.set('accessToken', resp.accessToken);
        this.cookie.set('refreshToken', resp.refreshToken);
        // console.log("Refresh token saved ", resp.refreshToken);
        // Inside your logincheckgmail function
        const accessToken = resp.accessToken; // Assuming this is where you get the access token
        AuthInterceptor.accessToken = accessToken;
        const isAuthenticated = resp.accessToken && resp.empid;

        if (isAuthenticated) {
          // console.log("Server responded with an object of employer");
          alert('Login Successful!');
          this.router.navigate(['/dashboardemp']);
        } else {
          alert('Incorrect Credentials!');
          this.router.navigate(['/employer']);
        }
      },
      error: (err: any) => {
        // console.log(err);
        alert('Incorrect Credentials!');
        this.router.navigate(['/employer']);
      }
    });
  }


  // createOrGetEmployer(empmailid: any) {
  //   const data = { empmailid };

  //   const headers = new HttpHeaders({
  //     'Content-Type': 'application/json'
  //   });

  //   this.h1.post(this.insertgmailemp, empmailid, { headers }).subscribe({
  //     next: (resp: any) => {

  //       console.log("Access Token Generated" + resp.accessToken);
  //       const mainres: Employer = resp;
  //       console.log(`Login response from server: ${mainres}`);
  //       this.cookie.set('emp', resp.empid);
  //       this.cookie.set('accessToken', resp.accessToken); // Store access token in a cookie
  //       this.cookie.set('refreshToken', resp.refreshToken);
  //       console.log("refresh token saved ", resp.refreshToken);
  //       // Inside your logincheckgmail function
  //       const accessToken = resp.accessToken; // Assuming this is where you get the access token
  //       AuthInterceptor.accessToken = accessToken;
  //       // Check if both accessToken and empid are present to determine authentication
  //       // Check if both accessToken and empid are present to determine authentication
  //       const isAuthenticated = resp.accessToken && resp.empid;

  //       if (isAuthenticated) {
  //         console.log("Server responded with an object of employer");

  //         // Redirect to the dashboard if the response is true
  //         alert('Login Successful!');
  //         this.router.navigate(['/dashboardemp']);
  //       } else {
  //         // Handle other response statuses or errors
  //         alert('Incorrect Credentials!');
  //         this.router.navigate(['/employer']);
  //       }
  //     },
  //     error: (err: any) => {
  //       console.log(err);
  //       alert('Incorrect Credentials!');
  //       this.router.navigate(['/employer']);
  //     }
  //   });
  // }
  createOrGetEmployer(empmailid: string , empfname:string) {
    const requestBody = { empmailid , empfname };
    console.log(requestBody);
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
    });

    this.h1
      .post<Map<string, Object>>('https://job4jobless.com:9001/createOrGetEmployer', requestBody, {
        headers,
        observe: 'response', // to access the full HTTP response, including headers
      })
      .subscribe(
        {
          next: (response: any) => {
            if (response.status === 200) {
              // API call was successful
              const responseBody = response.body;
              // console.log('API Response:', responseBody);
              // console.log("Response", response.accessToken);

              // You can access the data from the response as needed, e.g., responseBody.accessToken
              const accessToken = responseBody.accessToken;
              const empid = responseBody.empid;
              // console.log("AccessToken", accessToken);
              // console.log("empid", empid);
              // Handle the response data here
              if (accessToken && empid) {
                // console.log("Access Token Generated" + accessToken);
                const mainres: Employer = response;
                // console.log(`Login response from server: ${mainres}`);
                this.cookie.set('emp', empid);
                this.cookie.set('accessToken', accessToken);
                this.cookie.set('refreshToken', responseBody.refreshToken);
                // console.log('Refresh Token Saved:', responseBody.refreshToken);
                // Inside your logincheckgmail function

                AuthInterceptor.accessToken = accessToken;
                // Check if both accessToken and empid are present to determine authentication
                // Check if both accessToken and empid are present to determine authentication
                const isAuthenticated = accessToken && empid;
                if (isAuthenticated) {
                  // console.log("Server responded with an object of employer");

                  // Redirect to the dashboard if the response is true
                  alert('Login Successful!');
                  this.router.navigate(['/dashboardemp']);
                } else {
                  // Handle other response statuses or errors
                  alert('Incorrect Credentials!');
                  this.router.navigate(['/employer']);
                }
              } else {
                // Handle the case when the API response does not contain the expected data
              }
            } else {
              // Handle non-200 status codes here (e.g., error responses)
            }
          },
          error: (error: any) => {
            // Handle HTTP error or client-side error here
            // console.error('API Error:', error);
          }
        }
      );
  }

  employerLoginCheck(empmailid: string) {
    const data = { empmailid };

    const headers = new HttpHeaders({
      'Content-Type': 'application/json'
    });

    this.h1.post(this.logincheckurlgmailemp, data, { headers }).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        // console.log("Access Token Generated" + resp.accessToken);
        const mainres: Employer = resp;
        // console.log(`Login response from server: ${mainres}`);
        this.cookie.set('emp', resp.empid);
        this.cookie.set('accessToken', resp.accessToken); // Store access token in a cookie
        this.cookie.set('refreshToken', resp.refreshToken);
        // console.log("refresh token saved ", resp.refreshToken);
        // Inside your logincheckgmail function
        const accessToken = resp.accessToken; // Assuming this is where you get the access token
        AuthInterceptor.accessToken = accessToken;
        // Check if both accessToken and empid are present to determine authentication
        // Check if both accessToken and empid are present to determine authentication
        const isAuthenticated = resp.accessToken && resp.empid;

        if (isAuthenticated) {
          // console.log("Server responded with an object of employer");

          // Redirect to the dashboard if the response is true
          alert('Login Successful!');
          this.router.navigate(['/dashboardemp']);
        } else {
          // Handle other response statuses or errors
          alert('Incorrect Credentials!');
          this.router.navigate(['/employer']);
        }
      },
      error: (err: any) => {
        // console.log(err);
        alert('Incorrect Credentials!');
        this.router.navigate(['/employer']);
      }
    });
  }




  public insertemployer(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturle, data).subscribe({
      next: (resp: any) => {

        // console.log(resp);

        // console.log("Data inserted");
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }


  public insertemployeremail(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlemail, data).subscribe({
      next: (resp: any) => {
        // console.log("email is getting inserted");
        // console.log(resp);
        this.router.navigate(['/dashboardemp/profilemep']);

        // console.log("Data inserted mail");
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }


  fetchemployer() {
    return this.h1.get(this.employerdetailsfetchurl);
  }



  private handleError(error: any): Observable<never> {

    // console.error('An error occurred:', error);

    // Return an observable with an error message or perform other error handling tasks.
    return throwError('Something went wrong. Please try again later.');
  }

  //Job Post

  public jobpostinsert(data: any): Observable<any> {
    // console.log("Data sent to server:", data);
    // console.log("done and check the data is coming or not ", data);
    return this.h1.post(this.inserturljobpost, data, { responseType: 'text' });
  }



  fetchjobpost() {
    return this.h1.get(this.fetchjobposturl);
  }




  //Conatct
  public insertcontact(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlcontact, data).subscribe({
      next: (resp: any) => {

        // console.log(resp);

        // console.log("Data inserted");
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }

  fetchcontact() {
    return this.h1.get(this.fetchcontactdetails);
  }


  //Appply form data
  fetchapplyform() {
    return this.h1.get(this.fetchapplyjobform);
  }

  //update apply form by employer 
  updateProfileUpdate(application: ApplyJob): Observable<ApplyJob> {
    return this.h1.post<ApplyJob>(
      `${API_BASE_URL}updateProfileUpdate`,
      application
    );
  }
  //insert apply form data
  public insertapplyjob(data: any) {
    // console.log("done");
    return this.h1.post(this.inserturlapplyjob, data).subscribe({
      next: (resp: any) => {
        // console.log(resp);
        localStorage.removeItem('applyJobFormData');
        // console.log("Data inserted");
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }

  //insert notification
  public insertnotification(data: any) {
    // console.log("done");
    return this.h1.post(this.notificationurl, data).subscribe({
      next: (resp: any) => {
        // console.log(resp);

        // console.log("Data inserted");
        this.router.navigate(['/admin/dashboardadmin']);
      },
      error: (err: any) => {
        // console.log(err);
      }
    });
  }

  fetchnotify(): Observable<any[]> {
    return this.h1.get<any[]>(this.fetchnotificationurl);
  }


  //Insert Resume
  public resumeinsert(data: any): Observable<any> {
    // console.log(data);
    // console.log("done");

    return this.h1.post(this.insert_resumeurl, data);
  }




  //fetch question paper fetchquestionpaperurl
  fetchquestion() {
    return this.h1.get(this.fetchquestionpaperurl);
  }

  loginWithGoogle() {
    return signInWithPopup(this.auth, new GoogleAuthProvider());
  }

  logout() {
    return signOut(this.auth);
  }




  //   public checkallanswer(userAnswers: any[]) {

  //     const url = this.checkalanswere;

  //     return this.h1.post(url, userAnswers).subscribe({
  //       next: (resp: any) => {

  //         if (resp) {
  //           this.router.navigate(['/dashboarduser/applyjob']);
  //         }
  //         else{
  //           this.router.navigate(['/dashboarduser']);
  //         }

  //       },
  //       error: (err: any) => {

  //         this.router.navigate(['/dashboarduser/'])
  //       }
  //     });
  //   }

  public checkallanswer(userAnswers: any[]) {
    const url = this.checkalanswere;
  
    return this.h1.post(url, userAnswers).subscribe({
      next: (resp: any) => {
        if (resp) {
          // If response is true
          this.router.navigate(['/dashboarduser/applyjob']);
          // Show alert with success message
          alert('Answers checked successfully. You passed!');
        } else {
          // If response is false
          this.router.navigate(['/dashboarduser']);
          // Show alert with failure message
          alert('Answers checked. Unfortunately, you did not pass. Try again.');
        }
      },
      error: (err: any) => {
        // Handle error and navigate to the appropriate route
        console.error(err);
        this.router.navigate(['/dashboarduser/']);
        // Show alert with error message
        alert('Error checking answers. Please try again.');
      }
    });
  }
  
  updateJobStatus(jobId: string, data: any): Observable<any> {
    const url = `https://job4jobless.com:9001/updateJobStatus/${jobId}`;
    return this.h1.put(url, data);
  }
  
}

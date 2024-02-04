export class ApplyJob {
    juid: string;
    juname: string;
    jumail: string;
    jucompny: string;
    jutitle: string;
    juresume: string;
    jurelocation: string;
    jueducation: string;
    juexperience: string;
    juinterviewdate: string;
    jujobtitle: string;
    jucompanyname: string;
    description: string;
    juphone: number;
    julastsal: string;
    juexpecsalary: string;
    empid: string;
    uid: string;
    jobid:string;
    profileupdate: string;
    sendTime: Date | null;
    isOpen: boolean; // Add this property
    selectedOption: string; 
    userStatus: boolean;
    constructor() {
      this.juid = "";
      this.juname = "";
      this.jumail = "";
      this.jucompny = "";
      this.jutitle = "";
      this.juresume = "";
      this.jurelocation = "";
      this.jueducation = "";
      this.juexperience = "";
      this.juinterviewdate = "";
      this.jujobtitle = "";
      this.jucompanyname = "";
      this.description = "";
      this.juphone = 0;
      this.julastsal = "";
      this.juexpecsalary = "";
      this.empid = "";
      this.uid = "";
      this.jobid="";
      this.profileupdate = "";
      this.isOpen = false;
      this.selectedOption = "";
      this.sendTime = null;
      this.userStatus = false;
    }
  }
  
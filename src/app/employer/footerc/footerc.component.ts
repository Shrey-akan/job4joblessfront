import { Component } from '@angular/core';

@Component({
  selector: 'app-footerc',
  templateUrl: './footerc.component.html',
  styleUrls: ['./footerc.component.css']
})
export class FootercComponent {
  sendWhatsAppMessage() {
      // Replace '123456789' with the recipient's phone number
      const phoneNumber = '9958360795';
  
      // Replace 'Hello, how can I help you?' with your desired message
      
     
  const message = 'Hello, how can I help you?';

  // Construct the WhatsApp API URL

  const whatsappBaseUrl = 'https://api.whatsapp.com/send';
      
     
  const encodedMessage = encodeURIComponent(message);
      const whatsappUrl = `${whatsappBaseUrl}?phone=${phoneNumber}&text=${encodedMessage}`;
  
      // Redirect to WhatsApp
      window.location.href = whatsappUrl;
    }
}

import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';

declare var webkitSpeechRecognition: any;

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [CommonModule, FormsModule, IonicModule]
})
export class HomePage {
  userInput: string = '';
  messages: any[] = [];
  isRecording: boolean = false;
  recognition: any = null;

  constructor(private cdr: ChangeDetectorRef) {}

  sendMessage() {
    if (!this.userInput.trim()) return;

    const userText = this.userInput.trim();
    this.messages = [...this.messages, { role: 'user', content: userText }];
    this.userInput = '';

    fetch('http://127.0.0.1:8000/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ user_input: userText })
    })
    .then(async (res) => {
      if (!res.ok) throw new Error(`Server error: ${res.status}`);
      const data = await res.json();
      this.messages = [...this.messages, { role: 'assistant', content: data.reply }];
      this.cdr.detectChanges();
    })
    .catch((err) => {
      console.error('FETCH ERROR:', err);
      this.messages = [...this.messages, { role: 'assistant', content: 'Backend request failed' }];
      this.cdr.detectChanges();
    });
  }

  startVoiceInput() {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Speech recognition not supported. Use Chrome browser.');
      return;
    }

    this.recognition = new webkitSpeechRecognition();
    this.recognition.lang = 'en-US';
    this.recognition.continuous = false;
    this.recognition.interimResults = true;

    this.isRecording = true;
    this.recognition.start();

    this.recognition.onresult = (event: any) => {
      let transcript = '';
      for (let i = 0; i < event.results.length; i++) {
        transcript += event.results[i][0].transcript;
      }
      this.userInput = transcript;
      this.cdr.detectChanges();
    };

    this.recognition.onerror = (event: any) => {
      console.error('Speech error:', event.error);
      this.isRecording = false;
      this.cdr.detectChanges();
    };

    this.recognition.onend = () => {
      this.isRecording = false;
      this.cdr.detectChanges();
    };
  }

  confirmVoice() {
    if (this.recognition) {
      this.recognition.stop();
    }
    this.isRecording = false;
    this.sendMessage();
  }
}

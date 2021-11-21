import { Component } from '@angular/core';
import { AuthService } from '@myrmidon/cadmus-api';

@Component({
  selector: 'cadmus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public logged: boolean;

  constructor(authService: AuthService) {
    this.logged = authService.currentUserValue !== null;
  }
}

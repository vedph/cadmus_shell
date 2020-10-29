import { Component } from '@angular/core';
import {
  EnvService,
  HistoricalDate,
  HistoricalDateModel,
} from '@myrmidon/cadmus-core';
import { AuthService } from '@myrmidon/cadmus-api';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'cadmus-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent {
  public title: string;
  public logged: boolean;
  public date: HistoricalDateModel;
  public form: FormGroup;
  public hasDate: FormControl;

  constructor(
    formBuilder: FormBuilder,
    env: EnvService,
    authService: AuthService
  ) {
    this.hasDate = formBuilder.control(true);
    this.form = formBuilder.group({
      hasDate: this.hasDate,
    });

    this.title = env.name;
    this.logged = authService.currentUserValue !== null;
    this.date = HistoricalDate.parse('c. 1260 AD');
  }
}

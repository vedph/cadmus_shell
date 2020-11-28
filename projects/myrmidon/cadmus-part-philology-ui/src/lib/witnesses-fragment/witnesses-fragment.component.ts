import { Component, OnInit } from '@angular/core';
import { WitnessesFragment, Witness } from '../witnesses-fragment';
import { AuthService } from '@myrmidon/cadmus-api';
import {
  FormBuilder,
  FormControl,
  Validators,
  FormGroup,
} from '@angular/forms';
import { ModelEditorComponentBase } from '@myrmidon/cadmus-ui';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { deepCopy } from '@myrmidon/cadmus-core';

@Component({
  selector: 'cadmus-witnesses-fragment',
  templateUrl: './witnesses-fragment.component.html',
  styleUrls: ['./witnesses-fragment.component.css'],
  animations: [
    trigger('slideInOut', [
      state(
        'open',
        style({
          height: '100%',
        })
      ),
      state(
        'close',
        style({
          height: 0,
        })
      ),
      transition('open <=> closed', [animate('300ms ease-in')]),
    ]),
  ],
})
export class WitnessesFragmentComponent
  extends ModelEditorComponentBase<WitnessesFragment>
  implements OnInit {
  public currentWitnessOpen: boolean;
  public currentWitnessId: string;
  public editorOptions = {
    theme: 'vs-light',
    language: 'markdown',
    wordWrap: 'on',
    // https://github.com/atularen/ngx-monaco-editor/issues/19
    automaticLayout: true,
  };

  public witnesses: FormControl;
  // single witness form
  public id: FormControl;
  public citation: FormControl;
  public text: FormControl;
  public note: FormControl;
  public witness: FormGroup;

  constructor(authService: AuthService, formBuilder: FormBuilder) {
    super(authService);
    // form
    this.witnesses = formBuilder.control(null, Validators.required);
    this.form = formBuilder.group({
      witnesses: this.witnesses,
    });

    // single witness form
    this.id = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.citation = formBuilder.control(null, [
      Validators.required,
      Validators.maxLength(50),
    ]);
    this.text = formBuilder.control(null, Validators.required);
    this.note = formBuilder.control(null);
    this.witness = formBuilder.group({
      id: this.id,
      citation: this.citation,
      text: this.text,
      note: this.note,
    });
  }

  ngOnInit(): void {
    this.initEditor();
  }

  public deleteWitness(index: number): void {
    const witnesses = [...(this.witnesses.value || [])];
    witnesses.splice(index, 1);
    this.witnesses.setValue(witnesses);
  }

  public moveWitnessUp(index: number): void {
    const witnesses = [...(this.witnesses.value || [])];
    const w = witnesses[index];
    witnesses.splice(index, 1);
    witnesses.splice(index - 1, 0, w);
    this.witnesses.setValue(witnesses);
  }

  public moveWitnessDown(index: number): void {
    const witnesses = [...(this.witnesses.value || [])];
    const w = witnesses[index];
    witnesses.splice(index, 1);
    witnesses.splice(index + 1, 0, w);
    this.witnesses.setValue(witnesses);
  }

  public openCurrentWitness(witness: Witness): void {
    if (!witness) {
      this.currentWitnessId = null;
      this.witness.reset();
    } else {
      this.currentWitnessId = witness.id;
      this.id.setValue(witness.id);
      this.citation.setValue(witness.citation);
      this.text.setValue(witness.text);
      this.note.setValue(witness.note);
      this.witness.markAsPristine();
    }
    this.currentWitnessOpen = true;
    this.witness.enable();
  }

  public closeCurrentWitness(): void {
    this.currentWitnessOpen = false;
    this.currentWitnessId = null;
    this.witness.disable();
  }

  public saveCurrentWitness(): void {
    if (!this.currentWitnessOpen || this.witness.invalid) {
      return;
    }
    const newWitness: Witness = {
      id: this.trimIfAny(this.id.value, true),
      citation: this.trimIfAny(this.citation.value, true),
      text: this.trimIfAny(this.text.value),
      note: this.trimIfAny(this.note.value),
    };
    const witnesses: Witness[] = [...(this.witnesses.value || [])];
    const i = witnesses.findIndex((w) => {
      return w.id === newWitness.id && w.citation === newWitness.citation;
    });
    if (i === -1) {
      witnesses.push(newWitness);
    } else {
      witnesses.splice(i, 1, newWitness);
    }
    this.witnesses.setValue(witnesses);

    this.closeCurrentWitness();
  }

  private updateForm(model: WitnessesFragment): void {
    if (!model) {
      this.form.reset();
      return;
    }
    this.witnesses.setValue(model.witnesses || []);
    this.witness.reset();
    this.form.markAsPristine();
  }

  protected onModelSet(model: WitnessesFragment): void {
    this.updateForm(deepCopy(model));
  }

  protected getModelFromForm(): WitnessesFragment {
    return {
      location: this.model?.location ?? '',
      witnesses: this.witnesses.value,
    };
  }
}

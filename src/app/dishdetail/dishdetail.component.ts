import { Component, OnInit, ViewChild } from '@angular/core';
import { Dish } from '../shared/dish';
import { DishService } from '../services/dish.service';
import { Params, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { switchMap } from 'rxjs/operators';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Comment } from '../shared/comment';
import {baseURL} from '../shared/baseurl';
import {expand, flyInOut, visibility} from '../animations/app.animation';

@Component({
  selector: 'app-dishdetail',
  templateUrl: './dishdetail.component.html',
  styleUrls: ['./dishdetail.component.scss'],
  host: {
    '[@flyInOut]': 'true',
    'style': 'display: block;'
  },
  animations: [ flyInOut(), visibility(), expand() ]
})

export class DishdetailComponent implements OnInit {
  @ViewChild('fform') commentFormDirective;
  comment: Comment;
  commentForm: FormGroup;
  dishIds: string[];
  prev: string;
  next: string;
  dish: Dish;
  dishcopy: Dish;
  errMess: string;
  BaseURL = baseURL;
  visibility = 'shown';
  formErrors = {
    'author': '',
    'rating': '',
    'comment': ''
  };
  validationMessages = {
    'author': {
      'required':      'Name is required.',
      'minlength':     'Name must be at least 2 characters long.'
    },
    'comment': {
      'required':      'Comment is required.'
    },
  };
  constructor(private dishService: DishService,
              private route: ActivatedRoute,
              private location: Location,
              private fb: FormBuilder) {
    this.createForm();
  }

  ngOnInit() {
    this.dishService.getDishIds().subscribe(dishIds => this.dishIds = dishIds );
    this.route.params
      .pipe(switchMap((params: Params) => { this.visibility = 'hidden'; return this.dishService.getDish(params['id']); }))
      .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); this.visibility = 'shown'; },
        errmess => this.errMess = <any>errmess );
    // this.route.params.pipe(switchMap((params: Params) => this.dishService.getDish(params['id'])))
    //   .subscribe(dish => { this.dish = dish; this.dishcopy = dish; this.setPrevNext(dish.id); }, errmess => this.errMess = <any>errmess);
  }
  createForm(): void {
    this.commentForm = this.fb.group({
      author: ['', [Validators.required, Validators.minLength(2)]],
      rating: [5, []],
      comment: ['', [Validators.required]],
    });
    this.commentForm.valueChanges
      .subscribe(data => this.onValueChanged(data));
    this.onValueChanged();
  }

  onValueChanged(data?: any) {
    if (!this.commentForm) { return; }
    const form = this.commentForm;
    for (const field in this.formErrors) {
      if (this.formErrors.hasOwnProperty(field)) {
        // clear previous error message (if any)
        this.formErrors[field] = '';
        const control = form.get(field);
        if (control && control.dirty && !control.valid) {
          const messages = this.validationMessages[field];
          for (const key in control.errors) {
            if (control.errors.hasOwnProperty(key)) {
              this.formErrors[field] += messages[key] + ' ';
            }
          }
        }
      }
    }
  }

  setPrevNext(dishId: string) {
    const index = this.dishIds.indexOf(dishId);
    this.prev = this.dishIds[(this.dishIds.length + index - 1 ) % this.dishIds.length ];
    this.next = this.dishIds[(this.dishIds.length + index + 1 ) % this.dishIds.length ];
  }
  goBack(): void {
    this.location.back();
  }
  onSubmit() {
   this.comment = this.commentForm.value;
   this.comment.date = new Date().toISOString();
   // this.dish.comments.push(this.comment);
   this.dishcopy.comments.push(this.comment);
   console.log(this.dishcopy);
   this.dishService.putDish(this.dishcopy).subscribe(dish => {this.dish = dish ; this.dishcopy = dish; } ,
     errmess => { this.dish = null; this.dishcopy = null; this.errMess = <any>errmess; });
   this.commentFormDirective.resetForm();
   this.commentForm.reset({
     author: '',
     rating: 5,
     comment: ''
   });
  }
}

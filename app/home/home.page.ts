import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { HomeService } from './home.service';



@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
})
export class HomePage implements OnInit {
 form!:FormGroup;
 array:any[] =[];

  constructor(private home:HomeService, private loadingCtrl:LoadingController,
    private router:Router) { }
  ngOnInit() {
    this.home.nSubject.subscribe((value)=> {
      console.log(value,"vvvv");
      
      this.array.push(value);
    })
    this.form = new FormGroup({
      sino:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      dayy:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
     
      activities:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
      timer:new FormControl(null,{
        updateOn:'blur',
        validators:[Validators.required]
      }),
    });
  }
  onCreate(){
    if(!this.form.valid){
      return;
    }
    this.loadingCtrl
    .create({
      message:'Adding...'
    })
    .then(loadingCtrl=>{
      this.home
      .AddItem(
        this.form.value.sino,
        this.form.value.dayy,
        this.form.value.activities,
        this.form.value.timer,
      
    ).subscribe(()=>{
      loadingCtrl.dismiss();
      this.form.reset()
      this.router.navigate(['/details']);
    });

    });
  }
    }
 


import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { listtodo } from '../home/home.model';
import { HomeService } from '../home/home.service';


@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {
  items!:listtodo;
  form!:FormGroup;
isloading:boolean = true;
private itemSub!:Subscription;
itemId:any;
  constructor(private route:ActivatedRoute,
    private home:HomeService,
    private navCtrl:NavController,
    private router:Router,
    private LoadingCtrl:LoadingController,
    private alertCtrl:AlertController,) { }

  ngOnInit() {
    
    this.isloading = true;
    this.route.paramMap.subscribe(paramMap =>{
      if(!paramMap.has('id')){
        this.navCtrl.navigateBack('/details');
        return;
      }
      this.itemId = paramMap.get('id');
      this.itemSub = this.home
      .getItem(this.itemId)
      .subscribe(
        item =>{
          this.items = item;
          const dayy = this.items.dayy;
          const activities = this.items.activities;
          const timer = this.items.timer;
          this.form = new FormGroup({
            dayy:new FormControl(dayy,{
              updateOn:'blur',
              validators:[Validators.required]
            }),

            activities:new FormControl(activities,{
              updateOn:'blur',
              validators:[Validators.required]
            }),

            timer:new FormControl(timer,{
              updateOn:'blur',
              validators:[Validators.required]
            }),
          });
          this.isloading = false;
        },
        error =>{
          this.alertCtrl
          .create({
            header:'an error occured',
            message:'It cannot be fetched. Please try again later',
            buttons:[
              {
                text:'ok',
                handler:()=>{
                  this.router.navigate(['/details']);
                }
              }
            ]
          })
          .then(alertEl =>{
            alertEl.present();
            this.home
          });
        }
      );
    });
  }

onUpdateItem(){
  if(!this.form.valid){
    return;
  }
  this.LoadingCtrl
  .create({
    message:'updating item....'
  })
  .then(loadingEl =>{
    loadingEl.present();
    this.home
    .updateItem(
      this.items.id,
      this.form.value.dayy,
      this.form.value.activities,
      this.form.value.timer,
    )
    .subscribe(()=>{
      loadingEl.dismiss();
      this.form.reset();
      this.router.navigate(['/details']);
    });
  });
}
}

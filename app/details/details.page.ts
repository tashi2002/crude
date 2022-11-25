import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { listtodo } from '../home/home.model';
import { HomeService } from '../home/home.service';


@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
})
export class DetailsPage implements OnInit {
items:listtodo[ ]=[];
private itemSub!:Subscription;
  constructor(private home:HomeService, private router:Router,
    private loadingCtrl:LoadingController) { }

  ngOnInit() {
    this.itemSub = this.home.items.subscribe(items =>{
      this.items = items;
    })
    this.home.fetchitem().subscribe(()=>{
    
    })
  }
  onEdit(Id:string){
    this.router.navigate(['/edit', Id])
    }
    
    delete(id:any){
      this.loadingCtrl.create({message:'removing.....'})
      .then(loadingEl =>{
        loadingEl.present();
        this.home.remove(id).subscribe(()=>{
          loadingEl.dismiss();
        });
      })
}

}

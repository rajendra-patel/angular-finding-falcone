export class Vehicle{
    id:number;
    name:string;
    totalNumber:number;
    maxDistance:number;
    speed:number;

    constructor(){}
    setData(id:number,name:string,totalNumber:number,maxDistance:number,speed:number){
        this.id=id;
        this.name=name;
        this.totalNumber=totalNumber;
        this.maxDistance=maxDistance;
        this.speed=speed;
    }

    setVehicle(vehicle: Vehicle){
        this.id=vehicle.id;
        this.name=vehicle.name;
        this.totalNumber=vehicle.totalNumber;
        this.maxDistance=vehicle.maxDistance;
        this.speed=vehicle.speed;
    }

    toString(){
        return this.id+" "+this.name+" "+this.totalNumber;
    }
};
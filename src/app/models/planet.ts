export class Planet{
    id:number;
    name:string;
    distance:number;

    constructor() {}
    setData(id, name, distance){
        this.id = id;
        this.name = name;
        this.distance = distance;
    }
    setPlanet(planet: Planet){
        this.id=planet.id;
        this.name=planet.name;
        this.distance=planet.distance;
    }

    toString(){
        return this.id+" "+this.name;
    }
};
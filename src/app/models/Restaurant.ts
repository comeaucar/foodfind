import Address from './Address';
export default class Restaurant {
  id: string;
  name: string;
  address: Address;
  description: string;
    tags: [string];
    ratings = []
  constructor(id, name, add, desc, tags, ratings?:any) {
    this.id = id;
    this.name = name;
    this.address = add;
    this.description = desc;
    this.tags = tags;
    if (this.ratings) {
      this.ratings = ratings
    } else {
      this.ratings = []
    }
  }

  

  addRating(rating:number) {
    this.ratings.push(rating)
  }
}

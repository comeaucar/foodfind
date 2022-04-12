import Address from './Address';
export default class Restaurant {
  id: string;
  name: string;
  address: Address;
  description: string;
    tags: [string];
    ratings: [number]
  constructor(id, name, add, desc, tags) {
    this.id = id;
    this.name = name;
    this.address = add;
    this.description = desc;
      this.tags = tags;
  }

  addRating(rating:number) {
    this.ratings.push(rating)
  }
}

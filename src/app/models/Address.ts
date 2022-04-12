export default class Address {
  street: string;
  postal_code: string;
  city: string;
  constructor(st, postal, city) {
    this.street = st;
    this.postal_code = postal;
    this.city = city;
  }
}

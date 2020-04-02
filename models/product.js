
class ProductModel {

  constructor(options = false) {

    this.Name = ""
    this.Price = ""
    this.Link = ""
    this.Store = ""
    this.State = ""

    Object.assign(this, options);
  }
}

module.exports.ProductModel = ProductModel
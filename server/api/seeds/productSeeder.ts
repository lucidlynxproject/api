import { Product, IProductModel } from "../models/product";
import { faker } from "@faker-js/faker";
export class ProductSeeder {
    constructor() {
        this.seed();
    }
    async seed(): Promise<IProductModel[]> {
        await Product.deleteMany({},()=>{
            console.log("Products collection removed");
        }).catch(err=>{
            console.log("there is an error trying to delete products: "+ err);
        })

        let products = [];
        for (let i = 0; i < 100; i++) {
            let productName = [
                "Firgas agua mineral con gas 1 l",
                "Fonter agua mineral natural con gas pet 1 l",
                "Hiperdino agua con gas 0,5 l",
            ]
            let category= "Agua sin gas";
        let product = new Product({
            id_product: i+100,
            name: productName[Math.floor(Math.random() * productName.length)],
            category:category,
            price: faker.commerce.price(0.5,1.5),
        });
        products.push(product);
        }
        await Product.insertMany(products).then(()=>{
            console.log("Products collection seeded");
        }).catch(err=>{
            console.log("there is an error trying to insert products: "+err);
        })
        return products;
    }
}
import SectionModel from "../models/section";
import ProductModel from "../models/product";
import ProductChanges from "../models/product_changes";
import axios from "axios";
import cheerio from "cheerio";
import { Category } from "../../types/interfaces/category.interface";
import { Section } from "../../types/interfaces/section.interface";
import { Product } from "../../types/interfaces/product.interface";
import { Product_Changes } from "../../types/interfaces/product_changes.interface";
const sections = async () =>
  await SectionModel.getAllPopulated({}, "", {}, ["category"]).then(
    (sections) => {
      return sections;
    }
  );
 async function dailyScrapper():Promise<any> {
    let products: Product[] = [];
    let productsChanges: Product_Changes[] = [];
  sections().then(async (sections: Section[]) => {
    sections.forEach(async (section: Section) => {
      section.category!.forEach(async (category: Category) => {

        axios.get(category.link).then(async (response) => {
          const htmlData = response.data;
          const $ = cheerio.load(htmlData);

          let dataJson: any = [];
          await $(".action-container").map(function () {
            let data = $(this).attr("data-all");
            data!.concat(",");
            data!.substring(0, data!.length - 1);
            dataJson.push(JSON.parse(data!));
          });
          dataJson.forEach(async (data: any) => {
            if(data.id){
             ProductModel.getOne({ barcode: data.id }).then(
              (product: any) => {
                console.log(product)

                if (!product) {
                  products.push({
                    name: data.name,
                    section: section._id || "",
                    category: category._id || "",
                    product_changes: [],
                    barcode: data.id,
                  });
                } else {
                    let price = data.final_price
                    if(price.includes("/kg")){
                        price = price.replace("/kg", "")
                    }

                  productsChanges.push({
                    name: data.name,
                    price: price.replace("€", "").replace(",", "."),
                    date: new Date(),
                    product: product._id,
                  });
                }
              }
            );
            }
          });
        });
      });
    });
  });
  return new Promise( (resolve, reject) => {
    setTimeout(() => {
        resolve({products,productsChanges})
        }, 10000);
    })
}
export default async function saveProducts() {
    const products =  dailyScrapper().then( (products) => {
     ProductModel.createMany(products.products);
    ProductChanges.createMany(products.productsChanges);
    });

}
import SectionModel from "../models/section";
import ProductModel from "../models/product";
import ProductChanges from "../models/product_changes";
import axios from "axios";
import cheerio from "cheerio";
import { Category } from "../../types/interfaces/category.interface";
import { Section } from "../../types/interfaces/section.interface";
import { Product } from "../../types/interfaces/product.interface";
import { Product_Changes } from "../../types/interfaces/product_changes.interface";
let sectionsArray:Section[]=[];
const sections = async () =>
  await SectionModel.getAllPopulated({}, "", {}, ["category"]).then(
    (sections) => {
        sectionsArray= sections;
    }
  ).catch((err)=>console.log(err));
const gen = function* dailyScrapperGenerator() {
    for (let section of sectionsArray) {
        yield section;
    }
}
export default function startScrapper(){

           let interval= setInterval(() => {
                if(gen().next().done){
                  clearInterval(interval)

                } else {
                  let data = gen().next().value
                    dailyScrapper(data).then((data)=>
                    {
                            ProductModel.createMany(data.products);
                           ProductChanges.createMany(data.productsChanges).then((product_changes:any)=>{
                            product_changes.forEach((item:Product_Changes)=>{
                                ProductModel.update(item.product,{$push: {product_changes:item._id}});
                            })
                           });

                        })
                }
            }, 15000)


}
 async function dailyScrapper(section:any):Promise<any> {
    let products: Product[] = [];
    let productsChanges: Product_Changes[] = [];

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
                    date: new Date().toLocaleDateString('pt-PT'),
                    product: product._id,
                  });
                }
              }
            ).catch((err)=>console.log(err));
            }
          });
    });
  });
  return new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve({products,productsChanges});
    }, 5000);
    });

}
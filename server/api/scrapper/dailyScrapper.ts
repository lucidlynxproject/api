import SectionModel from "../models/section";
import ProductModel from "../models/product";
import ProductChanges from "../models/product_changes";
import axios from "axios";
import cheerio from "cheerio";
import { Category } from "../../types/interfaces/category.interface";

export default function startScrapper() {
  SectionModel.getAllPopulated({}, "", {}, ["category"])
    .then((sections) => {
      let c = 0;
      sections.forEach(async (section, i) => {
        let set = setTimeout(() => {

          console.log(section.name);
          if(section.name!=="Alimentación"){
          dailyScrapper(section);
          }
          console.log("Scrapper finished" );

          c++;
          if (c ==sections.length-1) {
            clearInterval(set);
          }
        }, i*5000);
      });
    })
    .catch((err) => console.log(err));
}
async function dailyScrapper(section: any) {
  section.category!.forEach(async (category: Category) => {
  await  axios.get(category.link).then((response) => {
      const htmlData = response.data;
      const $ = cheerio.load(htmlData);
      $(".action-container").map(async function () {
        let data = $(this).attr("data-all");
        data!.concat(",");
        data!.substring(0, data!.length - 1);
        let dataJson = JSON.parse(data!);
        if (dataJson.id) {
          await ProductModel.getOne({ barcode: dataJson.id })
            .then(async (product: any) => {
              if (!product) {
                await ProductModel.create({
                  name: dataJson.name,
                  section: section._id || "",
                  category: category._id || "",
                  product_changes: [],
                  barcode: dataJson.id,
                });
              } else {
                
                let price = dataJson.final_price;
                if (price.includes("/kg")) {
                  price = price.replace("/kg", "");
                }
                await ProductChanges.create({
                  name: dataJson.name,
                  price: price.replace("€", "").replace(",", "."),
                  date: new Date().toLocaleDateString('pt-PT'),
                  product: product._id,
                }).then(async (productChanges) => {
                  product.product_changes.push(productChanges._id);
                  await product.save();
                });
              }
            })
            .catch((err) => console.log(err));
        }
      });
    });
  });
}

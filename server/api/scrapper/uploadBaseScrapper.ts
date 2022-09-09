import cheerio from "cheerio";
import mongoose from "mongoose";
import { Product } from "../models/product";
import { Supermarket } from "../models/supermarket";
import { Section } from "../models/section";
import { Category } from "../models/category";
import axios from "axios";
type section = 
    {
      name: string,
      categories: [{
        name:string,
        link:string
      }],
    }
  
const supermarketUrl = process.env.supermarket || "https://www.carrefour.es";
export default class BaseScrapper {
  constructor() {

  }
  public async uploadBaseScrapper() {
    await axios(supermarketUrl).then((response) => {
      const htmlData = response.data;
      const $ = cheerio.load(htmlData);
      let section:section[];

      
      $(".category-group--container").each(function (i) {

        let section1: {name:string, categories: { name: string; link: string; }[]; }= {
          name: "",
          categories: []
        };
        section1.name = $(this)
          .children(".category-group__header")
          .children(".category-group__header--container")
          .children(".menu__text")
          .text();
          let categoriesIterator = $(this)
          .children(".category-group__content")
          .children(".category__list")
          .children(".sidebar-item--wrapper")
          .children(".link--wrapper");
            categoriesIterator.each(function (j,e) {
                section1.categories[j] = {
                    name: $(e).text().trim(),
                    link: $(e).attr("href")!.trim(),
                }
                console.log(section1)
                })
                
      });
    });
  }
}

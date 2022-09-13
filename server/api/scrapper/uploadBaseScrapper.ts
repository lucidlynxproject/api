import cheerio from "cheerio";
import SectionModel from "../models/section";
import { Section } from "../../types/interfaces/section.interface";
import CategoryModel from "../models/category";
import axios from "axios";

const SUPERMARKET_URL = process.env.supermarket || "https://www.hiperdino.es";

export abstract class BaseScrapper {
  public static async uploadBaseScrapper() {
    await axios(SUPERMARKET_URL)
      .then((response) => {
        const htmlData = response.data;
        const $ = cheerio.load(htmlData);
        let section = [] as any;

        $(".category-group--container").each(function (i) {
          let section1: {
            name: string;
            categories: { name: string; link: string; section: string }[];
          } = {
            name: "",
            categories: [],
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
          categoriesIterator.each(function (j, e) {
            section1.categories[j] = {
              name: $(e).text().trim(),
              link: $(e).attr("href")!.trim(),
              section: section1.name,
            };
          });
          section.push(section1);
        });
        this.uploadSectionAndCategories(section);
      })
      .catch((err) => console.log(err));
  }
  private static async uploadSectionAndCategories(sections: any) {
    sections.forEach(async (item: any) => {
      await SectionModel.create({
        name: item.name,
      })
        .then(async (section: Section) => {
          item.categories.forEach(async (category: any) => {
            await CategoryModel.create({
              name: category.name,
              link: category.link,
              section: section._id,
            })
              .then(async (c) => {
                await SectionModel.update(section._id || "", {
                  $push: { category: c._id },
                });
              })
              .catch((err) => console.log(err));
          });
        })
        .catch((err) => console.log(err));
    });
  }
}

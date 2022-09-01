import { UrlQuery } from '../types/mongoose/url-query';

const DEFAULT_PAGE_SIZE = 10;
const DEFAULT_ORDER = 1;
class QueryParserService {
    getFilters(
        query: UrlQuery,
    ):
        | { email: unknown; $and?: undefined }
        | { email?: undefined; $and?: undefined }
        | { $and: { [key: string]: any }[]; email: unknown }
        | { $and: { [key: string]: any }[]; email?: undefined } {
        const { email, ...queries } = query;
        const filtersArray = this.getFiltersArray(queries);
        if (!filtersArray || filtersArray.length === 0) {
            if (email) {
                return { email };
            }
            return {};
        }

        if (email) {
            return { $and: filtersArray, email };
        }
        return { $and: filtersArray };
    }

    private getFiltersArray(query: UrlQuery): { [key: string]: any }[] {
        return Object.entries(query).reduce((filterQuery, [key, value]) => {
            if (key.startsWith('_')) {
                return filterQuery;
            }
            return [...filterQuery, this.getFilterQuery(key, value as string)];
        }, [] as { [key: string]: any }[]);
    }

    private getFilterQuery(key: string, value: string): Record<string, unknown> {
        const [keyName, operator] = key.split('_');
        switch (operator) {
            case 'like':
                return { [keyName]: { $regex: value, $options: 'i' } };
            case 'in':
                return { [keyName]: { [`$in`]: value.split(',') } };
            case undefined:
                return { [keyName]: { [`$eq`]: this.parseValue(value) } };
            default:
                return {
                    [keyName]: { [`$${operator}`]: this.parseValue(value) },
                };
        }
    }

    private parseValue(value: string): string | boolean | number | null {
        if (value === 'true') {
            return true;
        }
        if (value === 'false') {
            return false;
        }
        if (/^\d+$/.test(value)) {
            return parseFloat(value);
        }
        if (value === 'null') {
            return null;
        }

        return value;
    }

    getProjection(query: UrlQuery): string {
        const { _show } = query;
        if (!_show) {
            return '';
        }
        if (Array.isArray(_show)) {
            return _show.join(' ');
        }
        return _show.split(',').join(' ');
    }

    getOptions(query: UrlQuery): {
        sort?: { [x: string]: number } | undefined;
        limit?: number | undefined;
        skip?: number | undefined;
    } {
        const { _limit, _page, _sort, _order } = query;
        return {
            ...(_page && {
                skip: parseInt(_page) * (_limit ? parseInt(_limit) : DEFAULT_PAGE_SIZE),
            }),
            ...(_limit && { limit: parseInt(_limit) }),
            ...(_sort && {
                sort: { [_sort]: _order ? parseInt(_order) : DEFAULT_ORDER },
            }),
        };
    }

    getPopulationOptions(query: UrlQuery): string[] | Record<string, string>[] {
        const { _embed } = query;
        if (!_embed) {
            return [];
        }
        if (Array.isArray(_embed)) {
            return _embed.map(path => this.getPopulateOptionPathsObjFromField(path));
        }
        const populationOption = _embed.split(',');
        return populationOption.map(field => this.getPopulateOptionPathsObjFromField(field));
    }

    private getPopulateOptionPathsObjFromField(field: string): { [key: string]: any } {
        const subFieldStartPos = field.indexOf(':');
        if (subFieldStartPos === -1) {
            return { path: field };
        }

        const mainPath = field.slice(0, subFieldStartPos);
        const subPath = field.slice(subFieldStartPos + 1);
        return {
            path: mainPath,
            populate: this.getPopulateOptionPathsObjFromField(subPath),
        };
    }
}
const queryParser = new QueryParserService();
export default queryParser;

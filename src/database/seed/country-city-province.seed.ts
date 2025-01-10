import { Injectable } from '@nestjs/common';
import { HelperFunctions } from 'src/common/util/helper-functions';
import { City } from 'src/entities/city.entity';
import { Country } from 'src/entities/country.entity';
import { Province } from 'src/entities/province.entity';
import { CreateCountryModel } from 'src/models/country.model';
import { CityService } from 'src/modules/city/city.service';
import { CountryService } from 'src/modules/country/country.service';
import { ProvinceService } from 'src/modules/province/province.service';
import { FindOptionsWhere } from 'typeorm';

@Injectable()
export class CountryProvinceCitySeeder {
  private countrySet = new Set();
  private provinceCountrySet = new Set();
  private cityProvinceCountrySet = new Set();
  constructor(
    private readonly helperFunctions: HelperFunctions,
    private readonly cityService: CityService,
    private readonly countryService: CountryService,
    private readonly provinceService: ProvinceService,
  ) {}

  async populateWorldData() {
    const worldData = await this.readWorldCsv();
    if (this.parseWorldData(worldData)) {
      try {
        // await this.populateCountryTL();
        // await this.populateProvinceTL();
        await this.populateCitiesTL();
        console.log('populated');
      } catch (error) {
        console.log(error);
      }
    }
  }
  async readWorldCsv() {
    const filePath = `${process.cwd()}/worldcities.csv`;
    const worldData = await this.helperFunctions.parseCsv(filePath);
    return worldData;
  }
  parseWorldData(worldData: any[]) {
    worldData.map((row) => {
      const country = this.helperFunctions.transformAscii(row.country);
      const province = this.helperFunctions.transformAscii(row.admin_name);
      const city = row.city_ascii;
      const provinceCountry = {
        province,
        country,
      };
      const cityProvinceCountry = {
        city,
        ...provinceCountry,
      };
      if (!this.countrySet.has(country)) {
        this.countrySet.add(country);
      }
      if (!this.provinceCountrySet.has(provinceCountry)) {
        this.provinceCountrySet.add(provinceCountry);
      }
      if (!this.cityProvinceCountrySet.has(cityProvinceCountry)) {
        this.cityProvinceCountrySet.add(cityProvinceCountry);
      }
    });
    return true;
  }
  async populateCountryTL() {
    if (this.countrySet.size) {
      return Promise.all(
        [...this.countrySet].map(async (country: string) => {
          const filterCondition: FindOptionsWhere<Country> = { name: country };
          const ifCountry = await this.countryService.findByCondition(
            filterCondition,
          );
          if (!ifCountry) {
            const createCountryModel: CreateCountryModel = {
              name: country,
            };
            return this.countryService.create(createCountryModel);
          }
          return;
        }),
      );
    }
    return;
  }
  async populateProvinceTL() {
    if (this.provinceCountrySet.size) {
      const provinceCountryArray = [...this.provinceCountrySet];
      let provinceCountry: any;
      for (provinceCountry of provinceCountryArray) {
        const { province, country } = provinceCountry;
        const isCountryExistAndHasData =
          await this.countryService.findByCondition({
            name: country,
          });
        if (isCountryExistAndHasData) {
          const countryData = isCountryExistAndHasData;
          const isProvinceExistAndHasData = await this.findProvinceCountry(
            province,
            countryData.id,
          );
          if (!isProvinceExistAndHasData) {
            await this.provinceService.create({
              name: province,
              country: countryData,
            });
          }
        }
      }
    }
    return;
  }
  async populateCitiesTL() {
    if (this.cityProvinceCountrySet.size) {
      const cityProvinceCountryArray = [...this.cityProvinceCountrySet];
      let cityProvinceCountry: any;
      for (cityProvinceCountry of cityProvinceCountryArray) {
        const { city, province, country } = cityProvinceCountry;
        const isCountryExistAndHasData =
          await this.countryService.findByCondition({
            name: country,
          });
        const isProvinceExistAndHasData = await this.findProvinceCountry(
          province,
          isCountryExistAndHasData.id,
        );
        if (isCountryExistAndHasData && isProvinceExistAndHasData) {
          const countryData = isCountryExistAndHasData;
          const provinceData = isProvinceExistAndHasData;
          try {
            await this.cityService.create({
              name: city,
              country_id: countryData.id,
              province_id: provinceData.id,
            });
          } catch (error) {
            console.log(error);
          }
        }
      }
    }
    return;
  }

  findProvinceCountry(province: string, countryId: number) {
    const filterCondition: FindOptionsWhere<any> = {
      name: province,
      country_id: countryId,
    };
    return this.provinceService.findByCondition(filterCondition);
  }
  findCityProvinceCountry(city: string, provinceId: number, countryId: number) {
    const filterCondition: FindOptionsWhere<any> = {
      name: city,
      province_id: provinceId,
      country_id: countryId,
    };
    return this.cityService.findByCondition(filterCondition);
  }
}

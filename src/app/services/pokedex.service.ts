import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokedexService {
  baseURL = 'https://pokeapi.co/api/v2/'


  constructor(private http: HttpClient) { }


  async getPokemonList(offset: number, limit?: number) {
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseURL}pokemon/?offset=${offset}&limit=${limit}`).subscribe(res => resolve(res), err => reject(err))
    });
  }

  async getPokemonData(key: any) {
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseURL}pokemon/${key}`).subscribe(res => resolve(res), err => reject(err))
    });
  }

  async getPokemonSpecies(key: number | string) {
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseURL}pokemon-species/${key}`).subscribe(res => resolve(res), err => reject(err))
    });
  }

  async getPokemonEvolutionChain(id: number) {
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseURL}evolution-chain/${id}`).subscribe(res => resolve(res), err => reject(err))
    });
  }

  async getMorePokemon(url: string) {
    return await new Promise((resolve, reject) => {
      this.http.get(url).subscribe(res => resolve(res), err => reject(err))
    });
  }

  async getDataTypes(idType: number | string) {
    return await new Promise((resolve, reject) => {
      this.http.get(`${this.baseURL}type/${idType}`).subscribe((res: any) => resolve(res['damage_relations']), err => reject(err))
    });
  }
}

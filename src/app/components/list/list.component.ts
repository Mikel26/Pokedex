import { Component, OnInit } from '@angular/core';
import { PokedexService } from 'src/app/services/pokedex.service';

import { ThemePalette } from '@angular/material/core';
import { ProgressSpinnerMode } from '@angular/material/progress-spinner';
import { MatDialog } from '@angular/material/dialog';
import { DetailComponent } from '../detail/detail.component';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {
  pokemons: any[] = []
  loading = true
  limit = 20
  offset = 0
  cargando = false
  nextURL = ''

  /* configuracion de spinnerLoading */
  color: ThemePalette = 'warn';
  mode: ProgressSpinnerMode = 'indeterminate';
  value = 50;

  constructor(private pokeService: PokedexService,
    public dialog: MatDialog) { }

  async ngOnInit(): Promise<void> {
    await this.getPokemonList()
  }

  async getPokemonList(limit?: number) {
    this.cargando = true
    let aux: any[] = []
    await this.pokeService.getPokemonList(this.offset, limit).then(async (resp: any) => {
      // this.nextURL = resp.next
      for await (const poke of resp.results) {
        await this.pokeService.getPokemonData(poke.name).then((resp: any) => {
          poke.img = resp.sprites.other["official-artwork"].front_default
          poke.types = resp.types
          poke.main_type = resp.types[0].type.name
          aux.push(poke)
        })
      }
      this.pokemons = this.pokemons.concat(aux)
      if (limit) {
        this.offset = limit + this.offset
      } else {
        this.offset = this.limit + this.offset
      }
      this.loading = false
      this.cargando = false
    })
  }

  openDialog(key: any) {
    this.dialog.open(DetailComponent, {
      data: key,
      width: '100vw'
    });
  }

}

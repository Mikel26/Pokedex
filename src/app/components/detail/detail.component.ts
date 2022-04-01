import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { PokedexService } from 'src/app/services/pokedex.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.css']
})
export class DetailComponent implements OnInit {
  pokemon: any = null;
  double_damage_from: any = []
  double_damage_to: any = []
  half_damage_from: any = []
  half_damage_to: any = []
  no_damage_from: any = []
  no_damage_to: any = []
  evolutions: any = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: any,
    private pokeServ: PokedexService,
    public dialogRef: MatDialogRef<DetailComponent>,
    public dialog: MatDialog
  ) { }

  ngOnInit() {
    this.pokeServ.getPokemonData(this.data.name).then((resp: any) => {
      let id = this.getId(resp.types[0].type.url)

      this.pokeServ.getDataTypes(id).then((resp: any) => {
        this.double_damage_from = resp.double_damage_from
        this.double_damage_to = resp.double_damage_to
        this.half_damage_from = resp.half_damage_from
        this.half_damage_to = resp.half_damage_to
        this.no_damage_from = resp.no_damage_from
        this.no_damage_to = resp.no_damage_to
      })

      this.pokemon = resp
      this.pokemon.main_type = resp.types[0].type.name
      this.pokemon.img = resp.sprites.other["official-artwork"].front_default
    })

    this.pokeServ.getPokemonSpecies(this.data.name).then((resp: any) => {
      let id = this.getId(resp.evolution_chain.url)

      this.pokeServ.getPokemonEvolutionChain(id).then((resp0: any) => {
        this.getEvolves(resp0.chain)

        for (const x of this.evolutions) {
          this.pokeServ.getPokemonData(x.name).then((resp: any) => {
            if (x.id == resp.id) {
              x.img = resp.sprites.other["official-artwork"].front_default
              x.main_type = resp.types[0].type.name
              x.types = resp.types
            }
          })
        }
      })
    })
  }

  getId(url: string): number {
    const splitUrl = url.split('/')
    return +splitUrl[splitUrl.length - 2];
  }

  getEvolves(chain: any) {
    this.evolutions.push({
      id: this.getId(chain.species.url),
      name: chain.species.name
    });

    if (chain.evolves_to.length) {
      if (chain.evolves_to.length == 1) {
        this.getEvolves(chain.evolves_to[0]);
      } else {
        chain.evolves_to.forEach((x: any) => {
          this.evolutions.push({
            id: this.getId(x.species.url),
            name: x.species.name
          });
        });
      }
    }
  }

  openPokemon(key: string) {
    this.dialogRef.close()

    this.dialog.open(DetailComponent, {
      data: key,
      width: '100vw'
    });
  }
}

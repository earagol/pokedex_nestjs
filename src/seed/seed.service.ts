import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Pokemon } from 'src/pokemon/entities/pokemon.entity';
import { PokeResponse } from './interfaces/poke-response.interface';
import { AxiosAdapter } from '../common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  
  
  constructor(
    @InjectModel( Pokemon.name )
    private readonly pokemonModel: Model<Pokemon>,
    private readonly http: AxiosAdapter
  ){}

  async executedSeed() {
    await this.pokemonModel.deleteMany({});
    const  data  = await this.http.get<PokeResponse>('https://pokeapi.co/api/v2/pokemon?limit=650');

    //const insertPromiseArray = [];//Se inicializa arreglo para llenarlo conn la promesa de inserción linea 31

    const pokemonToInsert: { name: string, no: number }[] = [];

    data.results.forEach(async({ name, url }) => {
      const segments = url.split('/');
      const no = +segments[ segments.length - 2 ];

      //const pokemon = await this.pokemonModel.create({ name, no });//Inserta uno a uno lo que no es optimo
      // Se llena la promesa y se ejecuta en la linea 39 todas juntas
      // insertPromiseArray.push(
      //   this.pokemonModel.create({ name, no })
      // );

      pokemonToInsert.push({ name, no });

    });
    //Ejecución de promesa
    //await Promise.all( insertPromiseArray );

    this.pokemonModel.insertMany(pokemonToInsert);

    return 'Seed executed';
  }

}

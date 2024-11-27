/**
 * Este codigo proporciona un servicio para poder compartir los datos de un proyecto generales entre componentes
 */

import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

import { Variables } from '../matriz/model/variables.model';
import { MetaProgramas } from '../matriz/model/metasProgramadas.model';
import { Seguimiento } from '../matriz/model/seguimiento.model';
import { metasAlcanzadas } from '../matriz/model/metasAlcanzadas.model';
import { Indicador } from '../matriz/model/indicador.model';
import { User } from '../matriz/model/user.model';


@Injectable({
  providedIn: 'root',
})
export class SharedDataService {
  // BehaviorSubjects para los modelos
  private userModelSource = new BehaviorSubject<User |null> (null);
  userModel$ = this.userModelSource.asObservable();

  private proyectoModelSource = new BehaviorSubject<Indicador | null>(null);
  indicadorModel$ = this.proyectoModelSource.asObservable();

  private variablesModelSource = new BehaviorSubject<Variables | null>(null);
  variablesModel$ = this.variablesModelSource.asObservable();

  private metasProgModelSource = new BehaviorSubject<MetaProgramas | null>(null);
  metasProgModel$ = this.metasProgModelSource.asObservable();

  private metasAlcanzadaModelSource = new BehaviorSubject<metasAlcanzadas | null>(null);
  metasAlcanzadasModel$ = this.metasAlcanzadaModelSource.asObservable();

  private seguimientoModelSource = new BehaviorSubject<Seguimiento | null>(null);
  seguimientoModel$ = this.seguimientoModelSource.asObservable();

  // Métodos para actualizar los datos

  setUserModel(model: User){
    this.userModelSource.next(model);
  }
  
  setProyectoModel(model: Indicador) {
    this.proyectoModelSource.next(model);
  }

  setVariablesModel(model: Variables) {
    this.variablesModelSource.next(model);
  }

  setMetasProgModel(model: MetaProgramas){
    this.metasProgModelSource.next(model);
  }

  setMetasAlcanzadasModel(model: metasAlcanzadas){
    this.metasAlcanzadaModelSource.next(model);
  }

  setSeguimientoModel(model: Seguimiento){
    this.seguimientoModelSource.next(model);
  }

}

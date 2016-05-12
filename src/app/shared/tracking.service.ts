import {Injectable} from '@angular/core';
import {Http, Response, URLSearchParams} from '@angular/http';
import {Observable, BehaviorSubject, Subject} from 'rxjs/Rx';
import {Annee, Declinaison, Groupe, Iteration, Utilisateur, Temps} from '../shared';

import {environment} from '../environment';

export interface SearchListeTemps {
    activite?: string;
    annee?: string;
    groupe?: string;
    iteration?: number;
    module?: string;
    projet?: string;
    sphere?: string;
    type?: string;
    utilisateur?: string;
  }

@Injectable()
export class TrackingService {
  private mockUrls = {
    annees      : "data/annees.json",
    groupes     : "data/groupes.json",
    utilisateurs: "data/utilisateurs.json",
    iterations  : "data/iterations_$1.json",
    listetemps  : "data/liste_temps.json"
  }

  annees: Observable<Annee[]>;
  iterations: Observable<Iteration[]>;
  groupes: Observable<Groupe[]>;
  private allUtilisateurs: Observable<Utilisateur[]>;
  utilisateurs: Observable<Utilisateur[]>;
  listeTemps: Observable<Temps[]>;

  selectedAnnee: Subject<Annee> = new BehaviorSubject<Annee>(undefined);
  selectedIteration: Subject<Iteration> = new BehaviorSubject<Iteration>(undefined);
  selectedGroupe: Subject<Groupe> = new BehaviorSubject<Groupe>(undefined);
  selectedUtilisateur: Subject<Utilisateur> = new BehaviorSubject<Utilisateur>(undefined);

  constructor(private http: Http) {
    this.annees = this.getAnnees()
                      .map((res: Response) => {
                        let listeAnnees: Annee[] = this.extractDatas(res);
                        this.selectAnnee(listeAnnees[listeAnnees.length - 1]);
                        return listeAnnees;
                      })
                      .catch(this.handleError);

    this.iterations = this.selectedAnnee
                          .flatMap(annee => this.getIterations(annee))
                          .map(this.extractDatas)
                          .catch(this.handleError);

    this.groupes = this.getGroupes().map(this.extractDatas).catch(this.handleError);

    this.allUtilisateurs = this.getUtilisateurs()
                               .map(this.extractDatas)
                               .catch(this.handleError);

    this.utilisateurs = this.selectedGroupe
                            .flatMap((groupe: Groupe) => {
                              return this.allUtilisateurs.map((utilisateurs: Utilisateur[]) => {
                                return utilisateurs.filter((utilisateur: Utilisateur) => {
                                  return !groupe || utilisateur.groupe.id === groupe.id;
                                });
                              });
                            })
            .catch(this.handleError);

    /** FIXME 
     * http://stackoverflow.com/questions/32812661/rxjs-combinelatest-how-to-get-emit-after-just-one-value-changes
     * http://stackoverflow.com/questions/32330576/rxjs-scan-and-combinelatest-behavior
     */
    this.listeTemps = Observable.combineLatest(this.selectedAnnee, 
                                               this.selectedGroupe, 
                                               this.selectedIteration, 
                                               this.selectedUtilisateur, 
                                               (annee, groupe, ite, utilisateur ) => {
                                                 let search: SearchListeTemps;
                                                 search.annee = annee.label;
                                                 search.groupe = groupe.label;
                                                 search.iteration = ite.iteration;
                                                 search.utilisateur = utilisateur.code;
                                                 return search;
                                               })
                                               .flatMap(search => this.getListeTemps(search))
                                               .map(this.extractDatas)
                                               .catch(this.handleError);
  }

  selectAnnee(annee: Annee): void {
    this.selectedAnnee.next(annee);
    this.selectIteration(undefined);
  }

  selectIteration(iteration: Iteration): void { this.selectedIteration.next(iteration); }

  selectGroupe(groupe: Groupe): void { 
    this.selectedGroupe.next(groupe); 
  }

  selectUtilisateur(utilisateur: Utilisateur): void { 
    this.selectedUtilisateur.next(utilisateur); 
  }
  
  //////////////////////////////////////////////////////

  private extract(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body.data || body;
  }

  private extractDatas = (res: Response) => {
    if (!res) {
      return [];
    }
    return this.extract(res) || [];
  };

  private extractData = (res: Response) => { return this.extract(res) || {}; };

  private handleError(error: any) {
    let errMsg = error.message || 'Server error';
    console.error(errMsg);
    return Observable.throw(errMsg);
  }
  
  //
  private getAnnees(): Observable<Response> {
    if (environment.mockBackend) {
      return this.http.get(this.mockUrls.annees);
    }
    return this.http.get(environment.backendUrl + "/annees");
  }
  private getUtilisateurs(): Observable<Response> {
    if (environment.mockBackend) {
      return this.http.get(this.mockUrls.utilisateurs);
    }
    return this.http.get(environment.backendUrl + "/utilisateurs");
  }
  private getGroupes(): Observable<Response> {
    if (environment.mockBackend) {
      return this.http.get(this.mockUrls.groupes);
    }
    return this.http.get(environment.backendUrl + "/groupes");
  }
  private getIterations(annee: Annee): Observable<Response> {
    if (annee) {
      if (environment.mockBackend) {
        let url = this.mockUrls.iterations.replace("$1", annee.label);
        return this.http.get(url);
      } else {
        let params = new URLSearchParams();
        params.append('annee', annee.label );
        return this.http.get(environment.backendUrl + '/iterations', {search: params});
      }
    } else {
      return Observable.empty<Response>();
    }
  }
  
  private getListeTemps(searchParams: SearchListeTemps): Observable<Response> {
    if (environment.mockBackend) {
      return this.http.get(this.mockUrls.listetemps);
    }
    let params: URLSearchParams;
    if (searchParams) {
      params = new URLSearchParams(JSON.stringify(searchParams));
    }    
    return this.http.get(environment.backendUrl + '/iterations', {search: params});
  }
}

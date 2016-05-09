import {Injectable} from '@angular/core';
import {Http, Response} from '@angular/http';
import {Observable, BehaviorSubject, Subject} from 'rxjs/Rx';
import {Annee, Declinaison, Groupe, Iteration, Utilisateur} from '../shared';

@Injectable()
export class TrackingService {
  private _anneesUrl = "data/annees.json";
  private _groupesUrl = "data/groupes.json";
  private _utilisateursUrl = "data/utilisateurs.json";

  annees: Observable<Annee[]>;
  iterations: Observable<Iteration[]>;
  groupes: Observable<Groupe[]>;
  private allUtilisateurs: Observable<Utilisateur[]>;
  utilisateurs: Observable<Utilisateur[]>;

  selectedAnnee: Subject<Annee> = new BehaviorSubject<Annee>(undefined);
  selectedIteration: Subject<Iteration> = new BehaviorSubject<Iteration>(undefined);
  selectedGroupe: Subject<Groupe> = new BehaviorSubject<Groupe>(undefined);
  selectedUtilisateur: Subject<Utilisateur> = new BehaviorSubject<Utilisateur>(undefined);

  constructor(private http: Http) {
    this.annees = this.http.get(this._anneesUrl)
                      .map((res: Response) => {
                        let listeAnnees: Annee[] = this.extractDatas(res);
                        this.selectAnnee(listeAnnees[listeAnnees.length - 1]);
                        return listeAnnees;
                      })
                      .catch(this.handleError);
    this.iterations = this.selectedAnnee.flatMap(annee => {
                                          if (annee) {
                                            let url = "data/iterations_" + annee.label + ".json";
                                            return this.http.get(url);
                                          } else {
                                            return Observable.empty();
                                          }
                                        })
                          .map(this.extractDatas)
                          .catch(this.handleError);

    this.groupes = this.http.get(this._groupesUrl).map(this.extractDatas).catch(this.handleError);

    this.allUtilisateurs =
        this.http.get(this._utilisateursUrl).map(this.extractDatas).catch(this.handleError);

    this.utilisateurs =
        this.selectedGroupe.flatMap((groupe: Groupe) => {
                             return this.allUtilisateurs.map((utilisateurs: Utilisateur[]) => {
                               return utilisateurs.filter((utilisateur: Utilisateur) => {
                                 return !groupe || utilisateur.groupe.id === groupe.id;
                               });
                             });
                           })
            .catch(this.handleError);
  }

  selectAnnee(annee: Annee): void {
    this.selectedAnnee.next(annee);
    this.selectIteration(undefined);
  }

  selectIteration(iteration: Iteration): void { this.selectedIteration.next(iteration); }

  selectGroupe(groupe: Groupe): void { this.selectedGroupe.next(groupe); }

  //////////////////////////////////////////////////////

  private extract(res: Response) {
    if (res.status < 200 || res.status >= 300) {
      throw new Error('Bad response status: ' + res.status);
    }
    let body = res.json();
    return body.data;
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
}

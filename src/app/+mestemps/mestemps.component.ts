import {Component, OnInit} from '@angular/core';
import {Control} from '@angular/common';
import {TrackingService, Annee, Iteration, Groupe, Utilisateur, Temps} from '../shared'

@Component({
  moduleId: module.id, selector: 'app-mestemps', templateUrl: 'mestemps.component.html',
  styleUrls: ['mestemps.component.css']
})
export class MestempsComponent implements OnInit {
  constructor(private _trackingService: TrackingService) { }


  public annees: Annee[];
  public iterations: Iteration[];
  public groupes: Groupe[];
  public utilisateurs: Utilisateur[];
  public listeTemps: Temps[];

  public selectedAnnee: Annee;
  public selectedIteration: Iteration;
  public selectedGroupe: Groupe;

  public selectedAnneeControl: Control = new Control('');
  public selectedIterationControl: Control = new Control('');
  public selectedGroupeControl: Control = new Control('');
  public selectedUtilisateurControl: Control = new Control('');

  private errorMessage: string;
  private errorHandler = (error) => this.errorMessage = <any>error;

  ngOnInit() {
    this.getAnnes();
    this.getIterations();
    this.getGroupes();
    this.getUtilisateur();

    this.getSelectedAnnee();
    this.getSelectedIteration();
    this.getSelectedGroupe();

    // Subscribe controls
    this.selectedAnneeControl.valueChanges.subscribe(
      annee => this._trackingService.selectAnnee(annee),
      this.errorHandler);
    this.selectedIterationControl.valueChanges.subscribe(
      iteration => this._trackingService.selectIteration(iteration),
      this.errorHandler);
    this.selectedGroupeControl.valueChanges.subscribe(
      groupe => this._trackingService.selectGroupe(groupe),
      this.errorHandler);
    this.selectedUtilisateurControl.valueChanges.subscribe(
      utilisateur => this._trackingService.selectUtilisateur(utilisateur),
      this.errorHandler);
  }

  getAnnes() {
    this._trackingService.annees.subscribe(annees => this.annees = annees, this.errorHandler);
  }

  getIterations() {
    this._trackingService.iterations.subscribe(iterations => this.iterations = iterations,
      this.errorHandler);
  }

  getGroupes() {
    this._trackingService.groupes.subscribe(groupes => this.groupes = groupes, this.errorHandler);
  }

  getUtilisateur() {
    this._trackingService.utilisateurs.subscribe(utilisateurs => this.utilisateurs = utilisateurs,
      this.errorHandler);
  }
  
  getListeTemps() {
    this._trackingService.listeTemps.subscribe(
      temps => this.listeTemps = temps,
      this.errorHandler
    );
  }

  getSelectedAnnee() {
    this._trackingService.selectedAnnee.subscribe(
      annee => this.selectedAnnee = annee,
      this.errorHandler);
  }

  getSelectedIteration() {
    this._trackingService.selectedIteration.subscribe(
      iteration => this.selectedIteration = iteration,
      this.errorHandler);
  }

  getSelectedGroupe() {
    this._trackingService.selectedGroupe.subscribe(
      groupe => this.selectedGroupe = groupe,
      this.errorHandler);
  }
}

import {Groupe} from './groupe.model';

export class Utilisateur {
  id: string;
  code: string;
  label: string;
  groupe: Groupe;
  visible: boolean;
}

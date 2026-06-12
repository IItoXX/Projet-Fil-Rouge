import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { LigneCommande } from './ligne-commande.entity';
import { StatutCommande } from './statut-commande.enum';
import { colonneNombre } from './colonne-nombre';

@Entity('commandes')
export class Commande
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    clientId: string;

    @Column({ type: 'enum', enum: StatutCommande, default: StatutCommande.VALIDEE })
    statut: StatutCommande;

    @Column({ type: 'numeric', precision: 10, scale: 2, transformer: colonneNombre })
    total: number;

    @OneToMany(() => LigneCommande, (ligne) => ligne.commande, { cascade: true, eager: true })
    lignes: LigneCommande[];

    @CreateDateColumn()
    creeLe: Date;
}
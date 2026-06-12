import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Commande } from './commande.entity';
import { colonneNombre } from './colonne-nombre';

@Entity('lignes_commande')
export class LigneCommande
{
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    produitId: string;

    @Column()
    magasinId: string;

    @Column({ type: 'int' })
    quantite: number;

    @Column({ type: 'numeric', precision: 10, scale: 2, transformer: colonneNombre })
    prixUnitaire: number;

    @ManyToOne(() => Commande, (commande) => commande.lignes, { onDelete: 'CASCADE' })
    commande: Commande;
}